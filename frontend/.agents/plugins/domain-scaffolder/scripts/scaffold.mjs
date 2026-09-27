import fs from 'fs';
import path from 'path';

const [,, domainName, pageName] = process.argv;

if (!domainName) {
  console.error("Usage: node scaffold.mjs <domainName> [pageName]");
  process.exit(1);
}

const domainPath = path.join(process.cwd(), 'src', 'domain', domainName);

// 1. 建立標準結構
const dirs = ['components', 'composables', 'pages', 'services', 'schemas'];
for (const dir of dirs) {
  fs.mkdirSync(path.join(domainPath, dir), { recursive: true });
}

// 2. 初始化 types.ts
const typesPath = path.join(domainPath, 'types.ts');
if (!fs.existsSync(typesPath)) {
  fs.writeFileSync(typesPath, `export interface ${domainName.charAt(0).toUpperCase() + domainName.slice(1)}State {}\n`);
}

// 3. 初始化 routes.ts
const routesPath = path.join(domainPath, 'routes.ts');
if (!fs.existsSync(routesPath)) {
  fs.writeFileSync(routesPath, `import type { RouteRecordRaw } from "vue-router";\n\nconst routes: RouteRecordRaw[] = [];\n\nexport default routes;\n`);
}

// 4. 如果有指定 PageName，建立頁面
if (pageName) {
  const pagePath = path.join(domainPath, 'pages', `${pageName}.vue`);
  const stylePath = path.join(domainPath, 'pages', `${pageName}.module.scss`);
  
  if (!fs.existsSync(pagePath)) {
    // 遵守 ui-standardize 鐵則 2: 樣式分離
    fs.writeFileSync(pagePath, `<template>
  <div :class="$style.container">
    <h1>${pageName}</h1>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" module src="./${pageName}.module.scss"></style>
`);
    fs.writeFileSync(stylePath, `@use '@/assets/styles/variables.scss' as var;
@use '@/assets/styles/themes.scss' as theme;

@layer components {
  .container {
    // 記得使用 design token, e.g. padding: var.$spacing-md;
  }
}
`);
    console.log(`✅ Created page: ${pagePath}`);
    console.log(`✅ Created style: ${stylePath}`);
    
    console.log(`\n📌 [TODO] Please add the following route to ${routesPath}:\n`);
    console.log(`  {`);
    console.log(`    path: "${pageName.toLowerCase()}",`);
    console.log(`    name: "${pageName}",`);
    console.log(`    component: () => import("./pages/${pageName}.vue"),`);
    console.log(`    meta: { title: "routes.${pageName}.title" }`);
    console.log(`  }`);
  } else {
    console.log(`⚠️ Page ${pageName} already exists.`);
  }
} else {
  console.log(`✅ Created domain structure for '${domainName}'.`);
}
