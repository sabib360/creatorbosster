/**
 * CreatorBoost AI — Design Tokens
 * Enterprise-grade design system
 * 
 * Inspired by: Linear, Raycast, Stripe, Vercel
 */

// ═══════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════

export const colors = {
  brand: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
} as const;

// ═══════════════════════════════════════════════════
// SEMANTIC COLORS (Dark Mode)
// ═══════════════════════════════════════════════════

export const semanticColors = {
  dark: {
    background: '#050816',
    foreground: 'oklch(0.97 0.002 270)',
    card: '#0B1120',
    cardForeground: 'oklch(0.97 0.002 270)',
    popover: '#0B1120',
    popoverForeground: 'oklch(0.97 0.002 270)',
    primary: '#7c3aed',
    primaryForeground: 'oklch(0.98 0.002 280)',
    secondary: '#0F172A',
    secondaryForeground: 'oklch(0.90 0.005 270)',
    muted: '#0F172A',
    mutedForeground: 'oklch(0.60 0.01 270)',
    accent: '#0F172A',
    accentForeground: 'oklch(0.90 0.005 270)',
    destructive: 'oklch(0.60 0.22 25)',
    destructiveForeground: 'oklch(0.98 0.002 25)',
    border: 'oklch(0.18 0.012 270)',
    input: '#0F172A',
    ring: '#7c3aed',
  },
  light: {
    background: '#ffffff',
    foreground: 'oklch(0.15 0.01 270)',
    card: '#ffffff',
    cardForeground: 'oklch(0.15 0.01 270)',
    popover: '#ffffff',
    popoverForeground: 'oklch(0.15 0.01 270)',
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    secondary: '#f1f5f9',
    secondaryForeground: 'oklch(0.35 0.01 270)',
    muted: '#f1f5f9',
    mutedForeground: 'oklch(0.55 0.01 270)',
    accent: '#f1f5f9',
    accentForeground: 'oklch(0.35 0.01 270)',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: 'oklch(0.90 0.005 270)',
    input: '#f1f5f9',
    ring: '#7c3aed',
  },
} as const;

// ═══════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════

export const typography = {
  fontFamily: {
    sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
    display: '"Plus Jakarta Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"Fira Code", ui-monospace, monospace',
  },
  fontSize: {
    'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
    'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
    'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
    'h1': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
    'h2': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
    'h3': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
    'h4': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
    'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
    'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
    'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
    'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
    'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '600' }],
  },
} as const;

// ═══════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════

export const spacing = {
  '0': '0px',
  'px': '1px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '3.5': '14px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '7': '28px',
  '8': '32px',
  '9': '36px',
  '10': '40px',
  '11': '44px',
  '12': '48px',
  '14': '56px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  '28': '112px',
  '32': '128px',
} as const;

// Layout spacing presets
export const layoutSpacing = {
  section: { mobile: '4rem', tablet: '5rem', desktop: '6rem' },
  card: { sm: '1rem', md: '1.5rem', lg: '2rem' },
  container: { px: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' } },
  grid: { gap: { sm: '0.75rem', md: '1rem', lg: '1.5rem' } },
} as const;

// ═══════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════

export const borderRadius = {
  none: '0px',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  card: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 40px rgba(124, 58, 237, 0.03)',
  floating: '0 12px 40px rgba(0, 0, 0, 0.2), 0 0 60px rgba(124, 58, 237, 0.05)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
  glow: {
    brand: '0 0 20px rgba(124, 58, 237, 0.15), 0 0 60px rgba(124, 58, 237, 0.08)',
    purple: '0 0 20px rgba(139, 92, 246, 0.15), 0 0 60px rgba(139, 92, 246, 0.08)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.15), 0 0 60px rgba(6, 182, 212, 0.08)',
    green: '0 0 20px rgba(34, 197, 94, 0.15), 0 0 60px rgba(34, 197, 94, 0.08)',
    amber: '0 0 20px rgba(245, 158, 11, 0.15), 0 0 60px rgba(245, 158, 11, 0.08)',
    intense: '0 0 30px rgba(124, 58, 237, 0.25), 0 0 80px rgba(124, 58, 237, 0.12), 0 0 160px rgba(124, 58, 237, 0.06)',
  },
} as const;

// ═══════════════════════════════════════════════════
// GLASSMORPHISM
// ═══════════════════════════════════════════════════

export const glass = {
  card: {
    background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)',
    backdropFilter: 'blur(24px) saturate(1.6)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  navbar: {
    background: 'rgba(11, 17, 32, 0.85)',
    backdropFilter: 'blur(40px) saturate(1.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  modal: {
    background: 'rgba(11, 17, 32, 0.9)',
    backdropFilter: 'blur(40px) saturate(1.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  panel: {
    background: 'rgba(11, 17, 32, 0.6)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  subtle: {
    background: 'rgba(11, 17, 32, 0.3)',
    backdropFilter: 'blur(12px) saturate(1.5)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
} as const;

// ═══════════════════════════════════════════════════
// GRADIENTS
// ═══════════════════════════════════════════════════

export const gradients = {
  aurora: `
    radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
  `,
  hero: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(139, 92, 246, 0.15) 100%)',
  cta: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.15) 100%)',
  card: 'linear-gradient(135deg, rgba(11, 17, 32, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)',
  hover: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
  glow: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
  mesh: `
    radial-gradient(at 40% 20%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
    radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
    radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
    radial-gradient(at 80% 50%, rgba(34, 197, 94, 0.04) 0%, transparent 50%),
    radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.04) 0%, transparent 50%)
  `,
  text: {
    brand: 'linear-gradient(135deg, #a78bfa, #8b5cf6, #06b6d4)',
    warm: 'linear-gradient(135deg, #f59e0b, #fbbf24, #fcd34d)',
    hero: 'linear-gradient(180deg, #ffffff 0%, #a78bfa 50%, #8b5cf6 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4, #22d3ee, #67e8f9)',
  },
  border: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.1), rgba(124, 58, 237, 0.05))',
  borderHover: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.1))',
} as const;

// ═══════════════════════════════════════════════════
// ANIMATION
// ═══════════════════════════════════════════════════

export const animation = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    moderate: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeIn: [0.55, 0.055, 0.675, 0.19],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: 'spring', stiffness: 300, damping: 24 },
    springBouncy: { type: 'spring', stiffness: 400, damping: 17 },
  },
} as const;

// ═══════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════

export const breakpoints = {
  mobile: '0px',
  tablet: '640px',
  laptop: '1024px',
  desktop: '1280px',
  ultrawide: '1536px',
} as const;

// ═══════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════

export const layout = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
  sidebar: {
    width: '256px',
    collapsedWidth: '64px',
  },
  navbar: {
    height: '64px',
    heightLg: '72px',
  },
} as const;

// ═══════════════════════════════════════════════════
// ICON SIZES
// ═══════════════════════════════════════════════════

export const iconSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
} as const;

// ═══════════════════════════════════════════════════
// Z-INDEX
// ═══════════════════════════════════════════════════

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  sidebar: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
} as const;
