const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\benja\\Desktop\\backend\\uber-menu-backend';
const moduleDir = path.join(projectRoot, 'src', 'modules', 'menu');

const files = {
  // 1
  'repositories/menu.repository.interface.ts': `import { Menu, Prisma } from '@prisma/client';

export const MENU_REPOSITORY_TOKEN = 'MENU_REPOSITORY_TOKEN';

export interface IMenuRepository {
  findAll(): Promise<Menu[]>;
  findById(id: string): Promise<Menu | null>;
  create(data: Prisma.MenuCreateInput | Prisma.MenuUncheckedCreateInput): Promise<Menu>;
  update(id: string, data: Prisma.MenuUpdateInput | Prisma.MenuUncheckedUpdateInput): Promise<Menu>;
  delete(id: string): Promise<Menu>;
}
`,
  // 2
  'repositories/prisma-menu.repository.ts': `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMenuRepository } from './menu.repository.interface';
import { Menu, Prisma } from '@prisma/client';

@Injectable()
export class PrismaMenuRepository implements IMenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Menu[]> {
    return this.prisma.menu.findMany();
  }

  async findById(id: string): Promise<Menu | null> {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  async create(data: Prisma.MenuCreateInput | Prisma.MenuUncheckedCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  async update(id: string, data: Prisma.MenuUpdateInput | Prisma.MenuUncheckedUpdateInput): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Menu> {
    return this.prisma.menu.delete({ where: { id } });
  }
}
`,
  // 3
  'repositories/menu-item.repository.interface.ts': `import { MenuItem, Prisma } from '@prisma/client';

export const MENU_ITEM_REPOSITORY_TOKEN = 'MENU_ITEM_REPOSITORY_TOKEN';

export interface IMenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  findByIds(ids: string[]): Promise<MenuItem[]>;
  create(data: Prisma.MenuItemCreateInput | Prisma.MenuItemUncheckedCreateInput): Promise<MenuItem>;
  update(id: string, data: Prisma.MenuItemUpdateInput | Prisma.MenuItemUncheckedUpdateInput): Promise<MenuItem>;
  delete(id: string): Promise<MenuItem>;
}
`,
  // 4
  'repositories/prisma-menu-item.repository.ts': `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMenuItemRepository } from './menu-item.repository.interface';
import { MenuItem, Prisma } from '@prisma/client';

@Injectable()
export class PrismaMenuItemRepository implements IMenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany();
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({ where: { id: { in: ids } } });
  }

  async create(data: Prisma.MenuItemCreateInput | Prisma.MenuItemUncheckedCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({ data });
  }

  async update(id: string, data: Prisma.MenuItemUpdateInput | Prisma.MenuItemUncheckedUpdateInput): Promise<MenuItem> {
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
`,
  // 5
  'repositories/modifier-group.repository.interface.ts': `import { ModifierGroup, Prisma } from '@prisma/client';

export const MODIFIER_GROUP_REPOSITORY_TOKEN = 'MODIFIER_GROUP_REPOSITORY_TOKEN';

export interface IModifierGroupRepository {
  findAll(): Promise<ModifierGroup[]>;
  findById(id: string): Promise<ModifierGroup | null>;
  findByIds(ids: string[]): Promise<ModifierGroup[]>;
  create(data: Prisma.ModifierGroupCreateInput | Prisma.ModifierGroupUncheckedCreateInput): Promise<ModifierGroup>;
  update(id: string, data: Prisma.ModifierGroupUpdateInput | Prisma.ModifierGroupUncheckedUpdateInput): Promise<ModifierGroup>;
  delete(id: string): Promise<ModifierGroup>;
}
`,
  // 6
  'repositories/prisma-modifier-group.repository.ts': `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IModifierGroupRepository } from './modifier-group.repository.interface';
import { ModifierGroup, Prisma } from '@prisma/client';

@Injectable()
export class PrismaModifierGroupRepository implements IModifierGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ModifierGroup[]> {
    return this.prisma.modifierGroup.findMany();
  }

  async findById(id: string): Promise<ModifierGroup | null> {
    return this.prisma.modifierGroup.findUnique({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<ModifierGroup[]> {
    return this.prisma.modifierGroup.findMany({ where: { id: { in: ids } } });
  }

  async create(data: Prisma.ModifierGroupCreateInput | Prisma.ModifierGroupUncheckedCreateInput): Promise<ModifierGroup> {
    return this.prisma.modifierGroup.create({ data });
  }

  async update(id: string, data: Prisma.ModifierGroupUpdateInput | Prisma.ModifierGroupUncheckedUpdateInput): Promise<ModifierGroup> {
    return this.prisma.modifierGroup.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ModifierGroup> {
    return this.prisma.modifierGroup.delete({ where: { id } });
  }
}
`,
  // 7
  'dto/create-menu.dto.ts': `import { IsOptional, IsString, IsArray, IsObject, ValidateNested } from 'class-validator';

export class CreateMenuDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsObject()
  title!: any;

  @IsOptional()
  @IsArray()
  service_availability?: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_ids?: string[];
}
`,
  // 8
  'dto/update-menu.dto.ts': `import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class UpdateMenuDto {
  @IsOptional()
  @IsObject()
  title?: any;

  @IsOptional()
  @IsArray()
  service_availability?: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_ids?: string[];
}
`,
  // 9
  'dto/create-menu-item.dto.ts': `import { IsOptional, IsString, IsObject } from 'class-validator';

export class CreateMenuItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsObject()
  title!: any;

  @IsObject()
  description!: any;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsObject()
  price_info!: any;

  @IsOptional()
  @IsObject()
  quantity_info?: any;

  @IsOptional()
  @IsObject()
  modifier_group_ids?: any;

  @IsOptional()
  @IsObject()
  tax_info?: any;

  @IsOptional()
  @IsObject()
  nutritional_info?: any;

  @IsOptional()
  @IsObject()
  dish_info?: any;

  @IsOptional()
  @IsObject()
  tax_label_info?: any;

  @IsOptional()
  @IsObject()
  product_info?: any;

  @IsOptional()
  @IsObject()
  bundled_items?: any;
}
`,
  // 10
  'dto/update-menu-item.dto.ts': `import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateMenuItemDto {
  @IsOptional()
  @IsObject()
  title?: any;

  @IsOptional()
  @IsObject()
  description?: any;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsObject()
  price_info?: any;

  @IsOptional()
  @IsObject()
  quantity_info?: any;

  @IsOptional()
  @IsObject()
  modifier_group_ids?: any;

  @IsOptional()
  @IsObject()
  tax_info?: any;

  @IsOptional()
  @IsObject()
  nutritional_info?: any;

  @IsOptional()
  @IsObject()
  dish_info?: any;

  @IsOptional()
  @IsObject()
  tax_label_info?: any;

  @IsOptional()
  @IsObject()
  product_info?: any;

  @IsOptional()
  @IsObject()
  bundled_items?: any;
}
`,
  // 11
  'dto/create-modifier-group.dto.ts': `import { IsOptional, IsString, IsObject } from 'class-validator';

export class CreateModifierGroupDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsObject()
  title?: any;

  @IsOptional()
  @IsObject()
  quantity_info?: any;

  @IsOptional()
  @IsObject()
  modifier_options?: any;
}
`,
  // 12
  'dto/update-modifier-group.dto.ts': `import { IsOptional, IsObject } from 'class-validator';

export class UpdateModifierGroupDto {
  @IsOptional()
  @IsObject()
  title?: any;

  @IsOptional()
  @IsObject()
  quantity_info?: any;

  @IsOptional()
  @IsObject()
  modifier_options?: any;
}
`,
  // 13
  'services/menu.service.ts': `import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IMenuRepository, MENU_REPOSITORY_TOKEN } from '../repositories/menu.repository.interface';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { Menu } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(
    @Inject(MENU_REPOSITORY_TOKEN)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.findAll();
  }

  async findById(id: string): Promise<Menu | null> {
    return this.menuRepository.findById(id);
  }

  async create(dto: CreateMenuDto): Promise<Menu> {
    if (dto.id) {
      const existing = await this.menuRepository.findById(dto.id);
      if (existing) {
        throw new ConflictException('Menu with this ID already exists');
      }
    }
    
    const data: any = {
      title: dto.title,
    };
    if (dto.id) data.id = dto.id;
    if (dto.service_availability) data.serviceAvailability = dto.service_availability;
    if (dto.category_ids) data.categoryIds = dto.category_ids;

    return this.menuRepository.create(data);
  }

  async update(id: string, dto: UpdateMenuDto): Promise<Menu> {
    const data: any = {};
    if (dto.title) data.title = dto.title;
    if (dto.service_availability) data.serviceAvailability = dto.service_availability;
    if (dto.category_ids) data.categoryIds = dto.category_ids;

    return this.menuRepository.update(id, data);
  }

  async delete(id: string): Promise<Menu> {
    return this.menuRepository.delete(id);
  }
}
`,
  // 14
  'services/menu-item.service.ts': `import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IMenuItemRepository, MENU_ITEM_REPOSITORY_TOKEN } from '../repositories/menu-item.repository.interface';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { MenuItem } from '@prisma/client';

@Injectable()
export class MenuItemService {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY_TOKEN)
    private readonly menuItemRepository: IMenuItemRepository,
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.findAll();
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.menuItemRepository.findById(id);
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItem> {
    if (dto.id) {
      const existing = await this.menuItemRepository.findById(dto.id);
      if (existing) {
        throw new ConflictException('MenuItem with this ID already exists');
      }
    }
    
    const data: any = {
      title: dto.title,
      description: dto.description,
      priceInfo: dto.price_info,
    };
    if (dto.id) data.id = dto.id;
    if (dto.image_url) data.imageUrl = dto.image_url;
    if (dto.quantity_info) data.quantityInfo = dto.quantity_info;
    if (dto.modifier_group_ids) data.modifierGroupIds = dto.modifier_group_ids;
    if (dto.tax_info) data.taxInfo = dto.tax_info;
    if (dto.nutritional_info) data.nutritionalInfo = dto.nutritional_info;
    if (dto.dish_info) data.dishInfo = dto.dish_info;
    if (dto.tax_label_info) data.taxLabelInfo = dto.tax_label_info;
    if (dto.product_info) data.productInfo = dto.product_info;
    if (dto.bundled_items) data.bundledItems = dto.bundled_items;

    return this.menuItemRepository.create(data);
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const data: any = {};
    if (dto.title) data.title = dto.title;
    if (dto.description) data.description = dto.description;
    if (dto.image_url !== undefined) data.imageUrl = dto.image_url;
    if (dto.price_info) data.priceInfo = dto.price_info;
    if (dto.quantity_info) data.quantityInfo = dto.quantity_info;
    if (dto.modifier_group_ids) data.modifierGroupIds = dto.modifier_group_ids;
    if (dto.tax_info) data.taxInfo = dto.tax_info;
    if (dto.nutritional_info) data.nutritionalInfo = dto.nutritional_info;
    if (dto.dish_info) data.dishInfo = dto.dish_info;
    if (dto.tax_label_info) data.taxLabelInfo = dto.tax_label_info;
    if (dto.product_info) data.productInfo = dto.product_info;
    if (dto.bundled_items) data.bundledItems = dto.bundled_items;

    return this.menuItemRepository.update(id, data);
  }

  async delete(id: string): Promise<MenuItem> {
    return this.menuItemRepository.delete(id);
  }
}
`,
  // 15
  'services/modifier-group.service.ts': `import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IModifierGroupRepository, MODIFIER_GROUP_REPOSITORY_TOKEN } from '../repositories/modifier-group.repository.interface';
import { CreateModifierGroupDto } from '../dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from '../dto/update-modifier-group.dto';
import { ModifierGroup } from '@prisma/client';

@Injectable()
export class ModifierGroupService {
  constructor(
    @Inject(MODIFIER_GROUP_REPOSITORY_TOKEN)
    private readonly modifierGroupRepository: IModifierGroupRepository,
  ) {}

  async findAll(): Promise<ModifierGroup[]> {
    return this.modifierGroupRepository.findAll();
  }

  async findById(id: string): Promise<ModifierGroup | null> {
    return this.modifierGroupRepository.findById(id);
  }

  async create(dto: CreateModifierGroupDto): Promise<ModifierGroup> {
    if (dto.id) {
      const existing = await this.modifierGroupRepository.findById(dto.id);
      if (existing) {
        throw new ConflictException('ModifierGroup with this ID already exists');
      }
    }
    
    const data: any = {};
    if (dto.id) data.id = dto.id;
    if (dto.title) data.title = dto.title;
    if (dto.quantity_info) data.quantityInfo = dto.quantity_info;
    if (dto.modifier_options) data.modifierOptions = dto.modifier_options;

    return this.modifierGroupRepository.create(data);
  }

  async update(id: string, dto: UpdateModifierGroupDto): Promise<ModifierGroup> {
    const data: any = {};
    if (dto.title) data.title = dto.title;
    if (dto.quantity_info) data.quantityInfo = dto.quantity_info;
    if (dto.modifier_options) data.modifierOptions = dto.modifier_options;

    return this.modifierGroupRepository.update(id, data);
  }

  async delete(id: string): Promise<ModifierGroup> {
    return this.modifierGroupRepository.delete(id);
  }
}
`,
  // 16
  'controllers/menu.controller.ts': `import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { MenuItemService } from '../services/menu-item.service';
import { ModifierGroupService } from '../services/modifier-group.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Public()
@Controller('menu')
export class MenuSceneController {
  constructor(
    private readonly menuService: MenuService,
    private readonly menuItemService: MenuItemService,
    private readonly modifierGroupService: ModifierGroupService,
  ) {}

  @Get()
  async getMenuScene(@Query('scenario') scenario?: string) {
    const [menus, items, modifier_groups] = await Promise.all([
      this.menuService.findAll(),
      this.menuItemService.findAll(),
      this.modifierGroupService.findAll(),
    ]);

    return {
      menus,
      categories: [], // Categories not implemented in this scope
      items,
      modifier_groups,
    };
  }
}

@Public()
@Controller('menus')
export class MenuCrudController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.menuService.delete(id);
    return null;
  }
}
`,
  // 17
  'controllers/menu-item.controller.ts': `import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MenuItemService } from '../services/menu-item.service';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Public()
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Get()
  async findAll() {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menuItemService.findById(id);
  }

  @Post()
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.menuItemService.delete(id);
    return null;
  }
}
`,
  // 18
  'controllers/modifier-group.controller.ts': `import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ModifierGroupService } from '../services/modifier-group.service';
import { CreateModifierGroupDto } from '../dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from '../dto/update-modifier-group.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Public()
@Controller('modifier-groups')
export class ModifierGroupController {
  constructor(private readonly modifierGroupService: ModifierGroupService) {}

  @Get()
  async findAll() {
    return this.modifierGroupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modifierGroupService.findById(id);
  }

  @Post()
  async create(@Body() createModifierGroupDto: CreateModifierGroupDto) {
    return this.modifierGroupService.create(createModifierGroupDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateModifierGroupDto: UpdateModifierGroupDto) {
    return this.modifierGroupService.update(id, updateModifierGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.modifierGroupService.delete(id);
    return null;
  }
}
`,
  // 19
  'menu.module.ts': `import { Module } from '@nestjs/common';
import { MenuSceneController, MenuCrudController } from './controllers/menu.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { ModifierGroupController } from './controllers/modifier-group.controller';
import { MenuService } from './services/menu.service';
import { MenuItemService } from './services/menu-item.service';
import { ModifierGroupService } from './services/modifier-group.service';
import { MENU_REPOSITORY_TOKEN } from './repositories/menu.repository.interface';
import { PrismaMenuRepository } from './repositories/prisma-menu.repository';
import { MENU_ITEM_REPOSITORY_TOKEN } from './repositories/menu-item.repository.interface';
import { PrismaMenuItemRepository } from './repositories/prisma-menu-item.repository';
import { MODIFIER_GROUP_REPOSITORY_TOKEN } from './repositories/modifier-group.repository.interface';
import { PrismaModifierGroupRepository } from './repositories/prisma-modifier-group.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    MenuSceneController,
    MenuCrudController,
    MenuItemController,
    ModifierGroupController,
  ],
  providers: [
    MenuService,
    MenuItemService,
    ModifierGroupService,
    {
      provide: MENU_REPOSITORY_TOKEN,
      useClass: PrismaMenuRepository,
    },
    {
      provide: MENU_ITEM_REPOSITORY_TOKEN,
      useClass: PrismaMenuItemRepository,
    },
    {
      provide: MODIFIER_GROUP_REPOSITORY_TOKEN,
      useClass: PrismaModifierGroupRepository,
    },
  ],
  exports: [
    MenuService,
    MenuItemService,
    ModifierGroupService,
  ],
})
export class MenuModule {}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(moduleDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('All files created successfully.');
