---
name: i18n-generator
description: >-
  Use this skill to build translation features (i18n) for a specified page. 
  It checks the format of src/locale/language.ts, generates new translation keys, 
  and applies them to the target Vue component.
---

# 國際化翻譯建立器 (i18n Generator)

當使用者要求「幫 XX 頁面加入多國語系」或「建立翻譯語系功能」時，請執行此 Skill。

## 執行步驟

### 1. 分析目標頁面
首先使用 `view_file` 讀取使用者指定的頁面 (`.vue` 檔)，找出所有寫死的中文或外文靜態文字 (包含 Template 內的文字，以及 Script 內如 Toast / Alert 顯示的訊息)。

### 2. 檢查與定義 `language.ts`
使用 `view_file` 讀取 `src/locale/language.ts`。
觀察其格式，目前是將所有的翻譯集中管理，以語言 (`zh`, `en`) 作為第一層，第二層為領域 / 頁面名稱 (例如 `modifierGroup`, `menuItem`)。

為目標頁面構思合適的 JSON 結構 (例如：`[domainName].page.title`, `[domainName].form.save`)。

### 3. 更新 `language.ts`
使用 `multi_replace_file_content` 工具修改 `src/locale/language.ts`，必須**同時**加入 `zh` (中文) 與 `en` (英文) 的翻譯節點，保持兩邊結構對稱。

### 4. 替換 Vue 頁面內的文字
使用修改檔案的工具，將目標 `.vue` 頁面內的寫死文字替換為 i18n 呼叫：
- **Template 內**：改用 `$t('domainName.key')`
- **Script 內**：引入 `const { t } = useI18n()`，並改用 `t('domainName.key')`
*(注意：需要加上 `import { useI18n } from 'vue-i18n'`)*

### 5. 日誌紀錄 (Log Manager)
翻譯功能套用完畢後，呼叫 `log-manager` Skill：
- 建立一份 `task-log`，記錄您新增了哪些語系 Key，以及套用到哪一個頁面。
- 更新今日的 `dev-log`，將這項國際化工程紀錄在「完成」區塊中。
