/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { io, Socket } from "socket.io-client";

/**
 * 全域 WebSocket Base Service (Socket.IO 實作)
 * 提供動態設定端點並建立連線的基礎機制，支援 Socket.IO 事件監聽。
 */

export class WebSocketService {
  private socket: Socket | null = null;
  private url: string = "";
  private isConnected: boolean = false;
  // 記錄已註冊的事件及其 callback，以便斷線重連或重新初始化時套用
  private eventCallbacks: Map<string, ((data: any) => void)[]> = new Map();

  /**
   * 設定 WebSocket URL
   * @param url Socket.IO 連線端點
   */
  public setEndpoint(url: string): void {
    this.url = url;
  }

  /**
   * 註冊特定事件的回呼函式
   * @param event 事件名稱
   * @param callback 回呼函式
   */
  public on(event: string, callback: (data: any) => void): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * 取消註冊特定事件的回呼函式
   * @param event 事件名稱
   * @param callback 回呼函式
   */
  public off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }

    if (callback && this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event)!;
      this.eventCallbacks.set(
        event,
        callbacks.filter((cb) => cb !== callback),
      );
    } else {
      this.eventCallbacks.delete(event);
    }
  }

  /**
   * 建立連線
   */
  public connect(): void {
    console.log(this.url);
    if (!this.url) {
      throw new Error("WebSocket URL is not set.");
    }

    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io(this.url, {
      reconnectionDelayMax: 10000,
      // 1. 強制跳過 HTTP 輪詢，直接使用 WebSocket 連線
      // 這樣 ngrok 就不會跳出那個 HTTP 警告網頁
      transports: ["websocket"],

      // 2. 加上 ngrok 官方提供的略過警告 Header (雙重保險)
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO Error:", error);
    });

    // 將已記錄的 callbacks 綁定到新 socket 上
    this.eventCallbacks.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        this.socket!.on(event, cb);
      });
    });
  }

  /**
   * 斷開連線
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * 檢查連線狀態
   */
  public get connected(): boolean {
    return this.isConnected;
  }

  /**
   * 發送訊息
   * @param event 事件名稱
   * @param data 要發送的資料
   */
  public emit(event: string, data?: any): void {
    if (!this.socket || !this.isConnected) {
      throw new Error("WebSocket is not connected.");
    }
    this.socket.emit(event, data);
  }

  /**
   * 發送訊息 (Backward compat)
   * @param data 要發送的資料
   */
  public send(data: any): void {
    this.emit("message", data);
  }
}

export const wsService = new WebSocketService();
