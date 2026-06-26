# Browse Flow Design Spec

> **Purpose:** Define the browse and discovery experience for V1 of the production Cardconomy app — home page, search with dropdown, search results, product page, set browse, and watchlist.

> **Date:** 2026-06-25

> **Status:** Draft

---

## 1. Overview

The browse flow is the core of V1. It lets users discover, search, and view trading cards across all five supported games using live data from external TCG APIs. There are no marketplace listings or real sellers yet — this is a catalog discovery experience that becomes a marketplace feed once sellers and listings exist.

### Goals

- Search and browse cards across Pokemon, MTG, Yu-Gi-Oh, One Piece, and Lorcana from one interface
- Dropdown search with as-you-type results showing cards, sets, and sellers/shops
- Product pages with card details, market prices, and printings from external APIs
- Server-rendered product pages for SEO (Google should index card names)
- Watchlist for daily return engagement with price tracking
- All data from live APIs — no mock data, no manual entry

### Non-Goals

- Marketplace listings (no real sellers yet — seller list on product page shows a CTA)
- Offers, cart, checkout (V1 purchase flow comes after browse)
- Collections, buylists, scanning (V2/V3 features)

---

## 2. Data Layer — Unified Card API

### 2.1 External APIs

| Game | API | Auth | Card Data | Prices | Set Data | Images |
|------|-----|------|-----------|--------|----------|--------|
| Pokemon | Pokemon TCG API (api.pokemontcg.io) | Free API key | Yes | USD market/low/high | Yes | Yes |
| Magic: The Gathering | Scryfall (api.scryfall.com) | No key needed | Yes | USD normal/foil | Yes | Yes |
| Yu-Gi-Oh! | YGOPRODeck (db.ygoprodeck.com/api) | No key needed | Yes | USD prices | Yes | Yes |
| One Piece | Best available community API | Varies | Yes | Limited | Yes | Yes |
| Lorcana | Best available community API | Varies | Yes | Limited | Yes | Yes |

### 2.2 Architecture

```
External APIs (5 game APIs)
        |
        v
Next.js API Routes (/api/search, /api/cards/[game]/[id], /api/sets/[game])
  - Game adapter per API (normalises to unified types)
  - Server-side response caching
        |
        v
TanStack Query hooks (client-side)
  - staleTime: 60s for search, 5min for card detail
  - Parallel queries across games for search
        |
        v
React components
```

### 2.3 Game Adapters

Each adapter lives in `apps/web/src/lib/adapters/` and implements a common interface:

```typescript
interface GameAdapter {
  searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]>;
  getCard(id: string): Promise<UnifiedCardDetail>;
  getSets(): Promise<UnifiedSet[]>;
  getSet(code: string): Promise<UnifiedSet>;
  getSetCards(code: string): Promise<UnifiedCard[]>;
}
```

Files:
- `adapters/scryfall.ts` — Magic: The Gathering
- `adapters/pokemon-tcg.ts` — Pokemon
- `adapters/ygoprodeck.ts` — Yu-Gi-Oh!
- `adapters/onepiece.ts` — One Piece
- `adapters/lorcana.ts` — Lorcana
- `adapters/index.ts` — exports `getAdapter(game: GameId)` factory

### 2.4 Unified Types

Extend the existing types in `packages/types`:

```typescript
interface UnifiedCard {
  id: string;              // API-specific ID
  game: GameId;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  thumbnailUrl: string;
  finishes: Finish[];      // ['standard'] or ['standard', 'foil']
  priceUsd?: number;       // Market price from API (USD)
  priceGbp?: number;       // Converted to GBP
}

interface UnifiedCardDetail extends UnifiedCard {
  types: string[];
  subtypes: string[];
  attributes: Record<string, string>;  // Game-specific (mana cost, HP, ATK/DEF, etc.)
  printings: CardPrintingRef[];        // Same card in other sets
  priceHistory?: number[];             // If available
  prices: {
    standard?: { usd?: number; gbp?: number };
    foil?: { usd?: number; gbp?: number };
  };
}

interface UnifiedSet {
  code: string;
  game: GameId;
  name: string;
  releaseDate: string;
  cardCount: number;
  imageUrl?: string;
}
```

