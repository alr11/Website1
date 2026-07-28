import { defineConfig } from 'astro/config';

// Static output — builds to plain HTML/CSS/JS in ./dist, which can be hosted
// for free on Netlify, Cloudflare Pages, GitHub Pages, Vercel, or any web host.
// Set `site` to the real domain once you have one (used for canonical URLs).
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
