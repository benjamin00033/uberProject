---

# NestJS Unified Data Transfer Format Standards (統一資料傳遞格式規範)

本規範定義 Enterprise NestJS 後端系統中所有 API 回應、錯誤回報、分頁元資料、列舉常數、廣播事件、時間戳記與 Token 傳輸的統一格式標準。所有 Controller、Gateway 與 Filter 產出之資料，必須嚴格遵循本規範，確保前後端契約一致性與系統可維護性。

---

## 📦 1. 統一成功回應格式 (Standardized Success Response Envelope)

所有 HTTP REST API 成功回應，必須經由全域 `TransformInterceptor` 統一包裹為以下結構：

```typescript
/**
 * 標準成功回應介面
 * @template T 實際資料型別
 */
export interface IApiResponse<T> {
  /** 操作是否成功 */
  success: true;
  /** HTTP 狀態碼 */
  statusCode: number;
  /** 人可讀之操作結果訊息 */
  message: string;
  /** 實際回傳資料 (泛型) */
  data: T;
  /** 回應元資料 */
  meta: IResponseMeta;
}

/** 回應元資料介面 */
export interface IResponseMeta {
  /** ISO 8601 格式時間戳記 */
  timestamp: string;
  /** 請求路徑 */
  path: string;
  /** API 版本號 */
  version: string;
}
```

### 成功回應 JSON 範例

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "role": "ADMIN",
    "createdAt": "2026-08-11T03:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/users/usr_a1b2c3d4",
    "version": "1.0.0"
  }
}
```

---

## 🚨 2. 統一錯誤回應格式與 Error Code 體系 (Standardized Error Response & Error Codes)

所有錯誤回應必須經由全域 `AllExceptionsFilter` 統一格式化，**禁止暴露原始 Stack Trace 至 Client**。

### 2.1 錯誤回應介面

```typescript
/**
 * 標準錯誤回應介面
 */
export interface IApiErrorResponse {
  /** 操作失敗 */
  success: false;
  /** HTTP 狀態碼 */
  statusCode: number;
  /** 系統級錯誤代碼 (供前端 i18n 與程式判斷) */
  errorCode: string;
  /** 人可讀之錯誤訊息 (可直接顯示) */
  message: string;
  /** 詳細欄位驗證錯誤 (僅 Validation Error 時提供) */
  errors?: IValidationError[];
  /** 回應元資料 */
  meta: IResponseMeta;
}

/** 單一欄位驗證錯誤 */
export interface IValidationError {
  /** 欄位名稱 */
  field: string;
  /** 驗證失敗之約束條件列表 */
  constraints: string[];
}
```

### 2.2 Error Code 命名規約 (Error Code Naming Convention)

Error Code 採用 `<DOMAIN>_<ERROR_TYPE>` 大寫底線分隔格式：

| Error Code | HTTP Status | 說明 |
| :--- | :---: | :--- |
| `AUTH_INVALID_CREDENTIALS` | 401 | 帳號或密碼錯誤 |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT Access Token 已過期 |
| `AUTH_TOKEN_INVALID` | 401 | JWT Token 格式錯誤或簽名無效 |
| `AUTH_REFRESH_TOKEN_EXPIRED` | 401 | Refresh Token 已過期 |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | 權限不足 |
| `VALIDATION_FAILED` | 400 | DTO 欄位驗證失敗 |
| `RESOURCE_NOT_FOUND` | 404 | 請求的資源不存在 |
| `RESOURCE_ALREADY_EXISTS` | 409 | 資源已存在 (重複建立) |
| `RESOURCE_CONFLICT` | 409 | 資源狀態衝突 |
| `RATE_LIMIT_EXCEEDED` | 429 | 請求頻率超出限制 |
| `INTERNAL_SERVER_ERROR` | 500 | 未預期的伺服器錯誤 |
| `DATABASE_CONNECTION_ERROR` | 503 | 資料庫連線失敗 |
| `EXTERNAL_SERVICE_ERROR` | 502 | 第三方服務呼叫失敗 |

### 2.3 錯誤回應 JSON 範例

#### 一般業務錯誤
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

#### DTO 驗證錯誤 (含欄位明細)
```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_FAILED",
  "message": "Input validation failed",
  "errors": [
    {
      "field": "email",
      "constraints": ["email must be a valid email address"]
    },
    {
      "field": "password",
      "constraints": ["password must be at least 8 characters", "password must contain uppercase and lowercase letters"]
    }
  ],
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/auth/register",
    "version": "1.0.0"
  }
}
```

---

## 📄 3. 統一分頁回應格式 (Standardized Pagination Response)

所有列表型 API 的回應必須包含 `pagination` 分頁元資料物件：

### 3.1 Offset 分頁介面 (適用於標準表格查詢)

```typescript
/** Offset 分頁元資料 */
export interface IOffsetPaginationMeta {
  /** 分頁類型標識 */
  type: 'offset';
  /** 當前頁碼 */
  currentPage: number;
  /** 每頁筆數 */
  perPage: number;
  /** 總筆數 */
  totalItems: number;
  /** 總頁數 */
  totalPages: number;
  /** 是否有下一頁 */
  hasNextPage: boolean;
  /** 是否有上一頁 */
  hasPreviousPage: boolean;
}
```

### 3.2 Cursor 分頁介面 (適用於大數據量串流/Feed)

```typescript
/** Cursor 分頁元資料 */
export interface ICursorPaginationMeta {
  /** 分頁類型標識 */
  type: 'cursor';
  /** 每頁筆數 */
  perPage: number;
  /** 下一頁游標 (為 null 表示已到最後) */
  nextCursor: string | null;
  /** 上一頁游標 (為 null 表示已在最前) */
  previousCursor: string | null;
  /** 是否有更多資料 */
  hasMore: boolean;
}
```

### 3.3 分頁成功回應介面

```typescript
/** 含分頁之列表回應 */
export interface IPaginatedResponse<T> {
  success: true;
  statusCode: 200;
  message: string;
  data: T[];
  pagination: IOffsetPaginationMeta | ICursorPaginationMeta;
  meta: IResponseMeta;
}
```

### 3.4 Offset 分頁 JSON 範例

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    { "id": "usr_001", "email": "alice@example.com", "role": "USER" },
    { "id": "usr_002", "email": "bob@example.com", "role": "ADMIN" }
  ],
  "pagination": {
    "type": "offset",
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/users?page=1&limit=10",
    "version": "1.0.0"
  }
}
```

