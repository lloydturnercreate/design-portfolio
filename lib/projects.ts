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

export interface Project {
  metadata: ProjectMetadata;
  hero: ProjectHero;
  color: string; // Brand color for the project (hex code)
  gallery?: GalleryImage[]; // Image gallery shown after hero
  challenge?: ProjectChallenge;
  approach?: ProjectApproach;
  results?: ProjectResults;
  nextProject?: string; // slug of next project
  prevProject?: string; // slug of previous project
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
  color: '#3e1fff',
  hero: {
    company: 'Phuture Finance',
    tagline: 'A new age of investing.',
    intro:
      'As Head of Design at Phuture Finance, I led the creation of a DeFi investment platform that made crypto index investing accessible. The challenge: balance Web3 complexity with the simplicity retail investors expect.',
    meta: {
      role: 'Head of Design',
      duration: '2021-2022',
      team: '3 designers, 5 engineers',
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
  nextProject: 'raptor',
};

// Raptor Project Data
export const raptor: Project = {
  metadata: {
    slug: 'raptor',
    title: 'Raptor - A sleek & secure crypto wallet',
    description:
      'A modern crypto wallet UI designed for clarity, trust, and seamless transactions. Personal project exploring minimalist design principles in the crypto space.',
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
  color: '#FFD226',
  hero: {
    company: 'Raptor',
    tagline: 'A sleek & secure crypto wallet.',
    intro:
      'Raptor is a personal exploration in crypto wallet design — stripping away complexity to create a clean, intuitive experience that prioritizes security and ease of use. Built for both beginners and experienced users, every detail was crafted to inspire confidence in managing digital assets.',
    meta: {
      role: 'Product & Visual Designer',
      duration: 'Personal Project, 2023',
      team: 'Solo',
      scope: ['UI Design', 'Visual Design', 'Prototyping', 'Design System'],
    },
  },
  gallery: [
    {
      src: '/projects/raptor/raptor-1.avif',
      alt: 'Raptor wallet interface',
    },
    {
      src: '/projects/raptor/raptor-2.avif',
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
          'Integrated light and dark modes with refined color palettes',
          'Responsive layouts ensuring consistency across devices',
        ],
      },
    ],
  },
  prevProject: 'phuture-finance',
  nextProject: 'moonpay',
};

// MoonPay Project Data
export const moonpay: Project = {
  metadata: {
    slug: 'moonpay',
    title: 'MoonPay - Building at Scale in Crypto Infrastructure',
    description:
      'Senior Designer at MoonPay following the $175m Helio acquisition. Led Moonit, a 0-to-1 meme coin trading platform generating ~$10m profit, while contributing to MoonPay Labs and Commerce products.',
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
  color: '#7B3FF2',
  hero: {
    company: 'MoonPay',
    tagline: 'Building at scale in crypto infrastructure.',
    intro:
      'I joined MoonPay as Senior Designer through the $175m acquisition of Helio. As sole designer on Moonit — a 0-to-1 meme coin trading platform on Solana — I handled everything from product strategy to branding, UI/UX, animation, and social assets. The result: a highly successful product generating ~$10m profit in 18 months.',
    meta: {
      role: 'Senior Designer',
      duration: '2024-Present',
      team: 'Sole Designer (Moonit), Core Team (Labs)',
      scope: ['Product Strategy', 'Branding', 'UI/UX', 'Animation', 'Social Assets'],
    },
  },
  gallery: [
    {
      src: '/projects/moonpay/image-1.svg',
      alt: 'Moonit trading interface',
      caption: 'Trading Interface',
    },
    {
      src: '/projects/moonpay/image-2.svg',
      alt: 'Moonit token discovery',
      caption: 'Token Discovery',
    },
    {
      src: '/projects/moonpay/image-3.svg',
      alt: 'Moonit portfolio view',
      caption: 'Portfolio Management',
    },
    {
      src: '/projects/moonpay/image-4.svg',
      alt: 'Moonit brand identity',
      caption: 'Brand Identity',
    },
    {
      src: '/projects/moonpay/image-5.svg',
      alt: 'Moonit trading flow',
      caption: 'Trading Flow',
    },
    {
      src: '/projects/moonpay/image-6.svg',
      alt: 'Moonit social assets',
      caption: 'Social Assets',
    },
    {
      src: '/projects/moonpay/image-7.svg',
      alt: 'Moonit mobile experience',
      caption: 'Mobile Experience',
    },
    {
      src: '/projects/moonpay/image-8.svg',
      alt: 'Moonit animation system',
      caption: 'Animation System',
    },
  ],
  challenge: {
    title: 'The Challenge',
    description:
      'Moonit was inherited as a partnership with dexscreener — a 0-to-1 meme coin trading platform with no existing design foundation. As sole designer, I needed to build everything from scratch while navigating complex stakeholder relationships between two companies.',
    bullets: [
      'Building a complete product from zero — no design patterns, brand, or UI foundation',
      'Working as the only designer across all disciplines: strategy, branding, UI/UX, animation, and marketing',
      'Managing dual stakeholder relationships between MoonPay and dexscreener teams',
      'Competing in the fast-moving, highly competitive Solana meme coin trading space',
      'Balancing speed to market with quality execution in a profit-driven environment',
    ],
  },
  approach: {
    title: 'Design Approach',
    description:
      'With complete design ownership, I took a holistic approach — treating Moonit as both a product and a brand. Every decision, from user flows to social media assets, was crafted to resonate with the meme coin trading community while maintaining professional quality.',
    subsections: [
      {
        title: 'Product Strategy & UX',
        bullets: [
          'Researched competitive landscape and meme coin trader behaviors',
          'Designed intuitive trading flows optimized for speed and clarity',
          'Created user journey maps balancing discovery, analysis, and execution',
          'Prioritized features based on user needs and business goals',
        ],
      },
      {
        title: 'Brand Identity & Visual Language',
        bullets: [
          'Developed brand identity that balanced playfulness with credibility',
          'Created visual language reflecting meme coin culture without feeling gimmicky',
          'Designed cohesive color system, typography, and iconography',
          'Ensured brand consistency across product, marketing, and social channels',
        ],
      },
      {
        title: 'UI Design & Animation',
        bullets: [
          'Built engaging interface with smooth micro-interactions and transitions',
          'Designed responsive layouts optimized for desktop and mobile trading',
          'Created animation system that added delight without hindering performance',
          'Maintained visual hierarchy for rapid information processing',
        ],
      },
      {
        title: 'Stakeholder Management',
        bullets: [
          'Navigated complex feedback loops between MoonPay and dexscreener teams',
          'Presented design rationale and built consensus across organizations',
          'Balanced competing priorities while maintaining product vision',
          'Delivered iterative updates aligned with both companies\' goals',
        ],
      },
      {
        title: 'Marketing & Social Assets',
        bullets: [
          'Designed social media templates, launch graphics, and promotional materials',
          'Created cohesive visual identity across all customer touchpoints',
          'Built asset library enabling rapid marketing execution',
          'Supported go-to-market strategy with compelling visual storytelling',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '~$10m',
        label: 'Profit Generated',
        description: 'In 18 months',
      },
      {
        value: '100%',
        label: 'Design Ownership',
        description: 'Sole designer across all disciplines',
      },
      {
        value: '2 Companies',
        label: 'Stakeholder Alignment',
        description: 'MoonPay + dexscreener partnership',
      },
    ],
    bullets: [
      'Successfully launched 0-to-1 product in highly competitive meme coin trading market',
      'Demonstrated ability to own all design disciplines on a high-stakes product',
      'Built scalable design system enabling rapid iteration and feature expansion',
      'Established Moonit as a credible player in the Solana trading ecosystem',
      'Navigated complex organizational dynamics while maintaining product quality',
    ],
    conclusion:
      'Moonit showcased the power of holistic design ownership. By controlling every aspect — from product strategy to social assets — I created a cohesive experience that resonated with users and delivered exceptional business results. Beyond Moonit, I contributed to MoonPay Labs\' experimental R&D platform and MoonPay Commerce (formerly Helio), helping shape crypto payment solutions across e-commerce.',
  },
  prevProject: 'raptor',
  nextProject: 'sukiyaki',
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
  color: '#626f70',
  hero: {
    company: 'Sukiyaki',
    tagline: 'A taste of tradition, reimagined.',
    intro:
      'Sukiyaki is more than just a meal — it\'s an experience. The challenge was to translate the warmth, history, and communal spirit of this Japanese tradition into a modern digital presence that reflects the refined, immersive atmosphere of the restaurant while providing a seamless way for users to explore the menu, learn about the culture, and make reservations effortlessly.',
    meta: {
      role: 'Lead Designer & UX Strategist',
      duration: 'Personal Project, 2024',
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
  prevProject: 'moonpay',
};

// Export all projects as an array for navigation
export const allProjects: Project[] = [phutureFinance, raptor, moonpay, sukiyaki];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.metadata.slug === slug);
}

