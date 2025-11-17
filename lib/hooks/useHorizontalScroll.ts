import { RefObject, useEffect, useState } from 'react';

export interface HorizontalScrollOptions {
  itemCount: number;
  customScrollLogic?: (index: number, container: HTMLElement, items: HTMLCollection) => number;
}

export interface HorizontalScrollReturn {
  currentIndex: number;
  scrollToIndex: (index: number) => void;
  scrollToPrevious: () => void;
  scrollToNext: () => void;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
}

/**
 * useHorizontalScroll Hook
 * Manages horizontal scroll navigation with current index tracking
 * 
 * @param containerRef - Ref to the scrollable container element
 * @param innerRef - Ref to the inner content element containing items
 * @param options - Configuration options
 * @returns Object with current index and navigation functions
 */
export function useHorizontalScroll(
  containerRef: RefObject<HTMLElement>,
  innerRef: RefObject<HTMLElement>,
  options: HorizontalScrollOptions
): HorizontalScrollReturn {
  const { itemCount, customScrollLogic } = options;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const updateCurrentIndex = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      
      // Get all child elements
      const items = inner.children;
      const itemLimit = Math.min(items.length, itemCount);
      if (itemLimit === 0) return;

      // Calculate which item is most visible (closest to center)
      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < itemLimit; i++) {
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
  }, [containerRef, innerRef, itemCount]);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const items = inner.children;
    if (index < 0 || index >= items.length) return;

    const targetItem = items[index] as HTMLElement;
    const containerWidth = container.clientWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemLeft = targetItem.offsetLeft;
    
    let scrollLeft: number;

    // Use custom scroll logic if provided
    if (customScrollLogic) {
      scrollLeft = customScrollLogic(index, container, items);
    } else {
      // Default: center the item
      scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);
    }
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth',
    });
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToNext = () => {
    if (currentIndex < itemCount - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return {
    currentIndex,
    scrollToIndex,
    scrollToPrevious,
    scrollToNext,
    canScrollPrevious: currentIndex > 0,
    canScrollNext: currentIndex < itemCount - 1,
  };
}

