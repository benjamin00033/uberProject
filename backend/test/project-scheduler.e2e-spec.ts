import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';

describe('Project Scheduler API (e2e)', () => {
  let app: INestApplication;

  const mockProjects: any[] = [
    {
      id: 'p1',
      name: 'A 專案 - 系統重構',
      description: '進行微服務拆分與前端模組化改版',
      startDate: new Date('2026-08-01T00:00:00.000Z'),
      endDate: new Date('2026-09-15T00:00:00.000Z'),
      progress: 65,
      createdAt: new Date('2026-08-01T08:00:00.000Z'),
      updatedAt: new Date('2026-08-20T10:30:00.000Z'),
      milestones: [
        { id: 'm-1', projectId: 'p1', title: '需求訪談', orderIndex: 0 },
        { id: 'm-2', projectId: 'p1', title: 'UI設計', orderIndex: 1 },
        { id: 'm-3', projectId: 'p1', title: '開發中', orderIndex: 2 },
      ],
      tasks: [
        { id: 't1', projectId: 'p1', status: 'in_progress' },
        { id: 't2', projectId: 'p1', status: 'todo' },
        { id: 't3', projectId: 'p1', status: 'done' },
      ],
    },
  ];

  const mockMembers: any[] = [
    {
      id: 'm1',
      name: 'Alice',
      role: '前端工程師',
      avatar: '/avatars/alice.png',
      userId: 'u1',
      createdAt: new Date('2026-08-01T08:00:00.000Z'),
      updatedAt: new Date('2026-08-20T10:30:00.000Z'),
    },
    {
      id: 'm2',
      name: 'Bob',
      role: '後端工程師',
      avatar: '/avatars/bob.png',
      userId: 'u2',
      createdAt: new Date('2026-08-01T08:00:00.000Z'),
      updatedAt: new Date('2026-08-20T10:30:00.000Z'),
    },
  ];

  const mockTasks: any[] = [
    {
      id: 't1',
      projectId: 'p1',
      name: '首頁重構',
      startDate: new Date('2026-08-15T00:00:00.000Z'),
      endDate: new Date('2026-08-20T00:00:00.000Z'),
      status: 'in_progress',
      createdAt: new Date('2026-08-15T08:00:00.000Z'),
      updatedAt: new Date('2026-08-18T10:30:00.000Z'),
      assignees: [
        { taskId: 't1', memberId: 'm1', member: mockMembers[0] },
      ],
    },
    {
      id: 't2',
      projectId: 'p1',
      name: 'Dashboard 開發',
      startDate: new Date('2026-08-18T00:00:00.000Z'),
      endDate: new Date('2026-08-25T00:00:00.000Z'),
      status: 'todo',
      createdAt: new Date('2026-08-18T08:00:00.000Z'),
      updatedAt: new Date('2026-08-18T10:30:00.000Z'),
      assignees: [
        { taskId: 't2', memberId: 'm1', member: mockMembers[0] },
      ],
    },

  ];

  const mockHolidays: any[] = [
    {
      date: '20260101',
      week: '四',
      isHoliday: true,
      description: '元旦',
    },
    {
      date: '20260216',
      week: '一',
      isHoliday: true,
      description: '農曆除夕',
    },
  ];

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
    project: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve(mockProjects)),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        const found = mockProjects.find((p) => p.id === where.id);
        return Promise.resolve(found || null);
      }),
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          ...data,
          id: data.id || 'p_created_1',
          createdAt: new Date(),
          updatedAt: new Date(),
          milestones: [],
          tasks: [],
        }),
      ),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const found = mockProjects.find((p) => p.id === where.id) || mockProjects[0];
        return Promise.resolve({
          ...found,
          ...data,
          updatedAt: new Date(),
        });
      }),
      delete: jest.fn().mockResolvedValue(mockProjects[0]),
    },
    projectMilestone: {
      createMany: jest.fn().mockResolvedValue({ count: 2 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
    },
    member: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve(mockMembers)),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        const found = mockMembers.find((m) => m.id === where.id);
        return Promise.resolve(found || null);
      }),
      count: jest.fn().mockImplementation(({ where }) => {
        if (where?.id?.in) {
          const ids = where.id.in as string[];
          const count = mockMembers.filter((m) => ids.includes(m.id)).length;
          return Promise.resolve(count);
        }
        return Promise.resolve(mockMembers.length);
      }),
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          ...data,
          id: data.id || 'm_created_1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      update: jest.fn().mockImplementation(({ where, data }) =>
        Promise.resolve({
          ...mockMembers[0],
          ...data,
          updatedAt: new Date(),
        }),
      ),
      delete: jest.fn().mockResolvedValue(mockMembers[0]),
    },
    task: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve(mockTasks)),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        const found = mockTasks.find((t) => t.id === where.id);
        return Promise.resolve(found || null);
      }),
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          ...data,
          id: data.id || 't_created_1',
          createdAt: new Date(),
          updatedAt: new Date(),
          assignees: [],
        }),
      ),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const found = mockTasks.find((t) => t.id === where.id) || mockTasks[0];
        return Promise.resolve({
          ...found,
          ...data,
          updatedAt: new Date(),
        });
      }),
      delete: jest.fn().mockResolvedValue(mockTasks[0]),
    },

    taskAssignee: {
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    holiday: {
      findMany: jest.fn().mockResolvedValue(mockHolidays),
      upsert: jest.fn().mockResolvedValue({}),
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

  describe('1. 專案管理 API (Projects API)', () => {
    it('GET /api/projects should return project list with milestones and envelope', async () => {
      const res = await request(app.getHttpServer()).get('/api/projects').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('成功');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body[0].id).toBe('p1');
      expect(res.body.res_body[0].milestones).toContain('需求訪談');
    });

    it('GET /api/projects/:id should return single project details with taskSummary', async () => {
      const res = await request(app.getHttpServer()).get('/api/projects/p1').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body.id).toBe('p1');
      expect(res.body.res_body.taskSummary).toEqual({
        total: 3,
        todo: 1,
        inProgress: 1,
        done: 1,
      });
    });

    it('POST /api/projects should create project and return 201 Created', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          name: 'C 專案 - 行動 App 開發',
          description: '跨平台 Ionic Vue 應用上架',
          startDate: '2026-09-01',
          endDate: '2026-11-30',
          progress: 0,
          milestones: ['企劃確認', '原型設計', '正式開發'],
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('專案建立成功');
      expect(res.body.res_body.name).toBe('C 專案 - 行動 App 開發');
    });

    it('POST /api/projects should reject inverted dates (startDate > endDate) with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          name: '非法日期專案',
          startDate: '2026-12-01',
          endDate: '2026-09-01', // 結束早於開始
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.res_code).toBe('400');
    });

    it('PUT /api/projects/:id should update project and return 200 OK', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/projects/p1')
        .send({
          name: 'A 專案 - 系統重構 (已修訂)',
          progress: 80,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('專案更新成功');
    });

    it('DELETE /api/projects/:id should delete project and return null body', async () => {
      const res = await request(app.getHttpServer()).delete('/api/projects/p1').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('專案已成功刪除');
      expect(res.body.res_body).toBeNull();
    });
  });

  describe('2. 團隊成員管理 API (Members API)', () => {
    it('GET /api/members should return member list', async () => {
      const res = await request(app.getHttpServer()).get('/api/members').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body).toHaveLength(2);
      expect(res.body.res_body[0].name).toBe('Alice');
    });

    it('POST /api/members should create new member and return 201 Created', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          name: 'Eve',
          role: 'DevOps 工程師',
          avatar: '/avatars/eve.png',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('成員建立成功');
      expect(res.body.res_body.name).toBe('Eve');
    });
  });

  describe('3. 排程任務管理 API (Tasks API)', () => {
    it('GET /api/tasks should return task list with assignees', async () => {
      const res = await request(app.getHttpServer()).get('/api/tasks').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body[0].id).toBe('t1');
      expect(res.body.res_body[0].assignees).toEqual(['m1']);
    });

    it('POST /api/tasks should create task with assignees atomically (201 Created)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          projectId: 'p1',
          name: '資料庫分表優化',
          assignees: ['m1', 'm2'],
          startDate: '2026-08-22',
          endDate: '2026-08-28',
          status: 'todo',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('任務建立成功');
      expect(res.body.res_body.name).toBe('資料庫分表優化');
    });

    it('POST /api/tasks should reject invalid date range with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          projectId: 'p1',
          name: '時程倒置任務',
          assignees: ['m1'],
          startDate: '2026-08-28',
          endDate: '2026-08-22',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.res_code).toBe('400');
    });

    it('PATCH /api/tasks/:id/dates should update schedule dates', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/tasks/t1/dates')
        .send({
          startDate: '2026-08-25',
          endDate: '2026-08-31',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('任務時程更新成功');
      expect(res.body.res_body.startDate).toBe('2026-08-25');
      expect(res.body.res_body.endDate).toBe('2026-08-31');
    });

    it('PATCH /api/tasks/:id/status should update task status', async () => {

      const res = await request(app.getHttpServer())
        .patch('/api/tasks/t1/status')
        .send({
          status: 'done',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('狀態更新成功');
      expect(res.body.res_body.status).toBe('done');
    });

    it('DELETE /api/tasks/:id should delete task and return null body', async () => {
      const res = await request(app.getHttpServer()).delete('/api/tasks/t1').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.message).toBe('任務已成功刪除');
      expect(res.body.res_body).toBeNull();
    });
  });

  describe('4. 衝突檢測與國定假日 API (Conflicts & Calendar API)', () => {
    it('GET /api/project-scheduler/conflicts should detect double-booked overlapping tasks', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/project-scheduler/conflicts?memberId=m1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body.length).toBeGreaterThanOrEqual(1);
      expect(res.body.res_body[0].memberId).toBe('m1');
      expect(res.body.res_body[0].memberName).toBe('Alice');
      expect(res.body.res_body[0].overlappingTasks).toHaveLength(2);
    });

    it('GET /api/calendar/holidays?year=2026 should return holiday list for requested year', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/calendar/holidays?year=2026')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body[0].date).toBe('20260101');
      expect(res.body.res_body[0].isHoliday).toBe(true);
    });
  });
});
