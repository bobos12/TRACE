import { setRequestLocale } from 'next-intl/server';
import { readLocale } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { FloatingBook, MobileContactBar } from '@/components/contact/PersistentContact';
import { RevealMount } from '@/components/motion/RevealMount';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { getChatCatalog } from '@/lib/chat/knowledge';

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
      <MobileContactBar bookLabel={site.floating.book} emailLabel={site.floating.email} />
      <ChatAssistant
        copy={site.chat}
        catalog={getChatCatalog()}
        book={<FloatingBook key="book" tooltip={site.ui.bookTooltip} label={site.cta.book} />}
      />
    </>
  );
}
