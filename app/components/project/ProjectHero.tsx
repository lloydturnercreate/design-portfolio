'use client';

import { ProjectHero as ProjectHeroType } from '@/lib/projects';
import ProjectMeta from './ProjectMeta';
import CursorRevealGrid from '../CursorRevealGrid';

interface ProjectHeroProps {
  hero: ProjectHeroType;
  color: string;
}

/**
 * ProjectHero
 * Hero section for project pages
 * Displays project title, tagline, and intro with cursor reveal grid effect
 */
export default function ProjectHero({ hero, color }: ProjectHeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-background border-b border-border overflow-hidden">
      {/* Background image if provided */}
      {hero.heroImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${hero.heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </>
      )}

      {/* Cursor reveal grid background */}
      <CursorRevealGrid />
      
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-32 md:py-40">

        <div className="max-w-5xl mx-auto">
          {/* Company Label */}
          <div className="mb-6 md:mb-8">
            <span className="text-sm md:text-base font-semibold tracking-[0.12em] uppercase" style={{ color }}>
              {hero.company}
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter-2 text-foreground mb-8 md:mb-10 leading-[0.95]">
            {hero.tagline}
          </h1>

          {/* Intro */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted leading-[1.6] font-light tracking-tight-1 max-w-4xl">
            {hero.intro}
          </p>

          {/* Project Meta */}
          {hero.meta && <ProjectMeta meta={hero.meta} color={color} />}
        </div>
      </div>
    </section>
  );
}

