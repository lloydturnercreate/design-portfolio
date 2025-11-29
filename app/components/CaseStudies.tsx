'use client';

import { useRef } from 'react';
import { allProjects } from '@/lib/projects';
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll';
import CaseStudyCard from './CaseStudyCard';

// Transform projects into case study card format
// Filter to only include case study projects (exclude ai-projects and experiments)
const caseStudies = allProjects
  .filter((project) => !project.metadata.category || project.metadata.category === 'case-study')
  .map((project) => ({
    company: project.hero!.company, // Safe to use ! because case studies always have hero
    title: project.card.title,
    description: project.card.description,
    slug: project.metadata.slug,
    color: project.color,
    backgroundImage: project.card.backgroundImage,
    backgroundImages: project.card.backgroundImages,
    imageAlignment: project.card.imageAlignment,
    // Add noise overlay to all project cards
    noiseOverlay: true,
    noiseOpacity: 0.85,
  }));

/**
 * CaseStudies
 * Four case study cards (MoonPay, Phuture, Raptor, Sukiyaki)
 * Horizontal scroll layout with navigation controls
 */
export default function CaseStudies() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInnerRef = useRef<HTMLDivElement>(null);

  // Use horizontal scroll hook for navigation
  const {
    currentIndex,
    scrollToIndex,
    scrollToPrevious,
    scrollToNext,
    canScrollPrevious,
    canScrollNext,
  } = useHorizontalScroll(scrollContainerRef, scrollInnerRef, {
    itemCount: caseStudies.length,
  });

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
      <div className="mb-16 md:mb-20 w-full relative group/carousel">
        {/* Left edge navigation zone - desktop only */}
        <button
          onClick={scrollToPrevious}
          disabled={!canScrollPrevious}
          aria-label="Scroll left"
          className={`hidden lg:flex absolute left-0 top-0 bottom-0 w-32 z-20 
            items-center justify-start pl-8
            transition-all duration-500 ease-out
            opacity-0 hover:opacity-100 disabled:hidden
            focus-visible:opacity-100 focus-visible:outline-none`}
        >
          <div className="p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-110 group-hover:translate-x-2 hover:bg-black/50">
            <svg 
              className="w-6 h-6 text-white drop-shadow-md" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>

        {/* Right edge navigation zone - desktop only */}
        <button
          onClick={scrollToNext}
          disabled={!canScrollNext}
          aria-label="Scroll right"
          className={`hidden lg:flex absolute right-0 top-0 bottom-0 w-32 z-20 
            items-center justify-end pr-8
            transition-all duration-500 ease-out
            opacity-0 hover:opacity-100 disabled:hidden
            focus-visible:opacity-100 focus-visible:outline-none`}
        >
          <div className="p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-110 group-hover:-translate-x-2 hover:bg-black/50">
            <svg 
              className="w-6 h-6 text-white drop-shadow-md" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          <div 
            ref={scrollInnerRef}
            className="flex gap-6 md:gap-8 pl-6 sm:pl-8 lg:pl-12 pr-6 sm:pr-8 lg:pr-12 py-8"
          >
            {caseStudies.map((study, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[92vw] md:w-[85vw] lg:w-[80vw] first:pl-0 px-4 snap-center snap-always"
              >
                <CaseStudyCard study={study} />
              </div>
            ))}
            {/* Spacer after last card to allow centering */}
            <div className="flex-shrink-0 w-[4vw] snap-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8 md:gap-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}

