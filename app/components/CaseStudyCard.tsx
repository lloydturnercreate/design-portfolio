'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface CaseStudyCardProps {
  study: {
    company: string;
    title: string;
    description: string;
    slug: string | null;
    color: string;
    coverImage?: string;
  };
}

/**
 * CaseStudyCard
 * Interactive 3D card for case study previews
 * Features parallax text effect on hover
 */
export default function CaseStudyCard({ study }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [textTransform, setTextTransform] = useState('');

  // Mouse tracking for 3D tilt with parallax text effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;

      // Get card bounds
      const rect = card.getBoundingClientRect();
      
      // Calculate mouse position relative to card center (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Apply subtle 3D tilt to card
      const tiltX = y * 2;
      const tiltY = x * -2;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;

      // Calculate projection offset for text (proportional to Z-depth)
      const projectionStrength = 0.3; // How much the text shifts
      const textOffsetX = -x * 30 * projectionStrength; // pixels (inverted)
      const textOffsetY = -y * 30 * projectionStrength; // pixels (inverted)

      // Apply more dramatic tilt to text layer for separation effect (inverted)
      const textTiltX = -y * 8; // 4x more dramatic than card
      const textTiltY = x * 8; // inverted from x * -8
      setTextTransform(`translateX(${textOffsetX}px) translateY(${textOffsetY}px) translateZ(80px) rotateX(${textTiltX}deg) rotateY(${textTiltY}deg) scale(1.02)`);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (card && !reducedMotion) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      setTextTransform('translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)');
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  const cardContent = (
    <div 
      className={`relative w-full h-full bg-card border rounded-3xl overflow-hidden shadow-premium transition-all duration-300 cursor-pointer group ${
        isHovered ? 'border-muted-dark' : 'border-border'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Cover image or placeholder - full card background */}
      {study.coverImage ? (
        <div className="absolute inset-0">
          <Image
            src={study.coverImage}
            alt={`${study.company} cover image`}
            fill
            className="object-cover object-left md:object-center lg:object-right"
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 85vw, 80vw"
            priority={study.company === 'Phuture'}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-background group-hover:bg-secondary transition-colors flex items-center justify-center">
          <span className="text-sm md:text-base text-muted-dark font-medium uppercase tracking-[0.12em]">
            {study.company}
          </span>
        </div>
      )}

      {/* Content overlaid at bottom */}
      <div 
        ref={textRef}
        className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 xl:p-14 pointer-events-none transition-all duration-200 ease-out"
        style={{
          transform: textTransform || 'translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)',
          filter: isHovered ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))' : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
        }}
      >
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight-1" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.6)' }}>
          {study.company}
        </h3>
        <p 
          className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-[0.08em] mb-4 md:mb-5"
          style={{ color: study.color, textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}
        >
          {study.title}
        </p>
        <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-[1.6] font-light max-w-[450px]" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
          {study.description}
        </p>
      </div>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className="relative h-[60vh] md:h-[65vh] lg:h-[70vh] transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {study.slug ? (
        <Link href={`/${study.slug}`} aria-label={`View ${study.company} case study`} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
}

