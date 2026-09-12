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
 * instead of five times. `moonit` is **lite** — the chaptered version was a
 * structured retrospective on a sunsetted product, and the format was doing
 * more work than the content.
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
  /**
   * Reachable only by someone holding the URL.
   *
   * **This is a different thing from `featured: false`, and the difference is
   * the point.** An unfeatured study is off the work index because the index is
   * a curated argument — the page is still public, still in the sitemap, still
   * a page you would be pleased to have found. An unlisted study is one nobody
   * is meant to find: it is dropped from `sitemap.ts` and rendered with
   * `robots: noindex` in `[slug]/page.tsx`, both driven off this flag.
   *
   * Both mechanisms are needed. The sitemap is a hint a crawler may ignore; the
   * meta tag is an instruction. And neither is security — anyone with the link
   * has the page, which is exactly what it is for. It is a link to hand to one
   * person, not a thing that is hidden.
   *
   * `moonpay` is the case: a study of work at the current employer that has not
   * shipped, written to send to a hiring manager rather than to publish. Unset
   * this and drop `featured` when it becomes an ordinary page.
   */
  unlisted?: boolean
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
 * MoonPay Commerce — the deposit flow. **ROUTED, UNLISTED, NOINDEX.**
 *
 * A real page at `/moonpay` since 2026-09-11, reachable only by someone holding
 * the URL. Three mechanisms, because they do three different jobs:
 *
 * - **`featured: false`** keeps it out of `featuredCaseStudies`, which is what
 *   `flow.ts` builds the work index from. Nothing on the site links here.
 * - **`unlisted: true`** keeps it out of `sitemap.ts`.
 * - **`robots: noindex`**, applied in `[slug]/page.tsx` off the same flag. The
 *   sitemap is a hint; the meta tag is the instruction. Without it a page this
 *   quotable gets found and the URL stops being private the first time anyone
 *   shares it.
 *
 * The launch decision this reverses was: "a first entry leading to bracketed
 * briefs is worse than one study fewer, and a detailed study of in-flight work
 * at the current employer is the loudest possible signal to colleagues while
 * still employed and interviewing." The copy exists now, which settles the
 * first half. The second half is settled by the page being unlinked and
 * unindexed rather than by it not existing — a link to hand to one person, not
 * an announcement.
 *
 * **The copy is Lloyd's, and the structure is his.** Chapters, headings and
 * paragraph order all track the Figma source (file `DVM9PicEDmyqjwgZFNQNWC`,
 * node `15:2`), which is where editing happens — revised there 2026-09-11 and
 * brought across the same day. Do not restructure this to match the other
 * studies. Changes that came from the author and are load-bearing:
 *
 * - "The thing everyone had got wrong" became **"We were all working
 *   backwards"**, which implicates him along with the category. The first
 *   version was the only arrogant line on the page.
 * - The competitor-flow figure is **new, and it is the first image on the
 *   page** — the claim about the category convention was previously asserted
 *   and now opens on its evidence.
 * - Competitors are described (`most of the biggest`) and never named. Two
 *   partners **are** named, and both are checked against the bar the scaffold
 *   set — publicly announced, and only the announced part:
 *
 *   - **World Series of Poker.** Announced; confirmed with the author.
 *   - **Pump.fun.** Announced 2026-03-11, `moonpay.com/en-gb/newsroom/
 *     moonpay-pumpfun-deposits`, and it is live on MoonPay Deposits — the
 *     product this study is about.
 *
 *   The Pump.fun sentence is worded structurally on purpose. That announcement
 *   says nothing about repeat usage, returning users, top-ups or volume, so it
 *   cannot carry the repeat-customer claim; what it does support is that the
 *   product is account funding, and topping up an account is what that product
 *   is. The claim rests on what Pump.fun publicly *is*, never on internal
 *   numbers. **Do not strengthen this into a usage or frequency claim** — that
 *   evidence exists but is not public.
 *
 *   Nothing else on the page names a partner.
 *
 * **No client is referred to, in any form, deliberately.** Removed 2026-09-11:
 * the `outcome` line and a paragraph in "Where it landed" both described a
 * customer who had declined on the strength of the old UI and reopened talks
 * after the redesign, and Helio was described as losing enterprise deals.
 *
 * The reason is not that the client was named — it never was. It is that this
 * page exists to be sent to hiring managers, one of whom sits inside the group
 * the description pointed at. To that reader the anonymity does not hold, and
 * what they would be reading is the employer's private account of a live
 * negotiation, handed to the other side of it. Nothing here is worth that.
 * **Do not restore it, soften it, or reach for a nearby paraphrase** — the
 * problem was never the wording.
 *
 * **`outcome` is unset on purpose, and the slot is labelled "Outcome".** The
 * detail row filters out empty values, so it renders Role / Period / Owned and
 * nothing is styled for the absence. Do not fill it with the deposit-growth
 * line: that is **stakes, not outcome** — all of that volume ran through the
 * old flow and the redesign has not shipped — and putting it under a label
 * saying "Outcome" is exactly the dressing-up the closing chapter takes credit
 * for refusing. It lives in "The problem" instead, where it explains why a
 * rebuild rather than a tidy-up.
 *
 * **The deposit claim is deliberately qualitative.** "The fastest-growing part
 * of the Commerce business" and nothing more. The underlying figures — share of
 * processed transactions, monthly volume — are unpublished company financials
 * and are not going in this file in any form, including as a percentage or a
 * range. Directional beats numeric here anyway: the sentence has to size the
 * bet, not evidence a result it cannot evidence.
 *
 * Two things this study still does not have:
 *
 * - **No failure states.** There is a marked gap in chapter 03, "Input led",
 *   after the confirmation and before the returning user. Payments is the one
 *   category a reader looks for it in, and it is now the largest remaining hole
 *   in the writing. It is in the solution chapter and not in "What it cost"
 *   because a failure state is something designed, not something conceded.
 * - **No shipped numbers**, by definition. "Where it stands" closes on the two
 *   things being watched instead — the first-time conversion cost of the extra
 *   step, and the QR handoff. That close is the study's substitute for results
 *   and it has to stay decisive in tone: naming a falsifiable bet reads as
 *   rigour, hedging about one reads as an apology, and they are the same
 *   content.
 *
 * One further line to test rather than trust: "the widget serves over a million
 * visitors a month" is the same class of unpublished operational metric as the
 * deposit figures above, and it has not had the same scrutiny.
 *
 * **Every figure is a placeholder.** The author's shot list has eight items;
 * two of them are pairs, so that is ten frames, plus the lead. No `src` on any
 * of them, and each `alt` is written as the brief for the shot that goes in it
 * — which is what the optional `src` on `Figure` is for. The lead is the only
 * frame not on the shot list; drop it if it is not going to be shot, since a
 * study without a `lead` opens on the detail row perfectly well.
 *
 * One line here cannot survive launch: "It hasn't shipped yet." Update the
 * opening of "Where it landed" the week it does, and add the numbers.
 */
