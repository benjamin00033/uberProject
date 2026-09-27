# 開發流程（Agentic Engineering SOP）

角色設定：**使用者 = 監督者 / 產品負責人**；**Leader = 主 agent（如 Claude / Cursor 等）**；員工 = Skill, Sub-agent 或 Plugin 工具。

---

## Step 0 — Leader 判斷任務類型（每次必做）

收到使用者訊息後，先判斷任務屬於哪一類，才能決定走哪條 track：

| 類型     | 觸發訊號                                                         | 走                             |
| -------- | ---------------------------------------------------------------- | ------------------------------ |
| 新功能   | 「想做 X」「加上 X」「我們來做 X」「需求是 X」「新增⋯」          | Track A                        |
| 修改需求 | 「把 X 改成 Y」「X 加 Y」「X 換成 Y」「X 太⋯，改成⋯」            | Track B                        |
| 除錯     | 「X 壞了」「X 不動」「點 X 沒反應」「報錯：」「應該 X 結果變 Y」 | Track C                        |
| 不確定   | —                                                                | AskUserQuestion 釐清類型再分流 |

> **注意**：判斷錯會白做一輪。使用者描述同時含「修改 + 新增」就拆兩個 task 分別走 Track B 跟 A。

---

## 流程總覽

                  Step 0：類型判斷
                        │
        ┌───────────────┼───────────────┐
        │               │               │

Track A Track B Track C
（新功能） （修改需求） （除錯）
│ │ │
1 提需求 1 描述變更 1 回報 bug
2 需求分析 2 變更分析 2 Bug triage
3 開發 3 開發+regression 3 修 root cause
3.5 語系確認 3.5 語系確認 3.5 語系確認 (如涉UI)
4 Code Review 4 Review+compat 4 Review+root cause
5 驗收測試 5 既+新 acceptance 5 regression test
6 寫日誌回報 6 寫日誌回報 6 寫日誌回報
7 驗收+push 7 驗收+push 7 驗收+push
│ │ │
└───────────────┴───────────────┘
│
共用：Skill 員工 / Plugin 工具 / 規範 / 回滾機制

---

## Track A — 新功能

### Step 1 — 使用者提需求

使用者以自然語言描述要做什麼。不用事先寫 task brief。

### Step 2 — Leader 呼叫 **Skill: needs-analysis**

員工：Skill（主 context、可對話）

工作項目：

1. **知識檢索**：先進行專案與上下文檢索。強烈建議搭配 **Plugin: project-scanner** 進行全域掃描，若需精準定位結構可使用 **Plugin: ast-grep**，確認過去是否討論過類似功能或有架構決策，避免重複造輪子。
2. 比對 `architecture.md` 看影響哪些 domain / 資料節點。
3. 列出模糊處 / 邊界 / 衝突。
4. 識別 UI 影響範圍（新元件 / 改視覺結構 / 改 token）— 任一答 yes 就在 brief Scope 標 `⚠ 含 UI 工作`。
5. 模糊處主動 `AskUserQuestion` 釐清。
6. 套 [`templates/task.md`](../templates/task.md) 範本寫到 `planning/tasks.md`。
7. **日誌紀錄**：呼叫 `log-manager` 將 Q&A 記到當日 `dev-logs` 的「詢問與裁決」。

> **完成判定**：task brief 五欄位（Context / Goal / Scope / Acceptance / Non-goals）填齊。

### Step 3 — Leader 呼叫 **Skill: dev-cycle**

員工：Skill（繼承 spec 上下文）

工作項目：

1. 依 task.md Scope 列檔案清單。
2. 若 Scope 標 `⚠ 含 UI 工作`，先呼叫 `ui-standardize` 確保使用 Design Tokens，並**強制**搭配 **Plugin: component-reuse-checker** 掃描既有組件，避免重複開發。
3. 依據需求場景，靈活調用開發輔助 Plugins：
   - 建立新 Domain 頁面：調用 **Plugin: domain-scaffolder**
   - 建立共用 UI 元件：調用 **Plugin: component-builder**
   - 建立模擬 API 資料：調用 **Plugin: mock-api-generator**
