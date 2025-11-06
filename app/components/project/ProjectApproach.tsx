'use client';

import { useRef, useEffect } from 'react';
import { ProjectApproach as ProjectApproachType } from '@/lib/projects';
import ImageBlock, { ImageBlockGroup } from './ImageBlock';

interface ProjectApproachProps {
  approach: ProjectApproachType;
  color: string;
}

/**
 * ProjectApproach
 * Methodology/approach section with scroll progress tracking
 * Single continuous line through all subsections with fade-in effects
 */
export default function ProjectApproach({ approach, color }: ProjectApproachProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activatedElementsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!sectionRef.current || !progressBarRef.current) return;

    const section = sectionRef.current;
    const progressBar = progressBarRef.current;
    const allElements = section.querySelectorAll('[data-scroll-element]');
    
    let rafId: number;
    let isActive = false;

    const updateProgress = () => {
      if (!isActive) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Highlight elements as they approach viewport center - once lit, stay lit
      const viewportCenter = windowHeight / 2;
      let lastActivatedElement: Element | null = null;
      let lastActivatedPosition = 0;

      allElements.forEach((el) => {
        const elementId = el.getAttribute('data-scroll-element');
        if (!elementId) return;

        const elementRect = el.getBoundingClientRect();
        const elementCenter = elementRect.top + elementRect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        const isCurrentlyActive = distance < windowHeight * 0.35;
        
        // If element is active, mark it as activated
        if (isCurrentlyActive) {
          activatedElementsRef.current.add(elementId);
        }
        
        // Track the last activated element's position
        if (activatedElementsRef.current.has(elementId)) {
          const elementBottom = el.getBoundingClientRect().bottom - sectionTop;
          if (elementBottom > lastActivatedPosition) {
            lastActivatedPosition = elementBottom;
            lastActivatedElement = el;
          }
        }
        
        // Update opacity and color - stay lit if it was ever activated
        const shouldBeLit = activatedElementsRef.current.has(elementId);
        if (shouldBeLit) {
          el.classList.remove('opacity-50', 'text-muted');
          el.classList.add('opacity-100', 'text-foreground');
        } else {
          el.classList.remove('opacity-100', 'text-foreground');
          el.classList.add('opacity-50', 'text-muted');
        }
      });

      // Calculate fluid scroll progress
      const scrollDistance = sectionHeight + windowHeight;
      const scrolled = windowHeight - sectionTop;
      const scrollProgress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      
      // Calculate scroll-based height (fluid, continuous)
      const scrollBasedHeight = scrollProgress * sectionHeight;
      
      // Determine target height: line extends to last activated element's bottom
      let targetHeight = scrollBasedHeight;
      if (activatedElementsRef.current.size > 0 && lastActivatedPosition > 0) {
        // Line fills fluidly with scroll, but extends to reach the last activated element
        // This ensures the line ends at the last highlighted text while staying smooth
        targetHeight = Math.max(scrollBasedHeight, lastActivatedPosition);
      }
      
      // Update progress bar - fluid scroll, extends to last activated element
      const fillPercentage = sectionHeight > 0 ? (targetHeight / sectionHeight) * 100 : 0;
      progressBar.style.height = `${Math.min(100, fillPercentage)}%`;
      progressBar.style.top = '0';
      progressBar.style.bottom = 'auto';

      rafId = requestAnimationFrame(updateProgress);
    };

    // Intersection Observer to start/stop animation when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isActive = entry.isIntersecting;
          if (isActive) {
            updateProgress();
            rafId = requestAnimationFrame(updateProgress);
          } else {
            if (rafId) cancelAnimationFrame(rafId);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(section);

    // Also listen to scroll for smoother updates
    const handleScroll = () => {
      if (isActive) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [approach.subsections.length]);

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-secondary border-y border-border w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-8 md:mb-10">
            {approach.title}
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted leading-[1.6] font-light mb-16 md:mb-20">
            {approach.description}
          </p>

          {/* Subsections container with progress line */}
          <div ref={sectionRef} className="relative">
            {/* Single continuous line - always visible, full height, starts at subsections */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border/30" aria-hidden="true" />
            
            {/* Progress bar container - full height, fills from top to bottom */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5" aria-hidden="true">
              <div
                ref={progressBarRef}
                className="absolute top-0 left-0 w-full transition-all duration-75 ease-out"
                style={{ height: '0%', backgroundColor: color }}
              />
            </div>

            {/* Subsections with spacing for progress bar */}
            <div className="relative pl-8 md:pl-10">
              <div className="space-y-16 md:space-y-20">
                {approach.subsections.map((subsection, index) => (
                  <div key={index}>
                    {/* Subsection Title - with fade-in */}
                    <h3 
                      data-scroll-element={`title-${index}`}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 tracking-tight-1 transition-all duration-300 opacity-50 text-muted"
                    >
                      {subsection.title}
                    </h3>

                    {/* Subsection Bullets - Simple inline style with icons */}
                    <div className="space-y-4 md:space-y-5 mb-10 md:mb-12">
                      {subsection.bullets.map((bullet, bulletIndex) => {
                    // Get appropriate icon based on subsection title and bullet index
                    const getBulletIcon = (subsectionTitle: string, idx: number) => {
                      const iconClass = "w-5 h-5 md:w-6 md:h-6";
                      
                      // Simplifying Onboarding
                      if (subsectionTitle === 'Simplifying Onboarding') {
                        const icons = [
                          // Streamlined flow - Route/path
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>,
                          // Contextual tooltips - Lightbulb
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>,
                          // Integrated app - Link/connection
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>,
                        ];
                        return icons[idx] || icons[0];
                      }
                      
                      // Building Trust Through Design
                      if (subsectionTitle === 'Building Trust Through Design') {
                        const icons = [
                          // Dashboard - Chart/analytics
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>,
                          // Real-time data - Clock/refresh
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>,
                          // Minimalist UI - Browser/UI
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1-8-8.5L2 9.5l1-1 4.5 1L9.75 4l1.5 1.5L12 8l2.5 2.5L17 12l-1.5 1.5L12 16l-2.25 1z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12h-4" />
                          </svg>,
                        ];
                        return icons[idx] || icons[0];
                      }
                      
                      // Streamlining Trading
                      if (subsectionTitle === 'Streamlining Trading') {
                        const icons = [
                          // Simplified widget - Swap arrows
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>,
                          // Familiar experience - Users/people
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>,
                          // Consistent UX - Device/mobile
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>,
                        ];
                        return icons[idx] || icons[0];
                      }
                      
                      // Transparency & Education
                      if (subsectionTitle === 'Transparency & Education') {
                        const icons = [
                          // Learning center - Book/document
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>,
                          // Full transparency - Eye/view
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>,
                          // Predictable patterns - Checkmark/success
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>,
                        ];
                        return icons[idx] || icons[0];
                      }
                      
                      // Default fallback - Arrow
                      return (
                        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" key={idx}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      );
                    };

                    return (
                      <div 
                        key={bulletIndex} 
                        data-scroll-element={`bullet-${index}-${bulletIndex}`}
                        className="flex items-start gap-4 md:gap-5 transition-all duration-300 opacity-50 text-muted"
                      >
                        <div className="flex-shrink-0 mt-1" style={{ color }}>
                          {getBulletIcon(subsection.title, bulletIndex)}
                        </div>
                        <p className="text-base md:text-lg leading-[1.6] font-light flex-1">
                          {bullet}
                        </p>
                      </div>
                      );
                      })}
                    </div>
                    {subsection.images && subsection.images.length > 0 && (
                      <div className="space-y-8 md:space-y-10">
                        {subsection.images.map((image, imgIndex) => (
                          <ImageBlock key={imgIndex} image={image} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Overall approach images (after all subsections) */}
              {approach.images && approach.images.length > 0 && (
                <div className="mt-16 md:mt-20 space-y-8 md:space-y-10">
                  {approach.images.map((image, index) => (
                    <ImageBlock key={index} image={image} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

