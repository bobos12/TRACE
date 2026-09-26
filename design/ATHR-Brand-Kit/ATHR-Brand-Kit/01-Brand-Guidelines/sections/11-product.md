# Digital product language

The same system runs from the marketing site to the software ATHR ships for clients.

- **Client first.** Portals show the client's constellation and name at the top of the `Sidebar`; ATHR signs "Built by ATHR" at the foot. If the client has its own brand, swap `nuqta`/`vermilion` for their accent in a third theme — structure, type and spacing stay.
- **Density.** Dashboards use `body` 15px, tables `body-sm` rows at 44px, KPIs in `Stat` with mono numbers. Page padding `space-8`, card gaps `space-4`.
- **States.** Selected = `nuqta-soft` + a nuqta rule. Status = Badge with a word. Empty = `EmptyState` written as a first step. Loading = the forming loader or skeletons.
- **Forms.** Labels above, hints below, errors that explain. Western digits in inputs; `prefix` for currency (SAR, EGP, AED).
- **Mobile.** 16px gutter, `radius-lg` sheets, a tab bar where the current tab carries the nuqta above its icon; RTL is a first-class layout, not a mirror applied at the end.
- **Dark mode** is a full theme (Carbon), not an inversion: surfaces step up in warmth, the accent brightens, and `on-nuqta` becomes carbon.
