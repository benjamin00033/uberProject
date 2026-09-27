# 菜單營業時段 (MenuTime / Store Hours) 後端建構技術規格文件

> **版本**：v1.0.0  
> **最後更新**：2026-09-03  
> **狀態**：正式發布 (Ready for Implementation)  
> **適用目標**：初階/新手後端工程師、全端工程師、QA 團隊  
> **關聯前端**：[`src/domain/menu/pages/MenuTime.vue`](../src/domain/menu/pages/MenuTime.vue)、[`TimeScheduleEditor.vue`](../src/domain/menu/components/TimeScheduleEditor.vue)

---

## 1. 文件概述與背景說明 (Overview)

### 1.1 目的

本文檔專為接手 **「營業時段與菜單供應時間 (MenuTime)」** 模組的新手後端工程師編寫。
目前前端畫面已完成開發，但前端與後端「**在勾稽時為無作用**」——即前端儲存之排程僅停留在暫時性記憶體 Mock，缺乏實質資料庫關聯、有效性校驗、時段衝突偵測，以及菜單（Menu）、分類（Category）、商品（Item）之間的實質供應約束勾稽。

本文件將引導你理解前端資料流、設計合適的關聯資料庫模型、實作 RESTful API、落實業務校驗規則，並完成營業時段與菜單品項的真正勾稽。

### 1.2 前端元件與依賴架構

- **頁面入口**：[`src/domain/menu/pages/MenuTime.vue`](../src/domain/menu/pages/MenuTime.vue)
  - 預設載入 `STORE_HOURS_ID = "store_hours"` 的全門市預設營業時段。
  - 負責接收使用者儲存操作，並發送更新請求。
- **編輯組件**：[`src/domain/menu/components/TimeScheduleEditor.vue`](../src/domain/menu/components/TimeScheduleEditor.vue)
  - 提供週一至週日 (`MONDAY` ~ `SUNDAY`) 七個折疊面板。
  - 支援每天動態新增、刪除多個營業/供應時段（例如早市 `09:00~14:00`、晚市 `17:00~21:00`）。
- **前端驗證**：[`src/domain/menu/schemas/menuTime.schema.ts`](../src/domain/menu/schemas/menuTime.schema.ts)
  - 使用 Zod 進行前端格式驗證（驗證 `HH:mm` 時間正規表達式與星期枚舉）。
- **服務層與 Hook**：
  - [`src/domain/menu/hooks/useMenuTimes.ts`](../src/domain/menu/hooks/useMenuTimes.ts) (TanStack Vue Query 快取與狀態)
  - [`src/domain/menu/services/MenuService.ts`](../src/domain/menu/services/MenuService.ts) (API 呼叫端點：`GET /api/menus/:id`, `PUT /api/menus/:id`)

### 1.3 核心痛點：為什麼「在勾稽時為無作用」？

在進行系統整合時，若缺少後端業務支撐，會產生以下四大斷層：

1. **無資料庫持久化**：目前後端僅為前端 MSW Mock，頁面重新整理或重啟伺服器後資料遺失。
2. **缺乏時段衝突與重疊校驗**：若使用者在週一輸入 `09:00~15:00` 與 `12:00~18:00`，前端未阻擋，後端若直接儲存將導致前端與顧客端無法判定營業邏輯。
3. **缺乏菜單與商品實體的關聯勾稽**：菜單中的 `category_ids` 欄位若未與分類表進行外鍵驗證，時段無法對特定分類或菜色生效。
4. **缺乏即時狀態判定 API**：顧客端（前台/點餐 App）需要知道「**這家店現在是否營業中？**」、「**這道早餐現在能否被點選？**」，後端缺乏即時運算的查詢端點。

---

## 2. API 通訊協議與統一格式規範 (API Standard)

### 2.1 基礎通訊定義

- **Base URL**：`/api`
- **資料編碼**：`application/json; charset=utf-8`
- **傳輸加密支援**：專案具備動態加解密模組（AES-CBC 搭配時間戳記 `X-Timestamp`）。若環境變數 `VITE_ENABLE_ENCRYPTION=true`，後端接收與回應需符合動態加解密協定（詳見第 6.4 節）。

