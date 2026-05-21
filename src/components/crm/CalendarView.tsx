import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white capitalize">{monthName} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
          return (
            <div 
              key={day} 
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer
                ${isToday ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
