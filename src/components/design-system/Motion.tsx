/**
 * CreatorBoost AI — Motion Wrapper
 * Legacy wrapper that delegates to the new motion system
 */

import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import {
  pageTransition,
  fadeInUp,
  staggerContainer,
  staggerItem,
  hoverScale,
  tapScale,
  easing,
  duration,
} from './animations';

interface MotionWrapperProps extends MotionProps {
  children: ReactNode;
  variant?: 'page' | 'fadeInUp' | 'stagger' | 'staggerItem';
  hover?: 'scale' | 'lift' | 'glow' | 'none';
  tap?: 'scale' | 'none';
  className?: string;
}

export function Motion({
  children,
  variant = 'page',
  hover = 'none',
  tap = 'none',
  className,
  ...props
}: MotionWrapperProps) {
  const variantMap = {
    page: pageTransition,
    fadeInUp,
    stagger: staggerContainer,
    staggerItem,
  };

  const hoverMap = {
    scale: hoverScale,
    lift: { y: -4, transition: { duration: duration.medium, ease: easing.standard } },
    glow: { boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)' },
    none: undefined,
  };

  const tapMap = {
    scale: tapScale,
    none: undefined,
  };

  return (
    <motion.div
      variants={variantMap[variant]}
      whileHover={hoverMap[hover]}
      whileTap={tapMap[tap]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className, index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.3 } }}
      className={`relative group ${className || ''}`}
    >
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/20 via-cyan-500/10 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative glass-card rounded-2xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
