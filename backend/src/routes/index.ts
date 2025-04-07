import { Router } from "express";
import locationRoutes from "./locationRoutes";
import categoryRoutes from "./categoryRoutes";
import serviceRoutes from "./serviceRoutes";

const routes = Router();

routes.use("/locations", locationRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/services", serviceRoutes);

export default routes;
