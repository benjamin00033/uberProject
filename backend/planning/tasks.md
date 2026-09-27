# Tasks Planning

## 預算系統 (Budget Domain)「已使用金額 (usedAmount)」修改技術規格書與後端落地 v1.0.0 (Track B)

**Context** — 前端 `src/domain/budget`（`BudgetFormModal.vue`, `budget.schema.ts`, `useBudget.ts`）已升級支援手動輸入「已使用金額 (TWD)」，移除偽亂數並以真實 `usedAmount` 動態運算進度。後端依據 `.agents/plan_budget_backend_spec_doc.md` 與 `api-budget.md` 完成資料庫欄位遷移（`used_amount`）、DTO 驗證擴充、非負數與日期有效性防護、允許超支（`usedAmount > amount`）、以及全套單元與 E2E 整合驗收測試。

**Scope**
- `api-budget.md`
- `docs/api-budget.md`
- `prisma/schema.prisma`
- `src/modules/budget/dto/create-budget.dto.ts`
- `src/modules/budget/dto/update-budget.dto.ts`
- `src/modules/budget/services/budget.service.ts`
- `src/modules/budget/services/budget.service.spec.ts`
- `src/modules/budget/controllers/budget.controller.spec.ts`
- `test/budget.e2e-spec.ts`
- `.agents/dev-logs/2026-09-04.md`

**Acceptance**
- [x] 撰寫完成 enterprise 級技術規格書 `api-budget.md` 與 `docs/api-budget.md` (包含 8 大核心章節、PostgreSQL/MySQL DDL、5 大端點規格與驗收清單)
- [x] `prisma/schema.prisma` 新增 `usedAmount Float @default(0) @map("used_amount")` 並成功產生 Prisma Client
- [x] `CreateBudgetDto` 與 `UpdateBudgetDto` 新增 `usedAmount` 屬性並套用 `@IsNumber()`、`@Min(0)` 與 `@IsOptional()`
- [x] `BudgetService` 新增預算時若未提供 `usedAmount` 自動預設補 `0`
- [x] `BudgetService` 檢驗日期有效性，若 `startDate > endDate` 精確拋出 400 Bad Request
- [x] `BudgetService` 與資料庫支援超支情境（`usedAmount > amount` 順利儲存，無任何阻擋）
- [x] 所有端點回應符合統一封裝規格 (`ApiResponse<T>`)，`res_code: "111"`，DELETE 回傳 `res_body: null`
- [x] 單元測試 100% 通過 (`budget.service.spec.ts` 與 `budget.controller.spec.ts` 18 個案例全綠)
- [x] E2E 測試 100% 通過 (`test/budget.e2e-spec.ts` 13 個案例全綠)
- [x] 全專案編譯 0 錯誤 (`nest build`)

---

## 菜單營業時段 (MenuTime / Store Hours) 後端建構與實質商業勾稽 v1.0.0 (Track B)

**Context** — 前端 `src/domain/menu/pages/MenuTime.vue` 與 `TimeScheduleEditor.vue` 具備每週 7 天營業與供應時段編輯功能，預設載入 `store_hours`。後端依照 `api-menu-time.md` 規範完成時段重疊校驗、門市預設時間自動持久化、即時營業狀態查詢、以及分類/商品實體之供應約束勾稽。

