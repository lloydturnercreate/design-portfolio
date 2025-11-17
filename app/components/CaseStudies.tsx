'use client';

import { useRef } from 'react';
import { allProjects } from '@/lib/projects';
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll';
import CaseStudyCard from './CaseStudyCard';

// Transform projects into case study card format
const caseStudies = allProjects
  .filter((project) => project.metadata.slug !== 'spacemoney') // Hide MoonPay for now
  .map((project) => ({
    company: project.hero.company,
    title: project.card.title,
    description: project.card.description,
    slug: project.metadata.slug,
    color: project.color,
    icons: project.card.icons,
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
      <div className="mb-16 md:mb-20 w-full">
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
            {/* Previous Button */}
            <button
              onClick={scrollToPrevious}
              disabled={!canScrollPrevious}
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
              onClick={scrollToNext}
              disabled={!canScrollNext}
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

