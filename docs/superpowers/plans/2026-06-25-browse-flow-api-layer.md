# Browse Flow — API Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified data layer that fetches trading card data from 5 external APIs (Scryfall, Pokemon TCG, YGOPRODeck, One Piece, Lorcana) and exposes it through consistent Next.js API routes.

**Architecture:** Each game gets an adapter that translates the external API's response shape into unified `UnifiedCard` and `UnifiedSet` types. Next.js API routes call the correct adapter based on the `game` parameter. TanStack Query hooks on the client provide caching and deduplication. All adapters implement the same `GameAdapter` interface so the search endpoint can fan out to all 5 in parallel.

**Tech Stack:** Next.js 15 API routes, TypeScript, TanStack Query, external REST APIs (no auth keys required except Pokemon TCG which is optional)

## Global Constraints

- TypeScript strict mode
- All prices converted from USD to GBP using a static rate (0.79) with a "Prices are approximate" disclaimer
- No hardcoded colour values — use design tokens
- External API calls must have a 10-second timeout
- If one adapter fails, other adapters' results are still returned
- YGOPRODeck rate limit: max 20 requests/second — add 100ms delay between calls
- All work is in `/Users/declanmalone/Desktop/cardconomy-prod`
- Every task ends with `npx turbo build --filter=@cardconomy/web` passing and a commit

## Spec Reference

`docs/superpowers/specs/2026-06-25-browse-flow-design.md` — Sections 2, 10, 11

---

## File Structure

```
packages/types/src/
  card-api.ts                    # UnifiedCard, UnifiedCardDetail, UnifiedSet, GameAdapter interface

apps/web/src/
  lib/
    adapters/
      types.ts                   # GameAdapter interface, SearchOptions, adapter helpers
      scryfall.ts                # MTG adapter
      pokemon-tcg.ts             # Pokemon adapter
      ygoprodeck.ts              # Yu-Gi-Oh adapter
      onepiece.ts                # One Piece adapter
      lorcana.ts                 # Lorcana adapter
      index.ts                   # getAdapter(game) factory, searchAllGames()
    currency.ts                  # USD to GBP conversion utility
  app/
    api/
      search/route.ts            # GET /api/search?q=&games=&limit=
      cards/[game]/[id]/route.ts # GET /api/cards/:game/:id
      sets/[game]/route.ts       # GET /api/sets/:game
      sets/[game]/[code]/route.ts        # GET /api/sets/:game/:code
      sets/[game]/[code]/cards/route.ts  # GET /api/sets/:game/:code/cards
      trending/route.ts          # GET /api/trending
      new-releases/route.ts      # GET /api/new-releases
  hooks/
    use-search.ts                # TanStack Query hook for search
    use-card.ts                  # TanStack Query hook for card detail
    use-sets.ts                  # TanStack Query hook for sets
```

---

### Task 1: Unified Card Types and Adapter Interface

**Files:**
- Create: `packages/types/src/card-api.ts`
- Modify: `packages/types/src/index.ts`
- Create: `apps/web/src/lib/adapters/types.ts`
- Create: `apps/web/src/lib/currency.ts`
- Test: `apps/web/src/lib/__tests__/currency.test.ts`

**Interfaces:**
- Consumes: `GameId` from `@cardconomy/types`
- Produces: `UnifiedCard`, `UnifiedCardDetail`, `UnifiedSet`, `GameAdapter`, `SearchOptions`, `convertUsdToGbp(usd: number): number`

- [ ] **Step 1: Create unified card types**

`packages/types/src/card-api.ts`:

```typescript
import type { GameId } from "./game";

export type Finish = "standard" | "foil" | "reverse-foil";

export interface UnifiedCard {
  id: string;
  game: GameId;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  thumbnailUrl: string;
  finishes: Finish[];
  priceUsd: number | null;
  priceGbp: number | null;
}

export interface CardPrintingRef {
  id: string;
  setName: string;
  setCode: string;
  imageUrl: string;
}

export interface UnifiedCardDetail extends UnifiedCard {
  types: string[];
  subtypes: string[];
  attributes: Record<string, string>;
  printings: CardPrintingRef[];
  prices: {
    standard?: { usd?: number; gbp?: number };
    foil?: { usd?: number; gbp?: number };
  };
  description?: string;
}

export interface UnifiedSet {
  code: string;
  game: GameId;
  name: string;
  releaseDate: string;
  cardCount: number;
  imageUrl: string | null;
}
```

- [ ] **Step 2: Update types barrel export**

Add to `packages/types/src/index.ts`:

```typescript
export * from "./card-api";
```

- [ ] **Step 3: Create adapter interface and helpers**

`apps/web/src/lib/adapters/types.ts`:

```typescript
import type { GameId, UnifiedCard, UnifiedCardDetail, UnifiedSet } from "@cardconomy/types";

export interface SearchOptions {
  limit?: number;
  offset?: number;
  setCode?: string;
  rarity?: string;
}

export interface GameAdapter {
  game: GameId;
  searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]>;
  getCard(id: string): Promise<UnifiedCardDetail>;
  getSets(): Promise<UnifiedSet[]>;
  getSetCards(code: string): Promise<UnifiedCard[]>;
}

export async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 4: Write failing test for currency conversion**

`apps/web/src/lib/__tests__/currency.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { convertUsdToGbp, GBP_RATE } from "../currency";

