'use client'

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * True when the visitor has asked the OS to minimize motion.
 *
 * Effects honor this by rendering a single static frame and then freezing (see
 * `PauseOffscreen` for the R3F effects and the Canvas2D effects' rAF loops),
 * which is the accessible fallback for vestibular-sensitive visitors — and, on
 * the embed route, means an embedder's reduced-motion visitors inherit a still
 * image instead of a running animation.
 *
 * SSR-safe: defaults to `false` (animate) until the client can read matchMedia.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
