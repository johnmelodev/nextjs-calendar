'use client';

import { useEffect } from 'react';
import { useLocationStore } from '../stores/locationStore';
import Link from 'next/link';
import { PlusCircle, PencilSimple, Trash } from '@phosphor-icons/react';

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
    return <div className="p-6">Carregando...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Locais</h1>
        <Link
          href="/locais/novo"
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          <PlusCircle className="h-5 w-5" weight="fill" />
          Adicionar Local
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-gray-700">
              Todos os locais ({locations.length})
            </h2>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-4">Nome</th>
                <th className="pb-4">Endereço</th>
                <th className="pb-4">Telefone</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {locations.map((location) => (
                <tr key={location.id} className="border-t border-gray-200">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 font-medium text-sm">
                          {location.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      {location.name}
                    </div>
                  </td>
                  <td className="py-4">
                    <div>{location.address}</div>
                    <div className="text-sm text-gray-500">
                      {location.city} - {location.state}, {location.zipCode}
                    </div>
                  </td>
                  <td className="py-4">{location.phone}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/locais/${location.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <PencilSimple size={16} />
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
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
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