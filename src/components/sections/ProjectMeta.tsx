import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { ProjectCardData, ProjectKind, Site } from '@/lib/content';

/**
 * What a project is, said out loud.
 *
 * The portfolio mixes work delivered for clients, products ATHR built in
 * house, and concept pieces. A visitor must never have to guess which is
 * which, so the label ships in production — it is not a development-only
 * badge. See docs/06-conversion.md on trust signals.
 */
export function kindLabel(kind: ProjectKind, ui: Site['ui']): string {
  if (kind === 'client') return ui.kindClient;
  if (kind === 'product') return ui.kindProduct;
  return ui.kindConcept;
}

/** "Sector · Country" — a project without a country simply shows the sector. */
export function metaLine(project: Pick<ProjectCardData, 'sector' | 'country'>): string {
  return [project.sector, project.country].filter(Boolean).join(' · ');
}

export function ProjectBadges({
  project,
  ui,
  /** `outline` on the dark cards, where the filled tones would glare. */
  tone = 'neutral',
}: {
  project: Pick<ProjectCardData, 'kind' | 'inDevelopment'>;
  ui: Site['ui'];
  tone?: BadgeTone;
}) {
  return (
    <>
      <Badge tone={project.kind === 'concept' ? 'warning' : tone} dot={project.kind === 'concept'}>
        {kindLabel(project.kind, ui)}
      </Badge>
      {project.inDevelopment ? <Badge tone={tone}>{ui.inDevelopment}</Badge> : null}
    </>
  );
}

export default ProjectBadges;
