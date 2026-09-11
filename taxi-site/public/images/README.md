# /public/images

The `TODO-` files here are **placeholders**. Replace each one with a real photograph,
keeping the filename identical — the site reads these paths from
`src/lib/siteConfig.ts` (the `images` block) and needs no code change.

| File | What it should be | Suggested size |
| --- | --- | --- |
| **`quickride-mark.png`** | ✅ In use as the site logo. The roundel, cropped square from the card and masked onto the brand navy. | 512×512 |
| `quickride-logo.png` | The full business card as uploaded (1659×948). **Despite the `.png` name this file is a JPEG** — harmless here, but rename it `.jpg` if you reuse it elsewhere. Not referenced by the site: it is a wide card, not a logo. | — |
| ~~`Logo.png`~~, ~~`TODO-logo.svg`~~ | Superseded — the old JF Taxi Service logo. Not referenced. Safe to delete. | — |
| ~~`TODO-hero-night-road.svg`~~ | Currently reuses `caddy-front.jpg` behind the hero scrim. Swap in a wide, dark shot of the car on the road when you have one. | 1600×900+ |
| ~~`TODO-caddy-vw-front-three-quarter.svg`~~ → **`caddy-front.jpg`** | ✅ Supplied (1280×922). | 1280×860+ |
| ~~`TODO-caddy-vw-rear.svg`~~ | Still needed. Until then `fleetAlt` reuses `caddy-front.jpg`, so the Services page shows the same photo four times. | 1280×860+ |
| `TODO-driver-portrait.svg` | Owner/driver beside the car, for the About page | 1000×1250+ |
| `TODO-service-area-map.svg` | Static map of the Wiltshire service area | 1200×800+ |

If you swap the file extension (e.g. `.svg` → `.jpg`), update the matching
path in `siteConfig.images` as well.

No stock photography has been fetched or generated for this project.