describe("convertUsdToGbp", () => {
  it("converts a USD price to GBP", () => {
    const gbp = convertUsdToGbp(100);
    expect(gbp).toBe(100 * GBP_RATE);
  });

  it("rounds to 2 decimal places", () => {
    const gbp = convertUsdToGbp(10.999);
    expect(gbp).toBe(Math.round(10.999 * GBP_RATE * 100) / 100);
  });

  it("returns null for null input", () => {
    expect(convertUsdToGbp(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(convertUsdToGbp(undefined)).toBeNull();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

```bash
cd apps/web
npx vitest run src/lib/__tests__/currency.test.ts
```

Expected: FAIL — module not found.

Note: You may need to create `apps/web/vitest.config.ts` if it does not exist:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

And add `vitest` to `apps/web/package.json` devDependencies, then `npm install` from root.

- [ ] **Step 6: Implement currency conversion**

`apps/web/src/lib/currency.ts`:

```typescript
export const GBP_RATE = 0.79;

export function convertUsdToGbp(usd: number | null | undefined): number | null {
  if (usd === null || usd === undefined) return null;
  return Math.round(usd * GBP_RATE * 100) / 100;
}
```

- [ ] **Step 7: Run test to verify it passes**

```bash
cd apps/web
npx vitest run src/lib/__tests__/currency.test.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 8: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add packages/types/src/card-api.ts packages/types/src/index.ts apps/web/src/lib/adapters/types.ts apps/web/src/lib/currency.ts apps/web/src/lib/__tests__/currency.test.ts apps/web/vitest.config.ts apps/web/package.json
git commit -m "feat: add unified card types, adapter interface, and currency conversion"
```

---

### Task 2: Scryfall Adapter (Magic: The Gathering)

**Files:**
- Create: `apps/web/src/lib/adapters/scryfall.ts`
- Test: `apps/web/src/lib/adapters/__tests__/scryfall.test.ts`

**Interfaces:**
- Consumes: `GameAdapter`, `SearchOptions`, `fetchWithTimeout` from `./types`, `convertUsdToGbp` from `../currency`, `UnifiedCard`, `UnifiedCardDetail`, `UnifiedSet` from `@cardconomy/types`
- Produces: `scryfallAdapter: GameAdapter` — implements `searchCards`, `getCard`, `getSets`, `getSetCards` for Magic: The Gathering

- [ ] **Step 1: Write failing test for Scryfall search normalisation**

`apps/web/src/lib/adapters/__tests__/scryfall.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { scryfallAdapter } from "../scryfall";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("scryfallAdapter", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("has game set to mtg", () => {
    expect(scryfallAdapter.game).toBe("mtg");
  });

  it("normalises search results to UnifiedCard", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        object: "list",
        total_cards: 1,
        has_more: false,
        data: [
          {
            id: "abc-123",
            name: "Lightning Bolt",
            set: "2ed",
            set_name: "Unlimited Edition",
            collector_number: "162",
            rarity: "common",
            prices: { usd: "1.50", usd_foil: null },
            image_uris: {
              normal: "https://cards.scryfall.io/normal/abc.jpg",
              small: "https://cards.scryfall.io/small/abc.jpg",
            },
            finishes: ["nonfoil"],
          },
        ],
      }),
    });

    const results = await scryfallAdapter.searchCards("Lightning Bolt");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "abc-123",
      game: "mtg",
      name: "Lightning Bolt",
      setName: "Unlimited Edition",
      setCode: "2ed",
      number: "162",
      rarity: "common",
      imageUrl: "https://cards.scryfall.io/normal/abc.jpg",
      thumbnailUrl: "https://cards.scryfall.io/small/abc.jpg",
      finishes: ["standard"],
      priceUsd: 1.5,
    });
    expect(results[0].priceGbp).toBeCloseTo(1.5 * 0.79, 2);
  });

  it("returns empty array on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ details: "not found" }),
    });

    const results = await scryfallAdapter.searchCards("nonexistent");
    expect(results).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/web
npx vitest run src/lib/adapters/__tests__/scryfall.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Scryfall adapter**

`apps/web/src/lib/adapters/scryfall.ts`:

```typescript
import type { UnifiedCard, UnifiedCardDetail, UnifiedSet, CardPrintingRef } from "@cardconomy/types";
import type { GameAdapter, SearchOptions } from "./types";
import { fetchWithTimeout } from "./types";
import { convertUsdToGbp } from "../currency";

const BASE = "https://api.scryfall.com";

function normaliseFinishes(finishes: string[]): ("standard" | "foil")[] {
  return finishes.map((f) => (f === "foil" || f === "etched" ? "foil" : "standard"));
}

function normaliseCard(card: Record<string, unknown>): UnifiedCard {
  const imageUris = card.image_uris as Record<string, string> | undefined;
  const cardFaces = card.card_faces as Array<Record<string, unknown>> | undefined;
  const prices = card.prices as Record<string, string | null> | undefined;
  const finishes = card.finishes as string[] | undefined;

  // Double-faced cards store images on faces, not the root
  const image = imageUris?.normal
    ?? (cardFaces?.[0]?.image_uris as Record<string, string> | undefined)?.normal
    ?? "";
  const thumb = imageUris?.small
    ?? (cardFaces?.[0]?.image_uris as Record<string, string> | undefined)?.small
    ?? "";

  const usdPrice = prices?.usd ? parseFloat(prices.usd) : null;

  return {
    id: card.id as string,
    game: "mtg",
    name: card.name as string,
    setName: (card.set_name as string) ?? "",
    setCode: (card.set as string) ?? "",
    number: (card.collector_number as string) ?? "",
    rarity: (card.rarity as string) ?? "",
    imageUrl: image,
    thumbnailUrl: thumb,
    finishes: normaliseFinishes(finishes ?? ["nonfoil"]),
    priceUsd: usdPrice,
    priceGbp: convertUsdToGbp(usdPrice),
  };
}

export const scryfallAdapter: GameAdapter = {
  game: "mtg",

  async searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]> {
    const limit = options?.limit ?? 20;
    const encoded = encodeURIComponent(query);
    const url = `${BASE}/cards/search?q=${encoded}&unique=cards`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json();
      const cards = (data.data as Record<string, unknown>[]) ?? [];
      return cards.slice(0, limit).map(normaliseCard);
    } catch {
      return [];
    }
  },

  async getCard(id: string): Promise<UnifiedCardDetail> {
    const res = await fetchWithTimeout(`${BASE}/cards/${id}`);
    if (!res.ok) throw new Error(`Scryfall card not found: ${id}`);
    const card = await res.json();

    const base = normaliseCard(card);
    const prices = card.prices as Record<string, string | null> | undefined;
    const usdFoil = prices?.usd_foil ? parseFloat(prices.usd_foil) : undefined;
    const usdNormal = prices?.usd ? parseFloat(prices.usd) : undefined;

    // Fetch other printings
    let printings: CardPrintingRef[] = [];
    try {
      const printsUrl = card.prints_search_uri as string;
      if (printsUrl) {
        const printsRes = await fetchWithTimeout(printsUrl);
        if (printsRes.ok) {
          const printsData = await printsRes.json();
          printings = (printsData.data as Record<string, unknown>[])
            .filter((p) => p.id !== card.id)
            .slice(0, 10)
            .map((p) => ({
              id: p.id as string,
              setName: (p.set_name as string) ?? "",
              setCode: (p.set as string) ?? "",
              imageUrl: ((p.image_uris as Record<string, string>)?.small) ?? "",
            }));
        }
      }
    } catch {
      // printings are non-critical
    }

    return {
      ...base,
      types: [(card.type_line as string) ?? ""],
      subtypes: [],
      attributes: {
        ...(card.mana_cost ? { "Mana Cost": card.mana_cost as string } : {}),
        ...(card.power ? { "Power": card.power as string } : {}),
        ...(card.toughness ? { "Toughness": card.toughness as string } : {}),
        ...(card.loyalty ? { "Loyalty": card.loyalty as string } : {}),
      },
      description: (card.oracle_text as string) ?? (card.card_faces as Array<Record<string, unknown>>)?.[0]?.oracle_text as string ?? undefined,
      printings,
      prices: {
        standard: usdNormal !== undefined ? { usd: usdNormal, gbp: convertUsdToGbp(usdNormal) ?? undefined } : undefined,
        foil: usdFoil !== undefined ? { usd: usdFoil, gbp: convertUsdToGbp(usdFoil) ?? undefined } : undefined,
      },
    };
  },

  async getSets(): Promise<UnifiedSet[]> {
    const res = await fetchWithTimeout(`${BASE}/sets`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as Record<string, unknown>[])
      .filter((s) => s.set_type === "expansion" || s.set_type === "masters" || s.set_type === "draft_innovation" || s.set_type === "core")
      .map((s) => ({
        code: s.code as string,
        game: "mtg" as const,
        name: s.name as string,
        releaseDate: (s.released_at as string) ?? "",
        cardCount: (s.card_count as number) ?? 0,
        imageUrl: (s.icon_svg_uri as string) ?? null,
      }));
  },

  async getSetCards(code: string): Promise<UnifiedCard[]> {
    const url = `${BASE}/cards/search?q=e:${encodeURIComponent(code)}&unique=prints&order=set`;
    const allCards: UnifiedCard[] = [];
    let nextUrl: string | null = url;

    while (nextUrl) {
      try {
        const res = await fetchWithTimeout(nextUrl);
        if (!res.ok) break;
        const data = await res.json();
        const cards = (data.data as Record<string, unknown>[]) ?? [];
        allCards.push(...cards.map(normaliseCard));
        nextUrl = data.has_more ? (data.next_page as string) : null;
      } catch {
        break;
      }
    }

    return allCards;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/web
npx vitest run src/lib/adapters/__tests__/scryfall.test.ts
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/lib/adapters/scryfall.ts apps/web/src/lib/adapters/__tests__/scryfall.test.ts
git commit -m "feat: add Scryfall adapter for Magic: The Gathering"
```

---

### Task 3: Pokemon TCG Adapter

**Files:**
- Create: `apps/web/src/lib/adapters/pokemon-tcg.ts`
- Test: `apps/web/src/lib/adapters/__tests__/pokemon-tcg.test.ts`

**Interfaces:**
- Consumes: `GameAdapter`, `SearchOptions`, `fetchWithTimeout` from `./types`, `convertUsdToGbp` from `../currency`
- Produces: `pokemonTcgAdapter: GameAdapter`

- [ ] **Step 1: Write failing test**

`apps/web/src/lib/adapters/__tests__/pokemon-tcg.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { pokemonTcgAdapter } from "../pokemon-tcg";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("pokemonTcgAdapter", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("has game set to pkmn", () => {
    expect(pokemonTcgAdapter.game).toBe("pkmn");
  });

  it("normalises search results to UnifiedCard", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "sv3pt5-198",
            name: "Charizard ex",
            supertype: "Pok\u00e9mon",
            subtypes: ["Stage 2", "ex"],
            hp: "330",
            types: ["Fire"],
            rarity: "Special Illustration Rare",
            set: {
              id: "sv3pt5",
              name: "Paldean Fates",
              releaseDate: "2024/01/26",
            },
            number: "198",
            images: {
              small: "https://images.pokemontcg.io/sv3pt5/198.png",
              large: "https://images.pokemontcg.io/sv3pt5/198_hires.png",
            },
            tcgplayer: {
              prices: {
                holofoil: { market: 85.5 },
              },
            },
          },
        ],
        totalCount: 1,
      }),
    });

    const results = await pokemonTcgAdapter.searchCards("Charizard");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "sv3pt5-198",
      game: "pkmn",
      name: "Charizard ex",
      setName: "Paldean Fates",
      setCode: "sv3pt5",
      number: "198",
      rarity: "Special Illustration Rare",
      priceUsd: 85.5,
    });
    expect(results[0].priceGbp).toBeCloseTo(85.5 * 0.79, 2);
  });

  it("returns empty array on API error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const results = await pokemonTcgAdapter.searchCards("fail");
    expect(results).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/adapters/__tests__/pokemon-tcg.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement Pokemon TCG adapter**

`apps/web/src/lib/adapters/pokemon-tcg.ts`:

```typescript
import type { UnifiedCard, UnifiedCardDetail, UnifiedSet, CardPrintingRef } from "@cardconomy/types";
import type { GameAdapter, SearchOptions } from "./types";
import { fetchWithTimeout } from "./types";
import { convertUsdToGbp } from "../currency";

const BASE = "https://api.pokemontcg.io/v2";

function extractPrice(tcgplayer?: Record<string, unknown>): number | null {
  if (!tcgplayer?.prices) return null;
  const prices = tcgplayer.prices as Record<string, Record<string, number>>;
  // Try each price variant in preference order
  for (const variant of ["holofoil", "reverseHolofoil", "normal", "1stEditionHolofoil", "unlimitedHolofoil"]) {
    if (prices[variant]?.market) return prices[variant].market;
  }
  return null;
}

function normaliseCard(card: Record<string, unknown>): UnifiedCard {
  const set = card.set as Record<string, unknown>;
  const images = card.images as Record<string, string>;
  const tcgplayer = card.tcgplayer as Record<string, unknown> | undefined;
  const usdPrice = extractPrice(tcgplayer);

  return {
    id: card.id as string,
    game: "pkmn",
    name: card.name as string,
    setName: (set?.name as string) ?? "",
    setCode: (set?.id as string) ?? "",
    number: (card.number as string) ?? "",
    rarity: (card.rarity as string) ?? "",
    imageUrl: images?.large ?? images?.small ?? "",
    thumbnailUrl: images?.small ?? "",
    finishes: ["standard"],
    priceUsd: usdPrice,
    priceGbp: convertUsdToGbp(usdPrice),
  };
}

export const pokemonTcgAdapter: GameAdapter = {
  game: "pkmn",

  async searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]> {
    const limit = options?.limit ?? 20;
    const encoded = encodeURIComponent(query);
    const url = `${BASE}/cards?q=name:"${encoded}"&pageSize=${limit}&orderBy=-set.releaseDate`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json();
      return ((data.data as Record<string, unknown>[]) ?? []).map(normaliseCard);
    } catch {
      return [];
    }
  },

  async getCard(id: string): Promise<UnifiedCardDetail> {
    const res = await fetchWithTimeout(`${BASE}/cards/${id}`);
    if (!res.ok) throw new Error(`Pokemon TCG card not found: ${id}`);
    const { data: card } = await res.json();

    const base = normaliseCard(card);
    const tcgplayer = card.tcgplayer as Record<string, unknown> | undefined;
    const prices = tcgplayer?.prices as Record<string, Record<string, number>> | undefined;

    const normalPrice = prices?.normal?.market ?? prices?.unlimitedHolofoil?.market ?? undefined;
    const holoPrice = prices?.holofoil?.market ?? prices?.["1stEditionHolofoil"]?.market ?? undefined;

    // Search for other printings by name
    let printings: CardPrintingRef[] = [];
    try {
      const nameEncoded = encodeURIComponent(card.name as string);
      const printsRes = await fetchWithTimeout(`${BASE}/cards?q=name:"${nameEncoded}"&pageSize=10&orderBy=-set.releaseDate`);
      if (printsRes.ok) {
        const printsData = await printsRes.json();
        printings = ((printsData.data as Record<string, unknown>[]) ?? [])
          .filter((p) => p.id !== card.id)
          .slice(0, 10)
          .map((p) => {
            const pSet = p.set as Record<string, unknown>;
            const pImages = p.images as Record<string, string>;
            return {
              id: p.id as string,
              setName: (pSet?.name as string) ?? "",
              setCode: (pSet?.id as string) ?? "",
              imageUrl: pImages?.small ?? "",
            };
          });
      }
    } catch {
      // non-critical
    }

    const attacks = card.attacks as Array<Record<string, unknown>> | undefined;
    const attackText = attacks?.map((a) => `${a.name}: ${a.damage ?? ""}`).join(", ");

    return {
      ...base,
      types: (card.types as string[]) ?? [],
      subtypes: (card.subtypes as string[]) ?? [],
      attributes: {
        ...(card.hp ? { HP: card.hp as string } : {}),
        ...(attackText ? { Attacks: attackText } : {}),
        ...(card.weaknesses ? { Weakness: ((card.weaknesses as Array<Record<string, string>>)[0])?.type ?? "" } : {}),
        ...(card.retreatCost ? { "Retreat Cost": String((card.retreatCost as string[]).length) } : {}),
      },
      description: (card.flavorText as string) ?? undefined,
      printings,
      prices: {
        standard: normalPrice !== undefined ? { usd: normalPrice, gbp: convertUsdToGbp(normalPrice) ?? undefined } : undefined,
        foil: holoPrice !== undefined ? { usd: holoPrice, gbp: convertUsdToGbp(holoPrice) ?? undefined } : undefined,
      },
    };
  },

  async getSets(): Promise<UnifiedSet[]> {
    const res = await fetchWithTimeout(`${BASE}/sets?orderBy=-releaseDate`);
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.data as Record<string, unknown>[]) ?? []).map((s) => ({
      code: s.id as string,
      game: "pkmn" as const,
      name: s.name as string,
      releaseDate: (s.releaseDate as string) ?? "",
      cardCount: (s.total as number) ?? 0,
      imageUrl: ((s.images as Record<string, string>)?.logo) ?? null,
    }));
  },

  async getSetCards(code: string): Promise<UnifiedCard[]> {
    const url = `${BASE}/cards?q=set.id:${encodeURIComponent(code)}&pageSize=250&orderBy=number`;
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json();
      return ((data.data as Record<string, unknown>[]) ?? []).map(normaliseCard);
    } catch {
      return [];
    }
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/adapters/__tests__/pokemon-tcg.test.ts
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/lib/adapters/pokemon-tcg.ts apps/web/src/lib/adapters/__tests__/pokemon-tcg.test.ts
git commit -m "feat: add Pokemon TCG adapter"
```

---

### Task 4: YGOPRODeck Adapter (Yu-Gi-Oh!)

**Files:**
- Create: `apps/web/src/lib/adapters/ygoprodeck.ts`
- Test: `apps/web/src/lib/adapters/__tests__/ygoprodeck.test.ts`

**Interfaces:**
- Consumes: `GameAdapter`, `SearchOptions`, `fetchWithTimeout`, `convertUsdToGbp`
- Produces: `ygoprodeckAdapter: GameAdapter`

- [ ] **Step 1: Write failing test**

`apps/web/src/lib/adapters/__tests__/ygoprodeck.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ygoprodeckAdapter } from "../ygoprodeck";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("ygoprodeckAdapter", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("has game set to ygo", () => {
    expect(ygoprodeckAdapter.game).toBe("ygo");
  });

  it("normalises search results to UnifiedCard", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 89631139,
            name: "Blue-Eyes White Dragon",
            type: "Normal Monster",
            frameType: "normal",
            desc: "This legendary dragon...",
            race: "Dragon",
            atk: 3000,
            def: 2500,
            level: 8,
            attribute: "LIGHT",
            card_sets: [
              { set_name: "Legend of Blue Eyes White Dragon", set_code: "LOB-001", set_rarity: "Ultra Rare" },
            ],
            card_prices: [
              { tcgplayer_price: "3.99", cardmarket_price: "2.50" },
            ],
            card_images: [
              {
                id: 89631139,
                image_url: "https://images.ygoprodeck.com/images/cards/89631139.jpg",
                image_url_small: "https://images.ygoprodeck.com/images/cards_small/89631139.jpg",
              },
            ],
          },
        ],
      }),
    });

    const results = await ygoprodeckAdapter.searchCards("Blue-Eyes");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "89631139",
      game: "ygo",
      name: "Blue-Eyes White Dragon",
      rarity: "Ultra Rare",
      priceUsd: 3.99,
    });
  });

  it("returns empty array on API error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });
    const results = await ygoprodeckAdapter.searchCards("fail");
    expect(results).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test, verify fails, implement adapter**

`apps/web/src/lib/adapters/ygoprodeck.ts`:

```typescript
import type { UnifiedCard, UnifiedCardDetail, UnifiedSet, CardPrintingRef } from "@cardconomy/types";
import type { GameAdapter, SearchOptions } from "./types";
import { fetchWithTimeout } from "./types";
import { convertUsdToGbp } from "../currency";

const BASE = "https://db.ygoprodeck.com/api/v7";

function normaliseCard(card: Record<string, unknown>): UnifiedCard {
  const images = card.card_images as Array<Record<string, string>> | undefined;
  const prices = card.card_prices as Array<Record<string, string>> | undefined;
  const sets = card.card_sets as Array<Record<string, string>> | undefined;
  const usdPrice = prices?.[0]?.tcgplayer_price ? parseFloat(prices[0].tcgplayer_price) : null;
  const validPrice = usdPrice && usdPrice > 0 ? usdPrice : null;

  return {
    id: String(card.id),
    game: "ygo",
    name: card.name as string,
    setName: sets?.[0]?.set_name ?? "",
    setCode: sets?.[0]?.set_code?.split("-")[0] ?? "",
    number: sets?.[0]?.set_code ?? "",
    rarity: sets?.[0]?.set_rarity ?? (card.race as string) ?? "",
    imageUrl: images?.[0]?.image_url ?? "",
    thumbnailUrl: images?.[0]?.image_url_small ?? "",
    finishes: ["standard"],
    priceUsd: validPrice,
    priceGbp: convertUsdToGbp(validPrice),
  };
}

export const ygoprodeckAdapter: GameAdapter = {
  game: "ygo",

  async searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]> {
    const limit = options?.limit ?? 20;
    const encoded = encodeURIComponent(query);
    const url = `${BASE}/cardinfo.php?fname=${encoded}&num=${limit}&offset=0`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json();
      return ((data.data as Record<string, unknown>[]) ?? []).map(normaliseCard);
    } catch {
      return [];
    }
  },

  async getCard(id: string): Promise<UnifiedCardDetail> {
    const res = await fetchWithTimeout(`${BASE}/cardinfo.php?id=${id}`);
    if (!res.ok) throw new Error(`YGOPRODeck card not found: ${id}`);
    const data = await res.json();
    const card = (data.data as Record<string, unknown>[])[0];

    const base = normaliseCard(card);
    const prices = card.card_prices as Array<Record<string, string>> | undefined;
    const usdPrice = prices?.[0]?.tcgplayer_price ? parseFloat(prices[0].tcgplayer_price) : undefined;

    const sets = card.card_sets as Array<Record<string, string>> | undefined;
    const printings: CardPrintingRef[] = (sets ?? []).slice(1, 11).map((s, i) => ({
      id: `${card.id}-${i}`,
      setName: s.set_name,
      setCode: s.set_code?.split("-")[0] ?? "",
      imageUrl: base.thumbnailUrl,
    }));

    return {
      ...base,
      types: [(card.type as string) ?? ""],
      subtypes: [(card.race as string) ?? ""],
      attributes: {
        ...(card.attribute ? { Attribute: card.attribute as string } : {}),
        ...(card.level ? { Level: String(card.level) } : {}),
        ...(card.atk !== undefined ? { ATK: String(card.atk) } : {}),
        ...(card.def !== undefined ? { DEF: String(card.def) } : {}),
      },
      description: (card.desc as string) ?? undefined,
      printings,
      prices: {
        standard: usdPrice !== undefined && usdPrice > 0 ? { usd: usdPrice, gbp: convertUsdToGbp(usdPrice) ?? undefined } : undefined,
      },
    };
  },

  async getSets(): Promise<UnifiedSet[]> {
    const res = await fetchWithTimeout(`${BASE}/cardsets.php`);
    if (!res.ok) return [];
    const data = await res.json();
    const seen = new Set<string>();
    return (data as Record<string, unknown>[])
      .filter((s) => {
        const name = s.set_name as string;
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .slice(0, 100)
      .map((s) => ({
        code: (s.set_code as string)?.split("-")[0] ?? (s.set_name as string),
        game: "ygo" as const,
        name: s.set_name as string,
        releaseDate: (s.tcg_date as string) ?? "",
        cardCount: (s.num_of_cards as number) ?? 0,
        imageUrl: null,
      }));
  },

  async getSetCards(code: string): Promise<UnifiedCard[]> {
    const encoded = encodeURIComponent(code);
    const url = `${BASE}/cardinfo.php?cardset=${encoded}`;
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json();
      return ((data.data as Record<string, unknown>[]) ?? []).map(normaliseCard);
    } catch {
      return [];
    }
  },
};
```

- [ ] **Step 3: Run tests, build, commit**

```bash
npx vitest run src/lib/adapters/__tests__/ygoprodeck.test.ts
npx turbo build --filter=@cardconomy/web
git add apps/web/src/lib/adapters/ygoprodeck.ts apps/web/src/lib/adapters/__tests__/ygoprodeck.test.ts
git commit -m "feat: add YGOPRODeck adapter for Yu-Gi-Oh!"
```

---

### Task 5: One Piece and Lorcana Adapters

**Files:**
- Create: `apps/web/src/lib/adapters/onepiece.ts`
- Create: `apps/web/src/lib/adapters/lorcana.ts`
- Test: `apps/web/src/lib/adapters/__tests__/onepiece.test.ts`
- Test: `apps/web/src/lib/adapters/__tests__/lorcana.test.ts`

**Interfaces:**
- Consumes: `GameAdapter`, `fetchWithTimeout`, `convertUsdToGbp`
- Produces: `onepieceAdapter: GameAdapter`, `lorcanaAdapter: GameAdapter`

- [ ] **Step 1: Write failing test for One Piece adapter**

`apps/web/src/lib/adapters/__tests__/onepiece.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { onepieceAdapter } from "../onepiece";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("onepieceAdapter", () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it("has game set to onepiece", () => {
    expect(onepieceAdapter.game).toBe("onepiece");
  });

  it("normalises card data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          id: "OP01-001",
          name: "Roronoa Zoro",
          rarity: "L",
          type: "LEADER",
          images: { small: "https://example.com/op01-001.png", large: "https://example.com/op01-001.png" },
          cost: 5,
          power: 5000,
          color: "Red",
          family: "Supernovas/Straw Hat Crew",
          ability: "All Characters gain +1000",
          set: { name: "ROMANCE DAWN [OP01]" },
          code: "OP01-001",
        },
      ]),
    });

    const results = await onepieceAdapter.searchCards("Zoro");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      game: "onepiece",
      name: "Roronoa Zoro",
    });
  });

  it("returns empty array on error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    expect(await onepieceAdapter.searchCards("fail")).toEqual([]);
  });
});
```

- [ ] **Step 2: Implement One Piece adapter**

`apps/web/src/lib/adapters/onepiece.ts`:

```typescript
import type { UnifiedCard, UnifiedCardDetail, UnifiedSet } from "@cardconomy/types";
import type { GameAdapter, SearchOptions } from "./types";
import { fetchWithTimeout } from "./types";

