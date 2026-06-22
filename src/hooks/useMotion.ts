/**
 * CreatorBoost AI — Motion Hooks
 * Reusable animation patterns for common interactions
 *
 * Hooks:
 * - useReducedMotion — Accessibility check
 * - useScrollPosition — Navbar blur/shadow on scroll
 * - useInViewAnimation — Viewport-triggered animation
 * - useMousePosition — Global mouse tracking
 * - useElementMousePosition — Element-relative mouse tracking
 * - useCounter — Animated number counter
 * - useStaggeredChildren — Stagger animation for lists
 * - useToast — Toast notification with animation
 * - useLoadingState — Loading state with animation
 * - useHoverScale — Simple hover scale effect
 * - useReadingProgress — Reading progress tracking
 * - useMediaQuery — Responsive breakpoint detection
 * - usePageTransition — Route transition management
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInView, useReducedMotion, useAnimation, useMotionValue, useTransform, useScroll } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// useReducedMotion — Accessibility
// ═══════════════════════════════════════════════════════════════════

export { useReducedMotion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// useScrollPosition — Navbar blur/shadow on scroll
// ═══════════════════════════════════════════════════════════════════

export function useScrollPosition(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}

// ═══════════════════════════════════════════════════════════════════
// useScrollDirection — Detect scroll direction
// ═══════════════════════════════════════════════════════════════════

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollDirection, scrollY };
}

// ═══════════════════════════════════════════════════════════════════
// useInViewAnimation — Viewport-triggered animation
// ═══════════════════════════════════════════════════════════════════

interface UseInViewAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const { threshold = 0, rootMargin = '-80px', once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold, margin: rootMargin as any, once });

  return { ref, isInView };
}

// ═══════════════════════════════════════════════════════════════════
// useMousePosition — Global mouse tracking
// ═══════════════════════════════════════════════════════════════════

export function useMousePosition() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return { mouseX, mouseY };
}

// ═══════════════════════════════════════════════════════════════════
// useElementMousePosition — Element-relative mouse tracking
// ═══════════════════════════════════════════════════════════════════

export function useElementMousePosition() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
    rotateX.set(-mouseY / 20);
    rotateY.set(mouseX / 20);
  }, [x, y, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }, [x, y, rotateX, rotateY]);

  return { ref, x, y, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// ═══════════════════════════════════════════════════════════════════
// useCounter — Animated number counter for dashboard
// ═══════════════════════════════════════════════════════════════════

export function useCounter(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return { ref, count };
}

// ═══════════════════════════════════════════════════════════════════
// useStaggeredChildren — Stagger animation for lists
// ═══════════════════════════════════════════════════════════════════

export function useStaggeredChildren(itemCount: number, staggerDelay = 0.06) {
  const container = useMemo(() => ({
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }), [staggerDelay]);

  const item = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }), []);

  return { container, item };
}

// ═══════════════════════════════════════════════════════════════════
// useToast — Toast notification with animation
// ═══════════════════════════════════════════════════════════════════

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastId = 0;
const listeners: Array<(toast: Toast) => void> = [];

export function showToast(message: string, type: Toast['type'] = 'info') {
  const id = `toast-${++toastId}`;
  listeners.forEach(listener => listener({ id, message, type }));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    showToast(message, type);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ═══════════════════════════════════════════════════════════════════
// useLoadingState — Loading state with animation
// ═══════════════════════════════════════════════════════════════════

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const controls = useAnimation();

  const startLoading = useCallback(async () => {
    setIsLoading(true);
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    });
  }, [controls]);

  const stopLoading = useCallback(async () => {
    await controls.start({
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    });
    setIsLoading(false);
  }, [controls]);

  return { isLoading, controls, startLoading, stopLoading };
}

// ═══════════════════════════════════════════════════════════════════
// useHoverScale — Simple hover scale effect
// ═══════════════════════════════════════════════════════════════════

export function useHoverScale(scale = 1.02) {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    whileHover: { scale, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98, transition: { duration: 0.1 } },
  };
}

// ═══════════════════════════════════════════════════════════════════
// useReadingProgress — Reading progress tracking
// ═══════════════════════════════════════════════════════════════════

export function useReadingProgress() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setProgress(Math.round(v * 100));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return { progress, scrollYProgress };
}

// ═══════════════════════════════════════════════════════════════════
// useMediaQuery — Responsive breakpoint detection
// ═══════════════════════════════════════════════════════════════════

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ═══════════════════════════════════════════════════════════════════
// usePageTransition — Route transition management
// ═══════════════════════════════════════════════════════════════════

export function usePageTransition() {
  const controls = useAnimation();

  const transition = useCallback(async (callback?: () => void) => {
    await controls.start({
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    });

    callback?.();

    await controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    });
  }, [controls]);

  return { controls, transition };
}

// ═══════════════════════════════════════════════════════════════════
// useClipboard — Copy to clipboard with success state
// ═══════════════════════════════════════════════════════════════════

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    }
  }, [timeout]);

  return { copied, copy };
}

// ═══════════════════════════════════════════════════════════════════
// useAnimationFrame — Request animation frame hook
// ═══════════════════════════════════════════════════════════════════

export function useAnimationFrame(callback: (delta: number) => void, isActive = true) {
  const callbackRef = useRef(callback);
  const previousTimeRef = useRef<number>(undefined);

  callbackRef.current = callback;

  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    let animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);
}
