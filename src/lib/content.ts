/**
 * Content layer. Every JSON file in `content/` is parsed through a Zod schema
 * at module load, so bad or missing copy fails `next build` instead of shipping.
 * Keep this the only place that touches the JSON — swapping in a CMS later means
 * replacing the four loaders below, nothing else.
 */
import { z } from 'zod';

import bailBondsJson from '@content/bail-bonds.json';
import contactJson from '@content/contact.json';
import portfolioJson from '@content/portfolio.json';
import servicesJson from '@content/services.json';
import siteEn from '@content/site.en.json';
import trustJson from '@content/trust.json';

import type { Locale } from '@/i18n/routing';
import { projectCategories, projectKinds, type ProjectKind } from '@/lib/kinds';

/* ── shared ───────────────────────────────────────────────────── */

/** Copy keyed by locale. English is the only locale; the key stays so a second
 *  language can be added later without reshaping every file. */
const localized = z.object({ en: z.string().min(1) });
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
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
          /** A dropdown: the label opens it; `href` marks it current. */
          children: z
            .array(z.object({ label: z.string().min(1), href: z.string().min(1), text: z.string().min(1) }))
            .optional(),
        }),
      )
      .min(1),
    cta: z.string().min(1),
    email: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.array(z.string().min(1)).length(2),
    subtitle: z.string().min(1),
    lead: z.string().min(1),
    primaryCta: z.string().min(1),
    secondaryCta: z.string().min(1),
    reassurance: z.string().min(1),
  }),
  trust: z.object({
    logosTitle: z.string().min(1),
    title: z.string().min(1),
    /** What every client gets in writing — the strip under the hero. */
    promises: z.array(z.string().min(1)).min(1),
    /** The owner's figures, shown under the logos. */
    stats: z.array(numbered).min(1),
  }),
  platforms: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
    note: z.string().min(1),
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
    /** The per-service enquiry button on each tile, and its email subject — {service}. */
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
  industries: z.object({ title: z.string().min(1), items: z.array(z.string().min(1)).min(1) }),
  cta: z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    book: z.string().min(1),
    bookNote: z.string().min(1),
    email: z.string().min(1),
    whatsapp: z.string().min(1),
    call: z.string().min(1),
  }),
  /** The project brief in the contact band: pick services, send a ready email. */
  brief: z.object({
    eyebrow: z.string().min(1),
    servicesLabel: z.string().min(1),
    nameLabel: z.string().min(1),
    companyLabel: z.string().min(1),
    emailLabel: z.string().min(1),
    detailsLabel: z.string().min(1),
    detailsPlaceholder: z.string().min(1),
    submit: z.string().min(1),
    sending: z.string().min(1),
    hint: z.string().min(1),
    /** After a direct send — {name}, {email}. */
    sentTitle: z.string().min(1),
    sentText: z.string().min(1),
    fallbackText: z.string().min(1),
    orWhatsApp: z.string().min(1),
    errorServices: z.string().min(1),
    errorName: z.string().min(1),
    errorEmail: z.string().min(1),
    /** Message templates — {name}, {company}, {services}, {details}, {page}. */
    subject: z.string().min(1),
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
      email: z.string().min(1),
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
  floating: z.object({ book: z.string().min(1), email: z.string().min(1) }),
  /** The website assistant: launcher, panel chrome, cards and the lead form. */
  chat: z.object({
    launcher: z.string().min(1),
    launcherStatus: z.string().min(1),
    launcherLabel: z.string().min(1),
    teaser: z.string().min(1),
    teaserDismiss: z.string().min(1),
    name: z.string().min(1),
    status: z.string().min(1),
    concept: z.string().min(1),
    book: z.string().min(1),
    close: z.string().min(1),
    reset: z.string().min(1),
    welcomeTitle: z.string().min(1),
    welcomeText: z.string().min(1),
    starters: z.array(z.string().min(1)).min(1).max(6),
    inputLabel: z.string().min(1),
    inputPlaceholder: z.string().min(1),
    send: z.string().min(1),
    stop: z.string().min(1),
    you: z.string().min(1),
    disclaimer: z.string().min(1),
    bookCardTitle: z.string().min(1),
    bookCardText: z.string().min(1),
    bookCardCta: z.string().min(1),
    emailCta: z.string().min(1),
    viewProject: z.string().min(1),
    viewService: z.string().min(1),
    leadTitle: z.string().min(1),
    leadText: z.string().min(1),
    leadName: z.string().min(1),
    leadEmail: z.string().min(1),
    leadCompany: z.string().min(1),
    leadSubmit: z.string().min(1),
    leadSending: z.string().min(1),
    /** {email} */
    leadSuccess: z.string().min(1),
    leadFallback: z.string().min(1),
    leadErrorName: z.string().min(1),
    leadErrorEmail: z.string().min(1),
    /** {name} */
    leadSubject: z.string().min(1),
    leadTranscript: z.string().min(1),
    error: z.string().min(1),
    interrupted: z.string().min(1),
    rateLimited: z.string().min(1),
    offline: z.string().min(1),
  }),
  /** Interface chrome: labels that aren't marketing copy but still belong in content. */
  ui: z.object({
    skipToContent: z.string().min(1),
    menu: z.string().min(1),
    openMenu: z.string().min(1),
    closeMenu: z.string().min(1),
    themeToggle: z.string().min(1),
    themeLight: z.string().min(1),
    themeDark: z.string().min(1),
    bookTooltip: z.string().min(1),
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
    viewDemo: z.string().min(1),
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
    sendByEmail: z.string().min(1),
    sending: z.string().min(1),
    formError: z.string().min(1),
    notSure: z.string().min(1),
    footerServices: z.string().min(1),
    footerCompany: z.string().min(1),
    footerLegal: z.string().min(1),
    footerWork: z.string().min(1),
    about: z.string().min(1),
    contact: z.string().min(1),
    caseStudy: z.string().min(1),
    bailBonds: z.string().min(1),
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
    .object({
      live: z.string().url().optional(),
      source: z.string().url().optional(),
      /** A working demo TRACE hosts itself, under public/demos/. */
      demo: z.string().startsWith('/demos/').optional(),
    })
    .default({}),
  en: projectCopy,
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
  links: { live?: string; source?: string; demo?: string };
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
  const { en: _en, ...rest } = project;
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
        project: z.string().min(1).optional(),
        /** For a logo shown without a case study. */
        name: z.string().min(1).optional(),
      }),
    )
    .min(1),
  platforms: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: localized,
        /** What the platform is, in a business owner's words. */
        kind: localized,
        /** Single-colour mark, painted with `color` (or the ink when there is none). */
        icon: z.string().min(1),
        /** Brand colours are the platform's own data, not TRACE tokens. */
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
  /** Absent when the client is shown by logo only. */
  href?: string;
}

