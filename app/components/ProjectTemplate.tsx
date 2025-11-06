import { Project } from '@/lib/projects';
import ProjectHero from './project/ProjectHero';
import ProjectGallery from './project/ProjectGallery';
import ProjectChallenge from './project/ProjectChallenge';
import ProjectApproach from './project/ProjectApproach';
import ProjectResults from './project/ProjectResults';
import ProjectNavigation from './project/ProjectNavigation';
import Footer from './Footer';

interface ProjectTemplateProps {
  project: Project;
}

/**
 * ProjectTemplate
 * Flexible template for project case study pages
 * Conditionally renders sections based on available content
 */
export default function ProjectTemplate({ project }: ProjectTemplateProps) {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden bg-background relative">
        {/* Hero Section - Always rendered */}
        <ProjectHero hero={project.hero} color={project.color} />

        {/* Gallery Section - Optional */}
        {project.gallery && project.gallery.length > 0 && (
          <ProjectGallery images={project.gallery} />
        )}

        {/* Challenge Section - Optional */}
        {project.challenge && <ProjectChallenge challenge={project.challenge} color={project.color} />}

        {/* Approach Section - Optional */}
        {project.approach && <ProjectApproach approach={project.approach} color={project.color} />}

        {/* Results Section - Optional */}
        {project.results && <ProjectResults results={project.results} color={project.color} />}

        {/* Navigation - Always rendered */}
        <ProjectNavigation
          nextProject={project.nextProject}
          prevProject={project.prevProject}
        />
      </main>
      <Footer />
    </>
  );
}

