請更改get_list 整體模型

操作,HTTP 方法,URL 路徑,Payload 形式
獲取列表,POST,/api/:resource JSON Object (分頁、篩選)
單筆查詢,GET,/api/:resource/:id,無
動態新增,POST,/api/:resource,JSON Object (對應該表的特定欄位)
動態更新,PATCH,/api/:resource/:id,JSON Object (部分更新的欄位)

刪除,DELETE,/api/:resource/:id,無
要將軟刪除完美融入我們先前規劃的共用 CRUD 與策略模式架構中，我們需要在資料庫操作層與前端狀態管理層進行對應的調整。

1. 列表查詢 (Get List)
   在原有的分頁基礎上，加入 sort (排序) 與 resource (指定查詢的資料表/模型)。

JSON
// Request
{
"resource": "users", // 告訴共用控制器要查哪張表
"page_size": 20,
"page_from": 0, // 或使用 page_number: 1
"query": { // 篩選條件
"status": 1,
"role": "admin"
},
"sort": [ // 支援多重排序
{ "field": "created_at", "order": "desc" }
]
}

// Response
{
"total": 150, // 總筆數
"page_size": 20,
"page_from": 0,
"data": [ /* Array of Objects */ ]
} 2. 單筆查詢 (Get)
JSON
// Request
{
"resource": "users",
"id": "uuid-1234-5678"
}

// Response
{
"data": { /_ Object _/ }
} 3. 新增資料 (Create)
JSON
// Request
{
"resource": "users",
"payload": { // 具體的業務資料，不含系統生成的 uuid 或 created_at
"name": "John Doe",
"email": "john@example.com"
}
}

// Response
{
"data": { /_ 回傳建立成功後的完整 Object，包含生成的 uuid _/ }
} 4. 更新資料 (Update)
建議採用 Patch 的概念，只傳送需要修改的欄位。

JSON
// Request
{
"resource": "users",
"id": "uuid-1234-5678",
"payload": {  
 "status": 0 // 僅更新狀態
}
}

// Response
{
"data": { /_ 回傳更新後的完整 Object _/ }
} 5. 刪除資料 (Delete)
配合你的狀態設計，這通常會實作為「軟刪除」（將 status 改為 -1 或標記 deleted_at）。

JSON
// Request
{
"resource": "users",
"id": "uuid-1234-5678"
}

// Response
{
"success": true
}
三、 標準化 API 回應結構 (Response Wrapper)
為了讓前端的狀態管理（例如攔截錯誤、全域提示）更容易處理，建議所有 API 的最外層包裝一層統一的標準結構，不要直接回傳 data 或 total，這樣未來要加狀態碼或錯誤訊息才不會破壞舊有結構。

TypeScript
interface ApiResponse<T> {
success: boolean; // 請求是否成功
code: number; // 業務狀態碼 (例如 200, 400, 403, 404)
message: string; // 提示訊息 (例如 "操作成功", "找不到資料")
data: T | null; // 實際內容 (對應前面的 Respond)
}
