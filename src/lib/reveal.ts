'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Rows that arrive and leave with the frame.
 *
 * Shared by the work index and the experience list so the two read as one
 * system — they are the same gesture at different weights, and duplicating the
 * loop is how they would quietly drift apart.
 *
 * Mapped straight from each element's position in the viewport, deliberately NOT
 * sprung. The hero's exit and the work preview both chase a target, because both
 * are reacting to an input — scroll velocity, pointer position. This is not
 * reacting to anything: a row's opacity IS a function of where it currently is.
 * Damping it would make a row's brightness lag its own position, so it would
 * still be dark after it had visibly arrived.
 */

/**
 * How much of the viewport a row stays at full strength across, measured from
 * the centre outward as a fraction of half the viewport height.
 *
 * The whole trick is in this number. Attenuating by distance from centre — the
 * obvious implementation — lights exactly one row and dims everything else, so
 * the list is permanently half-faded and reads as broken rather than as motion.
 * Holding the middle band flat means only the rows genuinely arriving at, or
 * leaving through, the edges of frame are affected.
 */
const HOLD = 0.6

/** How far a row has shrunk by the time it reaches the edge of frame. */
const SCALE = 0.07

/** How far a row drifts toward the edge it is leaving through, in px. */
const DRIFT = 26

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function useFrameReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  { hold = HOLD, scale = SCALE, drift = DRIFT } = {}
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rows = Array.from(container.querySelectorAll<HTMLElement>(selector))
    if (rows.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let running = false

    /**
     * Document-space centre of each row, measured from layout rather than from
     * `getBoundingClientRect()`.
     *
     * This matters more than it looks. A client rect INCLUDES transforms, and
     * this loop writes a transform to every row each frame — so measuring that
     * way feeds the drift straight back into the next frame's input and the rows
     * chase their own position. `offsetTop` and `offsetHeight` are layout
     * values, untouched by the transforms written on top of them, so they only
     * need re-measuring when the layout itself changes.
     */
    const centres = new Float64Array(rows.length)

    const layout = () => {
      for (let i = 0; i < rows.length; i++) {
        let y = 0
        let node: HTMLElement | null = rows[i]
        while (node) {
          y += node.offsetTop
          node = node.offsetParent as HTMLElement | null
        }
        centres[i] = y + rows[i].offsetHeight / 2
      }
    }

    const pose = () => {
      const half = window.innerHeight / 2
      const scrolled = window.scrollY

      for (let i = 0; i < rows.length; i++) {
        // -1 at the top edge of the viewport, 0 dead centre, +1 at the bottom.
        const offset = (centres[i] - scrolled - half) / half
        const edge = smoothstep((Math.min(1, Math.abs(offset)) - hold) / (1 - hold))

        rows[i].style.opacity = (1 - edge).toFixed(3)
        rows[i].style.transform =
          `translate3d(0, ${(Math.sign(offset) * edge * drift).toFixed(2)}px, 0) scale(${(1 - edge * scale).toFixed(4)})`
      }
    }

    /**
     * Idle frames cost nothing. Row position is a pure function of scroll, so
     * re-posing when the scroll has not moved rewrites every inline style to the
     * value it already holds, every frame, for as long as the section is on
     * screen. The loop still has to exist — it is how the pose stays in step with
     * momentum scrolling — but it should do no work while nothing moves.
     */
    let posedAt = Number.NaN

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (window.scrollY === posedAt) return
      posedAt = window.scrollY
      pose()
    }

    const onResize = () => {
      layout()
      posedAt = Number.NaN
      pose()
    }
    window.addEventListener('resize', onResize)

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

    observer.observe(container)

    // Measured and posed once synchronously. The rows are full-strength in the
    // markup so the list survives without JS, which means the first painted
    // frame would otherwise show every row lit and then visibly drop the outer
    // ones.
    layout()
    pose()

    // Re-measure once the web font is in: row heights are driven by type, and at
    // mount they are measured against the fallback face.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) onResize()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [containerRef, selector, hold, scale, drift])
}
