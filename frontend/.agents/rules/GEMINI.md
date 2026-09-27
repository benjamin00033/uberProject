---
trigger: always_on
description: 確保 Agent 在開發與產出任何內容時，嚴格遵守專案的 Dev-Workflow
---

## Agent Instructions 指南

此為跨 AI Coding 工具（如 Cursor / Codex / Copilot / Gemini / Claude 等）共用的專案規範。

## 開工前必讀

- `@agents/README.md`
- `/conventions/dev-workflow.md`

## Project Overview

此專案為個人的公司客戶管理系統 ERP。

## Tech Stack

- 語言 / 執行環境：TypeScript, Node.js 20
- 主要 framework：Vue.js
- 狀態管理：Pinia
- 樣式 / UI：Ionic
- 測試：Vitest
- Lint / Type：lint
- Package Manager：pnpm
- 部署：Docker

## Build & Test

- 安裝：`pnpm i`
- 開發：`pnpm run dev`
- 型別檢查：`<typecheck 指令>`
- Lint：`<lint 指令>`
- 測試：`<test 指令>`
- 全套驗證（commit 前要過、需全綠）：`<verify 指令>`
- 打包：`pnpm run build`

## 核心開發與樣式守則 (Agent Core Behavior)

這是 Antigravity Agent 的最高指導原則。在進行任何程式碼撰寫、修改或建立新內容前，你**必須**嚴格遵守以下三大規範：

### 1. 嚴格遵守 Dev-Workflow (開發工作流)

專案的開發不是一蹴可幾，你必須依照 `AGENTS.md` 的規範，**完整且依序地實際呼叫 `.agents/skills` 中的對應技能**。你絕對不可跳過任何階段，也**不准靠自己一次把程式碼寫完**：

- **Step 0 & 1 (任務分析)**：釐清任務是 A (新功能)、B (變更) 還是 C (除錯)。若是 B (變更) 或 C (除錯) 任務，必須先全面檢索現有程式碼與上下文，徹底了解脈絡後再進行後續操作。
- **Step 2 (needs-analysis)**：必須先呼叫 `.agents/skills/needs-analysis` Skill 釐清需求與產出 task brief。
- **Step 3 (dev-cycle)**：拿到 Step 2 的 brief 結果後，必須呼叫 `.agents/skills/dev-cycle` Skill 進行實作與單元測試。
- **Step 3.5 (locale-manager)**：完成實作後，必須呼叫 `.agents/plugins/locale-manager` 內的對應技能（如 `i18n-generator`），確認並檢查多語系是否完整運用與實作。
- **Step 4 (code-reviewer)**：拿到前面步驟的開發與語系結果後，必須呼叫 `.agents/skills/code-reviewer` Skill 進行架構與資安審查。
- **Step 5 (spec-tester)**：拿到 Step 4 的審查結果後，**必須先詢問使用者**是否需要進行驗收測試，獲得同意後才呼叫 `.agents/skills/spec-tester` Skill 進行測試。

**🚨 極度重要警告**：你必須**真實地**去執行上述的 Skills。工作流程必須「接力」進行：**必須等待前一個 Skill 執行完畢並拿到結果後，才能將結果交給下一個 Skill 繼續執行**。不允許在單一回合內略過這些把關機制直接憑空產出程式碼。

#### 📌 日誌與衝突防護機制 (Logging & Conflict Handling)

在執行 Dev-Workflow 的過程中，你必須根據實際情況搭配對應的 Log 機制：

1. **任務進度更新 (`log-manager`)**：當完成任何子任務、模組開發或結束當前工作段落時，必須呼叫 `log-manager` Skill，將詳細改動內容寫入專屬的 `task-logs`，並將總結更新到當日的 `dev-logs` 檔案中。
2. **遭遇衝突與阻礙 (`conflict-logger`)**：如果在修改共用組件、牽涉多個頁面邏輯時發現影響範圍過大、存在潛在破版風險、或需求規格發生矛盾時，**絕對禁止硬改**。必須立即暫停動作，並呼叫 `conflict-logger` Skill 產出衝突報告，並在對話中等候使用者裁決後才能繼續。

### 2. 嚴格遵守 UI 樣式標準 (ui-standardize)

在製作或修改任何前端畫面 (如 `.vue` 檔、`.scss` 檔) 時，你**必須**無條件套用 `.agents/skills/ui-standardize` 技能內的鐵則：

- **禁止 Hardcode**：絕對不允許在樣式中寫死顏色代碼 (如 `#FFF`) 或無意義的間距數字，必須使用 `src/assets/styles` 內的 Design Tokens。
- **樣式隔離**：必須使用 CSS Modules (`<style module lang="scss">`) 將樣式抽離，避免全域污染。
- **優先順序**：使用 `@layer` 來建立有序的介面層疊。
- **禁止 Inline Style**：在 `.vue` 的 template 中千萬不要使用 `style="..."` 硬寫內容，必須寫成 class 來應用。
- **禁止重複引入 SCSS 變數 (scss-import-checker)**：在建立或修改 `.scss` 檔時，必須遵守 `scss-import-checker` 技能。若樣式檔（如 `variables.scss`）已在 `vite.config.ts` 的 `additionalData` 注入，**絕對禁止**在檔案內再次使用 `@use` 或 `@import` 引入，以防編譯錯誤。

### 3. 精準搜尋與範圍確認 (Precise Search & Scope Validation)

往後所有的製作內容 (無論是新功能、修改或除錯) 都需要經過以下規範的流程來做到精準搜索與完整修改：

- **程式碼結構搜尋**：必須優先進行精準的程式碼結構與模式搜尋，而非僅依賴全文比對。在修改程式碼前，必須徹底確認影響範圍與現有實作。
- **嚴禁盲目猜測**：所有的修改都必須建立在「已經徹底搜索過現有程式碼與上下文脈絡」的基礎上，確保修改是完整且無遺漏的。

---

## Code Style

- **命名一致**：依專案約定。
- **JSDoc**：每個 `export` 需補上一行 JSDoc 描述語意 — 詳見 [`agents/conventions/jsdoc-format.md`](agents/conventions/jsdoc-format.md)。
- **架構規範**：參閱 `agents/conventions/architecture.md` (Modular Structure 模組邊界規則)。
- **提交規範**：參閱 `agents/conventions/commit-message-format.md` (Conventional Commits + emoji)。
- **UI/A11y 規範**：參閱 `agents/conventions/ui-design.md`。

## Testing Rules

- 改 code 跟補測試必須在同一輪做完（拖了就會變成「為了 pass 而 pass」）。
- 必須 verify 全綠才能 commit。

## Git Workflow

- 一個邏輯改動一個 commit。
- commit / push 前，必須在 `agents/dev-logs/<YYYY-MM-DD>.md` 新增 / 更新當日日誌。
- Commit message 格式強制使用 Conventional Commits 標準。

## Security

- Secret / API key / token / 密碼絕對不可寫進 code 內，也不可 commit。
- `.env` 不 commit；`.env.example` 只保留空白範本。
- （其餘視專案 auth/authz 與金流邊界需求補充）

## 明確排除的事

- 不引入 `<某類功能>`，原因：`<原因>`
- 不使用 `<某個技術>`，原因：`<原因>`
