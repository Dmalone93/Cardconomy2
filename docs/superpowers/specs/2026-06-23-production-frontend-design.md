# Production Frontend Design Spec

> **Purpose:** Define the design architecture, component library, UX patterns, and technical foundation for rebuilding Cardconomy as a production-ready Next.js application.

> **Date:** 2026-06-23

> **Status:** Draft

---

## 1. Overview

Cardconomy is currently a high-fidelity interactive prototype (React 18, in-browser Babel, localStorage state, window-based component sharing). This spec defines what the production frontend looks like — the design system, component library, page architecture, responsive strategy, user capability model, and technical stack.

### Goals

- Rebuild on a proper stack (Next.js, TypeScript, Tailwind) so the frontend is production-grade when the backend is ready
- Single codebase that works from mobile to desktop (replacing the current separate mobile/desktop files)
- Architecture that supports a 3-person team (designer, frontend dev, backend dev) working in parallel
- Sanity CMS for content/catalog data, mock API routes for transactional data — ready to swap for real APIs
- Structure shared logic so it can be reused in a future React Native app

### Non-Goals

- Building the backend (that comes later)
- Real payments, real auth verification, real-time WebSocket infrastructure
- Native mobile app (but the architecture should not prevent one later)

---

## 2. Design System Foundation

Built on the existing rebrand: Space Grotesk + Inter, emerald/gold, deep navy.

### 2.1 Colour Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | Emerald `#059669` | CTAs, active states, success |
| `brand-accent` | Amber `#d97706` | Premium, gold tier, highlights |
| `surface-dark` | Navy `#0f172a` | Dashboard cards, hero sections |
| `surface-default` | White `#ffffff` | Page backgrounds |
| `surface-subtle` | Slate `#f8fafc` | Card backgrounds, alternating rows |
| `border-default` | `#e2e8f0` | Dividers, card borders |
| `text-primary` | `#0f172a` | Headings, body |
| `text-secondary` | `#64748b` | Captions, metadata |
| `text-inverse` | `#ffffff` | Text on dark surfaces |
| `status-positive` | `#16a34a` | Price up, gains, in stock |
| `status-negative` | `#dc2626` | Price down, losses, errors |
| `status-warning` | `#d97706` | Expiring, attention needed |

### 2.2 Typography Scale

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `heading-xl` | Space Grotesk | 28px | 700 | Page titles |
| `heading-lg` | Space Grotesk | 22px | 600 | Section headers |
| `heading-md` | Space Grotesk | 18px | 600 | Card titles |
| `body-lg` | Inter | 16px | 400 | Primary body text |
| `body-md` | Inter | 14px | 400 | Secondary text, descriptions |
| `body-sm` | Inter | 12px | 400 | Captions, metadata, timestamps |
| `mono` | Geist Mono | 14px | 400 | Prices, card numbers, codes |

### 2.3 Spacing

4px base unit: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

### 2.4 Border Radius

