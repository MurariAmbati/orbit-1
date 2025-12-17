import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GalaxyView } from './components/GalaxyView';
import { PersonView } from './components/PersonView';
import { AllTasksView } from './components/AllTasksView';
import { CalendarView } from './components/CalendarView';
import { TaskDialog } from './components/TaskDialog';
import { Toast, useToast } from './components/Toast';
import { OrbitPet } from './components/OrbitPet';
import { useOrbitStore } from './store/useOrbitStore';

type View = 'galaxy' | 'person' | 'all-tasks' | 'calendar';

function App() {
  const { selectedPersonId, selectPerson } = useOrbitStore();
  const [currentView, setCurrentView] = React.useState<View>('galaxy');
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast, showToast, hideToast } = useToast();
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  React.useEffect(() => {
    if (selectedPersonId) {
      setCurrentView('person');
    } else {
      setCurrentView('galaxy');
    }
  }, [selectedPersonId]);
  
  const handleCreateTask = () => {
    setTaskDialogOpen(true);
  };
  
  const handleTaskSuccess = () => {
    showToast('Task created successfully!');
  };
  
  const handleBackToGalaxy = () => {
    selectPerson(null);
    setCurrentView('galaxy');
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50 overflow-hidden"
          >
            <div className="box-of-star1">
              <div className="star star-position1"></div>
              <div className="star star-position2"></div>
              <div className="star star-position3"></div>
              <div className="star star-position4"></div>
              <div className="star star-position5"></div>
              <div className="star star-position6"></div>
              <div className="star star-position7"></div>
            </div>
            <div className="box-of-star2">
              <div className="star star-position1"></div>
              <div className="star star-position2"></div>
              <div className="star star-position3"></div>
              <div className="star star-position4"></div>
              <div className="star star-position5"></div>
              <div className="star star-position6"></div>
              <div className="star star-position7"></div>
            </div>
            <div className="box-of-star3">
              <div className="star star-position1"></div>
              <div className="star star-position2"></div>
              <div className="star star-position3"></div>
              <div className="star star-position4"></div>
              <div className="star star-position5"></div>
              <div className="star star-position6"></div>
              <div className="star star-position7"></div>
            </div>
            <div className="box-of-star4">
              <div className="star star-position1"></div>
              <div className="star star-position2"></div>
              <div className="star star-position3"></div>
              <div className="star star-position4"></div>
              <div className="star star-position5"></div>
              <div className="star star-position6"></div>
              <div className="star star-position7"></div>
            </div>
            <div data-js="astro" className="astronaut">
              <div className="head"></div>
              <div className="arm arm-left"></div>
              <div className="arm arm-right"></div>
              <div className="body">
                <div className="panel"></div>
              </div>
              <div className="leg leg-left"></div>
              <div className="leg leg-right"></div>
              <div className="schoolbag"></div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute bottom-32 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 shadow-[0_0_24px_rgba(129,140,248,0.8)]" />
                <h2 className="text-2xl font-semibold text-slate-50">
                  Orbit
                </h2>
              </div>
              <p className="text-xs text-slate-400 tracking-wide">Launching your galaxy...</p>
            </motion.div>
          </motion.div>
        )}
        
        {!isLoading && currentView === 'galaxy' && (
          <GalaxyView 
            key="galaxy-view"
            onShowAllTasks={() => setCurrentView('all-tasks')}
            onShowCalendar={() => setCurrentView('calendar')}
          />
        )}
        
        {!isLoading && currentView === 'person' && selectedPersonId && (
          <PersonView
            key="person-view"
            personId={selectedPersonId}
            onBack={handleBackToGalaxy}
            onCreateTask={handleCreateTask}
          />
        )}
        
        {!isLoading && currentView === 'all-tasks' && (
          <AllTasksView
            key="all-tasks-view"
            onBack={handleBackToGalaxy}
          />
        )}
        
        {!isLoading && currentView === 'calendar' && (
          <CalendarView
            key="calendar-view"
            onBack={handleBackToGalaxy}
          />
        )}
      </AnimatePresence>
      
      {/* Task Dialog */}
      {selectedPersonId && (
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          personId={selectedPersonId}
          onSuccess={handleTaskSuccess}
        />
      )}
      
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
      
      {/* AI Companion - shown after loading */}
      {!isLoading && <OrbitPet />}
    </div>
  );
}

export default App;
