/**
 * 依據物件陣列中的特定欄位進行排序。
 *
 * 預設為升序 (asc)，不會改動原始陣列，而是回傳新的陣列實例。
 *
 * @param array 要排序的物件陣列
 * @param field 作為排序依據的物件屬性名稱
 * @param order 排序方向，'asc' 為升序，'desc' 為降序
 * @example
 * const users = [{ name: 'Bob', age: 30 }, { name: 'Alice', age: 25 }];
 * const sorted = sortByField(users, 'age', 'asc');
 * // → [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
 */
export function sortByField<T extends Record<string, any>>(
  array: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 將物件陣列依據特定欄位進行分組。
 *
 * @param array 要分組的陣列
 * @param key 作為分組依據的屬性名稱
 * @example
 * const items = [{ type: 'A', val: 1 }, { type: 'A', val: 2 }, { type: 'B', val: 3 }];
 * const grouped = groupBy(items, 'type');
 * // → { A: [{ type: 'A', val: 1 }, { type: 'A', val: 2 }], B: [{ type: 'B', val: 3 }] }
 */
export function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((result, currentItem) => {
    const groupKey = String(currentItem[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 移除陣列中的重複值（支援基礎型別與物件的特定欄位）。
 *
 * 若傳入 key，則依據該物件欄位進行去重；否則使用 Set 進行基礎型別去重。
 *
 * @param array 要去重的陣列
 * @param key 判斷重複的屬性名稱（用於物件陣列）
 * @example
 * const nums = uniqueArray([1, 1, 2]); // → [1, 2]
 * const items = uniqueArray([{ id: 1 }, { id: 1 }], 'id'); // → [{ id: 1 }]
 */
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(array));
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const itemKey = item[key];
    if (seen.has(itemKey)) return false;
    seen.add(itemKey);
    return true;
  });
}

/**
 * 將單一陣列依指定大小切割為二維陣列（常用於分批處理或前端分頁渲染）。
 *
 * @param array 原始陣列
 * @param size 每個切割區塊的大小
 * @example
 * const chunks = chunkArray([1, 2, 3, 4, 5], 2);
 * // → [[1, 2], [3, 4], [5]]
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [array];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
