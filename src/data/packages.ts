/**
 * ---------------------------------------------------------------------------
 * CATEGORIES & PACKAGES
 * ---------------------------------------------------------------------------
 * This single file drives:
 *   - the category tiles on the homepage
 *   - the category pages          (/wedding-packages, /party-hire, …)
 *   - every individual package page (/wedding-packages/classic-wedding, …)
 *   - the full Price List page
 *
 * PRICES ARE NOT INVENTED. Every `price` is the literal string "[PRICE]" until
 * you replace it. Same for `hirePeriod` and the "what's included" bullets —
 * these commit you to specifics, so they are left as visible placeholders.
 *
 * Descriptions are generic starter copy: safe to publish, but read them
 * through and make them yours.
 *
 * ADDING A PACKAGE: add an object to `packages` with a unique `slug` and an
 * existing `category` slug. Its page, its card and its price-list row are all
 * generated automatically — no other file to touch.
 */

export interface Category {
  slug: string;
  title: string;
  /** One line, used on the homepage tile. */
  tagline: string;
  /** Short paragraph at the top of the category page. */
  intro: string;
}

export interface Package {
  slug: string;
  /** Must match a Category slug. */
  category: string;
  title: string;
  /** One line, used on cards and in the price list. */
  summary: string;
  /** Paragraphs for the package page. */
  description: string[];
  /** Bullet list — replace the placeholders with what you actually supply. */
  includes: string[];
  /** Leave as "[PRICE]" until confirmed. */
  price: string;
  /** e.g. "[HIRE PERIOD]" → "Full day hire", "24 hours", … */
  hirePeriod: string;
  /**
   * How many photos this package shows. Files are expected at
   *   /public/images/packages/<slug>-1.jpg, -2.jpg, -3.jpg …
   */
  photoCount: number;
}

export const categories: Category[] = [
  {
    slug: 'wedding-packages',
    title: 'Wedding Packages',
    tagline: 'Ceremony and reception styling, dressed start to finish.',
    intro:
      'Complete styling for your ceremony and reception, from the aisle to the top table. Every package is set up and collected by us, so there is nothing for you or your venue to handle on the day.',
  },
  {
    slug: 'party-hire',
    title: 'Party Hire',
    tagline: 'Birthdays, anniversaries and celebrations of every size.',
    intro:
      'Balloon displays, backdrops and table styling for birthdays, anniversaries and any celebration that deserves a proper setup. Colour schemes are matched to your theme.',
  },
  {
    slug: 'baby-showers',
    title: 'Baby Showers & Christenings',
    tagline: 'Soft, welcoming setups for the newest arrivals.',
    intro:
      'Gentle, photograph-ready styling for baby showers, gender reveals, naming ceremonies and christenings — including personalised signage in your chosen colours.',
  },
  {
    slug: 'venue-packages',
    title: 'Venue Packages',
    tagline: 'Full-room transformations, walls to walkway.',
    intro:
      'Whole-venue styling for halls, marquees and function rooms. Drapes, entrance walkways, lighting and floral installations, installed as one coordinated scheme.',
  },
  {
    slug: 'add-on-rentals',
    title: 'Add-On Rentals',
    tagline: 'Individual pieces to add to any package.',
    intro:
      'Standalone hire items you can add to any package, or book on their own. Availability is per-date, so please check when enquiring.',
  },
];

/** Placeholder bullets — replace with what each package actually includes. */
const TBC_INCLUDES = [
  '[INCLUDED ITEM — e.g. what is supplied, and how many]',
  '[INCLUDED ITEM]',
  '[INCLUDED ITEM]',
  '[Delivery, setup and collection — confirm what is covered]',
];

