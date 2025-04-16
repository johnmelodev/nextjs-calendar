// Arquivo para verificar a URL da API sendo usada
import api from "./api";

// Função para verificar se a API está configurada corretamente
export function checkApiConfig() {
  // Verificar e forçar a URL correta
  const originalUrl = api.defaults.baseURL;
  const correctUrl = "https://nextjs-calendar-production.up.railway.app";

  console.log("Verificação da URL da API:");
  console.log("URL atual:", originalUrl);

  // Se a URL atual não for a correta, vamos atualizar
  if (
    originalUrl.includes("localhost") ||
    !originalUrl.includes("railway.app")
  ) {
    console.log("Corrigindo URL da API de", originalUrl, "para", correctUrl);
    api.defaults.baseURL = correctUrl;

    // Salvar no localStorage para garantir que seja persistente
    localStorage.setItem("api_url", correctUrl);

    return {
      fixed: true,
      oldUrl: originalUrl,
      newUrl: correctUrl,
    };
  }

  return {
    fixed: false,
    url: originalUrl,
  };
}

// Função para interceptar chamadas e corrigir URLs em tempo real
export function setupApiMonitor() {
  // Adicionar interceptor de requisição para garantir que todas as chamadas usem a URL correta
  api.interceptors.request.use(
    (config) => {
      const correctUrl = "https://nextjs-calendar-production.up.railway.app";

      // Verificar se a URL base está correta
      if (
        config.baseURL.includes("localhost") ||
        !config.baseURL.includes("railway.app")
      ) {
        console.warn(
          "Interceptando requisição com URL incorreta:",
          config.baseURL
        );
        config.baseURL = correctUrl;
      }

      // Verificar se a URL completa está correta
      if (config.url) {
        const fullUrl =
          config.baseURL +
          (config.url.startsWith("/") ? config.url : "/" + config.url);
        if (fullUrl.includes("localhost")) {
          console.warn("Interceptando URL completa incorreta:", fullUrl);
          config.url = config.url.replace(
            /^(https?:\/\/localhost:[0-9]+)/i,
            correctUrl
          );
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}
