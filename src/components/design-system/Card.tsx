/**
 * CreatorBoost AI — Card Component
 * Premium card with motion micro-interactions
 */

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easing, duration, spring } from './animations';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'hover' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  motion?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', motion: enableMotion = true, ...props }, ref) => {
    const motionProps: MotionProps = enableMotion
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-50px' },
          transition: { duration: duration.medium, ease: easing.premium },
          whileHover:
            variant === 'interactive' || variant === 'hover'
              ? {
                  y: -4,
                  transition: { duration: duration.medium, ease: easing.standard },
                }
              : undefined,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          // Variants
          {
            'bg-[#0B1120] border border-white/[0.06] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20': variant === 'default',
            'glass-card': variant === 'glass',
            'gradient-border gradient-border-hover bg-[#0B1120]': variant === 'gradient',
            'card-premium': variant === 'hover',
            'bg-[#0B1120]/60 backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.10] hover:shadow-lg hover:shadow-brand-500/5 cursor-pointer': variant === 'interactive',
          },
          // Padding
          {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...(motionProps as any)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-white tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/50', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardProps };
