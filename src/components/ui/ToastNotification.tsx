/**
 * CreatorBoost AI — Toast Notification System
 * Premium toast notifications with smooth animations
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toastEnter, spring, easing, duration } from '../design-system/animations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastId = 0;
const listeners: Array<(toast: Toast) => void> = [];

export function showToast(message: string, type: Toast['type'] = 'info') {
  const id = `toast-${++toastId}`;
  listeners.forEach(listener => listener({ id, message, type }));
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: 'bg-emerald-500/20',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: 'bg-red-500/20',
  },
  info: {
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
    text: 'text-brand-400',
    icon: 'bg-brand-500/20',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: 'bg-amber-500/20',
  },
};

export default function ToastNotification() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 4000);
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = ICONS[toast.type];
          const colors = COLORS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95, x: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm pointer-events-auto',
                colors.bg,
                colors.border,
              )}
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colors.icon)}>
                <Icon className={cn('w-4 h-4', colors.text)} />
              </div>
              <p className={cn('text-sm font-medium flex-1', colors.text)}>{toast.message}</p>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-3 h-3 text-white/40" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