export const packages: Package[] = [
  // ---------------------------------------------------------------- WEDDINGS
  {
    slug: 'classic-wedding-package',
    category: 'wedding-packages',
    title: 'Classic Wedding Package',
    summary: 'Ceremony backdrop, aisle styling and top table dressing.',
    description: [
      'Our core wedding package covers the three areas guests photograph most: the ceremony backdrop, the aisle, and the top table. Colours, florals and fabrics are chosen with you beforehand so everything reads as one scheme rather than separate pieces.',
      'We deliver, install and collect. Setup is arranged directly with your venue around their access times, so you do not have to coordinate between us.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'luxe-wedding-package',
    category: 'wedding-packages',
    title: 'Luxe Wedding Package',
    summary: 'Our fullest wedding setup, including entrance and reception.',
    description: [
      'The Luxe package extends the Classic setup across the whole day — a styled entrance for guest arrival, the ceremony backdrop, aisle and top table, plus reception details such as centrepieces and a cake table.',
      'Best suited to larger venues and marquees where the space benefits from a consistent look in every room.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'ceremony-backdrop',
    category: 'wedding-packages',
    title: 'Ceremony Backdrop',
    summary: 'A single statement backdrop for vows and photographs.',
    description: [
      'A standalone backdrop for the ceremony itself — arch or panel, dressed with florals and drapery in your colours. A good option if your venue already provides the rest of the styling.',
      'Available in several shapes and finishes; we will talk through what suits your space and ceiling height.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'top-table-styling',
    category: 'wedding-packages',
    title: 'Top Table Styling',
    summary: 'Dressed top table with linens, florals and detailing.',
    description: [
      'Styling for the top table and its immediate surroundings — linen, florals, candles and any personalised detailing you would like included.',
      'Can be booked on its own or added to any other wedding package.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },

  // ------------------------------------------------------------- PARTY HIRE
  {
    slug: 'birthday-party-package',
    category: 'party-hire',
    title: 'Birthday Party Package',
    summary: 'Backdrop, balloon display and styled table for the guest of honour.',
    description: [
      'A complete birthday setup built around a backdrop and balloon display, with a styled table for the cake and gifts. Colours are matched to your theme and any personalised signage is prepared in advance.',
      'Suits milestone birthdays, sweet sixteens and adult celebrations alike — the scale is adjusted to your room.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'balloon-arch-garland',
    category: 'party-hire',
    title: 'Balloon Arch & Garland',
    summary: 'Organic balloon garlands and arches in your colour scheme.',
    description: [
      'Hand-built balloon garlands and arches in the colours and finish you choose — matte, chrome, confetti or a blend. Sized to your doorway, backdrop or table run.',
      'Installed on site on the day. We can add florals, foliage or lighting to the garland if you would like more texture.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'kids-party-package',
    category: 'party-hire',
    title: "Children's Party Package",
    summary: 'Bright, hard-wearing setups built for younger guests.',
    description: [
      'A themed setup designed around younger guests — backdrop, balloons and a styled table, using arrangements that stand up to a busy room.',
      'Tell us the theme and we will build the colour scheme around it.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },

  // ----------------------------------------------------------- BABY SHOWERS
  {
    slug: 'baby-shower-package',
    category: 'baby-showers',
    title: 'Baby Shower Package',
    summary: 'Soft-toned backdrop, balloons and a styled gift table.',
    description: [
      'A calm, photograph-ready setup for a baby shower: backdrop, balloon display in soft tones, and a styled table for cake, gifts and games.',
      'Personalised signage with the family name or the baby’s name can be included — just let us know the wording when you book.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'gender-reveal-package',
    category: 'baby-showers',
    title: 'Gender Reveal Package',
    summary: 'A styled setup built around the reveal moment.',
    description: [
      'Styling arranged around the reveal itself, so the moment photographs and films well — neutral-toned backdrop and display beforehand, with the colour element kept back until it matters.',
      'We will confirm the reveal method and timings with you in advance.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
  {
    slug: 'christening-package',
    category: 'baby-showers',
    title: 'Christening & Naming Package',
    summary: 'Personalised backdrop and table styling for the celebration.',
    description: [
      'Styling for the celebration after the service — a personalised backdrop with the child’s name, balloon and floral detailing, and a dressed table for the cake.',
      'Signage is made to order, so please allow lead time when enquiring.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },

  // ---------------------------------------------------------- VENUE PACKAGES
  {
    slug: 'full-venue-styling',
    category: 'venue-packages',
    title: 'Full Venue Styling',
    summary: 'Whole-room transformation for halls and marquees.',
    description: [
      'A complete scheme for the whole room — wall drapes, backdrop, table styling and floral installations planned together so the space reads as one design.',
      'We will visit or review photographs and dimensions of your venue beforehand to confirm what will fit and how long installation will take.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'entrance-walkway',
    category: 'venue-packages',
    title: 'Entrance & Walkway',
    summary: 'A dressed entrance that sets the tone as guests arrive.',
    description: [
      'Draped entrance framing with floral detailing, lanterns and an optional walkway runner — the first thing guests see and one of the most photographed parts of the day.',
      'Built to your doorway dimensions, so please have measurements to hand when you enquire.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 3,
  },
  {
    slug: 'table-centrepieces',
    category: 'venue-packages',
    title: 'Table Centrepieces',
    summary: 'Coordinated centrepieces across all guest tables.',
    description: [
      'Centrepieces for guest tables, supplied and placed as a set so every table matches. Choose from tall or low arrangements depending on your room and sightlines.',
      'Priced per table — tell us your table count when enquiring.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },

  // --------------------------------------------------------- ADD-ON RENTALS
  {
    slug: 'dry-ice-machine',
    category: 'add-on-rentals',
    title: 'Dry Ice / Dry Fog Machine',
    summary: 'Low-lying cloud effect for first dances and entrances.',
    description: [
      'A dry ice machine producing a low, ground-hugging fog — the effect used for first dances, grand entrances and cake cutting. It sits low rather than filling the room, so it does not affect visibility or set off smoke alarms in the way a standard smoke machine can.',
      'Supplied operated by us. Please confirm with your venue that the effect is permitted before booking, and let us know how many uses you need across the event.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
  {
    slug: 'flower-wall',
    category: 'add-on-rentals',
    title: 'Flower Wall',
    summary: 'A full floral panel for photographs and backdrops.',
    description: [
      'A free-standing floral wall used as a photo backdrop or behind a top table. Available in several colourways.',
      'Can be combined with signage or neon lettering.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
  {
    slug: 'led-light-up-letters',
    category: 'add-on-rentals',
    title: 'LED Light-Up Letters',
    summary: 'Illuminated letters and numbers, delivered and set up.',
    description: [
      'Free-standing illuminated letters and numbers — initials, "LOVE", milestone ages and similar. Delivered, positioned and collected by us.',
      'Let us know the characters you need and we will confirm availability for your date.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
  {
    slug: 'uplighting',
    category: 'add-on-rentals',
    title: 'Uplighting',
    summary: 'Coloured wash lighting to set the tone of the room.',
    description: [
      'Wireless uplighters placed around the room, washing the walls and backdrop in a colour of your choosing. It changes the feel of a plain function room more than almost anything else for the money, and it photographs well.',
      'Colours are matched to your scheme. Let us know your room size and we will advise on how many units it needs.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
  {
    slug: 'plinths-and-easels',
    category: 'add-on-rentals',
    title: 'Plinths, Easels & Signage Stands',
    summary: 'Display pieces for welcome signs, cakes and table plans.',
    description: [
      'Plinths, easels and stands for welcome signage, table plans, cakes and gift displays. Hired individually or as a set.',
      'Sign artwork can be produced to order — ask when enquiring.',
    ],
    includes: TBC_INCLUDES,
    price: '[PRICE]',
    hirePeriod: '[HIRE PERIOD]',
    photoCount: 2,
  },
];

// ---------------------------------------------------------------- helpers

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function packagesIn(categorySlug: string): Package[] {
  return packages.filter((p) => p.category === categorySlug);
}

/** Photo paths for a package, following the documented naming convention. */
export function packagePhotos(pkg: Package): string[] {
  return Array.from(
    { length: pkg.photoCount },
    (_, i) => `/images/packages/${pkg.slug}-${i + 1}.jpg`,
  );
}

export function packageUrl(pkg: Package): string {
  return `/${pkg.category}/${pkg.slug}`;
}
