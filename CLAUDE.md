# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
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

React 19 + Vite single-page personal portfolio. Styling is **Tailwind CSS v4** (configured via `@tailwindcss/vite` plugin — no `tailwind.config.js`; custom utilities live in CSS files directly).

**Page structure** (`src/App.jsx`): All sections are eagerly loaded — `NavBar → Hero → Timeline → Projects → Skills → Contact → Footer`. UI chrome mounts around them: `PageLoader`, `ScrollProgress`, `CustomCursor`, `HeroBackground`.

**Data layer** (`src/constants/index.js`): All portfolio content lives here — nav links, hero words, skills, experience entries, project data, and social links. This is the only place to make content updates.

**Theme** (`src/components/ThemeToggle.jsx`): Dark/light toggle. `initThemeFromStorage()` is called in `App.jsx` on mount to restore the user's saved preference (stored in `localStorage` as `bl-theme`). Applies `dark`/`light` class to `document.documentElement`.

**Smooth scroll**: Lenis (`lenis/dist/lenis.css` imported globally). `useLenis()` hook in `src/hooks/useLenis.js` initialises it on mount.

**Animations**: Framer Motion (`motion`, `AnimatePresence`, `useScroll`, `useTransform`) used throughout sections. GSAP/ScrollTrigger may still be present in legacy components.

**Sections**:
- `Timeline` — career/experience timeline. Uses `useBodyScrollLock` and `useGlowAngle` hooks. Framer Motion for entrance/transition animations.
- `Projects` — project cards with a detail modal. Lazy-loads `EASArchitecture` (`src/components/EASArchitecture.jsx`) inside the modal via `React.lazy`. Uses `useGlowAngle` and `useBodyScrollLock`.
- `Skills` — skills grid + AWS certification badges (`/public/images/badges/`). Badge data is hardcoded in the component; Credly links open externally.
- `Contact` / `Footer` — EmailJS-powered contact form and footer.

**Hooks** (`src/hooks/`):
- `useLenis.js` — initialises Lenis smooth scroll
- `useBodyScrollLock.js` — locks `document.body` scroll; used by Timeline and Projects modals
- `useGlowAngle.js` — tracks pointer angle for glow card effects
- `useBacManChat.js` — reusable SSE chat hook (for hero chat input); streams from `POST ${API_BASE}/api/chat`

**UI components**:
- `CustomCursor` — replaces the default OS cursor
- `HeroBackground` — canvas/SVG background rendered behind the hero
- `ScrollProgress` — top-of-page progress bar
- `Reveal` — Framer Motion wrapper for scroll-triggered entrance animations; used by Projects and Skills
- `HoverCard` — card with pointer-tracking tilt/glow

**3D rendering** — R3F `<Canvas>` scenes still present in the codebase:
- `HeroExperience` (`src/components/HeroModels/`) — procedural `IDEModel` (Drei primitives: `RoundedBox`, `Text`, `Float`) with `HeroLights` and `Particles`. `OrbitControls` limits azimuth to ±20°.
- `AvatarExperience` / `BacMan` (`src/components/BacMan/`) — animated GLB avatar chat widget. **Not mounted in `App.jsx`** in the current version.
- `ContactExperience` (`src/components/ContactModels/`) — 3D computer model in the contact section.

**BacMan AI chat widget** (`src/components/BacMan/`) — floating chat overlay powered by Claude via AWS Bedrock. Currently not mounted in `App.jsx`.
- `BacMan.jsx` — bubble button (bottom-right) that expands into a split-panel overlay (3D avatar + chat log).
- `BacManBubbleCanvas.jsx` — lightweight R3F canvas for the bubble.
- `BacMan/hooks/useChat.js` — SSE streaming hook; keeps last 8 messages as history; module-level `sessionCache` Map for instant first-turn replay within the same tab.

> The `/api/chat` backend lives at `api.bhasanth.com` — a **separate repo/deployment** not in this directory.

**Static assets**: All images, SVGs, `.glb` models, `.fbx` animations, and textures are in `/public/`. Referenced via root-relative paths (e.g. `/images/bg.png`, `/models/Avatar.glb`, `/animations/Idle.fbx`).

**Responsive breakpoints**: `react-responsive` (`useMediaQuery`) is used inside R3F components (which can't use CSS) to adjust 3D model scale and position for mobile/tablet/desktop.
