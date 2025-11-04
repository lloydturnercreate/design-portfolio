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
  { name: 'Google', logoPath: '/client-assets/client-logos/google.png', alt: 'Google' },
  { name: 'Amazon', logoPath: '/client-assets/client-logos/amazon.png', alt: 'Amazon' },
  { name: 'MoonPay', logoPath: '/client-assets/client-logos/Moonpay.png', alt: 'MoonPay' },
  { name: 'Phuture', logoPath: '/client-assets/client-logos/phuture.png', alt: 'Phuture' },
  { name: 'City Index', logoPath: '/client-assets/client-logos/city index.png', alt: 'City Index' },
  { name: 'Helio', logoPath: '/client-assets/client-logos/helio.png', alt: 'Helio' },
  { name: 'Android', logoPath: '/client-assets/client-logos/android.png', alt: 'Android' },
];

/**
 * CredibilityStrip
 * Horizontal scrolling logo strip with company logos
 * Features auto-scroll on desktop, swipe on mobile
 * Uses Next.js Image optimization for performance
 */
export default function CredibilityStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

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
      if (isPaused || isScrollingRef.current) {
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

    // Pause when the page is scrolling to reduce jank
    let scrollTimeout: NodeJS.Timeout;
    const onWindowScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 180);
    };
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    
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
      window.removeEventListener('scroll', onWindowScroll);
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
          {/* Scrolling container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-12 md:gap-16 overflow-x-auto scrollbar-hide md:overflow-x-hidden"
          >
            {/* Duplicate set for seamless loop */}
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                {/* Logo image */}
                <div className="w-32 h-16 md:w-40 md:h-20 relative flex items-center justify-center hover:opacity-70 transition-all duration-300 grayscale hover:grayscale-0">
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
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

