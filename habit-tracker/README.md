# Tally Habits

A private habit tracker for iPhone and Android. It's a Progressive Web App
(PWA): one set of plain HTML/CSS/JS files that installs to the home screen,
opens full screen like a native app, and works offline. There's no build step,
no account and no server. Data stays on the device.

## Features

- Check off today's habits with one tap. A ring shows how much of today is done.
- Each habit shows its last 7 days. Tap any day to fix a missed entry.
- Schedules: every day, weekdays, or any set of days. Days off don't break a streak.
- Current streak, best streak and 30-day completion rate per habit.
- A 16-week history grid per habit on the Stats tab.
- Add, edit and delete habits (delete has an undo).
- Export and import a JSON backup to move your data to another phone.
- Light and dark mode follow the phone's setting.

## Put it on your phone

The app has to be served over HTTPS to install. The easiest option is GitHub Pages:

1. Merge this into `main`.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The `Deploy habit tracker to GitHub Pages` workflow publishes the
   `habit-tracker/` folder to `https://<your-username>.github.io/<repo>/`.

Netlify, Vercel or Cloudflare Pages also work: drag the `habit-tracker/` folder
in, or point them at it with no build command.

Then open the URL on the phone:

- **iPhone (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** ⋮ menu → **Install app** / **Add to Home screen**, or use
  the **Install app** button under Settings in the app.

## Run locally

```bash
cd habit-tracker
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles and script |
| `manifest.webmanifest` | App name, icons and colours for installing |
| `sw.js` | Service worker that caches the app for offline use |
| `icons/` | Home-screen icons (PNG for iOS/Android, SVG source) |

When you change `index.html`, bump `VERSION` in `sw.js` so installed copies
pick up the new files.

## Limits

- Data lives in the browser storage of each device. It doesn't sync between
  phones. Use Export/Import to move it.
- On iPhone, deleting the home-screen app also deletes its data. Export a
  backup first.
- No reminders yet. Push notifications on iOS need a server to send them.
