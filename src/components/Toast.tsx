import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 z-50 card px-4 py-3 flex items-center gap-2 shadow-lg"
    >
      <div className="bg-emerald-500 rounded-full p-1">
        <Check size={16} className="text-white" />
      </div>
      <span className="text-sm">{message}</span>
    </motion.div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState({ message: '', visible: false });
  
  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  
  return { toast, showToast, hideToast };
}
