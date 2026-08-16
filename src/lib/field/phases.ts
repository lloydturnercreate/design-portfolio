/**
 * The field's score.
 *
 * Each phase is a target uniform set pinned to a point in document scroll
 * progress; the field lerps between the two it currently sits between. The page
 * is therefore one continuous surface being transformed, rather than a stack of
 * sections that each happen to have a background.
 *
 * Values are tuned against type sitting directly on the field with no scrim, so
 * they are darker and calmer than the Phasmatic gallery defaults for the same
 * shader. Brightness here is paid for in legibility.
 */

export interface FieldKeyframe {
  id: string
  /** Document scroll progress, 0–1. */
  at: number
  uniforms: {
    speed: number
    hueShift: number
    noiseIntensity: number
    scanlineIntensity: number
    scanlineFrequency: number
    warpAmount: number
    waveCount: number
    translateX: number
    translateY: number
    chromaticAberration: number
    pixelSize: number
    crtCurve: number
    /** Master output multiplier. 0 is black; the field never quite gets there. */
    intensity: number
  }
}

export const KEYFRAMES: FieldKeyframe[] = [
  {
    // Full strength, front and centre. This is the one frame that has to earn
    // the visit, so nothing is held back — it is also the only phase where the
    // type is knocked out of the field rather than sitting beside it.
    id: 'identity',
    at: 0,
    uniforms: {
      speed: 0.85,
      hueShift: 51,
      noiseIntensity: 0.34,
      scanlineIntensity: 0.4,
      scanlineFrequency: 1.53,
      warpAmount: 2,
      waveCount: 2,
      translateX: -0.35,
      translateY: -0.6,
      chromaticAberration: 0.05,
      pixelSize: 9,
      crtCurve: 1,
      intensity: 1,
    },
  },
  {
    // The handover. Placed where the hero's type has finished scattering out
    // and the work list is arriving from below — the field calms and cools as
    // the page stops being a statement and starts being an index.
    //
    // This used to sit at 0.2, aimed at the moment the claim line passed through
    // the centre of a pinned multi-screen statement sequence. That sequence no
    // longer exists; the hero is one screen that cycles on a timer, so there is
    // no scroll position the claim corresponds to any more.
    id: 'claim',
    at: 0.14,
    uniforms: {
      speed: 0.45,
      hueShift: 128,
      noiseIntensity: 0.28,
      scanlineIntensity: 0.22,
      scanlineFrequency: 1.2,
      warpAmount: 1.1,
      waveCount: 2,
      translateX: -0.1,
      translateY: -0.45,
      chromaticAberration: 0.03,
      pixelSize: 4,
      crtCurve: 0.7,
      intensity: 0.72,
    },
  },
  {
    // Under the work, the field becomes a lens rather than a subject: almost
    // still, and quiet enough to read type directly off it.
    //
    // Settled just before the list owns the screen (it occupies 0.395–0.650).
    //
    // `pixelSize` and `intensity` both came down hard here — from 18 and 0.34.
    // Those were tuned for a track of opaque cards, which covered most of the
    // field; the work is bare type now, and heavy pixel blocking behind it put
    // chunky bright blotches straight through the top rows. Big blocks are the
    // one thing that competes directly with large type, because they are the
    // same size as it.
    id: 'work',
    at: 0.34,
    uniforms: {
      speed: 0.22,
      hueShift: 190,
      noiseIntensity: 0.2,
      scanlineIntensity: 0.1,
      scanlineFrequency: 0.9,
      warpAmount: 0.5,
      waveCount: 1,
      translateX: 0.2,
      translateY: -0.2,
      chromaticAberration: 0.015,
      pixelSize: 7,
      crtCurve: 0.35,
      intensity: 0.2,
    },
  },
  {
    // Holds the WORK state, drifting slowly, for as long as the list is on
    // screen — it ends at 0.650, so this sits just past it. Without a hold the
    // field would race through its whole range in the first two rows and then
    // sit dead for the rest of the section.
    //
    // Was 0.74, which was inside a pinned track that no longer exists; against
    // the current document that landed after the work had already left, so the
    // field went on brightening into the About section.
    id: 'work-hold',
    at: 0.64,
    uniforms: {
      speed: 0.28,
      hueShift: 232,
      noiseIntensity: 0.18,
      scanlineIntensity: 0.08,
      scanlineFrequency: 0.8,
      warpAmount: 0.42,
      waveCount: 1,
      translateX: 0.3,
      translateY: -0.08,
      chromaticAberration: 0.01,
      pixelSize: 5,
      crtCurve: 0.28,
      intensity: 0.18,
    },
  },
  {
    // Decays to near-black grain so the contact block is the brightest thing on
    // screen by the time anyone reaches it.
    //
    // Reached at 0.86 rather than 1. About is centred near 0.935 and the close
    // occupies the final screen, so anchoring the decay to the very bottom of
    // the document meant the field was still visibly draining while both were
    // being read — the calm arrived after the content it was supposed to be calm
    // underneath. It now settles before either comes into view and simply holds.
    //
    // Because it holds, the exact tail fractions are not sensitive: merging
    // Contact into the footer shortened the document by a few percent and moved
    // nothing that matters. The boundaries worth re-checking after a layout
    // change are `work` and `work-hold`, not this one.
    id: 'quiet',
    at: 0.86,
    uniforms: {
      speed: 0.12,
      hueShift: 210,
      noiseIntensity: 0.14,
      scanlineIntensity: 0.05,
      scanlineFrequency: 0.6,
      warpAmount: 0.2,
      waveCount: 1,
      translateX: 0.35,
      translateY: 0,
      chromaticAberration: 0,
      pixelSize: 0,
      crtCurve: 0.15,
      intensity: 0.12,
    },
  },
]

