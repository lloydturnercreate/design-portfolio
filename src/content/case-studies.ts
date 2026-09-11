/**
 * Case studies, as narrative — and, since 2026-08-15, as ordered blocks.
 *
 * This replaced the Challenge / Approach / Results shape in `projects.ts`, which
 * is now deleted. That model was not merely differently organised — it was **the
 * reason the writing went wrong** — and these constraints are the fix:
 *
 * - **There is no bullet field.** The old `ProjectChallenge` and
 *   `ProjectApproach` carried `bullets`, `items` and `subsections`, and the
 *   MoonPay entry used almost nothing else: four grid items, four bulleted
 *   subsections, three more items, and barely a paragraph of connected prose on
 *   the page. Bullets let a reader skip the reasoning, and the reasoning is the
 *   entire thing a Staff or Principal hire is assessed on. A prose block is
 *   `string[]` of paragraphs and nothing else, so the format cannot be reached
 *   for.
 * - **Chapters are titled as story beats, not process stages.** "Challenge" and
 *   "Approach" tell a reader that a process was followed. "Two bad options"
 *   tells them what happened, and only the person who made the decisions can
 *   write it. Both of the sites this layout was rebuilt against use
 *   Overview/Challenge/Approach/Outcome, and it is the one thing not to copy
 *   from them.
 * - **Outcomes live inside the chapter that earned them**, not in a results
 *   panel at the end. A number attached to the decision that produced it reads
 *   as a consequence; the same number in a grid at the bottom reads as a
 *   scoreboard bolted onto a story.
 * - **Captions are required on every figure.** An uncaptioned image asks the
 *   reader to work out both what they are looking at and what was decided. The
 *   caption is where the picture is claimed as evidence of something.
 * - **Blocks are ordered, and imagery is the spine.** A chapter is a list of
 *   prose, figure and outcome blocks in whatever sequence the argument needs.
 *   The previous shape was `{ body[], figures[] }` — all the prose, then all the
 *   pictures — which made every image a footnote to a paragraph and was most of
 *   why the page read as a well-set document rather than as the work.
 *
 * A short study is not a second template. It is the same `Chapter` used twice
 * instead of five times — see `moonit` below, which is deliberately half the
 * length of `moonpay` because it is no longer the lead.
 */

export interface Figure {
  /**
   * Omit to render a placeholder that occupies the real space at the real
   * aspect, tinted from the study's accent. Dropping artwork in later is a
   * one-line change and nothing around it moves — the layout was never
   * provisional, only the picture.
   */
  src?: string
  /**
   * What the picture is evidence OF — not what it depicts. Required: this is
   * the sentence that turns a screenshot into an argument.
   */
  caption: string
  /**
   * Alt text on a real figure. On a placeholder it doubles as the brief — it is
   * rendered into the empty frame, so the page itself says what art is missing.
   */
  alt: string
  /** CSS aspect ratio, e.g. '16 / 9'. Used by placeholders and by `tall`. */
  aspect?: string
}

export interface Outcome {
  value: string
  label: string
}

/**
 * How wide a figure block sits.
 *
 * - `wide` — the content width, the same container the prose grid uses. The
 *   default. Imagery is still the spine of a case study rather than evidence
 *   appended to a paragraph; it simply shares the page's margin.
 * - `column` — aligned with the prose column. The exception, for a detail that
 *   is genuinely an argument for the paragraph beside it.
 *
 * **There was a third, `bleed`, which ran edge to edge.** It was removed on
 * request: at that scale the images stopped being part of a page and started
 * being interruptions of it, and nothing else on the site touches the viewport
 * edge. Everything now lines up on one margin — which is also what makes the
 * captions align with the prose above them without special-casing.
 */
export type Frame = 'wide' | 'column'

/**
 * A chapter is an ordered list of blocks.
 *
 * **This replaced `{ body[], figures[] }`**, which rendered all the prose and
 * then all the pictures — so imagery could only ever be a footnote to the
 * argument, indented to align with the text column. Ordering is the whole
 * point: a large image between two paragraphs paces the read, and the same
 * image at the end of the chapter is an appendix.
 *
 * There is still no bullet field, and that is still the point. A prose block is
 * `string[]` of paragraphs and nothing else, so the format cannot be reached
 * for.
 */
export type Block =
  | { kind: 'prose'; paragraphs: string[] }
  /** Numbers, shown inside the chapter that earned them. */
  | { kind: 'outcomes'; items: Outcome[] }
  | {
      kind: 'figure'
      /**
       * One figure, or two side by side. The count decides the arrangement —
       * the old model had `pair` declared per figure, which meant a group of
       * two was expressed twice and the two halves could disagree.
       */
      figures: Figure[]
      frame?: Frame
      /**
       * Crop to near viewport height rather than running at natural aspect.
       *
       * **Only for art that can survive a crop** — photography, renders,
       * environmental shots. A UI screenshot cropped to 85svh loses the content
       * that made it worth showing, which is why this is opt-in rather than a
       * property of the frame. At a normal viewport a 16:9 figure at content
       * width is already most of a screen tall.
       */
      tall?: boolean
      /**
       * Sit the figure on a wash of the study's accent, inset with padding.
       *
       * This is the one thing that stops a long page of dark imagery going
       * monotonous — a block that is visibly a different surface. Use it
       * sparingly; two in a row and it stops reading as punctuation.
       */
      tint?: boolean
    }

/** A link to something running, shown at the foot of a lite entry. */
export interface LiveLink {
  label: string
  href: string
}

export interface Chapter {
  /** A story beat. "Two bad options", not "The Challenge". */
  title: string
  blocks: Block[]
}

