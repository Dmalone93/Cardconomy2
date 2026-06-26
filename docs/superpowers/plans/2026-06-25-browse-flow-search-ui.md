# Browse Flow — Search UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the search bar with dropdown suggestions, search results page with filters, product page, set browse page, and home page — the complete browse experience using live TCG API data.

**Architecture:** Search bar component in TopBar triggers a dropdown overlay with debounced API results. Full search results page at `/search` with URL-based filter state. Product page at `/card/[game]/[id]` server-rendered for SEO. Set browse at `/set/[game]/[code]`. Home page with game carousel, trending cards, and new releases. All data fetched via the TanStack Query hooks built in Phase 2A.

**Tech Stack:** Next.js 15 App Router, React 19, TanStack Query, Tailwind v4, shadcn/ui components, `@cardconomy/ui` domain components

## Global Constraints

- TypeScript strict mode
- No hardcoded colour values — use Tailwind token classes from globals.css (`text-text-primary`, `bg-surface-default`, `bg-brand-primary`, etc.)
- Prices displayed in GBP using `formatGBP` from `@cardconomy/ui`
- All components use `"use client"` directive only when they use hooks, event handlers, or browser APIs
- Mobile-first responsive design: single column mobile, multi-column desktop at `lg:` breakpoint (1024px)
- External card images use Next.js `<Image>` component (domains already configured in next.config.ts)
- Every task ends with `npx turbo build --filter=@cardconomy/web` passing and a commit
- All work is in `/Users/declanmalone/Desktop/cardconomy-prod`

## Spec Reference

`docs/superpowers/specs/2026-06-25-browse-flow-design.md` — Sections 3, 4, 5, 6, 7

---

## File Structure

```
apps/web/src/
  components/
    search/
      search-bar.tsx           # Search input with icon, integrates into TopBar
      search-dropdown.tsx      # Dropdown overlay with card/set results + trending
    cards/
      card-grid.tsx            # Responsive card grid (2 col mobile, 4 col desktop)
      card-grid-item.tsx       # Single card in the grid (art, name, set, price, heart)
      card-detail.tsx          # Full card detail view (art, attributes, prices, printings)
      card-printings.tsx       # Horizontal scroll of other printings
    home/
      game-carousel.tsx        # Horizontal scroll of 5 game tiles
      trending-section.tsx     # Trending cards horizontal scroll
      new-releases-section.tsx # New sets horizontal scroll
      three-communities.tsx    # Static pitch section
    filters/
      filter-sidebar.tsx       # Desktop persistent filter sidebar
      filter-sheet.tsx         # Mobile bottom sheet with filters
      filter-chips.tsx         # Active filter pills with remove buttons
      game-filter.tsx          # Game multi-select chips
      rarity-filter.tsx        # Rarity multi-select chips
      sort-select.tsx          # Sort dropdown
    dashboard/
      watchlist-section.tsx    # Watched cards list with price deltas
  app/(main)/
    page.tsx                   # Home page (rewrite)
    search/page.tsx            # Search results page
    card/[game]/[id]/page.tsx  # Product page
    set/[game]/[code]/page.tsx # Set browse page
    dashboard/page.tsx         # Dashboard with watchlist
  lib/
    use-debounce.ts            # Debounce hook for search input
```

---

### Task 1: Debounce Hook and Search Bar Component

**Files:**
- Create: `apps/web/src/lib/use-debounce.ts`
- Create: `apps/web/src/components/search/search-bar.tsx`
- Modify: `apps/web/src/components/layout/top-bar.tsx` (add SearchBar)

**Interfaces:**
- Consumes: `Icon` from `@cardconomy/ui`, `useRouter` from `next/navigation`
- Produces: `useDebounce<T>(value: T, delay: number): T`, `<SearchBar onSearch={(query: string) => void} />` component embedded in TopBar

- [ ] **Step 1: Create debounce hook**

`apps/web/src/lib/use-debounce.ts`:

```typescript
"use client";

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

- [ ] **Step 2: Create SearchBar component**

`apps/web/src/components/search/search-bar.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon, cn } from "@cardconomy/ui";

interface SearchBarProps {
  onQueryChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  compact?: boolean;
}

