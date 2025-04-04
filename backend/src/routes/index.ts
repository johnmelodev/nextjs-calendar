import { Router } from "express";
import locationRoutes from "./locationRoutes";

const routes = Router();

routes.use("/locations", locationRoutes);

export default routes;
