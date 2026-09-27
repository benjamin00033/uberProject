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

# 6. 深度清理 /prod/node_modules 內的非必要檔案（.map, .d.ts, .md, tests, docs）

# 排除 .prisma 目錄避免刪除 runtime 所需的 client 代碼

RUN find /prod/node_modules -not -path "_/.prisma/_" -type f \( \
-name "_.d.ts" -o \
-name "_.d.ts.map" -o \
-name "_.js.map" -o \
-name "_.md" -o \
-name "_.markdown" -o \
-name "_.ts" -o \
-name "CHANGELOG*" -o \
-name "README*" -o \
-name "LICENSE*" \
\) -delete 2>/dev/null || true \
&& find /prod/node_modules -not -path "_/.prisma/_" -type d \( \
-name "test" -o \
-name "tests" -o \
-name "doc" -o \
-name "docs" -o \
-name "example" -o \
-name "examples" -o \
-name ".github" \
\) -exec rm -rf {} + 2>/dev/null || true

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

<!-- =================================== -->

# ============================================================

# docker-compose.yml

# uber-menu-backend — Docker 部署設定

# 部署目標: Google VM（cloudflared 已獨立部署於 VM）

# ============================================================

# 一鍵部署: docker compose up -d --build

# ============================================================

services:
api:
build:
context: .
dockerfile: Dockerfile
image: uber-menu-api:latest
container_name: uber-menu-api
restart: unless-stopped
env_file: - .env
environment: - NODE_ENV=production - PORT=3000 - DATABASE_URL=postgresql://postgres.uhojxulpoavslbemuvwd:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres - DATABASE_PASSWORD=-&&AYa4+/Qv*i69 - NODE_ENV=production
ports: - '3000:3000'
healthcheck:
test:
[
'CMD',
'node',
'-e',
"fetch('http://localhost:3000/api/v1').then(r=>{if(!r.ok)throw 1}).catch(()=>process.exit(1))",
'curl',
'-f',
'http://localhost:3000/health',
]
interval: 30s
timeout: 5s
start_period: 15s
retries: 3
logging:
driver: json-file
options:
max-size: '10m'
max-file: '3'