const SETS = ["OP01", "OP02", "OP03", "OP04", "OP05", "OP06", "OP07", "OP08", "OP09", "ST01", "ST02", "ST03", "ST04", "ST05"];
const BASE = "https://raw.githubusercontent.com/apitcg/one-piece-tcg-data/main";

let cardCache: Record<string, unknown>[] | null = null;

async function loadAllCards(): Promise<Record<string, unknown>[]> {
  if (cardCache) return cardCache;

  const results: Record<string, unknown>[] = [];
  const fetches = SETS.map(async (set) => {
    try {
      const res = await fetchWithTimeout(`${BASE}/cards/en/${set.toLowerCase()}.json`, 15000);
      if (res.ok) {
        const cards = await res.json();
        if (Array.isArray(cards)) results.push(...cards);
      }
    } catch { /* skip failed sets */ }
  });

  await Promise.all(fetches);
  cardCache = results;
  return results;
}

function normaliseCard(card: Record<string, unknown>): UnifiedCard {
  const images = card.images as Record<string, string> | undefined;
  const set = card.set as Record<string, string> | undefined;

  return {
    id: (card.id as string) ?? (card.code as string) ?? "",
    game: "onepiece",
    name: card.name as string,
    setName: set?.name ?? "",
    setCode: ((card.code as string) ?? "").split("-")[0],
    number: (card.code as string) ?? "",
    rarity: (card.rarity as string) ?? "",
    imageUrl: images?.large ?? images?.small ?? "",
    thumbnailUrl: images?.small ?? "",
    finishes: ["standard"],
    priceUsd: null,
    priceGbp: null,
  };
}

