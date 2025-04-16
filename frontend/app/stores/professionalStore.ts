import { create } from "zustand";
import api from "../../src/services/api";

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

// Interface para a store
interface ProfessionalStore {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
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
      const response = await api.get<Professional[]>("/professionals");
      const professionals = response.data;
      set({ professionals, loading: false });
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao buscar profissionais",
        loading: false,
      });
    }
  },

  // Criar um novo profissional
  createProfessional: async (data): Promise<Professional> => {
    try {
      set({ loading: true, error: null });

      const professionalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        locationId: data.locationId || data.location || undefined,
        serviceIds: data.serviceIds || data.services || [],
        color: data.color,
        status: data.status || "disponivel",
        workingHours: data.workingHours,
      };

      console.log(
        "ProfessionalStore: Enviando dados para criação de profissional:",
        professionalData
      );
      console.log(
        "ProfessionalStore: serviceIds:",
        professionalData.serviceIds
      );

      const response = await api.post<Professional>(
        "/professionals",
        professionalData
      );

      console.log(
        "ProfessionalStore: Resposta da API após criação:",
        response.data
      );

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
  updateProfessional: async (id, data): Promise<Professional> => {
    try {
      set({ loading: true, error: null });

      const professionalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        locationId: data.locationId || data.location || undefined,
        serviceIds: data.serviceIds || data.services || [],
        color: data.color,
        status: data.status,
        workingHours: data.workingHours,
      };

      console.log(
        "ProfessionalStore: Enviando dados para atualização de profissional:",
        professionalData
      );
      console.log(
        "ProfessionalStore: serviceIds:",
        professionalData.serviceIds
      );

      const response = await api.put<Professional>(
        `/professionals/${id}`,
        professionalData
      );

      console.log(
        "ProfessionalStore: Resposta da API após atualização:",
        response.data
      );

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

      await api.delete(`/professionals/${id}`);

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
  getProfessionalById: async (id): Promise<Professional> => {
    try {
      set({ loading: true, error: null });

      const response = await api.get<Professional>(`/professionals/${id}`);
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
