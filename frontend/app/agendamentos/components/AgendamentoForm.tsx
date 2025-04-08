'use client';

import React, { useState, useEffect } from 'react';
import { WarningCircle, X } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useServiceStore } from '../../stores/serviceStore';
import { useProfessionalStore, Professional } from '../../stores/professionalStore';
import { useLocationStore } from '../../stores/locationStore';
import { usePatientStore } from '../../stores/patientStore';
import { useAppointmentStore, AppointmentInput } from '../../stores/appointmentStore';

// Interface estendida que inclui patientId para seleção do paciente
interface ExtendedAppointmentInput extends Partial<AppointmentInput> {
  patientId?: string;
  date?: string;
  time?: string;
}

interface AgendamentoFormProps {
  initialData?: ExtendedAppointmentInput;
  appointmentId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const AgendamentoForm: React.FC<AgendamentoFormProps> = ({ 
  initialData, 
  appointmentId, 
  onClose, 
  onSuccess 
}) => {
  const { services, fetchServices } = useServiceStore();
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const { locations, fetchLocations } = useLocationStore();
  const { patients, fetchPatients } = usePatientStore();
  const { fetchAppointments, createAppointment, updateAppointment } = useAppointmentStore();
  const [availableProfessionals, setAvailableProfessionals] = useState<Professional[]>([]);

  const defaultFormData: ExtendedAppointmentInput = {
    serviceId: '',
    professionalId: '',
    locationId: '',
    clientName: '',
    clientPhone: '',
    notes: '',
    patientId: '',
    date: '',
    time: '',
    status: 'scheduled'
  };

  const [formData, setFormData] = useState<ExtendedAppointmentInput>(initialData || defaultFormData);
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

  // Filtrar profissionais com base no serviço selecionado
  useEffect(() => {
    if (formData.serviceId) {
      // Filtra os profissionais que podem realizar o serviço selecionado
      const profsForService = professionals.filter(prof => {
        // Se o profissional não tem serviços definidos ou a lista está vazia, consideramos que ele não pode realizar o serviço
        if (!prof.services || prof.services.length === 0) {
          return false;
        }
        
        // Verifica se o serviço selecionado está na lista de serviços do profissional
        return prof.services.some(service => service.id === formData.serviceId);
      });
      
      setAvailableProfessionals(profsForService);
      
      // Se o profissional atualmente selecionado não pode realizar este serviço, limpa a seleção
      if (formData.professionalId && !profsForService.some(p => p.id === formData.professionalId)) {
        setFormData(prev => ({ ...prev, professionalId: '' }));
      }
    } else {
      // Se nenhum serviço está selecionado, mostra todos os profissionais
      setAvailableProfessionals(professionals);
    }
  }, [formData.serviceId, professionals]);

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
      
      // Verifica se o profissional pode realizar este serviço
      const selectedProfessional = professionals.find(p => p.id === formData.professionalId);
      const canProvideService = selectedProfessional?.services?.some(s => s.id === formData.serviceId);
      
      if (!canProvideService) {
        setFormError('Este profissional não pode realizar este serviço');
        setIsSubmitting(false);
        return;
      }
      
      // Calcula a data e hora de término com base na duração do serviço
      const endTimeStr = calculateEndTime(formData.date!, formData.time!, selectedService.duration);
      
      // Cria o objeto de agendamento no formato esperado pela API
      const appointmentData: AppointmentInput = {
        serviceId: formData.serviceId!,
        professionalId: formData.professionalId!,
        locationId: formData.locationId!,
        clientName: formData.clientName!,
        clientPhone: formData.clientPhone!,
        startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        endTime: endTimeStr,
        notes: formData.notes || '',
        status: "scheduled"
      };
      
      console.log(appointmentId ? 'Atualizando agendamento:' : 'Criando agendamento:', appointmentData);
      
      // Envia para a API
      if (appointmentId) {
        await updateAppointment(appointmentId, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      
      // Recarrega os agendamentos para mostrar o novo registro
      await fetchAppointments();
      
      // Mostra mensagem de sucesso
      setFormSuccess(appointmentId ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!');
      
      // Chama a função de sucesso se fornecida
      if (onSuccess) {
        onSuccess();
      }
      
      // Fecha o modal após um breve atraso para mostrar a mensagem de sucesso
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao processar agendamento:', error);
      
      // Verificar se o erro vem da API e tem uma mensagem específica
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError('Ocorreu um erro ao processar o agendamento. Tente novamente.');
      }
      
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
    <div className="bg-white rounded-2xl max-h-[80vh] overflow-y-auto relative">
      <div className="sticky top-0 flex justify-between items-center bg-white py-2 mb-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          {appointmentId ? 'Editar agendamento' : 'Adicionar agendamento'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 p-2 rounded-md mb-3 text-xs">
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
        <div className="bg-green-50 p-2 rounded-md mb-3 text-xs">
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

      <form className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serviços<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.serviceId}
            onChange={(e) => handleFormChange('serviceId', e.target.value)}
            className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
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
              {formData.serviceId && availableProfessionals.length === 0 && (
                <span className="text-xs text-red-500 ml-1">(Nenhum disponível)</span>
              )}
            </label>
            <select
              value={formData.professionalId}
              onChange={(e) => handleFormChange('professionalId', e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
              disabled={!!(formData.serviceId && availableProfessionals.length === 0)}
            >
              <option value="">Selecione</option>
              {(formData.serviceId ? availableProfessionals : professionals).map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.firstName} {professional.lastName}
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
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
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
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
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
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
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
            className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Selecione o paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} - {patient.phone}
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
            className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500"
            rows={2}
            placeholder="Observações ou instruções"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {appointmentId ? 'Salvando...' : 'Adicionando...'}
              </>
            ) : (
              appointmentId ? 'Salvar Alterações' : 'Adicionar Agendamento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoForm; 