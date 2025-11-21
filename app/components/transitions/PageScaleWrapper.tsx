'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

interface PageScaleWrapperProps {
  children: ReactNode;
}

/**
 * PageScaleWrapper
 * Wraps the home page and handles scaling animation
 * - Scales down to 0.85 when navigating forward to a project
 * - Starts at 0.85 and scales up to 1.0 when returning via back button
 */
export default function PageScaleWrapper({ children }: PageScaleWrapperProps) {
  const { direction, isTransitioning, resetTransition, startBackTransition } = useTransition();
  
  // Detect if we're returning from a project by checking sessionStorage
  const [isReturning] = useState(() => {
    if (typeof window === 'undefined') return false;
    const wasOnProject = sessionStorage.getItem('wasOnProject') === 'true';
    return wasOnProject; // Just check the flag
  });

  // Clear any stale transition state on mount
  useEffect(() => {
    if (!isReturning && direction !== null) {
      resetTransition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Trigger back transition on mount if returning
  useEffect(() => {
    if (isReturning) {
      // Clear the flag
      sessionStorage.removeItem('wasOnProject');
      // Start back transition
      startBackTransition();
    }
  }, [isReturning, startBackTransition]);

  // Reset transition state after animations complete
  useEffect(() => {
    if (direction === 'back') {
      const timer = setTimeout(() => {
        resetTransition();
      }, TRANSITION_CONFIG.durations.scale * 1000);

      return () => clearTimeout(timer);
    }
  }, [direction, resetTransition]);

  // Determine scale based on state
  const getScale = () => {
    // If actively transitioning forward (leaving), scale down
    if (direction === 'forward' && isTransitioning) {
      return TRANSITION_CONFIG.scale.reduced;
    }
    // If returning (back) or normal state, scale to 1.0
    return TRANSITION_CONFIG.scale.normal;
  };

  // Determine initial scale
  const getInitialScale = () => {
    // If we're returning from a project, start at reduced scale
    if (isReturning) {
      return TRANSITION_CONFIG.scale.reduced;
    }
    // Otherwise start at current scale
    return getScale();
  };

  return (
    <motion.div
      initial={{ scale: getInitialScale() }}
      animate={{
        scale: getScale(),
      }}
      transition={{
        duration: TRANSITION_CONFIG.durations.scale,
        ease: TRANSITION_CONFIG.easing.smooth,
      }}
      style={{
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}
