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
    logoSlideIn: 0.5,        // Logo slide in duration
    logoHold: 0.3,           // Logo hold duration
    logoSlideOut: 0.5,       // Logo slide out duration
    logoNavigationDelay: 1.4, // Total delay before navigation (slideIn + hold + slideOut + buffer)
  },

  /**
   * Easing curves for smooth motion
   */
  easing: {
    smooth: 'easeInOut' as const,
    slideEase: [0.22, 1, 0.36, 1] as [number, number, number, number], // Custom cubic bezier for slides
    logoEase: [0.16, 1, 0.3, 1] as [number, number, number, number], // Smooth ease-out for logo
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
    visible: 1,
    hidden: 0,
  },
} as const;

