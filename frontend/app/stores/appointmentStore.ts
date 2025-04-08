import { create } from "zustand";
import axios from "axios";

export interface Appointment {
  id: string;
  serviceId: string;
  professionalId: string;
  locationId: string;
  clientName: string;
  clientPhone: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: "scheduled" | "completed" | "canceled" | "no_show";
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
    color: string;
  };
  professional?: {
    id: string;
    firstName: string;
    lastName: string;
    initials?: string;
  };
  location?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AppointmentInput {
  serviceId: string;
  professionalId: string;
  locationId: string;
  clientName: string;
  clientPhone: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: "scheduled" | "completed" | "canceled" | "no_show";
}

interface AppointmentStore {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<Appointment[]>;
  createAppointment: (data: AppointmentInput) => Promise<Appointment>;
  updateAppointment: (
    id: string,
    data: Partial<AppointmentInput>
  ) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointmentById: (id: string) => Promise<Appointment | null>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("http://localhost:3333/appointments");
      const appointments = response.data as Appointment[];
      set({ appointments, loading: false });
      return appointments;
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao buscar agendamentos",
        loading: false,
      });
      return [];
    }
  },

  createAppointment: async (data) => {
    try {
      set({ loading: true, error: null });
      console.log("Enviando dados para criação:", data);
      const response = await axios.post(
        "http://localhost:3333/appointments",
        data
      );
      const newAppointment = response.data as Appointment;

      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        loading: false,
      }));

      return newAppointment;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao criar agendamento",
        loading: false,
      });
      throw error;
    }
  },

  updateAppointment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(
        `http://localhost:3333/appointments/${id}`,
        data
      );
      const updatedAppointment = response.data as Appointment;

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        loading: false,
      }));

      return updatedAppointment;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao atualizar agendamento",
        loading: false,
      });
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`http://localhost:3333/appointments/${id}`);

      set((state) => ({
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== id
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao deletar agendamento",
        loading: false,
      });
      throw error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const { appointments } = get();
      let appointment = appointments.find((a) => a.id === id);

      if (!appointment) {
        set({ loading: true, error: null });
        const response = await axios.get(
          `http://localhost:3333/appointments/${id}`
        );
        appointment = response.data as Appointment;
        set({ loading: false });
      }

      return appointment || null;
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao buscar agendamento",
        loading: false,
      });
      return null;
    }
  },
}));
