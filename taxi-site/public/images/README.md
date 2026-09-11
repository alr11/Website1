# /public/images

The `TODO-` files here are **placeholders**. Replace each one with a real photograph,
keeping the filename identical — the site reads these paths from
`src/lib/siteConfig.ts` (the `images` block) and needs no code change.

| File | What it should be | Suggested size |
| --- | --- | --- |
| **`TODO-quickride-logo.svg`** | ⚠️ Stand-in drawn from the business card. Upload the real artwork as `quickride-logo.png` and point `siteConfig.images.logo` at it. | square, 512px+ |
| ~~`Logo.png`~~ | Superseded — the old JF Taxi Service logo, no longer referenced. Safe to delete. | — |
| ~~`TODO-hero-night-road.svg`~~ | Currently reuses `caddy-front.jpg` behind the hero scrim. Swap in a wide, dark shot of the car on the road when you have one. | 1600×900+ |
| ~~`TODO-caddy-vw-front-three-quarter.svg`~~ → **`caddy-front.jpg`** | ✅ Supplied (1280×922). | 1280×860+ |
| ~~`TODO-caddy-vw-rear.svg`~~ | Still needed. Until then `fleetAlt` reuses `caddy-front.jpg`, so the Services page shows the same photo four times. | 1280×860+ |
| `TODO-driver-portrait.svg` | Owner/driver beside the car, for the About page | 1000×1250+ |
| `TODO-service-area-map.svg` | Static map of the Wiltshire service area | 1200×800+ |

If you swap the file extension (e.g. `.svg` → `.jpg`), update the matching
path in `siteConfig.images` as well.

No stock photography has been fetched or generated for this project.
