import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('relative h-3 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            {
              'bg-primary': variant === 'default',
              'bg-success': variant === 'success',
              'bg-warning': variant === 'warning',
              'bg-destructive': variant === 'destructive',
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
