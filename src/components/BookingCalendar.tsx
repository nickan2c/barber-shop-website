'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export default function BookingCalendar({ onDateSelect, selectedDate }: BookingCalendarProps) {
  // Function to disable past dates and Sundays
  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0; // 0 is Sunday
  };

  // Function to add custom class to available dates
  const tileClassName = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0 ? 'available-date' : '';
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            onDateSelect(value);
          }
        }}
        value={selectedDate}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        minDate={new Date()}
        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
        formatShortWeekday={(locale, date) => format(date, 'EEEEE')} // Show single letter for weekdays
      />
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 400px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-family: inherit;
        }
        .react-calendar__tile {
          padding: 1em 0.5em;
          height: 60px;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
        }
        .react-calendar__tile--active {
          background-color: #1f2937 !important;
          border-radius: 0.25rem;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background-color: #374151 !important;
        }
        .available-date {
          color: #1f2937;
          font-weight: 500;
        }
        .react-calendar__tile:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
} 