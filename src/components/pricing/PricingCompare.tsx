import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { cn } from '@/lib/cn';
import type { Site } from '@/lib/content';

function Cell({ value, copy }: { value: boolean | string; copy: Site['pricing']['page'] }) {
  if (value === true) {
    return (
      <>
        <Icon name="check" size={18} className="mx-auto text-ink" aria-hidden="true" />
        <span className="sr-only">{copy.included}</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Icon name="minus" size={16} className="mx-auto text-line-strong" aria-hidden="true" />
        <span className="sr-only">{copy.notIncluded}</span>
      </>
    );
  }
  return <span className="text-[14px] font-medium text-ink">{value}</span>;
}

/**
 * Every feature, plan by plan. Growth's column is shaded so the eye lands on
 * it. On phones the table scrolls sideways with the feature names pinned.
 */
export function PricingCompare({ site }: { site: Site }) {
  const copy = site.pricing.page;
  const plans = site.pricing.plans;
  const featured = plans.findIndex((p) => p.featured);
  const shade = (i: number) => i === featured && 'bg-surface-sunken';

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="compare-title">
      <Container className="flex flex-col gap-10">
        <Reveal as="h2" id="compare-title" className="display-md m-0">
          <StopText>{copy.compareTitle}</StopText>
        </Reveal>

        <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] border-collapse text-start">
            <thead>
              <tr className="border-b border-line-strong">
                <th
                  scope="col"
                  className="sticky start-0 z-[1] w-[40%] bg-surface py-4 pe-4 text-start align-bottom font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted"
                >
                  {copy.compareFeature}
                </th>
                {plans.map((p, i) => (
                  <th key={p.id} scope="col" className={cn('w-[20%] px-3 py-4 text-center align-bottom', shade(i))}>
                    <span className="block heading-3">{p.name}</span>
                    <span className="block text-[14px] font-normal text-ink-muted">
                      ${p.price}
                      {site.pricing.billing.perMonth}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {copy.compare.map((group) => (
              <tbody key={group.group}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={4}
                    className="sticky start-0 bg-surface pt-8 pb-3 text-start eyebrow text-ink-muted"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th
                      scope="row"
                      className="sticky start-0 z-[1] bg-surface py-3.5 pe-4 text-start text-[15px] font-normal text-ink"
                    >
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={cn('relative px-3 py-3.5 text-center', shade(i))}>
                        <Cell value={v} copy={copy} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Container>
    </section>
  );
}

export default PricingCompare;
