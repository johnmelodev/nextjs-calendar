import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().optional(),
  price: z
    .union([z.number(), z.string().transform((val) => parseFloat(val))])
    .pipe(z.number().min(0)),
  duration: z
    .union([z.number(), z.string().transform((val) => parseInt(val))])
    .pipe(z.number().min(1)),
  color: z.string().min(4),
  categoryId: z.string().uuid(),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
