import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, hoverScale, tapScale } from './animations';

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
    lift: { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' },
    glow: { boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' },
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

// Pre-built animated components
export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
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
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
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
