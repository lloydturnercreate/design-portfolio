'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '@/lib/context/TransitionContext';

/**
 * LogoTransitionOverlay
 * Plays a video animation before AI project loads
 */
export default function LogoTransitionOverlay() {
  const { logoMetadata, isTransitioning, completeTransition } = useTransition();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Only show animation for projects that have webm files
  const hasAnimation = logoMetadata?.slug === 'typerunner';

  useEffect(() => {
    if (!isTransitioning || !logoMetadata) {
      setAnimationComplete(false);
      return;
    }

    // If no animation, complete immediately
    if (!hasAnimation) {
      completeTransition();
      setAnimationComplete(true);
    }
  }, [isTransitioning, logoMetadata, hasAnimation, completeTransition]);

  if (!logoMetadata || animationComplete || !hasAnimation) return null;

  const handleVideoEnd = () => {
    setAnimationComplete(true);
    completeTransition(); // Reset transition state
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Trigger fade 0.3s before video ends
    if (video.duration - video.currentTime <= 0.3 && !animationComplete) {
      handleVideoEnd();
    }
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }} // Instant removal when video ends
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <video
            autoPlay
            muted
            playsInline
            className="w-64 h-64 md:w-96 md:h-96 object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          >
            <source src={`/project-covers/${logoMetadata.slug}.webm`} type="video/webm" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

