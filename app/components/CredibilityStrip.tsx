'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Section from './Section';

interface CompanyLogo {
  name: string;
  logoPath: string;
  alt: string;
}

const companies: CompanyLogo[] = [
  { name: 'Google', logoPath: '/client-assets/client-logos/google-logo.png', alt: 'Google' },
  { name: 'Amazon', logoPath: '/client-assets/client-logos/amazon-logo.png', alt: 'Amazon' },
  { name: 'MoonPay', logoPath: '/client-assets/client-logos/moonpay-logo.png', alt: 'MoonPay' },
  { name: 'Phuture', logoPath: '/client-assets/client-logos/phuture-logo.png', alt: 'Phuture' },
  { name: 'City Index', logoPath: '/client-assets/client-logos/cityindex-logo.png', alt: 'City Index' },
  { name: 'Android', logoPath: '/client-assets/client-logos/android-logo.png', alt: 'Android' },
];

/**
 * CredibilityStrip
 * Horizontal scrolling logo strip with company logos
 * Features auto-scroll on desktop, swipe on mobile
 * Uses Next.js Image optimization for performance
 */
export default function CredibilityStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || typeof window === 'undefined') return;

    // Auto-scroll on desktop only
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (!mediaQuery.matches) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    let animationFrameId: number;
    let isPaused = false;

    const autoScroll = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(autoScroll);
        return;
      }

      scrollPosition += scrollSpeed;
      const scrollWidth = container.scrollWidth;
      const maxScroll = scrollWidth / 2;
      
      // Reset when scrolled past first set of companies
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Start auto-scroll after a brief delay to ensure layout is complete
    const startTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(autoScroll);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Section className="bg-secondary py-12 md:py-16 border-y border-border">
      <div className="w-full">
        <p className="text-xs md:text-sm text-muted text-center mb-10 md:mb-12 font-medium uppercase tracking-[0.12em]">
          Trusted by teams at
        </p>

        {/* Scrolling logo strip */}
        <div className="relative overflow-hidden">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-16 md:gap-20 overflow-x-auto scrollbar-hide md:overflow-x-hidden"
          >
            {/* Duplicate set for seamless loop */}
            {[...companies, ...companies].map((company, index) => {
              const isSmaller = company.name === 'Amazon' || company.name === 'Google';
              const isLarger = company.name === 'MoonPay' || company.name === 'Phuture';
              
              let logoSize = 'w-24 h-12 md:w-32 md:h-16'; // Default size
              if (isSmaller) {
                logoSize = 'w-20 h-10 md:w-28 md:h-14';
              } else if (isLarger) {
                logoSize = 'w-28 h-14 md:w-40 md:h-20'; // Bigger for MoonPay and Phuture
              }
              
              return (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  {/* Logo image */}
                  <div className={`${logoSize} relative flex items-center justify-center hover:opacity-70 transition-all duration-300`}>
                    <Image
                      src={company.logoPath}
                      alt={company.alt}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 128px, 160px"
                      priority={index < companies.length}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

