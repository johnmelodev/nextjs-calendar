import { Router } from "express";
import { ProfessionalController } from "../controllers/ProfessionalController";

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

// Rota para listar todos os profissionais (com filtros opcionais)
professionalRoutes.get("/", professionalController.list);

// Rota para buscar um profissional por ID
professionalRoutes.get("/:id", professionalController.getById);

// Rota para criar um novo profissional
professionalRoutes.post("/", professionalController.create);

// Rota para atualizar um profissional
professionalRoutes.put("/:id", professionalController.update);

// Rota para excluir um profissional (desativar logicamente)
professionalRoutes.delete("/:id", professionalController.delete);

export default professionalRoutes;
