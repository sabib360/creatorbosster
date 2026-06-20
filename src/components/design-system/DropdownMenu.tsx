import { useState, createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
    <button onClick={() => setOpen(!open)} className={cn('inline-flex items-center justify-center', className)}>
      {children}
    </button>
  );
}

function DropdownMenuContent({ children, className, align = 'end' }: { children: ReactNode; className?: string; align?: 'start' | 'end' }) {
  const { open, setOpen } = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] rounded-lg border bg-popover p-1 text-popover-foreground shadow-md animate-scale-in',
        align === 'end' ? 'right-0' : 'left-0',
        'mt-2 top-full',
        className
      )}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      onClick={() => { onClick?.(); setOpen(false); }}
      className={cn(
        'relative flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted focus-ring',
        className
      )}
    >
      {children}
    </button>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator };
