import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as crypto from 'node:crypto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';

/**
 * 輔助函式：模擬前端 apiCrypto.ts 加密行為
 */
function encryptFrontendPayload(
  data: unknown,
  secretKey: string,
  timestamp: string,
): string {
  const key = crypto
    .createHash('sha256')
    .update(`${secretKey}:key:${timestamp}`)
    .digest();
  const iv = crypto
    .createHash('sha256')
    .update(`${secretKey}:iv:${timestamp}`)
    .digest()
    .subarray(0, 16);

  const plainText = typeof data === 'string' ? data : JSON.stringify(data);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  cipher.setAutoPadding(true);

  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);

  return encrypted.toString('base64');
}

/**
 * 輔助函式：模擬前端 apiClient.ts 解密行為
 */
function decryptFrontendPayload<T = unknown>(
  cipherText: string,
  secretKey: string,
  timestamp: string,
): T {
  const key = crypto
    .createHash('sha256')
    .update(`${secretKey}:key:${timestamp}`)
    .digest();
  const iv = crypto
    .createHash('sha256')
    .update(`${secretKey}:iv:${timestamp}`)
    .digest()
    .subarray(0, 16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(true);

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherText, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as T;
}

describe('Payload Communication Encryption & Decryption (e2e)', () => {
  let app: INestApplication;
  const secretKey = '943b9d70-1808-4463-8c80-31ff88a4a128';

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where?.email === 'user@example.com') {
          return Promise.resolve({
            id: 'u_test_1',
            email: 'user@example.com',
            username: 'testuser',
            password: 'hashedpassword',
          });
        }
        return Promise.resolve(null);
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where?.email === 'user@example.com') {
          return Promise.resolve({
            id: 'u_test_1',
            email: 'user@example.com',
            username: 'testuser',
            password: 'hashedpassword',
          });
        }
        return Promise.resolve(null);
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

  describe('Development Mode (明碼傳輸相容性)', () => {
    it('應能正常接收明文 JSON 請求 (開發環境不強制加密)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      // 開發環境下 res_body 為明文
      expect(res.body.res_body).toBeDefined();
    });
  });

  describe('Encrypted Payload 互通性 (對齊前端 crypto.md 規範)', () => {
    it('前端傳送加密請求時，後端中介軟體應透明解密並完成 DTO 驗證與業務處理', async () => {
      const timestamp = '202609031530';
      const plainPayload = { email: 'user@example.com' };
      const cipherText = encryptFrontendPayload(
        plainPayload,
        secretKey,
        timestamp,
      );

      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .set('X-Timestamp', timestamp)
        .send({ encryptedData: cipherText });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
    });

    it('若請求帶有加密資料但缺少 X-Timestamp Header 應拋出 400 Bad Request', async () => {
      const timestamp = '202609031530';
      const cipherText = encryptFrontendPayload(
        { email: 'user@example.com' },
        secretKey,
        timestamp,
      );

      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ encryptedData: cipherText });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Missing X-Timestamp header');
    });

    it('若密文遭到竄改或簽章無效應拋出 400 解密失敗錯誤', async () => {
      const timestamp = '202609031530';

      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .set('X-Timestamp', timestamp)
        .send({ encryptedData: 'corrupted_invalid_cipher_text!!!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Failed to decrypt payload');
    });

    it('若帶有 X-No-Encryption: true 應自動 Bypass 解密中介層', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .set('X-No-Encryption', 'true')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Bidirectional Response Encryption 雙向通訊解密驗證', () => {
    it('客戶端帶時間戳請求時，後端回應應注入 X-Timestamp 且前端可成功解密', async () => {
      const timestamp = '202609031530';
      const cipherText = encryptFrontendPayload(
        { email: 'user@example.com' },
        secretKey,
        timestamp,
      );

      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .set('X-Timestamp', timestamp)
        .send({ encryptedData: cipherText });

      expect(res.status).toBe(201);
      expect(res.headers['x-timestamp']).toBeDefined();

      const responseTs = res.headers['x-timestamp'] || res.body.ts;
      // 若 res_body 經過通訊加密封裝
      if (res.body.res_body && res.body.res_body.encryptedData) {
        const decryptedResponse = decryptFrontendPayload(
          res.body.res_body.encryptedData,
          secretKey,
          responseTs,
        );
        expect(decryptedResponse).toBeDefined();
      }
    });
  });
});
