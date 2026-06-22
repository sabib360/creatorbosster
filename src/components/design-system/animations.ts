/**
 * CreatorBoost AI — Motion Design System
 * Premium micro-interactions: Linear × Raycast × Vercel × Stripe
 *
 * Philosophy:
 * - Guide attention, don't distract
 * - Provide feedback, don't annoy
 * - Increase perceived performance
 * - Every animation earns its presence
 * - 60 FPS, GPU-accelerated, hardware-optimized
 *
 * Targets:
 * - Fast: 100ms | Normal: 200ms | Medium: 300ms | Slow: 500ms | Extra Slow: 700ms
 * - Spring for cards, buttons, modals
 * - Ease out for entering elements
 * - Ease in for exiting elements
 * - Ease in-out for moving elements
 */

import { Variants, Transition, MotionProps } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// MOTION TOKENS — Global Timing System
// ═══════════════════════════════════════════════════════════════════

export const duration = {
  instant: 0,
  fast: 0.1,
  normal: 0.2,
  medium: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

export type DurationToken = keyof typeof duration;

// ═══════════════════════════════════════════════════════════════════
// EASING SYSTEM — Premium Curves
// ═══════════════════════════════════════════════════════════════════

export const easing = {
  /** Exiting elements — quick exit */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Entering elements — smooth entrance */
  easeIn: [0.4, 0, 1, 1] as const,
  /** Moving elements — balanced motion */
  easeInOut: [0.4, 0, 0.2, 1] as const,
  /** Linear for continuous animations */
  linear: [0, 0, 1, 1] as const,
  /** Material standard curve */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Decelerate — natural feel */
  decelerate: [0, 0, 0.2, 1] as const,
  /** Accelerate — quick start */
  accelerate: [0.4, 0, 1, 1] as const,
  /** Premium feel — our signature */
  premium: [0.25, 0.46, 0.45, 0.94] as const,
  /** Sharp snappy feel */
  snappy: [0.2, 0, 0, 1] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════
// SPRING CONFIGS — Physical Motion
// ═══════════════════════════════════════════════════════════════════

export const spring = {
  /** Command palette, quick UI — tight and fast */
  snappy: { type: 'spring' as const, stiffness: 500, damping: 35 },
  /** Cards, buttons, general — smooth and natural */
  gentle: { type: 'spring' as const, stiffness: 300, damping: 24 },
  /** Playful interactions — bouncy feel */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 17 },
  /** Modal, large surfaces — firm and controlled */
  stiff: { type: 'spring' as const, stiffness: 600, damping: 30 },
  /** Default spring config */
  default: { type: 'spring' as const, stiffness: 300, damping: 24 },
} as const;

export type SpringPreset = keyof typeof spring;

// ═══════════════════════════════════════════════════════════════════
// TRANSITION PRESETS — Ready-to-Use Configs
// ═══════════════════════════════════════════════════════════════════

export const transition = {
  fast: { duration: duration.fast, ease: easing.easeOut },
  normal: { duration: duration.normal, ease: easing.easeOut },
  medium: { duration: duration.medium, ease: easing.easeInOut },
  slow: { duration: duration.slow, ease: easing.standard },
  premium: { duration: duration.slow, ease: easing.premium },
  spring: spring.gentle,
  springSnappy: spring.snappy,
  springBouncy: spring.bouncy,
} as const;

// ═══════════════════════════════════════════════════════════════════
// PREFERS-REDUCED-MOTION CHECK — Accessibility
// ═══════════════════════════════════════════════════════════════════

export function respectsReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionDuration(original: number): number {
  if (typeof window === 'undefined') return original;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : original;
}

// ═══════════════════════════════════════════════════════════════════
// PAGE TRANSITIONS — Route Changes
// ═══════════════════════════════════════════════════════════════════

/** Fade + slide up page transition (Linear/Vercel feel) */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.premium },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: easing.easeIn },
  },
};

/** Scale-based page transition */
export const pageTransitionScale: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easing.premium },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

/** Slide from right page transition (app-like) */
export const pageTransitionSlide: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easing.premium },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

// ═══════════════════════════════════════════════════════════════════
// ENTRANCE ANIMATIONS — Element Appearances
// ═══════════════════════════════════════════════════════════════════

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const slideInBottom: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
};

export const scaleInFast: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: spring.snappy,
  },
};

/** Blur reveal — premium content entrance */
export const blurReveal: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)', y: 20 },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.6, ease: easing.premium },
  },
};

/** Clip-path reveal — cinematic entrance */
export const clipReveal: Variants = {
  initial: { clipPath: 'inset(0 0 100% 0)' },
  animate: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.6, ease: easing.premium },
  },
};

