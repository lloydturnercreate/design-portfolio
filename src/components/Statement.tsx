'use client'

import { useEffect, useRef } from 'react'
import { site } from '@/content/site'
import { buildWords, scatter, smoothstep, springStep } from '@/lib/scatter'

/**
 * The hero.
 *
 * Two independent mechanisms share the same line of type, and the separation is
 * the whole reason this stays simple:
 *
 * - **Typing owns WHICH characters exist.** Time-driven. Each statement is typed
 *   out, held, deleted, and the next begins.
 * - **Scrolling owns WHERE each character sits.** Scroll-driven. Every character
 *   leaves at its own rate, so the line comes apart as the page moves rather
 *   than sliding away as a block.
 *
 * Neither knows about the other. The typing loop appends and removes character
 * elements; the scroll loop poses whatever elements it finds. A character
 * created mid-scroll is posed at birth, so it never appears at rest for a frame
 * and then jump to position.
 *
 * Nothing animated touches React state — both loops write to the DOM directly.
 */

/**
 * The three beats: identity, claim, credibility.
 *
 * No employer in the identity slot, and "ship" is doing the heavy lifting in the
 * claim — it is the single word separating him from designers who hand off
 * files. Copy rationale lives in `rebirth/portfolio/PORTFOLIO_PLAN.md`; it is
 * deliberate, so change it there first.
 */
const PHRASES = [site.hero.name, site.hero.claim, site.hero.credibility]

/**
 * Milliseconds per character. Deleting is deliberately much faster than typing —
 * a backspace that takes as long as the typing reads as a stall, and the
 * deletion is dead time in which nothing is being communicated.
 */
const TYPE_MS = 55
const DELETE_MS = 22

/** How long a completed statement is held. Long enough to read the longest one. */
const HOLD_MS = 2200

/** Beat of empty line between statements, so the change of subject registers. */
const EMPTY_MS = 400

/** Caret blink, while idle. */
const BLINK_MS = 540

/**
 * Scroll distance over which the line comes apart, in viewports. Under 1 so the
 * type has finished leaving before the hero itself is off screen — characters
 * still arriving as the next section appears reads as lag, not intent.
 */
const EXIT_VIEWPORTS = 0.8

/**
 * How far a character at rate 1.0 travels by the end of the exit, in viewports.
 *
 * This is travel ON TOP OF the page's own scrolling, so the two compound: much
 * above ~0.5 and the letters clear the screen almost immediately, before the
 * effect has had a chance to read.
 */
const EXIT_RISE = 0.42

/**
 * How much the per-character rates vary, as a fraction either side of 1.0. This
 * is the effect: at 0 every character leaves together and it is just a block
 * sliding up. Push it past ~0.7 and the fastest characters are gone before the
 * slowest have started, which reads as a glitch rather than as one line coming
 * apart.
 */
const RATE_SPREAD = 0.38

/** Degrees of tilt at full exit. Signed per character, so the line frays. */
const EXIT_TILT = 5

/**
 * Fraction of a character's travel over which it fades out completely. Well
 * under 1: the type should be gone as a reading surface early, and what keeps
 * moving afterwards is just the tail of the motion. Fading in step with the
 * travel instead leaves half-legible ghosts sitting over the next section.
 */
const EXIT_FADE = 0.21

/**
 * The follow spring.
 *
 * Position is deliberately NOT read straight off `scrollY`. Tied 1:1 the letters
 * stop dead the instant the wheel does, which is what makes a scroll-driven
 * effect feel welded to the input device rather than to the page. Springing a
 * single value toward the scroll position gives the whole line weight: it lags
 * slightly while scrolling, and keeps sliding for a beat after the scroll stops.
 *
 * Damping is just under critical (critical for this stiffness is ~13), so it
 * overshoots a little and settles rather than easing in. One damped value drives
 * every character, which is why they read as one line coming apart rather than
 * as forty independent animations.
 */
const EXIT_STIFFNESS = 42
const EXIT_DAMPING = 9.5

type Mode = 'typing' | 'holding' | 'deleting' | 'empty'

/** Contact is identified by its target, not by its label, so renaming it is safe. */
const CONTACT_HREF = '#contact'

/**
 * Header order: sections, then the external accounts, then Contact.
 *
 * Contact goes last because it is the only item that is an action rather than a
 * destination — it belongs at the end of the row for the same reason it belongs
 * at the bottom of the page. Derived from `site.nav` and `site.social` rather
 * than written out, so adding a section or a second account needs no change
 * here and the ordering rule survives it.
 */
