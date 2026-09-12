import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudyTemplate from '@/components/project/CaseStudyTemplate'
import { caseStudies, getCaseStudyBySlug } from '@/content/case-studies'

/*
 * One content model. `content/projects.ts` — the Challenge / Approach / Results
 * shape this replaced — and the `ProjectTemplate` that rendered it were deleted
 * on 2026-08-15, once Phuture, Raptor and Sukiyaki came across. The dual
 * resolution that used to live here went with them.
 */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudyBySlug(slug)
  if (!study) return {}

  return {
    title: study.meta.title,
    description: study.meta.description,
    keywords: study.meta.keywords,
    /*
     * An unlisted study is one nobody is meant to find. It is already out of
     * the sitemap; this is the half that actually instructs a crawler rather
     * than hinting to one. `follow: false` as well as `index: false`, because
     * the page links onward to Moonit and there is no reason to advertise the
     * path it was reached by.
     *
     * Omitted entirely on every other study, so the default stays "index this"
     * and nothing has to opt in to being public.
     */
    ...(study.unlisted ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const study = getCaseStudyBySlug(slug)
  if (!study) notFound()

  return <CaseStudyTemplate study={study} />
}
