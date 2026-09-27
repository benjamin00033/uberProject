# Task 範本（Track A — NestJS 新功能開發）

給 AI 開發 NestJS 任務用的 Task Brief。複製下方骨架、貼到 `planning/tasks.md` 當作新的 `## <任務名稱>` 區塊。
一個 task = 一個可 Commit 的 NestJS 邏輯改動 (含 Controller/Service/DTO/Spec)。

---

## 範本骨架 (Template Skeleton)

```markdown
## <動詞開頭的任務名稱，例如：新增使用者註冊與驗證 API>

**Context** — 為什麼要做？目前有什麼背景或觸發點？
（說明業務背景或需求緣由。）

**Goal** — 完成後，API 系統或服務會多出什麼能力？
- 1–3 條簡明描述完成後的系統能力
- 例如：提供 `/api/v1/auth/register` Endpoint，完成 DTO 驗證與 JWT 發行

**Scope** — 影響哪些 NestJS 模組、資料庫 Entity 或元件？
- `src/modules/<feature>/controllers/...`
- `src/modules/<feature>/services/...`
- `src/modules/<feature>/dto/...`
- `src/modules/<feature>/entities/...`
- `src/shared/...` 或 `src/plugins/...` (如需)

**Acceptance** — 可驗收條件 (Acceptance Criteria)
- [ ] Controller Endpoint 正確綁定 DTO 並傳回 201 Response Envelope
- [ ] DTO 包含 `class-validator` 強型別校驗並在 400 Bad Request 時傳回詳細錯誤
- [ ] Service 商業邏輯運算無誤並寫入資料庫
- [ ] 對應的 Service 單元測試 (`*.spec.ts`) 覆蓋率達標
- [ ] 通過 Supertest E2E 測試 (`test/<feature>.e2e-spec.ts`)
- [ ] `pnpm run lint && pnpm run test` 全綠

**Non-goals** — 這次明確不做什麼？避免 Scope 擴張 (Scope Creep)
- 不做 X (未來另開 Task)
- 不重構 Y 模組

**References** — 相關設計文件、OpenAPI Spec 或參考程式碼
- `src/modules/users/...`
```

---

## 完整範例 (NestJS Backend Example)

```markdown
## 新增產品管理模組與 REST API (ProductsModule)

**Context** — 系統需要支援產品目錄管理，提供前端或第三方調用產品 CRUD API。

**Goal**
- 建立 `ProductsModule` 專屬 DDD 模組 (`src/modules/products`)
- 提供 `POST /api/v1/products` (建立產品) 與 `GET /api/v1/products` (產品列表分頁)
- 整合 `JwtAuthGuard` 與 `RolesGuard` 限制僅 Admin 可建立產品

**Scope**
- `src/modules/products/products.module.ts`
- `src/modules/products/controllers/product.controller.ts`
- `src/modules/products/services/product.service.ts`
- `src/modules/products/dto/create-product.dto.ts`
- `src/modules/products/entities/product.entity.ts`

**Acceptance**
- [ ] `POST /api/v1/products` 成功建立產品並傳回包裹之 `ProductResponseDto` (201 Created)
- [ ] `CreateProductDto` 對價格 (`price > 0`) 與名稱 (`min 2 chars`) 進行強型別校驗
- [ ] 未帶 Token 時請求回傳 `401 Unauthorized`；非 Admin 傳回 `403 Forbidden`
- [ ] `ProductService.create` 與 `findAll` 的單元測試 (`product.service.spec.ts`) 完成
- [ ] 通過 E2E 測試 (`test/product.e2e-spec.ts`)
- [ ] `pnpm run lint && pnpm run test` 全綠

**Non-goals**
- 不做產品圖片上傳 (下個 Task 整合 S3 Plugin)
- 不做 Soft Delete (保留在 Phase 2)
```
