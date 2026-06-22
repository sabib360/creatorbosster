import { FileQuestion } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  icon,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
        {icon || <FileQuestion className="w-6 h-6 text-white/30" />}
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-white/40 mb-4 max-w-xs">{message}</p>
      {children}
    </div>
  );
}
