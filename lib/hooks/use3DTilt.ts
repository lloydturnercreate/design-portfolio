import { RefObject, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface TiltOptions {
  intensity?: number; // Multiplier for tilt effect (default: 2)
  perspective?: number; // Perspective value in pixels (default: 1000)
  scale?: number; // Scale on hover (default: 1)
  global?: boolean; // If true, tracks global mouse position; if false, tracks relative to element (default: false)
}

/**
 * use3DTilt Hook
 * Applies 3D tilt effect to an element based on mouse position
 * Disabled on mobile/touch devices
 * 
 * @param ref - React ref to the element to apply tilt to
 * @param options - Customization options for the tilt effect
 */
export function use3DTilt<T extends HTMLElement>(
  ref: RefObject<T>,
  options: TiltOptions = {}
): void {
  const {
    intensity = 2,
    perspective = 1000,
    scale = 1,
    global = false,
  } = options;

  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      // Check for touch support and small screens
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

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || isMobile) return;

    if (global) {
      // Global mouse tracking (entire viewport)
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1

        const tiltX = y * intensity;
        const tiltY = x * -intensity;
        element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };

      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    } else {
      // Element-relative mouse tracking
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        
        // Calculate mouse position relative to element center (-1 to 1)
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        const tiltX = y * intensity;
        const tiltY = x * -intensity;
        
        const scaleTransform = scale !== 1 ? ` scale3d(${scale}, ${scale}, ${scale})` : '';
        element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)${scaleTransform}`;
      };

      const handleMouseLeave = () => {
        element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [ref, intensity, perspective, scale, global, reducedMotion, isMobile]);
}

