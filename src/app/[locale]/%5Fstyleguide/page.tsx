import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { readLocale, routing, type Locale } from '@/i18n/routing';
import { getLocalServices, getSite, listPlaceholders } from '@/lib/content';
import { contact } from '@/lib/contact';

import { Logo } from '@/components/brand/Logo';
import { Nuqta, Stop } from '@/components/brand/Nuqta';
import { Constellation } from '@/components/brand/Constellation';
import { Trace } from '@/components/brand/Trace';
import { Cut } from '@/components/brand/Cut';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Field, Select, TextArea } from '@/components/ui/Field';
import { Tabs } from '@/components/ui/Tabs';
import { Icon, iconNames } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Container';
import { WhatsAppButton, CallButton } from '@/components/contact/ContactButtons';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const COLOURS = [
  'carbon',
  'graphite',
  'ash',
  'sand',
  'paper',
  'chalk',
  'vermilion',
  'surface',
  'surface-raised',
  'surface-sunken',
  'line',
  'line-strong',
  'ink',
  'ink-muted',
  'ink-faint',
  'nuqta',
  'nuqta-soft',
  'success',
  'warning',
  'danger',
];

const SPACES = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const RADII: Array<[string, string]> = [
  ['radius-0', '0px'],
  ['radius-sm', '2px'],
  ['radius-md', '4px'],
  ['radius-lg', '8px'],
];

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="eyebrow border-b border-line pb-3 text-ink-muted">
      {children}
    </h2>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <H>{title}</H>
      {children}
    </section>
  );
}

