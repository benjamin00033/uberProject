/**
 * 將字串進行輕量加密（Base64）。
 *
 * 僅用於前端防君子不防小人的簡易混淆，不可用於真正的機密金鑰加密。
 *
 * @param data 欲加密的字串
 * @example
 * const encoded = encryptData('hello');
 * // → 'aGVsbG8='
 */
export function encryptData(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

/**
 * 將輕量加密字串解密還原。
 *
 * 若解密失敗將回傳空字串。
 *
 * @param encryptedData 欲解密的字串
 * @example
 * const decoded = decryptData('aGVsbG8=');
 * // → 'hello'
 */
export function decryptData(encryptedData: string): string {
  try {
    return decodeURIComponent(atob(encryptedData));
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * 對敏感字串進行局部遮罩，僅保留前後部分字元。
 *
 * 若字串長度過短（小於等於可見範圍），則會回傳全遮罩，避免報錯。
 *
 * @param text 原始敏感字串
 * @param visibleStart 開頭保留的字元數
 * @param visibleEnd 結尾保留的字元數
 * @example
 * const masked = maskSensitiveData('0912345678', 4, 3);
 * // → '0912***678'
 */
export function maskSensitiveData(
  text: string,
  visibleStart: number = 3,
  visibleEnd: number = 3
): string {
  if (!text || text.length <= visibleStart + visibleEnd) {
    return '*'.repeat(text?.length || 0);
  }
  const start = text.slice(0, visibleStart);
  const end = text.slice(-visibleEnd);
  const maskLength = text.length - visibleStart - visibleEnd;

  return `${start}${'*'.repeat(maskLength)}${end}`;
}

/**
 * 產生一組短暫用於前端識別的唯一 UUID。
 *
 * @example
 * const id = generateUUID();
 * // → '123e4567-e89b-12d3-a456-426614174000'
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
