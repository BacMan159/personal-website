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

## Architecture

React 19 + Vite single-page personal portfolio. Styling is **Tailwind CSS v4** (configured via `@tailwindcss/vite` plugin — no `tailwind.config.js`; custom utilities live in CSS files directly).

**Page structure** (`src/App.jsx`): `NavBar`, `Hero`, and `AnimatedCounter` are eagerly loaded; all remaining sections are lazy-loaded inside a single `<Suspense fallback={null}>` — `FeatureCards → ExperienceSection → TechStack → LogoSection → EducationGlobe → Contact → Footer`.

> `src/sections/Showcase.jsx` exists but is **not mounted** in `App.jsx`.

**Data layer** (`src/constants/index.js`): All portfolio content lives here — nav links, hero words, counter items, abilities, tech stack, experience cards, education locations, and social links. This is the only place to make content updates.

**3D rendering** — three independent R3F `<Canvas>` scenes:

- `HeroExperience` (`src/components/HeroModels/`) — renders a procedural `IDEModel` (built from `@react-three/drei` primitives: `RoundedBox`, `Text`, `Float`) with `HeroLights` and `Particles`. `OrbitControls` limits azimuth to ±20° for a subtle 3D feel. Responsive scale/position via `react-responsive`. **Note:** `Room.jsx` is the original GLB-based model that `IDEModel` replaced; `Room.jsx` still exists but is unused.
- `AvatarExperience` (`src/components/HeroModels/`) — animated GLB avatar (`/public/models/Avatar.glb`) with FBX animations (`/public/animations/`). Plays wave on load then cross-fades to idle via `useGLTF` + `useFBX` + `useAnimations`.
- `ContactExperience` (`src/components/ContactModels/`) — 3D computer model in the contact section.
- `EducationGlobe` (`src/sections/EducationGlobe.jsx`) — custom interactive globe built entirely from Three.js primitives (no library). Uses `IntersectionObserver` to defer mounting the `<Canvas>` until the section scrolls into view. Earth texture: `/public/textures/earth-map.jpg`. Location data (lat/lng, colors) drives pin placement via spherical coordinate math in `latLngToVec3`.

**Animations**: GSAP with `@gsap/react` (`useGSAP` hook). `ScrollTrigger` is registered globally — used in `TechStack` and other sections for scroll-based entrance animations.

**Tech Stack section**: The 3D icon cards (`techStackIcons` + `TechIconCardExperience`) are currently commented out in favor of 2D image cards (`techStackImgs`). The GLB models exist in `/public/models/` if you want to re-enable.

**Static assets**: All images, SVGs, `.glb` models, `.fbx` animations, and textures are in `/public/`. Referenced via root-relative paths (e.g. `/images/bg.png`, `/models/Avatar.glb`, `/animations/Idle.fbx`, `/textures/earth-map.jpg`).

**Responsive breakpoints**: `react-responsive` (`useMediaQuery`) is used inside R3F components (which can't use CSS) to adjust 3D model scale and position for mobile/tablet/desktop.
