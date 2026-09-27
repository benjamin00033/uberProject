撰寫規範
那麼接下來講一下 SKILL.md 的撰寫規範，主要是使用 YAML Front Matter 來定義 Skill 的基本資訊，像是這樣：

markdown

## 複製程式碼

name:
description:

---

但欄位並不是只有這兩個，底下這邊我也提供完整的欄位說明。

name（必填）：必須是小寫字母、數字、連字號，不能有空格或大寫
description（必填）：最重要的欄位，因為 Claude Code 會用它來決定這個 Skill 適合用在什麼樣的情境。
allowed-tools（可選）： 限制這個 Skill 執行時可以使用的工具。
model（可選）：指定執行這個 Skill 時要使用的模型（預設使用對話中的模型）。
context（可選）：設定這個 Skill 的運作上下文。
agent （可選）：指定這個 Skill 適用的 Agent 類型。
hooks（可選）：定義這個 Skill 的生命週期事件。
user-invocable（可選）：設定這個 Skill 是否可以被使用者直接呼叫。
disable-model-invocation（可選）：僅允許手動觸發，禁止 AI 主動呼叫。
接下來我將會針對 name 與 description 以外的欄位做說明。

可選欄位(allowed-tools)
簡單來講就是限制這個 Skill 執行時 Claude 只能使用指定的工具，且使用這些工具時不需要詢問使用者許可。

markdown

## 複製程式碼

name: example-skills
description: This is an example skill for demonstration.
allowed-tools:

- Read
- Grep
- Glob

---

可選欄位(model)
你可以指定這個 Skill 適用的模型，而模型你可以透過 Anthropic 提供的 模型清單 來做選擇。

markdown

## 複製程式碼

name: example-skills
description: This is an example skill for demonstration.
model: claude-haiku-4-5-20251001

---

可選欄位(context)
將這個 Skill 執行在獨立的 sub-agent 環境，擁有獨立的對話歷史，執行完畢後只回傳結果給主對話，避免中間過程污染主對話的 context。

markdown

## 複製程式碼

name: example-skills
description: This is an example skill for demonstration.
context: fork

---

可選欄位(agent)
這個欄位必須搭配 context: fork 一起使用，用來指定這個 Skill 要在哪種 Agent 環境下執行。

Claude Code 內建了三種 Agent 類型：

Agent 類型 用途說明
Explore 適合搜尋檔案、理解架構等任務
Plan 適合設計方案、分析需求等任務
general-purpose 通用型 Agent，適合各種綜合性任務（預設值）
markdown

## 複製程式碼

name: code-analysis
description: Analyze code quality and generate detailed reports.
context: fork
agent: Explore

---

除了內建的 Agent 類型之外，你也可以指定自訂 Agent 的名稱。自訂 Agent 需要放在 .claude/agents/ 資料夾底下：

Text

複製程式碼
.claude/
├── agents/
│ └── security-reviewer.md # 自訂 Agent
└── skills/
└── security-check/
└── SKILL.md
然後在 Skill 中引用：

markdown

## 複製程式碼

name: security-check
description: Perform security analysis on the codebase.
context: fork
agent: security-reviewer

---

Note
當你使用 context: fork 時，Skill 會在獨立的 sub-agent 環境中執行，擁有獨立的對話歷史。執行完畢後只會將結果回傳給主對話，避免中間過程污染主對話的 context。這對於需要大量搜尋或分析的任務特別有用。

可選欄位(hooks)
沒錯，你可以替這個 Skill 定義生命週期，例如在載入前或執行後要做什麼事情。

markdown

## 複製程式碼

name: secure-operations
description: Perform operations with additional security checks
hooks:
PreToolUse: - matcher: "Bash"
hooks: - type: command
command: "./scripts/security-check.sh $TOOL_INPUT"
once: true

---

而這些 Hooks 都可以在 Hooks 文件 裡面找到詳細的說明。

可選欄位(user-invocable)
這個欄位可以設定這個 Skill 是否可以被使用者直接呼叫，什麼叫做可以直接呼叫呢？也就是你可以透過 / 指令來呼叫這個 Skill。

markdown

## 複製程式碼

name: example-skills
description: This is an example skill for demonstration.
user-invocable: true

---

可選欄位(disable-model-invocation)
這個欄位用來禁止 AI 主動呼叫這個 Skill。設為 true 後，這個 Skill 只能透過使用者手動輸入 /skill-name 來觸發，Claude 不會自動判斷並呼叫它。例如：你希望某個 Skill 只在使用者明確要求時才執行，而不是讓 Claude 自動判斷。

markdown

## 複製程式碼

name: dangerous-operation
description: Perform a dangerous operation that requires explicit user consent.
user-invocable: true
disable-model-invocation: true

---

為了讓你更好理解 user-invocable 和 disable-model-invocation 的差異，這邊整理一個對照表：

設定 斜線選單 / Claude 自動呼叫 適用情境
預設值 可見 允許 一般用途
user-invocable: false 隱藏 允許 Claude 可用，但不想讓使用者手動呼叫
disable-model-invocation: true 可見 禁止 使用者可呼叫，但不想讓 Claude 自動判斷
字串替換功能
在 SKILL.md 的內容中，你可以使用字串替換來動態插入資訊：

變數 說明
$ARGUMENTS	呼叫 Skill 時傳入的所有參數
${CLAUDE_SESSION_ID} 當前 Session 的唯一識別碼
這個功能在需要記錄或追蹤的場景特別有用：

markdown

## 複製程式碼

