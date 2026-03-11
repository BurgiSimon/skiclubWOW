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

This is a minimal Vue 3 SPA bootstrapped with `create-vue`. Currently just a scaffold:

- `src/main.js` — mounts the root `App` component onto `#app` (in `index.html`)
- `src/App.vue` — root component; all app content starts here
- `@` alias resolves to `src/` (configured in both `vite.config.js` and `jsconfig.json`)

## Linting

Two linters run in sequence via `lint:oxlint` then `lint:eslint`:
- **oxlint** — fast Rust-based linter, configured via `.oxlintrc.json`
- **ESLint** — uses `eslint-plugin-vue` (flat/essential rules) + `eslint-config-prettier` (disables formatting rules that conflict with Prettier)

Formatting is handled separately by **Prettier** (`bun format`).
