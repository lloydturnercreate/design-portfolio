'use client';

import Image from 'next/image';
import { ImageBlock as ImageBlockType } from '@/lib/projects';

interface ImageBlockProps {
  image: ImageBlockType;
}

/**
 * ImageBlock
 * Flexible image component that supports multiple layout types
 * Handles full-width, centered, and side-by-side layouts
 */
export default function ImageBlock({ image }: ImageBlockProps) {
  const getLayoutClasses = () => {
    switch (image.layout) {
      case 'full':
        return 'w-full';
      case 'large':
        return 'w-full max-w-[90%] mx-auto';
      case 'medium':
        return 'w-full max-w-[70%] mx-auto';
      case 'half-left':
        return 'w-full md:w-[48%] md:mr-auto';
      case 'half-right':
        return 'w-full md:w-[48%] md:ml-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <figure className={`${getLayoutClasses()} mb-8 md:mb-10`}>
      <div className="relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
      </div>
      {image.caption && (
        <figcaption className="mt-4 text-sm md:text-base text-muted-dark text-center leading-[1.6] font-light">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * ImageBlockGroup
 * Handles multiple images in a row (two-up, three-up layouts)
 */
interface ImageBlockGroupProps {
  images: ImageBlockType[];
  layout: 'two-up' | 'three-up';
}

export function ImageBlockGroup({ images, layout }: ImageBlockGroupProps) {
  const gridClasses = layout === 'two-up' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8';

  return (
    <div className={`${gridClasses} w-full mb-8 md:mb-10`}>
      {images.map((image, index) => (
        <figure key={index} className="w-full">
          <div className="relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 600px"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-4 text-sm md:text-base text-muted-dark text-center leading-[1.6] font-light">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