**Scope**
- `src/modules/menu/utils/time-schedule.util.ts`
- `src/modules/menu/utils/time-schedule.util.spec.ts`
- `src/common/constants/error-codes.constant.ts`
- `src/modules/menu/dto/update-menu.dto.ts`
- `src/modules/menu/dto/query-menu-status.dto.ts`
- `src/modules/menu/repositories/menu.repository.interface.ts`
- `src/modules/menu/repositories/prisma-menu.repository.ts`
- `src/modules/menu/services/menu.service.ts`
- `src/modules/menu/services/menu.service.spec.ts`
- `src/modules/menu/controllers/menu.controller.ts`
- `src/modules/menu/controllers/menu.controller.spec.ts`
- `src/common/filters/all-exceptions.filter.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `test/menu-time.e2e-spec.ts`

**Acceptance**
- [x] 初次存取 `GET /api/menus/store_hours` 自動初始化週一至週日預設 09:00~21:00 並持久化儲存
- [x] `PUT /api/menus/:id` 檢測到同一天時段重疊時精確阻擋 (400 Bad Request，res_code: "4002"，含具體衝突天數與時段)
- [x] `PUT /api/menus/:id` 時段開始時間大於等於結束時間時精確阻擋 (400 Bad Request，res_code: "4001")
- [x] `PUT /api/menus/:id` 提供不存在之 `category_ids` 阻擋 (400 Bad Request，res_code: "4003")
- [x] `PUT /api/menus/:id` 正常接受公休日空時段設定 (`time_periods: []`)
- [x] `GET /api/menus/:id/status` 以 `Asia/Taipei` 時區即時推算 `is_open`、生效時段與下次狀態變更事件 (`OPEN` / `CLOSE`)
- [x] `GET /api/menus/items/:itemId/availability` 落實商品所屬分類與菜單供應約束之實質商業勾稽
- [x] 單元測試 100% 通過 (42 套件 312 測試)，E2E 測試 100% 通過 (9 套件 94 測試)，編譯 0 錯誤

---

## 可抽換前後端 API 通訊加解密架構與中介層 (Payload Crypto Module) v1.0.0 (Track B)

**Context** — 前端 `crypto.md` 已實作 `apiCrypto.ts` 與 `apiClient.ts`，採用 AES-CBC (Pkcs7 Padding)、Domain Separation (Key = `SHA256(${secretKey}:key:${ts})`，IV = `SHA256(${secretKey}:iv:${ts})[0..16]`) 與 `X-Timestamp: ts` 進行通訊加解密。後端需對齊此規範，以 `VITE_ENABLE_ENCRYPTION` / `ENABLE_PAYLOAD_ENCRYPTION` 與 `VITE_API_SECRET_KEY` / `API_SECRET_KEY` 支援通訊加解密。開發時支援明碼，Production 時為加密狀態；且加密模組具備可卸下、可抽換為其他演算法之解耦架構。

**Existing Behavior**
- 目前後端 `CryptoService` 僅提供密碼雜湊 (`hashPassword`, `verifyPassword`)，缺乏 API Payload 通訊加解密機制。
- 前端發送 `{ encryptedData: cipherText }` 時，後端未經解密即進入 `ValidationPipe`，導致 DTO 驗證失敗。
- 後端回應均為明文，無法在生產環境支援前端的回應解密通道。

**Proposed Changes**
- **Strategy 介面抽象與 Provider 註冊**:
  - 定義 `IPayloadCryptoStrategy` 介面 (`name`, `encrypt`, `decrypt`)。
  - 定義 DI Token `PAYLOAD_CRYPTO_STRATEGY_TOKEN`，支援以工廠模式動態切換策略。
- **AES-CBC 加解密策略實作 (`AesCbcPayloadCryptoStrategy`)**:
  - 基於 Node.js 核心 `crypto` 模組實作 AES-256-CBC。
  - 嚴格實作 Domain Separation Key/IV 衍生，與前端 `crypto-js` 100% 互通。
- **模組與服務封裝 (`PayloadCryptoService` & `PayloadCryptoModule`)**:
  - 支援從 `ConfigService` 讀取 `API_SECRET_KEY` / `VITE_API_SECRET_KEY`。
  - 支援讀取 `ENABLE_PAYLOAD_ENCRYPTION` / `VITE_ENABLE_ENCRYPTION` 與 `NODE_ENV=production`。
  - 提供統一且解耦的 `encryptPayload` 與 `decryptPayload` 方法。
- **Request 解密中介軟體 (`PayloadDecryptMiddleware`)**:
  - 在 NestJS ValidationPipe 與 Guards 前透明攔截 `req.body`。
  - 當請求包含 `req.body.encryptedData` 與 `req.headers['x-timestamp']` 時自動解密為原始 JSON。
  - 支援 `x-no-encryption: true`、無 Body 請求或 Multipart/FormData 之 Bypass。
  - 在 Production 或強制加密環境下，若缺少加密或解密失敗拋出 `BadRequestException`。
- **Response 加密攔截器整合 (`TransformInterceptor`)**:
  - 當通訊加密啟用時，將回應物件之 `res_body` 加密為 `{ encryptedData: cipherText }`，並注入動態 `ts` 與 `X-Timestamp` Header，使前端攔截器自動透明解密。
- **錯誤代碼擴充**:
  - `error-codes.constant.ts` 擴充 `PAYLOAD_DECRYPTION_FAILED` 與 `PAYLOAD_ENCRYPTION_REQUIRED`。
- **測試覆蓋**:
  - 策略、服務、中介軟體與攔截器單元測試全數覆蓋。
  - E2E 驗收測試驗證明文/密文切換與互通。

**Scope**
- `src/common/constants/error-codes.constant.ts`
- `src/shared/payload-crypto/interfaces/payload-crypto-strategy.interface.ts`
- `src/shared/payload-crypto/strategies/aes-cbc-payload-crypto.strategy.ts`
- `src/shared/payload-crypto/strategies/aes-cbc-payload-crypto.strategy.spec.ts`
- `src/shared/payload-crypto/services/payload-crypto.service.ts`
- `src/shared/payload-crypto/services/payload-crypto.service.spec.ts`
- `src/shared/payload-crypto/middlewares/payload-decrypt.middleware.ts`
- `src/shared/payload-crypto/middlewares/payload-decrypt.middleware.spec.ts`
- `src/shared/payload-crypto/payload-crypto.module.ts`
- `src/common/interceptors/transform.interceptor.ts`
- `src/common/interceptors/transform.interceptor.spec.ts`
- `src/app.module.ts`
- `test/payload-crypto.e2e-spec.ts`
- `.env`

**Acceptance**
- [x] AES-CBC 加解密與前端 `crypto-js` 衍生公式 (Domain Separation) 100% 互通
- [x] 開發模式 (`VITE_ENABLE_ENCRYPTION=false` / 明碼) 支援明文傳輸與自適應加密請求解密
- [x] 生產模式 (`VITE_ENABLE_ENCRYPTION=true` 或 `NODE_ENV=production`) 強制要求加密傳輸
- [x] `X-No-Encryption: true` 與無 Body / FormData 請求自動 Bypass
- [x] 解密錯誤或未加密（Production 模式）拋出對應 400 異常
- [x] Response Payload 在啟用加密時正確回傳 `{ encryptedData: cipherText }` 與 `X-Timestamp`
- [x] 加解密模組可透過 Custom Provider Token 隨時卸下或抽換為其他加密演算法
- [x] 單元測試 100% 通過 (41 套件 285 測試)，E2E 驗收測試 100% 通過 (8 套件 84 測試)，全專案零錯誤


---



**Context** — 前端 `src/domain/user` 具備多角色指派、細粒度 `Resource:Action` 權限以及直屬獨立權限管理。後端需對齊「使用者管理與細粒度權限系統 (RBAC) 後端開發技術規格書 v1.0.0」，支援多角色指派、萬用字元與階層匹配 (`*`, `user:*`, `user:read`)、直屬獨立權限、審計日誌、以及角色清單與權限字典 API。

**Existing Behavior**
- `User` 實體僅有扁平字串陣列 `roles` 與 `permissions`，無 `username` 與 `status` 欄位。
- 缺少 `Role`、`Permission`、`UserRole`、`RolePermission`、`UserPermission`、`AuditLog` 關聯模型。
- 缺少萬用字元與階層匹配演算法 `matchPermission(userPermissions, requiredPermission)`。
- 缺少 `@RequirePermissions(...)` 裝飾器與 `PermissionsGuard`。
- 缺少 `GET /api/roles` 與 `GET /api/permissions` 端點。
- `UserController` 僅有簡易 CRUD，缺乏 `search`, `role`, `status` 篩選，且所有端點皆為 `@Public()` 未受權限守衛保護。

**Proposed Changes**
- **資料庫與 Schema**:
  - `User`: `id`, `username`, `email`, `password`, `name`, `status`, `roles UserRole[]`, `permissions UserPermission[]`
  - `Role`: `id`, `name`, `description`, `isSystem`, `users UserRole[]`, `permissions RolePermission[]`
  - `Permission`: `code`, `name`, `resource`, `action`, `description`
  - `UserRole`, `RolePermission`, `UserPermission`, `AuditLog`
- **權限與比對邏輯**:
  - `matchPermission(userPermissions, requiredPermission)` 核心比對函式（支援 `*`、`resource:*` 與完全匹配）。
  - `@RequirePermissions(...permissions)` 自訂中繼資料裝飾器。
  - `PermissionsGuard`: 結合 `Reflector` 與使用者權限清單進行放行驗證。
- **DTO**:
  - `CreateUserDto`: `username`, `name`, `email`, `password`, `roles`, `permissions?`, `status?`
  - `UpdateUserDto`: `name?`, `email?`, `password?`, `roles?`, `permissions?`, `status?`
  - `QueryUserDto`: `search?`, `role?`, `status?`, `page?`, `limit?`
- **Repository 抽象 (`IUserRepository` & `PrismaUserRepository`)**:
  - 支援使用者進階查詢（包含多對多角色與權限關聯預加載與過濾）。
  - 支援使用者新增、更新（含關聯 roles 與 permissions 重新綁定）、刪除。
  - 支援角色查詢 (`findAllRoles`) 與權限字典查詢 (`findAllPermissions`)。
- **Service (`UserService`)**:
  - 實作使用者建立（重名與 Email 唯一性檢查 409，使用 `CryptoService` hash 密碼）。
  - 實作使用者更新、刪除、查詢。
  - 整合有效權限（Effective Permissions）合併計算（角色權限 + 直屬獨立權限）。
  - 角色與權限清單檢索。
- **Controller (`UserController`, `RoleController`, `PermissionController`)**:
  - `GET /api/users`: `@RequirePermissions('user:read')`，支援 `search`, `role`, `status`
  - `GET /api/users/:id`: `@RequirePermissions('user:read')`
  - `POST /api/users`: `@RequirePermissions('user:write')`
  - `PUT /api/users/:id`: `@RequirePermissions('user:write')`
  - `DELETE /api/users/:id`: `@RequirePermissions('user:delete')`
  - `GET /api/roles`: `@RequirePermissions('user:read')`
  - `GET /api/permissions`: `@RequirePermissions('user:read')`
- **測試**:
  - 單元測試全面覆蓋。
  - E2E 驗收測試。

**Scope**
- `src/common/guards/permissions.guard.ts`
- `src/common/decorators/permissions.decorator.ts`
- `src/common/utils/permission.util.ts`
- `src/modules/user/dto/create-user.dto.ts`
- `src/modules/user/dto/update-user.dto.ts`
- `src/modules/user/dto/query-user.dto.ts`
- `src/modules/user/repositories/user.repository.interface.ts`
- `src/modules/user/repositories/prisma-user.repository.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/user/controllers/user.controller.ts`
- `src/modules/user/controllers/role.controller.ts`
- `src/modules/user/controllers/permission.controller.ts`
- `src/modules/user/user.module.ts`
- `src/modules/user/services/user.service.spec.ts`
- `src/modules/user/controllers/user.controller.spec.ts`
- `prisma/schema.prisma`

**Acceptance**
- [ ] `GET /api/users` 支援 `search`, `role`, `status` 篩選並回傳含 `roles` 與 `permissions` 之使用者
- [ ] `GET /api/users/:id` 正常查詢單一使用者詳情，查無回傳 404
- [ ] `POST /api/users` 成功建立使用者，密碼經過 Hash，重複 username 或 email 回傳 409
- [ ] `PUT /api/users/:id` 成功更新姓名、Email、角色與直屬權限
- [ ] `DELETE /api/users/:id` 成功刪除使用者
- [ ] `GET /api/roles` 成功回傳系統角色清單與所屬權限
- [ ] `GET /api/permissions` 成功回傳所有細項權限字串清單
- [ ] `PermissionsGuard` 依據 `matchPermission` 準確阻擋未授權請求 (403)
- [ ] 單元測試 100% 通過，`pnpm run build` 編譯零錯誤

---

## 專案排程系統 (ProjectScheduler) 後端模組全面實作 v1.0.0 (Track A)

**Context** — 前端 `src/domain/projectScheduler` 具備甘特圖時間軸儀表板 (`Dashboard.vue`)、月曆全景檢視 (`CalendarView.vue`)、專案管理彈窗 (`ProjectManagerModal.vue`) 與任務指派彈窗 (`TaskModal.vue`)。後端需依照「專案排程系統 (ProjectScheduler) 後端開發技術規格書與 SQL 簡表守則 v1.0.0」建立完整 RESTful API、Prisma ERD 實體模型、多對多指派關聯、樂觀鎖並行防護、高頻查詢索引、以及人力排程衝突檢測演算法。

**Goal**
- 升級 `prisma/schema.prisma` 中的 `Project`, `ProjectMilestone`, `Member`, `Task`, `TaskAssignee`, `Holiday` 實體與關聯索引。
- 建立符合 DDD 與 Provider/Repository 抽象解耦之 `ProjectSchedulerModule`。
- 提供專案管理 API: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`。
- 提供成員管理 API: `GET /api/members`, `GET /api/members/:id`, `POST /api/members`, `PUT /api/members/:id`, `DELETE /api/members/:id`。
- 提供排程任務 API: `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id`, `PATCH /api/tasks/:id/dates` (輕量時程拖曳更新與樂觀鎖), `PATCH /api/tasks/:id/status`, `DELETE /api/tasks/:id`。
- 提供衝突檢測與國定假日 API: `GET /api/project-scheduler/conflicts`, `GET /api/calendar/holidays`。
- 所有端點符合統一資料傳遞格式 Envelope (`ApiResponse<T>`) 與全域異常攔截。