### 2.5 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/search?q=&games=&limit=` | GET | Search cards across selected games, returns UnifiedCard[] |
| `/api/cards/[game]/[id]` | GET | Full card detail from specific game adapter |
| `/api/sets/[game]` | GET | All sets for a game |
| `/api/sets/[game]/[code]` | GET | Set detail |
| `/api/sets/[game]/[code]/cards` | GET | All cards in a set |
| `/api/trending` | GET | Popular/trending cards (based on API data where available) |
| `/api/new-releases` | GET | Latest sets across all games |

### 2.6 Caching Strategy

- **Search results:** cached server-side for 5 minutes (cards don't change that often)
- **Card detail:** cached for 15 minutes
- **Set lists:** cached for 1 hour
- **Set cards:** cached for 1 hour
- **Prices:** refreshed on each card detail request (staleTime 5min via TanStack Query)
- **Client-side:** TanStack Query handles deduplication and background refetching

---

## 3. Search UI with Dropdown

### 3.1 Search Bar Placement

The search bar appears in two contexts:
- **TopBar** on every page — compact input with search icon, expands on focus
- **Search page** (`/search`) — full-width input at the top

Both trigger the same dropdown component.

### 3.2 Dropdown Behaviour

**Empty state (input focused, nothing typed):**
- "Recent searches" — last 5 queries from localStorage
- "Trending searches" — top 5 popular card names (from `/api/trending`)

**1-2 characters:** No API call, no dropdown change.

**3+ characters (debounced 300ms):**
Dropdown appears with three sections:
- **Cards** (top 5) — thumbnail, card name, set name, rarity, game badge. Click → `/card/[game]/[id]`
- **Sets** (top 3) — set image, set name, game badge, card count. Click → `/set/[game]/[code]`
- **Sellers/Shops** (top 2) — avatar, name, rating, location. Click → seller/shop profile. Shows "Coming soon" placeholder until sellers exist.
- **Footer** — "See all results for '[query]'" link → `/search?q=[query]`

**Mobile:** Dropdown goes full-screen, replacing page content. Back button (or swipe) dismisses.

**Desktop:** Floating panel below search bar, max-width 480px, shadow-3 elevation. Click outside dismisses.

### 3.3 Search Query Flow

1. User types 3+ characters
2. 300ms debounce
3. Client calls `/api/search?q=[query]&games=[user-prefs]&limit=10`
4. API route fans out to all selected game adapters in parallel
5. Results merged, deduplicated, ranked by relevance (exact name match first, then partial)
6. Returns top 10 cards + matching sets
7. TanStack Query caches the result (staleTime 60s)

---

## 4. Search Results Page (`/search`)

### 4.1 URL Structure

`/search?q=[query]&games=[pkmn,mtg]&rarity=[rare]&finish=[foil]&sort=[name]`

All filter state lives in URL search params for shareable/bookmarkable searches.

### 4.2 Layout

**Mobile:**
- Search bar pinned at top
- Filter icon button → opens filter sheet (bottom sheet)
- Browse mode tabs: All / Buy / Just Listed / Deals (Buy/Just Listed/Deals disabled until marketplace exists)
- View toggle: grid (default) / list
- Sticky "X results" bar with active filter pills (tap to remove)
- Results: 2-column card grid

**Desktop:**
- Search bar in TopBar
- Persistent left sidebar (240px) with all filters expanded
- Browse tabs above results
- Filter pills above results
- Results: 3-4 column card grid or list view

### 4.3 Filters

| Filter | Type | Source | V1 Status |
|--------|------|--------|-----------|
| Game | Multi-select chips | Hardcoded games list | Active |
| Set | Searchable dropdown, grouped by game | API sets endpoint | Active |
| Finish | Toggle (Standard / Foil) | API card data | Active |
| Rarity | Multi-select chips (Common, Uncommon, Rare, etc.) | API card data | Active |
| Sort | Dropdown (Name A-Z, Name Z-A, Price low-high, Price high-low, Newest) | Client-side | Active |
| Condition | Multi-select chips (NM, LP, MP, HP, DMG) | Marketplace listings | Disabled — "Coming soon" |
| Price range | Dual slider + min/max inputs | Marketplace listings | Disabled — "Coming soon" |
| Seller type | Chips (Individual / Verified / Shop) | Marketplace listings | Disabled — "Coming soon" |

### 4.4 Result Cards

Each card in the grid shows:
- Card art thumbnail (from API)
- Card name
- Set name + card number
- Rarity badge (coloured chip)
- Game badge (small coloured dot with game initial)
- Market price if available (formatted in GBP using `formatGBP`)
- Heart icon (add to watchlist)

Click → product page (`/card/[game]/[id]`)

### 4.5 Pagination

Infinite scroll with "Load more" button as fallback. API adapters handle pagination per-provider (Scryfall uses cursor, Pokemon TCG uses page/pageSize, YGOPRODeck uses offset).

---

## 5. Product Page (`/card/[game]/[id]`)

### 5.1 URL Structure

`/card/mtg/[scryfall-id]`, `/card/pkmn/[pokemon-tcg-id]`, etc.

Server-rendered for SEO. Uses `generateMetadata` for card name, set, and image in og tags.

### 5.2 Layout

**Mobile (stacked):**
1. **Card art** — large image, tappable to zoom (full-screen modal with pinch-to-zoom). Foil sheen overlay if foil finish.
2. **Card identity** — name, set name, card number, rarity badge, game badge
3. **Finish tabs** — Standard / Foil (if both exist). Each tab shows its own price.
4. **Market price** — from API data. Show source attribution ("Price via Scryfall"). If no price available, show "Price data unavailable."
5. **Card details** — game-specific attributes:
   - MTG: mana cost, type line, oracle text, power/toughness
   - Pokemon: HP, types, attacks, weakness, retreat cost
   - Yu-Gi-Oh: type, attribute, level/rank, ATK/DEF, description
   - One Piece / Lorcana: relevant card attributes
6. **See all printings** — horizontal scroll of set badges if the card appears in multiple sets. Each links to that printing's product page.
7. **Seller list** — empty state for now: "No sellers yet. Be the first to list this card." with a CTA button that links to the sell flow (once built). This section becomes the multi-seller comparison view when listings exist.
8. **Watchlist button** — "Watch this card" / "Watching" toggle. Sticky at bottom on mobile.

**Desktop (two column):**
- Left column (50%): card art (with zoom on hover), card details
- Right column (50%): finish tabs, market price, printings, seller list, watchlist button

### 5.3 Data Fetching

- Server component fetches card detail from `/api/cards/[game]/[id]`
- Prices are included in the API response
- Printings fetched as a separate query (Scryfall has a "prints" endpoint, others require name-based search)

### 5.4 SEO Metadata

```typescript
export async function generateMetadata({ params }) {
  const card = await getCard(params.game, params.id);
  return {
    title: `${card.name} — ${card.setName} | Cardconomy`,
    description: `View ${card.name} from ${card.setName}. Compare prices and sellers on Cardconomy.`,
    openGraph: {
      images: [card.imageUrl],
    },
  };
}
```

---

## 6. Set Browse Page (`/set/[game]/[code]`)

### 6.1 Layout

**Header:**
- Set image/art from API
- Set name, game badge, release date, total card count
- Set code

**Controls:**
- Sort: Number (default), Name A-Z, Rarity, Price high-low
- Filter chips: Rarity, Finish

**Body:**
- Responsive card grid (3 columns mobile, 5-6 desktop)
- Each card: art thumbnail, name, number, rarity badge
- Click → product page

### 6.2 Data

- Fetched from `/api/sets/[game]/[code]/cards`
- Server-rendered for SEO
- Full card list loaded (most sets are 150-400 cards — manageable)

---

## 7. Home Page (`/`)

### 7.1 Layout (mobile, single column scroll)

1. **Search bar** — sticky at top, tap opens dropdown search
2. **Game carousel** — horizontal scroll of 5 game tiles with character art and game logo. Tap filters the browse sections below to that game, or navigates to `/search?games=[game]`.
3. **Trending Cards** — horizontal scroll of cards with notable prices or popularity. Source: curated from API price data. Title: "Trending Right Now"
4. **New Releases** — latest sets from each game, horizontal scroll of set tiles with name and release date. Tap → `/set/[game]/[code]`
5. **Browse by Game** — one section per game the user follows (from preferences). Each shows 4-6 cards in a horizontal scroll with "See all" link → `/search?games=[game]`. If user has no preferences, show all games.
6. **Three Communities** — static pitch section: "Connecting collectors, sellers, and local game stores." Three cards explaining the value prop. Links to how-it-works / pitch pages.

### 7.2 Desktop Layout

- Main content area (70%): same sections as mobile but with wider card rows
- Right sidebar (30%): "Popular searches" quick links, game filter chips, "New to Cardconomy?" CTA

### 7.3 Data Sources

| Section | API | Caching |
|---------|-----|---------|
| Game carousel | Hardcoded / Sanity | Static |
| Trending | `/api/trending` (aggregated from APIs) | 15 minutes |
| New Releases | `/api/new-releases` | 1 hour |
| Browse by Game | `/api/search?games=[game]&limit=6&sort=popular` | 5 minutes |
| Three Communities | Static content | Build-time |

### 7.4 What is NOT on the Home Page (yet)

- Hot Deals / Daily Movers — needs marketplace listing data
- Ad carousel — no advertisers
- Personalised recommendations — no purchase history
- Buyer dashboard sections — shown on `/dashboard`, not home

---

## 8. Watchlist

### 8.1 Store

New Zustand store: `useWatchlistStore` in `packages/store`:

```typescript
interface WatchedCard {
  id: string;
  game: GameId;
  name: string;
  imageUrl: string;
  priceWhenAdded: number | null;
  addedAt: string;
}

interface WatchlistStore {
  cards: WatchedCard[];
  addCard: (card: WatchedCard) => void;
  removeCard: (id: string, game: GameId) => void;
  isWatched: (id: string, game: GameId) => boolean;
}
```

Persisted to localStorage. Eventually synced to user account when auth is wired up.

### 8.2 UI Touchpoints

- **Heart icon** on search result cards and product pages — toggles watch state
- **Dashboard section** at `/dashboard` — list of watched cards with current prices and deltas

### 8.3 Price Delta Tracking

- When a card is added to the watchlist, store `priceWhenAdded` from the API
- On dashboard load, fetch current prices for all watched cards via parallel API calls
- Display delta: `(currentPrice - priceWhenAdded) / priceWhenAdded * 100` as a green/red percentage
- Use `PriceTag` component with `delta` prop (already built in `packages/ui`)

### 8.4 Dashboard Watchlist Section

Shown on `/dashboard` (buyer section):
- Section title: "Watchlist" with card count
- List of watched cards: thumbnail, name, set, current price, delta badge
- Tap → product page
- Swipe left or X button to remove
- Empty state: "Start watching cards to track price movements" with CTA to browse

---

## 9. Responsive Behaviour Summary

| Page | Mobile | Desktop |
|------|--------|---------|
| Home | Single column, horizontal scroll sections | Two column (main + sidebar) |
| Search dropdown | Full-screen overlay | Floating 480px panel |
| Search results | 2-column grid, filter sheet | 3-4 column grid, persistent sidebar filters |
| Product page | Stacked layout, sticky watchlist button | Two column (art left, details right) |
| Set browse | 3-column grid | 5-6 column grid |
| Dashboard watchlist | Card list with swipe-to-remove | Card list with hover X button |

---

## 10. New Files Summary

### API Layer
- `apps/web/src/lib/adapters/scryfall.ts`
- `apps/web/src/lib/adapters/pokemon-tcg.ts`
- `apps/web/src/lib/adapters/ygoprodeck.ts`
- `apps/web/src/lib/adapters/onepiece.ts`
- `apps/web/src/lib/adapters/lorcana.ts`
- `apps/web/src/lib/adapters/index.ts`
- `apps/web/src/lib/adapters/types.ts` (GameAdapter interface)
- `apps/web/src/app/api/search/route.ts`
- `apps/web/src/app/api/cards/[game]/[id]/route.ts`
- `apps/web/src/app/api/sets/[game]/route.ts`
- `apps/web/src/app/api/sets/[game]/[code]/route.ts`
- `apps/web/src/app/api/sets/[game]/[code]/cards/route.ts`
- `apps/web/src/app/api/trending/route.ts`
- `apps/web/src/app/api/new-releases/route.ts`

### Pages
- `apps/web/src/app/(main)/page.tsx` (rewrite — home page)
- `apps/web/src/app/(main)/search/page.tsx`
- `apps/web/src/app/(main)/card/[game]/[id]/page.tsx`
- `apps/web/src/app/(main)/set/[game]/[code]/page.tsx`
- `apps/web/src/app/(main)/dashboard/page.tsx`

### Components
- `apps/web/src/components/search/search-bar.tsx`
- `apps/web/src/components/search/search-dropdown.tsx`
- `apps/web/src/components/search/search-results.tsx`
- `apps/web/src/components/search/filter-sidebar.tsx`
- `apps/web/src/components/search/filter-sheet.tsx`
- `apps/web/src/components/cards/card-grid.tsx`
- `apps/web/src/components/cards/card-grid-item.tsx`
- `apps/web/src/components/cards/card-detail.tsx`
- `apps/web/src/components/cards/card-printings.tsx`
- `apps/web/src/components/cards/card-zoom-modal.tsx`
- `apps/web/src/components/home/game-carousel.tsx`
- `apps/web/src/components/home/trending-section.tsx`
- `apps/web/src/components/home/new-releases-section.tsx`
- `apps/web/src/components/home/browse-by-game.tsx`
- `apps/web/src/components/home/three-communities.tsx`
- `apps/web/src/components/dashboard/watchlist-section.tsx`

### Store
- `packages/store/src/watchlist.ts`
- Update `packages/store/src/index.ts`

### Hooks
- `apps/web/src/hooks/use-search.ts` (TanStack Query wrapper for search)
- `apps/web/src/hooks/use-card.ts` (TanStack Query wrapper for card detail)
- `apps/web/src/hooks/use-sets.ts` (TanStack Query wrapper for sets)

---

## 11. Technical Notes

### GBP Conversion

External APIs return USD prices. For V1, apply a static conversion rate (e.g. 0.79) with a disclaimer "Prices shown in GBP are approximate." A real-time forex rate can be added later.

### Rate Limiting

- Scryfall: 10 requests/second (generous). Add 100ms delay between calls if needed.
- Pokemon TCG API: 1000 requests/day on free tier. Cache aggressively.
- YGOPRODeck: No documented limit. Be respectful.
- Implement retry with exponential backoff on 429 responses.

### Error Handling

- If one game adapter fails, show results from the others. Don't let one API outage break the entire search.
- Show "Unable to load [Game] results" inline if a specific adapter times out.
- API route timeout: 10 seconds per adapter, 15 seconds total for search.

### Image Optimisation

- Use Next.js `<Image>` component for card art with proper width/height
- External image domains must be configured in `next.config.ts`: `api.scryfall.com`, `images.pokemontcg.io`, `images.ygoprodeck.com`, etc.
