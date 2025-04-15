import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categorySchema";
import { AppError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export class CategoryController {
  async create(req: Request, res: Response) {
    const validatedData = createCategorySchema.parse(req.body);

    const createData: Prisma.CategoryCreateInput = {
      name: validatedData.name,
      description: validatedData.description,
      isActive: validatedData.isActive ?? true,
    };

    const category = await prisma.category.create({
      data: createData,
    });

    return res.status(201).json(category);
  }

  async list(req: Request, res: Response) {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    return res.json(categories);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);

    const updateData: Prisma.CategoryUpdateInput = {
      name: validatedData.name,
      description: validatedData.description,
      isActive: validatedData.isActive,
    };

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return res.json(category);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