const HEADER_LINKS: Array<{ label: string; href: string; external: boolean }> = [
  ...site.nav.filter((item) => item.href !== CONTACT_HREF).map((item) => ({ ...item, external: false })),
  ...site.social.map((item) => ({ ...item, external: true })),
  ...site.nav.filter((item) => item.href === CONTACT_HREF).map((item) => ({ ...item, external: false })),
]

/**
 * Shared by the live line and by every invisible sizer behind it. It has to be
 * one string: if the sizers and the line ever disagree on type size, the
 * reserved height stops matching the rendered height and the hero jumps a line
 * mid-type — which is exactly the bug the sizers exist to prevent.
 */
/**
 * Shared by the live line and by every invisible sizer behind it. It has to be
 * one string: if the sizers and the line ever disagree on type size, the
 * reserved height stops matching the rendered height and the hero jumps a line
 * mid-type — which is exactly the bug the sizers exist to prevent.
 *
 * `[white-space-collapse:preserve]` rather than `whitespace-pre-wrap`, which is
 * what this used to be. `white-space` is a SHORTHAND that also sets `text-wrap`,
 * so the pre-wrap utility silently overwrites `text-balance` and the lines stop
 * balancing. The longhand preserves the trailing space a half-typed string ends
 * on — without it that space collapses at the line end and the caret hops back a
 * space-width on alternate ticks — while leaving `text-wrap` free to balance.
 */