4. 逐檔修改 — 每檔同一輪補單元測試。若涉及 UI 樣式開發，應全程遵守 **Plugin: inline-style-checker**, **Plugin: shared-design-enforcer**, 以及 **Plugin: scss-import-checker** 確保代碼與樣式合規。
5. **防護機制**：若遇到影響範圍過大的共用組件，暫停開發並呼叫 `conflict-logger` 產出衝突報告，等候使用者裁決。
6. 一個邏輯改動一個 commit（依 `commit-message-format.md`）。

每檔完成前自查：

- [ ] 重要邏輯抽成可測 helper？單元測試同一輪寫完？
- [ ] verify 沒掛？commit message 符合格式？
- [ ] UI 工作樣式對齊 token？a11y 14 點自查？

### Step 3.5 — Leader 呼叫 **Plugin: locale-manager**

在進入 Review 前，呼叫 `.agents/plugins/locale-manager` 檢查新增的文案是否已完整抽離至 i18n 多語系檔案中，嚴禁在元件內 hardcode 中文或英文。

### Step 4 — Leader 呼叫 **Skill: code-reviewer**

員工：Sub-agent（fresh context 抗 confirmation bias）

六大檢查點：Schema / 模組邊界 / Security / UI 規範 / JSDoc·測試 / 改 A 壞 B 訊號。

| 結論            | 動作                                    |
| --------------- | --------------------------------------- |
| ✅ 全過         | 進 Step 5                               |
| ⚠ 執行細節錯    | 回 Step 3 修（`git restore` 或 rewind） |
| ⚠ 架構 / 方向錯 | 回 Step 2 砍 plan 重寫                  |

### Step 5 — Leader 呼叫 **Skill: spec-tester** (需先詢問使用者)

**注意：** 必須先問使用者「是否需要進行整合/驗收測試？」，同意後才呼叫。
工作項目：

1. 把每條 Acceptance 翻成整合測試（測「使用者行為」，不是「函式回傳」）。
2. 確保 verify + build 全綠。

### Step 6 — Leader 回報使用者 + 更新文件

呼叫 `log-manager` 整理交付清單並寫入 `task-logs` 與 `dev-logs`，將結果回報給使用者。

### Step 7 — 使用者驗收 + commit/push

使用者點頭 → 執行 `git push`。

---

## Track B — 修改需求

最高風險：改 A 壞 B + backward compatibility (向後相容性)。

### Step 1 — 使用者描述變更

使用者說「把 X 改成 Y」、「X 加排序」等。

### Step 2 — Leader 呼叫 **Skill: needs-analysis（變更分析模式）**

1. **強制檢索**：**必須優先進行全局搜尋與上下文檢索**，了解既有實作的歷史脈絡與決策。
2. **精準定位**：取得脈絡後，強烈建議呼叫 **Plugin: project-scanner** 精準找出所有相關檔案與既有測試，嚴禁盲目猜測。
3. **Backward compat 評估**（Track B 重點）：
   - 既有使用者的行為會被改變嗎？是擴充還是破壞性變更？
   - 既有 acceptance 哪些仍要過、被取代或刪除？
4. 模糊處釐清，並產出 [`templates/change-request.md`](../templates/change-request.md)。

> **完成判定**：brief 含「既有行為 / 變更內容 / 影響範圍 / Backward compat / 新 Acceptance / Non-goals」。

### Step 3 — Leader 呼叫 **Skill: dev-cycle（含 regression 模式）**

改完必須跑全部測試（不只新寫的），確保既有測試綠燈。若涉及文字變更，於 **Step 3.5** 呼叫 `locale-manager` 處理多語系。

### Step 4 — Leader 呼叫 **Skill: code-reviewer（含 backward compat 重點）**

審查重點：既有 acceptance 是否能過？掛掉的是預期內還是 regression？相關場景有沒有漏改？

### Step 5 至 7 — 同 Track A

(Step 5 需驗證被取代的舊測試是否已正確刪除或更新)

---

## Track C — 除錯修正

最大盲區：只修表面而非 root cause；核心紀律：regression test 防複發。

### Step 1 — 使用者回報 bug

理想：症狀 + 重現步驟 + 期望行為三件套。模糊則 Leader 主動釐清。

### Step 2 — Leader 呼叫 **Skill: needs-analysis（bug triage 模式）**

