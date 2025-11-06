'use client';

import Link from 'next/link';

interface ProjectNavigationProps {
  nextProject?: string;
  prevProject?: string;
}

/**
 * ProjectNavigation
 * Navigation controls for project pages
 * Back to gallery, previous and next project links
 */
export default function ProjectNavigation({
  nextProject,
  prevProject,
}: ProjectNavigationProps) {
  return (
    <section className="py-16 md:py-20 bg-secondary border-t border-border w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Back to Gallery */}
            <Link
              href="/#work"
              className="group flex items-center gap-3 text-muted hover:text-foreground transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-base md:text-lg font-medium tracking-tight-1">
                Return to gallery view
              </span>
            </Link>

            {/* Previous/Next Project Navigation */}
            <div className="flex items-center gap-6 md:gap-8">
              {prevProject ? (
                <Link
                  href={`/${prevProject}`}
                  className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors duration-200"
                  aria-label="Previous project"
                >
                  <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-sm md:text-base font-medium uppercase tracking-[0.08em]">
                    Previous
                  </span>
                </Link>
              ) : (
                <div className="w-20" />
              )}

              {nextProject ? (
                <Link
                  href={`/${nextProject}`}
                  className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors duration-200"
                  aria-label="Next project"
                >
                  <span className="text-sm md:text-base font-medium uppercase tracking-[0.08em]">
                    Next
                  </span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <div className="w-20" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

