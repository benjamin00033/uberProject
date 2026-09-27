# Task Log: 菜單品項 (MenuItem) 模組規格升級 v1.1.0 (Track B)

- **Date**: 2026-08-27
- **Track**: Track B (既有需求變更 / 模組升級)
- **Status**: COMPLETED_AND_FULLY_VERIFIED
- **Specification Document**: 菜單品項 (MenuItem) 後端開發技術規格文件 v1.1.0

## 1. 需求實作項目
- 前端 `MenuItem.vue`, `MenuItemForm.vue`, `pages/MenuItem.vue` 規格升級對齊。
- 7 大 RESTful 端點全面升級：
  1. `GET /api/v1/menu-items`: 支援服務端分頁 (`page`, `pageSize`, `search`, `status`, `categoryId`, `all`)，回傳 `PaginatedResponse<MenuItemEntity>`。
  2. `GET /api/v1/menu-items/:id`: 取得單一品項詳情。
  3. `POST /api/v1/menu-items`: 建立新品項（支援自訂 ID 或自動生成 `item_<uuid>` 前綴 ID）。
  4. `PUT /api/v1/menu-items/:id`: 完整更新品項資訊。
  5. `PATCH /api/v1/menu-items/:id/status`: 快速切換狀態 (`ACTIVE`, `INACTIVE`, `ARCHIVED`)。
  6. `DELETE /api/v1/menu-items/:id`: 軟刪除 (標記為 `ARCHIVED`)。
  7. `PUT /api/v1/menu-items/:id/modifier-groups`: 批次更新關聯之客製化選項群組 ID 清單。

## 2. 代碼審查與加固修正
- 新增 `MenuItemStatusEnum` (`src/common/enums/menu-item-status.enum.ts`)。
- DTO 防禦升級：`title`, `description`, `price_info` 加上 `@IsDefined()` 與 `@IsNotEmptyObject()`。
- PostgreSQL 查詢優化：移除危險的 Node.js 記憶體全表掃描，使用原生 JSONB 搜尋。
- 資料庫索引強化：`prisma/schema.prisma` 加上 `@@index([status, createdAt(sort: Desc)])` 與 `@@index([externalData])`。
- 所有 Service / Controller 公開方法標註明確 TypeScript 回傳型別。

## 3. 測試與驗收結果
- 單元測試：`src/modules/menu` 6 個測試套件 39 個測試全綠通過。
- 全專案單元測試：18 個測試套件 107 個測試 100% 通過。
- 建置：`pnpm run build` 成功。
- E2E 測試：新建 `test/menu-item.e2e-spec.ts`，全專案 3 個 E2E 套件 25 個測試全綠通過。
