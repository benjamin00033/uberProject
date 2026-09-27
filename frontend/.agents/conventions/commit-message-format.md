# Commit Message 撰寫格式

走 Conventional Commits 衍生規約，標題列含 emoji（跟一般 commitizen-emoji 設定一致）。

## 標題格式

```text
{type}({scope}): {emoji} {subject}
```

- `scope` 可省略（沒範圍時整段 `(...)` 也省略）
- `emoji` 由 `type` 決定，見下方對照表
- 整行 3–64 字元
- 中文 / 英文都可，動詞開頭、不加句號

### 範例

```text
feat(users): 🎸 新增使用者大量匯入功能
fix(orders): 🐛 修正金額計算遇 null 拋錯
docs: ✏️ 補上 commit 撰寫格式文件
refactor(payments): 💡 抽出折扣計算 helper
chore: 🤖 升級依賴套件
```

## Type 對照表

| Type | Emoji | 用途 |
| --- | --- | --- |
| `feat` | 🎸 | 新增 / 修改功能 |
| `fix` | 🐛 | 修正 bug |
| `refactor` | 💡 | 重構 / 優化，非新功能也非 bug |
| `perf` | ⚡️ | 提升效能 |
| `style` | 💄 | 程式碼格式（lint / 空白 / 分號），不影響運作 |
| `test` | 💍 | 新增 / 補測試 |
| `docs` | ✏️ | 新增 / 修改文件 |
| `chore` | 🤖 | 第三方套件、設定、輔助工具維護 |
| `ci` | 🎡 | CI / CD 相關 |
| `release` | 🏹 | 正式 release commit |

> 找不到合適的 type 就先想想是不是把多件事塞同一個 commit。一個邏輯改動一個 commit。

## 完整 Commit Message 結構

```text
{type}({scope}): {emoji} {subject}

{body}

BREAKING CHANGE: {breaking}

Closes #{issue}
```

| 區塊 | 必填 | 說明 |
| --- | --- | --- |
| 標題列 | ✅ | 上述格式，64 字元內 |
| body | 條件 | 解釋「為什麼」而不是「做了什麼」（diff 已經說明 what） |
| BREAKING CHANGE | 條件 | 破壞性變更一定要寫，列出影響範圍跟遷移指引 |
| Closes #N | 條件 | 關聯 GitHub Issue |

### 範例（含 body）

```text
feat(billing): 🎸 加入帳號資料遮罩顯示

非 admin 角色檢視時，敏感欄位只顯示後四碼。
完整資料走 server route /api/billing/[id]/reveal，
寫 audit-log 記錄誰在何時讀取。

Closes #142
```

### 範例（BREAKING CHANGE）

```text
refactor(auth): 💡 移除前端寫入特權欄位的能力

Security Rules 改成 .write: false，所有 status / role 變更
都走 server/api/users/activate 之類的 server route。

BREAKING CHANGE: 任何直接呼叫前端 update 特權欄位的程式碼
會被 rules 擋掉，改呼叫對應的 server route。
```

## 反例

- ❌ `update code` — 沒 type、沒 emoji、subject 沒資訊
- ❌ `feat: add stuff` — subject 太模糊
- ❌ `feat(billing): 🎸 add masking and refactor calculation and fix typo` — 一次塞太多邏輯、且超過 64 字元
- ❌ `fix(orders): 修正 bug` — 沒講修了什麼 bug
- ❌ 把 emoji 換成不在對照表的（`feat: 🚀 ...`）— emoji 一定對應 type

## 提交前 checklist

1. verify 全綠（typecheck + lint + test）
2. 商業邏輯有對應測試
3. commit 訊息符合本文件格式
