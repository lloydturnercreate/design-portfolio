/**
 * Project data structure and content
 * Defines the content for case study project pages
 */

// Image layout types for flexible presentations
export type ImageLayout = 
  | 'full' // Full-width image
  | 'large' // Large centered image (90% width)
  | 'medium' // Medium centered image (70% width)
  | 'medium-left' // Medium left-aligned image (70% width, full on mobile)
  | 'small' // Small centered image (60% width)
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

export type ProjectCategory = 'case-study' | 'ai-project' | 'experiment';

export interface ProjectMetadata {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
  category?: ProjectCategory; // Defaults to 'case-study' if not specified
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
  hero?: ProjectHero; // Optional for interactive projects
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
    title: 'Phuture Finance - Designing the Passive Lane for DeFi',
    description:
      'Head of Design at Phuture Finance. Abstracted complex rebalancing logic into a "Set & Forget" investment interface, reaching $8M TVL in a bear market.',
    keywords: [
      'crypto investing',
      'DeFi',
      'Web3',
      'product design',
      'fintech',
      'design system',
      'UX design',
      'index funds',
      'passive investing',
    ],
  },
  card: {
    title: 'Designing the "Passive Lane" for DeFi',
    description: "Abstracted complex rebalancing logic into a 'Set & Forget' investment interface, reaching $8M TVL in a bear market.",
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
    tagline: 'Designing the "Passive" Lane for DeFi.',
    intro:
      'In 2021, crypto was loud, unregulated, and demanded full-time attention. To have a diversified portfolio, a user had to manage 10+ tokens, approve 10+ contracts, and manually rebalance positions. My goal was to build the "ETF of Crypto"—moving users from managing assets to owning an index.',
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
    title: 'The "Active Management" Tax',
    description:
      'This cognitive tax made DeFi inaccessible to passive investors. The challenge: How do we make a highly volatile, complex instrument feel as safe and manageable as a savings account?',
    bullets: [],
    items: [
      {
        title: 'Cognitive Overload',
        description: 'Users were forced to manage multiple tokens, approve multiple contracts, and manually rebalance positions before making a single trade.'
      },
      {
        title: 'Fragmented Journeys',
        description: 'Protocols separated their marketing site from their product, forcing context-switching that broke the acquisition funnel.'
      },
      {
        title: 'The Trust Deficit',
        description: 'Gamified competitor interfaces signalled volatility and risk, alienating investors looking for passive growth.'
      },
      {
        title: 'Technical Barriers',
        description: 'High latency and complex wallet interactions created a hostile environment for non-technical retail users.'
      }
    ]
  },
  approach: {
    title: 'The Strategy: Simplification via Abstraction',
    description:
      'The primary design challenge was concealing the technical heaviness of the protocol. A single purchase of PDI (Phuture DeFi Index) actually triggered multiple swaps and smart contract interactions in the background. The UI was designed to hide this "plumbing" entirely.',
    subsections: [
      {
        title: 'The "Black Box" Architecture',
        bullets: [
          'The "One-Token" Heuristic: Shifted the interface focus from the constituents (AAVE, UNI, COMP) to the product (PDI), reducing decision fatigue.',
          'Invisible Rebalancing: Visualized monthly auto-rebalancing events not as "actions required" but as "value delivered," reinforcing the hands-off value prop.',
          'Educational Tooltips: Integrated a learning platform, alongside an integrated tooltip system to explain intermediate/advanced concepts like "Yield" and "Weighting" in-context, allowing users to onboard without forcing them to read in-depthdocumentation.',
        ],
      },
      {
        title: 'The "Anti-Crypto" Brand',
        bullets: [
          'Institutional Typography: Used balanced, well-spaced layouts, sans-serif typography and calm, muted palettes to evoke the feeling of a fintech neobank (like Revolut) rather than a degen casino.',
          'Transparency First: While we hid the mechanics, we exposed the data. Designed "Transparency Modules" that showed exact index compositions and fees, building trust through radical clarity.',
        ],
      },
      {
        title: 'Scaling the Architecture',
        bullets: [
          'The design system had to scale beyond just one index. The design system was architected to support the launch of additional products, such as CAI (Colony Avalanche Index) and Yield products without breaking the core navigation.',
          'This modular approach allowed us to launch new investment vehicles in weeks, not months.',
        ],
      },
    ],
  },
  results: {
    title: 'Impact',
    metrics: [
      {
        value: '$8m+',
        label: 'Total Value Locked',
        description: 'Achieved post-launch in a bear market',
      },
      {
        value: '211 days',
        label: 'Average User Retention',
        description: 'Significantly above industry average',
      },
      {
        value: '114%',
        label: 'Social Growth',
        description: '7k → 15k followers via trusted content',
      },
    ],
    bullets: [],
    items: [
      {
        title: 'Macro-Trend Visualization',
        description: 'Designed analytics to emphasize long-term growth over micro-volatility (candlesticks). This psychologically reduced panic selling, driving the 211-day retention.'
      },
      {
        title: 'Institutional Credibility',
        description: 'The "Anti-Crypto" aesthetic differentiated Phuture from "gamified" competitors, signalling safety to passive investors.'
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
    title: 'Moonit - The Professional Terminal for Meme Coin Markets',
    description:
      'Senior Designer at MoonPay following the $175m Helio acquisition. Architected Moonit, a zero-latency meme coin trading platform that processed $100M+ volume and generated $10M+ profit in 12 months.',
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
      'trading terminal',
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
    tagline: 'Scaling a Zero-Latency Trading Platform to $10M+ Profit in 12 months.',
    intro:
      'The Solana meme coin market was polarised. On one extreme was pump.fun—hyper-viral but plagued by regulatory risk. On the other were traditional aggregators—safe, but too slow for 100x moves. My role was to architect a terminal for the "Professional Degen": the trader who demands bot-speed execution with institutional stability.',
    meta: {
      role: 'Product Design Lead',
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
    title: 'The Market Gap',
    description:
      'There was no home for the "Professional Degen"—the trader who demands the raw speed of a bot but the stability of a legitimate platform.',
    bullets: [],
    items: [
      {
        title: 'Safety vs. Speed',
        description: 'pump.fun offered viral speed but regulatory risk. Traditional aggregators were safe but too slow for 100x moves. We needed to close this gap.'
      },
      {
        title: 'Dual-Stakeholder Alignment',
        description: 'Harmonizing strategic priorities between a regulated fintech (MoonPay) and a data-heavy aggregator (DexScreener), each with distinct timelines and success metrics.'
      },
      {
        title: 'Zero Foundation',
        description: 'No existing design system, brand identity, or patterns. Moonit required a complete visual language and product DNA while sprinting toward launch.'
      },
      {
        title: 'The Credibility Gap',
        description: 'The platform needed to feel "native" to crypto-degenerates while maintaining the institutional trust of the MoonPay parent brand.'
      }
    ],
  },
  approach: {
    title: 'The Strategy: Achieving "Bot-Parity" Execution',
    description:
      'In this market, profit and loss are defined in milliseconds. My primary design KPI was Time-to-Trade. We hypothesized that the standard pattern (Browse → Click → Details Page → Buy) was a primary friction point.',
    subsections: [
      {
        title: 'The "Pro Mode" Architecture',
        bullets: [
          'Direct Injection (Zero-Nav): Implemented "Quick Buy" inputs directly on index cards. Users can qualify and execute a trade without ever loading a secondary page—reducing interaction cost from 4 clicks to 1.',
          'Session Mode: Designed a flow where users sign once to unlock a 1-hour trading window, eliminating the intrusive wallet pop-ups that break flow during high-volatility moments.',
          'Signal Density: Curated data hierarchy to surface only execution-critical metrics (Liquidity, Market Cap, Volume), filtering out vanity metrics to support split-second decisions.',
        ],
        images: [
          {
            src: '/projects/moonpay/pro-mode-card.png',
            alt: 'The Pro Card acts as a self-contained terminal, allowing users to snipe tokens the instant they hit the feed.',
            caption: 'The Pro Card acts as a self-contained terminal, allowing users to snipe tokens the instant they hit the feed.',
            layout: 'medium-left',
          },
        ],
      },
      {
        title: 'The "Pro-Degen" Visual Identity',
        bullets: [
          'Adopted a "Space Terminal" aesthetic—dark modes, monospace data density, and neon signal colors to match the mental model of a high-frequency trading desk.',
          'Enforced rigid grid systems and explicit error handling to signal that while assets might be volatile, the infrastructure was solid.',
          'Built a flexible design system that worked equally well on high-density trading dashboards and viral social marketing assets.',
        ],
      },
      {
        title: 'Department of One',
        bullets: [
          'Ownership of the full vertical: Product Strategy → UI/UX → Animation → Marketing. Ruthlessly prioritized "must-have" flows over "nice-to-haves" to meet aggressive profit targets.',
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
        description: 'Processed via the UI',
      },
      {
        value: '<2s',
        label: 'Time-to-Trade',
        description: 'Achieving bot-parity execution',
      },
    ],
    bullets: [],
    items: [
      {
        title: 'Bot-Parity Achieved',
        description: 'The "Pro Mode" architecture reduced Time-to-Trade to under 2 seconds, matching the speed of automated trading bots.'
      },
      {
        title: 'Power User Retention',
        description: 'Successfully captured the "Professional Degen" segment exiting pump.fun for a more stable, regulated environment.'
      },
      {
        title: 'Brand Elasticity',
        description: 'Created a visual language that successfully bridged the gap between "Corporate Fintech" and "Crypto Native" audiences.'
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

// TypeRunner - Interactive Typing Game
export const typerunner: Project = {
  metadata: {
    slug: 'typerunner',
    title: 'TypeRunner - Guitar Hero for Touch Typing',
    description:
      'An arcade-style typing game that makes learning touch typing fun. Built with React, Canvas API, and procedural audio.',
    keywords: [
      'game development',
      'React',
      'Canvas API',
      'procedural audio',
      'TypeScript',
      'interactive design',
      'typing game',
    ],
    category: 'ai-project',
  },
  card: {
    title: 'TYPERUNNER',
    description:
      'A Guitar Hero-inspired typing game with neon aesthetics, progressive difficulty, and procedural music generation.',
    backgroundImage: '/project-covers/typerunner.png',
    backgroundImages: {
      mobile: '/project-covers/typerunner-mobile.png',
      tablet: '/project-covers/typerunner-tablet.png',
      desktop: '/project-covers/typerunner-desktop.png',
    },
  },
  color: '#ff00ff', // Neon magenta
};

// Twist - Media Compressor/Converter Tool
export const twist: Project = {
  metadata: {
    slug: 'twist',
    title: 'Twist - Local Media Compression Tool',
    description:
      'A powerful, privacy-first compressor and converter for creatives. Handles prominent image and video formats locally on your device.',
    keywords: [
      'media compression',
      'video converter',
      'image optimization',
      'privacy-first',
      'creative tools',
      'WebAssembly',
    ],
    category: 'experiment',
  },
  card: {
    title: 'TWIST',
    description:
      'A local, yet powerful compressor/converter tool for creatives. Handles prominent image and video files with privacy-first processing.',
    backgroundImage: '/project-covers/twist.png',
    backgroundImages: {
      mobile: '/project-covers/twist-mobile.png',
      tablet: '/project-covers/twist-tablet.png',
      desktop: '/project-covers/twist-desktop.png',
    },
  },
  color: '#10b981', // Emerald green
  hero: {
    company: 'Twist',
    tagline: 'Privacy-First Media Compression',
    intro:
      'A powerful, local media compressor and converter tool designed for creatives. Process images and videos directly on your device—no uploads, no cloud processing, complete privacy.',
    meta: {
      role: 'Product Designer & Developer',
      duration: 'Coming Soon',
      team: 'Solo',
      scope: ['Product Design', 'WebAssembly', 'UI/UX', 'Privacy Engineering'],
    },
  },
};

// Rooftops - Paper Plane Distance Game
export const rooftops: Project = {
  metadata: {
    slug: 'rooftops',
    title: 'Rooftops - Paper Plane Distance Game',
    description:
      'A dreamy sidescrolling paper plane distance game set over Spanish rooftops during golden hour. Alto\'s Adventure meets Flappy Bird.',
    keywords: [
      'game development',
      'side-scroller',
      'procedural generation',
      'physics simulation',
      'atmospheric design',
      'mobile game',
    ],
    category: 'experiment',
  },
  card: {
    title: 'ROOFTOPS',
    description:
      'A dreamy sidescrolling paper plane distance game, set over Spanish rooftops during golden hour/twilight. Think Alto\'s Adventure meets Flappy Bird.',
    backgroundImage: '/project-covers/rooftops.png',
    backgroundImages: {
      mobile: '/project-covers/rooftops-mobile.png',
      tablet: '/project-covers/rooftops-tablet.png',
      desktop: '/project-covers/rooftops-desktop.png',
    },
  },
  color: '#f59e0b', // Amber/golden hour
  hero: {
    company: 'Rooftops',
    tagline: 'Soar Through Golden Hour',
    intro:
      'A dreamy sidescrolling paper plane distance game set over Spanish rooftops during golden hour and twilight. Navigate thermal updrafts, avoid obstacles, and chase the perfect flight. Think Alto\'s Adventure meets Flappy Bird.',
    meta: {
      role: 'Game Designer & Developer',
      duration: 'Coming Soon',
      team: 'Solo',
      scope: ['Game Design', 'Physics Simulation', 'Procedural Generation', 'Art Direction'],
    },
  },
};

// Warble - Ringtone Generator
export const warble: Project = {
  metadata: {
    slug: 'warble',
    title: 'Warble - Ringtone Generator',
    description:
      'An elegant ringtone generator with refined sound design. Create custom, harmonious ringtones with simple controls.',
    keywords: [
      'audio generation',
      'sound design',
      'Web Audio API',
      'procedural audio',
      'ringtone maker',
      'music tool',
    ],
    category: 'experiment',
  },
  card: {
    title: 'WARBLE',
    description:
      'An elegant ringtone generator with refined sound design. Create custom, harmonious ringtones inspired by modern sound aesthetics.',
    backgroundImage: '/project-covers/warble.svg',
  },
  color: '#8b5cf6', // Purple/violet
  hero: {
    company: 'Warble',
    tagline: 'Elegant Ringtone Generation',
    intro:
      'An elegant ringtone generator with refined sound design. Create custom, harmonious ringtones using simple, intuitive controls. Inspired by the refined audio aesthetics of modern sound design.',
    meta: {
      role: 'Sound Designer & Developer',
      duration: '2025',
      team: 'Solo',
      scope: ['Sound Design', 'Web Audio API', 'UI/UX', 'Product Design'],
    },
  },
};

// Export all projects as an array for navigation
export const allProjects: Project[] = [moonpay, phutureFinance, raptor, sukiyaki, typerunner, warble, twist, rooftops];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.metadata.slug === slug);
}

