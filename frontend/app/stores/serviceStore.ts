import { create } from "zustand";
import axios from "axios";

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
  fetchServices: () => Promise<void>;
  createService: (
    data: Omit<Service, "id" | "createdAt" | "updatedAt" | "category">
  ) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

const API_URL = "http://localhost:3333";

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  categories: [],
  loading: false,
  error: null,

  // Implementação das ações para categorias
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Category[]>(`${API_URL}/categories`);
      console.log("Categorias carregadas:", response.data);
      set((state) => ({ categories: response.data, loading: false }));
    } catch (error: any) {
      console.error("Erro ao carregar categorias:", error.message);
      set({ error: "Erro ao carregar categorias", loading: false });
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Category>(
        `${API_URL}/categories`,
        data
      );
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
      const response = await axios.put<Category>(
        `${API_URL}/categories/${id}`,
        data
      );
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
      await axios.delete(`${API_URL}/categories/${id}`);
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
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Service[]>(`${API_URL}/services`);
      console.log("Serviços carregados:", response.data);
      set((state) => ({ services: response.data, loading: false }));
    } catch (error: any) {
      console.error("Erro ao carregar serviços:", error.message);
      set({ error: "Erro ao carregar serviços", loading: false });
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
      const response = await axios.post<Service>(
        `${API_URL}/services`,
        serviceData
      );
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
      const response = await axios.put<Service>(
        `${API_URL}/services/${id}`,
        serviceData
      );
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
      await axios.delete(`${API_URL}/services/${id}`);
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
