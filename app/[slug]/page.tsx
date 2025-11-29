import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectTemplate from '../components/ProjectTemplate';
import { allProjects, getProjectBySlug } from '@/lib/projects';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all projects
export function generateStaticParams() {
  // Only generate routes for case studies, not AI projects (which have their own pages)
  return allProjects
    .filter((project) => project.metadata.category !== 'ai-project' && project.metadata.category !== 'experiment')
    .map((project) => ({
      slug: project.metadata.slug,
    }));
}

// Generate metadata for each project
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {};
  }

  return {
    title: project.metadata.title,
    description: project.metadata.description,
    keywords: project.metadata.keywords,
    openGraph: {
      title: project.metadata.title,
      description: project.metadata.description,
      type: 'website',
      url: `https://lloydturner.co.uk/${project.metadata.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.metadata.title,
      description: project.metadata.description,
    },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectTemplate project={project} />;
}

