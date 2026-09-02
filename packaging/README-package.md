# Everly — Wedding Planner (Next.js 14 + Supabase)

A complete, production-shaped wedding planning app: guest list and RSVPs,
budget tracking, a pre-populated planning checklist, a vendor directory, and a
dashboard that ties them together.

This is a **source-code template**. You own what you build with it — see
`LICENSE.md`.

**Live demo:** https://claude.ai/code/artifact/c6c888d6-4aa5-4d44-9a4e-fcf766134b94

---

## What you get

- **Five working feature areas**, not placeholder screens: dashboard, guests,
  budget, checklist, vendors
- **Complete Supabase schema** with row-level security policies, as a
  migration you paste into the SQL editor
- **Email + password auth**, route protection in middleware, password reset,
  and in-app account deletion
- **36 end-to-end tests** that run with no Supabase project and no credentials
- **A design system**, not just Tailwind defaults: a considered palette, a
  serif/sans pairing, consistent spacing
- **Mobile-first responsive** throughout — tables become cards, the sidebar
  becomes a sheet

## Tech stack

Next.js 14 (App Router) · TypeScript, strict · TailwindCSS · shadcn/ui ·
TanStack Query v5 · Supabase (Postgres, Auth, RLS) · Playwright

---

## Quick start

```bash
npm install
cp .env.example .env.local
```

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste `supabase/migrations/0001_init.sql` → Run.
   Then do the same with `0002_account_deletion.sql`.
3. **Project Settings → API** → copy the Project URL and the anon (or
   publishable) key into `.env.local`.
4. **Authentication → Providers → Email** → turn off "Confirm email" for local
   development.
5. `npm run dev`

Sign up, and the first-run setup seeds ten budget categories and all 54
checklist tasks with due dates counted back from your wedding date.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # Playwright end-to-end suite
```

## Tests

```bash
npx playwright install chromium
npm test
```

The suite needs **no Supabase project**. `tests/mock-supabase.mjs` stands in for
the GoTrue and PostgREST endpoints, scoped per bearer token the way row-level
security scopes per user, and Playwright runs it alongside a production build of
the real app. The middleware, cookie flow and data layer are all genuinely
exercised.

---

## Where things live

```
src/
├── app/
│   ├── (auth)/       sign in / sign up
│   ├── (app)/        the five authenticated pages
│   └── globals.css   colour tokens
├── components/
│   ├── ui/           shadcn/ui primitives
│   ├── layout/       app shell, nav, page header
│   ├── shared/       stat card, empty state, query state, row menu
│   └── …/            one folder per feature
├── lib/
│   ├── supabase/     browser, server and middleware clients
│   ├── hooks/        one React Query module per domain
│   ├── constants.ts  statuses, phases, and the seeded checklist
│   └── types.ts      Database types
└── middleware.ts     session refresh + route protection
```

## Making it yours

- **Colours** — `src/app/globals.css` (tokens) and `tailwind.config.ts`
  (the blush / sage / champagne scales)
- **Fonts** — `src/app/layout.tsx`
- **The seeded checklist and budget split** — `src/lib/constants.ts`
- **Name and metadata** — `src/app/layout.tsx`, and the wordmark in
  `src/components/layout/app-shell.tsx`

## Deploying

Import into Vercel and set the same two environment variables. Note that
Vercel's Hobby plan is for non-commercial use — if you charge for your product,
you need a paid plan.

---

## Two things to know before you build on it

**`src/middleware.ts` must stay inside `src/`.** With the app in `src/app`,
Next.js ignores a root-level `middleware.ts` silently — no error — and route
protection quietly falls back to the layout check while session cookies stop
refreshing.

**Supabase's own key naming differs from this template's.** Supabase's Connect
dialog emits `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; this template reads
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Same value, different variable name.

## Support

Questions about setup are welcome. See `LICENSE.md` for what the licence
covers, and `THIRD-PARTY-NOTICES.md` for the open-source components used.
