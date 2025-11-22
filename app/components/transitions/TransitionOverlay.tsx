'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

/**
 * TransitionOverlay
 * Dark overlay that fades in/out during page transitions
 * Provides visual continuity and focus during navigation
 * Disabled on mobile/touch devices for better performance
 */
export default function TransitionOverlay() {
  const { isTransitioning, direction } = useTransition();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      const isTouchDevice = window.matchMedia('(hover: none)').matches;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Skip overlay on mobile
  if (isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: direction === 'back' ? TRANSITION_CONFIG.overlay.visible : TRANSITION_CONFIG.overlay.hidden }}
          animate={{ opacity: direction === 'back' ? TRANSITION_CONFIG.overlay.hidden : TRANSITION_CONFIG.overlay.visible }}
          exit={{ opacity: TRANSITION_CONFIG.overlay.hidden }}
          transition={{
            duration: TRANSITION_CONFIG.durations.overlay,
            ease: TRANSITION_CONFIG.easing.smooth,
          }}
          className="fixed inset-0 bg-black pointer-events-none z-40"
          style={{ willChange: 'opacity' }}
        />
      )}
    </AnimatePresence>
  );
}

