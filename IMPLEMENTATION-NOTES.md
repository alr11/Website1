# Venue3 — Implementation Notes

Companion to `venue3-custom.css`. Covers the setup steps, then the work that
**cannot** be done in CSS and has to happen in the Elementor editor or the
media library.

> **Not tested against the live site.** `venue3.co.uk` is blocked by this
> environment's network policy, so the stylesheet has never been run against
> the real DOM. Apply it to a staging copy first and work through the
> verification checklist at the bottom.

---

## Step 1 — Install the stylesheet

Pick one location:

| Where | When to use it |
|---|---|
| **Elementor > Site Settings > Custom CSS** | Best option, needs Elementor Pro |
| **Appearance > Customize > Additional CSS** | Works on every setup |
| Child theme `style.css` | If you already run a child theme |

Do **not** paste it into the parent theme's `style.css` — a theme update
wipes it.

## Step 2 — Add the six hook classes

The stylesheet targets classes you add yourself, rather than Elementor's
auto-generated `.elementor-element-xxxxx` IDs (those change if a widget is
ever rebuilt, which would silently break the styling).

For each section: **Edit Section → Advanced tab → CSS Classes** → type the name.

| Class | Which section |
|---|---|
| `v3-hero` | Top hero with the chandelier photo |
| `v3-gallery` | "OUR SERVICES AND PACKAGES" / Gallery |
| `v3-venue` | "Our Venue" — the four hall cards |
| `v3-contact` | Enquiry form + "It is our privilege..." |
| `v3-testimonials` | "What our Guest and Clients Say" |
| `v3-infobar` | Location / Email / Call Us / Opening times band |

Two optional extras:
- `v3-watermark` on the ghosted "VENUE 3" / "WELCOME TO" hero widget
- `v3-card` on individual hall cards and testimonial widgets, if the
  automatic `.elementor-widget-wrap` targeting doesn't catch them

---

## Step 3 — Editor-side work (CSS can't do these)

### 🔴 P0-1 — The gallery section is an empty void

**This is the most damaging problem on the site and it is almost certainly
a bug, not a styling issue.** Below "Gallery / Enjoy exquisite sets" there
is roughly 400–500px of blank navy with two carousel arrows floating at the
screen edges and nothing between them.

A visitor to a venue-hire site sees an empty black rectangle where the
photos should be. That reads as "broken site."

**Diagnose in this order:**

1. Open the page in Elementor. Does the gallery/carousel widget contain any
   images at all? An empty slider is the most common cause.
2. If images are attached, open browser DevTools → Network → filter Images.
   Look for `404`s — this usually means a broken media path after a site
   migration or a domain change.
3. Check the Console for JS errors. A failing slider library initialises to
   zero height but still renders its arrows, which matches what the
   screenshot shows exactly.
4. If it's a lazy-load conflict (common with WP Rocket / Autoptimize /
   Lite Speed), try excluding the slider from lazy-loading.

**I have deliberately not written CSS to paper over this.** Forcing a height
on an empty container would hide the symptom and leave the site with no
gallery. Fix the cause.

If the images genuinely don't exist yet, remove the section from the page
until they do — an empty section is worse than no section.

### 🔴 P0-2 — Hall cards have empty image areas

Same root cause, most likely. Each of Hall 1 / Hall 2 / Hall 3 / Activity
Classes has a large empty dark box filling the top ~70% of the card with the
text crammed underneath.

Once real photos are in, the stylesheet locks them to a consistent `4:3`
ratio so the four cards can't end up different heights.

If no photos exist for a given hall, delete that card's Image widget
entirely rather than leaving it empty — the card will reflow to text-only
with proper padding.

### 🔴 P0-3 — Add a hero call-to-action

There is currently **no CTA button anywhere in the hero**. The only booking
affordance on the entire page is the small gold pill in the top-right nav,
and then the enquiry form roughly four screens down.

For a venue-hire business this is the primary conversion path, and it's
missing from the highest-attention area of the site.

**Add**, directly beneath the hero subhead:

- **Primary:** "Check Availability" → links to the enquiry form anchor
- **Secondary:** "View Gallery" → add CSS class `v3-btn-ghost` to this one