### 3.5 Cursor 分頁 JSON 範例

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Messages retrieved successfully",
  "data": [
    { "id": "msg_100", "content": "Hello!", "createdAt": "2026-08-11T03:00:00.000Z" },
    { "id": "msg_101", "content": "Hi there!", "createdAt": "2026-08-11T03:01:00.000Z" }
  ],
  "pagination": {
    "type": "cursor",
    "perPage": 20,
    "nextCursor": "eyJpZCI6Im1zZ18xMDEifQ==",
    "previousCursor": null,
    "hasMore": true
  },
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/chat/messages?cursor=abc&limit=20",
    "version": "1.0.0"
  }
}
```

---

## 🏷 4. 全域列舉常數規範 (Global Enum Constants Convention)

### 4.1 Enum 定義規約

- **存放位置**: `src/common/enums/<domain>.enum.ts`
- **命名規則**: PascalCase 類名 + `Enum` 後綴，值為 UPPER_SNAKE_CASE 字串
- **資料庫映射**: Entity 欄位使用 TypeORM `@Column({ type: 'enum', enum: XxxEnum })` 映射

### 4.2 標準 Enum 範例

```typescript
// src/common/enums/user-role.enum.ts
/**
 * 使用者角色列舉 (對應資料庫 user.role 欄位)
 */
export enum UserRoleEnum {
  /** 超級管理員 — 擁有系統全權限 */
  SUPER_ADMIN = 'SUPER_ADMIN',
  /** 管理員 — 擁有業務管理權限 */
  ADMIN = 'ADMIN',
  /** 一般使用者 — 基本操作權限 */
  USER = 'USER',
  /** 訪客 — 僅限讀取權限 */
  GUEST = 'GUEST',
}

// src/common/enums/order-status.enum.ts
/**
 * 訂單狀態列舉 (對應資料庫 order.status 欄位)
 */
