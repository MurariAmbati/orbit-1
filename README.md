# 🌌 Orbit - Relationship-Centric Task Manager

A beautiful, modern task manager that organizes your tasks around the people in your life. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Galaxy View**: Visualize your relationships as planets in a solar system
- **Person-Centric Organization**: Tasks orbit around the people they're related to
- **Smart Filtering**: View tasks by today, this week, or overdue status
- **Beautiful Animations**: 
  - Smooth transitions between views
  - Planet hover effects and scaling
  - Comet animation when completing tasks
  - Floating planets with subtle animations
- **Task Management**:
  - Create, edit, and complete tasks
  - Set priorities (low, medium, high)
  - Add due dates and tags
  - Track task status (pending, in progress, done)
- **All Tasks View**: See all your tasks across all people in one place
- **Responsive Design**: Works beautifully on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🎨 Design System

### Colors

- **Background**: Deep slate (bg-slate-950)
- **Surface**: Slate cards (bg-slate-900, bg-slate-800)
- **Primary**: Indigo (indigo-500, indigo-600)
- **Success**: Emerald (emerald-500)
- **Warning**: Amber (amber-400, amber-500)
- **Error**: Red (red-400, red-500)
- **Accent**: Violet, Cyan, Pink for different people

### Typography

- **Font**: Inter (via Google Fonts)
- **Sizes**: 
  - Title: text-2xl to text-3xl
  - Body: text-sm to text-base
  - Labels: text-xs to text-sm

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AllTasksView.tsx    # View all tasks across people
│   ├── Button.tsx           # Reusable button component
│   ├── Dialog.tsx           # Modal dialog component
│   ├── GalaxyView.tsx       # Main solar system view
│   ├── PersonView.tsx       # Individual person's tasks
│   ├── TaskDialog.tsx       # Create/edit task form
│   └── Toast.tsx            # Toast notifications
├── store/
│   └── useOrbitStore.ts     # Zustand state management
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── helpers.ts           # Utility functions
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles & Tailwind
```

## 🎯 Key Interactions

### Galaxy View
- **Click a planet** → Navigate to that person's tasks
- **Hover a planet** → See quick stats and next task
- **Click "All Tasks"** → See all tasks in one view

### Person View
- **Click task card** → View/edit task details
- **Click "Mark Done"** → Complete task with comet animation
- **Use filters** → Show All, Today, This Week, or Overdue tasks
- **Click "+" button** → Create new task

### Task Dialog
- **Fill in details** → Title (required), description, due date, priority, tags
- **Submit** → Creates or updates task with animation

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **Zustand** - State management
- **date-fns** - Date utilities
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

## 🎬 Animation Details

### Planet Animations
- Idle: Subtle floating (3s ease-in-out)
- Hover: Scale 1.15 with increased glow
- Selected: Scale 1.1 with full opacity

### Task Completion
- Scale flash on status change
- Comet particle shoots diagonally
- Smooth fade and position transition

### View Transitions
- Shared layout animations using layoutId
- Planet morphs into person avatar
- Fade and slide for task lists

## 🧪 Demo Data

The app includes pre-populated demo data:
- 5 people with different relationships (friends, family, coworkers)
- 7 sample tasks with various priorities and due dates
- Mix of pending, in-progress, and overdue tasks

---

Built with ❤️ for the hackathon
