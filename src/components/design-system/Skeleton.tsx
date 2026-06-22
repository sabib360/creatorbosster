/**
 * CreatorBoost AI — Skeleton Loading System
 * Shimmer-based skeleton screens for perceived performance
 *
 * Features:
 * - Shimmer animation effect
 * - Multiple variants (text, circular, rectangular, card, avatar, button)
 * - Pre-built patterns (SkeletonCard, SkeletonToolCard, SkeletonBlogCard)
 * - GPU-accelerated shimmer
 */

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'button';
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
          'h-48 w-full rounded-2xl': variant === 'card',
          'h-12 w-12 rounded-full': variant === 'avatar',
          'h-10 w-24 rounded-xl': variant === 'button',
        },
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

// ═══════════════════════════════════════════════════════════════════
// ShimmerSkeleton — Enhanced skeleton with motion shimmer
// ═══════════════════════════════════════════════════════════════════

interface ShimmerSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'button';
}

function ShimmerSkeleton({ className, variant = 'rectangular' }: ShimmerSkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-48 w-full rounded-2xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-xl',
  };

  return (
    <div className={cn('relative overflow-hidden bg-white/5', variantClasses[variant], className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
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
// Pre-built Skeleton Patterns
// ═══════════════════════════════════════════════════════════════════

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-[#0B1120] border border-white/[0.06] p-6 space-y-4', className)}>
      <Skeleton variant="card" className="h-32" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}

function SkeletonToolCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-[#0B1120]/60 backdrop-blur-xl border border-white/[0.05] p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-2/3" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  );
}

function SkeletonBlogCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-[#0B1120] border border-white/[0.06] overflow-hidden space-y-0', className)}>
      <Skeleton variant="card" className="h-48 rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
    </div>
  );
}

function SkeletonDashboardWidget({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-16 rounded-full" />
      </div>
      <Skeleton variant="text" className="w-24 h-8" />
      <Skeleton variant="text" className="w-full" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="h-20 flex-1 rounded-lg" />
        <Skeleton variant="rectangular" className="h-20 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonSearchResult({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl', className)}>
      <Skeleton variant="avatar" className="h-8 w-8 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-48 h-3" />
      </div>
      <Skeleton variant="text" className="w-12 rounded-full h-5" />
    </div>
  );
}

function SkeletonImageGrid({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

export {
  Skeleton,
  ShimmerSkeleton,
  SkeletonCard,
  SkeletonToolCard,
  SkeletonBlogCard,
  SkeletonDashboardWidget,
  SkeletonSearchResult,
  SkeletonImageGrid,
};
