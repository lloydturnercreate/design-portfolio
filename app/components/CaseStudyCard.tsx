'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

export interface CaseStudyCardProps {
  study: {
    company: string;
    title: string;
    description: string;
    slug: string | null;
    color: string;
    backgroundImage?: string;
    backgroundImages?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    imageAlignment?: 'left' | 'center';
    noiseOverlay?: boolean; // Enable film grain/noise effect
    noiseOpacity?: number; // Noise opacity (0-1)
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
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { startTransition } = useTransition();

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      // Check for touch support and small screens
      const isTouchDevice = window.matchMedia('(hover: none)').matches;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Mouse tracking for 3D tilt with parallax text effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isMobile) return;

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
  }, [reducedMotion, isMobile]);

  // Handle card click for transition
  const handleCardClick = (e: React.MouseEvent) => {
    if (!study.slug) return;

    e.preventDefault();
    setIsClicked(true);

    // Mark that we're on a project page (for back navigation detection)
    sessionStorage.setItem('wasOnProject', 'true');

    // Get card position for potential future use
    const rect = cardRef.current?.getBoundingClientRect();
    
    // On mobile, navigate immediately. On desktop, use transition.
    if (isMobile) {
      router.push(`/${study.slug}`);
    } else {
      // Start transition with card metadata
      startTransition({
        slug: study.slug,
        color: study.color,
        position: rect ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height } : undefined,
      });

      // Navigate after delay to allow scale animation
      setTimeout(() => {
        router.push(`/${study.slug}`);
      }, TRANSITION_CONFIG.durations.navigationDelay * 1000);
    }
  };

  const fallbackImage = study.backgroundImage || 
    study.backgroundImages?.desktop || 
    study.backgroundImages?.tablet || 
    study.backgroundImages?.mobile;

  const imageAlignmentClass = study.imageAlignment === 'center' 
    ? 'object-center' 
    : 'object-left md:object-center';

  const cardContent = (
    <div 
      className={`relative w-full h-full bg-card border rounded-3xl overflow-hidden shadow-premium ${isMobile ? '' : 'transition-all duration-300'} cursor-pointer group ${
        (!isMobile && isHovered) ? 'border-muted-dark' : 'border-border'
      } ${isClicked ? 'ring-2 ring-white ring-opacity-50' : ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background image - responsive with next/image */}
      {(study.backgroundImages || study.backgroundImage) ? (
        <div className="absolute inset-0">
          {/* Mobile Image (< 768px) */}
          {study.backgroundImages?.mobile && (
            <div className="block md:hidden h-full w-full relative">
              <Image
                src={study.backgroundImages.mobile}
                alt={`${study.company} case study cover`}
                fill
                priority={true}
                quality={100}
                sizes="(max-width: 768px) 100vw"
                className={`object-cover ${imageAlignmentClass}`}
              />
            </div>
          )}
          
          {/* Tablet Image (768px - 1024px) */}
          {study.backgroundImages?.tablet && (
            <div className="hidden md:block lg:hidden h-full w-full relative">
              <Image
                src={study.backgroundImages.tablet}
                alt={`${study.company} case study cover`}
                fill
                priority={true}
                quality={100}
                sizes="(min-width: 768px) and (max-width: 1024px) 100vw"
                className={`object-cover ${imageAlignmentClass}`}
              />
            </div>
          )}
          
          {/* Desktop Image (>= 1024px) */}
          <div className={`${study.backgroundImages?.mobile ? 'hidden' : 'block'} ${study.backgroundImages?.tablet ? 'lg:block' : ''} ${(!study.backgroundImages?.mobile && !study.backgroundImages?.tablet) ? 'block' : ''} h-full w-full relative`}>
            <Image
              src={study.backgroundImages?.desktop || fallbackImage || ''}
              alt={`${study.company} case study cover`}
              fill
              priority={true}
              quality={100}
              sizes="(min-width: 1024px) 100vw"
              className={`object-cover ${imageAlignmentClass}`}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: '#111111' }} />
      )}

      {/* Noise overlay - film grain effect */}
      {study.noiseOverlay && (
        <div 
          className="absolute inset-0 pointer-events-none noise-overlay"
          style={{ 
            opacity: study.noiseOpacity || 0.35,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Content overlaid at bottom */}
      <div 
        ref={textRef}
        className={`absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 xl:p-14 pointer-events-none ${isMobile ? '' : 'transition-all duration-200 ease-out'}`}
        style={{
          transform: textTransform || 'translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)',
          filter: (!isMobile && isHovered) ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))' : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
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
        <div 
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCardClick(e as any);
            }
          }}
          aria-label={`View ${study.company} case study`} 
          className="block h-full"
        >
          {cardContent}
        </div>
      ) : (
        cardContent
      )}
    </div>
  );
}
