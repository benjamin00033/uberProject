import { http, HttpResponse } from "msw";
import { createStandardResponse, type HandlerCallback } from "./handlers";

// 暫存驗證碼資料結構 (Email -> OTP Code)
const activeOtpCodes = new Map<string, { code: string; expireAt: number }>();

export const API_KEYS = {
  AUTH_FORGOT_PASSWORD: "AUTH_FORGOT_PASSWORD",
  AUTH_VERIFY_RESET_CODE: "AUTH_VERIFY_RESET_CODE",
  AUTH_RESET_PASSWORD: "AUTH_RESET_PASSWORD",
} as const;

export const authCallbacks: Record<string, HandlerCallback> = {
  [API_KEYS.AUTH_FORGOT_PASSWORD]: () => {
    return http.post("/api/auth/forgot-password", async ({ request }) => {
      const body = (await request.json()) as { email?: string };

      if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "請輸入有效的電子郵件格式",
          }),
          { status: 400 },
        );
      }

      // 模擬特定不存在之 Email
      if (body.email === "notfound@example.com") {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "404",
            message: "此電子郵件尚未註冊帳號",
          }),
          { status: 404 },
        );
      }

      // 生成固定測試碼 123456
      const code = "123456";
      activeOtpCodes.set(body.email.toLowerCase(), {
        code,
        expireAt: Date.now() + 600 * 1000,
      });

      return HttpResponse.json(
        createStandardResponse({
          expireSeconds: 600,
          demoCode: code,
        }),
      );
    });
  },

  [API_KEYS.AUTH_VERIFY_RESET_CODE]: () => {
    return http.post("/api/auth/verify-reset-code", async ({ request }) => {
      const body = (await request.json()) as { email?: string; code?: string };

      if (!body.email || !body.code) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "Email 與驗證碼為必填欄位",
          }),
          { status: 400 },
        );
      }

      const stored = activeOtpCodes.get(body.email.toLowerCase());
      const isValid = body.code === "123456" || (stored && stored.code === body.code);

      if (!isValid) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "401",
            message: "驗證碼不正確或已過期，請重新索取",
          }),
          { status: 401 },
        );
      }

      return HttpResponse.json(createStandardResponse({ valid: true }));
    });
  },

  [API_KEYS.AUTH_RESET_PASSWORD]: () => {
    return http.post("/api/auth/reset-password", async ({ request }) => {
      const body = (await request.json()) as {
        email?: string;
        code?: string;
        newPassword?: string;
      };

      if (!body.email || !body.code || !body.newPassword) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "請填寫完整重設密碼資訊",
          }),
          { status: 400 },
        );
      }

      if (body.newPassword.length < 6) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "新密碼長度至少需 6 個字元",
          }),
          { status: 400 },
        );
      }

      const stored = activeOtpCodes.get(body.email.toLowerCase());
      const isValid = body.code === "123456" || (stored && stored.code === body.code);

      if (!isValid) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "401",
            message: "驗證碼無效或已過期",
          }),
          { status: 401 },
        );
      }

      // 重設完成後清除 OTP
      activeOtpCodes.delete(body.email.toLowerCase());

      return HttpResponse.json(
        createStandardResponse({
          reset: true,
          message: "密碼重設成功",
        }),
      );
    });
  },
};