export const onepieceAdapter: GameAdapter = {
  game: "onepiece",

  async searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]> {
    const limit = options?.limit ?? 20;
    try {
      const allCards = await loadAllCards();
      const q = query.toLowerCase();
      return allCards
        .filter((c) => ((c.name as string) ?? "").toLowerCase().includes(q))
        .slice(0, limit)
        .map(normaliseCard);
    } catch {
      return [];
    }
  },

  async getCard(id: string): Promise<UnifiedCardDetail> {
    const allCards = await loadAllCards();
    const card = allCards.find((c) => c.id === id || c.code === id);
    if (!card) throw new Error(`One Piece card not found: ${id}`);

    const base = normaliseCard(card);
    return {
      ...base,
      types: [(card.type as string) ?? ""],
      subtypes: [],
      attributes: {
        ...(card.cost !== undefined ? { Cost: String(card.cost) } : {}),
        ...(card.power ? { Power: String(card.power) } : {}),
        ...(card.counter && card.counter !== "-" ? { Counter: String(card.counter) } : {}),
        ...(card.color ? { Color: card.color as string } : {}),
        ...(card.family ? { Family: card.family as string } : {}),
      },
      description: (card.ability as string) ?? (card.trigger as string) ?? undefined,
      printings: [],
      prices: {},
    };
  },

  async getSets(): Promise<UnifiedSet[]> {
    return SETS.map((code) => ({
      code,
      game: "onepiece" as const,
      name: code.startsWith("ST") ? `Starter Deck ${code}` : `Booster Pack ${code}`,
      releaseDate: "",
      cardCount: 0,
      imageUrl: null,
    }));
  },

  async getSetCards(code: string): Promise<UnifiedCard[]> {
    try {
      const res = await fetchWithTimeout(`${BASE}/cards/en/${code.toLowerCase()}.json`, 15000);
      if (!res.ok) return [];
      const cards = await res.json();
      if (!Array.isArray(cards)) return [];
      return cards.map(normaliseCard);
    } catch {
      return [];
    }
  },
};
```

- [ ] **Step 3: Write failing test for Lorcana adapter**

`apps/web/src/lib/adapters/__tests__/lorcana.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { lorcanaAdapter } from "../lorcana";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("lorcanaAdapter", () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it("has game set to lorcana", () => {
    expect(lorcanaAdapter.game).toBe("lorcana");
  });

  it("normalises card data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          cost: 4,
          inkwell: true,
          attack: 3,
          defence: 4,
          color: "amber",
          lore: 2,
          type: "glimmer",
          illustrator: "Someone",
          languages: {
            en: { name: "Ariel", title: "On Human Legs" },
          },
          variants: [
            {
              set: "tfc",
              id: 1,
              rarity: "uncommon",
              dreamborn: "001-001",
            },
          ],
        },
      ]),
    });

    const results = await lorcanaAdapter.searchCards("Ariel");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      game: "lorcana",
      name: "Ariel - On Human Legs",
    });
  });

  it("returns empty array on error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    expect(await lorcanaAdapter.searchCards("fail")).toEqual([]);
  });
});
```

- [ ] **Step 4: Implement Lorcana adapter**

`apps/web/src/lib/adapters/lorcana.ts`:

```typescript
import type { UnifiedCard, UnifiedCardDetail, UnifiedSet } from "@cardconomy/types";
import type { GameAdapter, SearchOptions } from "./types";
import { fetchWithTimeout } from "./types";

