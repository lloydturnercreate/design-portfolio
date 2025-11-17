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
    // Sukiyaki-specific icons
    if (projectSlug === 'sukiyaki') {
      const sukiyakiIcons = [
        // Icon 1: Warmth/connection (heart - warmth and inclusion)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>,
        // Icon 2: Premium/balance (layers - sophistication and structure)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>,
        // Icon 3: Immersion/presence (eye - "you're already there")
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>,
        // Icon 4: Cultural bridge (scales - balance between cultures)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>,
        // Icon 5: Accessibility/welcome (open door - welcoming, accessible)
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9V7a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h.01M6 13h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
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
            {challenge.bullets.map((bullet, index) => (
              <ChallengeCard 
                key={index}
                icon={getIcon(index)}
                text={bullet}
                color={color}
              />
            ))}
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

