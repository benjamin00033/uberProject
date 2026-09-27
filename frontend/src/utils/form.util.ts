/**
 * 依據字串路徑取得物件深層的值（支援動態表單的巢狀欄位綁定）。
 *
 * 在動態表單中，欄位名稱常以字串路徑表示，如 `user.address[0].city`。
 * 此函數能安全地從深層物件中提取對應的值，避免 `Cannot read properties of undefined` 錯誤。
 *
 * @param obj 來源物件（表單資料）
 * @param path 路徑字串，例如 'user.address.city' 或 'users[0].name'
 * @param defaultValue 找不到值時的回傳預設值
 * @example
 * const city = getFieldValue({ user: { address: { city: 'Taipei' } } }, 'user.address.city');
 * // → 'Taipei'
 */
export function getFieldValue(
  obj: Record<string, any>,
  path: string,
  defaultValue?: any,
): any {
  if (!obj || !path) return defaultValue;

  // 將 array[0] 轉換為 array.0，再依據 . 分割
  const keys = path.replace(/\[(\w+)\]/g, ".$1").split(".");

  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}

/**
 * 依據字串路徑設定物件深層的值（Mutates 原物件）。
 *
 * 處理動態表單更新時，依據傳入的路徑自動建立不存在的巢狀物件或陣列，並寫入值。
 *
 * @param obj 欲修改的表單物件
 * @param path 路徑字串，例如 'user.address.city'
 * @param value 要設定的新值
 * @example
 * const data = {};
 * setFieldValue(data, 'user.address.city', 'Taipei');
 * // data → { user: { address: { city: 'Taipei' } } }
 */
export function setFieldValue(
  obj: Record<string, any>,
  path: string,
  value: any,
): void {
  if (!obj || !path) return;

  const keys = path.replace(/\[(\w+)\]/g, ".$1").split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key: String = keys[i];
    const nextKey = keys[i + 1];

    if (current[key] === undefined || current[key] === null) {
      // 如果下一個 key 是數字字串，則建立陣列，否則建立物件
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * 判斷表單欄位是否為空值（涵蓋多種型別）。
 *
 * 在驗證必填邏輯時，空陣列或空物件也常被視為「未填寫」。
 * 涵蓋 null、undefined、空字串、空陣列與空物件。
 *
 * @param value 要檢查的值
 * @example
 * const empty1 = isEmptyValue([]); // → true
 * const empty2 = isEmptyValue({}); // → true
 * const empty3 = isEmptyValue(0);  // → false
 */
export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    Object.keys(value).length === 0 &&
    !(value instanceof Date)
  )
    return true;
  return false;
}

/**
 * 比對原始資料與當前表單資料，抓出被修改過的欄位 (Dirty Fields)。
 *
 * 常用於只將有異動的資料送回後端 (PATCH 請求)，節省頻寬與後端處理成本。
 * 此實作為基礎比對，若是極端複雜的巢狀結構，建議依賴 lodash/isEqual。
 *
 * @param original 原始資料（表單初始狀態）
 * @param current 當前表單資料
 * @example
 * const dirty = getDirtyFields({ name: 'A', age: 20 }, { name: 'B', age: 20 });
 * // → { name: 'B' }
 */
export function getDirtyFields(
  original: Record<string, any>,
  current: Record<string, any>,
): Record<string, any> {
  const dirty: Record<string, any> = {};

  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      const origVal = original[key];
      const curVal = current[key];

      // 簡單的 JSON 序列化比對，可用於絕大多數表單資料結構
      if (JSON.stringify(origVal) !== JSON.stringify(curVal)) {
        dirty[key] = curVal;
      }
    }
  }

  return dirty;
}