const BASE = "https://api-lorcana.com";

let cardCache: Record<string, unknown>[] | null = null;

async function loadAllCards(): Promise<Record<string, unknown>[]> {
  if (cardCache) return cardCache;
  try {
    const res = await fetchWithTimeout(`${BASE}/cards`, 15000);
    if (!res.ok) return [];
    const data = await res.json();
    cardCache = Array.isArray(data) ? data : [];
    return cardCache;
  } catch {
    return [];
  }
}

function getCardName(card: Record<string, unknown>): string {
  const langs = card.languages as Record<string, Record<string, string>> | undefined;
  const en = langs?.en;
  if (!en) return "Unknown";
  return en.title ? `${en.name} - ${en.title}` : en.name;
}

function normaliseCard(card: Record<string, unknown>): UnifiedCard {
  const variants = card.variants as Array<Record<string, unknown>> | undefined;
  const firstVariant = variants?.[0];
  const setCode = (firstVariant?.set as string) ?? "";
  const rarity = (firstVariant?.rarity as string) ?? "";
  const dreamborn = (firstVariant?.dreamborn as string) ?? "";

  return {
    id: dreamborn || `${setCode}-${firstVariant?.id ?? 0}`,
    game: "lorcana",
    name: getCardName(card),
    setName: setCode.toUpperCase(),
    setCode,
    number: dreamborn,
    rarity,
    imageUrl: "",
    thumbnailUrl: "",
    finishes: ["standard"],
    priceUsd: null,
    priceGbp: null,
  };
}

