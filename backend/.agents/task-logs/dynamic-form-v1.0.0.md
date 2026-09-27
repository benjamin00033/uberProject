# Task Log: 動態表單系統 (DynamicForm) 模組規格全面升級 v1.0.0 (Track B)

- **Date**: 2026-08-27
- **Track**: Track B (既有需求變更 / 模組規格升級)
- **Status**: COMPLETED_AND_FULLY_VERIFIED
- **Specification Document**: 動態表單系統 (DynamicForm) 後端開發技術規格文件 v1.0.0

## 1. 需求實作項目
- 前端 `DynamicFormList.vue`, `formBuilder.vue`, `dynamicForm.vue` 與 `DynamicFormService.ts` 規格對齊。
- 核心功能與端點：
  1. `GET /api/dynamic-forms`: 取得表單清單（支援 `status`, `search` 過濾）。
  2. `GET /api/dynamic-forms/:id`: 取得單一表單完整 Schema。
  3. `POST /api/dynamic-forms`: 建立新表單（防禦欄位長度、全域欄位 ID 唯一性驗證）。
  4. `PUT /api/dynamic-forms/:id`: 完整更新既有表單（防禦不可變更 PK `formId`）。
  5. `DELETE /api/dynamic-forms/:id`: 刪除表單 Schema。
  6. `POST /api/dynamic-forms/:id/submissions`: 提交表單作答紀錄。
  7. `GET /api/dynamic-forms/:id/submissions`: 查詢表單作答記錄清單。
  8. `GET /api/form/schema`: 舊版相容端點，預設回傳第一個表單 Schema。

## 2. 代碼審查與加固修正
- 新增 `FormStatusEnum` (`PUBLISHED`, `DRAFT`, `ARCHIVED`) 於 `src/common/enums/form-status.enum.ts`。
- 資料庫相容性：移除 `@db.Uuid`，確保 MariaDB / MySQL 動態切換無阻。
- 長度溢位防禦：`formId` 加上 `@MaxLength(64)`，`submittedBy` 加上 `@MaxLength(128)`。
- PK 變更防禦：`UpdateDynamicFormDto` 使用 `OmitType(..., ['formId'])`。
- 唯一性遞迴檢查：`validateFieldIdsUnique` 遞迴檢查 `children` 與 `itemSchema`。
- 補齊 `FormSchemaController` 單元測試。

## 3. 測試與驗收結果
- 單元測試：`src/modules/dynamic-form` 3 個測試套件 28 個測試全綠通過。
- 全專案單元測試：19 個測試套件 127 個測試 100% 通過。
- 建置：`pnpm run build` 成功。
- E2E 測試：新建 `test/dynamic-form.e2e-spec.ts`（包含 18 個驗收案例），全專案 4 個 E2E 套件 43 個測試全綠通過。
