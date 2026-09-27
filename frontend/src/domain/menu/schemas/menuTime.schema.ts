import { z } from 'zod';
import { titleSchema } from './modifier.schema';

export const timePeriodSchema = z.object({
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be HH:mm format"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be HH:mm format"),
});

export const serviceAvailabilitySchema = z.object({
  day_of_week: z.enum([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ]),
  time_periods: z.array(timePeriodSchema)
});

export const menuSchema = z.object({
  id: z.string().min(1, "Menu ID is required"),
  title: titleSchema,
  service_availability: z.array(serviceAvailabilitySchema).default([]),
  category_ids: z.array(z.string()).default([])
});

export type MenuSchema = z.infer<typeof menuSchema>;
