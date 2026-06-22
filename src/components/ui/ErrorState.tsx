import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-white/40 mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] text-white/70 hover:text-white border border-white/[0.06] hover:border-white/[0.12] text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </button>
      )}
    </div>
  );
}
