import type { Metadata } from 'next'

/*
 * Metadata has to live here rather than in `page.tsx`, because that page is a
 * client component and Next cannot export `metadata` from one.
 */
export const metadata: Metadata = {
  title: 'Warble — a procedural ringtone generator',
  description:
    'A ringtone generator built on the Web Audio API — procedural, harmonically constrained, and tuned so that the things it makes are pleasant to be interrupted by.',
  keywords: ['Web Audio API', 'generative audio', 'procedural music', 'interaction design'],
}

export default function WarbleLayout({ children }: { children: React.ReactNode }) {
  return children
}