export const moonpay: CaseStudy = {
  slug: 'moonpay',
  name: 'MoonPay',
  claim: 'Rebuilding MoonPay’s deposit flow',
  role: 'Sole designer, MoonPay Commerce',
  // The author's file still reads "[Month]–[Month] 2026". A bracket is worse on
  // a live page than a year is imprecise, so the year stands until he fills it.
  period: '2026',
  scope:
    'Research, flows, UI, prototypes and execution with engineering — with design reviews across the wider team, and brand rebranding the suite in parallel',
  /*
   * No `outcome`, and the field is omitted rather than filled with something
   * softer. It previously carried a commercial fact about a named-in-all-but-
   * name client; that was removed on 2026-09-11 along with every other
   * reference to a lost or reopened deal — see the note above the chapters.
   *
   * The detail row simply drops the slot when this is unset, so nothing needs
   * styling for the absence. Fill it once there is a shipped number, or once
   * the deposit-growth figures are cleared to publish.
   */
  color: '#7B3FF2',
  // 0 on purpose, as on the scaffold. Tinting the field toward the project's
  // violet was tried and reverted — see the note on CASE_STUDY_KEYFRAMES.
  fieldHue: 0,
  cover: '/project-covers/moonpay.png',
  featured: false,
  unlisted: true,
  next: 'moonit',

  lead: {
    alt: 'Hero crop of the new config screen at rest — amount focused, nothing open, payment method sitting below it as a setting. Not on the shot list: this is the same subject as figure 03, framed for the opening slot rather than for the argument.',
    aspect: '16 / 9',
  },

  meta: {
    title: 'MoonPay — rebuilding the deposit flow',
    description:
      'Checkouts clarify the price before asking what you are paying with. Deposits ran the other way round — and fixing that meant rethinking the first decision the user makes.',
    keywords: [
      'product design',
      'payments',
      'crypto on-ramp',
      'checkout',
      'design systems',
      'embedded interfaces',
      'MoonPay',
    ],
  },

  chapters: [
    {
      title: 'The problem',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Checkouts clarify the price before asking what you were paying with. Deposits ran the other way round, and fixing that meant rethinking the first decision the user makes.',
            'MoonPay acquired Helio Pay — a Solana-based checkout — alongside a suite of other products. Helio worked well for what it was built for: crypto-native users, moving crypto, one transaction at a time.',
            'It didn’t work for MoonPay, and there were three problems stacked on each other. It didn’t look or feel like MoonPay — customers using it often didn’t know they were using MoonPay at all, so none of the trust we’d spent years building transferred across. It didn’t share anything with the rest of the suite either: separate dashboards, separate accounts, separate KYB and KYC, so a customer using two MoonPay products onboarded twice for mostly the same information. And it was never built for enterprise. Enterprise was never Helio’s target. It is MoonPay’s.',
            'So this wasn’t a reskin. We needed one product, one brand, one account — and a deposit flow that could hold enterprise weight.',
            'What follows is the deposit flow in the MoonPay Commerce widget — the fastest-growing part of the Commerce business, and the reason this was worth rebuilding rather than tidying. Checkouts and withdrawals share the config pattern that came out of it, but the problem this piece is about is specific to deposits.',
          ],
        },
      ],
    },

    {
      title: 'We were all working backwards',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Every crypto deposit flow I looked at leads with intent — including ours. Most of the biggest open on a list of rails: transfer crypto, connect wallet, pay with exchange.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '16 / 9',
              alt: 'Two competitor deposit flows side by side, both opening on a method or token list before any amount is entered. Shoot them at matching crop so the shared convention is the obvious thing about the pair. Not named anywhere in the copy — the caption should not name them either.',
              caption:
                'Two of the biggest, side by side. Both open on a list of rails, before there is an amount to attach one to.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'That’s a reasonable model if you treat every interaction as a brand new transaction — but it aligns with what makes sense for the transaction, not for the user.',
            'The odd part is that we already knew better. Our own checkout has always been input led (it has to be, because the amount is set before you arrive). You see what you’re paying, then you choose how to pay it. Deposits ran the other way round.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '16 / 9',
              alt: 'MoonPay’s old deposit flow, annotated — payment-method selection called out as step one, before the user has entered anything. The annotation is doing the work; an unmarked screenshot does not show that anything is wrong with it.',
              caption:
                'And ours did the same thing. Payment method as step one, before anything has been entered.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'And most of our users aren’t new — I had two sources telling me the same thing. The companies we host payments for said it directly. MoonPay Commerce powers tournament buy-ins for the World Series of Poker, where the same players come back and buy in again and again; Pump.fun runs on MoonPay Deposits, and topping up an account there isn’t a behaviour some of the users have, it’s the whole interaction model. Our own transaction data said it more broadly — anywhere topping up is the norm, prediction markets being the obvious current example, the same accounts keep coming back.',
            'Every one of those people was picking their payment method again, from scratch, every single time.',
            'Traditional payments solved this years ago. You don’t choose your card network before you know what you’re paying.',
          ],
        },
      ],
    },

    {
      title: 'Input led',
      blocks: [
        {
          kind: 'prose',
          paragraphs: ['So I flipped it. Now, you start with the amount.'],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '16 / 9',
              alt: 'The new config screen. Amount first, with the payment method sitting below it as a setting rather than as the opening question. Frame it to match the annotated old flow above, so the reversal is the only difference between the two shots.',
              caption:
                'The new config screen. The amount leads; the payment method is a setting on the transaction, not the question that opens it.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Payment methods are still right there and still easy to get to — they’re just not the leading decision. Configuration lives in drawers, so the config screen stays clean no matter how complex the transaction underneath it is.',
          ],
        },
        {
          kind: 'figure',
          frame: 'column',
          figures: [
            {
              aspect: '4 / 3',
              alt: 'A drawer open on payment-method selection, with the config screen still visible behind it. The point of the shot is the part that has not moved, so keep the amount field in view above the drawer.',
              caption: 'The config screen stays behind the drawer rather than being replaced by it.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The confirmation screen adapts per transaction type, showing only what’s relevant to that one. No ambiguity about what you’re about to sign.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '4 / 3',
              alt: 'Confirmation screen for a cash transaction. Pair shot — identical crop and scale to the crypto one beside it, or the difference reads as inconsistency rather than as adaptation.',
              caption: 'A cash confirmation.',
            },
            {
              aspect: '4 / 3',
              alt: 'Confirmation screen for a crypto transaction, same crop and scale as the cash one. Different fields, same structure.',
              caption: 'And a crypto one. Same screen, different contents.',
            },
          ],
        },
        /*
         * MISSING, AND THE PAGE KNOWS IT: one paragraph on failure states,
         * which belongs here — after the confirmation, before the returning
         * user.
         *
         * It was briefly marked in "What it cost", next to the paragraph about
         * every method ending differently, and that was the wrong chapter. A
         * failure state is not a cost or a compromise; it is a surface that was
         * designed, so it sits with the config screen, the drawers and the
         * confirmation. Moonit does the same thing — its error-states paragraph
         * is in the craft chapter, not in anything about what the work cost.
         *
         * The slot is here specifically because the confirmation is the moment
         * of commitment, so what happens when commitment fails is the next
         * beat, and the returning-user payoff then closes the chapter instead
         * of being interrupted by it. As it stands this chapter is the happy
         * path start to finish, which for a payments flow is conspicuous.
         *
         * What goes in: an abandoned QR handoff, an under-funded manual
         * transfer, a wallet that rejects. What each one tells you about what
         * happened, whether the money moved, and what to do next. Left empty
         * rather than filled with something plausible — only the person who
         * designed them can write it.
         */
        {
          kind: 'prose',
          paragraphs: [
            'The pattern generalised further than the problem did — the same config now carries withdrawals too, cash and crypto alike. But deposits were the flow that needed the rethink.',
            'For returning users it goes further. The config holds the details of your last transfer — method, token, funding option — so a repeat transaction takes seconds rather than a full walk through the flow.',
          ],
        },
        {
          kind: 'figure',
          tint: true,
          figures: [
            {
              aspect: '16 / 9',
              alt: 'The returning-user state: config pre-filled from the last transfer, ready to confirm. This is the payoff shot for the whole study, so it should be the most finished image on the page.',
              caption:
                'The returning-user state, pre-filled from the last transfer. This is the case the reversal was for.',
            },
          ],
        },
      ],
    },

    {
      title: 'What it cost',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Choreographing it was the hard part. MoonPay is well kitted out — connect a wallet, connect an exchange or make a manual transfer on the crypto side; Apple Pay, Google Pay, Venmo, bank transfer, Faster Payments on the cash side. Nice coverage, but they all end differently. Some hand you off to your phone with a QR code and finish there; others complete inside the widget whatever device you’re on. Some need a lot more information from you than others.',
            'That made a core skeleton hard to pin down. The config screen has to hold every one of those endings without reshaping itself each time you pick a different one.',
            'First-time users pay an extra click. That’s the honest drawback of input-led — you set your payment method a step later than you used to. I took the trade, because it buys you context from the first screen no matter which path you’re on, and for repeat customers it disappears entirely.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Iteration. The first input-led layout put everything on the surface: a row for cards with Apple Pay, Google Pay, Venmo and bank transfer tiled across it, a row underneath for crypto with wallet connect and manual transfer. A rectangle full of squares.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '16 / 9',
              alt: 'The tile-wall version that got killed — every payment method on the surface at once, cash row above crypto row. Worth shooting properly rather than pulling a rough from version history; a dead end you can explain is more convincing than a solution that arrives fully formed.',
              caption: 'The tile wall. Everything on the surface, and nowhere obvious to look.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'It was great if you knew exactly what you wanted. If you didn’t, it read like a bookshelf — too many colours, nowhere obvious to look. That one went, along with the other input-led variants that tried to push the main payment methods up to the surface.',
            'Customisable for partners, unmistakably MoonPay. This is a partner product, so it’s a kind of faux white label — it has to be unmistakably MoonPay and disappear into someone else’s UI at the same time. Those two pull against each other, and every decision here had to satisfy both.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              aspect: '4 / 3',
              alt: 'The widget themed for one partner, inside that partner’s surface. Announced integrations only — an unannounced client name on a personal site ends a conversation rather than starting one.',
              caption: 'The same widget, themed for one partner.',
            },
            {
              aspect: '4 / 3',
              alt: 'The widget themed for a visibly different second partner, same crop and scale. The argument is that one structure absorbs both, which is only visible side by side.',
              caption: 'And for another. The theming changes; the structure doesn’t.',
            },
          ],
        },
      ],
    },

    {
      title: 'Where it stands',
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'It hasn’t shipped yet, so I don’t have live numbers — and I’d rather say that than dress something up.',
            'For scale: the widget serves over a million visitors a month, and now looks and behaves like the rest of MoonPay.',
            'Two things will tell me whether I got this right. The first is whether the extra step costs first-time conversion — that is the trade I chose, and it is the one most likely to be wrong. The second is the QR handoff, because it is the ending we control least, and the one most able to make an otherwise coherent flow feel like it stopped halfway.',
          ],
        },
      ],
    },
  ],
}

