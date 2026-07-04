---
name: Kinetic Noir
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#ddc1ae'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#a48c7a'
  outline-variant: '#564334'
  surface-tint: '#ffb77d'
  primary: '#ffb77d'
  on-primary: '#4d2600'
  primary-container: '#ff8c00'
  on-primary-container: '#623200'
  inverse-primary: '#904d00'
  secondary: '#b9c6ea'
  on-secondary: '#23304d'
  secondary-container: '#3c4967'
  on-secondary-container: '#abb8db'
  tertiary: '#c0c7d5'
  on-tertiary: '#2a313c'
  tertiary-container: '#a3aab8'
  on-tertiary-container: '#383f4a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b9c6ea'
  on-secondary-fixed: '#0d1b36'
  on-secondary-fixed-variant: '#3a4664'
  tertiary-fixed: '#dce3f1'
  tertiary-fixed-dim: '#c0c7d5'
  on-tertiary-fixed: '#151c26'
  on-tertiary-fixed-variant: '#404753'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin: 40px
  section-gap: 120px
  element-gap: 16px
---

## Brand & Style

This design system is engineered for a high-performance personal portfolio that merges technical rigor with a clean, high-clarity aesthetic. The brand personality is "The Architect of Innovation"—authoritative, precise, and forward-thinking. It targets tech-savvy recruiters and collaborators who value both deep engineering expertise and sophisticated, modern design.

The visual style is a fusion of **Glassmorphism** and **High-Contrast Dark Mode**. It leverages transparency and soft depth to create a deep, immersive, and professional interface. Key stylistic pillars include:
- **Luminous Accents:** Using vibrant orange as a primary focal point to guide the eye and signal interactivity against a dark, cinematic canvas.
- **Atmospheric Clarity:** Dark-themed semi-transparent containers with heavy backdrop blurs (20px+) to create a sense of organized, multi-layered information.
- **Technical Precision:** Sharp typography and intentional use of negative space to evoke the feeling of high-end research interfaces and modern engineering tools.

## Colors

The palette is built on a "Void and Pulse" concept. A **Deep Midnight Foundation (#000000)** provides a high-contrast workspace, maximizing the impact of the **Vibrant Orange (#FF8C00)** primary color.

- **Primary (Orange):** Reserved for critical actions, active states, and focus indicators. It acts as the high-energy contrast within the system.
- **Secondary (Midnight Navy):** Sourced from the brand profile to act as a professional accent or a base for secondary surfaces, providing a subtle blue-ish depth to the dark environment.
- **Tertiary (Cool Slate):** A muted, light-grayish blue used for secondary text or subtle borders, ensuring high legibility without the harshness of pure white.
- **Neutral/Text:** Off-whites and cool grays ensure maximum readability against the dark background, maintaining a sophisticated "noir" aesthetic.

## Typography

The typographic system utilizes **Space Grotesk** for headings and labels to instill a technical, futuristic character. Its geometric quirks reflect the AI-centric inspiration. **Inter** is used for body copy to ensure maximum legibility and a modern, utilitarian feel in the dark mode environment.

Hierarchy is established through significant scale shifts and the use of uppercase labels for metadata. Headlines are kept crisp and light to stand out against dark backgrounds, ensuring that the "architectural" feel of the type is preserved.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop, centered within the viewport to maintain a premium "gallery" feel. A 12-column grid is used with generous gutters to allow the glassmorphism elements enough breathing room to display backdrop blurs.

Vertical rhythm is intentionally "loose," with large section gaps to separate distinct projects or chapters of the portfolio. Spacing is based on an 8px base unit, ensuring mathematical consistency across all paddings and margins. Elements within cards should use tight spacing (16px) to maintain a cohesive, "object-like" appearance.

## Elevation & Depth

In Dark Mode, depth is conveyed through **Tonal Layering** and **Glassmorphism**, relying on inner glows and subtle value shifts rather than traditional shadows:

1.  **Base (Level 0):** Deep Neutral/Black Surface.
2.  **Surface (Level 1):** Dark Secondary Container (#14213d) with a subtle 1px border (#ffffff15).
3.  **Floating (Level 2):** Semi-transparent dark surfaces (rgba(20, 33, 61, 0.7)) with a 20px backdrop-filter: blur.
4.  **Accent (Level 3):** Elements using the Primary Orange with a soft, warm "outer glow" to simulate light emission in the dark space.

Borders are used as essential separators, often using very low-opacity whites or tertiary grays to define edges against the black background.

## Shapes

The shape language is **Pill-shaped**, striking a balance between approachable modernism and technical precision through a soft but deliberate geometry.
- **Standard Cards:** 2rem (32px) corner radius.
- **Secondary Buttons/Chips:** 1rem (16px) corner radius or full pill.
- **Interactive Focus States:** Often involve a "ring" that follows the generous corner radius of the parent element.

The shift toward higher roundedness ensures that despite the high-contrast dark theme, the technical content feels fluid and accessible, evoking a "premium consumer tech" feel.

## Components

### Buttons
- **Primary:** Solid Orange background with black or very dark navy text for contrast. On hover, apply a slight saturation increase and an outer glow.
- **Secondary:** Transparent background with a 1px tertiary border (40% opacity) and light text. Hover state fills the background with the Secondary Navy at 50% opacity. Use a 1rem radius.

### Cards
Cards should use a "Dark Glass" effect: `background: rgba(20, 33, 61, 0.6)` with a `backdrop-filter: blur(12px)`. Apply a thin, subtle white border (10% opacity) to define the edge and a 2rem corner radius.

### Chips/Tags
Small, pill-shaped elements used for tech stacks. Use the Secondary Navy color as a background with Tertiary Slate text for a sophisticated, professional look.

### Input Fields
Darker than the surface containers or outlined with a subtle 1px border. The focus state must use a vibrant orange border to clearly signal user intent in the dark environment, following a 1rem radius.

### Progress/Stats
Use the Primary Orange for all data visualization (bars, graphs, icons). On the dark background, these elements glow significantly, highlighting the user's technical achievements and skills.