'use client';

import { useState } from 'react';
import { PlusCircle, PencilSimple, Trash, DotsThree, Copy, Power } from '@phosphor-icons/react';

// Mock data inicial
const initialCategories = [
  { id: 1, name: 'Todos os serviços', isDefault: true },
  { id: 2, name: 'Consultas', isDefault: false },
  { id: 3, name: 'Retorno', isDefault: false },
  { id: 4, name: 'Plano Anual Atendimento 1', isDefault: false },
  { id: 5, name: 'Plano Semestral Atendimento 1', isDefault: false },
  { id: 6, name: 'Plano Anual/Semestral Atendimentos', isDefault: false },
  { id: 7, name: 'Restrição de Horário', isDefault: false },
];

const initialServices = [
  {
    id: 1,
    name: 'C. Clinica Nutro (Avulsa)',
    duration: '40min',
    price: 'R$ 650',
    color: '#84cc16',
    initials: 'CC',
    professionals: ['DP'],
    category: 'Consultas'
  },
  {
    id: 2,
    name: 'C. Completa (Nutro+Nutri+Treino) (Avulsa) (1a Vez)',
    duration: '1h',
    price: 'R$ 850',
    color: '#ef4444',
    initials: 'CC',
    professionals: ['DP', 'PG'],
    category: 'Consultas'
  },
  // ... outros serviços do mock
];

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (name: string) => void;
  initialValue?: string;
  isEditing?: boolean;
}

const AddCategoryModal = ({ onClose, onAdd, initialValue = '', isEditing = false }: AddCategoryModalProps) => {
  const [name, setName] = useState(initialValue);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {isEditing ? 'Editar categoria' : 'Adicionar categoria'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Categoria<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Nome da Categoria"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (name.trim()) {
                  onAdd(name);
                  onClose();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              {isEditing ? 'Editar Categoria' : 'Adicionar Categoria'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddServiceModalProps {
  onClose: () => void;
  onAdd: (service: any) => void;
  categories: typeof initialCategories;
  initialValues?: any;
  isEditing?: boolean;
}

const AddServiceModal = ({ onClose, onAdd, categories, initialValues, isEditing = false }: AddServiceModalProps) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    color: '#000000',
    category: '',
    description: '',
    duration: '',
    price: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {isEditing ? 'Editar serviço' : 'Adicionar serviço'}
        </h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do serviço<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Nome do Serviço"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor<span className="text-red-500">*</span>
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-full rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição<span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Descrição do serviço"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Selecione a duração</option>
                <option value="20min">20 minutos</option>
                <option value="30min">30 minutos</option>
                <option value="40min">40 minutos</option>
                <option value="1h">1 hora</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                placeholder="R$ 0,00"
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
                if (formData.name && formData.category && formData.duration && formData.price) {
                  onAdd(formData);
                  onClose();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              {isEditing ? 'Editar Serviço' : 'Adicionar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ServicosPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [services, setServices] = useState(initialServices);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<number | null>(null);

  const handleAddCategory = (name: string) => {
    const newCategory = {
      id: categories.length + 1,
      name,
      isDefault: false
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (id: number, newName: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddService = (serviceData: any) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
      initials: serviceData.name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2),
      professionals: ['DP'] // Mock professionals
    };
    setServices([...services, newService]);
  };

  const handleEditService = (id: number, serviceData: any) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, ...serviceData } : service
    ));
  };

  const handleDuplicateService = (service: any) => {
    const newService = {
      ...service,
      id: services.length + 1,
      name: `${service.name} (Cópia)`
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-gray-700 font-medium">Serviços</h1>
          </div>
          <button
            onClick={() => setShowAddService(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Serviço
          </button>
        </div>

        <div className="grid grid-cols-[300px,1fr] gap-6">
          {/* Sidebar de Categorias */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-700">Categorias ({categories.length})</h2>
            </div>

            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    category.isDefault ? 'bg-violet-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">{category.name}</span>
                  {!category.isDefault && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenCategoryMenuId(openCategoryMenuId === category.id ? null : category.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                      </button>
                      
                      {openCategoryMenuId === category.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setOpenCategoryMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <PencilSimple className="w-4 h-4" />
                            Editar categoria
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteCategory(category.id);
                              setOpenCategoryMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash className="w-4 h-4" />
                            Excluir categoria
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddCategory(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Adicionar Categoria
            </button>
          </div>

          {/* Lista de Serviços */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700">Todos os serviços ({services.length})</h2>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nome</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Duração</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Preço</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Funcionários</th>
                  <th className="w-px"></th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: service.color }}
                        >
                          {service.initials}
                        </div>
                        <span className="text-sm text-gray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.duration}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.price}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {service.professionals.map((prof: string, index: number) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white bg-pink-300"
                          >
                            {prof}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <DotsThree className="w-5 h-5 text-gray-400" weight="bold" />
                      </button>
                      
                      {openMenuId === service.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 z-50">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <PencilSimple className="w-4 h-4" />
                            Editar serviço
                          </button>
                          <button
                            onClick={() => {
                              handleDuplicateService(service);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicar serviço
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Power className="w-4 h-4" />
                            Desativar serviço
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteService(service.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash className="w-4 h-4" />
                            Excluir serviço
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

      {/* Modais */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onAdd={handleAddCategory}
        />
      )}

      {editingCategory && (
        <AddCategoryModal
          onClose={() => setEditingCategory(null)}
          onAdd={(name) => {
            handleEditCategory(editingCategory.id, name);
            setEditingCategory(null);
          }}
          initialValue={editingCategory.name}
          isEditing
        />
      )}

      {showAddService && (
        <AddServiceModal
          onClose={() => setShowAddService(false)}
          onAdd={handleAddService}
          categories={categories}
        />
      )}

      {editingService && (
        <AddServiceModal
          onClose={() => setEditingService(null)}
          onAdd={(serviceData) => {
            handleEditService(editingService.id, serviceData);
            setEditingService(null);
          }}
          categories={categories}
          initialValues={editingService}
          isEditing
        />
      )}
    </div>
  );
} 