export interface CaseStudy {
  slug: string
  /** The employer or product, as it appears in the work index. */
  name: string
  /** The one-line claim. Same string the work index shows, so they cannot drift. */
  claim: string
  role: string
  period: string
  /**
   * What was owned, in one line. Explicit because the reader of a case study at
   * a company this size will silently wonder what was the team's — and a
   * question they answer for themselves is answered pessimistically.
   */
  scope: string
  /** One line, above the fold. The reason to keep reading. */
  outcome?: string
  /**
   * The whole of a **lite** entry, in place of chapters.
   *
   * A lite entry is **one untitled chapter** — the same `Block[]` a chapter
   * carries, rendered with no number and no title, because numbering a single
   * paragraph "01" is a table of contents for one item and a heading over it
   * says what the claim two screens up already said.
   *
   * Pass a bare string for the common case and it becomes one prose block. Pass
   * blocks when the entry has imagery, which must stay **ordered among** the
   * prose rather than appended after it — an array of paragraphs plus an array
   * of pictures is the `{ body[], figures[] }` shape this model was built to
   * replace, and it makes every image a footnote to a paragraph.
   *
   * Set this **or** `chapters`, never both.
   *
   * Two reasons a study is lite, and they are different:
   *
   * - **It is still moving.** Phasmatic and Warble are live and unfinished, so a
   *   structured retrospective would be writing a conclusion neither has
   *   reached. The honest version is shorter: what it is, why the built part is
   *   any good, and a link to go and use it.
   * - **It is self-directed, and old.** Raptor and Sukiyaki are 2023 and 2024,
   *   neither was client work, and neither is carrying the site's argument. They
   *   are here for range and for evidence that the visual work is real, which is
   *   a job the pictures do on their own. Both were chaptered until 2026-08-15;
   *   the prose was cut to what only the person who made the decisions could
   *   have written, and every figure was kept. They come off entirely once there
   *   is newer work to replace them.
   */
  note?: string | Block[]
  chapters?: Chapter[]
  /** Slug of the next study, so a page never dead-ends. */
  next: string
  /**
   * Whether this appears in the work index on the home page.
   *
   * Defaults to true, and as of 2026-08-15 nothing sets it to false — Raptor
   * and Sukiyaki were the only two and both are now on the index. The field
   * stays because the reasoning behind it does: the index is the one place on
   * the site where an extra entry actively costs something, since a reader
   * takes the standard from the weakest thing on the list. Set this rather than
   * deleting a study when that judgement changes; the page keeps working, the
   * *next* chain keeps running through it, and nothing 404s.
   */
  featured?: boolean
  color: string
  /**
   * Degrees to shift the field's hue on this study's page, so the surface
   * behind it leans toward the project's own accent. The case-study score sits
   * in the violet-blue end, so this is a nudge rather than a full rotation.
   */
  fieldHue?: number
  cover?: string
  /**
   * The hero image, directly under the claim — the page's first block.
   *
   * **Deliberately not `cover`.** The covers are card art: composed with an
   * empty half so text could sit over them in the old site's grid, and sized
   * for a small cursor preview. Run at content width they are mostly empty
   * space, and the small ones visibly upscale. So this is an explicit choice.
   *
   * Shaped like a `Figure` minus the caption, which means **`src` is optional
   * here too**: a study whose hero art does not exist yet renders a placeholder
   * at full size with its `alt` as the brief, rather than silently opening on
   * the detail row. Every page then has the same shape whether or not the
   * picture has been taken. Phasmatic is the current case — its effects are
   * WebGL canvases and cannot be captured from an automated browser.
   *
   * Renders at natural aspect unless `tall`, because none of the current art is
   * large enough to survive the magnification a viewport-height crop forces.
   * Videos are allowed — `Media` resolves the extension.
   *
   * **`narrow` is for art that is square or portrait**, and it is not a
   * stylistic choice — full content width is simply wrong for that shape. The
   * slot is ~1280px across, so a 1400×1310 asset renders about 1200px tall: more
   * than a viewport of mostly empty background with the subject marooned in the
   * middle. `tall` does not rescue it either, because cropping a centred phone
   * to 85svh cuts off the phone. Constraining the width is the only move that
   * leaves the subject at a sane size. Raptor is the case — a phone mockup in a
   * wide dark frame.
   */
  lead?: { src?: string; alt: string; aspect?: string; tall?: boolean; narrow?: boolean }
  /**
   * Set on lite entries: a link to the running thing, or to several. Warble
   * needs two — its current build and its frozen 2025 one, which nothing else
   * links to. Order is the order they render; a bare object still works.
   */
  live?: LiveLink | LiveLink[]
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

/**
 * MoonPay — the platform work. **SCAFFOLD, PARKED, NOT ROUTED.**
 *
 * Every `body` paragraph and every `figure` here is a brief in square brackets,
 * written to be replaced. It is deliberately **not** in `caseStudies`, so this
 * object is exported and unrendered: nothing routes to `/moonpay` and nothing
 * appears in the work index. That was the launch decision — a first entry
 * leading to bracketed briefs is worse than one study fewer, and a detailed
 * study of in-flight work at the current employer is the loudest possible
 * signal to colleagues while still employed and interviewing.
 *
 * Moonit carried the employer name for a while as "Moonit (MoonPay)", so the
 * credential still landed on the index without a study that could not yet be
 * written. That parenthetical went on 2026-08-16 — the site stopped leading on
 * credentials, and bracketing a company onto a product name to make sure a
 * reader notices the employer is the move being dropped. MoonPay is named in
 * the experience list a scroll below the index, which is enough.
 *
 * Add this back to the array when the copy exists and the timing suits.
 *
 * The spine is kept below, so the chapters have something to hold when it does:
 *
 * MoonPay's surface is mostly somebody else's screen. The widget is the entire
 * product from a partner's point of view, so time-to-transaction is not a UX
 * nicety — it is the partner's conversion rate, which is what wins and loses
 * the contract. That is a materially stronger argument than Moonit's, because
 * it ends at revenue rather than at seconds, and it is the one thing on this
 * site that evidences design decisions with a commercial consequence.
 *
 * Two constraints carried over from the conversation this came out of:
 *
 * - **Shipped work only.** No in-flight designs, no roadmap.
 * - **No named partners** unless the relationship is publicly announced, and
 *   then only the announced part. An unannounced client name on a personal site
 *   is the kind of mistake that ends a conversation rather than starting one.
 */
export const moonpay: CaseStudy = {
  slug: 'moonpay',
  name: 'MoonPay',
  claim: '[The claim — one line, the problem rather than the product]',
  role: 'Product Design Lead',
  period: '2024 — now',
  scope: '[What was owned, in one line]',
  outcome: '[The one fact worth putting above the fold]',
  color: '#7B3FF2',
  // 0 on purpose. Tinting the field toward the project's violet was tried and
  // reverted — see the note on CASE_STUDY_KEYFRAMES. The page should read as the
  // same surface as the home page, and the accent already appears where it
  // belongs, on the dot beside the company name.
  fieldHue: 0,
  // Payments imagery — a card reader and coins. It suits this study rather than
  // Moonit, which is why it stayed here when Moonit split off with its own.
  cover: '/project-covers/moonpay.png',
  next: 'moonit',

  meta: {
    title: '[Title — the claim, once written]',
    description: '[Description — one sentence, no unannounced partner names]',
    keywords: [
      'product design',
      'payments',
      'conversion',
      'design systems',
      'embedded interfaces',
      'MoonPay',
    ],
  },

  chapters: [
    {
      title: 'The transaction is somebody else\u2019s screen',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            '[The setup. What the on-ramp actually is and where it appears \u2014 embedded inside partner products rather than visited directly. This is the chapter that has to make a reader who has never thought about payments infrastructure understand why the surface area is small and the stakes are not.]',
            '[Why that framing changes the design problem: the widget is the whole product from the buyer\'s point of view, so it is simultaneously the interface, the sales asset and the integration. Name the constraint that follows \u2014 you are designing inside a container you do not control.]',
          ],
        },
        {
          kind: 'figure',
          tall: true,
          figures: [
            {
              aspect: '21 / 9',
              alt: 'Establishing shot \u2014 the widget in situ, inside a real partner surface, at full width. The single image that has to land the idea that this runs inside other people\u2019s products. Shipped integrations only.',
              caption: '[Caption \u2014 what this is evidence of, not what it depicts]',
            },
          ],
        },
      ],
    },

    {
      title: 'Time to transaction',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            '[The core mechanism chapter. The metric, why it was the right one, and what it made arguable that was previously a matter of taste. Same move as Moonit\'s time-to-trade, but this one has a commercial consequence attached \u2014 say what it is.]',
            '[What was cut, moved or collapsed. Be specific about the interactions removed and what each cost, because the specificity is the whole difference between this and a redesign write-up.]',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '16 / 9',
              alt: 'The flow before and after, annotated. The argument is a subtraction, and subtraction is the one thing a single screenshot cannot show.',
              caption: '[Caption]',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            '[The trade-off you accepted. Every real speed decision has one; the chapter is not credible without it.]',
          ],
        },
        {
          kind: 'outcomes',
          items: [
            { value: '[Figure]', label: '[What it measures \u2014 externally disclosed numbers only]' },
            { value: '[Figure]', label: '[What it measures]' },
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '4 / 3',
              alt: 'The shipped surface, close in. Detail rather than establishing \u2014 this sits beside the paragraph it is evidence for.',
              caption: '[Caption]',
            },
            {
              aspect: '4 / 3',
              alt: 'The same surface under a harder condition \u2014 an error, a slow network, an unsupported region. Failure states are where a payments interface earns its trust.',
              caption: '[Caption]',
            },
          ],
        },
      ],
    },

    {
      title: 'Coming back',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            '[Retention. The dashboard and account work, and the shift it represents \u2014 from a one-time on-ramp somebody passes through to a surface with a reason to return. Say what the reason is; that is the design argument.]',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '2 / 1',
              alt: 'The dashboard at full width. Shipped state, real structure \u2014 this is the chapter\u2019s main piece of evidence and the one most likely to be skimmed to.',
              caption: '[Caption]',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            '[What you built to support it, and what you deliberately did not. The restraint is as much the point here as on Moonit \u2014 a dashboard is the easiest place in a product to add everything.]',
          ],
        },
      ],
    },

    {
      title: 'Selling with the product',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            '[The commercial chapter, and the reason this study outranks everything else on the site. Design decisions that made the platform the thing a corporate buyer chose \u2014 the interface as the pitch rather than a thing that supports one.]',
            '[Evidence, without naming anyone unannounced. "A prediction-market platform" is a legitimate way to describe a client whose name is not yours to publish, and it costs less force than it appears to.]',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '4 / 3',
              alt: 'Customisation or theming across partner surfaces \u2014 the same system inside two visibly different products. Shipped integrations only.',
              caption: '[Caption]',
            },
            {
              aspect: '4 / 3',
              alt: 'Second integration, for the same comparison. The argument is that one system absorbs both, which is only visible when they sit side by side.',
              caption: '[Caption]',
            },
          ],
        },
      ],
    },

    {
      title: 'Looking back',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            '[The reflection. One decision you would take further and one you would make differently, both specific. This is the chapter that reads as senior, because it is the one nobody can write unless they made the calls \u2014 the Moonit study\'s version is a working model.]',
          ],
        },
      ],
    },
  ],
}

