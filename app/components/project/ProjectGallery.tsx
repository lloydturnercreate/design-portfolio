'use client';

import { useRef, useEffect, useState } from 'react';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
}

/**
 * ProjectGallery
 * Horizontal scrolling gallery for project images
 * Supports both portrait and landscape images with consistent height
 * Mirrors the design of the home page case studies without 3D effects
 */
export default function ProjectGallery({ images }: ProjectGalleryProps) {
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
      
      // Constrain scroll position to prevent last image from going too far right
      // The padding-right of 100px on the inner container naturally limits scroll
      // But we add an extra constraint as a safety measure
      const maxScrollPosition = container.scrollWidth - container.clientWidth;
      if (scrollLeft > maxScrollPosition) {
        requestAnimationFrame(() => {
          container.scrollLeft = maxScrollPosition;
        });
      }
      
      // Get all image elements
      const items = inner.children;
      if (items.length === 0) return;

      // Calculate which image is most visible
      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        const itemLeft = item.offsetLeft - scrollLeft;
        const itemCenter = itemLeft + item.offsetWidth / 2;
        const containerCenter = containerWidth / 2;
        const distance = Math.abs(itemCenter - containerCenter);

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

    const items = inner.children;
    if (index < 0 || index >= items.length) return;

    const targetItem = items[index] as HTMLElement;
    const containerWidth = container.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemLeft = targetItem.offsetLeft;
    
    // For the last image, position it so its right edge is 100px from the container's right edge
    // For all other images, center them
    const isLastImage = index === images.length - 1;
    let scrollLeft: number;
    
    if (isLastImage) {
      // Position last image so its right edge is 100px from container's right edge
      scrollLeft = itemLeft + itemWidth - containerWidth + 100;
    } else {
      // Center all other images
      scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);
    }
    
    // Calculate max scroll position (accounting for 100px padding-right on inner container)
    const maxScrollPosition = container.scrollWidth - container.clientWidth;
    
    container.scrollTo({
      left: Math.max(0, Math.min(scrollLeft, maxScrollPosition)),
      behavior: 'smooth',
    });
  };


  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary border-y border-border w-full">
      {/* Image gallery horizontal scroll - Full viewport width, edge to edge */}
      <div className="mb-12 md:mb-16 w-full">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div 
            ref={scrollInnerRef}
            className="flex gap-6 md:gap-8 pl-6 sm:pl-8 lg:pl-12 pr-6 sm:pr-8 lg:pr-12"
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 first:pl-0"
              >
                <GalleryItem image={image} index={index} />
              </div>
            ))}
            {/* Spacer after last image to allow centering */}
            <div className="flex-shrink-0 w-[4vw]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              {/* Navigation Dots */}
              <div className="flex items-center gap-4 md:gap-5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-2.5 h-2.5 md:w-3 md:h-3 bg-foreground'
                        : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-muted-dark hover:bg-muted'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

function GalleryItem({ image, index }: GalleryItemProps) {
  const isVideo = image.src.match(/\.(mp4|webm|mov|avi)$/i);
  
  return (
    <div className="relative group">
      {/* Media container with consistent height, width hugs content */}
      <div 
        className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] bg-card border border-border rounded-2xl overflow-hidden hover:border-muted-dark hover:shadow-premium transition-all duration-300 inline-flex"
      >
        {isVideo ? (
          <video
            src={image.src}
            className="h-full w-auto object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-auto object-cover"
          />
        )}
      </div>
    </div>
  );
}