### 2.2 統一回應封裝結構 (`ApiResponse<T>`)

後端所有 API 回傳格式必須統一遵循專案規範：

```typescript
interface ApiResponse<T> {
  /** 業務執行成功標記 (true / false) */
  success: boolean;
  /** 回應提示訊息 (如 "查詢成功"、"時間重疊錯誤") */
  message: string;
  /** 業務狀態代碼 ("0000" 成功，其餘為錯誤代碼) */
  res_code: string;
  /** 伺服器時間戳記 (毫秒或 ISO 格式，用於加解密與同步校驗) */
  ts: string;
  /** 業務資料酬載 */
  res_body: T;
}
```

---

## 3. 資料結構與實體模型 (Data Model Specification)

### 3.1 前端核心模型：`Menu`

前端傳遞與接收的 JSON 結構如下：

```typescript
interface Menu {
  /** 菜單或排程唯一識別碼 (例如 "store_hours", "menu_breakfast") */
  id: string;
  /** 多語系標題名稱 */
  title: {
    translations: {
      en?: string;
      zh?: string;
      [lang: string]: string | undefined;
    };
  };
  /** 七天營業/開放時段陣列 */
  service_availability: ServiceAvailability[];
  /** 綁定的分類 ID 清單 (勾稽實體) */
  category_ids: string[];
}

interface ServiceAvailability {
  /** 星期枚舉：MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY */
  day_of_week: DayOfWeek;
  /** 當天開放的時間區段清單 (若為空陣列代表該日公休) */
  time_periods: TimePeriod[];
}

interface TimePeriod {
  /** 開始時間 (HH:mm 格式，例如 "09:00") */
  start_time: string;
  /** 結束時間 (HH:mm 格式，例如 "21:30") */
  end_time: string;
}
```

### 3.2 資料庫實體關聯圖 (ER Diagram)

建議後端採用關聯式資料庫（PostgreSQL 或 MySQL）正規化設計，劃分為三張主表：

```mermaid
erDiagram
    MENUS ||--o{ MENU_SERVICE_AVAILABILITIES : "包含 (1對多)"
    MENU_SERVICE_AVAILABILITIES ||--o{ MENU_TIME_PERIODS : "包含多個時段 (1對多)"
    MENUS ||--o{ MENU_CATEGORY_MAPPINGS : "綁定分類 (多對多)"
    CATEGORIES ||--o{ MENU_CATEGORY_MAPPINGS : "被多個菜單引用"

    MENUS {
        varchar(64) id PK "菜單識別碼，如 store_hours"
        jsonb title "多語系名稱 { translations: { zh, en } }"
        boolean is_active "是否啟用"
        timestamp created_at "建立時間"
        timestamp updated_at "最後更新時間"
    }

    MENU_SERVICE_AVAILABILITIES {
        uuid id PK "主鍵"
        varchar(64) menu_id FK "關聯菜單 ID"
        varchar(10) day_of_week "星期代碼 MONDAY ~ SUNDAY"
        unique(menu_id, day_of_week) "一菜單一天一筆"
    }

    MENU_TIME_PERIODS {
        uuid id PK "時段主鍵"
        uuid availability_id FK "關聯星期配置 ID"
        time start_time "開始時間 (00:00:00 ~ 23:59:00)"
        time end_time "結束時間 (00:00:00 ~ 23:59:00)"
        int sort_order "排序權重"
    }

    MENU_CATEGORY_MAPPINGS {
        varchar(64) menu_id FK "菜單 ID"
        varchar(64) category_id FK "分類 ID"
    }
```

### 3.3 資料庫 DDL 參考語法 (PostgreSQL)

```sql
-- 1. 菜單與排程主表
CREATE TABLE menus (
    id VARCHAR(64) PRIMARY KEY,
    title JSONB NOT NULL DEFAULT '{"translations": {"zh": "營業時間", "en": "Store Hours"}}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 每週天數設定表
CREATE TABLE menu_service_availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id VARCHAR(64) NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
    CONSTRAINT uq_menu_day UNIQUE (menu_id, day_of_week)
);

-- 3. 具體營業時間段
CREATE TABLE menu_time_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID NOT NULL REFERENCES menu_service_availabilities(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_time_order CHECK (start_time < end_time)
);

-- 4. 菜單與分類關聯表（落實勾稽）
CREATE TABLE menu_categories (
    menu_id VARCHAR(64) NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    category_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (menu_id, category_id)
);

-- 索引優化
CREATE INDEX idx_time_periods_avail ON menu_time_periods(availability_id);
CREATE INDEX idx_menu_availabilities_menu ON menu_service_availabilities(menu_id);
```

