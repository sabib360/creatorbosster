import { useState, createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType>({ open: false, setOpen: () => {} });

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

function DropdownMenuTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button 
      onClick={() => setOpen(!open)} 
      className={cn('inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg', className)}
    >
      {children}
    </button>
  );
}

function DropdownMenuContent({ children, className, align = 'end' }: { children: ReactNode; className?: string; align?: 'start' | 'end' }) {
  const { open, setOpen } = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { 
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); 
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'absolute z-50 min-w-[12rem] rounded-xl glass-strong p-1.5 shadow-2xl',
            align === 'end' ? 'right-0' : 'left-0',
            'mt-2 top-full',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DropdownMenuItem({ children, onClick, className, icon }: { children: ReactNode; onClick?: () => void; className?: string; icon?: ReactNode }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      onClick={() => { onClick?.(); setOpen(false); }}
      className={cn(
        'relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-all hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className
      )}
    >
      {icon && <span className="text-white/30">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1.5 h-px bg-white/[0.06]', className)} />;
}

function DropdownMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-3 py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest', className)}>{children}</div>;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };
