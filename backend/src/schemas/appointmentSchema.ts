import { z } from "zod";

export const appointmentCreateSchema = z.object({
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
  locationId: z.string().uuid(),
  clientName: z
    .string()
    .min(3, "Nome do cliente deve ter pelo menos 3 caracteres"),
  clientPhone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos"),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
  status: z
    .enum(["scheduled", "completed", "canceled", "no_show"])
    .default("scheduled"),
});

export const appointmentUpdateSchema = appointmentCreateSchema.partial();

export type AppointmentCreate = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdate = z.infer<typeof appointmentUpdateSchema>;
