# Cardconomy — Complete Project Handover

> **Read this before touching any code.** This document covers the project goals, architecture, conventions, market context, and product decisions. It is the single source of truth for any AI agent or developer picking up this project.

---

## What Is Cardconomy?

Cardconomy is a **UK-focused trading card marketplace** connecting three personas — collectors (buyers), individual sellers, and local game stores (LGS) — in one platform. It is currently a **high-fidelity interactive prototype** (not a production app) with working navigation, state persistence, and realistic mock data.

**Live URL:** cardconomyy.vercel.app

**Two entry points:**
- `index.html` — Mobile app (iOS device frame, 402x874px)
- `Desktop.html` — Desktop responsive site (redirects to mobile below 760px)

---

## Project Goals

1. **Demonstrate the product vision** at trade shows and to investors — every flow must be walkable end-to-end
2. **Three distinct user experiences** — buyer dashboard, seller dashboard, store dashboard — each purpose-built
3. **Differentiate from incumbents** (eBay, Cardmarket, Whatnot, TCGplayer) through local-first infrastructure, scan-to-sell, and LGS tools
4. **UK market first** — all prices in GBP, UK-specific pain points (post-Brexit Cardmarket friction, no domestic TCG marketplace)

---

## Tech Stack & Architecture

### Stack
- React 18 (UMD globals from unpkg CDN, no modules)
- In-browser Babel for JSX compilation (dev), pre-compiled for Vercel (prod)
- No backend, no database — all state in localStorage, all data is mock
- Static deployment on Vercel

### Critical Convention: Window-based Sharing

Each `.jsx` file runs in its own scope (IIFE-wrapped in production). Components are shared via `window`:

```jsx
// Exporting (bottom of file)
Object.assign(window, { HomeScreen, ListCard, SectionHeader });

// Importing (top of consuming file)
const { HomeScreen, ListCard } = window;
```

**Theme aliases are per-file** to avoid collisions:
```jsx
// screen_home.jsx uses suffix H
const { T: TH, Icon: IconH, money: moneyH } = window;

// screen_watchlist.jsx uses suffix W
const { T: TW, Icon: IconW, money: moneyW } = window;
```

When editing a file, **match its existing alias pattern**.

### Script Load Order (index.html)

Order matters — a file can only access what earlier files exported:

1. `ios-frame.jsx` — Device frame
2. `image-slot.js` — Image upload utility
3. `tweaks-panel.jsx` — Theme controls
4. `data.jsx` — All mock data (GAMES, SETS, LISTINGS, SHOPS, etc.)
5. `card_images.jsx` — Live card art resolver
6. `components.jsx` — Shared UI kit (T, money, CardArt, Icon, Sheet, etc.)
7. `screen_*.jsx` (21 files) — Mobile screens
8. `app.jsx` — App shell, navigation, state
9. `cc-tweaks.jsx` — Theme switcher

**To add a new screen:** Create `screen_foo.jsx`, add `<script type="text/babel" src="screen_foo.jsx">` before `app.jsx` in `index.html`, register in `SCREENS` map in `app.jsx`, export component to `window`.

### Build & Deployment

```bash
npm run build          # Compiles JSX to JS, wraps in IIFE, copies to dist/
```

`vercel.json` configures Vercel to run the build and serve `dist/`.

---

## State Management

All state lives in `app.jsx` and is passed as an `app` prop to every screen.

### Key State (all persisted to localStorage)

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `cc_acct` | 'buyer'\|'seller'\|'store' | 'buyer' | Account type — changes dashboard view |
| `cc_watch` | string[] | ["l03","l05"] | Watched card IDs |
| `cc_cart` | string[] | [] | Cart item IDs |
| `cc_tier` | number | 0 | Trust tier (0=unverified, 1=ID verified, 2=trusted) |
| `cc_prefs` | string[] | all game IDs | Followed games (filters home feed) |
| `cc_onboarded` | boolean | false | Has user completed onboarding |
| `cc_collections` | object[] | 2 seed collections | Named card collections |
| `cc_buylist_v2` | object[] | 4 seed cards | Buylist entries with max prices |

