import axios from "axios";

// Constante para a URL correta da API
const RAILWAY_API_URL = "https://nextjs-calendar-production.up.railway.app";

// Função para obter a URL correta da API
function getApiUrl() {
  // Verificar se temos uma URL global definida (do script no layout.tsx)
  const globalApiUrl =
    typeof window !== "undefined" ? (window as any).NEXT_PUBLIC_API_URL : null;

  // Verificar se temos uma URL no localStorage
  const storedApiUrl =
    typeof window !== "undefined" ? localStorage.getItem("api_url") : null;

  // Verificar variável de ambiente
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Prioridade: 1. Global, 2. localStorage, 3. env, 4. URL padrão
  const apiUrl = globalApiUrl || storedApiUrl || envApiUrl || RAILWAY_API_URL;

  // IMPORTANTE: Se a URL contém localhost, substituir pela URL da Railway
  if (apiUrl.includes("localhost")) {
    console.warn(
      `URL da API contém localhost: ${apiUrl}. Usando URL da Railway em vez disso.`
    );
    return RAILWAY_API_URL;
  }

  return apiUrl;
}

// Configuração da URL da API
const apiUrl = getApiUrl();

console.log("[API] URL configurada:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para verificar e corrigir URLs em cada requisição
api.interceptors.request.use(
  (config) => {
    // Se a baseURL está configurada para localhost, corrigir
    if (config.baseURL && config.baseURL.includes("localhost")) {
      console.warn(
        `[API] Corrigindo baseURL: ${config.baseURL} -> ${RAILWAY_API_URL}`
      );
      config.baseURL = RAILWAY_API_URL;
    }

    // Se a URL relativa está tentando acessar localhost, corrigir
    if (config.url && config.url.includes("localhost")) {
      const correctedUrl = config.url.replace(
        /https?:\/\/localhost:[0-9]+\/?/g,
        RAILWAY_API_URL
      );
      console.warn(`[API] Corrigindo URL: ${config.url} -> ${correctedUrl}`);
      config.url = correctedUrl;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("[API] Erro na API:", error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("[API] Sem resposta do servidor:", error.request);
      console.error("[API] URL da requisição:", error.config?.url);
      console.error("[API] URL base configurada:", apiUrl);

      // Tentar reconectar usando a URL da Railway diretamente
      if (error.config && error.config.baseURL !== RAILWAY_API_URL) {
        console.warn("[API] Tentando reconectar usando URL da Railway...");
        error.config.baseURL = RAILWAY_API_URL;
        return axios(error.config);
      }
    } else {
      // Algo aconteceu na configuração da requisição
      console.error("[API] Erro na configuração da requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
