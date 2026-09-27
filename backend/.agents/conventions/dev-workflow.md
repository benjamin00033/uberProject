# NestJS Development Workflow (Agentic Pipeline SOP)

本 SOP 規範 NestJS 後端系統開發之完整 Agentic 管道 (Pipeline)。每個開發任務必須依照此步驟依序執行，不得任意跳步或憑空跳過驗證機制。

---

## 🚦 Step 0 — Leader 判斷任務類型 (Task Classification)

當收到使用者需求時，Leader 必須首先歸類任務屬性以決定續行 Track：

| 類型 | 觸發訊號 | 執行 Track |
| :--- | :--- | :--- |
| **Track A: 新功能** | 「新增 API」「想做 X 模組」「加上 X 服務」「需求是 X」 | **Track A** |
| **Track B: 需求變更**| 「修改 API」「將 X 的邏輯改為 Y」「換 ORM」「升/降級 DB」「擴充 DTO 欄位」「優化 X 效能」 | **Track B** |
| **Track C: Bug 除錯** | 「X Endpoint 拋出 500」「X 邏輯報錯」「驗證沒通過」「回傳資料格式錯」「SQL 語法錯」 | **Track C** |

---

## 🔄 流程總覽圖 (Pipeline Flowchart)

```text
                     Step 0：任務類型判斷
                                │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
     Track A               Track B               Track C
   (新功能開發)          (既有需求變更)           (Bug 排除)
         │                     │                     │
   1. 使用者需求         1. 使用者變更描述     1. Bug 症狀回報
   2. 需求/Prisma/       2. 變更與 MariaDB 5.5  2. Bug 診斷與定位 (Root Cause)
      MariaDB 5.5 分析      相容性分析
   3. Provider/Repository 3. 重構為 Prisma/      3. 修復 Root Cause+單元測試
      與單元測試            Provider+迴歸測試
   3.5 NestJS 規範+格式  3.5 NestJS 規範+格式  3.5 NestJS 規範+格式
   4. Code/DB/格式 Review 4. Code/DB/格式 Review 4. Code/DB/格式 Review
   5. E2E 驗收測試       5. E2E 驗收測試       5. Regression E2E 測試
   6. 寫入日誌報告       6. 寫入日誌報告       6. 寫入日誌報告
   7. 使用者驗收+Commit  7. 使用者驗收+Commit  7. 使用者驗收+Commit
         │                     │                     │
         └─────────────────────┴─────────────────────┘
```

---

## 🛤 Track A / B — 功能開發與架構變更流程 (Feature & Migration Development)

### Step 1 — 使用者提供需求與 ORM/DB 描述
使用者描述功能或 ORM/DB 變更需求 (例如：使用 Prisma ORM，連線至 MariaDB v5.5.67，並支援 Provider/Repository 擴充)。

### Step 2 — 呼叫 Skill: `needs-analysis` 與 `communication-evaluator`
1. **通訊與傳輸評估**: 呼叫 **Skill: `communication-evaluator`** (HTTP REST vs SSE vs Socket.IO).
2. **Prisma & MariaDB 5.5.67 相容性分析**:
   - 檢視 MariaDB 5.5.67 方言限制 (例如: `DateTime` 欄位需標記無微秒精度 `@db.DateTime(0)`，`provider = "mysql"`)。
   - 確定資料庫 Provider / Repository 介面抽象與 Custom Provider 注入結構 (`IUserRepository` ➔ `PrismaUsersRepository`)。
3. **資料格式規劃**: 依據 [data-format-standards.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md) 預先確認 Response Envelope、Error Code、分頁類型 (Offset vs Cursor)、Enum 定義與事件格式需求。
4. **產出 Task Brief / Change Request**: 依據 [`templates/task.md`](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/templates/task.md) 寫入 `planning/tasks.md`。
5. **記錄日誌**: 呼叫 `log-manager` 記錄進度。

