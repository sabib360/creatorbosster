/**
 * Toast Notification System
 * Lightweight, non-intrusive notifications for user feedback.
 * Supports: success, warning, error, info types.
 */

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-green-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  const borders: Record<ToastType, string> = {
    success: 'border-green-500/30',
    warning: 'border-amber-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-xl border ${borders[toast.type]} rounded-xl shadow-2xl max-w-sm`}
    >
      {icons[toast.type]}
      <span className="text-sm text-white/80 flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5 text-white/40" />
      </button>
    </motion.div>
  );
}

// Convenience functions
export function toastSuccess(message: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'success' } }));
}

export function toastError(message: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'error' } }));
}

export function toastInfo(message: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'info' } }));
}
