import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getLocalServices, getSite } from '@/lib/content';
import { contact, whatsappHref } from '@/lib/contact';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { Icon, iconNames, type IconName } from '@/components/ui/Icon';
import { BookCallButton, EmailButton } from '@/components/contact/ContactButtons';
import { ThemeToggle } from './ThemeToggle';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow text-ink-faint">{title}</h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="body-sm text-ink-muted transition-colors duration-[160ms] ease-mark hover:text-ink"
      >
        {children}
      </Link>
    </li>
  );
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'TRACE on Facebook',
  instagram: 'TRACE on Instagram',
  x: 'TRACE on X',
};

export function Footer({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const services = getLocalServices(locale);
  const ui = site.ui;
  const socials = Object.entries(contact.social).filter(
    ([name, url]) => url && !url.includes('REPLACE') && iconNames.includes(name as IconName),
  );

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-16 py-16">
        {/* Top row — logo, tagline, the two contact actions. */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[44ch] flex-col gap-5">
            <Logo variant="wordmark" height={26} />
            <p className="body text-ink-muted">{site.footer.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BookCallButton placement="footer">{site.cta.book}</BookCallButton>
            <EmailButton placement="footer">{site.cta.email}</EmailButton>
          </div>
        </div>

        {/* Link columns. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
          <Column title={ui.footerServices ?? 'Services'}>
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </Column>

          <Column title={ui.footerWork ?? 'Work'}>
            <FooterLink href="/work">{site.work.cta}</FooterLink>
            <FooterLink href="/services">{site.services.cta}</FooterLink>
            <FooterLink href="/bail-bonds">{ui.bailBonds}</FooterLink>
          </Column>

          <Column title={ui.footerCompany ?? 'Company'}>
            <FooterLink href="/about">{ui.about}</FooterLink>
            <FooterLink href="/contact">{ui.contact}</FooterLink>
          </Column>

          <div className="flex flex-col gap-3">
            <h2 className="eyebrow text-ink-faint">{ui.contact}</h2>
            <ul className="flex flex-col gap-2 body-sm text-ink-muted">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-ink">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone}`} className="font-mono hover:text-ink">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappHref(locale)} target="_blank" rel="noopener" className="hover:text-ink">
                  {site.cta.whatsapp}
                </a>
              </li>
              <li>{contact.hours[locale]}</li>
              {/* TODO: add the US company registration (state + entity) once formed — US buyers look for it. */}
            </ul>
            {socials.length ? (
              <ul className="-ms-2.5 mt-2 flex gap-1">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener"
                      aria-label={SOCIAL_LABELS[name] ?? name}
                      className="grid size-10 place-items-center text-ink-muted transition-colors hover:text-ink"
                    >
                      <Icon name={name as IconName} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Bottom row. */}
        <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="body-sm text-ink-faint">
            {contact.cities[locale].join(' · ')} — {site.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="body-sm text-ink-muted hover:text-ink">
              {site.footer.privacy}
            </Link>
            <Link href="/terms" className="body-sm text-ink-muted hover:text-ink">
              {site.footer.terms}
            </Link>
            <ThemeToggle
              labels={{
                light: ui.themeLight ?? 'Light',
                dark: ui.themeDark ?? 'Dark',
                toggle: ui.themeToggle ?? 'Theme',
              }}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