/**
 * Moonit — 2024. Sunsetted; its own entry, not MoonPay’s.
 *
 * **Lite.** The story is the arc: a product rescued from someone else’s
 * roadmap, branded and shipped into a cultural moment, profitable, then
 * sunset when the moment passed. A structured retrospective fought that
 * shape — the format kept asking for a conclusion the arc itself already is.
 *
 * **DexScreener is named.** The origin story — Moonshot as a tab on Dex,
 * Helio processing their payments, the handoff — is the interesting part
 * and the part only the person who was there can tell. Pump.fun is named
 * as the cultural reference point it was.
 *
 * **The figures stay ranges.** The exact profit and volume numbers were never
 * externally disclosed, so they are not published here or in the meta
 * description.
 */
export const moonit: CaseStudy = {
  slug: 'moonit',
  name: 'Moonit',
  claim: 'A meme coin trading platform, branded from scratch',
  role: 'Senior Product Designer',
  period: '2024',
  scope: 'Sole designer — strategy, brand, interface, motion',
  outcome: 'Built, profitable and sunset in under 18 months.',
  color: '#D6FF00',
  fieldHue: 0,
  cover: '/projects/moonit/signage-2025.jpg',
  lead: {
    src: '/projects/moonit/signage-2025.jpg',
    alt: 'The Moonit mark on two illuminated light boxes, in acid yellow and blue',
  },
  next: 'phuture-finance',

  meta: {
    title: 'Moonit — a trading platform built, shipped and sunset inside 18 months',
    description:
      'Sole designer on Moonit, a Solana trading terminal rescued from another company\'s roadmap, branded from scratch, profitable, and sunset when the moment passed.',
    keywords: [
      'product design',
      '0-to-1',
      'trading terminal',
      'real-time interfaces',
      'information density',
      'design systems',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Moonit started as Moonshot, a tab on DexScreener for trading Solana tokens on the bonding curve. When DexScreener decided to cut it and focus on their core product, we could see what they were walking away from. Pump.fun was blowing up, the market was moving fast, and the product still had life in it. We took it: spun it off, ran it ourselves, routed bonded tokens back to DexScreener. A partnership rather than a shutdown.',
        'The positioning problem was immediate. Pump.fun was on the bleeding edge of social culture: aggressive, chaotic, very much of its moment. DexScreener were the opposite: reserved, institutional, fintech. We were in acquisition talks with MoonPay, so everything I designed had to hold up across three sets of stakeholders with three different appetites for risk. We couldn\'t be as reckless as Pump, but DexScreener had cut it because they didn\'t have the traffic. We couldn\'t be that passive either. The sweet spot was excitement without the landmines.',
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/moonit/home-fun.png',
          alt: 'The Moonit home screen in fun mode — a meme banner, condensed navigation, and stacked token cards with trade controls on every card',
          caption:
            'Fun mode. Trade controls on every card, so you never leave the view you\'re in.',
        },
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/moonit/home-pro.png',
          alt: 'The Moonit home screen in pro mode — a dense three-column grid of token cards with key metrics and quick-buy controls',
          caption:
            'Pro mode. Same tokens, stripped to the data.',
        },
      ],
    },
    {
      kind: 'prose',
      paragraphs: [
        'Another app called Moonshot had gained traction, so we renamed and rebuilt the identity while the product was live and traders were on it.',
        'Time to transaction was the whole problem. These traders were competing against bots and riding social momentum. A position can double or disappear inside a minute.',
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/moonit/card-annotated.png',
          alt: 'A single Moonit token card annotated with callouts — key metrics at top level, quick-buy button for instant purchases, copy and share links for organic traffic',
          caption: 'Key metrics, one-tap buy, and share links — everything on the card, nothing behind a tap.',
        },
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/moonit/buy-sell-cards.png',
          alt: 'Two expanded Moonit token cards showing buy and sell states — trade controls inline on the card, no routing to a separate view',
          caption:
            'Buy and sell without leaving the feed.',
        },
      ],
    },
    {
      kind: 'figure',
      figures: [
        {
          src: '/projects/moonit/banners.jpg',
          alt: 'Moonit banners hung between the columns of a classical stone building',
          caption:
            'Hung against a bank rather than a billboard, on purpose. The environment a brand is photographed in says more about the positioning than any copy.',
        },
      ],
    },
    {
      kind: 'prose',
      paragraphs: [
        'It was a flash in the pan and we knew it going in. The meme coin frenzy was never going to last. Building a branded trading platform, turning it profitable and sunsetting it when the market moved on, all inside 18 months: you can only do that moving at the speed the culture does. We gave traders a fast, secure platform in a space full of rough tooling, an edge without the usual tradeoffs. When the moment passed, we let it go.',
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
            'Campaign work ran loud and illustrative; the type, grid and signal colour are the interface\'s, unchanged.',
        },
      ],
    },
  ],
}

