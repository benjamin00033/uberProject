import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

let dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/uber_menu';
const password = process.env.DATABASE_PASSWORD;
if (password && dbUrl.includes('[YOUR-PASSWORD]')) {
  dbUrl = dbUrl.replace('[YOUR-PASSWORD]', encodeURIComponent(password));
}

const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('開始初始化權限系統種子資料...');

  // 1. 建立細項權限清單
  const permissions = [
    { code: '*', name: '超級管理員全權限', resource: 'global', action: '*' },
    { code: 'user:*', name: '使用者管理全權限', resource: 'user', action: '*' },
    { code: 'user:read', name: '檢視使用者', resource: 'user', action: 'read' },
    { code: 'user:write', name: '維護使用者', resource: 'user', action: 'write' },
    { code: 'user:delete', name: '刪除使用者', resource: 'user', action: 'delete' },
    { code: 'menu:*', name: '菜單模組全權限', resource: 'menu', action: '*' },
    { code: 'menu:read', name: '檢視菜單品項', resource: 'menu', action: 'read' },
    { code: 'menu:write', name: '編輯菜單品項', resource: 'menu', action: 'write' },
    { code: 'menu:delete', name: '刪除菜單品項', resource: 'menu', action: 'delete' },
    { code: 'dynamicForm:*', name: '動態表單全權限', resource: 'dynamicForm', action: '*' },
    { code: 'dynamicForm:read', name: '填寫動態表單', resource: 'dynamicForm', action: 'read' },
    { code: 'dynamicForm:write', name: '設計動態表單', resource: 'dynamicForm', action: 'write' },
    { code: 'dynamicForm:delete', name: '刪除動態表單', resource: 'dynamicForm', action: 'delete' },
    { code: 'broadcastVideo:*', name: '視訊電話全權限', resource: 'broadcastVideo', action: '*' },
    { code: 'broadcastVideo:join', name: '加入視訊房間', resource: 'broadcastVideo', action: 'join' },
    { code: 'broadcastVideo:manage', name: '管理通話房間', resource: 'broadcastVideo', action: 'manage' },
    { code: 'budget:*', name: '預算模組全權限', resource: 'budget', action: '*' },
    { code: 'budget:read', name: '檢視預算', resource: 'budget', action: 'read' },
    { code: 'budget:write', name: '編輯預算', resource: 'budget', action: 'write' },
    { code: 'projectScheduler:*', name: '專案排程全權限', resource: 'projectScheduler', action: '*' },
    { code: 'projectScheduler:read', name: '檢視專案排程', resource: 'projectScheduler', action: 'read' },
    { code: 'projectScheduler:write', name: '維護專案排程', resource: 'projectScheduler', action: 'write' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  // 2. 建立系統預設角色
  const roles = [
    {
      id: 'admin',
      name: '系統超級管理員',
      description: '擁有系統所有模組之最高完整存取與異動權限',
      isSystem: true,
      permissions: ['*'],
    },
    {
      id: 'manager',
      name: '營運經理',
      description: '可管理菜單、動態表單與專案時程，具備使用者檢視權限',
      isSystem: true,
      permissions: [
        'user:read',
        'menu:*',
        'dynamicForm:*',
        'broadcastVideo:join',
        'projectScheduler:*',
        'budget:*',
      ],
    },
    {
      id: 'staff',
      name: '門市店員',
      description: '可操作菜單點餐與填寫動態表單，加入視訊通話',
      isSystem: true,
      permissions: ['menu:read', 'dynamicForm:read', 'broadcastVideo:join'],
    },
    {
      id: 'viewer',
      name: '外部訪客',
      description: '僅具備首頁與公開資訊瀏覽權限',
      isSystem: true,
      permissions: [],
    },
  ];

  for (const role of roles) {
    const { permissions: permCodes, ...roleData } = role;
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: roleData,
    });

    for (const code of permCodes) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionCode: {
            roleId: role.id,
            permissionCode: code,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionCode: code,
        },
      });
    }
  }

  // 3. 建立初始管理員使用者 (密碼: admin123)
  const defaultPasswordHash = await argon2.hash('admin123');

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'user_admin',
      username: 'admin',
      name: '系統超級管理員',
      email: 'admin@ubermenu.com',
      password: defaultPasswordHash,
      status: 'ACTIVE',
      roles: {
        create: [{ roleId: 'admin' }],
      },
      permissions: {
        create: [{ permissionCode: '*' }],
      },
    },
  });

  // 店長
  await prisma.user.upsert({
    where: { username: 'manager_chen' },
    update: {},
    create: {
      id: 'user_manager',
      username: 'manager_chen',
      name: '陳店長',
      email: 'chen@ubermenu.com',
      password: defaultPasswordHash,
      status: 'ACTIVE',
      roles: {
        create: [{ roleId: 'manager' }],
      },
    },
  });

  // 店員 (額外直屬權限: menu:write)
  await prisma.user.upsert({
    where: { username: 'staff_lin' },
    update: {},
    create: {
      id: 'user_staff',
      username: 'staff_lin',
      name: '林專員',
      email: 'lin@ubermenu.com',
      password: defaultPasswordHash,
      status: 'ACTIVE',
      roles: {
        create: [{ roleId: 'staff' }],
      },
      permissions: {
        create: [{ permissionCode: 'menu:write' }],
      },
    },
  });

  // 4. 建立門市預設營業時間 (store_hours: 週一至週日 09:00 ~ 21:00)
  const defaultStoreHours = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ].map((day) => ({
    day_of_week: day,
    time_periods: [{ start_time: '09:00', end_time: '21:00' }],
  }));

  await prisma.menu.upsert({
    where: { id: 'store_hours' },
    update: {},
    create: {
      id: 'store_hours',
      title: { translations: { zh: '營業時間', en: 'Store Hours' } },
      serviceAvailability: defaultStoreHours,
      categoryIds: [],
    },
  });

  console.log('種子資料建立完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
