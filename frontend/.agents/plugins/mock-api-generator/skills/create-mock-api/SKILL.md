---
name: create-mock-api
description: >-
  Use this skill to generate MSW (Mock Service Worker) API handlers and mock data for a domain.
  It references the standard formats in src/mock to ensure consistency with createStandardResponse.
---

# Mock API 生成器 (Mock API Generator)

當使用者要求「新增 Mock API」、「製作 Mock 資料功能」時，請執行此 Skill 來保持 Mock 格式與 `src/mock` 現有規範完全一致。

## 執行步驟

### 1. 取得 Domain 型別定義
首先使用 `view_file` 或 `grep_search` 找出該 Domain 的 `types.ts`，確認要 mock 的資料結構 (Interface)。

### 2. 建立專屬 Mock 檔案
在 `src/mock/` 底下建立新的檔案，命名為 `[domainName]Mock.ts` (例如：`userMock.ts`)。

撰寫規範 (必須參考 `menuItemMock.ts` 的格式)：
- **引入依賴**：`import { http, HttpResponse } from "msw";` 以及 `import { createStandardResponse } from "./handlers";`。
- **定義 API_KEYS**：宣告專屬的 API KEYS，例如 `USER_GET`, `USER_POST`。
- **建立 In-memory DB**：宣告一個 let 陣列 (例如 `export let mockUsers: User[] = [...]`) 並填入具備代表性的假資料。
- **實作 Callbacks**：宣告 `export const [domainName]Callbacks: Record<string, any> = { ... }`。
- **CRUD 實作**：使用 `http.get`, `http.post`, `http.put`, `http.delete` 等實作，並**強迫使用 `createStandardResponse`** 來包裹回傳資料。針對錯誤情境 (如 ID 找不到) 需自訂 `res_code` 與 `success: false`。

### 3. 註冊到全域 Handlers (`handlers.ts`)
使用 `multi_replace_file_content` 工具去修改 `src/mock/handlers.ts`：
1. **匯入 Callback**：在上方加入 `import { [domainName]Callbacks } from "./[domainName]Mock";`
2. **註冊 API_KEYS**：將新的 API 鍵值加進 `export const API_KEYS = { ... }` 裡面 (如果有統整需求的話)。
3. **擴充 callbacks 物件**：在 `export const callbacks: Record<ApiKey, HandlerCallback> = { ... }` 的末端，使用展開運算子加入 `...[domainName]Callbacks,`。

### 4. 日誌紀錄 (Log Manager)
Mock API 建置與串接完成後，強制呼叫 `log-manager` Skill：
- 建立一份 `task-log`，記錄您新增了哪些 API 路徑的 Mock，以及假資料的邏輯。
- 更新今日的 `dev-log`，將 Mock API 開發紀錄在「完成」區塊中。
