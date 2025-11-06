import type { Metadata } from 'next';
import ProjectTemplate from '../components/ProjectTemplate';
import { moonpay } from '@/lib/projects';

export const metadata: Metadata = {
  title: moonpay.metadata.title,
  description: moonpay.metadata.description,
  keywords: moonpay.metadata.keywords,
  openGraph: {
    title: moonpay.metadata.title,
    description: moonpay.metadata.description,
    type: 'website',
    url: `https://lloydturner.co.uk/${moonpay.metadata.slug}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: moonpay.metadata.title,
    description: moonpay.metadata.description,
  },
};

export default function MoonPayPage() {
  return <ProjectTemplate project={moonpay} />;
}