---

## 4. RESTful API 端點詳細規範 (Endpoints Specification)

### 4.1 取得單一菜單/營業時間配置

- **URL**：`GET /api/menus/:id`
- **說明**：取得指定 ID（例如 `store_hours`）的排程資訊。若該 ID 尚未初始化，可自動建立預設資料或回傳 404。
- **URL 參數**：`id`（字串，如 `store_hours`）

#### 成功回應範例 (200 OK)

```json
{
  "success": true,
  "res_code": "0000",
  "message": "查詢成功",
  "ts": "1725336000000",
  "res_body": {
    "id": "store_hours",
    "title": {
      "translations": {
        "zh": "營業時間",
        "en": "Store Hours"
      }
    },
    "category_ids": ["cat_beverage", "cat_dessert"],
    "service_availability": [
      {
        "day_of_week": "MONDAY",
        "time_periods": [
          { "start_time": "09:00", "end_time": "14:00" },
          { "start_time": "17:00", "end_time": "21:30" }
        ]
      },
      {
        "day_of_week": "TUESDAY",
        "time_periods": [{ "start_time": "09:00", "end_time": "21:30" }]
      },
      {
        "day_of_week": "WEDNESDAY",
        "time_periods": []
      },
      {
        "day_of_week": "THURSDAY",
        "time_periods": [{ "start_time": "09:00", "end_time": "21:30" }]
      },
      {
        "day_of_week": "FRIDAY",
        "time_periods": [{ "start_time": "09:00", "end_time": "22:00" }]
      },
      {
        "day_of_week": "SATURDAY",
        "time_periods": [{ "start_time": "10:00", "end_time": "22:00" }]
      },
      {
        "day_of_week": "SUNDAY",
        "time_periods": [{ "start_time": "10:00", "end_time": "21:00" }]
      }
    ]
  }
}
```

---

### 4.2 更新菜單/營業時間配置（前端儲存觸發端點）

- **URL**：`PUT /api/menus/:id`
- **說明**：更新營業時間排程。後端必須在 Transaction 中覆寫或更新該菜單所屬的七天時段設定，並進行時段重疊校驗。
- **URL 參數**：`id`（字串）
- **請求格式**：`application/json`

#### 請求 Payload 範例

```json
{
  "id": "store_hours",
  "title": {
    "translations": {
      "zh": "常規營業時間",
      "en": "Standard Store Hours"
    }
  },
  "category_ids": ["cat_beverage", "cat_dessert"],
  "service_availability": [
    {
      "day_of_week": "MONDAY",
      "time_periods": [
        { "start_time": "09:00", "end_time": "14:00" },
        { "start_time": "17:00", "end_time": "21:30" }
      ]
    },
    {
      "day_of_week": "TUESDAY",
      "time_periods": [{ "start_time": "09:00", "end_time": "21:30" }]
    },
    {
      "day_of_week": "WEDNESDAY",
      "time_periods": []
    },
    {
      "day_of_week": "THURSDAY",
      "time_periods": [{ "start_time": "09:00", "end_time": "21:30" }]
    },
    {
      "day_of_week": "FRIDAY",
      "time_periods": [{ "start_time": "09:00", "end_time": "22:00" }]
    },
    {
      "day_of_week": "SATURDAY",
      "time_periods": [{ "start_time": "10:00", "end_time": "22:00" }]
    },
    {
      "day_of_week": "SUNDAY",
      "time_periods": [{ "start_time": "10:00", "end_time": "21:00" }]
    }
  ]
}
```

#### 成功回應 (200 OK)

回傳更新後的完整 `Menu` 物件。

#### 失敗回應 — 時間重疊衝突 (400 Bad Request)

