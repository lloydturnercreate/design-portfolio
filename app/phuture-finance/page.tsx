import type { Metadata } from 'next';
import ProjectTemplate from '../components/ProjectTemplate';
import { phutureFinance } from '@/lib/projects';

export const metadata: Metadata = {
  title: phutureFinance.metadata.title,
  description: phutureFinance.metadata.description,
  keywords: phutureFinance.metadata.keywords,
  openGraph: {
    title: phutureFinance.metadata.title,
    description: phutureFinance.metadata.description,
    type: 'website',
    url: `https://lloydturner.co.uk/${phutureFinance.metadata.slug}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: phutureFinance.metadata.title,
    description: phutureFinance.metadata.description,
  },
};

export default function PhutureFinancePage() {
  return <ProjectTemplate project={phutureFinance} />;
}

