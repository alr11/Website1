import { defineConfig } from 'astro/config';

// Static output — builds to plain HTML/CSS/JS in ./dist, hosted free on
// GitHub Pages via .github/workflows/deploy.yml.
//
// MOVING TO YOUR OWN DOMAIN LATER
// -------------------------------
// 1. set `site` to the domain, e.g. 'https://nashwynart.co.uk'
// 2. set `base` to '/'
// Every internal link goes through src/lib/url.ts, so they all follow
// automatically — no other file needs touching.
export default defineConfig({
  site: 'https://alr11.github.io',
  base: '/Website1',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
