'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, MagnifyingGlass, X, Clock, UserPlus, DotsThree, Activity, UserMinus, Trash, WarningCircle } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointmentStore, Appointment, AppointmentInput } from '../stores/appointmentStore';
import { useServiceStore } from '../stores/serviceStore';
import { useLocationStore } from '../stores/locationStore';
import { useProfessionalStore, Professional } from '../stores/professionalStore';
import { usePatientStore, Patient } from '../stores/patientStore';

// Tipo para os dados mockados que serão usados durante a transição
interface MockAppointment {
  id: number;
  date: string;
  service: string;
  patient: string;
  duration: string;
  status: string;
  professional: string;
  professionalColor: string;
}

// Tipo para a exibição na UI (combinando dados reais e mockados)
interface AppointmentDisplay {
  id: string | number;
  date: string;
  service: string;
  patient: string;
  duration: string;
  status: string;
  professional: string;
  professionalColor: string;
}

// Mock de dados para exemplo - será removido quando conectarmos com a API
const mockAppointments: MockAppointment[] = [
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
const services = Array.from(new Set(mockAppointments.map(app => app.service))).filter(Boolean);
// Lista de profissionais únicos
const professionals = Array.from(new Set(mockAppointments.map(app => app.professional)));
// Lista de status em ordem específica
const statusOptions = ['Confirmado', 'Pendente', 'Não compareceu'];

interface AppointmentDetailsProps {
  appointment: AppointmentDisplay;
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
  const { services, fetchServices } = useServiceStore();
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const { locations, fetchLocations } = useLocationStore();
  const { patients, fetchPatients } = usePatientStore();
  const { fetchAppointments, createAppointment } = useAppointmentStore();
  const [formData, setFormData] = useState({
    serviceId: '',
    professionalId: '',
    locationId: '',
    date: '',
    time: '',
    clientName: '',
    clientPhone: '',
    patientId: '',
    notes: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpar erros/sucesso quando o componente é desmontado
  useEffect(() => {
    return () => {
      setFormError(null);
      setFormSuccess(null);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchServices();
        await fetchLocations();
        await fetchProfessionals();
        await fetchPatients();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, [fetchServices, fetchLocations, fetchProfessionals, fetchPatients]);

  // Atualizar nome e telefone do cliente quando um paciente for selecionado
  useEffect(() => {
    if (formData.patientId) {
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          clientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
          clientPhone: selectedPatient.phone
        }));
      }
    }
  }, [formData.patientId, patients]);

  const handleFormChange = (field: string, value: string) => {
    // Limpar mensagens de erro quando o usuário começa a digitar
    if (formError) {
      setFormError(null);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Obtém o serviço selecionado para calcular a duração
      const selectedService = services.find(service => service.id === formData.serviceId);
      
      if (!selectedService) {
        setFormError('Serviço selecionado não encontrado');
        setIsSubmitting(false);
        return;
      }
      
      // Calcula a data e hora de término com base na duração do serviço
      const endTimeStr = calculateEndTime(formData.date, formData.time, selectedService.duration);
      
      // Cria o objeto de agendamento no formato esperado pela API
      const appointmentData: AppointmentInput = {
        serviceId: formData.serviceId,
        professionalId: formData.professionalId,
        locationId: formData.locationId,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        endTime: endTimeStr,
        notes: formData.notes || '',
        status: "scheduled"
      };
      
      console.log('Criando agendamento:', appointmentData);
      
      // Envia para a API
      const createdAppointment = await createAppointment(appointmentData);
      
      // Recarrega os agendamentos para mostrar o novo registro
      await fetchAppointments();
      
      // Mostra mensagem de sucesso
      setFormSuccess('Agendamento criado com sucesso!');
      
      // Fecha o modal após um breve atraso para mostrar a mensagem de sucesso
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setFormError('Ocorreu um erro ao criar o agendamento. Tente novamente.');
      setIsSubmitting(false);
    }
  };
  
  const validateForm = () => {
    if (!formData.serviceId) {
      setFormError('Selecione um serviço');
      return false;
    }
    
    if (!formData.professionalId) {
      setFormError('Selecione um profissional');
      return false;
    }
    
    if (!formData.locationId) {
      setFormError('Selecione um local');
      return false;
    }
    
    if (!formData.date) {
      setFormError('Selecione uma data');
      return false;
    }
    
    if (!formData.time) {
      setFormError('Selecione um horário');
      return false;
    }
    
    if (!formData.patientId) {
      setFormError('Selecione um paciente');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  // Calcular a hora de término com base na duração do serviço
  const calculateEndTime = (date: string, startTime: string, durationMinutes: number): string => {
    if (!date || !startTime || !durationMinutes) {
      throw new Error('Dados insuficientes para calcular o horário de término');
    }
    
    try {
      const startDateTime = new Date(`${date}T${startTime}`);
      if (isNaN(startDateTime.getTime())) {
        throw new Error('Data ou hora de início inválida');
      }
      
      // Adiciona a duração em minutos
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
      return endDateTime.toISOString();
    } catch (error) {
      console.error('Erro ao calcular horário de término:', error);
      throw new Error('Não foi possível calcular o horário de término');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-start justify-center pt-10 pb-10 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-5 w-[480px] max-h-[80vh] overflow-y-auto relative mx-4" onClick={e => e.stopPropagation()}>
        {showAddClientForm && (
          <AddClientForm onClose={() => setShowAddClientForm(false)} />
        )}

        <div className="sticky top-0 flex justify-between items-center bg-white py-2 mb-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Adicionar agendamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 p-2 rounded-md mb-4 text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <WarningCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-red-800">{formError}</h3>
              </div>
            </div>
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-50 p-2 rounded-md mb-4 text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-green-800">{formSuccess}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => handleFormChange('serviceId', e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Selecione o serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration}min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profissionais<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.professionalId}
                onChange={(e) => handleFormChange('professionalId', e.target.value)}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Selecione</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.firstName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => handleFormChange('locationId', e.target.value)}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Selecione</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleFormChange('time', e.target.value)}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleFormChange('patientId', e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Selecione o paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              rows={3}
              placeholder="Observações ou instruções"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adicionando...
                </>
              ) : (
                'Adicionar Agendamento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditAppointmentFormProps {
  appointment: AppointmentDisplay;
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
  appointment: AppointmentDisplay;
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
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDisplay | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentDisplay | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedActivityAppointment, setSelectedActivityAppointment] = useState<AppointmentDisplay | null>(null);
  const [mockData, setMockData] = useState<MockAppointment[]>(mockAppointments);

  // Dados da API
  const { appointments: apiAppointments, fetchAppointments } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();
  const { locations, fetchLocations } = useLocationStore();
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const { patients, fetchPatients } = usePatientStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchServices();
        await fetchLocations();
        await fetchProfessionals();
        await fetchPatients();
        await fetchAppointments();
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchServices, fetchLocations, fetchProfessionals, fetchPatients, fetchAppointments]);

  // Mapeia os dados da API para o formato usado na UI
  const mappedAppointments = apiAppointments.map((appointment: Appointment): AppointmentDisplay => {
    const service = services.find(s => s.id === appointment.serviceId);
    const professional = professionals.find(p => p.id === appointment.professionalId);
    
    const startDate = new Date(appointment.startTime);
    const endDate = new Date(appointment.endTime);
    const durationMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
    
    return {
      id: appointment.id,
      date: format(startDate, 'dd/MM/yy - HH:mm'),
      service: service?.name || 'Serviço não encontrado',
      patient: appointment.clientName,
      duration: `${durationMinutes}min`,
      status: appointment.status === 'scheduled' ? 'Pendente' : 
              appointment.status === 'completed' ? 'Confirmado' : 
              appointment.status === 'no_show' ? 'Não compareceu' : 'Cancelado',
      professional: professional ? `${professional.firstName.charAt(0)}${professional.lastName.charAt(0)}` : '',
      professionalColor: professional?.color || '#CCCCCC'
    };
  });

  // Combina os dados mockados com os dados da API para facilitar a transição
  const allAppointments: AppointmentDisplay[] = [...mappedAppointments];

  // Função para filtrar os agendamentos
  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedServices.length === 0 || selectedServices.includes(appointment.service);
    const matchesProfessional = selectedProfessionals.length === 0 || selectedProfessionals.includes(appointment.professional);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(appointment.status);
    
    return matchesSearch && matchesService && matchesProfessional && matchesStatus;
  });

  const handleActivityLog = (appointment: AppointmentDisplay) => {
    setSelectedActivityAppointment(appointment);
    setShowActivityLog(true);
    setOpenMenuId(null);
  };

  const handleRemoveProfessional = (appointmentId: string | number) => {
    // Para dados mockados
    if (typeof appointmentId === 'number') {
      setMockData(prev => prev.map(app => 
        app.id === appointmentId 
          ? { ...app, professional: '', professionalColor: '' }
          : app
      ));
    }
    // Para dados da API, a implementação completa viria aqui
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
                        <label key={service.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedServices.includes(service.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service.name]);
                              } else {
                                setSelectedServices(selectedServices.filter(s => s !== service.name));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{service.name}</span>
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
                        <label key={professional.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedProfessionals.includes(professional.firstName + ' ' + professional.lastName)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProfessionals([...selectedProfessionals, professional.firstName + ' ' + professional.lastName]);
                              } else {
                                setSelectedProfessionals(selectedProfessionals.filter(p => p !== professional.firstName + ' ' + professional.lastName));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{professional.firstName} {professional.lastName}</span>
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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin mb-4 h-12 w-12 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Carregando agendamentos...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece adicionando um novo agendamento.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    Novo Agendamento
                  </button>
                </div>
              </div>
            ) : (
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
                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: typeof appointment.id === 'string' ? services.find(s => s.id === (apiAppointments.find(a => a.id === appointment.id)?.serviceId))?.color || '#CCCCCC' : '#CCCCCC' }}></div>
                            <span className="text-sm text-gray-900">{appointment.service}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{appointment.patient}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{appointment.duration}</td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                            appointment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 