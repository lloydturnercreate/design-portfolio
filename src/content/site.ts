/**
 * Single source of copy for the site.
 *
 * There is deliberately one version of this. The old site shipped a
 * startup/enterprise split behind an env var; both were written for client work.
 *
 * **The audience changed on 2026-08-16, and this note is the record of it.** It
 * previously read that the site's job was "to make a Staff/Principal-level case
 * to a hiring manager". That is no longer what he wants it to do: he is not
 * selling himself as an employee, does not want to write for shareholders, and
 * wants the craft itself to be what earns — "shaders, not wallets". The reader
 * to write for is someone who loves making things and has something ambitious
 * to make.
 *
 * **The build survives the change, which is why this was a copy edit and not a
 * rebuild.** The old note's own reasoning holds in reverse: a site built on
 * capability and evidence serves either audience, and only a site built on
 * availability would have had to be torn up. It cost a reordering and about
 * four sentences.
 *
 * The test for new copy is whether it was written to impress an employer or to
 * interest a collaborator. `sections.work.intro` failed it and was rewritten;
 * `hero.credibility` was rewritten on the same grounds and put back, because it
 * simply read better — see its note. Not every line has to do the repositioning.
 *
 * Still true, and unchanged: no rates, no consultation booking, no "available
 * for work" until actually available.
 */
export const site = {
  name: 'Lloyd Turner',
  /*
    **Temporary, and known to be wrong.** `lloyd@lloydturner.co.uk` is the address
    this should be and the domain is owned — the mailbox just is not set up yet,
    and a contact address that bounces is worse than an unpolished one that works.
    A live.co.uk address on a site arguing craft undercuts it, so this is the
    first thing to change once the mailbox exists. One line, and the close, the
    `mailto` and the metadata all derive from it.

    Same length as the intended address, 23 characters, so the measured ratio the
    close is sized from still holds — see the note on the address in AGENTS.md.
  */
  email: 'lloyd.turner@live.co.uk',
  domain: 'https://lloydturner.co.uk',

  hero: {
    // Line 2 is the claim, line 3 is the credibility. No employer in the
    // identity slot — that defines him by a company he's leaving, in an
    // industry he's leaving, on the first line anyone reads.
    name: 'Lloyd Turner',
    claim: 'I design and ship interactive products.',
    // "Companies like", not a list of three. Amazon was an agency contract
    // during the freelance period — real work, but naming it alongside two
    // employers implies a job that the CV further down the page contradicts,
    // and a claim a reader can disprove by scrolling is worse than a vaguer
    // one. The experience list names everything precisely.
    //
    // **Briefly changed to "Ten years of it: Google, MoonPay, and plenty on my
    // own" during the 2026-08-16 reframe, and reverted on request — he prefers
    // this line.** Worth keeping the note: the reframe's argument was that the
    // old line makes employment the credential, which is the frame being
    // dropped. That argument lost to the fact that this one simply reads
    // better, and the craft claim is carried by the line above it, by the About
    // block, and by Phasmatic sitting at 01. Leave it alone.
    credibility: 'A decade at companies like Google and MoonPay.',
  },

  about: {
    heading: 'About',
    paragraphs: [
      // Deliberately names no employers. The experience list sits directly
      // underneath and names all of them with dates, so repeating them here
      // spends the opening sentence on something the reader is about to be told
      // properly — and it was the second place the Amazon claim appeared.
      //
      // **Rewritten 2026-08-16 because it did not sound like him.** The version
      // before this read "mostly the complicated kind — where the interface is
      // the only thing standing between someone and a bad decision", and the
      // failure is worth naming so it does not come back:
      //
      // - **`statement — abstract payoff` is the site's tic.** It is in the old
      //   line, in the MoonPay CV summary twice, and in several claims. It is a
      //   rhythm that performs gravitas, and it is the single most identifiable
      //   thing about copy that was written to sound good rather than said.
      // - **There was no "I" in it.** It was a caption about a person rather
      //   than the person talking, on the one block of the site whose entire job
      //   is to sound like him.
      // - **The payoff was an abstraction.** Nobody says "the only thing
      //   standing between someone and a bad decision" out loud.
      //
      // The register to hold it to is his own Warble note, which works: first
      // person, concrete nouns, a real opinion, no flourish.
      //
      // **These two are his own draft, edited only where it repeated itself.**
      // That is deliberate and should stay that way: the block whose job is to
      // sound like him is the one block not to write for him. The single change
      // was "translating them into beautiful, usable products" following
      // "interactive products" one sentence earlier.
      //
      // **It is also a positioning change, not just a rewrite.** The previous
      // line sold competence at complexity to a hiring manager. This one leads
      // on craft and says who he wants to work with, because he does not want
      // to be bought as an employee — "I want the craft to be the thing that
      // earns me money. Shaders, not wallets." See the note at the top of this
      // file, which was rewritten the same day.
      'Over ten years designing and shipping digital brands and interactive products. I enjoy taking complex problems and turning them into something beautiful and usable.',
      'I build as well as design. Most of what’s above I shipped myself, using AI to close the gap between the Figma file and the thing that actually runs. I like working with ambitious brands that have a lot of imagination.',
    ],
  },

  sections: {
    work: {
      label: 'Work',
      heading: 'Selected work',
      // Rewritten 2026-08-16 with the audience. It read "Product design
      // leadership on interfaces where the stakes are legible in the numbers",
      // which is two employer words ("leadership") and one shareholder one
      // ("the numbers") on the line introducing the work — written to be
      // assessed rather than to be read by someone deciding whether to make
      // something together. This says what the list actually is.
      intro: 'Some of it made on my own, some with teams. Most of it I built as well as designed.',
    },
    built: {
      label: 'Built',
      heading: 'Built and shipped',
      intro: 'Things I designed and built myself, mostly at night.',
    },
  },

  // "Built" is gone as a destination: client work and solo work are one track
  // now, so a separate anchor would point at the middle of the same section.
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  // X is the primary surface for the posting plan and belongs at the front of
  // this list — but it is not here yet, on purpose. It was `https://x.com/`,
  // the bare domain with no handle, because the old site never linked one, and
  // a link that lands on a logged-out home page is worse than an absent one.
  // Add it back the day the account is real; nothing else has to change, since
  // both the hero nav and the closing links row are built from this array.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lloyd-turner-370837110/' },
  ],

  // Contact is not a section any more — it is the top half of the closing block
  // in components/Footer.tsx. A separate section put a utility layout directly
  // above a 16vw wordmark, so the sign-off was louder than the call to action.
  contact: {
    // Never painted. The close carries `#contact` for the nav, and a landmark a
    // link points at with no accessible name is announced as nothing at all.
    heading: 'Get in touch',
    // Deliberately not "hire me", "let's work together" or "available" — this
    // has to read the same to a hiring manager as it does to a client, which is
    // the whole positioning. It labels the address rather than instructing.
    eyebrow: 'Best reached by email',
    cvHref: '/resume/Lloyd Turner _ Product Designer.pdf',
    // No "newsletter", no subscriber count, no cadence there is no intention of
    // keeping. It sits under the address because anyone who came here to make
    // contact is already done a line above.
    subscribe: 'Occasional notes on what I’m building',
  },
} as const
