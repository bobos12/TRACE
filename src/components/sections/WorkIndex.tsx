'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Chip } from '@/components/ui/Chip';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { kindLabel } from '@/components/sections/ProjectMeta';
import { projectKinds } from '@/lib/kinds';
import type { ProjectCardData, Site } from '@/lib/content';
import { track } from '@/lib/contact';

const ALL = 'all';

export interface WorkIndexProps {
  /** Only the UI strings — not the whole site object. */
  ui: Site['ui'];
  projects: ProjectCardData[];
  services: { slug: string; title: string }[];
  /** Initial filters, read from the URL on the server. */
  initial: { kind: string; service: string; sector: string };
}

function FilterRow({
  label,
  allLabel,
  value,
  options,
  onPick,
}: {
  label: string;
  allLabel: string;
  value: string;
  options: { value: string; label: string }[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <span className="eyebrow text-ink-faint md:me-2">{label}</span>
      {/* Below md the chips are one scrollable line each — three wrapped rows
          push the first project most of a screen down the page. */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [&>*]:flex-none sm:-mx-8 sm:px-8 md:mx-0 md:flex-wrap md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={value === ALL} onClick={() => onPick(ALL)}>
          {allLabel}
        </Chip>
        {options.map((o) => (
          <Chip key={o.value} active={value === o.value} onClick={() => onPick(o.value)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/**
 * The portfolio grid with instant client-side filtering by type, service and
 * sector. Filters are reflected in the URL query so a filtered view can be
 * shared.
 *
 * The cards animate in through the shared CSS reveal, which the mount
 * observer re-applies to anything a filter brings back — no layout animation,
 * because sixteen of them cost more in hydration than the effect was worth.
 *
 * Unfiltered, the two strongest projects lead the page as wide cards; once a
 * filter is on, every card is equal — a filtered view is a search result, not
 * an edit.
 */
export function WorkIndex({ ui, projects, services, initial }: WorkIndexProps) {
  const router = useRouter();
  const [kind, setKind] = useState(initial.kind);
  const [service, setService] = useState(initial.service);
  const [sector, setSector] = useState(initial.sector);

  const sectors = useMemo(
    () => [...new Set(projects.map((p) => p.sector))].sort((a, b) => a.localeCompare(b)),
    [projects],
  );

  const syncUrl = useCallback(
    (next: { kind: string; service: string; sector: string }) => {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(next)) {
        if (value !== ALL) query.set(key, value);
      }
      const qs = query.toString();
      router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
    },
    [router],
  );

  const pick = (key: 'kind' | 'service' | 'sector') => (value: string) => {
    const next = { kind, service, sector, [key]: value };
    if (key === 'kind') setKind(value);
    if (key === 'service') setService(value);
    if (key === 'sector') setSector(value);
    syncUrl(next);
    track('work_filter', next);
  };

  const clear = () => {
    setKind(ALL);
    setService(ALL);
    setSector(ALL);
    syncUrl({ kind: ALL, service: ALL, sector: ALL });
  };

  const visible = projects.filter(
    (p) =>
      (kind === ALL || p.kind === kind) &&
      (service === ALL || p.services.includes(service)) &&
      (sector === ALL || p.sector === sector),
  );

  const filtered = kind !== ALL || service !== ALL || sector !== ALL;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <FilterRow
            label={ui.filterKind}
            allLabel={ui.allKinds}
            value={kind}
            options={projectKinds.map((k) => ({ value: k, label: kindLabel(k, ui) }))}
            onPick={pick('kind')}
          />
          <FilterRow
            label={ui.filterService}
            allLabel={ui.allServices}
            value={service}
            options={services.map((s) => ({ value: s.slug, label: s.title }))}
            onPick={pick('service')}
          />
          <FilterRow
            label={ui.filterSector}
            allLabel={ui.allSectors}
            value={sector}
            options={sectors.map((s) => ({ value: s, label: s }))}
            onPick={pick('sector')}
          />

          {filtered ? (
            <button
              type="button"
              onClick={clear}
              className="self-start text-[13px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              {ui.clearFilters}
            </button>
          ) : null}
        </div>

        {visible.length ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
            {visible.map((project, i) => {
              const wide = !filtered && i < 2 && project.spotlight;
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  ui={ui}
                  index={i}
                  wide={wide}
                  className={wide ? 'md:col-span-2' : undefined}
                />
              );
            })}
          </div>
        ) : (
          <p className="body-lg border border-dashed border-line-strong px-6 py-16 text-center text-ink-muted">
            {ui.noResults}
          </p>
        )}
      </Container>
    </section>
  );
}

export default WorkIndex;
