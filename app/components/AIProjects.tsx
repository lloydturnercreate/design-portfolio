/**
 * AI Projects / Experiments Section
 * Displays projects with category 'ai-project' or 'experiment'
 * Grid layout for interactive experiences
 */

'use client';

import { useRouter } from 'next/navigation';
import { allProjects } from '@/lib/projects';
import { useTransition } from '@/lib/context/TransitionContext';
import { TRANSITION_CONFIG } from '@/lib/transitionConfig';

// Filter for AI projects and experiments
const aiProjects = allProjects.filter(
  (project) =>
    project.metadata.category === 'ai-project' ||
    project.metadata.category === 'experiment'
);

export default function AIProjects() {
  const router = useRouter();
  const { startLogoTransition } = useTransition();

  // Don't render if no AI projects exist
  if (aiProjects.length === 0) return null;

  /**
   * Handle AI project click with logo transition
   */
  const handleProjectClick = (e: React.MouseEvent, slug: string, logoSrc: string, color: string) => {
    e.preventDefault();
    
    // Start logo transition
    startLogoTransition({
      slug,
      logoSrc,
      color,
    });

    // Navigate immediately - video plays on the new page
    router.push(`/${slug}`);
  };

  /**
   * Get logo path for AI project
   * Checks for dedicated logo files (PNG or SVG)
   */
  const getLogoPath = (slug: string, backgroundImage?: string): string => {
    // Map of known logo extensions
    const logoExtensions = ['png', 'svg'];
    
    // Try each extension
    for (const ext of logoExtensions) {
      const logoPath = `/project-covers/${slug}-logo.${ext}`;
      // For warble, check if it's using the base .svg file
      if (slug === 'warble' && backgroundImage?.includes('warble.svg')) {
        return backgroundImage;
      }
      // Return the logo path (will work with Next.js Image or fallback gracefully)
      return logoPath;
    }
    
    // Fall back to background image if no logo
    return backgroundImage || `/project-covers/${slug}.png`;
  };

  return (
    <section
      id="experiments"
      className="py-20 md:py-32 lg:py-40 bg-background border-t border-border w-full relative"
    >
      {/* Container with padding */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">
              AI EXPERIMENTATION
            </span>
          </div>

          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-4 md:mb-5 text-balance">
              Generative Design
            </h2>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              A selection of projects, experimentations and tools created using generative AI
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {aiProjects.map((project) => {
              // Check if project is coming soon (has "Coming Soon" in meta.duration)
              const isComingSoon = project.hero?.meta?.duration === 'Coming Soon';
              
              // Shared card content
              const cardContent = (
                <>
                  {/* Background - solid color with glow effect */}
                  <div
                    className={`w-full h-64 transition-transform duration-500 relative ${
                      isComingSoon ? 'group-hover:scale-[1.02]' : 'group-hover:scale-105'
                    }`}
                    style={{
                      background: isComingSoon
                        ? `linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #0a0a0a 100%)`
                        : `linear-gradient(135deg, ${project.color}25 0%, ${project.color}05 50%, #0a0a0a 100%)`,
                    }}
                  >
                    {/* Overlay */}
                    <div className={`absolute inset-0 ${
                      isComingSoon 
                        ? 'bg-gradient-to-t from-black/90 via-black/60 to-black/20'
                        : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                    }`}></div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div
                      className={`w-12 h-1 mb-4 transition-all duration-300 ${
                        isComingSoon ? 'opacity-30' : 'group-hover:w-20'
                      }`}
                      style={{ backgroundColor: isComingSoon ? '#666666' : project.color }}
                    ></div>
                    <h3 className={`text-2xl font-bold mb-2 tracking-tight ${
                      isComingSoon ? 'text-gray-500' : 'text-white'
                    }`}>
                      {project.card.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${
                      isComingSoon ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {project.card.description}
                    </p>

                    {/* Category Badge */}
                    <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                      isComingSoon
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-white/10 border border-white/20'
                    }`}>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        isComingSoon ? 'text-gray-600' : 'text-white'
                      }`}>
                        {isComingSoon ? 'Coming Soon' : 'Interactive'}
                      </span>
                    </div>
                  </div>
                </>
              );

              // If coming soon, render as div with same hover effect (non-clickable)
              if (isComingSoon) {
                return (
                  <div
                    key={project.metadata.slug}
                    className="group relative overflow-hidden rounded-lg bg-secondary/50 transition-all duration-500 hover:-translate-y-[10px] hover:-rotate-[2deg] hover:shadow-2xl cursor-not-allowed opacity-50 grayscale-[50%]"
                  >
                    {cardContent}
                  </div>
                );
              }

              // Otherwise, render as clickable link with same hover effect
              return (
                <a
                  key={project.metadata.slug}
                  href={`/${project.metadata.slug}`}
                  onClick={(e) => handleProjectClick(
                    e,
                    project.metadata.slug,
                    getLogoPath(project.metadata.slug, project.card.backgroundImage),
                    project.color
                  )}
                  className="group relative overflow-hidden rounded-lg border border-border bg-secondary hover:border-foreground/20 transition-all duration-500 hover:-translate-y-[10px] hover:-rotate-[2deg] hover:shadow-2xl cursor-pointer"
                >
                  {cardContent}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