export function SearchBar({ onQueryChange, onFocus, onBlur, className, compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleChange(value: string) {
    setQuery(value);
    onQueryChange?.(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  }

  function handleFocus() {
    setFocused(true);
    onFocus?.();
  }

  function handleBlur() {
    // Delay to allow dropdown clicks to register
    setTimeout(() => {
      setFocused(false);
      onBlur?.();
    }, 200);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-surface-default px-3 transition-colors",
          focused ? "border-brand-primary" : "border-border-default",
          compact ? "h-9" : "h-10"
        )}
      >
        <Icon name="search" size={compact ? 16 : 18} className="text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search cards, sets, sellers..."
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-text-faint",
            compact ? "text-sm" : "text-sm"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => handleChange("")}
            className="text-text-faint hover:text-text-muted"
          >
            <Icon name="plus" size={14} className="rotate-45" />
          </button>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Update TopBar to include SearchBar**

Modify `apps/web/src/components/layout/top-bar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@cardconomy/ui";
import { SearchBar } from "../search/search-bar";
import { SearchDropdown } from "../search/search-dropdown";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export function TopBar({ title, showBack = false, showSearch = true, actions }: TopBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border-default bg-surface-default">
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-subtle"
            aria-label="Go back"
          >
            <Icon name="back" size={20} />
          </button>
        )}
        {title && (
          <h1 className="flex-1 truncate font-heading text-lg font-semibold">
            {title}
          </h1>
        )}
        {showSearch && !title && (
          <div className="flex-1">
            <SearchBar
              compact
              onQueryChange={setSearchQuery}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setShowDropdown(false)}
            />
          </div>
        )}
        {!title && !showSearch && <div className="flex-1" />}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {showDropdown && searchQuery.length >= 3 && (
        <SearchDropdown query={searchQuery} />
      )}
    </header>
  );
}
```

Note: `SearchDropdown` is created in Task 2. For now, create a stub file so the build passes:

`apps/web/src/components/search/search-dropdown.tsx`:

```tsx
"use client";

interface SearchDropdownProps {
  query: string;
}

export function SearchDropdown({ query }: SearchDropdownProps) {
  return null; // Implemented in Task 2
}
```

- [ ] **Step 4: Build and verify**

```bash
npx turbo build --filter=@cardconomy/web
```

Expected: build passes.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/use-debounce.ts apps/web/src/components/search apps/web/src/components/layout/top-bar.tsx
git commit -m "feat: add search bar component with debounce hook"
```

---

### Task 2: Search Dropdown

**Files:**
- Modify: `apps/web/src/components/search/search-dropdown.tsx` (replace stub)

**Interfaces:**
- Consumes: `useSearch` from `@/hooks/use-search`, `useDebounce` from `@/lib/use-debounce`, `UnifiedCard` from `@cardconomy/types`, `CardArt`, `formatGBP`, `cn`, `Icon` from `@cardconomy/ui`
- Produces: `<SearchDropdown query={string} />` — floating panel on desktop, full-width on mobile, showing cards (top 5) and a "See all results" link

- [ ] **Step 1: Implement SearchDropdown**

`apps/web/src/components/search/search-dropdown.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useDebounce } from "@/lib/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { cn, formatGBP } from "@cardconomy/ui";
import type { UnifiedCard } from "@cardconomy/types";

interface SearchDropdownProps {
  query: string;
}

const GAME_COLORS: Record<string, string> = {
  pkmn: "bg-yellow-500",
  mtg: "bg-orange-600",
  ygo: "bg-purple-600",
  onepiece: "bg-red-600",
  lorcana: "bg-blue-500",
};

const GAME_LABELS: Record<string, string> = {
  pkmn: "Pokemon",
  mtg: "MTG",
  ygo: "Yu-Gi-Oh",
  onepiece: "One Piece",
  lorcana: "Lorcana",
};

