import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { caseStudies } from '@/content/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.domain, priority: 1 },
    /*
      Every study, not just the featured ones. Raptor and Sukiyaki are off the
      work index but they are real pages with real content, and a page worth
      keeping is a page worth indexing — the reason they are unfeatured is that
      the index is a curated argument, not that the work is hidden.
    */
    ...caseStudies.map((study) => ({
      url: `${site.domain}/${study.slug}`,
      priority: study.featured === false ? 0.5 : 0.8,
    })),
  ]
}
