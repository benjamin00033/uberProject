# Bug Report 範本（Track C — NestJS Bug 除錯修復）

給 AI 進行 NestJS Bug 排除用的 Bug Report Brief。複製下方骨架貼到 `planning/tasks.md` 當作 `## <Bug 修復名稱>` 區塊。

---

## 範本骨架 (Template Skeleton)

```markdown
## <修復 + 關鍵字描述，例如：修復 OrderService 於優惠券過期時拋出 500 未預期錯誤>

**Symptom** — Bug 症狀與重現步驟
- 呼叫 `POST /api/v1/orders/checkout` 帶入已過期的 `couponCode` 時，API 回傳 500 Internal Server Error 而非 422/400 Bad Request。

**Stack Trace / Logs** — 錯誤 Log 節錄
```text
TypeError: Cannot read property 'discountRate' of undefined
    at OrderService.applyCoupon (src/modules/orders/services/order.service.ts:88:24)
```

**Root Cause** — 根本原因分析 (診斷定位結果)
- `OrderService.applyCoupon` 未檢查 `coupon` 物件是否為 null 即存取 `discountRate`，導致 TypeError 爆出並由全域 Filter 捕捉為 500。

**Fix Strategy** — 修復策略
- 於 `OrderService.applyCoupon` 增加 Null 檢查，若找不到 Coupon 拋出自訂之 `UnprocessableEntityException('Coupon expired or invalid')`。

**Scope** — 影響檔案
- `src/modules/orders/services/order.service.ts`
- `src/modules/orders/services/order.service.spec.ts`

**Acceptance & Regression Test** — 驗收與迴歸測試
- [ ] 帶入過期 Coupon 請求時，API 正確回應 `422 Unprocessable Entity`
- [ ] 撰寫 Regression Test: `it('regression: should throw UnprocessableEntityException when coupon is invalid', ...)`
- [ ] 既有全部測試與 E2E 測試全綠 (`pnpm run test`)
```
