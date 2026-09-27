import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// 加上空字串作為預設值，防止 undefined 報錯
const dbURL = process.env.DATABASE_URL || '';
const password = process.env.DATABASE_PASSWORD || '';

console.log('Loaded DATABASE_URL (隱藏密碼):', dbURL.replace(password, '***'));
// 注意：正式環境盡量不要 console.log 出真實密碼，這有安全疑慮
// console.log('Loaded DATABASE_PASSWORD:', password);

let encodinURL = dbURL;

// 只有當 URL 裡面真的有 '[YOUR-PASSWORD]' 且 password 有值的時候，才進行替換
if (dbURL.includes('[YOUR-PASSWORD]') && password) {
  encodinURL = dbURL.replace('[YOUR-PASSWORD]', encodeURIComponent(password));
}

console.log('encodinURL', encodinURL);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: encodinURL,
  },
});
