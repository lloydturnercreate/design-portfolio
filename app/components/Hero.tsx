/**
 * Hero
 * Main hero section with headline, credential bar, and CTAs
 * Centered, outcome-focused design that fits all screen sizes
 */
export default function Hero() {
  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-6xl mx-auto text-center">
          {/* Credential Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-10 md:mb-12">
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Ex-Google</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Ex-MoonPay</span>
            <span className="w-1 h-1 rounded-full bg-muted-dark opacity-50"></span>
            <span className="text-xs md:text-sm font-medium text-muted uppercase tracking-[0.08em]">Senior Product Designer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter-2 text-foreground mb-8 md:mb-10 leading-[0.95] text-balance">
            Investor-grade products for fintech & Web3
          </h1>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted mb-14 md:mb-16 max-w-4xl mx-auto leading-[1.5] font-light tracking-tight-1">
            I help founders and product teams turn complex ideas into clear,
            scalable interfaces — design systems, launch-ready UX, and
            hands-on strategy for growth-stage startups.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-2xl mx-auto">
            {/* For Founders CTA - Primary */}
            <a
              href="#book-diagnostic"
              className="group w-full sm:w-auto px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02]"
              aria-label="Book a 15-minute diagnostic call for founders"
            >
              <span className="tracking-tight-1">For Founders – Book 15-min Call</span>
            </a>

            {/* For Agencies CTA - Secondary */}
            <a
              href="#check-availability"
              className="group w-full sm:w-auto px-10 py-5 bg-card border border-border text-foreground font-semibold rounded-2xl hover:border-muted-dark hover:bg-secondary transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] flex items-center justify-center hover:scale-[1.02]"
              aria-label="Check availability for agencies"
            >
              <span className="tracking-tight-1">For Agencies – Check Availability</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

