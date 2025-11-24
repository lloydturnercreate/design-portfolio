import { ProjectChallenge as ProjectChallengeType } from '@/lib/projects';
import ImageBlock, { ImageBlockGroup } from './ImageBlock';
import ChallengeCard from './ChallengeCard';

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
  // Group images by layout type
  const groupedImages = challenge.images?.reduce((acc, image) => {
    if (image.layout === 'two-up' || image.layout === 'three-up') {
      if (!acc.grouped) acc.grouped = { layout: image.layout, images: [] };
      acc.grouped.images.push(image);
    } else {
      acc.single.push(image);
    }
    return acc;
  }, { single: [] as typeof challenge.images, grouped: null as { layout: 'two-up' | 'three-up', images: typeof challenge.images } | null });

  // Icons for each challenge type - project-specific
  const getIcon = (index: number) => {
    // MoonPay-specific icons
    if (projectSlug === 'moonpay') {
      const moonpayIcons = [
        // Icon 1: Two overlapping circles (Dual-Stakeholder Alignment)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <circle cx="10" cy="12" r="6" strokeWidth={1.5} />
          <circle cx="14" cy="12" r="6" strokeWidth={1.5} />
        </svg>,
        // Icon 2: Clock/timer with motion lines (The Velocity Trap)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <circle cx="12" cy="12" r="7" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v5l3 3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h2m14 0h2M12 3v2m0 14v2" />
        </svg>,
        // Icon 3: Empty foundation/blueprint (Zero Foundation)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>,
        // Icon 4: Lightning bolt (The Credibility Gap - bridging energy/speed with trust)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>,
      ];
      return moonpayIcons[index] || moonpayIcons[0];
    }

    // Future-specific icons
    if (projectSlug === 'future') {
      const futureIcons = [
        // Icon 1: Overloading / Brain (Cognitive Overload)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>,
        // Icon 2: Broken path / Zigzag (Fragmented Journeys)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>,
        // Icon 3: Down arrow (The Trust Deficit / Volatility)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>,
        // Icon 4: Fencing / Barrier (Technical Barriers)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>,
      ];
      return futureIcons[index] || futureIcons[0];
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
              {groupedImages?.single.map((image, index) => (
                <ImageBlock key={index} image={image} />
              ))}
              {groupedImages?.grouped && (
                <ImageBlockGroup 
                  images={groupedImages.grouped.images} 
                  layout={groupedImages.grouped.layout}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

