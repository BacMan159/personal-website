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

This is a React 19 + Vite 7 single-page personal portfolio website using Tailwind CSS v4 for styling.

### Page Structure (`src/App.jsx`)

Sections render top-to-bottom with a mix of eager and lazy-loaded components:

```
NavBar          (eager)
Hero            (eager)
AnimatedCounter (eager)
--- Suspense boundary (fallback=null) ---
FeatureCards    (lazy)
ExperienceSection (lazy)
TechStack       (lazy)
LogoSection     (lazy)
EducationGlobe  (lazy)
Contact         (lazy)
Footer          (lazy)
```

`Showcase` exists as a section component but is **not currently used** in `App.jsx`.

### Data Layer (`src/constants/index.js`)

All portfolio content lives here — this is the single source of truth for content updates:
- `navLinks` — navigation items with hash anchors
- `words` — rotating hero text items with SVG icons
- `counterItems` — statistics (years of experience, domains, clients, satisfaction)
- `abilities` — 3 feature card entries (large-scale frontend, cloud/AWS, enterprise Java)
- `techStackImgs` — 5 image-based tech stack cards (currently active)
- `techStackIcons` — 12 GLB-model-based 3D tech cards (currently commented out in TechStack.jsx)
- `expCards` — 7 work experience entries with company, dates, responsibilities, images
- `eduData` — 2 education entries (UF, VIT) with globe coordinates, colors, highlights, capstone
- `socialImgs` — social link objects (LinkedIn)

### Directory Structure

```
src/
├── App.jsx                    # Root component, lazy imports, Suspense
├── main.jsx                   # React DOM entry point
├── index.css                  # Tailwind @theme, @layer components/utilities, keyframes
├── constants/
│   └── index.js               # All portfolio data (single source of truth)
├── components/
│   ├── AnimatedCounter.jsx    # 4-stat counter (react-countup)
│   ├── Button.jsx             # CTA button with smooth scroll to #counter
│   ├── GlowCard.jsx           # Mouse-tracking glow card (React.memo)
│   ├── NavBar.jsx             # Fixed header with scroll detection
│   ├── TitleHeader.jsx        # Reusable section badge + heading
│   ├── HeroModels/
│   │   ├── HeroExperience.jsx # R3F Canvas wrapper for hero 3D scene
│   │   ├── HeroLights.jsx     # Spot/point/rect lights for hero
│   │   ├── Particles.jsx      # 50 falling particles (useFrame loop)
│   │   └── Room.jsx           # GLB loader for optimized-room.glb, SelectiveBloom
│   ├── ContactModels/
│   │   ├── ContactExperience.jsx # R3F Canvas for contact section
│   │   ├── Computer.jsx       # GLB loader for computer model
│   │   └── ContactLights.jsx  # Lighting for contact scene
│   └── Models/
│       └── TechModels/
│           └── TechIconCardExperience.jsx  # 3D tech icon Float cards (currently unused)
└── sections/
    ├── Hero.jsx               # Full-height hero, animated text, 3D room
    ├── FeatureCards.jsx       # 3 ability cards (React.memo)
    ├── ExperienceSection.jsx  # Timeline with GlowCard, GSAP scroll animations
    ├── TechStack.jsx          # 5 image cards, GSAP stagger entrance
    ├── LogoSection.jsx        # Infinite marquee of 80+ skill badges
    ├── EducationGlobe.jsx     # Interactive 3D globe with clickable school pins
    ├── Contact.jsx            # EmailJS contact form + 3D computer model
    ├── Footer.jsx             # Copyright footer
    └── Showcase.jsx           # Project showcase (exists but unused in App.jsx)
```

### Static Assets (`/public/`)

All images, SVGs, and 3D models are referenced via root-relative paths:
- `/images/` — backgrounds, avatars, logos, textures
- `/models/` — `.glb` files (`optimized-room.glb`, `computer-optimized-transformed.glb`, tech icon models)
- `/textures/` — earth map texture for EducationGlobe
- `/bl.png` — favicon