export enum OrderStatusEnum {
  /** 待處理 — 訂單已建立但尚未處理 */
  PENDING = 'PENDING',
  /** 處理中 — 訂單正在處理 */
  PROCESSING = 'PROCESSING',
  /** 已完成 — 訂單已成功完成 */
  COMPLETED = 'COMPLETED',
  /** 已取消 — 訂單已被取消 */
  CANCELLED = 'CANCELLED',
  /** 已退款 — 訂單已退款 */
  REFUNDED = 'REFUNDED',
}
```

### 4.3 Enum 使用規約

| 規約 | 說明 |
| :--- | :--- |
| **禁止硬編碼 Magic String** | 所有狀態、角色等分類值必須定義為 Enum，禁止在 Service/Controller 中硬編碼字串 |
| **DTO 中使用 `@IsEnum()`** | DTO 內列舉欄位必須搭配 `@IsEnum(XxxEnum)` 驗證 |
| **Entity 中使用 `type: 'enum'`** | 資料庫 Entity 列舉欄位必須使用 `@Column({ type: 'enum', enum: XxxEnum })` |
| **匯出至 Barrel File** | `src/common/enums/index.ts` 統一匯出所有 Enum |

---

## 📡 5. Server-Sent Events (SSE) 事件格式 (SSE Event Envelope)

SSE 串流事件必須遵循以下統一 `MessageEvent` 格式：

```typescript
/** SSE 事件標準格式 */
export interface ISseEvent<T> {
  /** 事件類型標識 (用於 EventSource onmessage 區分) */
  type: string;
  /** 事件資料 Payload */
  data: T;
  /** ISO 8601 時間戳記 */
  timestamp: string;
  /** 串流序號 (遞增整數，用於斷線重連時的 Last-Event-ID) */
  sequence: number;
}
```

### SSE JSON 範例

```json
{
  "type": "notification",
  "data": {
    "id": "notif_001",
    "title": "New order received",
    "body": "Order #ORD-2026-001 has been placed."
  },
  "timestamp": "2026-08-11T03:05:30.123Z",
  "sequence": 42
}
```

---

## 🔌 6. Socket.IO 事件格式 (WebSocket Event Envelope)

Socket.IO Gateway 所有廣播與回應事件必須遵循以下統一格式：

### 6.1 Server 發送至 Client 事件 (Server Emit Envelope)

```typescript
/** Socket.IO Server ➔ Client 事件格式 */
export interface IWsServerEvent<T> {
  /** 事件名稱 (如 'new_message', 'user_joined', 'typing') */
  event: string;
  /** 事件資料 Payload */
  data: T;
  /** ISO 8601 時間戳記 */
  timestamp: string;
  /** 發送者房間 ID (如有) */
  roomId?: string;
}
```

### 6.2 Client 發送至 Server 事件 (Client Emit Payload)

```typescript
/** Socket.IO Client ➔ Server 事件 Payload */
export interface IWsClientPayload<T> {
  /** 事件資料 */
  data: T;
  /** 目標房間 ID (如有) */
  roomId?: string;
  /** Client 請求追蹤 ID (用於 Ack 回呼) */
  requestId?: string;
}
```

### 6.3 Server Acknowledgment 回呼格式

```typescript
/** Socket.IO Ack 回呼格式 */
export interface IWsAckResponse<T = null> {
  /** 操作是否成功 */
  success: boolean;
  /** 錯誤代碼 (失敗時) */
  errorCode?: string;
  /** 人可讀訊息 */
  message: string;
  /** 回應資料 (成功時) */
  data?: T;
  /** ISO 8601 時間戳記 */
  timestamp: string;
}
```

### 6.4 Socket.IO 廣播範例

```json
{
  "event": "new_message",
  "data": {
    "id": "msg_202",
    "senderId": "usr_001",
    "content": "Hello everyone!",
    "senderName": "Alice"
  },
  "timestamp": "2026-08-11T03:05:30.123Z",
  "roomId": "room_general"
}
```

---

## 🕐 7. 時間戳記格式規範 (Timestamp Format Convention)

| 場景 | 格式 | 範例 | 說明 |
| :--- | :--- | :--- | :--- |
| **所有 API 回應 / Event** | ISO 8601 UTC | `2026-08-11T03:05:30.123Z` | 統一使用 UTC 時區，尾部 `Z` 標記 |
| **資料庫 Entity** | `@CreateDateColumn()` | `timestamp with time zone` | TypeORM 自動管理建立時間 |
| **資料庫 Entity** | `@UpdateDateColumn()` | `timestamp with time zone` | TypeORM 自動管理更新時間 |
| **前端顯示** | 由前端依使用者 Locale 轉換 | N/A | 後端永遠回傳 UTC |

### TypeScript 生成時間戳記標準方法

```typescript
// ✅ 正確 — 永遠使用 ISO 8601 UTC
const timestamp = new Date().toISOString();
// Output: "2026-08-11T03:05:30.123Z"

// ❌ 禁止 — 不得使用 Unix Timestamp 或自訂格式
const wrong1 = Date.now();
const wrong2 = new Date().toLocaleDateString();
```

---

## 🔑 8. Token 傳遞格式規範 (Token Transfer Convention)

### 8.1 JWT Token 結構 (Payload Claims)

```typescript
/** Access Token Payload 標準介面 */
export interface IAccessTokenPayload {
  /** Subject — 使用者唯一 ID */
  sub: string;
  /** 使用者電子郵件 */
  email: string;
  /** 使用者角色 (對應 UserRoleEnum) */
  role: string;
  /** Token 簽發時間 (Unix timestamp) */
  iat: number;
  /** Token 過期時間 (Unix timestamp) */
  exp: number;
}

