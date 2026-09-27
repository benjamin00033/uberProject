import { setupWorker } from "msw/browser";
import { getHandlers } from "./handlers";

// 在這裡控制全域的 Mock 設定 (例如：是否啟用加密模擬)
// 未來可改為從環境變數 import.meta.env 中讀取
const mockConfig = {
  isEncrypted: false,
};

// 啟動 MSW worker，傳入我們由 Factory Function 產生的 handlers
export const worker = setupWorker(...getHandlers(mockConfig));
