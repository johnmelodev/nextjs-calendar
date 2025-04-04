import { Router } from "express";
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from "../services/locationService";
import {
  createLocationSchema,
  updateLocationSchema,
} from "../schemas/locationSchema";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

// Listar todos os locais
router.get("/", async (req, res, next) => {
  try {
    console.log("GET /locations - Iniciando busca de locais");
    const locations = await getLocations();
    console.log("GET /locations - Locais encontrados:", locations);
    res.json(locations);
  } catch (error) {
    console.error("GET /locations - Erro:", error);
    next(error);
  }
});

// Buscar local por ID
router.get("/:id", async (req, res, next) => {
  try {
    const location = await getLocation(req.params.id);
    res.json(location);
  } catch (error) {
    next(error);
  }
});

// Criar novo local
router.post(
  "/",
  validateRequest(createLocationSchema),
  async (req, res, next) => {
    try {
      const location = await createLocation(req.body);
      res.status(201).json(location);
    } catch (error) {
      next(error);
    }
  }
);

// Atualizar local
router.put(
  "/:id",
  validateRequest(updateLocationSchema),
  async (req, res, next) => {
    try {
      const location = await updateLocation(req.params.id, req.body);
      res.json(location);
    } catch (error) {
      next(error);
    }
  }
);

// Deletar local (soft delete)
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteLocation(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
