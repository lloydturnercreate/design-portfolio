import { featuredCaseStudies } from '@/content/case-studies'
import { builtProjects } from '@/content/built'

export interface FlowItem {
  /** Displayed as the running index across the whole track. */
  index: string
  name: string
  /** The problem, not the vertical. */
  headline: string
  /**
   * What this was. The one thing that has to survive merging client work and
   * solo work into a single track — without it, a $100M production platform and
   * a night project read as equivalent, which costs more seniority signal than
   * the merge gains.
   */
  weight: string
  metric?: string
  year: string
  href?: string
  cover?: string
  color: string
}

/**
 * Cover art for the solo projects, keyed by name.
 *
 * Separate from built.ts because that file describes what the things *are*; this
 * is purely about what art exists yet. Add an entry as each cover is designed.
 *
 * **Currently unreachable**, and kept only because `builtProjects` is kept.
 * That array is empty as of 2026-08-15, so nothing looks anything up here — and
 * Warble, its one entry, is a case study now and carries its own `cover`. This
 * is the mechanism for a solo *row*, not for a study. A study with no art wants
 * a `cover` on the study itself; Phasmatic is the one that has none.
 */
const COVERS: Record<string, string | undefined> = {
  Warble: '/project-covers/warble.svg',
}

/**
 * Case studies and solo work as one continuous track.
 *
 * Previously two sections, which made the solo work read as a footnote to the
 * employed work — exactly backwards, since shipping alone is the differentiator
 * and the employed work is the credibility. One flow states the actual claim:
 * it is all the same practice. The weight line is what keeps the distinction
 * legible without a section break doing it.
 */
/*
 * One content model now — `projects.ts` was deleted once the last three studies
 * came across. The order of `featuredCaseStudies` is the order on the page.
 *
 * Featured, not all: Raptor and Sukiyaki keep their pages and stay off the
 * index. A reader takes the standard from the weakest thing on a list, so the
 * index is the one place where an extra entry actively costs something.
 */
const studies: FlowItem[] = featuredCaseStudies.map((study) => ({
  index: '',
  name: study.name,
  headline: study.claim,
  weight: study.role,
  year: study.period,
  href: `/${study.slug}`,
  cover: study.cover,
  color: study.color,
}))

export const flowItems: FlowItem[] = [
  ...studies.map((item, i) => ({ ...item, index: String(i + 1).padStart(2, '0') })),
  ...builtProjects.map((project, i) => ({
    index: String(studies.length + i + 1).padStart(2, '0'),
    name: project.name,
    headline: project.description,
    weight: 'Designed and built solo',
    metric: project.note,
    year: project.year,
    href: project.href,
    // A row with no art renders as an accent-tinted placeholder card (see
    // Projects.tsx). To swap one in: drop the artwork at
    // /project-covers/<name>.png and add it to COVERS above. Nothing else
    // changes — the card layout is identical either way, so a real cover lands
    // in exactly the space the placeholder was occupying. Nothing runs through
    // here at present; `builtProjects` is empty.
    cover: COVERS[project.name],
    color: project.color,
  })),
]
