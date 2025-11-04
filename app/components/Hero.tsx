'use client';

import { useEffect, useRef, useState } from 'react';
import FuturisticGrid from './FuturisticGrid';

/**
 * Hero
 * Main hero section with headline, credential bar, and CTAs
 * Centered, outcome-focused design that fits all screen sizes
 * Content moves in 3D space with cursor, aligned with grid
 */
export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Increment counter when pulse is caught
  const handlePulseIntercepted = () => {
    setPulseCount(prev => prev + 1);
  };

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse tracking for 3D tilt - same as grid
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1

      if (contentRef.current && !reducedMotion) {
        // Apply same 3D tilt as grid for aligned movement
        const tiltX = y * 2; // Tilt up/down
        const tiltY = x * -2; // Tilt left/right
        contentRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Futuristic grid background */}
      <FuturisticGrid onPulseIntercepted={handlePulseIntercepted} />
      
      <div 
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Pulse counter - hidden until first intercept */}
        {pulseCount > 0 && (
          <div className="absolute bottom-0 right-0 font-mono animate-fade-in">
            <div className="flex flex-col items-end gap-1">
              <span className="text-green-500/60 text-xs uppercase tracking-widest">Intercepted</span>
              <span className="text-green-400 text-3xl md:text-4xl font-bold tracking-wider tabular-nums">
                {pulseCount.toString().padStart(3, '0')}
              </span>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto text-center">
          {/* Credential Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-10 md:mb-12">
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Ex-Google</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Ex-MoonPay</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Senior Product Designer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter-2 text-foreground mb-8 md:mb-10 leading-[0.95] text-balance">
            Investor-grade products for fintech & Web3
          </h1>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted mb-14 md:mb-16 max-w-4xl mx-auto leading-[1.5] font-light tracking-tight-1">
            I help founders and product teams turn complex ideas into clear,
            scalable interfaces — design systems, launch-ready UX, and
            hands-on strategy for growth-stage startups.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-2xl mx-auto">
            {/* For Founders CTA - Primary */}
            <a
              href="#book-diagnostic"
              className="group w-full sm:w-auto px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02]"
              aria-label="Book a 15-minute diagnostic call for founders"
            >
              <span className="tracking-tight-1">For Founders – Book 15-min Call</span>
            </a>

            {/* For Agencies CTA - Secondary */}
            <a
              href="#check-availability"
              className="group w-full sm:w-auto px-10 py-5 bg-card border border-border text-foreground font-semibold rounded-2xl hover:border-muted-dark hover:bg-secondary transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center hover:scale-[1.02]"
              aria-label="Check availability for agencies"
            >
              <span className="tracking-tight-1">For Agencies – Check Availability</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

