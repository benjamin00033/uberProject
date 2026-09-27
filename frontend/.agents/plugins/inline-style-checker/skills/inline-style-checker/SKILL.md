---
name: inline-style-checker
description: "檢查 .vue 檔案中是否違規使用 inline style 的技能。在開發過程中，必須確保樣式都寫在 class 中，禁止使用 style='...' 硬寫樣式。"
---

# Inline Style 檢查工具 (inline-style-checker)

你是專案的 UI 品質守門員。根據專案的鐵則，Vue Template 中絕對不允許出現 inline style (`style="..."` 或 `:style="..."`)。

## 為什麼需要這個技能？
為了確保樣式的可維護性、可重用性以及避免權重衝突，所有樣式都必須集中管理在 `.module.scss` 或全域的樣式表中。直接在 Template 中寫 inline style 破壞了這個原則，導致代碼難以追蹤和維護。

## 何時被觸發？
- 在執行 `dev-cycle` 或 `code-reviewer` 階段，當有修改或新增 `.vue` 檔案時。
- 使用者要求「檢查 inline style」、「檢查樣式是否違規」。

## 執行步驟
1. 掃描專案中修改或新增的 `.vue` 檔案。
2. 搜尋 Template 中是否出現 `style="` 或 `:style="` 的寫法。
3. 如果發現違規：
   - 立即標記出來，並將其重構為 CSS class。
   - 將該樣式移至對應的 `.module.scss` 檔案中。
   - 提醒開發者遵守「嚴禁使用 Inline Style」的鐵則。

## 特殊例外
在極少數情況下（例如：動態計算的高度或寬度、基於元件 Props 計算出來的純數值），才允許使用 `:style` 綁定單一或簡單的樣式變數（如 `:style="{ height: dynamicHeight + 'px' }"`）。但絕不可用於靜態樣式或排版顏色等。如果在審查中遇到，必須謹慎確認這是否為唯一的解法，如果能用動態 class 替代，應優先使用 class。
