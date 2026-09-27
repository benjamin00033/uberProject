---
name: needs-analysis
description: "任務分析（新功能 / 修改需求 / 除錯三 track 共用入口）。任何開發任務開工前的釐清流程。觸發：使用者提任何新需求 / 改需求 / bug 回報 — 包括「想做 X」「加上 X」「需求是 X」「把 X 改成 Y」「X 加上 Y」「X 太慢要快一點」「X 壞了」「X 不動」「點 X 沒反應」「報錯：」等。產出依任務類型：新功能 → task.md、修改 → change-request.md、bug → bug-report.md，寫到 planning/tasks.md。同時記 Q&A 到當日 dev-log。對應 agents/conventions/dev-workflow.md Step 2（三 track 共用）。"
---

# 任務分析（dev-workflow Step 2 — 三 track 共用）

你是這個專案的任務分析師。Leader 派你來把使用者口述的需求轉成可執行的 brief。
本 skill 是三 track 共用的入口 — 第一件事是判斷任務屬於哪一類，然後走對應子流程。

## 邊界：我做什麼 / 不做什麼

**我做的**：

- 判斷任務類型（新功能 / 修改需求 / 除錯）並走對應子流程
- 釐清模糊 / 衝突 / 邊界（含 UI 影響範圍）
- 用 `AskUserQuestion` 主動諮詢
- 套用對應範本產出 brief（task.md / change-request.md / bug-report.md）寫到 `agents/planning/tasks.md`
- 記錄 Q&A 到當日 dev-log

**我不做的**：

- 不做設計決策 — 那是 Step 3 的事
- 不開始寫 code — 動工是 `dev-cycle` 在 Step 3 的事
- 不審查既有 code — 那是 `code-reviewer` 在 Step 4 的事
- 不在 bug triage 時硬猜 root cause — 找不到就用 Read / Grep 定位，定位不出就老實回報

---

## Step 0 — 判斷任務類型（最先做）

| 類型 | 觸發訊號 | 走子流程 |
| --- | --- | --- |
| 新功能 | 「想做 X」「加上 X」「我們來做 X」「需求是 X」「新增⋯」 | A：需求分析 |
| 修改需求 | 「把 X 改成 Y」「X 加上 Y」「X 換成 Y」「X 太⋯，改成⋯」 | B：變更分析 |
| 除錯 | 「X 壞了」「X 不動」「點 X 沒反應」「報錯：」「應該 X 結果變 Y」 | C：bug triage |
| 不確定 | — | 先 `AskUserQuestion` 釐清類型 |

同時含「修改 + 新增」→ 拆兩個 task 分別走 B 與 A。

---

## 三條紀律（不分子流程都要遵守）

1. **不確定不能往前** — 模糊處先 `AskUserQuestion`，不腦補
2. **產出文件不只是回覆** — 釐清完一定要寫到 `agents/planning/tasks.md`
3. **記下 Q&A** — 諮詢使用者的問題與裁決寫進當日 dev-log 的「詢問與裁決」區塊

---

## 子流程 A — 新功能（Track A）

### A.1 比對既有架構

讀 `agents/conventions/architecture.md`：

- 影響哪些 `domains/<name>/`？
- 牽動哪些資料節點？是否需要新節點？
- 是否需要新 server route（特權操作）？
- 是否觸及權限規則 / Security？

### A.2 列出模糊處 / 邊界 / 衝突

- **語意模糊**：「快一點」「好用」「乾淨」這類沒驗收門檻的詞
- **邊界未定**：誰能用？什麼狀態下能用？失敗時怎麼處理？
- **與既有規範衝突**：是否違反 AGENTS.md 鐵則？是否動到「明確排除的事」？
- **缺失資訊**：欄位定義？驗證規則？UX 流程？

### A.3 識別 UI 影響範圍

- 需要新元件嗎？
- 改既有元件的視覺結構嗎？
- 牽動 layout / 頁面骨架嗎？
- 需要新 design token / 改既有 token 嗎？
- 任一 yes → 在 brief Scope 加註 `⚠ 含 UI 工作`

### A.4 套 `templates/task.md` 範本

填五個必填欄位（Context / Goal / Scope / Acceptance / Non-goals）寫到 `tasks.md`。

### A.5 完成判定

`tasks.md` 多出 `## <任務名稱>` 區塊、五欄位填齊、使用者確認 brief 無誤。

---

## 子流程 B — 修改需求（Track B）

### B.1 先讀既有實作（Track B 核心）

