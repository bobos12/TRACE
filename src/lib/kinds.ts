/**
 * What kind of work a project is.
 *
 * Its own module on purpose. `content.ts` reads every JSON file in
 * `content/`, so a client component that imports a *value* from it drags all
 * of that content — half a megabyte of portfolio and site copy — into the
 * browser bundle. The work index needs these three strings and nothing else.
 */
export const projectKinds = ['client', 'product', 'concept'] as const;
export type ProjectKind = (typeof projectKinds)[number];

/** What was built — how the home page groups client work for a business owner. */
export const projectCategories = [
  'company-website',
  'online-store',
  'booking-website',
  'landing-page',
  'personal-website',
  'business-system',
  'saas',
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
