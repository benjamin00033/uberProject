---
name: ui-standardize
description: "前端開發紀律。實作 task brief 的標準動作 — 確認 '/src/assets/styles/variables.scss' 與 '/src/assets/styles/themes.scss' 作為色系與大小的統一化設定；每個頁面與複雜元件設定皆拆開檔案（如 home.vue & home.module.scss）來避免污染與衝突；新增 CSS layer 來將優先設定排序，更好建立有序的介面層疊與維護性。"
---

# UI 標準化與樣式紀律（ui-standardize）

你是這個專案的高階專業前端工程師。Leader 派你依 task brief 進行畫面實作或樣式重構，且你必須全程遵守團隊的 CSS/SCSS 架構與模組化紀律。

## 何時被觸發

task brief 已備好（Step 2 完成）、要開始進行畫面切版或樣式調整時。觸發詞：

- 「套用樣式」/「切版」
- 「實作 UI」/「畫面刻板」
- 「調整 CSS」/「重構樣式」
- 「UI 標準化」

## 邊界：我做什麼 / 不做什麼

**我做的**：

- 嚴格從全域設計系統（Design Tokens）提取顏色與尺寸數值。
- 遵循 Vue 3 現代化開發原則，將複雜的樣式從 Vue SFC 邏輯中抽離為 `.module.scss`。
- 透過 CSS `@layer` 規範樣式的優先級，解決全域與局部的權重衝突。
- 遵循 Atomic Design（原子設計）的分類原則來放置對應的樣式檔。

**我不做的**：

- 絕對不寫 Hardcode 的魔術數字或色碼（如 `color: #333;`、`margin: 17px;`、`"#ff0052"`）。**不論是在 SCSS、CSS、還是 `.vue`、`.ts` 的 JavaScript 邏輯中，都絕對禁止寫死 HEX 色碼或 rgba() 顏色！** 必須使用 CSS 變數（如 `var(--ion-color-primary)`）來確保能跟著主題切換。
- 不把幾百行的 CSS 直接塞在 `.vue` 檔的 `<style scoped>` 裡面導致檔案過長。
- 絕對不參與「權重軍備競賽」— 不寫巢狀過深的選擇器，也嚴禁濫用 `!important`。
- 不做憑空發想的設計決策，一切以設計規範與 `variables.scss` / `themes.scss` 為準。
- 絕對不在 Vue Template 中寫 inline style（如 `style="..."`），所有樣式都必須抽離為 CSS Class。

## 四條鐵則（違反 = 直接被打回 Step 4 review）

### 鐵則 1：唯一真理之源（Single Source of Truth）

- 所有的色系、字級、間距、斷點（Breakpoints）一律從 `/src/assets/styles/variables.scss` 或 `/src/assets/styles/themes.scss` 引入，但不需再SCSS中寫 ‵@use "@/assets/styles/variables.scss" as var;`已由vite注入過。
- 若設計稿出現規範外的數值，優先尋找最接近的 Token；若確實是新設計，需先更新 Variables/Themes 檔案，絕不可在單一元件內 Hardcode。

### 鐵則 2：邏輯與樣式強制分離

- 為了避免樣式衝突並保持 Vite 編譯與熱更新（HMR）效能，頁面級別與複雜元件的樣式必須拆分檔案。
- 命名規範：`[name].vue` 必須搭配 `[name].module.scss`。
- 引入方式：在 Vue 檔內使用 `<style lang="scss" module src="./[name].module.scss"></style>` 來實現區域化（CSS Modules），徹底避免全域污染。

### 鐵則 3：CSS Layer 優先權管理

- 專案樣式必須透過 `@layer` 進行階層排序（例如：`reset, design-system, base, components, utilities`）。
- 開發新樣式時，必須明確宣告該樣式所屬的 layer，例如：`@layer components { .card { ... } }`。
- 利用 Layer 特性來控制覆蓋順序，從根源消滅 specificity（權重）衝突。

### 鐵則 4：樣式完成前自我檢查

下表任何一項不過 → 不要進下一個檔案 / 不要 Commit：

- [ ] 所有的顏色、尺寸、間距是否都使用了 SCSS variables 或 CSS 變數？
- [ ] 樣式是否已經拆分至對應的 `.module.scss`？
- [ ] 樣式是否正確宣告在對應的 `@layer` 之中？
- [ ] 是否完全沒有使用 `!important`（除非是寫在 utilities layer 的特例）？
- [ ] 檢查 Vue 檔案的 template 之中，是否完全沒有使用 inline `style="..."`（必須改為 class 應用）？

## 執行步驟

### 1. 讀取 UI Task Brief 與設計規範

對照 `conventions/ui-design.md` 以及 Figma/設計稿，盤點出會用到的顏色與間距 Token。

### 2. 初始化對應的檔案結構

確保 Vue 的 Composition API 邏輯與樣式各自獨立：

- 建立 `Component.vue`
- 建立 `Component.module.scss`
- 若為共用原子元件，確認其歸屬在 Atomic Design 的哪個層級（Atoms, Molecules 等）。

### 3. 開發與綁定模組化樣式

在 Vue 中透過 `$style` 或自訂名稱綁定 class：

```vue
<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Hello</h1>
  </div>
</template>
<style lang="scss" module src="./Component.module.scss"></style>
```

### 4. Layer 宣告與變數套用

在 SCSS 檔內：

```scss
@layer components {
  .container {
    padding: var.$spacing-md;
    background-color: var.$color-bg-primary;
  }
}
```

## 完成判定

- task.md 規劃的 UI 元件皆已切版完成。
- `git diff` 檢查中，完全沒有寫死（Hardcode）的 HEX 色碼或 px 單位（除非是 1px border 等特例）。
- UI 在不同裝置尺寸（依據 variable 的 breakpoints）下不會跑版。

## 三 track 各自的特殊紀律

Leader 派工時會註明任務屬於哪條 track（A 新功能 / B 修改 / C 除錯）。針對 UI 標準化：

### Track A（新畫面 / 新元件）

照上面流程，嚴格建立對應的 `.module.scss`，若發現基礎建設（`variables.scss`）缺少必要的通用設定，需一併擴充並獨立切一個 commit (`style(theme): ...`)。

### Track B（修改現有樣式 / 轉移舊架構）— 強調解耦

- 改舊檔案時，若發現以前的人寫了幾百行 `<style scoped>`，你的職責是將其抽出為 `.module.scss`。
- 將舊的 Hardcode 色碼與尺寸無情替換為 `variables.scss` 內的變數。
- 替換後務必在本機確認樣式視覺是否與改版前一致（No visual regression）。

### Track C（跑版 / 樣式除錯）— 治本不治標

- 遇到樣式覆蓋不過去的問題，**絕對禁止**直接加上 `!important` 或是寫更長的選擇器（如 `.wrapper .box .btn span`）。
- **Root cause 追蹤**：用 DevTools 檢查到底是哪個層級的 specificity 贏了。
- **重構解法**：將舊有高權重的樣式移入較底層的 `@layer`，或透過 CSS Modules 重構，讓結構扁平化，從系統面解決跑版問題。

## 接力

完成後 → 交給 **Sub-agent: code-reviewer**（dev-workflow Step 4）做審查。派工時提醒 reviewer 特別檢查「Design Token 命中率」以及「是否濫用高權重 CSS 與巢狀結構」。
