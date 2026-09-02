# Third-party notices

This template is built on open-source software owned by other people. All of it
is under permissive licences that allow commercial use and redistribution as
part of a larger work. Their licence terms govern those components; the
template's own licence (`LICENSE.md`) covers only the original code here.

Full licence text for every package is installed with it, under
`node_modules/<package>/LICENSE`.

## Runtime dependencies

| Package | Licence |
| --- | --- |
| next | MIT |
| react, react-dom | MIT |
| @supabase/supabase-js, @supabase/ssr | MIT |
| @tanstack/react-query | MIT |
| @radix-ui/react-* (checkbox, dialog, dropdown-menu, label, progress, select, separator, slot, tabs) | MIT |
| tailwindcss, tailwindcss-animate | MIT |
| clsx, tailwind-merge | MIT |
| date-fns | MIT |
| sonner | MIT |
| lucide-react | ISC |
| class-variance-authority | Apache-2.0 |

## Development dependencies

| Package | Licence |
| --- | --- |
| typescript | Apache-2.0 |
| @playwright/test | Apache-2.0 |
| eslint, eslint-config-next | MIT |
| postcss, autoprefixer | MIT |
| @types/* | MIT |

## UI components

The components in `src/components/ui/` are based on
[shadcn/ui](https://ui.shadcn.com) (MIT). shadcn/ui is distributed as source
you copy into your project rather than as a dependency, and its licence
explicitly permits this. They have been modified for this template.

## Fonts

The interface uses **Cormorant Garamond** and **Inter**, both under the
[SIL Open Font License 1.1](https://openfontlicense.org).

No font files are included in this package. They are fetched at build time by
`next/font/google`, which self-hosts them in your own build output. If you
later vendor the font files into your repository, include the OFL text
alongside them, as that licence requires.

## Icons

Icons come from [lucide](https://lucide.dev) (ISC), a fork of Feather Icons
(MIT). Both permit commercial use.

## What this means for you

Every component above allows you to build and sell commercial products. None of
them require you to open-source your work. You do not owe anyone attribution in
your user interface.
