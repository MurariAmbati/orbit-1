# orbit

relationship-centric task manager with solar system visualization. built with react, typescript, tailwind css, and framer motion.

## features

- galaxy view with orbital task positioning based on urgency
- category-based filtering (family, work, school, friends, other)
- scrollable task section with person-specific views
- calendar view with date-based task organization
- ai assistant (nova) with context-aware task planning
- floating action button for quick task creation
- task management with priorities, due dates, tags, and status tracking

## setup

requires node.js v18+

```bash
npm install
npm run dev
```

opens at http://localhost:5173

## structure

```
src/
├── components/
│   ├── AllTasksView.tsx
│   ├── Button.tsx
│   ├── CalendarView.tsx
│   ├── Dialog.tsx
│   ├── GalaxyView.tsx
│   ├── OrbitAssistantPanel.tsx
│   ├── OrbitPet.tsx
│   ├── PersonView.tsx
│   ├── TaskDialog.tsx
│   └── Toast.tsx
├── store/
│   └── useOrbitStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── helpers.ts
│   └── orbit.ts
├── App.tsx
├── main.tsx
└── index.css
```

## tech stack

- react 18
- typescript
- vite 7.2.5 with rolldown
- tailwind css v3
- framer motion
- zustand
- date-fns
- react hook form
- lucide react

## deployment

```bash
npm run build
vercel --prod
```

live at https://orbit-1-xi.vercel.app
