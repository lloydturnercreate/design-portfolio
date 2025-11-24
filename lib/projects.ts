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

export interface GridItem {
  title: string;
  description: string;
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
  items?: GridItem[];
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
  items?: GridItem[];
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
    company: 'Phuture',
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
    bullets: [],
    items: [
      {
        title: 'Cognitive Overload',
        description: 'Users were forced to navigate gas fees, slippage settings, and token approvals before making a single trade.'
      },
      {
        title: 'Fragmented Journeys',
        description: 'Protocols separated their "Sales" site from their "App," forcing context-switching that broke the acquisition funnel.'
      },
      {
        title: 'The Trust Deficit',
        description: '"Gamified" competitor interfaces signalled volatility and risk, alienating investors looking for passive growth.'
      },
      {
        title: 'Technical Barriers',
        description: 'High latency and complex wallet interactions created a hostile environment for non-technical retail users.'
      }
    ]
  },
  approach: {
    title: 'The Strategy: Progressive Disclosure',
    description:
      'My mandate was to reduce "Time-to-Invest" while increasing "Trust-to-Hold." To achieve this, I implemented a strategy of Progressive Disclosure—keeping the interface simple by default to lower entry barriers, while retaining advanced power (slippage, gas settings) in secondary menus for power users.',
    subsections: [
      {
        title: 'The "Swiss Army Knife" Widget',
        bullets: [
          'Transaction Abstraction: We bundled complex on-chain actions (Wrap, Approve, Swap, Mint) into a single "Buy" button.',
          'Friction Hiding: Relocated intimidating variables like gas fees and slippage tolerance into a secondary "Advanced" menu.'
        ],
      },
      {
        title: 'The "App-less" Architecture',
        bullets: [
          'Zero-Click Launch: integrated the trading engine directly into the marketing site architecture.',
          'Funnel Efficiency: Users could connect wallets and invest instantly from the landing page, removing the drop-off caused by external "Launch App" subdomains.'
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '$8m',
        label: 'Assets Under Management',
        description: 'Reached in <12 months',
      },
      {
        value: '211 days',
        label: 'Average User Retention',
        description: 'Significantly above industry avg',
      },
      {
        value: '40%',
        label: 'Friction Reduction',
        description: 'Via streamlined onboarding',
      },
    ],
    bullets: [],
    items: [
      {
        title: 'Macro-Trend Visualization',
        description: 'Designed analytics to emphasize long-term growth over micro-volatility (candlesticks). This psychologically reduced panic selling, driving high retention.'
      },
      {
        title: 'Institutional Credibility',
        description: 'The "financial-grade" aesthetic differentiated Phuture from "gamified" competitors, securing key ecosystem partnerships by signalling safety.'
      },
      {
        title: 'Hypothesis Validated',
        description: 'Proved that retail investors would sacrifice granular control (manual gas settings) in exchange for a friction-free, one-click investment experience.'
      }
    ],
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
    description: 'Built Moonit from the ground up as Product Design lead—delivering a high-velocity trading terminal that generated $10m+ profit and processed $100m+ in volume.',
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
    tagline: 'Designing for Velocity: From 0 to $10M Profit.',
    intro:
      'Lead Product Designer for Moonit, a high-frequency trading terminal that generated $100m+ volume in 12 months. I unified the strategic priorities of MoonPay and DexScreener to build a platform that captured the chaotic energy of meme coins within a structured, high-performance interface.',
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
      src: '/projects/moonpay/06.png',
      alt: 'Moonit mobile experience',
      caption: 'Mobile Experience',
    },
    {
      src: '/projects/moonpay/08.png',
      alt: 'Moonit interface details',
      caption: 'Interface Details',
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
  ],
  challenge: {
    title: 'The Challenge',
    description:
      '',
    bullets: [],
    items: [
      {
        title: 'Dual-Stakeholder Alignment',
        description: 'Harmonizing strategic priorities between a regulated fintech (MoonPay) and a data-heavy aggregator (DexScreener), each with distinct timelines and success metrics.'
      },
      {
        title: 'The Velocity Trap',
        description: 'Meme coin markets move in seconds. The UI required zero-latency interactions where any friction meant missed profit for the user.'
      },
      {
        title: 'Zero Foundation',
        description: 'No existing design system, brand identity, or patterns. Moonit required a defined visual language and product DNA while sprinting toward launch.'
      },
      {
        title: 'The Credibility Gap',
        description: 'The platform needed to feel "native" to crypto-degenerates (Degens) while maintaining the institutional trust of the MoonPay parent brand.'
      }
    ],
  },
  approach: {
    title: 'The Strategy: Performance as UX',
    description:
      'To win in a crowded market, the brand had to be distinct. I developed a visual identity that balanced institutional credibility with meme-culture personality while prioritizing execution speed over decoration.',
    subsections: [
      {
        title: '\'Credible Degen\' Branding',
        bullets: [
          'Built a flexible design system that worked equally well on high-density trading dashboards and viral social marketing assets.',
          'Developed a visual identity that balanced institutional credibility with meme-culture personality.',
        ],
      },
      {
        title: 'Prioritizing Speed over Decoration',
        bullets: [
          'Stripped away decorative UI elements to prioritize Data Density and Actionability.',
          'Designed "One-Click" flows that minimized the steps between Discovery and Execution (on Moonit).',
        ],
      },
      {
        title: 'Department of One',
        bullets: [
          'Ownership of the full vertical: Product Strategy → UI/UX → Animation → Marketing. This required ruthlessly prioritizing "must-have" flows over "nice-to-haves" to meet aggressive profit targets.',
        ],
      },
      {
        title: 'Cross-Entity Alignment',
        bullets: [
          'Acted as the translation layer between MoonPay\'s corporate requirements and DexScreener\'s agile, data-first culture, delivering a unified product vision that satisfied both commercial entities.',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '$10m+',
        label: 'Net Profit',
        description: 'Generated in 12 months',
      },
      {
        value: '$100m+',
        label: 'Trading Volume',
        description: 'Processed via the UI to date',
      },
      {
        value: '0 to 1',
        label: 'Delivery',
        description: 'Ownership from concept to launch',
      },
    ],
    bullets: [],
    items: [
      {
        title: 'Commercial Velocity',
        description: 'The design system enabled rapid iteration, allowing us to ship features faster than competitors and capture $10m+ in profit.'
      },
      {
        title: 'Brand Elasticity',
        description: 'Created a visual language that successfully bridged the gap between "Corporate Fintech" and "Crypto Native" audiences.'
      },
      {
        title: 'High-Fidelity Adoption',
        description: 'The frictionless UX drove over $100m in volume, proving that users preferred a structured, designed experience over raw, clunky tools.'
      }
    ],
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
export const allProjects: Project[] = [moonpay, phutureFinance, raptor, sukiyaki];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.metadata.slug === slug);
}

