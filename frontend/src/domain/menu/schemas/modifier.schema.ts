import { z } from 'zod';

export const translationSchema = z.object({
  en: z.string().optional(),
  zh: z.string().optional(),
}).catchall(z.string().optional());

export const titleSchema = z.object({
  translations: translationSchema,
});

export const entitySchema = z.object({
  id: z.string().min(1, "ID is required"),
  type: z.string().default("ITEM"),
});

export const quantitySchema = z.object({
  max_permitted: z.number().optional(),
}).catchall(z.any());

export const quantityInfoSchema = z.object({
  quantity: quantitySchema,
  overrides: z.array(z.any()).optional(),
});

export const modifierGroupSchema = z.object({
  id: z.string().min(1, "Group ID is required"),
  title: titleSchema.optional(),
  quantity_info: quantityInfoSchema.optional(),
  modifier_options: z.array(entitySchema).optional(),
});

export type ModifierGroupSchema = z.infer<typeof modifierGroupSchema>;
