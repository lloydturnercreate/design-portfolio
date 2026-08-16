'use client'

import { useRef } from 'react'
import { site } from '@/content/site'
import { roles } from '@/content/experience'
import { useFrameReveal } from '@/lib/reveal'
import ScrollLitText from '@/components/ScrollLitText'

/**
 * About, as a statement followed by a loose CV.
 *
 * Two blocks: who, then where. The document itself lives in the close, not here
 * — see the note at the foot of this file. The experience list is the
 * work index at a lighter weight — same aligned rows, same reveal, same
 * dim-the-rest — because a second unrelated layout here would be the third
 * language on one page.
 *
 * The differences from the work list are deliberate, so the two are siblings
 * rather than twins: dates lead instead of an index, the type is smaller, the
 * rows are denser, and nothing is revealed on hover. Work is the thing worth
 * looking at; this is the thing worth checking.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  useFrameReveal(sectionRef, '[data-reveal]')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-16 border-t border-border px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <h2 className="sr-only">{site.about.heading}</h2>

      {/*
        No `data-reveal` here, deliberately. This is the only block on the page
        that does not arrive with the scale-and-fade every other one uses — it
        lights instead, character by character, as it passes through frame. It is
        the single piece of prose on the site and it should feel read rather than
        delivered.

        The measure lives on the <p>, NOT on a wrapper — `ch` resolves against
        the element's own font-size, so a wrapper div inherits the 16px base and
        `max-w-[32ch]` collapses to about 190px regardless of how large the type
        inside it is. On the text element itself, one value holds the same
        character count at every breakpoint, which is the entire reason to use
        `ch` over a fixed width in the first place.
      */}
      <ScrollLitText
        text={site.about.paragraphs[0]}
        className="max-w-[32ch] text-[7vw] font-medium leading-[1.06] tracking-[-0.035em] text-balance hyphens-none sm:text-[4vw] lg:text-[2.6vw]"
      />

      <div data-reveal className="mt-8 will-change-[transform,opacity]">
        <p className="max-w-[58ch] text-base leading-relaxed text-muted text-pretty sm:text-lg">
          {site.about.paragraphs[1]}
        </p>
      </div>

      <ul className="group/list mt-20 border-t border-border lg:mt-28">
        {roles.map((role) => (
          <li
            key={`${role.company}-${role.period}`}
            data-reveal
            className="will-change-[transform,opacity]"
          >
            {/*
              `opacity-100!` — suffix, not prefix. Tailwind 4 moved the important
              modifier to the end of the utility; the v3 spelling compiles to
              nothing at all, which leaves the hovered row dimmed along with
              everything else and makes the effect look broken rather than absent.
            */}
            <div className="flex flex-col gap-2 border-b border-border py-6 transition-opacity duration-300 group-hover/list:opacity-35 hover:opacity-100! md:flex-row md:items-baseline md:gap-10 md:py-7">
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-dark md:w-32">
                {role.period}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xl font-medium tracking-tight text-foreground lg:text-2xl">
                  {role.company}
                </span>
                <span className="mt-1 block max-w-[62ch] text-sm leading-snug text-muted text-pretty">
                  {role.summary}
                </span>
              </span>

              <span className="shrink-0 text-xs text-muted-dark md:text-right">
                {role.title}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/*
        No CV link here. It used to sit under this list — the natural place for
        it, since a recruiter reading the experience is the person who wants the
        document — but the close carries one a screen below, and the two landed
        within sight of each other. One copy, in the footer.
      */}
    </section>
  )
}
