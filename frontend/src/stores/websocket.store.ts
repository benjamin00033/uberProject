/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { defineStore } from "pinia";
import { wsService } from "../services/websocket.service";

/**
 * 全域 WebSocket Callback 管理模組
 * 負責維護 Component 註冊的 callback 函式，收到訊息時進行分發。
 */
export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    // 使用 Map 存放 callback: Map<event, Map<key, callback>>
    eventCallbacks: new Map<string, Map<string, (data: any) => any>>(),
    isServiceInitialized: false,
  }),
  actions: {
    /**
     * 註冊回呼函式
     * @param event Socket.IO 事件名稱
     * @param key 用於識別的唯一鍵值 (例如 Component Name + ID)
     * @param callback 接值的函式
     */
    registerCallback(event: string, key: string, callback: (data: any) => any) {
      if (!this.eventCallbacks.has(event)) {
        this.eventCallbacks.set(event, new Map());
        // 第一次註冊該事件時，綁定到 wsService
        wsService.on(event, (data) => {
          this.dispatch(event, data);
        });
      }
      this.eventCallbacks.get(event)!.set(key, callback);
    },

    /**
     * 取消註冊回呼函式
     * @param event 事件名稱
     * @param key 用於識別的唯一鍵值
     */
    unregisterCallback(event: string, key: string) {
      if (this.eventCallbacks.has(event)) {
        this.eventCallbacks.get(event)!.delete(key);
        if (this.eventCallbacks.get(event)!.size === 0) {
          // 如果沒有人監聽了，可以考慮從 wsService 解除，但目前 wsService 沒寫 off 多個
          // 這裡簡單處理即可
        }
      }
    },

    /**
     * 觸發特定分發邏輯
     * @param event 事件名稱
     * @param data 要分發的資料
     */
    dispatch(event: string, data: any) {
      const callbacks = this.eventCallbacks.get(event);
      if (callbacks) {
        callbacks.forEach((cb) => {
          cb(data);
        });
      }
    },
  },
});
