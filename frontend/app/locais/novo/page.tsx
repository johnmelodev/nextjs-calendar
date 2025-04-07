'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LocationForm from '../../components/LocationForm';
import WorkingHoursForm from '../../components/WorkingHoursForm';
import { ArrowLeft } from '@phosphor-icons/react';

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
          ? 'text-violet-600 border-b-2 border-violet-600'
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
    <div className="p-6 bg-gray-100">
      <div className="mb-8">
        <Link href="/locais" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} />
          Voltar para Locais
        </Link>
        <h1 className="text-2xl font-medium text-gray-900 mt-4">Novo Local</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <Tab
              label="Informações"
              isActive={activeTab === 'info'}
              onClick={() => setActiveTab('info')}
            />
            <Tab
              label="Horário de Trabalho"
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