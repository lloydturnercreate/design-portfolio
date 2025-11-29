'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

interface AIProjectPageWrapperProps {
  children: ReactNode;
}

/**
 * AIProjectPageWrapper
 * Handles fade-in animations for AI project pages after logo transition
 * - Entry: Fades in after logo transition completes (forward transitions)
 * - Direct load: Renders normally with opacity: 1
 * - Disabled on mobile/touch devices for better performance
 */
export default function AIProjectPageWrapper({ children }: AIProjectPageWrapperProps) {
  const { direction, completeTransition, logoMetadata } = useTransition();
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
  const isLogoTransition = direction === 'forward' && logoMetadata;

  // The overlay will control when to complete the transition
  // No need for a timer here - the overlay fades out when video ends

  // On mobile, skip complex animations - just render content
  if (isMobile) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: isLogoTransition ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: isLogoTransition ? 0 : 0, // Content fades in immediately after logo completes
      }}
      className="relative"
      style={{
        willChange: 'opacity',
      }}
    >
      {children}
    </motion.div>
  );
}