// ═══════════════════════════════════════════════════════════════════
// STAGGER SYSTEM — Cascading Entrance
// ═══════════════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

export const staggerItemFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.normal },
  },
};

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
};

export const staggerItemSlide: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

// ═══════════════════════════════════════════════════════════════════
// HERO ANIMATIONS — Landing Page
// ═══════════════════════════════════════════════════════════════════

export const heroTitle: Variants = {
  initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easing.premium, delay: 0.1 },
  },
};

export const heroSubtitle: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.premium, delay: 0.3 },
  },
};

export const heroSearch: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easing.premium, delay: 0.5 },
  },
};

export const heroBadges: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.premium, delay: 0.7 },
  },
};

export const heroContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// HOVER EFFECTS — Interactive Feedback
// ═══════════════════════════════════════════════════════════════════

export const hoverScale = {
  scale: 1.02,
  transition: { duration: duration.normal, ease: easing.easeOut },
};

export const hoverScaleSubtle = {
  scale: 1.01,
  transition: { duration: duration.fast, ease: easing.easeOut },
};

export const hoverScaleDown = {
  scale: 0.98,
  transition: { duration: duration.fast, ease: easing.easeOut },
};

export const hoverLift = {
  y: -4,
  transition: { duration: duration.medium, ease: easing.standard },
};

export const hoverLiftSubtle = {
  y: -2,
  transition: { duration: duration.normal, ease: easing.standard },
};

export const hoverGlow = {
  boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)',
  transition: { duration: duration.medium },
};

export const hoverGlowBrand = {
  boxShadow: '0 8px 40px rgba(124, 58, 237, 0.15), 0 0 80px rgba(124, 58, 237, 0.05)',
  transition: { duration: duration.medium },
};

/** Combined: lift + glow — premium card hover */
export const hoverLiftGlow: MotionProps['whileHover'] = {
  y: -4,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(124, 58, 237, 0.05)',
  transition: { duration: duration.medium, ease: easing.standard },
};

/** Combined: scale + glow — button hover */
export const hoverScaleGlow: MotionProps['whileHover'] = {
  scale: 1.02,
  boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)',
  transition: { duration: duration.normal, ease: easing.easeOut },
};

// ═══════════════════════════════════════════════════════════════════
// TAP EFFECTS — Press Feedback
// ═══════════════════════════════════════════════════════════════════

export const tapScale: MotionProps['whileTap'] = {
  scale: 0.97,
  transition: { duration: duration.fast },
};

export const tapScaleDown: MotionProps['whileTap'] = {
  scale: 0.95,
  transition: spring.bouncy,
};

export const tapBounce: MotionProps['whileTap'] = {
  scale: 0.95,
  transition: spring.bouncy,
};

// ═══════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS — Viewport Triggered
// ═══════════════════════════════════════════════════════════════════

export const scrollFadeIn: MotionProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: duration.slow, ease: easing.premium },
};

export const scrollFadeInLeft: MotionProps = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: duration.slow, ease: easing.premium },
};

export const scrollFadeInRight: MotionProps = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: duration.slow, ease: easing.premium },
};

export const scrollScale: MotionProps = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: duration.slow, ease: easing.premium },
};

export const scrollBlur: MotionProps = {
  initial: { opacity: 0, filter: 'blur(10px)', y: 30 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: easing.premium },
};

// ═══════════════════════════════════════════════════════════════════
// CARD VARIANTS — Interactive Cards
// ═══════════════════════════════════════════════════════════════════

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

export const cardHoverVariants: MotionProps['whileHover'] = {
  y: -4,
  transition: { duration: duration.medium, ease: easing.standard },
};

export const cardHoverBorder: MotionProps['whileHover'] = {
  borderColor: 'rgba(124, 58, 237, 0.3)',
  transition: { duration: duration.normal },
};

/** Premium card entrance */
export const premiumCardVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
};

/** Premium card hover — lift + glow + border */
export const premiumCardHover: MotionProps['whileHover'] = {
  y: -4,
  boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.1), 0 8px 40px rgba(0, 0, 0, 0.2), 0 0 80px rgba(124, 58, 237, 0.05)',
  borderColor: 'rgba(124, 58, 237, 0.2)',
  transition: { duration: duration.medium, ease: easing.standard },
};

// ═══════════════════════════════════════════════════════════════════
// MODAL / OVERLAY ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.normal } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: spring.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

export const modalSlideUp: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.gentle,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

// ─── Command Palette ────────────────────────────────────────────

