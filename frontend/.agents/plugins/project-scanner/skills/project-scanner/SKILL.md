---
name: project-scanner
description: "平行掃描專案工具。在除錯與修改 (dev-workflow) 之前呼叫此技能，可以一次開啟多個 Agent 進行專案掃描（例如：找出所有 .scss 檔、掃描 .vue 檔、尋找特定關鍵字如 console.log 等），並將結果彙整交給後續的 needs-analysis 或是 dev-cycle。"
---

# Project Scanner (專案平行掃描)

## 目的 (Purpose)
在進行除錯 (Track C) 或是大範圍修改 (Track B) 前，我們需要對專案的現狀有全面的了解。這個技能允許 Leader (你) 透過 `invoke_subagent` 一次性派發多個子 Agent，進行**平行**的專案掃描與結構盤點，藉此收集完整資訊，再進入後續的 `needs-analysis` 或 `dev-cycle`。

## 觸發時機 (When to trigger)
- 在執行除錯 (Bug Fix) 或大範圍重構/修改之前。
- 當使用者要求「掃描專案」、「找某個關鍵字」、「列出所有特定類型的檔案」時。
- 任何你需要分派多個 Agent 同時幫你肉搜專案資訊的情境。

## 執行流程 (Workflow)

### 1. 決定掃描任務清單 (Define Scan Tasks)
根據使用者的需求，決定你需要分派幾名子 Agent。例如：
- 任務 1：尋找所有 `.scss` 檔案中的某個變數。
- 任務 2：尋找所有 `.vue` 檔案中的 `<script setup>` 結構。
- 任務 3：全域尋找是否有遺留的 `console.log`。

### 2. 呼叫子 Agent (Invoke Subagents)
使用你的 `invoke_subagent` 工具，一次傳入多個 `Subagents` 設定檔。
- **TypeName**: 請使用 `research` 或 `self`。
- **Role**: 明確給予職責（例如 `SCSS Scanner`, `Vue Scanner`, `Log Finder`）。
- **Prompt**: 給予明確的搜尋目標。例如：「請幫我找出專案中所有包含 `console.log` 的檔案，並回報結果清單。你可以使用 `grep_search` 工具。」

### 3. 等待並彙整 (Wait and Aggregate)
- 呼叫工具後，你**不需要**持續等待，系統會在子 Agent 傳送訊息時自動喚醒你。
- 收集所有子 Agent 回傳的資訊，進行統整。

### 4. 交接給下一步 (Handover)
- 將統整後的掃描結果，轉換為對應的 Context 或 Brief。
- 依據開發流程 (dev-workflow)，將結果傳遞給負責後續任務的 `needs-analysis` 或 `dev-cycle` 階段。
