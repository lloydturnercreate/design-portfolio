'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageBlock as ImageBlockType } from '@/lib/projects';

interface ImageBlockProps {
  image: ImageBlockType;
}

/**
 * ImageBlock
 * Flexible image component that supports multiple layout types
 * Handles full-width, centered, and side-by-side layouts
 * Shows grey placeholder when image is missing or fails to load
 */
export default function ImageBlock({ image }: ImageBlockProps) {
  const [hasError, setHasError] = useState(false);

  const getLayoutClasses = () => {
    switch (image.layout) {
      case 'full':
        return 'w-full';
      case 'large':
        return 'w-full max-w-[90%] mx-auto';
      case 'medium':
        return 'w-full max-w-[70%] mx-auto';
      case 'medium-left':
        return 'w-full md:max-w-[70%] md:mr-auto';
      case 'small':
        return 'w-full max-w-[60%] mx-auto';
      case 'half-left':
        return 'w-full md:w-[48%] md:mr-auto';
      case 'half-right':
        return 'w-full md:w-[48%] md:ml-auto';
      default:
        return 'w-full';
    }
  };

  const isLeftAligned = image.layout === 'medium-left' || image.layout === 'half-left';
  const isFullWidthMobile = image.layout === 'medium-left';

  return (
    <figure className={`${getLayoutClasses()} mb-8 md:mb-10`}>
      <div className="relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group">
        {hasError ? (
          // Placeholder when image is missing or fails to load
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
            <div className="text-center px-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-neutral-700/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-500 font-medium">Image placeholder</p>
              <p className="text-xs text-neutral-600 mt-1 max-w-xs">{image.alt}</p>
            </div>
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {image.caption && (
        <figcaption className={`mt-4 text-sm md:text-base text-muted-dark leading-[1.6] font-light ${isLeftAligned ? 'text-left' : 'text-center'} ${isFullWidthMobile ? 'w-full' : ''}`}>
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

function GroupImageItem({ image }: { image: ImageBlockType }) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="w-full">
      <div className="relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
            <div className="text-center px-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-neutral-700/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-neutral-500 font-medium">Placeholder</p>
            </div>
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 600px"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {image.caption && (
        <figcaption className="mt-4 text-sm md:text-base text-muted-dark text-center leading-[1.6] font-light">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ImageBlockGroup({ images, layout }: ImageBlockGroupProps) {
  const gridClasses = layout === 'two-up' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8';

  return (
    <div className={`${gridClasses} w-full mb-8 md:mb-10`}>
      {images.map((image, index) => (
        <GroupImageItem key={index} image={image} />
      ))}
    </div>
  );
}

