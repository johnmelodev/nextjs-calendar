import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: error.errors,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Registro já existe",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Registro não encontrado",
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