### Navigation API

```jsx
app.nav.push('listing', { id: 'l01' })  // Push screen onto stack
app.nav.pop()                            // Go back
app.nav.setTab('search')                 // Switch tab (clears stack)
app.toast('Message')                     // Show toast notification
```

---

## File Inventory

### Mobile Screens (21 files)

| File | Lines | What It Does |
|------|-------|-------------|
| screen_home.jsx | 535 | Browse feed: ads, trending, sets, guides |
| screen_search.jsx | 336 | Search with filters, sort, grid/list toggle |
| screen_listing.jsx | 329 | Card detail: price history, offers, seller info |
| screen_product.jsx | 291 | Multi-seller product page |
| screen_sell.jsx | 288 | Single card listing wizard (5 steps) |
| screen_sellhub.jsx | 154 | Sell entry: marketplace, local shop, or trade |
| screen_sellbulk.jsx | 239 | Bulk listing with LiveSweep scanner |
| screen_sellshop.jsx | 525 | Sell to local shop flow (7 phases) |
| screen_shop.jsx | 798 | Shop counter view (dashboard + grading) |
| screen_trade.jsx | 588 | Trade matching and proposal builder |
| screen_storefront.jsx | 937 | Shop storefront + enrollment wizard |
| screen_watchlist.jsx | 745 | Watch/Collection + 3 dashboard views (Buyer/Seller/Store) + Settings |
| screen_account.jsx | 596 | Buylist, Purchases, Selling, Offers, Payments, Notifications |
| screen_scan.jsx | 292 | Camera scan mock with result sheet |
| screen_cart.jsx | 103 | Shopping cart |
| screen_checkout.jsx | 196 | Checkout flow |
| screen_verify.jsx | 203 | Verification (phone, ID, payout) |
| screen_authcard.jsx | 143 | Card authentication flow |
| screen_seller.jsx | 195 | Public seller profile |
| screen_shopfinder.jsx | 76 | Shop directory |
| screen_onboarding.jsx | 133 | First-run account type + game prefs |

### Desktop Screens (7 files)

| File | Lines | What It Does |
|------|-------|-------------|
| desktop.jsx | 1057 | Desktop shell, routing, 3 account views (Buyer/Seller/Store) |
| desktop_home.jsx | 189 | Desktop browse feed |
| desktop_search.jsx | 163 | Desktop search with sidebar filters |
| desktop_listing.jsx | 208 | Desktop card detail |
| desktop_sell.jsx | 300 | Desktop sell flows |
| desktop_trade.jsx | 221 | Desktop trade + storefront + shop dashboard |
| desktop_seller.jsx | 158 | Desktop seller profile |

### Shared Files

| File | Purpose |
|------|---------|
| components.jsx (508 lines) | Theme (T), money(), CardArt, Slab, GradeChip, Icon (40+ SVGs), Badge, BottomNav, SideMenu, Sheet, Toast |
| data.jsx (1308 lines) | Mock data: 5 games, 40+ sets, 64+ listings, shops, traders, sellers, products |
| card_images.jsx (130 lines) | Live card art from Scryfall/pokemontcg.io/YGOPRODeck APIs, cached in localStorage |
| ios-frame.jsx (349 lines) | iOS device frame with status bar |
| build.js (75 lines) | Build script for Vercel deployment |

---

## Three Dashboard Views

The profile tab shows different content based on `app.acct`:

**Buyer:** Portfolio value hero, needs attention (buylist matches, orders, price drops), watchlist movements, buylist matches, recent orders

**Seller:** Balance card with sparkline, status tiles (listings/offers/shipments), activity feed, collection + buylist rows, needs attention (expiring offers, items to ship)

**Store:** Revenue card with date range, needs attention (submissions, bulk lots, restock), queue stats, submission queue with status pills, buylist performance