```json
{
  "success": false,
  "res_code": "4002",
  "message": "週一 (MONDAY) 時段設定重疊：09:00~15:00 與 12:00~18:00 發生時間衝突",
  "ts": "1725336000000",
  "res_body": {
    "field": "service_availability.0.time_periods",
    "conflict_day": "MONDAY",
    "periods": [
      { "start_time": "09:00", "end_time": "15:00" },
      { "start_time": "12:00", "end_time": "18:00" }
    ]
  }
}
```

---

### 4.3 即時狀態勾稽查詢端點（核心商業勾稽 API）

- **URL**：`GET /api/menus/:id/status`
- **說明**：專供前台點餐、顧客端或門市管理確認「此時此刻該排程是否生效/營業中」。
- **Query 參數**：
  - `datetime`（選填，ISO 8601 時間字串，預設為伺服器當前時間）
- **成功回應範例**：

```json
{
  "success": true,
  "res_code": "0000",
  "message": "查詢成功",
  "ts": "1725336000000",
  "res_body": {
    "menu_id": "store_hours",
    "is_open": true,
    "current_time": "2026-09-03T18:30:00.000Z",
    "current_day": "THURSDAY",
    "active_period": {
      "start_time": "17:00",
      "end_time": "21:30"
    },
    "next_change": {
      "event": "CLOSE",
      "time": "21:30"
    }
  }
}
```

---

## 5. 核心業務邏輯與勾稽檢驗規則 (Validation & Business Rules)

新手後端工程師請特別注意，以下規則是將本功能從「單純存取」升級為「商業勾稽」的核心關鍵：

### 5.1 規則一：時段格式與防呆檢驗

1. **時間格式**：必須嚴格符合 `HH:mm`（24 小時制），正規表達式：`/^([01]\d|2[0-3]):([0-5]\d)$/`。
2. **區間合法性**：單一時段內，`start_time` 必須小於 `end_time`（例如 `09:00 < 17:00`）。
   - _註：若未來需要跨夜支援（例如 `22:00 ~ 02:00`），建議拆分為當日 `22:00~23:59` 與隔日 `00:00~02:00` 兩段儲存。_

### 5.2 規則二：同一天內時段重疊校驗演算法 (Overlap Prevention)

當使用者在同一天設定了多個營業區間時，**絕對不允許重疊**。
後端需在儲存前進行演算法校驗：

```typescript
/**
 * 檢查同一天的多個時段是否存在重疊
 *
 * 演算法思維：
 * 1. 將 "HH:mm" 轉換為當天的分鐘數 (0 ~ 1439)
 * 2. 依照開始時間由小到大排序 (Sort by start_minute)
 * 3. 遍歷相鄰時段，若前一時段的結束時間大於後一時段的開始時間，即為重疊衝突！
 */
function hasTimeOverlap(periods: TimePeriod[]): boolean {
  if (periods.length <= 1) return false;

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const sorted = [...periods].sort(
    (a, b) => toMinutes(a.start_time) - toMinutes(b.start_time),
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = toMinutes(sorted[i].end_time);
    const nextStart = toMinutes(sorted[i + 1].start_time);
    if (currentEnd > nextStart) {
      return true; // 發生重疊！
    }
  }
  return false;
}
```

### 5.3 規則三：公休日與空時段處理

- 前端折疊面板中，如果使用者把某一天所有的時段全部刪除（`time_periods: []`），後端必須合法接受，這代表：**該門市在該天公休不營業**。
- 不可誤判為「未填寫必填欄位」而噴出 Validation 錯誤。

### 5.4 規則四：菜單與分類/品項之勾稽約束

1. 傳入之 `category_ids` 陣列中的每個 ID，後端必須查詢 `categories` 資料表確認存在。
2. 當顧客發出點餐請求時，系統應調用「時段判定邏輯」，確認目標商品所屬的菜單分類在當下是否處於營業/供應時段：
   - 若非供應時段，系統回傳 `403 Forbidden` 或提示：「該品項非目前時段供應商品」。

---

## 6. 新手後端工程師實作指南 (Step-by-Step Guide)

以下為 NestJS / Express + Prisma 的實作流程參考：

### Step 1: 建立或更新 Prisma Schema