export const lorcanaAdapter: GameAdapter = {
  game: "lorcana",

  async searchCards(query: string, options?: SearchOptions): Promise<UnifiedCard[]> {
    const limit = options?.limit ?? 20;
    try {
      const allCards = await loadAllCards();
      const q = query.toLowerCase();
      return allCards
        .filter((c) => getCardName(c).toLowerCase().includes(q))
        .slice(0, limit)
        .map(normaliseCard);
    } catch {
      return [];
    }
  },

  async getCard(id: string): Promise<UnifiedCardDetail> {
    const allCards = await loadAllCards();
    const card = allCards.find((c) => {
      const variants = c.variants as Array<Record<string, unknown>> | undefined;
      return variants?.some((v) => v.dreamborn === id || `${v.set}-${v.id}` === id);
    });
    if (!card) throw new Error(`Lorcana card not found: ${id}`);

    const base = normaliseCard(card);
    return {
      ...base,
      types: [(card.type as string) ?? ""],
      subtypes: ((card.classifications as Array<Record<string, string>>) ?? []).map((c) => c.en ?? c.slug ?? ""),
      attributes: {
        ...(card.cost !== undefined ? { Cost: String(card.cost) } : {}),
        ...(card.attack !== undefined ? { Strength: String(card.attack) } : {}),
        ...(card.defence !== undefined ? { Willpower: String(card.defence) } : {}),
        ...(card.lore !== undefined ? { Lore: String(card.lore) } : {}),
        ...(card.color ? { Color: card.color as string } : {}),
        ...(card.inkwell !== undefined ? { Inkable: card.inkwell ? "Yes" : "No" } : {}),
      },
      description: undefined,
      printings: [],
      prices: {},
    };
  },

  async getSets(): Promise<UnifiedSet[]> {
    try {
      const res = await fetchWithTimeout(`${BASE}/sets`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.map((s: Record<string, unknown>) => ({
        code: (s.code as string) ?? (s.id as string) ?? "",
        game: "lorcana" as const,
        name: (s.name as string) ?? "",
        releaseDate: (s.releaseDate as string) ?? "",
        cardCount: (s.cardCount as number) ?? 0,
        imageUrl: null,
      }));
    } catch {
      return [];
    }
  },

  async getSetCards(code: string): Promise<UnifiedCard[]> {
    try {
      const allCards = await loadAllCards();
      return allCards
        .filter((c) => {
          const variants = c.variants as Array<Record<string, unknown>> | undefined;
          return variants?.some((v) => v.set === code);
        })
        .map(normaliseCard);
    } catch {
      return [];
    }
  },
};
```

- [ ] **Step 5: Run all tests, build, commit**

```bash
npx vitest run src/lib/adapters/__tests__/onepiece.test.ts
npx vitest run src/lib/adapters/__tests__/lorcana.test.ts
npx turbo build --filter=@cardconomy/web
git add apps/web/src/lib/adapters/onepiece.ts apps/web/src/lib/adapters/lorcana.ts apps/web/src/lib/adapters/__tests__/onepiece.test.ts apps/web/src/lib/adapters/__tests__/lorcana.test.ts
git commit -m "feat: add One Piece and Lorcana adapters"
```

---

### Task 6: Adapter Factory and API Routes

**Files:**
- Create: `apps/web/src/lib/adapters/index.ts`
- Create: `apps/web/src/app/api/search/route.ts`
- Create: `apps/web/src/app/api/cards/[game]/[id]/route.ts`
- Create: `apps/web/src/app/api/sets/[game]/route.ts`
- Create: `apps/web/src/app/api/sets/[game]/[code]/route.ts`
- Create: `apps/web/src/app/api/sets/[game]/[code]/cards/route.ts`
- Create: `apps/web/src/app/api/trending/route.ts`
- Create: `apps/web/src/app/api/new-releases/route.ts`
- Modify: `apps/web/next.config.ts` (add external image domains)

**Interfaces:**
- Consumes: `scryfallAdapter`, `pokemonTcgAdapter`, `ygoprodeckAdapter`, `onepieceAdapter`, `lorcanaAdapter`
- Produces: `getAdapter(game: GameId): GameAdapter`, `searchAllGames(query, games, limit)`, and all API routes

- [ ] **Step 1: Create adapter factory**

`apps/web/src/lib/adapters/index.ts`:

```typescript
import type { GameId, UnifiedCard, UnifiedSet } from "@cardconomy/types";
import type { GameAdapter } from "./types";
import { scryfallAdapter } from "./scryfall";
import { pokemonTcgAdapter } from "./pokemon-tcg";
import { ygoprodeckAdapter } from "./ygoprodeck";
import { onepieceAdapter } from "./onepiece";
import { lorcanaAdapter } from "./lorcana";

const adapters: Record<GameId, GameAdapter> = {
  mtg: scryfallAdapter,
  pkmn: pokemonTcgAdapter,
  ygo: ygoprodeckAdapter,
  onepiece: onepieceAdapter,
  lorcana: lorcanaAdapter,
  digimon: scryfallAdapter, // placeholder — no Digimon API yet
};

export function getAdapter(game: GameId): GameAdapter {
  const adapter = adapters[game];
  if (!adapter) throw new Error(`No adapter for game: ${game}`);
  return adapter;
}

export async function searchAllGames(
  query: string,
  games: GameId[],
  limit: number = 20
): Promise<UnifiedCard[]> {
  const perGameLimit = Math.ceil(limit / games.length);

  const results = await Promise.allSettled(
    games.map((game) =>
      getAdapter(game).searchCards(query, { limit: perGameLimit })
    )
  );

  const cards: UnifiedCard[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      cards.push(...result.value);
    }
  }

  // Sort: exact name matches first, then alphabetical
  const q = query.toLowerCase();
  cards.sort((a, b) => {
    const aExact = a.name.toLowerCase() === q ? 0 : 1;
    const bExact = b.name.toLowerCase() === q ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.name.localeCompare(b.name);
  });

  return cards.slice(0, limit);
}

