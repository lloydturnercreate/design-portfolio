'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from './Section';
import CursorRevealGrid from './CursorRevealGrid';
import { cardLoopBounceVariants, cardReducedMotionVariants } from '@/lib/animationConfig';

const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'I facilitate workshops to consolidate founder vision vs. engineering reality, ensuring we build the right MVP, not just a pretty one.',
  },
  {
    step: '02',
    title: 'Systemise',
    description: 'I ship tokenized component libraries that allow dev teams to build faster and maintain consistency—without constant design oversight.',
  },
  {
    step: '03',
    title: 'Ship',
    description: 'A Figma file isn\'t a product. I work alongside engineers during implementation, providing annotated handoffs and VQA (Visual QA) to ensure the live product matches the investor deck.',
  },
];

/**
 * Process
 * Three-step process visualization
 * Simple, scannable approach
 * Features continuous looping bounce animation for added life
 * Background grid revealed by cursor
 */
export default function Process() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Cursor-revealed grid background */}
      <CursorRevealGrid />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">Approach</span>
        </div>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-5 md:mb-6 text-balance">
            How I Work
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-[1.6] font-light tracking-tight-1">
            A repeatable approach that scales with your team
          </p>
        </div>

        {/* Process steps - simplified with looping bounce animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={shouldReduceMotion ? cardReducedMotionVariants : cardLoopBounceVariants}
              animate="animate"
              custom={index}
              className="relative bg-card border border-border p-8 md:p-10 rounded-2xl hover:border-muted-dark hover:shadow-premium transition-all duration-300 group"
            >
              {/* Circular number badge */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <span className="text-xl md:text-2xl font-bold text-primary tracking-tight-1">
                  {step.step}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 tracking-tight-1">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-muted leading-[1.6] font-light">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

