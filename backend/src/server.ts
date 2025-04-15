import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// Configuração do CORS para aceitar requisições do frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000", // URL do frontend local
  "https://nextjs-calendar-frontend.vercel.app", // URL do frontend na Vercel (ajuste para sua URL)
  /\.vercel\.app$/, // Aceita qualquer subdomínio da Vercel
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como mobile apps ou Postman)
      if (!origin) return callback(null, true);

      // Verifica se a origem está na lista de permitidos
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return allowedOrigin === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
