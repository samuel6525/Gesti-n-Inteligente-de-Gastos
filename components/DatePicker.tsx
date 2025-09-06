import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CalendarIcon } from './icons';

const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialDate = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const [displayDate, setDisplayDate] = useState(initialDate);

  const datePickerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(datePickerRef, () => setIsOpen(false));
  
  useEffect(() => {
    const newDate = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
    setDisplayDate(newDate);
  }, [selectedDate, isOpen]);

  const daysOfWeek = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };
  
  const handleDateSelect = (day: number) => {
    const newSelectedDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    const dateString = newSelectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const calendarGrid = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        grid.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        grid.push(i);
    }
    
    return grid;
  }, [displayDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;

  return (
    <div className="relative" ref={datePickerRef}>
        <div className="relative">
            <input
                type="text"
                value={selectedDate}
                onFocus={() => setIsOpen(true)}
                readOnly
                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent cursor-pointer text-sm text-gray-900"
                aria-label="Seleccionar fecha"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <CalendarIcon />
            </div>
        </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-white rounded-lg shadow-lg p-2.5 border border-gray-200" role="dialog" aria-modal="true" aria-labelledby="calendar-heading">
          <div className="flex items-center justify-between mb-2">
            <button onClick={handlePrevMonth} type="button" className="p-2 rounded-full hover:bg-gray-100" aria-label="Mes anterior">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 id="calendar-heading" className="text-sm font-semibold text-gray-700 capitalize" aria-live="polite">
              {displayDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={handleNextMonth} type="button" className="p-2 rounded-full hover:bg-gray-100" aria-label="Mes siguiente">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
            {daysOfWeek.map(day => <div key={day} className="font-medium">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {calendarGrid.map((day, index) => {
                if (day === null) {
                    return <div key={`empty-${index}`}></div>;
                }
                const dayDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
                const isFuture = dayDate > today;

                const isSelected = selected &&
                    selected.getDate() === day &&
                    selected.getMonth() === displayDate.getMonth() &&
                    selected.getFullYear() === displayDate.getFullYear();
                
                const isToday = today.getDate() === day &&
                    today.getMonth() === displayDate.getMonth() &&
                    today.getFullYear() === displayDate.getFullYear();
                
                let dayClasses = "w-9 h-9 flex items-center justify-center rounded-full text-sm ";

                if (isFuture) {
                    dayClasses += "text-gray-300 cursor-not-allowed";
                } else if(isSelected) {
                    dayClasses += "bg-kimi-green text-white font-bold hover:bg-kimi-green-dark cursor-pointer";
                } else if (isToday) {
                    dayClasses += "bg-gray-100 text-kimi-green font-bold hover:bg-gray-200 cursor-pointer";
                } else {
                    dayClasses += "text-gray-700 hover:bg-gray-100 cursor-pointer";
                }

                return (
                    <button 
                        key={day} 
                        onClick={() => handleDateSelect(day)} 
                        className={dayClasses}
                        type="button"
                        disabled={isFuture}
                        aria-label={`Seleccionar ${day} de ${displayDate.toLocaleString('es-ES', { month: 'long'})}`}
                        aria-pressed={isSelected ? 'true' : 'false'}
                        aria-disabled={isFuture ? 'true' : 'false'}
                    >
                        {day}
                    </button>
                )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;