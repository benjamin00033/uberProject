/**
 * 網頁瀏覽器 API 封裝 (Web Browser APIs)。
 * 提供全螢幕、剪貼簿、地理位置等常用原生功能的 Promise 封裝。
 */

/**
 * 複製文字到剪貼簿。
 *
 * @param text 欲複製的字串
 * @example
 * const success = await copyToClipboard('Hello World');
 * if (success) console.log('已複製');
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (error) {
    console.error('複製到剪貼簿失敗:', error);
    return false;
  }
}

/**
 * 切換全螢幕模式。
 *
 * 如果傳入 element，則針對該元素開啟全螢幕 (例如影片或圖表)，未傳入則以全文件為主。
 * 若當前已處於全螢幕，則退出全螢幕。
 *
 * @param element 指定要全螢幕的 DOM 元素，預設為 document.documentElement
 * @example
 * await toggleFullscreen(); // 網頁全螢幕
 * await toggleFullscreen(document.getElementById('video-player')); // 影片全螢幕
 */
export async function toggleFullscreen(element: HTMLElement = document.documentElement): Promise<void> {
  try {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('切換全螢幕失敗:', error);
  }
}

/**
 * 取得當前使用者的地理位置。
 *
 * @param options Geolocation API 設定選項
 * @example
 * try {
 *   const { coords } = await getCurrentGeolocation();
 *   console.log('緯度:', coords.latitude, '經度:', coords.longitude);
 * } catch (error) {
 *   console.error('使用者拒絕或取得失敗');
 * }
 */
export function getCurrentGeolocation(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('您的瀏覽器不支援地理位置功能'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * 傳送網頁原生推播通知 (Web Push / Desktop Notification)。
 * 若使用者尚未授權，將自動請求授權。
 *
 * @param title 通知標題
 * @param options 通知選項 (如 body, icon, image 等)
 * @returns 是否成功發送通知
 */
export async function sendWebPushNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('您的瀏覽器不支援 Web Notifications API');
    return false;
  }

  try {
    let permission = Notification.permission;
    
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    
    if (permission === 'granted') {
      const notification = new Notification(title, options);
      // Optional: Auto close after some time
      setTimeout(() => notification.close(), 5000);
      return true;
    } else {
      console.warn('使用者拒絕了推播通知授權');
      return false;
    }
  } catch (error) {
    console.error('發送推播通知失敗:', error);
    return false;
  }
}