```prisma
model Menu {
  id                  String               @id
  title               Json
  isActive            Boolean              @default(true)
  availabilities      MenuAvailability[]
  categories          MenuCategory[]
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

model MenuAvailability {
  id          String           @id @default(uuid())
  menuId      String
  menu        Menu             @relation(fields: [menuId], references: [id], onDelete: Cascade)
  dayOfWeek   String
  periods     MenuTimePeriod[]

  @@unique([menuId, dayOfWeek])
}

model MenuTimePeriod {
  id              String            @id @default(uuid())
  availabilityId  String
  availability    MenuAvailability  @relation(fields: [availabilityId], references: [id], onDelete: Cascade)
  startTime       String
  endTime         String
  sortOrder       Int               @default(0)
}

model MenuCategory {
  menuId      String
  categoryId  String
  menu        Menu   @relation(fields: [menuId], references: [id], onDelete: Cascade)

  @@id([menuId, categoryId])
}
```

### Step 2: 建立 DTO 與校驗管道 (Data Transfer Object)

使用 `class-validator` 定義請求驗證：

```typescript
import { IsString, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class TimePeriodDto {
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '開始時間格式必須為 HH:mm',
  })
  start_time: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '結束時間格式必須為 HH:mm',
  })
  end_time: string;
}

export class ServiceAvailabilityDto {
  @Matches(/^(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)$/, {
    message: '星期代碼不合法',
  })
  day_of_week: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimePeriodDto)
  time_periods: TimePeriodDto[];
}

export class UpdateMenuDto {
  @IsString()
  id: string;

  title?: { translations: Record<string, string> };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceAvailabilityDto)
  service_availability: ServiceAvailabilityDto[];

  @IsArray()
  @IsString({ each: true })
  category_ids: string[];
}
```

### Step 3: 實作 Service 業務邏輯 (Transaction 保證)

```typescript
@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async updateMenuSchedule(id: string, dto: UpdateMenuDto) {
    // 1. 驗證每日時段重疊
    for (const day of dto.service_availability) {
      if (hasTimeOverlap(day.time_periods)) {
        throw new BadRequestException(`${day.day_of_week} 時段存在重疊衝突`);
      }
    }

    // 2. 資料庫交易保證 (先刪舊時段再重新建立)
    return this.prisma.$transaction(async (tx) => {
      // 確保 Menu 存在
      await tx.menu.upsert({
        where: { id },
        create: { id, title: dto.title ?? {} },
        update: { title: dto.title ?? {} },
      });

      // 清除既有時段並重新建立
      for (const day of dto.service_availability) {
        const avail = await tx.menuAvailability.upsert({
          where: {
            menuId_dayOfWeek: { menuId: id, dayOfWeek: day.day_of_week },
          },
          create: { menuId: id, dayOfWeek: day.day_of_week },
          update: {},
        });

        await tx.menuTimePeriod.deleteMany({
          where: { availabilityId: avail.id },
        });

        if (day.time_periods.length > 0) {
          await tx.menuTimePeriod.createMany({
            data: day.time_periods.map((p, idx) => ({
              availabilityId: avail.id,
              startTime: p.start_time,
              endTime: p.end_time,
              sortOrder: idx,
            })),
          });
        }
      }

      return this.getMenuById(id);
    });
  }
}
```

---

## 7. 常見盲點與防呆 Checklist (Pitfalls & Checklist)

- [ ] **時區標準 (Timezone)**：所有在資料庫比較的時間，請以門市營運當地的本地時間（例如 `Asia/Taipei`，UTC+8）為準，切勿以伺服器預設的 UTC 時間比對，否則營業時間會產生 8 小時偏差。
- [ ] **星期枚舉一致性**：英文大寫 `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`，不可出現 `Monday` 或 `mon`。
- [ ] **初始化種子資料 (Seeding)**：在後端 Migration 執行時，必須自動寫入一筆預設的 `id: "store_hours"`，包含週一至週日預設的 `09:00~21:00`，避免前端初次造訪頁面時載入失敗。
- [ ] **回應格式保持 unwrap 相容**：嚴格封裝於 `res_body` 中，確保前端 `MenuService.getMenu(id).then(res => res.res_body)` 順暢取值。
