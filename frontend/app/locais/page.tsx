'use client';

import { useEffect } from 'react';
import { useLocationStore } from '../stores/locationStore';
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

export default function LocationsPage() {
  const { locations, loading, error, fetchLocations } = useLocationStore();

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Locais</h1>
          <Link
            href="/locais/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar Local
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {location.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{location.address}</div>
                    <div className="text-sm text-gray-500">
                      {location.city} - {location.state}, {location.zipCode}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{location.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/locais/${location.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={async () => {
                        if (window.confirm('Tem certeza que deseja excluir este local?')) {
                          try {
                            await useLocationStore.getState().deleteLocation(location.id);
                            // Atualiza a lista após excluir
                            useLocationStore.getState().fetchLocations();
                          } catch (error) {
                            console.error('Erro ao excluir local:', error);
                            alert('Erro ao excluir local. Tente novamente.');
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 