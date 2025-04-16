import axios from "axios";

// Função para obter a URL correta da API
function getApiUrl() {
  // Verificar se temos uma URL global definida (do script no layout.tsx)
  const globalApiUrl =
    typeof window !== "undefined" ? (window as any).NEXT_PUBLIC_API_URL : null;

  // Verificar se temos uma URL no localStorage
  const storedApiUrl =
    typeof window !== "undefined" ? localStorage.getItem("api_url") : null;

  // Prioridade: 1. Global, 2. localStorage, 3. env, 4. URL padrão
  return (
    globalApiUrl ||
    storedApiUrl ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://nextjs-calendar-production.up.railway.app"
  );
}

// Configuração da URL da API com fallback para Railway
const apiUrl = getApiUrl();

// Garantir que não estamos usando localhost
const finalApiUrl = apiUrl.includes("localhost")
  ? "https://nextjs-calendar-production.up.railway.app"
  : apiUrl;

console.log("API URL configurada:", finalApiUrl);

const api = axios.create({
  baseURL: finalApiUrl,
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
      console.error("Sem resposta do servidor:", error.request);
      console.error("URL da requisição:", error.config?.url);
      console.error("URL base configurada:", finalApiUrl);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error("Erro na configuração da requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

// Interceptor para evitar URLs com localhost
api.interceptors.request.use(
  (config) => {
    // Se a URL contém 'localhost', substitua pela URL correta
    if (config.url && config.url.includes("localhost")) {
      console.warn("Interceptando URL com localhost:", config.url);
      config.url = config.url.replace(
        /https?:\/\/localhost:[0-9]+/g,
        finalApiUrl
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
