'use client';

import { useState, useCallback } from 'react';

/**
 * Lightbox image type
 */
export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * useLightbox
 * Custom hook for managing lightbox state
 * Use in parent components that contain multiple images
 * 
 * @param images - Array of images to navigate through
 * @returns Lightbox state and controls
 */
export function useLightbox(images: LightboxImage[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    currentIndex,
    images,
    openLightbox,
    closeLightbox,
  };
}


