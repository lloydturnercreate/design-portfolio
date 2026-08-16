export interface BuiltProject {
  name: string
  /** One line. What it is, not what it aspires to be. */
  description: string
  /** Short qualifier shown under the name — the proof, not a category. */
  note?: string
  href?: string
  /** Drives the card's accent. */
  color: string
  year: string
}

/**
 * "Built and shipped" — solo work as a one-line row on the work index.
 *
 * **This list is empty, and that is the current state rather than a bug.**
 *
 * It emptied on 2026-08-15 from both ends. Phasma and Typerunner had already
 * come off; Margin and Refiner came off because a row a reader cannot click is a
 * claim with no evidence behind it, and four of those made the solo work read as
 * a list of assertions. Then Phasmatic and Warble went the other way — both
 * outgrew a one-line row and are lite case studies in `case-studies.ts` now,
 * each with a page and a link to the running thing.
 *
 * So the distinction this file used to draw — client work above, solo work
 * below — is carried by the `role` line instead: "Designed and built solo" sits
 * where an employed study says "Head of Design". One track, one shape, and the
 * seniority signal still legible per row.
 *
 * **Keep the file.** The type and the wiring in `flow.ts` cost nothing, and
 * three things are explicitly parked to return: **Margin** and **Refiner** when
 * each has somewhere to land — a page, a download, or a product site — and
 * **Phasma** once Phasmatic has launched and the funnel argument is real rather
 * than planned. Anything landing here should still be running, and should still
 * go somewhere.
 */
export const builtProjects: BuiltProject[] = [
]
