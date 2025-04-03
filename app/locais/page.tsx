'use client';

import { useState } from 'react';
import { PlusCircle, DotsThree, PencilSimple, Power, Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

// Mock data inicial
const initialLocations = [
  {
    id: 1,
    name: 'Clínica Dr. Fábio Pizzini',
    address: 'Av. Comendador Pereira Inácio, 950 - Jardim Vergueiro, Sorocaba - SP, 18030-005, Brasil',
    phone: '15998719454',
    initials: 'CD',
    color: '#10b981',
    workingHours: {
      monday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      tuesday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      wednesday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      thursday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      friday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      saturday: { isOpen: true, periods: [{ start: '13:00', end: '21:00' }] },
      sunday: { isOpen: false, periods: [] }
    }
  }
];

export default function LocaisPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const router = useRouter();

  const handleDeleteLocation = (id: number) => {
    setLocations(locations.filter(location => location.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-gray-700 font-medium">Locais</h1>
          </div>
          <button
            onClick={() => router.push('/locais/novo')}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Local
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nome</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Endereço</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Telefone</th>
                <th className="w-px"></th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr 
                  key={location.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: location.color }}
                      >
                        {location.initials}
                      </div>
                      <span className="text-sm text-gray-900">{location.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{location.address}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{location.phone}</td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === location.id ? null : location.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                    </button>
                    
                    {openMenuId === location.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            router.push(`/locais/${location.id}`);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PencilSimple className="w-4 h-4" />
                          Editar local
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Power className="w-4 h-4" />
                          Desativar local
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteLocation(location.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Excluir local
                        </button>
                      </div>
                    )}
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