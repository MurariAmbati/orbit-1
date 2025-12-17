import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';
import type { Task } from '../types';

interface CalendarViewProps {
  onBack: () => void;
}

export function CalendarView({ onBack }: CalendarViewProps) {
  const { tasks, people, selectPerson } = useOrbitStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const getTasksForDate = (day: number): Task[] => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };
  
  const isToday = (day: number): boolean => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === month &&
           today.getFullYear() === year;
  };
  
  const handleTaskClick = (task: Task) => {
    selectPerson(task.personId);
  };
  
  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Galaxy
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">Calendar</h1>
            <p className="text-sm text-slate-400">View tasks by date</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="text-center min-w-[180px]">
              <h2 className="text-xl font-semibold text-slate-50">
                {monthNames[month]} {year}
              </h2>
            </div>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-slate-400 uppercase tracking-wide py-2"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }
              
              const dayTasks = getTasksForDate(day);
              const today = isToday(day);
              
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    aspect-square rounded-lg border p-2 relative
                    ${today 
                      ? 'bg-indigo-500/20 border-indigo-500' 
                      : 'bg-slate-900/50 border-slate-800'
                    }
                    ${dayTasks.length > 0 ? 'hover:border-indigo-400 transition-colors' : ''}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium mb-1 ${today ? 'text-indigo-300' : 'text-slate-300'}`}>
                      {day}
                    </div>
                    
                    {dayTasks.length > 0 && (
                      <div className="flex-1 space-y-1 overflow-y-auto">
                        {dayTasks.slice(0, 3).map((task) => {
                          const person = people.find(p => p.id === task.personId);
                          const priorityColor = 
                            task.priority === 'high' ? 'bg-rose-500' :
                            task.priority === 'medium' ? 'bg-amber-500' :
                            'bg-emerald-500';
                          
                          return (
                            <button
                              key={task.id}
                              onClick={() => handleTaskClick(task)}
                              className={`
                                w-full text-left px-1.5 py-1 rounded text-[10px] leading-tight
                                ${priorityColor} text-slate-50
                                hover:opacity-90 transition-opacity
                              `}
                            >
                              <div className="truncate font-medium">{task.title}</div>
                              {person && (
                                <div className="truncate text-[9px] opacity-80">{person.name}</div>
                              )}
                            </button>
                          );
                        })}
                        
                        {dayTasks.length > 3 && (
                          <div className="text-[9px] text-slate-400 text-center">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-500" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
