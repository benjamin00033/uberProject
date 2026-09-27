# NestJS Enterprise Agent System (`.agents/`)

本目錄包含 Antigravity AI Agent 於本 NestJS 後端專案中的全套架構規範、開發工作流 (Dev-Workflow Pipeline)、高內聚外掛 (Plugins)、技能 (Skills) 與子代理人 (Subagents) 配置。

---

## 📁 系統目錄導覽 (System Architecture)

```text
.agents/
├── rules/
│   └── GEMINI.md                  # 最高指導原則 (含 JWT Cookie、解耦 Crypto、DB 搜尋優化、統一資料傳遞格式規約)
├── conventions/                   # 開發規約與設計指南
│   ├── architecture.md            # Enterprise NestJS DDD 分層架構規約
│   ├── dev-workflow.md            # 開發工作流 Pipeline SOP (Step 0 ~ Step 7)
│   ├── data-format-standards.md   # ★ 統一資料傳遞格式規範 (Response / Error / Pagination / Enum / SSE / Socket.IO / Timestamp / Token)
│   ├── auth-security-standards.md # JWT 身分認證與 HTTPOnly Cookie 安全標準
│   ├── database-optimization.md   # DB B-Tree 索引、搜尋與排序演算法指南
│   ├── communication-strategy.md  # HTTP REST vs SSE vs Socket.IO 實時通訊決策指南
│   ├── backend-design.md          # REST / SSE / Socket.IO / DB Sync / 回應格式設計規範
│   ├── commit-message-format.md   # Conventional Commits + Emoji 提交格式
│   ├── jsdoc-format.md            # TypeScript NestJS JSDoc 語意化註解標準
│   └── testing-guidelines.md      # Unit Test (Jest) & E2E Test (Supertest) 測試標準
├── plugins/                       # ★ 模組化獨立 Plugin 庫 (含 conventions, templates, scripts, skills)
│   ├── module-scaffolder/         # DDD 業務模組 (src/modules/<feature>) 腳手架 Plugin
│   ├── dto-validator-generator/   # DTO 驗證器 (class-validator) 生成 Plugin
│   ├── auth-security-builder/     # JWT + HTTPOnly Cookie 認證系統生成 Plugin
│   ├── crypto-vault-builder/      # 解耦/可 Debug 加解密與 Hash 服務生成 Plugin
│   ├── db-query-optimizer/        # DB 搜尋/排序/分頁優化 DTO 生成 Plugin
│   ├── socket-gateway-builder/    # Socket.IO WebSocket 閘道生成 Plugin
│   ├── sse-stream-builder/        # SSE 單向即時推播 Controller 生成 Plugin
│   ├── plugin-wrapper-builder/    # 第三方 SDK (src/plugins/) 外掛包裝 Plugin
│   ├── shared-module-builder/     # 共享實體模組 (src/shared/) 生成 Plugin
│   ├── exception-filter-builder/  # 自訂 Exception 與 AllExceptionsFilter 生成 Plugin
│   └── project-scanner/           # 全域 NestJS 代碼度量與架構掃描 Plugin
├── skills/                        # 核心開發與驗證技能 Skill 庫
│   ├── needs-analysis/            # Step 2: 需求與架構變更分析
│   ├── communication-evaluator/   # Step 2: 傳輸協定評估 (HTTP vs SSE vs Socket.IO)
│   ├── dev-cycle/                 # Step 3: 邏輯實作與單元測試 (*.spec.ts)
│   ├── nestjs-standardize/        # Step 3.5: NestJS 架構、資料格式合規與品質校驗
│   ├── code-reviewer/             # Step 4: 獨立 Context 程式碼、資安與資料格式審查
│   ├── spec-tester/               # Step 5: Supertest E2E 整合驗收測試
│   ├── conflict-logger/           # 架構/Schema 衝突報告與評估
│   └── log-manager/               # 開發日誌與任務進度記錄
├── agents/                        # 專屬 Subagents 定義檔
│   ├── code-reviewer.md           # Code Reviewer Subagent Prompt
│   ├── spec-tester.md             # E2E Spec Tester Subagent Prompt
│   ├── nestjs-architect.md        # NestJS Enterprise Architect Subagent Prompt
│   ├── security-auditor.md        # OWASP Security Auditor Subagent Prompt
│   └── database-optimizer.md      # Database Query & Indexing Optimizer Subagent Prompt
├── templates/                     # 任務、變更、Bug 回報與 Dev Log Markdown 範本
└── planning/                      # 任務規劃與 tasks.md 主檔
```

---

## 🚀 完整開發 Pipeline (Step 0 ~ Step 7)

```text
[Step 0 & 1: 任務判斷]
    ↓
[Step 2: needs-analysis + communication-evaluator + 資料格式規劃]
    ↓
[Step 3: dev-cycle + Plugins (auth/crypto/query/module) + 格式基礎建設 (interfaces/enums/interceptor/filter)]
    ↓
[Step 3.5: nestjs-standardize (架構 + 資料格式合規 14 項檢查)]
    ↓
[Step 4: code-reviewer (8 大審查含格式合規) & database-optimizer]
    ↓
[Step 5: spec-tester (問使用者) — 驗證回應格式/Error Code/分頁]
    ↓
[Step 6 & 7: log-manager & Commit]
```

所有的開發與修改，均嚴格遵守 [dev-workflow.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/dev-workflow.md) 之依序接力規範。

---

## 📐 統一資料傳遞格式速查 (Data Format Quick Reference)

> 完整規範：[data-format-standards.md](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md)

| 格式類型 | 介面 | 關鍵欄位 |
| :--- | :--- | :--- |
| 成功回應 | `IApiResponse<T>` | `success`, `statusCode`, `message`, `data`, `meta` |
| 錯誤回應 | `IApiErrorResponse` | `errorCode` (`<DOMAIN>_<ERROR_TYPE>`), `errors?` |
| 分頁回應 | `IPaginatedResponse<T>` | `pagination` (Offset/Cursor) |
| SSE 事件 | `ISseEvent<T>` | `type`, `data`, `timestamp`, `sequence` |
| WS 事件 | `IWsServerEvent<T>` | `event`, `data`, `timestamp`, `roomId?` |
| WS Ack | `IWsAckResponse<T>` | `success`, `errorCode?`, `message` |
| Token | `IAccessTokenPayload` | `sub`, `email`, `role`, `iat`, `exp` |
| Error Code | `ErrorCode` 常數 | `AUTH_*`, `VALIDATION_*`, `RESOURCE_*` |
| Enum | `XxxEnum` | UPPER_SNAKE_CASE 值 |
