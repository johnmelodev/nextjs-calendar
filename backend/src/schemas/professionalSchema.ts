import { z } from "zod";

// Schema para a criação de um profissional
export const createProfessionalSchema = z.object({
  firstName: z
    .string()
    .min(2, "O primeiro nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos"),
  locationId: z.string().optional(),
  workingHours: z.record(z.any()).optional(),
  color: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
  status: z.enum(["disponivel", "indisponivel"]).default("disponivel"),
  isActive: z.boolean().default(true),
});

// Schema para a atualização de um profissional
export const updateProfessionalSchema = createProfessionalSchema.partial();

// Schema para o filtro de profissionais
export const professionalFilterSchema = z.object({
  isActive: z.boolean().optional(),
  locationId: z.string().optional(),
  serviceId: z.string().optional(),
  status: z.enum(["disponivel", "indisponivel"]).optional(),
});

// Tipos derivados dos schemas
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;
export type ProfessionalFilter = z.infer<typeof professionalFilterSchema>;
