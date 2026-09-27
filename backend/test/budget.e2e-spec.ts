import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';

describe('Budget API (e2e)', () => {
  let app: INestApplication;

  const mockBudgets = new Map<string, any>([
    [
      'b_marketing',
      {
        id: 'b_marketing',
        title: '行銷廣告預算',
        amount: 50000,
        usedAmount: 12500,
        category: 'Marketing',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        isActive: true,
        createdAt: new Date('2026-07-01T08:00:00.000Z'),
        updatedAt: new Date('2026-07-15T10:30:00.000Z'),
      },
    ],
    [
      'b_it',
      {
        id: 'b_it',
        title: 'IT 基礎建設',
        amount: 100000,
        usedAmount: 0,
        category: 'IT',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        isActive: true,
        createdAt: new Date('2026-01-01T08:00:00.000Z'),
        updatedAt: new Date('2026-01-01T08:00:00.000Z'),
      },
    ],
  ]);

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    budget: {
      findMany: jest.fn().mockImplementation(() => {
        return Promise.resolve(Array.from(mockBudgets.values()));
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(mockBudgets.get(where.id) || null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const record = {
          ...data,
          id: data.id || `b_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockBudgets.set(record.id, record);
        return Promise.resolve(record);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const existing = mockBudgets.get(where.id);
        if (!existing) {
          return Promise.resolve(null);
        }
        const cleanData: any = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined) {
            cleanData[key] = value;
          }
        }
        const updated = {
          ...existing,
          ...cleanData,
          updatedAt: new Date(),
        };
        mockBudgets.set(where.id, updated);
        return Promise.resolve(updated);
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        const existing = mockBudgets.get(where.id);
        mockBudgets.delete(where.id);
        return Promise.resolve(existing);
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
    app.setGlobalPrefix('api');
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

  describe('1. 預算查詢端點 (GET /api/budgets & GET /api/budgets/:id)', () => {
    it('GET /api/budgets 應回傳所有預算清單，且每筆包含 usedAmount 與 ApiResponse 統一封裝', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/budgets')
        .set('X-No-Encryption', 'true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('成功');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body.length).toBeGreaterThanOrEqual(2);

      const marketing = res.body.res_body.find(
        (b: any) => b.id === 'b_marketing',
      );
      expect(marketing).toBeDefined();
      expect(marketing.usedAmount).toBe(12500);
      expect(marketing.amount).toBe(50000);
    });

    it('GET /api/budgets/:id 應成功回傳單一預算明細並包含 usedAmount', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/budgets/b_marketing')
        .set('X-No-Encryption', 'true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body.id).toBe('b_marketing');
      expect(res.body.res_body.usedAmount).toBe(12500);
    });

    it('GET /api/budgets/:id 查詢不存在之預算應拋出 404', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/budgets/non_existent_id')
        .set('X-No-Encryption', 'true')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Budget not found');
    });
  });

  describe('2. 預算建立端點 (POST /api/budgets)', () => {
    it('POST /api/budgets 提供 usedAmount 應成功建立預算並持久化 usedAmount', async () => {
      const payload = {
        title: '雲端運算升級計畫',
        amount: 80000,
        usedAmount: 15000,
        category: 'IT',
        startDate: '2026-09-01',
        endDate: '2026-12-31',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body.title).toBe('雲端運算升級計畫');
      expect(res.body.res_body.amount).toBe(80000);
      expect(res.body.res_body.usedAmount).toBe(15000);
      expect(res.body.res_body.id).toBeDefined();
    });

    it('POST /api/budgets 省略 usedAmount 應成功建立且自動預設為 0', async () => {
      const payload = {
        title: '人資訓練預算',
        amount: 20000,
        category: 'HR',
        startDate: '2026-10-01',
        endDate: '2026-12-31',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.title).toBe('人資訓練預算');
      expect(res.body.res_body.usedAmount).toBe(0);
    });

    it('POST /api/budgets 提供負數 usedAmount 應觸發 400 Validation Error', async () => {
      const payload = {
        title: '非法預算',
        amount: 20000,
        usedAmount: -500,
        category: 'HR',
        startDate: '2026-10-01',
        endDate: '2026-12-31',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('POST /api/budgets 提供負數 amount 應觸發 400 Validation Error', async () => {
      const payload = {
        title: '非法總額預算',
        amount: -1000,
        usedAmount: 0,
        category: 'HR',
        startDate: '2026-10-01',
        endDate: '2026-12-31',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('POST /api/budgets 開始日期大於結束日期 (startDate > endDate) 應觸發 400 Bad Request', async () => {
      const payload = {
        title: '倒退時空預算',
        amount: 10000,
        usedAmount: 0,
        category: 'R&D',
        startDate: '2026-12-31',
        endDate: '2026-01-01',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain(
        'startDate cannot be later than endDate',
      );
    });

    it('POST /api/budgets 允許超支 (usedAmount > amount) 正常建立', async () => {
      const payload = {
        title: '超支預算專案',
        amount: 5000,
        usedAmount: 6200,
        category: 'Event',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        isActive: true,
      };

      const res = await request(app.getHttpServer())
        .post('/api/budgets')
        .set('X-No-Encryption', 'true')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.usedAmount).toBe(6200);
      expect(res.body.res_body.amount).toBe(5000);
    });
  });

  describe('3. 預算更新端點 (PUT /api/budgets/:id)', () => {
    it('PUT /api/budgets/:id 應成功更新 usedAmount', async () => {
      const updatePayload = {
        usedAmount: 32000,
      };

      const res = await request(app.getHttpServer())
        .put('/api/budgets/b_marketing')
        .set('X-No-Encryption', 'true')
        .send(updatePayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body.usedAmount).toBe(32000);
    });

    it('PUT /api/budgets/:id 提供負數 usedAmount 應觸發 400 Validation Error', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/budgets/b_marketing')
        .set('X-No-Encryption', 'true')
        .send({ usedAmount: -100 })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('PUT /api/budgets/:id 更新日期導致 startDate > endDate 應阻擋 400', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/budgets/b_marketing')
        .set('X-No-Encryption', 'true')
        .send({ startDate: '2027-01-01' }) // 原結束日為 2026-12-31
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain(
        'startDate cannot be later than endDate',
      );
    });
  });

  describe('4. 預算刪除端點 (DELETE /api/budgets/:id)', () => {
    it('DELETE /api/budgets/:id 應成功刪除預算並回傳 res_body 為 null', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/budgets/b_it')
        .set('X-No-Encryption', 'true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body).toBeNull();

      // 再次查詢應得 404
      await request(app.getHttpServer())
        .get('/api/budgets/b_it')
        .set('X-No-Encryption', 'true')
        .expect(404);
    });
  });
});
