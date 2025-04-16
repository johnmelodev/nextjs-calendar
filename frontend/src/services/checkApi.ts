// Arquivo para verificar a URL da API sendo usada
import api from "./api";

interface ApiCheckResult {
  fixed: boolean;
  oldUrl?: string;
  newUrl?: string;
  url?: string;
}

// Função para verificar se a API está configurada corretamente
export function checkApiConfig(): ApiCheckResult {
  // Verificar e forçar a URL correta
  const originalUrl = api.defaults.baseURL || "";
  const correctUrl = "https://nextjs-calendar-production.up.railway.app";

  console.log("Verificação da URL da API:");
  console.log("URL atual:", originalUrl);

  // Verificar se a URL atual tem localhost ou não tem railway.app
  const needsCorrection =
    originalUrl.includes("localhost") || !originalUrl.includes("railway.app");

  if (needsCorrection) {
    console.log("Corrigindo URL da API de", originalUrl, "para", correctUrl);
    api.defaults.baseURL = correctUrl;

    // Salvar no localStorage para garantir que seja persistente
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("api_url", correctUrl);
        console.log("URL da API salva no localStorage");
      } catch (e) {
        console.error("Erro ao salvar no localStorage:", e);
      }
    }

    // Forçar substituição global de localhost
    if (typeof window !== "undefined") {
      (window as any).NEXT_PUBLIC_API_URL = correctUrl;
      console.log("URL da API definida globalmente como", correctUrl);
    }

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
export function setupApiMonitor(): void {
  // Adicionar interceptor de requisição para garantir que todas as chamadas usem a URL correta
  api.interceptors.request.use(
    (config) => {
      const correctUrl = "https://nextjs-calendar-production.up.railway.app";

      // Verificar se a URL base está correta
      if (
        config.baseURL?.includes("localhost") ||
        !config.baseURL?.includes("railway.app")
      ) {
        console.warn(
          "Interceptando requisição com URL incorreta:",
          config.baseURL
        );
        config.baseURL = correctUrl;
      }

      // Verificar se a URL completa está correta
      if (config.url) {
        // Substituir diretamente qualquer referência a localhost
        if (config.url.includes("localhost")) {
          console.warn("URL contém localhost:", config.url);
          // Substituir localhost:XXXX pelo URL correto
          config.url = config.url.replace(
            /https?:\/\/localhost:[0-9]+\/?/g,
            correctUrl
          );
          console.log("URL corrigida para:", config.url);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Adicionar interceptor global para XMLHttpRequest (para capturar requisições que não usam axios)
  if (typeof window !== "undefined") {
    const originalXhrOpen = XMLHttpRequest.prototype.open;

    // Sobrescrever o método open com tipagem correta
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ): void {
      const urlString = url.toString();
      let newUrl = urlString;

      if (urlString.includes("localhost")) {
        console.warn("XMLHttpRequest para localhost interceptado:", urlString);
        newUrl = urlString.replace(
          /https?:\/\/localhost:[0-9]+\/?/g,
          "https://nextjs-calendar-production.up.railway.app/"
        );
        console.log("Redirecionado para:", newUrl);
      }

      return originalXhrOpen.call(
        this,
        method,
        newUrl,
        async,
        username,
        password
      );
    };

    console.log(
      "Monitor de XMLHttpRequest configurado para interceptar chamadas para localhost"
    );
  }
}
