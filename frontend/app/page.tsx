"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useState, useMemo, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon, PlusCircleIcon, UsersIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import ProfessionalAvatar from './components/ProfessionalAvatar'
import { Event, Professional, FilterType, Client } from './types'
import AddClientForm from './components/AddClientForm'
import { CalendarApi } from '@fullcalendar/core'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PlusCircle, X, WarningCircle } from '@phosphor-icons/react'
import AgendamentoForm from './agendamentos/components/AgendamentoForm'

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
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedView, setSelectedView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filtra eventos baseado no profissional selecionado
  const filteredEvents = useMemo(() => {
    if (selectedProfessional === 'all') {
      return allEvents
    }
    return allEvents.filter(event => event.professionalId === selectedProfessional)
  }, [allEvents, selectedProfessional])

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setSelectedDate(arg.date)
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

  const handleAddClient = (newClient: Omit<Client, 'id'>) => {
    const client = {
      ...newClient,
      id: `client-${Date.now()}`
    }
    setClients(prev => [...prev, client])
  }

  const handlePrevMonth = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.prev()
    setCurrentDate(calendarApi?.getDate())
  }

  const handleNextMonth = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.next()
    setCurrentDate(calendarApi?.getDate())
  }

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.today()
    setCurrentDate(calendarApi?.getDate())
  }

  const handleViewChange = (view: string) => {
    setSelectedView(view)
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.changeView(view)
  }

  const formattedDate = useMemo(() => {
    if (selectedView === 'timeGridWeek') {
      const calendarApi = calendarRef.current?.getApi()
      if (calendarApi) {
        const start = calendarApi.view.currentStart
        const end = calendarApi.view.currentEnd
        const endDate = new Date(end)
        endDate.setDate(endDate.getDate() - 1)
        return `${format(start, 'dd/MM/yyyy', { locale: ptBR })} - ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`
      }
      return ''
    }
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
  }, [currentDate, selectedView])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-gray-700 font-medium">Calendário</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Novo Agendamento
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Seção de Profissionais */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <button
                  onClick={() => setSelectedProfessional('all')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 transition-all
                    ${selectedProfessional === 'all' ? 'ring-2 ring-offset-2 ring-violet-600' : ''}
                  `}
                >
                  <span className="text-gray-600">TP</span>
                </button>
                <span className="text-xs text-gray-600 text-center">
                  Todos Profissionais
                </span>
              </div>
              {professionals.filter(p => p.id !== 'all').map((professional) => (
                <ProfessionalAvatar
                  key={professional.id}
                  name={professional.name}
                  color={professional.color}
                  isSelected={selectedProfessional === professional.id}
                  onClick={() => setSelectedProfessional(professional.id)}
                />
              ))}
            </div>

            {/* Seção de Navegação do Calendário */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  onClick={handleToday}
                >
                  Hoje
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={handlePrevMonth}
                  >
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-900 min-w-[150px] text-center">
                    {formattedDate}
                  </span>
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={handleNextMonth}
                  >
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button 
                  className={`px-4 py-1.5 text-sm font-medium ${selectedView === 'dayGridMonth' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleViewChange('dayGridMonth')}
                >
                  Mês
                </button>
                <button 
                  className={`px-4 py-1.5 text-sm font-medium ${selectedView === 'timeGridWeek' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleViewChange('timeGridWeek')}
                >
                  Semana
                </button>
                <button 
                  className={`px-4 py-1.5 text-sm font-medium ${selectedView === 'timeGridDay' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleViewChange('timeGridDay')}
                >
                  Dia
                </button>
              </div>
            </div>

            {/* Calendário */}
            <div className="fc-custom-style">
              <FullCalendar
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  timeGridPlugin
                ]}
                locale={ptBrLocale}
                initialView={selectedView}
                headerToolbar={false}
                dayHeaderFormat={{ weekday: 'long' }}
                events={filteredEvents as EventSourceInput}
                nowIndicator={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                eventClick={(data) => handleDeleteModal(data)}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                slotDuration="00:30:00"
                eventContent={(eventInfo) => {
                  const eventColor = eventInfo.event.backgroundColor || '#E2E8F0'
                  return (
                    <div 
                      className="p-1 rounded"
                      style={{ 
                        borderLeft: `3px solid ${eventColor}`,
                        backgroundColor: `${eventColor}20`
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900">{eventInfo.event.title}</div>
                      <div className="text-xs text-gray-600">{eventInfo.event.extendedProps.time}</div>
                    </div>
                  )
                }}
                height="auto"
              />
            </div>
          </div>
        </div>
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
                      <AgendamentoForm 
                        closeModal={handleCloseModal} 
                        selectedDate={selectedDate} 
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <AddClientForm
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleAddClient}
      />
    </div>
  )
}
