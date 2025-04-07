import { Patient, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { PatientCreate, PatientUpdate } from "../schemas/patientSchema";
import { ApiError } from "../utils/apiError";

export class PatientService {
  // Criar um novo paciente
  async create(data: PatientCreate): Promise<Patient> {
    try {
      // Verificar se já existe um paciente com o mesmo e-mail
      const existingEmail = await prisma.patient.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new ApiError(409, "Já existe um paciente com este e-mail");
      }

      // Verificar se já existe um paciente com o mesmo CPF
      const existingCpf = await prisma.patient.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new ApiError(409, "Já existe um paciente com este CPF");
      }

      // Criar paciente
      let birthDate = undefined;
      if (data.birthDate && data.birthDate.trim() !== "") {
        try {
          birthDate = new Date(data.birthDate);

          // Verificar se é uma data válida
          if (isNaN(birthDate.getTime())) {
            birthDate = undefined;
          }
        } catch (error) {
          console.error("Erro ao converter data de nascimento:", error);
          birthDate = undefined;
        }
      }

      const patient = await prisma.patient.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          birthDate,
        },
      });

      return patient;
    } catch (error) {
      // Repassar ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Lidar com erros do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Erro de chave única (unique constraint)
          throw new ApiError(
            409,
            "Já existe um paciente com este e-mail ou CPF"
          );
        }
      }

      console.error("Erro ao criar paciente:", error);
      throw new ApiError(500, "Erro interno ao criar paciente");
    }
  }

  // Listar todos os pacientes (com filtros opcionais)
  async findAll(options?: {
    search?: string;
    isActive?: boolean;
  }): Promise<Patient[]> {
    try {
      // Construir o filtro de busca
      const filter: Prisma.PatientWhereInput = {};

      // Filtrar por isActive
      if (options?.isActive !== undefined) {
        filter.isActive = options.isActive;
      }

      // Filtrar por termo de busca (nome, e-mail ou CPF)
      if (options?.search) {
        filter.OR = [
          { firstName: { contains: options.search, mode: "insensitive" } },
          { lastName: { contains: options.search, mode: "insensitive" } },
          { email: { contains: options.search, mode: "insensitive" } },
          { cpf: { contains: options.search } },
        ];
      }

      // Buscar pacientes
      const patients = await prisma.patient.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
      });

      return patients;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      throw new ApiError(500, "Erro interno ao buscar pacientes");
    }
  }

  // Buscar paciente por ID
  async findById(id: string): Promise<Patient | null> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      return patient;
    } catch (error) {
      console.error(`Erro ao buscar paciente com ID ${id}:`, error);
      throw new ApiError(500, "Erro interno ao buscar paciente");
    }
  }

  // Atualizar um paciente
  async update(id: string, data: PatientUpdate): Promise<Patient> {
    try {
      // Verificar se o paciente existe
      const existingPatient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        throw new ApiError(404, "Paciente não encontrado");
      }

      // Verificar e-mail único (se foi alterado)
      if (data.email && data.email !== existingPatient.email) {
        const existingEmail = await prisma.patient.findUnique({
          where: { email: data.email },
        });

        if (existingEmail) {
          throw new ApiError(409, "Já existe um paciente com este e-mail");
        }
      }

      // Verificar CPF único (se foi alterado)
      if (data.cpf && data.cpf !== existingPatient.cpf) {
        const existingCpf = await prisma.patient.findUnique({
          where: { cpf: data.cpf },
        });

        if (existingCpf) {
          throw new ApiError(409, "Já existe um paciente com este CPF");
        }
      }

      // Processar a data de nascimento se presente
      let birthDate = undefined;
      if (data.birthDate && data.birthDate.trim() !== "") {
        try {
          birthDate = new Date(data.birthDate);

          // Verificar se é uma data válida
          if (isNaN(birthDate.getTime())) {
            birthDate = undefined;
          }
        } catch (error) {
          console.error("Erro ao converter data de nascimento:", error);
          birthDate = undefined;
        }
      }

      // Atualizar o paciente
      const updatedPatient = await prisma.patient.update({
        where: { id },
        data: {
          ...data,
          birthDate: data.birthDate !== undefined ? birthDate : undefined,
        },
      });

      return updatedPatient;
    } catch (error) {
      // Repassar ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Lidar com erros do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Erro de chave única (unique constraint)
          throw new ApiError(
            409,
            "Já existe um paciente com este e-mail ou CPF"
          );
        }
      }

      console.error(`Erro ao atualizar paciente com ID ${id}:`, error);
      throw new ApiError(500, "Erro interno ao atualizar paciente");
    }
  }

  // Excluir um paciente (soft delete)
  async delete(id: string): Promise<void> {
    try {
      // Verificar se o paciente existe
      const existingPatient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        throw new ApiError(404, "Paciente não encontrado");
      }

      // Soft delete (marcando como inativo)
      await prisma.patient.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      // Repassar ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      console.error(`Erro ao excluir paciente com ID ${id}:`, error);
      throw new ApiError(500, "Erro interno ao excluir paciente");
    }
  }

  // Excluir um paciente permanentemente
  async hardDelete(id: string): Promise<void> {
    try {
      // Verificar se o paciente existe
      const existingPatient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        throw new ApiError(404, "Paciente não encontrado");
      }

      // Hard delete (excluindo o registro)
      await prisma.patient.delete({
        where: { id },
      });
    } catch (error) {
      // Repassar ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      console.error(
        `Erro ao excluir permanentemente paciente com ID ${id}:`,
        error
      );
      throw new ApiError(
        500,
        "Erro interno ao excluir permanentemente paciente"
      );
    }
  }
}
