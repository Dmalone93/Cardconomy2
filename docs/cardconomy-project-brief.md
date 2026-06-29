# Cardconomy — Complete Project Brief

> Everything you need to understand and discuss this project. Copy this into any AI conversation for full context.

---

## What Is Cardconomy?

Cardconomy is a **UK-focused trading card marketplace** that connects three communities in one platform:

1. **Collectors/Buyers** — browse, buy, watch prices, build collections, set buylists
2. **Individual Sellers** — list cards (single or bulk), manage offers, ship orders, track earnings
3. **Local Game Stores (LGS)** — run a digital storefront, accept submissions for grading, manage buylist inventory, process bulk trade-ins

**Live prototype:** cardconomyy.vercel.app

---

## The Three Selling Points

### 1. Lowest Fees in TCG

Total take rate: **6% + 30p** (4% seller fee, 2% + 30p buyer fee).

Compared to competitors:
- eBay UK (business): 12-15%
- Cardmarket: ~6-8% (but EU-focused, euros, post-Brexit friction)
- Whatnot UK: ~11-12%
- TCGplayer: ~13-14% (US-only)
- CardNexus: ~7.5% (EU-focused)

### 2. UK-First

The only dedicated UK trading card marketplace. No competitor is UK-native:
- All prices in GBP
- Domestic shipping only (no cross-border friction)
- Post-Brexit killed low-value Cardmarket trades for UK sellers
- UK collectors increasingly transact domestically but have no home platform
- GAME (300-store chain) closed all standalone stores by April 2026, leaving a retail gap

### 3. Three-Community Bridge

No competitor connects all three audiences:
- **Cardmarket** has no LGS integration or trading
- **eBay** has no community features, no trading
- **TCGplayer** is US-only, no real trading
- **Whatnot** is live-auction focused, no LGS tools
- **CardNexus** has no LGS integration or trading

Cardconomy bridges buyers, sellers, and shops with shared infrastructure: a seller can list on the marketplace AND sell to a local shop. A shop can source inventory from sellers AND sell to collectors. A collector can buy from anyone, trade with anyone, and sell to shops.

---

## Market Context

### Size
- European TCG market: $1.34B (2025), growing at 7.6% CAGR
- UK is one of the two largest European TCG markets (alongside Germany)
- No clean UK-only figure exists in public data

### Demographics
- 68% of collectors are 18-34
- Adults dominate spending
- The market is increasingly mainstream, not niche

### Counterfeiting
- 125% increase in counterfeit cards in 2025
- Fakes now appear in raw singles, sealed product, and graded slabs
- Authentication and trust infrastructure is a differentiator

### UK Competitors
- **Card Synced** — 0% fees, early stage
- **PACKRAT** — AI card scanning, identification
- Neither has LGS integration or a full marketplace

---

## Supported Games

1. **Pokemon** — largest by volume
2. **Magic: The Gathering** — highest per-card values
3. **Yu-Gi-Oh!** — strong competitive scene
4. **One Piece TCG** — fastest growing
5. **Lorcana** — Disney IP, newer market

---

## Current State

### What Exists (Prototype)

A **high-fidelity interactive prototype** with 30+ screens across mobile and desktop:

**Browse & Buy:**
- Home feed (hero, game carousel, hot deals, daily movers, trending, featured sets)
- Search with filters (game, set, condition, price, finish, rarity, seller type)
- Product page (multi-seller view with price comparison)
- Listing detail (card art, price history, seller info, offers)
- Cart and checkout flow

**Collections & Tracking:**
- Watchlist with live price deltas
- Named card collections with portfolio tracking
- Buylist (set wanted cards with max prices, get matched)
- Scan card (camera mock with grade detection)

**Selling:**
- Sell hub (single, bulk, sell to shop, trade)
- Single card listing wizard (5 steps: pick card, condition, photos, price, review)
- Bulk listing with LiveSweep scanner
- Sell to local shop flow (7 phases)

**Trading:**
- Trade matching and proposal builder
- Card-for-card trading between users

**Shop Tools:**
- Shop counter (dashboard + grading queue)
- Storefront builder with enrollment wizard
- Submission queue with status tracking
- Bulk intake processing

**Other:**
- Three dashboard views (buyer, seller, store) — each purpose-built
- Verification flow (phone, ID, payout)
- Card authentication flow
- Fee comparison calculator
- How It Works page
- Seller and LGS pitch/landing pages
- Notification system

### What Doesn't Exist Yet

- No backend or database (all state is localStorage, all data is mock)
- No real authentication
- No real payments
- No real card data (uses placeholder/mock listings)
- No real-time updates

---

## Production Rebuild (In Progress)

### Architecture Decision

Rebuilding the frontend as a production-grade **Next.js** application in a **Turborepo monorepo**.

