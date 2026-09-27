# NestJS Testing Guidelines (Unit & E2E Testing SOP)

本文件定義 NestJS 後端系統之測試架構規範。專案測試包含 **單元測試 (Unit Tests `*.spec.ts`)** 與 **端到端整合測試 (E2E Tests `test/*.e2e-spec.ts`)**。

---

## 🧪 1. 單元測試規範 (Unit Testing `*.spec.ts`)

- **存放位置**: 與被測試檔放在同目錄 (如 `src/modules/users/services/user.service.ts` 對應 `src/modules/users/services/user.service.spec.ts`)。
- **測試目標**: 隔離外部系統 (DB, Third-party APIs)，僅驗證單一 Service / Helper / Controller 之邏輯。
- **Mocks 策略**: 使用 Jest Mocks (`jest.fn()`, `jest.spyOn()`) 與 `@nestjs/testing` 的 `Test.createTestingModule` 進行依賴替換。

### Service 單元測試標準樣本 (Standard Unit Test Template):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    // 建立 Repository Mock 物件
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY', // 或 InjectRepository 代號
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user if user exists', async () => {
      const mockUser = { id: 'usr_1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('usr_1');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'usr_1' } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('usr_999')).rejects.toThrow(NotFoundException);
    });
  });
});
```

---

## 🚀 2. 端到端整合測試規範 (E2E Testing `test/*.e2e-spec.ts`)

- **存放位置**: 統一放在根目錄 `/test/` 下。
- **測試目標**: 模擬真實 HTTP 請求，驗證控制器 (Controller)、過濾器 (Filter)、驗證管線 (Pipe) 與資料庫整合。
- **工具庫**: 使用 Supertest 與 `INestApplication`。

### E2E 測試標準樣本 (Standard E2E Test Template):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/users (POST) - should create user with valid DTO', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        email: 'e2e_user@example.com',
        password: 'Password123!',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe('e2e_user@example.com');
      });
  });

  it('/api/v1/users (POST) - should return 400 Bad Request on invalid email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        email: 'invalid-email-format',
        password: '123',
      })
      .expect(400);
  });
});
```

---

## 📋 3. 測試執行與覆蓋率要求 (Coverage Requirements)

- **單元測試執行**: `pnpm run test`
- **單元測試 Coverage**: `pnpm run test:cov` (目標覆蓋率 Service / Helper ≥ 85%)
- **E2E 測試執行**: `pnpm run test:e2e`
- **Commit 前門檻**: `pnpm run lint && pnpm run test` 必須 100% 綠燈，無任何失敗測試案例。
