import { create } from 'zustand';
import type { Person, Task, FilterType } from '../types';

interface OrbitState {
  people: Person[];
  tasks: Task[];
  selectedPersonId: string | null;
  filter: FilterType;
  
  // Actions
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  selectPerson: (id: string | null) => void;
  setFilter: (filter: FilterType) => void;
  
  getTasksForPerson: (personId: string) => Task[];
}

// Mock data for demo
const mockPeople: Person[] = [
  { id: '1', name: 'Mom', avatarColor: 'bg-rose-500', relationship: 'family', importance: 3, category: 'family' },
  { id: '2', name: 'Dad', avatarColor: 'bg-orange-500', relationship: 'family', importance: 2, category: 'family' },
  { id: '3', name: 'Alex (Manager)', avatarColor: 'bg-indigo-500', relationship: 'coworker', importance: 4, category: 'work' },
  { id: '4', name: 'CS Prof', avatarColor: 'bg-emerald-500', relationship: 'other', importance: 3, category: 'school' },
  { id: '5', name: 'Jade', avatarColor: 'bg-cyan-500', relationship: 'friend', importance: 2, category: 'friends' },
  { id: '6', name: 'Sarah Chen', avatarColor: 'bg-violet-500', relationship: 'coworker', importance: 3, category: 'work' },
  { id: '7', name: 'Marcus', avatarColor: 'bg-sky-500', relationship: 'friend', importance: 4, category: 'friends' },
  { id: '8', name: 'Sister', avatarColor: 'bg-pink-500', relationship: 'family', importance: 4, category: 'family' },
];

const mockTasks: Task[] = [
  // Mom (id: 1) - Family tasks
  {
    id: '1',
    personId: '1',
    title: 'Call mom back about Thanksgiving',
    description: 'Discuss menu and who is bringing what',
    dueDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago - OVERDUE
    priority: 'high',
    status: 'pending',
    tags: ['family', 'urgent'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    personId: '1',
    title: 'Send mom photos from vacation',
    dueDate: new Date().toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['family'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    personId: '1',
    title: 'Help mom set up new phone',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['family', 'tech'],
    createdAt: new Date().toISOString(),
  },
  
  // Dad (id: 2) - Family tasks
  {
    id: '4',
    personId: '2',
    title: 'Fix dad\'s computer',
    description: 'Reinstall antivirus and clean up startup programs',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['family', 'tech'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    personId: '2',
    title: 'Watch game with dad',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['family', 'fun'],
    createdAt: new Date().toISOString(),
  },
  
  // Alex (Manager) (id: 3) - Work tasks
  {
    id: '6',
    personId: '3',
    title: 'Submit Q4 performance review',
    description: 'Complete self-assessment and goals for next quarter',
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday - OVERDUE
    priority: 'high',
    status: 'in_progress',
    tags: ['work', 'urgent'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    personId: '3',
    title: 'Prepare sprint planning presentation',
    dueDate: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['work', 'meeting'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    personId: '3',
    title: 'Review team budget proposal',
    dueDate: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['work', 'budget'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    personId: '3',
    title: 'Schedule 1-on-1 meetings',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['work', 'meetings'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    personId: '3',
    title: 'Update project roadmap',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['work', 'planning'],
    createdAt: new Date().toISOString(),
  },
  
  // CS Prof (id: 4) - School tasks
  {
    id: '11',
    personId: '4',
    title: 'Submit final project proposal',
    description: 'Write 5-page proposal for capstone project',
    dueDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago - OVERDUE
    priority: 'high',
    status: 'in_progress',
    tags: ['school', 'urgent'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    personId: '4',
    title: 'Finish algorithms homework',
    dueDate: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['school', 'homework'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    personId: '4',
    title: 'Study for midterm exam',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['school', 'exam'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    personId: '4',
    title: 'Attend office hours',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['school'],
    createdAt: new Date().toISOString(),
  },
  
  // Jade (id: 5) - Friends tasks
  {
    id: '15',
    personId: '5',
    title: 'Plan birthday surprise for Jade',
    dueDate: new Date(Date.now() + 604800000).toISOString(), // 7 days
    priority: 'medium',
    status: 'pending',
    tags: ['friends', 'party'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    personId: '5',
    title: 'Reply to Jade about weekend plans',
    dueDate: new Date().toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['friends', 'social'],
    createdAt: new Date().toISOString(),
  },
  
  // Sarah Chen (id: 6) - Work tasks
  {
    id: '17',
    personId: '6',
    title: 'Code review Sarah\'s PR',
    description: 'Review authentication refactor pull request',
    dueDate: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['work', 'code-review'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    personId: '6',
    title: 'Pair programming session',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['work', 'development'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '19',
    personId: '6',
    title: 'API documentation updates',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['work', 'docs'],
    createdAt: new Date().toISOString(),
  },
  
  // Marcus (id: 7) - Friends tasks
  {
    id: '20',
    personId: '7',
    title: 'Basketball game with Marcus',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['friends', 'sports'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '21',
    personId: '7',
    title: 'Help Marcus move apartment',
    dueDate: new Date(Date.now() + 345600000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['friends', 'favor'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '22',
    personId: '7',
    title: 'Game night at Marcus place',
    dueDate: new Date(Date.now() + 432000000).toISOString(),
    priority: 'low',
    status: 'pending',
    tags: ['friends', 'fun'],
    createdAt: new Date().toISOString(),
  },
  
  // Sister (id: 8) - Family tasks
  {
    id: '23',
    personId: '8',
    title: 'Help sister with college essay',
    description: 'Review and provide feedback on personal statement',
    dueDate: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['family', 'school'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '24',
    personId: '8',
    title: 'Sister\'s recital this weekend',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    priority: 'high',
    status: 'pending',
    tags: ['family', 'event'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '25',
    personId: '8',
    title: 'Take sister shopping for prom dress',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    priority: 'medium',
    status: 'pending',
    tags: ['family', 'shopping'],
    createdAt: new Date().toISOString(),
  },
];

export const useOrbitStore = create<OrbitState>((set, get) => ({
  people: mockPeople,
  tasks: mockTasks,
  selectedPersonId: null,
  filter: 'all',
  
  addPerson: (person) => set((state) => ({
    people: [...state.people, person]
  })),
  
  updatePerson: (id, updates) => set((state) => ({
    people: state.people.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  removePerson: (id) => set((state) => ({
    people: state.people.filter(p => p.id !== id),
    tasks: state.tasks.filter(t => t.personId !== id),
    selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId,
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  
  toggleTaskStatus: (id) => set((state) => ({
    tasks: state.tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'done' ? 'pending' : 'done';
        return { ...t, status: newStatus };
      }
      return t;
    })
  })),
  
  selectPerson: (id) => set({ selectedPersonId: id }),
  
  setFilter: (filter) => set({ filter }),
  
  getTasksForPerson: (personId) => {
    return get().tasks.filter(t => t.personId === personId);
  },
}));
