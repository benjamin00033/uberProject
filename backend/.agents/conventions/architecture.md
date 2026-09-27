# Enterprise NestJS DDD Architecture Conventions

本文件定義 Enterprise NestJS 專案的大規模與高維護性架構規範。專案架構基於 **Domain-Driven Design (DDD)** 與 **職責分離 (Separation of Concerns)** 原則設計，徹底解決軟體演化過程中的耦合問題與維護痛點。

---

## 📁 全域目錄結構 (Global Directory Map)

```text
src/
├── common/             # 框架級通用元件 (純工具，無特定商業邏輯)
│   ├── constants/      # 全域靜態常數與設定 Key
│   │   └── error-codes.constant.ts  # Error Code 集中管理 (AUTH_*, VALIDATION_*, RESOURCE_*)
│   ├── decorators/     # 自訂 NestJS 裝飾器 (如 @CurrentUser(), @Roles())
│   ├── dto/            # 跨模組通用 DTO (如 PaginationQueryDto)
│   ├── enums/          # 全域 Enums — PascalCase + Enum 後綴, UPPER_SNAKE_CASE 值
│   │   ├── user-role.enum.ts        # 使用者角色列舉
│   │   ├── order-status.enum.ts     # 訂單狀態列舉
│   │   └── index.ts                 # Barrel 匯出
│   ├── filters/        # 全域 Exception Filters (如 AllExceptionsFilter → IApiErrorResponse)
│   ├── guards/         # 認證與授權 Guards (如 JwtAuthGuard, RolesGuard)
│   ├── interceptors/   # 全域 Interceptors (如 TransformInterceptor → IApiResponse<T>)
│   ├── interfaces/     # ★ 統一資料傳遞格式介面 (詳見 data-format-standards.md)
│   │   ├── api-response.interface.ts    # IApiResponse<T>, IApiErrorResponse, IResponseMeta
│   │   ├── pagination.interface.ts      # IOffsetPaginationMeta, ICursorPaginationMeta, IPaginatedResponse<T>
│   │   ├── validation-error.interface.ts# IValidationError
│   │   ├── sse-event.interface.ts       # ISseEvent<T>
│   │   ├── ws-event.interface.ts        # IWsServerEvent<T>, IWsClientPayload<T>, IWsAckResponse<T>
│   │   └── token-payload.interface.ts   # IAccessTokenPayload, IRefreshTokenPayload
│   ├── middleware/     # Express/Fastify 中間件 (如 LoggerMiddleware)
│   └── pipes/          # 全域驗證與轉換 Pipes (如 ValidationPipe, ParseObjectIdPipe)
│
├── config/             # 環境變數載入與 Zod/Joi Schema 強型別驗證
│   ├── env.schema.ts   # 環境變數 Schema 驗證檔
│   └── app.config.ts   # 強型別 Config 導出物件
│
├── core/               # 應用程式底層基礎設施 (AppModule 載入一次)
│   ├── exceptions/     # 專案自訂 HTTP 異常類別 (如 UserNotFoundException)
│   └── logger/         # 自訂 Logger 實作 (如 WinstonLoggerService / PinoLoggerService)
│
├── database/           # 資料庫 ORM/ODM 抽象層 (含自動建立表 Auto Table Creation 機制)
│   ├── migrations/     # Schema 遷移腳本
│   └── seeds/          # 初期 / 測試資料植入腳本 (Seeder)
│
├── modules/            # ★ DDD 業務領域模組核心 (Domain-Driven Design)
│   ├── <feature-a>/    # 特徵業務模組 (例如 users, orders, chat, notifications)
│   │   ├── controllers/# HTTP REST 控制器與 SSE 串流控制器 (@Sse())
│   │   ├── gateways/   # Socket.IO WebSocket 閘道器 (@WebSocketGateway()) (依需求)
│   │   ├── services/   # 核心商業邏輯實作 (Business Rules & DB calls)
│   │   ├── dto/        # 該模組專屬的 Data Transfer Objects (Create/Update DTOs)
│   │   ├── entities/   # 該模組專屬的 Database Models / Schemas
│   │   └── <feature-a>.module.ts # NestJS @Module 定義檔
│   └── <feature-b>/
│
├── plugins/            # 第三方 SDK / API / 複雜外套件封裝層
│   ├── stripe/         # 金流支付外掛封裝 (StripePlugin)
│   ├── aws-s3/         # 雲端儲存外掛封裝 (S3Plugin)
│   └── twilio/         # 簡訊發送外掛封裝 (TwilioPlugin)
│
├── shared/             # 跨業務模組運用的 NestJS 共享實體模組 (@Module)
│   ├── mail/           # 郵件發送服務模組 (MailModule)
│   ├── redis-cache/    # 快取服務模組 (RedisCacheModule)
│   └── notification/   # 推播通知服務模組 (NotificationModule)
│
└── utils/              # 無 NestJS DI 依賴的純 JavaScript/TypeScript 數學/格式化工具函式
    ├── date-formatter.util.ts
    └── hash-password.util.ts
```

---

## 📡 傳輸協定劃分與選型 (Communication Protocols)

參照 [communication-strategy.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/communication-strategy.md)：
1. **HTTP REST API (`controllers/`)**: 標準同步 CRUD 與檔案傳輸。
2. **Server-Sent Events (`controllers/` 與 `@Sse()`)**: 單向即時串流 (AI Token, 系統通知, 進度條推送)。
3. **Socket.IO Gateway (`gateways/` 與 `@WebSocketGateway()`)**: 超低延遲全雙向互動 (即時 Chat, 房間廣播, 協同編輯)。

---

## 📐 統一資料傳遞格式 (Unified Data Format Standards)

參照 [data-format-standards.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md)：
1. **成功回應**: 經 `TransformInterceptor` 包裹為 `IApiResponse<T>` (含 `success`, `statusCode`, `message`, `data`, `meta`)。
2. **錯誤回應**: 經 `AllExceptionsFilter` 格式化為 `IApiErrorResponse` (含 `errorCode` — `<DOMAIN>_<ERROR_TYPE>` 命名)。
3. **分頁回應**: 列表 API 攜帶 `pagination` 物件 (Offset 型 / Cursor 型)。
4. **Enum 列舉**: `src/common/enums/<domain>.enum.ts`，PascalCase + `Enum` 後綴，UPPER_SNAKE_CASE 值，禁止硬編碼 Magic String。
5. **SSE 事件**: 遵循 `ISseEvent<T>` (含 `type`, `data`, `timestamp`, `sequence`)。
6. **Socket.IO 事件**: Server 廣播遵循 `IWsServerEvent<T>`，Client Payload 遵循 `IWsClientPayload<T>`，Ack 遵循 `IWsAckResponse<T>`。
7. **時間戳記**: 全系統 ISO 8601 UTC (`new Date().toISOString()`)。
8. **Token 傳輸**: HTTP-Only Cookie only，Response Body 禁含 Token 值。
9. **資源 ID**: `<type>_<uuid>` 前綴格式 (如 `usr_a1b2c3d4`)。
