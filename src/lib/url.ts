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

/**
 * Inverse of `url()` — strip the base prefix off a pathname so it can be
 * compared against the plain hrefs used in nav definitions.
 *
 *   base "/Website1/" ->  stripBase('/Website1/price-list') === '/price-list'
 *   base "/Website1/" ->  stripBase('/Website1')            === '/'
 *
 * Without this the nav's "current page" highlight silently stops matching the
 * moment a base path is configured.
 */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  let p = pathname;
  if (base && (p === base || p.startsWith(base + '/'))) {
    p = p.slice(base.length);
  }
  p = p.replace(/\/+$/, '');
  return p || '/';
}
