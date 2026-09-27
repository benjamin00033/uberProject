# Bug-Report 範本（Track C — 除錯）

Track C 除錯時，由 needs-analysis 在 dev-workflow Step 2 產出。跟 task.md / change-request.md 不同的是核心欄位是「症狀 / 重現步驟 / Root cause / 影響範圍 / Regression case」。

複製下方骨架、貼到 `agents/planning/tasks.md` 當 `## 🐛 <bug 標題>` 區塊。

---

## 使用方式

1. 複製下方「範本骨架」整段
2. 貼到 `tasks.md` 任務列表最上方，標題加 `🐛` 前綴
3. 填完七個欄位（**症狀 / 重現步驟 / 期望行為 / Root cause / 影響範圍 / 修法策略 / Regression case**）後再交給 dev-cycle
4. 完成後加 `✅` 並附 commit hash

Track C 最大的盲點：

1. 修了症狀不是 root cause — bug 換個地方爆
2. 沒掃影響範圍 — 同樣的肇因在別處也存在
3. 沒寫 regression test — 一週後同 bug 復發

---

## 範本骨架

```markdown
## 🐛 <一句話描述 bug，例如：訂單列表搜尋輸入空白後仍保留上次結果>

**症狀**（使用者觀察到什麼）
- 進入訂單列表頁、搜尋「ABC」→ 看到 3 筆
- 清空搜尋欄 → 預期看到全部，**結果仍只看到那 3 筆**
- 重新整理頁面 → 才會出現全部

**重現步驟**（精確、可複製）
1. 用 admin 帳號登入
2. 進入 `/admin/orders`
3. 在搜尋欄輸入「ABC」、等列表更新
4. Backspace 清掉「ABC」，欄位變空白
5. 觀察列表 — 仍只有那 3 筆

**期望行為**
搜尋欄變空白 → 列表應該立即恢復顯示全部訂單。

**Root cause**（Track C 核心）
`domains/orders/hooks/useOrderList.ts` 第 N 行：
```ts
const filtered = computed(() =>
  search.value
    ? all.value.filter((o) => o.code.includes(search.value))
    : all.value  // ← bug：search.value 為空字串 '' 時 truthy 判斷會走錯邊
)
```
JavaScript 中 `'' ? a : b` 走 b 沒錯，但這裡的 debounce 機制把空字串轉成 undefined 之前就觸發了 computed，導致 `filtered` 短暫停留在上次結果。

**影響範圍**（同一個 root cause 在別處）
- ✅ `useOrderList.ts` — 已定位
- ⚠ `useUserList.ts` — 同樣的 debounce + computed 模式，**也有同樣的 bug**
- ⚠ `useProductList.ts` — 同樣模式，需要確認
- ✅ `useReportSummary.ts` — 不同模式，不受影響

**修法策略**
1. 共用一個helper `filterByQuery(items, query, fields)` 放 `domains/shared/utils/`
2. 各 hook 改用該helper（避免散在各處的 debounce 邏輯有同樣盲點）
3. helper內部處理空字串 / null / undefined / whitespace-only 為「不過濾」

**Regression case**（防複發）
單元測試（dev-cycle 同輪補）：
- 空字串 query → 回傳全集
- whitespace-only query（`'  '`）→ 回傳全集
- null / undefined query → 回傳全集
- 非空 query → 過濾

整合測試（spec-tester 補）：
- 使用者：搜尋「ABC」看到子集 → 清空 → 立即看到全集（不需重新整理）

**References**（選填）
- 使用者回報截圖：（連結 / 路徑）
- 相關 dev-log：YYYY-MM-DD.md
```

---

## 完整範例（簡短版）

```markdown
## 🐛 上傳圖片有時會回到舊圖

**症狀**
使用者在編輯頁傳新圖 → toast 顯示「上傳成功」→ 但畫面有時仍顯示舊圖、要刷頁才更新。

**重現步驟**
1. 進 `/admin/items/<id>/edit`
2. 點圖片 → 選新圖 → 確認上傳
3. 等 toast 出現「上傳成功」
4. 觀察畫面 — 圖片有時沒變、有時變了

**期望行為**
toast 出現「上傳成功」當下，畫面立即反映新圖；不需重新整理。

**Root cause**
`domains/items/components/ItemImageUpload` 第 N 行：
```ts
await uploadImage(file)
item.imageUrl = newUrl  // ← Storage CDN 有 5-10s 快取，新 URL 立即取會收到舊圖
```
Storage CDN 邊緣節點對「剛上傳的新版本」可能還沒同步，前端立刻用新 URL fetch 會拿到舊快取版本。表現出來就是「有時候」復現。

**影響範圍**
- ⚠ `ItemImageUpload` 元件 — 已定位
- ⚠ `LogoUpload` 元件 — 同樣 pattern（如果未來實作）
- ✅ 其他 Storage 用途（檔案下載）不受影響

**修法策略**
1. 上傳後在 URL 加 cache-busting query：`?v=${Date.now()}`
2. 或：在 `<img>` 用 `key=imageUrl` 強制 re-mount，不靠 src 改變

**Regression case**
單元測試：
- `getImageUrl(id, version)` helper — 同 id 不同 version 回傳不同 URL

整合測試：
- 使用者：上傳新圖 → toast 出現的同一個 frame，UI 顯示新圖（不需重新整理）
- 同一個元件連續上傳兩次都生效
```
