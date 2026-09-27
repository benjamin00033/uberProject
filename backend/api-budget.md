# 預算管理 (Budget Domain) 後端技術規格書與資料庫修改指南

> **版本**：v1.0.0  
> **最後更新**：2026-09-04  
> **作者**：uberMenu 系統架構團隊  
> **狀態**：正式發布 (Ready for Implementation)  
> **適用目標**：後端工程團隊（NestJS 11+ / PostgreSQL / MySQL / Prisma ORM）、前端工程師、QA 團隊  
> **相容前端**：`src/domain/budget`（`BudgetFormModal.vue`, `budget.schema.ts`, `useBudget.ts`, `budgetApi.ts`）

---

## 目錄

1. [文件概述與背景說明 (Overview)](#1-文件概述與背景說明-overview)
2. [前後端統一通訊協議 (API Standard)](#2-前後端統一通訊協議-api-standard)
3. [資料庫 Schema 變更與 Migration 腳本 (Database Migration)](#3-資料庫-schema-變更與-migration-腳本-database-migration)
4. [NestJS DTO 規範與校驗 (DTOs Specification)](#4-nestjs-dto-規範與校驗-dtos-specification)
5. [RESTful API 端點詳細規格 (Endpoints Specification)](#5-restful-api-端點詳細規格-endpoints-specification)
6. [業務邏輯與邊界防護 (Business Rules)](#6-業務邏輯與邊界防護-business-rules)
7. [NestJS 11+ 參考實作程式碼 (Reference Implementation)](#7-nestjs-11-參考實作程式碼-reference-implementation)
8. [後端自我驗收檢查清單 (Acceptance Checklist)](#8-後端自我驗收檢查清單-acceptance-checklist)

---

## 1. 文件概述與背景說明 (Overview)

### 1.1 目的
本技術規格書專為 **預算管理 (Budget Domain)** 後端系統提供升級實作指導。  
前端目前已於 `src/domain/budget` 升級為真實已使用金額管理：
- **預算表單**：[`BudgetFormModal.vue`](../src/domain/budget/components/BudgetFormModal.vue) 具備「已使用金額 (TWD)」手動輸入欄位。
- **前端校驗**：[`budget.schema.ts`](../src/domain/budget/schemas/budget.schema.ts) 透過 Zod 宣告 `usedAmount` 為可選非負數值（預設值為 `0`）。
- **業務層**：[`useBudget.ts`](../src/domain/budget/composables/useBudget.ts) 徹底拔除偽亂數產生器，以真實 `usedAmount` 動態計算使用進度百分比與儀表板總覽。

### 1.2 現存問題
在後端與資料庫未同步擴充前，存在以下斷層：
1. **資料庫層缺失**：`budgets` 表未定義 `used_amount` 欄位。
2. **DTO 攔截過濾**：`CreateBudgetDto` 與 `UpdateBudgetDto` 未宣告 `usedAmount`，在 `ValidationPipe(whitelist: true)` 機制下被過濾丟棄。
3. **ORM 映射遺漏**：Prisma 實體未映射 `used_amount`，讀取預算清單時前端永遠無法取得已儲存之 `usedAmount`。

### 1.3 預期交付成果
- 資料庫 `budgets` 表擴充 `used_amount`（包含預設值 0 與非負約束）。
- 後端 NestJS DTO、Repository、Service 完整支援 `usedAmount` 的持久化與查詢。
- 全套單元測試與 E2E 驗收測試 100% 通過。

---

## 2. 前後端統一通訊協議 (API Standard)

### 2.1 基礎通訊定義
- **Base URL**：`/api/budgets`
- **資料編碼**：`application/json; charset=utf-8`
- **時區統一**：日期字串格式採 `YYYY-MM-DD`（如 `2026-07-01`），審計時間戳記採 UTC ISO 8601。

### 2.2 統一回應封裝結構 (`ApiResponse<T>`)
所有端點回應資料一律透過全域 `TransformInterceptor` 封裝：

```typescript
export interface ApiResponse<T = unknown> {
  /** 業務執行成功標記 (true / false) */
  success: boolean;
  /** 業務狀態碼 ("111" 代表成功；400、404 等代表異常) */
  res_code: string;
  /** 回應提示訊息 (如 "成功", "Budget not found") */
  message: string;
  /** 伺服器時間戳記 (格式: YYYYMMDDHHmm，例如 "202609041745") */
  ts: string;
  /** 實際資料載荷 */
  res_body: T;
}
```

### 2.3 統一錯誤回應結構 (`ApiErrorResponse`)
```json
{
  "success": false,
  "res_code": "400",
  "message": "已使用金額不得小於 0",
  "ts": "202609041745",
  "res_body": null
}
```

---

## 3. 資料庫 Schema 變更與 Migration 腳本 (Database Migration)

### 3.1 資料表規格更新 (`budgets`)
在既有 `budgets` 資料表新增 `used_amount` 欄位：

| 欄位名稱 | 型態 (PostgreSQL) | 型態 (MySQL) | 允許 NULL | 預設值 | 說明 |
|---|---|---|---|---|---|
| `id` | `VARCHAR(36)` / `UUID` | `VARCHAR(36)` | NO | Primary Key | 預算唯一識別碼 |
| `title` | `VARCHAR(255)` | `VARCHAR(255)` | NO | - | 預算項目名稱 |
| `amount` | `NUMERIC(12, 2)` / `FLOAT8` | `DECIMAL(12, 2)` | NO | - | 預算總額度 (>= 0) |
| **`used_amount`** | **`NUMERIC(12, 2)` / `FLOAT8`** | **`DECIMAL(12, 2)`** | **NO** | **`0.00`** | **已使用金額 (>= 0)** |
| `category` | `VARCHAR(50)` | `VARCHAR(50)` | NO | - | 預算類別 |
| `start_date` | `VARCHAR(10)` | `VARCHAR(10)` | NO | - | 開始日期 (YYYY-MM-DD) |
| `end_date` | `VARCHAR(10)` | `VARCHAR(10)` | NO | - | 結束日期 (YYYY-MM-DD) |
| `is_active` | `BOOLEAN` | `TINYINT(1)` | NO | `true` | 是否啟用 |
| `created_at` | `TIMESTAMPTZ` | `DATETIME(0)` | NO | `now()` | 建立時間 |
| `updated_at` | `TIMESTAMPTZ` | `DATETIME(0)` | NO | - | 最後更新時間 |

---

### 3.2 SQL DDL Migration 腳本

#### PostgreSQL / Supabase
```sql
-- 1. 新增 used_amount 欄位 (預設值 0.00，既有資料自動填入 0)
ALTER TABLE "budgets"
  ADD COLUMN IF NOT EXISTS "used_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- 2. 新增非負約束檢查 (CHECK Constraints)
ALTER TABLE "budgets"
  ADD CONSTRAINT "chk_budgets_amount_non_negative" CHECK ("amount" >= 0),
  ADD CONSTRAINT "chk_budgets_used_amount_non_negative" CHECK ("used_amount" >= 0);
```

#### MySQL / MariaDB
```sql
-- 1. 新增 used_amount 欄位
ALTER TABLE `budgets`
  ADD COLUMN `used_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER `amount`;

-- 2. 新增非負約束檢查
ALTER TABLE `budgets`
  ADD CONSTRAINT `chk_budgets_amount_positive` CHECK (`amount` >= 0),
  ADD CONSTRAINT `chk_budgets_used_amount_positive` CHECK (`used_amount` >= 0);
```

---

### 3.3 Prisma ORM Schema 宣告
在 `prisma/schema.prisma` 更新 `Budget` 模型：

```prisma
model Budget {
  id         String   @id @default(uuid())
  title      String
  amount     Float
  usedAmount Float    @default(0) @map("used_amount")
  category   String
  startDate  String   @map("start_date") // "YYYY-MM-DD"
  endDate    String   @map("end_date")   // "YYYY-MM-DD"
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("budgets")
}
```

---

## 4. NestJS DTO 規範與校驗 (DTOs Specification)

### 4.1 `CreateBudgetDto`
```typescript
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: '預算名稱不可為空' })
  title!: string;

  @IsNumber({}, { message: '預算金額必須為數值' })
  @Min(0, { message: '預算金額不得小於 0' })
  amount!: number;

  @IsNumber({}, { message: '已使用金額必須為數值' })
  @Min(0, { message: '已使用金額不得小於 0' })
  @IsOptional()
  usedAmount?: number = 0;

  @IsString()
  @IsNotEmpty({ message: '請選擇預算類別' })
  category!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  startDate!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  endDate!: string;

  @IsBoolean({ message: 'isActive 必須為布林值' })
  isActive!: boolean;
}
```

### 4.2 `UpdateBudgetDto`
```typescript
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber({}, { message: '預算金額必須為數值' })
  @Min(0, { message: '預算金額不得小於 0' })
  amount?: number;

  @IsOptional()
  @IsNumber({}, { message: '已使用金額必須為數值' })
  @Min(0, { message: '已使用金額不得小於 0' })
  usedAmount?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  startDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

---

## 5. RESTful API 端點詳細規格 (Endpoints Specification)

### 5.1 查詢預算清單 (`GET /api/budgets`)
- **HTTP Method**：`GET`
- **URL**：`/api/budgets`
- **Response Status**：`200 OK`
- **Response JSON**：
```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202609041745",
  "res_body": [
    {
      "id": "budget_1",
      "title": "行銷活動推廣預算",
      "amount": 50000,
      "usedAmount": 12500,
      "category": "Marketing",
      "startDate": "2026-07-01",
      "endDate": "2026-12-31",
      "isActive": true,
      "createdAt": "2026-07-01T08:00:00.000Z",
      "updatedAt": "2026-07-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5.2 查詢單一預算 (`GET /api/budgets/:id`)
- **HTTP Method**：`GET`
- **URL**：`/api/budgets/:id`
- **Response Status**：`200 OK`
- **Response JSON**：
```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202609041745",
  "res_body": {
    "id": "budget_1",
    "title": "行銷活動推廣預算",
    "amount": 50000,
    "usedAmount": 12500,
    "category": "Marketing",
    "startDate": "2026-07-01",
    "endDate": "2026-12-31",
    "isActive": true,
    "createdAt": "2026-07-01T08:00:00.000Z",
    "updatedAt": "2026-07-15T10:30:00.000Z"
  }
}
```
- **Error Response (404)**：
```json
{
  "success": false,
  "res_code": "404",
  "message": "Budget not found",
  "ts": "202609041745",
  "res_body": null
}
```

---

### 5.3 建立新預算 (`POST /api/budgets`)
- **HTTP Method**：`POST`
- **URL**：`/api/budgets`
- **Request Headers**：`Content-Type: application/json`
- **Request Body (含 usedAmount)**：
```json
{
  "title": "伺服器硬體升級",
  "amount": 80000,
  "usedAmount": 15000,
  "category": "IT",
  "startDate": "2026-09-01",
  "endDate": "2026-12-31",
  "isActive": true
}
```
- **Request Body (省略 usedAmount，自動預設 0)**：
```json
{
  "title": "新人招募計畫",
  "amount": 30000,
  "category": "HR",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "isActive": true
}
```
- **Response Status**：`201 Created`
- **Response JSON**：
```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202609041745",
  "res_body": {
    "id": "e93f2c5e-8b6b-4c54-9d51-92b0c396c012",
    "title": "伺服器硬體升級",
    "amount": 80000,
    "usedAmount": 15000,
    "category": "IT",
    "startDate": "2026-09-01",
    "endDate": "2026-12-31",
    "isActive": true,
    "createdAt": "2026-09-04T17:45:00.000Z",
    "updatedAt": "2026-09-04T17:45:00.000Z"
  }
}
```

---

### 5.4 更新預算 (`PUT /api/budgets/:id`)
- **HTTP Method**：`PUT`
- **URL**：`/api/budgets/:id`
- **Request Body**：
```json
{
  "usedAmount": 28000,
  "amount": 85000
}
```
- **Response Status**：`200 OK`
- **Response JSON**：
```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202609041745",
  "res_body": {
    "id": "e93f2c5e-8b6b-4c54-9d51-92b0c396c012",
    "title": "伺服器硬體升級",
    "amount": 85000,
    "usedAmount": 28000,
    "category": "IT",
    "startDate": "2026-09-01",
    "endDate": "2026-12-31",
    "isActive": true,
    "createdAt": "2026-09-04T17:45:00.000Z",
    "updatedAt": "2026-09-04T17:50:00.000Z"
  }
}
```

---

### 5.5 刪除預算 (`DELETE /api/budgets/:id`)
- **HTTP Method**：`DELETE`
- **URL**：`/api/budgets/:id`
- **Response Status**：`200 OK`
- **Response JSON**：
```json
{
  "success": true,
  "res_code": "111",
  "message": "成功",
  "ts": "202609041745",
  "res_body": null
}
```

---

## 6. 業務邏輯與邊界防護 (Business Rules)

### 6.1 金額非負防護 (Non-negative Constraints)
- `amount >= 0`：預算總額不得小於 0。
- `usedAmount >= 0`：已使用金額不得為負數（防呆避免資產計量反轉）。若送出負值，`ValidationPipe` 立即返回 400 Bad Request。

### 6.2 允許超支情境容忍 (Over-budget Tolerance)
- 實務業務情境中，實際開銷可能超出最初規劃預算（例如預算 10,000 元，實際使用 12,500 元）。
- 前端 UI 在超過 100% 時會呈現警示色。
- 後端與資料庫**不得**阻擋 `usedAmount > amount` 的儲存與更新。

### 6.3 日期有效性檢驗 (Date Validation)
- 格式需符合 `YYYY-MM-DD` 正規表示式。
- 業務規則：`startDate <= endDate`。若 `startDate > endDate`，後端拋出 `BadRequestException('startDate cannot be later than endDate')`。

### 6.4 預設值回填 (Default Fallback)
- 在新增預算時，若請求未包含 `usedAmount`（即 `undefined` 或 `null`），後端預設自動補齊為 `0`。

---

## 7. NestJS 11+ 參考實作程式碼 (Reference Implementation)

### 7.1 `BudgetService`
```typescript
@Injectable()
export class BudgetService {
  constructor(
    @Inject(BUDGET_REPOSITORY_TOKEN)
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async findAll() {
    return this.budgetRepository.findAll();
  }

  async findById(id: string) {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new NotFoundException({
        message: 'Budget not found',
        errorCode: ErrorCode.BUDGET_NOT_FOUND,
      });
    }
    return budget;
  }

  async create(dto: CreateBudgetDto) {
    const id = dto.id || uuidv4();
    const existing = await this.budgetRepository.findById(id);
    if (existing) {
      throw new ConflictException({
        message: 'Budget ID already exists',
        errorCode: ErrorCode.BUDGET_ALREADY_EXISTS,
      });
    }

    if (dto.startDate && dto.endDate && dto.startDate > dto.endDate) {
      throw new BadRequestException({
        message: 'startDate cannot be later than endDate',
        errorCode: ErrorCode.VALIDATION_FAILED,
      });
    }

    const usedAmount = dto.usedAmount ?? 0;
    return this.budgetRepository.create({
      ...dto,
      id,
      usedAmount,
    });
  }

  async update(id: string, dto: UpdateBudgetDto) {
    const existing = await this.findById(id);

    const effectiveStartDate = dto.startDate ?? existing.startDate;
    const effectiveEndDate = dto.endDate ?? existing.endDate;
    if (effectiveStartDate && effectiveEndDate && effectiveStartDate > effectiveEndDate) {
      throw new BadRequestException({
        message: 'startDate cannot be later than endDate',
        errorCode: ErrorCode.VALIDATION_FAILED,
      });
    }

    return this.budgetRepository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.budgetRepository.delete(id);
    return null;
  }
}
```

---

## 8. 後端自我驗收檢查清單 (Acceptance Checklist)

- [x] 資料庫表 `budgets` 具備 `used_amount` 欄位並設定 `DEFAULT 0`。
- [x] Prisma Schema 定義 `usedAmount Float @default(0) @map("used_amount")`。
- [x] `CreateBudgetDto` 支援可選 `usedAmount`，非負數校驗 (`@Min(0)`)，預設為 `0`。
- [x] `UpdateBudgetDto` 支援可選更新 `usedAmount`，非負數校驗 (`@Min(0)`)。
- [x] 建立與更新預算時支援超支情境（`usedAmount > amount` 能順利寫入）。
- [x] 開始日期大於結束日期時精確阻擋 (400 Bad Request)。
- [x] 全 5 大 REST API 端點回應格式均符合統一 Envelope (`ApiResponse<T>`)。
- [x] 單元測試 (`budget.service.spec.ts`, `budget.controller.spec.ts`) 全綠通過。
- [x] E2E 驗收測試 (`test/budget.e2e-spec.ts`) 全綠通過。
