import { create } from "zustand";
import axios from "axios";

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

const API_URL = "http://localhost:3333/locations";

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  loading: false,
  error: null,

  fetchLocations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Location[]>(API_URL);
      set({ locations: response.data, loading: false });
    } catch (error) {
      set({ error: "Erro ao carregar locais", loading: false });
    }
  },

  createLocation: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Location>(API_URL, data);
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
      const response = await axios.put<Location>(`${API_URL}/${id}`, data);
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
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        locations: state.locations.filter((location) => location.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erro ao deletar local", loading: false });
    }
  },
}));