/** Client logos. One tied to a case study links to it and takes its name from it;
 *  a logo-only client must carry its own name. Anything else fails the build. */
export function getClientLogos(locale: Locale): ClientLogo[] {
  return trust.clients.map((c) => {
    const project = c.project ? getProject(c.project) : undefined;
    if (c.project && !project) throw new Error(`trust.json: no project "${c.project}" for client "${c.slug}"`);
    const name = project?.[locale].client ?? c.name;
    if (!name) throw new Error(`trust.json: client "${c.slug}" needs a project or a name`);
    return {
      slug: c.slug,
      name,
      ink: c.ink,
      color: c.color,
      width: c.width,
      height: c.height,
      scale: c.scale,
      href: project ? `/work/${project.slug}` : undefined,
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
  /** Scheduling link (Cal.com, Calendly). Until it is real, "Book a call" opens the contact page. */
  booking: z.string().url(),
  email: z.string().email(),
  phone: z.string().min(1),
  phoneDisplay: z.string().min(1),
  whatsapp: z.string().min(1),
  hours: localized,
  responseTime: localized,
  cities: z.object({ en: z.array(z.string()).min(1) }),
  whatsappMessage: localized,
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

/* ── bail-bonds.json ──────────────────────────────────────────── */

const str = z.string().min(1);
const strs = z.array(str).min(1);
const qa = z.object({ q: str, a: str });
const titled = z.object({ title: str, text: str });

const bailBondsSchema = z.object({
  _note: z.string().optional(),
  meta: z.object({ title: str, description: str }),
  hero: z.object({
    eyebrow: str,
    title: z.tuple([str, str]),
    lead: str,
    primaryCta: str,
    secondaryCta: str,
    reassurance: str,
    specsNote: str,
    specs: z
      .array(z.object({ prefix: z.string().optional(), value: str, unit: str, text: str }))
      .length(4),
  }),
  demo: z.object({
    concept: str,
    name: str,
    fullName: str,
    phone: str,
    url: str,
    oldUrl: str,
    site: z.object({
      utility: str,
      spanish: str,
      reviews: str,
      logoSub: str,
      nav: strs,
      hotline: str,
      callNow: str,
      eyebrow: str,
      headline: str,
      sub: str,
      call: str,
      start: str,
      checks: strs,
      form: z.object({
        title: str,
        sub: str,
        fields: strs,
        values: z.array(z.string()),
        submit: str,
        note: str,
      }),
      proof: z.array(z.object({ a: str, b: str })).length(4),
      jailsTitle: str,
      jails: z.array(z.object({ name: str, where: str })).min(1),
      agent: z.object({ label: str, name: str, role: str }),
      review: z.object({ text: str, by: str, source: str }),
      chat: str,
      license: str,
    }),
    old: z.object({
      title: str,
      tagline: str,
      nav: strs,
      ticker: str,
      heading: str,
      body: strs,
      review: str,
      phone: str,
      counter: str,
      counterLabel: str,
      footer: str,
      ie: str,
      construction: str,
    }),
  }),
  maps: z.object({
    query: str,
    chips: strs,
    actions: z.tuple([str, str, str]),
    labels: z.object({
      area: str,
      area2: str,
      street1: str,
      street2: str,
      street3: str,
      water: str,
      park: str,
      highway: str,
    }),
    results: z
      .array(
        z.object({
          name: str,
          rating: str,
          reviews: str,
          kind: str,
          distance: str,
          status: str,
          tone: z.enum(['open', 'closed', 'none']),
          photos: z.boolean(),
          website: z.boolean(),
          note: str,
        }),
      )
      .length(3),
  }),
  moment: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    question: str,
    query: str,
    timeline: z.array(z.object({ time: str, text: str })).length(4),
  }),
  compare: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    sliderLabel: str,
    before: str,
    after: str,
    changes: z.array(z.object({ what: str, before: str, after: str })).min(1),
    cta: str,
  }),
  journey: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    steps: z.array(z.object({ name: str, text: str, tag: str })).length(4),
  }),
  assistant: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    points: strs,
    name: str,
    status: str,
    greeting: str,
    inputLabel: str,
    inputPlaceholder: str,
    reset: str,
    you: str,
    waiting: str,
    questions: z.array(z.object({ q: str, a: str, action: str })).min(1),
    phoneTitle: str,
    lockTime: str,
    lockDate: str,
    notification: z.object({ app: str, when: str, title: str, body: str, actions: strs }),
    demoNote: str,
  }),
  details: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    callBar: titled.extend({ label: str }),
    areas: titled.extend({ counties: strs }),
    estimator: titled.extend({
      bailLabel: str,
      rateLabel: str,
      premiumLabel: str,
      planLabel: str,
      planNote: str,
      perMonth: str,
      disclaimer: str,
    }),
    language: titled.extend({ labels: z.tuple([str, str]), en: str, es: str }),
    maps: titled.extend({ name: str, rating: str, reviews: str, open: str, kind: str }),
    form: titled.extend({ fields: strs, submit: str, step: str }),
    speed: titled.extend({ budget: str }),
    privacy: titled,
  }),
  process: z.object({
    eyebrow: str,
    title: str,
    steps: z.array(z.object({ n: str, title: str, text: str })).min(1),
  }),
  proof: z.object({
    eyebrow: str,
    title: str,
    lead: str,
    logosTitle: str,
    platformsTitle: str,
    platforms: strs,
    trademarkNote: str,
    promisesTitle: str,
    promises: strs,
  }),
  faq: z.object({ eyebrow: str, title: str, items: z.array(qa).min(1) }),
  cta: z.object({ title: str, context: str, services: strs }),
});

export type BailBonds = z.infer<typeof bailBondsSchema>;

const bailBonds = bailBondsSchema.parse(bailBondsJson);

export function getBailBonds(): BailBonds {
  return bailBonds;
}

/* ── placeholders ─────────────────────────────────────────────── */

/** Everything still carrying a placeholder marker — surfaced in the styleguide
 *  and in the Phase 4 report so the owner knows exactly what to replace. */
export function listPlaceholders(): { area: string; detail: string }[] {
  const out: { area: string; detail: string }[] = [];
  if (contact._note) out.push({ area: 'content/contact.json', detail: contact._note });
  if (portfolio._note) out.push({ area: 'content/portfolio.json', detail: portfolio._note });
  if (bailBonds._note) out.push({ area: 'content/bail-bonds.json', detail: bailBonds._note });
  for (const p of projects) {
    if (p._note && !p.placeholder) out.push({ area: `project: ${p.slug}`, detail: p._note });
    if (p.placeholder) {
      out.push({ area: `project: ${p.slug}`, detail: `${p.en.client} — sample project, cover ${p.cover}` });
    }
  }
  for (const loc of ['en'] as const) {
    const s = site[loc];
    const notes: Array<[string, string | undefined]> = [
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