name: session-logger
description: Log activity for the current session.

---

Please log the following content to `logs/${CLAUDE_SESSION_ID}.log`:

$ARGUMENTS
當使用者執行 /session-logger 今天完成了登入功能 時，$ARGUMENTS 會被替換成「今天完成了登入功能」，而 ${CLAUDE_SESSION_ID} 會被替換成當前的 Session ID。

範例 Skills
接下來我們來寫一點點 Skills 的範例，這邊我會示範一個 Code Review 的 Skill，而這個 Skill 擅長 JavaScript 的程式碼審查，為了方便理解，所以 description 我會使用中文撰寫（實際開發上會建議使用英文）。

建立 Skills 方式也很簡單，打開你的專案輸入以下指令：

Bash

複製程式碼
mkdir -p .claude/skills/code-review # 建立資料夾
touch .claude/skills/code-review/SKILL.md # 建立 SKILL.md 檔案
接著把底下貼到 .claude/skills/code-review/SKILL.md 裡面：

markdown

## 複製程式碼

name: code-review
description: 當使用者要求進行 JavaScript 或 TypeScript 程式碼審查時使用。適用於「幫我 review」、「檢查這段程式碼」、「有什麼問題」等請求。

---

# JavaScript Code Review

當進行程式碼審查時，請依照以下步驟進行：

## 審查重點

1. **命名規範**：變數、函式命名是否清晰且符合 camelCase
2. **錯誤處理**：是否有適當的 try-catch 或錯誤邊界處理
3. **效能問題**：是否有不必要的迴圈、重複渲染或記憶體洩漏風險
4. **安全性**：是否有 XSS、注入攻擊等潛在風險
5. **可讀性**：程式碼是否易於理解，是否需要重構

## 輸出格式

請使用以下格式回覆：

### 🔴 必須修正

- [問題描述] → [建議做法]

### 🟡 建議改善

- [問題描述] → [建議做法]

### 🟢 優點

- [值得肯定的地方]
  完成後你的資料夾結構就會長這樣：

Text

複製程式碼
project-root/
└── .claude/
└── skills/
└── code-review/
└── SKILL.md
接著底下這邊是一個不良的 JavaScript 程式碼範例，請你放到專案裡面（如： /bad-code.js ），然後使用 Claude Code 來進行程式碼審查：

JavaScript

複製程式碼
function f(d) {
var x = [];
for (var i = 0; i < d.length; i++) {
var item = d[i];
if (item.n != null && item.n != undefined && item.n != '') {
var el = document.getElementById('list');
el.innerHTML = el.innerHTML + '<li onclick="handle(\'' + item.n + '\')">' + item.n + '</li>';
x.push(item.n);
}
}
return x;
}

function handle(n) {
eval('alert("Hello, ' + n + '")');
}

async function getData() {
const response = await fetch('/api/data');
const data = await response.json();
return data;
}
而這一段程式碼目前有幾個明顯的問題點：

類型 問題
命名 f、d、x、n 完全看不出用途
安全性 innerHTML 直接拼接字串 → XSS 風險
安全性 eval() 是超級危險的函式
錯誤處理 fetch 沒有 try-catch，也沒檢查 response.ok
效能 迴圈內重複 getElementById 和修改 DOM
語法 使用 var 而非 const/let
比較 != null && != undefined && != '' 可以簡化
接著請你打開 Claude Code（我示範的是 VSCode Plugin），然後在對話框輸入以下 Prompt：

Text

複製程式碼
請你幫我檢查一下 @bad-code.js
接著你會看到 Claude Code 詢問你 Do you want to proceed with Skill?，按下「Yes」就對了

Do you want to proceed with Skill?
Do you want to proceed with Skill?

接著你就會看到 Claude Code 使用我們剛剛建立的 code-review Skill 來進行程式碼審查，並且回傳以下結果：

Code Review
Code Review

如果你也自己試試看，你也可以下載這個範例專案：GitHub Repository

撰寫最佳實踐
在撰寫 Skills 時，有一些最佳實踐可以讓你的 Skill 更有效率：

SKILL.md 檔案大小
官方建議 SKILL.md 檔案應該保持在 500 行以內，這樣可以確保載入效能。如果你的 Skill 需要大量的參考文件，建議使用外部檔案引用的方式：

Text

複製程式碼
.claude/skills/my-skill/
├── SKILL.md # 保持精簡，500 行以內
├── reference.md # 詳細的 API 文件
└── examples.md # 使用範例
引用層級
使用單層引用（SKILL.md → reference.md），避免多層巢狀引用（SKILL.md → reference.md → other.md → more.md），這樣可以減少載入時間和複雜程度。

善用腳本
如果你的 Skill 需要執行複雜的邏輯，可以將這些邏輯放在腳本中執行。腳本的執行結果會被傳回給 Claude，但腳本的原始碼不會被載入到 Context 中，這樣可以節省 Token：

Text

複製程式碼
.claude/skills/data-processor/
├── SKILL.md
└── scripts/
└── process.py # 複雜的資料處理邏輯
疑難排解
Skill 沒有被觸發？
最常見的原因是 description 寫得太模糊。一個好的 description 應該要回答以下兩個問題：

這個 Skill 做什麼？ - 列出具體的功能
什麼時候應該使用它？ - 包含使用者可能會說的觸發詞
不好的寫法：

YAML

複製程式碼
description: Helps with documents
好的寫法：

YAML

複製程式碼
description: Extract text and tables from PDF files, fill forms, merge PDFs. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
