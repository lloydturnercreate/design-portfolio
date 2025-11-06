'use client';

import { useRef, useEffect } from 'react';

interface ScrollProgressSectionProps {
  children: React.ReactNode;
  bullets: string[];
}

/**
 * ScrollProgressSection
 * Section with a vertical progress bar that fills as you scroll
 * Text items light up as they enter viewport center
 */
export default function ScrollProgressSection({ children, bullets }: ScrollProgressSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activatedBulletsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!sectionRef.current || !progressBarRef.current) return;

    const section = sectionRef.current;
    const progressBar = progressBarRef.current;
    const bulletElements = section.querySelectorAll('[data-bullet-index]');
    
    let rafId: number;
    let isActive = false;

    const updateProgress = () => {
      if (!isActive) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress through the section
      // Progress = 0 when section top reaches viewport bottom (entering)
      // Progress = 1 when section bottom reaches viewport top (exiting)
      const scrollDistance = sectionHeight + windowHeight;
      const scrolled = windowHeight - sectionTop;
      const scrollProgress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      
      // Update progress bar - fills from top to bottom
      const fillPercentage = scrollProgress * 100;
      progressBar.style.height = `${fillPercentage}%`;
      progressBar.style.top = '0';
      progressBar.style.bottom = 'auto';

      // Highlight bullets as they approach viewport center - once lit, stay lit
      const viewportCenter = windowHeight / 2;
      bulletElements.forEach((el, index) => {
        const bulletRect = el.getBoundingClientRect();
        const bulletCenter = bulletRect.top + bulletRect.height / 2;
        const distance = Math.abs(bulletCenter - viewportCenter);
        const isCurrentlyActive = distance < windowHeight * 0.35; // Within 35% of center
        
        // If bullet is active, mark it as activated and keep it lit
        if (isCurrentlyActive) {
          activatedBulletsRef.current.add(index);
        }
        
        // Update opacity and color - stay lit if it was ever activated
        const shouldBeLit = activatedBulletsRef.current.has(index);
        if (shouldBeLit) {
          el.classList.remove('opacity-50', 'text-muted');
          el.classList.add('opacity-100', 'text-foreground');
        } else {
          el.classList.remove('opacity-100', 'text-foreground');
          el.classList.add('opacity-50', 'text-muted');
        }
      });

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
  }, [bullets.length]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Static background line - always visible, full height, spans entire section */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border/30" aria-hidden="true" />
      
      {/* Progress bar container - full height, fills from top to bottom */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5" aria-hidden="true">
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 w-full bg-primary transition-all duration-75 ease-out"
          style={{ height: '0%' }}
        />
      </div>

      {/* Content with spacing for progress bar */}
      <div className="relative pl-8 md:pl-10">
        {children}
      </div>
    </div>
  );
}

