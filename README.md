# Skiclub Kestenholz – Website

> **Mir fahre Ski. Meischtens.**

The website of the Skiclub Kestenholz: 18 friends from Chestehouz, founded 2023, more fun than ambition.
Built with Vue 3 + Vite + Bun, deployed to GitHub Pages.

**Live:** https://burgisimon.github.io/skiclubWOW/ (after the one-time Pages setup below)

## What's on the page

| Section | Content |
| --- | --- |
| **Hero** | Pixel snow, «Mir fahre Ski. *meischtens.*», next event with live countdown, a polaroid of six guys pointing at the headline (click it for a new caption) |
| **Bande** | A marquee styled like our banner at the sports ground – speeds up while you scroll |
| **01 Wer mir sind** | Who we are, stats (incl. *0 ski lifts in Kestenholz*), our four «disciplines» |
| **02 Heimspiel** | «Kei Lift? Kei Problem.» – the powder day in Kestenholz (Jan 2026), with both video clips |
| **03 Gründer** | The founders' photo with hand-drawn annotations, 8 → 18 members («Platz 19 isch no frei»), chronicle |
| **04 Agenda** | Every event as a ski pass, rated by piste colour (blue/red/black/yellow), filters, `.ics` calendar export, share button |
| **05 Galerie** | Photo gallery with filters and lightbox (keyboard + swipe) |
| **06 Mitmachen** | Become a member, Gönner or sponsor (including the official Gönner-Apéro clause from the GV) |

Hidden extras: the ❄ button in the header turns on the «Schneekanone», typing <kbd>s</kbd><kbd>k</kbd><kbd>i</kbd>
(or clicking the boot in the footer) sends the boot down the page, and the little boot on the
header line shows how far you have scrolled.

## Development

```sh
bun install        # install dependencies
bun dev            # dev server with hot reload
bun run build      # production build into dist/ (first run ~1–2 min: photos are converted)
bun preview        # serve the production build locally
bun lint           # oxlint + eslint
bun format         # prettier
```

## Editing content

All texts and dates live in three small files – no component code needs to change.

| File | What |
| --- | --- |
| `src/data/club.js` | Club facts (members, founded …), **contact e-mail / Instagram** (`skiclub_kestenholz`), chronicle, polaroid captions |
| `src/data/events.js` | The agenda. Dates are `YYYY-MM-DD`; past events get an «Entwertet» stamp automatically and the hero always shows the next one |
| `src/data/photos.js` | The gallery (file, category, alt text, caption) |

**Contact:** the «Mitmachen» buttons use the first channel that is set in `contact`: e-mail
(`mailto:` with a prefilled subject), then Instagram (opens the profile for a DM), otherwise the
agenda («talk to us at the next event»). The Instagram handle also drives the header icon, the
mobile menu, the «more on Instagram» box below the gallery and the footer.

**Adding a photo:** put the `.jpg` into `src/assets/photos/` and add an entry to `gallery` in
`src/data/photos.js`. At build time [vite-imagetools](https://github.com/JonasKruckenberg/imagetools)
creates AVIF/WebP versions in four sizes plus a blurred placeholder, and strips EXIF/GPS data.

**Videos** live in `src/assets/media/` (MP4/H.264 + WebM/VP9 fallback, muted, without metadata).
They were cut from the original clips with ffmpeg, e.g.:

```sh
ffmpeg -i input.mov -an -vf "fps=30,scale=540:-2" -c:v libx264 -crf 27 -movflags +faststart -map_metadata -1 out.mp4
```

**Time travel:** add `?heute=2027-03-07` to the URL to see the site as it would look on that day
(countdowns, «Nächster Anlass», stamped past events).

## Deploying to GitHub Pages

The workflow `.github/workflows/deploy.yml` builds the site with Bun and publishes `dist/` on every
push to `main` (pull requests are only built, not deployed).

One-time setup in the repository: **Settings → Pages → Build and deployment → Source: «GitHub
Actions»**. After that, merge to `main` (or run the workflow manually under *Actions*) and the site
appears at `https://burgisimon.github.io/skiclubWOW/`.

Vite uses a relative `base` (`./`), so the same build also works on a custom domain later. Only the
absolute URLs for the social preview in `index.html` (`og:url`, `og:image`) would need updating.

## Tech notes

- **Vue 3** (`<script setup>`), **Vite 7**, **Bun**; no router or store – one page with anchor navigation.
- **Fonts** are self-hosted via Fontsource (Archivo with width axis, Caveat for handwriting) – no
  requests to Google, nothing to declare for privacy.
- **PixelSnow** renders with plain WebGL2 at snow-pixel resolution (no three.js), pauses off-screen.
- **GSAP** (word reveal in «Wer mir sind») is loaded lazily after the first paint.
- Respects `prefers-reduced-motion`: no snow, no autoplay, no scroll animations.
- Brand assets: the boot comes from `public/logo-skiclub.svg`, the lettering was traced from the
  original logo (`src/components/brand/`).
