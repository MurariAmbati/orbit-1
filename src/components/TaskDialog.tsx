import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { useOrbitStore } from '../store/useOrbitStore';
import type { Task, Priority } from '../types';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  tags: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personId?: string;
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskDialog({ open, onOpenChange, personId: initialPersonId, task, onSuccess }: TaskDialogProps) {
  const { addTask, updateTask, people } = useOrbitStore();
  const [selectedPersonId, setSelectedPersonId] = React.useState<string>(initialPersonId || '');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority,
      tags: task.tags?.join(', ') || '',
    } : {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      tags: '',
    }
  });
  
  React.useEffect(() => {
    if (open) {
      setSelectedPersonId(initialPersonId || (people.length > 0 ? people[0].id : ''));
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          priority: task.priority,
          tags: task.tags?.join(', ') || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          tags: '',
        });
      }
    }
  }, [open, task, reset, initialPersonId, people]);
  
  const onSubmit = (data: TaskFormData) => {
    const tags = data.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    
    if (task) {
      // Update existing task
      updateTask(task.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        priority: data.priority,
        tags,
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        personId: selectedPersonId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        priority: data.priority,
        status: 'pending',
        tags,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
    }
    
    onOpenChange(false);
    reset();
    onSuccess?.();
  };
  
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={task ? 'Edit Task' : 'New Task'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="What needs to be done?"
            autoFocus
          />
          {errors.title && (
            <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        
        {!initialPersonId && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Assign to <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            placeholder="Add more details..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Due Date
            </label>
            <input
              {...register('dueDate')}
              type="date"
              className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Tags
          </label>
          <input
            {...register('tags')}
            type="text"
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="work, personal, urgent (comma-separated)"
          />
        </div>
        
        <div className="flex gap-2 pt-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