/**
 * Moonit — 2024. Its own entry, not MoonPay's.
 *
 * It was written as the lead MoonPay study and is neither any more: the product
 * has been sunset, and it is not the work the site should be arguing from. So
 * it is separated rather than deleted — the reasoning in it is good, and a
 * shipped 0-to-1 trading product is still worth a page. It just is not the
 * headline, and it should not be what the MoonPay name resolves to.
 *
 * Two consequences of the split, both deliberate:
 *
 * **Halved.** Two chapters instead of five. The scope line now carries what the
 * "One designer, two companies" chapter used to argue, and the reflection that
 * closed the study is the last paragraph of the second chapter rather than a
 * chapter of its own. Nothing was cut for being weak — it was cut for being
 * long, which is the correct reason on a study that is no longer leading.
 *
 * **The domain vocabulary comes back, on purpose.** The previous version fought
 * to keep "meme coin" and "degen" off a page whose own screenshots are full of
 * both, and the copy lost that fight the moment anyone looked at the pictures.
 * Named as its own thing, the artwork matches its subject and the tension is
 * gone. What is still true is that this vocabulary appears *here* and nowhere
 * else on the site — not on the home page, not in the CV list, not in MoonPay's
 * study above.
 *
 * **The figures stay ranges.** The exact profit and volume numbers were never
 * externally disclosed, so they are not published here or in the meta
 * description.
 */
