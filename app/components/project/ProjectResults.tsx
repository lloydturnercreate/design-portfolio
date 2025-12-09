'use client';

import { ProjectResults as ProjectResultsType } from '@/lib/projects';
import ImageBlock from './ImageBlock';
import StatBlock from './StatBlock';
import ImageLightbox from './ImageLightbox';
import { useLightbox } from '@/lib/hooks/useLightbox';

interface ProjectResultsProps {
  results: ProjectResultsType;
  color: string;
}

/**
 * ProjectResults
 * Results and impact section
 * Shows outcomes, metrics, optional conclusion, and images
 */
export default function ProjectResults({ results, color }: ProjectResultsProps) {
  // Lightbox state
  const allImages = results.images || [];
  const { isOpen, currentIndex, openLightbox, closeLightbox } = useLightbox(
    allImages.map(img => ({ src: img.src, alt: img.alt, caption: img.caption }))
  );
  return (
    <section className="py-20 md:py-32 lg:py-40 bg-background w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-8 md:mb-10">
            {results.title}
          </h2>

          {/* Description (optional) */}
          {results.description && (
            <p className="text-xl md:text-2xl text-muted leading-[1.6] font-light mb-10 md:mb-12">
              {results.description}
            </p>
          )}

          {/* Metrics (visual stats) */}
          {results.metrics && results.metrics.length > 0 && (
            <StatBlock metrics={results.metrics} color={color} />
          )}

          {/* Results Bullets */}
          <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
            {results.items ? (
              results.items.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                       {item.title}
                     </h3>
                     <p className="text-lg md:text-xl text-foreground leading-[1.6] font-light">
                       {item.description}
                     </p>
                  </div>
                </div>
              ))
            ) : (
              results.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  <p className="text-lg md:text-xl text-foreground leading-[1.6] font-light">
                    {bullet}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Images */}
          {results.images && results.images.length > 0 && (
            <div className="space-y-8 md:space-y-10 mb-12 md:mb-16">
              {results.images.map((image, index) => (
                <ImageBlock 
                  key={index} 
                  image={image}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </div>
          )}

          {/* Conclusion if provided */}
          {results.conclusion && (
            <div className="pt-12 md:pt-16 border-t border-border">
              <p className="text-xl md:text-2xl text-muted leading-[1.6] font-light italic">
                {results.conclusion}
              </p>
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

