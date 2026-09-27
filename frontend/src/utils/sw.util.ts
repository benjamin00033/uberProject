/**
 * Service Worker 相關封裝與輔助函式。
 * 提供註冊 SW、更新以及雙向訊息傳遞機制的實作。
 */

/**
 * 註冊 Service Worker。
 *
 * 通常於 main.ts 或 App.vue 掛載時呼叫。
 *
 * @param swPath Service Worker 檔案的路徑 (預設 '/sw.js')
 * @example
 * await registerServiceWorker('/workbox-sw.js');
 */
export async function registerServiceWorker(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('您的瀏覽器不支援 Service Worker');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath);
    
    // 監聽更新事件
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('有新的內容可用，請重新整理頁面');
            // 可以透過 EventBus 或 Store 通知 UI 顯示「點擊更新」按鈕
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker 註冊失敗:', error);
    return null;
  }
}

/**
 * 傳送訊息給正在運行的 Service Worker。
 *
 * 常配合 Service Worker 進行手動快取清除、強制立即生效 (skipWaiting) 等操作。
 *
 * @param type 訊息類型 (事件名稱)
 * @param payload 額外夾帶的負載資料
 * @example
 * sendMessageToSW('SKIP_WAITING');
 * sendMessageToSW('CLEAR_CACHE', { target: 'images' });
 */
export function sendMessageToSW(type: string, payload?: any): void {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    console.warn('目前沒有正在控制頁面的 Service Worker');
    return;
  }

  navigator.serviceWorker.controller.postMessage({ type, payload });
}
