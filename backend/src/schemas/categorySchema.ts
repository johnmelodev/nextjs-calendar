import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
