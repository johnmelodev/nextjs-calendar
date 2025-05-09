import { Router } from "express";
import locationRoutes from "./locationRoutes";
import categoryRoutes from "./categoryRoutes";
import serviceRoutes from "./serviceRoutes";
import professionalRoutes from "./professionalRoutes";
import appointmentRoutes from "./appointmentRoutes";
import patientRoutes from "./patientRoutes";

const routes = Router();

routes.use("/locations", locationRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/services", serviceRoutes);
routes.use("/professionals", professionalRoutes);
routes.use("/appointments", appointmentRoutes);
routes.use("/patients", patientRoutes);

export default routes;
