import type { Metadata } from 'next';
import ProjectTemplate from '../components/ProjectTemplate';
import { raptor } from '@/lib/projects';

export const metadata: Metadata = {
  title: raptor.metadata.title,
  description: raptor.metadata.description,
  keywords: raptor.metadata.keywords,
  openGraph: {
    title: raptor.metadata.title,
    description: raptor.metadata.description,
    type: 'website',
    url: `https://lloydturner.co.uk/${raptor.metadata.slug}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: raptor.metadata.title,
    description: raptor.metadata.description,
  },
};

export default function RaptorPage() {
  return <ProjectTemplate project={raptor} />;
}








