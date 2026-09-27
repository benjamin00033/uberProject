# Tasks Planning

## 使用者管理與細粒度權限系統 (User Domain & RBAC) 規格全面升級對齊 (Track B)

**Context** — 對齊「# uberMenu — 使用者與權限管理 (User Domain) 後端開發完整指南 (NestJS 10+)」規格書，完整實作與強化使用者管理、細粒度 RBAC 權限體系、字典查詢、認證防護與種子資料。

**Existing Behavior**
- `src/main.ts` 全域路由前綴為 `/api/v1`，需對齊指南規格為 `/api`。
- `CreateUserDto` 之 `email` 與 `password` 為必填，需支援選填（未填自動生成預設值）。
- `UpdateUserDto` 當前端傳入密碼為空字串 `""` 時可能觸發長度驗證錯誤；需優化 `@ValidateIf` 且 Service 不覆寫原密碼。
- `PrismaUserRepository` 之 `toDomain` 將角色權限直接展開併入 `permissions`，導致前端編輯彈窗直屬權限 checkbox 無法區分；需分離 `permissions` (僅代表 Direct Permissions) 與 `effectivePermissions`。
- 刪除操作需防止刪除 `admin` 帳號及當前登入者自身帳號。
- 缺少審計日誌 (Audit Log) 記錄使用者建立、更新與刪除。
- `/api/auth/me` 回應結構需對齊 `{ user: { id, username, name, email, roles }, permissions }` 格式。
- 缺少 `prisma/seed.ts` 種子資料腳本。

**Proposed Changes**
1. **全域配置與相容性**:
   - `src/main.ts`: 全域前綴統一設定為 `api`。
2. **DTO 強化**:
   - `CreateUserDto`: `email` 標記為 `@IsOptional()`，若未提供自動預設為 `${username}@ubermenu.com`；`password` 標記為 `@IsOptional()`，若未提供預設為 `'UberMenu2026!'`。
   - `UpdateUserDto`: 密碼欄位增加條件驗證，允許空字串傳入而不報錯；Service 端遇到空字串不更新密碼。
   - `UserResponseDto`: 時間格式統一為 `"YYYY-MM-DD HH:mm:ss"`。
3. **Repository 權限語意分離與審計日誌**:
   - `IUserRepository` / `PrismaUserRepository`:
     - `permissions` 僅返回直屬權限 (Direct Permissions)；
     - 提供 `effectivePermissions` 供身分驗證與 Token 簽發；
     - 整合 `audit_logs` 記錄使用者生命週期異動。
4. **Service & Controller 資安防護**:
   - `UserService.delete`: 禁止刪除 `admin` 系統超級管理員帳號；
   - `UserController.delete`: 禁止登入者刪除自身帳號；
   - `AuthController.getMe`: 回傳結構對齊規格書 Section 6.2。
5. **資料庫種子資料 (Seed Data)**:
   - 建立 `prisma/seed.ts`：預填 22 項權限字典、4 大系統角色 (admin, manager, staff, viewer) 及預設使用者。
   - 在 `package.json` 配置 `"prisma": { "seed": "ts-node prisma/seed.ts" }`。
6. **測試套件全面通過**:
   - 更新單元測試 (`user.controller.spec.ts`, `user.service.spec.ts`, `prisma-user.repository.spec.ts`, `auth.controller.spec.ts`)。
   - 執行並確保全套單元測試與 E2E 測試 100% 全綠通過。

**Acceptance Checklist**
- [x] 全域前綴為 `/api`，所有端點經 `TransformInterceptor` 與 `AllExceptionsFilter` 統一封裝。
- [x] `GET /api/users` 支援 search, role, status 篩選，且 `permissions` 僅返回該帳號直屬額外權限。
- [x] `GET /api/users/:id` 正常查詢單一使用者詳情，查無回傳 404。
- [x] `POST /api/users` 支援選填 email 與 password，帳號重複時回傳 409。
- [x] `PUT /api/users/:id` 密碼留空或為空字串時不覆寫原密碼。
- [x] `DELETE /api/users/:id` 阻擋刪除 admin 帳號與當前登入者自身帳號。
- [x] `GET /api/roles` 回傳系統角色清單及其預設權限。
- [x] `GET /api/permissions` 回傳所有 22 項細項權限字典清單。
- [x] `POST /api/auth/login` 與 `GET /api/auth/me` 回傳結構符合規格書。
- [x] 建立 `prisma/seed.ts` 且可順利執行。
- [x] 單元測試與 E2E 測試 100% 通過。

