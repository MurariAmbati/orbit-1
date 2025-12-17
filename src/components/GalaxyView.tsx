import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';
import { getInitials, isTaskOverdue, getPersonUrgency, cn } from '../utils/helpers';
import { getOrbitConfig, type OrbitBand } from '../utils/orbit';
import { orbitCategories } from '../types';
import type { Person, SelectedCategory } from '../types';
import { TaskDialog } from './TaskDialog';

interface PlanetProps {
  person: Person;
  radius: number;
  angle: number;
  band: OrbitBand;
  urgency: number;
  taskCount: number;
  onClick: () => void;
}

function Planet({ person, radius, angle, band, urgency, taskCount, onClick }: PlanetProps) {
  const initials = getInitials(person.name);
  
  const glowColor =
    band === "inner"
      ? "shadow-[0_0_30px_rgba(248,113,113,0.9)]"
      : band === "middle"
      ? "shadow-[0_0_24px_rgba(251,191,36,0.7)]"
      : "shadow-[0_0_18px_rgba(99,102,241,0.5)]";
  
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      <div
        style={{
          transform: `translateX(${radius}px) rotate(${-angle}deg)`,
        }}
        className="relative flex items-center justify-center group"
      >
        <motion.button
          type="button"
          onClick={onClick}
          className="relative pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
        >
        <motion.div
          className={cn(
            "flex items-center justify-center rounded-full border border-slate-100/10 bg-slate-900/90 text-slate-50",
            "w-14 h-14 text-sm font-medium",
            glowColor,
            person.avatarColor
          )}
          layoutId={`planet-${person.id}`}
          initial={false}
          animate={{
            boxShadow:
              band === "inner"
                ? "0 0 24px rgba(244,63,94,0.8)"
                : band === "middle"
                ? "0 0 24px rgba(251,191,36,0.8)"
                : "0 0 24px rgba(129,140,248,0.8)",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {initials}
          
          {/* Task count badge */}
          {taskCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center"
            >
              {taskCount}
            </motion.div>
          )}
          
          {/* Urgency indicator */}
          {urgency > 0 && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-400 text-[10px] flex items-center justify-center text-slate-950 font-medium">
              {Math.min(9, Math.round(urgency / 20))}
            </div>
          )}
        </motion.div>
        
        {/* Hover tooltip */}
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-xs text-slate-100 px-3 py-1.5 rounded-md border border-slate-700/60 z-50">
          {person.name}
        </div>
        </motion.button>
      </div>
    </div>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <div
      className="absolute border border-slate-700/40 rounded-full pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%)`,
      }}
    />
  );
}

interface GalaxyViewProps {
  onShowAllTasks?: () => void;
  onShowCalendar?: () => void;
}

