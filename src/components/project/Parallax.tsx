'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Holds its children back against the page's own scrolling.
 *
 * Used on a case study's claim so the lead image below it climbs over the top —
 * the title barely moves while the page carries the image up across it. At
 * `factor: 1` the content would be pinned exactly; just under that it drifts,
 * which is what stops it reading as a stuck element.
 *
 * **A position, not an input.** Per the house rule, this maps directly off
 * `scrollY` and is never sprung: a damped parallax lags behind the thing it is
 * supposed to be parallaxing against, which reads as jitter rather than as
 * weight. The springs on this site are for things reacting to an input — the
 * hero's exit, the work preview — not for things that are a function of where
 * the page already is.
 */
export default function Parallax({
  factor = 0.85,
  className,
  children,
}: {
  /** 0 is no effect; 1 pins the content in place against the scroll. */
  factor?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion gets the content where the layout puts it. A title that
    // refuses to scroll with the page is exactly the kind of movement this
    // setting exists to switch off.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let running = false
    // -1 rather than 0, so the first frame always writes: a page restored at
    // scrollY 0 would otherwise skip its only pose and sit untransformed.
    let last = -1

    const frame = () => {
      raf = requestAnimationFrame(frame)

      const y = window.scrollY
      // Nothing moved, nothing to write. Scroll-driven loops idle at 60fps
      // otherwise, writing the same transform over and over.
      if (y === last) return
      last = y

      el.style.transform = `translate3d(0, ${(y * factor).toFixed(2)}px, 0)`
    }

    /*
     * Gated, like every other loop on the site. This one matters more than
     * most: without it a case study — which is a long document — would keep a
     * rAF loop alive for the entire read, for an element that stopped being
     * visible in the first screen.
     */
    const observer = new IntersectionObserver(([record]) => {
      if (record.isIntersecting && !running) {
        running = true
        raf = requestAnimationFrame(frame)
      } else if (!record.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    observer.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [factor])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
