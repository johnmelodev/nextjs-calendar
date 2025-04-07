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
  fetchPatients: (search?: string) => Promise<Patient[]>;
  createPatient: (data: PatientInput) => Promise<Patient | null>;
  updatePatient: (
    id: string,
    data: Partial<PatientInput>
  ) => Promise<Patient | null>;
  deletePatient: (id: string) => Promise<boolean>;
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
  fetchPatients: async (search?: string) => {
    set({ loading: true, error: null });
    try {
      let url = "http://localhost:3333/patients";
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }

      console.log("Fazendo requisição para:", url);
      const response = await axios.get<Patient[]>(url);
      console.log("Resposta recebida:", response.data);

      const patientsWithCalculatedFields =
        response.data.map(addCalculatedFields);

      set({ patients: patientsWithCalculatedFields, loading: false });
      return patientsWithCalculatedFields;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      set({ error: "Falha ao carregar os pacientes", loading: false });
      throw error;
    }
  },

  // Criar um novo paciente
  createPatient: async (data: PatientInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Patient>(
        "http://localhost:3333/patients",
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
        `http://localhost:3333/patients/${id}`,
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
      await axios.delete(`http://localhost:3333/patients/${id}`);

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
