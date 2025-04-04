import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Client } from '../types'

interface AddClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id'>) => void;
}

export default function AddClientForm({ isOpen, onClose, onSubmit }: AddClientFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const client = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      birthDate: formData.get('birthDate') as string,
      cpf: formData.get('cpf') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    onSubmit(client);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Adicionar Paciente
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-5">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            Primeiro Nome<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                            placeholder="Primeiro Nome"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            Sobrenome<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                            placeholder="Sobrenome"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            CPF<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cpf"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                            placeholder="CPF"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            E-mail<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                            placeholder="E-mail"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            Telefone<span className="text-red-500">*</span>
                          </label>
                          <div className="flex">
                            <select
                              className="mt-1 block w-20 rounded-l-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                            >
                              <option>+55</option>
                            </select>
                            <input
                              type="tel"
                              name="phone"
                              required
                              className="mt-1 block w-full rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                              placeholder="Número de Telefone"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2"
                        >
                          Adicionar Paciente
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 