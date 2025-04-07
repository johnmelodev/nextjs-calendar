import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Middleware para logar requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Recebida requisição`);
  next();
});

app.use(routes);

// Middleware para logar respostas
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    console.log(
      `${req.method} ${req.path} - Enviando resposta com status ${res.statusCode}`
    );
    return oldSend.apply(res, [data]);
  };
  next();
});

app.use(errorHandler);

export default app;
