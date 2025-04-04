'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LocationForm from '../../components/LocationForm';
import WorkingHoursForm from '../../components/WorkingHoursForm';

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

export default function NewLocationPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'hours'>('info');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/locais');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/locais" className="hover:text-gray-700">
            Locais
          </Link>
          <span>{'>'}</span>
          <span className="text-gray-900">Novo Local</span>
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
            <LocationForm onSuccess={handleSuccess} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Salve as informações básicas primeiro para configurar os horários de atendimento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 