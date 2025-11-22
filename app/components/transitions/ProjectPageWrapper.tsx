'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

interface ProjectPageWrapperProps {
  children: ReactNode;
}

/**
 * ProjectPageWrapper
 * Handles entry and exit animations for project pages
 * - Entry: Slides up from bottom (forward transitions)
 * - Exit: Slides down to bottom (back transitions)
 * - Direct load: Renders normally at y: 0
 * - Disabled on mobile/touch devices for better performance
 */
export default function ProjectPageWrapper({ children }: ProjectPageWrapperProps) {
  const { direction, completeTransition, cardMetadata } = useTransition();
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

  // Determine animation state
  const isSlideUp = direction === 'forward';
  const shouldShowColorRect = isSlideUp;

  // Notify when animations complete
  useEffect(() => {
    if (isSlideUp) {
      const timer = setTimeout(() => {
        completeTransition();
      }, (TRANSITION_CONFIG.durations.slideUp + 0.15) * 1000);
      return () => clearTimeout(timer);
    }
  }, [isSlideUp, completeTransition]);

  // On mobile, skip complex animations - just render content
  if (isMobile) {
    return <div>{children}</div>;
  }

  return (
    <>
      {/* Leading colored rectangle - only during forward transitions */}
      {shouldShowColorRect && (
        <motion.div
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          transition={{
            duration: TRANSITION_CONFIG.durations.slideUp,
            ease: TRANSITION_CONFIG.easing.slideEase,
          }}
          className="fixed inset-0 w-full h-full z-40"
          style={{
            backgroundColor: cardMetadata?.color || '#60a5fa', // Use project color or fallback to blue-400
            willChange: 'transform',
          }}
        />
      )}
      
      {/* Page content */}
      <motion.div
        initial={{ y: isSlideUp ? '100vh' : 0 }}
        animate={{ y: 0 }}
        transition={{
          duration: isSlideUp ? TRANSITION_CONFIG.durations.slideUp : 0,
          ease: TRANSITION_CONFIG.easing.slideEase,
          delay: isSlideUp ? 0.15 : 0,
        }}
        className="relative z-50"
        style={{
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

