# 專案共用函式庫 (Utility Functions) 總覽

本專案將無副作用（Side-effect free）、可跨模組共用的 Helper 函式統一收斂於 `src/utils/` 目錄下。所有函式皆遵守嚴格的 JSDoc 註解與純函式設計規範，並統一透過 `src/utils/index.ts` 匯出（Barrel File 機制）。

開發者在任何元件或 Service 中，只需透過解構匯入即可使用：

```typescript
import { formatDate, buildTree, debounce } from "@/utils";
```

以下為依照功能分類的函式列表速查：

---

## 📅 日期與時間 (`date.util.ts`)

專注於日期的格式轉換與時間區間判斷。

| 函式名稱        | 說明                                          | 範例                                   |
| :-------------- | :-------------------------------------------- | :------------------------------------- |
| `formatDate`    | 將時間戳格式化為指定字串（預設 `YYYY-MM-DD`） | `formatDate(date, 'YYYY/MM/DD HH:mm')` |
| `isExpired`     | 判斷傳入的時間是否已經小於當前時間            | `isExpired(tokenExpTime)`              |
| `getStartOfDay` | 取得單日區間的 00:00:00 起始時間              | `getStartOfDay(new Date())`            |
| `getEndOfDay`   | 取得單日區間的 23:59:59 結束時間              | `getEndOfDay(new Date())`              |

---

## 🧮 陣列與資料處理 (`array.util.ts` & `object.util.ts`)

提供陣列與物件的深層複製、分組、去重等高階操作。

| 函式名稱      | 說明                                       | 範例                                |
| :------------ | :----------------------------------------- | :---------------------------------- |
| `sortByField` | 依據物件陣列的特定欄位進行升/降序排序      | `sortByField(users, 'age', 'desc')` |
| `groupBy`     | 將物件陣列依特定屬性分組 (轉為 Dictionary) | `groupBy(orders, 'status')`         |
| `uniqueArray` | 陣列去重（支援依物件的特定欄位去重）       | `uniqueArray(items, 'id')`          |
| `chunkArray`  | 將一維陣列依指定大小切割為二維陣列         | `chunkArray(list, 10)`              |
| `deepClone`   | 深度複製物件，徹底斷開 Reference           | `deepClone(formData)`               |
| `pickFields`  | 僅挑選物件中指定的欄位產生新物件           | `pickFields(user, ['id', 'name'])`  |
| `omitFields`  | 排除物件中指定的欄位產生新物件             | `omitFields(form, ['_tempId'])`     |

---

## 🌳 樹狀結構與組織圖 (`tree.util.ts`)

處理關聯式資料庫中常見的扁平陣列轉樹狀結構（BOM 表、選單）。

| 函式名稱      | 說明                                         | 範例                                    |
| :------------ | :------------------------------------------- | :-------------------------------------- |
| `buildTree`   | 將具備 `parentId` 的扁平陣列轉為巢狀樹狀結構 | `buildTree(flatData, 'id', 'parentId')` |
| `flattenTree` | 將巢狀的樹狀結構拍平回一維陣列               | `flattenTree(treeData, 'children')`     |

---

## 📝 動態表單與邏輯控制 (`form.util.ts` & `condition.util.ts`)

專為複雜的多層級表單與動態顯示邏輯設計。

| 函式名稱             | 說明                                         | 範例                                                   |
| :------------------- | :------------------------------------------- | :----------------------------------------------------- |
| `getFieldValue`      | 依字串路徑安全取得深層物件值                 | `getFieldValue(data, 'user.address[0].city')`          |
| `setFieldValue`      | 依字串路徑設定深層物件值（自動補齊物件陣列） | `setFieldValue(data, 'user.age', 20)`                  |
| `isEmptyValue`       | 判斷是否為空值（涵蓋 `[]` 與 `{}`）          | `isEmptyValue([]) // true`                             |
| `getDirtyFields`     | 比較原始與當前表單，只回傳被修改的欄位       | `getDirtyFields(orig, current)`                        |
| `evaluateRule`       | 評估單一表單條件規則 (如 `>`, `===`, `in`)   | `evaluateRule(data, { field: 'age', operator: '>=' })` |
| `evaluateConditions` | 評估多組條件規則 (支援 `AND` / `OR`)         | `evaluateConditions(data, rules, 'AND')`               |

---

## 💰 數值與字串格式化 (`math.util.ts` & `string.util.ts`)

解決浮點數精度誤差，以及金錢、顯示文字的格式化。

| 函式名稱                | 說明                                         | 範例                                   |
| :---------------------- | :------------------------------------------- | :------------------------------------- |
| `roundDecimal`          | 安全的四捨五入計算，避免 `0.1+0.2!=0.3` 問題 | `roundDecimal(1.005, 2) // 1.01`       |
| `calculateTotalWithTax` | 計算含稅總價                                 | `calculateTotalWithTax(100, 0.05)`     |
| `calculateDiscount`     | 計算折扣後金額                               | `calculateDiscount(1000, 0.8)`         |
| `formatCurrency`        | 數字轉為金錢格式（含千分位與貨幣符號）       | `formatCurrency(1234, 'en-US', 'USD')` |
| `truncateText`          | 截斷超長字串並加上 `...` 後綴                | `truncateText('Hello World', 5)`       |
| `capitalizeFirstLetter` | 字串首字母轉為大寫                           | `capitalizeFirstLetter('apple')`       |

---

## 🛡️ 商業邏輯驗證與加密 (`validator.util.ts` & `crypto.util.ts`)

處理常見表單驗證與輕量資料混淆。

