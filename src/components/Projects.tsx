'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { flowItems } from '@/content/flow'
import { useFrameReveal } from '@/lib/reveal'

/**
 * Selected work, as a typographic index.
 *
 * This replaced a pinned horizontal track of cards. The cards fought the hero:
 * the hero is one quiet centred line, and the track was seven loud portrait
 * rectangles skewing, scaling and staggering at once — three simultaneous
 * transforms, none of which ever resolved into a composition. It read as a
 * different site.
 *
 * So the work is type now, in the hero's register, and the imagery only exists
 * on approach. The list is dead still until you point at it; all the motion has
 * moved into the interaction rather than being spent on ambient decoration.
 *
 * The preview follows the pointer through a damped spring rather than tracking
 * it exactly — the same reason the hero's exit springs instead of reading
 * `scrollY` directly. Pinned to the cursor it feels welded to the mouse; chasing
 * it, it has weight, and the lag is what produces the tilt.
 */

/** How fast the preview catches the pointer, as a time constant in seconds. */
const FOLLOW_TAU = 0.085

/** Degrees of tilt at full speed. The lag produces this; it is not animated separately. */
const MAX_TILT = 9

/** Pointer speed, in px/s, that counts as "full speed" for the tilt. */
const TILT_AT = 2200

/**
 * The preview only exists where there is a real pointer to follow. On touch the
 * rows carry their own thumbnail instead — losing the imagery entirely on mobile
 * would be losing content, not losing an effect.
 */
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Same rows, same gesture as the experience list in About.tsx.
  useFrameReveal(sectionRef, '[data-row]')

  useEffect(() => {
    const section = sectionRef.current
    const preview = previewRef.current
    if (!section || !preview) return

    const fine = window.matchMedia(FINE_POINTER)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches) return

    const frames = Array.from(preview.querySelectorAll<HTMLElement>('[data-preview]'))
    const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-row]'))

    let pointerX = 0
    let pointerY = 0
    let x = 0
    let y = 0
    let active = -1
    let raf = 0
    let running = false
    let last = 0

    const show = (index: number) => {
      if (index === active) return
      active = index
      for (let i = 0; i < frames.length; i++) {
        frames[i].style.opacity = i === index ? '1' : '0'
      }
      preview.style.opacity = index < 0 ? '0' : '1'
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)

      const delta = Math.min((now - last) / 1000, 1 / 20)
      last = now

      const previousX = x
      if (reduced.matches) {
        x = pointerX
        y = pointerY
      } else {
        const catchUp = 1 - Math.exp(-delta / FOLLOW_TAU)
        x += (pointerX - x) * catchUp
        y += (pointerY - y) * catchUp
      }

      // Tilt is derived from how far behind the preview currently is, so it
      // builds and releases with the glide rather than snapping on and off with
      // the mouse.
      const speed = (x - previousX) / Math.max(delta, 1e-3)
      const tilt = reduced.matches
        ? 0
        : Math.max(-MAX_TILT, Math.min(MAX_TILT, (speed / TILT_AT) * MAX_TILT))

      preview.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
    }

    const cleanups: Array<() => void> = []

    rows.forEach((row, index) => {
      const enter = (event: PointerEvent) => {
        // Jump the preview to the pointer on the first row entered, rather than
        // letting it fly in from wherever it was left. Without this it streaks
        // across the page every time the list is re-entered.
        if (active < 0) {
          pointerX = x = event.clientX
          pointerY = y = event.clientY
        }
        show(index)
        start()
      }
      row.addEventListener('pointerenter', enter)
      cleanups.push(() => row.removeEventListener('pointerenter', enter))
    })

    const leave = () => {
      show(-1)
      stop()
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', leave)

    return () => {
      cancelAnimationFrame(raf)
      for (const off of cleanups) off()
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      /*
        Top padding is much tighter than the bottom on purpose. Paired with the
        hero's 90svh, it lifts the first rows into the fold so they start
        revealing as the statement leaves, rather than after a screen of nothing.
      */
      className="relative px-6 pt-14 pb-28 sm:px-10 lg:px-16 lg:pt-20 lg:pb-40"
    >
      {/*
        The heading is kept but hidden. The eyebrow and count were removed as
        visual furniture — the list says what it is — but the section is a nav
        destination (`#work`), and a landmark a link points at with no accessible
        name is announced as nothing at all.
      */}
      <h2 className="sr-only">Selected work</h2>

      {/*
        The dim-the-rest behaviour is pure CSS — `group-hover` on the list plus
        `hover` on the row. It runs every pointer move, and routing it through
        React state would re-render the whole list on each one.
      */}
      <ul className="group/list border-t border-border">
        {flowItems.map((item) => {
          const row = (
            <>
              <span className="font-mono text-xs text-muted-dark tabular-nums">{item.index}</span>

              {/* `flex-1` is what pushes the weight column to the far edge. */}
              <span className="min-w-0 flex-1">
                <span className="block text-[7vw] font-medium leading-[1.05] tracking-[-0.035em] text-balance hyphens-none sm:text-[5vw] lg:text-[3.6vw]">
                  {item.name}
                </span>
                <span className="mt-2 block max-w-[46ch] text-sm leading-snug text-muted text-pretty">
                  {item.headline}
                </span>
              </span>

              {/*
                Only shown where there is no pointer to follow — on touch the
                cursor preview cannot exist, and dropping the imagery entirely
                would be losing content rather than losing an effect.
              */}
              {item.cover && (
                <span className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded max-md:block">
                  <Image src={item.cover} alt="" fill sizes="96px" className="object-cover" />
                </span>
              )}

              {/* The line that keeps client work and solo work distinguishable. */}
              <span className="hidden shrink-0 text-right text-xs text-muted-dark md:block">
                {item.weight}
                {item.year && (
                  <span className="mt-1 block font-mono tracking-normal">{item.year}</span>
                )}
              </span>
            </>
          )

          /*
           * `opacity-100!` — suffix, not prefix. Tailwind 4 moved the important
           * modifier to the end of the utility; the v3 spelling `!opacity-100`
           * compiles to nothing at all, which silently leaves the hovered row
           * dimmed along with everything else and makes the effect look broken
           * rather than absent.
           */
          const className =
            'flex items-center gap-6 border-b border-border py-7 transition-opacity duration-300 group-hover/list:opacity-35 hover:opacity-100! lg:gap-10 lg:py-9'

          return (
            <li key={item.name} data-row className="will-change-[transform,opacity]">
              {item.href ? (
                <Link
                  href={item.href}
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className={className}
                >
                  {row}
                </Link>
              ) : (
                <div className={className}>{row}</div>
              )}
            </li>
          )
        })}
      </ul>

      {/*
        One preview element for the whole list, with every cover pre-rendered
        inside it and faded between. Swapping a single `src` on hover would show
        a blank frame for the first hover of each project while the image
        decodes, which is exactly the moment it needs to be there.

        `fixed` because it tracks the viewport pointer, and `pointer-events-none`
        so it can never sit between the cursor and the row it is describing.
      */}
      <div
        ref={previewRef}
        aria-hidden
        /*
          Was 20vw × 26vw, then 65% of that at the same 0.77 aspect, now widened
          to 0.89. Both changes had a reason and the second is the load-bearing
          one.

          The old size put a 400px card next to a 52px row: it read as the
          subject of the screen rather than as a preview of the thing under the
          cursor, and it covered the rows either side of the one being pointed at.

          The width is a fit problem, not a taste one. Only Raptor has portrait
          source art; every other cover is landscape being centre-cropped, and
          each step narrower throws away more of the composition. 15/16.9 keeps
          the card clearly upright while giving the landscape crops back about a
          sixth of their width. Widen it further and the covers only improve —
          the constraint is the rows behind it, not the pictures.
        */
        className="pointer-events-none fixed left-0 top-0 z-20 hidden h-[16.9vw] w-[15vw] opacity-0 transition-opacity duration-300 will-change-transform md:block"
      >
        {flowItems.map((item) => (
          <div
            key={item.name}
            data-preview
            className="absolute inset-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-200"
            style={{ background: `linear-gradient(160deg, ${item.color}22, transparent 60%)` }}
          >
            {item.cover ? (
              <Image
                src={item.cover}
                alt=""
                fill
                sizes="15vw"
                className="object-cover"
              />
            ) : (
              /*
                Unreached as of 2026-08-15: every entry has cover art, Phasmatic
                having been the last and its capture the thing that closed the
                gap. Kept for the next project added before its art exists.

                Tinted from the project's own accent so a coverless preview reads
                as that project rather than as a loading failure. To fill it, set
                `cover` on the study in `content/case-studies.ts`.
              */
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `radial-gradient(120% 90% at 50% 110%, ${item.color}38 0%, ${item.color}0f 45%, transparent 75%)`,
                }}
              >
                <span
                  className="text-center text-xl font-medium tracking-tight"
                  style={{ color: item.color }}
                >
                  {item.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
