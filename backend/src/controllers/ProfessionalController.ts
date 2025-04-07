import { Request, Response } from "express";
import { professionalService } from "../services/professionalService";
import {
  createProfessionalSchema,
  updateProfessionalSchema,
  professionalFilterSchema,
} from "../schemas/professionalSchema";

export class ProfessionalController {
  // Criar um novo profissional
  async create(req: Request, res: Response) {
    try {
      // Valida os dados da requisição
      const validatedData = createProfessionalSchema.parse(req.body);

      // Cria o profissional
      const professional = await professionalService.create(validatedData);

      // Retorna o profissional criado
      return res.status(201).json(professional);
    } catch (error: any) {
      console.error("Erro ao criar profissional:", error);

      // Se for um erro de validação
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      return res.status(500).json({
        message: "Erro ao criar profissional",
        error: error.message,
      });
    }
  }

  // Listar todos os profissionais
  async list(req: Request, res: Response) {
    try {
      // Valida os filtros opcionais
      const filters = req.query
        ? professionalFilterSchema.parse(req.query)
        : undefined;

      // Busca os profissionais
      const professionals = await professionalService.findAll(filters);

      // Retorna a lista de profissionais
      return res.status(200).json(professionals);
    } catch (error: any) {
      console.error("Erro ao listar profissionais:", error);

      return res.status(500).json({
        message: "Erro ao listar profissionais",
        error: error.message,
      });
    }
  }

  // Buscar um profissional por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o profissional
      const professional = await professionalService.findById(id);

      // Retorna o profissional
      return res.status(200).json(professional);
    } catch (error: any) {
      console.error("Erro ao buscar profissional:", error);

      // Se o profissional não for encontrado
      if (error.message === "Profissional não encontrado") {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro ao buscar profissional",
        error: error.message,
      });
    }
  }

  // Atualizar um profissional
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Valida os dados da requisição
      const validatedData = updateProfessionalSchema.parse(req.body);

      // Atualiza o profissional
      const professional = await professionalService.update(id, validatedData);

      // Retorna o profissional atualizado
      return res.status(200).json(professional);
    } catch (error: any) {
      console.error("Erro ao atualizar profissional:", error);

      // Se for um erro de validação
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      // Se o profissional não for encontrado
      if (error.message === "Profissional não encontrado") {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro ao atualizar profissional",
        error: error.message,
      });
    }
  }

  // Excluir um profissional (desativação lógica)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Exclui o profissional (desativação lógica)
      await professionalService.delete(id);

      // Retorna resposta de sucesso
      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao excluir profissional:", error);

      // Se o profissional não for encontrado
      if (error.message === "Profissional não encontrado") {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro ao excluir profissional",
        error: error.message,
      });
    }
  }
}
