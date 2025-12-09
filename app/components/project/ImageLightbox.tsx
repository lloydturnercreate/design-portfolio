'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Lightbox image interface
 * Supports both images and videos with optional captions
 */
export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ImageLightbox
 * Full-screen image viewer with keyboard navigation and thumbnail strip
 * Premium dark theme with smooth animations
 * 
 * Features:
 * - Arrow key / click navigation
 * - Escape to close
 * - Click outside to close
 * - Thumbnail strip for quick navigation
 * - Video support
 * - Reduced motion support
 * - Focus trap for accessibility
 */
export default function ImageLightbox({ 
  images, 
  initialIndex, 
  isOpen, 
  onClose 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const prefersReducedMotion = useReducedMotion();
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset to initial index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Focus the close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen, initialIndex]);

  // Scroll thumbnail into view when currentIndex changes
  useEffect(() => {
    if (isOpen && thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.children;
      const activeThumbnail = thumbnails[currentIndex] as HTMLElement;
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        });
      }
    }
  }, [currentIndex, isOpen, prefersReducedMotion]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  const currentImage = images[currentIndex];
  const isVideo = currentImage?.src.match(/\.(mp4|webm|mov|avi)$/i);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: { duration: prefersReducedMotion ? 0 : 0.15 }
    }
  };

  const imageVariants = {
    enter: { opacity: 0, x: prefersReducedMotion ? 0 : 20 },
    center: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : -20,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-50 flex flex-col"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          {/* Content wrapper */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex flex-col h-full z-10"
          >
            {/* Header with close button and counter */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
              <div className="text-sm text-muted-dark font-medium">
                <span className="text-foreground">{currentIndex + 1}</span>
                <span className="mx-2">/</span>
                <span>{images.length}</span>
              </div>
              
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Close lightbox"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main image area */}
            <div 
              className="flex-1 flex items-center justify-center px-4 md:px-16 lg:px-24 relative min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous button */}
              {images.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 md:left-6 lg:left-10 z-20 p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 group"
                  aria-label="Previous image"
                >
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 text-foreground transition-transform duration-200 group-hover:-translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Image/Video with AnimatePresence for smooth transitions */}
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative max-w-full max-h-full flex items-center justify-center"
                  >
                    {isVideo ? (
                      <video
                        src={currentImage.src}
                        className="max-w-full max-h-[65vh] md:max-h-[70vh] rounded-xl border border-border shadow-premium-xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        width={1920}
                        height={1080}
                        className="max-w-full max-h-[65vh] md:max-h-[70vh] w-auto h-auto object-contain rounded-xl border border-border shadow-premium-xl"
                        quality={100}
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next button */}
              {images.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-2 md:right-6 lg:right-10 z-20 p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 group"
                  aria-label="Next image"
                >
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 text-foreground transition-transform duration-200 group-hover:translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Caption */}
            {currentImage.caption && (
              <motion.div 
                key={`caption-${currentIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, delay: 0.1 }}
                className="text-center text-muted text-sm md:text-base px-8 py-2 max-w-2xl mx-auto"
              >
                {currentImage.caption}
              </motion.div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="px-4 md:px-8 py-4 md:py-6">
                <div 
                  ref={thumbnailsRef}
                  className="flex justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide max-w-full mx-auto pb-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {images.map((img, index) => {
                    const thumbIsVideo = img.src.match(/\.(mp4|webm|mov|avi)$/i);
                    const isActive = index === currentIndex;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`
                          relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 
                          rounded-lg overflow-hidden transition-all duration-200 
                          border-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black
                          ${isActive 
                            ? 'border-foreground opacity-100 scale-105' 
                            : 'border-transparent opacity-40 hover:opacity-70 hover:border-white/20'
                          }
                        `}
                        aria-label={`View image ${index + 1}: ${img.alt}`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {thumbIsVideo ? (
                          <video 
                            src={img.src} 
                            className="w-full h-full object-cover" 
                            muted 
                            preload="metadata"
                          />
                        ) : (
                          <Image
                            src={img.src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )}
                        {/* Video indicator */}
                        {thumbIsVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Keyboard hint - desktop only */}
                <div className="hidden md:flex items-center justify-center gap-4 mt-3 text-xs text-muted-dark">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">←</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">→</kbd>
                    <span>navigate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">esc</kbd>
                    <span>close</span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


