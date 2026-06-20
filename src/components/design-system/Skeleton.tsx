import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'skeleton',
        {
          'h-4 w-full rounded': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
        },
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
