import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../config/api";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      periods: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  isActive: boolean;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationStore {
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchLocations: () => Promise<void>;
  createLocation: (
    data: Omit<Location, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  loading: false,
  error: null,

  fetchLocations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<Location[]>(`${API_URL}/locations`);
      const locations = response.data;
      set({ locations, loading: false });
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
      set({
        error: error instanceof Error ? error.message : "Erro ao buscar locais",
        loading: false,
      });
    }
  },

  createLocation: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Location>(`${API_URL}/locations`, data);
      set((state) => ({
        locations: [response.data, ...state.locations],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erro ao criar local", loading: false });
    }
  },

  updateLocation: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put<Location>(
        `${API_URL}/locations/${id}`,
        data
      );
      set((state) => ({
        locations: state.locations.map((location) =>
          location.id === id ? response.data : location
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erro ao atualizar local", loading: false });
    }
  },

  deleteLocation: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/locations/${id}`);
      set((state) => ({
        locations: state.locations.filter((location) => location.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erro ao deletar local", loading: false });
    }
  },
}));
