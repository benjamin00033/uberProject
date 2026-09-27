import { z } from 'zod';
import { titleSchema, quantityInfoSchema } from './modifier.schema';

export const descriptionSchema = z.object({
  translations: z.object({
    en: z.string().optional(),
    zh: z.string().optional(),
  }).catchall(z.string().optional()),
});

export const priceInfoSchema = z.object({
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  overrides: z.array(z.any()).optional(),
});

export const modifierGroupIdsSchema = z.object({
  ids: z.array(z.string()).nullable().default(null),
  overrides: z.array(z.any()).optional(),
});

export const menuItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  external_data: z.string().optional(),
  title: titleSchema,
  description: descriptionSchema,
  image_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  price_info: priceInfoSchema,
  quantity_info: quantityInfoSchema.optional(),
  modifier_group_ids: modifierGroupIdsSchema,
  tax_info: z.record(z.any()).optional(),
  nutritional_info: z.object({ allergens: z.any().nullable() }).optional(),
  dish_info: z.object({
    classifications: z.object({
      can_serve_alone: z.boolean().optional(),
      alcoholic_items: z.number().optional(),
      ingredients: z.any().nullable().optional(),
      additives: z.any().nullable().optional(),
    })
  }).optional(),
});

export type MenuItemSchema = z.infer<typeof menuItemSchema>;
