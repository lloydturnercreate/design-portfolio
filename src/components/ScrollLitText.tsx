'use client'

import { useEffect, useRef } from 'react'

/**
 * Text that lights up as it passes through the frame.
 *
 * The paragraph sits dim by default and brightens character by character on a
 * soft moving front, so reading it and scrolling it are the same gesture. It is
 * deliberately the only thing on the page that does NOT arrive with the scale
 * and fade every other block uses — this is the one piece of prose on the site,
 * and it should feel read rather than delivered.
 *
 * Two decisions that keep it from looking cheap:
 *
 * - **The front is soft and measured in characters, not words.** Lighting whole
 *   words snaps in chunks, which reads as a loading state. A gradient spanning
 *   `SOFT` characters crosses word boundaries, so the wipe is continuous even
 *   though the units under it are discrete.
 * - **The span scales with the block's own height.** A fixed scroll distance
 *   means a two-line paragraph finishes instantly and a six-line one never
 *   finishes at all.
 */

/** Characters the lighting gradient spans. Lower is sharper and more mechanical. */
const SOFT = 18

/** Endpoints of the wipe. Matches --muted-dark and --foreground in globals.css. */
const DIM = [106, 106, 106]
const LIT = [244, 244, 244]

/**
 * Where the wipe starts and ends, as fractions of viewport height measured
 * against the top of the block. Starting below the middle means the sentence is
 * already lighting as it arrives rather than sitting dim in the centre of the
 * screen waiting to be scrolled at.
 */
const ENTER = 0.82
const SETTLE = 0.3

interface Props {
  text: string
  className?: string
  /**
   * The element the split text renders into. `span` exists for headings: a
   * `<p>` inside an `<h2>` is invalid — headings take phrasing content only —
   * and the case-study chapter titles wrap this in one.
   */
  as?: 'p' | 'span'
}

export default function ScrollLitText({ text, className, as = 'p' }: Props) {
  const blockRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const block = blockRef.current
    if (!block) return

    const chars = Array.from(block.querySelectorAll<HTMLElement>('[data-lit]'))
    if (chars.length === 0) return

    const paint = (lit: number) => {
      const r = Math.round(DIM[0] + (LIT[0] - DIM[0]) * lit)
      const g = Math.round(DIM[1] + (LIT[1] - DIM[1]) * lit)
      const b = Math.round(DIM[2] + (LIT[2] - DIM[2]) * lit)
      return `rgb(${r}, ${g}, ${b})`
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const full = paint(1)
      for (const char of chars) char.style.color = full
      return
    }

    let raf = 0
    let running = false
    let posedAt = Number.NaN

    const pose = () => {
      /*
       * A client rect is safe here, unlike in `lib/reveal.ts`. That loop writes
       * a transform every frame, so measuring with a rect fed its own output
       * back in; this one only ever writes `color`, which does not move
       * anything. Reading the live rect also means it stays correct if an
       * ancestor's layout shifts.
       */
      const rect = block.getBoundingClientRect()
      const viewport = window.innerHeight

      // Scaled by the block's own height so a long paragraph takes proportionally
      // longer to light than a short one.
      const span = viewport * (ENTER - SETTLE) + rect.height
      const positional = span <= 0 ? 1 : (viewport * ENTER - rect.top) / span

      /*
       * Anything anchored to the bottom of the document can never be scrolled
       * past, so its positional progress tops out far short of 1 and the wipe
       * never finishes — the footer wordmark simply sat grey forever.
       *
       * So blend in a second progress derived from how much scroll is left.
       * Whichever is further along wins, which leaves mid-page blocks untouched
       * (they complete positionally long before the document runs out) and lets
       * anything in the last stretch resolve as the visitor arrives at the end.
       */
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + viewport)
      const tail = 1 - Math.min(1, Math.max(0, remaining / (viewport * 0.6)))

      const progress = Math.max(positional, tail)

      // The front runs past the end by SOFT characters so the last character
      // reaches full brightness rather than stopping part-lit.
      const front = progress * (chars.length + SOFT)

      for (let i = 0; i < chars.length; i++) {
        const lit = Math.min(1, Math.max(0, (front - i) / SOFT))
        chars[i].style.color = paint(lit)
      }
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (window.scrollY === posedAt) return
      posedAt = window.scrollY
      pose()
    }

    const observer = new IntersectionObserver(
      ([record]) => {
        if (record.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(frame)
        } else if (!record.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '20% 0px' }
    )

    observer.observe(block)

    const onResize = () => {
      posedAt = Number.NaN
      pose()
    }
    window.addEventListener('resize', onResize)

    // Posed once synchronously, so a page restored mid-scroll does not paint a
    // fully dim paragraph for a frame before the first rAF lands.
    pose()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [text])

  const words = text.split(' ')

  // `span` needs `block` to keep the line-box behaviour the paragraph had —
  // without it the measure, balancing and leading all resolve against an inline
  // box and the type sets differently from every other use of this component.
  const Block = as
  const blockClass = as === 'span' ? `block ${className ?? ''}` : className

  return (
    <>
      {/*
        The split version is decorative. A screen reader gets one clean string
        rather than a paragraph of single-character elements.
      */}
      <span className="sr-only">{text}</span>

      {/*
        No global character index is threaded through here on purpose. The effect
        reads its characters with `querySelectorAll`, which returns them in
        document order — so the flat ordering the wipe needs already exists, and
        keeping a running counter across the JSX would only be a second source of
        truth for it.
      */}
      <Block
        ref={blockRef}
        aria-hidden
        className={blockClass}
        style={{ color: `rgb(${DIM.join(', ')})` }}
      >
        {words.map((word, w) => (
          <span key={`${word}-${w}`}>
            {/*
              Words are inline-block so they never break mid-word, but the spaces
              BETWEEN them are ordinary text nodes in the paragraph, not
              inline-blocks — a space that is itself an inline-block collapses to
              nothing and runs the sentence together.
            */}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((character, c) => (
                <span key={c} data-lit>
                  {character}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </Block>
    </>
  )
}
