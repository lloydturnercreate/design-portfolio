'use client'

import { site } from '@/content/site'
import ScrollLitText from '@/components/ScrollLitText'

/**
 * The close: contact and footer as one centred block.
 *
 * These were two. A conventional Contact section — heading, address, boxed
 * signup form in three columns — sat directly above a wordmark set at 16vw, so
 * the page ended with its sign-off shouting over its call to action.
 *
 * **Centred, and it is the only block on the site that is.** Merging the two
 * left everything hard left with an empty right side and no centre of gravity:
 * six small rows stacked above one enormous one, which read as unfinished
 * rather than as sparse. Centring gives the air a reason to be there. It also
 * makes the page a literal bookend — the hero is centred type under a centred
 * row of links, and this is centred type over one. Everything in between is
 * left-aligned rows, so the two centred moments are the first screen and the
 * last.
 *
 * The links row deliberately mirrors the hero's `nav`: same `gap-x-7`, same
 * size, same muted-to-foreground hover, and it ends on *Back to top* where the
 * hero's ends on *Contact* — the one pointing into the page, the other back out
 * of it.
 *
 * **The 16vw wordmark and the email signup are both gone**, on request. What is
 * left is one action and the four links that support it, which is the least this
 * block can be. Two consequences worth knowing if anything comes back here:
 * `overflow-hidden` went with the wordmark, because the only thing it cropped
 * was that bleed; and the address is now the last element in the document, so
 * `ScrollLitText`'s tail blending — the second progress it derives from
 * remaining scroll distance — is the only thing lighting it. Positional
 * progress cannot complete this close to the end.
 *
 * It also carries `#contact`, which the header and the hero nav both point at.
 * No phone number: it was a scraper and recruiter-spam magnet, and the address
 * is enough.
 */
export default function Footer() {
  const links = [
    { label: 'Full CV', href: site.contact.cvHref, external: false },
    ...site.social.map((item) => ({ ...item, external: true })),
    { label: 'Back to top', href: '#identity', external: false },
  ]

  return (
    <footer id="contact" className="relative scroll-mt-16 border-t border-border">
      <div className="px-6 pt-28 pb-28 text-center sm:px-10 lg:px-16 lg:pt-36 lg:pb-36">
        {/*
          `footer` is the contentinfo landmark and it is now also the target of a
          nav link, and a landmark a link points at with no accessible name is
          announced as nothing at all. Same reason the work index keeps a heading
          it never paints.
        */}
        <h2 className="sr-only">{site.contact.heading}</h2>

        <p className="text-sm text-muted-dark">{site.contact.eyebrow}</p>

        {/*
          The address is the display line — the one action on the page, at the
          scale of the hero rather than of a mailto link.

          `inline-flex` rather than `flex`, so it stays an inline-level box and
          the parent's `text-center` is what centres it; a flex box would stretch
          full width and take its underline with it.

          Deliberately NOT wrapped in `useFrameReveal` like every other list on
          the site. That gesture maps opacity from distance to the centre of the
          viewport, and nothing in the last screen of a document can ever be
          scrolled to the centre — the whole block would sit permanently faded
          and drifted. `ScrollLitText` is the one effect built for the end of the
          page: it blends in a second progress from remaining scroll distance,
          which since the wordmark was removed is the ONLY thing lighting this.
        */}
        {/*
          `link-reveal` draws a bright rule under the address on hover, entering
          from the left and leaving to the right (globals.css). The offset is
          overridden to -1px so the drawn line lands exactly on the hairline
          border below, rather than beside it — the resting rule stays put and
          simply gets drawn over.

          That replaces a `hover:border-foreground` colour change. A hairline
          switching colour is a state; a line drawing itself is a gesture, and
          this is the one link on the page worth spending one on.
        */}
        <a
          href={`mailto:${site.email}`}
          className="link-reveal group mt-6 inline-flex items-baseline gap-3 border-b border-border pb-3 [--link-reveal-offset:-1px] lg:mt-8 lg:gap-5"
        >
          {/*
            Measured, for the same reason the old wordmark was: this string
            renders 10.41× its own font-size wide, so at 6.6vw it needs 69vw and
            still clears the horizontal padding at 320px — the narrowest viewport
            worth serving. The lg step matches the hero's 4.25vw almost exactly,
            which is the point of the bookend. Re-measure if the address changes.
          */}
          <ScrollLitText
            text={site.email}
            className="text-[6.6vw] font-medium leading-[1.05] tracking-[-0.04em] whitespace-nowrap sm:text-[5.2vw] lg:text-[4.2vw]"
          />

          <span
            aria-hidden
            className="shrink-0 text-xl text-muted-dark transition duration-300 group-hover:translate-x-1 group-hover:text-foreground lg:text-3xl"
          >
            &rarr;
          </span>
        </a>

        {/*
          The hero's nav row, at the other end of the page: same `gap-x-7`, same
          `text-sm`, same hover. Not a list of links that happens to be centred —
          the same object, so the two screens rhyme.

          This is the ONLY CV link on the site now. There was a second under the
          experience list in About, which is the more natural home for it — but
          the two sat within a screen of each other, and of the pair this is the
          one a visitor is looking at when they have decided to act.

          No "PDF" note beside it: in a row of four single words, a mono
          annotation on one of them is noise.
        */}
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:mt-20">
          {links.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="link-reveal text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/*
          No name in the copyright line. With the wordmark gone the address is
          the only place it appears, and putting it back here would make two out
          of the three things left in this block a repetition of the one above.
        */}
        <p className="mt-16 text-xs text-muted-dark lg:mt-20">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
