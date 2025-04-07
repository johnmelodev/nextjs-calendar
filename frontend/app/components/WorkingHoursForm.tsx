import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Pencil, Trash, Plus } from '@phosphor-icons/react';

interface Period {
  start: string;
  end: string;
}

interface DaySchedule {
  isOpen: boolean;
  periods: Period[];
}

interface WorkingHours {
  [key: string]: DaySchedule;
}

interface WorkingHoursFormProps {
  initialData: WorkingHours;
  onChange: (workingHours: WorkingHours) => void;
}

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-Feira' },
  { key: 'tuesday', label: 'Terça-Feira' },
  { key: 'wednesday', label: 'Quarta-Feira' },
  { key: 'thursday', label: 'Quinta-Feira' },
  { key: 'friday', label: 'Sexta-Feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

const defaultWorkingHours: WorkingHours = {
  monday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  tuesday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  wednesday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  thursday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  friday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  saturday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
  sunday: { isOpen: false, periods: [{ start: '09:00', end: '18:00' }] },
};

export default function WorkingHoursForm({ initialData = defaultWorkingHours, onChange }: WorkingHoursFormProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(() => {
    // Garante que todos os dias da semana têm uma estrutura válida
    const mergedHours = { ...defaultWorkingHours };
    if (initialData) {
      daysOfWeek.forEach(({ key }) => {
        if (initialData[key]) {
          mergedHours[key] = {
            isOpen: initialData[key].isOpen ?? false,
            periods: initialData[key].periods?.length > 0 
              ? initialData[key].periods 
              : [{ start: '09:00', end: '18:00' }]
          };
        }
      });
    }
    return mergedHours;
  });

  const handleDayToggle = (day: string) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isOpen: !workingHours[day].isOpen,
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
        periods: [...workingHours[day].periods, { start: '09:00', end: '18:00' }],
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
      <div className="space-y-4">
        {daysOfWeek.map(({ key, label }) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Switch
                  checked={workingHours[key].isOpen}
                  onChange={() => handleDayToggle(key)}
                  className={`${
                    workingHours[key].isOpen ? 'bg-violet-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      workingHours[key].isOpen ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
              </div>
            </div>

            {workingHours[key].isOpen && (
              <div className="space-y-3">
                {workingHours[key].periods.map((period, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Iniciar
                        </label>
                        <input
                          type="time"
                          value={period.start}
                          onChange={(e) => handlePeriodChange(key, index, 'start', e.target.value)}
                          className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Concluir
                        </label>
                        <input
                          type="time"
                          value={period.end}
                          onChange={(e) => handlePeriodChange(key, index, 'end', e.target.value)}
                          className="w-full text-sm border-0 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-end space-x-2 pb-1">
                      <button
                        type="button"
                        onClick={() => removePeriod(key, index)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => addPeriod(key)}
                    className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    <Plus size={16} />
                    Adicionar período
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 