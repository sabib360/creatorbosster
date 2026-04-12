import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry, 
  onClose,
  className 
}: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "brutal-card p-8 bg-red-500/10 border-red-500/30 backdrop-blur-xl relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-50" />
      
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-red-500/50 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-500">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-display font-black uppercase tracking-tight text-red-500">
            {title}
          </h3>
          <p className="text-ink/70 font-medium leading-relaxed max-w-md">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-red-500 text-white font-display font-black uppercase tracking-widest text-xs rounded-xl brutal-btn flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </button>
          )}
          <a
            href="mailto:support@creatorboost.ai"
            className="px-8 py-3 bg-slate-900 text-ink border border-slate-800 font-display font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Get Help
          </a>
        </div>
      </div>
    </motion.div>
  );
}
