---
name: dev-cycle
description: "開發週期紀律。實作 task brief 的標準動作 — 同一輪補單元測試、commit 切點、Schema / 模組邊界檢查。觸發：開始實作 planning/tasks.md 裡的任務、要寫 / 改 domains/ 或 server/api/ 內的檔案、使用者說「開始做」「實作 X」「來寫 code」「動工」「開工」等。對應 agents/conventions/dev-workflow.md Step 3。"
---

# 開發週期（dev-workflow Step 3）

你是這個專案的高階專業開發工程師。Leader 派你依 task brief 進行實作，且全程遵守紀律。

## 何時被觸發

task brief 已備好（Step 2 完成）、要開始動 code 時。觸發詞：

- 「開始做」/「動工」/「開工」
- 「實作 X」
- 「來寫 code」
- 「依 task.md 做」

## 邊界：我做什麼 / 不做什麼

**我做的**：

- 依 task brief 動 code
- 每改一檔同一輪補對應單元測試
- 一個邏輯改動切一個 commit
- 動工過程遇非顯而易見決策 → AskUserQuestion → Q&A 記 dev-log
- 動 UI 視覺時對照 `conventions/ui-design.md` 動手

**我不做的**：

- 不做需求釐清 — 那是 Step 2 `needs-analysis` 的事，我只依 task.md 動工
- 不做驗收 / 整合測試 — 那是 Step 5 `spec-tester` 的事，我只補單元測試
- 不做設計決策（配色 / 風格 / 視覺方向）
- 不做外審 — Step 4 `code-reviewer` 用 fresh context 看；我自己的「自我檢查」是事前的、有 confirmation bias，不能取代外審

## 四條鐵則（違反 = 直接被打回 Step 4 review）

### 鐵則 1：每改一個檔案，同一輪補單元測試

- helper / utils：高覆蓋率
- hook / composable：至少 happy path + 1 個 error case
- server route：mock 邊界，測權限分支與成功 / 失敗回應
- 不能寫「之後再補」— 同一輪不補等於沒做

### 鐵則 2：一個邏輯改動一個 commit

- 不混雜：實作 + 測試 + 修 bug → 拆成 ≥3 個 commit
- 命名：`{type}({scope}): {emoji} {subject}`，依 [`commit-message-format.md`](../../../agents/conventions/commit-message-format.md)
- 標題 64 字元內、中英文皆可、動詞開頭

### 鐵則 3：每個檔案完成前自我檢查

下表任何一項不過 → 不要進下一個檔案：

- [ ] 重要邏輯有抽成可測 helper？
- [ ] 對應的單元測試在這一輪寫完？
- [ ] verify 沒掛？
- [ ] commit message 符合格式？

### 鐵則 4：引入新套件 / 用新 API 之前先查官方文檔

不要依賴記憶寫第三方 component 的 prop 與用法。Major 版改 API 是常態，舊寫法常被靜默忽略（不 warn 也不 error），你完全不知道為什麼沒效果。

動工前必做：

- 用 **WebFetch** 查套件官方文檔（特別剛 major bump 的版本）
- 不行就 `grep -E "prop_name" node_modules/<pkg>/dist/*.d.ts` 確認 prop 名稱與型別
- prop 看似沒生效時，**第一個檢查的不是 specificity / CSS 寫法、而是 prop 名稱對不對**

違反這條的代價是 debug 時間爆增、commit history 變雜、使用者驗收挫折感累積。

### 鐵則 5：優先重用組件（Component Reuse）

動工任何新畫面與 UI 前，必須先呼叫/遵守 `component-reuse-checker` 技能（位於 `.agents/plugins/component-reuse-checker/skills/component-reuse-checker`）。

- 必須優先掃描 `src/components/` 並重用。
- 修改既有共用組件時必須用參數控制且不能影響其他引用者。
- 若會影響，需暫停並請示使用者是要新增 Domain 組件還是新共用組件。

### 鐵則 6：優先採用共用排版（Layout First）

