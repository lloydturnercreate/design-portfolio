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

          {/* Book a Call Button */}
          <div className="mb-16 md:mb-20">
            <a
              href="https://calendly.com/lloyd-turner/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              data-cta-type="primary"
              className="lava-gradient group inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 text-center text-base lg:text-lg min-h-[60px] shadow-premium-lg hover:shadow-premium-xl hover:scale-[1.02]"
              aria-label="Book a call with Lloyd Turner"
            >
              <span className="lava-layer-3" />
              <span className="lava-layer-4" />
              <span className="tracking-tight-1 whitespace-nowrap">Book a Call</span>
            </a>
          </div>

          {/* Contact Icons */}
          <div className="flex gap-6 md:gap-8 justify-center items-center mb-16 md:mb-20">
            {/* Calendly - Most Important */}
            <a
              href="https://calendly.com/lloyd-turner/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center transition-all duration-300"
              aria-label="Book a call with Lloyd Turner"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Book a Call
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:lloyd.turner@live.co.uk"
              className="group relative flex items-center justify-center transition-all duration-300"
              aria-label="Email Lloyd Turner"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                lloyd.turner@live.co.uk
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/lloyd-turner-370837110/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center transition-all duration-300"
              aria-label="Visit Lloyd Turner's LinkedIn profile"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                LinkedIn
              </span>
            </a>

            {/* Phone */}
            <a
              href="tel:+447482412262"
              className="group relative flex items-center justify-center transition-all duration-300"
              aria-label="Call Lloyd Turner"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                +44 7482 412 262
              </span>
            </a>

            {/* Download CV */}
            <a
              href="/resume/Lloyd Turner _ Product_Visual Designer.pdf"
              download
              className="group relative flex items-center justify-center transition-all duration-300"
              aria-label="Download CV"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Download CV
              </span>
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-10 border-t border-border text-sm md:text-base text-muted-dark flex justify-center items-center">
            <p className="font-light tracking-tight-1 text-center">© {new Date().getFullYear()} Lloyd Turner. All rights reserved.</p>
          </div>
        </div>
      </Section>
    </footer>
  );
}

