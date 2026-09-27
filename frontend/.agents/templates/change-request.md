# Change-Request 範本（Track B — 修改需求）

Track B 修改既有功能時，由 needs-analysis 在 dev-workflow Step 2 產出。跟 task.md 不同的是多了「既有行為」跟「Backward compat」兩個強制欄位。

複製下方骨架、貼到 `agents/planning/tasks.md` 當 `## 🔧 <變更名稱>` 區塊。

---

## 使用方式

1. 複製下方「範本骨架」整段
2. 貼到 `tasks.md` 任務列表最上方，標題加 `🔧` 前綴標示這是 change request
3. 填完六個欄位（**Context / 既有行為 / 變更內容 / 影響範圍 / Backward compat / Acceptance / Non-goals**）後再交給 AI
4. AI 動工後標題加 `🚧`，完成後加 `✅` 並附 commit hash

Track B 最大的盲點是 **backward compat** — 改了 X，使用者習慣的 Y 行為還在嗎？這欄漏掉就會收到「以前可以為什麼現在不行」的線上回報。

---

## 範本骨架

```markdown
## 🔧 <動詞開頭的變更名稱，例如：訂單列表加上多欄排序>

**Context** — 為什麼要改？目前哪裡不夠用？
（一兩句話。使用者只是「我想換個樣子」沒有實質痛點，先回去釐清。）

**既有行為**（Track B 核心）
描述目前實作怎麼運作 — 從**使用者觀點**寫，不是程式碼描述：
- 目前：使用者進入訂單列表時，預設按建立時間倒序顯示
- 目前：只能用「訂單編號」搜尋，不能排序
- 目前：分頁固定 20 筆

**變更內容**
新的行為要長怎樣：
- 新增「按金額 / 客戶名 / 狀態」三種排序選項
- 排序選項保留在 URL query string（可分享連結）
- 預設仍是建立時間倒序（不破壞既有習慣）

**影響範圍**
- 檔案：`domains/orders/hooks/useOrderList.ts`、`pages/admin/orders/index`
- 資料節點：無變動（純前端排序）
- 既有測試：`useOrderList.test.ts` 需擴充
- 文件：dev-log 紀錄變更原因

**Backward compat 評估**（Track B 核心）
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 預設建立時間倒序 | 不變 | ✅ 保留 |
| URL 無 `?sort=` 時的行為 | 不變（仍是預設） | ✅ 保留 |
| 既有書籤 / 連結 | 仍能開、仍看到列表 | ✅ 保留 |
| 自動切換到「按客戶名排序」 | 移除（變成手動選） | ⚠ 改變但無破壞 |
| 「分頁 20 筆」 | 不變 | ✅ 保留 |

> 結論：無破壞性變更（pure additive）。
> 若有破壞性 → 明寫在這、寫清楚遷移指引。

**新 Acceptance**
- [ ] 使用者可以點欄位標題切換排序方向
- [ ] 排序狀態反映在 URL `?sort=field:order`
- [ ] 重新整理頁面後保留排序狀態
- [ ] 既有測試（無排序狀態下的列表行為）仍全綠
- [ ] verify 全綠

**Non-goals**
- 不做後端排序（之後再說）
- 不做多欄複合排序（先做單欄）
- 不重構 useOrderList 結構（這次只擴充）

**References**（選填）
- 既有測試：`domains/orders/hooks/__tests__/useOrderList.spec.ts`
- 既有 task：`tasks.md` 中「✅ 訂單列表 MVP」
```

---

## 完整範例（含破壞性變更）

```markdown
## 🔧 訂單審核流程改為兩階段

**Context** — 反映現在「主管一鍵核准」造成審核責任過於集中、財務常質疑核准合理性。

**既有行為**
- 使用者提訂單 → 主管按「核准」/「駁回」→ 寫入 `/orders/{id}.status`
- 一個動作完成，無中間狀態

**變更內容**
- 兩階段：主管「初審」（status: `pending-finance`）→ 財務「終審」（status: `approved` / `rejected`）
- 各階段可獨立駁回，駁回後使用者可重新提交

**影響範圍**
- `domains/orders/hooks/useOrderApproval.ts`
- `server/api/orders/[id]/approve.post.ts`（拆成兩個 endpoint）
- `pages/admin/orders`（UI 多一個 column）
- 資料節點：`/orders/{id}.status` enum 擴充

**Backward compat 評估**
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 既有 `status: approved` 的紀錄 | 維持 approved，視為已通過終審 | ✅ 保留 |
| 既有 audit-log | 維持，不回填 | ✅ 保留 |
| 主管一鍵核准 API | 移除 endpoint | ⛔ 破壞性 |
| 既有「待審」列表前端寫死的 status 判斷 | 需改 | ⛔ 破壞性 |

> 結論：含破壞性變更。遷移指引：呼叫舊 endpoint 會收到 410 Gone，請改用新 endpoint。

**新 Acceptance**
- [ ] 主管初審通過 → 進入 `pending-finance` 狀態
- [ ] 財務終審通過 → 進入 `approved` 狀態，寫 audit-log
- [ ] 任一階段駁回 → 進入 `rejected` 狀態並通知申請者
- [ ] 既有 approved 紀錄不受影響、視覺一致
- [ ] 舊 API 回 410 並引導至新 endpoint
- [ ] verify 全綠

**Non-goals**
- 不做三階段以上（保留未來擴充）
- 不重寫前端整個 approval flow（只動 status + 多一個 step UI）
- 不通知前端推播（之後另開 task）
```
