/**
 * CreatorBoost AI — Motion Design System
 * Central export for all motion tokens, variants, components, and hooks
 *
 * Usage:
 *   import { duration, spring, easing } from '@/components/design-system/motion-system';
 *   import { FadeIn, SlideUp, StaggerContainer } from '@/components/design-system/motion-system';
 *   import { useScrollPosition, useCounter } from '@/components/design-system/motion-system';
 */

// ═══════════════════════════════════════════════════════════════════
// TOKENS — Export everything from animations.ts
// ═══════════════════════════════════════════════════════════════════

export {
  // Duration tokens
  duration,
  type DurationToken,

  // Easing curves
  easing,

  // Spring configs
  spring,
  type SpringPreset,

  // Transition presets
  transition,

  // Accessibility
  respectsReducedMotion,

  // Page transitions
  pageTransition,
  pageTransitionScale,
  pageTransitionSlide,

  // Entrance animations
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  slideInLeft,
  slideInRight,
  slideInBottom,
  scaleIn,
  scaleInFast,
  blurReveal,
  clipReveal,

  // Stagger system
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  staggerItem,
  staggerItemFade,
  staggerItemScale,
  staggerItemSlide,

  // Hero animations
  heroTitle,
  heroSubtitle,
  heroSearch,
  heroBadges,
  heroContainer,

  // Hover effects
  hoverScale,
  hoverScaleSubtle,
  hoverScaleDown,
  hoverLift,
  hoverLiftSubtle,
  hoverGlow,
  hoverGlowBrand,
  hoverLiftGlow,
  hoverScaleGlow,

  // Tap effects
  tapScale,
  tapScaleDown,
  tapBounce,

  // Scroll animations
  scrollFadeIn,
  scrollFadeInLeft,
  scrollFadeInRight,
  scrollScale,
  scrollBlur,

  // Card variants
  cardVariants,
  cardHoverVariants,
  cardHoverBorder,
  premiumCardVariants,
  premiumCardHover,

  // Modal animations
  modalBackdrop,
  modalContent,
  modalSlideUp,
  commandPaletteBackdrop,
  commandPaletteContent,

  // Toast animations
  toastEnter,
  toastSlideInRight,

  // Loading animations
  pulse,
  shimmer,
  spin,
  bounce,
  typingDots,

  // Floating animations
  floatingAnimation,
  floatingSlowAnimation,

  // Success animations
  successPop,
  checkmarkDraw,

  // Shared transitions
  smoothTransition,
  springTransition,
  fastTransition,
  layoutTransition,
  layoutAnimation,

  // Navbar
  navbarScrolled,

  // Image animations
  imageReveal,
  imageHoverZoom,

  // Counter animations
  counterContainer,
  counterItem,

  // Mobile animations
  mobileSlideUp,
  mobileMenuOverlay,

  // Dropzone animations
  dropzoneIdle,
  dropzoneActive,
  dropzoneError,

  // Accordion animations
  accordionContent,
  accordionChevron,
  accordionChevronOpen,

  // Tab animations
  tabContent,

  // Reading progress
  progressBar,

  // Mouse follow
  mouseFollowGlow,

  // Error animations
  shake,
  errorShake,
} from './animations';

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS — Export from MotionComponents.tsx
// ═══════════════════════════════════════════════════════════════════

export {
  FadeIn,
  SlideUp,
  SlideLeft,
  SlideRight,
  ScaleIn,
  BlurReveal,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  HoverScale,
  GlowCard,
  MouseGlow,
  AnimatedButton,
  AnimatedIcon,
  ProgressRing,
  LoadingSpinner,
  Skeleton,
  ToolCardSkeleton,
  SearchResultsSkeleton,
  DashboardWidgetSkeleton,
  BlogCardSkeleton,
  ReadingProgressBar,
  CopySuccessAnimation,
  AnimatedCounter,
  ConditionalMotion,
} from './MotionComponents';

// ═══════════════════════════════════════════════════════════════════
// HOOKS — Export from useMotion.ts
// ═══════════════════════════════════════════════════════════════════

export {
  useReducedMotion,
  useScrollPosition,
  useScrollDirection,
  useInViewAnimation,
  useMousePosition,
  useElementMousePosition,
  useCounter,
  useStaggeredChildren,
  useToast,
  showToast,
  useLoadingState,
  useHoverScale,
  useReadingProgress,
  useMediaQuery,
  usePageTransition,
  useClipboard,
  useAnimationFrame,
} from '../../hooks/useMotion';

// ═══════════════════════════════════════════════════════════════════
// PAGE TRANSITIONS — Export from PageTransition.tsx
// ═══════════════════════════════════════════════════════════════════

export {
  PageTransition,
  SectionReveal,
  HeroReveal,
  StaggerList,
  StaggerListItem,
} from './PageTransition';

// ═══════════════════════════════════════════════════════════════════
// UI COMPONENTS — Export from design-system components
// ═══════════════════════════════════════════════════════════════════

export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from './Modal';
export { ToastProvider, useToast as useDesignToast } from './Toast';
export { Skeleton as BaseSkeleton, SkeletonCard, SkeletonToolCard as BaseSkeletonToolCard, SkeletonBlogCard } from './Skeleton';
