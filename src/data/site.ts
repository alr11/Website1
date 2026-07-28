/**
 * ---------------------------------------------------------------------------
 * SITE-WIDE BUSINESS DETAILS
 * ---------------------------------------------------------------------------
 * This is the ONLY file you need to edit for business info. Everything in
 * square brackets — [LIKE THIS] — is a placeholder that still needs your real
 * details. Nothing here is invented: anything not supplied is left as a
 * visible placeholder so it can't accidentally go live as fact.
 */

export interface TrustedLogo {
  /** Filename inside /public/images/logos/ — e.g. "some-venue.png" */
  file: string;
  /** Accessible name for the logo, e.g. "Some Venue" */
  name: string;
  /** Optional link out */
  url?: string;
}

export const site = {
  /** Business name — taken from your own branding. */
  name: 'Nashwyn Art',
  /** Short descriptor shown next to the name. */
  descriptor: 'Event Decor',
  /** Used in the <title> tag of every page. */
  titleSuffix: 'Nashwyn Art | Event Decor',

  /** Where you cover. Shown on the homepage, footer and contact page. */
  serviceArea: 'Swindon & surrounding areas',
  serviceAreaLong:
    'Swindon and the surrounding Wiltshire, Gloucestershire and Oxfordshire areas',

  /**
   * CONTACT — fill these in. The phone/email placeholders are rendered
   * literally on the page until you replace them, so they are hard to miss.
   */
  phone: '[PHONE NUMBER]',
  /** Digits only, no spaces — used for the tel: link. Leave as-is until set. */
  phoneHref: '[PHONE NUMBER]',
  email: '[EMAIL ADDRESS]',

  /** ADDRESS — set to null if you do not want a public address listed. */
  address: {
    line1: '[ADDRESS LINE 1]',
    line2: '[ADDRESS LINE 2]',
    town: '[TOWN]',
    postcode: '[POSTCODE]',
  },

  /** OPENING HOURS — replace the times with your real hours. */
  hours: [
    { days: 'Monday – Friday', time: '[OPENING HOURS]' },
    { days: 'Saturday', time: '[OPENING HOURS]' },
    { days: 'Sunday', time: '[OPENING HOURS]' },
  ],

  /**
   * SOCIAL LINKS. Remove any line you don't use — the footer only renders
   * the ones present here.
   */
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/nashwynart/' },
    { name: 'Facebook', url: '[FACEBOOK URL]' },
    { name: 'TikTok', url: '[TIKTOK URL]' },
  ],

  /**
   * CONTACT FORM ENDPOINT — intentionally backend-agnostic.
   * Leave as an empty string and the form will validate but tell the visitor
   * to call or email instead (it will never pretend a message was sent).
   * Paste in a form-handler URL (Formspree, Netlify Forms, Basin, your own
   * API route, etc.) and the form will POST to it as JSON.
   */
  formEndpoint: '',

  /**
   * "TRUSTED BY" LOGO STRIP.
   * Deliberately EMPTY. The section does not render at all while this array is
   * empty — no invented awards, press mentions or partner logos.
   * To switch it on: drop logo files into /public/images/logos/ and add an
   * entry per logo, e.g.
   *   { file: 'the-venue.png', name: 'The Venue', url: 'https://…' }
   */
  trustedBy: [] as TrustedLogo[],
};

/** True when a value is still an unfilled [PLACEHOLDER]. */
export function isPlaceholder(value: string): boolean {
  return /^\[.*\]$/.test(value.trim());
}

/** Full address on one line, skipping any unfilled parts. */
export function addressLine(): string {
  return [
    site.address.line1,
    site.address.line2,
    site.address.town,
    site.address.postcode,
  ]
    .filter(Boolean)
    .join(', ');
}

/** Social links that have a real URL (not a placeholder). */
export function activeSocials() {
  return site.social.filter((s) => !isPlaceholder(s.url));
}