**Tech Stack:**
- Next.js 15 (App Router) — SSR for product/listing pages (SEO), client components for dashboards
- TypeScript (strict mode)
- Tailwind v4 + shadcn/ui — component library you own
- Sanity — headless CMS for card catalog, sets, games, editorial content
- Clerk — authentication (email, Google, Apple)
- Zustand — client-side state (cart, auth, preferences)
- TanStack Query — server state (API fetching/caching)
- Vercel — hosting and deployment

**Monorepo Structure:**
```
cardconomy-prod/
  apps/
    web/        -- Next.js app (main site)
    studio/     -- Sanity Studio (content editing UI)
  packages/
    ui/         -- shadcn/ui + domain components (CardArt, GradeChip, PriceTag, Icon)
    store/      -- Zustand stores + TanStack Query hooks
    types/      -- Shared TypeScript types
    sanity/     -- Sanity schemas, client, GROQ queries
```

**GitHub repo:** github.com/Dmalone93/cardconomy-prod (private)

### Team

- **Designer (Declan)** — design architecture, brand, Sanity content, AI-assisted styling
- **Frontend developer** — React/Next.js experience, building components and pages
- **Backend developer** — will build the real API later

### Phase 1 Status: Complete

Foundation is built — monorepo, all packages, Next.js app with responsive shell, Clerk auth, Sanity Studio, Vercel deployment config. Currently fixing Vercel build issues.

### Remaining Phases

2. **Browse flow** — Home, Search, Product, Listing pages connected to Sanity
3. **Account flow** — Signup, dashboard, cart, checkout
4. **Sell flow** — Seller verification, sell hub, listing wizards
5. **Trade and shop** — Trade matching, storefront, shop enrollment, shop counter
6. **Polish** — Loading/empty/error states, animations, notifications, responsive refinement

---

## Key Design Decisions

### Progressive User Capabilities (NOT Personas)

Users do NOT pick a "persona" at signup. Everyone starts as a buyer. Capabilities unlock naturally:

| Capability | How It Unlocks | Verification Required |
|------------|----------------|----------------------|
| Browse & Buy | Signup | Email + phone |
| Sell | First tap on "Sell" | ID verification (passport/driving licence), payout method, seller terms |
| Shop | Register as LGS | All above + business name, company number, proof of premises |

The dashboard is **additive** — selling adds seller sections below buyer sections. A shop owner who also collects sees everything.

### Verification Badges

| Badge | Meaning |
|-------|---------|
| None | Browser/buyer only |
| Verified Seller | ID verified, payout set up |
| Trusted Seller | Verified + earned track record (X sales, Y% positive, Z months) |
| Verified Shop | Business verified, physical premises confirmed |

### Data Split

**Sanity CMS (content/catalog — managed by designer through Studio):**
- Games, sets, cards, card printings
- Editorial content (guides, articles)
- Shop profiles and storefront content
- Pitch pages

**Mock API routes (transactional — replaced by real backend later):**
- Listings, offers, orders
- Cart, checkout
- Trades
- Watchlists, buylists, collections
- User accounts, balances

### Design System

- **Colours:** Emerald (#059669) primary, Amber (#d97706) accent, Navy (#0f172a) dark surfaces
- **Fonts:** Space Grotesk (headings), Inter (body), Geist Mono (prices/codes), Reglo (wordmark)
- **Components:** Built on shadcn/ui — Button, Dialog, Tabs, Sheet, Toast, plus domain-specific: CardArt, GradeChip, PriceTag, PriceChart, DemandIndicator, ListingCard, HeroCard, StatusTile, AttentionItem
- **Responsive:** Single codebase. Mobile (< 640px) gets bottom nav + sheets. Desktop (> 1024px) gets side nav + panels.

---

## Open Questions / Discussion Topics

These are areas where decisions are needed or ideas are welcome:

1. **Revenue model beyond fees** — Premium seller tiers? Featured listings? Shop subscription after early adopter period?
2. **Launch strategy** — Which game community to target first? Pokemon has volume, MTG has value, One Piece is growing fastest.
3. **Trust and safety** — How to handle disputes, returns, counterfeit claims at scale?
4. **Shipping infrastructure** — Integrate with Royal Mail? Offer prepaid labels? Shipping calculator?
5. **Price data** — Where does market price data come from? Scrape? API partnerships? User-generated from completed sales?
6. **Mobile app timeline** — When does React Native make sense? After web launch, or alongside?
7. **LGS acquisition** — How to get the first 50 shops on board? In-person visits? Trade show demos? Partnership with distributors?
8. **Community features** — Forums? Deck lists? Set checklists? How social should the marketplace be?
9. **Sealed product** — Should the marketplace support booster boxes, ETBs, and other sealed product, or stay singles-focused?
10. **International expansion** — UK-first, but when and how to expand to EU/rest of world?

---

## Links

| Resource | URL |
|----------|-----|
| Prototype (mobile) | cardconomyy.vercel.app |
| Prototype (desktop) | cardconomyy.vercel.app/Desktop.html |
| Production repo | github.com/Dmalone93/cardconomy-prod |
| Prototype repo | github.com/Dmalone93/Cardconomy2 |
