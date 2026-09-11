# lloydturner.co.uk

Personal portfolio for Lloyd Turner — product designer.

Rebuilt 2026-08-05. **This is the deployed site**, live at
[lloydturner.co.uk](https://lloydturner.co.uk) on Vercel as `design-portfolio`; it shipped
on 2026-09-10 as "Replace site with the 2026 rebuild".

There was a second copy of this repo at `../portfolio-next`, where Warble's later work
happened while this folder carried the site. It was archived to `../xx.Archive/portfolio-next`
on 2026-09-11 once Warble left. **There is one portfolio folder.**

```bash
npm run dev     # localhost:3000
npm run build   # also type-checks
npm run lint
```

Next 16, React 19, Tailwind 4. No other runtime dependencies — see `AGENTS.md` for why that
is deliberate, and for the list of things that look wrong but are load-bearing.

Strategy, copy rationale and what's next:
`~/Documents/AI/rebirth/portfolio/PORTFOLIO_PLAN.md`.

## Shape

One WebGL field fixed to the viewport for the whole session; the page's sections are phases
of it rather than blocks sitting on top of it.

- `lib/field/` — the renderer, the scroll-driven score, and the input stores
- `components/Statement.tsx` — the hero, per-character springs
- `components/Projects.tsx` — the work index: one typographic track, cover art on cursor
  approach
- `components/project/` — the case-study page: `CaseStudyTemplate`, plus `Media`, `Parallax`
  and `ClaimText`
- `content/` — all copy and project data. `case-studies.ts` is the whole of the work

## State

Six case studies on one index, **Phasmatic first**: Phasmatic, Moonit, Phuture, Sukiyaki,
Warble, Raptor. Moonit and Phuture are chaptered; the other four are lite entries. All art
is in and no placeholder renders anywhere. Build is clean and every study prerenders.

**Warble's app is not in this repo.** It was a route here, at `/warble/play`, and moved to
its own deployment on 2026-09-11 — [warbleton.vercel.app](https://warbleton.vercel.app),
source at `../warble`. The study stays, and is the only thing linking to the frozen 2025
build at `/v1`. This is why `live` on a `CaseStudy` takes a list.

**The site leads on craft, not employment**, since 2026-08-16. Phasmatic at 01, job titles
out of the metadata, and the About block is Lloyd's own writing — hold new copy to that
register rather than rewriting it for him.

**Dead but kept on purpose**: `/api/subscribe` (working code, no form renders),
`site.contact.subscribe` and `site.sections` (unread copy), the `moonpay` scaffold in
`case-studies.ts` (exported, unrouted), and the `COVERS` map in `content/flow.ts` (only
reachable via `builtProjects`, which is empty).
