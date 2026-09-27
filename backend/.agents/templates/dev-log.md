# Development Log 範本 (NestJS Progress Logging)

每日開發日誌格式，用於記錄 NestJS 開發進度、決策與 Q&A 裁決。儲存於 `.agents/dev-logs/<YYYY-MM-DD>.md`。

---

## 範本內容 (Template)

```markdown
# 開發日誌 (Dev Log) — <YYYY-MM-DD>

## 📌 今日完成任務 (Completed Tasks)
- [x] **[feat(users)]**: 完成 UsersModule 腳手架與 CreateUserDto 驗證器
- [x] **[test(users)]**: 完成 UserService 單元測試與 UserController E2E 測試

## 💡 關鍵架構決策 (Architectural Decisions)
- 將第三方 Stripe 金流服務封裝於 `src/plugins/stripe/`，避免核心 Business Service 直接依賴 Stripe SDK。
- 跨模組電郵發送抽離至 `src/shared/mail/mail.module.ts`。

## ❓ 詢問與裁決 (Q&A & User Decisions)
- **Q**: 使用者密碼加密應該在 Controller 還是 Service 處理？
- **A**: 裁決放在 `UserService` 或 `src/utils/hash-password.util.ts` 中，維持 Controller 的純粹 HTTP 轉發職責。

## 🚧 下一步規劃 (Next Steps)
- 實作 OrdersModule 結帳邏輯與 Redis 鎖定機制。
```
