import { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType>({ open: false, setOpen: () => {} });

function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div 
        className="relative inline-flex" 
        onMouseEnter={() => setOpen(true)} 
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('inline-flex', className)} tabIndex={0}>{children}</div>;
}

function TooltipContent({ children, className, side = 'top' }: { children: ReactNode; className?: string; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const { open } = useContext(TooltipContext);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs font-medium rounded-lg glass text-white/80 shadow-xl pointer-events-none whitespace-nowrap',
            positionClasses[side],
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