**Scope**
- `prisma/schema.prisma`
- `src/common/enums/task-status.enum.ts`
- `src/modules/project-scheduler/dto/create-project.dto.ts`
- `src/modules/project-scheduler/dto/update-project.dto.ts`
- `src/modules/project-scheduler/dto/query-project.dto.ts`
- `src/modules/project-scheduler/dto/create-member.dto.ts`
- `src/modules/project-scheduler/dto/update-member.dto.ts`
- `src/modules/project-scheduler/dto/query-member.dto.ts`
- `src/modules/project-scheduler/dto/create-task.dto.ts`
- `src/modules/project-scheduler/dto/update-task.dto.ts`
- `src/modules/project-scheduler/dto/update-task-dates.dto.ts`
- `src/modules/project-scheduler/dto/update-task-status.dto.ts`
- `src/modules/project-scheduler/dto/query-task.dto.ts`
- `src/modules/project-scheduler/dto/query-conflict.dto.ts`
- `src/modules/project-scheduler/dto/query-holiday.dto.ts`
- `src/modules/project-scheduler/interfaces/project-scheduler.interface.ts`
- `src/modules/project-scheduler/repositories/project-scheduler.repository.interface.ts`
- `src/modules/project-scheduler/repositories/prisma-project-scheduler.repository.ts`
- `src/modules/project-scheduler/services/project.service.ts`
- `src/modules/project-scheduler/services/member.service.ts`
- `src/modules/project-scheduler/services/task.service.ts`
- `src/modules/project-scheduler/services/calendar.service.ts`
- `src/modules/project-scheduler/controllers/project.controller.ts`
- `src/modules/project-scheduler/controllers/member.controller.ts`
- `src/modules/project-scheduler/controllers/task.controller.ts`
- `src/modules/project-scheduler/controllers/conflict.controller.ts`
- `src/modules/project-scheduler/controllers/calendar.controller.ts`
- `src/modules/project-scheduler/project-scheduler.module.ts`
- `src/modules/project-scheduler/services/*.spec.ts`
- `src/modules/project-scheduler/controllers/*.spec.ts`

