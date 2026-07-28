/**
 * Build a site URL that respects the configured `base` path.
 *
 * The site is hosted on GitHub Pages under /Website1/, so a hard-coded
 * href="/contact" would 404. Astro exposes the configured base as
 * import.meta.env.BASE_URL; everything internal must go through here.
 *
 *   base "/"          ->  url('/contact') === '/contact'
 *   base "/Website1/" ->  url('/contact') === '/Website1/contact'
 *
 * If the site later moves to a root domain, set `base` back to '/' in
 * astro.config.mjs and every link follows automatically.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