開發任何新頁面或重構既有頁面時，必須先掃描 `src/components/Layout` 內所提供的排版模板（如 SingleColumn, TwoColumn, MasterDetail, Bento 等）做為開發頁面的基礎。

- **強制套用**：盡可能將內容套入適合的 Layout 組件插槽（slots）中，達到全站一致化。
- **提案新建**：若掃描後發現沒有適合的版型，**禁止在單一頁面內 hardcode 撰寫特定排版**，必須提出製作新的共用 Layout 組件並引入。

## 執行步驟

### 1. 讀 task brief

從 `agents/planning/tasks.md` 找到對應 `## <任務名稱>` 區塊，依 **Scope** 列出檔案清單。

### 2. 動工順序建議

1. **Schema 先寫**（schema 為 type 的單一來源 — 鐵則 3）
2. **utils / helper**（容易測、別人會依賴）
3. **service**（外部 IO 集中區）
4. **hook**（組合 service + store + reactive state）
5. **store / components / pages**
6. **server/api/**（特權操作）

### 3. 每檔流程

```text
讀現況 → 寫 / 改 → 同一輪寫單元測試 → verify → commit
```

非顯而易見的決策（A vs B vs C）→ 主動 `AskUserQuestion` → Q&A 記到當日 dev-log 的「詢問與裁決」區塊。

### 4. 模組邊界紀律

- 跨模組只能透過 barrel file import
- 禁止深 import：`import { fetchUsers } from '@/domains/users/services/...'` ❌
- 共用邏輯往下沉到 `domains/shared/` 或全域 `utils/`，不橫向 import

### 5. Security 紀律

- 特權操作（status / role / claims / audit-log）一律走 server route
- Server route 開頭必有 auth 檢查；需檢角色用對應 helper
- 軟刪除用 `deletedAt`（毫秒 timestamp），不真的 `remove()`
- 金錢 / 敏感欄位 endpoint 用 server-side source-of-truth，不信任 client 傳值

### 6. UI 紀律（動到視覺時）

先讀規範本體：[`ui-design.md`](conventions/ui-design.md) — 含 token 表、決策樹、a11y 14 點、反模式

共通紀律（不分新舊）：

- 顏色用 token、不 hardcode
- Icon 一律走專案約定的 library、禁 emoji 當圖示
- 狀態顯示用 icon + 文字 + 顏色 三重編碼
- 交給 **Sub-agent: ui-standardize** 依照規範本體做審查判別與執行

## 完成判定

- task.md 的 Scope 列出的檔案全動完
- 每個檔案都有對應的單元測試
- verify 全綠
- commits 已按邏輯切分（不混雜）

## 三 track 各自的特殊紀律

Leader 派工時會註明任務屬於哪條 track（A 新功能 / B 修改 / C 除錯）。除了上面共通紀律外：

### Track A（新功能）

照上面流程，無額外規定。

### Track B（修改需求）— 強調 regression

- 改檔案前先 Grep 找該檔案 / 該功能既有的測試
- 改完跑全部測試（不只新寫的），確認既有測試還綠
- 若有既有測試掛掉 → 判斷是該掛還是 regression：
  - 該掛（被取代）→ 同 commit 內更新或刪除該測試
  - regression（不該掛）→ 回 Leader 報告，可能要回 Step 2 重看 backward compat

### Track C（除錯）— 修 root cause、補 regression test

- 修 bug-report 的 **Root cause**，**不是症狀** — 在錯的層修只是讓 bug 換個地方爆
- 影響範圍清單上標 ⚠ 的位置一併修（不要只修主要那處）
- 同一輪寫 **regression test**（測「不再發生 bug」的 case）— 這是除了一般單元測試之外的額外測試
- regression test 命名建議：`it('regression: <bug 簡述>')` 或加 comment `// regression for <task id>`

## 接力

完成後 → 交給 **Sub-agent: code-reviewer**（dev-workflow Step 4）做 fresh-context 審查。派工時告訴它走哪條 track，它會啟動對應的額外檢查。
