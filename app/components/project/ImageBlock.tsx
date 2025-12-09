'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageBlock as ImageBlockType } from '@/lib/projects';

interface ImageBlockProps {
  image: ImageBlockType;
  onClick?: () => void;
}

/**
 * ImageBlock
 * Flexible image component that supports multiple layout types
 * Handles full-width, centered, and side-by-side layouts
 * Shows grey placeholder when image is missing or fails to load
 * 
 * @param image - Image data with src, alt, caption, and layout
 * @param onClick - Optional click handler for lightbox integration
 */
export default function ImageBlock({ image, onClick }: ImageBlockProps) {
  const [hasError, setHasError] = useState(false);
  const isClickable = !!onClick;
  const isVideo = image.src.match(/\.(mp4|webm|mov|avi)$/i);

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

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <figure 
      className={`${getLayoutClasses()} mb-8 md:mb-10 ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-label={isClickable ? `View ${image.alt} in fullscreen` : undefined}
    >
      <div className={`relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group ${isClickable ? 'hover:border-muted-dark hover:shadow-premium transition-all duration-300' : ''}`}>
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
        ) : isVideo ? (
          <video
            src={image.src}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            autoPlay
            loop
            muted
            playsInline
          />
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
        
        {/* Expand icon overlay - shown on hover when clickable */}
        {isClickable && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
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
  onImageClick?: (index: number) => void;
}

interface GroupImageItemProps {
  image: ImageBlockType;
  onClick?: () => void;
}

function GroupImageItem({ image, onClick }: GroupImageItemProps) {
  const [hasError, setHasError] = useState(false);
  const isClickable = !!onClick;
  const isVideo = image.src.match(/\.(mp4|webm|mov|avi)$/i);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <figure 
      className={`w-full ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-label={isClickable ? `View ${image.alt} in fullscreen` : undefined}
    >
      <div className={`relative w-full aspect-video bg-card border border-border rounded-2xl overflow-hidden group ${isClickable ? 'hover:border-muted-dark hover:shadow-premium transition-all duration-300' : ''}`}>
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
        ) : isVideo ? (
          <video
            src={image.src}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            autoPlay
            loop
            muted
            playsInline
          />
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
        
        {/* Expand icon overlay - shown on hover when clickable */}
        {isClickable && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
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

export function ImageBlockGroup({ images, layout, onImageClick }: ImageBlockGroupProps) {
  const gridClasses = layout === 'two-up' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8';

  return (
    <div className={`${gridClasses} w-full mb-8 md:mb-10`}>
      {images.map((image, index) => (
        <GroupImageItem 
          key={index} 
          image={image} 
          onClick={onImageClick ? () => onImageClick(index) : undefined}
        />
      ))}
    </div>
  );
}

