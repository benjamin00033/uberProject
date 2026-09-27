# Tasks

## 🚀 實作 Project Scheduler 進階互動與月曆功能

**Context** — 在完成基本的排版與狀態管理後，使用者希望能進一步提升 `projectScheduler` 模組的實用性與互動性，加入專案管理的完整生命週期 (CRUD)、更直覺的月曆檢視模式，以及支援事件拖拉 (Drag and Drop) 來快速調整排程的功能。

**Goal**
- **專案管理 (Project CRUD)**：建立專案管理介面，讓使用者可以新增、編輯、刪除專案資料。
- **月曆檢視 (Calendar View)**：實作一個以「月」為單位的月曆元件，將所有任務 (Tasks) 依據起訖時間渲染於對應的日期格子上。
- **拖曳排程 (Drag & Drop)**：在月曆檢視中，允許使用者透過滑鼠拖曳任務卡片到其他日期，自動更新該任務的 `startDate` 與 `endDate`，並即時觸發狀態庫的衝突偵測。

**Scope**
- `src/domain/projectScheduler/components/ProjectManagerModal.vue` (新增)
- `src/domain/projectScheduler/components/CalendarView.vue` (新增)
- `src/domain/projectScheduler/pages/Dashboard.vue` (修改，加入月曆切換與專案管理入口)
- `src/domain/projectScheduler/store/useProjectSchedulerStore.ts` (擴充專案 CRUD actions)
- 依需求評估引入拖曳相關或月曆套件 (或使用 HTML5 原生 Drag and Drop API)
- ⚠ 含 UI 工作

**Acceptance**
- [ ] 介面上提供「專案管理」的入口，並能順利完成專案的新增、修改與刪除。
- [ ] 提供「切換檢視」功能，可從目前的 Bento 排版切換至「月曆模式」。
- [ ] 任務能正確跨越天數顯示在月曆的對應日期上。
- [ ] 使用者可拖曳任務卡片至新的日期，放開後自動更新任務起訖時間與衝突警告。
- [ ] 相關 actions 與 helper 皆有補齊單元測試，且 verify 全綠。

**Non-goals**
- 本次僅專注於前端狀態更新與互動，不實作後端 API 串接與資料庫持久化。

## 🚀 實作 Project Scheduler 核心互動功能

**Context** — 目前 `projectScheduler/pages/Dashboard.vue` 只有靜態的 UI 呈現，資料都是寫死在組件內，也無法互動。為了讓這個調度系統能真正發揮效用，我們需要將資料抽離至狀態管理，並補齊基礎的互動操作。

**Goal**
- 建立專屬的 Pinia Store (`useProjectSchedulerStore`) 管理 Projects, Members, Tasks，並自動計算 Conflicts。
- 實作「今日焦點」清單的狀態切換功能 (Todo -> In Progress -> Done)。
- 實作「新增任務」的表單視窗 (Task Modal)，能指派成員、設定時間與所屬專案。
- 確保時間軸 (Timeline) 與衝突預警 (Conflicts) 能根據 Store 的狀態即時更新反應。

**Scope**
- `src/domain/projectScheduler/store/useProjectSchedulerStore.ts` (新增)
- `src/domain/projectScheduler/components/TaskModal.vue` (新增)
- `src/domain/projectScheduler/pages/Dashboard.vue` (修改，串接 Store 與 Modal)
- `src/domain/projectScheduler/types.ts` (確認/擴充型別)
- ⚠ 含 UI 工作

**Acceptance**
- [ ] 任務資料成功由 Pinia Store 管理，並能在元件中保持響應式 (Reactive)。
- [ ] 點擊「今日焦點」中的任務 Badge 能順利切換狀態 (todo/in_progress/done)。
- [ ] 頁面提供「新增任務」按鈕，點擊後會彈出表單供使用者填寫，且包含必填驗證。
- [ ] 表單送出後，新的任務能即時出現在時間軸上，並能正確觸發或解除撞期警告。
- [ ] 相關 helper / store 邏輯具備單元測試，且 verify 全綠。

**Non-goals**
- 本次依然不串接真實後端 API，只專注在前端狀態 (Pinia) 的互動。
- 不開發進階的甘特圖拖曳排程 (Drag-and-drop)。

## 🚀 重新規劃 Project Scheduler 頁面功能與動態佈局

**Context** — 目前 `projectScheduler/pages/Dashboard.vue` 的佈局與資料均為初步 mock，排版綁定在特定的 `DashboardBentoLayout` 插槽中。使用者希望重新規劃這個模組應具備的功能，並要求介面板塊 (Boards) 能動態適應數量：「若只有一塊便延展填滿；兩塊就均分 (50%/50%)」。

**Goal**
- 重新設計排版邏輯，引入 Flex 或動態 Grid 概念，使介面板塊數量為 1 時自動延展 100%，為 2 時自動均分 (50% / 50%)。
- 規劃 Project Scheduler 的核心板塊（如：專案進度總覽、資源時程衝突、今日焦點任務、成員負載狀態等）。
- 將現有的 Mock 資料區塊依照新排版機制重構。

**Scope**
- `src/domain/projectScheduler/pages/Dashboard.vue`
- `src/domain/projectScheduler/pages/Dashboard.module.scss`
- 可能新增 `src/components/Layout/FlexBoardLayout.vue` 或直接於頁面實作
- ⚠ 含 UI 工作

**Acceptance**
- [ ] 畫面佈局改用動態適應的 Flex / Grid，不再硬性依賴固定名稱插槽。
- [ ] 驗證：當設定檔或資料只顯示 1 個資訊板塊時，該板塊寬度延展為 100%。
- [ ] 驗證：當設定顯示 2 個資訊板塊時，這兩個板塊寬度各佔 50% 均分。
- [ ] 現有的領域功能（專案總覽、時程與衝突預警、今日焦點）被順利轉移到新的佈局結構中。
- [ ] verify 全綠

**Non-goals**
- 本次僅做前端 UI 與排版邏輯重構，不串接真實後端 API。
- 不開發進階的拖拉 (Drag and drop) 互動甘特圖，維持目前的資訊呈現為主。


## 🔧 替換全部組件與頁面中的 Hardcode 顏色（遵守 UI 標準化鐵則）

