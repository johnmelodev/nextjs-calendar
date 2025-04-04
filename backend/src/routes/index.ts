import { Router } from "express";
import locationsRouter from "./locations.routes";

const routes = Router();

routes.use("/locations", locationsRouter);

export default routes;