| 函式名稱                      | 說明                              | 範例                                    |
| :---------------------------- | :-------------------------------- | :-------------------------------------- |
| `isValidTaiwanTaxId`          | 檢查台灣統一編號 (8碼邏輯乘數)    | `isValidTaiwanTaxId('12345675')`        |
| `isValidEmail`                | 檢查 Email 格式是否合法           | `isValidEmail('test@a.com')`            |
| `isValidTaiwanMobile`         | 檢查台灣手機號碼格式 (09開頭)     | `isValidTaiwanMobile('0912345678')`     |
| `encryptData` / `decryptData` | Base64 輕量加解密（防止明文直視） | `encryptData('secret')`                 |
| `maskSensitiveData`           | 局部遮罩敏感字串（保留前後字元）  | `maskSensitiveData('0912345678', 4, 3)` |
| `generateUUID`                | 產生前端暫時性 UUID               | `generateUUID()`                        |

---

## 🗜️ 檔案、圖片與壓縮 (`image.util.ts`, `compression.util.ts` & `file.util.ts`)

前端處理檔案上傳前的壓縮，或觸發瀏覽器下載機制。

| 函式名稱                        | 說明                                       | 範例                                     |
| :------------------------------ | :----------------------------------------- | :--------------------------------------- |
| `compressImage`                 | 透過 Canvas 壓縮圖片寬高與品質 (轉為 Blob) | `compressImage(file, { maxWidth: 800 })` |
| `fileToBase64`                  | 檔案轉 DataURL 字串 (用於本地預覽)         | `fileToBase64(file)`                     |
| `compressString` / `decompress` | 利用原生 API Gzip 壓縮龐大字串             | `compressString(hugeJson)`               |
| `compressFile`                  | 將單一檔案轉換為 Gzip 壓縮格式 Blob        | `compressFile(logFile)`                  |
| `downloadBlob`                  | 觸發瀏覽器下載 File/Blob (如下載報表)      | `downloadBlob(blob, 'report.csv')`       |
| `formatFileSize`                | 將 Bytes 轉為人類易讀格式 (MB, GB)         | `formatFileSize(1048576) // 1.00 MB`     |

---

## 🌐 瀏覽器、快取與 PWA (`browser.util.ts`, `storage.util.ts`, `db.util.ts`, `sw.util.ts`)

處理各種瀏覽器原生 API 與本地快取。

| 函式名稱                    | 說明                                             | 範例                              |
| :-------------------------- | :----------------------------------------------- | :-------------------------------- |
| `copyToClipboard`           | 複製字串至剪貼簿                                 | `copyToClipboard('text')`         |
| `toggleFullscreen`          | 切換網頁或特定 DOM 元素為全螢幕                  | `toggleFullscreen(videoEl)`       |
| `getCurrentGeolocation`     | (Promise) 取得當下 GPS 地理位置                  | `await getCurrentGeolocation()`   |
| `setStorage` / `getStorage` | 自動 JSON 序列化存取 Web Storage                 | `getStorage('user', 'local')`     |
| `setDbCache` / `getDbCache` | 基於 Dexie 的 IndexedDB 存取，支援過期時間 (TTL) | `setDbCache('/api', data, 3600)`  |
| `registerServiceWorker`     | 註冊 PWA Service Worker 並監聽更新               | `registerServiceWorker('/sw.js')` |
| `sendMessageToSW`           | 發送 PostMessage 給背景 SW 進行控制              | `sendMessageToSW('SKIP_WAITING')` |

---

## ⚙️ 函式執行控制與 Singleton (`function.util.ts`)

高階函式封裝，解決併發與頻繁觸發的效能問題。

| 函式名稱               | 說明                                            | 範例                                      |
| :--------------------- | :---------------------------------------------- | :---------------------------------------- |
| `createSingletonAsync` | 防止非同步函式併發重複呼叫，共用同一 Promise    | `const fetch = createSingletonAsync(api)` |
| `once`                 | 確保函式無論被呼叫幾次，內部邏輯僅執行一次      | `const init = once(initApp)`              |
| `debounce`             | 防抖：延遲時間內連續觸發將重新計時 (如: 搜尋框) | `debounce(search, 500)`                   |
| `throttle`             | 節流：指定時間內最多只執行一次 (如: 滾動事件)   | `throttle(onScroll, 1000)`                |

---

## 🔗 URL 與 API 輔助 (`api.util.ts`)

專注於網址列與請求參數的純字串計算。

| 函式名稱           | 說明                                            | 範例                                             |
| :----------------- | :---------------------------------------------- | :----------------------------------------------- |
| `buildQueryString` | 物件轉 QueryString，自動濾除 `null`/`undefined` | `buildQueryString({ p: 1 }) // 'p=1'`            |
| `parseQueryString` | 將 URL 的 QueryString 反解析回物件              | `parseQueryString('?p=1')`                       |
| `joinPaths`        | 安全拼接 URL 路徑，自動修剪多餘的雙斜線         | `joinPaths(['/api/', '/users']) // '/api/users'` |

---

## 🧠 經典演算法 (`algorithm.util.ts`)

提供搜尋、深度比較、洗牌與字串相似度等經典演算法封裝，提升資料處理效率。

| 函式名稱              | 說明                                   | 範例                                     |
| :-------------------- | :------------------------------------- | :--------------------------------------- |
| `binarySearch`        | 在已排序陣列中快速尋找目標值           | `binarySearch([1,2,3,4], 3) // 2`        |
| `shuffle`             | 陣列隨機洗牌 (Fisher-Yates)            | `shuffle([1,2,3])`                       |
| `deepEqual`           | 深度比較兩個變數結構與數值是否完全相同 | `deepEqual(objA, objB)`                  |
| `levenshteinDistance` | 計算兩字串的編輯距離，用於模糊搜尋     | `levenshteinDistance('abc', 'abd') // 1` |
