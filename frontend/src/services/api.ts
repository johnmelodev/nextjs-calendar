import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://nextjs-calendar-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("Erro na API:", error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("Sem resposta do servidor");
    } else {
      // Algo aconteceu na configuração da requisição
      console.error("Erro na configuração da requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

// Log para debug - remover depois
console.log(
  "API URL:",
  process.env.NEXT_PUBLIC_API_URL ||
    "https://nextjs-calendar-production.up.railway.app"
);

export default api;
