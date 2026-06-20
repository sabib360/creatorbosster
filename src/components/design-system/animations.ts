/**
 * Animation System for CreatorBoost AI
 * Provides reusable animation variants for Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

// ─── Page Transitions ──────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Stagger Container ─────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Hover Effects ──────────────────────────────────
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverScaleDown = {
  scale: 0.98,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverLift = {
  y: -4,
  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverGlow = {
  boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
  transition: { duration: 0.3 },
};

// ─── Loading Animations ────────────────────────────
export const pulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
};

export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─── Scroll Animations (for use with whileInView) ──
export const scrollFadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const scrollSlideLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const scrollSlideRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const scrollScale = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

// ─── Micro-interactions ────────────────────────────
export const tapScale = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const tapBounce = {
  scale: 0.95,
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// ─── Shared Transition Config ──────────────────────
export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};
