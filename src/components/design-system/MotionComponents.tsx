/**
 * CreatorBoost AI — Motion Components Library
 * Reusable animated building blocks for premium SaaS UX
 *
 * Components:
 * - FadeIn, SlideUp, SlideLeft, SlideRight, ScaleIn
 * - StaggerContainer + StaggerItem
 * - HoverLift, HoverScale, GlowCard
 * - AnimatedButton, AnimatedIcon
 * - ProgressRing, LoadingSpinner
 * - Skeleton, ToolCardSkeleton, SearchResultsSkeleton
 * - ReadingProgressBar
 * - MouseGlow
 * - CopySuccessAnimation
 */

import { ReactNode, forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { motion, MotionProps, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeInDown,
  scaleIn,
  staggerContainer,
  staggerItem,
  staggerItemFade,
  staggerItemSlide,
  spring,
  easing,
  duration,
  hoverLift,
  hoverScale,
  tapScale,
  modalBackdrop,
  modalContent,
  toastEnter,
  respectsReducedMotion,
} from './animations';

// ═══════════════════════════════════════════════════════════════════
// FadeIn — Simple fade entrance
// ═══════════════════════════════════════════════════════════════════

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Trigger on viewport or on mount */
  viewport?: boolean;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, className, delay = 0, viewport = false, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={viewport ? undefined : { opacity: 1 }}
      whileInView={viewport ? { opacity: 1 } : undefined}
      viewport={viewport ? { once: true, margin: '-80px' } : undefined}
      transition={{ duration: duration.normal, ease: easing.easeOut, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

// ═══════════════════════════════════════════════════════════════════
// SlideUp — Fade up entrance
// ═══════════════════════════════════════════════════════════════════

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  viewport?: boolean;
}

export const SlideUp = forwardRef<HTMLDivElement, SlideUpProps>(
  ({ children, className, delay = 0, distance = 30, viewport = false, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={viewport ? undefined : { opacity: 1, y: 0 }}
      whileInView={viewport ? { opacity: 1, y: 0 } : undefined}
      viewport={viewport ? { once: true, margin: '-80px' } : undefined}
      transition={{ duration: duration.medium, ease: easing.premium, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideUp.displayName = 'SlideUp';

// ═══════════════════════════════════════════════════════════════════
// SlideLeft — Slide from left entrance
// ═══════════════════════════════════════════════════════════════════

interface SlideLeftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewport?: boolean;
}

export function SlideLeft({ children, className, delay = 0, viewport = false }: SlideLeftProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={viewport ? undefined : { opacity: 1, x: 0 }}
      whileInView={viewport ? { opacity: 1, x: 0 } : undefined}
      viewport={viewport ? { once: true, margin: '-80px' } : undefined}
      transition={{ duration: duration.medium, ease: easing.premium, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SlideRight — Slide from right entrance
// ═══════════════════════════════════════════════════════════════════

interface SlideRightProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewport?: boolean;
}

export function SlideRight({ children, className, delay = 0, viewport = false }: SlideRightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={viewport ? undefined : { opacity: 1, x: 0 }}
      whileInView={viewport ? { opacity: 1, x: 0 } : undefined}
      viewport={viewport ? { once: true, margin: '-80px' } : undefined}
      transition={{ duration: duration.medium, ease: easing.premium, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ScaleIn — Scale entrance
// ═══════════════════════════════════════════════════════════════════

interface ScaleInProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, className, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring.gentle, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = 'ScaleIn';

// ═══════════════════════════════════════════════════════════════════
// BlurReveal — Premium blur entrance
// ═══════════════════════════════════════════════════════════════════

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BlurReveal({ children, className, delay = 0 }: BlurRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: easing.premium, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// StaggerContainer — Container for staggered children
// ═══════════════════════════════════════════════════════════════════

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewport?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.06,
  delayChildren = 0.1,
  viewport = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate={viewport ? undefined : 'animate'}
      whileInView={viewport ? 'animate' : undefined}
      viewport={viewport ? { once: true, margin: '-50px' } : undefined}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// StaggerItem — Individual staggered item
// ═══════════════════════════════════════════════════════════════════

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'fade' | 'scale' | 'slide';
}

export function StaggerItem({ children, className, variant = 'default' }: StaggerItemProps) {
  const variantMap = {
    default: staggerItem,
    fade: staggerItemFade,
    scale: staggerItemSlide,
    slide: staggerItemSlide,
  };

  return (
    <motion.div variants={variantMap[variant]} className={className}>
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HoverLift — Card with lift hover effect
// ═══════════════════════════════════════════════════════════════════

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
  viewport?: boolean;
}

export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, className, intensity = 'normal', viewport = true, ...props }, ref) => {
    const liftMap = {
      subtle: { y: -2 },
      normal: { y: -4 },
      strong: { y: -6 },
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport ? { once: true, margin: '-50px' } : undefined}
        whileHover={liftMap[intensity]}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: duration.medium, ease: easing.standard }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
HoverLift.displayName = 'HoverLift';

// ═══════════════════════════════════════════════════════════════════
// HoverScale — Element with scale hover effect
// ═══════════════════════════════════════════════════════════════════

interface HoverScaleProps extends MotionProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export const HoverScale = forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ children, className, scale = 1.02, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale, transition: { duration: duration.normal, ease: easing.easeOut } }}
      whileTap={{ scale: 0.98, transition: { duration: duration.fast } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverScale.displayName = 'HoverScale';

// ═══════════════════════════════════════════════════════════════════
// GlowCard — Card with animated glow border
// ═══════════════════════════════════════════════════════════════════

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  viewport?: boolean;
}

export function GlowCard({ children, className, viewport = true }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport ? { once: true, margin: '-50px' } : undefined}
      whileHover={{ y: -2, transition: { duration: duration.medium } }}
      transition={{ duration: duration.medium, ease: easing.premium }}
      className={cn('relative group', className)}
    >
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/20 via-cyan-500/10 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative glass-card rounded-2xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MouseGlow — Mouse-following glow effect
// ═══════════════════════════════════════════════════════════════════

interface MouseGlowProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function MouseGlow({ children, className, glowColor = 'rgba(124, 58, 237, 0.15)' }: MouseGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden', className)}
    >
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          left: mouseX,
          top: mouseY,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AnimatedButton — Button with micro-interactions
// ═══════════════════════════════════════════════════════════════════

interface AnimatedButtonProps extends MotionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'scale' | 'lift';
}

export function AnimatedButton({
  children,
  className,
  variant = 'default',
  ...props
}: AnimatedButtonProps) {
  const hoverEffects = {
    default: { scale: 1.02, transition: { duration: duration.normal } },
    glow: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)',
      transition: { duration: duration.normal },
    },
    scale: { scale: 1.05, transition: { duration: duration.normal } },
    lift: { y: -2, scale: 1.02, transition: { duration: duration.normal } },
  };

  return (
    <motion.button
      whileHover={hoverEffects[variant]}
      whileTap={{ scale: 0.97, transition: { duration: duration.fast } }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AnimatedIcon — Icon with hover animation
// ═══════════════════════════════════════════════════════════════════

interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
  animation?: 'rotate' | 'bounce' | 'scale' | 'shake';
}

export function AnimatedIcon({
  children,
  className,
  animation = 'scale',
}: AnimatedIconProps) {
  const hoverEffects = {
    rotate: { rotate: 360, transition: { duration: 0.5, ease: easing.standard } },
    bounce: { y: -3, transition: { type: 'spring' as const, stiffness: 400, damping: 17 } },
    scale: { scale: 1.1, transition: { duration: duration.normal } },
    shake: {
      x: [0, -3, 3, -3, 3, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      whileHover={hoverEffects[animation]}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ProgressRing — Animated progress indicator
// ═══════════════════════════════════════════════════════════════════

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 3,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={cn('-rotate-90', className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-white/10"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: easing.premium }}
        className="text-brand-500"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LoadingSpinner — Animated loading indicator
// ═══════════════════════════════════════════════════════════════════

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 20, className }: LoadingSpinnerProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-white/10"
      />
      <motion.path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-brand-500"
      />
    </motion.svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Skeleton — Shimmer skeleton loading
// ═══════════════════════════════════════════════════════════════════

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'h-20 w-full rounded-xl',
  };

  return (
    <div className={cn('relative overflow-hidden bg-white/5', variantClasses[variant], className)}>
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
// ToolCardSkeleton — Skeleton for tool cards
// ═══════════════════════════════════════════════════════════════════

export function ToolCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-3 w-full mb-3" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SearchResultsSkeleton — Skeleton for search results
// ═══════════════════════════════════════════════════════════════════

export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <StaggerContainer staggerDelay={0.05}>
      {Array.from({ length: count }).map((_, i) => (
        <StaggerItem key={i}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1.5" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DashboardWidgetSkeleton — Skeleton for dashboard widgets
// ═══════════════════════════════════════════════════════════════════

export function DashboardWidgetSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BlogCardSkeleton — Skeleton for blog cards
// ═══════════════════════════════════════════════════════════════════

export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden', className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ReadingProgressBar — Article reading progress
// ═══════════════════════════════════════════════════════════════════

interface ReadingProgressBarProps {
  className?: string;
  color?: string;
}

export function ReadingProgressBar({ className, color }: ReadingProgressBarProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn('fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left', className)}
      style={{
        scaleX: scrollYProgress,
        backgroundColor: color || 'rgb(124, 58, 237)',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════
// CopySuccessAnimation — Clipboard success feedback
// ═══════════════════════════════════════════════════════════════════

interface CopySuccessProps {
  show: boolean;
  className?: string;
}

export function CopySuccessAnimation({ show, className }: CopySuccessProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -10 }}
          transition={spring.snappy}
          className={cn(
            'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500 text-white whitespace-nowrap',
            className
          )}
        >
          Copied!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AnimatedCounter — Number counting animation
// ═══════════════════════════════════════════════════════════════════

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  target,
  duration: durationMs = 1500,
  className,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.current) {
          isInView.current = true;

          let startTime: number;
          let animationFrame: number;

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));

            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate);
            }
          };

          animationFrame = requestAnimationFrame(animate);
          return () => cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ConditionalMotion — Respects prefers-reduced-motion
// ═══════════════════════════════════════════════════════════════════

interface ConditionalMotionProps {
  children: ReactNode;
  className?: string;
  animate: MotionProps['animate'];
  initial?: MotionProps['initial'];
  transition?: MotionProps['transition'];
}

export function ConditionalMotion({
  children,
  className,
  animate,
  initial = {},
  transition,
}: ConditionalMotionProps) {
  const reducedMotion = respectsReducedMotion();

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={reducedMotion ? {} : animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
