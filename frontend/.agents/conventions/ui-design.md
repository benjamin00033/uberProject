# UI 設計規範（SCSS Module 版）

鐵則 6 — UI 一律走 SCSS variables 與 CSS Modules，不寫死顏色、不污染全域、不用 emoji 當圖示。這份是通用精簡版，依專案的設計系統與 SCSS 架構擴充。

## 核心原則

1. **Variables 是單一資料來源** — 顏色、間距、字體、圓角全部從全域變數（如 `variables.scss`）引入，不在單一元件內 hardcode 數值。
2. **邏輯與樣式強制分離** — 嚴格遵循樣式模組化，將樣式抽離至 `.module.scss`，不將大量 CSS 塞在 Vue SFC 內。
3. **嚴禁使用 Inline Style** — 在 Vue Template 中千萬不要使用 `style="..."` 硬寫內容，必須寫成 class 來應用。
4. **三重編碼狀態** — 重要狀態用 **icon + 文字 + 顏色** 三件一起，不靠單一顏色傳達（色盲友善）。
5. **a11y 不是 nice-to-have** — 對比度、focus-visible、aria-label、prefers-reduced-motion 都要顧。
6. **層級與權重有序** — 透過 `@layer` 管理優先級，不參與權重軍備競賽，嚴禁濫用 `!important`。
7. **共用設計驅動 (Shared Design Driven)** — 撰寫 SCSS 時，應以共用設計為主要開發方式。強制搭配 `src/assets/styles/mixins.scss` 提供的 Mixins 與 `src/constants/variables.js` 定義的參數來設計組件與介面，以提升介面的可維護性與開發效率。
8. **避免重複引入全域變數** — 撰寫 `module.scss` 內容時，需先確認 `vite.config.ts` 中的 `css.preprocessorOptions.scss` 欄位（如 `additionalData`）。若全域變數已被 Vite 自動注入，則禁止在個別樣式檔內重複引入，避免編譯報錯。

## SCSS Module 與變數用法

```vue
<template>
  <button :class="$style.primaryBtn">送出</button>
</template>

<style lang="scss" module src="./Button.module.scss"></style>
```

```scss
/* Button.module.scss */
/* 備註：variables.scss 已在 vite.config.ts 中透過 additionalData 全域注入，請勿再次 @use */

@layer components {
  .primaryBtn {
    background-color: var.$color-primary;
    color: var.$color-primary-foreground;
    border-radius: var.$radius-md;

    &:hover {
      background-color: rgba(var.$color-primary, 0.9);
    }
  }
}
```

```scss
/* ❌ Hardcode 顏色與數值 (Anti-pattern) */
.primaryBtn {
  background-color: #0ea5e9; /* ❌ 直接寫死色碼 */
  color: white;
  border-radius: 7px; /* ❌ 沒邏輯的數字 */
}
```

| 類別 | SCSS 變數範例                                      | 不要 hardcode                        |
| ---- | -------------------------------------------------- | ------------------------------------ |
| 顏色 | `var.$color-primary`、`var.$color-text-foreground` | `color: #333`、`background: #0EA5E9` |
| 間距 | `var.$spacing-sm`、`var.$spacing-lg`（級距內）     | `margin-top: 17px` 沒邏輯的數字      |
| 圓角 | `var.$radius-md`、`var.$radius-lg`（級距內）       | `border-radius: 5px`                 |
| 字體 | `var.$font-size-sm`、`var.$font-size-base`         | `font-size: 15px`                    |

## Icon

- 用一套統一的 icon library（如 lucide、heroicons 或專案內建 SVG 元件），一個專案不要混用兩套以上。
- **不用 emoji 當圖示** — emoji 在不同 OS / 瀏覽器渲染不一致、不能調色、不能精準調大小。
- icon-only 按鈕要有 `aria-label`。
- 狀態類 icon 一定配文字：`<CheckIcon /> 已完成` 而不是只放 `<CheckIcon />`。

## 元件決策樹

遵循 Atomic Design（原子設計）的分類原則，新元件的決策順序：

```text
1. 既有 Design System (Atoms/Molecules) 有現成元件 → 直接組合使用
                ↓ 沒有
2. headless 元件庫有 primitive → 自組並將樣式封裝至 components/atoms/ 或 components/molecules/
                ↓ 沒有
3. 業務專屬 UI → 建立 `.vue` + `.module.scss` 放在 domains/<x>/components/
                ↓ 真的必要
4. 自行從零刻畫基礎元件（需確保 SCSS variables 完全對齊設計規範）

```

判斷尺：

- `components/atoms/` & `molecules/` — 純展示、無業務邏輯（BaseButton、FormInput）。
- `domains/<x>/components/` — 業務專用（UserProfileCard、OrderDataTable）。
- 業務邏輯不可放基礎元件內（會把業務概念漏到通用層）。

## A11y 必查 14 點

提交 / review 前自查：

1. [ ] 對比度 ≥ 4.5:1（一般文字）/ ≥ 3:1（大字 / icon）
2. [ ] `:focus-visible` 樣式看得到（不要 `outline: none` 沒補其他 focus 提示）
3. [ ] Tab 順序跟視覺一致
4. [ ] 表單 `<label>` 用 `for` 對應 input id
5. [ ] 錯誤訊息加 `role="alert"`
6. [ ] Dialog 開啟時 focus trap、Esc 可關
7. [ ] Icon-only 按鈕有 `aria-label`
8. [ ] 表格用正確 `<thead>` / `<tbody>` / `<th scope="col">`
9. [ ] `prefers-reduced-motion` 有遵守（動效 ≤ 250ms、可關）
10. [ ] 狀態不靠單一顏色傳達（含 icon / 文字 / 圖案）
11. [ ] 連結文字有意義（避免 "click here"）
12. [ ] heading 階層正確（h1 → h2 → h3，不跳）
13. [ ] 圖片 `alt`（裝飾性圖用 `alt=""`）
14. [ ] 觸控目標 ≥ 44×44 px

## 反模式

| 反模式                                  | 改成                                      |
| --------------------------------------- | ----------------------------------------- |
| 寫死 `color: #999` 當說明文字           | 走語意變數 `color: var.$color-text-muted` |
| 直接在 `.vue` 塞幾百行 `<style scoped>` | 抽離為 `[name].module.scss`               |
| 動畫 duration > 300ms                   | ≤ 250ms                                   |
| filled input 再加 border                | 二擇一                                    |
| 用 `!important` 蓋既有樣式              | 調整 `@layer` 順序或降低 CSS 選擇器權重   |
| 巢狀選擇器過深 (`.a .b .c span`)        | 利用 CSS Modules 扁平化 class 命名        |
| 用色階差表達狀態（只用顏色）            | 顏色 + icon + 輔助文字                    |

## 動 UI 的紀律

### 新元件 / 改視覺結構

1. 先看 components 目錄下有沒有現成的原子 / 分子元件。
2. 對照「元件決策樹」決定新檔案放哪。
3. 建立 `[name].vue` 與 `[name].module.scss`。
4. 動筆前先想 a11y 14 點清單會涉及哪些。
5. 寫完自查 14 點與「層級權重」是否正確。

### 只改邏輯 / props（不動視覺）

1. 直接改 Vue SFC 內的邏輯。
2. 跑 verify / 單元測試確認全綠。

### 共通

- 顏色 / 間距 / 圓角一律從 SCSS Variables 引入。
- 樣式一律走 `.module.scss` 並綁定 `$style`。
- Icon 一律走專案約定的 library、不用 emoji 當圖示。
