import { create } from "zustand";
import axios from "axios";

// URL base da API
const API_URL = "http://localhost:3333";

// Interface para o profissional
export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  locationId: string | null;
  location?: {
    id: string;
    name: string;
  };
  services: Array<{
    id: string;
    name: string;
    color: string;
    duration: number;
  }>;
  workingHours?: any;
  color: string;
  initials: string;
  status: "disponivel" | "indisponivel";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para a store de profissionais
interface ProfessionalStore {
  // Estado
  professionals: Professional[];
  loading: boolean;
  error: string | null;

  // Ações
  fetchProfessionals: () => Promise<void>;
  createProfessional: (data: any) => Promise<Professional>;
  updateProfessional: (id: string, data: any) => Promise<Professional>;
  deleteProfessional: (id: string) => Promise<void>;
  getProfessionalById: (id: string) => Promise<Professional>;
}

// Criação da store
export const useProfessionalStore = create<ProfessionalStore>((set, get) => ({
  // Estado inicial
  professionals: [],
  loading: false,
  error: null,

  // Buscar todos os profissionais
  fetchProfessionals: async () => {
    try {
      set({ loading: true, error: null });

      const response = await axios.get(`${API_URL}/professionals`);
      set({ professionals: response.data, loading: false });
    } catch (error: any) {
      console.error("Erro ao buscar profissionais:", error);
      set({
        error: error.response?.data?.message || "Erro ao buscar profissionais",
        loading: false,
      });
    }
  },

  // Criar um novo profissional
  createProfessional: async (data) => {
    try {
      set({ loading: true, error: null });

      // Formata os dados para a API
      const professionalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        locationId: data.location || undefined,
        serviceIds: data.services || [],
        color: data.color,
        status: data.status || "disponivel",
        workingHours: data.workingHours,
      };

      const response = await axios.post(
        `${API_URL}/professionals`,
        professionalData
      );

      // Atualiza a lista de profissionais
      set((state) => ({
        professionals: [...state.professionals, response.data],
        loading: false,
      }));

      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar profissional:", error);
      set({
        error: error.response?.data?.message || "Erro ao criar profissional",
        loading: false,
      });
      throw error;
    }
  },

  // Atualizar um profissional existente
  updateProfessional: async (id, data) => {
    try {
      set({ loading: true, error: null });

      // Formata os dados para a API
      const professionalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        locationId: data.location || undefined,
        serviceIds: data.services || [],
        color: data.color,
        status: data.status,
        workingHours: data.workingHours,
      };

      const response = await axios.put(
        `${API_URL}/professionals/${id}`,
        professionalData
      );

      // Atualiza a lista de profissionais
      set((state) => ({
        professionals: state.professionals.map((prof) =>
          prof.id === id ? response.data : prof
        ),
        loading: false,
      }));

      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar profissional:", error);
      set({
        error:
          error.response?.data?.message || "Erro ao atualizar profissional",
        loading: false,
      });
      throw error;
    }
  },

  // Excluir um profissional
  deleteProfessional: async (id) => {
    try {
      set({ loading: true, error: null });

      await axios.delete(`${API_URL}/professionals/${id}`);

      // Remove o profissional da lista
      set((state) => ({
        professionals: state.professionals.filter((prof) => prof.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao excluir profissional:", error);
      set({
        error: error.response?.data?.message || "Erro ao excluir profissional",
        loading: false,
      });
      throw error;
    }
  },

  // Buscar um profissional pelo ID
  getProfessionalById: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.get(`${API_URL}/professionals/${id}`);
      set({ loading: false });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar profissional:", error);
      set({
        error: error.response?.data?.message || "Erro ao buscar profissional",
        loading: false,
      });
      throw error;
    }
  },
}));
