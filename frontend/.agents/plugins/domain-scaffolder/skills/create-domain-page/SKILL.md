---
name: create-domain-page
description: >-
  Use this skill to scaffold a new domain or add a new page to an existing domain.
  It automates the creation of standard folder structures (components, pages, services, etc.)
  and basic boilerplates using the domain scaffolder script.
---

# Create Domain Page Pipeline

當使用者要求「建立新的 Domain」或「在 Domain 中新增頁面」時，請執行此 Skill 來保持專案架構一致。

## 執行步驟

### 1. 執行 Scaffold Script
這支腳本會自動建立標準目錄 (`components`, `composables`, `pages`, `services`) 與 `types.ts`, `routes.ts`，並產生 Vue 元件。

請使用 terminal 執行以下指令 (Node.js 腳本)：

```bash
node .agents/plugins/domain-scaffolder/scripts/scaffold.mjs <Domain名稱> [Page名稱]
```
*(注意：若只建立 Domain，可不填 Page名稱。)*

### 2. 更新 Vue Router
如果腳本有產出路由設定建議，請手動將新的 Route 設定加入到對應 Domain 的 `routes.ts` 中。

### 3. 確保樣式紀律 (SCSS Standardize)
若有建立 `.vue` 檔與對應的 `.module.scss`，腳本已自動引入 `@use '@/assets/styles/variables.scss'` 等全域變數。
請進一步確保樣式開發依照 `ui-standardize` 規範：
- 使用 CSS Modules (`<style module lang="scss">`) 徹底抽離。
- 取用 `src/assets/styles/` 中的標準色系與間距 Token。
- 透過 `@layer` 控制樣式優先級。

### 4. 檢查共用模組 (避免重複造輪子)
在實作新頁面的邏輯與畫面時，請務必先進行掃描，絕對不要重複造輪子：
- **Utils**：掃描 `src/utils/` 資料夾 (如 `api.util.ts`)。
- **Components**：掃描 `src/components/` 確保是否已經有全域的 UI 組件可以使用。
- **Composables/Hooks**：掃描 `src/composables/` 是否已有對應的狀態管理邏輯，並優先考慮使用官方的 `@vueuse/core` 函式庫。

### 5. 驗證與回報
使用 `list_dir` 檢查新建的資料夾，並告知使用者 scaffolding 完成。

### 6. 日誌紀錄 (Log Manager)
執行完成後，請呼叫 `log-manager` Skill：
- 建立一份 `task-log`，記錄您剛剛建立的 Domain 或 Page 名稱、加入的 Routes 等。
- 更新今日的 `dev-log`，把這項任務紀錄在「完成」區塊中。