/** Every component, rendered on one ground. Mounted twice: Paper and Carbon. */
function Gallery({ locale, theme }: { locale: Locale; theme: 'light' | 'dark' }) {
  const site = getSite(locale);
  const services = getLocalServices(locale);

  return (
    <div data-theme={theme} className="bg-surface text-ink">
      <Container className="flex flex-col gap-16 py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="heading-1">
            {theme === 'light' ? 'Paper' : 'Carbon'}
            <Stop />
          </h2>
          <span className="eyebrow text-ink-muted">data-theme=&quot;{theme}&quot;</span>
        </div>

        <Block title="Colour">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {COLOURS.map((c) => (
              <div key={c} className="flex flex-col gap-2">
                <div
                  className="h-14 rounded-md border border-line"
                  style={{ background: `var(--${c})` }}
                />
                <span className="code text-ink-muted">--{c}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Space · 1 nuqta = 4px">
          <div className="flex flex-wrap items-end gap-4">
            {SPACES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className="bg-nuqta" style={{ width: `var(--space-${s})`, height: 24 }} />
                <span className="code text-ink-muted">{s}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Radius">
          <div className="flex flex-wrap gap-4">
            {RADII.map(([name, px]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div
                  className="size-16 border border-line-strong bg-surface-raised"
                  style={{ borderRadius: `var(--${name})` }}
                />
                <span className="code text-ink-muted">{px}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Type — Latin">
          <div className="flex flex-col gap-5">
            <p className="display-xl">
              Every business leaves a mark
              <Stop />
            </p>
            <p className="display-lg">Each one carries its own mark</p>
            <p className="display-md">Anything with a login or a workflow</p>
            <p className="heading-1">Two weeks inside your business</p>
            <p className="heading-2">Shaped to your workflow</p>
            <p className="heading-3">Measured, then handed over</p>
            <p className="body-lg max-w-[60ch] text-ink-muted">
              Websites, platforms, mobile apps and internal systems — designed around how your
              business actually works, not around a template.
            </p>
            <p className="body max-w-[60ch]">Body · 15/24, the workhorse.</p>
            <p className="body-sm text-ink-muted">Body small · 13/20, for captions and hints.</p>
            <p className="eyebrow text-ink-muted">02 ◆ Selected work</p>
            <p className="data">1,284 · 6m 12s · 96.4%</p>
            <p className="code text-ink-muted">--ease-mark: cubic-bezier(0.2, 0, 0, 1)</p>
          </div>
        </Block>

        <Block title="Type — Arabic">
          <div className="flex flex-col gap-5" dir="rtl">
            <p className="ar-display">
              لكل عمل أثر
              <Stop />
            </p>
            <p className="ar-heading">نفهم عملك. نبني حوله. ونترك أثرًا.</p>
            <p className="ar-body max-w-[60ch] text-ink-muted">
              مواقع وتطبيقات وأنظمة أعمال وبرمجيات مخصّصة — نصمّمها حول طريقة عمل شركتك الحقيقية،
              بالعربية والإنجليزية.
            </p>
            <p className="ar-label">تسمية عربية · وزن متوسط</p>
          </div>
        </Block>

        <Block title="Logo">
          <div className="flex flex-wrap items-end gap-10">
            <Logo variant="wordmark" height={30} />
            <Logo variant="arabic" height={40} />
            <Logo variant="bilingual" height={38} />
            <Logo variant="symbol" height={26} />
            <Logo variant="symbol" height={26} tone="accent" />
            <Logo variant="wordmark" height={30} tone="mono" />
          </div>
        </Block>

        <Block title="Nuqta · Cut · Trace · Constellation">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <Nuqta size={10} />
              <Nuqta size={14} tone="accent" />
              <Nuqta size={18} tone="ink" />
              <Nuqta size={22} tone="muted" />
            </div>
            <Cut size={16} className="grid h-16 w-40 place-items-center bg-ink text-surface">
              <span className="label">the cut</span>
            </Cut>
            <div className="flex items-center gap-6">
              {['ATHR', 'Nakheel Logistics', 'Sadeem Clinics', 'Masar Realty'].map((seed) => (
                <div key={seed} className="flex flex-col items-center gap-2">
                  <Constellation seed={seed} size={12} />
                  <span className="code text-ink-faint">{seed.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <Trace className="mt-4" />
        </Block>

        <Block title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" cut iconEnd="arrow-right">
              Start a project
            </Button>
            <Button variant="ink">Book the call</Button>
            <Button variant="secondary">See the work</Button>
            <Button variant="ghost">Read more</Button>
            <Button variant="danger">Delete project</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button size="md" variant="secondary">
              Medium
            </Button>
            <Button size="lg" variant="primary" cut>
              Large
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton placement="contact-page" size="lg">
              {site.cta.whatsapp}
            </WhatsAppButton>
            <CallButton placement="contact-page" size="lg" showNumber>
              {site.cta.call}
            </CallButton>
          </div>
        </Block>

        <Block title="Badge · Chip">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Neutral</Badge>
            <Badge tone="accent" dot>
              Accent
            </Badge>
            <Badge tone="success" dot>
              Delivered
            </Badge>
            <Badge tone="warning" dot>
              Delayed
            </Badge>
            <Badge tone="danger" dot>
              Failed pickup
            </Badge>
            <Badge tone="outline">Outline</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {site.industries.items.slice(0, 5).map((item, i) => (
              <Chip key={item} active={i === 1}>
                {item}
              </Chip>
            ))}
          </div>
        </Block>

        <Block title="Card">
          <div className="grid gap-6 md:grid-cols-3">
            <Card eyebrow="Case 03 ◆ Logistics · KSA" title="From WhatsApp to one portal">
              An operations portal, driver app and ERP sync for 11 branches.
            </Card>
            <Card
              cut={20}
              eyebrow="Featured"
              title="The cut, for featured work only"
              action={<Constellation seed="Nakheel Logistics" size={10} />}
            >
              A bordered surface for one object or one idea.
            </Card>
            <Card inverse eyebrow="Inverse" title="At most one per row">
              Carbon on paper, paper on carbon.
            </Card>
          </div>
        </Block>

        <Block title="Field · Select · TextArea">
          <div className="grid max-w-3xl gap-6 md:grid-cols-2">
            <Field label={site.contactPage.form.name} placeholder="Sara Al-Harbi" name={`sg-name-${theme}`} />
            <Field
              label={site.contactPage.form.phone}
              placeholder="+966 5x xxx xxxx"
              name={`sg-phone-${theme}`}
              hint={contact.responseTime[locale]}
            />
            <Field
              label={site.contactPage.form.company}
              name={`sg-company-${theme}`}
              optional={site.ui.optional}
              error="Add the domain, e.g. sara@nakheel.sa"
            />
            <Select
              label={site.contactPage.form.type}
              name={`sg-type-${theme}`}
              options={[site.ui.notSure ?? '—', ...services.map((s) => s.title)]}
            />
            <TextArea
              label={site.contactPage.form.message}
              name={`sg-message-${theme}`}
              wrapClassName="md:col-span-2"
              placeholder="Eleven branches share one WhatsApp group…"
            />
          </div>
        </Block>

        <Block title="Tabs">
          <div className="flex flex-col gap-8">
            <Tabs
              label="Sections"
              items={[
                { label: 'All work', count: 6 },
                { label: 'Systems', count: 2 },
                { label: 'Mobile', count: 3 },
              ]}
            />
            <Tabs label="Period" variant="segmented" items={['Week', 'Month', 'Quarter']} />
          </div>
        </Block>

        <Block title="Icons">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
            {iconNames.map((name) => (
              <div key={name} className="flex flex-col items-center gap-2 text-ink-muted">
                <Icon name={name} size={22} className="text-ink" />
                <span className="code text-[10px] text-ink-faint">{name}</span>
              </div>
            ))}
          </div>
        </Block>
      </Container>
    </div>
  );
}

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);
  const placeholders = listPlaceholders();

  return (
    <NextIntlClientProvider>
      <main id="main">
        <Container className="flex flex-col gap-4 py-12">
          <p className="eyebrow text-ink-muted">ATHR ◆ Styleguide · {locale}</p>
          <h1 className="display-md">
            Tokens, type and components
            <Stop />
          </h1>
          <p className="body text-ink-muted max-w-[60ch]">
            Not indexed, not linked from the site. Every colour, size and component below comes from{' '}
            <span className="code">design/tokens</span> — nothing here is hard-coded.
          </p>
        </Container>

        <Gallery locale={locale} theme="light" />
        <Gallery locale={locale} theme="dark" />

        <Container className="flex flex-col gap-4 py-16">
          <H>Placeholders still in the content</H>
          <ul className="flex flex-col gap-2">
            {placeholders.map((p) => (
              <li key={`${p.area}-${p.detail}`} className="body-sm flex flex-wrap gap-2">
                <span className="code text-nuqta">{p.area}</span>
                <span className="text-ink-muted">{p.detail}</span>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </NextIntlClientProvider>
  );
}
