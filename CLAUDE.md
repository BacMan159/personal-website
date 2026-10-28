# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run build:photo    # Build photo.bhasanth.com (gallery + /admin) into dist-photo/
npm run preview:photo  # Preview dist-photo/
npm run lint      # Run ESLint
```

There are no tests in this project.

## Environment Variables

The contact form uses EmailJS and requires a `.env` file with:

- `VITE_APP_EMAILJS_SERVICE_ID`
- `VITE_APP_EMAILJS_TEMPLATE_ID`
- `VITE_APP_EMAILJS_PUBLIC_KEY`

For local BacMan development, add to `.env.local`:

- `VITE_API_URL=http://localhost:3001` — overrides the default `https://api.bhasanth.com` API base. In production this env var is unset so requests go to the live API.

## Architecture

React 19 + Vite single-page personal portfolio. Styling is **Tailwind CSS v4** (configured via `@tailwindcss/vite` plugin — no `tailwind.config.js`; custom utilities live in `src/index.css` directly). `vite.config.js` manually splits `vendor-react` and `vendor-three` chunks via `build.rollupOptions.output.manualChunks`.

Note: `README.md` and `DESIGN.md` describe an older architecture (GSAP, `EducationGlobe`, `AnimatedCounter`, etc.) that no longer matches this codebase — treat this CLAUDE.md and the code itself as the source of truth instead.

**Page structure** (`src/App.jsx`): All sections are eagerly loaded — `NavBar → Hero → Timeline → Projects → Skills → Contact → Footer`. UI chrome mounts around them: `PageLoader`, `ScrollProgress`, `CustomCursor`, `HeroBackground`.

**Data layer** (`src/constants/index.js`): All portfolio content lives here — nav links, hero words, skills, experience entries, project data, and social links. This is the only place to make content updates.

**Theme** (`src/components/ThemeToggle.jsx`): Dark/light toggle. `initThemeFromStorage()` is called in `App.jsx` on mount to restore the user's saved preference (stored in `localStorage` as `bl-theme`). Applies `dark`/`light` class to `document.documentElement`. Default is dark; light mode adds `:root.light` overrides.

**Design tokens**: `src/index.css` defines CSS custom properties (`--bg-primary`, `--accent`, `--text-primary`, etc.) and a Tailwind v4 `@theme` block exposing `bl-*` prefixed color tokens (`bl-bg`, `bl-surface`, `bl-elevated`, `bl-accent`, `bl-text`, `bl-text2`, `bl-muted`, `bl-border`). Layout utilities (`section-padding`, `padding-x`, `padding-x-lg`, `hero-layout`, `flex-center`, `grid-2-cols` … `grid-12-cols`) are also defined there via `@layer components/utilities`.

**Smooth scroll**: Lenis (`lenis/dist/lenis.css` imported globally). `useLenis()` hook in `src/hooks/useLenis.js` initialises it on mount.

**Animations**: Framer Motion (`motion`, `AnimatePresence`, `useScroll`, `useTransform`) used throughout sections.

**Sections** (`src/sections/`):

- `Hero` — landing section with a hero chat input (uses `useBacManChat` for SSE streaming) and `HeroExperience` 3D scene.
- `Timeline` — career/experience timeline. Uses `useBodyScrollLock` and `useGlowAngle` hooks. Framer Motion for entrance/transition animations.
- `Projects` — project cards with a detail modal. Lazy-loads `EASArchitecture` (`src/components/EASArchitecture.jsx`) inside the modal via `React.lazy`. Uses `useGlowAngle` and `useBodyScrollLock`.
- `Skills` — skills grid + AWS certification badges (`/public/images/badges/`). Badge data is hardcoded in the component; Credly links open externally.
- `Contact` / `Footer` — EmailJS-powered contact form and footer.

**Hooks** (`src/hooks/`):

- `useLenis.js` — initialises Lenis smooth scroll
- `useBodyScrollLock.js` — locks `document.body` scroll; used by Timeline and Projects modals
- `useGlowAngle.js` — tracks pointer angle for glow card effects
- `useBacManChat.js` — reusable SSE chat hook (for hero chat input); streams from `POST ${API_BASE}/api/chat`

**Analytics** (`src/lib/track.js`): cookie-free view/click tracking, sent in batches with `navigator.sendBeacon` to `POST ${API_BASE}/api/track`, which stores the events in DynamoDB (see `bhasanth-api`). `initTracking()` runs once from `App.jsx`. It records a page view, one `section` view per `section[id]` per session, and auto-captures outbound links, `mailto:` and `download` links. To track another click, add `data-track="event_name"` (lowercase, `[a-z0-9_.:-]`) and an optional `data-track-label` to the element, or call `trackClick(name, label)`. Tracking is off in `npm run dev` unless `VITE_ENABLE_TRACKING=true`, and off when the browser sends Do Not Track.

**UI components** (`src/components/`):

- `CustomCursor` — replaces the default OS cursor
- `HeroBackground` — canvas/SVG background rendered behind the hero
- `ScrollProgress` — top-of-page progress bar
- `Reveal` — Framer Motion wrapper for scroll-triggered entrance animations; used by Projects and Skills
- `HoverCard` — card with pointer-tracking tilt/glow
- `TitleHeader` — shared section heading component
- `Button` — shared button primitive

