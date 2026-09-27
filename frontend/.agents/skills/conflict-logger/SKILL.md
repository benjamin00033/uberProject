---
name: conflict-logger
description: >-
  Use this skill when encountering code conflicts, shared component modification risks, or ambiguity in implementation.
  It creates a conflict log and pauses execution for user decision.
---

# 衝突與決策記錄器 (Conflict Logger)

當你在開發過程中遇到以下情況，請**暫停修改**，並觸發本 Skill：
1. **影響範圍衝突**：你想修改的共用組件 (`src/components`) 或 Hook (`src/composables`) 正在被多個其他頁面使用，修改可能導致破版或邏輯損壞。
2. **實作衝突**：現有程式碼與使用者的需求有邏輯上的矛盾。
3. **規格不明確**：遇到需要人類判斷的「兩難」決策 (Trade-offs)。

## 執行步驟

### 1. 撰寫 Conflict Log
在 `.agents/conflict-logs/` 資料夾下建立一份 Markdown 檔案，命名規則為 `YYYY-MM-DD_HHmm_元件名稱或問題簡寫.md`。
(如果資料夾不存在，請直接使用寫檔工具，系統會自動建立)

內容必須包含以下區塊：
- **衝突點 (Issue)**：具體說明遇到什麼問題 (例如：`Header.vue` 被 `Home.vue` 與 `Menu.vue` 使用，但本次需求要求改變 Header 的高度)。
- **影響範圍 (Impact)**：若直接修改，會影響到哪些檔案？(條列出檔案清單)。
- **分析與選項 (Options)**：
  - [選項 A]：說明作法與優缺點 (例如：修改共用組件，並去其他頁面微調)。
  - [選項 B]：說明作法與優缺點 (例如：將該元件拆分為兩個獨立的 Variant)。
- **Agent 的建議 (Recommendation)**：你從工程架構的角度推薦哪個選項。

### 2. 詢問使用者 (Ask for Decision)
寫完 Log 後，請直接在對話中告知使用者你遇到衝突，並總結 Log 內的選項，**詢問使用者要採取哪一種方案**。

### 3. 等待裁決
在使用者回覆 (裁決) 之前，**絕對不可以**直接去改動會引發衝突的程式碼。
等到使用者回答後，請將使用者的決定更新進當天的 `dev-log` (寫在「詢問與裁決」區塊內)，然後再繼續執行原本的開發動作。
