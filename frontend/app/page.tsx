"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useState, useMemo, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon, PlusCircleIcon, UsersIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import ProfessionalAvatar from './components/ProfessionalAvatar'
import { Event, Professional as ProfessionalType, FilterType, Client } from './types'
import AddClientForm from './components/AddClientForm'
import { CalendarApi } from '@fullcalendar/core'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PlusCircle, X, WarningCircle } from '@phosphor-icons/react'
import AgendamentoForm from './agendamentos/components/AgendamentoForm'
import { useAppointmentStore } from './stores/appointmentStore'
import { useServiceStore } from './stores/serviceStore'
import { useLocationStore } from './stores/locationStore'
import { useProfessionalStore, Professional } from './stores/professionalStore'
import { usePatientStore } from './stores/patientStore'
import { checkApiConfig, setupApiMonitor } from '../src/services/checkApi'

// Mock data para profissionais - será substituído pelos dados da API
const mockProfessionals: ProfessionalType[] = [
  { id: 'all', name: 'Todos Profissionais', color: '#E2E8F0', initials: 'TP' },
  { id: 'dp', name: 'Dr. Fábio Pizzini', color: '#F8B4D9', initials: 'DP' },
  { id: 'fp', name: 'Fernanda Pereira', color: '#A78BFA', initials: 'FP' },
  { id: 'pg', name: 'Prof. Fábio Gianolla', color: '#BEF264', initials: 'PG' },
]

// Mock data para serviços - será substituído pelos dados da API
const mockServices = [
  { id: 'nutri', name: 'Nutri', duration: 60 },
  { id: 'consulta', name: 'Consulta', duration: 45 },
  { id: 'pericia', name: 'Perícia', duration: 30 },
]

