'use client';

import { useState } from 'react';
import { PlusCircle, DotsThree, PencilSimple, Power, Trash, Key } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

// Mock data inicial
const initialProfessionals = [
  {
    id: 1,
    name: 'Diego Menezes',
    email: 'diego@hellodoc.com.br',
    phone: '',
    initials: 'DM',
    color: '#d946ef',
    status: 'indisponivel'
  },
  {
    id: 2,
    name: 'Dr. Fábio Pizzini',
    email: 'pizzinifabio@gmail.com',
    phone: '15997104500',
    initials: 'DP',
    color: '#ec4899',
    status: 'disponivel'
  },
  {
    id: 3,
    name: 'Fernanda Pereira',
    email: 'fernanda_dydy@hotmail.com',
    phone: '',
    initials: 'FP',
    color: '#a855f7',
    status: 'disponivel'
  },
  {
    id: 4,
    name: 'Prof. Fábio Gianolla',
    email: 'fgianoll@gmail.com',
    phone: '15991083271',
    initials: 'PG',
    color: '#84cc16',
    status: 'disponivel'
  },
  {
    id: 5,
    name: 'Thais Pizzini',
    email: 'tagpizzini@gmail.com',
    phone: '',
    initials: 'TP',
    color: '#ec4899',
    status: 'indisponivel'
  }
];

interface AddProfessionalModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddProfessionalModal = ({ onClose, onAdd }: AddProfessionalModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    services: []
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Adicionar profissional
        </h2>
        
        <form className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços<span className="text-red-500">*</span>
            </label>
            <select
              multiple
              value={formData.services}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, services: options });
              }}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
            >
              <option value="1">C. Clinica Nutro (Avulsa)</option>
              <option value="2">C. Completa (Nutro+Nutri+Treino)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                if (formData.firstName && formData.lastName && formData.email) {
                  onAdd(formData);
                  onClose();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              Adicionar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProfissionaisPage() {
  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const router = useRouter();

  const handleAddProfessional = (data: any) => {
    const newProfessional = {
      id: professionals.length + 1,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      status: 'disponivel'
    };
    setProfessionals([...professionals, newProfessional]);
  };

  const handleDeleteProfessional = (id: number) => {
    setProfessionals(professionals.filter(prof => prof.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-gray-700 font-medium">Profissionais</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Profissional
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nome</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">E-mail</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Telefone</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="w-px"></th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => (
                <tr 
                  key={professional.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: professional.color }}
                      >
                        {professional.initials}
                      </div>
                      <span className="text-sm text-gray-900">{professional.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{professional.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{professional.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        professional.status === 'disponivel'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {professional.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === professional.id ? null : professional.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                    </button>
                    
                    {openMenuId === professional.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            router.push(`/profissionais/${professional.id}`);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PencilSimple className="w-4 h-4" />
                          Editar profissional
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Key className="w-4 h-4" />
                          Redefinir senha
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Power className="w-4 h-4" />
                          Desativar profissional
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteProfessional(professional.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Excluir profissional
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

      {showAddModal && (
        <AddProfessionalModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProfessional}
        />
      )}
    </div>
  );
} 