`sm: 6px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `full: 9999px`

---

## 3. Component Library

Domain-specific components built on top of shadcn/ui primitives. Lives in `packages/ui`.

### 3.1 Card Display Components

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `CardArt` | Card image with skeleton loading, foil sheen overlay for holos, tap-to-zoom | `size: sm/md/lg/xl`, `foil: boolean` |
| `CardFan` | Fanned 3-card parallax hero (homepage) | `cards: Card[]` |
| `GradeChip` | Condition pill (NM, LP, MP, HP, DMG) with colour coding | `grade: string`, `graded: boolean` (PSA/BGS slab style) |
| `PriceTag` | Price display in GBP using Geist Mono, with optional delta arrow | `price: number`, `delta?: number` |
| `PriceChart` | Sparkline or full chart with 7D/30D/90D/1Y timeframes | `variant: sparkline/full`, `collapsible: boolean` |
| `DemandIndicator` | "X buyers want this" with donut chart (wants vs listed ratio) | Compact single-row layout |

### 3.2 Listing and Product Components

| Component | Description |
|-----------|-------------|
| `ListingCard` | Card art + name + set + condition + price + seller. Grid and list layout variants |
| `ProductCard` | Multi-seller view — card identity at top, seller rows below with price/condition/rating |
| `SellerRow` | Avatar, name, rating stars, trust tier badge, price, ship speed |
| `OfferCard` | Offer with status (pending/accepted/declined/countered), countdown timer, action buttons |
| `DiscountBadge` | "X% below market" badge for Hot Deals |

### 3.3 Dashboard Components

| Component | Description | Used By |
|-----------|-------------|---------|
| `HeroCard` | Dark gradient card with value, sparkline, and date range selector | All capability levels |
| `StatusTile` | Metric tile with icon, count, label, and optional CTA | Sellers, Shops |
| `AttentionItem` | "Needs attention" row with icon, description, urgency colour, action | All capability levels |
| `ActivityRow` | Activity feed item with coloured dot, description, timestamp | Sellers, Shops |
| `QueueCard` | Submission queue item with status pill (pending/graded/ready) | Shops |

### 3.4 Navigation and Layout

| Component | Description |
|-----------|-------------|
| `BottomNav` | Mobile tab bar — Home, Search, Sell, Trade, Profile. Active state with emerald fill |
| `TopBar` | Screen title + back button + optional actions (bell, gear, share) |
| `SideNav` | Desktop sidebar — same 5 sections, expandable with labels |
| `Sheet` | Bottom sheet (mobile) / side panel (desktop) for filters, actions, detail views |

### 3.5 Shared Primitives (from shadcn/ui)

Button, Dialog, Tabs, Toast, Dropdown, Input, Select, Badge, Avatar, Skeleton, Accordion, Tooltip

---

## 4. Page Architecture and Responsive Strategy

### 4.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `mobile` | < 640px | Single column, bottom nav, sheets for overlays |
| `tablet` | 640-1024px | Two-column where useful, bottom nav still |
| `desktop` | > 1024px | Side nav, multi-column layouts, panels instead of sheets |

One codebase, one set of routes. Components adapt — no separate mobile/desktop pages.

### 4.2 Page Map

| URL | Page | Mobile | Desktop |
|-----|------|--------|---------|
| `/` | Home | Single column feed: hero, game carousel, hot deals, daily movers, trending, sets, communities, ads | Two-column: main feed + sidebar (trending, watchlist preview) |
| `/search` | Search | Full-screen list/grid, filter sheet from bottom | Grid with persistent sidebar filters |
| `/card/[slug]` | Product | Stacked: art, finish tabs, seller rows, demand, chart | Two-column: art + details left, sellers + chart right |
| `/listing/[id]` | Listing Detail | Stacked: art, price, seller, offer CTA, history | Two-column: gallery left, details + actions right |
| `/sell` | Sell Hub | Three option cards stacked | Three cards in a row |
| `/sell/single` | List Card | Step wizard (full screen per step) | Step wizard in a centred card (max-width 640px) |
| `/sell/bulk` | Bulk List | Full screen scanner/batch flow | Centred card with wider table view |
| `/sell/to-shop` | Sell to Shop | Full screen 7-phase flow | Centred card |
| `/trade` | Trade | Match list, proposal builder sheet | Two-panel: matches left, proposal builder right |
| `/shop/[slug]` | Storefront | Stacked: banner, info, inventory grid | Banner hero, two-column: info sidebar + inventory grid |
| `/shop/enroll` | Shop Enrollment | 2-step wizard full screen | Centred card |
| `/shop/counter` | Shop Counter | Dashboard + grading queue | Multi-panel dashboard |
| `/dashboard` | Profile/Dashboard | Capability-adaptive dashboard, bottom nav active on Profile | Capability-adaptive dashboard in main content area |
| `/settings` | Settings | Full screen list | Settings panel (max-width 640px) |
| `/cart` | Cart | Full screen | Slide-out side panel |
| `/checkout` | Checkout | Full screen steps | Centred card (max-width 540px) |
| `/how-it-works` | How It Works | Stacked sections | Three-column persona flows |
| `/fees` | Fee Comparison | Stacked calculator | Side-by-side comparison table |

### 4.3 Navigation Behaviour

**Mobile:** `BottomNav` with 5 tabs (Home, Search, Sell, Trade, Profile). Each tab has its own navigation stack — tapping a tab returns to its root. `TopBar` shows back button when deeper than root.

**Desktop:** Persistent `SideNav` on the left (collapsed to icons at tablet, expanded with labels at desktop). No bottom nav. Breadcrumbs for deep pages (e.g., Home > Search > Product > Listing).

**Cart:** Floating cart icon with badge count (top-right on mobile, in SideNav on desktop). Opens as sheet on mobile, side panel on desktop.

**Search:** Accessible from the Search tab and via a search icon in the `TopBar` on every screen. Opens a command-palette style overlay on desktop, full-screen search on mobile.

---

## 5. Progressive User Capabilities

No persona selection. Everyone starts as a buyer. Capabilities unlock naturally based on actions.

### 5.1 Capability Unlocking

| Capability | Trigger | Verification Required | What is Verified |
|------------|---------|----------------------|------------------|
| **Browse and Buy** | Signup | Email + phone | Identity basics |
| **Sell** | Tap "Sell" first time | ID verification (passport/driving licence), payout method, accept seller terms | Real person, can receive payments |
| **Shop** | Register as LGS | All of the above + business name, company number, proof of premises (photo/utility bill), address | Legitimate business |

### 5.2 Dashboard Adaptation

The dashboard is additive — selling does not replace the buyer view, it adds seller sections below it.

| User State | Dashboard Shows |
|------------|----------------|
| **Browser only** (has not bought yet) | Onboarding prompts, trending, game preferences |
| **Active buyer** | Portfolio value, watchlist movements, buylist matches, recent orders |
| **Buyer + seller** | Everything above PLUS balance card, active listings, pending offers, items to ship |
| **Buyer + seller + registered shop** | Everything above PLUS revenue metrics, submission queue, bulk lot alerts, buylist performance |

On desktop, multiple hero cards sit in a row. On mobile, they stack with the most relevant first (based on recent activity).

### 5.3 Sell Tab Behaviour

| User State | Sell Tab Shows |
|------------|----------------|
| Not yet a seller | "Start selling" pitch with benefits, fee transparency, single CTA to activate |
| Active seller | Sell hub (single, bulk, sell to shop, trade) |
| Registered shop | Sell hub + Shop Counter access |

### 5.4 Visual Capability Cues

| Capability Level | Hero Card Gradient | Accent Usage |
|------------------|-------------------|--------------|
| Buyer only | Navy to slate | Emerald on watch/collection actions |
| Buyer + seller | Navy to emerald-dark | Emerald on earnings, amber on attention items |
| Buyer + seller + shop | Navy to amber-dark | Amber as primary accent, emerald for positive metrics |

### 5.5 Verification Badges (Visible to Other Users)

| Badge | Meaning |
|-------|---------|
| None | Browser/buyer only |
| `Verified Seller` | ID verified, payout set up |
| `Trusted Seller` | Verified + track record (X sales, Y% positive, Z months active) — earned, not applied for |
| `Verified Shop` | Business verified, physical premises confirmed |

---

## 6. Authentication and Onboarding

### 6.1 Signup (Clerk)

| Step | Screen | Details |
|------|--------|---------|
| 1 | Sign up | Email or social (Google, Apple). Name, email, password. No persona selection. |
| 2 | Verify email | Standard Clerk email verification |
| 3 | Game preferences | "What do you play?" Multi-select game tiles. Personalises the home feed. Skippable. |
| 4 | Done | Straight into the home page as a buyer/browser |

Three taps and browsing. No account type wizard.

### 6.2 Seller Activation (First Tap on Sell)

| Step | Screen | Details |
|------|--------|---------|
| 1 | Pitch | Benefits of selling. Fee transparency (4% seller fee). CTA: "Get verified to sell" |
| 2 | ID verification | Photo of passport or driving licence + selfie match. Mocked for now, Stripe Identity or Onfido later |
| 3 | Payout setup | Bank account details or Stripe Connect. Mocked for now |
| 4 | Seller terms | Accept terms of service |
| 5 | Done | Sell hub unlocks. Verified Seller badge appears. Dashboard gains seller sections |

### 6.3 Shop Registration

| Step | Screen | Details |
|------|--------|---------|
| 1 | Pitch | Benefits for LGS — free for early adopters, tools overview, storefront |
| 2 | Business details | Shop name, company number, address, contact |
| 3 | Proof of premises | Upload photo of shopfront or utility bill at business address |
| 4 | Games stocked | Which games they buy/sell |
| 5 | Review | Summary of submitted details. "We will verify within 48 hours" |
| 6 | Approved | Storefront builder unlocks, shop counter unlocks, dashboard gains shop sections |

Shop verification has a manual approval step (design for a short wait even if automated later).

---

## 7. Key Screen Designs

### 7.1 Home Page (`/`)

Mobile (single column, scroll):
1. **Search bar** — sticky at top, scan icon right-aligned
2. **CardFan hero** — 3 fanned cards with foil sheen on dark gradient
3. **Game carousel** — horizontal scroll, portrait tiles with character art + game logo
4. **Hot Deals** — horizontal scroll of `ListingCard` with `DiscountBadge`, "See all" link
5. **Daily Movers** — horizontal scroll of cards with price delta prominent
6. **Trending Cards** — vertical list of `ListingCard` in compact list mode
7. **Featured Sets** — horizontal scroll of set art tiles with name and card count
8. **Three Communities** — "Connecting the whole TCG community" with three pitch cards
9. **Ad carousel** — promotional banners, below the fold

Desktop adds a right sidebar: trending cards, watchlist preview (if logged in), recently viewed.

### 7.2 Search (`/search`)

Mobile:
- Search input at top with filter icon (opens filter sheet) and view toggle (grid/list)
- Browse mode tabs: Buy / Just Listed / Deals
- Results: grid (2 columns) or list (full width rows)
- Sticky "X results" bar with active filter pills, tap to remove

Desktop:
- Persistent left sidebar with all filters expanded
- Results in main area: grid (3-4 columns) or list
- Search input in TopBar

**Filters:**

| Filter | Type |
|--------|------|
| Game | Multi-select checkboxes |
| Set | Searchable multi-select (grouped by game) |
| Condition | Multi-select chips (NM, LP, MP, HP, DMG) |
| Price range | Dual slider + manual min/max inputs |
| Finish | Tabs or toggle (Standard / Foil) |
| Rarity | Multi-select chips |
| Seller type | Chips (Individual / Verified / Shop) |
| Sort | Dropdown — Price low/high, Recently listed, Most watched, Best deal |

### 7.3 Product Page (`/card/[slug]`)

Canonical page for a card showing all sellers.

Mobile (stacked):
1. **Card art** — large, tappable to zoom, foil overlay if applicable
2. **Card identity** — name, set, number, rarity, game badge
3. **Finish tabs** — Standard / Foil with separate pricing
4. **Market price** — current price with delta, "See all printings" link
5. **Demand indicator** — "X buyers want this" donut + "Add to wants" CTA
6. **Price chart** — collapsible, hidden by default, 7D/30D/90D/1Y
7. **Seller list** — `SellerRow` sorted by price: price, condition, `GradeChip`, seller name, rating, trust badge, ship speed
8. **Sticky bottom bar** — "Add to wants" (amber)

Desktop: Two column — card art + identity left, sellers + chart + demand right.

### 7.4 Listing Detail (`/listing/[id]`)

A specific seller's listing.

Mobile (stacked):
1. **Card art** — seller's photos in a swipeable gallery
2. **Price** — `PriceTag` large, with "X% below market" badge if applicable
3. **Condition** — `GradeChip` + detailed condition notes
4. **Seller info** — avatar, name, rating, trust badge, "See all listings" link, location
5. **Buyer protection** — explainer with fee shown
6. **Actions** — "Add to cart" (emerald) + "Make offer" (outline)
7. **Price history** — chart
8. **Similar listings** — horizontal scroll of other sellers

Desktop: Two column — gallery left, details + actions right.

### 7.5 Dashboard (`/dashboard`)

See Section 5.2 for capability-adaptive layout. Key layout notes:

- Desktop: multiple hero cards in a row, sections in a two-column grid
- Mobile: hero cards stacked (most relevant first based on recent activity), sections in single column
- Each section is a discrete component that can be conditionally rendered based on capability state

---

## 8. Loading, Empty, and Error States

### 8.1 Loading States

| Context | Treatment |
|---------|-----------|
| Card images | Skeleton rectangle with subtle pulse animation |
| Listing cards (grid) | Skeleton cards matching card layout — art placeholder, two text lines, price line |
| Dashboard sections | Skeleton hero card + skeleton rows |
| Full page load | TopBar renders immediately, content area shows skeletons matching expected layout |
| Search results | Skeleton grid/list matching current view mode |
| Price chart | Skeleton rectangle at chart dimensions with faded axis lines |

Skeletons match the shape of real content so the page does not jump when data arrives.

### 8.2 Empty States

| Screen | Empty State |
|--------|-------------|
| Search (no results) | Illustration + "No cards found" + suggestion to adjust filters + clear filters CTA |
| Watchlist | "Start watching cards" + explanation + CTA to browse |
| Collections | "Create your first collection" + CTA |
| Buylist | "Tell us what you want" + how matching works + CTA to search |
| Cart | "Your cart is empty" + CTA to browse |
| Active listings (new seller) | "List your first card" + CTA to sell hub |
| Submission queue (new shop) | "No submissions yet" + explanation of how sellers submit to shops |
| Offers | "No offers yet" + contextual tip for buyer/seller |

Every empty state explains what the feature does and gives a clear action. Never a blank screen.

### 8.3 Error States

| Scenario | Treatment |
|----------|-----------|
| API/network failure | Inline error banner at top of affected section with retry button. Page structure stays visible. |
| Image load failure | Grey placeholder with card game icon |
| Search timeout | "Taking longer than expected" + retry + suggestion to narrow filters |
| 404 (listing removed) | "This listing is no longer available" + similar cards suggestion |
| Permission denied | Contextual — trying to sell without verification shows the verification prompt, not a generic error |

Errors are localised to the section that failed. The rest of the page stays functional.

---

## 9. Motion and Interaction Design

Subtle and purposeful. Marketplace, not a portfolio site.

### 9.1 Page Transitions

| Transition | Animation |
|------------|-----------|
| Tab switch (bottom nav) | Instant swap, no animation |
| Push to detail page | Slide in from right (mobile), fade-in (desktop) — 200ms ease-out |
| Back navigation | Slide out to right (mobile), fade-out (desktop) — 150ms ease-out |
| Sheet open | Slide up from bottom (mobile), slide in from right (desktop) — 250ms spring |
| Sheet close | Reverse of open — 200ms ease-in |
| Dialog/modal | Fade in + scale from 95% to 100% — 200ms ease-out |

### 9.2 Micro-interactions

| Interaction | Animation |
|-------------|-----------|
| Add to cart | Button pulses emerald, cart icon bounces with +1 badge |
| Add to watchlist | Heart fills with scale bounce (1.0 to 1.2 to 1.0) — 300ms |
| Price delta appears | Number counts up/down briefly from 0 — 400ms |
| Toast notification | Slides up from bottom, auto-dismisses after 3s with progress bar |
| Pull to refresh (mobile) | Emerald spinner |
| Skeleton to content | Crossfade — 200ms |
| Tab content change (standard/foil) | Crossfade — 150ms |

### 9.3 Do Not Animate

- Search results appearing (instant)
- Filter changes (instant re-render)
- Typing/input (debounce the query, no animation)
- Scroll (native only, no scroll-linked animations on marketplace pages)

---

## 10. Notifications

### 10.1 Notification Types

| Notification | Who Gets It | Priority |
|-------------|-------------|----------|
| Order shipped / delivered | Buyer | High |
| Price drop on watched card | Buyer | Medium |
| Buylist match at your price | Buyer | High |
| New offer received | Seller | High |
| Offer expiring (countdown) | Seller | High — amber attention treatment |
| Item sold | Seller | High |
| Payout processed | Seller | Medium |
| New submission received | Shop | High |
| Bulk lot submitted | Shop | Medium |
| Restock alert | Shop | Medium |
| Trade proposal received | Buyer/Seller | Medium |
| Trade proposal accepted | Buyer/Seller | High |

### 10.2 Notification Centre

**Mobile:** Full-screen list grouped by today / this week / earlier. Each notification tappable — navigates to the relevant screen.

**Desktop:** Dropdown panel from bell icon. Same grouping. "See all" opens full notification page.

**Preferences:** Toggle each type on/off in settings, grouped by category (Orders, Offers, Price alerts, Shop).

### 10.3 Real-time (Future-proofed)

- Offer counters/timers tick down in real-time
- Price deltas update periodically (poll every 60s initially, WebSocket later)
- "New offer" appears in activity feed without page refresh
- Toast for high-priority events when the app is open

Components are designed to display updating data. The mock API returns static data — when the backend adds WebSocket or SSE support, the frontend is ready.

---

## 11. Data Architecture

### 11.1 Sanity (Content/Catalog Layer)

Managed by the designer through Sanity Studio. No code changes needed to update content.

| Schema | Fields | Notes |
|--------|--------|-------|
| `game` | name, slug, logo, colour, description | Pokemon, MTG, Yu-Gi-Oh, One Piece, Lorcana |
| `card` | name, number, set (ref), rarity, types, image, game (ref) | Canonical card identity |
| `set` | name, code, game (ref), release date, card count, image | Grouping for cards |
| `cardPrinting` | card (ref), set (ref), finish (standard/foil/reverse), image | One card, many printings |
| `shop` | name, slug, location, hours, banner, description, games (ref[]) | Shop directory content |
| `guide` | title, slug, body (portable text), category, game (ref) | Editorial content |
| `pitchPage` | title, slug, persona, body (portable text), hero image | Seller/LGS pitch pages |

### 11.2 Mock API Routes (Transactional Layer)

Replaced by the real backend later. Frontend code does not change — only the URL targets.

| Endpoint | Data | Notes |
|----------|------|-------|
| `/api/listings` | Listings with price, condition, seller, card ref | Filterable, sortable |
| `/api/offers` | Offer state (pending/accepted/declined/countered) | Per-user |
| `/api/orders` | Order status, tracking, history | Per-user |
| `/api/cart` | Cart items | Per-session |
| `/api/trades` | Trade proposals, matches | Per-user |
| `/api/watchlist` | Watched cards + buylists | Per-user |
| `/api/collections` | Named collections with cards | Per-user |
| `/api/dashboard/[persona]` | Pre-composed dashboard data per capability level | Aggregated |

---

## 12. Technical Recommendations

Guidance for the development team. Brief — the developers own these decisions.

| Decision | Recommendation | Why |
|----------|---------------|-----|
| Framework | Next.js 15, App Router | SSR for product/listing pages (SEO), client components for dashboards |
| Monorepo | Turborepo | Clean separation for 3-person team |
| Components | shadcn/ui + Tailwind v4 | Own every component, easy to theme |
| Client state | Zustand | Lightweight per-domain stores (cart, auth, UI) |
| Server state | TanStack Query | API caching/fetching, mock-to-real backend swap |
| CMS | Sanity | Card catalog, sets, games, editorial — managed through Studio |
| Auth | Clerk | Signup, email/social, session management |
| Types | TypeScript strict mode | Catch bugs early, shared types across packages |
| Hosting | Vercel | Already deployed there, natural fit with Next.js |
| Mock data | Next.js API routes returning JSON | Same interface the real backend will implement |

### 12.1 Monorepo Structure

```
cardconomy/
  apps/
    web/              -- Next.js App Router (main app)
    studio/           -- Sanity Studio (content editing UI)
  packages/
    ui/               -- shadcn/ui + domain components
    store/            -- Zustand stores + TanStack Query hooks
    types/            -- Shared TypeScript types
    sanity/           -- Sanity schemas, client, GROQ queries
  tooling/
    eslint-config/    -- Shared ESLint rules
    ts-config/        -- Shared TypeScript config
```

### 12.2 Team Workflow

- **Designer (you):** Sanity Studio for content, design tokens in `packages/ui/tokens`, brand/styling decisions, AI-assisted component design
- **Frontend dev:** `apps/web` routes and features, `packages/ui` components, `packages/store` state management
- **Backend dev:** `packages/sanity` schemas initially, later builds the real API that replaces mock routes

---

## 13. Migration Strategy

This is a rebuild, not a refactor. The prototype remains live at cardconomyy.vercel.app as the demo while the production app is built separately.

### Phase approach (high level):

1. **Foundation:** Monorepo scaffold, design tokens, shadcn/ui setup, Sanity schemas, Clerk auth, base layout (TopBar, BottomNav, SideNav)
2. **Browse flow:** Home, Search, Product, Listing — connected to Sanity for card/set data
3. **Account flow:** Signup, onboarding, dashboard (buyer level), settings, cart, checkout
4. **Sell flow:** Seller activation/verification, sell hub, single listing wizard, bulk listing
5. **Trade and shop:** Trade matching, storefront, shop enrollment, shop counter
6. **Polish:** Loading/empty/error states, motion, notifications, responsive refinement

Each phase is independently deployable and testable.
