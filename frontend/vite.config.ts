import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { IonicResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";

const srcDir = path.resolve(__dirname, "./src");
// const aliasPath = (p: string) => path.resolve(srcDir, p);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProd = mode === "production";
  // const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [
      Components({
        dts: "src/components.d.ts",
        resolvers: [IonicResolver()],
      }),
      vue(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
          /\.md$/, // .md
        ],
        imports: [
          // presets
          "vue",
          "vue-router",
          // custom
          {
            "@vueuse/core": [
              // named imports
              "useMouse", // import { useMouse } from '@vueuse/core',
              // alias
              ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
            ],
            axios: [
              // default imports
              ["default", "axios"], // import { default as axios } from 'axios',
            ],
            "[package-name]": [
              "[import-names]",
              // alias
              ["[from]", "[alias]"],
            ],
          },
          // example type import
          {
            from: "vue-router",
            imports: ["RouteLocationRaw"],
            type: true,
          },
        ],
      }),
      /* ==========================================
         2. 打包產物壓縮 (Gzip)
         ========================================== */
      // 僅在生產環境啟動，超過 10kb 的檔案自動 Gzip 壓縮，減輕伺服器傳輸負擔
      isProd &&
        viteCompression({
          algorithm: "gzip",
          ext: ".gz",
          threshold: 10240,
          deleteOriginFile: false, // 保留原始檔案，讓伺服器依支援度派發
        }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/variables.scss" as var;
            @use "@/assets/styles/mixins.scss" as mixin;
          `,
        },
      },
    },
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
    build: {
      target: "esnext", // 針對現代瀏覽器，採用最新的 ES 語法，打包速度更快
      minify: "esbuild", // Vite 預設，比 Terser 快 10-100 倍
      cssCodeSplit: true, // 啟用 CSS 拆分：將 CSS 拆分到獨立的 chunk 中，避免首屏加載過大
      chunkSizeWarningLimit: 1000, // 提高單一檔案大小警告閾值 (預設 500kb)
      rollupOptions: {
        // 強化 Tree Shaking (移除未使用的程式碼)
        treeshake: {
          preset: "recommended",
          propertyReadSideEffects: false, // 假設讀取物件屬性沒有副作用，能搖掉更多無用代碼
        },

        output: {
          // 多組態分包策略 (Manual Chunks)：將龐大的 vendor.js 拆解
          manualChunks(id) {
            // 如果遇到 node_modules 內的套件
            if (id.includes("node_modules")) {
              // 1. 核心框架獨立打包：較少變動，可讓瀏覽器長期快取 (Cache)
              if (
                id.includes("vue") ||
                id.includes("vue-router") ||
                id.includes("pinia")
              ) {
                return "vendor-core";
              }
              // 2. 大型依賴獨立打包 (如 Lodash, UI 庫，圖表庫 echarts)
              if (id.includes("lodash") || id.includes("element-plus")) {
                return "vendor-large";
              }
              // 3. 剩下的第三方套件歸類為 utils
              return "vendor-utils";
            }
          },
          // 靜態資源分類整理，讓 dist 目錄更乾淨
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split(".");
            let extType = info ? info[info.length - 1] : "ext";
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(
                assetInfo.name || "",
              )
            ) {
              extType = "media";
            } else if (
              /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(
                assetInfo.name || "",
              )
            ) {
              extType = "img";
            } else if (
              /\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || "")
            ) {
              extType = "fonts";
            }
            return `assets/${extType}/[name]-[hash].[ext]`;
          },
        },
      },
    },
    server: {
      forwardConsole: true,
      port: 1111,
      host: "0.0.0.0",
      proxy: {
        "/api/": {
          target: `http://localhost:3000`,
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on("proxyReq", (_proxyReq, req, _res) => {
              console.log(
                "Sending API_Response to the Target:",
                req.method,
                String(options.target) + String(req.url),
              );
            });
            proxy.on("proxyRes", (_proxyRes, req, _res) => {
              console.log(
                "Receiving API_Response from the Target:",
                req.method,
                String(options.target) + String(req.url),
              );
            });
          },
        },
      },
    },
  };
});

// 使用外部載入方式後此方法為無效
// '/ws/': {
//   target: `ws://${env.VITE_IP}`,
//   ws: true,
//   changeOrigin: true,
//   rewrite: (path) => path.replace(/^\/ws/, ''),
//   configure: (proxy, options) => {
//     proxy.on('proxyReq', (proxyReq, req, _res) => {
//       console.log(
//         'Sending WS_Response to the Target:',
//         req.method,
//         options.target + req.url
//       );
//     });
//     proxy.on('proxyRes', (proxyRes, req, res) => {
//       console.log(
//         'Receiving WS_Response from the Target:',
//         req.method,
//         options.target + req.url
//       );
//     });
//   },
// },
// },
