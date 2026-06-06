# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint (Next.js core-web-vitals + TypeScript rules)
npm test          # run all Vitest tests
npx vitest run tests/components/Navbar.test.tsx  # run a single test file
```

## Architecture

The app uses the **Next.js App Router** with two parallel route groups that enforce distinct layouts:

- **`app/(public)/`** — unauthenticated pages (splash, login, signup, preview). Layout wraps content in `<main className="public">`.
- **`app/(dashboard)/`** — authenticated pages (heists list, create, detail). Layout wraps content with the `<Navbar>` component and `<main>`.

The root splash page at `app/(public)/page.tsx` is intended as a routing gate: redirect to `/heists` when logged in, `/login` when not. No auth logic is implemented yet.

## Components

Components live under `components/<Name>/` with three files: `<Name>.tsx`, `<Name>.module.css`, and `index.ts` (barrel export). CSS Modules use `@reference "../../app/globals.css"` to access Tailwind utilities via `@apply`.

## Styling

Tailwind CSS v4 is configured via PostCSS. Custom design tokens are defined with `@theme` in `app/globals.css` — use `bg-dark`, `bg-light`, `text-primary`, `text-body`, etc. rather than arbitrary values. The font is Inter (Google Fonts).

## Testing

Vitest + Testing Library with jsdom. Setup file imports `@testing-library/jest-dom/vitest`. Tests mirror the `components/` directory under `tests/components/`.

Path alias `@/*` resolves to the repo root (e.g. `@/components/Navbar`).
