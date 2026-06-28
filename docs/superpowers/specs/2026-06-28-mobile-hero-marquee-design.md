# Mobile Hero — Stacked Layout with Horizontal Marquee

**Date:** 2026-06-28

## Problem

The current mobile hero has two columns of cards scrolling vertically in the right 48% of the screen. On narrow mobile viewports (~375px), the cards are squished and clipped on both sides — you can't see full card faces. The constant vertical scroll also competes with the text/CTAs for attention.

## Solution

Replace the split overlay layout with a vertically stacked layout:

1. **Top: Full-width text block** — headline, subtitle, two CTA buttons, trust badges. No card visuals competing. Dark background (`var(--fill)`).
2. **Bottom: Horizontal card marquee** — a single row of cards scrolling continuously to the left.

## Marquee Specification

- **Cards:** Same 6 as current hero — Charizard ex (l01), Ragavan (l06), Pidgeot ex (l09), Black Lotus (l05), Pikachu (l02), Mewtwo (l04)
- **Card width:** 140px, full aspect ratio (~195px tall)
- **Gap:** 6px between cards
- **Animation:** Continuous scroll-left, ~80s duration, linear, infinite loop
- **Seamless loop:** Cards duplicated once (12 total rendered) so the strip wraps without gaps
- **Edge treatment:** Left and right gradient scrims fading into `var(--fill)`
- **Strip height:** ~210px including vertical padding

## Layout Dimensions

- **Text block:** ~190px height (headline, subtitle, CTAs, badges with padding)
- **Card strip:** ~210px height
- **Total hero:** ~400px
- **Background:** `var(--fill)` (#0f172a) throughout

## Animation CSS

```css
@keyframes heroScrollLeft {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

The inner container holds all 12 cards in a row. Translating by -50% moves exactly one set of 6 off-screen, at which point the loop resets seamlessly.

## Files to Modify

- `screen_home.jsx` — replace the `CardFan` component internals (keep the same function name and interface)

## What Does Not Change

- Card data source (HERO_COLS / byId)
- Text content (headline, subtitle, CTAs, trust badges)
- CardArt component usage
- Dark background color
