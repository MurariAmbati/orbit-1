export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "done";
export type Relationship = "friend" | "family" | "coworker" | "other";
export type FilterType = "all" | "today" | "this_week" | "overdue";
export type OrbitCategory = "family" | "work" | "school" | "friends" | "other";
export type SelectedCategory = OrbitCategory | "all";

export interface Task {
  id: string;
  personId: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date
  priority: Priority;
  status: TaskStatus;
  tags?: string[];
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  avatarColor: string;
  relationship: Relationship;
  importance: number; // used to scale planet size
  category: OrbitCategory;
}

export interface OrbitCategoryConfig {
  id: SelectedCategory;
  label: string;
  accent: string;
  glow: string;
}

export const orbitCategories: OrbitCategoryConfig[] = [
  { id: "all", label: "All", accent: "text-slate-200", glow: "shadow-[0_0_32px_rgba(148,163,184,0.8)]" },
  { id: "family", label: "Family", accent: "text-rose-300", glow: "shadow-[0_0_32px_rgba(248,113,113,0.7)]" },
  { id: "work", label: "Work", accent: "text-indigo-300", glow: "shadow-[0_0_32px_rgba(129,140,248,0.8)]" },
  { id: "school", label: "School", accent: "text-emerald-300", glow: "shadow-[0_0_32px_rgba(52,211,153,0.8)]" },
  { id: "friends", label: "Friends", accent: "text-cyan-300", glow: "shadow-[0_0_32px_rgba(34,211,238,0.8)]" },
  { id: "other", label: "Other", accent: "text-slate-200", glow: "shadow-[0_0_32px_rgba(148,163,184,0.8)]" },
];

export interface TaskStats {
  total: number;
  dueToday: number;
  dueThisWeek: number;
  overdue: number;
  completed: number;
}
