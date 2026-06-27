---
name: Ignite & Glass
colors:
  surface: '#141311'
  surface-dim: '#141311'
  surface-bright: '#3a3937'
  surface-container-lowest: '#0f0e0c'
  surface-container-low: '#1c1b1a'
  surface-container: '#201f1e'
  surface-container-high: '#2b2a28'
  surface-container-highest: '#363532'
  on-surface: '#e6e2de'
  on-surface-variant: '#e1bfb4'
  inverse-surface: '#e6e2de'
  inverse-on-surface: '#31302e'
  outline: '#a88a80'
  outline-variant: '#594139'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1900'
  primary-container: '#f2632d'
  on-primary-container: '#511500'
  inverse-primary: '#ab3600'
  secondary: '#c9c7bd'
  on-secondary: '#31312a'
  secondary-container: '#474740'
  on-secondary-container: '#b7b5ac'
  tertiary: '#cdc6ba'
  on-tertiary: '#343028'
  tertiary-container: '#969085'
  on-tertiary-container: '#2d2921'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822700'
  secondary-fixed: '#e5e2d9'
  secondary-fixed-dim: '#c9c7bd'
  on-secondary-fixed: '#1c1c16'
  on-secondary-fixed-variant: '#474740'
  tertiary-fixed: '#e9e2d5'
  tertiary-fixed-dim: '#cdc6ba'
  on-tertiary-fixed: '#1e1b14'
  on-tertiary-fixed-variant: '#4a463d'
  background: '#141311'
  on-background: '#e6e2de'
  surface-variant: '#363532'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 4.5rem
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  section-padding: 120px
  card-padding: 32px
---

## Brand & Style

The design system for Bhasanth Lakkaraju is defined by a **Premium Minimalism** aesthetic, merging the precision of high-end software engineering with the sophistication of luxury editorial design. It utilizes **Glassmorphism** as a core structural element, creating a sense of depth and hierarchy through semi-transparent layers and background blurs.

The emotional response is one of "Technical Elegance"—the interface feels high-utility and performance-driven, yet visually soothing. **Subtle glow animations** (using the Accent Orange) act as beacons for interaction, while high-contrast typography ensures immediate information density. This system targets high-tier engineering recruiters and technical stakeholders who value both code quality and design sensitivity.

## Colors

The palette is anchored in a high-contrast dark environment. The **Rich Black (#252422)** serves as the primary canvas, providing a deep, ink-like backdrop that makes the glass effects and vibrant accents pop. 

- **Accent Orange (#EB5E28):** Used sparingly for call-to-actions, focus states, and the interactive nodes of the timeline. It represents energy and technical spark.
- **Off-White (#FFFCF2):** Reserved for high-priority text and primary buttons to ensure maximum readability.
- **Warm Gray & Charcoal:** These neutrals facilitate the glass layers, used for borders, secondary text, and background container fills.

## Typography

This design system employs a high-contrast typographic hierarchy. **Plus Jakarta Sans** is utilized for headlines, offering a modern, slightly geometric character that feels premium and tech-forward. High weights (Bold/ExtraBold) are paired with tight letter-spacing for a "poster-like" impact.

**Inter** handles all functional and body text. Its neutral profile ensures that complex project descriptions and technical logs remain highly legible. We use a clear distinction between the two: Headlines are emotive and structural, while body text is utilitarian and efficient.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for the main content area, centered on a 12-column grid. Large vertical "breathing room" (120px+) is used between major sections to emphasize the minimalist aesthetic.

The rhythm is strictly 8px-based. Card layouts should utilize generous internal padding (32px) to allow content to feel "expensive" and uncrowded. On mobile, the system transitions to a fluid 4-column grid with reduced gutters (16px) to maintain touch-target integrity.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional shadows. 

1.  **Base Layer:** Rich Black solid background.
2.  **Mid Layer:** Glass cards with a `backdrop-filter: blur(12px)` and a subtle 1px border using `rgba(255, 252, 242, 0.1)`.
3.  **Top Layer:** Interactive elements (hovered cards) which trigger a "Glow" effect—an outer box-shadow with a 40px blur using a low-opacity Accent Orange.

This stacking creates a sense of physical material that is light and ethereal, fitting for a modern digital portfolio.

## Shapes

The shape language is **Rounded (Level 2)**. This strikes a balance between the precision of hard edges and the approachability of circles. 

- **Primary Cards:** 1rem (16px) corner radius.
- **Buttons and Inputs:** 0.5rem (8px) corner radius.
- **Timeline Nodes:** Fully rounded (pill/circle) to distinguish them as interactive anchors.
- **Images:** Should match the card radius (1rem) when nested.

## Components

### Card-Based Layouts
Project cards should use the glassmorphism style. On hover, the 1px border should brighten to Accent Orange, and the background image should subtly scale (1.05x) within its mask.

### Interactive Timeline
The timeline features a vertical Warm Gray line. Nodes are small Charcoal circles that expand into Accent Orange rings when hovered or active. Content "expands" from these nodes using a smooth spring animation.

### Chatbot UI & Inputs
Input fields use a Charcoal background with a 1px Warm Gray bottom border. Upon focus, the border transitions to Accent Orange with a subtle outer glow. The chatbot messages themselves should follow the glassmorphism rules: user messages have a higher opacity Off-White tint, while AI responses remain more translucent.

### Buttons
- **Primary:** Solid Off-White with Rich Black text.
- **Secondary:** Transparent with 1px Off-White border (Ghost style).
- **Iconic:** Accent Orange used only for critical actions or decorative glyphs.