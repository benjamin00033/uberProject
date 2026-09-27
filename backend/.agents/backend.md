# uberMenu — 後端開發完整指南（NestJS）

> 本文件由前端專案原始碼完整分析而產出，提供給**新手後端工程師**使用 NestJS 框架建立對接此前端的 REST API + WebSocket 伺服器。

---

## 目錄

1. [專案總覽](#1-專案總覽)
2. [技術棧與環境設定](#2-技術棧與環境設定)
3. [統一 API 回應格式 ⭐](#3-統一-api-回應格式-)
4. [業務領域總覽](#4-業務領域總覽)
5. [Menu 領域 API 規格](#5-menu-領域-api-規格)
6. [Dynamic Form 領域 API 規格](#6-dynamic-form-領域-api-規格)
7. [Budget 領域 API 規格](#7-budget-領域-api-規格)
8. [Project Scheduler 領域 API 規格](#8-project-scheduler-領域-api-規格)
9. [User / Auth 領域 API 規格](#9-user--auth-領域-api-規格)
10. [WebSocket / Socket.IO 規格](#10-websocket--socketio-規格)
11. [資料模型完整定義（TypeScript → NestJS DTO）](#11-資料模型完整定義typescriptnestjs-dto)
12. [Zod Schema → class-validator 對照](#12-zod-schema--class-validator-對照)
13. [建議的 NestJS 專案結構](#13-建議的-nestjs-專案結構)
14. [防雷點 ⚠️](#14-防雷點-️)
15. [開發 Checklist](#15-開發-checklist)
16. [附錄：前端 MSW Mock 場景對照表](#16-附錄前端-msw-mock-場景對照表)

---

## 1. 專案總覽

**uberMenu** 是一套菜單管理與動態表單建置系統，主要服務餐飲業場景。前端使用 Vue 3 + Ionic Vue + TanStack Query，**目前所有 API 都由 MSW (Mock Service Worker) 在瀏覽器端模擬**，`server/` 目錄下的檔案全部是空的佔位。

你的任務是用 **NestJS** 建立真正的後端伺服器，取代 MSW mock。

### 系統功能矩陣

| 領域 | 說明 | API 數量 | 狀態 |
|---|---|---|---|
| **Menu** | 菜單 CRUD、品項 CRUD、修飾群組 CRUD、營業時段管理、場景化菜單查詢 | ~16 | 需開發 |
| **Dynamic Form** | 動態多步驟表單 Schema CRUD、表單資料填寫提交 | ~6 | 需開發 |
| **Budget** | 預算 CRUD | ~5 | 需開發 |
| **Project Scheduler** | 專案排程（前端以 Pinia 本地管理，假日查外部 API） | 0 (可選) | 可選 |
| **User / Auth** | 使用者 CRUD、登入登出、權限管理 | ~6 | 需開發 |
| **WebSocket** | 即時菜單更新、WebRTC 視訊信令 | 2 事件組 | 需開發 |

---

## 2. 技術棧與環境設定

### 前端期望的後端

```
伺服器位址：http://localhost:3000
API 前綴：  /api
WebSocket：  同一個 port (Socket.IO)
```

> [!IMPORTANT]
> **前端 Vite 開發伺服器** 跑在 `port 1111`，透過 proxy 把所有 `/api/` 請求轉發到 `http://localhost:3000`。
> 生產環境前端 `VITE_API_URL` 設定為 `/api`，代表會透過 Nginx 反向代理到你的 NestJS。

### 建議的 NestJS 技術棧

```
NestJS 10+
TypeScript 5.x
TypeORM / Prisma（ORM）
PostgreSQL / MySQL（資料庫）
class-validator + class-transformer（DTO 驗證）
@nestjs/websockets + socket.io（WebSocket）
@nestjs/swagger（API 文件自動產生）
passport + JWT（認證）
```

### 關鍵環境變數

| 變數 | 前端值 | 後端建議 |
|---|---|---|
| `VITE_API_URL` | `/api` | NestJS 使用 `GlobalPrefix('api')` |
| `VITE_IP` | `localhost` | — |
| `VITE_API_PORT` | `3000` | NestJS 啟動 port `3000` |

---

## 3. 統一 API 回應格式 ⭐

> [!CAUTION]
> 這是最關鍵的一步！前端 **所有** API 呼叫都期望以下固定格式。格式不對，前端直接炸。

### 成功回應

```typescript
interface ApiResponse<T> {
  success: boolean;     // true
  res_code: string;     // "111" 代表成功
  message: string;      // "成功" 或 "Success"
  ts: string;           // 時間戳，格式 "YYYYMMDDHHmm"（如 "202608211030"）
  res_body: T;          // 實際資料載荷
}
```

#### 範例

```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202608211030",
  "res_body": [
    { "id": "menu-1", "title": { "translations": { "en": "Lunch", "zh": "午餐" } } }
  ]
}
```

### 錯誤回應

```json
{
  "success": false,
  "res_code": "404",
  "message": "Not found",
  "ts": "202608211030",
  "res_body": null
}
```

### NestJS 實作建議：全域 Response Interceptor

```typescript
// src/common/interceptors/transform.interceptor.ts
import {
  CallHandler, ExecutionContext,
  Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as dayjs from 'dayjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        res_code: '111',
        message: '成功',
        ts: dayjs().format('YYYYMMDDHHmm'),
        res_body: data,
      })),
    );
  }
}
```

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter, Catch,
  ArgumentsHost, HttpException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      res_code: String(status),
      message: exception.message,
      ts: dayjs().format('YYYYMMDDHHmm'),
      res_body: null,
    });
  }
}
```

> [!WARNING]
> 前端的 Axios Response Interceptor 會自動解包 `response.data`（去掉 Axios 的外層），所以前端 Service 層拿到的就是 `ApiResponse<T>` 本身。
> 然後前端再讀 `res_body` 拿實際資料。如果你的 NestJS 回傳格式不對，前端會拿到 `undefined`。

---

## 4. 業務領域總覽

### 前端 Domain 結構 → 後端 Module 對照

| 前端 Domain | NestJS Module 建議 | 資料庫表名 | 說明 |
|---|---|---|---|
| `src/domain/menu/` | `MenuModule` | `menus`, `categories`, `items`, `modifier_groups` | 核心業務 |
| `src/domain/dynamicForm/` | `DynamicFormModule` | `dynamic_forms`, `form_steps`, `form_fields` | 動態表單 |
| `src/domain/budget/` | `BudgetModule` | `budgets` | 預算管理 |
| `src/domain/projectScheduler/` | `ProjectSchedulerModule` | `projects`, `members`, `tasks` | 排程（可選） |
| `src/stores/userstore.ts` | `AuthModule` + `UserModule` | `users`, `roles`, `permissions` | 認證授權 |

---

## 5. Menu 領域 API 規格

### 5.1 菜單資料查詢（場景化）

```
GET /api/menu?scenario={scenarioKey}
```

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| `scenario` | `string` | 否 | 測試場景 key（如 `happyPath`、`emptyMenu`、`coco` 等），生產環境不傳 |

**回應 `res_body`**：`MenuData` 物件

```typescript
interface MenuData {
  menus: Menu[];
  categories: Category[];
  items: Item[];
  modifier_groups?: ModifierGroup[];
}
```

---

### 5.2 菜單 CRUD

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `GET` | `/api/menus` | — | `Menu[]` | 取得所有菜單 |
| `GET` | `/api/menus/:id` | — | `Menu` | 取得單一菜單 |
| `POST` | `/api/menus` | `Partial<Menu>` | `Menu` | 建立菜單 |
| `PUT` | `/api/menus/:id` | `Partial<Menu>` | `Menu` | 更新菜單 |
| `DELETE` | `/api/menus/:id` | — | `void` | 刪除菜單 |

---

### 5.3 菜單品項 CRUD

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `GET` | `/api/menu-items` | — | `Item[]` | 取得所有品項 |
| `GET` | `/api/menu-items/:id` | — | `Item` | 取得單一品項 |
| `POST` | `/api/menu-items` | `Partial<Item>` | `Item` | 建立品項 |
| `PUT` | `/api/menu-items/:id` | `Partial<Item>` | `Item` | 更新品項 |
| `DELETE` | `/api/menu-items/:id` | — | `void` | 刪除品項 |

> [!WARNING]
> **防雷：POST 建立時前端會帶 `id`**。Mock 層檢查了 `id` 是否重複（回 400），你的後端也必須做相同檢查，或改用 DB 自動生成 UUID。

---

### 5.4 修飾群組 CRUD（Modifier Groups）

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `GET` | `/api/modifier-groups` | — | `ModifierGroup[]` | 取得所有修飾群組 |
| `GET` | `/api/modifier-groups/:id` | — | `ModifierGroup` | 取得單一群組 |
| `POST` | `/api/modifier-groups` | `Partial<ModifierGroup>` | `ModifierGroup` | 建立群組 |
| `PUT` | `/api/modifier-groups/:id` | `Partial<ModifierGroup>` | `ModifierGroup` | 更新群組 |
| `DELETE` | `/api/modifier-groups/:id` | — | `void` | 刪除群組 |

---

## 6. Dynamic Form 領域 API 規格

### 6.1 表單 Schema 查詢（Legacy 端點）

```
GET /api/form/schema
```

**回應 `res_body`**：`DynamicFormSchema`（目前回傳預設的「註冊表單」schema）

> [!NOTE]
> 這是舊端點，前端 `useDynamicForm` composable 仍在使用。新的 CRUD 走 `/api/dynamic-forms`。兩個端點都要實作。

---

### 6.2 動態表單 CRUD

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `GET` | `/api/dynamic-forms` | — | `DynamicFormSchema[]` | 取得所有表單 |
| `GET` | `/api/dynamic-forms/:id` | — | `DynamicFormSchema` | 取得單一表單（以 `formId` 查） |
| `POST` | `/api/dynamic-forms` | `DynamicFormSchema` | `DynamicFormSchema` | 建立表單 |
| `PUT` | `/api/dynamic-forms/:id` | `Partial<DynamicFormSchema>` | `DynamicFormSchema` | 更新表單 |
| `DELETE` | `/api/dynamic-forms/:id` | — | `{}` | 刪除表單 |

> [!WARNING]
> **防雷**：DELETE 成功時前端期望 `res_body` 是空物件 `{}`，不是 `null`。其他 CRUD 的 DELETE 用 `null`。建議統一溝通後決定。

---

## 7. Budget 領域 API 規格

> [!IMPORTANT]
> Budget 領域的前端用的是原生 **`fetch()`** 而非 Axios `apiClient`，但回應格式仍然是相同的 `ApiResponse<T>`。

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `GET` | `/api/budgets` | — | `Budget[]` | 取得所有預算 |
| `GET` | `/api/budgets/:id` | — | `Budget` | 取得單一預算 |
| `POST` | `/api/budgets` | `Budget` | `Budget` | 建立預算（前端帶完整物件含 `id`） |
| `PUT` | `/api/budgets/:id` | `Budget` | `Budget` | 更新預算 |
| `DELETE` | `/api/budgets/:id` | — | `null` | 刪除預算 |

> [!WARNING]
> **防雷**：Budget 前端 POST 會帶 `id`，且 Mock 層做了重複 ID 檢查回 `400`。

---

## 8. Project Scheduler 領域 API 規格

目前此領域前端以 **Pinia Store 本地管理** 所有專案、成員、任務資料，不呼叫後端 API。唯一的外部呼叫是：

```
GET https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/{year}.json
```

用於取得台灣年度假日資料。

> [!TIP]
> 如果未來需要持久化，建議開 `/api/projects`、`/api/tasks`、`/api/members` 三組 CRUD，但目前**非必要**。

---

## 9. User / Auth 領域 API 規格

前端已準備好認證基礎設施：

- Pinia `useUserStore`：管理 `token`、`userInfo`、`permissions`
- Vue Router `beforeEach` 守衛：檢查 `meta.roles` 和 `meta.permissions`
- 自訂指令 `v-permission`、`v-role`：控制 DOM 元素顯隱
- Service `user.service.ts`：User CRUD

### 建議的 Auth API

| 方法 | 路徑 | Request Body | Response `res_body` | 說明 |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | `{ username, password }` | `{ token, user: UserInfo, permissions: string[] }` | 登入 |
| `POST` | `/api/auth/logout` | — | `null` | 登出 |
| `GET` | `/api/auth/me` | — (Bearer Token) | `{ user: UserInfo, permissions: string[] }` | 取得當前使用者 |

### User CRUD

| 方法 | 路徑 | Request Body | Response `res_body` |
|---|---|---|---|
| `GET` | `/api/users` | — | `UserInfo[]` |
| `GET` | `/api/users/:id` | — | `UserInfo` |
| `POST` | `/api/users` | `CreateUserDto` | `UserInfo` |
| `PUT` | `/api/users/:id` | `UpdateUserDto` | `UserInfo` |
| `DELETE` | `/api/users/:id` | — | `void` |

### UserInfo 型別

```typescript
interface UserInfo {
  id: string;
  name: string;
  roles: string[];   // e.g., ['admin', 'editor']
}
```

> [!IMPORTANT]
> **認證流程**：前端目前**沒有**自動在 Axios interceptor 加上 `Authorization: Bearer <token>` header。
> Token 存在 Pinia store 但未掛到 request。你需要和前端協調，在 `apiClient.ts` 的 request interceptor 加上 header 注入。

---

## 10. WebSocket / Socket.IO 規格

前端使用 `socket.io-client` 建立 WebSocket 連線。

### 10.1 連線設定

```typescript
// 前端連線方式
io(url, {
  transports: ['websocket'],       // 跳過 HTTP polling
  reconnectionDelayMax: 10000,
  extraHeaders: {
    'ngrok-skip-browser-warning': 'true'  // ngrok 開發用
  }
});
```

NestJS 端安裝：

```bash
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 10.2 WebRTC 視訊信令事件

| 事件名稱 | 方向 | Payload |
|---|---|---|
| `webrtc-signaling` | 雙向（Client ↔ Server） | `SignalingMessage` |

```typescript
interface SignalingMessage {
  roomId: string;
  senderId: string;
  type: 'offer' | 'answer' | 'candidate' | 'hangup';
  payload?: any;   // SDP 或 ICE candidate
}
```

**後端行為**：收到 `webrtc-signaling` 後，轉發給同 `roomId` 的**其他** client（排除 `senderId` 自身）。

### 10.3 NestJS Gateway 範例

```typescript
import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SignalingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('webrtc-signaling')
  handleSignaling(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SignalingMessage,
  ) {
    // 廣播給同 room 的其他人
    client.to(message.roomId).emit('webrtc-signaling', message);
  }

  handleConnection(client: Socket) {
    const roomId = client.handshake.query.roomId as string;
    if (roomId) client.join(roomId);
  }
}
```

---

## 11. 資料模型完整定義（TypeScript → NestJS DTO）

### 11.1 Menu 領域

#### Translation（多語系欄位）

```typescript
// 所有文字欄位都用這個結構支援多語
interface Translation {
  en?: string;
  zh?: string;
  [key: string]: string | undefined;  // 可擴展其他語言
}

interface Title {
  translations: Translation;
}

interface Description {
  translations: Translation;
}
```

> [!CAUTION]
> **防雷：巢狀 JSON 欄位**。`Title` 和 `Description` 都是 `{ translations: { en: "...", zh: "..." } }` 的巢狀結構。
> 資料庫儲存建議用 **JSONB** 欄位（PostgreSQL）或 `JSON` 欄位（MySQL），而非正規化拆表。

#### Menu

```typescript
interface Menu {
  id: string;
  title: Title;                           // { translations: { en, zh } }
  service_availability: ServiceAvailability[];
  category_ids: string[];                 // 關聯 Category IDs
}

interface ServiceAvailability {
  day_of_week: string;                    // "MONDAY" | "TUESDAY" | ... | "SUNDAY"
  time_periods: TimePeriod[];
}

interface TimePeriod {
  start_time: string;                     // "HH:mm" 格式
  end_time: string;                       // "HH:mm" 格式
}
```

#### Category

```typescript
interface Category {
  id: string;
  title: Title;
  entities: Entity[];                     // 關聯的品項/子分類
}

interface Entity {
  id: string;
  type: string;                           // "ITEM" | 其他
}
```

#### Item（菜單品項）— 完整定義

```typescript
interface Item {
  id: string;
  external_data?: string;
  title: Title;
  description: Description;
  image_url: string;
  price_info: PriceInfo;
  quantity_info: QuantityInfo;
  modifier_group_ids: ModifierGroupIds;
  tax_info: Record<string, any>;
  nutritional_info: { allergens: any | null };
  dish_info: {
    classifications: {
      can_serve_alone?: boolean;
      alcoholic_items?: number;
      ingredients?: any | null;
      additives?: any | null;
    }
  };
  tax_label_info?: {
    default_value: { labels: string[]; source: string }
  };
  product_info?: {
    product_traits: any[] | null;
    countries_of_origin: any | null
  };
  bundled_items?: any | null;
}

interface PriceInfo {
  price: number;                          // >= 0
  overrides?: PriceOverride[];
}

interface PriceOverride {
  context_type: string;
  context_value: string;
  price: number;
}

interface QuantityInfo {
  quantity: { max_permitted?: number; [key: string]: any };
  overrides?: QuantityOverride[];
}

interface QuantityOverride {
  context_type: string;
  context_value: string;
  quantity: { max_permitted?: number; [key: string]: any };
}

interface ModifierGroupIds {
  ids: string[] | null;
  overrides?: ModifierGroupOverride[];
}

interface ModifierGroupOverride {
  context_type: string;
  context_value: string;
  ids: string[] | null;
}
```

#### ModifierGroup（修飾群組）

```typescript
interface ModifierGroup {
  id: string;
  title?: Title;
  quantity_info?: QuantityInfo;
  modifier_options?: Entity[];
  [key: string]: any;                     // 可能有額外動態欄位
}
```

---

### 11.2 Dynamic Form 領域

```typescript
type I18nString = string | Record<string, string>;
// ☝️ 可能是純字串 "Hello" 或多語物件 { en: "Hello", zh: "你好" }

interface DynamicFormSchema {
  formId: string;                         // 主鍵
  title: I18nString;
  totalSteps: number;
  steps: FormStep[];
}

interface FormStep {
  stepId: string;
  stepTitle: I18nString;
  fields: FormField[];
  routing?: {
    defaultNextStepId: string | null;     // null = 最後一步
    conditionalSteps?: StepCondition[];
  };
}

interface FormField {
  id: string;                             // 欄位識別碼，也是 formData 的 key
  label: I18nString;
  type: string;                           // "text" | "select" | "checkbox" | "radio" |
                                          // "datepicker" | "multi-select" | "richtext" |
                                          // "number" | "group" | "accordion" | "array" | ...
  props?: Record<string, any>;            // 傳給前端元件的額外參數
  defaultValue?: any;
  validations?: ValidationRule[];
  dependsOn?: {                           // 條件顯示
    fieldId: string;
    operator: 'equals' | 'contains' | 'notEquals';
    value: any;
  };
  placeholder?: I18nString;
  colSpan?: number;                       // 柵格排版
  children?: FormField[];                 // 巢狀結構
  itemSchema?: FormField | FormField[];   // 動態陣列結構
}

interface ValidationRule {
  type: 'required' | 'pattern' | 'min' | 'max' | 'custom';
  rule?: string | number | RegExp;
  errorMessage: I18nString;
  validatorName?: string;
}

interface StepCondition {
  fieldId: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
  value: any;
  targetStepId: string;
}
```

> [!WARNING]
> **防雷：表單 Schema 是高度彈性的樹狀結構**。`FormField` 可以巢狀（`children`、`itemSchema`），且 `type` 是開放的 `string`（不是 enum），允許前端自訂元件。
> 資料庫建議用 **JSONB** 整欄存 `steps` 陣列，而非正規化拆成每個 field 一筆 row。

---

### 11.3 Budget 領域

```typescript
interface Budget {
  id: string;
  title: string;
  amount: number;
  category: string;
  startDate: string;                      // "YYYY-MM-DD"
  endDate: string;                        // "YYYY-MM-DD"
  isActive: boolean;
}
```

---

### 11.4 Project Scheduler 領域（可選）

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;                      // "YYYY-MM-DD"
  endDate: string;
  progress: number;                       // 0-100
  milestones: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;                           // "前端工程師" | "後端工程師" | "QA" | "UI 設計師"
  avatar?: string;
}

interface Task {
  id: string;
  projectId: string;
  name: string;
  assignees: string[];                    // Member IDs
  startDate: string;
  endDate: string;
  status: 'todo' | 'in_progress' | 'done';
}
```

---

## 12. Zod Schema → class-validator 對照

前端用 **Zod** 做執行時驗證，以下是後端 NestJS 建議的 **class-validator** 對照：

| 前端 Zod | NestJS class-validator | 說明 |
|---|---|---|
| `z.string().min(1)` | `@IsString() @IsNotEmpty()` | 必填字串 |
| `z.string().url()` | `@IsUrl()` | URL 格式 |
| `z.number().min(0)` | `@IsNumber() @Min(0)` | 非負數字 |
| `z.string().optional()` | `@IsOptional() @IsString()` | 可選字串 |
| `z.array(z.string())` | `@IsArray() @IsString({ each: true })` | 字串陣列 |
| `z.object({...}).catchall(z.string())` | `@ValidateNested()` + 自訂 DTO | 巢狀物件 |
| `z.string().default("ITEM")` | `@IsString() @IsOptional()` + 程式碼預設值 | 預設值 |
| `z.string().regex(/^HH:mm$/)` | `@Matches(/^\d{2}:\d{2}$/)` | 正則驗證 |
| `z.enum(["MONDAY", ...])` | `@IsEnum(DayOfWeek)` | 列舉值 |

### 範例：Menu Item DTO

```typescript
import {
  IsString, IsNotEmpty, IsOptional,
  IsNumber, Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsOptional() @IsString() en?: string;
  @IsOptional() @IsString() zh?: string;
}

class TitleDto {
  @ValidateNested()
  @Type(() => TranslationDto)
  translations: TranslationDto;
}

class PriceInfoDto {
  @IsNumber() @Min(0) price: number;
  @IsOptional() overrides?: any[];
}

export class CreateMenuItemDto {
  @IsString() @IsNotEmpty() id: string;

  @ValidateNested()
  @Type(() => TitleDto)
  title: TitleDto;

  @ValidateNested()
  @Type(() => TitleDto)
  description: TitleDto;

  @IsOptional() @IsString()
  image_url?: string;

  @ValidateNested()
  @Type(() => PriceInfoDto)
  price_info: PriceInfoDto;

  // ... 其他欄位依需求補充
}
```

---

## 13. 建議的 NestJS 專案結構

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── common/                        # 共用層
│   │   ├── decorators/
│   │   ├── dto/
│   │   │   └── api-response.dto.ts    # ApiResponse<T> 定義
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── permissions.guard.ts
│   │   └── interceptors/
│   │       └── transform.interceptor.ts
│   │
│   ├── auth/                          # 認證模組
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   │
│   ├── user/                          # 使用者模組
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── menu/                          # 菜單模組
│   │   ├── menu.module.ts
│   │   ├── controllers/
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu-item.controller.ts
│   │   │   └── modifier-group.controller.ts
│   │   ├── services/
│   │   │   ├── menu.service.ts
│   │   │   ├── menu-item.service.ts
│   │   │   └── modifier-group.service.ts
│   │   ├── entities/
│   │   │   ├── menu.entity.ts
│   │   │   ├── item.entity.ts
│   │   │   └── modifier-group.entity.ts
│   │   └── dto/
│   │       ├── create-menu.dto.ts
│   │       ├── update-menu.dto.ts
│   │       ├── create-item.dto.ts
│   │       └── create-modifier-group.dto.ts
│   │
│   ├── dynamic-form/                  # 動態表單模組
│   │   ├── dynamic-form.module.ts
│   │   ├── dynamic-form.controller.ts
│   │   ├── dynamic-form.service.ts
│   │   ├── entities/
│   │   │   └── dynamic-form.entity.ts
│   │   └── dto/
│   │
│   ├── budget/                        # 預算模組
│   │   ├── budget.module.ts
│   │   ├── budget.controller.ts
│   │   ├── budget.service.ts
│   │   ├── entities/
│   │   │   └── budget.entity.ts
│   │   └── dto/
│   │
│   └── gateway/                       # WebSocket Gateway
│       ├── gateway.module.ts
│       └── signaling.gateway.ts
│
├── .env
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## 14. 防雷點 ⚠️

### 🔴 致命級（會造成前端完全無法運作）

| # | 防雷點 | 說明 |
|---|---|---|
| 1 | **回應格式必須完全一致** | `{ success, res_code, message, ts, res_body }` — 不能多不能少。前端讀 `res_body`，名字錯就是 `undefined`。 |
| 2 | **API 路徑前綴必須是 `/api`** | NestJS 用 `app.setGlobalPrefix('api')`。前端 proxy 攔截 `/api/` 開頭的請求。 |
| 3 | **Port 必須是 3000** | 前端 `vite.config.ts` proxy target 寫死 `http://localhost:3000`。 |
| 4 | **CORS 必須開** | 開發時前端跑 `localhost:1111`、後端跑 `localhost:3000`，跨域請求。NestJS 要 `app.enableCors()`。 |
| 5 | **Socket.IO 版本相容** | 前端用 `socket.io-client@4.x`，後端必須用 `socket.io@4.x`。版本 2/3 不相容會靜默失敗。 |

### 🟠 高風險級（會造成部分功能異常）

| # | 防雷點 | 說明 |
|---|---|---|
| 6 | **多語系欄位用 JSONB 存** | `Title`、`Description` 都是 `{ translations: { en, zh } }` 巢狀結構。千萬不要拆成 `title_en`、`title_zh` 兩個欄位，否則擴充語言時後端全要改。 |
| 7 | **DynamicForm 的 `type` 是開放字串** | 不要用 enum 限制。前端可以自訂元件類型（如 `address-picker`），後端只負責儲存和回傳。 |
| 8 | **DynamicForm 主鍵是 `formId` 不是 `id`** | 前端 mock 用 `formId` 做查詢：`mockDynamicForms.find(i => i.formId === params.id)`。後端要對齊。 |
| 9 | **時間戳格式 `YYYYMMDDHHmm`** | `ts` 欄位不是 ISO 8601，是 `202608211030` 這種格式。用 `dayjs().format('YYYYMMDDHHmm')` 產生。 |
| 10 | **DELETE 回應不一致** | DynamicForm DELETE 回 `{}`，其他 DELETE 回 `null`。建議統一用 `null`，前端只檢查 `success`。 |
| 11 | **前端 POST 會自帶 `id`** | Budget、MenuItem、ModifierGroup 的 POST 都帶 `id`，且 mock 檢查重複。後端需相應處理，或改用 UUID。 |
| 12 | **菜單品項有複雜的 Override 機制** | `PriceOverride`、`QuantityOverride`、`ModifierGroupOverride` 都是 context-based 覆寫。資料庫 schema 要用 JSONB 處理。 |

### 🟡 注意級（開發體驗相關）

| # | 防雷點 | 說明 |
|---|---|---|
| 13 | **前端可動態切換 API Base URL** | `LayoutHeader.vue` 有個 dialog 讓使用者輸入自訂 base URL（存 `localStorage`）。測試時可能打到你預期外的位址。 |
| 14 | **MSW 與真實 API 並存** | 開發時前端 MSW 會攔截所有 API，你的真實後端請求可能被吃掉。前端要關掉 MSW 或排除特定路徑才能打到你的 NestJS。 |
| 15 | **前端的 `res_code: "111"` 代表成功** | 不是 HTTP status code！是自訂業務碼。HTTP 層面永遠是 200 (成功) 或對應錯誤碼。 |
| 16 | **沒有分頁機制（但型別已定義）** | 前端 `api.types.ts` 定義了 `ListResponseData<T>` 含 `total, page_size, page_from`，但目前沒有任何 API 使用分頁。未來擴充時後端需支援。 |
| 17 | **WebRTC signaling 只需轉發** | 後端不需要理解 SDP/ICE 的內容，只要照 `roomId` 廣播給同房間其他人就好。不要嘗試解析 `payload`。 |
| 18 | **Token 沒有自動掛到 Header** | 前端 `apiClient.ts` 的 request interceptor 目前是空的（只有 response interceptor）。認證整合時要和前端同步加上 `Authorization` header。 |
| 19 | **`/api/menu` 跟 `/api/menus` 是兩個不同的端點** | 前者是場景化查詢（回傳整棵菜單樹 `MenuData`），後者是菜單 CRUD。不要搞混。 |
| 20 | **加密回應功能** | MSW 有 `isEncrypted` 選項，會把 `res_body` 用 Base64 包一層。生產環境如果需要，後端也要支援。 |

---

## 15. 開發 Checklist

### Phase 1：基礎骨架

- [ ] 用 `@nestjs/cli` 初始化專案
- [ ] 設定 `GlobalPrefix('api')` + `enableCors()`
- [ ] 實作 `TransformInterceptor`（統一 `ApiResponse<T>` 格式）
- [ ] 實作 `HttpExceptionFilter`（統一錯誤格式）
- [ ] 設定 TypeORM/Prisma 連線
- [ ] Port 設為 3000

### Phase 2：Menu 領域

- [ ] `GET /api/menu?scenario=...`（場景化查詢）
- [ ] Menu CRUD（`/api/menus`）
- [ ] MenuItem CRUD（`/api/menu-items`）
- [ ] ModifierGroup CRUD（`/api/modifier-groups`）
- [ ] 多語系 JSON 欄位設計（JSONB）

### Phase 3：Dynamic Form 領域

- [ ] `GET /api/form/schema`（Legacy 端點）
- [ ] DynamicForm CRUD（`/api/dynamic-forms`）
- [ ] FormField 巢狀結構用 JSONB 存

### Phase 4：Budget 領域

- [ ] Budget CRUD（`/api/budgets`）

### Phase 5：Auth 領域

- [ ] JWT 認證（`/api/auth/login`、`/api/auth/me`）
- [ ] User CRUD（`/api/users`）
- [ ] 角色 / 權限 Guard
- [ ] 和前端協調 Axios Request Interceptor 掛 Token

### Phase 6：WebSocket

- [ ] Socket.IO Gateway（`@nestjs/websockets`）
- [ ] WebRTC Signaling 事件轉發

### Phase 7：進階

- [ ] 分頁支援（`ListResponseData<T>` 格式）
- [ ] Swagger 文件產生
- [ ] E2E 測試
- [ ] Docker 化部署

---

## 16. 附錄：前端 MSW Mock 場景對照表

`GET /api/menu?scenario=<key>` 支援以下場景，供你建立種子資料或測試用：

| 場景 Key | 說明 | 用途 |
|---|---|---|
| `happyPath` | 完整多分類菜單 | 正常流程測試 |
| `emptyMenu` | 空菜單 | 空狀態 UI 測試 |
| `missingOptionals` | 最小化可選欄位 | 防禦性程式測試 |
| `suspended` | 品項含暫停資訊 | 庫存管理場景 |
| `complexModifier` | 巢狀修飾群組 | 複雜客製化 |
| `dietary` | 膳食分類與標籤 | 營養/過敏原 |
| `priceOverrides` | 情境式價格覆寫 | 動態定價 |
| `sellingInfo` | 預購排程與供應 | 進階排程 |
| `orphanEntity` | 孤立實體 | 資料一致性測試 |
| `customerRealData` | 大型真實資料集 | 效能壓測 |
| `retailAndCompliance` | 食品安全合規 | 合規場景 |
| `advancedPricingAndBundles` | 套餐與多層定價 | 進階定價 |
| `coco` | 完整飲料連鎖菜單 | 大型真實資料 |
| `apiError` | 401 Unauthorized | 錯誤處理測試 |
| `test` | 最小測試 payload | 快速煙霧測試 |

---

> [!TIP]
> **快速開始建議**：先把 Phase 1 做完（骨架 + 統一回應格式），然後挑一個最簡單的領域（Budget，只有 5 支 CRUD）跑一輪完整流程驗證前後端串接，確認格式無誤後再展開其他領域。

---

*文件產生日期：2026-08-21 | 由前端專案原始碼自動分析產出*
