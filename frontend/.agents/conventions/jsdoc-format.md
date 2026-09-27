# JSDoc 撰寫格式

鐵則 4 — 每個 `export` 都要有 JSDoc。TS 已經表達 type，JSDoc 不要重複，專注在語意（做什麼 / 為什麼）。

> 這份針對 JS / TS 寫的。其他語言請用該語言的標準 doc 格式（Python docstring / Rust doc comment 等），核心精神一樣：寫語意不寫型別。

## 規則

1. 第一行一句話描述「做什麼 / 為什麼」，不要重述函式名
2. 非顯而易見的參數補 `@param`（顯而易見的就別寫廢話）
3. 非顯而易見的拋錯補 `@throws`
4. 公開 API / 工具 / helper補 `@example`
5. 不要寫 `@param {Type}` — 型別 TS 已經有了，雙重維護只會脫鉤

## 寫什麼 / 不寫什麼

| 該寫 | 不該寫 |
| --- | --- |
| 為什麼這個函式存在、解決什麼問題 | 重述名稱（`/** Calculate price */ calculatePrice(...)`） |
| 非顯而易見的副作用、邊界條件 | 顯而易見的事（「回傳一個物件」） |
| 演算法重點、業務規則出處 | TS 已經表達的型別 |
| 會拋什麼錯、什麼情境會拋 | `@returns` 如果型別已經很清楚 |

## 範例

### Helper / 工具函式

```ts
/**
 * 計算訂單最終金額（小計 + 運費 - 折扣 + 稅）。
 *
 * 運費依國家代碼查表；未設定的國家 fallback 到預設費率。
 *
 * @param order  訂單資料
 * @param config  運費 / 稅率設定
 * @throws {Error} 訂單品項清單為空時
 * @example
 * const total = calculateOrderTotal(order, config)
 * // → { subtotal: 1000, shipping: 60, discount: 100, tax: 48, total: 1008 }
 */
export function calculateOrderTotal(
  order: Order,
  config: PricingConfig,
): OrderTotal {
  // ...
}
```

### Hook / 整合層

```ts
/**
 * 拿當前使用者的訂單列表，支援篩選跟分頁。
 *
 * 副作用：訂閱資料節點，元件卸載時自動 unsubscribe。
 */
export function useMyOrders() {
  // ...
}
```

### Server route

```ts
/**
 * 把訂單標記成已出貨，寫 audit-log + 發通知信。
 *
 * @throws 403 caller 沒有出貨權限
 * @throws 404 訂單不存在
 * @throws 409 訂單已經是 shipped 狀態
 */
export async function shipOrder(orderId: string, ctx: Ctx) {
  // ...
}
```

### 反例

```ts
// 廢話 — 重述函式名稱
/** Get user by id */
export function getUserById(id: string): User | null {}

// 重複 type — JSDoc 跟 TS 雙重維護
/**
 * @param {string} id 使用者 id
 * @returns {User | null} 使用者資料
 */
export function getUserById(id: string): User | null {}

// 漏寫副作用 / 拋錯
/** 出貨 */ // ← 沒講會寫 audit-log、會發通知信、會檢查權限
export async function shipOrder(orderId: string) {}
```

## 內部 / 私有函式

- 非 `export` 的函式可以不寫，但邏輯非顯而易見的話還是補一行說明
- 重要的 helper 即使非 export，建議補 JSDoc + `@example`，方便測試跟之後抽到 utils 重用
