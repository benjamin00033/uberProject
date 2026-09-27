/**
 * 將數字格式化為金錢格式字串（預設加上千分位與小數點）。
 *
 * @param value 要格式化的數值
 * @param locale 語系設定，預設為 'en-US'
 * @param currency 貨幣代碼，預設為 'USD'
 * @example
 * const price = formatCurrency(1234567.89, 'zh-TW', 'TWD');
 * // → 'NT$1,234,568'
 */
export function formatCurrency(
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  if (Number.isNaN(value)) return '0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * 截斷過長字串並加上省略號。
 *
 * @param text 原始字串
 * @param maxLength 最大允許長度
 * @param suffix 截斷後附加的後綴字元，預設為 '...'
 * @example
 * const short = truncateText('Hello World', 5);
 * // → 'Hello...'
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}${suffix}`;
}

/**
 * 將字串首字母轉換為大寫。
 *
 * @param text 原始字串
 * @example
 * const title = capitalizeFirstLetter('apple');
 * // → 'Apple'
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
