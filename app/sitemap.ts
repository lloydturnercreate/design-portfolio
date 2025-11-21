import { MetadataRoute } from 'next';
import { allProjects } from '@/lib/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lloydturner.co.uk';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // Project routes
  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${baseUrl}/${project.metadata.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
