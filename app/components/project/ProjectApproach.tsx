'use client';

import { useRef, useEffect } from 'react';
import { ProjectApproach as ProjectApproachType } from '@/lib/projects';
import ImageBlock, { ImageBlockGroup } from './ImageBlock';
import { getApproachIcon } from '@/lib/approachIcons';

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
                      {subsection.bullets.map((bullet, bulletIndex) => (
                        <div 
                          key={bulletIndex} 
                          data-scroll-element={`bullet-${index}-${bulletIndex}`}
                          className="flex items-start gap-4 md:gap-5 transition-all duration-300 opacity-50 text-muted"
                        >
                          <div className="flex-shrink-0 mt-1" style={{ color }}>
                            {getApproachIcon(subsection.title, bulletIndex)}
                          </div>
                          <p className="text-base md:text-lg leading-[1.6] font-light flex-1">
                            {bullet}
                          </p>
                        </div>
                      ))}
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

