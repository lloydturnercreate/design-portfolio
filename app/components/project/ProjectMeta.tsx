import { ProjectMeta as ProjectMetaType } from '@/lib/projects';

interface ProjectMetaProps {
  meta: ProjectMetaType;
  color: string;
}

/**
 * ProjectMeta
 * Displays project context (role, duration, team, scope)
 * Shown as inline pills/tags below hero intro
 */
export default function ProjectMeta({ meta, color }: ProjectMetaProps) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-10">
      {/* Meta tags container (Role, Duration, Team) */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {/* Role */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: `${color}1a`, 
            borderWidth: '1px', 
            borderStyle: 'solid',
            borderColor: `${color}33` 
          }}
        >
          <span className="text-xs md:text-sm font-medium uppercase tracking-[0.08em]" style={{ color }}>
            Role
          </span>
          <span className="text-xs md:text-sm font-light text-foreground">
            {meta.role}
          </span>
        </div>

        {/* Duration */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
          <span className="text-xs md:text-sm font-medium text-muted-dark uppercase tracking-[0.08em]">
            Duration
          </span>
          <span className="text-xs md:text-sm font-light text-foreground">
            {meta.duration}
          </span>
        </div>

        {/* Team */}
        {meta.team && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
            <span className="text-xs md:text-sm font-medium text-muted-dark uppercase tracking-[0.08em]">
              Team
            </span>
            <span className="text-xs md:text-sm font-light text-foreground">
              {meta.team}
            </span>
          </div>
        )}
      </div>

      {/* Scope tags - separate line on larger breakpoints */}
      {meta.scope && meta.scope.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {meta.scope.map((item, index) => (
            <div
              key={index}
              className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs md:text-sm font-light text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

