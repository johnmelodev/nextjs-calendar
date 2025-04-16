import { create } from "zustand";
import api from "../../src/services/api";
import { checkApiConfig, setupApiMonitor } from "../../src/services/checkApi";

// Configurar o monitoramento de API se estiver no navegador
if (typeof window !== "undefined") {
  // Verificar e corrigir a configuração da API
  const apiCheck = checkApiConfig();
  if (apiCheck.fixed) {
    console.log("API URL corrigida:", apiCheck.newUrl);
  }

  // Configurar interceptores
  setupApiMonitor();
}

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  color: string;
  categoryId: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceStore {
  services: Service[];
  categories: Category[];
  loading: boolean;
  error: string | null;

  // Ações para categorias
  fetchCategories: () => Promise<void>;
  createCategory: (
    data: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Ações para serviços
  fetchServices: () => Promise<Service[]>;
  createService: (
    data: Omit<Service, "id" | "createdAt" | "updatedAt" | "category">
  ) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  categories: [],
  loading: false,
  error: null,

  // Implementação das ações para categorias
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      // Garantir que a API está configurada corretamente
      if (typeof window !== "undefined") {
        checkApiConfig();
      }

      console.log("Buscando categorias da API...");
      const response = await api.get<Category[]>("/categories");
      console.log("Categorias carregadas:", response.data);
      set((state) => ({ categories: response.data, loading: false }));
    } catch (error: any) {
      console.error("Erro ao carregar categorias:", error.message);

      // Tratamento específico para erro de conexão recusada
      if (error.message && error.message.includes("ECONNREFUSED")) {
        console.error(
          "Erro de conexão recusada. Verifique se a API está online."
        );
        set({
          error:
            "Erro de conexão com o servidor. Verifique sua conexão de internet.",
          loading: false,
        });
      } else {
        set({ error: "Erro ao carregar categorias", loading: false });
      }
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<Category>("/categories", data);
      console.log("Categoria criada:", response.data);
      set((state) => ({
        categories: [...state.categories, response.data],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error.message);
      set({ error: "Erro ao criar categoria", loading: false });
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<Category>(`/categories/${id}`, data);
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? response.data : category
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error.message);
      set({ error: "Erro ao atualizar categoria", loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao deletar categoria:", error.message);
      set({ error: "Erro ao deletar categoria", loading: false });
    }
  },

  // Implementação das ações para serviços
  fetchServices: async () => {
    try {
      set({ loading: true, error: null });

      // Garantir que a API está configurada corretamente
      if (typeof window !== "undefined") {
        checkApiConfig();
      }

      console.log("Buscando serviços da API...");
      const response = await api.get<Service[]>("/services");
      const services = response.data;
      console.log("Serviços carregados:", services);
      set({ services, loading: false });
      return services;
    } catch (error: any) {
      console.error("Erro ao buscar serviços:", error);

      // Tratamento específico para erro de conexão recusada
      if (error.message && error.message.includes("ECONNREFUSED")) {
        console.error(
          "Erro de conexão recusada. Verifique se a API está online."
        );
        set({
          error:
            "Erro de conexão com o servidor. Verifique sua conexão de internet.",
          loading: false,
        });
      } else {
        set({
          error:
            error instanceof Error ? error.message : "Erro ao buscar serviços",
          loading: false,
        });
      }

      return [] as Service[];
    }
  },

  createService: async (data) => {
    set({ loading: true, error: null });
    try {
      // Garantir que os dados estejam nos tipos corretos
      const serviceData = {
        ...data,
        price:
          typeof data.price === "string" ? parseFloat(data.price) : data.price,
        duration:
          typeof data.duration === "string"
            ? parseInt(data.duration)
            : data.duration,
      };

      console.log("Enviando dados para criação de serviço:", serviceData);
      const response = await api.post<Service>("/services", serviceData);
      console.log("Serviço criado:", response.data);
      set((state) => ({
        services: [...state.services, response.data],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao criar serviço:", error.message);
      set({ error: "Erro ao criar serviço", loading: false });
    }
  },

  updateService: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Garantir que os dados estejam nos tipos corretos
      const serviceData = {
        ...data,
      };

      if (data.price !== undefined) {
        serviceData.price =
          typeof data.price === "string" ? parseFloat(data.price) : data.price;
      }

      if (data.duration !== undefined) {
        serviceData.duration =
          typeof data.duration === "string"
            ? parseInt(data.duration)
            : data.duration;
      }

      console.log("Enviando dados para atualização de serviço:", serviceData);
      const response = await api.put<Service>(`/services/${id}`, serviceData);
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? response.data : service
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao atualizar serviço:", error.message);
      set({ error: "Erro ao atualizar serviço", loading: false });
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/services/${id}`);
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao deletar serviço:", error.message);
      set({ error: "Erro ao deletar serviço", loading: false });
    }
  },
}));
