'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * FloatingBackButton
 * Fixed position button that floats above all content
 * Fades in after user scrolls past the hero section
 * Must be rendered outside of transforms to maintain proper fixed positioning
 */
export default function FloatingBackButton() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past ~80vh (typical hero height)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      
      setIsVisible(scrollPosition > heroHeight);
    };

    // Check on mount
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <button
      onClick={() => router.back()}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group flex items-center gap-3 px-4 py-3 md:px-5 md:py-3.5 bg-blue-950 hover:bg-slate-950 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Return to gallery view"
    >
      <svg
        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="text-sm md:text-base font-medium tracking-tight text-foreground">
        Gallery
      </span>
    </button>
  );
}