/**
 * Phuture — 2021–2023. Rewritten 2026-09-12 from the owner's own account of
 * the work, replacing the AI-written version that read as polished but
 * impersonal. Four chapters, same structure, shorter throughout — the
 * reflection paragraph and the 114% community-growth outcome were cut.
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
            'In 2021 this market was the wild west. Index investing did not exist. If you wanted a diversified position you held it piece by piece: ten or more assets, a separate contract approval for each, rebalancing by hand every time the weights drifted.',
            'The product collapsed all of that into a single position. One purchase, automatic rebalancing. The design problem was how far I could simplify without losing what made it useful.',
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
                'Site and product were one continuous surface. Someone who arrived interested never had to start again on a separate app to buy.',
            },
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
            'Underneath, buying one unit fired a basket of swaps and contract interactions. I showed none of it. One product, one action.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-1.avif',
              alt: 'The index product page — one buy panel, performance and returns below',
              caption: 'One panel, one action. Performance and returns sit below the fold until you ask for them.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'We refined the widget over months, stripping it back. Slippage tolerance, the funding asset, fee breakdowns went behind a settings cog. The controls stayed one layer down, designed properly, because a product you can\'t see into asks for trust this audience was not handing out.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-5.avif',
              alt: 'A sequence of panels: buy, settings with slippage tolerance, and the asset selector, in light and dark',
              caption:
                'Slippage tolerance and the funding asset stay accessible one layer down for anyone who wants to verify what they\'re buying.',
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
                'The same hierarchy at phone width and in both themes.',
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
            'Hiding the plumbing creates a risk: if users can\'t see in, they have to take it on faith, and this audience had been burned by exactly that. The rule was simple. Hide the mechanics, show the data. Composition, weights and fees sat on the surface, not behind a link to a document.',
            'The website was minimal and professional: Space Grotesk, whites and blues. It read closer to a bank than a game, and that distance from the gamified set did the positioning before anyone read a word.',
          ],
        },
        {
          kind: 'figure',
          figures: [
            {
              src: '/projects/phuture/phuture-6.webp',
              alt: 'A wall of Phuture social posts, campaign stickers and announcement graphics',
              caption:
                'The same system going outside. Community growth ran on explanation: whitepapers, research threads, accelerator announcements. Slower, but it produces holders who are still there 200 days later.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'I designed the analytics to show long-term movement, not micro-volatility. Candlesticks make a five-minute move look like an event, and people act on events. Smoothing the chart was the single biggest factor in the retention number, because the behaviour it suppressed was panic selling.',
          ],
        },
        {
          kind: 'outcomes',
          items: [{ value: '211 days', label: 'Average retention, well above the category' }],
        },
      ],
    },

  ],
}

/**
 * Raptor — 2023. Self-directed, not client work, and **lite** since 2026-08-15.
 *
 * Off the work index as of 2026-09-12 — `featured: false`, pages still live
 * and public. It was unfeatured on the grounds that the index takes its
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
  featured: false,
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
 * Off the work index as of 2026-09-12 — `featured: false`, pages still live
 * and public. Was on the index for range rather than for the argument the rest
 * of the site is making. It is the only thing here that is not a financial interface, which is
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
  claim: 'Brand and menu system for a Japanese restaurant',
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
    title: 'Sukiyaki — brand and menu system for a Japanese restaurant',
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
        'I first designed this as a concept when I was starting out. Came back to it in 2024 and treated it more like a product. Sukiyaki is a communal dish, a pot everyone cooks from at once. The identity is built on that: the meal as something shared, not something ordered.',
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
            'Photography carries the warmth. The type stays out of its way.',
        },
      ],
    },
    {
      kind: 'prose',
      paragraphs: [
        'The research went into Edo-period printing and traditional palettes. What kept coming back was discipline over decoration: balance, negative space, restraint. Most hospitality sites reach for ornament and end up looking like each other. I wanted to see what happened without it.',
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
            'Six named colours. The constraint keeps thirty screens feeling like one system.',
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
            'Thirty items, three tiers and a column of prices, all from one baseline grid.',
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
            'Same type, same palette, same restraint, outdoors at scale.',
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
    src: '/projects/phasmatic/hero-2.mp4',
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

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Static pages are no longer enough, but developing and implementing real interaction — shaders, particle fields, responsive motion — these take time, consideration, and a lot of code.',
        'Phasmatic is a free, growing library of interactive effects that drop into any HTML page with one script tag. No build tools, no framework, no dependencies.',
        'Every effect is designed to sit behind your content, not fight it. Ambient enough for a hero background, responsive enough to follow a cursor.',
      ],
    },
  ],
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
  claim: 'A generative ringtone maker',
  role: 'Designed and built solo',
  period: '2025 — ongoing',
  scope: 'Concept, interface, audio engine and export. Two builds, and a fork chasing harmony',
  color: '#8b5cf6',
  fieldHue: 0,
  next: 'refiner',
  live: [
    { label: 'Play v2 (2026)', href: WARBLE_SITE },
    { label: 'Play v1 (2025)', href: `${WARBLE_SITE}/v1` },
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
    title: 'Warble — a ringtone you made yourself',
    description:
      'A tool for making ringtones in the Apple house style, personal to you. It grew into a game music generator somewhere along the way.',
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
        'Apple\u2019s ringtones are well crafted and charming. Most people have the same one.',
        'I understand why they are kept on rails. The constraint guarantees the result sounds good, and it gives phones in the same room a family resemblance. It did not stop me wanting my own. Making a simple ringtone could not be that difficult.',
        'I wanted a tool that made something with the depth and whimsy of Apple\u2019s ringtones, fun to play with and easy enough that anyone could make their own. The eight rows are scale degrees instead of a chromatic keyboard, so there is no wrong note to place. That constraint lets two minutes of fiddling produce something you would set as your ringtone.',
        'It has kept growing since, through layers. I used v1 to make the one on my phone. v2 has far more in it: struck-bar voices with their own overtones instead of plain oscillators, three parts instead of one, repeats that develop rather than repeat. Somewhere in all of that, it stopped making ringtones.',
        'The Random button produces short game music now. The Mario and Zelda register. I did not aim at that, and no single change caused it: notes locked to a scale so nothing can clash, short bright percussion that holds up at speed, phrases that state an idea and then answer it. Each went in for its own unrelated reason. Together they are the conditions for a game loop, which makes the output reproducible rather than a lucky seed. The thirty-second cap and the WAV export are the only parts still about ringtones.',
        'I am still building it.',
      ],
    },
  ],
}

/**
 * Tunnel Run — 2026. A **lite** entry, like Phasmatic and Warble.
 *
 * A three.js endless tunnel racer built entirely from code — no imported models,
 * textures, samples or assets of any kind. Procedural geometry, procedural audio,
 * procedural surface materials, procedurally generated app icons. Native iOS via
 * Capacitor with CoreMotion tilt. Aimed at the App Store as a free, no-ads game.
 *
 * No art yet — lead and cover are placeholders. No live link yet — local git only,
 * no public deploy. Both land when the game is ready to show.
 */
