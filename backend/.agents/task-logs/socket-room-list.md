# Task Log: Socket.IO 視訊電話房間列表與即時通知 (GatewayModule)

- **Date**: 2026-08-27
- **Track**: Track A (新功能) & Track C (Bug 排除與容錯強化)
- **Status**: COMPLETED & FULLY_VERIFIED
- **Specification Document**: `socket-api-room-list.md`

## 1. 需求分析與問題定位
- 依據 `socket-api-room-list.md` 第 8 節描述：
  - 目前前端 `webrtc-signaling` 事件原先採用前端自行過濾 `roomId`。
  - 規格建議在實作房間列表時，前端 `useSignaling.ts` 需在 `joinRoom` / `leaveRoom` 時額外 emit `room:join` / `room:leave`。
- **症狀分析**：前端使用者在 UI 上點擊加入房間後（UI 顯示已在房間），但 `room:list` 依然 returned 0 rooms。
- **Root Cause**：
  1. 前端專案 `src/domain/broadcastVideo/hooks/useSignaling.ts` 的 `joinRoom` 僅在 Pinia store 註冊本地回呼，從未向後端發送 `room:join`。
  2. 後端若收到信令 (`webrtc-signaling`)，原先僅轉發而未補足加入房間邏輯。
  3. 後端原先限制 `payload` 必須為物件 `{ roomId: string }`，若客戶端傳送純字串會被防禦性忽略。

## 2. 後端修復與加固清單
- `src/modules/gateway/signaling.gateway.ts`:
  - 支援字串與物件相容提取房間代碼：`roomId`、`room`、`id` 或純字串。
  - 新增事件別名支援：`@SubscribeMessage('join')` 與 `@SubscribeMessage('leave')`。
  - 連線 Handshake 容錯：支援 `query.roomId`、`query.room`、`auth.roomId`、`auth.room`。
  - 容錯機制：收到 `webrtc-signaling` 信令時，若發現該 Client 尚未於 Socket.IO 加入該房間，自動補調 `joinRoom` 並推播 `room:update`。
  - 詳盡除錯日誌：`handleRoomList` 清楚印出當前 Client 所在房間與所有活躍房間清單。

## 3. 前端配合事項
- 需在前端 `src/domain/broadcastVideo/hooks/useSignaling.ts` 中補上：
  - `joinRoom`: `wsService.emit("room:join", { roomId });`
  - `leaveRoom`: `wsService.emit("room:leave", { roomId: currentRoomId });`

## 4. 驗證結果
- 單元測試：全數 24 個 Gateway 單元測試通過，全專案 18 個套件 90 個測試全綠。
- E2E 測試：全專案 2 個 E2E 套件 13 個測試全綠。
- 編譯建置：`pnpm run build` 成功。
