/**
 * CreatorBoost AI — Toast Notification System
 * Premium notification experience with smooth motion
 *
 * Features:
 * - Success, Error, Info, Warning variants
 * - Slide-in from right with spring physics
 * - Auto-dismiss with progress indicator
 * - Stacked toasts with layout animation
 * - Accessibility: role="alert", aria-live="polite"
 */

import { useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  toastSlideInRight,
  spring,
  easing,
  duration,
} from './animations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toasts: [], addToast: () => {}, removeToast: () => {} });

function useToastContext() {
  return useContext(ToastContext);
}

export function useToast() {
  return useToastContext();
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-cyan-400 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-cyan-500/30',
    warning: 'border-amber-500/30',
  };

  const glowColors = {
    success: 'shadow-emerald-500/10',
    error: 'shadow-red-500/10',
    info: 'shadow-cyan-500/10',
    warning: 'shadow-amber-500/10',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[600] flex flex-col gap-2 max-w-sm"
        role="region"
        aria-label="Notifications"
      >
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={spring.snappy}
                role="alert"
                aria-live="polite"
                className={cn(
                  'flex items-center gap-3 p-4 glass rounded-xl border shadow-2xl',
                  borderColors[toast.type],
                  glowColors[toast.type]
                )}
              >
                {icons[toast.type]}
                <p className="text-sm text-white/80 flex-1">{toast.message}</p>
                <motion.button
                  onClick={() => removeToast(toast.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/30 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </ToastContext.Provider>
  );
}
