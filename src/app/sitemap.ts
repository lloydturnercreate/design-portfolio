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

      `unlisted` is the one exception, and it is the case where the work IS
      hidden: MoonPay is a link to hand to one person, not a page to be found.
      It is dropped here and carries `robots: noindex` from `[slug]/page.tsx` —
      the sitemap is a hint, the meta tag is the instruction, and a page meant
      to stay private wants both.
    */
    ...caseStudies
      .filter((study) => !study.unlisted)
      .map((study) => ({
        url: `${site.domain}/${study.slug}`,
        priority: study.featured === false ? 0.5 : 0.8,
      })),
  ]
}
