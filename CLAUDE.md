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

This is a React 19 + Vite single-page personal portfolio website using Tailwind CSS v4 for styling.

**Page structure** (`src/App.jsx`): Sections render top-to-bottom — `NavBar → Hero → AnimatedCounter → Showcase → LogoSection → FeatureCards → ExperienceSection → TechStack → Contact → Footer`.

**Data layer** (`src/constants/index.js`): All portfolio content (nav links, experience cards, tech stack, social links, etc.) lives in a single constants file. This is where to make content updates.

**3D rendering**: Two R3F (`@react-three/fiber`) Canvas scenes:
- `HeroExperience` — renders a 3D room model (`/public/models/`) with lights and particles
- `ContactExperience` — renders a 3D computer model in the contact section
- Components in `src/components/HeroModels/` and `src/components/ContactModels/`

**Animations**: GSAP with `@gsap/react` (`useGSAP` hook). ScrollTrigger is used in `TechStack` and other sections for scroll-based animations.

**Tech Stack section**: The 3D icon cards (`techStackIcons` + `TechIconCardExperience`) are currently commented out in favor of 2D image cards (`techStackImgs`). The GLB models exist in `/public/models/` if you want to re-enable.

**Static assets**: All images, SVGs, and `.glb` 3D models are in `/public/`. Referenced via root-relative paths (e.g. `/images/bg.png`, `/models/react_logo-transformed.glb`).
