# uberMenu - Agent Instructions

跨 AI Coding 工具共用的專案規範。CLAUDE.md 透過 `@AGENTS.md` 把這份接進去；Cursor / Codex / Copilot / Gemini CLI 等工具直接讀這份。

## 開工前必讀

- [README.md](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/README.md)
- [dev-workflow.md](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/conventions/dev-workflow.md)

## Project Overview

此專案為菜單管理與動態表單建置系統 (uberMenu)。主要包含菜單領域 (Menu Domain)、動態表單領域 (Dynamic Form Domain) 以及測試基礎 UI 頁面 (Test Base UI) 等模組。

## Tech Stack

- 語言 / 執行環境：TypeScript, Node.js 20+
- 主要 framework：Vue 3 + Ionic Vue (`@ionic/vue`) + Vue Router
- 狀態管理：Pinia
- 資料擷取與快取：@tanstack/vue-query (Vue Query)
- 樣式 / UI：Ionic Vue (Vanilla CSS / SCSS)
- 測試：Vitest + @vue/test-utils
- 驗證：Zod
- Package Manager：pnpm

## Build & Test

- 安裝：`pnpm install`
- 開發：`pnpm run dev`
- 型別檢查：`npx vue-tsc --noEmit`
- Lint：`pnpm run lint`
- 測試：`npx vitest run`
- 全套驗證：`pnpm run lint && npx vue-tsc --noEmit && npx vitest run`
- 打包：`pnpm run build`

## Architecture

採 Modular Structure（業務模組化）— 每個業務模組自帶內部結構，對外只透過 barrel file 公開介面。詳見 [`.agents/agents/conventions/architecture.md`](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/conventions/architecture.md)。

## Development Workflow

採 **Agentic Engineering** 流程，三 track 對應三類開發任務。Leader（主 agent）每次任務開頭先做 **Step 0 — 判斷任務類型**：

| 類型     | 觸發訊號                                    | Track | 產出 brief                           |
| -------- | ------------------------------------------- | ----- | ------------------------------------ |
| 新功能   | 「想做 X」「加上 X」「需求是 X」            | A     | `.agents/agents/templates/task.md`           |
| 修改需求 | 「把 X 改成 Y」「X 加排序」（既有功能調整） | B     | `.agents/agents/templates/change-request.md` |
| 除錯     | 「X 壞了」「點 X 沒反應」「報錯：」         | C     | `.agents/agents/templates/bug-report.md`     |

四個員工跨三 track：

- `needs-analysis`（Skill）— Step 2 需求 / 變更分析 / bug triage
- `dev-cycle`（Skill）— Step 3 開發週期紀律
- `locale-manager`（Plugin）— Step 3.5 確認多語系完整運用與實作
- `code-reviewer`（Skill）— Step 4 fresh-context review
- `spec-tester`（Skill）— Step 5 acceptance → 整合測試（需先詢問使用者是否同意執行）

完整流程、Step 0 判斷尺、員工配置、回滾決策表見 [`.agents/agents/conventions/dev-workflow.md`](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/conventions/dev-workflow.md)。

## Code Style

- 命名一致（依專案約定）
- 每個 `export` 補一行 JSDoc 描述語意 — 詳見 [`.agents/agents/conventions/jsdoc-format.md`](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/conventions/jsdoc-format.md)

`.agents/agents/conventions/` 內可保留 / 移除的慣例：

- `architecture.md` — Modular Structure 模組邊界規則
- `commit-message-format.md` — Conventional Commits + emoji
- `ui-design.md` — UI token / a11y 規範

## Testing Rules

- 改 code 跟補測試在同一輪做完（拖了就會變成「為了 pass 而 pass」）
- verify 全綠才能 commit

## Git Workflow

- 一個邏輯改動一個 commit
- commit / push 前在`.agents/agents/dev-logs/<YYYY-MM-DD>.md` 新增 / 更新當日日誌

commit message 格式建議走 Conventional Commits（範例 + emoji 對照表見 [`.agents/agents/conventions/commit-message-format.md`](file:///C:/Users/benja/Desktop/project/uberMenu/.agents/agents/conventions/commit-message-format.md)）。

## Security

基本通則：

- secret / API key / token / 密碼不寫進 code、不 commit
- `.env` 不 commit；`.env.example` 只放空白範本

## 明確排除的事

- 不在非非同步處理中使用 ad-hoc state
- 不做過度設計與超出 Scope 的需求開發
