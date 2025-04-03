"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useState, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon, PlusCircleIcon, UsersIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import ProfessionalAvatar from './components/ProfessionalAvatar'
import { Event, Professional, FilterType } from './types'

// Mock data para profissionais
const professionals: Professional[] = [
  { id: 'all', name: 'Todos Profissionais', color: '#E2E8F0', initials: 'TP' },
  { id: 'dp', name: 'Dr. Fábio Pizzini', color: '#F8B4D9', initials: 'DP' },
  { id: 'fp', name: 'Fernanda Pereira', color: '#A78BFA', initials: 'FP' },
  { id: 'pg', name: 'Prof. Fábio Gianolla', color: '#BEF264', initials: 'PG' },
]

// Mock data para serviços
const services = [
  { id: 'nutri', name: 'Nutri', duration: 60 },
  { id: 'consulta', name: 'Consulta', duration: 45 },
  { id: 'pericia', name: 'Perícia', duration: 30 },
]

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<FilterType>('all')
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: '',
    start: '',
    allDay: false,
    service: '',
    professionalId: '',
    location: '',
    client: '',
    notes: '',
    time: ''
  })

  // Filtra eventos baseado no profissional selecionado
  const filteredEvents = useMemo(() => {
    if (selectedProfessional === 'all') {
      return allEvents
    }
    return allEvents.filter(event => event.professionalId === selectedProfessional)
  }, [allEvents, selectedProfessional])

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime()
    })
    setShowModal(true)
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true)
    setIdToDelete(Number(data.event.id))
  }

  function handleDelete() {
    setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
    setShowDeleteModal(false)
    setIdToDelete(null)
  }

  function handleCloseModal() {
    setShowModal(false)
    setNewEvent({
      id: 0,
      title: '',
      start: '',
      allDay: false,
      service: '',
      professionalId: '',
      location: '',
      client: '',
      notes: '',
      time: ''
    })
    setShowDeleteModal(false)
    setIdToDelete(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const value = e.target.value
    setNewEvent(prev => {
      const updatedEvent = {
        ...prev,
        [e.target.name]: value
      }
      
      // Atualiza a cor do evento baseado no profissional selecionado
      if (e.target.name === 'professionalId') {
        const professional = professionals.find(p => p.id === value)
        if (professional) {
          updatedEvent.backgroundColor = professional.color
        }
      }
      
      return updatedEvent
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const professional = professionals.find(p => p.id === newEvent.professionalId)
    const service = services.find(s => s.id === newEvent.service)
    
    const event = {
      ...newEvent,
      title: `${service?.name} - ${newEvent.client}`,
      backgroundColor: professional?.color
    }
    
    setAllEvents([...allEvents, event])
    setShowModal(false)
    setNewEvent({
      id: 0,
      title: '',
      start: '',
      allDay: false,
      service: '',
      professionalId: '',
      location: '',
      client: '',
      notes: '',
      time: ''
    })
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendário</h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              {professionals.map((professional) => (
                <ProfessionalAvatar
                  key={professional.id}
                  name={professional.name}
                  color={professional.color}
                  isSelected={selectedProfessional === professional.id}
                  onClick={() => setSelectedProfessional(professional.id)}
                />
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-violet-600 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Novo Agendamento
            </button>
          </div>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin
            ]}
            locale={ptBrLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia'
            }}
            dayHeaderFormat={{ weekday: 'long' }}
            events={filteredEvents as EventSourceInput}
            nowIndicator={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick}
            eventClick={(data) => handleDeleteModal(data)}
            eventContent={(eventInfo) => {
              return (
                <div className="p-1">
                  <div className="text-xs font-semibold">{eventInfo.event.title}</div>
                  <div className="text-xs">{eventInfo.event.extendedProps.time}</div>
                </div>
              )
            }}
          />
        </div>

        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
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

            <div className="fixed inset-0 z-10 overflow-y-auto">
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>
                        Delete
                      </button>
                      <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
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

            <div className="fixed inset-0 z-10 overflow-y-auto">
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
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Adicionar Agendamento
                        </Dialog.Title>
                        <form action="submit" onSubmit={handleSubmit} className="mt-5">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 text-left">
                                Serviços<span className="text-red-500">*</span>
                              </label>
                              <select
                                name="service"
                                className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                value={newEvent.service}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Selecione o serviço</option>
                                <option value="nutri">Nutri</option>
                                <option value="consulta">Consulta</option>
                                <option value="pericia">Pericia</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 text-left">
                                Profissionais<span className="text-red-500">*</span>
                              </label>
                              <select
                                name="professionalId"
                                className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                value={newEvent.professionalId}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Selecione o profissional</option>
                                {professionals.filter(p => p.id !== 'all').map((professional) => (
                                  <option key={professional.id} value={professional.id}>
                                    {professional.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 text-left">
                                  Data<span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  name="start"
                                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                  value={newEvent.start.toString().split('T')[0]}
                                  onChange={handleChange}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 text-left">
                                  Hora<span className="text-red-500">*</span>
                                </label>
                                <select
                                  name="time"
                                  className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                  value={newEvent.time}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Selecione a hora</option>
                                  <option value="09:00">09:00</option>
                                  <option value="10:00">10:00</option>
                                  <option value="11:00">11:00</option>
                                  <option value="14:00">14:00</option>
                                  <option value="15:00">15:00</option>
                                  <option value="16:00">16:00</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 text-left">
                                Localização
                              </label>
                              <select
                                name="location"
                                className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                value={newEvent.location}
                                onChange={handleChange}
                              >
                                <option value="">Selecione o local</option>
                                <option value="sala1">Clínica Dr. Fábio Pizzini</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-between">
                              <label className="block text-sm font-medium text-gray-700">
                                Clientes
                              </label>
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-1 text-sm font-semibold text-violet-600 hover:text-violet-500"
                              >
                                Adicionar Cliente
                              </button>
                            </div>
                            <select
                              name="client"
                              className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.client}
                              onChange={handleChange}
                            >
                              <option value="">Selecione o cliente</option>
                              <option value="cliente1">Cliente 1</option>
                              <option value="cliente2">Barnao</option>
                            </select>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 text-left">
                                Nota
                              </label>
                              <textarea
                                name="notes"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="As notas não são visíveis para o paciente"
                                value={newEvent.notes}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                              disabled={!newEvent.service || !newEvent.professionalId || !newEvent.start || !newEvent.time}
                            >
                              Adicionar Agendamento
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={handleCloseModal}
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
      </main >
    </>
  )
}
