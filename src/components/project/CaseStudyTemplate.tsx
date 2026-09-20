import Link from 'next/link'
import ClaimText from '@/components/project/ClaimText'
import Media from '@/components/project/Media'
import Parallax from '@/components/project/Parallax'
import Field from '@/components/field/Field'
import Footer from '@/components/Footer'
import ScrollLitText from '@/components/ScrollLitText'
import { CASE_STUDY_KEYFRAMES } from '@/lib/field/phases'
import {
  getCaseStudyBySlug,
  type Block,
  type CaseStudy,
  type Chapter,
  type Figure,
  type Frame,
  type LiveLink,
  type Outcome,
} from '@/content/case-studies'

/**
 * A case study, as chapters, on the same surface as the home page.
 *
 * The page it replaced was a well-set document that could have come from
 * anywhere: no field, no lighting, a left-aligned header. Following a home page
 * whose entire argument is "this is what I can build", that reads as the moment
 * the portfolio stops being the work and starts being a template.
 *
 * So the structure here is the home page's own, compressed:
 *
 * - **Centred, then left, then centred.** The home page opens on centred type,
 *   runs left-aligned rows through the middle, and closes centred. This does the
 *   same at a quarter of the length — a centred opening screen, left-aligned
 *   rows, and the same centred close, which is literally the same component.
 * - **The opening screen holds exactly one thing.** The claim, alone, at the
 *   hero's scale, assembling out of a scatter (`ClaimText`). Everything factual
 *   — name, period, role, scope, outcome — is in the band below it, built as a
 *   work-index row. That split is the whole fix: it was one centred stack ending
 *   in a three-column `dl`, which is the SaaS hero, and it put small grey text
 *   over the brightest part of the field. The field is tuned for display type
 *   sitting directly on it, so the screen it runs hottest on must carry nothing
 *   else.
 * - **The field is mounted here too**, on its own score (`CASE_STUDY_KEYFRAMES`)
 *   and shifted toward the project's accent. Present for the title, decayed
 *   before the first paragraph — the field is tuned for type sitting directly on
 *   it, and body copy is the one thing it cannot sit behind.
 * - **Chapter titles light through frame** with `ScrollLitText`, the same
 *   gesture as the About statement.
 *
 * What is deliberately NOT borrowed is `useFrameReveal`. It fades and drifts
 * rows at the edges of the viewport, which is right for a list being scanned and
 * wrong for prose being read — text that dims while you are still reading it is
 * a bug regardless of how it was intended.
 */

/**
 * The page's one horizontal measure.
 *
 * Prose, figures, the detail row and the lead all sit in this, so every left
 * edge on the page lines up. It is the single change that turned the figures
 * from interruptions into part of the layout — previously they escaped it and
 * ran to the viewport edge.
 */
const CONTAINER = 'mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-16'

/**
 * A figure with no artwork yet.
 *
 * It holds the real space at the real aspect rather than collapsing, so the
 * pacing of the page is designed now and the art lands in a hole that already
 * fits it. The dashed edge is the tell: at a glance this is unmistakably not a
 * finished image, which matters when the person reviewing the page is also the
 * person who has to supply the file.
 *
 * Tinted from the study's accent, the same trick the work index plays for the
 * projects with no cover art — a placeholder that carries the project's colour
 * reads as deliberate, and a grey box reads as broken.
 */
function Placeholder({ figure, color }: { figure: Figure; color: string }) {
  return (
    /*
      `border-muted-dark/40`, not `border-border`. The page's hairline is
      #1c1c1c, which is correct for a real edge on a near-black background and
      completely invisible as a dashed one — the first version of this rendered
      as an unexplained gap in the page.
    */
    <div
      className="flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-dashed border-muted-dark/40 px-8 py-10"
      style={{
        aspectRatio: figure.aspect ?? '16 / 9',
        background: `radial-gradient(120% 90% at 50% 110%, ${color}42 0%, ${color}1a 45%, transparent 75%)`,
      }}
    >
      <span className="font-mono text-xs tracking-wide text-muted-dark">Placeholder</span>
      <span className="max-w-[52ch] text-center text-sm leading-relaxed text-muted text-pretty">
        {figure.alt}
      </span>
    </div>
  )
}

