'use client';

import { ProjectChallenge as ProjectChallengeType, ImageBlock as ImageBlockType } from '@/lib/projects';
import ImageBlock, { ImageBlockGroup } from './ImageBlock';
import ChallengeCard from './ChallengeCard';
import ImageLightbox from './ImageLightbox';
import { useLightbox } from '@/lib/hooks/useLightbox';

interface ProjectChallengeProps {
  challenge: ProjectChallengeType;
  color: string;
  projectSlug?: string;
}

/**
 * ProjectChallenge
 * Challenge/problem statement section
 * Displays the core challenges as icon cards and optional images
 */
export default function ProjectChallenge({ challenge, color, projectSlug }: ProjectChallengeProps) {
  // Create flat array of all images for lightbox (preserving order: singles first, then grouped)
  const allImages: ImageBlockType[] = [];
  const singleImages: ImageBlockType[] = [];
  let groupedData: { layout: 'two-up' | 'three-up', images: ImageBlockType[], startIndex: number } | null = null;

  challenge.images?.forEach((image) => {
    if (image.layout === 'two-up' || image.layout === 'three-up') {
      if (!groupedData) {
        groupedData = { layout: image.layout, images: [], startIndex: singleImages.length };
      }
      groupedData.images.push(image);
    } else {
      singleImages.push(image);
    }
  });

  // Build allImages array in display order
  singleImages.forEach((img) => allImages.push(img));
  if (groupedData) {
    groupedData.startIndex = allImages.length;
    groupedData.images.forEach((img) => allImages.push(img));
  }

  // Lightbox state
  const { isOpen, currentIndex, openLightbox, closeLightbox } = useLightbox(
    allImages.map(img => ({ src: img.src, alt: img.alt, caption: img.caption }))
  );

  // Icons for each challenge type - project-specific
  const getIcon = (index: number) => {
    // MoonPay-specific icons
    if (projectSlug === 'moonpay') {
      const moonpayIcons = [
        // Icon 1: Forked path / diverging routes (Safety vs. Speed - two opposing directions)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <circle cx="12" cy="19" r="2" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17V12" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12L6 6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12L18 6" />
          <circle cx="6" cy="5" r="1.5" strokeWidth={1.5} />
          <circle cx="18" cy="5" r="1.5" strokeWidth={1.5} />
        </svg>,
        // Icon 2: Two overlapping circles (Dual-Stakeholder Alignment)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <circle cx="9" cy="12" r="5" strokeWidth={1.5} />
          <circle cx="15" cy="12" r="5" strokeWidth={1.5} />
        </svg>,
        // Icon 3: Empty box/foundation (Zero Foundation)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>,
        // Icon 4: Bridge / gap connector (The Credibility Gap - bridging two worlds)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16V8m16 8V8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12v4m4-4v4m4-4v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8c4-3 12-3 16 0" />
        </svg>,
      ];
      return moonpayIcons[index] || moonpayIcons[0];
    }

    // Phuture Finance-specific icons
    if (projectSlug === 'phuture-finance') {
      const phutureIcons = [
        // Icon 1: Stacked layers / piling up (Cognitive Overload - too many things to manage)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <rect x="4" y="14" width="16" height="4" rx="1" strokeWidth={1.5} />
          <rect x="6" y="9" width="12" height="4" rx="1" strokeWidth={1.5} />
          <rect x="8" y="4" width="8" height="4" rx="1" strokeWidth={1.5} />
        </svg>,
        // Icon 2: Broken link / disconnected (Fragmented Journeys)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l2 2m8 8l2 2" />
        </svg>,
        // Icon 3: Chart trending down (The Trust Deficit - gamified volatility)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>,
        // Icon 4: Wall / blocked path (Technical Barriers)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>,
      ];
      return phutureIcons[index] || phutureIcons[0];
    }

    // Sukiyaki-specific icons
    if (projectSlug === 'sukiyaki') {
      const sukiyakiIcons = [
        // Icon 1: Translation/transformation (scroll - traditional art to digital)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>,
        // Icon 2: Balance (scales - balancing storytelling with functionality)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>,
        // Icon 3: Premium/simplicity (diamond - luxury without clutter)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>,
        // Icon 4: Effortless exclusivity (key - access that's seamless yet exclusive)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>,
        // Icon 5: Cultural authenticity (sparkle/star - standing out through uniqueness)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>,
      ];
      return sukiyakiIcons[index] || sukiyakiIcons[0];
    }

    // Default icons for other projects
    const defaultIcons = [
      // Icon 1: Journey/path (no established patterns)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>,
      // Icon 2: Trending down (friction)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>,
      // Icon 3: Shield with cross (lack of trust)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM15 11l-6 6m0-6l6 6" />
      </svg>,
      // Icon 4: Broken link/unplug (disconnect)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>,
    ];
    return defaultIcons[index] || defaultIcons[0];
  };

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-background w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-8 md:mb-10">
            {challenge.title}
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted leading-[1.6] font-light mb-12 md:mb-16">
            {challenge.description}
          </p>

          {/* Challenge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
            {challenge.items ? (
              challenge.items.map((item, index) => (
                <ChallengeCard 
                  key={index}
                  icon={getIcon(index)}
                  title={item.title}
                  text={item.description}
                  color={color}
                />
              ))
            ) : (
              challenge.bullets.map((bullet, index) => (
                <ChallengeCard 
                  key={index}
                  icon={getIcon(index)}
                  text={bullet}
                  color={color}
                />
              ))
            )}
          </div>

          {/* Images */}
          {challenge.images && challenge.images.length > 0 && (
            <div className="space-y-8 md:space-y-10">
              {singleImages.map((image, index) => (
                <ImageBlock 
                  key={index} 
                  image={image} 
                  onClick={() => openLightbox(index)}
                />
              ))}
              {groupedData && (
                <ImageBlockGroup 
                  images={groupedData.images} 
                  layout={groupedData.layout}
                  onImageClick={(groupIndex) => openLightbox(groupedData!.startIndex + groupIndex)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages.map(img => ({ src: img.src, alt: img.alt, caption: img.caption }))}
        initialIndex={currentIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
      />
    </section>
  );
}

