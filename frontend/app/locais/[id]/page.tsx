'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Clock, PencilSimple, Trash } from '@phosphor-icons/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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

const defaultLocation = {
  lat: -23.5015123,
  lng: -47.4574123
};

const weekDays = [
  { id: 'monday', label: 'Segunda-Feira' },
  { id: 'tuesday', label: 'Terça-Feira' },
  { id: 'wednesday', label: 'Quarta-Feira' },
  { id: 'thursday', label: 'Quinta-Feira' },
  { id: 'friday', label: 'Sexta-Feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

export default function LocationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'novo';
  const [activeTab, setActiveTab] = useState<'info' | 'hours'>('info');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
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
              Locais {isNew ? '> Novo local' : '> Clínica Dr. Fábio Pizzini'}
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
                onClick={() => setActiveTab('hours')}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'hours'
                    ? 'text-violet-600 border-violet-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horário de Atendimento
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'info' ? (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="Nome do local"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="h-[300px] w-full rounded-lg overflow-hidden">
                  <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={defaultLocation}
                      zoom={15}
                    >
                      <Marker position={defaultLocation} />
                    </GoogleMap>
                  </LoadScript>
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
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-24 text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    placeholder="Descrição do local"
                  />
                </div>
              </div>
            ) : (
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