export const moonit: CaseStudy = {
  slug: 'moonit',
  // Just "Moonit" as of 2026-08-16. It read "Moonit (MoonPay)", a parenthetical
  // added to get the current employer onto the index at all while the MoonPay
  // platform study sat parked as an unrouted scaffold.
  //
  // That was an argument about credentials, and credentials stopped being what
  // this site leads on — the reframe the same day put Phasmatic at 01 and took
  // the job titles out of the metadata. A company name bracketed onto a product
  // name to make sure a reader notices the employer is exactly the move being
  // dropped. It is still named where it is doing real work — in the study's own
  // copy, where the Helio acquisition is the reason the brief looked the way it
  // did, and in the experience list a scroll under the work index. Not in
  // `scope` or the meta, which is fine: those describe what was made.
  //
  // It comes back as its own entry when the platform study is written.
  name: 'Moonit',
  claim: 'A real-time trading terminal, 0 to 1',
  // The job title from the CV, verbatim. It was "Product Design Lead", which
  // described what was owned on this project rather than the title on payroll —
  // defensible, but the experience list sits on the same page a scroll away and
  // said something different. That is the exact shape of the Amazon problem:
  // a reader who can find the discrepancy without leaving the page. What was
  // owned is stated properly in `scope` below, where it costs nothing.
  role: 'Senior Product Designer',
  period: '2024',
  scope: 'Sole designer — strategy, brand, interface, motion',
  outcome: 'Nine figures in volume. Profitable inside a year.',
  color: '#D6FF00',
  fieldHue: 0,
  // The lead image doing double duty as the card, cropped to fill. The two
  // product screenshots tried before it both failed at card size for the same
  // reason: `home-fun.png` centres on a "your wallet is ready" modal, so the
  // crop delivered a dialog box, and `home-pro.png` is a dense token list whose
  // rows dissolve into noise at 300px. The signage is the one Moonit asset
  // built to be read at a distance, which is exactly what a cursor preview is.
  cover: '/projects/moonit/signage-2025.jpg',
  /*
   * Exported from the source Figma at 2x on 2026-08-15, replacing screenshots
   * that were visibly soft at content width.
   *
   * **The signage typo was never in the artwork.** `signage.png` on disk reads
   * "TOKEN TRASING PLATFORM" and was recorded as a launch blocker needing a
   * redraw; the Figma source says "TRADING" correctly, so the misspelling only
   * ever existed in that one export. `signage-2025.jpg` is the re-export and it
   * is back on the page. The old file is unused and can go.
   *
   * Still at the old resolution and worth re-exporting from the same file:
   * `card-annotated.png`, `buy-sell-cards.png`, `04.png`, `launch-asset.png`.
   */
  // The signage still, at 2400x1664 and sharp. Three generated video versions
  // of this shot were tried on 2026-08-16 and all three were dropped — none was
  // good enough to be worth trading a crisp 2400px still for a soft upscale.
  // The best of them was 2080x1440 and still lost on the loop. Revisit with a
  // properly rendered pass rather than a generated one.
  //
  // The card uses the same file, so the index and the page open on the same
  // image. `Media` resolves video by extension, so a good take drops straight in.
  lead: {
    src: '/projects/moonit/signage-2025.jpg',
    alt: 'The Moonit mark on two illuminated light boxes, in acid yellow and blue',
  },
  next: 'phuture-finance',

  meta: {
    title: 'Moonit — a real-time trading terminal, 0 to 1',
    description:
      'Sole designer on Moonit, a real-time Solana trading terminal built from nothing in 2024 — nine figures in volume, profitable inside a year.',
    keywords: [
      'product design',
      '0-to-1',
      'trading terminal',
      'real-time interfaces',
      'information density',
      'design systems',
    ],
  },

  chapters: [
    {
      title: 'Two products, and traders wanted both',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Moonit traded Solana meme coins — an asset class where a position can double or evaporate inside a minute, and where the people trading are doing it all day, at speed, with their own money. Everything interesting about the product is a consequence of that clock.',
            'The market had settled into two shapes and neither was right. One was the power tool: deep functionality, extended trading controls, a heavy layout that assumed you knew what you were doing. The other was the social one — lighter, funnier, built around memes and community, with a fraction of the tooling. Traders used both, for different things, and the assessment I opened with said so plainly.',
            'So the brief contradicted itself on purpose: a powerful trading tool with deep functionality, and at the same time fewer tools, more fun, more replies than stats. MoonPay had just acquired Helio, and with it the credibility of a regulated payments company — which made the opening narrow and specific. Build the fast, social thing as infrastructure rather than as a casino.',
            'I made time-to-trade the design KPI. Not satisfaction, not task success — the number of seconds between a trader seeing something and being in a position. It was the only metric that described the actual job, and it turned every layout argument into an arithmetic one.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/moonit/home-fun.png',
              alt: 'The Moonit home screen in fun mode — a meme banner, condensed navigation, and stacked token cards',
              caption:
                'Fun mode. Condensed navigation, imagery given room, and the trade controls still on every card — the light end of the range, without giving up the tooling that makes it usable.',
            },
          ],
        },
      ],
    },

    {
      title: 'The first designs were too childish',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'That is close to a direct quote from the feedback, and it was right. The early work leaned so far into the social read that it stopped signalling a powerful tool — and for a product asking people to move real money at speed, looking playful is not a neutral cost. The same round asked for the three-column view serious traders already worked in, and for the original brand colour back.',
            'The obvious response is to split the difference and land somewhere bland. Instead the interface got two modes. Fun is the screen above: condensed navigation, imagery given room, and the trade controls still on every card. Pro is three columns pinned to the three moments a token passes through — new, lifting off, graduated — each with its own filters, so a trader can watch all three entry points at once instead of switching between them.',
            'What makes that affordable rather than two products is that the token card is the same component in all of it: fun, pro, desktop, mobile. One thing to build, one thing to change, and the layout around it carries the difference in tone. It also means a trader moving between modes never has to relearn the row they actually make decisions from.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/moonit/home-pro.png',
              alt: 'Pro mode — three columns headed New tokens, Lift off and Graduated, each with its own filter control',
              caption:
                'Pro mode. The three columns are the three states a token moves through, so the screen is a pipeline rather than a list — and every card in it is the same component fun mode uses.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Measured against time-to-trade, the conventional pattern was indefensible. Browse, click, load a detail page, buy: four interactions, one of them a page load, at exactly the moment a price is moving. So the trade went onto the card — every row carries its own amount input and execute control, and quick buy bypasses the token page entirely and goes straight to the transaction.',
            'The cost of putting more on a card is that it stops being scannable, so the secondary controls — watchlist, quick buy — only appear on hover. Hover does not exist on touch, where the same controls come in on a swipe. That is more work than one layout for both, and it is the difference between a card that works on a phone and a card that was designed on a desktop.',
          ],
        },
        {
          kind: 'outcomes',
          items: [
            { value: 'Under 2s', label: 'From seeing a token to holding it' },
            { value: '4 → 1', label: 'Interactions to take a position' },
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/moonit/card-annotated.png',
              alt: 'Annotated feed rows showing the inline amount input and execute control',
              caption:
                'The card is the terminal. Putting the amount and the execute control on the row itself removed the detail page from the critical path — the single change that did most of the work on time-to-trade.',
            },
            {
              src: '/projects/moonit/buy-sell-cards.png',
              alt: 'Two token cards carrying inline buy and sell controls',
              caption:
                'Both directions live on the card. Exit matters more than entry in this market, so selling was never allowed to cost more interactions than buying did.',
            },
          ],
        },
      ],
    },

    {
      title: 'Volatile asset, solid instrument',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'The hardest problem was not speed, it was tone. Traders had to believe the platform was quick enough to be worth using and stable enough to hold their money — and the visual language that signals the first usually undermines the second.',
            'So I built it as an instrument. A dark surface where colour only ever means something — direction and state, never decoration — and a grid that holds its alignment as figures change width, so a moving number never moves anything around it. The reference point was a trading desk rather than a consumer app, because the promise it makes is the right one. An instrument does not ask you to trust it. It shows you it is measuring correctly and lets you conclude that yourself.',
            'The chart is where that got negotiated. Left alone I would have drawn something more minimal than the category expects; traders expect TradingView and read anything else as a toy. What shipped is a lighter build of the thing they know — familiar enough to be trusted at a glance, quiet enough not to dominate a screen whose real job is the token list.',
            'Error states carried more of this than anything else. On a product where a mistake is unrecoverable, the failures are the credibility: every rejection says what happened, whether the position was taken, and what to do next. Vague failure is the fastest way to make a fast product feel dangerous.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/moonit/04.png',
              alt: 'Search results across chains, each row carrying market cap, age and contract address in aligned columns',
              caption:
                'The grid is the argument. Every figure sits in a fixed column with tabular numerals, so a price updating mid-scan changes the number and moves nothing around it — the difference between an instrument and a feed.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The identity ran the same problem in miniature. Three directions went up: a rocket, which was the most distinctive shape but would have dragged the whole brand into space imagery; a cursor, which was flexible and generic; and one that resolves as all three at once — cursor, rocket, and an M. The third won because it was the only one that could carry the tone without committing the marketing to a theme.',
            'I was the only designer on it — strategy, brand, interface, motion and the launch assets — so the constraint was never craft, it was triage. Most of the value I added was in the argument about what did not get made rather than in the artefacts.',
          ],
        },
        {
          // The other half of the scale argument. The light boxes lead the page,
          // so this is the mark at four storeys rather than at signal size —
          // together they make the claim that one arrow survives both ends.
          kind: 'figure',
          figures: [
            {
              src: '/projects/moonit/banners.jpg',
              alt: 'Moonit banners hung between the columns of a classical stone building',
              caption:
                'Hung against a bank rather than a billboard, on purpose. The whole positioning argument was infrastructure rather than casino, and the environment a brand is photographed in makes that case before any copy does.',
            },
          ],
        },
        {
          kind: 'figure',
          tint: true,
          figures: [
            {
              src: '/projects/moonit/launch-asset.png',
              alt: 'A Moonit launch asset for a partner chain',
              caption:
                'The same system going outside. Campaign work runs loud and illustrative; the constraint keeping it one system is that the type, grid and signal colour are the interface’s, unchanged.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The decision I would take furthest is the two modes. They were scoped as a way to settle an argument about tone and turned out to be the product’s actual structure — but they shipped as two layouts rather than as a system that knows which one a given trader wants. The thing I would do differently is the cut list: a single metric applies pressure evenly to everything, including the moments where a trader ought to slow down — a first trade, an unusually large one — and those deserved friction I did not design, because the metric I had chosen counted friction as failure everywhere.',
          ],
        },
      ],
    },
  ],
}

