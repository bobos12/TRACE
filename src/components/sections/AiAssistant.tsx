import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Reveal } from '@/components/motion/Reveal';
import { AssistantDemo } from '@/components/bail/AssistantDemo';
import { BookingLink } from '@/components/contact/BookingLink';
import { TryAssistant } from '@/components/chat/TryAssistant';
import { MoreOnMobile } from '@/components/ui/MoreOnMobile';
import type { BailBonds, Site } from '@/lib/content';

/**
 * The AI chat assistant, as a service. What it does on the left, in six
 * plain points; the working demo on the right — a bail agency's assistant
 * answering a question and handing the lead to the agent's phone. Then two
 * ways in: talk to TRACE's own assistant right now, or book a call.
 */
export function AiAssistant({ site, bail }: { site: Site; bail: BailBonds }) {
  const copy = site.ai;

  return (
    <section
      id='ai'
      className='border-b border-line bg-surface py-[var(--section-y)]'
    >
      <Container className='flex flex-col gap-12'>
        <SectionHead
          title={<StopText>{copy.title.replace(/\.$/, '')}</StopText>}
          lead={copy.lead}
          size='md'
        />

        <div className='grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10'>
          <div className='order-2 flex flex-col gap-8 lg:order-none lg:col-span-5'>
            <MoreOnMobile
              more={site.products.showMore}
              less={site.products.showLess}
            >
              <ul className='grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
                {copy.points.map((p, i) => (
                  <li
                    key={p.title}
                    data-reveal='rise'
                    style={{ '--d': `${i * 60}ms` } as CSSProperties}
                    className='flex gap-3'
                  >
                    <span className='grid size-9 flex-none place-items-center rounded-sm bg-surface-raised text-ink shadow-[inset_0_0_0_1px_var(--line)]'>
                      <Icon name={p.icon as IconName} size={17} />
                    </span>
                    <span className='flex flex-col gap-0.5'>
                      <span className='text-[15px] font-medium text-ink'>
                        {p.title}
                      </span>
                      <span className='body-sm text-ink-muted'>{p.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </MoreOnMobile>

            <div className='flex flex-col items-start gap-4 border-t border-line pt-7'>
              <TryAssistant prompt={copy.tryPrompt}>{copy.tryCta}</TryAssistant>
              <BookingLink placement='landing:ai'>
                {site.ui.servicesAsk}
              </BookingLink>
            </div>
          </div>

          <Reveal className='order-1 flex flex-col gap-3 lg:order-none lg:col-span-7'>
            <p className='eyebrow flex items-center gap-2.5 text-ink-muted'>
              <Nuqta size={7} />
              {copy.demoLabel}
            </p>
            <AssistantDemo
              copy={bail.assistant}
              initial={bail.demo.name.charAt(0)}
              compact
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default AiAssistant;
