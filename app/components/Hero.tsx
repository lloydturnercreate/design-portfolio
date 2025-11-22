'use client';

import { useRef, useState } from 'react';
import FuturisticGrid from './FuturisticGrid';
import { use3DTilt } from '@/lib/hooks/use3DTilt';

/**
 * Hero
 * Main hero section with headline, credential bar, and CTAs
 * Centered, outcome-focused design that fits all screen sizes
 * Content moves in 3D space with cursor, aligned with grid
 */
export default function Hero() {
  const tiltContentRef = useRef<HTMLDivElement>(null);
  const [pulseCount, setPulseCount] = useState(0);

  // Apply 3D tilt effect to content (global mouse tracking)
  use3DTilt(tiltContentRef, { global: true, intensity: 2 });

  // Increment counter when pulse is caught
  const handlePulseIntercepted = () => {
    setPulseCount(prev => prev + 1);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-background overflow-hidden cursor-crosshair">
      {/* Futuristic grid background */}
      <FuturisticGrid onPulseIntercepted={handlePulseIntercepted} />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-40">
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
        
        {/* Content with 3D tilt - includes text and buttons */}
        <div 
          ref={tiltContentRef}
          className="max-w-6xl mx-auto text-center transition-transform duration-200 ease-out"
        >
          {/* Credential Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-12 pointer-events-none">
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Ex-Google</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">MoonPay</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Senior Product Designer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter-2 text-foreground mb-5 sm:mb-6 md:mb-10 leading-[0.95] text-balance pointer-events-none">
            Investor-grade products for fintech & Web3
          </h1>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted mb-8 sm:mb-10 md:mb-16 max-w-4xl mx-auto leading-[1.5] font-light tracking-tight-1 pointer-events-none">
            I help founders and product teams turn complex ideas into clear,
            scalable interfaces — design systems, launch-ready UX, and
            hands-on strategy for growth-stage startups.
          </p>

          {/* CTA Buttons - Now included in 3D tilt effect, fully interactive */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-2xl mx-auto relative z-50 pointer-events-auto">
            {/* For Founders CTA - Primary */}
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <a
                href="https://calendly.com/lloyd-turner/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                data-cta-type="primary"
                className="lava-gradient group w-full sm:w-auto px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02] cursor-pointer"
                aria-label="Contact for a discovery call - Founders"
              >
                <span className="lava-layer-3" />
                <span className="lava-layer-4" />
                <span className="tracking-tight-1 whitespace-nowrap">Book a 15-min Call</span>
              </a>
              <span className="hidden sm:block text-xs font-medium text-muted uppercase tracking-[0.08em] pointer-events-none">For Founders</span>
            </div>

            {/* For Agencies CTA - Secondary */}
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <a
                href="https://form.typeform.com/to/Rwp3bZGg"
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                data-cta-type="secondary"
                className="lava-gradient-secondary group w-full sm:w-auto px-10 py-5 bg-blue-950 text-white font-semibold rounded-2xl hover:bg-slate-950 transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center hover:scale-[1.02] cursor-pointer"
                aria-label="Check availability for agencies"
              >
                <span className="lava-layer-3" />
                <span className="lava-layer-4" />
                <span className="tracking-tight-1 whitespace-nowrap">Check Availability</span>
              </a>
              <span className="hidden sm:block text-xs font-medium text-muted uppercase tracking-[0.08em] pointer-events-none">For Agencies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

