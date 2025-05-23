import { Router } from "express";
import { ServiceController } from "../controllers/ServiceController";

const router = Router();
const serviceController = new ServiceController();

router.post("/", serviceController.create);
router.get("/", serviceController.list);
router.put("/:id", serviceController.update);
router.delete("/:id", serviceController.delete);

export default router;
