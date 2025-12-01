import Image from 'next/image';
import Section from './Section';

/**
 * About
 * About section with personal background and CV download
 * Clean, approachable layout
 */
export default function About() {
  return (
    <Section className="py-20 md:py-32 lg:py-40 bg-secondary border-y border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Background</span>
        </div>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-4 md:mb-5 text-balance">
            About
          </h2>
        </div>

        {/* Content with headshot */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-start">
          {/* Headshot */}
          <div className="flex-shrink-0 w-56 md:w-64 mx-auto md:mx-0">
            <div className="relative w-full aspect-square bg-card border border-border rounded-3xl overflow-hidden">
              <Image
                src="/client-assets/client-logos/lloyd.png" 
                alt="Lloyd Turner"
                fill
                quality={100}
                className="object-cover"
                sizes="(max-width: 768px) 224px, 256px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 md:space-y-7">
            <p className="text-lg md:text-xl lg:text-2xl text-muted leading-[1.6] font-light tracking-tight-1">
              I&apos;m Lloyd Turner — a Senior Product & Visual Designer with over a
              decade of experience at companies like Google, Amazon and MoonPay.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl text-muted leading-[1.6] font-light tracking-tight-1">
              I now help fast-moving startups and agencies build fintech and Web3
              products that stand out for clarity, usability, and scale.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl text-muted leading-[1.6] font-light tracking-tight-1">
              My background lets me work both strategically and hands-on — from
              early-stage discovery through to developer handoff.
            </p>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a
                href="/resume/Lloyd Turner _ Product Designer.pdf"
                download
                className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-all duration-200 min-h-[60px] hover:scale-[1.02] tracking-tight-1"
                aria-label="Download CV"
              >
                Download CV
              </a>
              <a
                href="https://www.linkedin.com/in/lloyd-turner-370837110/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 bg-blue-950 text-white font-semibold rounded-2xl hover:bg-slate-950 transition-all duration-200 min-h-[60px] hover:scale-[1.02] tracking-tight-1"
                aria-label="Visit Lloyd Turner's LinkedIn profile"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