export default function Home() {
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<FilterType>('all')
  const [selectedView, setSelectedView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([])

  // Usar os dados da API através das stores
  const { appointments, fetchAppointments, deleteAppointment } = useAppointmentStore()
  const { services, fetchServices } = useServiceStore()
  const { locations, fetchLocations } = useLocationStore()
  const { professionals, fetchProfessionals } = useProfessionalStore()
  const { patients, fetchPatients } = usePatientStore()

  // Carregar os dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await fetchServices()
        await fetchLocations()
        await fetchProfessionals()
        await fetchPatients()
        await fetchAppointments()
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [fetchServices, fetchLocations, fetchProfessionals, fetchPatients, fetchAppointments])

  useEffect(() => {
    // Verificar e corrigir a URL da API no carregamento da página
    const apiStatus = checkApiConfig();
    if (apiStatus.fixed) {
      console.log('URL da API corrigida no carregamento da página principal:', apiStatus.newUrl);
    }
    
    // Configurar o monitoramento da API
    setupApiMonitor();
  }, []);

  // Filtrar eventos baseado no profissional selecionado
  const filteredEvents = useMemo(() => {
    if (selectedProfessional === 'all') {
      return allEvents
    }
    return allEvents.filter(event => event.extendedProps.professionalId === selectedProfessional)
  }, [allEvents, selectedProfessional])

  // Mapear os profissionais da API para o formato usado no calendário
  const professionalsList = useMemo(() => {
    const allProfessionals = [
      { id: 'all', name: 'Todos Profissionais', color: '#E2E8F0', initials: 'TP' },
    ]
    
    const mappedProfessionals = professionals.map(prof => {
      const initials = `${prof.firstName.charAt(0)}${prof.lastName.charAt(0)}`.toUpperCase()
      return {
        id: prof.id,
        name: `${prof.firstName} ${prof.lastName}`,
        color: prof.color || '#A78BFA',
        initials: prof.initials || initials
      }
    })
    
    return [...allProfessionals, ...mappedProfessionals]
  }, [professionals])

  // Mapear os agendamentos da API para o formato exigido pelo FullCalendar
  useEffect(() => {
    if (appointments.length > 0) {
      const events = appointments.map(appointment => {
        const professional = professionals.find(p => p.id === appointment.professionalId)
        const service = services.find(s => s.id === appointment.serviceId)
        
        // Tentativa de encontrar o paciente pelo nome/telefone
        const patient = patients.find(p => 
          `${p.firstName} ${p.lastName}` === appointment.clientName || 
          p.phone === appointment.clientPhone
        )
        
        return {
          id: appointment.id,
          title: `${service?.name || 'Consulta'} - ${patient?.firstName || appointment.clientName}`,
          start: appointment.startTime,
          end: appointment.endTime,
          allDay: false,
          backgroundColor: professional?.color || '#A78BFA',
          extendedProps: {
            time: format(parseISO(appointment.startTime), 'HH:mm'),
            service: service?.name || 'Consulta',
            duration: service?.duration || 30,
            professionalId: appointment.professionalId,
            professional: professional?.firstName || '',
            professionalInitials: professional?.initials || (professional ? `${professional.firstName.charAt(0)}${professional.lastName.charAt(0)}`.toUpperCase() : ''),
            professionalColor: professional?.color || '#A78BFA',
            location: appointment.locationId,
            patient: patient?.firstName || appointment.clientName,
            status: appointment.status
          }
        }
      })
      
      setAllEvents(events)
    }
  }, [appointments, professionals, services, patients])

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setSelectedDate(arg.date)
    setShowModal(true)
  }

  function handleDeleteModal(info: any) {
    setShowDeleteModal(true)
    setIdToDelete(info.event.id)
  }

  async function handleDelete() {
    if (idToDelete) {
      try {
        await deleteAppointment(idToDelete)
        setShowDeleteModal(false)
        setIdToDelete(null)
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error)
      }
    }
  }

  function handleCloseModal() {
    setShowModal(false)
    setSelectedDate(null)
    setShowDeleteModal(false)
    setIdToDelete(null)
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

  function handleOpenAgendamentoModal() {
    setSelectedDate(new Date())
    setShowModal(true)
  }

  const toggleProfessionalFilter = (professionalId: string) => {
    setSelectedProfessionals(prev => {
      if (prev.includes(professionalId)) {
        return prev.filter(id => id !== professionalId)
      } else {
        return [...prev, professionalId]
      }
    })
  }

  const toggleServiceFilter = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const getEvents = () => {
    if (!appointments || appointments.length === 0) {
      return []
    }
    
    return appointments
      .filter(appointment => {
        if (selectedProfessionals.length > 0) {
          return selectedProfessionals.includes(appointment.professionalId)
        }
        return true
      })
      .map(appointment => {
        const service = services.find(s => s.id === appointment.serviceId)
        const professional = professionals.find(p => p.id === appointment.professionalId)
        
        const professionalColor = professional ? professional.color : '#6d28d9'
        
        return {
          id: appointment.id,
          title: `${service?.name || 'Consulta'} - ${appointment.clientName}`,
          start: appointment.startTime,
          end: appointment.endTime,
          backgroundColor: professionalColor,
          borderColor: professionalColor,
          extendedProps: {
            professional: professional ? `${professional.firstName} ${professional.lastName}` : '',
            service: service?.name || '',
            client: appointment.clientName,
            status: appointment.status,
            phone: appointment.clientPhone,
            notes: appointment.notes
          }
        }
      })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-gray-700 font-medium">Calendário</h1>
          <button
            onClick={handleOpenAgendamentoModal}
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
              {professionalsList.filter(p => p.id !== 'all').map((professional) => (
                <ProfessionalAvatar
                  key={professional.id}
                  name={professional.name}
                  color={professional.color}
                  isSelected={selectedProfessional === professional.id}
                  onClick={() => toggleProfessionalFilter(professional.id)}
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
                events={getEvents()}
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
                          Excluir Agendamento
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Tem certeza que deseja excluir este agendamento?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                    font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>
                      Excluir
                    </button>
                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                    shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleCloseModal}
                    >
                      Cancelar
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
                        initialData={selectedDate ? { date: selectedDate.toISOString().split('T')[0] } : undefined}
                        onClose={handleCloseModal} 
                        onSuccess={() => {
                          fetchAppointments()
                        }}
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