const TYPE =
  'text-[4.25vw] font-medium leading-[1.06] tracking-[-0.035em] [white-space-collapse:preserve] text-balance hyphens-none'

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const line = lineRef.current
    const caret = caretRef.current
    if (!line || !caret) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Reduced motion gets the claim, statically. Not the name: if the sequence
    // is not going to run, the one statement worth showing is the one that says
    // what he does.
    if (reduced) {
      line.textContent = site.hero.claim
      caret.style.display = 'none'
      return
    }

    // ---- Scroll: where each character sits -------------------------------

    let exit = 0
    let velocity = 0
    let target = 0

    /**
     * `rate` is why the line comes apart. Each character consumes the exit at
     * its own speed, so it finishes leaving at its own moment — fast characters
     * are gone while slow ones are still on their way.
     */
    const poseChar = (el: HTMLElement, index: number) => {
      const rate = 1 + (scatter(index, 0) * 2 - 1) * RATE_SPREAD
      const tilt = (scatter(index, 1) * 2 - 1) * EXIT_TILT
      const progress = Math.min(1, Math.max(0, exit * rate))

      const y = -progress * EXIT_RISE * window.innerHeight
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${(tilt * progress).toFixed(2)}deg)`
      el.style.opacity = `${(1 - smoothstep(progress / EXIT_FADE)).toFixed(3)}`
    }

    const pose = () => {
      // Queried rather than read off `line.children`, because characters are
      // nested inside per-word wrappers now — see `render`.
      const chars = line.querySelectorAll<HTMLElement>('[data-char]')
      for (let i = 0; i < chars.length; i++) poseChar(chars[i], i)
      poseChar(caret, chars.length)
    }

    const readScroll = () => {
      const distance = window.innerHeight * EXIT_VIEWPORTS
      target = distance <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / distance))
    }

    let raf = 0
    let running = false
    let last = 0

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)

      const delta = Math.min((now - last) / 1000, 1 / 30)
      last = now

      ;[exit, velocity] = springStep(exit, velocity, target, EXIT_STIFFNESS, EXIT_DAMPING, delta)
      exit = Math.max(0, exit)

      pose()
    }

    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)

    /**
     * The loop only runs while the hero is on screen. It is a spring, so it
     * cannot simply stop when scrolling stops — it has to keep integrating until
     * it settles — but there is no reason to keep integrating a line that is
     * three sections above the viewport.
     */
    const observer = new IntersectionObserver(([record]) => {
      if (record.isIntersecting && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!record.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    if (sectionRef.current) observer.observe(sectionRef.current)

    // Settle synchronously at the current scroll position, and pose once before
    // the first frame. A page restored mid-scroll — a reload, or a back
    // navigation — would otherwise start at the top and spring downward into
    // place, animating something the visitor never scrolled through. Browsers
    // also do not run rAF in background tabs, so without this a page opened in
    // one paints the line at rest until it is focused.
    readScroll()
    exit = target
    pose()

    // ---- Typing: which characters exist ----------------------------------

    let phrase = 0
    let count = 0
    let mode: Mode = 'typing'
    let visible = true
    let timer = 0

    /**
     * Rebuilt from scratch each tick rather than appended to.
     *
     * It looks wasteful and is not: at most forty spans, at most eighteen times
     * a second, and `poseChar` is a pure function of index — no element carries
     * state worth preserving, so there is nothing lost by recreating them. The
     * incremental version needed bookkeeping to keep word grouping correct as
     * characters were added and removed, which was more code and one more thing
     * to get wrong.
     *
     * The word grouping that `buildWords` does is load-bearing rather than
     * tidiness — see the note on it in `lib/scatter.ts`. Characters are posed as
     * they are created, so one typed while the page is scrolled never flashes at
     * rest for a frame before jumping into position.
     */
    const render = (text: string) => {
      const index = buildWords(line, text.slice(0, count), poseChar)
      poseChar(caret, index)
    }

    const paintCaret = () => {
      const steady = mode === 'typing' || mode === 'deleting'
      // Multiplied into whatever the scroll pose has already set, so the caret
      // still fades out with the line rather than blinking its way back in.
      caret.style.visibility = steady || visible ? 'visible' : 'hidden'
    }

    const blink = window.setInterval(() => {
      visible = !visible
      paintCaret()
    }, BLINK_MS)

    const tick = () => {
      const text = PHRASES[phrase]

      switch (mode) {
        case 'typing':
          count += 1
          render(text)
          if (count >= text.length) {
            mode = 'holding'
            timer = window.setTimeout(tick, HOLD_MS)
          } else {
            timer = window.setTimeout(tick, TYPE_MS)
          }
          break

        case 'holding':
          mode = 'deleting'
          timer = window.setTimeout(tick, DELETE_MS)
          break

        case 'deleting':
          count -= 1
          render(text)
          if (count <= 0) {
            mode = 'empty'
            timer = window.setTimeout(tick, EMPTY_MS)
          } else {
            timer = window.setTimeout(tick, DELETE_MS)
          }
          break

        case 'empty':
          phrase = (phrase + 1) % PHRASES.length
          mode = 'typing'
          timer = window.setTimeout(tick, TYPE_MS)
          break
      }

      // Solid while the line is moving, blinking only while it is idle — the
      // caret should never look like it is thinking mid-word.
      visible = true
      paintCaret()
    }

    timer = window.setTimeout(tick, EMPTY_MS)

    return () => {
      window.clearTimeout(timer)
      window.clearInterval(blink)
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [])

  /*
   * The hero sits ON the field, not knocked out of it. It used to carry
   * mix-blend-difference so the type inverted against whatever the shader was
   * doing underneath; that was removed deliberately. If it ever comes back it
   * belongs here on the section and nowhere deeper — mix-blend-mode only blends
   * within the nearest ancestor that opens a stacking context, so anything
   * pinned, transformed or z-indexed between the type and the field silently
   * kills it.
   */
  return (
    /*
      90svh, not a full screen. The hero deliberately does not fill the viewport:
      it leaves the top of the work list showing below the fold, so the first
      rows begin filtering in at roughly the moment the statement finishes
      scattering out. A full-height hero put a clean empty screen between the two
      and gave no indication there was a page underneath at all.
    */
    <section id="identity" ref={sectionRef} className="relative h-[90svh]">
      {/*
        One centred row, not three columns. Everything in the header is
        navigation — the external accounts as much as the sections — so it is one
        `nav` landmark rather than a nav plus a loose list beside it.
      */}
      <header className="absolute inset-x-0 top-0 flex justify-center p-6 sm:p-10 lg:p-16">
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {HEADER_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/*
        Full height with the header floating over it, so the statement is centred
        on the viewport rather than on the space left under the header.
      */}
      <h1 className="flex h-full items-center justify-center px-6 text-center sm:px-10 lg:px-16">
        {/*
          Every statement sits in the same grid cell, so the block reserves the
          height of the tallest one and the page never reflows mid-type. Without
          this the whole hero jumps a line the moment the claim wraps.
        */}
        <span className="grid items-center">
          {PHRASES.map((text) => (
            <span key={text} aria-hidden className={`invisible [grid-area:1/1] ${TYPE}`}>
              {text}
            </span>
          ))}

          <span aria-hidden className={`[grid-area:1/1] text-white ${TYPE}`}>
            <span ref={lineRef} />
            {/*
              Nudged with `vertical-align`, not a translate: the scroll pose
              writes `transform` on this element every frame, so a Tailwind
              translate utility here would be silently overwritten.
            */}
            <span
              ref={caretRef}
              className="ml-[0.04em] inline-block h-[0.72em] w-[0.05em] bg-current align-[-0.06em]"
            />
          </span>
        </span>

        {/*
          The typing is decorative churn. A screen reader gets the three
          statements once, as text, rather than a character at a time.
        */}
        <span className="sr-only">
          {site.hero.name}. {site.hero.claim} {site.hero.credibility}
        </span>
      </h1>
    </section>
  )
}
