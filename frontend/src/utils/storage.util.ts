/**
 * Web Storage (localStorage / sessionStorage) 存取封裝。
 * 支援自動 JSON 序列化與反序列化，避免每次讀寫都要手動 JSON.parse / stringify。
 */

/**
 * 寫入資料到 Web Storage。
 *
 * @param key 儲存鍵值
 * @param value 儲存內容 (物件或基礎型別)
 * @param type 儲存類型：'local' 或 'session' (預設 'local')
 * @example
 * setStorage('user', { name: 'Alice', role: 'admin' }, 'session');
 */
export function setStorage(key: string, value: any, type: 'local' | 'session' = 'local'): void {
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    const serializedValue = JSON.stringify(value);
    storage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`寫入 ${type}Storage 失敗:`, error);
  }
}

/**
 * 從 Web Storage 讀取資料。
 *
 * @param key 儲存鍵值
 * @param type 儲存類型：'local' 或 'session' (預設 'local')
 * @example
 * const user = getStorage<{ name: string }>('user', 'session');
 * // → { name: 'Alice', ... } 或 null
 */
export function getStorage<T>(key: string, type: 'local' | 'session' = 'local'): T | null {
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    const item = storage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`讀取 ${type}Storage 失敗:`, error);
    return null;
  }
}

/**
 * 從 Web Storage 移除特定鍵值的資料。
 *
 * @param key 儲存鍵值
 * @param type 儲存類型：'local' 或 'session' (預設 'local')
 * @example
 * removeStorage('user', 'session');
 */
export function removeStorage(key: string, type: 'local' | 'session' = 'local'): void {
  const storage = type === 'local' ? window.localStorage : window.sessionStorage;
  storage.removeItem(key);
}

/**
 * 清空指定的 Web Storage。
 *
 * @param type 儲存類型：'local' 或 'session' (預設 'local')
 * @example
 * clearStorage('session');
 */
export function clearStorage(type: 'local' | 'session' = 'local'): void {
  const storage = type === 'local' ? window.localStorage : window.sessionStorage;
  storage.clear();
}
