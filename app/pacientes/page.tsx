'use client';

import { useState } from 'react';
import { PlusCircle, DotsThree, PencilSimple, Power, Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

// Mock data inicial
const initialPatients = [
  {
    id: 1,
    name: 'Cliente',
    initials: 'C',
    color: '#d946ef',
    appointments: 1,
    lastAppointment: '04/10/23',
    createdAt: '02/04/2025'
  },
  {
    id: 2,
    name: 'Felipe',
    initials: 'F',
    color: '#a855f7',
    appointments: 0,
    lastAppointment: null,
    createdAt: '01/04/2025'
  },
  {
    id: 3,
    name: 'Felipe Henrique',
    initials: 'FH',
    color: '#ec4899',
    appointments: 3,
    lastAppointment: '01/04/25',
    createdAt: '01/04/2025'
  },
  {
    id: 4,
    name: 'João Silva',
    initials: 'JS',
    color: '#84cc16',
    appointments: 22,
    lastAppointment: '26/05/25',
    createdAt: '18/02/2025'
  }
];

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddPatientModal = ({ onClose, onAdd }: AddPatientModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    cpf: '',
    email: '',
    phone: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Adicionar paciente
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
              Data de Nascimento
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Data de Nascimento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="CPF"
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
              Adicionar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleAddPatient = (data: any) => {
    const newPatient = {
      id: patients.length + 1,
      name: `${data.firstName} ${data.lastName}`,
      initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      appointments: 0,
      lastAppointment: null,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setPatients([...patients, newPatient]);
  };

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  const filteredPatients = patients.filter(patient => {
    const searchValue = searchTerm.toLowerCase().trim();
    const patientName = patient.name.toLowerCase();
    
    // Verifica se o nome do paciente contém o termo de busca
    return patientName.includes(searchValue);
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-gray-700 font-medium">Pacientes</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Paciente
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-4">
            <input
              type="text"
              placeholder="Pesquisar Paciente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nome</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nº de Atendimentos</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Último Atendimento</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Criado</th>
                <th className="w-px"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: patient.color }}
                      >
                        {patient.initials}
                      </div>
                      <span className="text-sm text-gray-900">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.appointments}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.lastAppointment || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.createdAt}</td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === patient.id ? null : patient.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                    </button>
                    
                    {openMenuId === patient.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            router.push(`/pacientes/${patient.id}`);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PencilSimple className="w-4 h-4" />
                          Editar paciente
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Power className="w-4 h-4" />
                          Desativar paciente
                        </button>
                        <button
                          onClick={() => {
                            handleDeletePatient(patient.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Excluir paciente
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
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPatient}
        />
      )}
    </div>
  );
} 