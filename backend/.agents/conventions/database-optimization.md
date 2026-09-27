# NestJS Database Search, Indexing & Sorting Optimization Guide

本指南定義資料庫查詢、索引 (Indexing) 策略、排序演算法 (Sorting Algorithms) 與高吞吐量分頁的設計標準。

---

## 🔍 1. 資料庫搜尋與索引最佳化原則 (Indexing & Search Strategy)

1. **B-Tree 索引覆蓋 (B-Tree Indexing)**:
   - 常用於 `WHERE`, `ORDER BY`, `JOIN` 的欄位 (如 `email`, `status`, `createdAt`) 必須建立 B-Tree 索引，將搜尋複雜度由 $O(N)$ 降低至 $O(\log N)$。
2. **複合索引 (Composite Indexing)**:
   - 當查詢條件同時包含過濾與排序 (例如 `WHERE status = 'ACTIVE' ORDER BY createdAt DESC`)，必須建立複合索引 `(status, createdAt)`，避免 Filesort 效能衝擊。
3. **全文檢索 (Full-Text Search)**:
   - 對於模糊搜尋 (如文章內容、產品名稱)，避免使用前綴通配符 `LIKE '%keyword%'` (導致全表掃描)；應採用全文檢索索引 (Full-Text Index / GIN Index) 或整合搜尋引擎。

---

## ⚡ 2. 高效能分頁與排序 (Pagination & Sorting Algorithms)

1. **游標分頁 (Cursor-based Pagination)**:
   - 大資料量推播 (如歷史紀錄、流動 Feed) 優先採用 **Cursor-based Pagination** (如 `WHERE id > last_seen_id ORDER BY id ASC LIMIT 20`)，達到常數時間 $O(1)$ 分頁，避免傳統 `OFFSET` 導致的深分頁效能衰退。
2. **偏移量分頁 (Offset-based Pagination)**:
   - 前端表格分頁查詢採用標準 `PaginationQueryDto`，限定 `limit` 上限 (預設 10, 最大 100)，避免一次性加載過大 Payload 癱瘓記憶體。
3. **索引感知排序 (Index-aware Sorting)**:
   - 排序欄位必須為已建立索引之欄位。嚴禁對未索引欄位進行大資料量 `ORDER BY`。

---

## 📦 3. 通用 PaginationQueryDto 樣本

```typescript
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 通用分頁與排序查詢 DTO
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ description: '頁碼 (從 1 開始)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiPropertyOptional({ description: '每頁筆數 (1~100)', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit: number = 10;

  @ApiPropertyOptional({ description: '排序欄位', example: 'createdAt' })
  @IsOptional()
  @IsString()
  readonly sortBy: string = 'createdAt';

  @ApiPropertyOptional({ description: '排序方向', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  readonly sortOrder: 'ASC' | 'DESC' | 'asc' | 'desc' = 'DESC';

  @ApiPropertyOptional({ description: '關鍵字搜尋' })
  @IsOptional()
  @IsString()
  readonly search?: string;
}
```
