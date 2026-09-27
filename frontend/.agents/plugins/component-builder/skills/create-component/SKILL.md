---
name: create-component
description: >-
  Use this skill to create global UI components in src/components.
  It ensures the usage of Ionic Framework elements and enforces the ui-standardize rules.
---

# 全域共用組件建立器 (Component Builder)

當使用者要求「建立一個共用的 UI 組件」時，請執行此 Skill 於 `src/components` 底下產出。

## 執行步驟

### 1. 衝突與影響範圍評估
如果是「修改」已存在的組件，請務必使用 `grep_search` 掃描該組件在專案中被哪些頁面使用。
如果發現修改會破壞其他頁面，或者實作上與現有邏輯有重大衝突，請**停止直接修改**，並強制呼叫 `conflict-logger` Skill 記錄下來，等待使用者裁決。

### 2. 選用 Ionic Framework
優先使用 `@ionic/vue` 提供的原生組件 (例如：`<ion-card>`, `<ion-button>`, `<ion-input>` 等) 來進行組合，不要徒手寫原生的 `<button>` 或 `<input>` 以確保樣式與手勢體驗一致。

### 3. 確保樣式紀律 (ui-standardize)
- 必須建立 `.vue` 與專屬的 `.module.scss`。
- 在 SCSS 頂端引入全域 Tokens (例如 `variables.scss`)。
- 不寫死顏色、字體與間距，全面使用 `@layer components` 與 CSS Modules。

### 4. 撰寫檔案
將 `.vue` 檔案產出至 `src/components/` 資料夾內。
為了確保易用性，請在 `<script setup lang="ts">` 寫好明確的 `defineProps` 與 `defineEmits` (包含 TypeScript 型別定義)。

### 5. 日誌紀錄 (Log Manager)
執行完成後，呼叫 `log-manager` 產出對應的 `task-log` 並更新 `dev-log`。