export async function getAllSets(games: GameId[]): Promise<UnifiedSet[]> {
  const results = await Promise.allSettled(
    games.map((game) => getAdapter(game).getSets())
  );

  const sets: UnifiedSet[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      sets.push(...result.value);
    }
  }

  return sets.sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
}
```

- [ ] **Step 2: Create search API route**

`apps/web/src/app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import type { GameId } from "@cardconomy/types";
import { searchAllGames } from "@/lib/adapters";

const ALL_GAMES: GameId[] = ["pkmn", "mtg", "ygo", "onepiece", "lorcana"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");
  const gamesParam = searchParams.get("games");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!query || query.length < 3) {
    return NextResponse.json({ cards: [], error: "Query must be at least 3 characters" }, { status: 400 });
  }

  const games: GameId[] = gamesParam
    ? (gamesParam.split(",") as GameId[]).filter((g) => ALL_GAMES.includes(g))
    : ALL_GAMES;

  const cards = await searchAllGames(query, games, limit);
  return NextResponse.json({ cards });
}
```

- [ ] **Step 3: Create card detail API route**

`apps/web/src/app/api/cards/[game]/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import type { GameId } from "@cardconomy/types";
import { getAdapter } from "@/lib/adapters";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ game: string; id: string }> }
) {
  const { game, id } = await params;

  try {
    const adapter = getAdapter(game as GameId);
    const card = await adapter.getCard(id);
    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Card not found" },
      { status: 404 }
    );
  }
}
```

- [ ] **Step 4: Create sets API routes**

`apps/web/src/app/api/sets/[game]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import type { GameId } from "@cardconomy/types";
import { getAdapter } from "@/lib/adapters";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ game: string }> }
) {
  const { game } = await params;

  try {
    const adapter = getAdapter(game as GameId);
    const sets = await adapter.getSets();
    return NextResponse.json({ sets });
  } catch {
    return NextResponse.json({ sets: [] });
  }
}
```

`apps/web/src/app/api/sets/[game]/[code]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import type { GameId } from "@cardconomy/types";
import { getAdapter } from "@/lib/adapters";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ game: string; code: string }> }
) {
  const { game, code } = await params;

  try {
    const adapter = getAdapter(game as GameId);
    const sets = await adapter.getSets();
    const set = sets.find((s) => s.code === code);
    if (!set) return NextResponse.json({ error: "Set not found" }, { status: 404 });
    return NextResponse.json({ set });
  } catch {
    return NextResponse.json({ error: "Set not found" }, { status: 404 });
  }
}
```

`apps/web/src/app/api/sets/[game]/[code]/cards/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import type { GameId } from "@cardconomy/types";
import { getAdapter } from "@/lib/adapters";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ game: string; code: string }> }
) {
  const { game, code } = await params;

  try {
    const adapter = getAdapter(game as GameId);
    const cards = await adapter.getSetCards(code);
    return NextResponse.json({ cards });
  } catch {
    return NextResponse.json({ cards: [] });
  }
}
```

- [ ] **Step 5: Create trending and new-releases routes**

`apps/web/src/app/api/trending/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { searchAllGames } from "@/lib/adapters";
import type { GameId } from "@cardconomy/types";

const TRENDING_QUERIES = ["Charizard", "Black Lotus", "Blue-Eyes White Dragon", "Luffy", "Elsa"];
const GAMES: GameId[] = ["pkmn", "mtg", "ygo", "onepiece", "lorcana"];

export async function GET() {
  // Fetch one popular card per game as a simple trending implementation
  const results = await Promise.allSettled(
    TRENDING_QUERIES.map((query, i) =>
      searchAllGames(query, [GAMES[i]], 1)
    )
  );

  const cards = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => (r as PromiseFulfilledResult<typeof results[0] extends PromiseFulfilledResult<infer T> ? T : never>).value);

  return NextResponse.json({ cards });
}
```

`apps/web/src/app/api/new-releases/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getAllSets } from "@/lib/adapters";
import type { GameId } from "@cardconomy/types";

const ALL_GAMES: GameId[] = ["pkmn", "mtg", "ygo", "onepiece", "lorcana"];

