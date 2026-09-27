---
name: component-reuse-checker
description: 確保在製作或修改前端頁面與組件時，優先掃描既有 src/components/ 以利重複使用。若是需要修改既有共用組件，必須評估是否會影響其他地方，且需請示使用者應抽出 Domain 組件或保持共用組件。在 dev-cycle 開發過程中強制呼叫。
---

# Component Reuse Checker (組件重用檢查)

## 目的 (Purpose)
確保在製作前端頁面時，最大化重用 `src/components/` 的既有組件，避免重複造輪子。同時，嚴格控管「修改既有共用組件」的風險，避免改動一個組件而導致其他已經引入該組件的頁面破版或行為異常。

## 觸發時機 (When to trigger)
- 在 `dev-cycle` 準備開發新頁面或新 UI 元件前。
- 當你需要引入某個畫面的 UI 元素時。
- 當你考慮修改 `src/components/` 中的檔案時。

## 執行流程 (Workflow)

### 1. 優先掃描 (Prioritize Scanning)
- **動作**：使用 `list_dir` 或是 `grep_search` 掃描 `src/components/` 底下的檔案（包含 `UI/` 等子資料夾）。
- **目的**：確認是否已經有現成的組件（例如 BaseButton, BaseInput 等）可以直接被引用，而不需要重新撰寫相同的 HTML/CSS。

### 2. 評估引入與控制 (Evaluate Import & Control)
- 若找到可用的既有組件，**必須優先直接引用**。
- 如果目前的既有組件與新需求有些微落差：
  - **原則 1**：你應該利用 `props` 或參數（如 class、插槽 slots 等）來控制新需求呈現的內容，**絕對不能影響其他已經引入此畫面的現有功能與樣式**。
  - **原則 2**：在修改該共用組件原始碼之前，必須執行全域搜索 (`grep_search`) 找出所有引入此組件的檔案，並確保你的 `props` 具有向下相容性（backward compatibility，例如給定預設值）。

### 3. 風險升級與決策 (Escalation & Decision)
- 如果你發現要修改該共用組件的行為會**無法向下相容**，或是極可能影響其他地方（例如大改 CSS 結構、改變事件名稱）：
  - **絕對禁止硬改**。
  - **動作**：必須暫停動作，並立即發訊息詢問使用者（User）：
    > 「修改此組件會影響現有的 `[受影響的頁面列表]`。您希望：\n> 1. 新增一個特定 Domain 的專屬組件 (Domain Component)？\n> 2. 還是將其重構為新的/更高階的共用組件 (Shared Component)？」
  - 根據使用者的裁決來決定下一步。

## 與 dev-cycle 的整合
在 `dev-cycle` 開發 UI 之前，你**必須**以工具調用或內部思考流程的形式，嚴格走過這份檢查清單。未經掃描與相容性確認，不得隨意在 `src/components/` 進行具有破壞性的變更。
