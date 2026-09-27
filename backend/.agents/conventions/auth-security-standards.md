# NestJS Auth & Security Standards (JWT & HTTP-Only Cookies)

本指南定義 Enterprise NestJS 系統在身分認證 (Authentication)、授權 (Authorization)、JWT Token 管理與 HTTP-Only Cookie 的安全標準。

---

## 🔒 1. JWT 認證與 HTTP-Only Cookie 架構

1. **Token 防禦原則 (Anti-XSS & Anti-CSRF)**:
   - **禁止**將 Access Token 或 Refresh Token 儲存於前端 `localStorage` 或 `sessionStorage` (易受 XSS 攻擊讀取)。
   - **強制**使用安全性高的 `HTTPOnly`, `Secure`, `SameSite: 'Strict'` (或 `'Lax'`) Cookies 儲存 JWT Token。
2. **Double Token 策略**:
   - **Access Token**: 短效期 (例: 15 分鐘)，通過 Cookie 傳送。
   - **Refresh Token**: 長效期 (例: 7 天)，儲存於專屬 HTTP-Only Path Cookie (`/api/v1/auth/refresh`)，資料庫記錄 Hashed Refresh Token。

---

## 🍪 2. Cookie 設定標準範例 (Express Response Cookie)

在 Auth Controller 處理 Login / Refresh 時的 Cookie 設定：

```typescript
import { Response } from 'express';

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  // 設置 Access Token Cookie
  res.cookie('access_token', accessToken, {
    httpOnly: true, // 防範 XSS 讀取
    secure: process.env.NODE_ENV === 'production', // 生產環境強制 HTTPS
    sameSite: 'strict', // 防範 CSRF 攻擊
    maxAge: 15 * 60 * 1000, // 15 分鐘
  });

  // 設置 Refresh Token Cookie (限制只能由 /refresh 路由讀取)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
  });
}
```

---

## 🛡 3. Passport JWT Strategy 與 Extraction

JWT Guard 必須支援從 Request Cookie 中提取 Token：

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies['access_token'];
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key-change-in-prod',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```
