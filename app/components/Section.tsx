import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section
 * Reusable section wrapper with consistent structure
 * Provides mobile-first responsive structure with premium spacing
 */
export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full ${className}`}
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}

