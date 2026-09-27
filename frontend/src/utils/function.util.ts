/**
 * 函數執行控制與 Singleton 模式封裝 (Higher-Order Functions)。
 * 提供預防重複呼叫、防抖、節流等共用方法。
 */

/**
 * 將非同步函式封裝為 Singleton Promise (防止併發重複呼叫)。
 *
 * 當多個地方同時呼叫同一支 API (例如：取得全域設定、Refresh Token) 時，
 * 若前一次的請求尚未完成，後續的呼叫會直接共用同一個 Promise，
 * 等待完成後同時取得結果，避免向後端發送重複的請求。
 *
 * @param fn 需要被封裝的非同步函式
 * @example
 * const fetchConfig = createSingletonAsync(async () => await api.getConfig());
 * // 同時呼叫 3 次，實際上只會發出 1 次 HTTP Request
 * Promise.all([fetchConfig(), fetchConfig(), fetchConfig()]);
 */
export function createSingletonAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T> {
  let promise: Promise<T> | null = null;

  return function (...args: Args): Promise<T> {
    if (!promise) {
      // 記錄當前的 Promise，並在執行結束後清空，讓下次呼叫能重新發起請求
      promise = fn(...args).finally(() => {
        promise = null;
      });
    }
    return promise;
  };
}

/**
 * 確保函式只會被執行一次 (Once)。
 *
 * 無論呼叫多少次，真正的邏輯只會在第一次觸發，後續呼叫會直接回傳第一次的執行結果。
 * 常用於應用程式初始化、綁定全域事件等場景。
 *
 * @param fn 需要被封裝的函式
 * @example
 * const initApp = once(() => console.log('App 初始化'));
 * initApp(); // 印出 'App 初始化'
 * initApp(); // 什麼都不做
 */
export function once<T, Args extends any[]>(
  fn: (...args: Args) => T
): (...args: Args) => T {
  let called = false;
  let result: T;

  return function (...args: Args): T {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

/**
 * 防抖 (Debounce) 函式。
 *
 * 在指定的延遲時間內，若函式被連續觸發，則重新計算時間。
 * 只有當停止觸發經過指定的延遲時間後，函式才會被真正執行一次。
 * 常用於：搜尋框輸入建議 (Autocomplete)、視窗 Resize 事件。
 *
 * @param fn 真正要執行的函式
 * @param delay 延遲時間 (毫秒)
 * @example
 * const onSearch = debounce((query) => api.search(query), 500);
 * // 使用者連續快速輸入時，只有停下打字 500ms 後才會發出搜尋請求
 */
export function debounce<Args extends any[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * 節流 (Throttle) 函式。
 *
 * 在指定的間隔時間內，函式最多只會被執行一次。
 * 常用於：滾動事件 (Scroll) 監聽、滑鼠移動 (MouseMove) 軌跡紀錄、防止按鈕被瘋狂連點。
 *
 * @param fn 真正要執行的函式
 * @param limit 間隔時間 (毫秒)
 * @example
 * const onScroll = throttle(() => console.log('滾動處理'), 1000);
 * // 即使使用者在一秒內滾動了 100 次，也只會執行 1 次
 */
export function throttle<Args extends any[]>(
  fn: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle: boolean = false;

  return function (...args: Args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
