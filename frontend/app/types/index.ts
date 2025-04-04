export interface Professional {
  id: string;
  name: string;
  color: string;
  initials: string;
}

export interface Event {
  id: number;
  title: string;
  start: Date | string;
  allDay: boolean;
  service: string;
  professionalId: string;
  location: string;
  client: string;
  notes: string;
  time: string;
  backgroundColor?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  duration: number;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  cpf: string;
  email: string;
  phone: string;
}

export type FilterType = "all" | string; // 'all' ou ID do profissional
