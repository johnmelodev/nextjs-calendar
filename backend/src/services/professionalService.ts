import { PrismaClient, Prisma } from "@prisma/client";
import {
  CreateProfessionalInput,
  UpdateProfessionalInput,
  ProfessionalFilter,
} from "../schemas/professionalSchema";

const prisma = new PrismaClient();

export const professionalService = {
  // Criar um novo profissional
  async create(data: CreateProfessionalInput) {
    try {
      const { serviceIds, ...professionalData } = data;

      // Gera uma cor aleatória se não fornecida
      if (!professionalData.color) {
        professionalData.color =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }

      // Cria o profissional com os campos obrigatórios
      const createData: Prisma.ProfessionalCreateInput = {
        firstName: professionalData.firstName,
        lastName: professionalData.lastName,
        email: professionalData.email,
        phone: professionalData.phone,
        location: professionalData.locationId
          ? { connect: { id: professionalData.locationId } }
          : undefined,
        workingHours: professionalData.workingHours as Prisma.JsonValue,
        color: professionalData.color,
        status: professionalData.status || "disponivel",
        isActive: professionalData.isActive ?? true,
      };

      const professional = await prisma.professional.create({
        data: createData,
      });

      // Se foram fornecidos IDs de serviços, cria as relações
      if (serviceIds && serviceIds.length > 0) {
        const serviceRelations = serviceIds.map((serviceId) => ({
          professionalId: professional.id,
          serviceId,
        }));

        await prisma.professionalService.createMany({
          data: serviceRelations,
        });
      }

      // Retorna o profissional com seus serviços relacionados
      return this.findById(professional.id);
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
      throw error;
    }
  },

  // Encontrar profissional por ID
  async findById(id: string) {
    try {
      const professional = await prisma.professional.findUnique({
        where: { id },
        include: {
          location: true,
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      if (!professional) {
        throw new Error("Profissional não encontrado");
      }

      // Formata o profissional para o frontend
      return {
        ...professional,
        name: `${professional.firstName} ${professional.lastName}`,
        initials:
          `${professional.firstName[0]}${professional.lastName[0]}`.toUpperCase(),
        services: professional.services.map((ps) => ps.service),
      };
    } catch (error) {
      console.error("Erro ao buscar profissional:", error);
      throw error;
    }
  },

  // Listar todos os profissionais com filtros opcionais
  async findAll(filters?: ProfessionalFilter) {
    try {
      const where: any = {};

      // Aplica filtros se fornecidos
      if (filters) {
        if (filters.isActive !== undefined) {
          where.isActive = filters.isActive;
        }
        if (filters.locationId) {
          where.locationId = filters.locationId;
        }
        if (filters.status) {
          where.status = filters.status;
        }
        if (filters.serviceId) {
          where.services = {
            some: {
              serviceId: filters.serviceId,
            },
          };
        }
      }

      const professionals = await prisma.professional.findMany({
        where,
        include: {
          location: true,
          services: {
            include: {
              service: true,
            },
          },
        },
        orderBy: {
          firstName: "asc",
        },
      });

      // Formata os profissionais para o frontend
      return professionals.map((prof) => ({
        ...prof,
        name: `${prof.firstName} ${prof.lastName}`,
        initials: `${prof.firstName[0]}${prof.lastName[0]}`.toUpperCase(),
        services: prof.services.map((ps) => ps.service),
      }));
    } catch (error) {
      console.error("Erro ao listar profissionais:", error);
      throw error;
    }
  },

  // Atualizar um profissional existente
  async update(id: string, data: UpdateProfessionalInput) {
    try {
      const { serviceIds, ...professionalData } = data;

      // Verifica se o profissional existe
      const existingProfessional = await prisma.professional.findUnique({
        where: { id },
      });

      if (!existingProfessional) {
        throw new Error("Profissional não encontrado");
      }

      // Atualiza o profissional
      const professional = await prisma.professional.update({
        where: { id },
        data: professionalData,
      });

      // Se foram fornecidos IDs de serviços, atualiza as relações
      if (serviceIds) {
        // Remove todas as relações existentes
        await prisma.professionalService.deleteMany({
          where: {
            professionalId: id,
          },
        });

        // Cria as novas relações
        if (serviceIds.length > 0) {
          const serviceRelations = serviceIds.map((serviceId) => ({
            professionalId: id,
            serviceId,
          }));

          await prisma.professionalService.createMany({
            data: serviceRelations,
          });
        }
      }

      // Retorna o profissional atualizado
      return this.findById(id);
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      throw error;
    }
  },

  // Excluir um profissional (desativação lógica)
  async delete(id: string) {
    try {
      // Verifica se o profissional existe
      const existingProfessional = await prisma.professional.findUnique({
        where: { id },
      });

      if (!existingProfessional) {
        throw new Error("Profissional não encontrado");
      }

      // Marca o profissional como inativo em vez de excluir fisicamente
      return await prisma.professional.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      throw error;
    }
  },
};
