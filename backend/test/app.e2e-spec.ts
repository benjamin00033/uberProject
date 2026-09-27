import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';
import { MAIL_PROVIDER_TOKEN } from './../src/shared/mail/interfaces/mail-provider.interface';
import { MockMailProvider } from './../src/shared/mail/providers/mock-mail.provider';

describe('uberMenu Backend API (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn().mockImplementation((cb) => {
      if (typeof cb === 'function') {
        return cb(mockPrisma);
      }
      return Promise.resolve(cb);
    }),
    menu: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'store_hours',
          title: { translations: { en: 'Store Hours', zh: '營業時間' } },
          categoryIds: [],
          serviceAvailability: [],
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'store_hours',
        title: { translations: { en: 'Store Hours', zh: '營業時間' } },
        categoryIds: [],
        serviceAvailability: [],
      }),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...data })),
      update: jest.fn().mockImplementation(({ data, where }) => Promise.resolve({ id: where.id, ...data })),
      delete: jest.fn().mockResolvedValue({ id: 'store_hours' }),
    },
    item: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    modifierGroup: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    budget: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'budget_1',
          title: 'Marketing Campaign',
          amount: 5000,
          category: 'Marketing',
          startDate: '2026-07-01',
          endDate: '2026-12-31',
          isActive: true,
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'budget_1',
        title: 'Marketing Campaign',
        amount: 5000,
        category: 'Marketing',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        isActive: true,
      }),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...data })),
      update: jest.fn().mockImplementation(({ data, where }) => Promise.resolve({ id: where.id, ...data })),
      delete: jest.fn().mockResolvedValue({ id: 'budget_1' }),
    },
    dynamicForm: {
      findMany: jest.fn().mockResolvedValue([
        {
          formId: 'registration',
          title: { zh: '註冊表單', en: 'Registration Form' },
          totalSteps: 2,
          steps: [],
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        formId: 'registration',
        title: { zh: '註冊表單', en: 'Registration Form' },
        totalSteps: 2,
        steps: [],
      }),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve({
          id: 'u1',
          username: 'user',
          name: 'User',
          email: 'user@example.com',
          password: 'hashedpassword',
        });
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve({
          id: 'u1',
          username: 'user',
          name: 'User',
          email: 'user@example.com',
          password: 'hashedpassword',
        });
      }),
      create: jest.fn(),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where?.id || 'u1', ...data })),
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/menus should return standardized ApiResponse', async () => {
    const res = await request(app.getHttpServer()).get('/api/menus').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.res_code).toBe('111');
    expect(res.body.message).toBe('成功');
    expect(res.body.ts).toMatch(/^\d{12}$/);
    expect(Array.isArray(res.body.res_body)).toBe(true);
  });

  it('GET /api/budgets should return standard format', async () => {
    const res = await request(app.getHttpServer()).get('/api/budgets').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.res_code).toBe('111');
    expect(res.body.res_body).toHaveLength(1);
    expect(res.body.res_body[0].title).toBe('Marketing Campaign');
  });

  it('GET /api/form/schema should return default dynamic form schema', async () => {
    const res = await request(app.getHttpServer()).get('/api/form/schema').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.res_code).toBe('111');
    expect(res.body.res_body.formId).toBe('registration');
  });

  it('GET /api/menu?scenario=apiError should return 401 with standard error envelope', async () => {
    const res = await request(app.getHttpServer()).get('/api/menu?scenario=apiError').expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.res_code).toBe('401');
    expect(res.body.message).toBe('Unauthorized');
    expect(res.body.res_body).toBeNull();
  });

  it('POST /api/auth/forgot-password, verify-reset-code, and reset-password flow', async () => {
    // 1. forgot-password
    const forgotRes = await request(app.getHttpServer())
      .post('/api/auth/forgot-password')
      .send({ email: 'user@example.com' })
      .expect(201);

    expect(forgotRes.body.success).toBe(true);
    expect(forgotRes.body.res_code).toBe('111');
    expect(forgotRes.body.res_body.expireSeconds).toBe(600);
    expect(forgotRes.body.res_body.message).toContain('若此電子郵件已註冊');

    // 取得 app 的 MockMailProvider 所發送之驗證碼
    const mailProvider = app.get(MAIL_PROVIDER_TOKEN) as MockMailProvider;
    const sentMail = mailProvider.sentMails.find((m) => m.to === 'user@example.com');
    expect(sentMail).toBeDefined();
    const match = sentMail!.html.match(/<span[^>]*>(\d{6})<\/span>/);
    expect(match).not.toBeNull();
    const code = match![1];

    // 2. verify-reset-code
    const verifyRes = await request(app.getHttpServer())
      .post('/api/auth/verify-reset-code')
      .send({ email: 'user@example.com', code })
      .expect(201);

    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.res_code).toBe('111');
    expect(verifyRes.body.res_body.valid).toBe(true);

    // 3. reset-password
    const resetRes = await request(app.getHttpServer())
      .post('/api/auth/reset-password')
      .send({ email: 'user@example.com', code, newPassword: 'newPassword123' })
      .expect(201);

    expect(resetRes.body.success).toBe(true);
    expect(resetRes.body.res_code).toBe('111');
    expect(resetRes.body.res_body.reset).toBe(true);
    expect(resetRes.body.res_body.message).toContain('密碼重設成功');
  });
});