Switch via Settings (gear icon) > Account type.

---

## Market Context (Verified Data)

Reference `docs/tcg-market-research-uk-eu.md` for all sourced numbers. Key facts:

**Market size:**
- European TCG market: $1.34B (2025), growing at 7.6% CAGR
- UK is one of the two largest European TCG markets (alongside Germany)
- No clean UK-only TCG figure exists in public data

**Competitor fees (all-in, verified 2026):**
- eBay UK (business): 12-15%
- Cardmarket: 6-8% (1.5-5% commission + extras)
- Whatnot UK: ~11-12% (6.67% + VAT + processing)
- TCGplayer: ~13-14% (10.75% + 2.5% + $0.30)

**UK-specific dynamics:**
- Post-Brexit friction killed low-value cross-border trades on Cardmarket
- UK collectors increasingly transact domestically — no dominant UK-native marketplace exists
- GAME (300-store chain) closed all standalone stores by April 2026
- Card Synced (0% fees) and PACKRAT (AI scanning) are emerging UK competitors
- PACKRAT already has AI card identification — scanning is not unique to Cardconomy

**Counterfeiting:** 125% increase in counterfeit cards (2025). Fakes now appear in raw singles, sealed product, and graded slabs.

**Demographics:** 68% of collectors are 18-34. Adults dominate spending.

---

## What NOT To Do

1. **Never fabricate numbers** — no market sizes, fees, or statistics without verified sources. Ask the user or research first. See `docs/tcg-market-research-uk-eu.md` for what is safe to claim.
2. **Never use bare `T`, `Icon`, `money`** in a screen file — always use the file's existing alias suffix.
3. **Never add hex colors directly** — use `T.*` or `var(--)` CSS variables.
4. **Never use apostrophes in single-quoted JS strings** — use `\u2019` or avoid contractions.
5. **Never name a style object just `styles`** — use component-specific names or inline styles.
6. **Never skip the IIFE wrapping** — `build.js` wraps compiled files to prevent `const` redeclaration.
7. **Always push after committing** — the user expects immediate deployment to Vercel.

---

## Product Decisions (Undecided)

These are NOT confirmed — do not state them as fact:

| Decision | Status |
|----------|--------|
| Seller fee percentage | Undecided — prototype shows 9% as placeholder |
| Buyer protection fee | Placeholder (1.5% + 50p in prototype) |
| Shop pricing model | "Free for early adopters" — long-term model TBD |
| Revenue model | Not finalised |
| Launch games | Prototype has 5: Pokemon, MTG, Yu-Gi-Oh, One Piece, Lorcana (Digimon in data but not prominent) |

---

## Documentation Index

| Document | Location | Purpose |
|----------|----------|---------|
| This handover | `HANDOVER.md` | Complete project context for new agents |
| User flows & features | `docs/user-flows-and-features.md` | Every screen and navigation path |
| Pitch deck (markdown) | `docs/cardconomy-pitch-deck.md` | Trade show talking points |
| Pitch deck (HTML slides) | `docs/cardconomy-deck.html` (also on Desktop) | Presentable slide deck |
| Market research | `docs/tcg-market-research-uk-eu.md` | Verified UK/EU TCG market data with sources |
| Design spec | `docs/superpowers/specs/2026-06-13-dashboard-redesign-and-scan-flow-design.md` | Dashboard + scan flow spec |
| Implementation plan | `docs/superpowers/plans/2026-06-13-dashboard-redesign-and-scan-flow.md` | Task-by-task implementation plan |

---

## Quick Start for New Agents

1. Read this document fully
2. Read `docs/tcg-market-research-uk-eu.md` before making any market claims
3. Read the specific screen file before editing it — match its alias pattern
4. Run `npm run build 2>&1 | tail -5` after changes to verify compilation
5. Commit and push (user expects immediate Vercel deployment)
6. Ask the user before adding features, making claims, or changing product decisions
