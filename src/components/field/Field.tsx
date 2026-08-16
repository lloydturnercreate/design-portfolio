'use client'

import { useEffect, useRef } from 'react'
import { createFieldRenderer, type FieldUniforms } from '@/lib/field/renderer'
import { makeUniformState, sampleField, type FieldKeyframe } from '@/lib/field/phases'
import { decayFieldMotion, installFieldListeners, pointer, scroll } from '@/lib/field/stores'
import { usePrefersReducedMotion } from '@/lib/effects/usePrefersReducedMotion'

/** How quickly the pointer disturbance settles once the cursor stops. */
const POKE_DECAY_TAU = 0.5
/** Pointer speed, in viewport widths per second, that saturates the response. */
const SPEED_AT_FULL_FORCE = 2.2
/** Frame budget before we start shedding resolution. ~45fps. */
const FRAME_BUDGET_MS = 22
const MAX_DPR = 1.5
const MIN_DPR = 0.75

/**
 * The field.
 *
 * One canvas, fixed to the viewport, alive for the whole session. It is not a
 * background behind the sections — the sections are phases of it, and scrolling
 * transforms it (see lib/field/phases.ts).
 *
 * Everything is driven from one rAF loop reading two mutable stores, so
 * scrolling and moving the cursor never trigger a React render. React's only job
 * here is to mount a canvas and tear it down.
 */
export default function Field({
  score,
  hueOffset = 0,
}: {
  /**
   * The score to sample. Defaults to the home page's five phases; case studies
   * pass `CASE_STUDY_KEYFRAMES`, which is the same arc compressed into a header
   * and a long quiet read.
   */
  score?: FieldKeyframe[]
  /**
   * Degrees added to whatever hue the score is on, so each case study can carry
   * its own accent without needing a score of its own. Applied on top of the
   * scroll drag, which shifts hue too — the two compose, deliberately: the page
   * has a colour and moving through it still bends that colour.
   */
  hueOffset?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // Mirrored into a ref so the render loop can read it without `reducedMotion`
  // becoming an effect dependency — that would tear down and rebuild the GL
  // context every time the OS setting changed.
  const frozen = useRef(reducedMotion)
  useEffect(() => {
    frozen.current = reducedMotion
  }, [reducedMotion])

  /*
   * Mirrored into refs for the same reason `frozen` is: the render loop has to
   * read them every frame, and making them effect dependencies would tear down
   * and rebuild the GL context whenever they changed. A canvas hands out one
   * context ever, so a rebuild is not a cheap mistake — see `destroy()` in
   * renderer.ts.
   */
  const scoreRef = useRef(score)
  const hueRef = useRef(hueOffset)
  useEffect(() => {
    scoreRef.current = score
    hueRef.current = hueOffset
  }, [score, hueOffset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer
    try {
      renderer = createFieldRenderer(canvas)
    } catch (error) {
      // A failed shader compile should cost the visitor a background, not the page.
      console.error(error)
      return
    }
    if (!renderer) return

    const uninstall = installFieldListeners()

    const sampled = makeUniformState()
    const u: FieldUniforms = {
      aspect: 1, time: 0, hueShift: 0, noise: 0, scan: 0, scanFreq: 0, warp: 0,
      waveCount: 2, translateX: 0, translateY: 0, chromaAb: 0, pixelSize: 0,
      crtCurve: 0, mouseX: 0.5, mouseY: 0.5, poke: 0, intensity: 1,
    }

    let raf = 0
    let last = performance.now()
    let dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
    let meanCost = FRAME_BUDGET_MS
    let sinceAdjust = 0
    let mouseX = 0.5
    let mouseY = 0.5
    let poke = 0

    const step = (now: number) => {
      // Clamped: coming back from a hidden tab hands back a delta of seconds,
      // which would jump the animation and spike the pointer response.
      const delta = Math.min((now - last) / 1000, 1 / 20)
      last = now

      const w = window.innerWidth
      const h = window.innerHeight
      renderer.resize(w, h, dpr)
      u.aspect = w / Math.max(h, 1)

      const f = sampleField(scroll.progress, sampled, scoreRef.current)

      // Fast scrolling drags the field with it. Signed, so scrolling back up
      // pulls the other way — the surface reads as something with inertia
      // rather than a value being scrubbed.
      const drag = frozen.current
        ? 0
        : Math.min(Math.abs(scroll.velocity), 1.5) * Math.sign(scroll.velocity)

      if (!frozen.current) u.time += delta * (f.speed + Math.abs(drag) * 1.4)

      u.hueShift = f.hueShift + hueRef.current + drag * 26
      u.noise = f.noiseIntensity
      u.scan = f.scanlineIntensity
      u.scanFreq = f.scanlineFrequency
      u.warp = f.warpAmount + Math.abs(drag) * 0.7
      u.waveCount = f.waveCount
      u.translateX = f.translateX
      u.translateY = f.translateY
      u.chromaAb = f.chromaticAberration + Math.abs(drag) * 0.04
      u.pixelSize = f.pixelSize
      u.crtCurve = f.crtCurve
      u.intensity = f.intensity

      if (!frozen.current) {
        // Force, not impulse: how hard the field is pushed depends on how fast
        // the cursor is actually moving, so a slow drag barely disturbs it and a
        // fast sweep tears through it.
        const force = pointer.engaged ? Math.min(pointer.speed / SPEED_AT_FULL_FORCE, 1) : 0
        poke = Math.max(poke, force * 2.4)
        poke *= Math.exp(-delta / POKE_DECAY_TAU)
        if (poke < 0.001) poke = 0

        // The sampled point trails the real cursor, which gives the ripple
        // weight instead of snapping it around the screen.
        const follow = 1 - Math.exp(-delta / 0.09)
        mouseX += (pointer.x - mouseX) * follow
        mouseY += (pointer.y - mouseY) * follow

        u.mouseX = mouseX
        u.mouseY = mouseY
        u.poke = poke

        decayFieldMotion(delta)
      }

      renderer.render(u)

      // Adaptive resolution. For a full-screen fragment shader cost scales with
      // pixels, not frames, so shedding dpr is the cheapest real lever — 1.5 to
      // 1.25 removes ~30% of the fragment work and is far less visible than a
      // dropped frame.
      meanCost = meanCost * 0.92 + delta * 1000 * 0.08
      if (++sinceAdjust > 90) {
        sinceAdjust = 0
        const ceiling = Math.min(MAX_DPR, window.devicePixelRatio || 1)
        const next =
          meanCost > FRAME_BUDGET_MS
            ? Math.max(MIN_DPR, dpr - 0.25)
            : meanCost < FRAME_BUDGET_MS * 0.6
              ? Math.min(ceiling, dpr + 0.25)
              : dpr
        dpr = next
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      step(now)
    }

    // Paint once synchronously before handing over to rAF.
    //
    // Browsers do not run requestAnimationFrame in a background tab, so a page
    // opened in one — a middle-click, a restored session, a link opened behind
    // the current window — would otherwise size its buffer and draw its first
    // frame only when the visitor finally switched to it. Until then the canvas
    // sits at its untouched 300x150 default and the page looks broken. Drawing
    // one frame here means the field is correct from the moment it exists,
    // whether or not anything is animating yet.
    step(performance.now())

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      uninstall()
      renderer.destroy()
    }
  }, [])

  return (
    // No z-index: it would open a stacking context and isolate the content's
    // mix-blend-difference from the field. Paint order is DOM order.
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 block h-full w-full"
    />
  )
}
