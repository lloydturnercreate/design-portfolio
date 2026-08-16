'use client'

/**
 * Mutable scroll and pointer state for the field.
 *
 * Deliberately plain objects rather than React state. The field reads these
 * inside `useFrame`, sixty times a second — routing that through setState would
 * re-render the entire page on every scroll event and every mouse move, which is
 * the single most common way sites in this genre end up janky. Nothing here ever
 * triggers a render; the canvas reads the numbers directly.
 *
 * One listener set, installed once, shared by every consumer.
 */

export const scroll = {
  /** 0 at the top of the document, 1 at the bottom. */
  progress: 0,
  /** Progress units per second, signed. Used to add drag to the field. */
  velocity: 0,
}

export const pointer = {
  /** Canvas UV space: 0–1, y up. */
  x: 0.5,
  y: 0.5,
  /** Smoothed speed in UV units per second. Drives the disturbance. */
  speed: 0,
  /** True once the pointer has actually moved — before that, idle drift only. */
  engaged: false,
}

let installed = false

export function installFieldListeners() {
  if (installed || typeof window === 'undefined') return () => {}
  installed = true

  let lastProgress = 0
  let lastScrollTime = performance.now()
  let px = 0.5
  let py = 0.5
  let lastMoveTime = performance.now()

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

    const now = performance.now()
    const dt = Math.max(now - lastScrollTime, 1) / 1000
    scroll.velocity = (next - lastProgress) / dt

    scroll.progress = next
    lastProgress = next
    lastScrollTime = now
  }

  const onPointerMove = (e: PointerEvent) => {
    const nx = e.clientX / Math.max(window.innerWidth, 1)
    const ny = 1 - e.clientY / Math.max(window.innerHeight, 1)

    const now = performance.now()
    const dt = Math.max(now - lastMoveTime, 1) / 1000
    const dist = Math.hypot(nx - px, ny - py)

    // Smoothed rather than instantaneous: raw per-event deltas are extremely
    // spiky and make the field twitch instead of respond.
    pointer.speed = pointer.speed * 0.8 + (dist / dt) * 0.2
    pointer.x = nx
    pointer.y = ny
    pointer.engaged = true

    px = nx
    py = ny
    lastMoveTime = now
  }

  const onPointerLeave = () => {
    pointer.engaged = false
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)

  return () => {
    installed = false
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
  }
}

/**
 * Velocity has to decay on its own. Both `scroll.velocity` and `pointer.speed`
 * are only written when an event fires, so without this they hold their last
 * value forever once the user stops — the field would stay permanently agitated
 * after a single flick. Called once per frame from the field.
 */
export function decayFieldMotion(delta: number) {
  const k = Math.exp(-delta / 0.18)
  scroll.velocity *= k
  pointer.speed *= k
  if (Math.abs(scroll.velocity) < 1e-4) scroll.velocity = 0
  if (pointer.speed < 1e-4) pointer.speed = 0
}
