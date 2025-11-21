/**
 * Project data structure and content
 * Defines the content for case study project pages
 */

// Image layout types for flexible presentations
export type ImageLayout = 
  | 'full' // Full-width image
  | 'large' // Large centered image (90% width)
  | 'medium' // Medium centered image (70% width)
  | 'half-left' // Half-width, aligned left
  | 'half-right' // Half-width, aligned right
  | 'two-up' // Two images side by side
  | 'three-up'; // Three images in a row

export interface ImageBlock {
  src: string;
  alt: string;
  caption?: string;
  layout: ImageLayout;
}

// Dynamic content elements for visual pacing
export interface StatMetric {
  value: string;
  label: string;
  description?: string;
}

export interface PullQuote {
  text: string;
  attribution?: string;
}

export interface ProjectMeta {
  role: string;
  duration: string;
  team?: string;
  scope?: string[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectHero {
  company: string;
  tagline: string;
  intro: string;
  heroImage?: string; // Main hero background image
  meta?: ProjectMeta; // Project context (role, duration, etc)
}

export interface ProjectChallenge {
  title: string;
  description: string;
  pullQuote?: string;
  bullets: string[];
  images?: ImageBlock[];
}

export interface ProjectApproachSubsection {
  title: string;
  bullets: string[];
  images?: ImageBlock[];
}

export interface ProjectApproach {
  title: string;
  description: string;
  subsections: ProjectApproachSubsection[];
  images?: ImageBlock[]; // Images shown after all subsections
}

export interface ProjectResults {
  title: string;
  description?: string;
  metrics?: StatMetric[];
  bullets: string[];
  conclusion?: string;
  images?: ImageBlock[];
}

export interface ProjectMetadata {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
}

export interface ProjectCard {
  title: string; // Short tagline for case study card
  description: string; // Brief description for card preview
  backgroundImage?: string; // Background image for the card (fallback)
  backgroundImages?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }; // Responsive background images for different breakpoints
  imageAlignment?: 'left' | 'center'; // Image alignment (default: left on mobile, center on tablet+)
}

export interface Project {
  metadata: ProjectMetadata;
  card: ProjectCard; // Card preview data for case studies listing
  hero: ProjectHero;
  color: string; // Brand color for the project (hex code)
  gallery?: GalleryImage[]; // Image gallery shown after hero
  challenge?: ProjectChallenge;
  approach?: ProjectApproach;
  results?: ProjectResults;
}

// Phuture Finance Project Data
export const phutureFinance: Project = {
  metadata: {
    slug: 'phuture-finance',
    title: 'Phuture Finance - A new age of investing',
    description:
      'Head of Design at Phuture Finance, leading the product\'s UX and UI, balancing the complexity of Web3 with an intuitive, user-friendly experience.',
    keywords: [
      'crypto investing',
      'DeFi',
      'Web3',
      'product design',
      'fintech',
      'design system',
      'UX design',
    ],
  },
  card: {
    title: 'Making Crypto Index Investing Accessible',
    description: "Led design for a DeFi platform that brought institutional-grade index investing to retail users — balancing Web3 complexity with the simplicity investors expect.",
    backgroundImage: '/project-covers/phuture.png',
    backgroundImages: {
      mobile: '/project-covers/phuture-mobile.png',
      tablet: '/project-covers/phuture-tablet.png',
      desktop: '/project-covers/phuture-desktop.png',
    },
  },
  color: '#3e1fff',
  hero: {
    company: 'Phuture Finance',
    tagline: 'A new age of investing.',
    intro:
      'As Head of Design at Phuture Finance, I led the creation of a DeFi investment platform that made crypto index investing accessible. The challenge: balance Web3 complexity with the simplicity retail investors expect.',
    meta: {
      role: 'Head of Design',
      duration: '2021-2023',
      team: '1 designer, 5 engineers',
      scope: ['Product Design', 'Design System', 'User Research', 'Brand'],
    },
  },
  gallery: [
    {
      src: '/projects/phuture/phuture-1.avif',
      alt: 'Phuture Finance platform dashboard',
      caption: 'Platform Overview',
    },
    {
      src: '/projects/phuture/phuture-2.avif',
      alt: 'Phuture Finance investment interface',
      caption: 'Investment Interface',
    },
    {
      src: '/projects/phuture/phuture-3.webp',
      alt: 'Phuture Finance user flow',
      caption: 'User Experience',
    },
    {
      src: '/projects/phuture/phuture-4.webp',
      alt: 'Phuture Finance trading view',
      caption: 'Trading Experience',
    },
    {
      src: '/projects/phuture/phuture-5.avif',
      alt: 'Phuture Finance portfolio management',
      caption: 'Portfolio Management',
    },
    {
      src: '/projects/phuture/phuture-6.webp',
      alt: 'Phuture Finance mobile experience',
      caption: 'Mobile Interface',
    },
    {
      src: '/projects/phuture/phuture-7.webp',
      alt: 'Phuture Finance design system',
      caption: 'Design System',
    },
    {
      src: '/projects/phuture/phuture-8.gif',
      alt: 'Phuture Finance interactions',
      caption: 'Interactive Elements',
    },
  ],
  challenge: {
    title: 'The Challenge',
    description:
      'While platforms like Robinhood and Freetrade had revolutionised fiat investing with user-friendly experiences, DeFi platforms remained fragmented and intimidating for newcomers.',
    bullets: [
      'No established user patterns for crypto index investing',
      'High onboarding friction — wallets, gas fees, unfamiliar flows',
      'Lack of trust signals — cluttered UI, aggressive marketing, unclear security',
      'Disconnect from traditional investment models retail investors understood',
    ],
  },
  approach: {
    title: 'Design Approach',
    description:
      'With no precedent for crypto index investing, we looked to traditional finance platforms while adapting to DeFi\'s unique constraints. The process was iterative, driven by community feedback and real-world testing.',
    subsections: [
      {
        title: 'Simplifying Onboarding',
        bullets: [
          'Streamlined wallet-to-investment flow to minimal steps',
          'Contextual tooltips guide new users through key features',
          'Integrated app directly into website — no platform switching',
        ],
      },
      {
        title: 'Building Trust Through Design',
        bullets: [
          'Clean, distraction-free dashboard mirroring traditional portfolio tools',
          'Real-time data with clear asset breakdowns and rebalance indicators',
          'Minimalist, professional UI to differentiate from aggressive DeFi competitors',
        ],
      },
      {
        title: 'Streamlining Trading',
        bullets: [
          'Simplified buy/sell widget — no unnecessary complexity',
          'Trading experience familiar to Robinhood and Freetrade users',
          'Consistent UX across devices with fully integrated dark mode',
        ],
      },
      {
        title: 'Transparency & Education',
        bullets: [
          'Learning center for educational content on index investing',
          'Full transparency on asset selection, rebalancing, and security',
          'Predictable UI patterns minimize hesitation in trade execution',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '£5.5m',
        label: 'Assets Under Management',
        description: 'In first 12 months',
      },
      {
        value: '15,500+',
        label: 'Community Growth',
        description: 'New social media followers',
      },
      {
        value: '40%',
        label: 'Friction Reduction',
        description: 'Streamlined onboarding flow',
      },
    ],
    bullets: [
      'Increased user confidence through community feedback and transparent design',
      'Major partnerships boosted brand credibility in competitive DeFi space',
      'Positioned Phuture as a professional, stable alternative to aggressive platforms',
    ],
    conclusion:
      'Phuture Finance introduced a new category of investing to crypto. By prioritising familiar UX patterns, clarity, and transparency, we removed friction and built trust in a skeptical market — creating a structured experience that served both retail and institutional investors.',
  },
};

// Raptor Project Data
export const raptor: Project = {
  metadata: {
    slug: 'raptor',
    title: 'Raptor - A sleek & secure crypto wallet',
    description:
      'A modern crypto wallet UI designed for clarity, trust, and seamless transactions. Exploring minimalist design principles in the crypto space.',
    keywords: [
      'crypto wallet',
      'UI design',
      'minimalist design',
      'fintech',
      'product design',
      'visual design',
      'crypto',
      'Web3',
    ],
  },
  card: {
    title: 'Minimalist UI for Clarity & Trust',
    description: 'A modern crypto wallet designed for simplicity and security — exploring refined UI patterns in the fintech space.',
    backgroundImage: '/project-covers/raptor.png',
    backgroundImages: {
      mobile: '/project-covers/raptor-mobile.png',
      tablet: '/project-covers/raptor-tablet.png',
      desktop: '/project-covers/raptor-desktop.png',
    },
  },
  color: '#FFD226',
  hero: {
    company: 'Raptor',
    tagline: 'A sleek & secure crypto wallet.',
    intro:
      'Raptor is an exploration in crypto wallet design — stripping away complexity to create a clean, intuitive experience that prioritizes security and ease of use. Built for both beginners and experienced users, every detail was crafted to inspire confidence in managing digital assets.',
    meta: {
      role: 'Product & Visual Designer',
      duration: '2023',
      team: 'Solo',
      scope: ['UI Design', 'Visual Design', 'Prototyping', 'Design System'],
    },
  },
  gallery: [
    {
      src: '/projects/raptor/Raptor-1.png',
      alt: 'Raptor wallet interface',
    },
    {
      src: '/projects/raptor/Raptor-02.png',
      alt: 'Raptor wallet design',
    },
    {
      src: '/projects/raptor/raptor-3.avif',
      alt: 'Raptor wallet UI',
    },
    {
      src: '/projects/raptor/raptor-4.avif',
      alt: 'Raptor wallet features',
    },
    {
      src: '/projects/raptor/raptor-5.avif',
      alt: 'Raptor wallet experience',
    },
    {
      src: '/projects/raptor/raptor-6.mp4',
      alt: 'Raptor wallet interaction',
    },
    {
      src: '/projects/raptor/raptor-7.webm',
      alt: 'Raptor wallet animation',
    },
  ],
  approach: {
    title: 'Design Approach',
    description:
      'With a minimalist UI and optimized interaction patterns, Raptor focuses on making crypto wallet management effortless. The goal was to build trust through refined design — from light and dark mode adaptation to streamlined transaction flows.',
    subsections: [
      {
        title: 'Clarity Over Complexity',
        bullets: [
          'Clean, distraction-free interface that reduces cognitive load',
          'Simplified navigation patterns familiar to modern fintech apps',
          'Clear visual hierarchy guiding users through key actions',
        ],
      },
      {
        title: 'Trust Through Design',
        bullets: [
          'Professional, minimal aesthetic differentiating from cluttered crypto UIs',
          'Consistent design language across all screens and states',
          'Subtle interactions that enhance usability without overwhelming',
        ],
      },
      {
        title: 'Seamless Experience',
        bullets: [
          'Optimized transaction flow reducing steps to complete actions',
          'Subtle animations enhancing usability without overwhelming',
          'Responsive layouts ensuring consistency across devices',
        ],
      },
    ],
  },
};

// MoonPay Project Data
export const moonpay: Project = {
  metadata: {
    slug: 'moonpay',
    title: 'MoonPay - Building at Scale in Crypto Infrastructure',
    description:
      'Senior Designer at MoonPay following the $175m Helio acquisition. Led Moonit, a 0-to-1 meme coin trading platform generating $10m+ profit, while contributing to MoonPay Labs and Commerce products.',
    keywords: [
      'Web3',
      'meme coins',
      'Solana',
      'product design',
      '0-to-1',
      'crypto payments',
      'fintech',
      'brand design',
      'animation',
      'MoonPay',
    ],
  },
  card: {
    title: '0-to-1 Platform Generating $10m+ Profit',
    description: 'Case study coming soon.',
    backgroundImage: '/project-covers/moonpay.png',
    backgroundImages: {
      mobile: '/project-covers/moonpay-mobile.png',
      tablet: '/project-covers/moonpay-tablet.png',
      desktop: '/project-covers/moonpay-desktop.png',
    },
  },
  color: '#7B3FF2',
  hero: {
    company: 'MoonPay',
    tagline: 'Building a profitable trading platform from the ground up.',
    intro:
      'Moonit launched as a meme coin trading platform with no existing design foundation, brand identity, or established patterns. The project required complete ownership across product strategy, brand development, UI/UX, animation, and marketing within a two-company partnership between MoonPay and DexScreener. The platform generated $10m+ in 18 months, demonstrating how strategic design execution translates to commercial success in competitive markets.',
    meta: {
      role: 'Senior Designer',
      duration: '2024-Present',
      team: 'Sole Designer (Moonit), Core Team (Labs)',
      scope: ['Product Strategy', 'Branding', 'UI/UX', 'Animation', 'Social Assets'],
    },
  },
  gallery: [
    {
      src: '/projects/moonpay/01.png',
      alt: 'Moonit trading interface',
      caption: 'Trading Interface',
    },
    {
      src: '/projects/moonpay/02.png',
      alt: 'Moonit token discovery',
      caption: 'Token Discovery',
    },
    {
      src: '/projects/moonpay/03.mp4',
      alt: 'Moonit portfolio view',
      caption: 'Portfolio Management',
    },
    {
      src: '/projects/moonpay/04.png',
      alt: 'Moonit brand identity',
      caption: 'Brand Identity',
    },
    {
      src: '/projects/moonpay/05.png',
      alt: 'Moonit trading flow',
      caption: 'Trading Flow',
    },
    {
      src: '/projects/moonpay/05b.mp4',
      alt: 'Moonit social assets',
      caption: 'Social Assets',
    },
    {
      src: '/projects/moonpay/06.png',
      alt: 'Moonit mobile experience',
      caption: 'Mobile Experience',
    },
    {
      src: '/projects/moonpay/07.png',
      alt: 'Moonit animation system',
      caption: 'Animation System',
    },
    {
      src: '/projects/moonpay/08.png',
      alt: 'Moonit interface details',
      caption: 'Interface Details',
    },
    {
      src: '/projects/moonpay/09.mp4',
      alt: 'Moonit user experience',
      caption: 'User Experience',
    },
    {
      src: '/projects/moonpay/10.png',
      alt: 'Moonit product features',
      caption: 'Product Features',
    },
    {
      src: '/projects/moonpay/11.mp4',
      alt: 'Moonit design system',
      caption: 'Design System',
    },
    {
      src: '/projects/moonpay/12.gif',
      alt: 'Moonit brand elements',
      caption: 'Brand Elements',
    },
    {
      src: '/projects/moonpay/13.mp4',
      alt: 'Moonit visual identity',
      caption: 'Visual Identity',
    },
    {
      src: '/projects/moonpay/14.gif',
      alt: 'Moonit marketing assets',
      caption: 'Marketing Assets',
    },
    {
      src: '/projects/moonpay/15.gif',
      alt: 'Moonit complete experience',
      caption: 'Complete Experience',
    },
  ],
  challenge: {
    title: 'The Challenge',
    description:
      'MoonPay partnered with DexScreener to launch Moonit, a meme coin trading platform targeting one of crypto\'s most competitive markets. As the sole designer, I inherited a project with no existing product, brand identity, or design foundation. The scope required complete ownership across all design disciplines while managing stakeholder relationships across two organizations and meeting aggressive profit targets.',
    bullets: [
      'No existing foundation: brand identity, design patterns, or product UI to build from',
      'Complete design ownership across strategy, brand, product, animation, and marketing',
      'Complex stakeholder dynamics balancing priorities across MoonPay and DexScreener',
      'Competitive market requiring speed, clarity, and frictionless trading experience',
    ],
  },
  approach: {
    title: 'Design Approach',
    description:
      'Building Moonit required strategic thinking across every design discipline. With no team to delegate to and two companies to align, I focused on high-impact decisions that would drive business value while establishing a scalable foundation. The process balanced speed with quality, ensuring traders received the clarity and performance they demanded.',
    subsections: [
      {
        title: 'Strategic Product Foundations',
        bullets: [
          'Analyzed competitor products to identify market gaps and opportunities',
          'Prioritized core trading flows and essential features over nice-to-haves',
          'Designed for speed and clarity, critical requirements for meme coin traders',
          'Built flexible product architecture supporting rapid iteration post-launch',
        ],
      },
      {
        title: 'Brand Identity & Positioning',
        bullets: [
          'Developed brand balancing credibility with personality to stand out in crowded market',
          'Created visual language resonating with crypto culture while remaining accessible',
          'Built flexible brand system spanning product UI, social assets, and marketing',
          'Positioned Moonit as a professional alternative in a market of gimmicky competitors',
        ],
      },
      {
        title: 'End-to-End Design & Production',
        bullets: [
          'Designed complete UI system including responsive layouts, interactions, and components',
          'Created animation principles enhancing experience without sacrificing performance',
          'Produced marketing materials, social templates, and launch graphics',
          'Maintained visual consistency across all customer touchpoints',
        ],
      },
      {
        title: 'Stakeholder Management',
        bullets: [
          'Navigated feedback from two organizations with different priorities and timelines',
          'Presented design decisions with clear rationale tied to business outcomes',
          'Balanced product vision with legitimate stakeholder concerns',
          'Delivered iterative updates aligned with commercial goals across both companies',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '0-to-1',
        label: 'Complete Product Launch',
        description: 'Sole designer, all disciplines',
      },
      {
        value: '$100m+',
        label: 'Volume Handled',
        description: 'Trading volume on platform',
      },
      {
        value: '$10m+',
        label: 'Profit Generated',
        description: 'In 18 months',
      },
    ],
    bullets: [
      'Generated $10m+ profit in 18 months, demonstrating direct link between design decisions and commercial success',
      'Successfully owned all design disciplines as sole designer on high-stakes product launch',
      'Built scalable design system enabling rapid iteration in competitive market environment',
      'Positioned Moonit as credible alternative in crowded meme coin trading space',
      'Managed complex stakeholder dynamics across two companies while maintaining product quality',
    ],
    conclusion:
      'Moonit showcased the impact of complete design ownership extending beyond UI into strategy, positioning, and business outcomes. The project required operating independently across all design disciplines, aligning cross-functional stakeholders, and delivering measurable commercial value. Beyond Moonit, I contributed to MoonPay Labs and Commerce products, supporting the broader MoonPay ecosystem.',
  },
};

// Sukiyaki Project Data
export const sukiyaki: Project = {
  metadata: {
    slug: 'sukiyaki',
    title: 'Sukiyaki - A Taste of Tradition, Reimagined',
    description:
      'A refined digital experience for a Japanese fine-dining restaurant, blending traditional aesthetics with modern web design to create an immersive, culturally rich booking experience.',
    keywords: [
      'restaurant design',
      'Japanese aesthetics',
      'fine dining',
      'web design',
      'UX design',
      'cultural design',
      'brand experience',
      'booking system',
      'immersive design',
    ],
  },
  card: {
    title: 'Cultural Authenticity Meets Modern UX',
    description: 'Designed a refined digital experience for a Japanese fine-dining restaurant, blending traditional aesthetics with modern web design.',
    backgroundImage: '/project-covers/sukiyaki.png',
    backgroundImages: {
      mobile: '/project-covers/sukiyaki-mobile.png',
      tablet: '/project-covers/sukiyaki-tablet.png',
      desktop: '/project-covers/sukiyaki-desktop.png',
    },
    imageAlignment: 'center',
  },
  color: '#626f70',
  hero: {
    company: 'Sukiyaki',
    tagline: 'A taste of tradition, reimagined.',
    intro:
      'Sukiyaki is more than just a meal — it\'s an experience. The challenge was to translate the warmth, history, and communal spirit of this Japanese tradition into a modern digital presence that reflects the refined, immersive atmosphere of the restaurant while providing a seamless way for users to explore the menu, learn about the culture, and make reservations effortlessly.',
    meta: {
      role: 'Lead Designer & UX Strategist',
      duration: '2024',
      team: 'Solo',
      scope: ['Brand Strategy', 'UX/UI Design', 'Interaction Design', 'Cultural Research'],
    },
  },
  gallery: [
    {
      src: '/projects/sukiyaki/sukiyaki-1.avif',
      alt: 'Sukiyaki homepage hero',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-2.mp4',
      alt: 'Sukiyaki menu interface',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-3.avif',
      alt: 'Sukiyaki reservation flow',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-4.mp4',
      alt: 'Sukiyaki cultural storytelling',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-5.webp',
      alt: 'Sukiyaki brand elements',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-6.webp',
      alt: 'Sukiyaki color palette',
    },
    {
      src: '/projects/sukiyaki/sukiyaki-7.webp',
      alt: 'Sukiyaki mobile experience',
    },
  ],
  challenge: {
    title: 'The Challenge',
    description:
      'Creating a digital presence for a high-end Japanese restaurant requires more than beautiful design — it demands cultural authenticity, refined user experience, and seamless functionality. The website needed to serve discerning diners who value experience and attention to detail.',
    bullets: [
      'Translating traditional Japanese aesthetics into a modern digital experience',
      'Balancing immersive storytelling with functional booking flows',
      'Creating a premium feel without overwhelming or cluttering the interface',
      'Ensuring the reservation process felt effortless while maintaining exclusivity',
      'Differentiating from other fine-dining establishments through cultural authenticity',
    ],
  },
  approach: {
    title: 'Design Approach',
    description:
      'The design process was rooted in cultural research and user-centered strategy. By studying Edo-period artwork, traditional color palettes, and Japanese design principles, I created an experience that honors tradition while embracing modern web conventions.',
    subsections: [
      {
        title: 'Research & Cultural Foundation',
        bullets: [
          'Studied Edo-period artwork and traditional Japanese color palettes',
          'Analyzed cultural aesthetics — balance, negative space, and restraint',
          'Researched user expectations for high-end dining experiences',
          'Evaluated how fine-dining restaurants balance storytelling with functionality',
        ],
      },
      {
        title: 'User Experience Strategy',
        bullets: [
          'Designed for a discerning clientele valuing authenticity and experience',
          'Created intuitive user journey from discovery to reservation',
          'Streamlined booking process to feel effortless without sacrificing sophistication',
          'Ensured accessibility while maintaining air of exclusivity',
        ],
      },
      {
        title: 'Visual Design & Brand Identity',
        bullets: [
          'Minimalist, elegant interface that enhances premium positioning',
          'Traditional color palettes inspired by Japanese art and culture',
          'Typography and spacing reflecting Japanese design principles',
          'Refined visual hierarchy guiding users through the experience',
        ],
      },
      {
        title: 'Interaction & Motion Design',
        bullets: [
          'Subtle interactions that enhance engagement without overwhelming',
          'Smooth transitions reflecting the refined atmosphere',
          'Micro-interactions adding delight at key moments',
          'Motion design supporting storytelling and cultural immersion',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    bullets: [
      'Fully immersive digital experience translating Sukiyaki\'s warmth and tradition into design',
      'Refined, elegant UI enhancing the brand\'s premium positioning',
      'Streamlined booking process ensuring accessibility without sacrificing sophistication',
      'Subtle interactions and motion design enhancing user engagement',
      'Cultural authenticity differentiating from competitors in the fine-dining space',
    ],
    conclusion:
      'Through cultural research, design refinement, and UX strategy, Sukiyaki became an experience that seamlessly blends tradition with modernity. The project demonstrates how deep cultural understanding can inform design decisions, creating digital experiences that feel authentic, refined, and memorable.',
  },
};

// Export all projects as an array for navigation
export const allProjects: Project[] = [phutureFinance, raptor, sukiyaki, moonpay];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.metadata.slug === slug);
}

