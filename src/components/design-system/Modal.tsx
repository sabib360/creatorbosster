/**
 * CreatorBoost AI — Modal Component
 * Premium modal with smooth motion transitions
 */

import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  modalBackdrop,
  modalContent,
  spring,
  easing,
  duration,
} from './animations';

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
    <motion.button
      onClick={() => setOpen(true)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: duration.normal }}
      className={className}
    >
      {children}
    </motion.button>
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={modalBackdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative z-50 w-full max-w-lg mx-4 glass-modal rounded-2xl p-6 shadow-2xl',
              className
            )}
          >
            <motion.button
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-4 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </motion.button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col space-y-1.5 mb-4', className)}>{children}</div>;
}

function ModalTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-semibold text-white tracking-tight', className)}>{children}</h2>;
}

function ModalDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-white/50', className)}>{children}</p>;
}

function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2 mt-6', className)}>{children}</div>;
}

export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter };
