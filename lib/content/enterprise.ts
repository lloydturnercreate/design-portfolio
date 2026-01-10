/**
 * Content configuration for enterprise-focused version
 * Domain: work.lloydturner.co.uk
 */

export const enterpriseContent = {
  hero: {
    tagline: 'Staff Product Designer',
    headline: 'High-Scale Infrastructure & Design Systems for Finance & Tech',
    subheadline: 'Specializing in bridging the gap between design and engineering. I build interactive prototypes and accessible design systems that allow teams to ship complex products faster.',
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
    headline: 'Approach',
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
  // Full project detail page overrides for enterprise
  projectDetails: {
    moonpay: {
      hero: {
        company: 'MoonPay',
        tagline: 'Scaling a Zero-Latency Trading Platform to $10M+ Profit in 12 months.',
        intro:
          'The Solana market faced a fragmentation problem: viral aggregators were fast but risky, while traditional platforms were safe but slow. My role was to architect a terminal for high-frequency traders: users who demand sub-second execution speed with institutional-grade stability. I bridged the gap between complex liquidity data and a simplified, single-click execution UI.',
        meta: {
          role: 'Lead Product Designer (End-to-End)',
          duration: '2024-Present',
          team: 'Sole Designer (Moonit), Core Team (Labs)',
          scope: ['Design Systems', 'React Prototyping', 'Data Visualization', 'Product Strategy', 'UI/UX'],
        },
      }
    },
    'phuture-finance': {
      hero: {
        company: 'Phuture',
        tagline: 'Architecting a Non-Custodial Index Protocol.',
        intro:
          'The technical barrier to DeFi entry was fragmentation: users had to manage 10+ smart contract approvals and manually rebalance positions. My role was to abstract this backend complexity into a unified dashboard. I designed the "Smart Basket" interaction model, compressing a 15-step transaction flow into a single signature, which drove the platform to $8M TVL.',
        meta: {
          role: 'Head of Design',
          duration: '2021-2023',
          team: '1 designer, 5 engineers',
          scope: ['Product Design', 'Design System', 'User Research', 'Data Visualization', 'Interaction Design'],
        },
      }
    }
  },
  about: {
    paragraphs: [
      "I'm Lloyd Turner — a Staff Product Designer & Technologist with over a decade of experience shipping scalable infrastructure at Google, Amazon, and MoonPay.",
      "I build interactive prototypes and tokenized design systems that de-risk engineering builds and ensure the final product matches the architectural vision.",
      "I thrive in complex technical domains like High-Frequency Trading and DeFi, where system logic and latency matter just as much as visual polish. I am looking for a technical product team where I can contribute as a high-impact Individual Contributor."
    ],
    primaryCTA: {
      text: 'Download Resume',
      url: '/resume/Lloyd Turner _ Product Designer.pdf'
    },
    secondaryCTA: {
      text: 'Connect on LinkedIn',
      url: 'https://www.linkedin.com/in/lloydturner'
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
