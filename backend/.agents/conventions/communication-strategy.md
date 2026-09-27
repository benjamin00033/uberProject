# NestJS Real-Time & Streaming Communication Strategy Guide

本指南定義 NestJS 後端系統在選用 **HTTP REST API**、**Server-Sent Events (SSE)**、**Socket.IO (WebSocket Gateway)** 與 **Webhooks** 時的決策矩陣與架構設計規範。正確選擇傳輸方式可大幅提升系統效能、降低 Server 負擔並帶來最佳的網路頻寬利用率。

---

## 📊 1. 通訊傳輸方式決策矩陣 (Decision Matrix)

| 傳輸機制 | 方向性 (Directionality) | 協議與輸送層 | 主要優勢 | 最佳適用場景 (Best Use Cases) | 效能與資源消耗 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HTTP REST API** | 雙向 Request-Response | HTTP/1.1 or HTTP/2 | 標準化、高快取性、Stateless、無狀態管理成本 | 標準 CRUD、檔案上傳/下載、一次性查詢 | 最低 (請求結束即釋放連線) |
| **Server-Sent Events (SSE)** | **單向 (Server ➔ Client)** | HTTP/1.1 or HTTP/2 (Text/Event-Stream) | 原生瀏覽器 `EventSource` 支援、自動斷線重連、原生通過防火牆/HTTP 代理、輕量級 | **LLM/AI 文字串流 (Token Streaming)**、系統通知 Feed、即時儀表板數據推播、訂單狀態追蹤、進度條推送 | **極低** (單一 HTTP 持續連線，無需 Socket 心跳開銷) |
| **Socket.IO (WebSocket)** | **雙向 (Full-Duplex)** | WebSocket / HTTP Long-Polling | 超低延遲全雙向、頻道/房間 (Rooms) 訂閱、自訂事件廣播 | **即時聊天室 (Chat)**、多人協同編輯、線上多人遊戲、即時雙向控制/遙測 | **中~高** (需維持全雙向長連線與 Socket 心跳維持) |
| **Webhooks** | 雙向 Server ➔ Server | HTTP POST Payload | 跨系統解耦、非同步通知 | 第三方金流 Webhook (Stripe/Paypal)、外部系統事件通知 | 最低 (單次非同步通知) |

---

## 🎯 2. 選型判定樹 (Decision Tree)

```text
需要即時 (Real-time) 或 Streaming 資料傳送？
  ├── 否 ➔ 使用標準 HTTP REST API (Controllers)
  └── 是 ➔ 需要雙向 (Client 與 Server 頻繁互相發送事件)？
        ├── 是 ➔ 使用 Socket.IO (WebSocket Gateways: @WebSocketGateway)
        └── 否 (僅由 Server 單向持續推播至 Client) ➔ 使用 Server-Sent Events (@Sse)
```

---

## 🏗 3. NestJS 架構與目錄放置規範 (Directory Layout)

於 DDD 領域模組中，依據傳輸類型歸類檔案結構：

```text
src/modules/<feature>/
├── controllers/
│   ├── <feature>.controller.ts      # HTTP REST Endpoints
│   └── <feature>-sse.controller.ts  # SSE Streaming Endpoints (@Sse())
├── gateways/
│   └── <feature>.gateway.ts         # Socket.IO WebSocket Gateway (@WebSocketGateway())
├── services/
│   └── <feature>.service.ts         # 核心商業邏輯 (供 Controller, SSE, Gateway 注入共用)
└── <feature>.module.ts
```

---

## ⚡ 4. 代碼實作標準 (Implementation Guidelines)

### A. Server-Sent Events (SSE) 標準實作

```typescript
import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('api/v1/notifications')
export class NotificationSseController {
  /**
   * SSE 單向即時通知推播 Endpoint
   */
  @Sse('stream')
  streamNotifications(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({
        data: { message: `Notification update #${count}`, timestamp: new Date().toISOString() },
      })),
    );
  }
}
```

### B. Socket.IO (WebSocket Gateway) 標準實作

```typescript
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  /**
   * 監聽 Client 發送之 message 事件
   */
  @SubscribeMessage('send_message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string },
  ): void {
    // 廣播至指定房間 (Room)
    this.server.to(data.roomId).emit('new_message', {
      senderId: client.id,
      content: data.content,
      timestamp: new Date(),
    });
  }
}
```