**Acceptance**
- [x] `GET /api/projects` 支援 `search`, `startDate`, `endDate`, `page`, `pageSize` 篩選並回傳進度與里程碑
- [x] `GET /api/projects/:id` 正常查詢單一專案詳情，回傳含 `taskSummary: { total, todo, inProgress, done }`
- [x] `POST /api/projects` 成功建立專案 (201 Created)，校驗 `startDate <= endDate`
- [x] `PUT /api/projects/:id` 成功更新專案時程與里程碑
- [x] `DELETE /api/projects/:id` 成功刪除專案並級聯清除所屬任務與里程碑
- [x] `GET /api/members` 支援 `role`, `search` 篩選
- [x] `POST /api/members` 成功建立成員 (201 Created)
- [x] `GET /api/tasks` 支援 `projectId`, `memberId`, `startDate`, `endDate`, `status`, `search` 多重過濾
- [x] `POST /api/tasks` 成功建立新任務 (201 Created)，Transaction 確保多對多 `task_assignees` 原子性寫入，無效專案拋出 404
- [x] `PUT /api/tasks/:id` 成功更新完整任務資訊與成員多對多指派
- [x] `PATCH /api/tasks/:id/dates` 輕量更新開始與結束日期，且當提供之版本號不匹配時正確觸發樂觀鎖 409 Conflict
- [x] `PATCH /api/tasks/:id/status` 快速切換狀態 (`todo` | `in_progress` | `done`)
- [x] `DELETE /api/tasks/:id` 成功刪除任務並級聯清除中介表記錄
- [x] `GET /api/project-scheduler/conflicts` 精確計算並回傳指派給同一成員的時間重疊任務群組
- [x] `GET /api/calendar/holidays?year=2026` 正確回傳年度國定假日資料
- [x] 所有 API 遵循統一 Envelope 回應 (`ApiResponse<T>`) 與自訂異常轉換
- [x] 單元測試 100% 通過 (35 套件 242 測試)，`pnpm run build` 編譯零錯誤
- [x] E2E 驗收測試 100% 通過 (`test/project-scheduler.e2e-spec.ts` 17 個案例全綠)