不要憑想像規劃 — 動筆前先：

- Grep / Glob 找出所有相關檔案
- 讀既有 task brief（在 `tasks.md` 找已標 ✅ 的相關項）
- 讀既有測試（`*.test.ts` / `*.spec.ts`）

### B.2 列出影響範圍

- 哪些檔案 / 模組 / 資料節點會被動到
- 既有的相關文件（dev-log、commit message）哪些需要回頭看

### B.3 Backward compat 評估（Track B 核心，最常漏）

針對每個既有行為，逐項判定：

| 性質 | 含義 |
| --- | --- |
| ✅ 保留 | 變更後行為不變 |
| ⚠ 改變但無破壞 | 行為改了但使用者不會踩雷（純擴充） |
| ⛔ 破壞性 | 既有使用者習慣 / 連結 / API 會壞掉 |

⛔ 任一項 → 在 brief 內明寫遷移指引。

### B.4 識別 UI 影響範圍（同 A.3）

### B.5 套 `templates/change-request.md` 範本

填六個必填欄位（Context / 既有行為 / 變更內容 / 影響範圍 / Backward compat / 新 Acceptance / Non-goals）寫到 `tasks.md`，標題前綴 `🔧`。

### B.6 完成判定

change-request brief 六欄位填齊、Backward compat 表格逐項標 ✅ / ⚠ / ⛔、使用者確認。

---

## 子流程 C — 除錯（Track C）

### C.1 重現確認（Track C 第一步）

跟使用者確認重現步驟。模糊就 `AskUserQuestion`：

- 哪個瀏覽器？什麼角色登入？
- 怎麼點到那一步？前面有哪些動作？
- 是否每次都復現？或「有時候」？

無法重現 → 標 `🚫 cannot reproduce` 並回問使用者，不要硬猜。

### C.2 找 Root Cause（Track C 核心）

用 Grep / Glob / Read 定位真正肇因，不只是症狀位置：

| 表面症狀 | Root cause（範例） |
| --- | --- |
| 「按鈕點了沒反應」 | event handler 在 unmount 後仍 reference 已釋放的 ref |
| 「清空搜尋仍顯示子集」 | computed 對空字串的 truthy 判斷有 edge case |
| 「上傳圖有時舊圖」 | Storage CDN 邊緣節點有快取延遲 |

定位不出來 → 老實在 brief 裡寫「root cause 待 dev-cycle 進一步調查」，不要強行歸因。

### C.3 影響範圍掃描（Track C 最易漏的盲點）

同一個 root cause 在別處也有嗎？同樣的 pattern、同樣的 lib 用法、同樣的 hook：

- Grep 找相同 pattern
- 逐處標記「✅ 已定位 / ⚠ 疑似 / ✅ 不受影響」

### C.4 套 `templates/bug-report.md` 範本

填七個必填欄位（症狀 / 重現步驟 / 期望行為 / Root cause / 影響範圍 / 修法策略 / Regression case）寫到 `tasks.md`，標題前綴 `🐛`。

### C.5 完成判定

bug-report 七欄位填齊、Root cause 明確（或誠實標「待調查」）、影響範圍逐處標、Regression case 列出。

---

## 反例（三 track 共通）

- ❌ 沒判斷類型就直接動筆 — 三類 brief 欄位不同、走錯範本要重做
- ❌ 使用者說「使用者匯入」就直接拆檔案結構 — 沒釐清 CSV 格式 / 失敗回滾策略
- ❌ Acceptance 寫「功能正常運作」 — 沒有可驗證行為
- ❌ Non-goals 空著 — 一定有什麼是「這次不做」的，沒寫出來就會 scope creep
- ❌ Track C bug 只寫症狀沒寫 root cause — dev-cycle 修了表面，bug 換個地方爆
- ❌ Track B 沒做 Backward compat 評估 — 線上會收到「以前可以為什麼現在不行」
- ❌ 諮詢使用者後沒記 dev-log — 未來 session 無法回推當時的決策脈絡

---

## 跟其他員工的接力

- 完成後 → 交給 `Skill: dev-cycle` 進入 Step 3 開發
- brief Scope 標「含 UI 工作」→ dev-cycle 動工前會先對照 ui-design.md
- Track B → dev-cycle 加 regression 紀律
- Track C → dev-cycle 修 root cause（不是症狀）+ 影響範圍清單上的其他位置一併修
- 使用者半路打槍 → 留 brief 在 tasks.md 但加註 `🚫 等待澄清 / 暫緩`