---

## 真實 Email 發送與忘記密碼/密碼重設重構計畫 (Track B)

**Context** — 對齊 `.agents/conventions/dev-workflow.md` 與 `.agents/conventions/email-password-reset-workflow.md` 規範，將 `src/modules/auth/services/auth.service.ts` 中的 `forgotPassword` 假實作重構成具備生產環境投遞能力、高安全性、Provider 介面解耦的正式發送 Email 與忘記密碼重設機制。

**Existing Behavior**
- `forgotPassword` 產生固定字串 `"123456"` 並在 Map 中明文存儲，未整合真實 Email 發送服務。
- 若 `email === 'notfound@example.com'` 會主動拋出 `NotFoundException`，存在帳號列舉攻擊 (User Enumeration) 資安漏洞。
- 缺少防爆破 (Brute Force) 嘗試上限控制與寄件冷卻 (Rate Limit) 時間。
- OTP 校驗未採用 `crypto.timingSafeEqual` 比對，缺乏時序攻擊防禦。

**Proposed Changes**
1. **依賴套件與環境變數 (.env) 配置**:
   - 安裝 `nodemailer` 與 `@types/nodemailer`。
   - 在 `.env` 配置 `MAIL_PROVIDER` (smtp|mock), `MAIL_DEBUG_MOCK`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, `FRONTEND_RESET_PASSWORD_URL`。
2. **MailService 與 Provider 解耦架構 (DDD Shared Module)**:
   - 在 `src/shared/mail` 建立:
     - `interfaces/mail-provider.interface.ts`: 定義 `IMailProvider`, `SendMailOptions` 與 `MAIL_PROVIDER_TOKEN`
     - `providers/smtp-mail.provider.ts`: Nodemailer SMTP 實作
     - `providers/mock-mail.provider.ts`: 除錯/測試用 Mock 實作
     - `templates/password-reset.template.ts`: RWD HTML 郵件模板 (Inlined CSS)
     - `services/mail.service.ts`: 組合模板並觸發寄件
     - `mail.module.ts`: 動態切換 Factory Provider
3. **AuthService 密碼重設業務邏輯升級**:
   - `forgotPassword(dto)`:
     - 靜默處理查無用戶 (防帳號列舉探測)，統一回應 Envelope。
     - 限制 60 秒寄件冷卻。
     - 使用 Node.js CSPRNG `crypto.randomInt(100000, 999999)` 生成 6 位數 OTP。
     - 將 OTP 計算 SHA-256 雜湊後與 10 分鐘過期時間存入 Map。
     - 調用 `mailService.sendPasswordResetMail` 寄送郵件。
   - `verifyResetCode(dto)`:
     - 使用 `crypto.timingSafeEqual` 比較輸入之 SHA-256 Hash。
     - 嘗試次數達 5 次時自動銷毀該 OTP (防爆破)。
   - `resetPassword(dto)`:
     - 校驗驗證碼成功後更新密碼，並立即註銷 OTP (防重放)。
4. **品質與測試驗收**:
   - 撰寫 `mail.service.spec.ts` 與更新 `auth.service.spec.ts` (測試預設使用 `MockMailProvider`)。
   - 撰寫 `test/auth-forgot-password.e2e-spec.ts` 驗收忘記密碼流程。

**Acceptance Checklist**
- [x] 安裝 `nodemailer` 相關套件並完善 `.env` 設定。
- [x] 完成 `src/shared/mail` 解耦架構實作與 `MailModule` 註冊。
- [x] `POST /api/auth/forgot-password` 無論用戶是否存在皆回傳 200/201 一致成功訊息，消除帳號列舉漏洞。
- [x] 驗證碼改為 CSPRNG 亂數生成且僅存儲 SHA-256 雜湊。
- [x] `verifyResetCode` 包含 5 次防爆破鎖定與 `crypto.timingSafeEqual` 時序攻擊防禦。
- [x] 單元測試 (`pnpm run test`) 全綠通過。
- [x] E2E 驗收測試 (`pnpm run test:e2e`) 全綠通過。


