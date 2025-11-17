'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { StatMetric } from '@/lib/projects';
import { cardLoopBounceVariants, cardReducedMotionVariants } from '@/lib/animationConfig';

interface StatBlockProps {
  metrics: StatMetric[];
  color: string;
}

/**
 * StatBlock
 * Displays key metrics/stats in a visually prominent grid
 * Used to break up text and highlight quantitative results
 * Features continuous looping bounce animation for added life
 */
export default function StatBlock({ metrics, color }: StatBlockProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 my-16 md:my-20">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          variants={shouldReduceMotion ? cardReducedMotionVariants : cardLoopBounceVariants}
          animate="animate"
          custom={index}
          className="relative bg-card border border-border rounded-xl p-6 md:p-8 text-left group hover:border-muted-dark hover:shadow-premium transition-all duration-300 flex flex-col justify-end h-full"
        >
          {/* Value */}
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 tracking-tighter-1" style={{ color }}>
            {metric.value}
          </div>

          {/* Label */}
          <div className="text-base md:text-lg font-medium text-foreground mb-1.5 md:mb-2 tracking-tight-1">
            {metric.label}
          </div>

          {/* Description */}
          {metric.description && (
            <div className="text-sm md:text-base text-muted font-light leading-relaxed">
              {metric.description}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

