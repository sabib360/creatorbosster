import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info' | 'brand' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold transition-all duration-200',
        // Sizes
        {
          'px-2 py-0.5 text-[10px] rounded-md': size === 'sm',
          'px-2.5 py-1 text-xs rounded-lg': size === 'md',
          'px-3 py-1.5 text-sm rounded-lg': size === 'lg',
        },
        // Variants
        {
          'bg-brand-500/10 text-brand-400 border border-brand-500/20': variant === 'default',
          'bg-white/[0.06] text-white/60 border border-white/[0.06]': variant === 'secondary',
          'border border-white/[0.10] text-white/60': variant === 'outline',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-400 border border-amber-500/20': variant === 'warning',
          'bg-red-500/10 text-red-400 border border-red-500/20': variant === 'destructive',
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20': variant === 'info',
          'bg-brand-600/20 text-brand-300 border border-brand-500/30': variant === 'brand',
          'glass text-white/70': variant === 'glass',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  )
);
Badge.displayName = 'Badge';

export { Badge, type BadgeProps };
