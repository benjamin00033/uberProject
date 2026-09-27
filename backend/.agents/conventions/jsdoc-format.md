# JSDoc 撰寫規範 (NestJS TypeScript JSDoc Rules)

本文件規範 NestJS 後端專案之 JSDoc 註解撰寫標準。全專案所有 `export` 類別、方法、DTO 欄位均需撰寫 JSDoc。

---

## 核心原則 (Core Directives)

1. **專注於語意 (Semantics over Types)**: TypeScript 已經提供精準的型別資訊，JSDoc **不要重複寫型別** (例如：寫 `@param {string} id` 是多餘且危險的)。專注解釋**為什麼存在**、**業務規則**、**例外條件**。
2. **第一行為一句話摘要**: 第一行直接說明該 component / method 的職責。
3. **明確標註 `@throws`**: 列出方法可能拋出的自訂 Exceptions 或 HTTP Exceptions (如 `NotFoundException`, `UnauthorizedException`)。
4. **明確標註 `@example`**: 通用工具、Complex DTO 或 Service 方法建議附帶範例。

---

## 範例與標準寫法 (Examples)

### 1. NestJS Controller 寫法

```typescript
/**
 * 使用者管理 HTTP 控制器。
 * 處理使用者註冊、個人資料查詢與權限異動。
 */
@Controller('users')
export class UserController {
  /**
   * 根據 ID 取得使用者詳細資料。
   *
   * @param id 使用者 UUID 唯一識別碼
   * @returns 包含使用者基本資料的 Response Envelope
   * @throws {NotFoundException} 當使用者 ID 不存在時
   * @throws {UnauthorizedException} 當 Caller 缺少 Valid JWT 時
   */
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }
}
```

### 2. NestJS Injectable Service 寫法

```typescript
/**
 * 訂單算費與結帳業務邏輯服務。
 * 負責處理跨模組的折扣計算、稅率換算與庫存扣減。
 */
@Injectable()
export class OrderService {
  /**
   * 計算訂單最終結帳金額 (含稅金、運費與優惠券扣抵)。
   *
   * @param items 訂單品項清單
   * @param couponCode 可選之優惠券代碼
   * @returns 計算後之小計、稅金、運費與總金額
   * @throws {BadRequestException} 當品項清單為空或庫存不足時
   * @throws {UnprocessableEntityException} 當優惠券已過期時
   * @example
   * const result = await orderService.calculateTotal(cartItems, 'SUMMER2026');
   * // -> { subtotal: 1000, discount: 200, tax: 40, total: 840 }
   */
  async calculateTotal(items: CartItemDto[], couponCode?: string): Promise<OrderCalculationResult> {
    // ...
  }
}
```

### 3. NestJS DTO (Data Transfer Object) 寫法

```typescript
/**
 * 建立新產品之 HTTP 請求傳輸物件
 */
export class CreateProductDto {
  /**
   * 產品名稱 (不可空白，長度限制 2~100 字元)
   */
  @IsString()
  @Length(2, 100)
  readonly name: string;

  /**
   * 產品單價 (單位: TWD, 必須大於 0)
   */
  @IsNumber()
  @Min(1)
  readonly price: number;
}
```

### 4. Custom Helper / Exception Filter 寫法

```typescript
/**
 * 全域例外捕獲過濾器。
 * 將所有未處理之 Exception 統一包裝為標準 JSON Response 格式並觸發 Logger。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * 執行例外捕捉與 HTTP Response 輸出
   *
   * @param exception 捕獲之異常物件
   * @param host NestJS 執行上下文
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    // ...
  }
}
```
