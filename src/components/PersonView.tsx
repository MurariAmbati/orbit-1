import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Tag, Check } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';
import { Button } from './Button';
import { 
  getInitials, 
  calculateTaskStats, 
  isTaskOverdue, 
  isTaskDueToday,
  cn 
} from '../utils/helpers';
import { format, parseISO } from 'date-fns';
import type { Task, FilterType } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
}

function TaskCard({ task, onToggle, onEdit }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = React.useState(false);
  
  const priorityColors = {
    low: 'border-slate-600',
    medium: 'border-amber-500',
    high: 'border-red-500',
  };
  
  const statusLabels = {
    pending: 'Start',
    in_progress: 'Mark Done',
    done: 'Completed',
  };
  
  const handleToggle = () => {
    if (task.status !== 'done') {
      setIsCompleting(true);
      setTimeout(() => {
        onToggle();
        setIsCompleting(false);
      }, 500);
    } else {
      onToggle();
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'task-card border-l-4 relative overflow-hidden',
        priorityColors[task.priority],
        task.status === 'done' && 'opacity-60'
      )}
    >
      {/* Comet animation overlay */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ x: '-100%', y: '100%', opacity: 1, scale: 0.5 }}
            animate={{ x: '200%', y: '-200%', opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-sm z-10"
            style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
            }}
          />
        )}
      </AnimatePresence>
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1" onClick={onEdit}>
          <h3 className={cn(
            'text-sm font-medium text-slate-50',
            task.status === 'done' && 'line-through text-slate-500'
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {task.dueDate && (
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
                isTaskOverdue(task) ? 'bg-rose-400/15 text-rose-300 border border-rose-400/40' :
                isTaskDueToday(task) ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40' :
                'text-slate-400'
              )}>
                <Calendar size={10} />
                <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            
            <span className={cn(
              'inline-flex items-center gap-1',
              task.priority === 'high' ? 'text-emerald-400' :
              task.priority === 'medium' ? 'text-amber-400' :
              'text-slate-400'
            )}>
              <span className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: task.priority === 'high' ? '#34d399' :
                                task.priority === 'medium' ? '#fbbf24' : '#94a3b8'
              }} />
              {task.priority} priority
            </span>
            
            {task.tags && task.tags.map(tag => (
              <div key={tag} className="inline-flex items-center gap-1 text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/50">
                <Tag size={8} />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button
          variant={task.status === 'done' ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleToggle}
          className="shrink-0"
        >
          {task.status === 'done' ? (
            <><Check size={14} className="mr-1" /> Done</>
          ) : (
            statusLabels[task.status]
          )}
        </Button>
      </div>
    </motion.div>
  );
}

interface PersonViewProps {
  personId: string;
  onBack: () => void;
  onCreateTask: () => void;
}

export function PersonView({ personId, onBack, onCreateTask }: PersonViewProps) {
  const { people, tasks, toggleTaskStatus, filter, setFilter } = useOrbitStore();
  
  const person = people.find(p => p.id === personId);
  const allPersonTasks = tasks.filter(t => t.personId === personId);
  const stats = calculateTaskStats(allPersonTasks);
  
  if (!person) {
    return <div>Person not found</div>;
  }
  
  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = allPersonTasks;
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(t => t.status !== 'done' && isTaskDueToday(t));
        break;
      case 'this_week':
        filtered = filtered.filter(t => t.status !== 'done');
        break;
      case 'overdue':
        filtered = filtered.filter(isTaskOverdue);
        break;
      default:
        // Show all pending and in-progress tasks
        filtered = filtered.filter(t => t.status !== 'done');
    }
    
    return filtered.sort((a, b) => {
      // Sort by overdue first, then by due date
      if (isTaskOverdue(a) && !isTaskOverdue(b)) return -1;
      if (!isTaskOverdue(a) && isTaskOverdue(b)) return 1;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return 0;
    });
  }, [allPersonTasks, filter]);
  
  const completedTasks = allPersonTasks.filter(t => t.status === 'done');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={14} className="mr-1" />
              Back to Orbit
            </Button>
            
            <Button size="sm" onClick={onCreateTask}>
              <Plus size={16} className="mr-2" />
              New Task
            </Button>
          </div>
          
          {/* Person Info */}
          <div className="flex items-center gap-3">
            <motion.div
              layoutId={`planet-${person.id}`}
              className={`planet ${person.avatarColor} w-14 h-14 text-sm shadow-planet border border-slate-100/10 bg-slate-900/90`}
            >
              {getInitials(person.name)}
            </motion.div>
            
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-slate-50">{person.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs tracking-wide uppercase text-slate-400">
                  {person.relationship}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-lg font-semibold text-indigo-400">{stats.total}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Total</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-lg font-semibold text-amber-400">{stats.dueToday}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Today</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-lg font-semibold text-emerald-400">{stats.dueThisWeek}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Week</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
              <div className="text-lg font-semibold text-rose-400">{stats.overdue}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Overdue</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {(['all', 'today', 'this_week', 'overdue'] as FilterType[]).map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                  filter === f
                    ? 'bg-indigo-500 text-slate-50'
                    : 'border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900'
                )}
              >
                {f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </motion.button>
            ))}
          </div>
        </div>
      </header>
      
      {/* Task List */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {filteredTasks.length === 0 && completedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">No tasks yet</h3>
            <p className="text-sm text-slate-400 mb-4">
              Create your first task for {person.name}
            </p>
            <Button onClick={onCreateTask}>
              <Plus size={14} className="mr-1" />
              Create Task
            </Button>
          </motion.div>
        ) : (
          <>
            {filteredTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Active Tasks</h2>
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskStatus(task.id)}
                      onEdit={() => {}}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {filteredTasks.length === 0 && filter !== 'all' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-center py-12 text-sm text-slate-400"
              >
                No tasks in this category
              </motion.div>
            )}
            
            {completedTasks.length > 0 && filter === 'all' && (
              <div>
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
                  Completed ({completedTasks.length})
                </h2>
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskStatus(task.id)}
                      onEdit={() => {}}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
