import type { Metadata } from 'next';
import ProjectTemplate from '../components/ProjectTemplate';
import { sukiyaki } from '@/lib/projects';

export const metadata: Metadata = {
  title: sukiyaki.metadata.title,
  description: sukiyaki.metadata.description,
  keywords: sukiyaki.metadata.keywords,
  openGraph: {
    title: sukiyaki.metadata.title,
    description: sukiyaki.metadata.description,
    type: 'website',
    url: `https://lloydturner.co.uk/${sukiyaki.metadata.slug}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: sukiyaki.metadata.title,
    description: sukiyaki.metadata.description,
  },
};

export default function SukiyakiPage() {
  return <ProjectTemplate project={sukiyaki} />;
}

