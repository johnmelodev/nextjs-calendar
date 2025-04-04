import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LocationController {
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        phone,
        workingHours,
      } = req.body;

      const location = await prisma.location.create({
        data: {
          name,
          description,
          address,
          city,
          state,
          zipCode,
          phone,
          workingHours,
        },
      });

      return res.status(201).json(location);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar local" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const locations = await prisma.location.findMany({
        where: {
          isActive: true,
        },
      });

      return res.json(locations);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar locais" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const location = await prisma.location.findUnique({
        where: { id },
      });

      if (!location) {
        return res.status(404).json({ error: "Local não encontrado" });
      }

      return res.json(location);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar local" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        phone,
        workingHours,
        isActive,
      } = req.body;

      const location = await prisma.location.update({
        where: { id },
        data: {
          name,
          description,
          address,
          city,
          state,
          zipCode,
          phone,
          workingHours,
          isActive,
        },
      });

      return res.json(location);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar local" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.location.update({
        where: { id },
        data: { isActive: false },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar local" });
    }
  }
}
