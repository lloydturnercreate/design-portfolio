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
  process: {
    headline: 'Technical Approach',
    subheadline: 'A systems-led workflow that reduces engineering overhead and accelerates delivery.',
    steps: [
      {
        step: '01',
        title: 'Definition',
        description: 'I partner with Engineering Leads during the definition phase to audit technical constraints early. We validate logic and feasibility before pixel-pushing begins, preventing costly re-writes later.',
      },
      {
        step: '02',
        title: 'Architecture',
        description: 'I ship tokenized component libraries that act as the single source of truth between Figma and the Codebase. This eliminates \'drift\' and allows engineers to ship UI changes with 0% regression.',
      },
      {
        step: '03',
        title: 'Implementation',
        description: 'I work inside the staging environment, pushing CSS fixes and polishing interaction logic to ensure the shipped binary is pixel-perfect and performance-optimized.',
      },
    ]
  },
  projects: {
    // Enterprise-specific project card overrides
    moonpay: {
      title: 'High-Velocity Trading Infrastructure ($100M+ VOL)',
      description: 'Architected the core trading terminal and design system that processed $100m+ in volume. Reduced trade execution time by abstracting complex liquidity logic into a single-click UI.',
    },
    'phuture-finance': {
      title: 'Institutional DeFi Investment Protocol',
      description: "Abstracted complex rebalancing logic into a 'Set & Forget' investment interface, reaching $8M TVL in a bear market.",
    }
  },
  sections: {
    showCredibilityStrip: true,
    showValueSection: false, // Hide for enterprise - using Process section instead
    showCaseStudies: true,
    showAIProjects: false, // Hide AI projects for enterprise
    showProcess: true,
    showAbout: true,
    showTwoDoorCTA: false // Hide two-door CTA for enterprise
  }
} as const;
