/**
 * 深度複製物件，斷開所有 Reference。
 *
 * 此函式使用原生的 `structuredClone` (若支援)，或 fallback 至 `JSON.parse` 機制。
 * 常用於 ERP 表單的初始資料備份或重置。
 *
 * @param obj 欲複製的物件
 * @example
 * const original = { a: 1, nested: { b: 2 } };
 * const clone = deepClone(original);
 * // → { a: 1, nested: { b: 2 } } （修改 clone.nested.b 不會影響 original）
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 從物件中挑選出指定的欄位，產生新的物件。
 *
 * @param obj 來源物件
 * @param keys 欲挑選的屬性名稱陣列
 * @example
 * const result = pickFields({ a: 1, b: 2, c: 3 }, ['a', 'c']);
 * // → { a: 1, c: 3 }
 */
export function pickFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 排除物件中指定的欄位，產生新的物件。
 *
 * @param obj 來源物件
 * @param keys 欲排除的屬性名稱陣列
 * @example
 * const result = omitFields({ a: 1, b: 2, c: 3 }, ['b']);
 * // → { a: 1, c: 3 }
 */
export function omitFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}
