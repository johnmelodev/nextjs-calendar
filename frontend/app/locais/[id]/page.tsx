'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '../../stores/locationStore';
import LocationForm from '../../components/LocationForm';
import WorkingHoursForm from '../../components/WorkingHoursForm';
import Link from 'next/link';
import { ArrowLeft, Info, Clock } from '@phosphor-icons/react';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      periods: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  isActive: boolean;
  city: string;
  state: string;
  zipCode: string;
}

export default function LocationDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'info' | 'hours'>('info');
  const { locations, loading, error, fetchLocations, updateLocation } = useLocationStore();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (locations.length > 0) {
      const currentLocation = locations.find((loc) => loc.id === params.id);
      if (currentLocation) {
        setLocation(currentLocation);
      }
    }
  }, [locations, params.id]);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Erro: {error}</div>;
  }

  if (!location) {
    return <div className="p-6 text-gray-600">Local não encontrado</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-8">
        <Link href="/locais" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} />
          Voltar para Locais
        </Link>
        <h1 className="text-2xl font-medium text-gray-900 mt-4">{location.name}</h1>
      </div>

      <div className="grid grid-cols-[280px,1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-gray-700">Seções</h2>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'info' ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Info size={18} />
              Informações
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'hours' ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock size={18} />
              Horário de Atendimento
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-medium text-gray-700">
                {activeTab === 'info' ? 'Informações do Local' : 'Horário de Trabalho'}
              </h2>
            </div>

            {activeTab === 'info' ? (
              <LocationForm
                initialData={location}
                onSuccess={() => fetchLocations()}
              />
            ) : (
              <WorkingHoursForm
                initialData={location.workingHours}
                onChange={async (workingHours) => {
                  try {
                    await updateLocation(location.id, {
                      ...location,
                      workingHours
                    });
                    await fetchLocations();
                  } catch (error) {
                    console.error('Erro ao atualizar horários:', error);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 