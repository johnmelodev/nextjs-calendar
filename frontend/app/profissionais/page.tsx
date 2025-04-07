'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, DotsThree, PencilSimple, Power, Trash, Key } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useProfessionalStore } from '../stores/professionalStore';
import { useLocationStore } from '../stores/locationStore';
import { useServiceStore } from '../stores/serviceStore';

// Componente para o modal de adicionar profissional
interface AddProfessionalModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
  locations: any[];
  services: any[];
}

const AddProfessionalModal = ({ onClose, onAdd, locations, services }: AddProfessionalModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    services: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para validar o formulário
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'O primeiro nome é obrigatório';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'O sobrenome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'O telefone é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
    }
  };

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
              className={`w-full text-sm border-0 ring-1 ${errors.firstName ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              placeholder="Primeiro Nome"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`w-full text-sm border-0 ring-1 ${errors.lastName ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              placeholder="Sobrenome"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full text-sm border-0 ring-1 ${errors.email ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              placeholder="E-mail"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
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
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                className={`w-full text-sm border-0 ring-1 ${errors.phone ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
                placeholder="Número de Telefone"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
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
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
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
              size={5}
            >
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
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
                if (validate()) {
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
  const router = useRouter();
  const { 
    professionals, 
    loading, 
    error, 
    fetchProfessionals, 
    createProfessional, 
    deleteProfessional 
  } = useProfessionalStore();
  const { locations, fetchLocations } = useLocationStore();
  const { services, fetchServices } = useServiceStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchProfessionals();
    fetchLocations();
    fetchServices();
  }, [fetchProfessionals, fetchLocations, fetchServices]);

  // Função para adicionar um novo profissional
  const handleAddProfessional = async (data: any) => {
    try {
      await createProfessional(data);
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
    }
  };

  // Função para excluir um profissional
  const handleDeleteProfessional = async (id: string) => {
    try {
      await deleteProfessional(id);
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
    }
  };

  // Função para alternar o status do profissional
  const handleToggleStatus = (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'disponivel' ? 'indisponivel' : 'disponivel';
      useProfessionalStore.getState().updateProfessional(id, { status: newStatus });
    } catch (error) {
      console.error('Erro ao alterar status do profissional:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-6 text-red-600">Erro: {error}</div>;
  }

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
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: professional.color }}
                      >
                        {professional.initials}
                      </div>
                      <span className="text-sm text-gray-900">{professional.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{professional.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{professional.phone || '-'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        professional.status === 'disponivel'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {professional.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="py-4 px-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === professional.id ? null : professional.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <DotsThree weight="bold" className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === professional.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-10">
                        <button
                          onClick={() => router.push(`/profissionais/${professional.id}`)}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PencilSimple className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleStatus(professional.id, professional.status)}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Power className="w-4 h-4" />
                          {professional.status === 'disponivel' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDeleteProfessional(professional.id)}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Excluir
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
          locations={locations}
          services={services}
        />
      )}
    </div>
  );
} 