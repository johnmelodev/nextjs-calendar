import { z } from "zod";

const workingHoursSchema = z.object({
  isOpen: z.boolean(),
  periods: z.array(
    z.object({
      start: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
      end: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
    })
  ),
});

const workingHoursByDaySchema = z.record(workingHoursSchema);

export const createLocationSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  description: z.string().optional(),
  workingHours: workingHoursByDaySchema,
  isActive: z.boolean().default(true),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
});

export const updateLocationSchema = createLocationSchema.partial();

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
