import { useEffect, useState } from 'react';

export interface MousePosition {
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
  clientX: number; // Pixel position
  clientY: number; // Pixel position
}

/**
 * useMousePosition Hook
 * Tracks global mouse position with both normalized and pixel coordinates
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1, // -1 to 1
        y: (e.clientY / window.innerHeight) * 2 - 1, // -1 to 1
        clientX: e.clientX,
        clientY: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