**Context** — 為什麼要改？目前哪裡不夠用？
目前許多全域組件 (`src/components/`) 與業務頁面 (`src/domain/`) 的 `.scss` 與 `.vue` 檔案中，殘留大量寫死的 HEX 色碼（如 `#ffffff`, `#ececec`）與 rgba 顏色。這違反了專案 `.agents/rules` 中不 Hardcode 顏色、須從 `variables.scss` 或 `themes.scss` 引入 Design Tokens 的鐵則。

**既有行為**（Track B 核心）
- 目前：許多組件的背景色、邊框色或陰影顏色是直接在檔案內用 `rgba(...)` 或 `#hex` 寫死的。
- 目前：這些寫死的顏色在切換主題（如 Dark Mode）時可能無法順利聯動或造成視覺不一致。

**變更內容**
- 將所有 `src/components/` (含 Layout, UI) 與 `src/domain/` 內發現的 Hardcode 色碼通通替換為 `src/assets/styles/variables.scss` 內的標準變數（如 `var(--ion-color-step-150)` 等）。
- 移除所有無意義的自訂 `rgba` 或 `#hex`，改用 Design System 中定義的對應色。

**影響範圍**
- 檔案（全域組件）：`DynamicLayout.module.scss`, `MainLayout.module.scss`, `MenuBar.module.scss`, `ThreeColumnLayout.module.scss`, `TwoColumnLayout.module.scss`, `Pagination.vue`, `BaseCarousel.module.scss`, `BaseModal.module.scss`, `BaseNotification.vue`, `BaseSelect.module.scss`, `BaseSkeleton.module.scss`, `BaseTable.module.scss`, `BaseTooltip.module.scss`
- 檔案（領域頁面）：`BroadcastVideo.module.scss`, `budget.module.scss`, `MenuItem.module.scss`
- 資料節點：無變動
- 既有測試：不影響業務邏輯測試
- 文件：需紀錄 dev-log

**Backward compat 評估**（Track B 核心）
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 畫面顯示特定的顏色背景或陰影 | 將對應到最接近的 Design Token，視覺上保持一致 | ✅ 保留 |
| Dark Mode/Light Mode 切換 | 會因使用 CSS 變數而自動支援更好的切換效果 | ✅ 保留 |

> 結論：無破壞性變更（pure additive / refactoring）。

**新 Acceptance**
- [ ] 所有上述列出的檔案內不再有 hardcoded 的顏色（如 `#fff`, `#ccc`, `#121212`, `rgba` 等）。
- [ ] 替換後在本機確認樣式視覺是否與改版前一致（No visual regression）。
- [ ] 畫面在不同裝置與深淺色模式下不跑版，且符合 `variables.scss` 的配置。
- [ ] verify 全綠

**Non-goals**
- 不修改 `variables.scss` 和 `themes.scss` 的既有定義（僅作引用）。
- 不調整原本沒動到的邏輯功能。

## 🔧 重新調整 Budget 頁面排版與圖表美化 (UI/UX Redesign)

**Context**
使用者覺得目前的 Budget 頁面（Dashboard 與圖表）不夠好看，希望能重新調整排版與畫面設計，打造更具現代感與高級感的視覺體驗。

**既有行為**
- 目前：頂部有 Total, Used, Remaining 三個摘要區塊，排版較為扁平。
- 目前：中央有 Donut Chart 顯示分類佔比，樣式較為基礎。
- 目前：下方是預算清單，包含簡單的進度條。

**變更內容**
- 重新設計 Dashboard 區塊的排版結構，增強資訊層次與卡片的視覺質感。
- 優化 Donut Chart 的呈現方式（例如調整粗細、顏色搭配、動畫與圖例排版）。
- 清單項目加入更精緻的微動畫與 Hover 狀態。
- 確保所有樣式使用 `src/assets/styles/variables.scss` 中的 Design Tokens。

**影響範圍**
- `src/domain/budget/pages/budget.vue`
- `src/domain/budget/pages/budget.module.scss`
⚠ 含 UI 工作

**Backward compat 評估**
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 顯示總預算、已使用、剩餘預算 | 保留，僅變更排版與樣式 | ✅ 保留 |
| 顯示分類 Donut Chart | 保留，僅優化視覺 | ✅ 保留 |
| 預算清單顯示與刪除功能 | 保留 | ✅ 保留 |
| 多語系 (i18n) | 維持既有寫法 | ✅ 保留 |

> 結論：無破壞性變更（純視覺重構）。

**新 Acceptance**
- [ ] Dashboard 摘要區塊與 Donut Chart 擁有全新的高質感視覺設計。
- [ ] 頁面捲動與 hover 時擁有平滑的互動微動畫。
- [ ] 既有預算清單與刪除功能正常運作，且無跑版問題。
- [ ] verify 全綠

**Non-goals**
- 不修改 API 與底層資料模型 (`types.ts`)。
- 不實作串接真實 `usedAmount` API。
## 🔧 將 Budget 頁面重新設計為 Clean & Minimalist 風格

**Context**
使用者認為既有的 Glassmorphism 設計較為複雜，希望能重新設計 Budget 頁面，轉換成極簡明亮（Clean & Minimalist）的風格，透過大量留白、無邊框設計與現代精緻的排版來達到 "WOW" 的質感體驗。

**既有行為**
- 目前：使用毛玻璃 (Glassmorphism) 卡片，帶有背景光暈。
- 目前：頂部有三個並列的摘要卡片 (Total, Used, Remaining)。
- 目前：中央有 Donut Chart 顯示分類花費。
- 目前：清單項為包含進度條的卡片設計，並支援點擊刪除。

**變更內容**
- 將視覺風格徹底轉換為 Clean & Minimalist，使用乾淨的白色 / 淺灰背景 (Light Mode)。
- 移除所有卡片邊框與毛玻璃效果，改用極細微的柔和陰影與大量留白來區隔層次。
- 字體排版更加精緻，重點資料（如金額）採用大字體，輔助資訊使用淡色小字。
- 將 Donut Chart 與 Summary 的呈現方式簡化，去除多餘的螢光色，僅在重點進度條或圖表部分使用優雅的主題色。

**影響範圍**
- `src/domain/budget/pages/budget.vue`
- `src/domain/budget/pages/budget.module.scss`