function DropdownCardRow({ card }: { card: UnifiedCard }) {
  return (
    <Link
      href={`/card/${card.game}/${card.id}`}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-subtle transition-colors"
    >
      {card.thumbnailUrl ? (
        <img
          src={card.thumbnailUrl}
          alt={card.name}
          className="h-10 w-7 rounded object-cover"
        />
      ) : (
        <div className="h-10 w-7 rounded bg-border-default" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", GAME_COLORS[card.game] ?? "bg-gray-400")} />
          <span className="truncate text-sm font-medium text-text-primary">{card.name}</span>
        </div>
        <span className="text-xs text-text-muted">{card.setName} &middot; {card.number}</span>
      </div>
      {card.priceGbp !== null && (
        <span className="text-sm font-mono font-semibold text-text-primary">
          {formatGBP(card.priceGbp)}
        </span>
      )}
    </Link>
  );
}

export function SearchDropdown({ query }: SearchDropdownProps) {
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useSearch(debouncedQuery);

  const cards = data?.cards ?? [];
  const displayCards = cards.slice(0, 5);

  return (
    <div className="absolute left-0 right-0 top-full z-40 border-b border-border-default bg-surface-default shadow-lg lg:left-4 lg:right-auto lg:w-[480px] lg:rounded-b-lg lg:border-x">
      {isLoading && (
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          <span className="text-sm text-text-muted">Searching...</span>
        </div>
      )}

      {!isLoading && displayCards.length === 0 && debouncedQuery.length >= 3 && (
        <div className="px-4 py-4 text-center text-sm text-text-muted">
          No cards found for &ldquo;{debouncedQuery}&rdquo;
        </div>
      )}

      {displayCards.length > 0 && (
        <>
          <div className="px-4 pt-2.5 pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Cards</span>
          </div>
          {displayCards.map((card) => (
            <DropdownCardRow key={`${card.game}-${card.id}`} card={card} />
          ))}
          {cards.length > 5 && (
            <Link
              href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
              className="block border-t border-border-default px-4 py-3 text-center text-sm font-medium text-brand-primary hover:bg-surface-subtle transition-colors"
            >
              See all {cards.length} results for &ldquo;{debouncedQuery}&rdquo;
            </Link>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/components/search/search-dropdown.tsx
git commit -m "feat: add search dropdown with debounced card results"
```

---

### Task 3: Card Grid Components

**Files:**
- Create: `apps/web/src/components/cards/card-grid.tsx`
- Create: `apps/web/src/components/cards/card-grid-item.tsx`

**Interfaces:**
- Consumes: `UnifiedCard` from `@cardconomy/types`, `formatGBP`, `cn`, `Icon` from `@cardconomy/ui`, `useWatchlistStore` from `@cardconomy/store`
- Produces: `<CardGrid cards={UnifiedCard[]} />`, `<CardGridItem card={UnifiedCard} />`

- [ ] **Step 1: Create CardGridItem**

`apps/web/src/components/cards/card-grid-item.tsx`:

```tsx
"use client";

import Link from "next/link";
import { cn, formatGBP, Icon } from "@cardconomy/ui";
import { useWatchlistStore } from "@cardconomy/store";
import type { UnifiedCard } from "@cardconomy/types";

const GAME_COLORS: Record<string, string> = {
  pkmn: "bg-yellow-500",
  mtg: "bg-orange-600",
  ygo: "bg-purple-600",
  onepiece: "bg-red-600",
  lorcana: "bg-blue-500",
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-200 text-gray-700",
  uncommon: "bg-slate-300 text-slate-700",
  rare: "bg-amber-100 text-amber-800",
  "ultra-rare": "bg-purple-100 text-purple-800",
  "secret-rare": "bg-yellow-100 text-yellow-800",
  mythic: "bg-orange-100 text-orange-800",
};

export function CardGridItem({ card }: { card: UnifiedCard }) {
  const { isWatched, addCard, removeCard } = useWatchlistStore();
  const watched = isWatched(card.id, card.game);

  function toggleWatch(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (watched) {
      removeCard(card.id, card.game);
    } else {
      addCard({
        id: card.id,
        game: card.game,
        name: card.name,
        imageUrl: card.thumbnailUrl,
        priceWhenAdded: card.priceGbp,
        addedAt: new Date().toISOString(),
      });
    }
  }

  const rarityLower = card.rarity.toLowerCase();
  const rarityClass = Object.entries(RARITY_COLORS).find(([key]) =>
    rarityLower.includes(key)
  )?.[1] ?? "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/card/${card.game}/${card.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-default transition-shadow hover:shadow-md"
    >
      {/* Card art */}
      <div className="relative aspect-[5/7] w-full overflow-hidden bg-surface-subtle">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-faint">
            <Icon name="grid" size={32} />
          </div>
        )}
        {/* Watch button */}
        <button
          onClick={toggleWatch}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-default/80 backdrop-blur-sm transition-colors",
            watched ? "text-red-500" : "text-text-muted hover:text-red-400"
          )}
        >
          <Icon name="heart" size={14} />
        </button>
        {/* Game badge */}
        <span className={cn("absolute left-2 top-2 h-2.5 w-2.5 rounded-full", GAME_COLORS[card.game] ?? "bg-gray-400")} />
      </div>

      {/* Card info */}
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <span className="truncate text-sm font-semibold text-text-primary">{card.name}</span>
        <span className="truncate text-xs text-text-muted">{card.setName} &middot; {card.number}</span>
        <div className="mt-auto flex items-center justify-between pt-1">
          {card.priceGbp !== null ? (
            <span className="font-mono text-sm font-semibold text-text-primary">{formatGBP(card.priceGbp)}</span>
          ) : (
            <span className="text-xs text-text-faint">No price</span>
          )}
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", rarityClass)}>
            {card.rarity.length > 12 ? card.rarity.slice(0, 12) + "\u2026" : card.rarity}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create CardGrid**

`apps/web/src/components/cards/card-grid.tsx`:

```tsx
import { CardGridItem } from "./card-grid-item";
import type { UnifiedCard } from "@cardconomy/types";

interface CardGridProps {
  cards: UnifiedCard[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-surface-default">
      <div className="aspect-[5/7] w-full animate-pulse bg-surface-subtle" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-subtle" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-subtle" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-subtle" />
      </div>
    </div>
  );
}

export function CardGrid({ cards, loading = false }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-subtle">
          <span className="text-2xl">&#x1F50D;</span>
        </div>
        <p className="text-sm font-medium text-text-primary">No cards found</p>
        <p className="text-xs text-text-muted">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <CardGridItem key={`${card.game}-${card.id}`} card={card} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/components/cards
git commit -m "feat: add card grid and card grid item components"
```

---

### Task 4: Filter Components

**Files:**
- Create: `apps/web/src/components/filters/game-filter.tsx`
- Create: `apps/web/src/components/filters/rarity-filter.tsx`
- Create: `apps/web/src/components/filters/sort-select.tsx`
- Create: `apps/web/src/components/filters/filter-chips.tsx`
- Create: `apps/web/src/components/filters/filter-sidebar.tsx`

**Interfaces:**
- Consumes: `GameId` from `@cardconomy/types`, `cn`, `Icon` from `@cardconomy/ui`
- Produces: `<GameFilter selected={GameId[]} onChange={(games: GameId[]) => void} />`, `<RarityFilter selected={string[]} onChange={(rarities: string[]) => void} />`, `<SortSelect value={string} onChange={(sort: string) => void} />`, `<FilterChips filters={Record} onRemove={(key: string) => void} />`, `<FilterSidebar ...props />`

- [ ] **Step 1: Create GameFilter**

`apps/web/src/components/filters/game-filter.tsx`:

```tsx
"use client";

import { cn } from "@cardconomy/ui";
import type { GameId } from "@cardconomy/types";

const GAMES: { id: GameId; label: string; color: string }[] = [
  { id: "pkmn", label: "Pokemon", color: "bg-yellow-500" },
  { id: "mtg", label: "MTG", color: "bg-orange-600" },
  { id: "ygo", label: "Yu-Gi-Oh", color: "bg-purple-600" },
  { id: "onepiece", label: "One Piece", color: "bg-red-600" },
  { id: "lorcana", label: "Lorcana", color: "bg-blue-500" },
];

interface GameFilterProps {
  selected: GameId[];
  onChange: (games: GameId[]) => void;
}

export function GameFilter({ selected, onChange }: GameFilterProps) {
  function toggle(id: GameId) {
    if (selected.includes(id)) {
      onChange(selected.filter((g) => g !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {GAMES.map((game) => {
        const active = selected.includes(game.id);
        return (
          <button
            key={game.id}
            onClick={() => toggle(game.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-brand-primary bg-brand-primary-wash text-brand-primary"
                : "border-border-default bg-surface-default text-text-secondary hover:border-brand-primary"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", game.color)} />
            {game.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create RarityFilter**

`apps/web/src/components/filters/rarity-filter.tsx`:

```tsx
"use client";

import { cn } from "@cardconomy/ui";

const RARITIES = ["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Mythic"];

interface RarityFilterProps {
  selected: string[];
  onChange: (rarities: string[]) => void;
}

export function RarityFilter({ selected, onChange }: RarityFilterProps) {
  function toggle(rarity: string) {
    if (selected.includes(rarity)) {
      onChange(selected.filter((r) => r !== rarity));
    } else {
      onChange([...selected, rarity]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {RARITIES.map((rarity) => {
        const active = selected.includes(rarity);
        return (
          <button
            key={rarity}
            onClick={() => toggle(rarity)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-brand-primary bg-brand-primary-wash text-brand-primary"
                : "border-border-default bg-surface-default text-text-secondary hover:border-brand-primary"
            )}
          >
            {rarity}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create SortSelect**

`apps/web/src/components/filters/sort-select.tsx`:

```tsx
"use client";

interface SortSelectProps {
  value: string;
  onChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A\u2013Z" },
  { value: "name-desc", label: "Name Z\u2013A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border-default bg-surface-default px-3 py-1.5 text-sm text-text-primary outline-none focus:border-brand-primary"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
```

- [ ] **Step 4: Create FilterChips**

`apps/web/src/components/filters/filter-chips.tsx`:

```tsx
"use client";

import { Icon, cn } from "@cardconomy/ui";

interface FilterChipsProps {
  filters: { key: string; label: string }[];
  onRemove: (key: string) => void;
  onClearAll?: () => void;
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemove(filter.key)}
          className="flex items-center gap-1 rounded-full border border-brand-primary bg-brand-primary-wash px-2.5 py-1 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
        >
          {filter.label}
          <Icon name="plus" size={10} className="rotate-45" />
        </button>
      ))}
      {filters.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-text-muted hover:text-text-primary"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create FilterSidebar (desktop)**

`apps/web/src/components/filters/filter-sidebar.tsx`:

```tsx
"use client";

import type { GameId } from "@cardconomy/types";
import { GameFilter } from "./game-filter";
import { RarityFilter } from "./rarity-filter";
import { SortSelect } from "./sort-select";

interface FilterSidebarProps {
  games: GameId[];
  onGamesChange: (games: GameId[]) => void;
  rarities: string[];
  onRaritiesChange: (rarities: string[]) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function FilterSidebar({
  games, onGamesChange,
  rarities, onRaritiesChange,
  sort, onSortChange,
}: FilterSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 space-y-6 lg:block">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">Sort</h3>
        <SortSelect value={sort} onChange={onSortChange} />
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">Game</h3>
        <GameFilter selected={games} onChange={onGamesChange} />
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">Rarity</h3>
        <RarityFilter selected={rarities} onChange={onRaritiesChange} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-faint">Condition</h3>
        <p className="text-xs text-text-faint italic">Coming soon</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-faint">Price Range</h3>
        <p className="text-xs text-text-faint italic">Coming soon</p>
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/components/filters
git commit -m "feat: add filter components (game, rarity, sort, chips, sidebar)"
```

---

### Task 5: Search Results Page

**Files:**
- Create: `apps/web/src/app/(main)/search/page.tsx`

**Interfaces:**
- Consumes: `useSearch` from `@/hooks/use-search`, `useDebounce`, all filter components, `CardGrid`, `FilterChips`, `TopBar`, `GameId` from `@cardconomy/types`
- Produces: `/search?q=&games=&rarity=&sort=` page with filtered results

- [ ] **Step 1: Create search results page**

`apps/web/src/app/(main)/search/page.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/lib/use-debounce";
import { CardGrid } from "@/components/cards/card-grid";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { FilterChips } from "@/components/filters/filter-chips";
import { GameFilter } from "@/components/filters/game-filter";
import { RarityFilter } from "@/components/filters/rarity-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { SearchBar } from "@/components/search/search-bar";
import { Icon } from "@cardconomy/ui";
import type { GameId, UnifiedCard } from "@cardconomy/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [games, setGames] = useState<GameId[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [sort, setSort] = useState("name-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useSearch(debouncedQuery, games.length > 0 ? games : undefined);

  const filteredCards = useMemo(() => {
    let cards = data?.cards ?? [];

    // Filter by rarity (client-side since API search doesn't support it)
    if (rarities.length > 0) {
      cards = cards.filter((c) =>
        rarities.some((r) => c.rarity.toLowerCase().includes(r.toLowerCase()))
      );
    }

    // Sort
    cards = [...cards].sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return (a.priceGbp ?? Infinity) - (b.priceGbp ?? Infinity);
        case "price-desc": return (b.priceGbp ?? 0) - (a.priceGbp ?? 0);
        default: return 0;
      }
    });

    return cards;
  }, [data?.cards, rarities, sort]);

  // Build active filter chips
  const activeFilters = [
    ...games.map((g) => ({ key: `game-${g}`, label: g.toUpperCase() })),
    ...rarities.map((r) => ({ key: `rarity-${r}`, label: r })),
  ];

  function removeFilter(key: string) {
    if (key.startsWith("game-")) {
      const id = key.replace("game-", "") as GameId;
      setGames(games.filter((g) => g !== id));
    } else if (key.startsWith("rarity-")) {
      const r = key.replace("rarity-", "");
      setRarities(rarities.filter((x) => x !== r));
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile search + filter bar */}
      <div className="border-b border-border-default bg-surface-default p-4 lg:hidden">
        <SearchBar onQueryChange={setQuery} className="mb-3" />
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary"
          >
            <Icon name="filter" size={16} />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                {activeFilters.length}
              </span>
            )}
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
        {showMobileFilters && (
          <div className="mt-3 space-y-3 border-t border-border-default pt-3">
            <GameFilter selected={games} onChange={setGames} />
            <RarityFilter selected={rarities} onChange={setRarities} />
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-6 p-4 lg:p-6">
        {/* Desktop sidebar */}
        <FilterSidebar
          games={games}
          onGamesChange={setGames}
          rarities={rarities}
          onRaritiesChange={setRarities}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Results */}
        <div className="flex-1">
          {/* Results header */}
          <div className="mb-4 flex flex-col gap-2">
            {debouncedQuery && (
              <p className="text-sm text-text-muted">
                {isLoading ? "Searching..." : `${filteredCards.length} results for \u201c${debouncedQuery}\u201d`}
              </p>
            )}
            <FilterChips
              filters={activeFilters}
              onRemove={removeFilter}
              onClearAll={() => { setGames([]); setRarities([]); }}
            />
          </div>

          <CardGrid cards={filteredCards} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/app/\(main\)/search
git commit -m "feat: add search results page with filters and card grid"
```

---

### Task 6: Product Page

**Files:**
- Create: `apps/web/src/app/(main)/card/[game]/[id]/page.tsx`
- Create: `apps/web/src/components/cards/card-detail.tsx`
- Create: `apps/web/src/components/cards/card-printings.tsx`

**Interfaces:**
- Consumes: API route `/api/cards/[game]/[id]`, `UnifiedCardDetail` from `@cardconomy/types`, `formatGBP`, `GradeChip`, `Icon`, `cn` from `@cardconomy/ui`, `useWatchlistStore` from `@cardconomy/store`
- Produces: `/card/[game]/[id]` server-rendered page with SEO metadata

- [ ] **Step 1: Create CardPrintings component**

`apps/web/src/components/cards/card-printings.tsx`:

```tsx
import Link from "next/link";
import type { CardPrintingRef } from "@cardconomy/types";

interface CardPrintingsProps {
  printings: CardPrintingRef[];
  currentGame: string;
}

export function CardPrintings({ printings, currentGame }: CardPrintingsProps) {
  if (printings.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Other Printings</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {printings.map((p) => (
          <Link
            key={p.id}
            href={`/card/${currentGame}/${p.id}`}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-border-default bg-surface-default px-3 py-2 text-xs hover:border-brand-primary transition-colors"
          >
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.setName} className="h-8 w-6 rounded object-cover" />
            )}
            <div>
              <div className="font-medium text-text-primary">{p.setName}</div>
              <div className="text-text-muted">{p.setCode}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CardDetail component**

`apps/web/src/components/cards/card-detail.tsx`:

```tsx
"use client";

import { formatGBP, Icon, cn } from "@cardconomy/ui";
import { useWatchlistStore } from "@cardconomy/store";
import { CardPrintings } from "./card-printings";
import type { UnifiedCardDetail } from "@cardconomy/types";

const GAME_LABELS: Record<string, string> = {
  pkmn: "Pokemon",
  mtg: "Magic: The Gathering",
  ygo: "Yu-Gi-Oh!",
  onepiece: "One Piece TCG",
  lorcana: "Lorcana",
};

interface CardDetailProps {
  card: UnifiedCardDetail;
}

export function CardDetail({ card }: CardDetailProps) {
  const { isWatched, addCard, removeCard } = useWatchlistStore();
  const watched = isWatched(card.id, card.game);

  function toggleWatch() {
    if (watched) {
      removeCard(card.id, card.game);
    } else {
      addCard({
        id: card.id,
        game: card.game,
        name: card.name,
        imageUrl: card.thumbnailUrl,
        priceWhenAdded: card.priceGbp,
        addedAt: new Date().toISOString(),
      });
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Left: Card art */}
        <div className="flex justify-center lg:w-2/5">
          <div className="relative w-full max-w-xs">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full rounded-xl shadow-lg"
              />
            ) : (
              <div className="flex aspect-[5/7] w-full items-center justify-center rounded-xl bg-surface-subtle">
                <Icon name="grid" size={48} className="text-text-faint" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 space-y-5">
          {/* Identity */}
          <div>
            <p className="text-xs font-medium text-text-muted">{GAME_LABELS[card.game] ?? card.game} &middot; {card.setName} &middot; {card.number}</p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-text-primary">{card.name}</h1>
            <span className="mt-1 inline-block rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-text-secondary">{card.rarity}</span>
          </div>

          {/* Prices */}
          <div className="rounded-lg border border-border-default bg-surface-default p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">Market Price</h3>
            <div className="flex flex-wrap gap-4">
              {card.prices.standard && (
                <div>
                  <span className="text-xs text-text-muted">Standard</span>
                  <div className="font-mono text-lg font-bold text-text-primary">
                    {card.prices.standard.gbp ? formatGBP(card.prices.standard.gbp) : "\u2014"}
                  </div>
                </div>
              )}
              {card.prices.foil && (
                <div>
                  <span className="text-xs text-text-muted">Foil</span>
                  <div className="font-mono text-lg font-bold text-brand-accent">
                    {card.prices.foil.gbp ? formatGBP(card.prices.foil.gbp) : "\u2014"}
                  </div>
                </div>
              )}
              {!card.prices.standard && !card.prices.foil && (
                <p className="text-sm text-text-faint">Price data unavailable</p>
              )}
            </div>
            <p className="mt-2 text-[10px] text-text-faint">Prices are approximate (converted from USD at 0.79)</p>
          </div>

          {/* Attributes */}
          {Object.keys(card.attributes).length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">Details</h3>
              <dl className="grid grid-cols-2 gap-2">
                {Object.entries(card.attributes).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-surface-subtle px-3 py-2">
                    <dt className="text-[10px] font-medium text-text-faint">{key}</dt>
                    <dd className="text-sm font-medium text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Description */}
          {card.description && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-faint">Card Text</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.description}</p>
            </div>
          )}

          {/* Seller section placeholder */}
          <div className="rounded-lg border-2 border-dashed border-border-default p-6 text-center">
            <p className="text-sm font-medium text-text-primary">No sellers yet</p>
            <p className="mt-1 text-xs text-text-muted">Be the first to list this card on Cardconomy</p>
          </div>

          {/* Watch button */}
          <button
            onClick={toggleWatch}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
              watched
                ? "bg-surface-subtle text-text-secondary hover:bg-red-50 hover:text-red-500"
                : "bg-brand-primary text-white hover:bg-brand-primary-press"
            )}
          >
            <Icon name="heart" size={16} />
            {watched ? "Watching" : "Watch this card"}
          </button>

          {/* Printings */}
          <CardPrintings printings={card.printings} currentGame={card.game} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Product Page route**

`apps/web/src/app/(main)/card/[game]/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { GameId } from "@cardconomy/types";
import { CardDetail } from "@/components/cards/card-detail";

interface PageProps {
  params: Promise<{ game: string; id: string }>;
}

async function fetchCard(game: string, id: string) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/cards/${game}/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.card ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { game, id } = await params;
  const card = await fetchCard(game, id);

  if (!card) {
    return { title: "Card Not Found | Cardconomy" };
  }

  return {
    title: `${card.name} \u2014 ${card.setName} | Cardconomy`,
    description: `View ${card.name} from ${card.setName}. Compare prices and sellers on Cardconomy, the UK trading card marketplace.`,
    openGraph: {
      title: `${card.name} \u2014 ${card.setName}`,
      description: `${card.rarity} from ${card.setName}`,
      images: card.imageUrl ? [{ url: card.imageUrl }] : [],
    },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { game, id } = await params;
  const card = await fetchCard(game, id);

  if (!card) {
    notFound();
  }

  return <CardDetail card={card} />;
}
```

- [ ] **Step 4: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/app/\(main\)/card apps/web/src/components/cards/card-detail.tsx apps/web/src/components/cards/card-printings.tsx
git commit -m "feat: add product page with card detail, prices, and printings"
```

---

### Task 7: Set Browse Page

**Files:**
- Create: `apps/web/src/app/(main)/set/[game]/[code]/page.tsx`

**Interfaces:**
- Consumes: API routes `/api/sets/[game]/[code]` and `/api/sets/[game]/[code]/cards`, `CardGrid`
- Produces: `/set/[game]/[code]` page showing all cards in a set

- [ ] **Step 1: Create set browse page**

`apps/web/src/app/(main)/set/[game]/[code]/page.tsx`:

```tsx
"use client";

import { use } from "react";
import { useSetCards } from "@/hooks/use-sets";
import { CardGrid } from "@/components/cards/card-grid";
import { SortSelect } from "@/components/filters/sort-select";
import { RarityFilter } from "@/components/filters/rarity-filter";
import { useState, useMemo } from "react";
import type { GameId } from "@cardconomy/types";

const GAME_LABELS: Record<string, string> = {
  pkmn: "Pokemon",
  mtg: "Magic: The Gathering",
  ygo: "Yu-Gi-Oh!",
  onepiece: "One Piece TCG",
  lorcana: "Lorcana",
};

interface PageProps {
  params: Promise<{ game: string; code: string }>;
}

export default function SetBrowsePage({ params }: PageProps) {
  const { game, code } = use(params);
  const { data, isLoading } = useSetCards(game as GameId, code);
  const [sort, setSort] = useState("name-asc");
  const [rarities, setRarities] = useState<string[]>([]);

  const cards = useMemo(() => {
    let result = data?.cards ?? [];

    if (rarities.length > 0) {
      result = result.filter((c) =>
        rarities.some((r) => c.rarity.toLowerCase().includes(r.toLowerCase()))
      );
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return (a.priceGbp ?? Infinity) - (b.priceGbp ?? Infinity);
        case "price-desc": return (b.priceGbp ?? 0) - (a.priceGbp ?? 0);
        default: return 0;
      }
    });

    return result;
  }, [data?.cards, rarities, sort]);

  const allCards = data?.cards ?? [];

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium text-text-muted">{GAME_LABELS[game] ?? game}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-text-primary">{code.toUpperCase()}</h1>
        <p className="mt-1 text-sm text-text-muted">{allCards.length} cards</p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SortSelect value={sort} onChange={setSort} />
        <RarityFilter selected={rarities} onChange={setRarities} />
      </div>

      {/* Grid */}
      <CardGrid cards={cards} loading={isLoading} />
    </div>
  );
}
```

- [ ] **Step 2: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/app/\(main\)/set
git commit -m "feat: add set browse page with card grid and filters"
```

---

### Task 8: Home Page

**Files:**
- Create: `apps/web/src/components/home/game-carousel.tsx`
- Create: `apps/web/src/components/home/trending-section.tsx`
- Create: `apps/web/src/components/home/new-releases-section.tsx`
- Create: `apps/web/src/components/home/three-communities.tsx`
- Modify: `apps/web/src/app/(main)/page.tsx` (rewrite)

**Interfaces:**
- Consumes: `useTrending`, `useNewReleases` from `@/hooks/use-search`, `UnifiedCard`, `UnifiedSet`, `GameId` from `@cardconomy/types`, `formatGBP`, `cn`, `Icon` from `@cardconomy/ui`
- Produces: Complete home page at `/` with game carousel, trending, new releases, and three communities

- [ ] **Step 1: Create GameCarousel**

`apps/web/src/components/home/game-carousel.tsx`:

```tsx
"use client";

import Link from "next/link";
import { cn } from "@cardconomy/ui";

const GAMES = [
  { id: "pkmn", name: "Pokemon", color: "#d4a017", bg: "from-yellow-600 to-yellow-800" },
  { id: "mtg", name: "Magic", color: "#c2691b", bg: "from-orange-700 to-orange-900" },
  { id: "ygo", name: "Yu-Gi-Oh!", color: "#7c4dd1", bg: "from-purple-600 to-purple-800" },
  { id: "onepiece", name: "One Piece", color: "#c0392b", bg: "from-red-600 to-red-800" },
  { id: "lorcana", name: "Lorcana", color: "#1f8fd6", bg: "from-blue-500 to-blue-700" },
];

export function GameCarousel() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {GAMES.map((game) => (
        <Link
          key={game.id}
          href={`/search?games=${game.id}`}
          className={cn(
            "flex shrink-0 flex-col items-center justify-end rounded-xl bg-gradient-to-b px-6 py-4 text-white shadow-md transition-transform hover:scale-105",
            game.bg
          )}
          style={{ width: 120, height: 140 }}
        >
          <span className="text-sm font-bold">{game.name}</span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create TrendingSection**

`apps/web/src/components/home/trending-section.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useTrending } from "@/hooks/use-search";
import { formatGBP, cn } from "@cardconomy/ui";

const GAME_COLORS: Record<string, string> = {
  pkmn: "bg-yellow-500",
  mtg: "bg-orange-600",
  ygo: "bg-purple-600",
  onepiece: "bg-red-600",
  lorcana: "bg-blue-500",
};

export function TrendingSection() {
  const { data, isLoading } = useTrending();
  const cards = data?.cards ?? [];

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">Trending Right Now</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 w-32 shrink-0 animate-pulse rounded-lg bg-surface-subtle" />
          ))}
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">Trending Right Now</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {cards.map((card) => (
          <Link
            key={`${card.game}-${card.id}`}
            href={`/card/${card.game}/${card.id}`}
            className="group flex w-32 shrink-0 flex-col overflow-hidden rounded-lg border border-border-default bg-surface-default transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[5/7] w-full overflow-hidden bg-surface-subtle">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-text-faint text-xs">No image</div>
              )}
              <span className={cn("absolute left-1.5 top-1.5 h-2 w-2 rounded-full", GAME_COLORS[card.game] ?? "bg-gray-400")} />
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-semibold text-text-primary">{card.name}</p>
              {card.priceGbp !== null && (
                <p className="mt-0.5 font-mono text-xs font-semibold text-text-primary">{formatGBP(card.priceGbp)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create NewReleasesSection**

`apps/web/src/components/home/new-releases-section.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useNewReleases } from "@/hooks/use-search";

const GAME_LABELS: Record<string, string> = {
  pkmn: "Pokemon",
  mtg: "MTG",
  ygo: "Yu-Gi-Oh",
  onepiece: "One Piece",
  lorcana: "Lorcana",
};

export function NewReleasesSection() {
  const { data, isLoading } = useNewReleases();
  const sets = data?.sets ?? [];

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">New Releases</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 w-48 shrink-0 animate-pulse rounded-lg bg-surface-subtle" />
          ))}
        </div>
      </div>
    );
  }

  if (sets.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-bold text-text-primary">New Releases</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {sets.map((set) => (
          <Link
            key={`${set.game}-${set.code}`}
            href={`/set/${set.game}/${set.code}`}
            className="flex w-48 shrink-0 flex-col rounded-lg border border-border-default bg-surface-default p-3 transition-shadow hover:shadow-md"
          >
            <span className="text-[10px] font-medium text-text-faint">{GAME_LABELS[set.game] ?? set.game}</span>
            <span className="mt-0.5 truncate text-sm font-semibold text-text-primary">{set.name}</span>
            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-xs text-text-muted">{set.cardCount} cards</span>
              {set.releaseDate && (
                <span className="text-xs text-text-faint">{set.releaseDate}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ThreeCommunities**

`apps/web/src/components/home/three-communities.tsx`:

```tsx
import { Icon } from "@cardconomy/ui";

const COMMUNITIES = [
  {
    title: "Collectors",
    description: "Find the cards you want at the best prices. Compare sellers, track prices, and build your collection.",
    icon: "heart" as const,
    color: "text-brand-primary",
    bg: "bg-brand-primary-wash",
  },
  {
    title: "Sellers",
    description: "List your cards in minutes. The lowest fees in TCG at just 4%. Reach buyers across the UK.",
    icon: "tag" as const,
    color: "text-brand-accent",
    bg: "bg-amber-50",
  },
  {
    title: "Local Game Stores",
    description: "Get your inventory online. Accept submissions, manage buylists, and reach customers beyond your door.",
    icon: "shield" as const,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export function ThreeCommunities() {
  return (
    <div className="rounded-xl bg-surface-dark p-6 text-center">
      <h2 className="font-heading text-lg font-bold text-white">Connecting the whole TCG community</h2>
      <p className="mt-1 text-sm text-text-faint">One platform for collectors, sellers, and local game stores</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {COMMUNITIES.map((c) => (
          <div key={c.title} className="rounded-lg bg-white/5 p-4 text-left backdrop-blur">
            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
              <Icon name={c.icon} size={16} className={c.color} />
            </div>
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Rewrite home page**

`apps/web/src/app/(main)/page.tsx`:

```tsx
"use client";

import { GameCarousel } from "@/components/home/game-carousel";
import { TrendingSection } from "@/components/home/trending-section";
import { NewReleasesSection } from "@/components/home/new-releases-section";
import { ThreeCommunities } from "@/components/home/three-communities";

export default function HomePage() {
  return (
    <div className="space-y-8 p-4 lg:p-6">
      <GameCarousel />
      <TrendingSection />
      <NewReleasesSection />
      <ThreeCommunities />
    </div>
  );
}
```

- [ ] **Step 6: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/components/home apps/web/src/app/\(main\)/page.tsx
git commit -m "feat: add home page with game carousel, trending, new releases, communities"
```

---

### Task 9: Dashboard with Watchlist

**Files:**
- Create: `apps/web/src/components/dashboard/watchlist-section.tsx`
- Create: `apps/web/src/app/(main)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `useWatchlistStore`, `WatchedCard` from `@cardconomy/store`, `formatGBP`, `Icon`, `cn` from `@cardconomy/ui`
- Produces: `/dashboard` page with watchlist section

- [ ] **Step 1: Create WatchlistSection**

`apps/web/src/components/dashboard/watchlist-section.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useWatchlistStore } from "@cardconomy/store";
import { formatGBP, Icon, cn } from "@cardconomy/ui";

export function WatchlistSection() {
  const { cards, removeCard, cardCount } = useWatchlistStore();
  const count = cardCount();

  if (count === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-surface-default p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle">
          <Icon name="heart" size={24} className="text-text-faint" />
        </div>
        <p className="text-sm font-medium text-text-primary">No watched cards</p>
        <p className="mt-1 text-xs text-text-muted">Start watching cards to track price movements</p>
        <Link
          href="/search"
          className="mt-3 inline-block rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-press"
        >
          Browse cards
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-default bg-surface-default">
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Watchlist ({count})</h2>
      </div>
      <div className="divide-y divide-border-default">
        {cards.map((card) => (
          <div key={`${card.game}-${card.id}`} className="flex items-center gap-3 px-4 py-3">
            <Link href={`/card/${card.game}/${card.id}`} className="flex flex-1 items-center gap-3">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="h-10 w-7 rounded object-cover" />
              ) : (
                <div className="h-10 w-7 rounded bg-surface-subtle" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{card.name}</p>
                <p className="text-xs text-text-muted">{card.game.toUpperCase()}</p>
              </div>
              {card.priceWhenAdded !== null && (
                <span className="font-mono text-sm font-semibold text-text-primary">
                  {formatGBP(card.priceWhenAdded)}
                </span>
              )}
            </Link>
            <button
              onClick={() => removeCard(card.id, card.game)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-faint hover:bg-red-50 hover:text-red-500"
            >
              <Icon name="plus" size={14} className="rotate-45" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create dashboard page**

`apps/web/src/app/(main)/dashboard/page.tsx`:

```tsx
import { WatchlistSection } from "@/components/dashboard/watchlist-section";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary">Dashboard</h1>
      <WatchlistSection />
    </div>
  );
}
```

- [ ] **Step 3: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/components/dashboard apps/web/src/app/\(main\)/dashboard
git commit -m "feat: add dashboard page with watchlist section"
```

---

## Summary

After completing all 9 tasks, you have:

| What | Route | Status |
|------|-------|--------|
| Search bar + debounce | TopBar (every page) | Working |
| Search dropdown | TopBar overlay | Working |
| Card grid + items | Shared component | Working |
| Filter components | Game, rarity, sort, chips, sidebar | Working |
| Search results page | `/search?q=&games=&rarity=&sort=` | Working |
| Product page | `/card/[game]/[id]` | Working (server-rendered, SEO) |
| Set browse page | `/set/[game]/[code]` | Working |
| Home page | `/` | Working |
| Dashboard + watchlist | `/dashboard` | Working |

**What comes next (Phase 2C/2D):**
- Polish: loading states, error boundaries, responsive refinements
- Card zoom modal on product page
- Mobile filter sheet (bottom sheet) alternative to sidebar
- Home page right sidebar on desktop
