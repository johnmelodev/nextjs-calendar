import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../schemas/serviceSchema";
import { AppError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export class ServiceController {
  async create(req: Request, res: Response) {
    try {
      console.log("Recebido para criação:", req.body);
      const validatedData = createServiceSchema.parse(req.body);
      console.log("Dados validados:", validatedData);

      const service = await prisma.service.create({
        data: validatedData,
        include: {
          category: true,
        },
      });

      console.log("Serviço criado:", service);
      return res.status(201).json(service);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error; // O middleware de erro tratará isso
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { categoryId } = req.query;
      console.log("Buscando serviços, filtro categoryId:", categoryId);

      const where = categoryId ? { categoryId: String(categoryId) } : {};

      const services = await prisma.service.findMany({
        where,
        include: {
          category: true,
        },
      });

      console.log(`Encontrados ${services.length} serviços`);
      return res.json(services);
    } catch (error) {
      console.error("Erro ao listar serviços:", error);
      throw error;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Atualizando serviço ${id}:`, req.body);
      const validatedData = updateServiceSchema.parse(req.body);
      console.log("Dados validados:", validatedData);

      const service = await prisma.service.update({
        where: { id },
        data: validatedData,
        include: {
          category: true,
        },
      });

      console.log("Serviço atualizado:", service);
      return res.json(service);
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Excluindo serviço ${id}`);

      await prisma.service.delete({
        where: { id },
      });

      console.log(`Serviço ${id} excluído com sucesso`);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      throw error;
    }
  }
}
