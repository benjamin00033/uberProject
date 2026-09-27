import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma/prisma.service';
import { MenuItemStatusEnum } from './../src/common/enums';

describe('MenuItem API (e2e)', () => {
  let app: INestApplication;

  const mockItemInDb = {
    id: 'item_black_tea',
    externalData: 'SKU-001',
    title: { translations: { zh: '經典紅茶', en: 'Classic Black Tea' } },
    description: { translations: { zh: '嚴選錫蘭紅茶', en: 'Ceylon Black Tea' } },
    imageUrl: 'https://cdn.example.com/tea.jpg',
    priceInfo: { price: 3000, overrides: [] },
    quantityInfo: { quantity: { max_permitted: 10 }, overrides: [] },
    modifierGroupIds: { ids: ['sugars', 'ices'] },
    taxInfo: { tax_rate: 5 },
    nutritionalInfo: { allergens: null },
    dishInfo: { classifications: { can_serve_alone: true } },
    taxLabelInfo: { default_value: { labels: ['TEMP_HEATED'], source: 'INTERNAL' } },
    productInfo: {},
    bundledItems: {},
    status: MenuItemStatusEnum.ACTIVE,
    createdAt: new Date('2026-08-27T10:00:00.000Z'),
    updatedAt: new Date('2026-08-27T10:00:00.000Z'),
  };

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    item: {
      findMany: jest.fn().mockImplementation(({ skip, take }) => {
        return Promise.resolve([mockItemInDb]);
      }),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'item_black_tea') {
          return Promise.resolve(mockItemInDb);
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
          ...mockItemInDb,
          ...data,
          updatedAt: new Date(),
        });
      }),
    },
    category: {
      findUnique: jest.fn().mockResolvedValue(null),
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

  describe('GET /api/menu-items (Pagination & Filtering)', () => {
    it('should return PaginatedResponse with items and total', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/menu-items?page=1&pageSize=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_code).toBe('111');
      expect(res.body.res_body).toHaveProperty('items');
      expect(res.body.res_body).toHaveProperty('total');
      expect(res.body.res_body.page).toBe(1);
      expect(res.body.res_body.pageSize).toBe(10);
      expect(res.body.res_body.totalPages).toBe(1);
      expect(res.body.res_body.items).toHaveLength(1);
      expect(res.body.res_body.items[0].id).toBe('item_black_tea');
    });

    it('should return raw items array when all=true', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/menu-items?all=true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.res_body)).toBe(true);
      expect(res.body.res_body).toHaveLength(1);
      expect(res.body.res_body[0].id).toBe('item_black_tea');
    });
  });

  describe('GET /api/menu-items/:id', () => {
    it('should return single item when item exists', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/menu-items/item_black_tea')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.id).toBe('item_black_tea');
      expect(res.body.res_body.price_info.price).toBe(3000);
    });

    it('should return 404 when item does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/menu-items/non_existent_item')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.res_body).toBeNull();
    });
  });

  describe('POST /api/menu-items', () => {
    it('should create a new item when payload is valid', async () => {
      const payload = {
        id: 'item_green_tea',
        external_data: 'SKU-002',
        title: { translations: { zh: '特級綠茶', en: 'Premium Green Tea' } },
        description: { translations: { zh: '清新回甘', en: 'Fresh and light' } },
        image_url: 'https://cdn.example.com/green.jpg',
        price_info: { price: 3500 },
        quantity_info: { quantity: { max_permitted: 5 } },
        modifier_group_ids: { ids: ['sugars'] },
        status: MenuItemStatusEnum.ACTIVE,
      };

      const res = await request(app.getHttpServer())
        .post('/api/menu-items')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.id).toBe('item_green_tea');
      expect(mockPrisma.item.create).toHaveBeenCalled();
    });

    it('should reject with 400 when required fields are missing', async () => {
      const invalidPayload = {
        id: 'item_invalid',
        // missing title and price_info
      };

      const res = await request(app.getHttpServer())
        .post('/api/menu-items')
        .send(invalidPayload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 409 when id already exists', async () => {
      const duplicatePayload = {
        id: 'item_black_tea', // already exists
        title: { translations: { zh: '重複紅茶' } },
        description: { translations: { zh: '重複說明' } },
        price_info: { price: 3000 },
      };

      const res = await request(app.getHttpServer())
        .post('/api/menu-items')
        .send(duplicatePayload)
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/menu-items/:id', () => {
    it('should update item when payload is valid', async () => {
      const updatePayload = {
        price_info: { price: 4500 },
      };

      const res = await request(app.getHttpServer())
        .put('/api/menu-items/item_black_tea')
        .send(updatePayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockPrisma.item.update).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/menu-items/:id/status', () => {
    it('should update status to INACTIVE', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/menu-items/item_black_tea/status')
        .send({ status: MenuItemStatusEnum.INACTIVE })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockPrisma.item.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item_black_tea' },
          data: { status: MenuItemStatusEnum.INACTIVE },
        }),
      );
    });

    it('should reject invalid status with 400', async () => {
      await request(app.getHttpServer())
        .patch('/api/menu-items/item_black_tea/status')
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });
  });

  describe('PUT /api/menu-items/:id/modifier-groups', () => {
    it('should update modifier groups and return updated id list', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/menu-items/item_black_tea/modifier-groups')
        .send({ modifier_group_ids: ['sugars', 'ices', 'toppings'] })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body.id).toBe('item_black_tea');
      expect(res.body.res_body.modifier_group_ids.ids).toEqual(['sugars', 'ices', 'toppings']);
    });
  });

  describe('DELETE /api/menu-items/:id', () => {
    it('should soft delete item and return null body', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/menu-items/item_black_tea')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.res_body).toBeNull();
      expect(mockPrisma.item.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item_black_tea' },
          data: { status: MenuItemStatusEnum.ARCHIVED },
        }),
      );
    });
  });
});
