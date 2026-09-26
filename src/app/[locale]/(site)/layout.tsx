import { setRequestLocale } from 'next-intl/server';
import { readLocale } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp, MobileContactBar } from '@/components/contact/PersistentContact';
import { RevealMount } from '@/components/motion/RevealMount';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);
  const site = getSite(locale);

  return (
    <>
      <RevealMount />
      <Nav site={site} />
      <main id="main">{children}</main>
      <Footer locale={locale} />
      <FloatingWhatsApp tooltip={site.ui.whatsappTooltip} label={site.cta.whatsapp} />
      <MobileContactBar
        whatsappLabel={site.floating.whatsapp}
        callLabel={site.floating.call}
      />
    </>
  );
}
