# Cardconomy02 — Agent Instructions

**Before doing anything, read `HANDOVER.md` in this project root.** It contains the complete project context, architecture, conventions, and market data. Do not skip it.

## Key Rules

- **Never fabricate numbers.** No market sizes, fees, or statistics without verified sources. Reference `docs/tcg-market-research-uk-eu.md` before making any claims.
- **Always push after committing.** The user expects immediate Vercel deployment.
- **Match existing code patterns.** Each JSX file uses per-file theme aliases (e.g. `TW`, `TH`). Read the file before editing.
- **No apostrophes in single-quoted JS strings.** Use `\u2019` or avoid contractions.
- **Ask before deciding.** Fees, pricing, revenue model, and market positioning are undecided. Do not state them as fact.

## Project Overview

Cardconomy is a UK-focused trading card marketplace prototype (React 18, in-browser Babel, Vercel). Three personas: buyer, seller, local game store. Each has a purpose-built dashboard. All state is client-side (localStorage).

## Documentation

- `HANDOVER.md` — Complete technical and product context (read first)
- `docs/user-flows-and-features.md` — Every screen and navigation path
- `docs/tcg-market-research-uk-eu.md` — Verified UK/EU market data with sources
- `docs/cardconomy-pitch-deck.md` — Trade show talking points
- `docs/cardconomy-deck.html` — Presentable HTML slide deck