/**
 * One figure: the picture, then its caption directly beneath it.
 *
 * Both sit in the same container now. When figures ran to the viewport edge the
 * caption had to be inset separately so it still lined up with the prose, which
 * meant two different width rules for one element.
 */
function FigureItem({
  figure,
  color,
  frame,
  tall,
}: {
  figure: Figure
  color: string
  frame: Frame
  tall: boolean
}) {
  return (
    <figure className="min-w-0 flex-1">
      {figure.src ? (
        <Media
          src={figure.src}
          alt={figure.alt}
          tall={tall}
          className="overflow-hidden rounded-xl"
        />
      ) : (
        <Placeholder figure={figure} color={color} />
      )}

      {/*
        An empty caption renders nothing at all, rather than an empty element
        with `mt-4` under the picture. The lead has always passed `caption: ''`
        — it is a hero, not evidence — and the Phasmatic examples now do too, on
        request. Captions stay required in the type so writing one remains the
        default and omitting one has to be spelled out.
      */}
      {figure.caption ? (
        <figcaption
          className={`mt-4 text-sm text-muted-dark text-pretty ${
            frame === 'column' ? 'max-w-[52ch]' : 'max-w-[64ch]'
          }`}
        >
          {figure.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/**
 * A figure block: one image, or two side by side.
 *
 * **Imagery is the spine of a case study, not an illustration of one.** The
 * version this replaced rendered every figure inside the prose container and
 * indented it `md:pl-28` so it lined up with the text, which made images
 * subordinate to paragraphs and was most of why the page read as a well-set
 * document.
 *
 * The fix for that was to run them edge to edge, and that overshot — at full
 * bleed the images stopped being part of the page. They sit in the same
 * container as everything else now, which is wide (`88rem`) but bounded, and
 * shares its margin with the prose grid so every left edge on the page lines up.
 */
function FigureRow({
  block,
  color,
}: {
  block: Extract<Block, { kind: 'figure' }>
  color: string
}) {
  const frame = block.frame ?? 'wide'
  const tall = block.tall ?? false

  return (
    <div
      /*
        The tint pads the block and puts a wash of the study's accent behind it
        — the one thing that stops a long run of dark product imagery reading as
        a single continuous picture. Deliberately rare: two in a row and it
        stops being punctuation.
      */
      className={`mt-16 lg:mt-24 ${block.tint ? 'py-14 lg:py-20' : ''}`}
      style={
        block.tint
          ? { background: `radial-gradient(120% 100% at 50% 0%, ${color}1f 0%, transparent 70%)` }
          : undefined
      }
    >
      <div className={CONTAINER}>
        {/* `column` sits in the prose column rather than at the full width. */}
        <div
          className={`flex min-w-0 flex-col gap-8 ${
            block.figures.length > 1 ? 'lg:flex-row' : ''
          } ${frame === 'column' ? 'lg:ml-[41.6667%] lg:w-[50%]' : ''}`}
        >
          {/*
            Keyed by position, not by caption. Captions are not unique and are
            not required to be — a scaffolded study has several figures reading
            `[Caption]`, and React silently drops all but one of them. The list
            is static per block, so the index is a stable key.
          */}
          {block.figures.map((figure, i) => (
            <FigureItem key={i} figure={figure} color={color} frame={frame} tall={tall} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * The chapter grid.
 *
 * Twelve columns at `lg`. Text lives in columns 6–11, which puts the measure a
 * third of the way across the page and leaves the left third for the chapter
 * number and title — the arrangement both of the references this was rebuilt
 * against use, and the reason their prose reads as considered rather than as a
 * paragraph filling the container.
 *
 * Every prose block instantiates this grid separately rather than sharing one
 * wrapper, because figure blocks in between have to escape it entirely.
 * Alignment holds because the definition is identical each time.
 */
/*
 * Split from `GRID` because a rule has to sit INSIDE the container's padding to
 * line up with the images. `border-t` on the container itself spans the full
 * 88rem including its padding, so it overhangs the content by the padding width
 * on both sides — which looks like a mistake and is one.
 */
const GRID_COLS = 'grid grid-cols-1 gap-x-10 lg:grid-cols-12'
const GRID = `${CONTAINER} ${GRID_COLS}`
const TEXT_COL = 'lg:col-span-6 lg:col-start-6'

function ProseRow({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={`${GRID} mt-14 lg:mt-20`}>
      <div className={`${TEXT_COL} space-y-6`}>
        {paragraphs.map((paragraph) => (
          /*
            The measure sits on the paragraph, never on a wrapper — `ch`
            resolves against the element's OWN font-size, so a measure on a
            container inherits the 16px base and collapses far narrower than
            intended. Same trap as the About statement.
          */
          <p
            key={paragraph.slice(0, 40)}
            className="max-w-[62ch] text-lg leading-relaxed text-muted text-pretty lg:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

/**
 * Outcomes sit inside the chapter that earned them rather than in a results
 * panel at the end. A number next to the decision that produced it reads as a
 * consequence; the same number in a grid at the bottom of the page reads as a
 * scoreboard.
 */
function OutcomeRow({ items }: { items: Outcome[] }) {
  return (
    <div className={`${GRID} mt-16 lg:mt-24`}>
      <dl className={`${TEXT_COL} flex flex-wrap gap-x-16 gap-y-8 border-t border-border pt-10`}>
        {items.map((outcome) => (
          <div key={outcome.label}>
            <dt className="sr-only">{outcome.label}</dt>
            <dd>
              <span className="block text-4xl font-medium tracking-tight text-foreground lg:text-5xl">
                {outcome.value}
              </span>
              <span className="mt-2 block max-w-[28ch] text-sm text-muted">{outcome.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * The blocks of a chapter, in order.
 *
 * Shared with the lite entry below, which is the same list without a chapter
 * head — one gesture, one implementation. The ordering is the point: a figure
 * between two paragraphs paces the read, and the same figure after all of them
 * is an appendix.
 */
function Blocks({ blocks, color }: { blocks: Block[]; color: string }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === 'prose') {
          return <ProseRow key={`p-${i}`} paragraphs={block.paragraphs} />
        }
        if (block.kind === 'outcomes') {
          return <OutcomeRow key={`o-${i}`} items={block.items} />
        }
        return <FigureRow key={`f-${i}`} block={block} color={color} />
      })}
    </>
  )
}

function ChapterBlock({
  chapter,
  index,
  color,
}: {
  chapter: Chapter
  index: number
  color: string
}) {
  return (
    <section className="pb-20 lg:pb-28">
      {/*
        The chapter divider is inset to the container rather than run across the
        viewport, so it starts and stops where the images and the prose do. It
        lives on the head's grid rather than on the section for that reason —
        the section is full width and a border on it would span the whole screen.

        The chapter head sits in the LEFT third, opposite the prose rather than
        above it. That is the arrangement that makes a long read look composed:
        the title stays as a landmark on the left while the argument runs down
        the right.
      */}
      <div className={CONTAINER}>
        <div className={`${GRID_COLS} border-t border-border pt-20 lg:pt-28`}>
          <div className="lg:col-span-4 lg:col-start-1">
            <span className="block font-mono text-xs tabular-nums text-muted-dark">
              {String(index + 1).padStart(2, '0')}
            </span>
            {/*
              `as="span"` because a paragraph inside a heading is invalid —
              headings take phrasing content only. The lighting is the same one
              the About statement uses.
            */}
            <h2 className="mt-5">
              <ScrollLitText
                as="span"
                text={chapter.title}
                className="text-3xl font-medium tracking-tight text-balance hyphens-none sm:text-4xl lg:text-[2.6vw] lg:leading-[1.1]"
              />
            </h2>
          </div>
        </div>
      </div>

      <Blocks blocks={chapter.blocks} color={color} />
    </section>
  )
}

/** The next study's display name, or null if the slug resolves to nothing. */
function nextLabel(slug: string): string | null {
  return getCaseStudyBySlug(slug)?.name ?? null
}

export default function CaseStudyTemplate({ study }: { study: CaseStudy }) {
  const next = nextLabel(study.next)

  /*
    A bare string is sugar for one prose block — the common case for a lite
    entry, and the shape Phasmatic and Warble are still written in. Normalising
    here rather than at the content layer keeps that convenience out of the data
    and means there is one rendering path regardless of which form was used.
  */
  const noteBlocks: Block[] | null = !study.note
    ? null
    : typeof study.note === 'string'
      ? [{ kind: 'prose', paragraphs: [study.note] }]
      : study.note

  /* Same sugar as `note` above: one link is the common case, a list the exception. */
  const liveLinks: LiveLink[] = !study.live
    ? []
    : Array.isArray(study.live)
      ? study.live
      : [study.live]

  return (
    <>
      <Field score={CASE_STUDY_KEYFRAMES} hueOffset={study.fieldHue ?? 0} />
      <div aria-hidden className="page-grain" />

      {/*
        `relative` with no z-index, the same as the home page. Stacking is DOM
        order: the field is positioned and comes first, this is positioned and
        comes second, so it paints on top. A z-index here would open a stacking
        context for no gain.
      */}
      <div className="relative">
        {/*
          Screen one: the claim, alone.

          This used to be a single centred stack — a status dot, the name, the
          claim, the outcome, and a three-column Role/Period/Owned grid under a
          hairline. That arrangement is the SaaS hero, and it put small grey text
          directly over the hottest part of the field, which is the one thing the
          home page never does: the hero puts ONE line of white display type on a
          live field and nothing else. Everything factual moved below, so this
          screen can hold the field at full strength.

          `min-h-[92svh]`: the claim owns the first screen, and the cover image
          below it starts showing at the fold — the same trick the hero's 90svh
          plays with the work index. The page never opens on a clean empty screen.
        */}
        {/*
          `overflow-hidden` is what makes the lead image appear to pass over the
          claim, and it does it without a single z-index.

          The claim is held nearly still against the scroll (`Parallax`), so as
          the page moves, this header's bottom edge rises up the viewport
          towards it — and that edge is exactly where the lead image begins,
          since they are adjacent in flow. Clipping there eats the title from
          the bottom up at precisely the rate the image climbs.

          The alternative — painting the image above the header with a z-index —
          works too, and costs a stacking context plus an explicit order for
          every sibling after it. This site has already lost one effect to a
          stacking context nobody knew was there (see the `mix-blend-difference`
          note in AGENTS.md), so the version with no ordering to get wrong wins.
        */}
        <header className="relative flex min-h-[92svh] flex-col overflow-hidden px-6 pt-8 pb-16 sm:px-10 lg:px-16">
          {/*
            A bar, not an orphan. `← Work` sat alone in the top-left corner with
            nothing balancing it, on a page whose every other screen is composed.
            The study's name is the counterweight — and it belongs up here rather
            than beside the claim, because the claim's screen is the one place on
            the page that should hold exactly one thing.
          */}
          <div className="flex items-baseline justify-between gap-6">
            <Link
              href="/#work"
              className="link-reveal text-sm text-muted transition-colors hover:text-foreground"
            >
              ← Work
            </Link>
            <span className="text-sm text-muted-dark">{study.name}</span>
          </div>

          <Parallax className="flex flex-1 items-center justify-center">
            <h1 className="w-full py-16 text-center">
              {/*
                Sized in `vw` like the hero rather than in `text-6xl` steps, so
                the opening screen scales with the viewport the way the home
                page's does instead of stepping between three fixed sizes.
              */}
              <ClaimText
                text={study.claim}
                className="mx-auto block max-w-[16ch] text-[8vw] font-medium leading-[1.04] tracking-[-0.035em] text-foreground text-balance hyphens-none sm:text-[6vw] lg:text-[4.25vw]"
              />
            </h1>
          </Parallax>
        </header>

        {/*
          The lead, immediately under the claim. This is the page's first real
          block and it sets the terms for everything below — including the
          measure, since it sits in the same container as the prose and every
          figure after it.

          `study.lead`, never `study.cover` — the covers are card art with an
          empty half, and running one at this width puts the subject in a
          corner. See the note on `lead` in the content model.

          At natural aspect rather than cropped, because none of the current art
          is large enough to survive the magnification a viewport-height crop
          forces. `priority` because this is the page's LCP candidate at almost
          every screen size.
        */}
        {/*
          `narrow` caps the width for square and portrait art. The lead slot is
          the full container, which is correct for a 16:9 screenshot and wrong
          for a phone mockup — at 1280px across, Raptor's 1400×1310 video would
          stand 1200px tall and be mostly background. `max-w-4xl` puts the phone
          inside it at roughly the size a phone actually is.
        */}
        {study.lead && (
          <div className={CONTAINER}>
            <div className={study.lead.narrow ? 'mx-auto max-w-4xl' : ''}>
              {study.lead.src ? (
                <Media
                  src={study.lead.src}
                  alt={study.lead.alt}
                  tall={study.lead.tall}
                  priority
                  className="overflow-hidden rounded-xl"
                />
              ) : (
                /*
                  No hero art yet. The placeholder holds the full slot at the
                  stated aspect and renders its own brief, so the page opens with
                  the same shape it will have once the picture exists — and says
                  out loud what is missing rather than quietly closing the gap.
                */
                <Placeholder
                  figure={{ ...study.lead, caption: '' }}
                  color={study.color}
                />
              )}
            </div>
          </div>
        )}

        {/*
          The detail row: everything factual, in four columns with vertical
          rules between them.

          It replaces a centred three-column `dl` under a hairline, which is the
          arrangement every SaaS hero uses. Labels above, values below, rules
          top and bottom, dividers between — the reader can find any one fact
          without reading the others, which is the entire job of this block.
        */}
        {/*
          The rules are inset to the container rather than run edge to edge, so
          they start and stop exactly where the images do. A full-width rule
          under a contained image reads as two different grids.
        */}
        <section aria-label="Project details" className={`${CONTAINER} mt-16 lg:mt-24`}>
          <dl className="grid grid-cols-2 border-y border-border lg:grid-cols-4">
            {(() => {
              const items = [
                { label: 'Role', value: study.role },
                { label: 'Period', value: study.period, mono: true },
                { label: 'Owned', value: study.scope },
                { label: 'Outcome', value: study.outcome },
              ].filter((item) => item.value)

              /*
                The last cell absorbs whatever columns are left over.

                The grid is a fixed four across, and `outcome` is optional — so
                a study without one used to leave a quarter of the row empty
                while `Owned`, much the longest value of the four, wrapped to
                five lines in a narrow column beside the gap. MoonPay is the
                case. Widening the whole grid instead (three columns for three
                items) is worse: it gives `Period` a third of the row to hold
                four characters.

                Keyed by count rather than computed, because Tailwind scans for
                complete class strings — `lg:col-span-${n}` compiles to nothing.
                Each entry is what the LAST cell spans: at the two-column
                breakpoint it only needs widening when an odd count leaves it
                alone on its final row, and `col-span-2` carries up to `lg`
                unless a `lg:` span overrides it.
              */
              const LAST_SPAN: Record<number, string> = {
                1: 'col-span-2 lg:col-span-4',
                2: 'lg:col-span-3',
                3: 'col-span-2',
                4: '',
              }

              return items.map((item, i) => (
                /*
                  `border-l` on every cell except the first in its row, rather
                  than `divide-x`: the grid wraps to two columns below `lg`, and
                  `divide-x` would leave a rule hanging on the left edge of the
                  second row. The `nth` rules below rebuild it per breakpoint.
                */
                <div
                  key={item.label}
                  className={`border-border py-8 pr-6 lg:py-10 ${
                    i % 2 === 1 ? 'border-l pl-6' : ''
                  } lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0 ${
                    i === items.length - 1 ? LAST_SPAN[items.length] : ''
                  }`}
                >
                  <dt className="font-mono text-xs tracking-wide text-muted-dark">{item.label}</dt>
                  <dd
                    className={`mt-3 text-sm text-foreground text-pretty ${
                      item.mono ? 'font-mono tabular-nums' : ''
                    }`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))
            })()}
          </dl>

        </section>

        <main>
          {/*
            A lite entry: one untitled chapter — no number, no title, no rule
            above it. Numbering a single paragraph "01" is a table of contents
            for one item, and a heading over it says the same thing the claim two
            screens up already said.

            It runs through the same `Blocks` a chapter does, so a lite entry can
            carry figures in among its prose. Raptor and Sukiyaki do: they were
            cut to two paragraphs each and kept every picture, which is the whole
            reason this takes blocks rather than a string. Prose lands in the
            same column at the same size as `ProseRow` — a lite paragraph was
            always styled identically to a chapter's, so nothing about the two
            existing entries changed when they moved onto this path.

            `pt-2` rather than `pt-16`, because the first block brings its own
            `mt-14 lg:mt-20`. The two sum to the padding this block used to set
            on its own, so Phasmatic and Warble sit exactly where they did.
          */}
          {noteBlocks && (
            <div className="pt-2 pb-4 lg:pt-4">
              <Blocks blocks={noteBlocks} color={study.color} />
            </div>
          )}

          {study.chapters?.map((chapter, i) => (
            <ChapterBlock key={chapter.title} chapter={chapter} index={i} color={study.color} />
          ))}

          {/*
            The link to the running thing, after the writing rather than in the
            detail row above it. On a lite entry the paragraph exists to earn
            this click, so it has to come second — an invitation before the
            explanation is a button, and this is the point of the page.

            Set at reading scale rather than as small print, and sitting in the
            prose column so it reads as the last line of the argument.

            Internal targets get a `Link` and no new tab; external ones open
            away. Nothing sets an internal one today, but the rule is about
            same-origin rather than about any one study.

            `live` normalises to a list. One link renders as it always did; two
            sit on a row and wrap on a phone.
          */}
          {/*
            The bottom padding matters as much as the top. `ChapterBlock` closes
            with `pb-20 lg:pb-28`, so a chaptered study always clears the *Next*
            rule below it — a lite study ends here instead, and without a
            matching bottom the rule landed directly on this link's baseline.
            Same values, so both endings sit on the same rhythm.
          */}
          {liveLinks.length > 0 && (
            <div className={`${GRID} pt-10 pb-20 lg:pt-12 lg:pb-28`}>
              <div className={`${TEXT_COL} flex flex-wrap gap-x-10 gap-y-3`}>
                {liveLinks.map((link) =>
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="link-reveal text-lg text-foreground transition-colors hover:text-foreground"
                    >
                      {link.label} →
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-reveal text-lg text-foreground transition-colors hover:text-foreground"
                    >
                      {link.label} ↗
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </main>

        {/*
          Never dead-end a case study. Someone who read to the bottom is the most
          engaged reader the site gets, and the alternative to a next link is the
          back button.

          **It must not compete with the close directly below it**, and it did.
          It was an eyebrow stacked over centred white display type at `5vw` —
          which is the footer address's exact structure, one screen earlier and
          *larger* than it, since the address is `4.2vw`. Two near-identical
          blocks in a row, and the louder one was the navigation rather than the
          call to action it was supposed to be running up to.

          Both halves of that are fixed here. The size drops below the chapter
          titles, so nothing at the foot of the page outranks the address; and
          the eyebrow moves inline, which is what actually breaks the twinning —
          a label beside a name is a different object from a label above a
          headline, at any size.

          Muted rather than white, resolving on hover, the same treatment as
          `← Work` at the top of the page. That gives the study a rule worth
          keeping: navigation is grey and content is white, so a link can be
          obvious without shouting over the thing it sits next to.
        */}
        {next && (
          <nav className={CONTAINER}>
            {/* Rule inside the padding, like every other rule on the page. */}
            <div className="border-t border-border py-16 text-center lg:py-24">
              <Link
                href={`/${study.next}`}
                className="link-reveal inline-flex max-w-full items-baseline gap-x-4 text-muted transition-colors hover:text-foreground"
              >
                <span className="font-mono text-xs text-muted-dark">Next</span>
                <span className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2vw]">
                  {next}
                </span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </nav>
        )}

        <Footer />
      </div>
    </>
  )
}
