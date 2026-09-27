# Task 範本（Track A — 新功能）

給 AI 開發任務用的 brief。複製下方骨架、貼到 `agents/planning/tasks.md` 當新的 `## <任務名稱>` 區塊。
一個 task = 一個 commit-able 邏輯改動，不要塞太多事進來。

---

## 使用方式

1. 複製下方「範本骨架」整段
2. 貼到 `tasks.md` 任務列表最上方
3. 填完五個欄位（**Context / Goal / Scope / Acceptance / Non-goals**）後再交給 AI
4. AI 動工後在標題前加 `🚧`，完成後加 `✅` 並附 commit hash

五個欄位都是必填。沒填等於沒想清楚，AI 會自己腦補變成踩雷。

---

## 範本骨架

```markdown
## <動詞開頭的任務名稱，例如：加上使用者大量匯入功能>

**Context** — 為什麼要做？目前有什麼問題 / 觸發點？
（一兩句話。寫不出來代表這個 task 可能還不該動工。）

**Goal** — 做完之後，使用者 / 系統會多出什麼能力？
- 1–3 條 bullet，描述「完成後的世界」而不是「要做的步驟」

**Scope** — 影響哪些 domain / 檔案 / 資料節點？
- `domains/<x>/...`
- `server/api/<y>/...`
- 資料節點：`/<path>/...`

**Acceptance** — 怎樣算做完？可驗證的勾選項
- [ ] 行為 1（描述使用者能做什麼，不是「程式做了什麼」）
- [ ] 行為 2
- [ ] 對應的helper有測試覆蓋
- [ ] verify 全綠

**Non-goals** — 這次明確不做什麼？避免 scope creep
- 不做 X（之後另開 task）
- 不重構 Y（這次只動最小改動）

**References**（選填）— 相關 PR / commit / 文件 / 既有實作可參考
- `domains/<x>/...` 既有類似功能可參考
- 設計參考：<link>
```

---

## 完整範例

```markdown
## 加上使用者大量匯入（CSV）

**Context** — 反映每次有新一批使用者要建立時，一筆筆手動建檔很慢，10 個以上就半天沒了。

**Goal**
- admin 角色可以上傳 CSV，一次建立多筆使用者資料
- 上傳前可以預覽哪幾筆會被建立 / 哪幾筆有錯
- 匯入結果寫 audit-log，方便追溯

**Scope**
- `domains/users/hooks/useUserImport.ts`（新增）
- `domains/users/utils/parseUserCsv.ts`（新增，helper）
- `server/api/users/bulk-import.post.ts`（新增）
- `pages/admin/users/import`（新增頁面）
- 資料節點：`/users/{id}` 批次寫入、`/audit-logs/{key}` 寫匯入紀錄

**Acceptance**
- [ ] 可上傳合法 CSV 並看到預覽表
- [ ] 預覽表會標示哪幾列有錯（email 重複、必填空白）
- [ ] 確認後一次建立所有合法列，錯誤列保留在預覽不送出
- [ ] 每次匯入寫一筆 audit-log
- [ ] `parseUserCsv` helper測試 100% 覆蓋
- [ ] verify 全綠

**Non-goals**
- 不做 CSV 範本下載（之後再說，先讓使用者自己組）
- 不做匯出（這次只做 import）
- 不處理頭像 / 文件附件
```
