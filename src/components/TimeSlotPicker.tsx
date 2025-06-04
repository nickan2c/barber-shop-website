'use client';

import { format } from 'date-fns';

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotPicker({ selectedTime, onTimeSelect }: TimeSlotPickerProps) {
  // Generate time slots from 9 AM to 7 PM
  const generateTimeSlots = () => {
    const slots = [];
    const start = 9; // 9 AM
    const end = 19; // 7 PM

    for (let hour = start; hour < end; hour++) {
      // Add slots for each hour (e.g., 9:00, 9:30)
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Group time slots by morning and afternoon
  const morningSlots = timeSlots.filter((time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter((time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12;
  });

  const renderTimeSlots = (slots: string[]) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));

        return (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              relative p-3 text-sm rounded-lg transition-all duration-200
              ${
                selectedTime === time
                  ? 'bg-gray-900 text-white shadow-md transform scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <span className="font-medium">{format(date, 'h:mm')}</span>
            <span className="block text-xs mt-0.5 opacity-75">
              {format(date, 'a')}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Morning</h3>
        {renderTimeSlots(morningSlots)}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Afternoon</h3>
        {renderTimeSlots(afternoonSlots)}
      </div>
    </div>
  );
} 