export const tunnelRun: CaseStudy = {
  slug: 'tunnel-run',
  name: 'Tunnel Run',
  claim: 'An endless racer where everything is generated',
  role: 'Designed and built solo',
  period: '2026',
  scope: 'Game design, 3D, procedural audio, native iOS',
  featured: false,
  color: '#FF3B30',
  fieldHue: 0,
  next: 'warble',

  lead: {
    alt: 'Tunnel Run gameplay — the ship racing through a procedurally surfaced tunnel at speed, engine flames trailing',
    aspect: '16 / 9',
  },

  meta: {
    title: 'Tunnel Run — an endless racer where everything is generated',
    description:
      'A free, no-ads tunnel racer for iOS — procedural geometry, audio, textures and tilt controls, built from nothing and without a single imported asset.',
    keywords: [
      'game design',
      'three.js',
      'WebGL',
      'procedural generation',
      'mobile game',
      'iOS',
      'Web Audio',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'Commuting on the underground — limited space, no signal, twenty minutes to fill. Mobile games are perfect for this — engaging enough to make the journey disappear, simple enough to play one-handed in a crowd. The problem is that every one worth playing is either paid or ad-supported, and an ad every three minutes destroys the exact thing the game was doing for you.',
        'This is a tunnel racer that does not do that. No ads, no payment, no interruption. It runs offline, plays in short bursts, and the only thing it asks for is your attention.',
        'Everything in it is procedural — the geometry, the audio, the surfaces, even the app icons. That started as a constraint and turned out to be the reason it stays small and fast enough to actually belong on a phone.',
      ],
    },
  ],
}

