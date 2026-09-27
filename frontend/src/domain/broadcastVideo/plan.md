# 視訊電話開發計劃書 (WebRTC + WebSocket)

## 1. 專案背景與目標
在 `broadcastVideo` domain 下，實作一個 P2P 網路視訊電話功能。
考量到專案已經建置好完整的 `src/stores/websocket.store.ts` 與 `src/services/websocket.service.ts` (基於 Socket.IO)，我們將直接採用這個現有的 WebSocket 架構作為**信令伺服器 (Signaling Server)**。
這意味著開發完成後，P2P 視訊電話可以直接支援跨裝置、跨瀏覽器的真實連線，而不需要先透過 `BroadcastChannel` 進行單機模擬。

## 2. 核心技術
- **WebRTC (`RTCPeerConnection`)**: 處理點對點 (P2P) 的影音串流傳輸。
- **MediaDevices API (`getUserMedia`)**: 取得使用者的攝影機 (Video) 與麥克風 (Audio) 授權與硬體串流。
- **WebSocket (Socket.IO + Pinia Store)**: 透過現有的 `useWebSocketStore` 與伺服器即時連線，負責在兩端之間傳遞 SDP (Offer/Answer) 與 ICE Candidates。

## 3. 通話配對機制與操作流程 (Room ID)
為了能明確區分「誰跟誰」在通話，我們同樣採用 **Room ID (房間代碼)** 的連線方式。

### 運作邏輯：
1. **統一事件頻道**：我們將定義一個專屬的 Socket 事件（例如 `'webrtc-signaling'`），並透過 `websocket.store.ts` 註冊回呼。
2. **訊息過濾 (Room ID)**：在所有發送的信令訊息中，皆帶有 `roomId` 屬性。客戶端在收到 `'webrtc-signaling'` 事件時，只會處理與自己目前輸入的 `roomId` 相符的訊息。
*(註：若後端有實作 Socket.IO 的 `socket.join(roomId)` 機制，則可以改為直接向該 Room 廣播，前端邏輯會更加簡潔。本計畫先以前端自行比對 `roomId` 為最低依賴做法。)*

### 使用者操作流程：
1. **User A (發起方) 與 User B (接收方)** 同時開啟 `/broadcastVideo` 頁面。
2. 兩人在畫面上輸入**相同的 Room ID** (例如: `room-123`)，並點擊「加入房間」。
3. 系統啟動雙方的攝影機與麥克風，顯示本地畫面。
4. **User A 點擊「撥打 (Call)」** 按鈕：
   - 系統透過 WebSocket 發送帶有 `roomId` 的 `offer` 訊息。
5. **User B 接收到來電**：
   - 系統自動接收 `offer` 並回傳 `answer` (或先跳出「是否接聽」的提示，點擊後才回傳 `answer`)。
6. 雙方交換 ICE Candidates，WebRTC P2P 連線建立，開始顯示遠端畫面。

## 4. 架構設計 (模組化)
基於專案現有的 Domain 架構，邏輯拆分如下：

- **`hooks/useSignaling.ts`**：
  作為信令層的 composable 封裝，內部引入 `useWebSocketStore` 與 `wsService`。負責統整 `'webrtc-signaling'` 事件的發送 (`emit`) 與接收 (`registerCallback`)，並過濾 `roomId`。
- **`hooks/useWebRTC.ts`** (或 `hooks/useVideoCall.ts`)：
  封裝 `RTCPeerConnection` 的核心連線邏輯、本地媒體串流取得，並呼叫 `useSignaling` 處理信令交換。
- **`pages/BroadcastVideo.vue`**：
  UI 介面，包含「Room ID 輸入框」、本地畫面 (`<video autoplay muted>`)、遠端畫面 (`<video autoplay>`)，以及「加入房間」、「撥打」、「接聽」、「掛斷」等互動按鈕。

## 5. 實作步驟

### 階段一：媒體存取與 UI 基礎
- [ ] 在 `BroadcastVideo.vue` 建立 Room ID 輸入區塊與 Video 影片區塊。
- [ ] 實作 `navigator.mediaDevices.getUserMedia` 取得本地媒體，並綁定至本地 `<video>`。

### 階段二：Signaling 信令層 (整合 WebSocket Store)
- [ ] 建立 `useSignaling.ts` composable。
- [ ] 引入 `useWebSocketStore()` 並實作 `joinRoom(roomId)`，透過 `registerCallback('webrtc-signaling', 'webrtc-key', callback)` 開始監聽。
- [ ] 實作 `sendMessage` 方法，底層呼叫 `wsService.emit('webrtc-signaling', { roomId, type, payload })`。

### 階段三：WebRTC 連線邏輯 (P2P)
- [ ] 初始化 `RTCPeerConnection`，設定公開的 STUN servers (如 `stun:stun.l.google.com:19302`)。
- [ ] 監聽 `onicecandidate` 事件，收集到網路候選位置時，透過 `useSignaling` 傳送 `candidate`。
- [ ] 監聽 `ontrack` 事件，將接收到的遠端 `MediaStream` 綁定至遠端 `<video>` 標籤。
- [ ] **發起通話流程**：建立 Offer -> `setLocalDescription` -> 傳送 Offer。
- [ ] **接聽通話流程**：接收 Offer -> `setRemoteDescription` -> 建立 Answer -> `setLocalDescription` -> 傳送 Answer。
- [ ] **接收 Answer 流程**：`setRemoteDescription`。

### 階段四：狀態管理與通話控制
- [ ] 建立並維護通話狀態 (`idle`, `joined`, `calling`, `receiving`, `connected`)。
- [ ] 實作掛斷邏輯：關閉 `PeerConnection`、停止 `MediaTracks`、通知遠端掛斷，並透過 `unregisterCallback` 清除監聽。

## 6. 未來展望 (Next Steps)
1. **整合後端 Room 機制**：與後端配合，實作 Socket.IO 伺服器端的 `join(room)` 與 `to(room).emit`，降低前端收到無關訊息的頻率。
2. **多對多通話**：藉由 Mesh 網路或 SFU 伺服器，擴展為多人視訊會議。
3. **媒體控制**：加入音訊靜音 (Mute) 與視訊關閉 (Disable Video) 的控制按鈕。