export async function GET() {
  const sets = await getAllSets(ALL_GAMES);
  // Return the 10 most recent sets across all games
  return NextResponse.json({ sets: sets.slice(0, 10) });
}
```

- [ ] **Step 6: Update next.config.ts with external image domains**

Add to `apps/web/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@cardconomy/ui",
    "@cardconomy/store",
    "@cardconomy/types",
    "@cardconomy/sanity",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cards.scryfall.io" },
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "images.ygoprodeck.com" },
      { protocol: "https", hostname: "en.onepiece-cardgame.com" },
      { protocol: "https", hostname: "api-lorcana.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 7: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/lib/adapters/index.ts apps/web/src/app/api apps/web/next.config.ts
git commit -m "feat: add adapter factory and all API routes (search, cards, sets, trending)"
```

---

### Task 7: TanStack Query Hooks

**Files:**
- Create: `apps/web/src/hooks/use-search.ts`
- Create: `apps/web/src/hooks/use-card.ts`
- Create: `apps/web/src/hooks/use-sets.ts`

**Interfaces:**
- Consumes: `UnifiedCard`, `UnifiedCardDetail`, `UnifiedSet`, `GameId` from `@cardconomy/types`
- Produces: `useSearch(query, games)`, `useCard(game, id)`, `useSets(game)`, `useSetCards(game, code)`, `useTrending()`, `useNewReleases()`

- [ ] **Step 1: Create search hook**

`apps/web/src/hooks/use-search.ts`:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import type { GameId, UnifiedCard } from "@cardconomy/types";

interface SearchResult {
  cards: UnifiedCard[];
}

export function useSearch(query: string, games?: GameId[]) {
  return useQuery<SearchResult>({
    queryKey: ["search", query, games],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, limit: "20" });
      if (games?.length) params.set("games", games.join(","));
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) return { cards: [] };
      return res.json();
    },
    enabled: query.length >= 3,
    staleTime: 60 * 1000,
  });
}

export function useTrending() {
  return useQuery<SearchResult>({
    queryKey: ["trending"],
    queryFn: async () => {
      const res = await fetch("/api/trending");
      if (!res.ok) return { cards: [] };
      return res.json();
    },
    staleTime: 15 * 60 * 1000,
  });
}
```

- [ ] **Step 2: Create card hook**

`apps/web/src/hooks/use-card.ts`:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import type { GameId, UnifiedCardDetail } from "@cardconomy/types";

interface CardResult {
  card: UnifiedCardDetail;
}

export function useCard(game: GameId, id: string) {
  return useQuery<CardResult>({
    queryKey: ["card", game, id],
    queryFn: async () => {
      const res = await fetch(`/api/cards/${game}/${id}`);
      if (!res.ok) throw new Error("Card not found");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

- [ ] **Step 3: Create sets hook**

`apps/web/src/hooks/use-sets.ts`:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import type { GameId, UnifiedCard, UnifiedSet } from "@cardconomy/types";

interface SetsResult {
  sets: UnifiedSet[];
}

interface SetCardsResult {
  cards: UnifiedCard[];
}

interface NewReleasesResult {
  sets: UnifiedSet[];
}

export function useSets(game: GameId) {
  return useQuery<SetsResult>({
    queryKey: ["sets", game],
    queryFn: async () => {
      const res = await fetch(`/api/sets/${game}`);
      if (!res.ok) return { sets: [] };
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useSetCards(game: GameId, code: string) {
  return useQuery<SetCardsResult>({
    queryKey: ["setCards", game, code],
    queryFn: async () => {
      const res = await fetch(`/api/sets/${game}/${code}/cards`);
      if (!res.ok) return { cards: [] };
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useNewReleases() {
  return useQuery<NewReleasesResult>({
    queryKey: ["newReleases"],
    queryFn: async () => {
      const res = await fetch("/api/new-releases");
      if (!res.ok) return { sets: [] };
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}
```

- [ ] **Step 4: Build and commit**

```bash
npx turbo build --filter=@cardconomy/web
git add apps/web/src/hooks
git commit -m "feat: add TanStack Query hooks for search, card detail, and sets"
```

---

### Task 8: Watchlist Store

**Files:**
- Create: `packages/store/src/watchlist.ts`
- Modify: `packages/store/src/index.ts`
- Test: `packages/store/src/__tests__/watchlist.test.ts`

**Interfaces:**
- Consumes: `GameId` from `@cardconomy/types`
- Produces: `useWatchlistStore` with `cards: WatchedCard[]`, `addCard(card)`, `removeCard(id, game)`, `isWatched(id, game)`, `cardCount()`

- [ ] **Step 1: Write failing test**

`packages/store/src/__tests__/watchlist.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { useWatchlistStore } from "../watchlist";

describe("watchlist store", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ cards: [] });
  });

  it("starts empty", () => {
    expect(useWatchlistStore.getState().cards).toEqual([]);
    expect(useWatchlistStore.getState().cardCount()).toBe(0);
  });

  it("adds a card", () => {
    useWatchlistStore.getState().addCard({
      id: "abc-123",
      game: "mtg",
      name: "Lightning Bolt",
      imageUrl: "https://example.com/bolt.jpg",
      priceWhenAdded: 1.5,
      addedAt: "2026-06-25T00:00:00Z",
    });
    expect(useWatchlistStore.getState().cards).toHaveLength(1);
    expect(useWatchlistStore.getState().isWatched("abc-123", "mtg")).toBe(true);
  });

  it("does not add duplicates", () => {
    const card = {
      id: "abc-123",
      game: "mtg" as const,
      name: "Lightning Bolt",
      imageUrl: "",
      priceWhenAdded: null,
      addedAt: "2026-06-25T00:00:00Z",
    };
    useWatchlistStore.getState().addCard(card);
    useWatchlistStore.getState().addCard(card);
    expect(useWatchlistStore.getState().cards).toHaveLength(1);
  });

  it("removes a card", () => {
    useWatchlistStore.getState().addCard({
      id: "abc-123",
      game: "mtg",
      name: "Lightning Bolt",
      imageUrl: "",
      priceWhenAdded: null,
      addedAt: "2026-06-25T00:00:00Z",
    });
    useWatchlistStore.getState().removeCard("abc-123", "mtg");
    expect(useWatchlistStore.getState().cards).toHaveLength(0);
    expect(useWatchlistStore.getState().isWatched("abc-123", "mtg")).toBe(false);
  });

  it("distinguishes cards by game", () => {
    useWatchlistStore.getState().addCard({
      id: "123",
      game: "mtg",
      name: "Card A",
      imageUrl: "",
      priceWhenAdded: null,
      addedAt: "2026-06-25T00:00:00Z",
    });
    expect(useWatchlistStore.getState().isWatched("123", "mtg")).toBe(true);
    expect(useWatchlistStore.getState().isWatched("123", "pkmn")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/store
npx vitest run src/__tests__/watchlist.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement watchlist store**

`packages/store/src/watchlist.ts`:

```typescript
import { create } from "zustand";
import type { GameId } from "@cardconomy/types";

export interface WatchedCard {
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
  cardCount: () => number;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  cards: [],

  addCard: (card) => {
    const { cards } = get();
    if (cards.some((c) => c.id === card.id && c.game === card.game)) return;
    set({ cards: [...cards, card] });
  },

  removeCard: (id, game) => {
    set({
      cards: get().cards.filter((c) => !(c.id === id && c.game === game)),
    });
  },

  isWatched: (id, game) =>
    get().cards.some((c) => c.id === id && c.game === game),

  cardCount: () => get().cards.length,
}));
```

- [ ] **Step 4: Update barrel export**

Add to `packages/store/src/index.ts`:

```typescript
export { useWatchlistStore, type WatchedCard } from "./watchlist";
```

- [ ] **Step 5: Run tests, build, commit**

```bash
cd packages/store
npx vitest run src/__tests__/watchlist.test.ts
cd ../..
npx turbo build --filter=@cardconomy/web
git add packages/store/src/watchlist.ts packages/store/src/__tests__/watchlist.test.ts packages/store/src/index.ts
git commit -m "feat: add watchlist store with add, remove, isWatched"
```

---

## Summary

After completing all 8 tasks, you have:

| What | Status |
|------|--------|
| Unified card/set types | Working |
| Currency conversion (USD → GBP) | Working + tested |
| Scryfall adapter (MTG) | Working + tested |
| Pokemon TCG adapter | Working + tested |
| YGOPRODeck adapter (Yu-Gi-Oh) | Working + tested |
| One Piece adapter | Working + tested |
| Lorcana adapter | Working + tested |
| Adapter factory + searchAllGames | Working |
| 8 API routes (search, cards, sets, trending, new-releases) | Working |
| TanStack Query hooks | Working |
| Watchlist store | Working + tested |

**What comes next (Phase 2B — Search UI):**
- Search bar component with dropdown
- Search results page with filters
- Uses the hooks and API routes built here
