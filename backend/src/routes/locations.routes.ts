import { Router } from "express";
import { LocationController } from "../controllers/LocationController";

const locationsRouter = Router();
const locationController = new LocationController();

locationsRouter.post("/", locationController.create);
locationsRouter.get("/", locationController.findAll);
locationsRouter.get("/:id", locationController.findById);
locationsRouter.put("/:id", locationController.update);
locationsRouter.delete("/:id", locationController.delete);

export default locationsRouter;
