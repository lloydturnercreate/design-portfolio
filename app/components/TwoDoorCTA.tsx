'use client';

import { useRef } from 'react';
import Section from './Section';
import { use3DTilt } from '@/lib/hooks/use3DTilt';

/**
 * TwoDoorCTA
 * Split layout CTA section for Founders and Agencies
 * Clear differentiation between two paths
 */
export default function TwoDoorCTA() {
  const foundersCardRef = useRef<HTMLDivElement>(null);
  const agenciesCardRef = useRef<HTMLDivElement>(null);

  // Apply 3D tilt effect to entire cards
  use3DTilt(foundersCardRef, { intensity: 3 });
  use3DTilt(agenciesCardRef, { intensity: 3 });

  return (
    <Section className="py-20 md:py-32 lg:py-40 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Get Started</span>
        </div>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-4 md:mb-5 text-balance">
            Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* For Founders */}
          <div 
            ref={foundersCardRef}
            className="bg-card border border-border p-10 md:p-12 rounded-3xl hover:border-muted-dark hover:shadow-premium transition-[border-color,box-shadow] duration-300 group flex flex-col"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex-grow mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight-1">
                For Founders
              </h3>
              <p className="text-lg md:text-xl text-muted mb-4 leading-[1.6] font-light tracking-tight-1">
                You&apos;re building fast, but design is lagging behind growth.
              </p>
              <p className="text-lg md:text-xl text-muted leading-[1.6] font-light tracking-tight-1">
                Get design clarity, speed, and investor-grade polish — without hiring a
                full-time team.
              </p>
            </div>
            <a
              href="#book-diagnostic"
              role="button"
              data-cta-type="primary"
              className="lava-gradient inline-flex items-center justify-center w-full px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-center text-base min-h-[60px] shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02] tracking-tight-1 pointer-events-auto"
              aria-label="Book a 15-minute diagnostic call for founders"
            >
              <span className="lava-layer-3" />
              <span className="lava-layer-4" />
              <span>Book a 15-min Call</span>
            </a>
          </div>

          {/* For Agencies */}
          <div 
            ref={agenciesCardRef}
            className="bg-card border border-border p-10 md:p-12 rounded-3xl hover:border-muted-dark hover:shadow-premium transition-[border-color,box-shadow] duration-300 group flex flex-col"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex-grow mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight-1">
                For Agencies
              </h3>
              <p className="text-lg md:text-xl text-muted mb-4 leading-[1.6] font-light tracking-tight-1">
                Need a senior product designer to slot seamlessly into your team?
              </p>
              <p className="text-lg md:text-xl text-muted mb-5 leading-[1.6] font-light tracking-tight-1">
                I provide high-level design systems and UX execution support for fintech,
                SaaS, and crypto projects.
              </p>
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight-1">
                Day Rate: £800–£1000 / day
              </p>
            </div>
            <a
              href="#check-availability"
              role="button"
              data-cta-type="secondary"
              className="lava-gradient-secondary inline-flex items-center justify-center w-full px-10 py-5 bg-card border border-border text-foreground font-semibold rounded-2xl hover:border-muted-dark hover:bg-secondary transition-all duration-200 text-center text-base min-h-[60px] hover:scale-[1.02] tracking-tight-1 pointer-events-auto"
              aria-label="Check availability and day rate for agencies"
            >
              <span className="lava-layer-3" />
              <span className="lava-layer-4" />
              <span>Check Availability</span>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