/**
 * Phuture — 2021–2023. Ported from the old `Project` model on 2026-08-15.
 *
 * The source was the copy running on the live site, reorganised rather than
 * rewritten: the old entry was four grid items, three bulleted subsections and
 * a three-metric results panel, and almost every sentence in it was worth
 * keeping. What it could not do was argue, because the shape it was in let a
 * reader skip the reasoning.
 *
 * **On the vocabulary.** The recorded blocker was that this page was
 * "crypto-native throughout" — "the ETF of Crypto", "degen casino", an
 * "Anti-Crypto" brand section. Those are gone, and so is every use of the
 * category as an identity. What is *not* gone is the plain naming of what the
 * product was, because this page hits exactly the wall Moonit hit: its own
 * screenshots read "Total exposure to Decentralised Finance" in 60px type, and
 * copy that talks around them loses the moment anyone looks at the pictures.
 * So the domain is stated where it is load-bearing and nowhere else — no
 * marketing vocabulary, and none of it on the card, the page title, the meta
 * description or the keyword list.
 *
 * The one paragraph with no source in the old copy is the reflection that
 * closes the last chapter. It is written from what the rest of the study
 * already argues, and it is the paragraph to check first.
 */
export const phuture: CaseStudy = {
  slug: 'phuture-finance',
  name: 'Phuture',
  claim: 'An incomprehensible financial mechanism, reduced to one switch',
  role: 'Head of Design',
  period: '2021 — 2023',
  scope: 'Product, design system, research and brand — one designer, five engineers',
  outcome: '$8M+ held on the platform, reached in a bear market, at 211-day average retention.',
  color: '#3e1fff',
  fieldHue: 0,
  /*
    The product on a tablet, and the only light cover in the set — which is
    fine, because the preview shows one card at a time and they are never seen
    together. Against a near-black page it reads as a screen that is actually on.

    It replaced `/project-covers/phuture.png`, which was the visible failure:
    that file is 2842×1458 with the tablet sitting right of centre, so a
    portrait crop took the empty middle and cut the device in half at the card's
    right edge.
  */
  cover: '/projects/phuture/phuture-1.avif',
  // The mark as an object: abstract, brand-led and 1440x1080, which holds up at
  // full width. It was the left half of chapter 3's pair; leading with it is a
  // better use of the one non-screenshot image this study has.
  lead: {
    src: '/projects/phuture/phuture-4.webp',
    alt: 'The Phuture mark rendered as a three-dimensional object on a plinth',
  },
  next: 'sukiyaki',

  meta: {
    title: 'Phuture — an incomprehensible financial mechanism, reduced to one switch',
    description:
      'Head of Design at Phuture. Abstracted a basket of rebalancing logic into a single set-and-forget investment product — $8M+ held in a bear market, at 211-day average retention.',
    keywords: [
      'product design',
      'design system',
      'complex interfaces',
      'index funds',
      'passive investing',
      'financial product design',
      'trust and transparency',
    ],
  },

  chapters: [
    {
      title: 'Diversification you had to do by hand',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'In 2021, holding a diversified position in this market meant holding it piece by piece. Ten or more assets, a separate contract approval for each one, and a rebalance by hand every time the weights drifted away from the thing you actually wanted to own. The market moved continuously, so the work never finished. A portfolio was a maintenance job rather than a holding.',
            'None of that cost had anything to do with the investment thesis. It was operational overhead, and it selected hard for the kind of person who enjoyed the operations — which is a small audience, and not the one the product was for. Everyone else either paid in time they did not want to spend or stayed out.',
          ],
        },
        {
          // `tall`: a lifestyle photograph, which is the one kind of art on this
          // site that survives a crop — there is no interface detail in it to
          // lose. Cropping a screenshot to 85svh throws away the content that
          // made it worth showing.
          kind: 'figure',
          tall: true,
          figures: [
            {
              src: '/projects/phuture/phuture-3.webp',
              alt: 'The Phuture site open on a laptop, showing the company page and its three principles',
              caption:
                'Site and product were one continuous surface rather than two properties with a handoff between them. Someone who arrived interested never had to start again somewhere else — the fix to the leak, before any of the interface work began.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Two things made it worse. Protocols split their marketing site from their product, so the moment someone became interested they were made to switch context and start again, which broke the funnel at its narrowest point. And the interfaces they landed on were gamified — leaderboards, confetti, numbers that flashed. Every one of those signals says "this is a game" to an audience deciding whether to trust something with money.',
            'So the brief I set was this: make a genuinely volatile instrument feel as manageable as a savings account, without misrepresenting a single thing about the risk. The second half of that sentence is what made it a design problem rather than a marketing one.',
          ],
        },
      ],
    },

    {
      title: 'One switch',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Underneath, buying a single unit of the index fired a basket of swaps and contract interactions. The design decision was to show none of it. The interface presents one product to buy, one number that matters, and one action.',
            'That meant moving the interface\'s attention off the constituents — AAVE, UNI, COMP, and the rest of the basket — and onto the product itself. Decision fatigue is roughly proportional to the number of things a person believes they are supposed to have an opinion about, and the entire pitch of an index is that you are buying the decision not to have those opinions. An interface that keeps listing the holdings hands them back.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-1.avif',
              alt: 'The index product page — one buy panel, performance and returns below',
              caption:
                'One product, one panel, one action. Everything the basket is doing underneath happens between pressing confirm and the position existing, and none of it is the reader\'s problem.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Rebalancing followed the same rule inverted. The index rebalanced monthly, and every version of that event was framed as value delivered rather than action required: something that happened for you, reported afterwards, never a task sitting in a queue. It is the difference between a fund telling you it rebalanced and a wallet telling you it needs you.',
            'The trade-off is real and the people on the wrong side of it are the loudest. Abstraction costs control, so the controls stayed — the asset you paid with, slippage tolerance, the rest of it — one layer down, behind a gear. Clean default path, escape hatch present, and the escape hatch designed properly rather than dumped in a settings screen. What it tested was whether retail investors would trade granular control for a one-click position, and they did.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-5.avif',
              alt: 'A sequence of panels: buy, settings with slippage tolerance, and the asset selector, in light and dark',
              caption:
                'The escape hatch, designed. Slippage tolerance and the funding asset sit one layer down rather than being removed — abstraction that cannot be opened is a black box, and a black box asks for trust it has not earned.',
            },
          ],
        },
        {
          kind: 'outcomes',
          items: [
            { value: '$8M+', label: 'Held on the platform, post-launch, in a bear market' },
            { value: '10+ → 1', label: 'Approvals to hold a diversified position' },
          ],
        },
        {
          kind: 'figure',
          tint: true,
          figures: [
            {
              src: '/projects/phuture/phuture-2.avif',
              alt: 'The same product page on mobile, in dark and light themes',
              caption:
                'The same hierarchy holds at phone width and in both themes: name, one sentence on what it tracks, three figures, then the action. Nothing reflows into a different argument.',
            },
          ],
        },
      ],
    },

    {
      title: 'Hide the mechanism, expose the data',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Hiding the plumbing creates an obvious risk: a product nobody can see into is asking to be taken on faith, and this audience had been burned by exactly that. So the rule was one-directional. The mechanics were hidden; the data was not.',
            'Composition, weights and fees were stated on the surface rather than linked to a document — the things a sceptical reader goes looking for, put where they were looking. Transparency was doing competitive work as well as ethical work: the products this was up against were the ones that did not survive that question.',
            'The visual language pushed the same way. Balanced layouts, generous spacing, a muted palette, quiet type. The reference point was a bank rather than a game, and it separated the product from the gamified set at a glance, before anyone read a word of it.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-6.webp',
              alt: 'A wall of Phuture social posts, campaign stickers and announcement graphics',
              caption:
                'The same system going outside. Community growth ran on explanation rather than incentives — a whitepaper, a research thread, an accelerator announcement — which is slower and produces the kind of holder who is still there 200 days later.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The charts mattered more than any of that. Analytics were designed to emphasise long-term movement rather than micro-volatility — candlesticks make a five-minute move look like an event, and a person shown an event will act on it. Damping that down is the single change most responsible for the retention figure, because the behaviour it suppressed was panic selling.',
          ],
        },
        {
          kind: 'outcomes',
          items: [{ value: '211 days', label: 'Average retention, well above the category' }],
        },
      ],
    },

    {
      title: 'One system, more than one product',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'The system had to outlive the first index, and design systems are only ever proven by the second thing. It was architected so that additional products — a second index, then yield products — could launch without renegotiating the core navigation, which took new vehicles from a quarter to a few weeks.',
            'The other half of that was teaching. An interface that hides its mechanism explains nothing by itself, so concepts like weighting and yield were explained in place, at the point of use, rather than in documentation nobody opens. Someone could get through the whole product without reading anything, and still learn what they owned if they wanted to.',
          ],
        },
        {
          kind: 'outcomes',
          items: [
            {
              value: '114%',
              label: 'Community growth, 7k to 15k, on content rather than incentives',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The decision I would take furthest is the transparency work. It was scoped as a trust device, and it turned out to be the thing the most valuable users read first — and it was still the least designed surface in the product when I left. The thing I would do differently is the first run. We leaned on tooltips to carry a job that needed a real explanation up front, and a holder who never quite learns what they own is a holder who sells on the first bad week. The retention number says that mostly worked; it does not say it could not have been better.',
          ],
        },
      ],
    },
  ],
}

