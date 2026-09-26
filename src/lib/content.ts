/**
 * Content layer. Every JSON file in `content/` is parsed through a Zod schema
 * at module load, so bad or missing copy fails `next build` instead of shipping.
 * Keep this the only place that touches the JSON — swapping in a CMS later means
 * replacing the four loaders below, nothing else.
 */
import { z } from 'zod';

import contactJson from '@content/contact.json';
import portfolioJson from '@content/portfolio.json';
import servicesJson from '@content/services.json';
import siteAr from '@content/site.ar.json';
import siteEn from '@content/site.en.json';
import trustJson from '@content/trust.json';

import type { Locale } from '@/i18n/routing';
import { projectCategories, projectKinds, type ProjectKind } from '@/lib/kinds';

/* ── shared ───────────────────────────────────────────────────── */

const bilingual = z.object({ en: z.string().min(1), ar: z.string().min(1) });
const numbered = z.object({ value: z.string().min(1), label: z.string().min(1) });

const legalPage = z.object({
  title: z.string().min(1),
  updated: z.string().min(1),
  sections: z
    .array(z.object({ heading: z.string().min(1), body: z.string().min(1) }))
    .min(1),
});

/* ── site.{locale}.json ───────────────────────────────────────── */

const siteSchema = z.object({
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    ogImage: z.string().min(1),
  }),
  nav: z.object({
    links: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
    lang: z.string().min(1),
    cta: z.string().min(1),
    call: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.array(z.string().min(1)).length(2),
    subtitle: z.string().min(1),
    lead: z.string().min(1),
    primaryCta: z.string().min(1),
    secondaryCta: z.string().min(1),
    reassurance: z.string().min(1),
    otherLanguageLine: z.string().min(1),
  }),
  trust: z.object({
    logosTitle: z.string().min(1),
    /** The owner's figures, shown under the logos. */
    stats: z.array(numbered).min(1),
  }),
  platforms: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
  }),
  clientWork: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
    projectsLabel: z.string().min(1),
    moreTitle: z.string().min(1),
    /** A label for every project category — the group headings of client work. */
    categories: z.record(z.enum(projectCategories), z.string().min(1)),
  }),
  services: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
    cta: z.string().min(1),
    /** The per-service WhatsApp button on each tile, and its message — {service}. */
    request: z.string().min(1),
    requestMessage: z.string().min(1),
    /** The plain-language list of everything we build, above the bento. */
    capabilities: z.array(z.string().min(1)).min(1),
  }),
  work: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    cta: z.string().min(1),
    caseCta: z.string().min(1),
  }),
  process: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    steps: z
      .array(
        z.object({ n: z.string().min(1), title: z.string().min(1), text: z.string().min(1) }),
      )
      .min(1),
  }),
  why: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    points: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
  }),
  testimonial: z.object({
    text: z.string().min(1),
    by: z.string().min(1),
    _note: z.string().optional(),
  }),
  industries: z.object({ title: z.string().min(1), items: z.array(z.string().min(1)).min(1) }),
  cta: z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    whatsapp: z.string().min(1),
    call: z.string().min(1),
    email: z.string().min(1),
  }),
  /** The WhatsApp brief in the contact band: pick services, send a ready message. */
  brief: z.object({
    eyebrow: z.string().min(1),
    servicesLabel: z.string().min(1),
    nameLabel: z.string().min(1),
    companyLabel: z.string().min(1),
    detailsLabel: z.string().min(1),
    detailsPlaceholder: z.string().min(1),
    submit: z.string().min(1),
    hint: z.string().min(1),
    errorServices: z.string().min(1),
    errorName: z.string().min(1),
    /** Message templates — {name}, {company}, {services}, {details}, {page}. */
    messageHello: z.string().min(1),
    messageHelloCompany: z.string().min(1),
    messageServices: z.string().min(1),
    messageDetails: z.string().min(1),
    messagePage: z.string().min(1),
  }),
  contactPage: z.object({
    title: z.string().min(1),
    lead: z.string().min(1),
    form: z.object({
      name: z.string().min(1),
      company: z.string().min(1),
      phone: z.string().min(1),
      type: z.string().min(1),
      message: z.string().min(1),
      submit: z.string().min(1),
      success: z.string().min(1),
    }),
  }),
  footer: z.object({
    tagline: z.string().min(1),
    rights: z.string().min(1),
    privacy: z.string().min(1),
    terms: z.string().min(1),
  }),
  floating: z.object({ whatsapp: z.string().min(1), call: z.string().min(1) }),
  /** Interface chrome: labels that aren't marketing copy but still belong in content. */
  ui: z.object({
    skipToContent: z.string().min(1),
    menu: z.string().min(1),
    openMenu: z.string().min(1),
    closeMenu: z.string().min(1),
    themeToggle: z.string().min(1),
    themeLight: z.string().min(1),
    themeDark: z.string().min(1),
    langSwitch: z.string().min(1),
    whatsappTooltip: z.string().min(1),
    scroll: z.string().min(1),
    servicesAsk: z.string().min(1),
    workAsk: z.string().min(1),
    /** Never let a concept read as delivered client work. */
    kindClient: z.string().min(1),
    kindProduct: z.string().min(1),
    kindConcept: z.string().min(1),
    conceptNote: z.string().min(1),
    inDevelopment: z.string().min(1),
    visitSite: z.string().min(1),
    viewCode: z.string().min(1),
    capabilities: z.string().min(1),
    filterKind: z.string().min(1),
    allKinds: z.string().min(1),
    hoursLabel: z.string().min(1),
    orUseForm: z.string().min(1),
    viewProject: z.string().min(1),
    nextProject: z.string().min(1),
    allServices: z.string().min(1),
    allSectors: z.string().min(1),
    filterService: z.string().min(1),
    filterSector: z.string().min(1),
    clearFilters: z.string().min(1),
    noResults: z.string().min(1),
    deliverables: z.string().min(1),
    relatedWork: z.string().min(1),
    challenge: z.string().min(1),
    whatWeDid: z.string().min(1),
    results: z.string().min(1),
    client: z.string().min(1),
    servicesLabel: z.string().min(1),
    stack: z.string().min(1),
    year: z.string().min(1),
    theirMark: z.string().min(1),
    gallery: z.string().min(1),
    close: z.string().min(1),
    previous: z.string().min(1),
    next: z.string().min(1),
    notFoundTitle: z.string().min(1),
    notFoundText: z.string().min(1),
    backHome: z.string().min(1),
    optional: z.string().min(1),
    sendOnWhatsApp: z.string().min(1),
    sending: z.string().min(1),
    formError: z.string().min(1),
    notSure: z.string().min(1),
    footerServices: z.string().min(1),
    footerCompany: z.string().min(1),
    footerLegal: z.string().min(1),
    footerWork: z.string().min(1),
    about: z.string().min(1),
    contact: z.string().min(1),
    cr: z.string().min(1),
    caseStudy: z.string().min(1),
    formTitle: z.string().min(1),
    messagePlaceholder: z.string().min(1),
  }),
  /** Copy for the pages beyond the home page. */
  pages: z.object({
    services: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      lead: z.string().min(1),
      midCta: z.string().min(1),
    }),
    work: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      lead: z.string().min(1),
      endTitle: z.string().min(1),
      endText: z.string().min(1),
    }),
    about: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      lead: z.string().min(1),
      story: z.array(z.string().min(1)).min(1),
      meaningsTitle: z.string().min(1),
      meanings: z
        .array(
          z.object({
            term: z.string().min(1),
            title: z.string().min(1),
            text: z.string().min(1),
          }),
        )
        .min(1),
      principlesTitle: z.string().min(1),
      principles: z
        .array(z.object({ title: z.string().min(1), text: z.string().min(1) }))
        .min(1),
      teamTitle: z.string().min(1),
      team: z
        .array(
          z.object({
            name: z.string().min(1),
            role: z.string().min(1),
            line: z.string().min(1),
          }),
        )
        .min(1),
      _note: z.string().optional(),
    }),
    serviceDetail: z.object({
      eyebrow: z.string().min(1),
      deliverablesTitle: z.string().min(1),
      processTitle: z.string().min(1),
      faqTitle: z.string().min(1),
      faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
      _note: z.string().optional(),
    }),
    legal: z.object({
      _note: z.string().optional(),
      reviewBadge: z.string().min(1),
      privacy: legalPage,
      terms: legalPage,
    }),
    notFound: z.object({ eyebrow: z.string().min(1) }),
  }),
});