1. 重現確認 — 無法重現標 `🚫 cannot reproduce` 並回問。
2. **找 Root Cause**：**必須優先檢索上下文**尋找該功能的原始設計與類似 Bug 紀錄。隨後強烈建議使用 **Plugin: ast-grep** 進行精準的程式碼結構搜尋定位真正肇因。
   _(例如：表面是按鈕沒反應，root cause 是 unmount 後 reference 已釋放的 ref)_
3. **影響範圍掃描**：同一個 root cause 在專案別處也有發生嗎？也可透過 `project-scanner` 平行擴大掃描。
4. 產出 [`templates/bug-report.md`](../templates/bug-report.md)。

> **完成判定**：brief 含「症狀 / 重現步驟 / 期望行為 / Root cause / 影響範圍 / 修法策略 / Regression case」。

### Step 3 — Leader 呼叫 **Skill: dev-cycle（修 root cause）**

鐵則：只修 root cause。同一輪必須寫 regression test（測「不再發生 bug」的 case）。(若修復涉及 UI 文案提示，過 Step 3.5 `locale-manager`)。

### Step 4 — Leader 呼叫 **Skill: code-reviewer（root cause 重點）**

審查重點：root cause 真的解決了嗎？regression test 覆蓋的 case 真的能觸發原本的 bug？影響範圍清單上的其他位置都修了嗎？

### Step 5 至 7 — 同 Track A

(Step 5 的 spec-tester 必須跑出整合級的 regression test)

---

## 共用：工具與員工配置清單

| #   | 工具/員工/模組           | 類型      | 職責與觸發時機                                                                                                                                                              |
| --- | ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `needs-analysis`         | Skill     | **Step 2**：A(需求) / B(變更) / C(bug)。                                                                                                                                    |
| 2   | `dev-cycle`              | Skill     | **Step 3**：執行開發與單元測試。若遇阻礙搭配 `conflict-logger`。                                                                                                            |
| 3   | `code-reviewer`          | Sub-agent | **Step 4**：架構、資安、UI token 與 Regression 檢查。                                                                                                                       |
| 4   | `spec-tester`            | Sub-agent | **Step 5**：整合/驗收測試 (需使用者同意後觸發)。                                                                                                                            |
| 5   | `log-manager`            | Skill     | **全局**：隨時紀錄進度、Q&A 決策，並於 Step 6 統整每日 `dev-logs`。                                                                                                         |
| 6   | `conflict-logger`        | Skill     | **阻斷器**：當發現改動會造成破版、規格矛盾或影響範圍失控時強制觸發，等候裁決。                                                                                              |
| 7   | **分析與搜查類 Plugins** | Plugin    | `project-scanner` (全域掃描)、`ast-grep` (AST 結構搜尋)。於 **Step 2** 強化上下文與範圍定位。                                                                               |
| 8   | **開發輔助類 Plugins**   | Plugin    | `domain-scaffolder`, `component-builder`, `mock-api-generator`。於 **Step 3** 生成標準樣板與測試資料。                                                                      |
| 9   | **UI 檢核類 Plugins**    | Plugin    | `component-reuse-checker`, `inline-style-checker`, `shared-design-enforcer`, `scss-import-checker`, `locale-manager` (多語系檢查)。於 **Step 3 & 4** 強制檢查與預防技術債。 |

---

## 共用：失誤救援與回滾決策表

| 情境                           | 動作                                                      |
| ------------------------------ | --------------------------------------------------------- |
| 審查 (Review) 發現實作細節錯   | `git restore <檔案>` 重做                                 |
| AI 套錯架構 / 誤解需求         | 回 Step 2 砍 plan 重寫                                    |
| AI 一次改太多看不出哪邊好      | `git restore .` 全部回滾（小 commit 的價值）              |
| verify 大規模爆掉              | 高機率方向錯，停手檢查 task / change-request / bug-report |
| 觸發 `conflict-logger`         | **強制停手**，生成衝突報告詢問使用者，獲得裁決後才能繼續  |
| Track C：bug 修完 1 週內又復發 | regression test 沒蓋到 root cause，回 Step 2 重新 triage  |
| Track B：變更後影響舊有功能    | backward compat 沒抓全，重新進行精準搜尋補齊影響範圍      |
