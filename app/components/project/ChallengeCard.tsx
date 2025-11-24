'use client';

interface ChallengeCardProps {
  icon: React.ReactNode;
  text: string;
  title?: string;
  color: string;
}

/**
 * ChallengeCard
 * Visual card component for displaying challenge points
 * Shows icon + text in a bordered card with horizontal layout
 */
export default function ChallengeCard({ icon, text, title, color }: ChallengeCardProps) {
  return (
    <div 
      className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 transition-all duration-300"
      style={{
        ['--hover-border-color' as string]: `${color}4d`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = `${color}4d`}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1" style={{ color }}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              {title}
            </h3>
          )}
          <p className="text-base md:text-lg text-foreground leading-[1.6] font-light">
            {text}
          </p>
        </div>
      </div>

      {/* Hover gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${color}0d, transparent)`,
        }}
      />
    </div>
  );
}
