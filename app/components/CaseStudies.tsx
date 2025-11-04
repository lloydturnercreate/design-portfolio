import Section from './Section';

const caseStudies = [
  {
    company: 'Phuture',
    title: 'Launch-Ready Investment App',
    description:
      "Built Phuture's trading interface and design system, reducing onboarding friction and enabling faster product rollouts post-Series A.",
  },
  {
    company: 'Raptor',
    title: 'Design System for Fintech API Platform',
    description:
      'Created a unified design system that cut design-to-dev handoff time by 40% and improved cross-product consistency.',
  },
  {
    company: 'MoonPay',
    title: 'Scale Through Systemisation',
    description:
      "Contributed to MoonPay's product ecosystem during high-growth, helping unify design language across multiple user flows.",
  },
];

/**
 * CaseStudies
 * Three case study cards showcasing real outcomes
 * Clean grid layout with clear hierarchy
 */
export default function CaseStudies() {
  return (
    <Section className="py-20 md:py-32 lg:py-40 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Work</span>
        </div>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-4 md:mb-5 text-balance">
            Selected Work
          </h2>
        </div>

        {/* Case study cards grid - Equal weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={index} study={study} />
          ))}
        </div>

        {/* View Case Studies CTA */}
        <div className="text-center">
          <a
            href="#case-studies"
            className="inline-flex items-center justify-center px-10 py-5 bg-card border border-border text-foreground font-semibold rounded-2xl hover:border-muted-dark hover:bg-background transition-all duration-300 text-base min-h-[60px] hover:scale-[1.02] tracking-tight-1"
            aria-label="View all case studies"
          >
            View Full Case Studies
          </a>
        </div>
      </div>
    </Section>
  );
}

interface CaseStudyCardProps {
  study: {
    company: string;
    title: string;
    description: string;
  };
}

function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-muted-dark hover:shadow-premium transition-all duration-300 cursor-pointer group h-full flex flex-col">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-background border-b border-border flex items-center justify-center group-hover:bg-secondary transition-colors">
        <span className="text-sm md:text-base text-muted-dark font-medium uppercase tracking-[0.12em]">
          {study.company}
        </span>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 flex-1 flex flex-col">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight-1">
          {study.company}
        </h3>
        <p className="text-sm md:text-base font-semibold text-primary uppercase tracking-[0.08em] mb-4">
          {study.title}
        </p>
        <p className="text-base md:text-lg text-muted leading-[1.6] flex-1 font-light">
          {study.description}
        </p>
      </div>
    </div>
  );
}

