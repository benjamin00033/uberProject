# Change Request 範本（Track B — NestJS 既有需求變更）

給 AI 進行 NestJS 變更任務用的 Change Request Brief。複製下方骨架貼到 `planning/tasks.md` 當作新的 `## <變更名稱>` 區塊。

---

## 範本骨架 (Template Skeleton)

```markdown
## <動詞開頭的變更名稱，例如：擴充 User DTO 新增電話欄位與簡訊驗證>

**Context** — 為什麼要變更？既有行為有何侷限或新業務需求？
（描述現狀與變更動機。）

**Existing Behavior** — 系統目前是如何運作的？
- 例如：`POST /api/v1/users` 目前僅接收 `email` 與 `password`

**Proposed Changes** — 預計做哪些變更？
- 擴充 `CreateUserDto` 增加 `phone` 欄位並套用 `IsPhoneNumber()`
- 於 `UserService.register` 整合 `TwilioPlugin` 發送簡訊驗證碼

**Backward Compatibility** — 相容性評估 (API 契約與 DB Schema)
- [ ] 既有 API 客戶端是否不受破壞性影響？ (無 Breaking Changes / 或版本號 bump 至 v2)
- [ ] 資料庫 Migration 是否可順利向上向下相容？

**Scope** — 影響檔案與模組清單
- `src/modules/users/...`
- `src/plugins/twilio/...`

**Acceptance** — 可驗收條件
- [ ] 變更後的 API 回應格式完全符合新 specification
- [ ] 既有單元測試 (`*.spec.ts`) 全部通過未發生 Regression
- [ ] 新邏輯之單元測試與 E2E 測試覆蓋完畢
- [ ] `pnpm run lint && pnpm run test` 全綠

**Non-goals** — 這次明確不做什麼
- 不調整 Auth Module 的 JWT Claims 結構
```