### 3D Rendering

Three R3F (`@react-three/fiber`) Canvas scenes:

1. **HeroExperience** — room model with colored spot lights, 50 falling particles, SelectiveBloom on screen meshes. OrbitControls with pan/zoom disabled. Scale: 0.7 mobile / 1.0 desktop.
2. **ContactExperience** — floppy/computer GLB model on a plane with shadow casting.
3. **TechIconCardExperience** — Float-animated tech icon cards (currently disabled in favor of `techStackImgs`).

GLB models in `/public/models/` can be regenerated with `gltfjsx` (Room.jsx and Computer.jsx are auto-generated output).

### Animations

- **GSAP** via `useGSAP()` hook from `@gsap/react` — all scroll-triggered section entrances
- **ScrollTrigger** — used in ExperienceSection (timeline slide), TechStack (stagger entrance), Hero (text entrance)
- **CSS Keyframes** — `wordSlider` (hero word rotation, 21s), `marquee` (LogoSection, 60s), `fadeIn`, `floatUp` (EducationGlobe)
- **react-countup** — AnimatedCounter statistics

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js`). All customization is in `src/index.css`:

**Theme variables (`@theme`):**
- `--font-sans: "Mona Sans"` (Google Fonts, weights 200–900)
- `--color-white-50: #d9ecff`
- `--color-black-50: #1c1c21`, `--color-black-100: #0e0e10`, `--color-black-200: #282732`
- `--color-blue-50: #839cb5`, `--color-blue-100: #2d2d38`

**Custom component classes (in `@layer components`):**
- `.padding-x`, `.padding-x-lg` — responsive horizontal padding
- `.section-padding` — consistent section spacing
- `.grid-2-cols`, `.grid-3-cols`, `.grid-4-cols`, `.grid-12-cols` — named grid layouts
- `.hero-layout`, `.hero-text`, `.hero-badge`, `.hero-3d-layout` — hero section pieces
- `.navbar` — fixed header with `.scrolled` variant
- `.card-border` — standard card appearance
- `.marquee`, `.marquee-box` — skill badge infinite scroll
- `.timeline-*` — experience section timeline
- `.tech-card-*` — tech stack card variants
- `.card` — GlowCard CSS mask glow effect
- `.edu-*` — EducationGlobe cards, globe container, pins, tooltips

### Build Configuration (`vite.config.js`)

Manual chunk splitting for optimal caching:
- `vendor-react` — react, react-dom, react-countup, react-responsive
- `vendor-three` — three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing
- `vendor-gsap` — gsap, @gsap/react

### ESLint (`eslint.config.js`)

Uses ESLint 9 flat config format. Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`. Custom rule: `no-unused-vars` with `varsIgnorePattern` to allow uppercase variable names.

## Key Conventions

1. **Content updates go in `src/constants/index.js`** — never hardcode data in components.
2. **Heavy sections are lazy-loaded** — all sections below the fold use `React.lazy` + `Suspense`.
3. **React.memo** on components that receive stable props: `FeatureCards`, `GlowCard`, `SkillTag` (in LogoSection).
4. **useCallback/useMemo** for event handlers and expensive computations (NavBar scroll handler, Particles buffer).
5. **No Tailwind config file** — extend Tailwind only via `@theme` and `@layer` blocks in `index.css`.
6. **3D models are modular** — each 3D scene has separate `Experience` (Canvas), `Lights`, and model components.
7. **Smooth scroll offset** — NavBar uses 130px offset; Button uses 15% viewport offset when scrolling to anchors.
8. **`Showcase.jsx` is inactive** — the component exists but is not imported in `App.jsx`. Re-add it there to enable it.
9. **Tech Stack 3D icons are inactive** — `techStackIcons` and `TechIconCardExperience` exist but `TechStack.jsx` uses `techStackImgs` (2D). Swap the commented block in `TechStack.jsx` to re-enable.
10. **IntersectionObserver for heavy Canvas** — `EducationGlobe` defers mounting the R3F Canvas until the section enters the viewport.
