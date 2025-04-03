'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Clock, Briefcase, PencilSimple, Trash } from '@phosphor-icons/react';

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

// Mock data dos serviços
const mockServices = {
  consultas: [
    { id: 1, name: 'C. Clinica Nutro (Avulsa)', duration: '40min', color: '#84cc16', initials: 'CC' },
    { id: 2, name: 'C. Completa (Nutro+Nutri+Treino) (Avulsa) (1a Vez)', duration: '1h', color: '#ef4444', initials: 'CC' },
    { id: 3, name: 'C. Nutri (Dieta)', duration: '40min', color: '#1e40af', initials: 'CN' },
    { id: 4, name: 'C. Nutri+Treino (Prof. Gianolla)', duration: '40min', color: '#f59e0b', initials: 'CN' },
    { id: 5, name: 'C. Nutro+Nutri', duration: '40min', color: '#f59e0b', initials: 'CN' },
    { id: 6, name: 'Consulta Completa (Padrão)', duration: '40min', color: '#84cc16', initials: 'CC' },
    { id: 7, name: 'C. Clinica Nutro (Avulsa) Cópia', duration: '40min', color: '#84cc16', initials: 'CC' }
  ],
  retorno: [
    { id: 8, name: 'Plano Semestral Completo (Nutro+Nutri+Treino) - Retorno', duration: '20min', color: '#ec4899', initials: 'PS' },
    { id: 9, name: 'R. Clinico Nutrologia (Avulsa - Dr. Pizzini)', duration: '20min', color: '#84cc16', initials: 'RC' },
    { id: 10, name: 'R. Completo (Nutro + Nutri + Treino) (Avulsa)', duration: '20min', color: '#ef4444', initials: 'RC' },
    { id: 11, name: 'R. Nutri (Dieta)', duration: '20min', color: '#1e40af', initials: 'RN' },
    { id: 12, name: 'R. Nutri+Treino (Prof. Gianolla)', duration: '20min', color: '#f59e0b', initials: 'RN' },
    { id: 13, name: 'R. Nutro+Nutri', duration: '20min', color: '#f59e0b', initials: 'RN' }
  ],
  planoAnual: [
    { id: 14, name: 'Plano Anual Completo (Nutro+Nutri+Treino) - Consulta', duration: '30min', color: '#ef4444', initials: 'PA' }
  ],
  planoSemestral: [
    { id: 15, name: 'Plano Semestral Completo (Nutro+Nutri+Treino) - Consulta', duration: '30min', color: '#ec4899', initials: 'PS' },
    { id: 16, name: 'Plano Semestral Nutro - Consulta', duration: '30min', color: '#84cc16', initials: 'PS' }
  ],
  planoAnualSemestral: [
    { id: 17, name: 'Plano Anual Completo (Nutro+Nutri+Treino) - Retorno', duration: '20min', color: '#ef4444', initials: 'PA' },
    { id: 18, name: 'Plano Semestral Nutro - Retorno', duration: '20min', color: '#84cc16', initials: 'PS' }
  ],
  restricaoHorario: [
    { id: 19, name: 'Restrição de Horário', duration: '1h', color: '#1e293b', initials: 'RD' }
  ],
  pericia: [
    { id: 20, name: 'Perícia DPNE', duration: '1h', color: '#1e40af', initials: 'PD' },
    { id: 21, name: 'Perícia/Vistoria - Assistente Técnico', duration: '1h', color: '#a855f7', initials: 'PV' },
    { id: 22, name: 'classe', duration: '30min', color: '#ef4444', initials: 'C' }
  ]
};

export default function ProfessionalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'novo';
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'hours'>('info');
  const [formData, setFormData] = useState({
    firstName: 'Diego',
    lastName: 'Menezes',
    email: 'diego@hellodoc.com.br',
    phone: '',
    location: ''
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    tuesday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    wednesday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    thursday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    friday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    saturday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
    sunday: { isOpen: false, periods: [] }
  });

  const handleAddPeriod = (dayId: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        periods: [...prev[dayId].periods, { start: '09:00', end: '18:00' }]
      }
    }));
  };

  const handleRemovePeriod = (dayId: string, periodIndex: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        periods: prev[dayId].periods.filter((_, index) => index !== periodIndex)
      }
    }));
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-2xl text-gray-700 font-medium">
              Profissionais {isNew ? '> Novo profissional' : '> Diego Menezes'}
            </h1>
          </div>
          <button
            onClick={() => {
              // Salvar alterações
              router.back();
            }}
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Selecione uma localização</option>
                    <option value="1">Clínica Dr. Fábio Pizzini</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                {Object.entries(mockServices).map(([category, services]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()} ({services.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                              style={{ backgroundColor: service.color }}
                            >
                              {service.initials}
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-900">{service.name}</h4>
                              <p className="text-xs text-gray-500">{service.duration}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-6">
                {weekDays.map((day) => (
                  <div key={day.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">{day.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={workingHours[day.id].isOpen}
                          onChange={(e) => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.id]: {
                                ...prev[day.id],
                                isOpen: e.target.checked
                              }
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    {workingHours[day.id].isOpen && (
                      <div className="space-y-3">
                        {workingHours[day.id].periods.map((period, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Iniciar</span>
                              <input
                                type="time"
                                value={period.start}
                                onChange={(e) => handlePeriodChange(day.id, index, 'start', e.target.value)}
                                className="text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Concluir</span>
                              <input
                                type="time"
                                value={period.end}
                                onChange={(e) => handlePeriodChange(day.id, index, 'end', e.target.value)}
                                className="text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemovePeriod(day.id, index)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => handleAddPeriod(day.id)}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                          >
                            + Adicionar período
                          </button>
                          <button
                            onClick={() => handleApplyToAllDays(day.id)}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                          >
                            + Aplicar para outros dias
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