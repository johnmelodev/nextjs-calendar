'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '../../stores/locationStore';
import LocationForm from '../../components/LocationForm';
import WorkingHoursForm from '../../components/WorkingHoursForm';
import Link from 'next/link';

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

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isActive
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function LocationDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'info' | 'hours'>('info');
  const { locations, loading, error, fetchLocations, updateLocation } = useLocationStore();
  const [location, setLocation] = useState<Location | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async (data: Partial<Location>) => {
    setIsSaving(true);
    try {
      await updateLocation(params.id, data);
      // Atualiza os dados locais após salvar
      fetchLocations();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!location) {
    return <div className="text-center p-4">Local não encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/locais" className="hover:text-gray-700">
            Locais
          </Link>
          <span>{'>'}</span>
          <span className="text-gray-900">{location.name}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            <Tab
              label="Informações"
              isActive={activeTab === 'info'}
              onClick={() => setActiveTab('info')}
            />
            <Tab
              label="Horário de Atendimento"
              isActive={activeTab === 'hours'}
              onClick={() => setActiveTab('hours')}
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' ? (
            <LocationForm
              initialData={location}
              onSuccess={() => fetchLocations()}
            />
          ) : (
            <WorkingHoursForm
              initialData={location.workingHours}
              onChange={(workingHours) => handleSave({ workingHours })}
            />
          )}
        </div>
      </div>
    </div>
  );
} 