import Dexie, { type Table } from 'dexie';

/**
 * 快取資料表的介面定義
 */
export interface CacheRecord {
  /** 唯一識別鍵值 (如 API URL) */
  key: string;
  /** 儲存的具體資料 */
  data: any;
  /** 過期時間戳 (Timestamp) */
  expiresAt: number;
}

/**
 * 宣告並初始化 Dexie.js (IndexedDBWrapper)
 */
export class AppDatabase extends Dexie {
  caches!: Table<CacheRecord, string>;

  constructor() {
    super('AppDatabase');
    // 定義資料庫結構與版本，只列出需建立索引的欄位
    this.version(1).stores({
      caches: 'key, expiresAt'
    });
  }
}

// 建立單例供全域使用
export const db = new AppDatabase();

/**
 * 寫入資料到 IndexedDB 快取中 (附帶過期時間機制)。
 *
 * 相較於 localStorage (通常限 5MB)，IndexedDB 適合儲存龐大或結構化的資料，
 * 例如 API 列表資料、字典檔或是離線應用的草稿資料。
 *
 * @param key 快取鍵值
 * @param data 要快取的資料
 * @param ttlInSeconds 存活時間 (TTL)，單位為秒 (預設 3600 秒 = 1 小時)
 * @example
 * await setDbCache('/api/users', usersData, 1800); // 存活半小時
 */
export async function setDbCache(key: string, data: any, ttlInSeconds: number = 3600): Promise<void> {
  try {
    const expiresAt = Date.now() + ttlInSeconds * 1000;
    await db.caches.put({ key, data, expiresAt });
  } catch (error) {
    console.error('寫入 IndexedDB 快取失敗:', error);
  }
}

/**
 * 從 IndexedDB 讀取快取資料 (自動檢查是否過期)。
 *
 * 若已過期，則自動刪除該筆資料並回傳 null。
 *
 * @param key 快取鍵值
 * @example
 * const cachedUsers = await getDbCache<User[]>('/api/users');
 * if (cachedUsers) return cachedUsers;
 */
export async function getDbCache<T>(key: string): Promise<T | null> {
  try {
    const record = await db.caches.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      await db.caches.delete(key);
      return null;
    }

    return record.data as T;
  } catch (error) {
    console.error('讀取 IndexedDB 快取失敗:', error);
    return null;
  }
}

/**
 * 清理所有已經過期的 IndexedDB 快取資料。
 *
 * 可在 App.vue 掛載或 Service Worker 更新時背景執行。
 *
 * @example
 * await clearExpiredDbCache();
 */
export async function clearExpiredDbCache(): Promise<void> {
  try {
    const now = Date.now();
    await db.caches.where('expiresAt').below(now).delete();
  } catch (error) {
    console.error('清理過期快取失敗:', error);
  }
}

/**
 * 徹底清空快取資料表。
 *
 * 常用於使用者「登出」或「清除快取」按鈕被點擊時。
 *
 * @example
 * await clearAllDbCache();
 */
export async function clearAllDbCache(): Promise<void> {
  try {
    await db.caches.clear();
  } catch (error) {
    console.error('清空快取資料庫失敗:', error);
  }
}
