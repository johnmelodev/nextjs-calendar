import { create } from "zustand";
import axios from "axios";

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
  fetchPatients: (search?: string) => Promise<void>;
  createPatient: (data: PatientInput) => Promise<Patient | null>;
  updatePatient: (
    id: string,
    data: Partial<PatientInput>
  ) => Promise<Patient | null>;
  deletePatient: (id: string) => Promise<boolean>;
  getPatientById: (id: string) => Patient | undefined;
}

// Função para adicionar campos calculados aos pacientes
const addCalculatedFields = (patient: Patient): Patient => {
  return {
    ...patient,
    name: `${patient.firstName} ${patient.lastName}`,
    initials: `${patient.firstName.charAt(0)}${patient.lastName.charAt(
      0
    )}`.toUpperCase(),
  };
};

// Criação da store
export const usePatientStore = create<PatientStore>((set, get) => ({
  // Estado inicial
  patients: [],
  loading: false,
  error: null,

  // Buscar todos os pacientes
  fetchPatients: async (search?: string) => {
    set({ loading: true, error: null });
    try {
      let url = "http://localhost:3333/api/patients";
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }

      const response = await axios.get<Patient[]>(url);
      const patientsWithCalculatedFields =
        response.data.map(addCalculatedFields);

      set({ patients: patientsWithCalculatedFields, loading: false });
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      set({ error: "Falha ao carregar os pacientes", loading: false });
    }
  },

  // Criar um novo paciente
  createPatient: async (data: PatientInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Patient>(
        "http://localhost:3333/api/patients",
        data
      );
      const newPatient = addCalculatedFields(response.data);

      set((state) => ({
        patients: [...state.patients, newPatient],
        loading: false,
      }));

      return newPatient;
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      set({ error: "Falha ao criar o paciente", loading: false });
      return null;
    }
  },

  // Atualizar um paciente existente
  updatePatient: async (id: string, data: Partial<PatientInput>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put<Patient>(
        `http://localhost:3333/api/patients/${id}`,
        data
      );
      const updatedPatient = addCalculatedFields(response.data);

      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? updatedPatient : p)),
        loading: false,
      }));

      return updatedPatient;
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      set({ error: "Falha ao atualizar o paciente", loading: false });
      return null;
    }
  },

  // Excluir um paciente
  deletePatient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:3333/api/patients/${id}`);

      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
        loading: false,
      }));

      return true;
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      set({ error: "Falha ao excluir o paciente", loading: false });
      return false;
    }
  },

  // Buscar um paciente pelo ID
  getPatientById: (id: string) => {
    return get().patients.find((patient) => patient.id === id);
  },
}));
