"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useState, useMemo, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { CalendarApi } from '@fullcalendar/core'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAppointmentStore, AppointmentInput } from './stores/appointmentStore'
import { useServiceStore } from './stores/serviceStore'
import { useLocationStore } from './stores/locationStore'
import { useProfessionalStore } from './stores/professionalStore'
import { usePatientStore } from './stores/patientStore'
import { PlusCircle, X, WarningCircle } from '@phosphor-icons/react'

export default function Home() {
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedView, setSelectedView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados para o formulário de agendamento
  const [formData, setFormData] = useState({
    serviceId: '',
    professionalId: '',
    locationId: '',
    date: '',
    time: '',
    clientName: '',
    clientPhone: '',
    patientId: '',
    notes: ''
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableProfessionals, setAvailableProfessionals] = useState<any[]>([])
  
  // Usar os dados da API através das stores
  const { appointments, fetchAppointments, deleteAppointment, createAppointment } = useAppointmentStore()
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
        
        // Tentativa de encontrar o paciente pelo nome/telefone já que não temos patientId na API
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

  // Filtra eventos baseado no profissional selecionado
  const filteredEvents = useMemo(() => {
    if (selectedProfessional === 'all') {
      return allEvents
    }
    return allEvents.filter(event => event.extendedProps.professionalId === selectedProfessional)
  }, [allEvents, selectedProfessional])

  // Atualizar o formulário quando uma data é selecionada
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: format(selectedDate, 'HH:mm')
      }))
    }
  }, [selectedDate])

  // Atualizar nome e telefone do cliente quando um paciente for selecionado
  useEffect(() => {
    if (formData.patientId) {
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          clientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
          clientPhone: selectedPatient.phone || ''
        }));
      }
    }
  }, [formData.patientId, patients]);

  // Filtrar profissionais com base no serviço selecionado
  useEffect(() => {
    if (formData.serviceId) {
      // Filtra os profissionais que podem realizar o serviço selecionado
      const profsForService = professionals.filter(prof => {
        // Se o profissional não tem serviços definidos ou a lista está vazia, consideramos que ele não pode realizar o serviço
        if (!prof.services || prof.services.length === 0) {
          return false;
        }
        
        // Verifica se o serviço selecionado está na lista de serviços do profissional
        return prof.services.some(service => service.id === formData.serviceId);
      });
      
      setAvailableProfessionals(profsForService);
      
      // Se o profissional atualmente selecionado não pode realizar este serviço, limpa a seleção
      if (formData.professionalId && !profsForService.some(p => p.id === formData.professionalId)) {
        setFormData(prev => ({ ...prev, professionalId: '' }));
      }
    } else {
      // Se nenhum serviço está selecionado, mostra todos os profissionais
      setAvailableProfessionals(professionals);
    }
  }, [formData.serviceId, professionals]);

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setSelectedDate(arg.date)
    setShowModal(true)
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true)
    setIdToDelete(data.event.id)
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
    setFormError(null)
    setFormSuccess(null)
    setFormData({
      serviceId: '',
      professionalId: '',
      locationId: '',
      date: '',
      time: '',
      clientName: '',
      clientPhone: '',
      patientId: '',
      notes: ''
    })
  }

  const handleFormChange = (field: string, value: string) => {
    // Limpar mensagens de erro quando o usuário começa a digitar
    if (formError) {
      setFormError(null)
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
  
    try {
      setIsSubmitting(true)
      setFormError(null)
      
      // Obtém o serviço selecionado para calcular a duração
      const selectedService = services.find(service => service.id === formData.serviceId)
      
      if (!selectedService) {
        setFormError('Serviço selecionado não encontrado')
        setIsSubmitting(false)
        return
      }
      
      // Verifica se o profissional pode realizar este serviço
      const selectedProfessional = professionals.find(p => p.id === formData.professionalId)
      const canProvideService = selectedProfessional?.services?.some(s => s.id === formData.serviceId)
      
      if (!canProvideService) {
        setFormError('Este profissional não pode realizar este serviço')
        setIsSubmitting(false)
        return
      }
      
      // Calcula a data e hora de término com base na duração do serviço
      const endTimeStr = calculateEndTime(formData.date, formData.time, selectedService.duration)
      
      // Cria o objeto de agendamento no formato esperado pela API
      const appointmentData: AppointmentInput = {
        serviceId: formData.serviceId,
        professionalId: formData.professionalId,
        locationId: formData.locationId,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        endTime: endTimeStr,
        notes: formData.notes || '',
        status: "scheduled"
      }
      
      console.log('Criando agendamento:', appointmentData)
      
      // Envia para a API
      const createdAppointment = await createAppointment(appointmentData)
      
      // Recarrega os agendamentos para mostrar o novo registro
      await fetchAppointments()
      
      // Mostra mensagem de sucesso
      setFormSuccess('Agendamento criado com sucesso!')
      
      // Fecha o modal após um breve atraso para mostrar a mensagem de sucesso
      setTimeout(() => {
        handleCloseModal()
      }, 1500)
      
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error)
      
      // Verificar se o erro vem da API e tem uma mensagem específica
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(error.response.data.message)
      } else {
        setFormError('Ocorreu um erro ao criar o agendamento. Tente novamente.')
      }
      
      setIsSubmitting(false)
    }
  }
  
  const validateForm = () => {
    if (!formData.serviceId) {
      setFormError('Selecione um serviço')
      return false
    }
    
    if (!formData.professionalId) {
      setFormError('Selecione um profissional')
      return false
    }
    
    if (!formData.locationId) {
      setFormError('Selecione um local')
      return false
    }
    
    if (!formData.date) {
      setFormError('Selecione uma data')
      return false
    }
    
    if (!formData.time) {
      setFormError('Selecione um horário')
      return false
    }
    
    if (!formData.patientId) {
      setFormError('Selecione um paciente')
      return false
    }
    
    setFormError(null)
    return true
  }
  
  // Calcular a hora de término com base na duração do serviço
  const calculateEndTime = (date: string, startTime: string, durationMinutes: number): string => {
    if (!date || !startTime || !durationMinutes) {
      throw new Error('Dados insuficientes para calcular o horário de término')
    }
    
    try {
      const startDateTime = new Date(`${date}T${startTime}`)
      if (isNaN(startDateTime.getTime())) {
        throw new Error('Data ou hora de início inválida')
      }
      
      // Adiciona a duração em minutos
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000)
      return endDateTime.toISOString()
    } catch (error) {
      console.error('Erro ao calcular horário de término:', error)
      throw new Error('Não foi possível calcular o horário de término')
    }
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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Calendário</h1>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(new Date())
              setShowModal(true)
            }}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            <PlusCircle size={20} weight="bold" /> Novo Agendamento
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleToday}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hoje
            </button>
            <button
              onClick={handlePrevMonth}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <h2 className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 capitalize">
              {formattedDate}
            </h2>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${selectedView === 'dayGridMonth' ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Mês
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${selectedView === 'timeGridWeek' ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Semana
            </button>
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${selectedView === 'timeGridDay' ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Dia
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-2/12">
            <div className="flex flex-col rounded-lg border border-gray-300 p-5">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Profissionais</h2>
              <div className="flex flex-col gap-3">
                {professionalsList.map((professional) => (
                  <div
                    key={professional.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 ${selectedProfessional === professional.id ? 'bg-violet-50' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedProfessional(professional.id)}
                  >
                    <div
                      className="h-8 w-8 text-xs rounded-full flex items-center justify-center"
                      style={{ backgroundColor: professional.color }}
                    >
                      <span className="text-white">{professional.initials}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{professional.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-10/12">
            <div className="rounded-lg border border-gray-300 p-5">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={false}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={filteredEvents as EventSourceInput}
                dateClick={handleDateClick}
                eventClick={handleDeleteModal}
                height={'700px'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Novo Agendamento */}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 flex items-center justify-between">
                        <span>Novo Agendamento</span>
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                          onClick={handleCloseModal}
                        >
                          <X size={24} />
                        </button>
                      </Dialog.Title>
                      
                      {/* Mensagem de Erro */}
                      {formError && (
                        <div className="mt-4 rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <WarningCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">{formError}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Mensagem de Sucesso */}
                      {formSuccess && (
                        <div className="mt-4 rounded-md bg-green-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">{formSuccess}</h3>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <form className="space-y-5">
                          {/* Serviço */}
                          <div>
                            <label htmlFor="service" className="block text-sm font-medium leading-6 text-gray-900">
                              Serviço
                            </label>
                            <div className="mt-2">
                              <select
                                id="service"
                                name="service"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.serviceId}
                                onChange={(e) => handleFormChange('serviceId', e.target.value)}
                              >
                                <option value="">Selecione um serviço</option>
                                {services.map((service) => (
                                  <option key={service.id} value={service.id}>
                                    {service.name} - {service.duration} min - R$ {Number(service.price).toFixed(2)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* Profissional */}
                          <div>
                            <label htmlFor="professional" className="block text-sm font-medium leading-6 text-gray-900">
                              Profissional
                            </label>
                            <div className="mt-2">
                              <select
                                id="professional"
                                name="professional"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.professionalId}
                                onChange={(e) => handleFormChange('professionalId', e.target.value)}
                                disabled={!formData.serviceId}
                              >
                                <option value="">Selecione um profissional</option>
                                {availableProfessionals.map((professional) => (
                                  <option key={professional.id} value={professional.id}>
                                    {professional.firstName} {professional.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* Local */}
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                              Local
                            </label>
                            <div className="mt-2">
                              <select
                                id="location"
                                name="location"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.locationId}
                                onChange={(e) => handleFormChange('locationId', e.target.value)}
                              >
                                <option value="">Selecione um local</option>
                                {locations.map((location) => (
                                  <option key={location.id} value={location.id}>
                                    {location.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* Data e Hora */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                                Data
                              </label>
                              <div className="mt-2">
                                <input
                                  type="date"
                                  id="date"
                                  name="date"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={formData.date}
                                  onChange={(e) => handleFormChange('date', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                                Hora
                              </label>
                              <div className="mt-2">
                                <input
                                  type="time"
                                  id="time"
                                  name="time"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={formData.time}
                                  onChange={(e) => handleFormChange('time', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Paciente */}
                          <div>
                            <label htmlFor="patient" className="block text-sm font-medium leading-6 text-gray-900">
                              Paciente
                            </label>
                            <div className="mt-2">
                              <select
                                id="patient"
                                name="patient"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.patientId}
                                onChange={(e) => handleFormChange('patientId', e.target.value)}
                              >
                                <option value="">Selecione um paciente</option>
                                {patients.map((patient) => (
                                  <option key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName} - {patient.phone}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* Observações */}
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                              Observações
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.notes}
                                onChange={(e) => handleFormChange('notes', e.target.value)}
                              />
                            </div>
                          </div>
                          
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 sm:ml-3 sm:w-auto"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
      
      {/* Modal de Confirmação de Exclusão */}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Excluir Agendamento
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                    >
                      Excluir
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setShowDeleteModal(false)
                        setIdToDelete(null)
                      }}
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
    </main>
  )
}
