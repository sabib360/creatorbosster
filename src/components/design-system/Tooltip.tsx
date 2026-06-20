import { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
      <div className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('inline-flex', className)}>{children}</div>;
}

function TooltipContent({ children, className, side = 'top' }: { children: ReactNode; className?: string; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const { open } = useContext(TooltipContext);
  if (!open) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={cn(
      'absolute z-50 px-3 py-1.5 text-xs rounded-md bg-foreground text-background shadow-md animate-fade-in whitespace-nowrap pointer-events-none',
      positionClasses[side],
      className
    )}>
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
