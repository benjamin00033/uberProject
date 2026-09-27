import { http, HttpResponse, HttpHandler } from "msw";
import { formatDate } from "../utils/date.util";
import { menuTestCases } from "./menuTestData";

import { modifierGroupCallbacks } from "./modifierGroupMock";
import { menuItemCallbacks } from "./menuItemMock";
import { menuCallbacks } from "./menuMock";
import { dynamicFormCallbacks } from "./dynamicFormMock";
import { budgetCallbacks } from "./budgetMock";

// 1. 定義 Map Key
export const API_KEYS = {
  MENU_GET: "MENU_GET",
  FORM_SCHEMA_GET: "FORM_SCHEMA_GET",
  DYNAMIC_FORMS_GET: "DYNAMIC_FORMS_GET",
  DYNAMIC_FORMS_GET_ONE: "DYNAMIC_FORMS_GET_ONE",
  DYNAMIC_FORMS_POST: "DYNAMIC_FORMS_POST",
  DYNAMIC_FORMS_PUT: "DYNAMIC_FORMS_PUT",
  DYNAMIC_FORMS_DELETE: "DYNAMIC_FORMS_DELETE",
  BUDGET_GET: "BUDGET_GET",
  BUDGET_GET_ONE: "BUDGET_GET_ONE",
  BUDGET_POST: "BUDGET_POST",
  BUDGET_PUT: "BUDGET_PUT",
  BUDGET_DELETE: "BUDGET_DELETE",
} as const;
export type ApiKey = (typeof API_KEYS)[keyof typeof API_KEYS];

// 定義測試場景的型別 (確保 scenario 的 key 安全)
export type MenuScenario = keyof typeof menuTestCases;

// 定義全域 Mock 設定介面
export interface MockConfig {
  isEncrypted: boolean;
}

/**
 * 統一 API 回應格式介面 (移除 any，提升型別安全)
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  res_code: string;
  message: string;
  ts: string;
  res_body: T;
}

/**
 * 安全的 Base64 編碼器 (解決 btoa 不支援中文字元的問題)
 */
const encodeBase64Safe = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * 建立標準化的 API 回應物件
 */
export function createStandardResponse<T>(
  res_body: T,
  options: Partial<Omit<ApiResponse<T>, "res_body" | "ts">> = {},
): ApiResponse<T> {
  return {
    success: options.success ?? true,
    res_code: options.res_code ?? "111",
    message: options.message ?? "成功",
    ts: formatDate(new Date(), "YYYYMMDDHHmm"),
    res_body,
  };
}

// 2. 定義 Callback 型別
export type HandlerCallback = (config: MockConfig) => HttpHandler;

// 實作各個 API 的 Mock 邏輯 (Callbacks)
export const callbacks: Record<ApiKey, HandlerCallback> = {
  [API_KEYS.MENU_GET]: (config) => {
    return http.get("/api/menu", ({ request }) => {
      const url = new URL(request.url);
      const scenarioParam = url.searchParams.get("scenario");

      // Type Guard: 確保傳入的 scenario 在 menuTestCases 中確實存在
      const isValidScenario = scenarioParam && scenarioParam in menuTestCases;
      const scenario = (
        isValidScenario ? scenarioParam : "happyPath"
      ) as MenuScenario;

      // 處理 API 錯誤情境 (保持回傳格式一致，或者依據後端真實架構調整)
      if (scenario === "apiError") {
        return HttpResponse.json(
          createStandardResponse(menuTestCases.apiError, {
            success: false,
            res_code: "401",
            message: "Unauthorized",
          }),
          { status: 401 },
        );
      }

      // 取得測試資料
      const res_body = menuTestCases[scenario];

      // 處理加密邏輯 (加上防呆與 Unicode 處理)
      const responseData = config.isEncrypted
        ? { encryptedData: encodeBase64Safe(JSON.stringify(res_body)) }
        : res_body;

      return HttpResponse.json(createStandardResponse(responseData));
    });
  },
  ...modifierGroupCallbacks,
  ...menuItemCallbacks,
  ...menuCallbacks,
  ...dynamicFormCallbacks,
  ...budgetCallbacks,
};

// 3. 工廠函式 (Factory Function) - 建立並組合 Map
export const createMockMap = (config: MockConfig): Map<ApiKey, HttpHandler> => {
  const mockMap = new Map<ApiKey, HttpHandler>();

  // 透過型別斷言確保 key 解析正確
  (Object.keys(callbacks) as ApiKey[]).forEach((key) => {
    mockMap.set(key, callbacks[key](config));
  });

  return mockMap;
};

// 匯出直接產生 MSW 需要的 handlers 陣列供 worker 使用
export const getHandlers = (
  config: MockConfig = { isEncrypted: false },
): HttpHandler[] => {
  const map = createMockMap(config);
  return Array.from(map.values());
};
