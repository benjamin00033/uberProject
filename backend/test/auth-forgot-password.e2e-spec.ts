import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';
import { MAIL_PROVIDER_TOKEN } from './../src/shared/mail/interfaces/mail-provider.interface';
import { MockMailProvider } from './../src/shared/mail/providers/mock-mail.provider';

describe('Auth Password Reset & Email Delivery (e2e)', () => {
  let app: INestApplication;
  let mockMailProvider: MockMailProvider;

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn().mockImplementation((cb) => {
      if (typeof cb === 'function') {
        return cb(mockPrisma);
      }
      return Promise.resolve(cb);
    }),
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where?.email === 'registered@example.com' || where?.id === 'u_reg_1') {
          return Promise.resolve({
            id: 'u_reg_1',
            email: 'registered@example.com',
            username: 'reguser',
            name: 'Registered User',
            password: 'hashedpassword',
          });
        }
        return Promise.resolve(null);
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where?.email === 'registered@example.com' || where?.id === 'u_reg_1') {
          return Promise.resolve({
            id: 'u_reg_1',
            email: 'registered@example.com',
            username: 'reguser',
            name: 'Registered User',
            password: 'hashedpassword',
          });
        }
        return Promise.resolve(null);
      }),
      create: jest.fn(),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
    },
  };

  beforeAll(async () => {
    mockMailProvider = new MockMailProvider();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(MAIL_PROVIDER_TOKEN)
      .useValue(mockMailProvider)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/forgot-password for unregistered email should return success without revealing non-existence', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/forgot-password')
      .send({ email: 'unknown@example.com' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.res_body.message).toContain('若此電子郵件已註冊');
    expect(mockMailProvider.sentMails).toHaveLength(0);
  });

  it('POST /api/auth/forgot-password for registered email should trigger MockMailProvider', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/forgot-password')
      .send({ email: 'registered@example.com' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.res_body.message).toContain('若此電子郵件已註冊');
    expect(mockMailProvider.sentMails).toHaveLength(1);
    expect(mockMailProvider.sentMails[0].to).toBe('registered@example.com');
    expect(mockMailProvider.sentMails[0].subject).toContain('重設您的帳號密碼驗證信');
  });

  it('Complete password reset flow using generated OTP code', async () => {
    const sentMail = mockMailProvider.sentMails[0];
    const match = sentMail.html.match(/<span[^>]*>(\d{6})<\/span>/);
    expect(match).not.toBeNull();
    const otpCode = match![1];

    // 1. 驗證 OTP
    const verifyRes = await request(app.getHttpServer())
      .post('/api/auth/verify-reset-code')
      .send({ email: 'registered@example.com', code: otpCode })
      .expect(201);

    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.res_body.valid).toBe(true);

    // 2. 重設密碼
    const resetRes = await request(app.getHttpServer())
      .post('/api/auth/reset-password')
      .send({
        email: 'registered@example.com',
        code: otpCode,
        newPassword: 'BrandNewPassword2026!',
      })
      .expect(201);

    expect(resetRes.body.success).toBe(true);
    expect(resetRes.body.res_body.reset).toBe(true);
  });
});