**Backward compat 評估**
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 顯示總預算、已使用、剩餘預算 | 保留，僅變更視覺呈現 | ✅ 保留 |
| 顯示分類 Donut Chart | 保留，改用極簡圖表風格 | ✅ 保留 |
| 預算清單顯示與進度條 | 保留，轉換為無邊框列表 | ✅ 保留 |
| 刪除預算功能 | 保留，優化互動體驗 | ✅ 保留 |
| 多語系 (i18n) 支援 | 保留既有 `t()` 寫法 | ✅ 保留 |

> 結論：無破壞性變更（純視覺重構）。

**新 Acceptance**
- [ ] 頁面整體呈現 Clean & Minimalist 極簡明亮風格。
- [ ] 成功拔除原有的 Glassmorphism 風格。
- [ ] Summary 資料與圖表能清晰、優雅地呈現。
- [ ] 列表操作（刪除）與新增按鈕功能正常運作，符合極簡美學。
- [ ] verify 全綠

**Non-goals**
- 不修改 API 或底層資料模型 (`types.ts`)。
- 不修改多語系 `language.ts` 內容（只復用既有 keys）。

---## 🔧 重新設計 Budget 頁面 (Dashboard & Glassmorphism)

**Context (背景)**:
使用者覺得目前的 Budget 頁面過於單調，希望重新設計以達到 "WOW" 的現代網頁體驗，包含 Dashboard 統計卡片、圖表分類、以及 Glassmorphism 與微動畫風格。

**既有行為 (Current Behavior)**:
目前的頁面只是一個簡單的 IonList，顯示 budget 項目標題、分類、金額、日期，並提供刪除按鈕。沒有總覽、沒有圖表、視覺缺乏層次。

**變更內容 (Proposed Changes)**:
1. **Dashboard Style**: 頂部加入 Summary 卡片 (Total Budget, Used, Remaining)。
2. **Categorized View**: 使用互動圖表 (例如 Donut chart) 顯示分類的消費分佈。
3. **Glassmorphism & Micro-animations**:
   - 採用 Sleek Dark Mode 或 Glassmorphism 視覺風格設計卡片與列表。
   - 將原本的清單項目升級為具有視覺進度條 (Visual Progress Bars) 的現代化卡片。
   - 加入平滑的列表動畫與懸浮按鈕 (FAB) 用於新增預算。

**影響範圍 (Scope)**:
- `src/domain/budget/pages/budget.vue` (頁面結構)
- `src/domain/budget/pages/budget.module.scss` (樣式)
- `src/domain/budget/components/*` (可能需要切出 DashboardCard, Chart, FAB 等元件)
- `src/domain/budget/types.ts` (確認資料結構)
⚠ 含 UI 工作

**Backward Compat 評估**:
- [x] 既有使用者行為保留 (能看清單、能刪除)

**新 Acceptance (驗收標準)**:
1. 頁面上方能看到總預算、已使用、剩餘預算的 Summary 卡片。
2. 畫面上有圖表根據分類顯示預算佔比。
3. 列表項目呈現現代化卡片風格，並帶有進度條。
4. UI 完全套用 Glassmorphism 風格與微動畫，畫面在各種尺寸不跑版。
5. 擁有 Floating Action Button 供使用者新增預算。

**Non-goals (這次不做)**:
- 不實作真正的 "新增預算" 表單邏輯 (維持 TODO alert)。
- 不改變 API 資料結構與後端對接。

---

## 擴充 TestBaseUI 基礎組件測試

**Context (背景)**:
使用者要求在 `TestBaseUI` 頁面測試更多常用的基礎組件（如 Table, input, textarea, pagination, carousel）。共用的基礎組件應放置於 `src/components/UI` 中，而僅限該測試頁面專用的組件應放置於 `src/domain/testBaseUI/components` 中。

**Goal (目標)**:
建立高度可重用的 UI 基礎組件庫，並在測試頁面中給予範例實裝，作為專案開發的 UI 參考。

**Scope (範圍)**:
- 新增 `src/components/UI/BaseInput.vue`
- 新增 `src/components/UI/BaseTextarea.vue`
- 新增 `src/components/UI/BaseTable.vue`
- 新增 `src/components/UI/BaseCarousel.vue`
- 新增 `src/domain/testBaseUI/components/TestScenarioCard.vue`
- 修改 `src/domain/testBaseUI/pages/TestBaseUIPage.vue`
⚠ 含 UI 工作

**Acceptance (驗收)**:
1. `TestBaseUIPage` 上能成功顯示 Input, Textarea, Table, Carousel, Pagination 的測試區塊。
2. 共用元件全數位於 `src/components/UI`。
3. 測試專用 wrapper `TestScenarioCard` 位於 `src/domain/testBaseUI/components`。
4. Type check (`vue-tsc`) 必須全數通過，無型別錯誤。

**Non-goals (這次不做)**:
- 不實作真正的後端資料綁定，表格與輸入只做展示用。

---

## 🐛 修正 Budget 頁面多語系功能

**症狀 (Symptom)**:
`budget.vue` 頁面中有部分文字被 hardcoded (例如 "Total Budget", "Total Used", "Remaining", "Your Budgets" 等)，未套用 i18n。

**重現步驟 (Steps to Reproduce)**:
前往預算管理 (Budget) 頁面，切換語系時部分儀表板與卡片文字未跟著改變。

**期望行為 (Expected Behavior)**:
頁面所有靜態與提示文字皆使用 `t()` 搭配對應的 i18n key，支援中英雙語切換。

**Root cause**:
在重新設計 Budget 頁面時，加入了許多新元件與儀表板卡片，但這些新文字被直接寫死在 template 中，未在 `language.ts` 內註冊與引用。

**影響範圍 (Scope)**:
- `src/domain/budget/pages/budget.vue` (✅ 已定位)
- `src/locale/language.ts` (✅ 已定位)

**修法策略 (Fix Strategy)**:
1. 在 `language.ts` 的 `zh` 與 `en` 語系中，為 `budget.page` 擴充需要的 keys (如 `totalBudget`, `totalUsed`, `remaining`, `used`, `yourBudgets`, `loading`, `usedAmount`, `addModalToImplement` 等)。
2. 將 `budget.vue` 中所有 hardcoded 字串替換為對應的 `t('budget.page.xxx')`。

