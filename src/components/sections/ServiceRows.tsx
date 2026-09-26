import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui/Icon';
import { ServiceIllustration } from '@/components/illustrations/ServiceIllustrations';
import type { LocalService } from '@/lib/content';

/**
 * The services index list: full-width ruled rows, one per service.
 * Number, title, line, deliverable chips, and the service's own illustration.
 */
export function ServiceRows({ services }: { services: LocalService[] }) {
  return (
    <ul className="border-t border-ink">
      {services.map((service, i) => (
        <li
          key={service.slug}
          data-reveal="rise"
          style={{ '--d': `${Math.min(i, 5) * 50}ms` } as CSSProperties}
          className="border-b border-line"
        >
          <Link
            href={`/services/${service.slug}`}
            className="group/row grid grid-cols-1 items-start gap-6 py-8 transition-colors duration-[160ms] ease-mark hover:bg-surface-raised md:grid-cols-12 md:gap-8 md:px-4"
          >
            <span className="eyebrow text-ink-faint md:col-span-1 md:pt-3">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="flex flex-col gap-3 md:col-span-6">
              <h2 className="display-md m-0 flex items-center gap-3">
                {service.title}
                <Icon
                  name="arrow-right"
                  size={22}
                  className="text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/row:translate-x-1.5 rtl:group-hover/row:-translate-x-1.5"
                />
              </h2>
              <p className="body max-w-[52ch] text-ink-muted">{service.line}</p>
              <ul className="flex flex-wrap gap-2">
                {service.deliverables.map((d) => (
                  <li
                    key={d}
                    className="inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[12px] text-ink-muted"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden w-full max-w-[280px] self-center md:col-span-5 md:col-start-8 md:block md:justify-self-end">
              <ServiceIllustration visual={service.visual} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ServiceRows;
