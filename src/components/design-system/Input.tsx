import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconRight?: ReactNode;
  error?: string;
  label?: string;
  hint?: string;
  variant?: 'default' | 'glass' | 'search';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, iconRight, error, label, hint, variant = 'default', type, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-white/[0.04] px-4 py-2.5 text-sm text-white transition-all duration-200',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',
              'placeholder:text-white/25',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/40 focus:bg-white/[0.06]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Variants
              {
                'border-white/[0.06] hover:border-white/[0.10]': variant === 'default',
                'glass border-white/[0.06] hover:border-white/[0.10]': variant === 'glass',
                'border-white/[0.06] hover:border-white/[0.10] rounded-2xl': variant === 'search',
              },
              icon && 'pl-10',
              iconRight && 'pr-10',
              error && 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/40',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/30">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm text-white transition-all duration-200',
            'placeholder:text-white/25',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/40 focus:bg-white/[0.06]',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
            error && 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/40',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Input, Textarea, type InputProps, type TextareaProps };
