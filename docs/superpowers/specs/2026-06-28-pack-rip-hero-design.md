# Pack Rip Homepage Reveal — Design Spec

## Concept

The homepage opens with a full-screen Cardconomy booster pack wrapper that tears open to reveal the actual website content beneath it. The metaphor: landing on Cardconomy feels like ripping a fresh pack — the marketplace IS the pull.

## Sequence

1. **Page loads** — full-screen pack wrapper covers everything. Dark background matching `var(--fill)`. Cardconomy logo centered. Subtle diagonal stripe pattern and holographic shimmer sweeps across once.
2. **~0.3s** — small "tap anywhere" hint fades in at the bottom.
3. **~1.2s** (or on tap, whichever comes first) — the pack tears open from center vertically. Jagged torn edge via SVG clip-path. Bright white/gold glow leaks through the tear.
4. **~1.2–2.0s** — left and right halves drift apart, scale down slightly, fade to 0. Brief sparkle particles scatter along the tear line (4-5 dots, fade quickly).
5. **~2.0s** — homepage content fades from 0.9 to 1.0 opacity. Pack rip complete. Normal homepage fully interactive.

## Pack Wrapper Design

- Full-screen overlay, `position: fixed`, `z-index: 9999`
- Background: `var(--fill)` dark
- Cardconomy logo centered (use `brand/logo-wordmark.svg`)
- Repeating diagonal stripe pattern at ~5% opacity (CSS repeating-linear-gradient)
- Holographic shimmer: a single bright gradient band that translates across the surface over ~0.8s

## Tear Animation

- Vertical center tear using CSS clip-path on two half elements
- Jagged edge: SVG polygon path with irregular points simulating torn paper
- Glow: `box-shadow` or a pseudo-element behind the tear line, white/gold, blurred
- Left half animates: `translateX(-60%) scale(0.95) opacity(0)`
- Right half animates: `translateX(60%) scale(0.95) opacity(0)`
- Duration: ~0.8s with ease-out timing
- Sparkle particles: 4-5 small circles (3-5px), absolute positioned along tear line, animate outward + fade over 0.6s

## Homepage Content

- Already rendered behind the wrapper (just hidden by the overlay)
- As wrapper clears, content opacity transitions from 0.9 to 1.0 over 0.3s
- No delay to interactivity — content is live as soon as wrapper fades

## Session Behaviour

- `sessionStorage.getItem('cc_pack_ripped')` checked on mount
- If NOT set: show pack rip, set `cc_pack_ripped = '1'` after animation completes
- If set: skip entirely, show homepage immediately
- Resets when user closes the tab/browser (sessionStorage behaviour)

## Implementation Location

- New component `PackRip` in `components.jsx` or a dedicated `pack_rip.jsx`
- Rendered in `app.jsx` at the top level, above all other content
- Component self-removes from DOM after animation completes (setState to null)

## Scope

- Mobile and desktop (responsive — pack scales to viewport)
- CSS-only animation (no JS animation libraries)
- No interaction required (auto-plays), but tap/click triggers early if user is impatient
- Total new code: ~120-150 lines (one component + keyframes)

## What This Does NOT Include

- No sound effects
- No per-game pack variants (single Cardconomy-branded pack)
- No skip button (the animation is short enough to not need one)
