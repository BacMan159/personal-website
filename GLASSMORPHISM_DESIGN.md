# Blue Glassmorphism UI Kit — Design Reference

Source: [Kit UI - Glassmorphism trend](https://www.behance.net/gallery/113924121/Kit-UI-Glassmorphism-trend) by Giuseppe Fasino (2021). Extracted from the blue colorway of the kit.

## Background

- Diagonal linear gradient, light blue (top-left) → saturated cyan-blue (bottom-right).
  - `#5AC8FA` → `#0A84FF` (approx; light sky blue to deep azure)
- Decorative floating orbs: solid darker-blue circles (`#0066CC`-ish), various sizes (24px–160px), placed at loose corners of the composition, some partially bleeding off-canvas. Purely ornamental, no blur on the orbs themselves — the blur lives in the glass elements.

## Glass surface treatment

All components share the same "glass" recipe, only the base hue changes across colorways (blue/orange/green/coral):

- **Fill**: semi-transparent white-to-base-color gradient, roughly `rgba(255,255,255,0.35)` at the lighter end fading toward the panel's own hue at `~0.15` alpha — gives a frosted, slightly uneven tint rather than a flat overlay.
- **Backdrop blur**: strong, ~20–30px equivalent (`backdrop-filter: blur(24px)`), enough to fully soften whatever orb/shape sits behind it while still showing color bleed-through.
- **Border**: thin 1px inner highlight, `rgba(255,255,255,0.5)`, visible mostly along the top edge — simulates a light catching glass edge.
- **Shadow**: soft, diffuse drop shadow in the base hue, low opacity, large blur radius, small offset (`0 8px 24px rgba(0,90,200,0.25)`) — reads as "floating," not a hard elevation shadow.
- **Corner radius**: consistently large relative to element size — full pill (`9999px`) for bars/buttons/inputs, ~20–24px rounded-square for icon tiles and app-icon squares.

## Typography

- Wordmark "GLASSMORPHISM": all-caps, wide letter-spacing (~0.3em), thin/light-weight geometric sans-serif, white, centered.
- Field/button labels ("Select", "Search…"): regular-weight geometric sans-serif, white, left-aligned with generous horizontal padding.
- Small badge text ("45%"): same family, smaller size, medium weight.

## Color roles (blue colorway)

| Token | Value | Use |
|---|---|---|
| `--glass-bg-start` | `#6FD3FF` | gradient top |
| `--glass-bg-end` | `#0A84FF` | gradient bottom |
| `--glass-fill` | `rgba(255,255,255,0.28)` | component background |
| `--glass-border` | `rgba(255,255,255,0.5)` | 1px top-edge highlight |
| `--glass-shadow` | `rgba(6,80,170,0.25)` | drop shadow |
| `--glass-orb` | `#0059C7` | decorative circles |
| `--text-on-glass` | `#FFFFFF` | all labels/icons |

## Components observed

- **Slider / progress bar**: pill track, filled portion in solid lighter glass tone, unfilled portion in more transparent glass; floating percentage tooltip (small rounded-rect speech-bubble) above the thumb.
- **Dropdown / select**: full-width pill, label left, chevron-down icon right, two stacked as a duplicate pair with different fill opacity to show a "default vs. hover/active" state.
- **Icon buttons — circular**: avatar/person, star (favorite/rating), used at consistent ~72px diameter.
- **Icon buttons — rounded-square**: chevron-down, heart, star, previous/next chevrons, play/pause — all ~90px squares with ~24px radius.
- **Share/dropdown combo bar**: pill bar with a share-node icon on the left and a chevron on the right, shown twice at different opacities (state variants).
- **Search bar**: pill input with magnifying-glass icon + "Search…" placeholder text, left-aligned icon + label pattern reused from the select components.
- **Media transport row**: previous / play-pause / next as three equal rounded-square buttons in a horizontal row.
- **Toggle switches**: pill track with a solid white circular thumb, on/off state shown by thumb position (left = off, right = on) — seen in the alternate (orange/green/coral) panels, same shape language applies to blue.
- **Vertical sliders / equalizer bars**: tall pill-shaped tracks of varying heights with a solid-white rounded-cap fill from the bottom or a draggable circular thumb — same panel, alternate colorway crops.
- **App-icon tile**: large rounded-square glass tile with a bold centered glyph/wordmark (e.g. "Ai"), used as a brand/app icon example.

## Implementation notes (CSS)

```css
.glass-panel {
  background: linear-gradient(135deg, rgba(255,255,255,0.35), rgba(10,132,255,0.15));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 9999px; /* or 24px for square tiles */
  box-shadow: 0 8px 24px rgba(6,80,170,0.25);
  color: #fff;
}
```

Requires a colorful, non-flat background behind glass elements (gradient + blurred orbs) — on a flat/neutral background the frosted effect reads as flat and loses the glassmorphism look.
