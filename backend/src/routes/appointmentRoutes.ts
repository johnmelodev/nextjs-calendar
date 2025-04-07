import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";

const routes = Router();
const appointmentController = new AppointmentController();

// Listar todos os agendamentos (com filtros opcionais)
routes.get("/", appointmentController.list);

// Obter um agendamento específico por ID
routes.get("/:id", appointmentController.getById);

// Criar um novo agendamento
routes.post("/", appointmentController.create);

// Atualizar um agendamento existente
routes.put("/:id", appointmentController.update);

// Excluir um agendamento
routes.delete("/:id", appointmentController.delete);

export default routes;
