import { Appointment, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import {
  AppointmentCreate,
  AppointmentUpdate,
} from "../schemas/appointmentSchema";
import { ApiError } from "../utils/apiError";

export class AppointmentService {
  async create(data: AppointmentCreate): Promise<Appointment> {
    try {
      // Verificar se o profissional existe
      const professional = await prisma.professional.findUnique({
        where: { id: data.professionalId },
      });

      if (!professional) {
        throw new ApiError(404, "Profissional não encontrado");
      }

      // Verificar se o serviço existe
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId },
      });

      if (!service) {
        throw new ApiError(404, "Serviço não encontrado");
      }

      // Verificar se o local existe
      const location = await prisma.location.findUnique({
        where: { id: data.locationId },
      });

      if (!location) {
        throw new ApiError(404, "Local não encontrado");
      }

      // Verificar se o profissional pode realizar este serviço
      const canProvideService = await prisma.professionalService.findFirst({
        where: {
          professionalId: data.professionalId,
          serviceId: data.serviceId,
        },
      });

      if (!canProvideService) {
        throw new ApiError(
          400,
          "Este profissional não pode realizar este serviço"
        );
      }

      // Verificar se o profissional está disponível no horário selecionado
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          professionalId: data.professionalId,
          status: { not: "canceled" },
          OR: [
            {
              // Agendamento que começa durante outro agendamento
              startTime: {
                gte: new Date(data.startTime),
                lt: new Date(data.endTime),
              },
            },
            {
              // Agendamento que termina durante outro agendamento
              endTime: {
                gt: new Date(data.startTime),
                lte: new Date(data.endTime),
              },
            },
            {
              // Agendamento que abrange completamente outro agendamento
              AND: [
                { startTime: { lte: new Date(data.startTime) } },
                { endTime: { gte: new Date(data.endTime) } },
              ],
            },
          ],
        },
      });

      if (conflictingAppointment) {
        throw new ApiError(
          409,
          "O profissional já possui um agendamento neste horário"
        );
      }

      // Criar o agendamento
      return await prisma.appointment.create({
        data: {
          serviceId: data.serviceId,
          professionalId: data.professionalId,
          locationId: data.locationId,
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          notes: data.notes,
          status: data.status,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Erro Prisma:", error);
        throw new ApiError(500, "Erro ao criar agendamento no banco de dados");
      }

      console.error("Erro ao criar agendamento:", error);
      throw new ApiError(500, "Erro ao criar agendamento");
    }
  }

  async findAll(options?: {
    professionalId?: string;
    serviceId?: string;
    locationId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<Appointment[]> {
    try {
      const filter: any = {};

      if (options?.professionalId) {
        filter.professionalId = options.professionalId;
      }

      if (options?.serviceId) {
        filter.serviceId = options.serviceId;
      }

      if (options?.locationId) {
        filter.locationId = options.locationId;
      }

      if (options?.status) {
        filter.status = options.status;
      }

      if (options?.startDate || options?.endDate) {
        filter.OR = [];

        if (options?.startDate && options?.endDate) {
          // Agendamentos entre as datas especificadas
          filter.startTime = {
            gte: options.startDate,
            lte: options.endDate,
          };
        } else if (options?.startDate) {
          // Agendamentos a partir da data inicial
          filter.startTime = {
            gte: options.startDate,
          };
        } else if (options?.endDate) {
          // Agendamentos até a data final
          filter.startTime = {
            lte: options.endDate,
          };
        }
      }

      return await prisma.appointment.findMany({
        where: filter,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
              color: true,
            },
          },
          professional: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      throw new ApiError(500, "Erro ao buscar agendamentos");
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      return await prisma.appointment.findUnique({
        where: { id },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
              color: true,
            },
          },
          professional: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(`Erro ao buscar agendamento com ID ${id}:`, error);
      throw new ApiError(500, "Erro ao buscar agendamento");
    }
  }

  async update(id: string, data: AppointmentUpdate): Promise<Appointment> {
    try {
      // Verificar se o agendamento existe
      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new ApiError(404, "Agendamento não encontrado");
      }

      // Verificações adicionais se o profissional ou serviço forem alterados
      if (
        data.professionalId &&
        data.professionalId !== appointment.professionalId
      ) {
        // Verificar se o profissional existe
        const professional = await prisma.professional.findUnique({
          where: { id: data.professionalId },
        });

        if (!professional) {
          throw new ApiError(404, "Profissional não encontrado");
        }

        // Verificar se o profissional pode realizar o serviço
        const serviceId = data.serviceId || appointment.serviceId;

        const canProvideService = await prisma.professionalService.findFirst({
          where: {
            professionalId: data.professionalId,
            serviceId,
          },
        });

        if (!canProvideService) {
          throw new ApiError(
            400,
            "Este profissional não pode realizar este serviço"
          );
        }
      }

      // Verificar conflitos de horário se startTime ou endTime forem alterados
      if (data.startTime || data.endTime) {
        const startTime = data.startTime
          ? new Date(data.startTime)
          : appointment.startTime;
        const endTime = data.endTime
          ? new Date(data.endTime)
          : appointment.endTime;
        const professionalId =
          data.professionalId || appointment.professionalId;

        const conflictingAppointment = await prisma.appointment.findFirst({
          where: {
            id: { not: id }, // Excluir o próprio agendamento da verificação
            professionalId,
            status: { not: "canceled" },
            OR: [
              {
                // Agendamento que começa durante outro agendamento
                startTime: {
                  gte: startTime,
                  lt: endTime,
                },
              },
              {
                // Agendamento que termina durante outro agendamento
                endTime: {
                  gt: startTime,
                  lte: endTime,
                },
              },
              {
                // Agendamento que abrange completamente outro agendamento
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gte: endTime } },
                ],
              },
            ],
          },
        });

        if (conflictingAppointment) {
          throw new ApiError(
            409,
            "O profissional já possui um agendamento neste horário"
          );
        }
      }

      // Atualizar o agendamento
      return await prisma.appointment.update({
        where: { id },
        data: {
          ...(data.serviceId && { serviceId: data.serviceId }),
          ...(data.professionalId && { professionalId: data.professionalId }),
          ...(data.locationId && { locationId: data.locationId }),
          ...(data.clientName && { clientName: data.clientName }),
          ...(data.clientPhone && { clientPhone: data.clientPhone }),
          ...(data.startTime && { startTime: new Date(data.startTime) }),
          ...(data.endTime && { endTime: new Date(data.endTime) }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.status && { status: data.status }),
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
              color: true,
            },
          },
          professional: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error(`Erro ao atualizar agendamento com ID ${id}:`, error);
      throw new ApiError(500, "Erro ao atualizar agendamento");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Verificar se o agendamento existe
      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new ApiError(404, "Agendamento não encontrado");
      }

      await prisma.appointment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error(`Erro ao excluir agendamento com ID ${id}:`, error);
      throw new ApiError(500, "Erro ao excluir agendamento");
    }
  }
}
