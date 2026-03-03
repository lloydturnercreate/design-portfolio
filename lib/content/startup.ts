/**
 * Content configuration for startup-focused version
 * Domain: lloydturner.co.uk
 */

export const startupContent = {
  hero: {
    tagline: 'Strategic Design Partner',
    headline: 'Investor-grade products for tech & finance',
    subheadline: 'I help founders and product teams turn complex ideas into clear, scalable interfaces — design systems, launch-ready UX, and hands-on strategy for growth-stage startups.',
    primaryCTA: {
      text: 'Book a Consultation',
      url: 'https://calendly.com/lloyd-turner/intro-call',
      label: 'For Founders'
    },
    secondaryCTA: {
      text: 'Check Availability',
      url: 'https://form.typeform.com/to/Rwp3bZGg',
      label: 'For Agencies'
    }
  },
  process: {
    // No overrides for startup version - uses default from Process component
    headline: null,
    subheadline: null,
    steps: null
  },
  projects: {
    // No overrides for startup version - uses default from projects.ts
  } as Record<string, { title?: string; description?: string }>,
  sections: {
    showCredibilityStrip: true,
    showValueSection: true,
    showCaseStudies: true,
    showAIProjects: true,
    showProcess: false, // Hide on startup version
    showAbout: true,
    showTwoDoorCTA: true
  }
} as const;
