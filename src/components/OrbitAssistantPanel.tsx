import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, ListTodo, User } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';
import { isTaskOverdue } from '../utils/helpers';

interface OrbitAssistantPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export function OrbitAssistantPanel({ open, onOpenChange }: OrbitAssistantPanelProps) {
  const { tasks, people, selectedPersonId } = useOrbitStore();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I can help you prioritize tasks, plan your day, and stay on top of what matters most. Use quick actions below or ask me anything.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = React.useState('');
  
  const selectedPerson = selectedPersonId ? people.find(p => p.id === selectedPersonId) : null;
  
  const handleQuickAction = (action: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: new Date(),
    }]);
    
    // Simulate AI response based on action
    setTimeout(() => {
      let response = '';
      
      if (action.includes('Plan today')) {
        const todayTasks = tasks.filter(t => {
          const dueDate = t.dueDate ? new Date(t.dueDate) : null;
          const today = new Date();
          return dueDate && 
                 dueDate.toDateString() === today.toDateString() && 
                 t.status !== 'done';
        });
        const overdueTasks = tasks.filter(t => isTaskOverdue(t) && t.status !== 'done');
        
        if (overdueTasks.length === 0 && todayTasks.length === 0) {
          response = "You have no tasks due today or overdue. Consider planning ahead or working on lower-priority items.";
        } else {
          response = `TODAY'S FOCUS\n\n`;
          if (overdueTasks.length > 0) {
            response += `OVERDUE (${overdueTasks.length})\n`;
            overdueTasks.slice(0, 3).forEach((t) => {
              const person = people.find(p => p.id === t.personId);
              response += `  ${t.title}${person ? ` · ${person.name}` : ''}\n`;
            });
          }
          if (todayTasks.length > 0) {
            response += `${overdueTasks.length > 0 ? '\n' : ''}DUE TODAY (${todayTasks.length})\n`;
            todayTasks.slice(0, 3).forEach((t) => {
              const person = people.find(p => p.id === t.personId);
              response += `  ${t.title}${person ? ` · ${person.name}` : ''}\n`;
            });
          }
          response += `${overdueTasks.length > 0 ? '\nStart with overdue items, then proceed by priority.' : ''}`;
        }
      } else if (action.includes('Plan this week')) {
        const weekTasks = tasks.filter(t => {
          const dueDate = t.dueDate ? new Date(t.dueDate) : null;
          if (!dueDate || t.status === 'done') return false;
          const today = new Date();
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return dueDate >= today && dueDate <= weekFromNow;
        });
        
        const highPriority = weekTasks.filter(t => t.priority === 'high');
        const mediumPriority = weekTasks.filter(t => t.priority === 'medium');
        const lowPriority = weekTasks.filter(t => t.priority === 'low');
        
        response = `WEEK OVERVIEW (${weekTasks.length} tasks)\n\n`;
        
        if (highPriority.length > 0) {
          response += `HIGH PRIORITY (${highPriority.length})\n`;
          highPriority.slice(0, 3).forEach((t) => {
            const person = people.find(p => p.id === t.personId);
            response += `  ${t.title}${person ? ` · ${person.name}` : ''}\n`;
          });
          response += '\n';
        }
        
        if (mediumPriority.length > 0) {
          response += `MEDIUM PRIORITY (${mediumPriority.length})\n`;
          mediumPriority.slice(0, 2).forEach((t) => {
            const person = people.find(p => p.id === t.personId);
            response += `  ${t.title}${person ? ` · ${person.name}` : ''}\n`;
          });
          response += '\n';
        }
        
        if (lowPriority.length > 0) {
          response += `LOW PRIORITY (${lowPriority.length})\n\n`;
        }
        
        response += `Focus on high-priority items early. Schedule medium tasks mid-week, and handle low-priority when time allows.`;
      } else if (action.includes('person') || action.includes('Summarize')) {
        if (selectedPerson) {
          const personTasks = tasks.filter(t => t.personId === selectedPerson.id && t.status !== 'done');
          const personOverdue = personTasks.filter(isTaskOverdue);
          const highPriority = personTasks.filter(t => t.priority === 'high');
          
          response = `${selectedPerson.name.toUpperCase()} · TASKS\n\n`;
          response += `OVERVIEW\n`;
          response += `  ${personTasks.length} active\n`;
          if (personOverdue.length > 0) {
            response += `  ${personOverdue.length} overdue\n`;
          }
          if (highPriority.length > 0) {
            response += `  ${highPriority.length} high priority\n`;
          }
          
          if (personTasks.length > 0) {
            response += `\nPRIORITY ORDER\n`;
            const sortedTasks = [...personTasks].sort((a, b) => {
              if (isTaskOverdue(a) && !isTaskOverdue(b)) return -1;
              if (!isTaskOverdue(a) && isTaskOverdue(b)) return 1;
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            
            sortedTasks.slice(0, 5).forEach((t) => {
              const status = isTaskOverdue(t) ? '[OVERDUE]' : `[${t.priority.toUpperCase()}]`;
              response += `  ${status} ${t.title}\n`;
            });
            
            if (sortedTasks.length > 5) {
              response += `\n+${sortedTasks.length - 5} more`;
            }
          } else {
            response += `\nAll caught up with ${selectedPerson.name}.`;
          }
        } else {
          response = "Please select a person first to see their task summary. You can do this by clicking on any planet in the galaxy view.";
        }
      } else {
        response = "I'm here to help! Try asking me to plan your day, summarize tasks for a specific person, or give you an overview of what's most urgent.";
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    }, 500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    handleQuickAction(input);
    setInput('');
  };
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/98 border-l border-slate-800 backdrop-blur flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_0_20px_rgba(129,140,248,0.6)] flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                  <Sparkles size={14} className="text-slate-50" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-slate-50">Nova</p>
                  <p className="text-xs text-slate-400">Orbit AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick actions */}
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/30">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2">
                <QuickActionButton 
                  icon={<Calendar size={12} />}
                  label="Plan today" 
                  onClick={() => handleQuickAction('Plan today')}
                />
                <QuickActionButton 
                  icon={<ListTodo size={12} />}
                  label="Plan this week" 
                  onClick={() => handleQuickAction('Plan this week')}
                />
                {selectedPerson && (
                  <QuickActionButton 
                    icon={<User size={12} />}
                    label={`Summarize ${selectedPerson.name}'s tasks`}
                    onClick={() => handleQuickAction('Summarize tasks for this person')}
                  />
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.role === 'assistant' ? 'flex justify-start' : 'flex justify-end'}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-lg px-3 py-2 text-xs whitespace-pre-line font-mono
                      ${message.role === 'assistant' 
                        ? 'bg-slate-900 text-slate-300 border border-slate-800' 
                        : 'bg-slate-800 text-slate-100 border border-slate-700'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-800 px-3 py-3 bg-slate-900/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 transition-colors"
                placeholder="Ask Nova like 'What's most urgent today?'"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-2 rounded-full bg-indigo-500 text-xs font-medium text-slate-50 hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function QuickActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="
        inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
        text-[11px] font-medium
        bg-slate-900/80 border border-slate-700
        text-slate-200 hover:border-indigo-400 hover:text-indigo-200
        transition-all
      "
    >
      {icon}
      {label}
    </motion.button>
  );
}
