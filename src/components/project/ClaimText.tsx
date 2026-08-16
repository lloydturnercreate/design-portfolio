'use client'

import { useEffect, useRef } from 'react'
import { buildWords, scatter, smoothstep, springStep } from '@/lib/scatter'

/**
 * A case study's claim — the one line of display type on its opening screen.
 *
 * It is the hero's gesture in both directions. Characters begin displaced,
 * tilted and transparent, and **settle into place** as the page opens; scrolling
 * takes them apart again and lifts them out. Same `scatter()`, same damped
 * spring, one new direction — which is the point: type comes apart as you scroll
 * away from the work index, and comes together as the study you clicked opens.
 *
 * Two springs rather than one signed value, deliberately. Entry rises from
 * below, exit lifts upward, so the type always travels the same way through its
 * life; a single value crossing zero would have to reverse direction at the
 * settle and would read as a bounce. They are independent, and they do not fight
 * because entry has settled long before there is any scroll to speak of.
 *
 * Nothing here touches React state — the loop writes transforms directly.
 */

/** Viewports of travel for a character at rate 1.0. */
const ENTRY_RISE = 0.11
const EXIT_RISE = 0.34

/** Degrees of tilt at full displacement. Signed per character, so the line frays. */
const ENTRY_TILT = 8
const EXIT_TILT = 5

/**
 * How much the per-character rates vary, either side of 1.0.
 *
 * Entry runs wider than the hero's exit: assembling is the gesture being *read*
 * here, where the hero's scatter is something glimpsed on the way past. Below
 * about 0.3 the line settles as a block and the effect disappears entirely.
 */
const ENTRY_SPREAD = 0.5
const EXIT_SPREAD = 0.38

/**
 * Fraction of travel over which a character fades.
 *
 * `EXIT_FADE` is the knob for how long the claim stays legible on the way out.
 * It ran at 0.8 briefly, to keep the type readable until the lead image had
 * climbed over it — that was reverted as too slow. **If the claim now vanishes
 * before the image reaches it, raise this rather than `EXIT_VIEWPORTS`**: this
 * one changes how long it stays visible, that one changes how far you have to
 * scroll for the whole gesture, and it was the second that felt sluggish.
 */
const ENTRY_FADE = 0.55
const EXIT_FADE = 0.21

/**
 * Entry is softer and looser than exit — critical damping for this stiffness is
 * ~9.4, so at 5.6 it overshoots properly and settles back. That overshoot is the
 * whole difference between type arriving and type being placed.
 */
const ENTRY_STIFFNESS = 22
const ENTRY_DAMPING = 5.6

const EXIT_STIFFNESS = 42
const EXIT_DAMPING = 9.5

/**
 * Scroll distance over which the line comes apart, in viewports.
 *
 * Under 1, so the gesture is finished inside the first screen. It was stretched
 * to 1.5 to give the lead image time to climb over the claim, and that read as
 * sluggish — the type hung around long after the reader had moved on. Back at
 * 0.75 the exit is brisk and the parallax still does its job, because the hold
 * is `Parallax`'s to do, not this constant's.
 */
const EXIT_VIEWPORTS = 0.75

export default function ClaimText({ text, className }: { text: string; className?: string }) {
  const lineRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Static, in place, no springs. The claim is content — it has to be readable
    // whether or not the gesture runs.
    if (reduced) {
      buildWords(line, text)
      return
    }

    let entry = 1
    let entryVelocity = 0

    let exit = 0
    let exitVelocity = 0
    let exitTarget = 0

    const poseChar = (el: HTMLElement, index: number) => {
      const entryRate = 1 + (scatter(index, 0) * 2 - 1) * ENTRY_SPREAD
      const exitRate = 1 + (scatter(index, 2) * 2 - 1) * EXIT_SPREAD

      const entryTilt = (scatter(index, 1) * 2 - 1) * ENTRY_TILT
      const exitTilt = (scatter(index, 3) * 2 - 1) * EXIT_TILT

      const entryAt = Math.min(1, Math.max(0, entry * entryRate))
      const exitAt = Math.min(1, Math.max(0, exit * exitRate))

      // Entry comes UP from below (positive y), exit lifts away (negative y), so
      // a character travels in one direction for its whole life.
      const y =
        entryAt * ENTRY_RISE * window.innerHeight - exitAt * EXIT_RISE * window.innerHeight
      const tilt = entryTilt * entryAt + exitTilt * exitAt

      const opacity =
        smoothstep(1 - entryAt / ENTRY_FADE) * (1 - smoothstep(exitAt / EXIT_FADE))

      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      el.style.opacity = `${Math.max(0, opacity).toFixed(3)}`
    }

    const chars: HTMLElement[] = []
    buildWords(line, text, (el, index) => {
      // Posed before it is ever painted, so nothing flashes at rest for a frame
      // and then jumps to its start position.
      poseChar(el, index)
      chars.push(el)
    })

    const pose = () => {
      for (let i = 0; i < chars.length; i++) poseChar(chars[i], i)
    }

    const readScroll = () => {
      const distance = window.innerHeight * EXIT_VIEWPORTS
      exitTarget = distance <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / distance))
    }

    let raf = 0
    let running = false
    let last = performance.now()

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)

      const delta = Math.min((now - last) / 1000, 1 / 30)
      last = now

      ;[entry, entryVelocity] = springStep(
        entry,
        entryVelocity,
        0,
        ENTRY_STIFFNESS,
        ENTRY_DAMPING,
        delta
      )
      ;[exit, exitVelocity] = springStep(
        exit,
        exitVelocity,
        exitTarget,
        EXIT_STIFFNESS,
        EXIT_DAMPING,
        delta
      )
      exit = Math.max(0, exit)

      pose()
    }

    /*
     * A page restored mid-scroll — a reload, or a back navigation — must not
     * play the assembly. It would be animating something the visitor never
     * arrived at, and the type would rise into a screen that is already gone.
     */
    readScroll()
    if (exitTarget > 0.02) {
      entry = 0
      exit = exitTarget
    }

    /*
     * **A page opened in a background tab must not start scattered.**
     *
     * Browsers do not run `requestAnimationFrame` in a hidden tab, so the
     * assembly cannot progress — and the pose it is frozen at is `entry = 1`,
     * which is fully displaced and fully transparent. The claim is the only
     * thing on the opening screen, so the tab renders blank until it is
     * focused, and a visitor opening three studies in tabs finds three empty
     * pages. Settling immediately costs a gesture nobody was there to watch.
     *
     * Same failure and same fix as `Field.tsx` drawing one frame synchronously
     * before starting its loop.
     */
    if (document.hidden) entry = 0

    pose()

    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)

    /*
     * The loop only runs while the claim is on screen. It is a spring, so it
     * cannot simply stop when scrolling stops — it has to keep integrating until
     * it settles — but a case study is a long document, and there is no reason
     * to keep integrating a line that is five chapters above the viewport.
     *
     * Safe to stop, because both springs have reached their targets by the time
     * the line leaves: entry settles within about a second at the top of the
     * page, and exit is clamped at 1 after three-quarters of a viewport.
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
    observer.observe(line)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [text])

  return (
    <>
      {/*
        The scatter is decoration. A screen reader gets the claim once, as one
        string, rather than a character at a time.
      */}
      <span aria-hidden className={className} ref={lineRef} />
      <span className="sr-only">{text}</span>
    </>
  )
}
