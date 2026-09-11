<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# lloydturner.co.uk

Personal portfolio. **The deployed site**, live at lloydturner.co.uk.

Strategy, copy rationale and what's next: `~/Documents/AI/rebirth/portfolio/PORTFOLIO_PLAN.md`.
Read it before changing content or positioning; the wording is deliberate and most of it is
load-bearing. **The About block is Lloyd's own writing — do not rewrite it for him.**

## The idea

The whole page is one WebGL surface with content scrolling over it. The sections are not
blocks with a background — they are phases of a single field being transformed by scroll.

| Path | Job |
|---|---|
| `lib/field/renderer.ts` | Raw WebGL. One fullscreen triangle, one fragment shader |
| `lib/field/phases.ts` | The score: keyframed uniform sets lerped by document scroll progress |
| `lib/field/stores.ts` | Scroll and pointer state as plain mutable objects |
| `components/field/Field.tsx` | One fixed canvas, one rAF loop, adaptive resolution |
| `components/Statement.tsx` | The hero: typewriter on a timer, characters scatter out on scroll |
| `lib/scatter.ts` | The per-character scatter primitive, shared by the hero and a study's claim. Deterministic, so a character always leaves the way it left last time. Tuning constants stay at the call sites |
| `components/Projects.tsx` | The work index: typographic rows, cover art on cursor approach |
| `components/About.tsx` | Statement, then the loose CV. The PDF link lives in the close |
| `components/ScrollLitText.tsx` | Dim type that lights character by character through frame |
| `components/Footer.tsx` | The close: contact and footer as one centred block. Carries `#contact` |
| `lib/reveal.ts` | `useFrameReveal` — the shared arrive/leave gesture for list rows |
| `components/project/CaseStudyTemplate.tsx` | A study: centred title card, chapters or a lite entry, the same close. `Blocks` renders both |
| `components/project/ClaimText.tsx` | A study's claim — the hero's scatter in both directions: assembles on load, comes apart on scroll |
| `components/project/Parallax.tsx` | Holds the claim back so the lead image climbs over it. A position, so unsprung |
| `components/project/Media.tsx` | One image or video. Resolves video by extension |
| `content/case-studies.ts` | **Every study.** One content model — see below |
| `content/built.ts` | Solo work as index rows. **Empty on purpose** |
| `app/[slug]/page.tsx` | The one study route. No fallback — everything is a `CaseStudy` |

## One content model

`content/projects.ts` (Challenge / Approach / Results) and `ProjectTemplate.tsx` are
**deleted**. Everything renders as `CaseStudy`, so the route has no fallback and `flow.ts`
has no legacy branch. If a study needs a new shape, extend `Chapter` — do not reintroduce a
second model.

**One model, two lengths.** A study sets either `chapters` or `note`, never both. `note` is
the *lite* entry — **one untitled chapter**: the same `Block[]`, rendered with no number and
no title, because numbering a single paragraph "01" is a table of contents for one item.
Pass a bare string for the common case and the template wraps it into one prose block; pass
blocks when the entry has imagery. This is a length, not a second format — the title card,
detail row, field score and close are identical either way, and `Blocks` is literally the
same component a chapter renders through.

**Figures in a lite entry must stay ordered among the prose**, which is why `note` takes
blocks rather than a string plus a figure array. Paragraphs-then-pictures is the
`{ body[], figures[] }` shape this model was built to replace: it makes every image a
footnote to a paragraph, and it is most of why the old page read as a well-set document.

