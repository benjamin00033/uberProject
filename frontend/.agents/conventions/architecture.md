# 專案架構（Modular Structure）

業務模組化，每個模組自帶內部結構、對外只開 barrel file。中大型專案比 Flat 或 Atomic 適合 — 業務邊界乾淨、容易長大、低耦合、團隊好分工。

> 這份用的目錄名（domains / services / stores / utils 之類）只是慣例範例。你的 framework 有自己的命名就照用，重點是「模組之間單向依賴 + 走 barrel file」這件事，不是檔名。

## 頂層目錄

```text
<project-root>/
├── components/          # 跨模組共用 UI（純展示、無業務邏輯）
│   ├── base/            # BaseButton、BaseInput 之類
│   └── layout/          # AppHeader、AppSidebar 之類
├── pages/               # 路由入口（薄薄一層，只負責 layout + 載入 domain 元件）
├── domains/             # ★ 業務模組（核心）
│   ├── <domain-a>/
│   ├── <domain-b>/
│   ├── ...
│   └── shared/          # 模組之間共用的 utils / constants / types
├── server/              # 後端 API routes / 特權操作（如果有）
│   └── api/
└── utils/               # 全域utility 函式
```

`domains/` 是核心。如果你的 framework 預設用 `modules/`，沿用即可，名字不重要。

## 單一模組內部

```text
domains/<name>/
├── components/      # 此模組專屬元件
├── hooks/           # 此模組的 reactive 整合層（composable / hook / 等等，看 framework）
├── services/        # 跟外部系統（API、DB、SDK）互動，副作用集中放這
├── stores/          # 此模組的全域狀態（如果有）
├── schemas/         # data schema（type 的單一來源）
├── utils/           # 無副作用的 helper（純計算 / 格式化）
├── constants/       # 常數
└── index.ts         # ★ 對外公開介面（barrel file）
```

各層職責：

| 資料夾        | 職責                                    | 副作用     |
| ------------- | --------------------------------------- | ---------- |
| `components/` | UI 渲染                                 | 否         |
| `hooks/`      | 組合 services + stores + reactive state | 允許       |
| `services/`   | 跟外部系統互動                          | 允許       |
| `stores/`     | 跨頁面共享狀態                          | 局部       |
| `schemas/`    | data schema                             | 否         |
| `utils/`      | helper 計算 / 格式化                    | **絕對否** |
| `constants/`  | 常數                                    | 否         |

## 模組依賴規則

1. 不跨模組 import 內部檔案 — 一律走 barrel file
   - ❌ `import { fetchSomething } from '@/domains/foo/services/foo.service'`
   - ✅ `import { useFooStore } from '@/domains/foo'`
2. 共用邏輯往下沉 — 兩個模組共用就抽到 `domains/shared/` 或全域 `utils/`，不要橫向 import
3. 方向單向 — `pages/` → `domains/*` → `domains/shared` / `utils` → 外部 SDK
4. `services/` 不 import `stores/` — 副作用層保持單純，由上層 hook 把兩者組起來
5. 元件不直接呼叫 service — 走 hook 拿資料

## 模組依賴圖

```text
                 ┌──────────────┐
                 │   pages/      │
                 └───────┬──────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   domains/A         domains/B         domains/C
        │                │                │
        └────────┬───────┴────────────────┘
                 ▼
          domains/shared
                 │
                 ▼
       外部 SDK / API
```

黃金法則：

- 箭頭只能往下，不能反向（下層不能 import 上層）
- 同層之間原則上不互相 import；確實有共通需求就抽到 `shared/`
- 跨模組例外（例如 `auth`，幾乎所有模組都會用）— 只能透過 barrel file 取，不去挖內部

## 模組「最小完成定義」

一個模組要算完成，至少要：

- [ ] `index.ts` 對外公開的 API 清單明確
- [ ] 所有 export 函式有 JSDoc + 必要時 `@example`
- [ ] 重要的 helper（`canXxx`、`shouldXxx`、`computeXxx`）有 unit test
- [ ] Service 跟 Store 不互相 import 內部 helper
- [ ] 元件透過 hook 取資料，不直接呼叫 service
- [ ] 對應的權限 / 安全規則已涵蓋
- [ ] 重要操作有 audit-log（如果有此需求）