**Regression case**:
確認原本的 `budget.page.title`, `budget.page.empty` 等既有翻譯依然正常顯示。

---

## 🔧 擴充 BaseInput 的 Zod 驗證整合

**Context (背景)**:
使用者需要在 `BaseInput.vue` 內建與 `zod` 的深度整合，透過傳入參數即可快速執行如必填、非必填、限數字、正則表達式，以及淨空 (trim) 等驗證與處理。

**既有行為 (Current Behavior)**:
`BaseInput.vue` 只接受 `modelValue` 和 `error` prop，驗證邏輯通常要在外部元件或表單層級執行。

**變更內容 (Proposed Changes)**:
1. 在 `BaseInput.vue` 新增驗證相關參數 (`required`, `isNumber`, `regex`, `trimValue`)。
2. 內部基於傳入參數動態建立 `zod` schema 並在 `update:modelValue` 時進行驗證。
3. 若內部驗證失敗，顯示 Zod 錯誤；若外部有傳入 `error` prop，仍可正確顯示。
4. 提供 `trimValue` 參數，在輸入時自動去除前後空白。

**影響範圍 (Scope)**:
- `src/components/UI/BaseInput.vue`
- `package.json` (若尚未安裝 zod，需安裝)

**Backward Compat 評估**:
- [x] 若無傳入任何新參數，維持既有行為不變，舊有表單不受影響。

**新 Acceptance (驗收標準)**:
1. 傳入 `required` 時，為空則顯示錯誤。
2. 傳入 `isNumber` 時，非數字顯示錯誤。
3. 傳入 `regex` 時，不符格式則顯示錯誤。
4. 傳入 `trimValue` 時，可清理輸入內容。

---

## 🚀 實作動態表單共用組件 (Form, Layout & Data Presentation)

**Context** — 動態表單系統需要多種表單輸入元件、排版元件及狀態呈現元件，目前測試頁面與系統共用組件尚未支援。為了接下來能動態渲染表單，我們必須先備齊基礎 UI 磚塊。

**Goal**
- 補齊動態表單與 ERP 系統常用的輸入類（Checkbox, Radio, DatePicker, Slider）、排版類（Tabs, Accordion, Drawer, Breadcrumb）以及呈現類（Badge, Avatar）共用組件。
- 提供一致的 UI 風格，並支援 Zod 驗證整合（針對輸入元件）。
- 將這些新元件的展示與測試情境加入 `TestBaseUI`。

**Scope**
- `src/components/UI/` 下新增對應的 `Base*.vue` 組件
- `src/domain/testBaseUI/pages/TestBaseUIPage.vue` 增加測試情境展示
- `src/domain/testBaseUI/components/TestScenarioCard.vue` (如有需要)
- ⚠ 含 UI 工作

**Acceptance**
- [ ] 成功實作 `BaseCheckbox`, `BaseRadio`, `BaseDatePicker` (或 `BaseDatetime`), `BaseSlider`。
- [ ] 成功實作 `BaseTabs`, `BaseAccordion`, `BaseDrawer`, `BaseBreadcrumb`。
- [ ] 成功實作 `BaseBadge`, `BaseAvatar`, `BaseEmptyState`。
- [ ] 在 `TestBaseUIPage` 可以預覽與操作上述所有元件。
- [ ] verify 全綠。

**Non-goals**
- 本次任務先不處理元件與後端 API 的綁定。
- 不實作動態表單的拖拉畫布邏輯（由下一個 Task 處理）。

---

## 🚀 實作動態表單引擎與畫布 (Dynamic Form Engine)

**Context** — 有了基礎共用組件後，我們需要一個能夠吃 JSON Schema 動態生成表單的渲染引擎，以及一個可供使用者拖拉設定表單結構的畫布，以滿足動態表單領域的核心需求。

**Goal**
- 建立 `FormFieldRenderer`：能讀取 JSON 結構並動態產生對應的 `BaseInput`, `BaseSelect`, `BaseCheckbox` 等。
- 建立 `FormBuilderCanvas`：提供基礎的表單結構預覽與排版畫布。
- 將上述組件實作在 `dynamicForm` 領域中。

**Scope**
- `src/domain/dynamicForm/components/FormFieldRenderer.vue` (新增)
- `src/domain/dynamicForm/components/FormBuilderCanvas.vue` (新增)
- `src/domain/dynamicForm/types.ts` (定義 Schema 型別)
- ⚠ 含 UI 工作

**Acceptance**
- [ ] `FormFieldRenderer` 可以接受一個定義好的 JSON Schema 陣列，並正確渲染出對應的 `Base` 欄位。
- [ ] 欄位可正確觸發 `v-model` 更新資料並支援基礎驗證。
- [ ] `FormBuilderCanvas` 能夠視覺化地展示目前的 Schema 結構。
- [ ] verify 全綠。

**Non-goals**
- 本次不實作複雜的拖拉（Drag and Drop）排序機制，先以渲染與靜態展示為主。
- 本次不串接表單儲存 API。

---

## 🚀 建立 testBaseUI 排版測試展示頁面

**Context** — 為什麼要做？目前有什麼問題 / 觸發點？
使用者希望能在 `testBaseUI` 領域內新增一個專屬頁面，用來集中展示與測試 `src/components/Layout/` 內的所有排版組件（例如 MainLayout, DynamicLayout, CenterLayout 等），以便未來開發時能快速預覽並確認各種 Layout 的視覺效果。

**Goal** — 做完之後，使用者 / 系統會多出什麼能力？
- 系統新增一頁 Layout 展示頁面，列出所有的 Layout 元件並賦予假內容。
- 開發者可在此頁面直觀地檢視 `src/components/Layout` 內所有的排版與響應式效果。

**Scope** — 影響哪些 domain / 檔案 / 資料節點？
- `src/domain/testBaseUI/pages/TestLayoutPage.vue`（新增）
- `src/router/index.ts`（新增測試頁面的 route）
- ⚠ 含 UI 工作