**`live` takes one link or a list**, normalised the way `note` is. Warble needs two. Its app
is not in this repo — it is at [warbleton.vercel.app](https://warbleton.vercel.app), source at
`../warble` — and its frozen 2025 build at `/v1` is unlinked and `noindex`, so the study is
the only route in.

Four studies are lite, for two different reasons. **Still moving** — Phasmatic and Warble
are live and unfinished, so a structured retrospective would be writing a conclusion neither
has reached. **Self-directed and old** — Raptor and Sukiyaki are two paragraphs each,
keeping every figure; they are there for range until newer work replaces them.

Two things in `case-studies.ts` look like mistakes and are not:

- **`moonpay` is exported and never used.** A scaffold of bracketed briefs, parked — nothing
  routes to `/moonpay` and it is absent from `caseStudies`. Do not add it to the array until
  it has real copy.
- **`featured` exists and nothing sets it.** All six are on the index. The field stays
  because the reasoning does: the index takes its standard from its weakest entry, so it is
  the one place where an extra entry actively costs something. Set it rather than deleting a
  study when that changes — the page keeps working, the *next* chain keeps running through
  it, and nothing 404s.

**`content/built.ts` exports an empty array, deliberately.** Solo work is not a section
below the client work — it is on the same track, and the `role` line ("Designed and built
solo" where an employed study says "Head of Design") carries the distinction. Three entries
are parked to return; see its own note. Consequence: the `COVERS` map in `flow.ts` is only
reachable through `builtProjects`, so it is dead code, as is `site.sections`.

## Media

Every hero and figure goes through `components/project/Media.tsx`, which resolves `.mp4`,
`.webm` and `.mov` by extension and renders video muted, looping, autoplaying and
`playsInline` — the only combination browsers start without a gesture.

- **Encode video as h264 mp4, 2560 wide where the source allows, 30fps, CRF 20.** 2560 is
  the 1280px content slot at 2x. High-framerate captures are pointless here. VP9 webm came
  out about a third the size on the same source and is the lever if these get heavy.
- **Never encode from a GIF when the original recording exists.** GIF quantises to 256
  colours per frame, so a gradient is dithered into noise before any encoder sees it. No
  container or bitrate recovers it. Phasmatic's lead was built from a GIF first and looked
  soft; re-encoding from the source fixed it.
- **Crop a few pixels off every screen capture before encoding.** macOS window recordings
  keep the window's own edge highlight — Phasmatic's was a 2–3px strip at brightness 45,
  invisible in a player and an obvious seam once the video sat full-width on a black page.
- **`Media` draws a hairline border, and that is not a contradiction of the point above.**
  Cropping removes a defect in an asset; the border describes an edge on a clean one. A
  near-black recording on a near-black page has no boundary otherwise.
- **`narrow` on a lead is for square or portrait art**, not a stylistic choice. The slot is
  ~1280px, so a 1400×1310 asset renders about 1200px tall — a viewport of mostly background
  with the subject marooned. `tall` does not rescue it either, because cropping a centred
  phone to 85svh cuts off the phone.
- **`/_next/image` responses are `immutable` with a year-long max-age.** Swap art in place
  and the browser keeps serving the old one through ordinary reloads — clearing Next's cache
  does nothing, because the stale copy is in the browser. **Rename the file.** Raw files in
  `public/` revalidate normally, so video is not affected.

## House rules

**No three.js, no react-three-fiber.** Removed deliberately, not accidentally. The page's
entire 3D content is a quad, and fighting r3f for control of its render loop cost three
separate bugs. Dependencies are `next`, `react`, `react-dom` and nothing else.

It is the same rule that had Warble inline twelve icons rather than take `lucide-react`.
Warble has left the repo; the rule has not.

**Springs, not easing curves.** An ease can only approach its target, so it can never
overshoot, and overshoot is the character the whole site is built on. Every animated system
derives from one damped value, which is why they read as one language.

**Never re-render per frame.** Scroll and pointer handlers write to mutable stores; the rAF
loops read them and write straight to inline transforms. Nothing animated touches React
state.

**Chase inputs, map positions.** This decides every new effect here. Anything reacting to an
*input* — scroll velocity, pointer position — springs toward a target, so it lags going in
and glides coming out. Anything that is a *function of where something already is* maps
directly, unsprung (`lib/reveal.ts`, `ScrollLitText`). Damping the second kind makes a row
still dark after it has visibly arrived.

**One gesture, one implementation.** The work index and the experience list share
`useFrameReveal`; the About statement and the contact address share `ScrollLitText`. Two
copies of a sixty-line rAF loop is how two sections quietly stop matching.

**Navigation is grey, content is white.** The `← Work` link and the *Next* link at the foot
are both muted, resolving on hover. It is why the close can be the loudest thing on a study
without fighting anything.

## Things that will break if you "tidy" them

Each has a comment at the site explaining it. They look wrong and are not.

- **`page.tsx` uses bare `relative` with no `z-index`.** Stacking is DOM order: the field is
  positioned and comes first, the content second, so it paints on top.
- **Nothing blends against the field, deliberately.** The hero used to knock out with
  `mix-blend-difference`. If it ever returns: it must be applied to the *section* and no
  deeper, because `mix-blend-mode` only blends within the nearest ancestor that opens a
  stacking context — anything pinned, transformed or z-indexed between the type and the
  field silently kills it and the type renders plain white. That is exactly what it did,
  unnoticed, for the whole life of the previous hero. With the blend gone, `opacity` is safe
  again.
- **Tailwind 4 puts the important modifier at the END: `opacity-100!`, not `!opacity-100`.**
  The v3 spelling compiles to nothing. `Projects.tsx` lost its entire hover state to this
  and looked broken rather than unstyled, which is much harder to spot.
- **`Field.tsx` draws one frame synchronously before starting rAF.** Browsers don't run
  `requestAnimationFrame` in background tabs, so without it a page opened in one renders a
  blank canvas until focused.
- **`renderer.ts` prepends `precision highp float`.** three.js does this invisibly; raw
  WebGL does not, and the shader won't compile without it.
- **`destroy()` does not call `WEBGL_lose_context`.** A canvas hands out one context ever,
  and StrictMode double-mounts effects in dev — losing it kills the second renderer.
- **Characters are grouped into per-word `whitespace-nowrap` wrappers.** Every inline-block
  is a break opportunity, so a flat list lets the browser break *mid-word* — it rendered
  "MoonPay" as "MoonPa / y". The plain spaces between wrappers are the only legal break
  points and must stay real spaces; a non-breaking space makes the line one unbreakable run.
- **`[white-space-collapse:preserve]`, never `whitespace-pre-wrap`.** `white-space` is a
  shorthand that also sets `text-wrap`, so the pre-wrap utility silently overwrites
  `text-balance`. The longhand preserves the trailing space a half-typed string ends on —
  without it the caret hops back a space-width on alternate ticks.
- **`ch` resolves against the element's OWN font-size.** A measure on a wrapper div inherits
  the 16px base, so `max-w-[32ch]` around 52px type computes to about 190px. Put the measure
  on the text element.
- **Loops that write transforms must measure from layout, not `getBoundingClientRect()`.** A
  client rect includes transforms, so a loop that writes one feeds its own output back in.
  `lib/reveal.ts` caches `offsetTop`/`offsetHeight`. `ScrollLitText` may use a rect
  precisely because it only ever writes `color`.
- **Blocks at the bottom of the document can never finish a positional scroll effect.**
  Nothing can be scrolled past the end, so progress from viewport position tops out near
  zero. `ScrollLitText` blends in a second progress from remaining scroll distance. The
  address is the last element in the document, so that tail blend is the only thing lighting
  it — remove it and the close never resolves.
- **`useFrameReveal` must not be used in the closing block**, for the same reason: it maps
  opacity from distance to the viewport centre, and nothing in the last screen can be
  scrolled to the centre. Every row would sit permanently faded.
- **The address is sized from a measured ratio.** It renders 10.41× its own font-size wide,
  which is where 6.6vw / 5.2vw / 4.2vw comes from — it clears the padding at 320px, the
  narrowest viewport worth serving. Re-measure if the address changes length, with a `Range`
  over the text rather than the element's rect: the paragraph is a block, so its rect is the
  container's width, not the type's.
- **`ScrollLitText` writes `color` inline on every character**, so any colour-driven effect
  on the type it wraps is overridden silently. The address's hover fringe is `text-shadow`
  and nothing else for that reason — it inherits, and nothing else on the page touches it.
  Offsets are in `em` because the type is sized in `vw` and steps down twice; in `px` the
  fringe is a smear on a phone and invisible on a wide display.
- **The close is centred and nothing else on the site is.** It bookends the centred hero;
  left-aligned it read as unfinished rather than sparse. The address link must stay
  `inline-flex` — a `flex` box would stretch full width and take its underline with it.
- **`interference.ts` carries a React Bits copyright notice.** A derivative under MIT +
  Commons Clause; the notice must stay. If the site ever leans hard on "the effect behind
  this page" as an authorship claim, switch the default to an original effect.

## Local

```bash
npm run dev        # localhost:3000
npm run build      # also type-checks
npm run lint
```

**Screenshots of this site are not evidence.** An automated or backgrounded tab is `hidden`,
so Chrome suspends rAF entirely and `IntersectionObserver` never fires: every scroll-driven
effect looks frozen, canvases render blank, and it is indistinguishable from a real bug. A
whole debugging pass once went into a defect that did not exist. Dispatching `resize`
re-poses things, which is the quickest way to tell the two apart.

**The email signup was removed on request** — `Subscribe.tsx` is deleted and nothing renders
a form. `/api/subscribe` and its `BUTTONDOWN_API_KEY` handling were left in place: working,
tested integration code that costs nothing to keep. Its copy string,
`site.contact.subscribe`, is also still in `site.ts` and read by nothing. Delete both if the
list is never coming back.
