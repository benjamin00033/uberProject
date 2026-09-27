/**
 * 安全的四捨五入計算，避免 JavaScript 浮點數精度問題。
 *
 * 在 ERP 系統中，金額或稅額的計算經常遇到精度誤差（如 0.1 + 0.2 !== 0.3）。
 * 此函數能正確處理四捨五入到特定的小數位數。
 *
 * @param value 欲處理的數值
 * @param decimals 小數位數 (預設為 0)
 * @example
 * const result = roundDecimal(1.005, 2);
 * // → 1.01
 */
export function roundDecimal(value: number, decimals: number = 0): number {
  if (Number.isNaN(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * 計算包含稅額的總價。
 *
 * @param subtotal 小計未稅金額
 * @param taxRate 稅率百分比 (例如 0.05 代表 5%)
 * @example
 * const total = calculateTotalWithTax(100, 0.05);
 * // → 105
 */
export function calculateTotalWithTax(subtotal: number, taxRate: number): number {
  if (Number.isNaN(subtotal) || Number.isNaN(taxRate)) return 0;
  const taxAmount = subtotal * taxRate;
  return roundDecimal(subtotal + taxAmount, 2); // ERP 系統通常對齊小數後兩位
}

/**
 * 計算折扣後的金額。
 *
 * @param originalPrice 原始價格
 * @param discountRate 折扣率 (例如 0.8 代表打 8 折)
 * @example
 * const discounted = calculateDiscount(1000, 0.8);
 * // → 800
 */
export function calculateDiscount(originalPrice: number, discountRate: number): number {
  if (Number.isNaN(originalPrice) || Number.isNaN(discountRate)) return 0;
  return roundDecimal(originalPrice * discountRate, 2);
}
