/**
 * CreatorBoost AI — Page Transition System
 * Smooth route transitions with AnimatePresence
 *
 * Features:
 * - Fade, scale, and slide variants
 * - Respects prefers-reduced-motion
 * - SectionReveal for scroll-triggered sections
 * - HeroReveal for staggered hero animations
 * - StaggerList for cascading list animations
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  pageTransition,
  pageTransitionScale,
  pageTransitionSlide,
  respectsReducedMotion,
  easing,
  duration,
} from './animations';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'scale' | 'slide' | 'none';
}

export function PageTransition({
  children,
  variant = 'fade',
}: PageTransitionProps) {
  const location = useLocation();
  const reducedMotion = respectsReducedMotion();

  const variants = variant === 'scale'
    ? pageTransitionScale
    : variant === 'slide'
    ? pageTransitionSlide
    : pageTransition;

  if (reducedMotion || variant === 'none') {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SectionReveal — Scroll-triggered section entrance
// ═══════════════════════════════════════════════════════════════════

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
}: SectionRevealProps) {
  const directionMap = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  };

  const { initial, animate } = directionMap[direction];

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: easing.premium, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HeroReveal — Staggered hero animation
// ═══════════════════════════════════════════════════════════════════

interface HeroRevealProps {
  children: ReactNode;
  className?: string;
}

export function HeroReveal({ children, className }: HeroRevealProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
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
// StaggerList — Staggered list animation
// ═══════════════════════════════════════════════════════════════════

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerList({
  children,
  className,
  staggerDelay = 0.06,
}: StaggerListProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
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
// StaggerListItem — Individual staggered item
// ═══════════════════════════════════════════════════════════════════

interface StaggerListItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerListItem({ children, className }: StaggerListItemProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: easing.premium },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