/**
 * Raptor — 2023. Self-directed, not client work, and **lite** since 2026-08-15.
 *
 * On the work index. It was unfeatured on the grounds that the index takes its
 * standard from its weakest entry — still true, but the index lost Margin and
 * Refiner the same day, and a short, self-directed study of irreversible actions
 * is a stronger entry than a tool with no page at all.
 *
 * **Cut from two chapters to two paragraphs, with every figure kept.** It went
 * through the same rewrite twice. First out of the old model, where it was three
 * bulleted subsections under "Design Approach" — bullets like "clean,
 * distraction-free interface that reduces cognitive load" describe an intention
 * rather than a decision, which is why it read thin. Then out of chapters
 * altogether, because the chaptered version was structurally a full study making
 * a case that a self-directed piece from 2023 does not need to make. What
 * survives is the one genuinely good idea in it — irreversibility changes what
 * clarity is *for* — and the pictures, which were always doing most of the work.
 */
export const raptor: CaseStudy = {
  slug: 'raptor',
  name: 'Raptor',
  claim: 'Trust and security UI where a user error is unrecoverable',
  role: 'Product and visual design',
  period: '2023',
  scope: 'Self-directed — interface, visual system, prototyping, launch art',
  // Was "a self-directed study in designing for actions that cannot be undone",
  // which restated the claim two lines above it and spent the Outcome column on
  // the word "self-directed" — a fact about how the work came about, which now
  // sits in `scope` where Sukiyaki's does. This is what the study actually
  // proves, and it is the frame the whole second chapter rests on.
  outcome: 'At the point of commitment, one control and nothing else.',
  color: '#FFD226',
  fieldHue: 0,
  // 1984×2788 — the only genuinely portrait source art on the site. At 0.71
  // against the card's 0.89 it is the one cover cropped from the *top and
  // bottom* rather than the sides, so widening the card tightens this one
  // slightly while loosening every other. Chosen over `raptor-2.avif`, the same
  // composition, which is already on the page as a figure.
  cover: '/projects/raptor/Raptor-02.png',
  /*
    The swap completing, as video: an empty phone, "Swapping… 10 SOL", then
    "Transaction complete" with the accent arriving on the figure. Twelve
    seconds, muted and looping — `Media` resolves the extension.

    **It shows the study's own outcome line happening**, which no still can:
    the argument is that the accent colour is held back for the moment of
    commitment, and here it is being held back and then spent. It replaced
    `raptor-3.avif`, a 3D render of the same completed screen — the better
    photograph, but the end of the sequence rather than the sequence, and
    running both showed "transaction complete" twice on one page.

    `narrow` because it is 1400×1310. See the note on `lead`.
  */
  lead: {
    src: '/projects/raptor/raptor-6.mp4',
    alt: 'A swap completing on a phone: the amount, then confirmation, then the total arriving in the accent colour',
    narrow: true,
  },
  next: 'phasmatic',

  meta: {
    title: 'Raptor — trust and security UI where a user error is unrecoverable',
    description:
      'A self-directed study in designing for irreversible actions, where clarity is a safety mechanism rather than a style choice.',
    keywords: [
      'UI design',
      'visual design',
      'product design',
      'security UX',
      'irreversible actions',
      'trust and safety design',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Almost every interface convention we have assumes a way back. Undo, drafts, a support queue, a chargeback — the reason it is acceptable to make an interface merely good is that being wrong is survivable. Raptor is a self-directed study in what happens to those conventions when it is not: send to the wrong address and the money is gone, with nobody to appeal to. Legibility and restraint stop being taste at that point and start being the safety mechanism, because there is no confirmation email and no reversal behind them.',
      ],
    },
    {
      kind: 'figure',
      tall: true,
      figures: [
        {
          src: '/projects/raptor/Raptor-1.png',
          alt: 'The Raptor welcome screen on a phone, showing account selection and options to connect or create',
          caption:
            'The first screen sets the terms. One identity, the accounts beneath it, and two quiet routes out — nothing here is trying to be exciting, because the product it opens is one where excitement is a warning sign.',
        },
      ],
    },
    {
      kind: 'prose',
      paragraphs: [
        'It also rules out the obvious answer. The standard response to risk is more confirmation, and past a point that makes things worse — people learn the shape of a warning and click through it without reading. So the safety had to come from the layout instead: one signal colour held back for the moment of commitment and kept off every decoration, numbers in fixed tabular columns so a value never moves as it updates, and a commitment screen carrying the amount, what it converts to, and the single control that does it.',
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/raptor/raptor-2.avif',
          alt: 'The portfolio screen: total balance, a sparkline, four actions, then holdings',
          caption:
            'Total first, movement second, actions third, holdings last — the order someone actually asks the questions in, rather than the order the data arrives in.',
        },
        {
          src: '/projects/raptor/raptor-4.avif',
          alt: 'An asset detail screen beside the swap screen with its numeric keypad and single trade button',
          caption:
            'The commitment screen carries one control. Everything that could compete with it — navigation, secondary actions, anything decorative — is gone by the time the amount is being entered.',
        },
      ],
    },
    {
      kind: 'figure',
      tall: true,
      figures: [
        {
          src: '/projects/raptor/raptor-5.avif',
          alt: 'A Raptor billboard mounted above shopfronts on a London street',
          caption:
            'The same restraint outdoors, which is the harder test: one screenshot, the mark, and the stores. A category that advertises with slogans is a category where showing the product reads as confidence.',
        },
      ],
    },
  ],
}

/**
 * Sukiyaki — 2024. Self-directed brand and site work for a restaurant, and
 * **lite** since 2026-08-15, like Raptor and for the same reason.
 *
 * On the index for range rather than for the argument the rest of the site is
 * making. It is the only thing here that is not a financial interface, which is
 * exactly what it is useful for — four studies about money in a row invites the
 * reading that money is all there is. That job is done by the pictures, which is
 * most of why this one lost its chapters with nothing much lost.
 *
 * The original was five challenge bullets, four bulleted subsections and five
 * results bullets — 250 words of intention and no decisions. The chaptered
 * rewrite fixed that and then overshot in the other direction: a systems
 * argument, at full length, about a restaurant site. What is left is the
 * research premise, which is real and is his, and the work itself.
 */
