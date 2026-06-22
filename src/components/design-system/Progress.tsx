import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', size = 'md', showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
      <div className="w-full space-y-1">
        {showLabel && (
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Progress</span>
            <span className="text-white/70 font-medium">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-white/[0.06]',
            {
              'h-1': size === 'sm',
              'h-2': size === 'md',
              'h-3': size === 'lg',
            },
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              {
                'bg-brand-500': variant === 'default',
                'bg-emerald-500': variant === 'success',
                'bg-amber-500': variant === 'warning',
                'bg-red-500': variant === 'destructive',
                'bg-gradient-to-r from-brand-500 to-cyan-500': variant === 'gradient',
              }
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress, type ProgressProps };
