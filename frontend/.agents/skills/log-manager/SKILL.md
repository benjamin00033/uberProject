---
name: log-manager
description: >-
  Use this skill to create, manage, and update development logs (dev-logs) and specific task logs (task-logs).
  Trigger this when the user asks to "log progress", "update dev log", "save task log", or at the end of a task/session to persist knowledge.
---

# 開發與任務日誌管理 (Log Manager)

你是專案的知識管理員。當需要紀錄開發進度、決策或特定任務的完成狀況時，請依照本 Skill 的規範，自動生成或更新日誌檔案。

## 紀錄類型與檔名規範

系統分為兩種日誌：
1. **Dev Log (每日開發日誌)**：紀錄當天整體的進度、決策與待辦。
   - **目錄**：`.agents/dev-logs/`
   - **檔名**：`YYYY-MM-DD.md` (例如：`2026-07-14.md`)
2. **Task Log (任務日誌)**：針對單一特定任務的詳細紀錄，包含執行細節與產出。
   - **目錄**：`.agents/task-logs/`
   - **檔名**：`YYYY-MM-DD_HHmm.md` (例如：`2026-07-14_1130.md`)

## 執行步驟

### 1. 確認日誌類型與時間
首先取得當前的日期 (`YYYY-MM-DD`) 與時間 (`HHmm`)。判斷使用者是要更新整天的 `dev-log` 還是單次任務的 `task-log`。

### 2. Dev Log (每日開發日誌) 撰寫規範
請嚴格參照 `agent-template-main/agents/templates/dev-log.md` 的骨架。
若當天檔案已存在，請讀取並**追加 / 更新**內容，不要覆蓋舊進度。

包含以下 6 個固定區塊 (若無內容請填「無」)：
* **完成**：重點敘述系統多了什麼能力 (可附上 task-log 連結)。
* **進行中**：卡在哪個步驟。
* **詢問與裁決 (AI ↔ 使用者)**：紀錄選項與最終決策的「理由」。
* **決策 / 取捨**：非顯而易見的選擇與原因。
* **卡點 / 待解**：待釐清的問題。
* **下一步**：下次執行的第一件事。

### 3. Task Log (任務日誌) 撰寫規範
針對單一任務的詳細報告，每次新建一個檔案 (檔名包含時間)。
建議包含以下內容：
* **任務目標 (Goal)**：這項任務要解決什麼問題。
* **執行動作 (Actions Taken)**：修改了哪些檔案、下了哪些指令。
* **遇到問題與解決 (Issues & Resolutions)**：過程中發生的錯誤與解法。
* **驗證結果 (Results)**：測試或執行的結果確認。

### 4. 寫入檔案
使用 `write_to_file` 或對應工具，將內容正確寫入 `.agents/dev-logs/` 或 `.agents/task-logs/` 內。如果資料夾不存在，系統工具會自動為您建立。

### 5. 確保互相連結
若在寫 `dev-log`，請適時地使用 Markdown 連結指向對應的 `task-log` 檔案，以保持主日誌簡潔，並讓細節可被追溯。
