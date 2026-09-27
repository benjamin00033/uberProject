/**
 * 檢查字串是否為有效的台灣統一編號 (8 碼數字，符合邏輯乘數檢查)。
 *
 * 常用於 B2B 系統的客戶或供應商資料建立。
 *
 * @param taxId 欲檢查的統一編號
 * @example
 * const isValid = isValidTaiwanTaxId('12345675'); // 需為實際合法的統編
 * // → boolean
 */
export function isValidTaiwanTaxId(taxId: string): boolean {
  if (!/^\d{8}$/.test(taxId)) return false;

  const multiplier = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    const num = Number(taxId.charAt(i)) * multiplier[i];
    sum += Math.floor(num / 10) + (num % 10);
  }

  if (sum % 10 === 0) return true;
  if (taxId.charAt(6) === '7' && (sum + 1) % 10 === 0) return true;

  return false;
}

/**
 * 檢查字串是否為有效的 Email 格式。
 *
 * @param email 欲檢查的 Email 字串
 * @example
 * const isValid = isValidEmail('test@example.com');
 * // → true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 檢查字串是否為有效的手機號碼 (以台灣 09 開頭 10 碼為例，可視專案調整)。
 *
 * @param phone 欲檢查的電話號碼
 * @example
 * const isValid = isValidTaiwanMobile('0912345678');
 * // → true
 */
export function isValidTaiwanMobile(phone: string): boolean {
  const mobileRegex = /^09\d{8}$/;
  return mobileRegex.test(phone);
}