export const sukiyaki: CaseStudy = {
  slug: 'sukiyaki',
  name: 'Sukiyaki',
  claim: 'The joy of eating together',
  role: 'Brand and product design',
  period: '2024',
  scope: 'Self-directed — research, identity, art direction, interface, motion',
  // The outcome is the study's own test, stated as a result: the last chapter
  // argues that a type and colour system which only works at screen scale was
  // never a system, and the billboard is where that gets checked. It replaced
  // "the one piece on this site that is not a financial interface", which was a
  // fact about the portfolio sitting in a column headed Outcome.
  outcome: 'One system, holding from a menu row to a billboard.',
  color: '#626f70',
  fieldHue: 0,
  // The billboard. It replaced `/project-covers/sukiyaki.png`, whose siblings
  // are nearly empty frames — the `-mobile`, `-tablet` and `-desktop` variants
  // are a few characters of faint type on black and carry no image at all.
  // This is the only warm cover in the set, and the one that says "restaurant"
  // before anything is read: ivy, two pots from above, and the brand line.
  cover: '/projects/sukiyaki/sukiyaki-7.webp',
  // A video lead, which `Media` handles by extension. Twenty seconds, muted and
  // looping — the only moving lead on the site, and it belongs on the one study
  // whose subject is atmosphere rather than mechanism.
  lead: {
    src: '/projects/sukiyaki/sukiyaki-4.mp4',
    alt: 'The Sukiyaki site in motion',
  },
  next: 'warble',

  meta: {
    title: 'Sukiyaki — the joy of eating together',
    description:
      'Self-directed brand and site design for a Japanese restaurant built around a communal dish: cultural research, a closed type and colour system, and a booking flow that stays out of the way.',
    keywords: [
      'brand design',
      'art direction',
      'web design',
      'typography',
      'design system',
      'hospitality',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Sukiyaki is a communal dish — a pot in the middle of the table that everyone cooks from at once — so the identity is built on the meal as a social event rather than a menu item. The research went into Edo-period printing and traditional palettes, and what it kept returning was not motif but discipline: balance, negative space, a refusal to fill the frame. That finding is useful precisely because it is unglamorous. The obvious move with a Japanese restaurant is decoration, and decoration is what makes hospitality sites look the same as each other.',
      ],
    },
    {
      kind: 'figure',
      tall: true,
      figures: [
        {
          src: '/projects/sukiyaki/sukiyaki-1.avif',
          alt: 'The Sukiyaki site open on a laptop, showing the story section between two photographs',
          caption:
            'Photography carries the warmth; the type stays out of its way. The only colour in the layout is in the images themselves — a rule that also means the site can never fight the room it is advertising.',
        },
      ],
    },
    {
      kind: 'prose',
      paragraphs: [
        'So almost nothing is ornamental: monospaced type set small, one vertical Japanese lockup as the only flourish, and six named colours in a closed palette. Closing it is what stops a project drifting once there are twenty screens instead of five. A fixed baseline grid is why a thirty-item menu with prices and long ingredient lists resolves without anything being placed by hand — and the billboard is the check on whether any of it was real, because a type and colour system that only works at screen scale was never a system.',
      ],
    },
    {
      kind: 'figure',
      tint: true,
      figures: [
        {
          src: '/projects/sukiyaki/sukiyaki-6.webp',
          alt: 'The six-colour palette, each swatch named and given a hex value',
          caption:
            'Six colours, named and closed. A palette that can be added to is not a constraint, and a project without constraints looks different on every page by the end of it.',
        },
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/sukiyaki/sukiyaki-3.avif',
          alt: 'The menu page with its layout grid and spacing annotations overlaid',
          caption:
            'The menu with the grid showing. Thirty items, three tiers and a column of prices resolve without manual placement because the spacing was decided once, at the system level, rather than per screen.',
        },
      ],
    },
    {
      kind: 'figure',
      tall: true,
      figures: [
        {
          src: '/projects/sukiyaki/sukiyaki-7.webp',
          alt: 'A Sukiyaki billboard on an ivy-covered wall, showing two pots photographed from above',
          caption:
            'Outdoors, at the size where mistakes show. Same type, same palette, same restraint — and the photograph doing the selling, exactly as it does on the site.',
        },
      ],
    },
  ],
}

/**
 * Phasmatic — 2026. A **lite** entry, and the model's first.
 *
 * Not a case study in the sense the other four are, and deliberately so: it is
 * a live product, so the argument for it is the thing itself. The page's whole
 * job is to say what it is, show it, and get out of the way — `live` carries
 * the link, and that link is the point of the page.
 *
 * **Why it has a page at all**, when the row used to link straight out: an
 * external link is the only row on the index that takes a reader off the site
 * entirely, and doing that from the one project that is wholly his is the wrong
 * trade. The page keeps them here long enough to know what they are clicking.
 *
 * **The `href` this replaced was wrong in a way worth recording.** It pointed at
 * `phasmatic.com`, which is an unrelated 3D/metaverse company — not this
 * product, which lives at `phasmatic.vercel.app` until the domain moves. A live
 * link to a stranger's business is the kind of error nobody re-reads their way
 * into finding.
 *
 * **`phasmatic.app` is the intended domain** and does not resolve yet; it
 * already appears in the product's own embed example. Change `live.href` when it
 * does.
 *
 * **One paragraph, not chapters.** It is live and still moving, so a structured
 * retrospective would be writing a conclusion for something that has not
 * reached one. What it is, why the built part is any good, and a link out.
 *
 * **The hero is a hand-captured video**, and had to be. The effects are WebGL
 * canvases and cannot be captured from an automated browser — a headless or
 * backgrounded tab suspends `requestAnimationFrame`, so every canvas
 * screenshots blank. It stood as a placeholder carrying its own capture brief
 * until 2026-08-15, which is the day the last art gap on the site closed.
 */
