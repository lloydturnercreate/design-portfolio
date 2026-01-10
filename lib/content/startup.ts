/**
 * Content configuration for startup-focused version
 * Domain: lloydturner.co.uk
 */

export const startupContent = {
  hero: {
    tagline: 'Strategic Design Partner',
    headline: 'Investor-grade products for fintech & Web3',
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
  projectDetails: {
    // No detail page overrides for startup version
  } as Record<string, any>,
  about: {
    paragraphs: [
      "I'm Lloyd Turner — a Strategic Design Partner with over a decade of experience at companies like Google, Amazon and MoonPay.",
      "I now help fast-moving startups and agencies build fintech and Web3 products that stand out for clarity, usability, and scale.",
      "My background lets me work both strategically and hands-on — from early-stage discovery through to developer handoff."
    ],
    primaryCTA: {
      text: 'Download CV',
      url: '/resume/Lloyd Turner _ Product Designer.pdf'
    },
    secondaryCTA: {
      text: 'Connect on LinkedIn',
      url: 'https://www.linkedin.com/in/lloyd-turner-370837110/'
    }
  },
  sections: {
    showCredibilityStrip: true,
    showValueSection: true,
    showCaseStudies: true,
    showAIProjects: true,
    showProcess: true,
    showAbout: true,
    showTwoDoorCTA: true
  }
} as const;
