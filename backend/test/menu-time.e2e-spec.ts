import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';

describe('MenuTime & Store Hours Schedule (e2e)', () => {
  let app: INestApplication;

  const mockDbMenus = new Map<string, any>();
  const mockCategories = [
    {
      id: 'cat_beverage',
      title: { translations: { zh: '飲品類', en: 'Beverages' } },
      entities: [{ id: 'item_black_tea', type: 'ITEM' }],
    },
    {
      id: 'cat_dessert',
      title: { translations: { zh: '甜點類', en: 'Desserts' } },
      entities: [{ id: 'item_cake', type: 'ITEM' }],
    },
  ];

  const mockItems = [
    {
      id: 'item_black_tea',
      title: { translations: { zh: '阿薩姆紅茶', en: 'Black Tea' } },
    },
    {
      id: 'item_cake',
      title: { translations: { zh: '提拉米蘇', en: 'Tiramisu' } },
    },
  ];

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    menu: {
      findMany: jest.fn().mockImplementation(() => {
        return Promise.resolve(Array.from(mockDbMenus.values()));
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(mockDbMenus.get(where.id) || null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const record = { ...data, createdAt: new Date(), updatedAt: new Date() };
        mockDbMenus.set(data.id, record);
        return Promise.resolve(record);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const existing = mockDbMenus.get(where.id) || {};
        const updated = { ...existing, ...data, updatedAt: new Date() };
        mockDbMenus.set(where.id, updated);
        return Promise.resolve(updated);
      }),
      upsert: jest.fn().mockImplementation(({ where, create, update }) => {
        const existing = mockDbMenus.get(where.id);
        const record = existing
          ? { ...existing, ...update, updatedAt: new Date() }
          : { ...create, createdAt: new Date(), updatedAt: new Date() };
        mockDbMenus.set(where.id, record);
        return Promise.resolve(record);
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        mockDbMenus.delete(where.id);
        return Promise.resolve();
      }),
    },
    category: {
      findMany: jest.fn().mockImplementation(({ where } = {}) => {
        if (where?.id?.in) {
          const inList = where.id.in as string[];
          return Promise.resolve(
            mockCategories.filter((c) => inList.includes(c.id)),
          );
        }
        return Promise.resolve(mockCategories);
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(
          mockCategories.find((c) => c.id === where.id) || null,
        );
      }),
    },
    item: {
      findMany: jest.fn().mockResolvedValue(mockItems),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(
          mockItems.find((i) => i.id === where.id) || null,
        );
      }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. 門市預設營業時間自動初始化 (Auto-seeding store_hours)', () => {
    it('初次存取 GET /menus/store_hours 應自動初始化並回傳週一至週日預設 09:00~21:00', async () => {
      const res = await request(app.getHttpServer()).get('/menus/store_hours');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body.id).toBe('store_hours');

      const availabilities = res.body.res_body.service_availability;
      expect(availabilities).toHaveLength(7);
      expect(availabilities[0].day_of_week).toBe('MONDAY');
      expect(availabilities[0].time_periods[0]).toEqual({
        start_time: '09:00',
        end_time: '21:00',
      });
    });
  });

  describe('2. 時段衝突與重疊校驗演算法 (Overlap Prevention)', () => {
    it('若傳送同一天內重疊的時段，應阻擋並回傳 400 Bad Request 與衝突資訊', async () => {
      const res = await request(app.getHttpServer())
        .put('/menus/store_hours')
        .send({
          title: {
            translations: { zh: '營業時間', en: 'Store Hours' },
          },
          category_ids: [],
          service_availability: [
            {
              day_of_week: 'MONDAY',
              time_periods: [
                { start_time: '09:00', end_time: '15:00' },
                { start_time: '12:00', end_time: '18:00' }, // 12:00 < 15:00 衝突！
              ],
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.res_code).toBe('4002');
      expect(res.body.message).toContain('時段設定重疊');
    });

    it('若開始時間大於等於結束時間，應阻擋並回傳 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .put('/menus/store_hours')
        .send({
          service_availability: [
            {
              day_of_week: 'MONDAY',
              time_periods: [{ start_time: '18:00', end_time: '09:00' }],
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.res_code).toBe('4001');
      expect(res.body.message).toContain('必須早於結束時間');
    });
  });

  describe('3. 分類外鍵實體勾稽約束 (Category Constraint)', () => {
    it('若提供不存在之 category_ids 應阻擋並回傳 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .put('/menus/store_hours')
        .send({
          category_ids: ['cat_fake_invalid_id'],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.res_code).toBe('4003');
      expect(res.body.message).toContain('指定的分類 ID 不存在');
    });

    it('合法分類與合法多時段更新應成功 (含週三公休空陣列)', async () => {
      const res = await request(app.getHttpServer())
        .put('/menus/store_hours')
        .send({
          title: {
            translations: { zh: '常規營業時間', en: 'Standard Hours' },
          },
          category_ids: ['cat_beverage', 'cat_dessert'],
          service_availability: [
            {
              day_of_week: 'MONDAY',
              time_periods: [
                { start_time: '09:00', end_time: '14:00' },
                { start_time: '17:00', end_time: '21:30' },
              ],
            },
            {
              day_of_week: 'WEDNESDAY',
              time_periods: [], // 週三公休
            },
            {
              day_of_week: 'THURSDAY',
              time_periods: [{ start_time: '09:00', end_time: '21:30' }],
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.res_body.category_ids).toEqual([
        'cat_beverage',
        'cat_dessert',
      ]);
    });
  });

  describe('4. 即時營業狀態查詢 API (GET /menus/:id/status)', () => {
    it('在營業時間內 (如週四 14:00)，應回傳 is_open: true 且下次事件為 CLOSE', async () => {
      // 2026-09-03 is a Thursday. 14:00 Taipei is within 09:00~21:30
      const res = await request(app.getHttpServer()).get(
        '/menus/store_hours/status?datetime=2026-09-03T14:00:00%2B08:00',
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.res_body.is_open).toBe(true);
      expect(res.body.res_body.current_day).toBe('THURSDAY');
      expect(res.body.res_body.active_period).toEqual({
        start_time: '09:00',
        end_time: '21:30',
      });
      expect(res.body.res_body.next_change).toEqual({
        event: 'CLOSE',
        time: '21:30',
      });
    });

    it('在非營業時間 (如週四凌晨 03:00)，應回傳 is_open: false 且下次事件為 OPEN', async () => {
      const res = await request(app.getHttpServer()).get(
        '/menus/store_hours/status?datetime=2026-09-03T03:00:00%2B08:00',
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.res_body.is_open).toBe(false);
      expect(res.body.res_body.active_period).toBeNull();
      expect(res.body.res_body.next_change).toEqual({
        event: 'OPEN',
        time: '09:00',
      });
    });

    it('傳送無效時間格式應回傳 400 Bad Request', async () => {
      const res = await request(app.getHttpServer()).get(
        '/menus/store_hours/status?datetime=not-a-valid-date',
      );

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('5. 商品營業時段實質勾稽 (GET /menus/items/:itemId/availability)', () => {
    it('商品在所屬菜單供應時段內應回傳 is_available: true', async () => {
      const res = await request(app.getHttpServer()).get(
        '/menus/items/item_black_tea/availability?datetime=2026-09-03T14:00:00%2B08:00',
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.res_body.is_available).toBe(true);
      expect(res.body.res_body.item_id).toBe('item_black_tea');
    });

    it('查無此商品應回傳 404 Not Found', async () => {
      const res = await request(app.getHttpServer()).get(
        '/menus/items/item_non_existent/availability',
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
