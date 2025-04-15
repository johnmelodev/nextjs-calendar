'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, PencilSimple, Trash, MagnifyingGlass } from '@phosphor-icons/react';
import { usePatientStore, PatientInput, Patient } from '../stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente de modal para adicionar/editar paciente
interface PatientModalProps {
  onClose: () => void;
  onSave: (data: PatientInput) => void;
  initialValues?: Patient;
  isEditing?: boolean;
}

const PatientModal = ({ onClose, onSave, initialValues, isEditing = false }: PatientModalProps) => {
  const [formData, setFormData] = useState<PatientInput>({
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    cpf: initialValues?.cpf || '',
    birthDate: initialValues?.birthDate || null
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
    
    onSave(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {isEditing ? 'Editar paciente' : 'Adicionar paciente'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className={`w-full text-sm border-0 ring-1 ${errors.firstName ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
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
              className={`w-full text-sm border-0 ring-1 ${errors.lastName ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
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
              className={`w-full text-sm border-0 ring-1 ${errors.cpf ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
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
              className={`w-full text-sm border-0 ring-1 ${errors.email ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
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
                className={`flex-1 text-sm border-0 ring-1 ${errors.phone ? 'ring-red-500' : 'ring-gray-200'} rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PacientesPage() {
  const { patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchPatients(undefined);
  }, [fetchPatients]);

  // Função para pesquisar pacientes
  const handleSearch = () => {
    fetchPatients(searchTerm);
  };

  // Verificar se a tecla Enter foi pressionada na pesquisa
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Função para adicionar um novo paciente
  const handleAddPatient = async (data: PatientInput) => {
    try {
      await createPatient(data);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };

  // Função para editar um paciente
  const handleEditPatient = async (data: PatientInput) => {
    if (!selectedPatient) return;
    
    try {
      await updatePatient(selectedPatient.id, data);
      setShowModal(false);
      setSelectedPatient(undefined);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para abrir o modal de adição
  const openAddModal = () => {
    setSelectedPatient(undefined);
    setIsEditing(false);
    setShowModal(true);
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

  // Função para formatar a data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yy', { locale: ptBR });
    } catch (e) {
      return '-';
    }
  };

  // Função para salvar (criar ou atualizar) um paciente
  const handleSavePatient = (data: PatientInput) => {
    if (isEditing && selectedPatient) {
      handleEditPatient(data);
    } else {
      handleAddPatient(data);
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
          <h1 className="text-2xl text-gray-700 font-medium">Pacientes</h1>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Paciente
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Pesquisar Paciente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <MagnifyingGlass 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm"
            >
              Buscar
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-5 text-sm font-medium text-gray-500">
              <div className="col-span-2 px-2">Nome</div>
              <div className="px-2">N° de Atendimentos</div>
              <div className="px-2">Último Atendimento</div>
              <div className="px-2">Criado</div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {patients.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Nenhum paciente encontrado
              </div>
            ) : (
              patients.map(patient => (
                <div key={patient.id} className="hover:bg-gray-50">
                  <div className="py-3 px-4 grid grid-cols-5 items-center">
                    <div className="col-span-2 flex items-center">
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white"
                        style={{ backgroundColor: patient.color }}
                      >
                        {patient.initials}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.appointments || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.lastAppointment ? formatDate(patient.lastAppointment) : '-'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-between">
                      <span>{formatDate(patient.createdAt)}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openEditModal(patient)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <PatientModal
          onClose={() => setShowModal(false)}
          onSave={handleSavePatient}
          initialValues={selectedPatient}
          isEditing={isEditing}
        />
      )}
    </div>
  );
} 