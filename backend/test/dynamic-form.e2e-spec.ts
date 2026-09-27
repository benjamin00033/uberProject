import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';
import { FormStatusEnum } from './../src/common/enums';

describe('DynamicForm API (e2e)', () => {
  let app: INestApplication;

  const mockFormInDb = {
    formId: 'registration',
    title: { zh: '會員註冊表單', en: 'Member Registration Form' },
    totalSteps: 2,
    steps: [
      {
        stepId: 'step-1',
        stepTitle: { zh: '基本資訊', en: 'Basic Info' },
        fields: [
          {
            id: 'username',
            label: { zh: '使用者名稱', en: 'Username' },
            type: 'text',
            defaultValue: '',
          },
        ],
      },
      {
        stepId: 'step-2',
        stepTitle: { zh: '聯絡方式', en: 'Contact' },
        fields: [
          {
            id: 'email',
            label: { zh: '電子信箱', en: 'Email' },
            type: 'text',
            defaultValue: '',
          },
        ],
      },
    ],
    status: FormStatusEnum.PUBLISHED,
    createdAt: new Date('2026-08-27T10:00:00.000Z'),
    updatedAt: new Date('2026-08-27T10:00:00.000Z'),
  };

  const mockSubmissionInDb = {
    id: 'b18a1a3e-4fa0-4d56-b088-7f99a5e8f411',
    formId: 'registration',
    data: { username: 'benjamin', email: 'ben@example.com' },
    submittedBy: 'client-ip',
    createdAt: new Date('2026-08-27T11:00:00.000Z'),
  };

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    dynamicForm: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve([mockFormInDb])),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.formId === 'registration') {
          return Promise.resolve(mockFormInDb);
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        return Promise.resolve({
          ...mockFormInDb,
          ...data,
          updatedAt: new Date(),
        });
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(mockFormInDb);
      }),
    },
    formSubmission: {
      create: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          id: 'sub-new-uuid',
          ...data,
          createdAt: new Date(),
        });
      }),
      findMany: jest.fn().mockImplementation(({ where }) => {
        if (where.formId === 'registration') {
          return Promise.resolve([mockSubmissionInDb]);
        }
        return Promise.resolve([]);
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/dynamic-forms', () => {
    it('should return list of forms wrapped in ApiResponse', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dynamic-forms')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body).toHaveLength(1);
      expect(res.body.res_body[0].formId).toBe('registration');
    });

    it('should support search and status query parameters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dynamic-forms?status=PUBLISHED&search=reg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockPrisma.dynamicForm.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/dynamic-forms/:id', () => {
    it('should return form schema when form exists', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dynamic-forms/registration')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.formId).toBe('registration');
      expect(res.body.res_body.totalSteps).toBe(2);
    });

    it('should return 404 when form does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dynamic-forms/non_existing_form')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.res_body).toBeNull();
    });
  });

  describe('POST /api/dynamic-forms', () => {
    it('should create new form schema when payload is valid', async () => {
      const payload = {
        formId: 'survey_customer',
        title: '滿意度調查',
        totalSteps: 1,
        steps: [
          {
            stepId: 'step_1',
            stepTitle: '評分',
            fields: [
              {
                id: 'rating',
                label: '分數',
                type: 'number',
                defaultValue: 5,
              },
            ],
          },
        ],
        status: FormStatusEnum.PUBLISHED,
      };

      const res = await request(app.getHttpServer())
        .post('/api/dynamic-forms')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.formId).toBe('survey_customer');
      expect(mockPrisma.dynamicForm.create).toHaveBeenCalled();
    });

    it('should reject with 409 if formId already exists', async () => {
      const duplicatePayload = {
        formId: 'registration',
        title: '重複註冊表單',
        steps: [
          {
            stepId: 'step_1',
            stepTitle: '基本',
            fields: [{ id: 'name', label: '姓名', type: 'text' }],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post('/api/dynamic-forms')
        .send(duplicatePayload)
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('should reject with 400 if duplicate field IDs exist across steps', async () => {
      const invalidPayload = {
        formId: 'survey_dup_fields',
        title: '欄位重複表單',
        steps: [
          {
            stepId: 'step_1',
            stepTitle: 'Step 1',
            fields: [{ id: 'dup_key', label: '欄位A', type: 'text' }],
          },
          {
            stepId: 'step_2',
            stepTitle: 'Step 2',
            fields: [{ id: 'dup_key', label: '欄位B', type: 'text' }],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post('/api/dynamic-forms')
        .send(invalidPayload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject with 400 if required fields are missing', async () => {
      const invalidPayload = {
        // missing formId, title, steps
      };

      const res = await request(app.getHttpServer())
        .post('/api/dynamic-forms')
        .send(invalidPayload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/dynamic-forms/:id', () => {
    it('should update form schema when form exists', async () => {
      const updatePayload = {
        title: '更新後的註冊表單',
      };

      const res = await request(app.getHttpServer())
        .put('/api/dynamic-forms/registration')
        .send(updatePayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockPrisma.dynamicForm.update).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent form', async () => {
      await request(app.getHttpServer())
        .put('/api/dynamic-forms/non_existing_form')
        .send({ title: '不會成功的更新' })
        .expect(404);
    });
  });

  describe('POST /api/dynamic-forms/:id/submissions', () => {
    it('should submit form data successfully and return submissionId', async () => {
      const submissionPayload = {
        data: {
          username: 'benjamin_wen',
          role: 'admin',
          skills: ['vue', 'ionic'],
        },
        submittedBy: 'user-001',
      };

      const res = await request(app.getHttpServer())
        .post('/api/dynamic-forms/registration/submissions')
        .send(submissionPayload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body).toHaveProperty('submissionId');
      expect(res.body.res_body.formId).toBe('registration');
      expect(mockPrisma.formSubmission.create).toHaveBeenCalled();
    });

    it('should return 400 when submission data is empty or missing', async () => {
      await request(app.getHttpServer())
        .post('/api/dynamic-forms/registration/submissions')
        .send({})
        .expect(400);
    });

    it('should return 404 when submitting to non-existent form', async () => {
      await request(app.getHttpServer())
        .post('/api/dynamic-forms/non_existing_form/submissions')
        .send({ data: { test: true } })
        .expect(404);
    });
  });

  describe('GET /api/dynamic-forms/:id/submissions', () => {
    it('should return submissions list for existing form', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dynamic-forms/registration/submissions')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body).toHaveLength(1);
      expect(res.body.res_body[0].formId).toBe('registration');
    });

    it('should return 404 when querying submissions of non-existent form', async () => {
      await request(app.getHttpServer())
        .get('/api/dynamic-forms/non_existing_form/submissions')
        .expect(404);
    });
  });

  describe('DELETE /api/dynamic-forms/:id', () => {
    it('should delete form and return null res_body', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/dynamic-forms/registration')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body).toBeNull();
      expect(mockPrisma.dynamicForm.delete).toHaveBeenCalledWith({
        where: { formId: 'registration' },
      });
    });

    it('should return 404 when deleting non-existent form', async () => {
      await request(app.getHttpServer())
        .delete('/api/dynamic-forms/non_existing_form')
        .expect(404);
    });
  });

  describe('GET /api/form/schema (Legacy Compatibility)', () => {
    it('should return default schema for backward compatibility', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/form/schema')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.formId).toBe('registration');
    });
  });
});
