'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

/**
 * TransitionOverlay
 * Dark overlay that fades in/out during page transitions
 * Provides visual continuity and focus during navigation
 */
export default function TransitionOverlay() {
  const { isTransitioning } = useTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: TRANSITION_CONFIG.overlay.hidden }}
          animate={{ opacity: TRANSITION_CONFIG.overlay.visible }}
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

