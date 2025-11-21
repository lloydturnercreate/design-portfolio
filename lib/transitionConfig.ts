/**
 * Transition Configuration
 * Centralized animation timing, easing, and values for page transitions
 */

export const TRANSITION_CONFIG = {
  /**
   * Animation durations (in seconds)
   */
  durations: {
    scale: 0.4,              // Home page scale animation duration
    slideUp: 0.6,            // Project entry slide-up duration
    overlay: 0.4,            // Overlay fade duration
    navigationDelay: 0.5,    // Delay before page navigation (forward)
  },

  /**
   * Easing curves for smooth motion
   */
  easing: {
    smooth: 'easeInOut' as const,
    slideEase: [0.22, 1, 0.36, 1] as [number, number, number, number], // Custom cubic bezier for slides
  },

  /**
   * Scale values for home page animation
   */
  scale: {
    normal: 1,
    reduced: 0.85,
  },

  /**
   * Overlay opacity values
   */
  overlay: {
    visible: 0.4,
    hidden: 0,
  },
} as const;

