# Nashwyn Art — Event Decor Hire

Marketing site for an event decoration hire business. Static, fast, and free to host.

---

## Run it

```bash
npm install
npm start
```

Then open **http://localhost:4321**.

| Command | What it does |
|---|---|
| `npm start` (or `npm run dev`) | Local dev server with live reload |
| `npm run build` | Builds the static site into `dist/` |
| `npm run preview` | Serves the built `dist/` to check before deploying |

## Stack

**[Astro](https://astro.build) 7** — builds to plain HTML/CSS/JS with no
server and almost no JavaScript shipped to the browser, so it hosts free on
Netlify, Cloudflare Pages, GitHub Pages or any static host, loads fast on
mobile, and needs no database or CMS to keep running.

---

## What still needs filling in

Everything unfinished appears on the page as an obvious
<code>[PLACEHOLDER]</code> in a dashed red box, so nothing incorrect can go
live by accident. Nothing below was invented or guessed.

### 1. `src/data/site.ts` — business details

- `phone` and `phoneHref` — `phoneHref` is digits only, for the tap-to-call link
- `email`
- `address` — all four lines (or delete the block if you'd rather not publish an address)
- `hours` — the three `[OPENING HOURS]` values
- `social` — Facebook and TikTok URLs (Instagram is already set; delete lines you don't use)
- `formEndpoint` — see *Connecting the contact form* below
- `trustedBy` — **only if you have real logos.** Empty by default, and the whole
  section stays hidden while it's empty. No awards or press mentions have been invented.

### 2. `src/data/packages.ts` — prices and inclusions

For each of the 17 packages:

- `price` — currently `[PRICE]`
- `hirePeriod` — currently `[HIRE PERIOD]`
- `includes` — the `[INCLUDED ITEM]` bullets

Descriptions are written as safe generic starter copy — **read them through and
make them yours**; they describe a typical decor hire service, not necessarily
exactly what you offer.

### 3. `src/pages/price-list.astro` — terms

Near the bottom, in the "Good to know" list:

- `[TRAVEL CHARGE POLICY]`
- `[DEPOSIT AMOUNT / PERCENTAGE]`
- `[BALANCE DUE TERMS]`
- `[CANCELLATION POLICY]`
- `[DAMAGE / DEPOSIT TERMS]`

### 4. `astro.config.mjs`

Set `site` to your real domain once you have one (used for canonical URLs and
social share links).

### 5. Photos

See **[`public/images/README.md`](public/images/README.md)** for the exact
filenames. Short version:

```
public/images/logo.png                              your logo, square
public/images/favicon.png                           browser tab icon
public/images/hero.jpg                              homepage banner (16:9)
public/images/og-image.jpg                          social share preview
public/images/categories/<category-slug>.jpg        one per category (4:3)
public/images/packages/<package-slug>-1.jpg         -2, -3 … (4:3)
public/images/logos/<logo-name>.png                 only if you have real ones
```

Every image not yet supplied renders as a dashed box **printing the filename it
expects**, so you can browse the site and see exactly what to upload. No images
are fetched from Instagram or any other external source.

---

## Connecting the contact form

The form is deliberately backend-agnostic. Right now it validates properly but
**cannot send** — and it says so plainly rather than faking a confirmation.

To switch it on, set `formEndpoint` in `src/data/site.ts` to any URL that
accepts a JSON `POST`:

```ts
formEndpoint: 'https://formspree.io/f/xxxxxxx',
```

Works with Formspree, Basin, Netlify Forms (via their endpoint), or your own
API route. The form POSTs JSON with the keys `name`, `email`, `phone`,
`eventDate`, `interest` and `message`. Once set, the red setup notice under the
form disappears on its own.

The form also has a hidden honeypot field to absorb basic spam bots.

---

## Adding or changing packages

Everything is driven by `src/data/packages.ts`. Add an object to the `packages`
array with a unique `slug` and an existing `category` slug, and you
automatically get:

- its own page at `/<category>/<slug>`
- a card on the category page
- a row on the price list
- an entry in the contact form's dropdown

Add a `Category` to the `categories` array and you get a homepage tile, a
category page, a nav item and a price-list section. No other file to touch.

---

## Structure

```
astro.config.mjs
public/
  robots.txt
  images/            ← your uploads go here (see its README)
src/
  data/
    site.ts          ← business details        ✏️ edit me
    packages.ts      ← categories & prices     ✏️ edit me
  layouts/
    BaseLayout.astro
  components/
    Header.astro         nav + mobile menu
    Footer.astro         address, hours, socials
    SmartImage.astro     real image, or a placeholder naming the missing file
    Value.astro          highlights unfilled [PLACEHOLDER] values
    CategoryTile.astro
    PackageCard.astro
    TrustedBy.astro      renders nothing unless you add real logos
    ContactForm.astro
  pages/
    index.astro                  /
    price-list.astro             /price-list
    contact.astro                /contact
    404.astro
    [category]/index.astro       /wedding-packages, /party-hire, …
    [category]/[pkg].astro       /wedding-packages/classic-wedding-package, …
  styles/
    global.css       ← colours & fonts live in :root at the top
```

## Re-skinning

All colours and fonts are CSS custom properties in the `:root` block at the top
of `src/styles/global.css`. The palette is drawn from the logo (deep navy +
teal); change the values there and the whole site follows.

The display font (Cormorant Garamond) loads from Google Fonts in
`src/layouts/BaseLayout.astro`. To avoid the third-party request, delete those
three `<link>` tags — the site falls back to Georgia and still looks fine — or
self-host the font file.

---

## Deploying

`npm run build` produces a plain static `dist/` folder. Upload it anywhere, or
point Netlify / Cloudflare Pages / Vercel at the repo with:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Nothing is deployed yet — that's your call.
