import { create } from "zustand";
import api from "../../src/services/api";

// Interface para o paciente
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // Nome completo (calculado)
  email: string;
  phone: string;
  cpf: string;
  birthDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos calculados para exibição na UI
  initials?: string;
  color?: string;
  appointments?: number;
  lastAppointment?: string | null;
}

// Interface para input de criação/atualização
export interface PatientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate?: string | null;
}

// Interface para a store de pacientes
interface PatientStore {
  // Estado
  patients: Patient[];
  loading: boolean;
  error: string | null;

  // Ações
  fetchPatients: (searchTerm?: string) => Promise<void>;
  createPatient: (
    data: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
}

// Função para gerar uma cor aleatória
const generateRandomColor = (id?: string): string => {
  const colors = [
    "#F56565", // red.500
    "#ED8936", // orange.500
    "#ECC94B", // yellow.500
    "#48BB78", // green.500
    "#38B2AC", // teal.500
    "#4299E1", // blue.500
    "#667EEA", // indigo.500
    "#9F7AEA", // purple.500
    "#ED64A6", // pink.500
    "#805AD5", // purple.600
    "#3182CE", // blue.600
    "#DD6B20", // orange.600
  ];

  if (id) {
    // Usar o ID para gerar um índice consistente
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      sum += id.charCodeAt(i);
    }
    return colors[sum % colors.length];
  }

  // Fallback para comportamento aleatório se não tiver ID
  return colors[Math.floor(Math.random() * colors.length)];
};

// Função para adicionar campos calculados aos pacientes
const addCalculatedFields = (patient: Patient): Patient => {
  const initials = `${patient.firstName.charAt(0)}${patient.lastName.charAt(
    0
  )}`.toUpperCase();

  return {
    ...patient,
    name: `${patient.firstName} ${patient.lastName}`,
    initials,
    color: patient.color || generateRandomColor(patient.id),
    appointments: patient.appointments || 0,
    lastAppointment: patient.lastAppointment || null,
  };
};

// Criação da store
export const usePatientStore = create<PatientStore>((set, get) => ({
  // Estado inicial
  patients: [],
  loading: false,
  error: null,

  // Buscar todos os pacientes
  fetchPatients: async (searchTerm?: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get<Patient[]>("/patients", {
        params: { searchTerm },
      });
      const patients = response.data;
      set({ patients, loading: false });
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar pacientes",
        loading: false,
      });
    }
  },

  // Criar um novo paciente
  createPatient: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<Patient>("/patients", data);
      const newPatient = addCalculatedFields(response.data);

      set((state) => ({
        patients: [...state.patients, newPatient],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao criar paciente:", error);
      set({ error: "Erro ao criar paciente", loading: false });
      throw error;
    }
  },

  // Atualizar um paciente existente
  updatePatient: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<Patient>(`/patients/${id}`, data);
      const updatedPatient = addCalculatedFields(response.data);

      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? updatedPatient : p)),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao atualizar paciente:", error);
      set({ error: "Erro ao atualizar paciente", loading: false });
      throw error;
    }
  },

  // Excluir um paciente
  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/patients/${id}`);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Erro ao deletar paciente:", error);
      set({ error: "Erro ao deletar paciente", loading: false });
      throw error;
    }
  },

  // Buscar um paciente pelo ID
  getPatientById: (id: string) => {
    return get().patients.find((p) => p.id === id);
  },
}));
