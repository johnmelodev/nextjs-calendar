'use client';

import { useState } from 'react';
import { PlusCircle, MagnifyingGlass, X, Clock, UserPlus, DotsThree, Activity, UserMinus, Trash } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de dados para exemplo
const appointments = [
  {
    id: 1,
    date: '03/04/25 - 17:00',
    service: 'C. Nutro+Nutri',
    patient: 'Felipe Henrique',
    duration: '40min',
    status: 'Confirmado',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 2,
    date: '04/04/25 - 15:00',
    service: 'C. Clínica Nutro (Avulsa)',
    patient: 'Felipe Henrique',
    duration: '40min',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 3,
    date: '04/04/25 - 15:00',
    service: 'C. Clínica Nutro (Avulsa)',
    patient: 'Felipe Henrique',
    duration: '40min',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 4,
    date: '07/04/25 - 14:00',
    service: 'R. Clínico Nutrologia (Avulsa - Dr. Pizzini)',
    patient: 'Felipe Henrique',
    duration: '20min',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 5,
    date: '07/04/25 - 14:00',
    service: '',
    patient: 'Felipe Henrique',
    duration: '',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 6,
    date: '07/04/25 - 14:00',
    service: 'C. Clínica Nutro (Avulsa)',
    patient: 'Felipe Henrique',
    duration: '40min',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  },
  {
    id: 7,
    date: '26/05/25 - 13:10',
    service: 'C. Nutri+Treino (Prof. Gianolia)',
    patient: 'Teste do Teste',
    duration: '40min',
    status: 'Pendente',
    professional: 'DP',
    professionalColor: '#F8B4D9'
  }
];

// Lista de serviços únicos
const services = Array.from(new Set(appointments.map(app => app.service))).filter(Boolean);
// Lista de profissionais únicos
const professionals = Array.from(new Set(appointments.map(app => app.professional)));
// Lista de status em ordem específica
const statusOptions = ['Confirmado', 'Pendente', 'Não compareceu'];

interface AppointmentDetailsProps {
  appointment: typeof appointments[0];
  onClose: () => void;
}

const AppointmentDetails = ({ appointment, onClose }: AppointmentDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Agendamento</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-6 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-700">{appointment.service}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Data e Hora</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{appointment.date}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Atribuído a</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: appointment.professionalColor }}>
                {appointment.professional}
              </div>
              <span className="text-sm text-gray-900">Dr. Fábio Pizzini</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Paciente</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-gray-900">{appointment.patient}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Nota do agendamento</h3>
            <textarea
              className="w-full h-24 px-3 py-2 text-sm text-gray-900 border-0 ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Adicione uma nota..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddClientFormProps {
  onClose: () => void;
}

