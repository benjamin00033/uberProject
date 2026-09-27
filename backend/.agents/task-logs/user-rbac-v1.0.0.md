# Task Log: 使用者管理與細粒度權限系統 (RBAC) 規格全面升級 v1.0.0 (Track B)

- **Date**: 2026-08-27
- **Track**: Track B (既有需求變更 / 模組規格升級)
- **Status**: COMPLETED_AND_FULLY_VERIFIED
- **Specification Document**: 使用者管理與細粒度權限系統 (RBAC) 後端開發技術規格書 v1.0.0

## 1. 需求實作項目
- 前端 `src/domain/user` 規格升級對齊。
- 資料庫與 Schema 升級：
  - `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `UserPermission`, `AuditLog`。
  - Seed 預設角色 (`admin`, `manager`, `staff`, `viewer`) 與權限字典清單。
- 細粒度權限比對與守衛：
  - `matchPermission`：支援超級管理員 `*`、尾端階層萬用字元 `user:*`、`menu:item:*` 與完全匹配。
  - `@RequirePermissions(...)` 裝飾器與 `PermissionsGuard`。
  - Controller 統一雙守衛：`@UseGuards(JwtAuthGuard, PermissionsGuard)`。
- 資料安全與防禦：
  - 密碼 Hash 脫敏：對外一律透過 `UserResponseDto` 遮蔽密碼。
  - 權限聯集：角色繼承權限與直屬獨立權限聯集聚合。
  - 資料一致性：多對多更新包裹於 `prisma.$transaction`。
- RESTful 端點：
  - `GET /api/users`: 取得使用者清單（支援 `search`, `role`, `status`）。
  - `GET /api/users/:id`: 取得單一使用者詳情。
  - `POST /api/users`: 建立使用者（409 衝突防禦、密碼 Hash）。
  - `PUT /api/users/:id`: 更新使用者（重新綁定角色與權限）。
  - `DELETE /api/users/:id`: 刪除使用者。
  - `GET /api/roles`: 取得角色清單與權限。
  - `GET /api/permissions`: 取得細粒度權限字典清單。

## 2. 測試與驗收結果
- 單元測試：User 模組、Guard 與 Utility 7 個測試套件 45 個測試全綠通過。
- 全專案單元測試：24 個測試套件 165 個測試 100% 通過。
- 建置：`pnpm run build` 成功。
- E2E 測試：新建 `test/user-rbac.e2e-spec.ts`（包含 16 個驗收案例），全專案 5 個 E2E 套件 59 個測試全綠通過。
