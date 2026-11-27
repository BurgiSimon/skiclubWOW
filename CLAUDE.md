# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
bun install       # Install dependencies
bun dev           # Start dev server with HMR
bun run build     # Production build
bun preview       # Preview production build locally
bun lint          # Run oxlint then eslint (both with --fix)
bun format        # Format src/ with prettier
```

## Stack

- **Vue 3** with `<script setup>` (Composition API)
- **Vite** as the build tool, with `vite-plugin-vue-devtools` enabled in dev
- **Bun** as the package manager (use `bun` not `npm`/`pnpm`)

## Architecture

Single-page website of the Skiclub Kestenholz (German / Swiss German copy), deployed to GitHub
Pages by `.github/workflows/deploy.yml`. No router, no store – sections with anchor navigation.

- `src/main.js` — mounts `App`, registers the `v-reveal` directive, imports fonts + `styles/main.css`
- `src/App.vue` — header, the page sections, footer and global overlays (lightbox, toasts, snow, easter egg)
- `src/sections/` — one component per page section (Hero, About, PowderDay, Founders, Events, Gallery, Join)
- `src/components/` — shared UI (EventTicket, ResponsiveImage, AutoVideo, PixelSnow, VelocityText, …);
  `components/brand/` holds the logo boot and traced wordmark as SVG paths
- `src/data/` — all content: `club.js` (facts, contact), `events.js` (agenda), `photos.js` (gallery)
- `src/composables/` — shared state (`useUi.js`: lightbox/toasts/snow), `useNow` (supports `?heute=YYYY-MM-DD`), reduced motion
- `src/styles/main.css` — design tokens (colours, type, spacing), buttons, section scaffolding, reveal animation
- Photos in `src/assets/photos/` are imported via `vite-imagetools` (`?…&as=picture`) → AVIF/WebP srcsets
- `vite.config.js` uses `base: './'` so the build works under the GitHub Pages sub-path
- `@` alias resolves to `src/` (configured in both `vite.config.js` and `jsconfig.json`)

## Linting

Two linters run in sequence via `lint:oxlint` then `lint:eslint`:
- **oxlint** — fast Rust-based linter, configured via `.oxlintrc.json`
- **ESLint** — uses `eslint-plugin-vue` (flat/essential rules) + `eslint-config-prettier` (disables formatting rules that conflict with Prettier)

Formatting is handled separately by **Prettier** (`bun format`).
