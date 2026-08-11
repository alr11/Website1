# Everly — iOS & Android app

The native version of the Everly wedding planner, built with Expo (React
Native) against **the same Supabase project as the web app**. Sign in on the
web, and the same guest list, budget, checklist and vendors appear on the
phone — it is one database, not a copy.

## What's shared with the web app, and what isn't

| Shared, unchanged | Rewritten for native |
| --- | --- |
| Supabase schema and RLS policies | Every screen and component |
| `types.ts`, `constants.ts`, `format.ts`, `timeline.ts` | Navigation (Expo Router tabs) |
| React Query hooks and the summary functions | Auth storage (AsyncStorage, not cookies) |
| The 54-task checklist and budget seeds | Forms (native modals, not dialogs) |

## Setup

```bash
cd mobile
npm install
npx expo install --fix     # aligns every package with the installed SDK
cp .env.example .env
```

Put the **same** Supabase URL and anon/publishable key in `.env` that the web
app uses, with Expo's prefix:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Then run the account-deletion migration once, from the repo root — Apple
requires in-app account deletion, and it needs a database function:

```
supabase/migrations/0002_account_deletion.sql
```

## Running it

```bash
npm start          # Expo dev server, open in Expo Go or a dev build
npm run ios        # build and run on the iOS simulator (needs Xcode)
```

## Opening it in Xcode

The `ios/` directory is generated rather than committed, which is the standard
Expo arrangement — it keeps native config in `app.json` as the single source of
truth.

```bash
npx expo prebuild --platform ios   # writes ios/
cd ios && pod install
open Everly.xcworkspace            # the workspace, not the .xcodeproj
```

In Xcode: select the **Everly** target → **Signing & Capabilities** → set your
Team. That's the "certified" part — the certificate and provisioning profile
come from your Apple Developer account. Then **Product → Archive** →
**Distribute App**.

If you'd rather not manage certificates by hand, EAS does it in the cloud:

```bash
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios
```

## Before you submit to App Review

- [ ] **Account deletion** — implemented on the Account tab (guideline
      5.1.1(v)). Run migration 0002 or it will fail.
- [ ] **Password reset** — implemented on the sign-in screen. Add
      `everly://reset-password` to your Supabase redirect allow-list under
      Authentication → URL Configuration.
- [ ] **Privacy policy URL** — required by App Store Connect. You store names,
      emails and phone numbers belonging to third-party guests.
- [ ] **App Privacy questionnaire** — declare contact info and user content.
- [ ] **Bundle identifier** — change `com.everly.weddingplanner` in `app.json`
      to something you own.
- [ ] **Screenshots** — 6.7" and 6.5" iPhone sizes at minimum.
- [ ] **Encryption** — `ITSAppUsesNonExemptEncryption` is already set to
      `false` in `app.json`, which is correct for HTTPS-only apps.

## Known gaps

- No push notifications yet. Task reminders would be the obvious first
  addition and would strengthen the case that this is a real native app rather
  than a web view.
- Dates are typed as `YYYY-MM-DD` text rather than picked from a native date
  wheel.
- This project has been typechecked but **never compiled or run on a device** —
  see the note in the root README.