export type Site = z.infer<typeof siteSchema>;

const site: Record<Locale, Site> = {
  en: siteSchema.parse(siteEn),
  ar: siteSchema.parse(siteAr),
};

export function getSite(locale: Locale): Site {
  return site[locale];
}

/** next-intl messages. The whole site file doubles as the message catalogue. */
export function getMessages(locale: Locale): Site {
  return site[locale];
}

/* ── services.json ────────────────────────────────────────────── */

export const serviceVisuals = [
  'browser',
  'phone',
  'system',
  'blocks',
  'chart',
  'calendar',
  'layers',
  'nodes',
  'flow',
] as const;

export type ServiceVisual = (typeof serviceVisuals)[number];

const serviceCopy = z.object({
  title: z.string().min(1),
  line: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
});

const serviceSchema = z.object({
  slug: z.string().min(1),
  visual: z.enum(serviceVisuals),
  featured: z.boolean(),
  en: serviceCopy,
  ar: serviceCopy,
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceCopy = z.infer<typeof serviceCopy>;

const services: Service[] = z.array(serviceSchema).min(1).parse(servicesJson);

export function getServices(): Service[] {
  return services;
}

export function getFeaturedServices(): Service[] {
  return services.filter((s) => s.featured);
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** A service flattened into one locale — what components actually consume. */
export interface LocalService extends ServiceCopy {
  slug: string;
  visual: ServiceVisual;
  featured: boolean;
  index: number;
}

export function localizeService(service: Service, locale: Locale): LocalService {
  return {
    slug: service.slug,
    visual: service.visual,
    featured: service.featured,
    index: services.findIndex((s) => s.slug === service.slug),
    ...service[locale],
  };
}

export function getLocalServices(locale: Locale): LocalService[] {
  return services.map((s) => localizeService(s, locale));
}

/* ── portfolio.json ───────────────────────────────────────────── */

const projectCopy = z.object({
  client: z.string().min(1),
  sector: z.string().min(1),
  /** Omitted where the work isn't tied to one — in-house products. */
  country: z.string().optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  challenge: z.string(),
  solution: z.string(),
  /** Plain-language capability chips: "Web application", "Dashboard", "AI". */
  capabilities: z.array(z.string().min(1)).default([]),
  results: z.array(numbered),
  quote: z.object({ text: z.string().min(1), by: z.string().min(1) }).optional(),
});

const projectSchema = z.object({
  slug: z.string().min(1),
  kind: z.enum(projectKinds),
  /** Concepts are placeholders by definition; real work is not. */
  placeholder: z.boolean().default(false),
  /** Something the owner still has to supply or confirm — listed in the placeholder report. */
  _note: z.string().optional(),
  featured: z.boolean(),
  /** Bigger card on the work index. The strongest few. */
  spotlight: z.boolean().default(false),
  /** Several projects for one client share a group, so they read as one relationship. */
  group: z.string().optional(),
  /** What was built — company website, online store, landing page… */
  category: z.enum(projectCategories).optional(),
  /** Stated only where it is known. Never guessed. */
  year: z.number().int().optional(),
  inDevelopment: z.boolean().default(false),
  cover: z.string().min(1),
  gallery: z.array(z.string().min(1)),
  services: z.array(z.string().min(1)),
  stack: z.array(z.string().min(1)),
  /** Live site and source, where they exist and are public. */
  links: z
    .object({ live: z.string().url().optional(), source: z.string().url().optional() })
    .default({}),
  en: projectCopy,
  ar: projectCopy,
});

export { projectKinds };
export type { ProjectKind };

export type Project = z.infer<typeof projectSchema>;
export type ProjectCopy = z.infer<typeof projectCopy>;

const portfolio = z
  .object({ _note: z.string().optional(), projects: z.array(projectSchema).min(1) })
  .parse(portfolioJson);

const projects = portfolio.projects;

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

/** The few that carry the most weight on the work index. */
export function getSpotlightProjects(): Project[] {
  return projects.filter((p) => p.spotlight);
}

export function getProjectsByKind(kind: ProjectKind): Project[] {
  return projects.filter((p) => p.kind === kind);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Every project delivered for one client, in portfolio order. */
export function getProjectsByGroup(group: string): Project[] {
  return projects.filter((p) => p.group === group);
}

export function getProjectsByService(slug: string): Project[] {
  return projects.filter((p) => p.services.includes(slug));
}

/** The project after this one, wrapping around — for the "next project" card. */
export function getNextProject(slug: string): Project | undefined {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return undefined;
  return projects[(i + 1) % projects.length];
}

export interface LocalProject extends ProjectCopy {
  slug: string;
  kind: ProjectKind;
  placeholder: boolean;
  featured: boolean;
  spotlight: boolean;
  group?: string;
  category?: (typeof projectCategories)[number];
  year?: number;
  inDevelopment: boolean;
  cover: string;
  gallery: string[];
  services: string[];
  stack: string[];
  links: { live?: string; source?: string };
}

/**
 * What a card actually renders — and nothing else.
 *
 * The work index is a client component, so everything handed to it is
 * serialised into the HTML and parsed again during hydration. Sixteen full
 * projects carry sixteen challenge/solution essays that no card ever shows;
 * stripping them is the difference between 250ms of blocking time and 50ms.
 */
export type ProjectCardData = Pick<
  LocalProject,
  | 'slug'
  | 'kind'
  | 'inDevelopment'
  | 'spotlight'
  | 'client'
  | 'sector'
  | 'country'
  | 'title'
  | 'cover'
  | 'capabilities'
  | 'results'
  | 'services'
>;

export function toCardData(p: LocalProject): ProjectCardData {
  return {
    slug: p.slug,
    kind: p.kind,
    inDevelopment: p.inDevelopment,
    spotlight: p.spotlight,
    client: p.client,
    sector: p.sector,
    country: p.country,
    title: p.title,
    cover: p.cover,
    capabilities: p.capabilities,
    results: p.results,
    services: p.services,
  };
}

export function localizeProject(project: Project, locale: Locale): LocalProject {
  const { en: _en, ar: _ar, ...rest } = project;
  return { ...rest, ...project[locale] };
}

export function getLocalProjects(locale: Locale): LocalProject[] {
  return projects.map((p) => localizeProject(p, locale));
}

/* ── trust.json ───────────────────────────────────────────────── */

const trustSchema = z.object({
  _note: z.string().optional(),
  clients: z
    .array(
      z.object({
        slug: z.string().min(1),
        /** The logo's neutral pixels as an alpha mask, painted with the ink token. */
        ink: z.string().min(1),
        /** Its brand-coloured pixels, laid over the ink; null for a one-colour logo. */
        color: z.string().nullable(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        /** Optical correction: a thin wordmark needs more size than a dense badge. */
        scale: z.number().positive().default(1),
        /** The case study the logo links to; the name is read from it. */
        project: z.string().min(1),
      }),
    )
    .min(1),
  platforms: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: bilingual,
        /** What the platform is, in a business owner's words. */
        kind: bilingual,
        /** Single-colour mark, painted with `color` (or the ink when there is none). */
        icon: z.string().min(1),
        /** Brand colours are the platform's own data, not ATHR tokens. */
        color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        /** A lighter tint where the brand colour fails on carbon. */
        colorDark: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        /** A full-colour mark, used as-is instead of the tinted icon. */
        image: z.string().optional(),
      }),
    )
    .min(1),
});

const trust = trustSchema.parse(trustJson);

export interface ClientLogo {
  slug: string;
  name: string;
  ink: string;
  color: string | null;
  width: number;
  height: number;
  scale: number;
  href: string;
}

/** Client logos, each tied to real work — a logo without a project fails the build. */
export function getClientLogos(locale: Locale): ClientLogo[] {
  return trust.clients.map((c) => {
    const project = getProject(c.project);
    if (!project) throw new Error(`trust.json: no project "${c.project}" for client "${c.slug}"`);
    return {
      slug: c.slug,
      name: project[locale].client,
      ink: c.ink,
      color: c.color,
      width: c.width,
      height: c.height,
      scale: c.scale,
      href: `/work/${c.project}`,
    };
  });
}

export interface Platform {
  slug: string;
  name: string;
  kind: string;
  icon: string;
  color?: string;
  colorDark?: string;
  image?: string;
}

export function getPlatforms(locale: Locale): Platform[] {
  return trust.platforms.map((p) => ({
    slug: p.slug,
    name: p.name[locale],
    kind: p.kind[locale],
    icon: p.icon,
    color: p.color,
    colorDark: p.colorDark,
    image: p.image,
  }));
}

/* ── contact.json ─────────────────────────────────────────────── */

const contactSchema = z.object({
  _note: z.string().optional(),
  whatsapp: z.string().min(1),
  phone: z.string().min(1),
  phoneDisplay: z.string().min(1),
  phoneSecondary: z.string().min(1),
  phoneSecondaryDisplay: z.string().min(1),
  email: z.string().email(),
  hours: bilingual,
  responseTime: bilingual,
  cities: z.object({ en: z.array(z.string()).min(1), ar: z.array(z.string()).min(1) }),
  whatsappMessage: bilingual,
  social: z.object({
    linkedin: z.string(),
    x: z.string(),
    instagram: z.string(),
    behance: z.string(),
  }),
});

export type Contact = z.infer<typeof contactSchema>;

/** Validated at build time; `lib/contact-data.ts` serves the same object to
 *  client components without dragging Zod into the browser bundle. */
export const contact: Contact = contactSchema.parse(contactJson);

/* ── placeholders ─────────────────────────────────────────────── */

/** Everything still carrying a placeholder marker — surfaced in the styleguide
 *  and in the Phase 4 report so the owner knows exactly what to replace. */
export function listPlaceholders(): { area: string; detail: string }[] {
  const out: { area: string; detail: string }[] = [];
  if (contact._note) out.push({ area: 'content/contact.json', detail: contact._note });
  if (portfolio._note) out.push({ area: 'content/portfolio.json', detail: portfolio._note });
  for (const p of projects) {
    if (p._note && !p.placeholder) out.push({ area: `project: ${p.slug}`, detail: p._note });
    if (p.placeholder) {
      out.push({ area: `project: ${p.slug}`, detail: `${p.en.client} — sample project, cover ${p.cover}` });
    }
  }
  for (const loc of ['en', 'ar'] as const) {
    const s = site[loc];
    const notes: Array<[string, string | undefined]> = [
      ['testimonial', s.testimonial._note],
      ['pages.about', s.pages.about._note],
      ['pages.serviceDetail', s.pages.serviceDetail._note],
      ['pages.legal', s.pages.legal._note],
    ];
    for (const [area, note] of notes) {
      if (note) out.push({ area: `content/site.${loc}.json → ${area}`, detail: note });
    }
  }
  return out;
}
