# lloydturner.co.uk

Personal portfolio for Lloyd Turner — product designer. **The deployed site**, live on Vercel
as `design-portfolio`.

```bash
npm run dev     # localhost:3000
npm run build   # also type-checks
npm run lint
```

Next 16, React 19, Tailwind 4. No other runtime dependencies — see `AGENTS.md` for why, and
for the things that look wrong but are load-bearing.

Strategy and copy rationale: `~/Documents/AI/rebirth/portfolio/PORTFOLIO_PLAN.md`.

## Shape

One WebGL field fixed to the viewport for the whole session; the page's sections are phases of
it rather than blocks sitting on top of it.

- `lib/field/` — the renderer, the scroll-driven score, and the input stores
- `components/Statement.tsx` — the hero, per-character springs
- `components/Projects.tsx` — the work index: one typographic track, cover art on cursor
  approach
- `components/project/` — the case-study page: `CaseStudyTemplate`, plus `Media`, `Parallax`
  and `ClaimText`
- `content/` — all copy and project data. `case-studies.ts` is the whole of the work

## State

Six case studies on one index, **Phasmatic first**: Phasmatic, Moonit, Phuture, Sukiyaki,
Warble, Raptor. Moonit and Phuture are chaptered; the other four are lite entries. All art is
in, and every study prerenders.

**The site leads on craft, not employment.** Phasmatic at 01, job titles out of the metadata,
and the About block is Lloyd's own writing — hold new copy to that register rather than
rewriting it for him.

**Warble's app is not in this repo.** It has its own deployment at
[warbleton.vercel.app](https://warbleton.vercel.app), source at `../warble`. The study stays,
and is the only thing linking to the frozen 2025 build at `/v1` — which is why `live` takes a
list.

**Dead but kept on purpose**: `/api/subscribe` (working code, no form renders),
`site.contact.subscribe` and `site.sections` (unread copy), the `moonpay` scaffold in
`case-studies.ts`, and the `COVERS` map in `content/flow.ts` (reachable only via
`builtProjects`, which is empty).