function CategoryChips({
  selected,
  onChange,
}: {
  selected: SelectedCategory;
  onChange: (cat: SelectedCategory) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-800 px-2 py-1">
      {orbitCategories.map(cat => (
        <motion.button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-all",
            selected === cat.id
              ? "bg-slate-800 text-slate-50"
              : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
          )}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

export function GalaxyView({ onShowAllTasks, onShowCalendar }: GalaxyViewProps) {
  const { people, tasks, selectPerson } = useOrbitStore();
  const [selectedCategory, setSelectedCategory] = React.useState<SelectedCategory>("work");
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  
  const categoryConfig = orbitCategories.find(c => c.id === selectedCategory) ?? orbitCategories[0];
  
  // Filter people by category
  const visiblePeople = selectedCategory === "all"
    ? people
    : people.filter(p => p.category === selectedCategory);
  
  // Calculate global stats for visible people
  const allActiveTasks = tasks.filter(t => {
    const person = visiblePeople.find(p => p.id === t.personId);
    return person && t.status !== 'done';
  });
  const allOverdueTasks = tasks.filter(t => {
    const person = visiblePeople.find(p => p.id === t.personId);
    return person && isTaskOverdue(t);
  });
  
  // Precompute person + orbit info
  const planetConfigs = visiblePeople.map((person) => {
    const urgency = getPersonUrgency(person.id, tasks);
    const orbit = getOrbitConfig(urgency);
    const personTasks = tasks.filter(t => t.personId === person.id && t.status !== 'done');
    
    return {
      person,
      urgency,
      orbit,
      taskCount: personTasks.length,
    };
  });
  
  // Group by band
  const innerPlanets = planetConfigs.filter(p => p.orbit.band === "inner");
  const middlePlanets = planetConfigs.filter(p => p.orbit.band === "middle");
  const outerPlanets = planetConfigs.filter(p => p.orbit.band === "outer");
  
  // Distribute angles evenly within each band
  const getAngle = (index: number, total: number) => (360 / total) * index;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(129,140,248,0.8)]" />
          <span className="text-sm font-semibold tracking-tight text-slate-50">
            Orbit
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={onShowCalendar}
            className="btn-secondary flex items-center gap-1.5"
          >
            <Calendar size={14} />
            Calendar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={onShowAllTasks}
            className="btn-secondary"
          >
            All Tasks
          </motion.button>
        </div>
      </header>
      
      {/* Category Selector */}
      <div className="flex justify-center pt-6 pb-4">
        <CategoryChips
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>
      
      {/* Main Galaxy Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative w-[500px] h-[500px]">
          {/* Orbit rings */}
          <OrbitRing radius={110} />
          <OrbitRing radius={160} />
          <OrbitRing radius={210} />
          
          {/* Inner band - fastest */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {innerPlanets.map((config, index) => (
              <Planet
                key={config.person.id}
                person={config.person}
                angle={getAngle(index, innerPlanets.length)}
                radius={config.orbit.radius}
                band={config.orbit.band}
                urgency={config.urgency}
                taskCount={config.taskCount}
                onClick={() => selectPerson(config.person.id)}
              />
            ))}
          </motion.div>
          
          {/* Middle band */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          >
            {middlePlanets.map((config, index) => (
              <Planet
                key={config.person.id}
                person={config.person}
                angle={getAngle(index, middlePlanets.length)}
                radius={config.orbit.radius}
                band={config.orbit.band}
                urgency={config.urgency}
                taskCount={config.taskCount}
                onClick={() => selectPerson(config.person.id)}
              />
            ))}
          </motion.div>
          
          {/* Outer band - slowest */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          >
            {outerPlanets.map((config, index) => (
              <Planet
                key={config.person.id}
                person={config.person}
                angle={getAngle(index, outerPlanets.length)}
                radius={config.orbit.radius}
                band={config.orbit.band}
                urgency={config.urgency}
                taskCount={config.taskCount}
                onClick={() => selectPerson(config.person.id)}
              />
            ))}
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm mb-4">
            Click on a planet to view tasks · Closer orbits = higher urgency
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-flex flex-col items-center gap-2 text-slate-500"
          >
            <span className="text-xs uppercase tracking-wide">Scroll for tasks</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-60">
              <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Tasks Section - Scroll down to see */}
      <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-slate-50 mb-2">
                {selectedCategory === "all" ? "All Tasks" : `${categoryConfig.label} Tasks`}
              </h2>
              <p className="text-sm text-slate-400">
                {allActiveTasks.length} active · {allOverdueTasks.length} overdue
              </p>
            </div>
            
            {/* Tasks by Person */}
            <div className="space-y-8">
              {visiblePeople.map((person) => {
                const personTasks = tasks.filter(t => t.personId === person.id && t.status !== 'done');
                const personOverdue = personTasks.filter(isTaskOverdue);
                
                if (personTasks.length === 0) return null;
                
                return (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-slate-50",
                            person.avatarColor,
                            "shadow-planet"
                          )}
                        >
                          {getInitials(person.name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-50">{person.name}</h3>
                          <p className="text-xs text-slate-400">
                            {personTasks.length} active
                            {personOverdue.length > 0 && (
                              <span className="text-rose-400 ml-2">· {personOverdue.length} overdue</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => selectPerson(person.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="btn-primary"
                      >
                        View All
                      </motion.button>
                    </div>
                    
                    {/* Task List */}
                    <div className="space-y-2">
                      {personTasks.slice(0, 3).map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          viewport={{ once: true }}
                          className={cn(
                            "rounded-xl border bg-slate-900/80 px-4 py-3 flex items-start justify-between gap-3",
                            isTaskOverdue(task) ? "border-rose-500/40" : "border-slate-800"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-50 mb-1">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px]">
                              {task.dueDate && (
                                <span className={cn(
                                  isTaskOverdue(task) ? "text-rose-400" : "text-slate-400"
                                )}>
                                  {isTaskOverdue(task) ? "Overdue" : "Due"} {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                              <span className={cn(
                                "inline-flex items-center gap-1",
                                task.priority === 'high' ? 'text-emerald-400' :
                                task.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{
                                  backgroundColor: task.priority === 'high' ? '#34d399' :
                                                  task.priority === 'medium' ? '#fbbf24' : '#94a3b8'
                                }} />
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => selectPerson(person.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            →
                          </motion.button>
                        </motion.div>
                      ))}
                      {personTasks.length > 3 && (
                        <p className="text-xs text-slate-400 text-center pt-2">
                          +{personTasks.length - 3} more tasks
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {visiblePeople.filter(p => tasks.filter(t => t.personId === p.id && t.status !== 'done').length > 0).length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-slate-400">No active tasks in this category</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <motion.button
        type="button"
        onClick={() => setTaskDialogOpen(true)}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-indigo-500 text-slate-50 shadow-lg hover:bg-indigo-400 transition-colors flex items-center justify-center z-30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        <Plus size={24} />
      </motion.button>
      
      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
      />
    </div>
  );
}
