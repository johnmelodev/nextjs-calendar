'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from '@phosphor-icons/react';

export default function PatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: 'Felipe',
    lastName: '',
    birthDate: '',
    cpf: '23490118870',
    email: '',
    phone: ''
  });

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      // Aqui você implementaria a lógica de deleção
      router.back();
    }
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica de salvamento
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-2xl text-gray-700 font-medium">
              Clientes {'>'} Felipe
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
            >
              <Trash className="w-5 h-5" />
              Deletar Cliente
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-2 gap-6 max-w-4xl">
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
          </div>
        </div>
      </div>
    </div>
  );
} 