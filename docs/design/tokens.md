# Design tokens: "szerelmes levél"

Source: `implementation-plan.md` → "Design theme". No mockups exist; this file is the visual contract. Tokens live in `src/index.css` under Tailwind v4 `@theme`.

## Colours

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#fbf5ec` | App background, manifest theme/background colour |
| `paper-deep` | `#f3e7d8` | Cards, letter sheet, unselected option tiles |
| `blush` | `#f2d5d0` | Locked envelopes, chips, selected tile bg |
| `rose` | `#c96f7b` | Hearts, progress, accents (decorative only) |
| `wine` | `#6e2435` | Wax seal, primary buttons, headings |
| `ink` | `#3b2a2f` | Body text |
| `gold` | `#b5915a` | Hairlines, stamp edges, seal highlight (decorative only) |

Rules: text is always `ink` or `wine`. Rose/gold too light for small text. No pure white (`#fff`) or black (`#000`). Light mode only (`color-scheme: light`).

## Fonts

| Token | Family | Use |
| --- | --- | --- |
| `font-display` | Cormorant Garamond 600 (+ italic), fallback `ui-serif, Georgia, serif` | Stage titles, countdown numerals, reveals; `text-3xl`+ |
| `font-body` | Nunito Sans 400/700, fallback `ui-sans-serif, system-ui, sans-serif` | Questions, options, buttons; `text-base`, inputs ≥ 16px |
| `font-hand` | Caveat 500, fallback `cursive` | Dávid's messages, polaroid captions, the letter; `text-xl`+ |

Self-host via `@fontsource`, import `latin` + `latin-ext` subsets (ő ű Ő Ű must render in all three).

## Radius and shadow

| Token | Value |
| --- | --- |
| `rounded-card` (`--radius-card`) | `1.25rem` |
| `shadow-card` (`--shadow-card`) | `0 8px 24px -12px rgb(110 36 53 / 0.25)` |
| `shadow-seal` (`--shadow-seal`) | `0 2px 6px rgb(110 36 53 / 0.4)` |

## Component looks

| Component | Look |
| --- | --- |
| Primary button | `bg-wine text-paper`, fully rounded, ≥ 48px tall |
| Secondary button | wine text, 1px gold border, fully rounded |
| Selected option tile | `bg-blush`, wine border, small heart; unselected `bg-paper-deep` |
| `EnvelopeCard` | Locked: blush envelope, closed flap as SVG triangle, wax seal with "?". Open: flap up, title in display font, stamp slot top right |
| `WaxSeal` | Wine SVG disc, irregular edge, heart in centre, gold highlight; also app icon and admin trigger |
| `Stamp` | Perforated edge (radial-gradient mask), gold frame, one line icon per stage, rotated -4..4° |
| `Polaroid` | Off-white (paper-tinted, not pure white) frame, slight rotation, caption in `font-hand` |
| `Countdown` | Display-font numerals on a blush chip |
| `StageScreen` | Full screen, back chevron, message block in `font-hand` on `paper-deep` with gold left rule |
| `Wheel` | SVG wheel alternating blush / paper-deep segments, wine pointer |

## Layout

Single column `max-w-md mx-auto px-5 min-h-dvh`, `env(safe-area-inset-*)` padding top and bottom. Background carries a faint paper grain from an inline SVG noise filter at ~4% opacity (no network image).

## Motion

- Unlock: seal cracks, flap lifts, ~600 ms, once per stage.
- Stamp: scale 1.3 → 1 with small rotation (pressed onto paper).
- Confetti: petals in rose, blush, gold on stamp landing and podium.
- All wrapped in `motion-safe:`; none under `prefers-reduced-motion`.