/**
 * The case-study score.
 *
 * A compressed version of the same arc. The home page spends five phases
 * earning a visit; a case study has one job at the top — say this is the same
 * site — and then has to get out of the way, because everything below the header
 * is body copy and the field is tuned for type sitting directly on it with no
 * scrim.
 *
 * So: present for the header, decayed by the time the first chapter is in frame,
 * and holding near-black for the rest of the read. `reading` is pinned early
 * rather than somewhere later because case studies are long — a fraction that
 * looks early against a 5,000px document is still most of a screen.
 *
 * **It moved from 0.16 to 0.12 when the opening screen was split in two.** The
 * detail band now arrives at roughly 86svh, immediately under the claim, and it
 * carries the first small text on the page. At 0.16 the field was still most of
 * the way up while that band was being read. The rule this follows is the same
 * one that drove the split: display type can sit on a live field, body copy
 * cannot.
 *
 * Hues sit in the violet-blue end so `fieldHue` on each study can shift from
 * there toward its own accent without crossing the whole wheel.
 */
export const CASE_STUDY_KEYFRAMES: FieldKeyframe[] = [
  {
    id: 'title',
    at: 0,
    uniforms: {
      speed: 0.4,
      hueShift: 118,
      noiseIntensity: 0.26,
      scanlineIntensity: 0.18,
      scanlineFrequency: 1.1,
      warpAmount: 0.9,
      waveCount: 2,
      translateX: -0.15,
      translateY: -0.4,
      chromaticAberration: 0.025,
      pixelSize: 3,
      crtCurve: 0.6,
      intensity: 0.58,
    },
  },
  {
    id: 'reading',
    at: 0.12,
    uniforms: {
      speed: 0.16,
      hueShift: 186,
      noiseIntensity: 0.16,
      scanlineIntensity: 0.06,
      scanlineFrequency: 0.8,
      warpAmount: 0.3,
      waveCount: 1,
      translateX: 0.15,
      translateY: -0.1,
      chromaticAberration: 0.008,
      pixelSize: 0,
      crtCurve: 0.2,
      intensity: 0.13,
    },
  },
  {
    id: 'quiet',
    at: 0.55,
    uniforms: {
      speed: 0.1,
      hueShift: 210,
      noiseIntensity: 0.12,
      scanlineIntensity: 0.04,
      scanlineFrequency: 0.6,
      warpAmount: 0.16,
      waveCount: 1,
      translateX: 0.28,
      translateY: 0,
      chromaticAberration: 0,
      pixelSize: 0,
      crtCurve: 0.12,
      intensity: 0.08,
    },
  },
]

type Uniforms = FieldKeyframe['uniforms']

const KEYS = Object.keys(KEYFRAMES[0].uniforms) as (keyof Uniforms)[]

/** Smoothstep, so phase changes ease rather than arrive at constant speed. */
function ease(t: number) {
  return t * t * (3 - 2 * t)
}

/**
 * Uniform values for a given scroll progress.
 *
 * Writes into `out` rather than allocating, because this runs every frame and
 * a fresh object per frame is exactly the kind of garbage that shows up as
 * stutter on a long scroll.
 */
export function sampleField(
  progress: number,
  out: Uniforms,
  score: FieldKeyframe[] = KEYFRAMES
): Uniforms {
  const p = Math.min(1, Math.max(0, progress))

  const first = score[0]
  const last = score[score.length - 1]

  /*
   * Hold outside the score's range, rather than extrapolating.
   *
   * The loop below only finds a pair when `p` falls between two keyframes, and
   * the fallback it used to leave in place was `first`–`last` — so any progress
   * past the final keyframe interpolated across the WHOLE score at t > 1, with
   * `ease` unclamped. That was invisible only because the last keyframe sat at
   * exactly 1 and nothing could ever be past it. It no longer does: `quiet` is
   * reached at 0.86 and simply holds for the rest of the document.
   */
  if (p <= first.at) {
    for (const key of KEYS) out[key] = first.uniforms[key]
    return out
  }
  if (p >= last.at) {
    for (const key of KEYS) out[key] = last.uniforms[key]
    return out
  }

  let a = first
  let b = last

  for (let i = 0; i < score.length - 1; i++) {
    if (p >= score[i].at && p <= score[i + 1].at) {
      a = score[i]
      b = score[i + 1]
      break
    }
  }

  const span = b.at - a.at
  const t = span <= 0 ? 0 : ease((p - a.at) / span)

  for (const key of KEYS) {
    out[key] = a.uniforms[key] + (b.uniforms[key] - a.uniforms[key]) * t
  }

  return out
}

export function makeUniformState(): Uniforms {
  return { ...KEYFRAMES[0].uniforms }
}
