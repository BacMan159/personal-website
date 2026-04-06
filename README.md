# Personal Website

A personal portfolio built with React 19, Vite, Three.js, and GSAP. Features interactive 3D scenes, scroll-driven animations, and a custom interactive globe.

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` — no config file) |
| 3D Rendering | Three.js + React Three Fiber + Drei |
| Animations | GSAP + `@gsap/react` (`ScrollTrigger`) |
| Contact Form | EmailJS (`@emailjs/browser`) |
| Responsive (in R3F) | `react-responsive` |
| Post-processing | `@react-three/postprocessing` |

## Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env   # or create .env manually (see below)

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

These are required for the contact form to send emails. Get them from [emailjs.com](https://www.emailjs.com/).

## Commands

```bash
npm run dev       # Start development server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
Personal_Website/
├── public/
│   ├── animations/          # FBX animation files (Avatar: wave, idle)
│   ├── images/              # Static images and SVGs
│   ├── models/              # GLB 3D models (Avatar, tech icons, computer)
│   ├── textures/            # Texture maps (earth-map.jpg for the globe)
│   └── bl.png               # Favicon / brand mark
├── src/
│   ├── App.jsx              # Root — eager: NavBar, Hero, AnimatedCounter;
│   │                        #   lazy (Suspense): all remaining sections
│   ├── main.jsx             # React DOM entry point
│   ├── index.css            # Global styles + Tailwind imports
│   ├── constants/
│   │   └── index.js         # ALL portfolio content (nav, hero, counters,
│   │                        #   abilities, tech stack, experience, education,
│   │                        #   social links) — only file for content edits
│   ├── sections/            # Page sections (rendered in order)
│   │   ├── Hero.jsx
│   │   ├── FeatureCards.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── TechStack.jsx
│   │   ├── LogoSection.jsx
│   │   ├── EducationGlobe.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── Showcase.jsx     # NOT mounted — exists but unused in App.jsx
│   └── components/
│       ├── NavBar.jsx
│       ├── AnimatedCounter.jsx
│       ├── Button.jsx
│       ├── GlowCard.jsx
│       ├── PageLoader.jsx
│       ├── TitleHeader.jsx
│       ├── HeroModels/
│       │   ├── HeroExperience.jsx   # R3F Canvas — IDEModel + lights + particles
│       │   ├── IDEModel.jsx         # Procedural IDE built from Drei primitives
│       │   ├── HeroLights.jsx
│       │   ├── Particles.jsx
│       │   ├── AvatarExperience.jsx # R3F Canvas — animated GLB avatar (UNUSED)
│       │   ├── Avatar.jsx           # Avatar mesh + FBX animation controller
│       │   └── Room.jsx             # Original GLB room model (UNUSED — replaced by IDEModel)
│       ├── ContactModels/
│       │   ├── ContactExperience.jsx  # R3F Canvas — 3D computer in contact section
│       │   ├── Computer.jsx
│       │   └── ContactLights.jsx
│       └── Models/
│           └── TechModels/
│               └── TechIconCardExperience.jsx  # 3D tech icon cards (currently unused)
```

## Architecture

### Page Loading Strategy

`NavBar`, `Hero`, and `AnimatedCounter` are **eagerly loaded** — they appear immediately on first paint. Everything below the fold (`FeatureCards` through `Footer`) is **lazy-loaded** inside a single `<Suspense>`, showing `<PageLoader />` until the JS chunk arrives.

### 3D Scenes (React Three Fiber)

Three independent R3F `<Canvas>` instances run on the page:

1. **HeroExperience** — procedural IDE model built entirely from Drei primitives (`RoundedBox`, `Text`, `Float`). `OrbitControls` limited to ±20° azimuth for a subtle interactive feel. Scale/position is responsive via `react-responsive` (R3F can't use CSS media queries).

2. **ContactExperience** — 3D computer model inside the contact section. GLB loaded from `/public/models/`.

3. **EducationGlobe** — custom interactive globe built from raw Three.js (no library). Deferred mount via `IntersectionObserver` — the Canvas only mounts when the section scrolls into view. Location pins are placed using spherical coordinate math (`latLngToVec3`).

### Animations

GSAP with `ScrollTrigger` registered globally. `useGSAP` (from `@gsap/react`) handles cleanup automatically. Used in `TechStack` and other sections for scroll-based entrance animations.

### Content Updates

All portfolio data lives in `src/constants/index.js`. To update text, links, experience cards, tech stack items, or education locations — only edit that file.

### Styling

Tailwind CSS v4 configured via the `@tailwindcss/vite` Vite plugin. There is no `tailwind.config.js`. Custom utilities are defined directly in CSS files.

## Unused Files (kept for reference)

| File | Reason kept |
|---|---|
| `src/components/HeroModels/Room.jsx` | Original GLB room, replaced by procedural `IDEModel` |
| `src/components/HeroModels/AvatarExperience.jsx` | Animated avatar scene, removed from `Hero.jsx` |
| `src/components/Models/TechModels/TechIconCardExperience.jsx` | 3D tech icon cards, commented out in `TechStack.jsx` in favour of 2D image cards |
| `src/sections/Showcase.jsx` | Not mounted in `App.jsx` |
