import { ProjectChallenge as ProjectChallengeType } from '@/lib/projects';
import ImageBlock, { ImageBlockGroup } from './ImageBlock';
import ChallengeCard from './ChallengeCard';

interface ProjectChallengeProps {
  challenge: ProjectChallengeType;
  color: string;
}

/**
 * ProjectChallenge
 * Challenge/problem statement section
 * Displays the core challenges as icon cards and optional images
 */
export default function ProjectChallenge({ challenge, color }: ProjectChallengeProps) {
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

  // Icons for each challenge type
  const getIcon = (index: number) => {
    const icons = [
      // Icon 1: Pattern/compass (no established patterns)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>,
      // Icon 2: Lock/barrier (friction)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>,
      // Icon 3: Shield X (lack of trust)
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM15 11l-6 6m0-6l6 6" />
      </svg>,
      // Icon 4: Disconnect/broken link
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" key={index}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>,
    ];
    return icons[index] || icons[0];
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