**Acceptance** — 怎樣算做完？可驗證的勾選項
- [ ] 成功建立 `TestLayoutPage.vue`。
- [ ] 頁面內正確引入並展示 `src/components/Layout/` 下的所有主要排版組件（如 MainLayout, CenterLayout, DynamicLayout, TwoColumnLayout 等）。
- [ ] Router 成功配置，可透過 `/test-layout` (或其他合理路徑) 進入該頁面。
- [ ] verify 全綠

**Non-goals** — 這次明確不做什麼？避免 scope creep
- 不修改既有的 Layout 組件邏輯或樣式，僅作展示。
- 不實作真正的資料串接，使用假內容展示排版即可。

---

## 🚀 新增 ERP 與 Dashboard 專用共用排版 (Layouts)

**Context** — 為什麼要做？目前有什麼問題 / 觸發點？
目前的 Layouts 涵蓋了基礎的單、雙、三、四欄等切分，但對於複雜的 ERP 系統（如訂單檢視、系統設定）與現代 Dashboard 儀表板，還缺乏更具語意化且高互動性的共用排版（如：主從明細 Master-Detail、便當盒式儀表板 Bento Grid 等）。使用者希望擴充這些可重複利用的排版。

**Goal** — 做完之後，使用者 / 系統會多出什麼能力？
- 開發者能直接使用 `MasterDetailLayout` 快速建立左側列表、右側明細的標準 ERP 介面。
- 開發者能使用 `DashboardBentoLayout` 快速堆疊出支援不同尺寸卡片（1x1, 2x1, 2x2）的現代化儀表板。
- 上述新佈局同樣相容並可透過 `DynamicLayout` 動態載入，且會在 `TestLayoutPage` 進行展示。

**Scope** — 影響哪些 domain / 檔案 / 資料節點？
- `src/components/Layout/MasterDetailLayout.vue` & `.module.scss` (新增)
- `src/components/Layout/DashboardBentoLayout.vue` & `.module.scss` (新增)
- `src/components/Layout/DynamicLayout.vue` (擴充 type 定義)
- `src/domain/testBaseUI/pages/TestLayoutPage.vue` (新增這兩個佈局的預覽卡片)
- ⚠ 含 UI 工作

**Acceptance** — 怎樣算做完？可驗證的勾選項
- [ ] 實作 `MasterDetailLayout`：具備 `#list` 與 `#detail` 插槽，且具備 RWD 適應性。
- [ ] 實作 `DashboardBentoLayout`：利用 CSS Grid 提供 Bento Box 風格的插槽或外觀排版。
- [ ] `DynamicLayout` 增加 `master-detail` 與 `bento` 等型別支援。
- [ ] `TestLayoutPage` 成功新增這兩組 Layout 的預覽與假資料展示。
- [ ] verify 全綠

**Non-goals** — 這次明確不做什麼？避免 scope creep
- 不串接真實 ERP 資料。
- 不實作過於複雜的拖拉排序 (Drag & Drop) Dashboard，本次以靜態網格為主。

---

## 🔧 移除全專案 Vue 檔案中的 Inline Style

**Context**
根據專案最新制定的 `ui-standardize` 鐵則與 `inline-style-checker` 規範，Vue Template 中絕對不允許出現 inline style (`style="..."` 或靜態的 `:style="..."`)。目前發現專案中尚有多處檔案違規使用 inline style，需要進行重構。

**既有行為**
- 目前：部分元件內部直接使用 `style="..."` 來設定 padding, margin, border, flex 排版等。

**變更內容**
- 將上述所有違規的 inline style 移除。
- 為這些元素新增 CSS class，並將樣式移至對應的 `<style module>` 或獨立的 `.module.scss` 檔中。
- 保留合法的動態 `:style`。

**影響範圍**
- `src/components/UI/BaseTable.vue`
- `src/domain/dynamicForm/components/FormFieldRenderer.vue`
- `src/domain/dynamicForm/components/builders/DynamicFieldBuilder.vue`
- `src/domain/projectScheduler/pages/Dashboard.vue`
- `src/domain/testBaseUI/pages/TestBaseUIPage.vue`
- `src/domain/testBaseUI/pages/TestLayoutPage.vue`
⚠ 含 UI 工作

**Backward compat 評估**
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 畫面排版與視覺樣式 | 完全保留，僅轉為 class 實作 | ✅ 保留 |

> 結論：無破壞性變更（純重構）。

**新 Acceptance**
- [ ] 專案中不再出現 `style="..."` 的硬編碼樣式。
- [ ] 新增的 class 正確綁定，視覺上沒有跑版。
- [ ] verify 全綠。

**Non-goals**
- 不調整既有元件邏輯與功能。

---

## 🔧 實作 Project Scheduler 時程表共用資料與拖曳提示

**Context (背景)**:
目前 `Dashboard.vue` 中的時程表（Timeline）日期是寫死（Hardcode）的，且任務的呈現方式（`getTaskStyle`）依賴固定的時間計算。使用者希望 `Dashboard.vue` 的時程表能與 `CalendarView.vue` 共用相同的動態資料格式（如目前的年/月或指定的日期區間），並在時程表中支援任務的拖曳（Drag and Drop）調整時間，同時加入任務提示（Tooltips/Hints）。

**既有行為 (Current Behavior)**:
- `Dashboard.vue`：時程表日期寫死，樣式依賴寫死的 2026-08-10 起點與 20 天的區間。無拖曳功能，無 tooltip。
- `CalendarView.vue`：有自己維護的 `currentDate` 與日曆格產生邏輯，並有基本的 `onDragStart` 與 `onDrop`。

**變更內容 (Proposed Changes)**:
1. **共用日期狀態**：將 `CalendarView.vue` 中管理當前日期（`currentDate`）的邏輯抽離至 `useProjectSchedulerStore` 或共用的 composable 中，讓 `Dashboard.vue` 也能根據當前月份或選定的區間來動態渲染時程表的表頭（日期）與計算任務卡片的 `left`/`width` 比例。
2. **實作拖曳功能**：在 `Dashboard.vue` 的時程表任務條上加入 `draggable="true"`，並實作 `@dragstart` 與 `@drop` 邏輯（可與日曆的拖曳邏輯共用或整合），拖放後觸發 `updateTaskDates` 更新任務起訖時間。
3. **加入提示 (Tooltips/Hints)**：在時程表與日曆的任務上加入 tooltip，滑鼠懸浮時可顯示任務的詳細資訊（如專案名稱、起訖日期、狀態等）。

