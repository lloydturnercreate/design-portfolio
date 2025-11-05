import { Variants } from 'framer-motion';

/**
 * Looping bounce animation for cards
 * Disney-inspired whimsy with continuous life
 */

/**
 * Calculate total animation cycle time
 * - Each card bounces (0.6s)
 * - Cards are staggered (0.2s between each)
 * - Pause between cycles (2s)
 */
const BOUNCE_DURATION = 0.6;
const STAGGER_DELAY = 0.2;
const REPEAT_DELAY = 2;

/**
 * Looping card bounce variants
 * Cards bounce up one by one: Card 1 → Card 2 → Card 3
 * Each card jumps progressively higher
 * All cards have same 2s repeat delay
 */
export const cardLoopBounceVariants: Variants = {
  animate: (index: number) => {
    const cardDelay = index * STAGGER_DELAY; // Card 1: 0s, Card 2: 0.2s, Card 3: 0.4s
    // Each card jumps higher: Card 1: -40px, Card 2: -50px, Card 3: -60px
    const jumpHeight = -60;
    
    return {
      y: [0, jumpHeight, 0],
      rotate: [0, -6, 0],
      transition: {
        y: {
          duration: BOUNCE_DURATION,
          delay: cardDelay,
          repeat: Infinity,
          repeatDelay: REPEAT_DELAY, // Same 2s delay for all cards
          ease: [0.25, 0.46, 0.45, 0.94], // Softer, smoother curve
          times: [0, 0.4, 1],
        },
        rotate: {
          duration: BOUNCE_DURATION,
          delay: cardDelay,
          repeat: Infinity,
          repeatDelay: REPEAT_DELAY, // Same 2s delay for all cards
          ease: [0.25, 0.46, 0.45, 0.94], // Softer, smoother curve
          times: [0, 0.4, 1],
        },
      },
    };
  },
};

/**
 * Reduced motion fallback - no animation
 */
export const cardReducedMotionVariants: Variants = {
  animate: {
    y: 0,
    rotate: 0,
  },
};

