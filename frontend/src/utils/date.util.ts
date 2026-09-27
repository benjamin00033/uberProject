/**
 * 將日期物件或時間戳依據指定格式轉換為字串。
 *
 * 支援替換的標記：YYYY (年), MM (月), DD (日), HH (時), mm (分), ss (秒)。
 *
 * @param date 原始日期
 * @param format 輸出格式，預設為 'YYYY-MM-DD'
 * @example
 * const str1 = formatDate(new Date('2026-05-19T14:30:00')); // → '2026-05-19'
 * const str2 = formatDate(new Date('2026-05-19T14:30:00'), 'YYYY/MM/DD HH:mm:ss'); // → '2026/05/19 14:30:00'
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
}

/**
 * 判斷給定的日期是否已經過期（小於當下時間）。
 *
 * @param date 要檢查的日期
 * @example
 * const expired = isExpired(new Date('2020-01-01'));
 * // → true
 */
export function isExpired(date: Date | number | string): boolean {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return true;
  return d.getTime() < Date.now();
}

/**
 * 取得指定日期的起始時間（00:00:00.000）。
 *
 * 常配合 API 查詢特定單日區間使用。
 *
 * @param date 基準日期
 * @example
 * const start = getStartOfDay(new Date());
 * // → 2026-05-25T00:00:00.000Z
 */
export function getStartOfDay(date: Date | number | string = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 取得指定日期的結束時間（23:59:59.999）。
 *
 * @param date 基準日期
 * @example
 * const end = getEndOfDay(new Date());
 * // → 2026-05-25T23:59:59.999Z
 */
export function getEndOfDay(date: Date | number | string = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
