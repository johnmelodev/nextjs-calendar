import { useState } from 'react';

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    periods: Array<{
      start: string;
      end: string;
    }>;
  };
}

interface WorkingHoursFormProps {
  initialData?: WorkingHours;
  onChange: (workingHours: WorkingHours) => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Segunda-Feira' },
  { id: 'tuesday', label: 'Terça-Feira' },
  { id: 'wednesday', label: 'Quarta-Feira' },
  { id: 'thursday', label: 'Quinta-Feira' },
  { id: 'friday', label: 'Sexta-Feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

const defaultPeriod = { start: '09:00', end: '18:00' };

export default function WorkingHoursForm({ initialData, onChange }: WorkingHoursFormProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    initialData || {
      monday: { isOpen: true, periods: [defaultPeriod] },
      tuesday: { isOpen: true, periods: [defaultPeriod] },
      wednesday: { isOpen: true, periods: [defaultPeriod] },
      thursday: { isOpen: true, periods: [defaultPeriod] },
      friday: { isOpen: true, periods: [defaultPeriod] },
      saturday: { isOpen: false, periods: [] },
      sunday: { isOpen: false, periods: [] },
    }
  );

  const handleDayToggle = (day: string) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        isOpen: !workingHours[day].isOpen,
        periods: workingHours[day].isOpen ? [] : [defaultPeriod],
      },
    };
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  const handlePeriodChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        periods: workingHours[day].periods.map((period, i) =>
          i === index ? { ...period, [field]: value } : period
        ),
      },
    };
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  const addPeriod = (day: string) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        periods: [...workingHours[day].periods, defaultPeriod],
      },
    };
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  const removePeriod = (day: string, index: number) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        periods: workingHours[day].periods.filter((_, i) => i !== index),
      },
    };
    setWorkingHours(updatedHours);
    onChange(updatedHours);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">HORÁRIO DE TRABALHO</h3>
      {daysOfWeek.map(({ id, label }) => (
        <div key={id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={workingHours[id].isOpen}
                onChange={() => handleDayToggle(id)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>

          {workingHours[id].isOpen && (
            <div className="pl-4 space-y-4">
              {workingHours[id].periods.map((period, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Iniciar</span>
                    <input
                      type="time"
                      value={period.start}
                      onChange={(e) => handlePeriodChange(id, index, 'start', e.target.value)}
                      className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Concluir</span>
                    <input
                      type="time"
                      value={period.end}
                      onChange={(e) => handlePeriodChange(id, index, 'end', e.target.value)}
                      className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePeriod(id, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addPeriod(id)}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Adicionar horário
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 