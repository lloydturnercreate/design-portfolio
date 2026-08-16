/**
 * The loose CV.
 *
 * Deliberately shorter than the PDF. The page's job is to establish level and
 * range in about fifteen seconds; the document's job is to survive an ATS and a
 * recruiter's checklist. Anyone who wants the full thing can download it.
 *
 * **Every industry word is stripped.** "Web3", "DeFi", "crypto" and "fintech"
 * appear nowhere here, though they are all over the PDF — see the positioning
 * table in `rebirth/REBIRTH_PLAN.md`. The employers stay, because they are the
 * credential; the vertical goes, because it is the thing being left. Each line
 * describes the problem rather than the market, which is the same rule the case
 * study cards follow.
 *
 * Not included, on purpose: Education and Skills. A BA and a tools list read as
 * junior at Staff/Principal level, and both are on the PDF for whoever needs to
 * tick them off.
 */
export interface Role {
  /** Shown as given — the range, not a parsed date, so "Earlier" is legal. */
  period: string
  company: string
  title: string
  /** One sentence. If it needs two, it is doing the case study's job. */
  summary: string
}

export const roles: Role[] = [
  {
    period: '2024 — now',
    company: 'MoonPay',
    title: 'Senior Product Designer',
    summary:
      // Ranges, not figures. The exact volume and profit numbers were never
      // externally disclosed, so they are not published here, on the case study,
      // or in its meta description. The seniority signal survives the vagueness;
      // publishing someone else's undisclosed numbers would not.
      'Design lead on a real-time trading terminal built 0 to 1 — nine figures in volume, profitable inside a year — and on the payments platform underneath it.',
  },
  {
    period: '2023 — 2024',
    company: 'Freelance',
    title: 'Product & Visual Designer',
    summary:
      'End-to-end product design for startups and agencies, including the prototypes and investor material behind a $3.1m Series A, and contract UX work for Amazon.',
  },
  {
    period: '2021 — 2023',
    company: 'Phuture',
    title: 'Head of Design',
    summary:
      'Launched an index investing platform and the design system under it, reducing time-to-invest by 40%.',
  },
  {
    period: '2019 — 2021',
    company: 'Google',
    title: 'UX / Visual Designer',
    summary:
      'Research and design standards for Android across 200M+ devices, working with Snapchat, Netflix, BBC and Samsung.',
  },
  {
    period: '2019',
    company: 'City Index',
    title: 'Visual Designer',
    summary: 'The largest rebrand in the company’s forty-year history.',
  },
  // These three were dated on 2026-08-16, which closed the last open copy item.
  // City Index had read "2016 — 2019", which was wrong; Office Freedom and
  // Netrix had no dates in the PDF and were grouped as a single "Earlier" row
  // rather than guessed, on the rule that an invented date is worse than a
  // vague one. With real dates the row splits, because two companies sharing
  // one line was only ever a consequence of having nothing to sort them by.
  {
    period: '2019',
    company: 'Office Freedom',
    title: 'Lead Designer',
    summary: 'A brand overhaul and a rebuild of the core user journeys.',
  },
  {
    period: '2018',
    company: 'Netrix',
    title: 'Visual Designer',
    summary: 'Campaign work across property and retail.',
  },
]