**影響範圍 (Scope)**:
- `src/domain/projectScheduler/store/useProjectSchedulerStore.ts` (抽離/新增日期狀態與共用邏輯)
- `src/domain/projectScheduler/pages/Dashboard.vue` (修改時程表渲染，綁定拖曳與 tooltip)
- `src/domain/projectScheduler/pages/Dashboard.module.scss` (新增相關樣式)
- `src/domain/projectScheduler/components/CalendarView.vue` (重構：改用 Store 內的日期狀態，加入 tooltip)
- ⚠ 含 UI 工作

**Backward Compat 評估**:
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| Dashboard 顯示寫死的時程 | 顯示當月/當前區間的動態時程 | ✅ 保留且優化 |
| CalendarView 切換月份 | 改由 Store 控制，功能不變 | ✅ 保留 |

**新 Acceptance (驗收標準)**:
- [ ] `Dashboard.vue` 的時程表日期能根據 Store 中的當前區間動態產生。
- [ ] 時程表上的任務條位置能根據真實資料與當前顯示區間正確換算。
- [ ] 使用者可以在 `Dashboard.vue` 的時程表中拖曳任務條改變日期。
- [ ] 任務條與日曆卡片上滑鼠懸停 (hover) 有 Tooltip 顯示詳細資訊。
- [ ] verify 驗證全綠。

**Non-goals (這次不做)**:
- 不實作拖曳改變任務負責人（Assignee），僅專注於改變日期（左右拖曳）。
- 不串接後端 API。

## ✅ 新增 Web Worker 來處理 API 請求與計時器

**Context** — 為了讓頁面主執行緒不被複雜任務或定時器干擾，我們需要建立 Web Worker 來分擔工作。包含一個用來處理 API 請求（勾稽等複雜操作）的 Worker，以及一個計時器 Worker 用於每分鐘在 LayoutHeader 更新當地時間。

**Goal**
- 建立 `src/helper/worker` 資料夾，統一管理 Web Worker 檔案。
- 實作 API Worker：接收 api url、payload 與 action (GET/POST/PUT/DELETE) 等操作，執行請求後將結果回傳主執行緒。
- 實作 Timer Worker：抓取當地時間，每分鐘更新並將時間傳回主執行緒。
- 在 `LayoutHeader.vue` 的登出按鈕旁邊，顯示從 Timer Worker 接收到的當地時間。
- 確保在元件銷毀時終止 (terminate) worker，妥善管理生命週期。

**Scope**
- `src/helper/worker/apiWorker.ts`（新增）
- `src/helper/worker/timerWorker.ts`（新增）
- `src/components/Layout/LayoutHeader.vue`（修改，引入 Timer Worker 並顯示時間）
- ⚠ 含 UI 工作

**Acceptance**
- [x] `src/helper/worker` 資料夾建立成功，且包含 `apiWorker.ts` 與 `timerWorker.ts` 檔案。
- [x] API Worker 能接收參數並發送請求，將結果成功透過 `postMessage` 回傳。
- [x] Timer Worker 能每分鐘透過 `postMessage` 傳送當地時間。
- [x] `LayoutHeader.vue` 成功接收 Timer Worker 傳來的時間，並顯示在 Logout 按鈕旁邊。
- [x] 組件卸載時，正確結束 Worker (terminate) 的生命週期。
- [x] verify 全綠。

**Non-goals**
- 不負責實作具體的業務 API 串接（如實際呼叫特定的 endpoint），只需實作通用的 API Worker 機制。

---

## 🔧 修改 Dashboard 月曆為當周視角與強化拖曳、修正提示對比

**Context**
使用者反映 `Dashboard.vue` 中的月曆（時程表）顯示一整個月的區間太擁擠，希望改為「僅顯示當周」。另外，為了提升拖曳排程的效能與體驗，希望能引入 `@atlaskit/pragmatic-drag-and-drop` 替換原本的 HTML5 原生 Drag and Drop API。最後，畫面上方的撞期警告（`.conflictAlert`）顏色對比度太差，需要根據 Design System 的標準調整顏色以提升可讀性與無障礙體驗。

**既有行為**
- 目前：`Dashboard.vue` 依賴 store 的 `daysInMonth` 一次渲染整個月的日子。
- 目前：拖曳任務使用的是 HTML5 `@dragstart`, `@drop`, `draggable="true"`。
- 目前：`.conflictAlert` 使用了 `var(--ion-color-danger-tint, #ffcccc)` 作為背景，且文字顏色也接近紅色，導致對比度過低。

**變更內容**
- 將時程表渲染的天數從「月 (Month)」改為「當周 (Week)」，可動態切換上一週/下一週。
- 將 `useProjectSchedulerStore` 內的日期邏輯進行重構，支援以「週」為單位的資料取得 (`daysInWeek`)，或將目前的月視角改為週視角。
- 在專案中安裝並引入 `@atlaskit/pragmatic-drag-and-drop`，重構 `Dashboard.vue` 與 `CalendarView.vue`（若有共用）中的拖曳排程邏輯。
- 修正 `Dashboard.module.scss` 內的 `.conflictAlert` 樣式，套用合適的 Design Tokens（例如更深的文字顏色或更柔和的背景色），以符合對比度標準。

**影響範圍**
- `src/domain/projectScheduler/pages/Dashboard.vue`
- `src/domain/projectScheduler/pages/Dashboard.module.scss`
- `src/domain/projectScheduler/store/useProjectSchedulerStore.ts`
- `package.json` (新增套件)
- ⚠ 含 UI 工作

**Backward compat 評估**
| 既有行為 | 變更後 | 性質 |
| --- | --- | --- |
| 顯示一整個月的時程表 | 顯示 7 天的當周時程表，資訊更聚焦 | ✅ 保留 |
| 拖曳任務以調整起訖時間 | 拖曳體驗更佳、效能更好，功能維持不變 | ✅ 保留 |
| 顯示撞期警告訊息 | 維持相同警告邏輯，但改善視覺對比度 | ✅ 保留 |

> 結論：無破壞性變更，純為功能優化與視覺重構。