### Step 3 — 呼叫 Skill: `dev-cycle` 與對應模組/資安 Plugins
1. **Prisma Schema & Provider Repository 抽象建置**:
   - 設定 `prisma/schema.prisma` (`provider = "mysql"`, MariaDB 5.5.67 `@db.DateTime(0)` 欄位與 `@@index` 宣告)。
   - 在 `src/shared/prisma` 建立 `PrismaService` 與 `PrismaModule`。
   - 在業務模組 `src/modules/<domain>` 定義 Repository 介面 (如 `IUserRepository`) 與 Prisma 實作 (`PrismaUsersRepository`)，並於 `XxxModule` 使用 `{ provide: 'IUserRepository', useClass: PrismaUsersRepository }` 進行 Provider 擴充與解耦。
2. **DTO 驗證器生成**: 調用 **Plugin: `dto-validator-generator`**。Enum 欄位搭配 `@IsEnum(XxxEnum)` 裝飾器。
3. **身分認證與 HTTPOnly Cookie 建置**: 若包含登入與權限控管，調用 **Plugin: `auth-security-builder`** 生成 `AuthController`, `JwtCookieStrategy` 與 `JwtAuthGuard`。
4. **加解密與 Hash 服務**: 調用 **Plugin: `crypto-vault-builder`** 於 `src/shared/crypto` 產出解耦且支援 Debug Mock 模式之 `CryptoService`。
5. **資料庫搜尋與排序優化**: 調用 **Plugin: `db-query-optimizer`** 生成高存取效率之 `PaginationQueryDto`。
6. **統一資料格式基礎建設**: 確保以下元件已建立或更新：
   - `src/common/interfaces/api-response.interface.ts` — `IApiResponse<T>`, `IApiErrorResponse`, `IResponseMeta`
   - `src/common/interfaces/token-payload.interface.ts` — `IAccessTokenPayload`, `IRefreshTokenPayload`
   - `src/common/constants/error-codes.constant.ts` — 集中管理 Error Code 常數
   - `src/common/enums/<domain>.enum.ts` — 業務領域列舉常數
   - `src/common/interceptors/transform.interceptor.ts` — 成功回應統一包裹
   - `src/common/filters/all-exceptions.filter.ts` — 錯誤回應統一格式化
7. **單元測試同步進行**: 每個 Service/Repository/Crypto 同一輪完成單元測試 (`*.spec.ts`)。

### Step 3.5 — 呼叫 Skill: `nestjs-standardize`
1. Controller 輕量化、HTTPOnly Cookie 安全、Crypto 解耦與 DEBUG Mock 支援。
2. **Prisma & MariaDB 5.5.67 相容性檢查**:
   - `schema.prisma` 是否使用 `provider = "mysql"`？
   - `DateTime` 欄位是否無微秒語法衝突？
   - 是否採用 Repository Provider 抽象介面實作？
3. **統一資料傳遞格式合規檢查** (Data Format Compliance)：
   - 成功回應是否經 `TransformInterceptor` 包裹為 `IApiResponse<T>` 格式？
   - 錯誤回應是否包含 `errorCode` 且遵循 `<DOMAIN>_<ERROR_TYPE>` 命名？
   - 時間戳記是否全為 ISO 8601 UTC？
   - Token 是否僅透過 HTTP-Only Cookie 傳輸？
4. JSDoc 語意化註解與 DRY 原則。

### Step 4 — 呼叫 Subagent: `code-reviewer` 與 `database-optimizer`
- **`code-reviewer` Subagent**: 進行 DDD 模組邊界、Provider/Repository 抽象、Passport JWT Cookie 抽離、OWASP 資安審查。
- **`database-optimizer` Subagent**: 進行 DB 搜尋與 Sorting 演算法審查，確認無全表掃描及未索引 `ORDER BY`。

### Step 5 — 呼叫 Subagent: `spec-tester` (需先詢問使用者)
- **詢問使用者**: 「是否需要進行 E2E 整合與驗收測試？」
- **獲得同意後執行**: 撰寫 `test/<feature>.e2e-spec.ts` 測試真實 HTTP 響應與 Cookie 寫入。

### Step 6 & 7 — 彙整日誌與 Git Commit/Push
- 呼叫 `log-manager` 整理產出，依據 [commit-message-format.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/commit-message-format.md) 執行 Commit/Push。