const AddClientForm = ({ onClose }: AddClientFormProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-medium text-gray-900">Adicionar cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de nascimento<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Digite o email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Digite o endereço completo"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              Adicionar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddAppointmentFormProps {
  onClose: () => void;
}

const AddAppointmentForm = ({ onClose }: AddAppointmentFormProps) => {
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative" onClick={e => e.stopPropagation()}>
        {showAddClientForm && (
          <AddClientForm onClose={() => setShowAddClientForm(false)} />
        )}

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-medium text-gray-900">Adicionar agendamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços<span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Selecione o serviço desejado</p>
            <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
              <option value="">Selecione o serviço</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profissionais<span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Selecione o(s) profissional(s) responsável(s) por este agendamento</p>
            <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
              <option value="">Profissionais</option>
              {professionals.map(professional => (
                <option key={professional} value={professional}>{professional}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                  placeholder="03/04/2025"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora<span className="text-red-500">*</span>
              </label>
              <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
                <option value="">Selecione a hora</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                {/* Adicionar mais horários */}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
              <option value="">Selecione o local</option>
              <option>Clínica A</option>
              <option>Clínica B</option>
              {/* Adicionar mais locais */}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Clientes
              </label>
              <button
                type="button"
                onClick={() => setShowAddClientForm(true)}
                className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                <UserPlus className="w-4 h-4" />
                Adicionar Cliente
              </button>
            </div>
            <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
              <option value="">Selecione o cliente</option>
              <option>Felipe Henrique</option>
              <option>Teste do Teste</option>
              {/* Adicionar mais clientes */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota
            </label>
            <textarea
              className="w-full h-24 text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="As notas não são visíveis para o paciente"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              Adicionar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditAppointmentFormProps {
  appointment: typeof appointments[0];
  onClose: () => void;
}

const EditAppointmentForm = ({ appointment, onClose }: EditAppointmentFormProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Editar agendamento</h2>
            <p className="text-xs text-gray-500 mt-1">Edite as informações do agendamento</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços<span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Selecione o serviço desejado</p>
            <select 
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              defaultValue={appointment.service}
            >
              <option value="">Selecione o serviço</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profissionais<span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Selecione o(s) profissional(s) responsável(s) por este agendamento</p>
            <select 
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              defaultValue={appointment.professional}
            >
              <option value="">Profissionais</option>
              {professionals.map(professional => (
                <option key={professional} value={professional}>{professional}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                  defaultValue={appointment.date.split(' - ')[0]}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora<span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                defaultValue={appointment.date.split(' - ')[1]}
              >
                <option value="">Selecione a hora</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                {/* Adicionar mais horários */}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <select className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
              <option value="">Clínica Dr. Fábio Pizzini</option>
              <option>Clínica A</option>
              <option>Clínica B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clientes
            </label>
            <select 
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              defaultValue={appointment.patient}
            >
              <option value="">Selecione o cliente</option>
              <option>{appointment.patient}</option>
              <option>Teste do Teste</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota
            </label>
            <textarea
              className="w-full h-24 text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="As notas não são visíveis para o paciente"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              Editar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ActivityLogModalProps {
  appointment: typeof appointments[0];
  onClose: () => void;
}

const ActivityLogModal = ({ appointment, onClose }: ActivityLogModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-medium text-gray-900">Registro de Atividades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">02/04/2025, 17:58:00</div>
            <div className="text-sm text-gray-700">criou o agendamento para {appointment.date}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

interface DropdownMenuProps {
  onClose: () => void;
  onActivityLog: () => void;
  onRemoveProfessional: () => void;
}

const DropdownMenu = ({ onClose, onActivityLog, onRemoveProfessional }: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50" onClick={e => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onActivityLog();
        }}
        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Activity className="w-4 h-4" />
        Registro de Atividade
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveProfessional();
        }}
        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
      >
        <Trash className="w-4 h-4" />
        Excluir profissional
      </button>
    </div>
  );
};

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<typeof appointments[0] | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedActivityAppointment, setSelectedActivityAppointment] = useState<typeof appointments[0] | null>(null);
  const [appointmentsData, setAppointmentsData] = useState(appointments);

  // Função para filtrar os agendamentos
  const filteredAppointments = appointmentsData.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedServices.length === 0 || selectedServices.includes(appointment.service);
    const matchesProfessional = selectedProfessionals.length === 0 || selectedProfessionals.includes(appointment.professional);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(appointment.status);
    
    return matchesSearch && matchesService && matchesProfessional && matchesStatus;
  });

  const handleActivityLog = (appointment: typeof appointments[0]) => {
    setSelectedActivityAppointment(appointment);
    setShowActivityLog(true);
    setOpenMenuId(null);
  };

  const handleRemoveProfessional = (appointmentId: number) => {
    setAppointmentsData(prev => prev.map(app => 
      app.id === appointmentId 
        ? { ...app, professional: '', professionalColor: '' }
        : app
    ));
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {showActivityLog && selectedActivityAppointment && (
        <ActivityLogModal
          appointment={selectedActivityAppointment}
          onClose={() => {
            setShowActivityLog(false);
            setSelectedActivityAppointment(null);
          }}
        />
      )}

      {showAddForm && (
        <AddAppointmentForm onClose={() => setShowAddForm(false)} />
      )}

      {editingAppointment && (
        <EditAppointmentForm
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}
      
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-gray-700 font-medium">Agendamentos</h1>
            <span className="text-2xl text-gray-400">({filteredAppointments.length})</span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Agendamento
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlass className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar Paciente"
                  className="pl-10 pr-4 py-2 border-0 ring-1 ring-gray-200 rounded-lg w-[300px] text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-violet-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border-0 ring-1 ring-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-violet-500"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                  <span className="text-sm text-gray-500">
                    {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 text-sm font-medium ${showFilters ? 'text-violet-600 bg-gray-50' : 'text-gray-700 hover:text-violet-600 hover:bg-gray-50'} rounded-lg flex items-center gap-2`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75M3 18h9.75M16.5 9v9m0 0l3.75-3.75M16.5 18l-3.75-3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Filtros
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtre pelos serviços:
                    </label>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <label key={service} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedServices.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service]);
                              } else {
                                setSelectedServices(selectedServices.filter(s => s !== service));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtre pelos profissionais:
                    </label>
                    <div className="space-y-2">
                      {professionals.map((professional) => (
                        <label key={professional} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedProfessionals.includes(professional)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProfessionals([...selectedProfessionals, professional]);
                              } else {
                                setSelectedProfessionals(selectedProfessionals.filter(p => p !== professional));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{professional}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtre pelos status:
                    </label>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedStatus.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStatus([...selectedStatus, status]);
                              } else {
                                setSelectedStatus(selectedStatus.filter(s => s !== status));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {(selectedServices.length > 0 || selectedProfessionals.length > 0 || selectedStatus.length > 0) && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filtros ativos:</span>
                    <button
                      onClick={() => {
                        setSelectedServices([]);
                        setSelectedProfessionals([]);
                        setSelectedStatus([]);
                      }}
                      className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Limpar todos
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Dados</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Serviço</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Paciente</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Duração</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Profissionais</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Observações</th>
                    <th className="w-px"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      onClick={() => setEditingAppointment(appointment)}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">{appointment.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-6 rounded-full bg-yellow-400"></div>
                          <span className="text-sm text-gray-900">{appointment.service}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{appointment.patient}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{appointment.duration}</td>
                      <td className="py-3 px-4">
                        <select 
                          className="w-full text-sm border-0 bg-transparent focus:ring-2 focus:ring-violet-500 rounded-lg"
                          defaultValue={appointment.status}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option>Confirmado</option>
                          <option>Pendente</option>
                          <option>Não compareceu</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: appointment.professionalColor }}>
                          {appointment.professional}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(appointment);
                          }}
                        >
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                      <td className="py-3 px-4 relative">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === appointment.id ? null : appointment.id);
                          }}
                        >
                          <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                        </button>
                        {openMenuId === appointment.id && (
                          <DropdownMenu
                            onClose={() => setOpenMenuId(null)}
                            onActivityLog={() => handleActivityLog(appointment)}
                            onRemoveProfessional={() => handleRemoveProfessional(appointment.id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 