## 新增動態表單建置器 (Form Builder)

**Context** — 目前 `dynamicForm` domain 只有表單渲染器，缺乏一個讓使用者自行組裝並設定動態表單欄位、步驟與路由條件的建置介面。需要提供一個可以建立新表單與編輯舊表單的頁面。

**Goal**
- 使用者可以在新的 `/dynamicForm/builder` 頁面以點擊操作 (含彈窗設定) 來建構表單步驟、欄位與跳轉路徑。
- 支援「建立新表單」與「編輯舊表單」。
- 提供將完成的表單設定存檔的功能，並串接對應的 Mock API。

**Scope**
- ⚠ 含 UI 工作
- `src/domain/dynamicForm/pages/formBuilder.vue`（新增）
- `src/domain/dynamicForm/routes.ts`（新增 `formBuilder` 路由）
- `src/domain/dynamicForm/components/`（視需要新增設定用的彈窗元件）
- `src/domain/dynamicForm/services/`（新增 Service，例如 `DynamicFormService.ts`，參考 `MenuService.ts` 透過 `apiClient.ts` 實作 API 呼叫）
- `src/domain/dynamicForm/composables/`（新增或擴充，利用 `useApiQuery` / `useMutation` 封裝 Service 呼叫）
- `src/mock/`（新增儲存與讀取表單 Schema 的 Mock Request 內容）

**Acceptance**
- [ ] 能透過路徑進入 formBuilder 頁面，能依狀況進入「新增」或「編輯」模式。
- [ ] 支援點擊新增「表單步驟(Step)」與「欄位(Field)」。
- [ ] 點擊設定時，能跳出彈窗設定細節（型別、Props、驗證、路由條件等）。
- [ ] 點擊儲存能成功發送 Request 到 `src/mock` 所定義的介面（必須透過 Service 層與 Composables 實作）。
- [ ] 產生與存檔的 `DynamicFormSchema` 格式正確。
- [ ] verify 全綠。
**Non-goals**
- 不做 Drag & Drop 拖曳排序。
- 不做真實後端 API 串接（僅串接 Mock）。

---

# 🐛 Bug Report: TestBaseUIPage 佈局破版修復

## 1. 症狀 (Symptom)
- `TestBaseUIPage.vue` 中有部分內容（Theme Toggle 區塊的 `<ion-card>`）可能遮擋、不會滾動或發生佈局錯誤。

## 2. 重現步驟 (Steps to Reproduce)
1. 導覽至 TestBaseUI 頁面
2. 觀察畫面上方的 Theme Toggle 卡片區塊，其 DOM 節點未被包含在 Ionic 核心滾動容器 (`<ion-content>`) 內。

## 3. 期望行為 (Expected Behavior)
- 所有的頁面內容（除了 header/footer）都應該受到 `<ion-content>` 妥善包裹與滾動管理，佈局正常呈現。

## 4. Root Cause (根本原因)
- 在 `TestBaseUIPage.vue` 的 `<template>` 結構中，有一個 `<div>` (包含 `toggleTheme` 的卡片) 被直接放置在 `<ion-header>` 與 `<ion-content>` 之間，違反了 `@ionic/vue` 頁面元件結構規範。

## 5. 影響範圍 (Impact Scope)
- 僅限 `src/domain/testBaseUI/pages/TestBaseUIPage.vue` 該元件的排版。無其他依賴或共用邏輯影響。

## 6. 修法策略 (Fix Strategy)
- 將錯誤放置於 `<ion-content>` 外部的 `<div>` 卡片區塊，向下搬移並放入 `<ion-content>` 中（例如置於 `<ion-grid>` 內部或上方）。

## 7. Regression Test Case
- 確認將該區塊搬移至 `<ion-content>` 內部後，畫面正常渲染且可正常滾動，並且「Toggle Theme」功能不受影響正常運作。

---

## 🧪 搭配 Playwright 與 Playwright MCP 構築專案 E2E 測試流程

**Context** — 為了建立穩固的系統驗收與回歸測試防線，需要配置專案的 Playwright E2E 測試框架，並規範 AI Agent 如何在開發週期中搭配 Playwright MCP 進行 UI 驗收與實時網頁操作驗證。

**Goal**
- 安裝與配置 `@playwright/test` 作為專案的 E2E 測試核心。
- 建立 `playwright.config.ts` 設定檔，對齊本機開發環境（Vite port: 1111，base path: `/uberMenu/`），並設定 webServer 以便在測試時自動啟動開發伺服器。
- 在 `package.json` 中新增 `test:e2e` 指令。
- 撰寫 `tests/e2e/login.spec.ts` 驗證登入頁面渲染與基本跳轉邏輯。
- 撰寫 `tests/e2e/theme.spec.ts` 驗證 TestBaseUI 頁面下的 Light / Dark / Cyberpunk 主題切換與色彩。
- 撰寫 `agents/planning/e2e-mcp-guide.md` 指引，說明 AI Agent 如何在執行任務時使用 Playwright MCP 工具進行自動化網頁操作、截圖驗證與視覺回歸排查。

**Scope**
- `playwright.config.ts`（新增）
- `package.json`（修改，新增測試 script 與 devDependencies）
- `tests/e2e/login.spec.ts`（新增）
- `tests/e2e/theme.spec.ts`（新增）
- `agents/planning/e2e-mcp-guide.md`（新增，AI MCP 驗收操作手冊）

**Acceptance**
- [ ] `pnpm install` 安裝成功，無依賴衝突。
- [ ] 執行 `pnpm run test:e2e` 能在 Headless 模式下自動編譯並順利跑完所有 E2E 測試。
- [ ] 登入頁面與主題切換測試全部通過（All tests passed）。
- [ ] 產出 AI Playwright MCP 操作手冊，驗證 AI 能運用 MCP 進行 E2E 實時頁面檢查。
- [ ] verify 與 build 全綠。

**Non-goals**
- 本次僅做前端 UI/路由測試，暫不與實體後端 API 做真實資料清洗與寫入驗證。

## ?? �ק�ݨD: �N�Ҧ� ion-spinner ������ ion-loading

**Context** �X �Τ@�M�פ��� loading ����A��� `ion-spinner`�A������� `<ion-loading>`�C

**Goal**
- ��X�M�פ��Ҧ��ϥ� `ion-spinner` ���a��A�ñN������� `<ion-loading>`�C

**Scope**
- `src/components/Layout/DynamicLayout.vue`
- `src/domain/dynamicForm/pages/dynamicForm.vue`
- `src/domain/menu/pages/MenuTime.vue`
- `src/domain/menu/pages/OptionMenu.vue`

**Acceptance**
- [x] ���M�פ��A�� `ion-spinner`�C
- [x] �ݫO�d�즳�� loading �޿�A�óz�L `is-open` �j�w�C
- [x] verify ����C


## Budget Domain CRUD
**Context**
使用者需要一個全新的 Budget (預算) 功能，具備 CRUD 能力。
**Goal**
建立 `budget` domain，包含 `budget` 頁面，並套用 `ui-standardize`, `domain-scaffolder`, `mock-api-generator`, `i18n-generator`。
**Scope**
- 建立 `src/domain/budget` 架構。
- 建立 Mock API (`src/mock/budgetMock.ts`)。
- 整合 i18n 多國語系 (`src/locale/language.ts`)。
- 建立列表頁與表單介面。
**Acceptance**
- [ ] 能在畫面上看到 Budget 列表。
- [ ] 支援多國語系 (中英文)。
- [ ] Mock API 可正常攔截並回應。
**Non-goals**
- 不串接真實後端 API。
