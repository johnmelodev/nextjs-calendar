import { Request, Response } from "express";
import { AppointmentService } from "../services/appointmentService";
import {
  appointmentCreateSchema,
  appointmentUpdateSchema,
} from "../schemas/appointmentSchema";
import { ApiError } from "../utils/apiError";

const appointmentService = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      console.log("Dados recebidos para criação de agendamento:", req.body);

      // Validar os dados de entrada
      const validatedData = appointmentCreateSchema.parse(req.body);

      console.log("Dados validados:", validatedData);

      // Criar o agendamento
      const appointment = await appointmentService.create(validatedData);

      return res.status(201).json(appointment);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const {
        professionalId,
        serviceId,
        locationId,
        startDate,
        endDate,
        status,
      } = req.query;

      const options: any = {};

      if (professionalId) {
        options.professionalId = professionalId as string;
      }

      if (serviceId) {
        options.serviceId = serviceId as string;
      }

      if (locationId) {
        options.locationId = locationId as string;
      }

      if (status) {
        options.status = status as string;
      }

      if (startDate) {
        options.startDate = new Date(startDate as string);
      }

      if (endDate) {
        options.endDate = new Date(endDate as string);
      }

      const appointments = await appointmentService.findAll(options);

      return res.status(200).json(appointments);
    } catch (error) {
      console.error("Erro ao listar agendamentos:", error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const appointment = await appointmentService.findById(id);

      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }

      return res.status(200).json(appointment);
    } catch (error) {
      console.error(
        `Erro ao buscar agendamento com ID ${req.params.id}:`,
        error
      );

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validar os dados de entrada
      const validatedData = appointmentUpdateSchema.parse(req.body);

      // Atualizar o agendamento
      const appointment = await appointmentService.update(id, validatedData);

      return res.status(200).json(appointment);
    } catch (error) {
      console.error(
        `Erro ao atualizar agendamento com ID ${req.params.id}:`,
        error
      );

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await appointmentService.delete(id);

      return res.status(204).send();
    } catch (error) {
      console.error(
        `Erro ao excluir agendamento com ID ${req.params.id}:`,
        error
      );

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
