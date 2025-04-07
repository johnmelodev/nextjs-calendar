import { z } from "zod";

// Schema para validação de criação de paciente
export const patientCreateSchema = z.object({
  firstName: z
    .string()
    .min(2, "O primeiro nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos"),
  cpf: z
    .string()
    .min(11, "CPF deve ter pelo menos 11 dígitos")
    .max(14, "CPF não deve ter mais que 14 caracteres"),
  birthDate: z.string().optional(),
  color: z.string().optional(),
});

// Schema para validação de atualização de paciente (todos os campos são opcionais)
export const patientUpdateSchema = patientCreateSchema.partial();

// Tipos derivados dos schemas
export type PatientCreate = z.infer<typeof patientCreateSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema>;
