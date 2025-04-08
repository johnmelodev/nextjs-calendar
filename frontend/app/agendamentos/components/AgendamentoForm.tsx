'use client';

import { useState, useEffect, FormEvent } from 'react';
import { format, parse, parseISO, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { useServiceStore } from '../../stores/serviceStore';
import { useLocationStore } from '../../stores/locationStore';
import { useProfessionalStore } from '../../stores/professionalStore';
import { usePatientStore } from '../../stores/patientStore';
import { useAppointmentStore, AppointmentInput } from '../../stores/appointmentStore';

// Interface estendida para incluir o patientId para seleção de pacientes
interface ExtendedAppointmentInput extends Partial<AppointmentInput> {
  patientId?: string;
}

interface AgendamentoFormProps {
  closeModal: () => void;
  selectedDate?: Date | null;
  defaultProfessionalId?: string;
}

export default function AgendamentoForm({ closeModal, selectedDate, defaultProfessionalId }: AgendamentoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { services, fetchServices } = useServiceStore();
  const { locations, fetchLocations } = useLocationStore();
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const { patients, fetchPatients } = usePatientStore();
  const { createAppointment, fetchAppointments } = useAppointmentStore();
  
  const initialFormData: ExtendedAppointmentInput = {
    serviceId: '',
    professionalId: defaultProfessionalId || '',
    locationId: '',
    patientId: '',
    clientName: '',
    clientPhone: '',
    startTime: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : '',
    endTime: '',
    notes: '',
    status: 'scheduled'
  };
  
  const [formData, setFormData] = useState<ExtendedAppointmentInput>(initialFormData);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchServices(), 
        fetchLocations(), 
        fetchProfessionals(),
        fetchPatients()
      ]);
    };
    
    loadData();
    
    // Limpeza ao desmontar
    return () => {
      setFormError(null);
      setFormSuccess(null);
    };
  }, [fetchServices, fetchLocations, fetchProfessionals, fetchPatients]);
  
  // Calcular horário de término com base no serviço selecionado
  useEffect(() => {
    if (formData.serviceId && formData.startTime) {
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (selectedService) {
        try {
          const startDate = parseISO(formData.startTime);
          const endDate = addMinutes(startDate, selectedService.duration);
          setFormData(prev => ({
            ...prev,
            endTime: format(endDate, "yyyy-MM-dd'T'HH:mm")
          }));
        } catch (error) {
          console.error('Erro ao calcular o horário de término:', error);
        }
      }
    }
  }, [formData.serviceId, formData.startTime, services]);
  
  // Definir o paciente quando selecionado
  useEffect(() => {
    if (formData.patientId) {
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          clientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
          clientPhone: selectedPatient.phone || ''
        }));
      }
    }
  }, [formData.patientId, patients]);

  // Manipulador do envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.serviceId || !formData.professionalId || !formData.locationId || !formData.startTime) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!formData.patientId && (!formData.clientName || !formData.clientPhone)) {
      setFormError('Informe um paciente cadastrado ou preencha nome e telefone do cliente.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Preparar dados para envio - removendo patientId que não é parte da API
      const appointmentData: AppointmentInput = {
        serviceId: formData.serviceId!,
        professionalId: formData.professionalId!,
        locationId: formData.locationId!,
        clientName: formData.clientName!,
        clientPhone: formData.clientPhone!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        notes: formData.notes || '',
        status: formData.status as "scheduled" | "completed" | "canceled" | "no_show"
      };
      
      // Criar agendamento
      await createAppointment(appointmentData);
      
      // Atualizar lista
      await fetchAppointments();
      
      // Feedback de sucesso
      setFormSuccess('Agendamento criado com sucesso!');
      
      // Fechar modal após 1.5 segundos
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setFormError('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Manipulador de alteração do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpar mensagens de erro quando o usuário começa a digitar
    if (formError) setFormError(null);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
      {/* Mensagem de erro */}
      {formError && (
        <div className="bg-red-50 p-2 rounded-md mb-3 flex items-start gap-2">
          <WarningCircle className="h-4 w-4 text-red-600 mt-0.5" />
          <span className="text-xs text-red-700">{formError}</span>
        </div>
      )}
      
      {/* Mensagem de sucesso */}
      {formSuccess && (
        <div className="bg-green-50 p-2 rounded-md mb-3 flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <span className="text-xs text-green-700">{formSuccess}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Serviços<span className="text-red-500">*</span>
          </label>
          <select
            name="serviceId"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
            value={formData.serviceId}
            onChange={handleFormChange}
            required
          >
            <option value="">Selecione o serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration}min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Profissionais<span className="text-red-500">*</span>
          </label>
          <select
            name="professionalId"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
            value={formData.professionalId}
            onChange={handleFormChange}
            required
          >
            <option value="">Selecione o profissional</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.firstName} {professional.lastName}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Localização<span className="text-red-500">*</span>
          </label>
          <select
            name="locationId"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
            value={formData.locationId}
            onChange={handleFormChange}
            required
          >
            <option value="">Selecione o local</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Data<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startTime"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
              value={formData.startTime ? formData.startTime.split('T')[0] : ''}
              onChange={(e) => {
                const newDate = e.target.value;
                const currentTime = formData.startTime 
                  ? formData.startTime.split('T')[1] 
                  : '09:00';
                setFormData({
                  ...formData,
                  startTime: `${newDate}T${currentTime}`
                });
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Hora<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
              value={formData.startTime ? formData.startTime.split('T')[1] : ''}
              onChange={(e) => {
                const currentDate = formData.startTime 
                  ? formData.startTime.split('T')[0] 
                  : format(new Date(), 'yyyy-MM-dd');
                setFormData({
                  ...formData,
                  startTime: `${currentDate}T${e.target.value}`
                });
              }}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Paciente<span className="text-red-500">*</span>
          </label>
          <select
            name="patientId"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
            value={formData.patientId || ''}
            onChange={handleFormChange}
          >
            <option value="">Selecione o paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} - {patient.phone}
              </option>
            ))}
          </select>
        </div>
        
        {!formData.patientId && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Nome do Cliente<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                value={formData.clientName || ''}
                onChange={handleFormChange}
                placeholder="Nome do cliente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Telefone do Cliente<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="clientPhone"
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                value={formData.clientPhone || ''}
                onChange={handleFormChange}
                placeholder="(00) 00000-0000"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Observações
          </label>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
            placeholder="As observações não são visíveis para o paciente"
            value={formData.notes || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adicionando...
              </>
            ) : "Adicionar Agendamento"}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
} 