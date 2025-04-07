import { Router } from "express";
import { PatientController } from "../controllers/PatientController";

const routes = Router();
const patientController = new PatientController();

// Listar todos os pacientes (com filtros opcionais)
routes.get("/", patientController.list);

// Obter um paciente específico por ID
routes.get("/:id", patientController.getById);

// Criar um novo paciente
routes.post("/", patientController.create);

// Atualizar um paciente existente
routes.put("/:id", patientController.update);

// Excluir um paciente (soft delete)
routes.delete("/:id", patientController.delete);

// Excluir permanentemente um paciente (hard delete)
routes.delete("/:id/hard", patientController.hardDelete);

export default routes;