**3D rendering** — R3F `<Canvas>` scenes:

- `HeroExperience` (`src/components/HeroModels/`) — procedural `IDEModel` (Drei primitives: `RoundedBox`, `Text`, `Float`) with `HeroLights` and `Particles`. Also contains `Avatar.jsx` / `AvatarExperience.jsx`. `OrbitControls` limits azimuth to ±20°.
- `BacMan` (`src/components/BacMan/`) — animated GLB avatar chat widget. **Not mounted in `App.jsx`** in the current version.
- `ContactExperience` (`src/components/ContactModels/`) — 3D computer model in the contact section.

**BacMan AI chat widget** (`src/components/BacMan/`) — floating chat overlay powered by Claude via AWS Bedrock. Currently not mounted in `App.jsx`.

- `BacMan.jsx` — bubble button (bottom-right) that expands into a split-panel overlay (3D avatar + chat log).
- `BacManBubbleCanvas.jsx` — lightweight R3F canvas for the bubble.
- `BacMan/hooks/useChat.js` — SSE streaming hook; keeps last 8 messages as history; module-level `sessionCache` Map for instant first-turn replay within the same tab.

> The `/api/chat` backend lives at `api.bhasanth.com` — a **separate repo/deployment** not in this directory.

**Photography subdomain + admin console** (`photo.bhasanth.com`): a separate static build from the same codebase with two pages — the gallery (`photo.html` → `src/photo/main.jsx` → `PhotoGallery.jsx`) and the admin console (`admin/index.html` → `src/photo/admin.jsx` → `AdminConsole.jsx`, served at `/admin/`, `noindex`). Both call `bhasanth-api` through `src/photo/api.js` (`GET/POST/DELETE /api/photos`, `POST /api/photos/upload-url`, `GET /api/stats`).

- `AdminConsole.jsx` — one token gate (`ADMIN_SECRET`, kept in `localStorage` as `bl-admin`) and tabs from the URL hash: `#analytics` → `AnalyticsPanel.jsx`, `#photos` → `PhotosPanel.jsx`. To add a section, add an entry to `TABS`; each panel gets `{ token, onUnauthorized }`.
- `AnalyticsPanel.jsx` — site analytics (tiles, per-day bar chart with tooltip + table, top clicks / sections / referrers / countries / devices). Replaces the old `bhasanth-api/public/dashboard.html`. Labels come from public visitors: render as text only, never `dangerouslySetInnerHTML`.
- `PhotosPanel.jsx` — upload, delete and reorder (HTML5 drag-and-drop plus ←/→ buttons for touch/keyboard; changes stay local until "Save order" sends `PUT /api/photos`). Prefills camera, lens (`LensModel`, dropped for phones), focal length and exposure settings from EXIF with `exifr` (`src/photo/exif.js`), resizes to 2400px JPEG in a canvas (which also strips EXIF/GPS from the file), PUTs it straight to S3 with a presigned URL, then saves the metadata. Title is optional; city is typed by hand. A category (`CATEGORIES` in `api.js`: wildlife, birds, landscape, astro, automobile, … — must match `PHOTO_CATEGORIES` in `bhasanth-api`) is required on upload and can be changed per photo in the grid (`PATCH /api/photos?id=`, saved immediately). The gallery shows filter pills for the categories that have photos; the selection is kept in the URL hash (`#birds`), and photos without a category appear only under All. The gallery is a JS masonry (`toColumns` in `PhotoGallery.jsx`: each photo goes in the shortest of 1/2/3 columns by its stored aspect ratio, so the saved order reads left to right). The gallery's EXIF overlay is hidden until hover / focus (cards are focusable so a tap shows it on touch). Images and a `gallery.json` list live in S3; nothing is in the repo.

`npm run build:photo` runs `BUILD_TARGET=photo vite build` (output `dist-photo/`, no `publicDir`; `npm run preview:photo` serves it). It must stay in production mode — a custom Vite mode skips `.env.production`, so `.env.local`'s localhost `VITE_API_URL` would get baked into the deployed gallery and then `scripts/build-photo.mjs`, which renames `photo.html` to `index.html` and copies `bl.png`. Both sites are hosted on Hostinger: upload `dist/` to the main domain's `public_html` and `dist-photo/` to the subdomain's folder. In `npm run dev` the pages are at `/photo.html` and `/admin/`; with `.env.local`'s `VITE_API_URL=http://localhost:3001` they need `bhasanth-api` running locally. The NavBar camera icon links to the gallery. `manualChunks` is a function so the gallery doesn't pull in `vendor-three`.

**Static assets**: All images, SVGs, `.glb` models, `.fbx` animations, and textures are in `/public/`. Referenced via root-relative paths (e.g. `/images/bg.png`, `/models/Avatar.glb`, `/animations/Idle.fbx`).

**Responsive breakpoints**: `react-responsive` (`useMediaQuery`) is used inside R3F components (which can't use CSS) to adjust 3D model scale and position for mobile/tablet/desktop.
