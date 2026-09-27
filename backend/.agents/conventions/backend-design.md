# NestJS Backend System Design & API Standards

本文件定義 Enterprise NestJS 後端系統之 REST API 設計規範、Socket.IO WebSocket 閘道設計、Server-Sent Events (SSE) 串流設計、例外處理、DTO 驗證、資料庫連線自動建表、權限防護與回應格式標準。

---

## 📡 1. 傳輸協定選型與實體設計 (Communication Protocols)

參照 [communication-strategy.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/communication-strategy.md) 之決策矩陣：

1. **HTTP REST API**: 採用 `Controller` 處理請求，必須符合 RESTful 資源導向規範。
2. **Server-Sent Events (SSE)**:
   - 使用控制器裝飾器 `@Sse('stream')`。
   - 回傳 RxJS `Observable<MessageEvent>`。
   - 事件 Payload 必須遵循 `ISseEvent<T>` 格式 (含 `type`, `data`, `timestamp`, `sequence`)。
   - 常用於 AI Token 串流推送、進度條推播與通知連線。
3. **Socket.IO (WebSocket Gateway)**:
   - 使用類別裝飾器 `@WebSocketGateway({ namespace: '/<domain>' })`。
   - 方法使用 `@SubscribeMessage('event')` 監聽。
   - 必須透過 `WsGuard` 驗證 Handshake Authorization。
   - Server 廣播必須遵循 `IWsServerEvent<T>` 格式 (含 `event`, `data`, `timestamp`, `roomId?`)。
   - Client Payload 必須遵循 `IWsClientPayload<T>` 格式 (含 `data`, `roomId?`, `requestId?`)。
   - Acknowledgment 回呼必須遵循 `IWsAckResponse<T>` 格式 (含 `success`, `errorCode?`, `message`)。

---

## 🗄 2. 資料庫連線與自動建表規範 (Auto Table Creation & Synchronization)

1. **自動同步機制 (Auto Table Creation)**:
   - 系統進行資料庫連線 (如 TypeORM / Prisma / Mongoose) 時，必須配置自動建立與同步資料表 Schema 功能 (`synchronize: true` 或啟動時自動推導/遷移)。
2. **Entity 宣告映射**:
   - `src/modules/<feature>/entities/` 中定義的 Entity 必須能被 ORM 自動掃描，連線建立後直接在 DB 中建出對應的欄位與索引。
3. **時間戳記欄位**:
   - 所有 Entity 必須使用 `@CreateDateColumn()` 與 `@UpdateDateColumn()` 自動管理時間欄位，資料庫型別為 `timestamp with time zone`。

---

## 📦 3. 統一回應格式 (Standardized Response Format)

> 完整規範請參閱 [data-format-standards.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md)

### 3.1 成功回應 (`IApiResponse<T>`)

所有 API 響應格式必須經由全域 `TransformInterceptor` 統一包裹：

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": { "id": "usr_a1b2c3d4", "email": "user@example.com", "role": "ADMIN" },
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/users/usr_a1b2c3d4",
    "version": "1.0.0"
  }
}
```

### 3.2 錯誤回應 (`IApiErrorResponse`)

錯誤由全域 `AllExceptionsFilter` 統一格式化，**禁止暴露原始 Stack Trace**：

```json
{
  "success": false,
  "statusCode": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "User with ID 'usr_999' not found",
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/users/usr_999",
    "version": "1.0.0"
  }
}
```

**Error Code 命名**: `<DOMAIN>_<ERROR_TYPE>` 大寫底線分隔 (如 `AUTH_INVALID_CREDENTIALS`, `VALIDATION_FAILED`, `RESOURCE_NOT_FOUND`)。

### 3.3 DTO 驗證錯誤 (含欄位明細)

```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_FAILED",
  "message": "Input validation failed",
  "errors": [
    { "field": "email", "constraints": ["email must be a valid email address"] },
    { "field": "password", "constraints": ["password must be at least 8 characters"] }
  ],
  "meta": { "timestamp": "2026-08-11T03:05:30.123Z", "path": "/api/v1/auth/register", "version": "1.0.0" }
}
```

### 3.4 分頁回應 (`IPaginatedResponse<T>`)

列表 API 必須攜帶 `pagination` 物件 (Offset 型或 Cursor 型)：

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [{ "id": "usr_001", "email": "alice@example.com" }],
  "pagination": {
    "type": "offset",
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "meta": { "timestamp": "2026-08-11T03:05:30.123Z", "path": "/api/v1/users?page=1&limit=10", "version": "1.0.0" }
}
```

---

## 🏷 4. Enum 列舉與常數規範 (Enum & Constants)

- **存放位置**: `src/common/enums/<domain>.enum.ts`
- **命名規則**: PascalCase 類名 + `Enum` 後綴，值為 UPPER_SNAKE_CASE 字串
- **禁止硬編碼 Magic String**: 所有狀態/角色/分類值必須定義為 Enum
- **DTO 驗證**: Enum 欄位必須搭配 `@IsEnum(XxxEnum)` 裝飾器
- **Entity 映射**: `@Column({ type: 'enum', enum: XxxEnum })` TypeORM 映射
- **Barrel 匯出**: `src/common/enums/index.ts` 統一匯出所有 Enum

---

## 🕐 5. 時間戳記規範 (Timestamp Convention)

- 所有 API Response、Event、SSE、Socket.IO 廣播中的時間欄位，統一使用 **ISO 8601 UTC** 格式 (`2026-08-11T03:05:30.123Z`)。
- **禁止**使用 Unix Timestamp (`Date.now()`) 或 `toLocaleDateString()` 等自訂格式。
- 標準生成方式: `new Date().toISOString()`

---

## 🆔 6. 資源 ID 規範 (Resource ID Convention)

- 建議使用 `<type>_<uuid>` 前綴格式 (如 `usr_a1b2c3d4`, `ord_x7y8z9`)
- 使用 UUID v4 作為唯一識別碼，禁止使用自增 Integer ID (防資料洩漏與爬取)

---

## 🔑 7. Token 傳輸規範 (Token Transfer)

- JWT 僅透過 HTTP-Only Cookie 傳輸 (`access_token`, `refresh_token`)
- Response Body **禁止**包含 Token 值
- Socket.IO 使用 Handshake `auth.token` 傳遞 Access Token
- 詳見 [auth-security-standards.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/auth-security-standards.md)

---

## 🗂 8. 統一格式檔案位置 (Format File Location Map)

| 檔案 / 介面 | 存放路徑 |
| :--- | :--- |
| `IApiResponse`, `IApiErrorResponse`, `IResponseMeta` | `src/common/interfaces/api-response.interface.ts` |
| `IOffsetPaginationMeta`, `ICursorPaginationMeta`, `IPaginatedResponse` | `src/common/interfaces/pagination.interface.ts` |
| `IValidationError` | `src/common/interfaces/validation-error.interface.ts` |
| `ISseEvent` | `src/common/interfaces/sse-event.interface.ts` |
| `IWsServerEvent`, `IWsClientPayload`, `IWsAckResponse` | `src/common/interfaces/ws-event.interface.ts` |
| `IAccessTokenPayload`, `IRefreshTokenPayload` | `src/common/interfaces/token-payload.interface.ts` |
| `ErrorCode` 常數 | `src/common/constants/error-codes.constant.ts` |
| `XxxEnum` 列舉 | `src/common/enums/<domain>.enum.ts` |
| `TransformInterceptor` | `src/common/interceptors/transform.interceptor.ts` |
| `AllExceptionsFilter` | `src/common/filters/all-exceptions.filter.ts` |