Both are styled by the stylesheet already (`48px` min height, pill radius,
hover lift). Use an inner Section or a flex Container so they sit
side-by-side on desktop; the mobile breakpoint stacks them full width.

> Flagging per your constraints: this **adds an element** rather than
> restyling one. I've classed it as UX rather than a new feature, but it's
> your call — skip it if you'd rather keep strictly to styling.

### 🟡 P1-4 — Move the hero body copy out of the hero

The hero currently carries five-plus paragraphs of SEO copy running the full
viewport width. The stylesheet constrains the measure to `68ch`, which fixes
readability, but the structural fix is better:

- **Keep in hero:** H1, subhead, the two CTAs
- **Move below:** everything from "Venue3 offers a bright, modern..."
  onwards, into its own section

Also: **"About The Venue"** is currently a heading rendered at body size in
the middle of a paragraph run, so it isn't functioning as a heading at all.
Make it a real `<h2>` widget. This matters for SEO and screen readers, not
just looks.

### 🟡 P1-5 — Section label contradicts its content

The gold badge says **"OUR SERVICES AND PACKAGES"** but sits directly above
a gallery image and the heading "Gallery / Enjoy exquisite sets."

Change the badge text to **"GALLERY"**. If services and packages are meant
to live here, that content is missing entirely and needs writing.

Also: the "Gallery" heading currently sits *below* the image it introduces
— move it above.

### 🟡 P1-6 — Confirm the two fonts

The stylesheet consolidates 3–4 competing typefaces down to two, via
`--v3-font-display` and `--v3-font-text` at the top of the file.

**Set these to fonts already loaded by the theme.** Check under
**Elementor → Site Settings → Global Fonts**. I've guessed at Poppins /
Montserrat with system fallbacks — almost certainly wrong.

Do not add a new Google Font: it's a render-blocking request and adding
dependencies wasn't approved.

### 🟢 P3-7 — Copy fixes

- "What our Guest and Clients Say….." → **"What Our Guests and Clients Say"**
  (plural "Guests"; the ellipsis is five dots)
- Check the nav CTA button label — too small to read in the screenshot,
  looked like it might say "Book Booking"

### 🟢 P3-8 — Logo

The logo sits in a white rounded box that looks pasted onto the transparent
header. Export a transparent-background PNG or SVG and swap it in the
header widget.

---

## Verification checklist

Work through this on staging before going live. The stylesheet is
appearance-only — no element is hidden and no behaviour is altered — but
these are the things worth confirming:

- [ ] **Every nav link still navigates.** The header scrim uses
      `pointer-events: none`, but confirm.
- [ ] **The hero scrim doesn't block clicks.** Same mechanism — if anything
      in the hero becomes unclickable, the `z-index` on `.v3-hero > *` is
      the thing to adjust.
- [ ] **The enquiry form still submits** and delivers email. Field styling
      changed; the form logic did not.
- [ ] **Date and select fields still open their pickers** — these have the
      most theme-specific markup and are the likeliest to need selector
      tweaks.
- [ ] **Both carousels still advance** (gallery and testimonials), via
      arrows and dots.
- [ ] **The WhatsApp button still opens WhatsApp.**
- [ ] **Tab through the whole page** — you should now see a clear gold focus
      ring on every interactive element. This is the biggest accessibility
      win in the set.
- [ ] **Test at 375px, 768px, 1024px, 1440px.** Mobile behaviour could not
      be assessed from the desktop screenshot, so the breakpoints are
      reasoned rather than observed.
- [ ] **Run a contrast checker** over the dark sections. The token values
      were sampled by eye from a screenshot and need confirming with a real
      colour dropper.

## If something looks wrong

Selectors marked `VERIFY` in the stylesheet are the educated guesses at
Elementor's markup, and are where problems will concentrate:

- Elementor Pro **Form** widget classes (`.elementor-field-*`)
- **Header** wrapper class (varies by theme)
- **WhatsApp** plugin class
- Legacy `.elementor-section` vs newer flexbox `.e-con` containers — the
  responsive rules use `.elementor-column`, which newer Elementor versions
  may not emit

Inspect the element, note the real class, and swap it in. All layout values
live in the `:root` token block at the top, so spacing and type can be
retuned globally without hunting through the file.
