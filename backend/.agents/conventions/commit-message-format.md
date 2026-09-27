# Commit Message 撰寫規範 (Conventional Commits for NestJS)

本文件規範 NestJS 後端專案之 Git Commit 訊息格式。統一使用 Conventional Commits 標準搭配 Emoji。

---

## 標題列格式 (Header Format)

```text
{type}({scope}): {emoji} {subject}
```

- `scope`: 可選。填寫變更的 NestJS 模組名稱 (如 `users`, `auth`, `common`, `database`, `plugins/stripe`)。
- `emoji`: 對應 `type` 的專屬 Emoji。
- `subject`: 簡短描述 (3~64 字元)，說明本次 commit 做的變更。

---

## Type 與 Emoji 對照表

| Type | Emoji | 說明 (Usage for NestJS Backend) |
| :--- | :---: | :--- |
| `feat` | 🎸 | 新增 NestJS API / 服務模組 / Controller / Service 邏輯 |
| `fix` | 🐛 | 修正 Bug / API 拋錯 / 邏輯異常 / 記憶體洩漏 |
| `refactor`| 💡 | 重構 / 程式碼優化 (不影響 API 介面與功能) |
| `test` | 💍 | 新增或修復單元測試 (`*.spec.ts`) 或 E2E 測試 (`*.e2e-spec.ts`) |
| `docs` | ✏️ | 新增或修改 JSDoc, API Docs, Swagger 或專案文件 |
| `perf` | ⚡️ | 資料庫 Query 優化 / 快取 (Redis) 效能提升 |
| `style` | 💄 | 代碼格式調整 (ESLint / Prettier / 空白行) |
| `chore` | 🤖 | pnpm 依賴升級 / Nest CLI 設定 / tsconfig 調整 |
| `ci` | 🎡 | GitHub Actions / Dockerfile / CI/CD 腳本修改 |

---

## 範例 (Examples)

```text
feat(users): 🎸 新增使用者註冊與 CreateUserDto 驗證
fix(auth): 🐛 修正 JWT Token 過期例外未被 Catch 問題
test(orders): 💍 補齊 OrderService.calculateTotal 單元測試
refactor(common): 💡 抽離 TransformInterceptor 至 src/common/interceptors
docs(api): ✏️ 補齊 UserController 匯出方法之 JSDoc 說明
```

---

## 完整 Commit Message 範例 (With Body)

```text
feat(payments): 🎸 整合 Stripe 支付 Plugin 模組

於 src/plugins/stripe 下建立 StripePlugin 封裝外包依賴，
新增 Webhook Controller 處理 payment_intent.succeeded 事件。
同時新增對應的單元測試與 DTO 驗證。

Closes #42
```