/** Refresh Token Payload 標準介面 */
export interface IRefreshTokenPayload {
  /** Subject — 使用者唯一 ID */
  sub: string;
  /** Token 唯一識別碼 (用於 Revocation) */
  jti: string;
  /** Token 簽發時間 */
  iat: number;
  /** Token 過期時間 */
  exp: number;
}
```

### 8.2 Token 傳輸方式

| Token 類型 | 傳輸方式 | Cookie 參數 | 有效期 |
| :--- | :--- | :--- | :--- |
| **Access Token** | HTTP-Only Cookie (`access_token`) | `httpOnly: true, secure: true, sameSite: 'strict'` | 15 分鐘 |
| **Refresh Token** | HTTP-Only Cookie (`refresh_token`) | `httpOnly: true, secure: true, sameSite: 'strict', path: '/api/v1/auth/refresh'` | 7 天 |
| **Socket.IO Token** | Handshake `auth.token` | N/A (WebSocket 無 Cookie) | 與 Access Token 同步 |

### 8.3 Token 相關 API 回應

登入與刷新 Token 時，HTTP Body **不回傳** Token 值 (Token 由 Cookie 攜帶)，僅回傳使用者資訊：

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr_a1b2c3d4",
      "email": "user@example.com",
      "role": "ADMIN"
    }
  },
  "meta": {
    "timestamp": "2026-08-11T03:05:30.123Z",
    "path": "/api/v1/auth/login",
    "version": "1.0.0"
  }
}
```

---

## 🆔 9. 資源 ID 格式規範 (Resource ID Convention)

| 規約 | 說明 |
| :--- | :--- |
| **前綴標識** | 所有資源 ID 建議使用 `<type>_<uuid>` 格式 (如 `usr_a1b2c3d4`, `ord_x7y8z9`) |
| **UUID v4** | 使用 UUID v4 作為唯一識別碼，禁止使用自增 Integer ID (防資料洩漏) |
| **大小寫** | ID 前綴使用小寫字母與底線分隔 |

---

## 📁 10. 檔案存放位置 (File Location Map)

| 檔案 / 介面 | 建議存放路徑 |
| :--- | :--- |
| `IApiResponse`, `IApiErrorResponse`, `IResponseMeta` | `src/common/interfaces/api-response.interface.ts` |
| `IOffsetPaginationMeta`, `ICursorPaginationMeta`, `IPaginatedResponse` | `src/common/interfaces/pagination.interface.ts` |
| `IValidationError` | `src/common/interfaces/validation-error.interface.ts` |
| `ISseEvent` | `src/common/interfaces/sse-event.interface.ts` |
| `IWsServerEvent`, `IWsClientPayload`, `IWsAckResponse` | `src/common/interfaces/ws-event.interface.ts` |
| `IAccessTokenPayload`, `IRefreshTokenPayload` | `src/common/interfaces/token-payload.interface.ts` |
| `UserRoleEnum`, `OrderStatusEnum`, ... | `src/common/enums/<domain>.enum.ts` |
| `TransformInterceptor` | `src/common/interceptors/transform.interceptor.ts` |
| `AllExceptionsFilter` | `src/common/filters/all-exceptions.filter.ts` |
| `ErrorCode` 常數 | `src/common/constants/error-codes.constant.ts` |

---

## ✅ 11. 格式合規檢查清單 (Compliance Checklist)

開發新功能時，必須逐項確認以下合規條件：

- [ ] Controller 回傳經 `TransformInterceptor` 包裹之 `IApiResponse<T>` 格式
- [ ] 錯誤回應包含 `errorCode` 且對應 Error Code 表
- [ ] 列表 API 包含 `pagination` 分頁元資料 (`offset` 或 `cursor`)
- [ ] 所有時間戳記使用 ISO 8601 UTC 格式
- [ ] 狀態/角色等分類值皆定義為 Enum，禁止硬編碼 Magic String
- [ ] SSE 事件遵循 `ISseEvent<T>` 格式並包含 `sequence` 序號
- [ ] Socket.IO 廣播遵循 `IWsServerEvent<T>` 格式並包含 `timestamp`
- [ ] JWT Token 僅透過 HTTP-Only Cookie 傳輸，Response Body 不包含 Token 值
- [ ] 資源 ID 使用 `<type>_<uuid>` 前綴格式
