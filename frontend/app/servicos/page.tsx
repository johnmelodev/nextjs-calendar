'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, PencilSimple, Trash } from '@phosphor-icons/react';
import { useServiceStore } from '../stores/serviceStore';

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
  categories: any[];
  initialValues?: any;
  isEditing?: boolean;
}

const AddServiceModal = ({ onClose, onAdd, categories, initialValues, isEditing = false }: AddServiceModalProps) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    color: '#000000',
    categoryId: '',
    description: '',
    duration: 0,
    price: 0,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duração deve ser maior que 0';
    }
    
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Garantir que os tipos dos campos estejam corretos
      const serviceData = {
        name: formData.name,
        description: formData.description || 'Sem descrição',
        duration: Number(formData.duration),
        price: Number(formData.price),
        color: formData.color,
        categoryId: formData.categoryId,
        isActive: true
      };
      
      console.log('Enviando dados do serviço:', serviceData);
      onAdd(serviceData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {isEditing ? 'Editar serviço' : 'Adicionar serviço'}
        </h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do serviço<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full text-sm border-0 ring-1 ${errors.name ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              placeholder="Nome do Serviço"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
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
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full text-sm border-0 ring-1 ${errors.categoryId ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
              placeholder="Descrição do serviço (opcional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className={`w-full text-sm border-0 ring-1 ${errors.duration ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
              >
                <option value="">Selecione a duração</option>
                <option value="20">20 minutos</option>
                <option value="30">30 minutos</option>
                <option value="40">40 minutos</option>
                <option value="60">1 hora</option>
              </select>
              {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className={`w-full text-sm border-0 ring-1 ${errors.price ? 'ring-red-500' : 'ring-gray-200'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`}
                placeholder="R$ 0,00"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
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
              onClick={handleSubmit}
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
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    services,
    categories,
    loading,
    error,
    fetchServices,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createService,
    updateService,
    deleteService
  } = useServiceStore();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const handleAddCategory = async (name: string) => {
    await createCategory({ name, isActive: true });
    await fetchCategories(); // Recarrega as categorias após adicionar
  };

  const handleEditCategory = async (id: string, newName: string) => {
    await updateCategory(id, { name: newName });
    await fetchCategories(); // Recarrega as categorias após editar
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    await fetchCategories(); // Recarrega as categorias após deletar
  };

  const handleAddService = async (serviceData: any) => {
    await createService(serviceData);
    await fetchServices(); // Recarrega os serviços após adicionar
  };

  const handleEditService = async (id: string, serviceData: any) => {
    await updateService(id, serviceData);
    await fetchServices(); // Recarrega os serviços após editar
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    await fetchServices(); // Recarrega os serviços após deletar
  };

  const filteredServices = selectedCategory
    ? services.filter(service => service.categoryId === selectedCategory)
    : services;

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
          <h1 className="text-2xl text-gray-700 font-medium">Serviços</h1>
          <button
            onClick={() => setShowAddService(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle className="h-5 w-5" weight="fill" />
            Adicionar Serviço
          </button>
        </div>

        <div className="grid grid-cols-[280px,1fr] gap-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-gray-700">Categorias ({categories.length})</h2>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                  !selectedCategory ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos os serviços
              </button>

              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                    selectedCategory === category.id ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Trash size={16} />
                  </button>
                </button>
              ))}

              <button
                onClick={() => setShowAddCategory(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <PlusCircle size={16} />
                Adicionar Categoria
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-gray-700">
                  Todos os serviços ({filteredServices.length})
                </h2>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-4">Nome</th>
                    <th className="pb-4">Duração</th>
                    <th className="pb-4">Preço</th>
                    <th className="pb-4">Funcionários</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {filteredServices.map(service => (
                    <tr key={service.id} className="border-t border-gray-200">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: service.color }}
                          >
                            {service.name.substring(0, 2).toUpperCase()}
                          </div>
                          {service.name}
                        </div>
                      </td>
                      <td className="py-4">{service.duration}min</td>
                      <td className="py-4">R$ {typeof service.price === 'number' ? service.price.toFixed(2) : parseFloat(service.price).toFixed(2)}</td>
                      <td className="py-4">
                        <div className="flex -space-x-2">
                          {/* TODO: Implementar avatares dos profissionais */}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setShowAddService(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <PencilSimple size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showAddCategory && (
          <AddCategoryModal
            onClose={() => {
              setShowAddCategory(false);
              setEditingCategory(null);
            }}
            onAdd={handleAddCategory}
            initialValue={editingCategory?.name}
            isEditing={!!editingCategory}
          />
        )}

        {showAddService && (
          <AddServiceModal
            onClose={() => {
              setShowAddService(false);
              setEditingService(null);
            }}
            onAdd={editingService ? (data) => handleEditService(editingService.id, data) : handleAddService}
            categories={categories}
            initialValues={editingService}
            isEditing={!!editingService}
          />
        )}
      </div>
    </div>
  );
} 