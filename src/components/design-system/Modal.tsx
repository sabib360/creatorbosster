import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType>({ open: false, setOpen: () => {} });

function Modal({ children, defaultOpen = false }: { children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useContext(ModalContext);
  return (
    <button onClick={() => setOpen(true)} className={className}>
      {children}
    </button>
  );
}

function ModalContent({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen } = useContext(ModalContext);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
      <div className={cn(
        'relative z-50 w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg animate-scale-in',
        className
      )}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-ring"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}>{children}</div>;
}

function ModalTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</h2>;
}

function ModalDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}

function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)}>{children}</div>;
}

export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter };
