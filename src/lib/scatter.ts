/**
 * The per-character scatter, shared.
 *
 * Two places on the site take a line of display type apart character by
 * character: the hero, which scatters out as the page scrolls, and a case
 * study's claim, which assembles in on load and scatters out on scroll. They
 * are the same gesture in opposite directions, so they share the primitive —
 * "one gesture, one implementation" is a house rule, and the alternative is two
 * copies of the same pseudo-random drifting apart until the two screens stop
 * matching.
 *
 * The tuning constants deliberately do NOT live here. The hero throws its line
 * most of a screen; a claim settling into place travels a fraction of that, and
 * forcing one set of numbers on both would make the quieter one wrong to keep
 * the louder one right.
 */

/**
 * Deterministic per-character pseudo-random, in 0–1.
 *
 * Deliberately not `Math.random()`: rates have to be stable across re-poses, or
 * a character would pick a new speed on every frame and vibrate. It also has to
 * be reproducible rather than seeded at mount, so a character re-typed at the
 * same position leaves the same way it did last time.
 *
 * `salt` selects an independent stream from the same index — rate on 0, tilt on
 * 1 — so a character that leaves fast is not also the one that tilts hardest.
 */
export function scatter(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

export function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/**
 * One step of a damped spring, integrated semi-implicitly.
 *
 * Explicit integration drifts at these stiffnesses and can blow up on a long
 * frame; this stays stable. Returns the new position and velocity rather than
 * mutating, because both callers keep them in closure variables.
 *
 * Damping is always passed just under critical (`2 * sqrt(stiffness)`) so the
 * value overshoots slightly and settles. That overshoot is the character the
 * whole site is built on — an ease can only ever approach its target.
 */
export function springStep(
  value: number,
  velocity: number,
  target: number,
  stiffness: number,
  damping: number,
  delta: number
): [number, number] {
  const accel = -stiffness * (value - target) - damping * velocity
  const nextVelocity = velocity + accel * delta
  return [value + nextVelocity * delta, nextVelocity]
}

/**
 * Splits a string into per-word wrappers, each holding per-character spans.
 *
 * **The word grouping is load-bearing.** Every character is an inline-block and
 * every inline-block is a break opportunity, so a flat list lets the browser
 * break a line *mid-word* — it rendered "MoonPay" as "MoonPa / y". Each word is
 * its own `whitespace-nowrap` wrapper so it cannot break internally, and the
 * ordinary space text nodes between wrappers are the only legal break points.
 * Those must stay real spaces: a non-breaking space makes the whole line one
 * unbreakable run that overflows instead.
 *
 * `onChar` is called with each character element and its running index across
 * the whole string, so a caller can pose it before it is ever painted.
 */
export function buildWords(
  host: HTMLElement,
  text: string,
  onChar?: (el: HTMLElement, index: number) => void
) {
  host.textContent = ''

  const words = text.split(' ')
  let index = 0

  words.forEach((word, w) => {
    const wrapper = document.createElement('span')
    wrapper.className = 'inline-block whitespace-nowrap'

    for (const character of word) {
      const el = document.createElement('span')
      el.className = 'inline-block'
      el.dataset.char = ''
      el.textContent = character
      onChar?.(el, index)
      index += 1
      wrapper.appendChild(el)
    }

    host.appendChild(wrapper)
    if (w < words.length - 1) host.appendChild(document.createTextNode(' '))
  })

  return index
}
