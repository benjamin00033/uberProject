目前前端作法

1. 加解密核心模組 (apiCrypto.ts)：  
   • 演算法：採用 crypto-js 的 AES-CBC (Pkcs7 Padding)。  
   • 密鑰與向量推導 (Domain Separation)：  
   • 私鑰：讀取環境變數 VITE_API_SECRET_KEY。  
   • 動態公鑰/鹽值：取自請求或回應的 ts (時間戳記)。  
   • 衍生公式：  
   • Key (256-bit)：SHA256(${secretKey}:key:${ts})  
   • IV (128-bit)：取 SHA256(${secretKey}:iv:${ts}) 前 16 位元組。

   • 環境變數開關：嚴格依據 VITE_ENABLE_ENCRYPTION === "true" 判斷，未設定時維持明文傳輸，保障向後相容性。

2. API 客戶端攔截器整合 (apiClient.ts)：  
   • Request Interceptor：  
   • 啟用加密時，僅在請求帶有資料且非 FormData 時注入 X-Timestamp: ts Header，並將 Body 加密為 { encryptedData: cipherText }。  
   • 檔案上傳（FormData）、無 Body 請求（如 GET/DELETE）或帶有 X-No-Encryption: true 時自動  
   Bypass，不加解密亦不帶時間戳，避免後端誤判。  
   • Response Interceptor：  
   • 自動從 response.data.ts 或 Header x-timestamp 取得動態時間戳記。  
   • 自動偵測並解密 res_body.encryptedData、字串密文或頂層密文，並透明還原為原始物件再回傳給業務層。  
   • 設計優雅降級（Fallback），解密異常時保留原始結構不崩潰。

3. 環境變數範本配置 (.env.example)：  
   • 增加 VITE_ENABLE_ENCRYPTION=false 與 VITE_API_SECRET_KEY 範本說明。
4. 單元測試與驗證覆蓋：  
   • apiCrypto.test.ts：覆蓋 Key/IV 衍生唯一性、Domain Separation、物件/繁中/Emoji/特殊符號加解密往返、防篡改與環境變數判斷。  
   • apiClient.test.ts：覆蓋開關切換、Request Body 加密、FormData/Header bypass、Response 自動解密與 Fallback。  
   • 測試結果：25/25 個單元測試 100% 通過。  
   • ESLint & TypeScript：npx eslint 0 錯誤、npx vue-tsc --noEmit 型別檢查 0 錯誤。
5. Code Review (Step 4)：  
   • 通過架構邊界審查（無跨層耦合 stores/）、安全性審查與 JSDoc 檢查，所有審查意見已全數修復。

# 開發日誌 — 2026-09-03

## 詢問與裁決

- **任務定義**：在 `src/services/apiClient.ts` 中加入加密模組，依環境變數（正式站台 / `VITE_ENABLE_ENCRYPTION`）切換請求與回應之加解密流程。
- **類型判定**：Track B（既有 API 通訊層安全功能強化與模組擴充）。
- **關鍵決策裁決**：
  1. **加密演算法**：採用 AES-CBC，以環境變數定義的前後端私鑰 (`VITE_API_SECRET_KEY`) 與動態公鑰時間戳記 (`ts`) 透過 SHA-256 衍生 256-bit Key，並取前 16 位元組作為 IV（實作加入 Domain Separation 隔離 Key 與 IV）。
  2. **環境變數開關**：嚴格以 `VITE_ENABLE_ENCRYPTION=true` 作為啟用條件，未設定時維持明文傳輸以防破版。
  3. **通訊酬載協議**：
     - Request：僅在存在 Body 且非 FormData 時注入 `X-Timestamp: ts`，Body 加密為 `{ encryptedData: string }`；若為 FormData、無 Body 或帶有 `X-No-Encryption` 則自動 bypass 且不注入時間戳。
     - Response：由 `apiClient` 統一攔截，自 `ApiResponse.ts` 或 Header 取得動態時間戳，並將 `res_body.encryptedData` 或字串密文自動解密還原。
- **相依套件**：引入 `crypto-js` (4.2.0) 與 `@types/crypto-js` (4.2.2)。
