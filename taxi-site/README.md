# JF Taxi Service — marketing & booking site

A responsive, multi-page marketing and lead-capture site for a UK private hire
/ airport transfer business. Next.js 14 (App Router), TypeScript, Tailwind CSS.

**Front end only.** There is no backend, no database and no payment processing.
The price estimator runs entirely in the browser, and the booking form posts to
a deliberately un-wired placeholder endpoint.

---

## Running it

```bash
cd taxi-site
npm install
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |

> This project lives in the `taxi-site/` subdirectory. The repository root holds
> a separate, unrelated app, which has been left untouched.

---

## Editing the site

**Everything you will want to change lives in one file: `src/lib/siteConfig.ts`.**

Business name, phone, WhatsApp, email, services, rate tables, surcharges,
testimonials, service area, licensing details and image paths are all defined
there and read by the components. You should not need to touch a page or a
component to change copy or pricing.

The site ships with a complete set of worked **example** values, so it reads as
a finished business rather than a wireframe. Everything commented `EXAMPLE` is
safe to publish but is not real, and must be replaced before launch:

| Field | Currently | Note |
| --- | --- | --- |
| `contact.phone` | `01793 274 574` | Randomly generated — see below |
| `contact.whatsapp` | `07700 900 123` | Ofcom's reserved drama range |
| `contact.email` | `bookings@jftaxiservice.co.uk` | Domain is not registered yet |
| `business.licenceNumber` | `PHO/2019/0847` | Invented |
| `social.rating` / `.reviewCount` | 4.9 from 187 | Invented |
| `social.reviewsUrl` | `g.page/r/YOUR-PLACE-ID/review` | Template — paste your real link |
| `about.founder` / `.story` | James Fielding | Invented |
| `testimonials` | 3 quotes | **Invented — see the warning below** |
| `pricing.*` | Full rate table | Plausible but invented |

**Phone numbers.** The landline is a randomly generated `01793` Swindon number,
picked so the demo reads with the right dialling code. It has **not** been
checked against Ofcom's allocations and may belong to a real subscriber, so
replace it with your own number before publishing or sharing the site. The
mobile (`07700 900 123`) is from Ofcom's range reserved for drama and
documentation and is never allocated to anyone.

> **The three testimonials are invented.** They were written to fill the layout.
> Publishing invented reviews as genuine customer feedback breaches the CMA's
> rules on fake consumer reviews, so replace them with real, attributable
> reviews — or delete the section — before the site goes live. The same applies
> to the 4.9 / 187 rating figures in the trust bar.

### Images

Every file in `public/images/` is a labelled placeholder. Drop your real
photographs in using the **same filenames** and nothing else needs changing —
see `public/images/README.md` for the list and suggested sizes. No stock
photography has been fetched or generated.

---

## Pages

| Route | Contents |
| --- | --- |
| `/` | Full-bleed dark hero, "Get a quote" + phone CTA, trust bar, four service cards, fleet section, testimonials, footer CTA |
| `/services` | One detailed section per service with bullet points and a request-a-quote link |
| `/pricing` | Client-side price estimator, published rate tables, surcharge cards |
| `/about` | Founder story, licensing/insurance badges, service area |
| `/contact` | Urgent-booking phone CTA above a booking form, plus direct contact details |

---

## The price estimator

`src/lib/estimate.ts` + `src/components/quote-estimator.tsx`.

All arithmetic happens in the browser against the rate table in `siteConfig`.
No pricing API is called, and no payment is ever taken. The order of
operations is:

1. **Base fare** — a fixed price for a named airport or local route, or
   `miles × perMile` (floored at `minimumFare`) for anywhere else.
2. **Vehicle multiplier** — from `pricing.vehicleTypes`.
3. **Surcharges** — night rate for pick-ups between 22:00 and 06:00, weekend
   rate for Saturday and Sunday, each applied to the vehicle-adjusted fare.
4. **Return leg** — the one-way fare again, less `returnDiscount`.
5. **Booking fee** — added once.

Choosing "Book this journey" carries the destination, date, time, vehicle and
estimate across to `/contact` as query parameters, which prefill the form.

Every quote is shown alongside `pricing.disclaimer`, which states plainly that
the figure is indicative and confirmed manually.

---

## Wiring up the booking form

`src/app/api/contact/route.ts` **validates a submission and returns success,
but delivers it nowhere.** Nothing is stored, emailed or forwarded.

The file's header comment contains ready-to-paste snippets for the two usual
options — **Formspree** and **Resend**. Both are third-party services with paid
tiers, so neither has been installed or configured; add whichever you choose,
put its key in `.env.local` (never in git), and replace the body of `POST()`.

Before going live you should also add a spam guard (honeypot or Turnstile), a
rate limit, and server-side logging of delivery failures.

---

## Design system

- **Palette** — near-black (`ink`) plus a single gold accent (`gold`), on a warm
  off-white (`bone`). One accent colour only; use gold tints rather than
  introducing a second hue.
- **Type** — Playfair Display for headings, Inter for body, both via
  `next/font` with fluid `clamp()` sizes (`text-display-xl/lg/md`).
- **Layout** — dark hero on every page, light and scannable below the fold on
  the everyday pages.
- **Mobile** — single-column stacked sections, 44px+ tap targets, a sticky
  header with a persistent call button, and a fixed click-to-call bar with a
  WhatsApp shortcut.

## Accessibility

Semantic landmarks and headings, a skip link, visible focus rings, labelled
form controls with `aria-describedby` hints, live regions on the estimate and
form status, and alt text on every image.

Audited with axe-core (WCAG 2.1 A + AA) at 1440px and 390px:
**0 violations across all five pages and the 404**, with no horizontal overflow
and no console errors.
