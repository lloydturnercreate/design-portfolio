'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const caseStudies = [
  {
    company: 'Phuture',
    title: 'Launch-Ready Investment App',
    description:
      "Built Phuture's trading interface and design system, reducing onboarding friction and enabling faster product rollouts post-Series A.",
    slug: 'phuture-finance',
    color: '#3e1fff',
  },
  {
    company: 'Raptor',
    title: 'Minimalist UI for Clarity & Trust',
    description:
      'A modern crypto wallet designed for simplicity and security — personal project exploring refined UI patterns in the fintech space.',
    slug: 'raptor',
    color: '#FFD226',
  },
  {
    company: 'MoonPay',
    title: 'Scale Through Systemisation',
    description:
      "Contributed to MoonPay's product ecosystem during high-growth, helping unify design language across multiple user flows.",
    slug: 'moonpay',
    color: '#7B3FF2',
  },
  {
    company: 'Sukiyaki',
    title: 'Cultural Authenticity Meets Modern Design',
    description:
      'A refined digital experience for a Japanese fine-dining restaurant, blending traditional aesthetics with modern design.',
    slug: 'sukiyaki',
    color: '#626f70',
  },
  {
    company: 'TBC',
    title: 'TBC',
    description:
      'Details coming soon.',
    slug: null,
    color: '#4ECDC4',
  },
  {
    company: 'TBC',
    title: 'TBC',
    description:
      'Details coming soon.',
    slug: null,
    color: '#95E1D3',
  },
];

/**
 * CaseStudies
 * Six case study cards (Phuture, Raptor, MoonPay, Sukiyaki, TBC, TBC)
 * Horizontal scroll layout with navigation controls
 */
export default function CaseStudies() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInnerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    const inner = scrollInnerRef.current;
    if (!container || !inner) return;

    const updateCurrentIndex = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      
      // Get all card elements
      const cards = inner.children;
      if (cards.length === 0) return;

      // Calculate which card is most visible
      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const cardLeft = card.offsetLeft - container.scrollLeft;
        const cardCenter = cardLeft + card.offsetWidth / 2;
        const containerCenter = containerWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      setCurrentIndex(closestIndex);
    };

    container.addEventListener('scroll', updateCurrentIndex);
    updateCurrentIndex(); // Initial call

    // Also update on resize
    window.addEventListener('resize', updateCurrentIndex);

    return () => {
      container.removeEventListener('scroll', updateCurrentIndex);
      window.removeEventListener('resize', updateCurrentIndex);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    const inner = scrollInnerRef.current;
    if (!container || !inner) return;

    const cards = inner.children;
    if (index < 0 || index >= cards.length) return;

    const targetCard = cards[index] as HTMLElement;
    const containerWidth = container.clientWidth;
    const cardWidth = targetCard.offsetWidth;
    const cardLeft = targetCard.offsetLeft;
    const scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth',
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < caseStudies.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <section id="work" className="py-20 md:py-32 lg:py-40 bg-secondary border-y border-border w-full">
      {/* Header container - centered with padding */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Work</span>
          </div>

          {/* Section header */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-4 md:mb-5 text-balance">
              Selected Work
            </h2>
          </div>
        </div>
      </div>

      {/* Case study cards horizontal scroll - Full viewport width, edge to edge */}
      <div className="mb-16 md:mb-20 w-full">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div 
            ref={scrollInnerRef}
            className="flex gap-6 md:gap-8 pl-6 sm:pl-8 lg:pl-12 pr-6 sm:pr-8 lg:pr-12 py-8"
          >
            {caseStudies.map((study, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[92vw] md:w-[85vw] lg:w-[80vw] first:pl-0 px-4"
              >
                <CaseStudyCard study={study} />
              </div>
            ))}
            {/* Spacer after last card to allow centering */}
            <div className="flex-shrink-0 w-[4vw]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8 md:gap-12">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 hover:opacity-60 transition-opacity duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Previous project"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Navigation Dots */}
            <div className="flex items-center gap-4 md:gap-5">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-2.5 h-2.5 md:w-3 md:h-3 bg-foreground'
                      : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-muted-dark hover:bg-muted'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === caseStudies.length - 1}
              className="p-2 hover:opacity-60 transition-opacity duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Next project"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CaseStudyCardProps {
  study: {
    company: string;
    title: string;
    description: string;
    slug: string | null;
    color: string;
  };
}

function CaseStudyCard({ study }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse tracking for 3D tilt
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;

      // Get card bounds
      const rect = card.getBoundingClientRect();
      
      // Calculate mouse position relative to card center (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Apply subtle 3D tilt - more gentle than hero section
      const tiltX = y * 2; // Very subtle tilt for cards
      const tiltY = x * -2;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (card && !reducedMotion) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  const cardContent = (
    <div 
      className={`relative w-full h-full bg-card border rounded-3xl overflow-hidden shadow-premium transition-all duration-300 cursor-pointer group ${
        isHovered ? 'border-muted-dark' : 'border-border'
      }`}
    >
      {/* Image placeholder - full card background */}
      <div className="absolute inset-0 bg-background group-hover:bg-secondary transition-colors flex items-center justify-center">
        <span className="text-sm md:text-base text-muted-dark font-medium uppercase tracking-[0.12em]">
          {study.company}
        </span>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content overlaid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 xl:p-14 pointer-events-none">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight-1">
          {study.company}
        </h3>
        <p 
          className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-[0.08em] mb-4 md:mb-5"
          style={{ color: study.color }}
        >
          {study.title}
        </p>
        <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-[1.6] font-light max-w-3xl">
          {study.description}
        </p>
      </div>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className="relative h-[60vh] md:h-[65vh] lg:h-[70vh] transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {study.slug ? (
        <Link href={`/${study.slug}`} aria-label={`View ${study.company} case study`} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
}


