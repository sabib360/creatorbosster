/**
 * CreatorBoost AI — Design System Documentation
 * Enterprise-grade design system for premium SaaS
 * 
 * This file serves as the single source of truth for all design tokens,
 * component APIs, and usage guidelines.
 */

// ═══════════════════════════════════════════════════
// DESIGN SYSTEM INDEX
// ═══════════════════════════════════════════════════

export * from './tokens';
export { cn } from './utils';

// ═══════════════════════════════════════════════════
// DESIGN PRINCIPLES
// ═══════════════════════════════════════════════════

/**
 * 1. MINIMALISM
 *    - Less is more. Every element must earn its place.
 *    - Use whitespace as a design element.
 *    - Remove anything that doesn't serve the user.
 * 
 * 2. PREMIUM QUALITY
 *    - Every pixel matters. No compromises on visual quality.
 *    - Use subtle gradients, not cheap neon effects.
 *    - Glass effects should feel like frosted glass, not透明塑料.
 * 
 * 3. HIGH CONVERSION
 *    - CTAs must be impossible to miss.
 *    - Trust signals must be visible but not intrusive.
 *    - Reduce friction at every step.
 * 
 * 4. SPEED PERCEPTION
 *    - Animations should feel instant (< 200ms).
 *    - Use skeleton loaders for perceived performance.
 *    - Optimize for 60fps animations.
 * 
 * 5. ACCESSIBILITY
 *    - WCAG AA+ compliance is mandatory.
 *    - All interactive elements must have focus states.
 *    - Color contrast ratios must meet standards.
 */

// ═══════════════════════════════════════════════════
// COLOR USAGE GUIDELINES
// ═══════════════════════════════════════════════════

/**
 * BRAND COLORS
 * - Primary (brand-600): CTAs, links, active states
 * - Secondary (brand-400): Accents, highlights, badges
 * - Brand-50/100/200: Backgrounds, subtle tints
 * - Brand-700/800/900: Dark accents, text on light backgrounds
 * 
 * SEMANTIC COLORS
 * - Success (emerald-500): Confirmations, positive actions
 * - Warning (amber-500): Cautions, pending states
 * - Error/Danger (red-500): Errors, destructive actions
 * - Info (cyan-500): Informational, neutral highlights
 * 
 * NEUTRAL COLORS
 * - Background: #050816 (dark mode), #ffffff (light mode)
 * - Surface: #0B1120 (cards, panels)
 * - Border: rgba(255, 255, 255, 0.06) (subtle separation)
 * - Text: White with opacity variants (100%, 70%, 50%, 30%)
 */

// ═══════════════════════════════════════════════════
// COMPONENT API REFERENCE
// ═══════════════════════════════════════════════════

/**
 * BUTTON
 * 
 * Props:
 * - variant: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'gradient'
 * - size: 'sm' | 'md' | 'lg' | 'icon'
 * - disabled: boolean
 * - loading: boolean
 * 
 * Usage:
 * <Button variant="default" size="md">Get Started</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button variant="gradient" size="lg" loading={isLoading}>Generate</Button>
 * 
 * States:
 * - Default: Base styles
 * - Hover: Slight scale + shadow increase
 * - Focus: Ring with brand color
 * - Active: Scale down slightly
 * - Disabled: 50% opacity, no pointer events
 * - Loading: Spinner icon, disabled interaction
 */

/**
 * INPUT
 * 
 * Props:
 * - icon: ReactNode (optional left icon)
 * - error: string (error message)
 * - type: string (input type)
 * 
 * Usage:
 * <Input placeholder="Search tools..." icon={<Search />} />
 * <Input error="This field is required" />
 * 
 * States:
 * - Default: Border with subtle background
 * - Focus: Brand ring, border color change
 * - Error: Red border, error message below
 * - Disabled: Reduced opacity
 */

/**
 * CARD
 * 
 * Variants:
 * - Default: Standard card with border
 * - Glass: Frosted glass effect
 * - Gradient: Animated gradient border
 * - Hover: Lift + glow on hover
 * 
 * Usage:
 * <Card className="p-6">Content</Card>
 * <Card variant="glass" className="p-6">Glass Content</Card>
 * 
 * Anatomy:
 * - CardHeader: Title + description area
 * - CardContent: Main content area
 * - CardFooter: Actions area
 */

/**
 * BADGE
 * 
 * Props:
 * - variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
 * 
 * Usage:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="destructive">Error</Badge>
 */

/**
 * MODAL
 * 
 * Props:
 * - defaultOpen: boolean
 * 
 * Usage:
 * <Modal>
 *   <ModalTrigger>Open Modal</ModalTrigger>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Title</ModalTitle>
 *       <ModalDescription>Description</ModalDescription>
 *     </ModalHeader>
 *     <ModalFooter>
 *       <Button>Confirm</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 */

/**
 * TABS
 * 
 * Props:
 * - defaultValue: string (initial active tab)
 * 
 * Usage:
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */

/**
 * TOAST
 * 
 * Props:
 * - message: string
 * - type: 'success' | 'error' | 'info'
 * 
 * Usage:
 * const { addToast } = useToast();
 * addToast('Operation successful', 'success');
 * addToast('Something went wrong', 'error');
 */

/**
 * SKELETON
 * 
 * Props:
 * - variant: 'text' | 'circular' | 'rectangular'
 * 
 * Usage:
 * <Skeleton variant="text" className="w-48 h-4" />
 * <Skeleton variant="circular" className="w-12 h-12" />
 * <Skeleton variant="rectangular" className="w-full h-32" />
 */

// ═══════════════════════════════════════════════════
// ANIMATION GUIDELINES
// ═══════════════════════════════════════════════════

/**
 * DURATION RULES
 * - Micro-interactions (hover, focus): 100-150ms
 * - State changes (toggle, expand): 200-300ms
 * - Page transitions: 300-500ms
 * - Complex animations: 500-700ms
 * 
 * EASING RULES
 * - Ease out for entering elements
 * - Ease in for exiting elements
 * - Ease in-out for moving elements
 * - Spring for bouncy/physical feel
 * 
 * SCROLL ANIMATIONS
 * - Use whileInView with viewport={{ once: true }}
 * - Stagger children with 50-80ms delay
 * - Fade in from 20-40px below
 */

// ═══════════════════════════════════════════════════
// ACCESSIBILITY RULES
// ═══════════════════════════════════════════════════

/**
 * KEYBOARD NAVIGATION
 * - All interactive elements must be focusable
 * - Tab order must be logical
 * - Focus states must be visible (ring-2)
 * - Escape key must close modals/dropdowns
 * 
 * SCREEN READERS
 * - Use semantic HTML (nav, main, section, article)
 * - Add aria-labels to icon buttons
 * - Use aria-expanded for expandable sections
 * - Provide alt text for images
 * 
 * COLOR CONTRAST
 * - Text on dark background: 4.5:1 minimum
 * - Large text on dark background: 3:1 minimum
 * - Interactive elements: 3:1 against adjacent colors
 */
