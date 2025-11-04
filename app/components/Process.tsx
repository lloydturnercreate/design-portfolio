import Section from './Section';

const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'Understand business goals, users, and product constraints.',
  },
  {
    step: '02',
    title: 'Systemise',
    description: 'Build scalable components, patterns, and flows.',
  },
  {
    step: '03',
    title: 'Ship',
    description: 'Rapid iteration, developer handoff, and measurable results.',
  },
];

/**
 * Process
 * Three-step process visualization
 * Simple, scannable approach
 */
export default function Process() {
  return (
    <Section className="py-20 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Approach</span>
        </div>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-5 md:mb-6 text-balance">
            How I Work
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-[1.6] font-light tracking-tight-1">
            A repeatable approach that scales with your team
          </p>
        </div>

        {/* Process steps - simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {processSteps.map((step, index) => (
            <div key={index} className="relative bg-card border border-border p-8 md:p-10 rounded-2xl hover:border-muted-dark hover:shadow-premium transition-all duration-300 group">
              {/* Circular number badge */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <span className="text-xl md:text-2xl font-bold text-primary tracking-tight-1">
                  {step.step}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 tracking-tight-1">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-muted leading-[1.6] font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

