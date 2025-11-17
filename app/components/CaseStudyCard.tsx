'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface CaseStudyCardProps {
  study: {
    company: string;
    title: string;
    description: string;
    slug: string | null;
    color: string;
    icons?: Array<{
      src: string;
      alt: string;
      scale?: number;
    }>;
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
  const [iconTransforms, setIconTransforms] = useState<string[]>([]);

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

      // Calculate enhanced icon transforms (scaled up from text effect)
      if (study.icons) {
        const iconTransformsArray = study.icons.map((icon, index) => {
          const iconScale = icon.scale || 1.04;
          const projectionStrengthIcon = 0.45; // Stronger projection than text
          const iconOffsetX = -x * 45 * projectionStrengthIcon; // More movement
          const iconOffsetY = -y * 45 * projectionStrengthIcon;
          
          // Enhanced tilt for icons (1.5x more dramatic than text)
          const iconTiltX = -y * 12;
          const iconTiltY = x * 12;
          
          // Vary Z-depth per icon for layering effect
          const baseZDepth = 120;
          const zDepth = baseZDepth + (index * 15);
          
          return `translateX(${iconOffsetX}px) translateY(${iconOffsetY}px) translateZ(${zDepth}px) rotateX(${iconTiltX}deg) rotateY(${iconTiltY}deg) scale(${iconScale})`;
        });
        setIconTransforms(iconTransformsArray);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (card && !reducedMotion) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      setTextTransform('translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)');
      if (study.icons) {
        setIconTransforms(study.icons.map(() => 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)'));
      }
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
      {/* Dark background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#111111' }} />

      {/* Floating 3D icons */}
      {study.icons && study.icons.map((icon, index) => {
        const iconTransform = iconTransforms[index] || 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)';
        
        // Calculate positioning for multiple icons (staggered layout)
        const topPosition = 20 + (index * 12); // Start at 20%, offset by 12% each
        const rightPosition = 20 + (index % 2 === 0 ? 0 : 10); // Alternate horizontal position
        
        return (
          <div
            key={index}
            className="absolute pointer-events-none transition-all duration-200 ease-out"
            style={{
              top: `${topPosition}%`,
              right: `${rightPosition}%`,
              width: '20%',
              height: '20%',
              transform: iconTransform,
              filter: isHovered ? 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6))' : 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4))',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="w-full h-full object-contain"
            />
          </div>
        );
      })}

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

