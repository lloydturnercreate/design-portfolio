import Image from 'next/image'

/**
 * One image or video from a case study. The picture only — the caption and the
 * frame belong to the caller.
 *
 * Several assets are .mp4 — the old site rendered everything through an <img>,
 * so those silently showed nothing. Video gets a real <video> here: muted,
 * looping, autoplaying and playsInline, which is the only combination browsers
 * will start without a user gesture.
 *
 * There used to be a nine-entry `ImageLayout` table here and a `<figcaption>`
 * below the picture. Both went on 2026-08-15: the block model owns width, and
 * the caption has to be able to sit in the page's padding while the image runs
 * to the viewport edge, which is impossible if they are welded together.
 */
export default function Media({
  src,
  alt,
  className,
  tall = false,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  /**
   * Crop to near viewport height instead of running at natural aspect.
   *
   * Only for art that survives a crop — photography, renders, environmental
   * shots. A UI screenshot at `object-cover` loses the content that made it
   * worth showing, so this is opt-in per figure rather than a property of the
   * frame.
   */
  tall?: boolean
  priority?: boolean
}) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src)

  // `h-auto` at natural aspect; a fixed viewport height with `object-cover`
  // when cropping. `85svh` rather than `vh` so mobile browser chrome does not
  // push the bottom of the image off the screen.
  const fit = tall ? 'block h-[85svh] w-full object-cover' : 'block h-auto w-full'

  /*
    A hairline around every piece of media, at the page's own `--border`
    (#1c1c1c on a #060606 background) — visible enough to describe an edge,
    far too quiet to read as a frame or a card.

    **It exists because of Phasmatic.** That lead is a screen recording of a
    near-black page sitting on a near-black page, so with nothing drawn around
    it the video had no boundary at all and simply dissolved into the layout.
    Note the sequence, because it looks like a reversal and is not: the same
    video shipped with the recorded window's edge highlight burned into it, and
    that was cropped out rather than masked. Hiding a defect in an asset with
    page furniture was the wrong move; drawing a deliberate edge once the asset
    is clean is a different decision.

    Applied here rather than per study so it cannot drift. It is a no-op on the
    light art — Phuture's tablet and Sukiyaki's billboard define their own edges
    — and does the work on anything dark.
  */
  return (
    <div className={`border border-border bg-surface ${className ?? ''}`}>
      {isVideo ? (
        <video
          src={src}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={fit}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={2400}
          height={1500}
          priority={priority}
          /*
            Figures are bounded by the page container (88rem, less its padding)
            rather than the viewport, so `100vw` over-fetches on anything wider
            than about 1400px — which is most desktop displays.
          */
          sizes="(min-width: 88rem) 1280px, (min-width: 64rem) calc(100vw - 8rem), calc(100vw - 3rem)"
          className={fit}
        />
      )}
    </div>
  )
}
