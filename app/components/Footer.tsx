import Section from './Section';

/**
 * Footer
 * Final CTA section with contact links and footer information
 * Clean, minimal footer design
 */
export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <Section className="py-20 md:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-6 md:mb-7 text-balance">
            Building something ambitious?
          </h2>

          {/* Subline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted mb-12 md:mb-14 max-w-2xl mx-auto leading-[1.6] font-light tracking-tight-1">
            Let&apos;s make sure your design scales with it.
          </p>

          {/* Primary CTA */}
          <div className="mb-16 md:mb-20">
            <a
              href="#book-diagnostic"
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-base min-h-[60px] shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02] tracking-tight-1"
              aria-label="Book a 15-minute call"
            >
              Book a Call
            </a>
          </div>

          {/* Contact links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center text-base md:text-lg mb-16 md:mb-20">
            <a
              href="mailto:Lloyd@lloydturner.co.uk"
              className="text-muted hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline font-light tracking-tight-1"
            >
              Lloyd@lloydturner.co.uk
            </a>

            <a
              href="https://linkedin.com/in/lloydturner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline font-light tracking-tight-1"
              aria-label="Visit Lloyd Turner's LinkedIn profile"
            >
              LinkedIn
            </a>

            <a
              href="/cv.pdf"
              download
              className="text-muted hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline font-light tracking-tight-1"
              aria-label="Download CV"
            >
              Download CV
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-10 border-t border-border text-sm md:text-base text-muted-dark">
            <p className="font-light tracking-tight-1">© {new Date().getFullYear()} Lloyd Turner. All rights reserved.</p>
          </div>
        </div>
      </Section>
    </footer>
  );
}

