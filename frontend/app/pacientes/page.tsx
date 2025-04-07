'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, DotsThree, MagnifyingGlass } from '@phosphor-icons/react';
import { usePatientStore, PatientInput } from '../stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente de modal para adicionar paciente
type AddPatientModalProps = {
  onClose: () => void;
  onAdd: (data: PatientInput) => void;
};

const AddPatientModal = ({ onClose, onAdd }: AddPatientModalProps) => {
  const [formData, setFormData] = useState<PatientInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'Primeiro nome é obrigatório';
    if (!formData.lastName) newErrors.lastName = 'Sobrenome é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Formatar dados antes de enviar
    const submissionData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, ''),
      cpf: formData.cpf.replace(/\D/g, '')
    };
    
    onAdd(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o clique fora do modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-6">Adicionar paciente</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primeiro Nome<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Primeiro Nome"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sobrenome<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Sobrenome"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleChange}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="CPF"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
              {errors.cpf && (
                <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail"
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone<span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center border-0 ring-1 ring-gray-200 rounded-l-lg px-3 bg-gray-50">
                  <span className="flex items-center">
                    <img src="https://flagcdn.com/w20/br.png" alt="BR" className="h-4 w-6 mr-1" />
                    +55
                  </span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Número de Telefone"
                  className="flex-1 text-sm border-0 ring-1 ring-gray-200 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700"
            >
              Adicionar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PacientesPage() {
  const { patients, loading, error, fetchPatients, createPatient, deletePatient } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Carregar dados ao montar o componente
  useEffect(() => {
    console.log("Tentando buscar pacientes...");
    
    fetchPatients()
      .then(() => console.log("Pacientes carregados com sucesso!"))
      .catch(err => console.error("Erro ao buscar pacientes:", err));
  }, [fetchPatients]);

  // Função para adicionar um novo paciente
  const handleAddPatient = async (data: PatientInput) => {
    try {
      await createPatient(data);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };

  // Função para excluir um paciente
  const handleDeletePatient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await deletePatient(id);
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
      }
    }
  };

  // Função para alternar o menu de ações
  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Função para formatar a data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yy', { locale: ptBR });
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-6 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Pacientes</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center text-sm hover:bg-violet-700"
          >
            <PlusCircle className="mr-2" size={20} />
            Adicionar Paciente
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Pesquisar Paciente"
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchPatients(searchTerm)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">N° de Atendimentos</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Último Atendimento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Criado</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {patient.initials}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {patient.appointments || 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {patient.lastAppointment ? formatDate(patient.lastAppointment) : '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(patient.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-right relative">
                    <button
                      onClick={() => toggleMenu(patient.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <DotsThree size={24} weight="bold" />
                    </button>
                    
                    {openMenuId === patient.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                        <div className="py-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            Excluir
                          </button>
                        </div>
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
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPatient}
        />
      )}
    </div>
  );
} 