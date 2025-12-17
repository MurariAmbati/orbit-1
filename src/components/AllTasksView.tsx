import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';
import { Button } from './Button';
import { 
  isTaskOverdue, 
  isTaskDueToday,
  isTaskDueThisWeek,
  cn,
  getInitials
} from '../utils/helpers';
import { format, parseISO } from 'date-fns';
import type { Task } from '../types';

interface AllTasksViewProps {
  onBack: () => void;
}

export function AllTasksView({ onBack }: AllTasksViewProps) {
  const { tasks, people, toggleTaskStatus, selectPerson } = useOrbitStore();
  const [filter, setFilter] = React.useState<'today' | 'week' | 'overdue' | 'all'>('all');
  
  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks.filter(t => t.status !== 'done');
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(isTaskDueToday);
        break;
      case 'week':
        filtered = filtered.filter(isTaskDueThisWeek);
        break;
      case 'overdue':
        filtered = filtered.filter(isTaskOverdue);
        break;
    }
    
    return filtered.sort((a, b) => {
      if (isTaskOverdue(a) && !isTaskOverdue(b)) return -1;
      if (!isTaskOverdue(a) && isTaskOverdue(b)) return 1;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return 0;
    });
  }, [tasks, filter]);
  
  // Group by date
  const groupedTasks = React.useMemo(() => {
    const groups: { [key: string]: Task[] } = {};
    
    filteredTasks.forEach(task => {
      let key = 'No Due Date';
      
      if (task.dueDate) {
        if (isTaskOverdue(task)) {
          key = 'Overdue';
        } else if (isTaskDueToday(task)) {
          key = 'Today';
        } else {
          key = format(parseISO(task.dueDate), 'EEEE, MMM d');
        }
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    });
    
    return groups;
  }, [filteredTasks]);
  
  const getPerson = (personId: string) => {
    return people.find(p => p.id === personId);
  };
  
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Orbit
          </Button>
          
          <h1 className="text-2xl font-bold mt-4 mb-4">All Tasks</h1>
          
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'today', 'week', 'overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  filter === f
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                {f === 'week' ? 'This Week' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">All clear!</h3>
            <p className="text-slate-400">No tasks match your filter</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([date, tasks]) => (
              <div key={date}>
                <h2 className={cn(
                  'text-lg font-semibold mb-3 flex items-center gap-2',
                  date === 'Overdue' && 'text-red-400',
                  date === 'Today' && 'text-amber-400'
                )}>
                  <Calendar size={18} />
                  {date}
                  <span className="text-sm text-slate-500 font-normal">({tasks.length})</span>
                </h2>
                
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const person = getPerson(task.personId);
                    if (!person) return null;
                    
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="task-card flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => selectPerson(person.id)}
                              className={cn(
                                'planet text-xs',
                                person.avatarColor
                              )}
                              style={{ width: 32, height: 32 }}
                            >
                              {getInitials(person.name)}
                            </button>
                            <span className="text-sm text-slate-400">{person.name}</span>
                          </div>
                          
                          <h3 className="font-semibold mb-1">{task.title}</h3>
                          
                          {task.description && (
                            <p className="text-sm text-slate-400 mb-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className={cn(
                              'px-2 py-1 rounded',
                              task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-800 text-slate-400'
                            )}>
                              {task.priority}
                            </div>
                            
                            {task.tags?.map(tag => (
                              <div key={tag} className="bg-slate-800 text-slate-400 px-2 py-1 rounded">
                                {tag}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          Mark Done
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
