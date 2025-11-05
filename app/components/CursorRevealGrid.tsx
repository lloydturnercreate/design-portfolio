'use client';

import { useRef, useEffect, useState } from 'react';

/**
 * CursorRevealGrid
 * Lightweight grid background revealed by cursor proximity
 * Uses CSS mask for GPU-accelerated performance
 * No animation loops, pulses, or 3D transforms
 */
export default function CursorRevealGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // percentage

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return;

    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      
      lastUpdate = now;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        if (!gridRef.current) return;
        
        const rect = gridRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Static grid for reduced motion (no cursor reveal)
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="static-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="static-major-grid" width="180" height="180" patternUnits="userSpaceOnUse">
              <path d="M 180 0 L 0 0 0 180" fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#static-grid)" />
          <rect width="100%" height="100%" fill="url(#static-major-grid)" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
    >
      {/* Grid SVG with cursor reveal mask */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`,
        }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="reveal-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="reveal-major-grid" width="180" height="180" patternUnits="userSpaceOnUse">
              <path d="M 180 0 L 0 0 0 180" fill="none" stroke="rgba(59, 130, 246, 0.35)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reveal-grid)" />
          <rect width="100%" height="100%" fill="url(#reveal-major-grid)" />
        </svg>
      </div>
    </div>
  );
}

