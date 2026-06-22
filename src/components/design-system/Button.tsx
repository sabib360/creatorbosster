/**
 * CreatorBoost AI — Button Component
 * Premium button with motion micro-interactions
 */

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { easing, duration, spring } from './animations';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  motion?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    disabled,
    children,
    motion: enableMotion = true,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    const motionProps: MotionProps = enableMotion
      ? {
          whileHover: isDisabled
            ? undefined
            : {
                scale: 1.02,
                transition: { duration: duration.normal, ease: easing.easeOut },
              },
          whileTap: isDisabled
            ? undefined
            : {
                scale: 0.97,
                transition: { duration: duration.fast },
              },
        }
      : {};

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 btn-glow': variant === 'default',
            'bg-white/[0.06] text-white/80 hover:bg-white/[0.10] hover:text-white border border-white/[0.06] hover:border-white/[0.12]': variant === 'secondary',
            'border border-white/[0.08] bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.15]': variant === 'outline',
            'bg-transparent text-white/60 hover:bg-white/[0.05] hover:text-white': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20': variant === 'destructive',
            'text-brand-400 underline-offset-4 hover:underline': variant === 'link',
            'bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white hover:from-brand-500 hover:via-brand-400 hover:to-cyan-400 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 btn-glow': variant === 'gradient',
            'glass text-white/80 hover:text-white border border-white/[0.06] hover:border-white/[0.12]': variant === 'glass',
          },
          // Sizes
          {
            'h-8 px-3 text-xs rounded-lg': size === 'sm',
            'h-10 px-5 text-sm': size === 'md',
            'h-12 px-7 text-base': size === 'lg',
            'h-10 w-10 p-0 rounded-xl': size === 'icon',
            'h-8 w-8 p-0 rounded-lg': size === 'icon-sm',
            'h-12 w-12 p-0 rounded-xl': size === 'icon-lg',
          },
          className
        )}
        {...(motionProps as any)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, type ButtonProps };
