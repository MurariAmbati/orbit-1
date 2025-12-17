import { isToday, isThisWeek, isPast, parseISO, differenceInCalendarDays } from 'date-fns';
import type { Task, TaskStats } from '../types';

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false;
  return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
}

export function isTaskDueToday(task: Task): boolean {
  if (!task.dueDate) return false;
  return isToday(parseISO(task.dueDate));
}

export function isTaskDueThisWeek(task: Task): boolean {
  if (!task.dueDate) return false;
  return isThisWeek(parseISO(task.dueDate), { weekStartsOn: 1 });
}

function getTaskUrgency(task: Task): number {
  if (task.status === 'done') return 0;

  const base =
    task.priority === 'high' ? 50 :
    task.priority === 'medium' ? 30 :
    10;

  if (!task.dueDate) return base;

  const daysDiff = differenceInCalendarDays(parseISO(task.dueDate), new Date());

  if (daysDiff < 0) {
    return base + 30 + Math.min(20, Math.abs(daysDiff));
  }

  if (daysDiff === 0) {
    return base + 25;
  }

  if (daysDiff <= 3) {
    return base + 15;
  }

  if (daysDiff <= 7) {
    return base + 5;
  }

  return base;
}

export function getPersonUrgency(personId: string, tasks: Task[]): number {
  const personTasks = tasks.filter(t => t.personId === personId);
  if (personTasks.length === 0) return 0;

  const scores = personTasks.map(getTaskUrgency);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return Math.min(100, Math.round(avg));
}

export function calculateTaskStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    dueToday: tasks.filter(t => t.status !== 'done' && isTaskDueToday(t)).length,
    dueThisWeek: tasks.filter(t => t.status !== 'done' && isTaskDueThisWeek(t)).length,
    overdue: tasks.filter(isTaskOverdue).length,
    completed: tasks.filter(t => t.status === 'done').length,
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
