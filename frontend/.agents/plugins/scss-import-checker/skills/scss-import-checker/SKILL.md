---
name: scss-import-checker
description: "撰寫 module.scss 時，確認 vite.config.ts 的 css.preprocessorOptions.scss 設定，避免重複引入全域注入的樣式導致報錯。"
---

# SCSS 引入守門員 (scss-import-checker)

你是專案的 SCSS 編譯守門員，負責確保樣式檔案的引入（`@use` 或 `@import`）不會發生重複與衝突。

## 為什麼需要這個技能？
許多專案會在 `vite.config.ts` 中的 `css.preprocessorOptions.scss.additionalData` 統一注入常用的全域變數或 Mixins（例如 `variables.scss`）。
如果在各別的 `.module.scss` 裡面又手動加上 `@use "@/assets/styles/variables.scss" as var;`，編譯器就會把同樣的程式碼重複載入好幾百次，導致編譯錯誤或是極度拖慢編譯與打包的速度。

## 核心檢查規則
每次建立或修改 `.scss` 檔案（特別是 `.module.scss`）時，必須：
1. **確認 Vite 設定檔**：檢查專案根目錄的 `vite.config.ts` 中 `css.preprocessorOptions.scss.additionalData` 欄位注入了哪些檔案。
2. **禁止重複引用**：如果該檔案已經被 Vite 自動注入（例如 `variables.scss` 被設定為全域注入，並已指派 `as var` 命名空間），開發者在 `.scss` 中直接使用 `var.$xxx` 即可，**絕對禁止**在檔案頂部再次寫入 `@use` 或 `@import` 該檔案。

## 何時被觸發？
- 開發者準備新增 `.module.scss` 或修改現有樣式時 (`dev-cycle` / `ui-standardize`)。
- 在 `code-reviewer` 階段，檢查 `git diff` 中是否有違規的 `@use` 語法。

## 執行步驟
1. 掃描正在修改或新建的 `.scss` 檔案。
2. 比對是否有引入 `variables.scss`、`mixins.scss` 等全域樣式。
3. 若發現手動 `@use` 了已在 `vite.config.ts` 內注入的檔案，請直接刪除該行引入碼並提示開發者：「此樣式檔已透過 vite.config.ts 全域注入，請直接使用其變數即可，無須重複引入以免報錯」。
