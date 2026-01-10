# Lloyd Turner Portfolio Website

A cutting-edge, professional portfolio website showcasing product design work with interactive 3D effects, smooth page transitions, and immersive animations.

## 🚀 Live Features

### Interactive Hero
- **3D Tilt Effects**: Global mouse tracking with perspective transforms
- **Pulse Interception Game**: Interactive canvas-based energy pulses that turn green when intercepted
- **Animated Grid**: Canvas-rendered futuristic grid with moving energy signals
- **Animated Noise Texture**: Real-time noise overlay for authentic CRT aesthetic

### Case Studies
- **4 Complete Projects**: MoonPay (Moonit), Phuture Finance, Raptor, Sukiyaki
- **3D Parallax Cards**: Interactive case study cards with multi-layer depth effects
- **Horizontal Scroll Navigation**: Smooth scrolling with dot indicators and arrow controls
- **Responsive Images**: Optimized breakpoint-specific images (mobile, tablet, desktop)

### Page Transitions
- **Scale Animations**: Home page scales down when navigating to projects
- **Context-Based State**: Global transition management with forward/back detection
- **Smooth Navigation**: Coordinated animations across page changes

### Accessibility
- **Reduced Motion Support**: Respects prefers-reduced-motion with graceful fallbacks
- **Semantic HTML**: Proper ARIA labels and role attributes
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Touch Targets**: Minimum 44px touch targets for mobile

### Performance
- **Canvas-Based Animations**: Hardware-accelerated rendering for smooth 60fps
- **Optimized Images**: AVIF/WebP with responsive srcset
- **Code Splitting**: Automatic route-based splitting via Next.js
- **Production Optimizations**: Console removal, SWC minification, tree shaking

## 💻 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Canvas**: Native Canvas API (no Three.js)
- **Deployment**: Vercel

## 📁 Project Structure

```
/app
  /components          - React components
    /project          - Project page components
    /transitions      - Page transition wrappers
  /[project-slug]     - Dynamic project pages
  layout.tsx          - Root layout with metadata
  page.tsx            - Home page
  globals.css         - Global styles & animations
/lib
  /context           - React context providers
  /hooks             - Custom React hooks
  projects.ts        - Project data & types
  animationConfig.ts - Framer Motion variants
  transitionConfig.ts - Transition timing values
  approachIcons.tsx  - Icon mappings for project sections
/public
  /projects          - Project images & media
  /project-covers    - Responsive cover images
  /client-assets     - Client logos & brand assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
npm run build
# or
yarn build
```

### Production

```bash
npm start
# or
yarn start
```

## 🎨 Key Components

### Hero (`app/components/Hero.tsx`)
- Interactive 3D tilt with global mouse tracking
- Canvas-based futuristic grid with animated pulses
- Pulse interception game with particle effects
- Dual CTA buttons with lava gradient effects

### Case Studies (`app/components/CaseStudies.tsx`)
- Horizontal scrolling container with snap points
- Dynamic case study cards from project data
- Navigation controls with current index tracking

### Case Study Card (`app/components/CaseStudyCard.tsx`)
- 3D tilt effect with parallax text layer
- Responsive background images per breakpoint
- Smooth transition to project page on click

### Project Template (`app/components/ProjectTemplate.tsx`)
- Flexible template supporting optional sections
- Gallery, Challenge, Approach, Results sections
- Floating back button for navigation

### Page Transitions
- **TransitionContext**: Global state management for animations
- **PageScaleWrapper**: Home page scale-down effect
- **ProjectPageWrapper**: Project page slide-up animation
- **TransitionOverlay**: Coordinated overlay fade

## 🔧 Configuration

### Animation Timing (`lib/transitionConfig.ts`)
Centralized configuration for all transition durations and easing curves.

### Framer Motion Variants (`lib/animationConfig.ts`)
Reusable animation variants for consistent motion design.

### Tailwind Config (`tailwind.config.ts`)
Custom colors, typography scales, shadows, and utility classes.

## 📦 Bundle Optimizations

- **SWC Minification**: Faster builds with Rust-based compiler
- **Console Removal**: Automatic removal in production builds
- **Image Optimization**: Next.js Image with AVIF/WebP support
- **Package Optimization**: Framer Motion tree-shaking enabled

## 🚢 Deployment

This project supports **two versions** of the site with different targeting:

### 🌐 Two Site Versions

| Version | Domain | Branch | Target Audience |
|---------|--------|--------|-----------------|
| Startup | lloydturner.co.uk | `main` | Fintech & Web3 startups |
| Enterprise | work.lloydturner.co.uk | `enterprise` | Established enterprise clients |

The versions share the same codebase but use different content, messaging, and keywords optimized for their respective audiences.

### Vercel Setup

#### Main Branch (Startup Version)
1. Connect repository to Vercel
2. Set production branch to `main`
3. Add domain: `lloydturner.co.uk`
4. Environment Variable (optional):
   - `NEXT_PUBLIC_SITE_TYPE` = `startup`

#### Enterprise Branch
1. In Vercel project settings → Git
2. Add branch deployment for `enterprise`
3. In Domains, add: `work.lloydturner.co.uk`
4. In Environment Variables:
   - `NEXT_PUBLIC_SITE_TYPE` = `enterprise`
   - Set scope to: Production (enterprise branch)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Environment Variables

| Variable | Values | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_SITE_TYPE` | `startup` or `enterprise` | Determines site version (defaults to `startup`) |

### Local Development

```bash
# Test startup version (default)
npm run dev

# Test enterprise version
NEXT_PUBLIC_SITE_TYPE=enterprise npm run dev
```

## 📈 Performance Metrics

- **First Contentful Paint**: Optimized with critical CSS
- **Time to Interactive**: Minimal JavaScript on initial load
- **Accessibility Score**: WCAG AA compliant
- **SEO**: Complete metadata with Open Graph tags

## 🎯 Future Enhancements

- Additional case studies (Google, MoonPay Labs projects)
- Blog section with MDX support
- Contact form integration
- Analytics integration
- More interactive canvas effects

## 📄 License

Private portfolio project © 2024 Lloyd Turner
