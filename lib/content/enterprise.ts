/**
 * Content configuration for enterprise-focused version
 * Domain: work.lloydturner.co.uk
 */

export const enterpriseContent = {
  hero: {
    tagline: 'Staff Product Designer',
    headline: 'High-Scale Financial Infrastructure & Design Systems',
    subheadline: 'Specializing in bridging the gap between design and engineering. I build React-based prototypes and accessible design systems that allow teams to ship complex financial products faster.',
    primaryCTA: {
      text: 'View Case Studies',
      url: '#case-studies',
      label: null // No label for enterprise version
    },
    secondaryCTA: {
      text: 'Download Resume',
      url: '/resume/Lloyd Turner _ Product Designer.pdf',
      label: null // No label for enterprise version
    }
  },
  sections: {
    showCredibilityStrip: true,
    showValueSection: true,
    showCaseStudies: true,
    showAIProjects: false, // Hide AI projects for enterprise
    showProcess: true,
    showAbout: true,
    showTwoDoorCTA: false // Hide two-door CTA for enterprise
  }
} as const;
