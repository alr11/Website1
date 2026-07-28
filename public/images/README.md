# Where to put your photos

Drop your files straight into this folder using the **exact filenames** below.
Nothing else needs changing — the site picks them up automatically on the next
build. Any file you haven't added yet shows a dashed placeholder box **printing
the filename it wants**, so you can walk the site and see exactly what's missing.

No images are fetched from Instagram or anywhere else. Every real photo on this
site comes from a file you put here.

---

## Naming rules

- **All lowercase**, words separated by hyphens. `flower-wall-1.jpg`, not
  `Flower Wall 1.JPG`.
- Photos: `.jpg`. Logos: `.png` (transparent background).
- Resize before uploading — see sizes below. Straight-from-phone photos are
  ~5 MB each and will make the site slow.

---

## 1. Branding — `/public/images/`

| Filename | What it is | Suggested size |
|---|---|---|
| `logo.png` | Your logo, square, transparent background | 400 × 400 px |
| `favicon.png` | Browser tab icon (can be the logo, cropped square) | 64 × 64 px |
| `hero.jpg` | Big homepage banner photo — pick your strongest wide shot | 2000 × 1125 px (16:9) |
| `og-image.jpg` | Preview image when the site is shared on WhatsApp/Facebook | 1200 × 630 px |

> **Hero tip:** text sits over the bottom-left of this image, so choose a photo
> that isn't busy in that corner.

## 2. Category tiles — `/public/images/categories/`

One photo per category, landscape (4:3), **1200 × 900 px**:

```
wedding-packages.jpg
party-hire.jpg
baby-showers.jpg
venue-packages.jpg
add-on-rentals.jpg
```

## 3. Package photos — `/public/images/packages/`

Pattern: **`<package-slug>-<number>.jpg`**, starting at `1`.
`-1` is the main photo (used on cards and at the top of the page).

Landscape, **1600 × 1200 px** (4:3).

```
wedding-packages/
  classic-wedding-package-1.jpg   -2.jpg   -3.jpg
  luxe-wedding-package-1.jpg      -2.jpg   -3.jpg
  ceremony-backdrop-1.jpg         -2.jpg   -3.jpg
  top-table-styling-1.jpg         -2.jpg

party-hire/
  birthday-party-package-1.jpg    -2.jpg   -3.jpg
  balloon-arch-garland-1.jpg      -2.jpg   -3.jpg
  kids-party-package-1.jpg        -2.jpg

baby-showers/
  baby-shower-package-1.jpg       -2.jpg   -3.jpg
  gender-reveal-package-1.jpg     -2.jpg
  christening-package-1.jpg       -2.jpg   -3.jpg

venue-packages/
  full-venue-styling-1.jpg        -2.jpg   -3.jpg
  entrance-walkway-1.jpg          -2.jpg   -3.jpg
  table-centrepieces-1.jpg        -2.jpg

add-on-rentals/
  dry-ice-machine-1.jpg           -2.jpg
  flower-wall-1.jpg               -2.jpg
  led-light-up-letters-1.jpg      -2.jpg
  plinths-and-easels-1.jpg        -2.jpg
```

⚠️ **All of these go flat into `/public/images/packages/`** — the headings above
are just grouping for readability, not subfolders.

**Want more or fewer photos for a package?** Change its `photoCount` in
`src/data/packages.ts` and add/remove numbered files to match.

## 4. "Trusted by" logos — `/public/images/logos/`

**Only if you actually have them.** This strip is switched off by default and
the section does not appear at all — no invented awards or press mentions.

To turn it on: put the logo PNGs here, then add an entry per logo to
`trustedBy` in `src/data/site.ts`:

```ts
trustedBy: [
  { file: 'the-venue.png', name: 'The Venue', url: 'https://thevenue.example' },
],
```

Transparent PNG, roughly **300 × 200 px**.

---

## Before you upload — quick checklist

- [ ] Resized (nothing over ~500 KB per photo)
- [ ] Filename is lowercase with hyphens, and matches the list exactly
- [ ] You own the photo or have permission to use it
- [ ] No customer faces without their say-so
