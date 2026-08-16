import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { site } from '@/content/site'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

/**
 * Metadata states capability, not availability.
 *
 * The previous site's keywords led with "fintech", "Web3" and "Strategic Design
 * Partner" — the first two anchor him to the industry he's leaving, and the
 * third read as "consultant, will leave in a year" to the audience of the time.
 * They were replaced with job titles, and those went too on 2026-08-16 when the
 * audience stopped being people hiring for a level. See `keywords` below.
 */
/**
 * Built from `site.hero`, never retyped.
 *
 * These three strings were hardcoded copies of the hero, and when the credibility
 * line changed they silently kept the old claim — in the description, the
 * OpenGraph card and the Twitter card. Metadata is the most public surface on
 * the site and the one nobody looks at, so a stale claim can sit in search
 * results and link previews indefinitely. Derived, it cannot drift.
 */
const SUMMARY = `${site.hero.claim} ${site.hero.credibility}`

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: 'Lloyd Turner — Product Designer',
    template: '%s | Lloyd Turner',
  },
  description: `Product designer. ${SUMMARY}`,
  /*
    Craft terms, not job titles. "staff product designer" and "principal product
    designer" were here to be found by someone hiring for a level — the frame
    dropped on 2026-08-16 — and they were the last place on the site still
    written to be assessed rather than read. What replaces them is what the work
    actually is, and what someone with something ambitious to make would search.
  */
  keywords: [
    'product designer',
    'product design',
    'interaction design',
    'design engineering',
    'WebGL',
    'shaders',
    'creative development',
    'brand and digital design',
    'London',
  ],
  authors: [{ name: site.name, url: site.domain }],
  openGraph: {
    type: 'website',
    url: site.domain,
    siteName: site.name,
    title: 'Lloyd Turner — Product Designer',
    description: SUMMARY,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lloyd Turner — Product Designer',
    description: SUMMARY,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  )
}