**新 Acceptance**
- [ ] 畫面上的月曆時程區塊僅顯示當周的 7 天（例如週一至週日），並能切換上下週。
- [ ] 成功使用 `@atlaskit/pragmatic-drag-and-drop` 取代原生拖曳，拖放後能正確更新任務起訖日期。
- [ ] 撞期警告區塊的顏色搭配符合對比度要求，文字清晰易讀。
- [ ] 相關的 helper 或 store 邏輯具備單元測試。
- [ ] verify 全綠。

**Non-goals**
- 不修改專案、任務的資料結構。
- 不實作跨元件/跨區塊的複雜拖曳（如從任務列表拖到日曆），僅專注於日曆內的日期改變。

---

## 🐛 修正 Dashboard.vue (FlexBoardLayout) 捲動失效問題

**症狀**
Dashboard 頁面（以及其他套用 `FlexBoardLayout` 的頁面）在內容過長時，畫面右側會出現捲軸 (Scrollbar)，但是使用者卻無法透過滑鼠滾輪或觸控來捲動頁面內容。

**重現步驟**
1. 進入 Dashboard 頁面。
2. 縮小視窗高度或新增多筆專案/任務資料，讓畫面內容超出螢幕高度。
3. 嘗試滾動頁面，發現雖然出現捲軸，但畫面文風不動。

**期望行為**
頁面內容超出可視範圍時，可以正常、順滑地向下捲動查看所有內容。

**Root cause**
在 `src/components/Layout/FlexBoardLayout.module.scss` 中，`.boardContainer` 被設定了 `height: 100%; overflow-y: auto;`。這會在 Ionic 的 `<ion-content>` 內部建立一個子捲動區域。由於 `<ion-content>` 本身即負責處理該頁面的捲動事件與 Shadow DOM 滾動，內部的 `overflow-y: auto` 容易攔截滾動事件或發生衝突，導致外層不滾、內層也滾不動的死鎖狀態。

**影響範圍**
- `src/components/Layout/FlexBoardLayout.module.scss` (✅ 已定位)
- 所有使用 `FlexBoardLayout` 的頁面 (如 `Dashboard.vue`) (✅ 已修復)

**修法策略**
將 `.boardContainer` 的 `overflow-y: auto;` 移除，並把 `height: 100%;` 改為 `min-height: 100%;`。這樣可以讓容器自然撐開高度，將捲動的職責交還給外層的 `<ion-content>`，恢復原生的流暢滾動體驗。

**Regression case**
- 確認 Dashboard 在內容不足時，背景仍能填滿 100% 高度。
- 確認 Dashboard 在內容超出時，可以使用滾輪與觸控正常滾動到底部。

---

## 📝 Task Brief (Track B) - 動態計算專案進度與優化焦點狀態 UI

### 1. Context (Why are we doing this?)
使用者希望能完善 Dashboard 中的「專案總覽」與「今日焦點」區塊：
- 目前專案的 `progress` 是寫死的假資料，應該根據其底下的任務狀態 (`todo`, `in_progress`, `done`) 來動態計算進度。
- 「今日焦點 (事件焦點內容)」目前的 `todayTasks` 是寫死的模擬日期 (`2026-08-18`)，需改為實際當日 (Today) 來顯示真正屬於今天的任務。
- 「指定狀態的提示狀態」：任務的 status (`todo`, `in_progress`, `done`) 缺乏友善的中文提示，需加入 i18n 翻譯對應，並優化 Badge 視覺狀態。

### 2. Scope (What is included?)
- 修改 `useProjectSchedulerStore.ts`：
  - 實作動態計算進度：依據該專案的所有任務狀態比例計算 `progress` (0~100)。(若無任務則為 0)
  - 修改 `todayTasks` 邏輯，捨棄 hardcoded date，改用系統當下日期 `new Date().toLocaleDateString("en-CA")`。
- 修改 `Dashboard.vue`：
  - 更新專案總覽，確保進度條反應動態進度。
  - 將 Status Badge 加入 i18n 語言包轉換，使其顯示為本地化文字（如：`待處理`, `進行中`, `已完成`）。
  - 優化事件焦點區塊中對於無任務狀態、各類狀態的樣式呈現。

### 3. Backward Compatibility & Impact
- **Store Data**: `projects` 的初始狀態仍可保留 `progress` 屬性，或直接由 getter 覆寫，不會破壞原有型別。
- **UI Components**: 僅修改 `Dashboard.vue` 的呈現方式，依賴的原生組件均與原設計一致。

### 4. Acceptance Criteria
- 專案總覽區的進度條能真實反映該專案底下任務的完成度（例如：有 4 個任務，2 個 `done` 就是 50%）。
- 點擊「今日焦點」中任務的狀態 badge 時，任務狀態改變，且**專案進度條會跟著即時連動更新**。
- 今日焦點中的任務列表，只顯示**今天** (System Today) 應該進行的任務。
- Badge 的文字顯示為中文，並具備區別度高的顏色。

---

## 📝 Task Brief (Track B) - 修復時程表比例、實作衝突多軌顯示

### 1. Context (Why are we doing this?)
使用者回報「實作介面上的所有功能，偵測衝突不可寫死請妥善規劃」：
- **比例失真**：稍早將 `Dashboard.vue` 的時程表改為「當周視角 (7天)」，但任務卡片 (`getTaskStyle`) 的 `left` 與 `width` 比例計算，卻依然「寫死」為針對「整個月」的總天數 (28~31天) 來計算。這導致任務長條圖完全不對齊目前的日曆格。
- **衝突疊影**：目前 `Dashboard.vue` 內的 `taskBar` 全部設定 `position: absolute; top: 50%;`。當偵測到「人力撞期衝突」時，任務在視覺上會完全疊合在一起（使用者無法點選被壓在下方的任務），沒有妥善規劃多軌或高度偏移。
- **衝突偵測精準化**：原本的 `conflicts` 計算是 `t1.startDate <= t2.endDate && t1.endDate >= t2.startDate`，這部分雖然正確，但無法回饋給 UI 用於「計算任務的 Y 軸位置 (Lane)」，需要規劃更完善的演算法 (例如 Task Lane Assignment) 讓畫面妥善呈現。