/**
 * Refiner — 2025. A **lite** entry.
 *
 * A desktop image and video converter/compressor — Python + CustomTkinter,
 * FFmpeg for video, pngquant for PNG. Built as a tool for the owner's own
 * workflow, shipped as a free product (v2.0.0, 2026-09-12).
 *
 * Landing page at getrefiner.vercel.app, GitHub release at
 * github.com/lloydturnercreate/Refiner/releases.
 */
export const refiner: CaseStudy = {
  slug: 'refiner',
  name: 'Refiner',
  claim: 'Local image and video conversion, in one window',
  role: 'Designed and built solo',
  period: '2025',
  scope: 'Interface, packaging as a native macOS app, and distribution',
  color: '#FF6600',
  fieldHue: 0,
  cover: '/projects/refiner/card.png',
  next: 'phasmatic',
  live: { label: 'Get Refiner', href: 'https://getrefiner.vercel.app' },

  lead: {
    src: '/projects/refiner/cover.png',
    alt: 'The Refiner interface — converter and compressor side by side, showing a file loaded with preview, format picker and compression slider',
  },

  meta: {
    title: 'Refiner — local image and video conversion, in one window',
    description:
      'A desktop app for converting and compressing images and video. Runs offline, predicts the output size before you commit, and ships as a single macOS bundle.',
    keywords: [
      'desktop app',
      'utility',
      'image compression',
      'video conversion',
      'product design',
      'tool design',
    ],
  },

  note: [
    {
      kind: 'prose',
      paragraphs: [
        'I kept converting screen recordings to GIFs in the terminal, compressing PNGs through a website that imposed file limits and kept the originals. I built Refiner to stop doing both.',
        'Drop in a file, pick a format or drag a compression slider, and see the predicted output size before you commit. PNG, JPG, WebP, AVIF, SVG and BMP for images. MP4, WebM, MOV and GIF for video, with palette-optimised GIF export and FPS control for compression. Everything runs on your machine.',
        'I packaged it as a native macOS .app bundle with FFmpeg and pngquant bundled inside, so the download works without installing dependencies.',
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
/*
 * `tunnelRun`, `raptor` and `moonpay` are unfeatured as of 2026-09-12 —
 * pages still live, just off the work index. They sit after the featured
 * entries so the array order matches the index order for featured studies.
 * `moonpay` additionally has `unlisted: true` (noindex, out of sitemap).
 */
export const caseStudies: CaseStudy[] = [
  phasmatic,
  moonit,
  phuture,
  sukiyaki,
  warble,
  refiner,
  tunnelRun,
  raptor,
  moonpay,
]

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
