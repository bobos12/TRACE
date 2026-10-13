import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/brand/Logo';
import { Constellation } from '@/components/brand/Constellation';
import { StopText } from '@/components/brand/Nuqta';
import { BookingLink } from '@/components/contact/BookingLink';
import { OrderButton } from '@/components/contact/OrderButton';
import { Disclosure } from '@/components/ui/Disclosure';
import { Browser } from '@/components/bail/Frames';
import { SignDesktop, SignPhone } from '@/components/products/SignMock';
import type { Site } from '@/lib/content';

type Product = Site['products']['items'][number];

/** The rhombus lattice of the brand's showcase slides, as a stage. */
export const LATTICE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M16 14l2 2-2 2-2-2z' fill='%23ffffff' fill-opacity='0.07'/%3E%3C/svg%3E\")";

/**
 * The product shot: the app on a laptop-width screen and the phone in front,
 * angled on a carbon stage with the lattice — a product, not a capture.
 * The phone drifts a little on hover.
 */
function ProductArt({ name }: { name: string }) {
  const sign = name === 'Sign';
  return (
    <div
      aria-hidden="true"
      className="group/art relative h-[230px] overflow-hidden rounded-md bg-surface-sunken shadow-[inset_0_0_0_1px_var(--line)] sm:h-[260px]"
      style={{ backgroundImage: LATTICE }}
    >
      {/* The screen, tilted back. */}
      <div
        className="absolute start-[7%] top-[13%] w-[78%]"
        style={{ transform: 'perspective(1400px) rotateY(-16deg) rotateX(6deg)', transformOrigin: 'left center' }}
      >
        {sign ? (
          <SignDesktop label="TRACE Sign" />
        ) : (
          <Browser url="TRACE Bail">
            <Image
              src="/images/ui/dashboard-dark.png"
              alt=""
              width={2880}
              height={2020}
              sizes="(max-width: 768px) 70vw, 420px"
              className="h-auto w-full"
            />
          </Browser>
        )}
      </div>

      {/* The phone in front. */}
      <div className="absolute end-[7%] top-[20%] w-[25%] max-w-[130px] transition-transform duration-[600ms] ease-mark group-hover/art:-translate-y-2">
        {sign ? (
          <SignPhone />
        ) : (
          <div className="overflow-hidden rounded-[20px] bg-carbon p-1 shadow-float ring-1 ring-line-strong">
            <Image
              src="/images/ui/mobile-home-en-light.png"
              alt=""
              width={720}
              height={1520}
              sizes="130px"
              className="h-auto w-full rounded-[16px]"
            />
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * One product, laid out like a plan on a pricing page — the convention people
 * read as "you can buy this": its screen, the lockup and who it is for, what
 * it is in a line, the price block, one full-width Order button, and what the
 * order includes.
 */
function Panel({ product, copy }: { product: Product; copy: Site['products'] }) {
  const fill = (t: string) => t.replaceAll('{product}', product.name);

  return (
    <article
      data-reveal="rise"
      className="band-carbon at-cut flex h-full flex-col gap-6 border border-line bg-surface p-5 text-ink sm:p-7"
      style={{ '--cut': '28px' } as CSSProperties}
    >
      <ProductArt name={product.name} />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* The TRACE wordmark, then the product's name — one lockup. */}
          <span className="flex items-center gap-2.5" aria-label={`TRACE ${product.name}`}>
            <Logo variant="wordmark" height={18} aria-hidden="true" />
            <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
            <span aria-hidden="true" className="heading-2 leading-none">
              {product.name}
            </span>
          </span>
          {/* The product's constellation — its own, drawn from its name. */}
          <Constellation seed={`TRACE ${product.name}`} size={13} quiet className="text-ink" />
        </div>
        <p className="body-lg text-ink-muted">{product.tagline}</p>
        <span className="self-start rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted shadow-[inset_0_0_0_1px_var(--line-strong)]">
            {product.audience}
          </span>

      </div>

      {/* The price block. */}
      <div className="flex items-end justify-between gap-4 border-y border-line py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-[clamp(2.25rem,1.8rem+1.2vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
            {copy.priceLabel}
          </span>
          <span className="body-sm text-ink-muted">{product.price}</span>
        </div>
        <span className="hidden text-end font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint sm:block">
          {copy.priceNote}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <OrderButton product={product.name} subject={fill(copy.orderSubject)} body={fill(copy.orderBody)} block>
          {product.order}
        </OrderButton>
        <Disclosure more={copy.detailsShow} less={copy.detailsHide}>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
            {product.includes.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px] text-ink">
                <span className="grid size-5 flex-none place-items-center rounded-full text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]">
                  <Icon name="check" size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-line pt-4">
            <BookingLink placement={`landing:product-${product.name.toLowerCase()}`}>{copy.demoCta}</BookingLink>
            <Link
              href={product.href}
              className="group/cta inline-flex items-center gap-2 text-[14px] font-medium text-ink-muted underline decoration-line-strong underline-offset-[5px] hover:text-ink hover:decoration-nuqta"
            >
              {copy.detailsCta}
              <Icon name="arrow-right" size={14} className="transition-transform duration-[160ms] ease-mark group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </Disclosure>
      </div>
    </article>
  );
}

/**
 * TRACE's own products, side by side as cards with the brand's lockup:
 * TRACE Bail on carbon, TRACE Sign on paper, so the two read as a family.
 * The rest of what TRACE has built follows in a row.
 */
export function Products({ site }: { site: Site }) {
  const copy = site.products;

  return (
    <section id="products" className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-10 md:gap-14">
        <SectionHead eyebrow={copy.eyebrow} title={<StopText>{copy.title}</StopText>} lead={copy.lead} />

        {/* Phones swipe between the products; wider screens set them side by side. */}
        <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {copy.items.map((product) => (
            <li key={product.name} className="w-[88%] flex-none snap-start md:w-auto">
              <Panel product={product} copy={copy} />
            </li>
          ))}
        </ul>

      </Container>
    </section>
  );
}

export default Products;
