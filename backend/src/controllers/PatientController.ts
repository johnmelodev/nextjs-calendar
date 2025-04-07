import { Request, Response } from "express";
import { PatientService } from "../services/patientService";
import {
  patientCreateSchema,
  patientUpdateSchema,
} from "../schemas/patientSchema";
import { ApiError } from "../utils/apiError";

const patientService = new PatientService();

export class PatientController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      console.log("Dados recebidos para criação de paciente:", req.body);

      // Validar os dados de entrada com o schema
      const validatedData = patientCreateSchema.parse(req.body);

      console.log("Dados validados:", validatedData);

      // Criar o paciente usando o serviço
      const patient = await patientService.create(validatedData);

      return res.status(201).json(patient);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { search, isActive } = req.query;

      const options: any = {};

      if (search) {
        options.search = search as string;
      }

      if (isActive !== undefined) {
        options.isActive = isActive === "true";
      }

      const patients = await patientService.findAll(options);

      // Calcular campos adicionais
      const patientsWithExtra = patients.map((patient) => {
        return {
          ...patient,
          name: `${patient.firstName} ${patient.lastName}`,
          initials:
            `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase(),
        };
      });

      return res.status(200).json(patientsWithExtra);
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const patient = await patientService.findById(id);

      if (!patient) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }

      // Adicionar campos calculados
      const patientWithExtra = {
        ...patient,
        name: `${patient.firstName} ${patient.lastName}`,
        initials: `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase(),
      };

      return res.status(200).json(patientWithExtra);
    } catch (error) {
      console.error(`Erro ao buscar paciente com ID ${req.params.id}:`, error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      console.log(
        `Dados recebidos para atualização do paciente ${id}:`,
        req.body
      );

      // Validar os dados de entrada com o schema
      const validatedData = patientUpdateSchema.parse(req.body);

      console.log("Dados validados:", validatedData);

      // Atualizar o paciente usando o serviço
      const patient = await patientService.update(id, validatedData);

      // Adicionar campos calculados
      const patientWithExtra = {
        ...patient,
        name: `${patient.firstName} ${patient.lastName}`,
        initials: `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase(),
      };

      return res.status(200).json(patientWithExtra);
    } catch (error) {
      console.error(
        `Erro ao atualizar paciente com ID ${req.params.id}:`,
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

      // Soft delete (marcar como inativo)
      await patientService.delete(id);

      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao excluir paciente com ID ${req.params.id}:`, error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async hardDelete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Hard delete (excluir permanentemente)
      await patientService.hardDelete(id);

      return res.status(204).send();
    } catch (error) {
      console.error(
        `Erro ao excluir permanentemente paciente com ID ${req.params.id}:`,
        error
      );

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