### 2. Scope (What is included?)
- 修改 `Dashboard.vue` 的 `getTaskStyle`：
  - 將計算基準從 `currentYearMonth` (整個月) 改為 `daysInWeek` (當周 7 天)。
  - 任務若是跨越周界線，必須正確截斷顯示範圍。
- 實作 Task Lane (軌道) 分配演算法：
  - 在 `Dashboard.vue` 或 `Store` 中加入邏輯：針對每位成員的任務進行排序與重疊偵測，為每個任務分配一個 `laneIndex`。
  - 重疊的任務會被分配到不同的 `laneIndex` (例如 0, 1, 2...)。
  - `getTaskStyle` 依據 `laneIndex` 計算 `top`，讓撞期任務一上一下呈現，不再重疊遮蔽。
  - 動態調整 `.timelineTracks` 或 `.memberRow` 的 `min-height` 以適應多軌道的高度需求。

### 3. Backward Compatibility & Impact
- 修改僅限於 `Dashboard.vue` 內的視覺呈現與 `getTaskStyle`，不影響資料庫與 Store 資料結構。

### 4. Acceptance Criteria
- 任務長條圖精準對齊上方當周的每一天。
- 若同一成員在當周有兩個時間重疊的任務，畫面必須顯示上下兩條獨立的 Task Bar，不會互相遮蓋。
- 拖曳任務後，若造成新的重疊，UI 會即時反映並將它們分配到不同軌道 (Lanes)。

---

## 📝 Task Brief (Track A) - 台灣國定假日 API 與事件 CRUD 完整實作

### 1. Context (Why are we doing this?)
使用者需求：
1. **台灣國定假日 (Taiwan Public Holidays)**：希望能透過串接線上 Public API (Region Taiwan)，將台灣的節慶與假日顯示在月曆與時程表上。
2. **事件 CRUD (Calendar Event CRUD)**：目前的任務 (月曆事件) 僅有建立 (Create) 與拖曳更新 (Update Dates)，缺乏完整的編輯與刪除功能。需要補齊完整的 CRUD (建立、讀取、更新、刪除) 流程。

### 2. Scope (What is included?)
- **串接假日本地化 API**：
  - 目標 API: `https://raw.githubusercontent.com/ruyut/TaiwanCalendar/master/data/${year}.json` (開源且無需驗證的金鑰)。
  - 在 `useProjectSchedulerStore.ts` 中新增 `fetchHolidays(year)` Action 與 `holidays` State。
  - 在 `CalendarView.vue` (月曆模式) 與 `Dashboard.vue` (時程模式) 的日期網格上，若當天為假日，顯示特殊標記或假日名稱 (例如背景色變更或顯示紅色標籤)。
- **實作事件 CRUD**：
  - 更新 `useProjectSchedulerStore.ts`：新增 `updateTask(id, payload)` 與 `deleteTask(id)`。
  - 更新 `TaskModal.vue`：
    - 支援傳入 `editTaskId` (或改為 `task` prop)，以切換至「編輯模式」。
    - 在編輯模式下，表單帶入預設值。
    - 在對話框底部加入「刪除 (Delete)」按鈕 (紅色)。
  - 更新事件觸發邏輯 (`Dashboard.vue` & `CalendarView.vue`)：
    - 將原本點擊任務觸發「切換狀態 (Toggle)」的行為，改為「開啟編輯 Modal」，讓使用者在 Modal 內完整編輯屬性與狀態，並支援刪除。

### 3. Backward Compatibility & Impact
- 修改 `TaskModal` 會影響原本的新增任務邏輯，需確保在無 `editTaskId` 時，維持正常的新增行為。
- API 呼叫需處理錯誤與非同步載入狀態。

### 4. Acceptance Criteria
- 載入月曆與時程表時，自動透過 API 取得該年度台灣假日。
- 假日能在 UI 上清楚辨識 (特定顏色或文字)。
- 點擊月曆上的任何任務/事件，會彈出 `TaskModal` 進入編輯模式。
- 在 `TaskModal` 內可以修改名稱、狀態、日期、指派人員等，儲存後能即時反映在畫面上 (Update)。
- 在 `TaskModal` 內可以點擊「刪除」按鈕將事件移除，畫面即時消失 (Delete)。




## 🔧 重構 Project Scheduler 狀態管理與 Computed (Track B)

**Context (背景)**:
使用者要求在 src/domain/projectScheduler 頁面整理出完善的狀態管理與 computed。資料運算放在 Store，頁面計算放在 Composables。
目前 Dashboard.vue 內部包含了 getMemberTaskLanes, memberLanes, getTaskStyle, getTrackStyle, 以及 UI 的 Modal 開關狀態。

**既有行為 (Current Behavior)**:
- Dashboard.vue 自行計算排程表上的 lane 分配 (memberLanes)。
- Dashboard.vue 自行計算 css 的 left/width (getTaskStyle)。
- Dashboard.vue 管理 isTaskModalOpen 等狀態。

**變更內容 (Proposed Changes)**:
1. 將 memberLanes 與 getMemberTaskLanes (處理資料重疊的軌道算法) 移入 useProjectSchedulerStore.ts。
2. 建立 src/domain/projectScheduler/composables/useDashboardPage.ts 來管理 isTaskModalOpen, editTaskId, isProjectModalOpen, isCalendarMode 等 Modal 與 View 狀態。
3. 建立 src/domain/projectScheduler/composables/useTimelineStyles.ts 來封裝 getTaskStyle, getTrackStyle, 與 indDragAndDrop 這些牽涉到 DOM 計算的邏輯。

**影響範圍 (Scope)**:
- src/domain/projectScheduler/pages/Dashboard.vue
- src/domain/projectScheduler/store/useProjectSchedulerStore.ts
- src/domain/projectScheduler/composables/useDashboardPage.ts (新增)
- src/domain/projectScheduler/composables/useTimelineStyles.ts (新增)

**Backward Compat 評估**:
- [x] 重構程式結構，不影響既有視覺與操作行為。✅ 保留

**新 Acceptance (驗收標準)**:
- [ ] Dashboard.vue 內的 logic 被大幅簡化。
- [ ] store 負責所有跟資料排雷相關的 computed (memberLanes)。
- [ ] Composables 負責畫面呈現與事件綁定。
