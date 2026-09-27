# Code Review — 擴充 TestBaseUI 基礎組件測試

## 結論：⚠ 執行細節錯

## 必修（blocker）
- 無重大架構與資安 blocker。

## 建議（non-blocker）

### 1. BaseTable 的 Fallback Color
- 檔案：`src/components/UI/BaseTable.vue:L41,L50,L55`
- 問題：使用了 `var(--ion-color-light-shade, #ccc)`，雖然 `#ccc` 只是 Fallback，但仍應避免寫死 HEX 色碼，應確保主題變數齊全，或使用其他通用 Token。
- 建議修法：移除 `, #ccc`。

### 2. TableColumn 型別缺乏 JSDoc
- 檔案：`src/components/UI/BaseTable.vue:L26`
- 問題：`export interface TableColumn` 缺乏 JSDoc 描述。根據 AGENTS.md 鐵則，每一個 `export` 都應該有一句話描述語意。
- 建議修法：加上 `/** 定義基礎表格欄位的 Key 與顯示名稱 */`。

## 通過項

- ✅ 模組邊界：共用基礎 UI 正確放置於 `src/components/UI`，Domain 專屬包裝元件正確放置於 `src/domain/testBaseUI/components`。
- ✅ Security：純 UI 展示，無觸及敏感操作。
- ✅ UI 規範：元件內未使用 `!important` 且大量採用 `var(--ion-color-*)` 變數來適應主題。
- ✅ i18n 完整性：文字皆已透過 `$t` 及 `useI18n` 替換，且 `language.ts` 中的 `zh` / `en` 皆對稱存在。

## 給 Leader 的回路建議

- 執行細節錯 → 這些為 non-blocker 的優化建議，後續可在 dev-cycle 階段微調，但目前功能與架構已經可以進入驗收階段。
