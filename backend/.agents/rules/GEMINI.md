---
trigger: always_on
description: 確保 Agent 在開發與產出任何內容時，嚴格遵守 NestJS Enterprise 架構、多資料庫動態參數切換 (Supabase PostgreSQL / MariaDB / MySQL)、Provider/Repository 抽象解耦、JWT Cookie 安全、加解密解耦、DB 搜尋優化、統一資料傳遞格式與 Dev-Workflow 規範
---

# NestJS Enterprise Backend Agent Guidelines

本文件為 Antigravity AI Agent 於 NestJS 後端開發時的最高指導原則規範。

---

## 📚 開工前必讀文件

- [Architecture Conventions](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/architecture.md) - Enterprise NestJS DDD 分層與 Provider/Repository 架構
- [Dev-Workflow SOP](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/dev-workflow.md) - 開發工作流 Pipeline (Step 0 ~ Step 7)
- [Data Format Standards](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md) - 統一資料傳遞格式規範 (Response / Error / Pagination / Enum / SSE / Socket.IO / Timestamp / Token)
- [Auth & Security Standards](file:///C:/Users/benja/Desktop/backend/uber-menu-backend/.agents/conventions/auth-security-standards.md) - JWT 身分認證與 HTTPOnly Cookie 規範
- [Email & Password Reset Workflow](file:///C:/Users/benja/Desktop/backend/uber-menu-backend/.agents/conventions/email-password-reset-workflow.md) - 真實 Email 發送與忘記密碼/密碼重設開發守則與 Dev-Workflow SOP
- [Database Optimization Guide](file:///C:/Users/benja/Desktop/backend/uber-menu-backend/.agents/conventions/database-optimization.md) - Prisma & Supabase PostgreSQL / MariaDB B-Tree 索引、演算法搜尋與排序優化指南

---

## 🏗 專案概況與技術棧 (Project Overview & Tech Stack)

- **專案類型**: Enterprise NestJS Backend System (DDD + Dynamic Multi-DB Provider 導向)
- **執行環境 / 語言**: Node.js v20+, TypeScript v5.7+
- **核心 Framework**: NestJS v11+ (@nestjs/core, @nestjs/common, @nestjs/jwt, @nestjs/passport)
- **ORM / 資料庫**: Prisma ORM (`@prisma/client`), 多資料庫動態切換：**Supabase PostgreSQL** (`DB_TYPE=postgresql`) 與 **MariaDB / MySQL** (`DB_TYPE=mysql`)
- **包管理器 (Package Manager)**: `pnpm`
- **測試框架 (Testing Framework)**: Jest (`pnpm run test`), Supertest E2E (`pnpm run test:e2e`)

---

## 🎯 核心開發守則 (Agent Core Directives)

### 1. 多資料庫動態參數切換鐵律 (Dynamic Multi-Database Parameter Rule)

- **環境變數驅動 (`DB_TYPE`)**:
  - 資料庫類別切換禁止手動大範圍修改代碼；必須透過 `.env` 之 `DB_TYPE` (如 `postgresql` 或 `mysql`/`mariadb`) 參數控制。
  - 提供 `pnpm run db:switch` 自動同步 `schema.prisma` 與連線驅動，並透過 `UsersModule` 的 Custom Factory Provider (`useFactory`) 動態注入相對應的 Repository 實作。

---

### 2. Database Provider / Repository 介面抽象鐵律 (DB Repository Provider Abstraction Rule)

- **資料存取解耦與可擴充性**:
  - 業務 Service (`UsersService`) **禁止**直接耦合特定的 ORM 實作；必須透過 Repository 介面抽象 (`IUserRepository`) 進行操作。
  - 透過 NestJS DI Custom Provider 註冊 (`USER_REPOSITORY_TOKEN`)，實現資料存取層的動態擴充與切換。

---

### 3. JWT 身分認證與 HTTPOnly Cookie 安全鐵律 (JWT & HTTPOnly Cookie Rule)

- **防範 XSS / CSRF 金牌防線**:
  - 登入、發行與刷新 JWT Token 時，**禁止**將 Token 透過 JSON Response 直接傳回給前端手動存入 localStorage。
  - **強制**使用 `res.cookie()` 寫入 `httpOnly: true`, `secure: true`, `sameSite: 'strict'` 的專屬 Cookie 中。
  - Passport Strategy 必須使用 Cookie Extractor 自行從 Request Cookie 提取 `access_token`。

---

### 4. 解耦加解密與測試除錯支援鐵律 (Decoupled Crypto & Debug Mode Rule)

- **職責解耦與測試易用性**:
  - 密碼 Hash (Argon2 / Bcrypt) 與敏感欄位對稱加解密 (AES-256-GCM) 必須於 `CryptoService` 中獨立解耦封裝。
  - `CryptoService` 必須支援介面抽象與 **DEBUG/Mock 模式** (`CRYPTO_DEBUG_MOCK=true`)。

---

### 5. 統一資料傳遞格式鐵律 (Unified Data Format Rule)

所有 API Response、Error、分頁、事件與 Token 傳輸，必須嚴格遵循 [Data Format Standards](file:///C:/Users/benja/Desktop/research/nestJS/project-name/.agents/conventions/data-format-standards.md) 規範。
