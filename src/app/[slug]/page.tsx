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
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const study = getCaseStudyBySlug(slug)
  if (!study) notFound()

  return <CaseStudyTemplate study={study} />
}
