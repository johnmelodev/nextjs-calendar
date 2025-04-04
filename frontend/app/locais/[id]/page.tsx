'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '../../stores/locationStore';
import LocationForm from '../../components/LocationForm';
import WorkingHoursForm from '../../components/WorkingHoursForm';
import Link from 'next/link';
import { IoInformationCircleOutline } from "react-icons/io5";
import { BiTime } from "react-icons/bi";

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
  const { locations, loading, error, fetchLocations } = useLocationStore();
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
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!location) {
    return <div className="text-center p-4">Local não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/locais" className="text-gray-500 hover:text-gray-700">
            Locais
          </Link>
          <span className="text-gray-500">{'>'}</span>
          <span className="text-gray-900">{location.name}</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'info'
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IoInformationCircleOutline className="mr-3 h-5 w-5" />
                Informações
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'hours'
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BiTime className="mr-3 h-5 w-5" />
                Horário de Atendimento
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'info' ? 'Informações' : 'Horário de Trabalho'}
                  </h1>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  >
                    Salvar
                  </button>
                </div>

                {activeTab === 'info' ? (
                  <LocationForm
                    initialData={location}
                    onSuccess={() => fetchLocations()}
                  />
                ) : (
                  <WorkingHoursForm
                    initialData={location.workingHours}
                    onChange={(workingHours) => {
                      // Implementar atualização dos horários
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 