export const commandPaletteBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const commandPaletteContent: Variants = {
  initial: { opacity: 0, scale: 0.96, y: -15 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: spring.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

// ═══════════════════════════════════════════════════════════════════
// TOAST / NOTIFICATION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const toastEnter: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95, x: 0 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.snappy,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

export const toastSlideInRight: Variants = {
  initial: { opacity: 0, x: 100, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: spring.snappy,
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

// ═══════════════════════════════════════════════════════════════════
// LOADING / SKELETON ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const pulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% center', '-200% center'],
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
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

/** Typing indicator dots */
export const typingDots: Variants = {
  animate: {
    y: [0, -4, 0],
    transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ═══════════════════════════════════════════════════════════════════
// FLOATING / AMBIENT ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const floatingAnimation: MotionProps = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatingSlowAnimation: MotionProps = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SUCCESS / FEEDBACK ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const successPop: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: [0, 1.2, 1],
    transition: { duration: 0.4, ease: easing.premium },
  },
};

export const checkmarkDraw: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: easing.premium, delay: 0.1 },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SHARED TRANSITION CONFIGS
// ═══════════════════════════════════════════════════════════════════

export const smoothTransition: Transition = {
  duration: duration.medium,
  ease: easing.standard,
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};

export const fastTransition: Transition = {
  duration: duration.fast,
  ease: easing.easeOut,
};

// ═══════════════════════════════════════════════════════════════════
// LAYOUT ANIMATIONS — Shared Layout
// ═══════════════════════════════════════════════════════════════════

export const layoutTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const layoutAnimation: MotionProps = {
  layout: true,
  transition: layoutTransition,
};

// ═══════════════════════════════════════════════════════════════════
// NAVBAR SCROLL ANIMATION
// ═══════════════════════════════════════════════════════════════════

export const navbarScrolled: MotionProps = {
  initial: { backgroundColor: 'rgba(5, 8, 22, 0)' },
  animate: { backgroundColor: 'rgba(11, 17, 32, 0.85)' },
  transition: { duration: duration.normal, ease: easing.easeOut },
};

// ═══════════════════════════════════════════════════════════════════
// IMAGE / MEDIA ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const imageReveal: Variants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.premium },
  },
};

export const imageHoverZoom: MotionProps['whileHover'] = {
  scale: 1.05,
  transition: { duration: duration.medium, ease: easing.standard },
};

// ═══════════════════════════════════════════════════════════════════
// COUNTER / NUMBER ANIMATION (for dashboard)
// ═══════════════════════════════════════════════════════════════════

export const counterContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const counterItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

// ═══════════════════════════════════════════════════════════════════
// MOBILE-SPECIFIC ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const mobileSlideUp: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: duration.normal, ease: easing.easeIn },
  },
};

export const mobileMenuOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.normal } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

// ═══════════════════════════════════════════════════════════════════
// DROPZONE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const dropzoneIdle: Variants = {
  initial: { borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: 'transparent' },
  animate: { borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: 'transparent' },
};

export const dropzoneActive: Variants = {
  animate: {
    borderColor: 'rgba(124, 58, 237, 0.5)',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    scale: 1.01,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

export const dropzoneError: Variants = {
  animate: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

// ═══════════════════════════════════════════════════════════════════
// ACCORDION / COLLAPSE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const accordionContent: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: duration.medium, ease: easing.premium }, opacity: { duration: duration.normal, ease: easing.easeOut } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: duration.medium, ease: easing.easeIn }, opacity: { duration: duration.fast, ease: easing.easeIn } },
  },
};

export const accordionChevron: MotionProps['animate'] = {
  rotate: 0,
  transition: { duration: duration.normal, ease: easing.standard },
};

export const accordionChevronOpen: MotionProps['animate'] = {
  rotate: 180,
  transition: { duration: duration.normal, ease: easing.standard },
};

// ═══════════════════════════════════════════════════════════════════
// TAB ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const tabContent: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
};

// ═══════════════════════════════════════════════════════════════════
// READING PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════

export const progressBar: MotionProps = {
  style: { transformOrigin: '0%' },
  transition: { duration: duration.fast, ease: easing.easeOut },
};

// ═══════════════════════════════════════════════════════════════════
// MOUSE FOLLOW EFFECTS
// ═══════════════════════════════════════════════════════════════════

export const mouseFollowGlow: MotionProps = {
  transition: { type: 'spring', stiffness: 150, damping: 15 },
};

// ═══════════════════════════════════════════════════════════════════
// RETRY / ERROR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const shake: Variants = {
  animate: {
    x: [0, -6, 6, -6, 6, 0],
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const errorShake: MotionProps = {
  animate: {
    x: [0, -6, 6, -6, 6, 0],
  },
  transition: { duration: 0.4, ease: easing.easeOut },
};
