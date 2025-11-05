'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from './Section';
import CursorRevealGrid from './CursorRevealGrid';
import { cardLoopBounceVariants, cardReducedMotionVariants } from '@/lib/animationConfig';

const valuePoints = [
  {
    title: 'Systemise design for scale',
    description: 'Design systems that speed development and cut inconsistency.',
  },
  {
    title: 'Translate complex products',
    description: 'Clean, high-trust experiences that improve activation and retention.',
  },
  {
    title: 'Collaborate directly',
    description: 'Work with founders and PMs to ship investor-ready products fast.',
  },
];

/**
 * ValueSection
 * Explains why people hire Lloyd - value proposition section
 * Clean, scannable layout focused on outcomes
 * Features continuous looping bounce animation for added life
 * Background grid revealed by cursor
 */
export default function ValueSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Cursor-revealed grid background */}
      <CursorRevealGrid />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-muted-dark">How I Work</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter-1 text-foreground mb-7 md:mb-8 text-center text-balance">
          Clarity for teams moving fast
        </h2>

        {/* Opening paragraph */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted mb-16 md:mb-20 text-center max-w-3xl mx-auto leading-[1.6] font-light tracking-tight-1">
          Design shouldn&apos;t slow you down. I work with ambitious teams who need a senior partner to:
        </p>

        {/* Value points - Horizontal cards with looping bounce animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20">
          {valuePoints.map((point, index) => (
            <motion.div
              key={index}
              variants={shouldReduceMotion ? cardReducedMotionVariants : cardLoopBounceVariants}
              animate="animate"
              custom={index}
              className="bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-muted-dark hover:shadow-premium transition-all duration-300 group"
            >
              {/* Number Badge */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <span className="text-xl md:text-2xl font-bold text-primary tracking-tight-1">{index + 1}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 leading-tight tracking-tight-1">
                {point.title}
              </h3>
              <p className="text-base md:text-lg text-muted leading-[1.6] font-light">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted text-center max-w-3xl mx-auto leading-[1.6] font-light tracking-tight-1">
          If you&apos;re building in fintech, Web3 or SaaS, I bridge the gap between messy
          MVP and scalable product design.
        </p>
      </div>
    </Section>
  );
}

