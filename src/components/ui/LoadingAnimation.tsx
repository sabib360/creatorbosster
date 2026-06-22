/**
 * CreatorBoost AI — Loading Animation
 * Premium loading states with smooth motion
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { spring, easing, duration } from '../design-system/animations';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export default function LoadingAnimation({
  size = 'md',
  text,
  className,
  variant = 'spinner',
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500"
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className="text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <motion.div
          className={cn('rounded-full bg-brand-500/20', sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {text && (
          <motion.p
            className="text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      {text && (
        <motion.p
          className="text-sm text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Loading Skeleton with shimmer
// ═══════════════════════════════════════════════════════════════════

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-white/5 rounded-xl', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Loading Spinner SVG
// ═══════════════════════════════════════════════════════════════════

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <motion.svg
      className={cn('text-brand-500', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Processing Animation
// ═══════════════════════════════════════════════════════════════════

interface ProcessingAnimationProps {
  progress?: number;
  text?: string;
  className?: string;
}

export function ProcessingAnimation({
  progress = 0,
  text = 'Processing...',
  className,
}: ProcessingAnimationProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-500/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-brand-400">{Math.round(progress)}%</span>
        </div>
      </div>
      <motion.p
        className="text-sm text-white/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
