# ============================================================
# Dockerfile — Ultra-Lean Multi-Stage Production Build
# 目標: 極致壓縮 Image 體積 (< 250MB)，排除所有 Dev 依賴與編譯殘餘
# ============================================================

# ---- Stage 1: Builder ----
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. 複製 manifests 並安裝全部依賴（含 devDependencies 用於 build）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/* \
    && pnpm install --frozen-lockfile

# 2. 生成 Prisma Client
COPY prisma ./prisma
COPY prisma.config.js ./
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    DATABASE_PASSWORD="dummy" \
    pnpm exec prisma generate

# 3. 編譯 NestJS（使用極致精簡的 tsconfig.build.json）
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN pnpm run build

# 4. 建立獨立的 Production 依賴目錄（徹底隔離 .pnpm 中的 devDeps 殘留，pnpm v10+ 需帶 --legacy）
RUN pnpm --filter=uber-menu-backend --prod --legacy deploy /prod

# 5. 將 Prisma 生成的 Client (.prisma) 複製進 /prod 的 node_modules
RUN PRISMA_DIR=$(find /app/node_modules -type d -name ".prisma" | head -n 1) && \
    if [ -n "$PRISMA_DIR" ]; then \
      cp -r "$PRISMA_DIR" /prod/node_modules/.prisma && \
      find /prod/node_modules -type d -name "@prisma" -exec cp -r "$PRISMA_DIR" {}/../.prisma \; 2>/dev/null || true; \
    fi

# 6. 安全清理 /prod/node_modules 內的非必要檔案（僅清理 map 與 markdown 檔案，避免誤刪名為 tests/test 的 runtime API 模組）
RUN find /prod/node_modules -not -path "*/.prisma/*" -type f \( \
      -name "*.d.ts.map" -o \
      -name "*.js.map" -o \
      -name "*.md" -o \
      -name "*.markdown" -o \
      -name "CHANGELOG*" \
    \) -delete 2>/dev/null || true


# ---- Stage 2: Production Runner ----
FROM node:22-slim AS runner

# 僅安裝 runtime 必要套件並徹底清理 apt 快取
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* /tmp/* /root/.cache

WORKDIR /app

# 僅複製清理過後的 Production node_modules 與極簡 dist
COPY --from=builder /prod/node_modules ./node_modules
COPY --from=builder /prod/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
