import React from 'react';
import { motion } from 'framer-motion';
import { OrbitAssistantPanel } from './OrbitAssistantPanel';

export function OrbitPet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Floating pet */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6
          z-40
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-500 to-violet-500
          border-2 border-indigo-300/50
          shadow-[0_0_30px_rgba(129,140,248,0.8)]
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {/* Little "face" / icon */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/80">
          <motion.span 
            className="text-base font-semibold text-indigo-200"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✦
          </motion.span>
          <span className="sr-only">Open Orbit assistant</span>
        </div>
        
        {/* Glow pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-400/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
      </motion.button>

      {/* Slide-out assistant panel */}
      <OrbitAssistantPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
