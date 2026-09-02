# Gumroad listing copy

Paste-ready. Adjust the price and the support email before publishing.

---

## Product name

**Everly — Wedding Planner App (Next.js 14 + Supabase)**

## Subtitle / summary

A complete, production-shaped wedding planning app. Guests and RSVPs, budget
tracking, a 54-task checklist, vendors and a dashboard — with the Supabase
schema, row-level security and 36 passing end-to-end tests.

## Suggested price

**£59** ($75), with a £39 launch price for the first two weeks.

Below £39 you signal "unfinished"; above £79 buyers expect a support contract.
Gumroad takes 10% + 50¢ on direct sales.

## Cover image

`docs/screenshot-dashboard.png` — the dashboard reads best as a thumbnail.
Add `screenshot-guests.png` and `screenshot-budget.png` to the gallery.

---

## Description

### Stop building wedding CRUD from scratch

Everly is a finished wedding planning application you can rebrand and ship, or
lift pieces from. It is not a landing page with dummy screens — every feature
works against a real database, with real auth and real row-level security.

**Live demo:** https://claude.ai/code/artifact/c6c888d6-4aa5-4d44-9a4e-fcf766134b94

### What's inside

**Dashboard** — countdown to the day, overview cards for guests, budget,
checklist and vendors, the next open tasks tickable in place, an RSVP
breakdown, and your heaviest spending categories.

**Guests** — full CRUD, RSVP editable inline from the table, party size that
covers plus-ones, side, wedding-party role, seating and dietary needs, with
search and status filters. Head counts respect party size, not row count.

**Budget** — ten categories seeded from the couple's total budget, expenses
with due dates and a paid flag, and per-category bars that turn amber near the
allocation and rose once over it.

**Checklist** — 54 tasks across eight phases, from twelve months out to after
the wedding, with due dates derived automatically from the wedding date.
Optimistic ticking, custom tasks, and filters.

**Vendors** — a directory by type with contacts, quotes, deposits, outstanding
balances and status tracking.

### Built properly

- **Next.js 14 App Router** with TypeScript in strict mode, including
  `noUncheckedIndexedAccess`
- **Supabase** — the full schema as a migration, with row-level security
  policies on all six tables so a user can only ever touch their own rows
- **Auth** — email and password, route protection in middleware, password
  reset, and in-app account deletion (required by Apple if you go native)
- **TanStack Query v5** — one hook module per domain, optimistic updates,
  loading skeletons and error states with retry
- **shadcn/ui + TailwindCSS** with a real design system: a considered palette,
  a serif/sans pairing, consistent spacing
- **Mobile-first** — tables collapse to cards, the sidebar becomes a sheet

### 36 end-to-end tests, and they run with no setup

Most templates ship with no tests. This one includes a Playwright suite
covering auth, first-run seeding, all five features and the mobile layout —
and it runs with **no Supabase project and no credentials**, against a small
in-memory stand-in for the Supabase API. Clone, `npm test`, watch it pass.

### What you need

A Supabase account (the free tier is plenty) and Node 18+. Setup is about
fifteen minutes: run one SQL file, paste two keys, `npm run dev`.

### Licence

One licence per end product. Build and sell commercial products with it;
don't resell the source. Full terms in `LICENSE.md`.

---

## FAQ

**Is this a finished app or a starter kit?**
A finished app. Every feature works. Most buyers rebrand it and ship, or lift
the parts they need.

**Can I sell what I build with it?**
Yes. One licence per end product you build.

**Does it work with the new Supabase API keys?**
Yes — both the legacy `anon` key and the newer `sb_publishable_` format. Note
that Supabase's Connect dialog names the variable
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` while this template reads
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Same value, different name.

**Is there an iOS/Android app?**
Not in this release.

**Do I need to know Supabase?**
No. The schema is one SQL file you paste into their editor, and the README
walks through it step by step.

**What about updates?**
Buyers get updates to this version free via Gumroad.

---

## Tags

`nextjs` `supabase` `react` `typescript` `tailwindcss` `saas-template`
`wedding` `shadcn` `starter-kit` `crud-app`

## Post-purchase message

Thanks for buying Everly.

Start with `README.md` — the quick-start is five steps and takes about fifteen
minutes, most of it waiting for Supabase to provision.

Two things that trip people up, both covered at the bottom of the README:
`src/middleware.ts` must stay inside `src/`, and Supabase's Connect dialog uses
a different environment variable name than the template does.

If you get stuck, reply to this email with the error and I'll help.
