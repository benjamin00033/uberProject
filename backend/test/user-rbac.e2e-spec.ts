import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from './../src/common/enums';

describe('User RBAC API (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;
  let restrictedToken: string;

  const mockAdminUser = {
    id: 'u-admin-1',
    username: 'admin',
    name: '系統超級管理員',
    email: 'admin@example.com',
    password: '$argon2id$mock_hashed_pw',
    status: UserStatusEnum.ACTIVE,
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
    updatedAt: new Date('2026-08-27T15:30:00.000Z'),
    roles: [
      {
        roleId: 'admin',
        role: {
          id: 'admin',
          name: '系統超級管理員',
          permissions: [{ permissionCode: '*' }],
        },
      },
    ],
    permissions: [{ permissionCode: '*' }],
  };

  const mockStaffUser = {
    id: 'u-staff-1',
    username: 'staff_john',
    name: '門市店員',
    email: 'staff@example.com',
    password: '$argon2id$mock_hashed_pw',
    status: UserStatusEnum.ACTIVE,
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
    updatedAt: new Date('2026-08-27T15:30:00.000Z'),
    roles: [
      {
        roleId: 'staff',
        role: {
          id: 'staff',
          name: '門市店員',
          permissions: [{ permissionCode: 'menu:read' }],
        },
      },
    ],
    permissions: [{ permissionCode: 'menu:read' }],
  };

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve([mockAdminUser])),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'u-admin-1' || where.username === 'admin') {
          return Promise.resolve(mockAdminUser);
        }
        if (where.id === 'u-staff-1' || where.username === 'staff_john') {
          return Promise.resolve(mockStaffUser);
        }
        return Promise.resolve(null);
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where.OR?.some((cond: any) => cond.username === 'admin' || cond.name === 'admin')) {
          return Promise.resolve(mockAdminUser);
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          ...mockStaffUser,
          ...data,
          id: 'u-new-created',
        });
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({
          ...mockAdminUser,
          ...data,
          updatedAt: new Date(),
        });
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(mockAdminUser);
      }),
    },
    userRole: {
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    userPermission: {
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    role: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'admin',
          name: '系統超級管理員',
          description: '擁有全模組最高權限',
          isSystem: true,
          permissions: [{ permissionCode: '*' }],
        },
        {
          id: 'manager',
          name: '營運經理',
          description: '管理權限',
          isSystem: true,
          permissions: [{ permissionCode: 'user:read' }],
        },
      ]),
    },
    permission: {
      findMany: jest.fn().mockResolvedValue([
        { code: '*' },
        { code: 'user:*' },
        { code: 'user:read' },
        { code: 'user:write' },
        { code: 'user:delete' },
      ]),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => callback(mockPrisma)),
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

    jwtService = moduleFixture.get<JwtService>(JwtService);

    // 簽發管理員 Token (具備 * 權限)
    adminToken = jwtService.sign({
      sub: 'u-admin-1',
      username: 'admin',
      name: '系統超級管理員',
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: ['*'],
    });

    // 簽發受限店員 Token (僅具備 menu:read 權限)
    restrictedToken = jwtService.sign({
      sub: 'u-staff-1',
      username: 'staff_john',
      name: '門市店員',
      email: 'staff@example.com',
      roles: ['staff'],
      permissions: ['menu:read'],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication & Authorization (401 & 403 Guard Check)', () => {
    it('GET /api/users should return 401 Unauthorized when no token is provided', async () => {
      await request(app.getHttpServer()).get('/api/users').expect(401);
    });

    it('GET /api/users should return 403 Forbidden when user lacks user:read permission', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${restrictedToken}`)
        .expect(403);
    });

    it('POST /api/users should return 403 Forbidden when user lacks user:write permission', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${restrictedToken}`)
        .send({
          username: 'test_user',
          name: '測試',
          email: 'test@example.com',
          password: 'password123',
          roles: ['staff'],
        })
        .expect(403);
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users with password sanitized when authorized', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body[0].username).toBe('admin');
      // 資安重要驗證：密碼雜湊絕不可外洩
      expect(res.body.res_body[0].password).toBeUndefined();
      // 角色與有效權限正常聚合
      expect(res.body.res_body[0].roles).toContain('admin');
      expect(res.body.res_body[0].permissions).toContain('*');
    });

    it('should accept search, role, and status filter query parameters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users?search=admin&role=admin&status=ACTIVE')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return single user by id without password', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/u-admin-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.id).toBe('u-admin-1');
      expect(res.body.res_body.password).toBeUndefined();
    });

    it('should return 404 when user id does not exist', async () => {
      await request(app.getHttpServer())
        .get('/api/users/non_existing_user')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user with hashed password and return sanitized response', async () => {
      const newUserPayload = {
        username: 'alex_chen',
        name: '陳小明',
        email: 'alex@ubermenu.com',
        password: 'SecurePassword123!',
        roles: ['staff'],
        permissions: ['menu:read'],
        status: UserStatusEnum.ACTIVE,
      };

      const res = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUserPayload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.username).toBe('alex_chen');
      expect(res.body.res_body.password).toBeUndefined();
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should reject with 409 if username already exists', async () => {
      const duplicatePayload = {
        username: 'admin', // already exists
        name: '重複帳號測試',
        email: 'new_unique_email@example.com',
        password: 'SecurePassword123!',
        roles: ['staff'],
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicatePayload)
        .expect(409);
    });

    it('should reject with 400 if required fields are missing or password is too short', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'ab', // < 3 chars
          password: '123', // < 6 chars
        })
        .expect(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user info when authorized', async () => {
      const updatePayload = {
        name: '陳小明 (更名)',
        roles: ['manager', 'staff'],
      };

      const res = await request(app.getHttpServer())
        .put('/api/users/u-admin-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatePayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.password).toBeUndefined();
    });

    it('should return 404 when updating non-existent user', async () => {
      await request(app.getHttpServer())
        .put('/api/users/non_existing_user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '無法更新' })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should reject deleting self with 400 Bad Request', async () => {
      await request(app.getHttpServer())
        .delete('/api/users/u-admin-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('should reject deleting admin user with 409 Conflict', async () => {
      // 假設另一個具有 user:delete 權限的管理員嘗試刪除 admin 帳號
      const managerToken = jwtService.sign({
        sub: 'u-manager-special',
        username: 'manager_special',
        name: '特權副店長',
        email: 'manager@example.com',
        roles: ['manager'],
        permissions: ['user:delete'],
      });

      await request(app.getHttpServer())
        .delete('/api/users/u-admin-1')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(409);
    });

    it('should delete other normal user and return null res_body', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/u-staff-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body).toBeNull();
      expect(mockPrisma.user.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'u-staff-1' } }),
      );
    });

    it('should return 404 when deleting non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/api/users/non_existing_user')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('GET /api/roles', () => {
    it('should return system roles list with permissions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body[0].id).toBe('admin');
      expect(res.body.res_body[0].permissions).toEqual(['*']);
    });
  });

  describe('GET /api/permissions', () => {
    it('should return dictionary of fine-grained permission codes', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body).toContain('*');
      expect(res.body.res_body).toContain('user:read');
    });
  });
});
