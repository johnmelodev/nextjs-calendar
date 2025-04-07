'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Clock, Briefcase, PencilSimple, Trash, ArrowLeft } from '@phosphor-icons/react';
import { useProfessionalStore } from '../../stores/professionalStore';
import { useLocationStore } from '../../stores/locationStore';
import { useServiceStore } from '../../stores/serviceStore';

interface Period {
  start: string;
  end: string;
}

interface DaySchedule {
  isOpen: boolean;
  periods: Period[];
}

interface WorkingHours {
  [key: string]: DaySchedule;
}

const weekDays = [
  { id: 'monday', label: 'Segunda-Feira' },
  { id: 'tuesday', label: 'Terça-Feira' },
  { id: 'wednesday', label: 'Quarta-Feira' },
  { id: 'thursday', label: 'Quinta-Feira' },
  { id: 'friday', label: 'Sexta-Feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

// Horário de trabalho padrão para novos profissionais
const defaultWorkingHours: WorkingHours = {
  monday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
  tuesday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
  wednesday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
  thursday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
  friday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
  saturday: { isOpen: false, periods: [] },
  sunday: { isOpen: false, periods: [] }
};

export default function ProfessionalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'novo';
  const { getProfessionalById, createProfessional, updateProfessional } = useProfessionalStore();
  const { locations, fetchLocations } = useLocationStore();
  const { services, fetchServices } = useServiceStore();
  
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'hours'>('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    locationId: ''
  });
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(defaultWorkingHours);

  // Carregar dados ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar localizações e serviços
        await fetchLocations();
        await fetchServices();
        
        // Se não for um novo profissional, carregar dados existentes
        if (!isNew) {
          const professional = await getProfessionalById(params.id);
          if (professional) {
            setFormData({
              firstName: professional.firstName,
              lastName: professional.lastName,
              email: professional.email,
              phone: professional.phone,
              locationId: professional.locationId || ''
            });
            
            // Configurar serviços selecionados
            setSelectedServices(professional.services.map(service => service.id));
            
            // Configurar horários de trabalho
            if (professional.workingHours) {
              setWorkingHours(professional.workingHours);
            }
          }
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        setError(error.message || 'Erro ao carregar dados');
        setLoading(false);
      }
    };
    
    loadData();
  }, [isNew, params.id, getProfessionalById, fetchLocations, fetchServices]);

  // Manipular adição de período
  const handleAddPeriod = (dayId: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        periods: [...prev[dayId].periods, { start: '09:00', end: '18:00' }]
      }
    }));
  };

  // Manipular remoção de período
  const handleRemovePeriod = (dayId: string, periodIndex: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        periods: prev[dayId].periods.filter((_, index) => index !== periodIndex)
      }
    }));
  };

  // Manipular alteração em um período
  const handlePeriodChange = (dayId: string, periodIndex: number, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        periods: prev[dayId].periods.map((period, index) => 
          index === periodIndex ? { ...period, [field]: value } : period
        )
      }
    }));
  };

  // Manipular toggle de dia de trabalho
  const handleDayToggle = (dayId: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        isOpen: !prev[dayId].isOpen
      }
    }));
  };

  // Aplicar horário para todos os dias
  const handleApplyToAllDays = (sourceDayId: string) => {
    const sourceDay = workingHours[sourceDayId];
    const newWorkingHours = { ...workingHours };
    
    weekDays.forEach(day => {
      if (day.id !== sourceDayId) {
        newWorkingHours[day.id] = {
          isOpen: sourceDay.isOpen,
          periods: [...sourceDay.periods]
        };
      }
    });

    setWorkingHours(newWorkingHours);
  };

  // Salvar profissional
  const handleSave = async () => {
    try {
      setLoading(true);
      
      const professionalData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        locationId: formData.locationId || undefined,
        serviceIds: selectedServices,
        workingHours: workingHours
      };
      
      if (isNew) {
        await createProfessional(professionalData);
      } else {
        await updateProfessional(params.id, professionalData);
      }
      
      router.push('/profissionais');
    } catch (error: any) {
      console.error('Erro ao salvar profissional:', error);
      setError(error.message || 'Erro ao salvar profissional');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-6 text-red-600">Erro: {error}</div>;
  }

  const name = isNew ? 'Novo profissional' : `${formData.firstName} ${formData.lastName}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl text-gray-700 font-medium">
              Profissionais {isNew ? '> Novo profissional' : `> ${name}`}
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            Salvar
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-6 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'info'
                    ? 'text-violet-600 border-violet-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Informações
                </div>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'services'
                    ? 'text-violet-600 border-violet-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Serviços atribuídos
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'hours'
                    ? 'text-violet-600 border-violet-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horário de trabalho
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primeiro Nome<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="Primeiro Nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="Sobrenome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="E-mail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-[100px,1fr] gap-2">
                    <select
                      className="text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="+55">🇧🇷 +55</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                      placeholder="Número de Telefone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Selecione uma localização</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Serviços que este profissional pode realizar</h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([...selectedServices, service.id]);
                            } else {
                              setSelectedServices(selectedServices.filter(id => id !== service.id));
                            }
                          }}
                          className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`service-${service.id}`} className="ml-3 block text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-6 rounded-full"
                              style={{ backgroundColor: service.color }}
                            ></div>
                            <span>{service.name}</span>
                            <span className="text-xs text-gray-500">{service.duration}min</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-4 max-w-3xl">
                {weekDays.map(day => (
                  <div key={day.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={workingHours[day.id].isOpen}
                            onChange={() => handleDayToggle(day.id)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{day.label}</span>
                        </label>
                      </div>
                    </div>

                    {workingHours[day.id].isOpen && (
                      <div className="space-y-3">
                        {workingHours[day.id].periods.map((period, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Iniciar
                                </label>
                                <input
                                  type="time"
                                  value={period.start}
                                  onChange={(e) => handlePeriodChange(day.id, index, 'start', e.target.value)}
                                  className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Concluir
                                </label>
                                <input
                                  type="time"
                                  value={period.end}
                                  onChange={(e) => handlePeriodChange(day.id, index, 'end', e.target.value)}
                                  className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                />
                              </div>
                            </div>
                            <div className="flex items-end space-x-2 pb-1">
                              <button
                                type="button"
                                onClick={() => handleRemovePeriod(day.id, index)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              >
                                <Trash size={16} />
                              </button>
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              >
                                <PencilSimple size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex space-x-4 pt-2">
                          <button
                            type="button"
                            onClick={() => handleAddPeriod(day.id)}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                          >
                            + Adicionar período
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyToAllDays(day.id)}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                          >
                            Aplicar para todos os dias
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 