export const phasmatic: CaseStudy = {
  slug: 'phasmatic',
  name: 'Phasmatic',
  claim: 'Shader-grade atmosphere, without a build step',
  role: 'Designed and built solo',
  period: '2026',
  scope: 'Product, brand, effects, editor and embed',
  outcome: '15+ effects. The field behind this page is one of them.',
  color: '#5566ff',
  fieldHue: 0,
  // 1778×2000 — drawn to the card's 8:9 rather than cropped into it, which only
  // this and Warble are. The wordmark sits across the plume, so unlike every
  // other cover it names itself: the one entry whose art would otherwise be an
  // abstract glow with nothing identifying it. It ends the tinted-name
  // placeholder in `Projects.tsx`, which now has no entry left to catch; keep
  // the branch anyway, for the next project added without art.
  cover: '/projects/phasmatic/card-2.png',
  next: 'moonit',
  live: { label: 'Open Phasmatic', href: 'https://phasmatic.vercel.app' },

  // Captured 2026-08-15, which closed the last art gap on the site. It had to
  // be recorded by hand from a focused tab: the effects are WebGL canvases and
  // a backgrounded or automated browser suspends `requestAnimationFrame`, so
  // every attempt from here screenshots blank.
  //
  // **Encoded from the original 3600×2078 screen recording, not from the GIF.**
  // It was first taken from a 7.3MB GIF export, which looked soft on the page
  // for two compounding reasons: GIF quantises to 256 colours per frame, so a
  // continuous gradient is dithered into noise, and that export was only 960px
  // wide going into a 1280px slot. Neither is recoverable by transcoding — the
  // colour is gone before the encoder sees it. Going back to the source fixed
  // both at once.
  //
  // It matters more here than the subject suggests: the recording is the
  // Phasmatic page, so there is **headline type in the frame**, and type is
  // exactly what a 1.33x upscale of a dithered source destroys. 2560 wide is
  // the 1280px slot at 2x. Keep any future capture at that width or above.
  //
  // **Cropped 4px on every side before scaling.** The capture caught the
  // recorded window's own edge highlight as a 2–3px strip down the extreme left
  // and right of the frame, plus a one-pixel line along the bottom — bright
  // enough (45 against a black page) to read as a seam once the video sat in
  // the layout. Crop it at the encode rather than masking it in CSS: a border
  // or an inset would be page furniture invented to hide a defect in an asset,
  // and it would have to be maintained on a component every other study shares.
  // Any future screen capture needs the same treatment.
  lead: {
    src: '/projects/phasmatic/hero.mp4',
    alt: 'The Phasmatic site with an effect running full-bleed behind its headline, shifting through violet, magenta and amber',
  },

  meta: {
    title: 'Phasmatic — shader-grade atmosphere, without a build step',
    description:
      'A hosted library of full-bleed WebGL hero and background effects, with a visual editor and an iframe embed — designed and built solo.',
    keywords: [
      'WebGL',
      'shaders',
      'hero backgrounds',
      'design engineering',
      'product design',
      'embeds',
    ],
  },

  note: 'Every good shader background already exists as a React component, which is no help to the people who most want one — marketers, founders, anyone shipping in Webflow or a CMS, none of whom can run npm install. Phasmatic is that library hosted rather than published: more than fifteen full-bleed effects, each with real controls and named presets, and an iframe you can paste into anything that takes HTML. Everything resolves to a single config, so the no-code embed and the React usage stay the same product instead of drifting into two. The bar is Stripe and Linear rather than gradient meshes, and holding that while a non-technical person drags a slider is the actual problem. It is live and free to use — the field behind this page is one of them.',
}

/* The study links here twice, and a bare vercel.app subdomain may get a real domain. */
const WARBLE_SITE = 'https://warbleton.vercel.app'

/**
 * Warble — a lite entry, like Phasmatic.
 *
 * The app is not in this repo; `live` points at it and at the frozen 2025
 * build, which nothing else links to.
 *
 * The note is about the idea rather than the tool — what the tool does is one
 * click away, and this is the entry allowed to be curious in public. The hero
 * was captured from the running app rather than designed.
 */
export const warble: CaseStudy = {
  slug: 'warble',
  name: 'Warble',
  claim: 'Everyone has the same ringtone',
  role: 'Designed and built solo',
  period: '2025 — ongoing',
  scope: 'Concept, interface, audio engine and export — two builds, and a fork chasing harmony',
  color: '#8b5cf6',
  fieldHue: 0,
  next: 'raptor',
  live: [
    { label: 'Play it', href: WARBLE_SITE },
    { label: 'Play the 2025 version', href: `${WARBLE_SITE}/v1` },
  ],
  // 1778×2000, composed to the card's 8:9 with the wordmark under the app.
  // `app.jpg` is still the study's `lead` — it is the same interface, shot for a
  // wide slot instead of this one.
  cover: '/projects/warble/card.png',

  lead: {
    src: '/projects/warble/app.jpg',
    alt: 'The Warble interface: instrument and scale pickers, a step sequencer, and the transport mid-playback',
  },

  meta: {
    title: 'Warble — a ringtone that is actually yours',
    description:
      'A tool for making a ringtone in the Apple house style but personal to you. It has since stopped making ringtones and started making game music, which nobody planned.',
    keywords: [
      'Web Audio API',
      'generative audio',
      'procedural music',
      'game music',
      'interaction design',
      'constraint design',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Apple\u2019s ringtones are well crafted and charming. The trouble is that everyone has exactly the same one.',
        'I understand why they are kept on rails \u2014 it guarantees the thing sounds good, and it gives every phone in the room a family resemblance. It did not stop me wanting my own. And it could not be that difficult to make a simple ringtone, right?',
        'That is the path that led to Warble. I wanted a tool that made something with the depth and whimsy of Apple\u2019s ringtones, while being fun enough to play with and easy enough that anyone could make their own. The eight rows are degrees of a scale rather than a chromatic keyboard, so there is no wrong note to place \u2014 which is the constraint that lets two minutes of fiddling produce something you would actually set as your ringtone.',
        'It has kept growing since, mostly by gaining layers. I used v1 to make the one that is on my phone. v2 has far more in it \u2014 struck-bar voices with their own overtones instead of plain oscillators, three parts instead of one, repeats that develop rather than repeat \u2014 and somewhere in all of that it stopped making ringtones.',
        'What comes out of the Random button now is short game music. The Mario and Zelda register. I did not aim at that, and no single change caused it: notes locked to a scale so nothing can clash, short bright percussion that does not smear when it moves quickly, and phrases that state an idea and then answer it. Every one of those went in for its own unrelated reason, and together they turn out to be the conditions for a game loop. Which means it is reproducible rather than a lucky seed \u2014 and the thirty-second cap and the WAV export are now the only parts of this that are about ringtones at all.',
        'I do not know where it goes next, or whether there is a point beyond the fact that I am learning a great deal and enjoying myself. For this one, that is reason enough.',
      ],
    },
  ],
}

/**
 * Every study on the site. This array is the order of the pages, and the
 * `featured` ones are the order of the work index.
 *
 * There is one content model now. `projects.ts` and `ProjectTemplate` were
 * deleted on 2026-08-15 once the last three studies came across, so nothing
 * renders through two formats any more and there is no fallback in the route.
 *
 * `moonpay` is deliberately absent — it is a scaffold, parked, and does not
 * route. See the note above it.
 */
/*
 * **Phasmatic leads, as of 2026-08-16.** The order was Moonit → Phuture →
 * Raptor → Sukiyaki → Phasmatic → Warble, which opened on three financial
 * products and argued "fintech designer" before a word was read. That is the
 * thing being left. The site now leads on craft and says so in About: shaders,
 * not wallets.
 *
 * The one-two is deliberate. Phasmatic first because it is the strongest craft
 * argument on the site and the field behind this page is one of its effects —
 * the work is running while you read about it. Moonit immediately after,
 * because a portfolio that opens on a self-directed shader library and stops
 * there reads as a hobbyist; a nine-figure trading terminal at 02 says the
 * craft is not instead of the product work. Then Phuture for the leadership and
 * the system, Sukiyaki for brand and art direction, and the two shorter
 * self-directed pieces last.
 */
export const caseStudies: CaseStudy[] = [phasmatic, moonit, phuture, sukiyaki, warble, raptor]

/**
 * The studies that appear in the work index.
 *
 * Currently all of them — nothing sets `featured: false` as of 2026-08-15, and
 * there are no solo-project rows underneath any more for them to sit above.
 * Raptor and Sukiyaki were the only two ever excluded and both are back; see
 * the note on the `featured` field for when to reach for it again.
 */
export const featuredCaseStudies: CaseStudy[] = caseStudies.filter(
  (study) => study.featured !== false
)

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}
