# Production Frontend Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready Next.js monorepo with design system, Sanity CMS, Clerk auth, and base layout — the foundation every subsequent feature builds on.

**Architecture:** Turborepo monorepo with `apps/web` (Next.js 15 App Router), `apps/studio` (Sanity Studio), and shared packages (`ui`, `store`, `types`, `sanity`). shadcn/ui + Tailwind v4 for components. Zustand for client state, TanStack Query for server state. Clerk for auth. Design tokens ported from the existing prototype CSS variables.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn/ui, Turborepo, Sanity, Clerk, Zustand, TanStack Query, Vercel

## Global Constraints

- TypeScript strict mode everywhere
- All prices in GBP — use `Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })` for formatting
- No hardcoded colour values in components — always use design tokens / CSS variables
- Fonts: Space Grotesk (headings), Inter (body), Geist Mono (prices/codes), Reglo (wordmark only)
- Node.js 24 LTS
- shadcn/ui components are copied into `packages/ui`, not imported from a library
- Every task ends with a passing build (`turbo build`) and a commit
- The existing prototype stays live at cardconomyy.vercel.app — this is a separate project

## Spec Reference

`docs/superpowers/specs/2026-06-23-production-frontend-design.md`

---

## File Structure

```
cardconomy-prod/
  turbo.json
  package.json                          # Workspace root
  .npmrc
  apps/
    web/
      next.config.ts
      tailwind.config.ts
      src/
        app/
          layout.tsx                    # Root layout: fonts, providers, metadata
          page.tsx                      # Home page (placeholder)
          globals.css                   # CSS variables, Tailwind imports
          (auth)/
            sign-in/[[...sign-in]]/
              page.tsx                  # Clerk sign-in
            sign-up/[[...sign-up]]/
              page.tsx                  # Clerk sign-up
            onboarding/
              page.tsx                  # Game preference picker
        components/
          layout/
            top-bar.tsx                 # TopBar: title, back, actions
            bottom-nav.tsx             # Mobile bottom tab bar
            side-nav.tsx               # Desktop sidebar navigation
            shell.tsx                   # Responsive shell: side-nav + bottom-nav + main area
        lib/
          providers.tsx                 # ClerkProvider + QueryClientProvider + Zustand hydration
      public/
        brand/                          # logo.svg, logo-wordmark.svg, Reglo-Bold.otf
        logos/                          # Game logos (pkmn.png, mtg.svg, etc.)
    studio/
      sanity.config.ts                  # Sanity Studio config
      sanity.cli.ts                     # CLI config
      package.json
  packages/
    ui/
      package.json
      src/
        components/                     # shadcn/ui primitives (button, tabs, sheet, etc.)
        domain/
          card-art.tsx                  # Card image with skeleton + foil overlay
          grade-chip.tsx               # Condition pill (NM, LP, MP, HP, DMG)
          price-tag.tsx                # GBP price display with delta arrow
          icon.tsx                      # SVG icon component (26 icons)
        tokens/
          colors.ts                     # Colour token definitions
          typography.ts                 # Font/size/weight tokens
          index.ts                      # Re-export all tokens
        lib/
          utils.ts                      # cn() utility (clsx + twMerge)
        index.ts                        # Package barrel export
    store/
      package.json
      src/
        cart.ts                         # Cart store (Zustand)
        auth.ts                         # Auth/capability store
        preferences.ts                  # Game preference store
        query-client.ts                 # TanStack Query client factory
        index.ts
    types/
      package.json
      src/
        game.ts                         # Game, Set, CardPrinting types
        listing.ts                      # Listing, Offer, Order types
        user.ts                         # User, SellerProfile, ShopProfile, VerificationBadge types
        navigation.ts                   # Tab, Route types
        index.ts
    sanity/
      package.json
      src/
        schemas/
          game.ts                       # Game document schema
          set.ts                        # Set document schema
          card.ts                       # Card document schema
          card-printing.ts              # CardPrinting document schema
          index.ts                      # Schema array export
        client.ts                       # Sanity client factory
        queries/
          games.ts                      # GROQ queries for games
          sets.ts                       # GROQ queries for sets
          cards.ts                      # GROQ queries for cards
        index.ts
  tooling/
    eslint-config/
      base.js                           # Shared ESLint config
      package.json
    ts-config/
      base.json                         # Shared tsconfig base
      nextjs.json                       # Next.js-specific extends
      library.json                      # Package library extends
      package.json
```

---

### Task 1: Monorepo Scaffold

**Files:**
- Create: `cardconomy-prod/package.json`
- Create: `cardconomy-prod/turbo.json`
- Create: `cardconomy-prod/.npmrc`
- Create: `cardconomy-prod/.gitignore`
- Create: `cardconomy-prod/tooling/ts-config/base.json`
- Create: `cardconomy-prod/tooling/ts-config/nextjs.json`
- Create: `cardconomy-prod/tooling/ts-config/library.json`
- Create: `cardconomy-prod/tooling/ts-config/package.json`
- Create: `cardconomy-prod/tooling/eslint-config/base.js`
- Create: `cardconomy-prod/tooling/eslint-config/package.json`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: workspace root that all packages and apps depend on. `turbo build`, `turbo dev`, `turbo lint` pipelines.

- [ ] **Step 1: Create the workspace root**

Create a new directory `cardconomy-prod` at the same level as the prototype. Initialise git and create the root `package.json`:

```json
{
  "name": "cardconomy",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "tooling/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2"
  },
  "packageManager": "npm@10.9.2"
}
```

Create `.npmrc`:

```
auto-install-peers=true
```

Create `.gitignore`:

```
node_modules
.next
.turbo
dist
out
.env
.env.local
.env*.local
```

- [ ] **Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 3: Create shared TypeScript configs**

`tooling/ts-config/package.json`:

```json
{
  "name": "@cardconomy/ts-config",
  "private": true,
  "version": "0.0.0"
}
```

`tooling/ts-config/base.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules", "dist"]
}
```

`tooling/ts-config/nextjs.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "module": "esnext",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`tooling/ts-config/library.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create shared ESLint config**

`tooling/eslint-config/package.json`:

```json
{
  "name": "@cardconomy/eslint-config",
  "private": true,
  "version": "0.0.0",
  "devDependencies": {
    "eslint": "^9",
    "@eslint/js": "^9",
    "typescript-eslint": "^8"
  }
}
```

`tooling/eslint-config/base.js`:

```javascript
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
```

- [ ] **Step 5: Install dependencies and verify**

```bash
cd cardconomy-prod
npm install
npx turbo --version
```

Expected: turbo version prints, no errors.

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold monorepo with Turborepo, shared TS and ESLint configs"
```

---

### Task 2: Types Package

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/game.ts`
- Create: `packages/types/src/listing.ts`
- Create: `packages/types/src/user.ts`
- Create: `packages/types/src/navigation.ts`
- Create: `packages/types/src/index.ts`

**Interfaces:**
- Consumes: `@cardconomy/ts-config` (base config)
- Produces: All shared types used across the monorepo. Key exports: `Game`, `GameId`, `Set`, `Card`, `CardPrinting`, `Finish`, `Condition`, `GradeCompany`, `Grade`, `Listing`, `Offer`, `OfferStatus`, `Order`, `OrderStatus`, `CartItem`, `User`, `SellerProfile`, `ShopProfile`, `VerificationBadge`, `Capability`, `Tab`, `TabId`

- [ ] **Step 1: Create package.json and tsconfig**

`packages/types/package.json`:

```json
{
  "name": "@cardconomy/types",
  "private": true,
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "typescript": "^5"
  }
}
```

`packages/types/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Create game types**

`packages/types/src/game.ts`:

```typescript
export type GameId = "pkmn" | "mtg" | "ygo" | "onepiece" | "lorcana" | "digimon";

export interface Game {
  id: GameId;
  name: string;
  short: string;
  tint: string;
}

export interface Set {
  id: string;
  game: GameId;
  name: string;
  year: number;
  cardCount: number;
  hue: string;
  imageUrl?: string;
}

export interface Card {
  id: string;
  name: string;
  number: string;
  set: string;
  rarity: string;
  types: string[];
  game: GameId;
}

export type Finish = "standard" | "foil" | "reverse-foil";

export interface CardPrinting {
  id: string;
  cardId: string;
  setId: string;
  finish: Finish;
  imageUrl?: string;
}
```

- [ ] **Step 3: Create listing types**

`packages/types/src/listing.ts`:

```typescript
import type { Finish, GameId } from "./game";

export type Condition = "NM" | "LP" | "MP" | "HP" | "DMG";

export type GradeCompany = "raw" | "psa" | "bgs" | "cgc";

export interface Grade {
  company: GradeCompany;
  grade?: number;
}

export type ListingType = "buynow" | "offer";

export interface Listing {
  id: string;
  cardName: string;
  subtitle: string;
  game: GameId;
  setId: string;
  cardNumber: string;
  finish: Finish;
  grade: Grade;
  condition: Condition;
  listingType: ListingType;
  price: number;
  marketPrice: number;
  acceptsOffers: boolean;
  priceHistory: number[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  shippingCost: number;
  shippingSpeed: string;
  location: string;
  watchers: number;
  imageUrl?: string;
}

export type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";

export interface Offer {
  id: string;
  listingId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: OfferStatus;
  expiresAt: string;
  counterAmount?: number;
  createdAt: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  shippingCost: number;
  protectionFee: number;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
}

export interface CartItem {
  listingId: string;
  addedAt: string;
}
```

- [ ] **Step 4: Create user types**

`packages/types/src/user.ts`:

```typescript
import type { GameId } from "./game";

export type VerificationBadge = "none" | "verified-seller" | "trusted-seller" | "verified-shop";

export type Capability = "browse" | "sell" | "shop";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  capabilities: Capability[];
  verificationBadge: VerificationBadge;
  gamePreferences: GameId[];
  createdAt: string;
}

export interface SellerProfile {
  userId: string;
  displayName: string;
  rating: number;
  totalSales: number;
  activeListings: number;
  location: string;
  memberSince: string;
  verifiedAt: string;
}

export interface ShopProfile {
  userId: string;
  shopName: string;
  slug: string;
  companyNumber: string;
  address: string;
  location: string;
  hours: string;
  bannerUrl?: string;
  description: string;
  gamesStocked: GameId[];
  verifiedAt: string;
}
```

- [ ] **Step 5: Create navigation types**

`packages/types/src/navigation.ts`:

```typescript
export type TabId = "home" | "search" | "sell" | "trade" | "profile";

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: Tab[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
  { id: "sell", label: "Sell", icon: "sell" },
  { id: "trade", label: "Trade", icon: "trade" },
  { id: "profile", label: "Profile", icon: "user" },
];
```

- [ ] **Step 6: Create barrel export**

`packages/types/src/index.ts`:

```typescript
export * from "./game";
export * from "./listing";
export * from "./user";
export * from "./navigation";
```

- [ ] **Step 7: Build and verify**

```bash
cd packages/types
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add packages/types
git commit -m "feat: add shared types package (game, listing, user, navigation)"
```

---

### Task 3: UI Package — Tokens and Utilities

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/tokens/colors.ts`
- Create: `packages/ui/src/tokens/typography.ts`
- Create: `packages/ui/src/tokens/index.ts`
- Create: `packages/ui/src/lib/utils.ts`
- Create: `packages/ui/src/lib/format.ts`
- Create: `packages/ui/src/index.ts`
- Test: `packages/ui/src/lib/__tests__/format.test.ts`

**Interfaces:**
- Consumes: `@cardconomy/ts-config`
- Produces: `cn()` utility for className merging. `formatGBP(n: number): string` for price formatting. `colors` and `typography` token objects for reference in components. CSS variable names exported as constants.

- [ ] **Step 1: Create package.json and tsconfig**

`packages/ui/package.json`:

```json
{
  "name": "@cardconomy/ui",
  "private": true,
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/",
    "test": "vitest run"
  },
  "dependencies": {
    "clsx": "^2",
    "tailwind-merge": "^3"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "typescript": "^5",
    "vitest": "^3"
  }
}
```

`packages/ui/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Write the failing test for formatGBP**

`packages/ui/src/lib/__tests__/format.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { formatGBP } from "../format";

describe("formatGBP", () => {
  it("formats a whole number", () => {
    expect(formatGBP(10)).toBe("\u00a310.00");
  });

  it("formats a decimal", () => {
    expect(formatGBP(432.5)).toBe("\u00a3432.50");
  });

  it("formats zero", () => {
    expect(formatGBP(0)).toBe("\u00a30.00");
  });

  it("formats a large number with comma grouping", () => {
    expect(formatGBP(1250)).toBe("\u00a31,250.00");
  });

  it("returns compact format when requested", () => {
    const result = formatGBP(1250, { compact: true });
    expect(result).toBe("\u00a31.25K");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd packages/ui
npx vitest run src/lib/__tests__/format.test.ts
```

Expected: FAIL — `formatGBP` not found.

- [ ] **Step 4: Implement formatGBP**

`packages/ui/src/lib/format.ts`:

```typescript
const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const gbpCompactFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface FormatGBPOptions {
  compact?: boolean;
}

export function formatGBP(amount: number, options?: FormatGBPOptions): string {
  if (options?.compact) {
    return gbpCompactFormatter.format(amount);
  }
  return gbpFormatter.format(amount);
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd packages/ui
npx vitest run src/lib/__tests__/format.test.ts
```

Expected: all 5 tests PASS.

- [ ] **Step 6: Create cn() utility**

`packages/ui/src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: Create design tokens**

`packages/ui/src/tokens/colors.ts`:

```typescript
/**
 * Design token colour values.
 * Components should use the CSS variable names (e.g. `var(--brand-primary)`)
 * via Tailwind classes. These raw values are for reference and Tailwind config.
 */
export const colors = {
  brand: {
    primary: "#059669",
    primaryPress: "#047857",
    primaryWash: "#ecfdf5",
    accent: "#d97706",
  },
  surface: {
    dark: "#0f172a",
    default: "#ffffff",
    subtle: "#f8fafc",
  },
  border: {
    default: "#e2e8f0",
    subtle: "#eef0f3",
  },
  text: {
    primary: "#0f172a",
    secondary: "#3a3d44",
    muted: "#64748b",
    faint: "#a4a8b0",
    inverse: "#ffffff",
  },
  status: {
    positive: "#16a34a",
    negative: "#dc2626",
    warning: "#d97706",
  },
  grade: {
    raw: { bg: "#eef0f3", fg: "#3a3d44" },
    psa: { bg: "#b91c1c", fg: "#ffffff" },
    bgs: { bg: "#1e293b", fg: "#e2e8f0" },
    cgc: { bg: "#1d4ed8", fg: "#ffffff" },
  },
} as const;

/** CSS variable names for use in Tailwind config */
export const cssVars = {
  "--brand-primary": colors.brand.primary,
  "--brand-primary-press": colors.brand.primaryPress,
  "--brand-primary-wash": colors.brand.primaryWash,
  "--brand-accent": colors.brand.accent,
  "--surface-dark": colors.surface.dark,
  "--surface-default": colors.surface.default,
  "--surface-subtle": colors.surface.subtle,
  "--border-default": colors.border.default,
  "--border-subtle": colors.border.subtle,
  "--text-primary": colors.text.primary,
  "--text-secondary": colors.text.secondary,
  "--text-muted": colors.text.muted,
  "--text-faint": colors.text.faint,
  "--text-inverse": colors.text.inverse,
  "--status-positive": colors.status.positive,
  "--status-negative": colors.status.negative,
  "--status-warning": colors.status.warning,
} as const;
```

`packages/ui/src/tokens/typography.ts`:

```typescript
export const fontFamily = {
  heading: "'Space Grotesk', -apple-system, system-ui, sans-serif",
  body: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'Geist Mono', 'SF Mono', monospace",
  wordmark: "'Reglo', 'Space Grotesk', sans-serif",
} as const;

export const fontSize = {
  "heading-xl": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
  "heading-lg": ["1.375rem", { lineHeight: "1.75rem", fontWeight: "600" }],
  "heading-md": ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }],
  "body-lg": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
  "body-md": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
  "body-sm": ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
  mono: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
} as const;
```

`packages/ui/src/tokens/index.ts`:

```typescript
export { colors, cssVars } from "./colors";
export { fontFamily, fontSize } from "./typography";
```

- [ ] **Step 8: Create barrel export**

`packages/ui/src/index.ts`:

```typescript
export { cn } from "./lib/utils";
export { formatGBP } from "./lib/format";
export { colors, cssVars, fontFamily, fontSize } from "./tokens";
```

- [ ] **Step 9: Build and verify**

```bash
cd packages/ui
npx tsc --noEmit
npx vitest run
```

Expected: type check passes, all tests pass.

- [ ] **Step 10: Commit**

```bash
git add packages/ui
git commit -m "feat: add UI package with design tokens, formatGBP, and cn() utility"
```

---

### Task 4: UI Package — Icon Component and Domain Components

**Files:**
- Create: `packages/ui/src/domain/icon.tsx`
- Create: `packages/ui/src/domain/grade-chip.tsx`
- Create: `packages/ui/src/domain/price-tag.tsx`
- Create: `packages/ui/src/domain/card-art.tsx`
- Create: `packages/ui/src/domain/index.ts`
- Test: `packages/ui/src/domain/__tests__/grade-chip.test.tsx`
- Test: `packages/ui/src/domain/__tests__/price-tag.test.tsx`
- Modify: `packages/ui/src/index.ts` (add domain exports)

**Interfaces:**
- Consumes: `cn()` from `@cardconomy/ui`, `Condition`, `GradeCompany`, `Grade` from `@cardconomy/types`
- Produces: `<Icon name={IconName} />`, `<GradeChip grade={Grade} />`, `<PriceTag price={number} delta={number} />`, `<CardArt src={string} foil={boolean} size="sm"|"md"|"lg"|"xl" />`

- [ ] **Step 1: Install test dependencies**

```bash
cd packages/ui
npm install -D @testing-library/react @testing-library/jest-dom jsdom react react-dom @types/react @types/react-dom
```

Add to `packages/ui/package.json` a vitest config (or create `vitest.config.ts`):

`packages/ui/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
  },
});
```

- [ ] **Step 2: Create Icon component**

`packages/ui/src/domain/icon.tsx`:

```tsx
import React from "react";
import { cn } from "../lib/utils";

const PATHS: Record<string, string> = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  sell: "M12 4v16m8-8H4",
  trade: "M8 7h12m-12 6h12M8 19h12M4 7h.01M4 13h.01M4 19h.01",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.5.5-.1 1.3.6 1.3H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  back: "M19 12H5m7-7l-7 7 7 7",
  filter: "M3 4h18M7 8h10M10 12h4",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13",
  check: "M5 13l4 4L19 7",
  plus: "M12 4v16m8-8H4",
  trash: "M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-2-1.86L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-5 4h12",
  chevron: "M9 5l7 7-7 7",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zm-11-3a4 4 0 100-8 4 4 0 000 8z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  tag: "M7 7h.01M7 3h5a2 2 0 011.4.6l7 7a2 2 0 010 2.8l-5 5a2 2 0 01-2.8 0l-7-7A2 2 0 015 10V5a2 2 0 012-2z",
  truck: "M1 3h15v13H1zm15 8h4l3 3v5h-7zm3 8a2 2 0 100-4 2 2 0 000 4zM5 19a2 2 0 100-4 2 2 0 000 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 01-3.46 0",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6z",
  grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  menu: "M4 6h16M4 12h16M4 18h16",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <path d={path} />
    </svg>
  );
}
```

- [ ] **Step 3: Write failing test for GradeChip**

`packages/ui/src/domain/__tests__/grade-chip.test.tsx`:

```tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GradeChip } from "../grade-chip";

describe("GradeChip", () => {
  it("renders a raw condition", () => {
    render(<GradeChip grade={{ company: "raw" }} condition="NM" />);
    expect(screen.getByText("NM")).toBeDefined();
  });

  it("renders a graded card with company and grade", () => {
    render(<GradeChip grade={{ company: "psa", grade: 10 }} condition="NM" />);
    expect(screen.getByText("PSA 10")).toBeDefined();
  });

  it("renders BGS grade with decimal", () => {
    render(<GradeChip grade={{ company: "bgs", grade: 9.5 }} condition="NM" />);
    expect(screen.getByText("BGS 9.5")).toBeDefined();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

```bash
cd packages/ui
npx vitest run src/domain/__tests__/grade-chip.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 5: Implement GradeChip**

`packages/ui/src/domain/grade-chip.tsx`:

```tsx
import React from "react";
import { cn } from "../lib/utils";
import type { Grade, Condition } from "@cardconomy/types";

const GRADE_STYLES: Record<string, { bg: string; text: string }> = {
  raw: { bg: "bg-gray-100", text: "text-gray-700" },
  psa: { bg: "bg-red-700", text: "text-white" },
  bgs: { bg: "bg-slate-800", text: "text-slate-200" },
  cgc: { bg: "bg-blue-700", text: "text-white" },
};

interface GradeChipProps {
  grade: Grade;
  condition: Condition;
  className?: string;
}

export function GradeChip({ grade, condition, className }: GradeChipProps) {
  const style = GRADE_STYLES[grade.company] ?? GRADE_STYLES.raw;
  const label =
    grade.company === "raw"
      ? condition
      : `${grade.company.toUpperCase()} ${grade.grade}`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
cd packages/ui
npx vitest run src/domain/__tests__/grade-chip.test.tsx
```

Expected: all 3 tests PASS.

- [ ] **Step 7: Write failing test for PriceTag**

`packages/ui/src/domain/__tests__/price-tag.test.tsx`:

```tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceTag } from "../price-tag";

describe("PriceTag", () => {
  it("renders a price in GBP", () => {
    render(<PriceTag price={432} />);
    expect(screen.getByText("\u00a3432.00")).toBeDefined();
  });

  it("renders a positive delta", () => {
    render(<PriceTag price={100} delta={5.2} />);
    expect(screen.getByText("+5.20%")).toBeDefined();
  });

  it("renders a negative delta", () => {
    render(<PriceTag price={100} delta={-3.1} />);
    expect(screen.getByText("-3.10%")).toBeDefined();
  });

  it("renders no delta when not provided", () => {
    const { container } = render(<PriceTag price={50} />);
    expect(container.querySelectorAll("[data-testid='delta']")).toHaveLength(0);
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

```bash
cd packages/ui
npx vitest run src/domain/__tests__/price-tag.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 9: Implement PriceTag**

`packages/ui/src/domain/price-tag.tsx`:

```tsx
import React from "react";
import { cn } from "../lib/utils";
import { formatGBP } from "../lib/format";

interface PriceTagProps {
  price: number;
  delta?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function PriceTag({ price, delta, size = "md", className }: PriceTagProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono", className)}>
      <span className={cn("font-semibold", sizeClasses[size])}>
        {formatGBP(price)}
      </span>
      {delta !== undefined && (
        <span
          data-testid="delta"
          className={cn(
            "text-xs font-medium",
            delta >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 10: Run test to verify it passes**

```bash
cd packages/ui
npx vitest run src/domain/__tests__/price-tag.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 11: Create CardArt component**

`packages/ui/src/domain/card-art.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import { cn } from "../lib/utils";

const SIZE_MAP = {
  sm: { width: 80, height: 112 },
  md: { width: 120, height: 168 },
  lg: { width: 180, height: 252 },
  xl: { width: 240, height: 336 },
} as const;

interface CardArtProps {
  src?: string;
  alt: string;
  size?: keyof typeof SIZE_MAP;
  foil?: boolean;
  className?: string;
}

export function CardArt({ src, alt, size = "md", foil = false, className }: CardArtProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const dims = SIZE_MAP[size];

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ width: dims.width, height: dims.height }}
    >
      {/* Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-200" />
      )}

      {/* Error placeholder */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
          <span className="text-xs text-gray-400">No image</span>
        </div>
      )}

      {/* Image */}
      {src && !error && (
        <img
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          className={cn(
            "rounded-lg object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* Foil overlay */}
      {foil && loaded && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 12: Create barrel exports**

`packages/ui/src/domain/index.ts`:

```typescript
export { Icon, type IconName } from "./icon";
export { GradeChip } from "./grade-chip";
export { PriceTag } from "./price-tag";
export { CardArt } from "./card-art";
```

Update `packages/ui/src/index.ts`:

```typescript
export { cn } from "./lib/utils";
export { formatGBP } from "./lib/format";
export { colors, cssVars, fontFamily, fontSize } from "./tokens";
export { Icon, type IconName } from "./domain/icon";
export { GradeChip } from "./domain/grade-chip";
export { PriceTag } from "./domain/price-tag";
export { CardArt } from "./domain/card-art";
```

- [ ] **Step 13: Run all tests**

```bash
cd packages/ui
npx vitest run
```

Expected: all tests pass (format + grade-chip + price-tag).

- [ ] **Step 14: Commit**

```bash
git add packages/ui
git commit -m "feat: add Icon, GradeChip, PriceTag, and CardArt domain components"
```

---

### Task 5: Store Package

**Files:**
- Create: `packages/store/package.json`
- Create: `packages/store/tsconfig.json`
- Create: `packages/store/src/cart.ts`
- Create: `packages/store/src/auth.ts`
- Create: `packages/store/src/preferences.ts`
- Create: `packages/store/src/query-client.ts`
- Create: `packages/store/src/index.ts`
- Test: `packages/store/src/__tests__/cart.test.ts`

**Interfaces:**
- Consumes: `@cardconomy/types` (CartItem, Capability, GameId)
- Produces: `useCartStore` (addItem, removeItem, clearCart, items, itemCount), `useAuthStore` (capabilities, hasCapability, addCapability, verificationBadge), `usePreferencesStore` (gamePreferences, toggleGame, hasGame), `createQueryClient()`

- [ ] **Step 1: Create package.json and tsconfig**

`packages/store/package.json`:

```json
{
  "name": "@cardconomy/store",
  "private": true,
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "dependencies": {
    "zustand": "^5",
    "@tanstack/react-query": "^5"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "@cardconomy/types": "*",
    "typescript": "^5",
    "vitest": "^3"
  }
}
```

`packages/store/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Write failing test for cart store**

`packages/store/src/__tests__/cart.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cart";

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("starts empty", () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().itemCount()).toBe(0);
  });

  it("adds an item", () => {
    useCartStore.getState().addItem("listing-1");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].listingId).toBe("listing-1");
  });

  it("does not add duplicate items", () => {
    useCartStore.getState().addItem("listing-1");
    useCartStore.getState().addItem("listing-1");
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("removes an item", () => {
    useCartStore.getState().addItem("listing-1");
    useCartStore.getState().addItem("listing-2");
    useCartStore.getState().removeItem("listing-1");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].listingId).toBe("listing-2");
  });

  it("clears all items", () => {
    useCartStore.getState().addItem("listing-1");
    useCartStore.getState().addItem("listing-2");
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("checks if an item is in cart", () => {
    useCartStore.getState().addItem("listing-1");
    expect(useCartStore.getState().inCart("listing-1")).toBe(true);
    expect(useCartStore.getState().inCart("listing-2")).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd packages/store
npx vitest run src/__tests__/cart.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement cart store**

`packages/store/src/cart.ts`:

```typescript
import { create } from "zustand";
import type { CartItem } from "@cardconomy/types";

interface CartStore {
  items: CartItem[];
  addItem: (listingId: string) => void;
  removeItem: (listingId: string) => void;
  clearCart: () => void;
  inCart: (listingId: string) => boolean;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (listingId) => {
    const { items } = get();
    if (items.some((item) => item.listingId === listingId)) return;
    set({
      items: [...items, { listingId, addedAt: new Date().toISOString() }],
    });
  },

  removeItem: (listingId) => {
    set({
      items: get().items.filter((item) => item.listingId !== listingId),
    });
  },

  clearCart: () => set({ items: [] }),

  inCart: (listingId) => get().items.some((item) => item.listingId === listingId),

  itemCount: () => get().items.length,
}));
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd packages/store
npx vitest run src/__tests__/cart.test.ts
```

Expected: all 6 tests PASS.

- [ ] **Step 6: Create auth store**

`packages/store/src/auth.ts`:

```typescript
import { create } from "zustand";
import type { Capability, VerificationBadge } from "@cardconomy/types";

interface AuthStore {
  capabilities: Capability[];
  verificationBadge: VerificationBadge;
  hasCapability: (cap: Capability) => boolean;
  addCapability: (cap: Capability) => void;
  setVerificationBadge: (badge: VerificationBadge) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  capabilities: ["browse"],
  verificationBadge: "none",

  hasCapability: (cap) => get().capabilities.includes(cap),

  addCapability: (cap) => {
    const { capabilities } = get();
    if (capabilities.includes(cap)) return;
    set({ capabilities: [...capabilities, cap] });
  },

  setVerificationBadge: (badge) => set({ verificationBadge: badge }),
}));
```

- [ ] **Step 7: Create preferences store**

`packages/store/src/preferences.ts`:

```typescript
import { create } from "zustand";
import type { GameId } from "@cardconomy/types";

interface PreferencesStore {
  gamePreferences: GameId[];
  toggleGame: (gameId: GameId) => void;
  hasGame: (gameId: GameId) => boolean;
  setGames: (games: GameId[]) => void;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  gamePreferences: [],

  toggleGame: (gameId) => {
    const { gamePreferences } = get();
    if (gamePreferences.includes(gameId)) {
      set({ gamePreferences: gamePreferences.filter((g) => g !== gameId) });
    } else {
      set({ gamePreferences: [...gamePreferences, gameId] });
    }
  },

  hasGame: (gameId) => get().gamePreferences.includes(gameId),

  setGames: (games) => set({ gamePreferences: games }),
}));
```

- [ ] **Step 8: Create TanStack Query client factory**

`packages/store/src/query-client.ts`:

```typescript
import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
```

- [ ] **Step 9: Create barrel export**

`packages/store/src/index.ts`:

```typescript
export { useCartStore } from "./cart";
export { useAuthStore } from "./auth";
export { usePreferencesStore } from "./preferences";
export { createQueryClient } from "./query-client";
```

- [ ] **Step 10: Run all tests and type check**

```bash
cd packages/store
npx tsc --noEmit
npx vitest run
```

Expected: type check passes, all tests pass.

- [ ] **Step 11: Commit**

```bash
git add packages/store
git commit -m "feat: add store package with cart, auth, preferences stores and query client"
```

---

### Task 6: Sanity Package — Schemas and Client

**Files:**
- Create: `packages/sanity/package.json`
- Create: `packages/sanity/tsconfig.json`
- Create: `packages/sanity/src/schemas/game.ts`
- Create: `packages/sanity/src/schemas/set.ts`
- Create: `packages/sanity/src/schemas/card.ts`
- Create: `packages/sanity/src/schemas/card-printing.ts`
- Create: `packages/sanity/src/schemas/index.ts`
- Create: `packages/sanity/src/client.ts`
- Create: `packages/sanity/src/queries/games.ts`
- Create: `packages/sanity/src/queries/sets.ts`
- Create: `packages/sanity/src/queries/cards.ts`
- Create: `packages/sanity/src/index.ts`

**Interfaces:**
- Consumes: `sanity` package
- Produces: `schemas` array for Sanity Studio config. `createSanityClient(config)` factory. GROQ query strings: `GAMES_QUERY`, `SETS_BY_GAME_QUERY`, `CARD_BY_SLUG_QUERY`, `CARDS_BY_SET_QUERY`, `CARD_PRINTINGS_QUERY`.

- [ ] **Step 1: Create package.json and tsconfig**

`packages/sanity/package.json`:

```json
{
  "name": "@cardconomy/sanity",
  "private": true,
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "sanity": "^3",
    "@sanity/client": "^6"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "typescript": "^5"
  }
}
```

`packages/sanity/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Create game schema**

`packages/sanity/src/schemas/game.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const game = defineType({
  name: "game",
  title: "Game",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short Name",
      type: "string",
      description: "Abbreviated name (e.g. 'MTG' for Magic: The Gathering)",
    }),
    defineField({
      name: "tint",
      title: "Brand Colour",
      type: "string",
      description: "Hex colour for UI tinting (e.g. #d4a017)",
      validation: (Rule) => Rule.regex(/^#[0-9a-fA-F]{6}$/, { name: "hex colour" }),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Character art used in game carousel",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
```

- [ ] **Step 3: Create set schema**

`packages/sanity/src/schemas/set.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const set = defineType({
  name: "set",
  title: "Set",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Set Code",
      type: "string",
      description: "Official set code (e.g. SV06, MH3)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "game",
      title: "Game",
      type: "reference",
      to: [{ type: "game" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
    }),
    defineField({
      name: "cardCount",
      title: "Card Count",
      type: "number",
    }),
    defineField({
      name: "image",
      title: "Set Image",
      type: "image",
    }),
    defineField({
      name: "hue",
      title: "Theme Colour",
      type: "string",
      description: "Hex colour for set branding",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "code", media: "image" },
  },
});
```

- [ ] **Step 4: Create card and card-printing schemas**

`packages/sanity/src/schemas/card.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const card = defineType({
  name: "card",
  title: "Card",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number",
      title: "Card Number",
      type: "string",
      description: "Card number within set (e.g. 199/165)",
    }),
    defineField({
      name: "set",
      title: "Set",
      type: "reference",
      to: [{ type: "set" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "game",
      title: "Game",
      type: "reference",
      to: [{ type: "game" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rarity",
      title: "Rarity",
      type: "string",
      options: {
        list: [
          { title: "Common", value: "common" },
          { title: "Uncommon", value: "uncommon" },
          { title: "Rare", value: "rare" },
          { title: "Ultra Rare", value: "ultra-rare" },
          { title: "Secret Rare", value: "secret-rare" },
          { title: "Mythic", value: "mythic" },
        ],
      },
    }),
    defineField({
      name: "types",
      title: "Types",
      type: "array",
      of: [{ type: "string" }],
      description: "Card types or subtypes",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "number" },
  },
});
```

`packages/sanity/src/schemas/card-printing.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const cardPrinting = defineType({
  name: "cardPrinting",
  title: "Card Printing",
  type: "document",
  fields: [
    defineField({
      name: "card",
      title: "Card",
      type: "reference",
      to: [{ type: "card" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "set",
      title: "Set",
      type: "reference",
      to: [{ type: "set" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Foil", value: "foil" },
          { title: "Reverse Foil", value: "reverse-foil" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      cardName: "card.name",
      setName: "set.name",
      finish: "finish",
      media: "image",
    },
    prepare({ cardName, setName, finish, media }) {
      return {
        title: cardName ?? "Untitled",
        subtitle: `${setName ?? ""} (${finish ?? ""})`,
        media,
      };
    },
  },
});
```

- [ ] **Step 5: Create schema index**

`packages/sanity/src/schemas/index.ts`:

```typescript
import { game } from "./game";
import { set } from "./set";
import { card } from "./card";
import { cardPrinting } from "./card-printing";

export const schemas = [game, set, card, cardPrinting];
```

- [ ] **Step 6: Create Sanity client factory**

`packages/sanity/src/client.ts`:

```typescript
import { createClient, type SanityClient } from "@sanity/client";

interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion?: string;
  useCdn?: boolean;
  token?: string;
}

export function createSanityClient(config: SanityConfig): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion ?? "2026-06-23",
    useCdn: config.useCdn ?? true,
    token: config.token,
  });
}
```

- [ ] **Step 7: Create GROQ queries**

`packages/sanity/src/queries/games.ts`:

```typescript
export const GAMES_QUERY = `*[_type == "game"] | order(sortOrder asc) {
  _id,
  name,
  "slug": slug.current,
  shortName,
  tint,
  "logoUrl": logo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  description
}`;
```

`packages/sanity/src/queries/sets.ts`:

```typescript
export const SETS_QUERY = `*[_type == "set"] | order(releaseDate desc) {
  _id,
  name,
  code,
  "game": game->slug.current,
  releaseDate,
  cardCount,
  "imageUrl": image.asset->url,
  hue
}`;

export const SETS_BY_GAME_QUERY = `*[_type == "set" && game->slug.current == $gameSlug] | order(releaseDate desc) {
  _id,
  name,
  code,
  releaseDate,
  cardCount,
  "imageUrl": image.asset->url,
  hue
}`;
```

`packages/sanity/src/queries/cards.ts`:

```typescript
export const CARD_BY_SLUG_QUERY = `*[_type == "card" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  number,
  rarity,
  types,
  "set": set->{_id, name, code},
  "game": game->{_id, name, "slug": slug.current, tint}
}`;

export const CARDS_BY_SET_QUERY = `*[_type == "card" && set._ref == $setId] | order(number asc) {
  _id,
  name,
  "slug": slug.current,
  number,
  rarity,
  types
}`;

export const CARD_PRINTINGS_QUERY = `*[_type == "cardPrinting" && card._ref == $cardId] {
  _id,
  finish,
  "imageUrl": image.asset->url,
  "set": set->{_id, name, code}
}`;
```

- [ ] **Step 8: Create barrel export**

`packages/sanity/src/index.ts`:

```typescript
export { schemas } from "./schemas";
export { createSanityClient } from "./client";
export { GAMES_QUERY } from "./queries/games";
export { SETS_QUERY, SETS_BY_GAME_QUERY } from "./queries/sets";
export {
  CARD_BY_SLUG_QUERY,
  CARDS_BY_SET_QUERY,
  CARD_PRINTINGS_QUERY,
} from "./queries/cards";
```

- [ ] **Step 9: Type check**

```bash
cd packages/sanity
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add packages/sanity
git commit -m "feat: add Sanity package with game/set/card schemas, client, and GROQ queries"
```

---

### Task 7: Next.js App — Scaffold with Tailwind, Clerk, and Providers

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/lib/providers.tsx`
- Create: `apps/web/src/middleware.ts`

**Interfaces:**
- Consumes: `@cardconomy/ui` (tokens, cn), `@cardconomy/store` (createQueryClient), Clerk
- Produces: Running Next.js app at `localhost:3000` with Clerk auth, TanStack Query, correct fonts, CSS variables, and design tokens applied globally.

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@cardconomy/web",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@clerk/nextjs": "^6",
    "@tanstack/react-query": "^5",
    "@cardconomy/ui": "*",
    "@cardconomy/store": "*",
    "@cardconomy/types": "*",
    "@cardconomy/sanity": "*"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

`apps/web/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

`apps/web/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@cardconomy/ui",
    "@cardconomy/store",
    "@cardconomy/types",
    "@cardconomy/sanity",
  ],
};

export default nextConfig;
```

- [ ] **Step 4: Create tailwind.config.ts**

`apps/web/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          "primary-press": "var(--brand-primary-press)",
          "primary-wash": "var(--brand-primary-wash)",
          accent: "var(--brand-accent)",
        },
        surface: {
          dark: "var(--surface-dark)",
          DEFAULT: "var(--surface-default)",
          subtle: "var(--surface-subtle)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        wordmark: ["'Reglo'", "var(--font-heading)"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        1: "0 1px 2px rgba(20,24,40,0.06), 0 1px 3px rgba(20,24,40,0.05)",
        2: "0 2px 8px rgba(20,24,40,0.07), 0 4px 14px rgba(20,24,40,0.06)",
        3: "0 8px 26px rgba(20,24,40,0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create globals.css**

`apps/web/src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #059669;
  --color-brand-primary-press: #047857;
  --color-brand-primary-wash: #ecfdf5;
  --color-brand-accent: #d97706;
  --color-surface-dark: #0f172a;
  --color-surface-default: #ffffff;
  --color-surface-subtle: #f8fafc;
  --color-border-default: #e2e8f0;
  --color-border-subtle: #eef0f3;
  --color-text-primary: #0f172a;
  --color-text-secondary: #3a3d44;
  --color-text-muted: #64748b;
  --color-text-faint: #a4a8b0;
  --color-text-inverse: #ffffff;
  --color-status-positive: #16a34a;
  --color-status-negative: #dc2626;
  --color-status-warning: #d97706;
}

@font-face {
  font-family: "Reglo";
  src: url("/brand/Reglo-Bold.otf") format("opentype");
  font-weight: 700;
  font-display: swap;
}

body {
  font-family: var(--font-body), -apple-system, system-ui, sans-serif;
  color: var(--color-text-primary);
  background-color: var(--color-surface-subtle);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 6: Create providers**

`apps/web/src/lib/providers.tsx`:

```tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "@cardconomy/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

- [ ] **Step 7: Create root layout**

`apps/web/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/lib/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardconomy — UK Trading Card Marketplace",
  description:
    "Buy, sell, and trade trading cards with collectors, sellers, and local game stores across the UK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder home page**

`apps/web/src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-heading text-heading-xl text-text-primary">
        Cardconomy
      </h1>
      <p className="font-body text-body-lg text-text-secondary">
        UK Trading Card Marketplace — Production Build
      </p>
      <div className="flex gap-3">
        <span className="rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white">
          Emerald
        </span>
        <span className="rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white">
          Amber
        </span>
        <span className="rounded-md bg-surface-dark px-3 py-1.5 text-sm font-medium text-white">
          Navy
        </span>
      </div>
    </main>
  );
}
```

- [ ] **Step 9: Create Clerk middleware**

`apps/web/src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/search(.*)",
  "/card/(.*)",
  "/listing/(.*)",
  "/shop/(.*)",
  "/how-it-works",
  "/fees",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- [ ] **Step 10: Copy brand assets**

```bash
mkdir -p apps/web/public/brand apps/web/public/logos
cp ../Cardconomy02/brand/logo.svg apps/web/public/brand/
cp ../Cardconomy02/brand/logo-wordmark.svg apps/web/public/brand/
cp ../Cardconomy02/brand/Reglo-Bold.otf apps/web/public/brand/
cp ../Cardconomy02/logos/*.png ../Cardconomy02/logos/*.svg apps/web/public/logos/ 2>/dev/null || true
```

- [ ] **Step 11: Install dependencies and verify dev server starts**

```bash
cd cardconomy-prod
npm install
cd apps/web
npx next build
```

Expected: build completes with no errors. The page shows "Cardconomy" heading with three coloured pills.

Note: Clerk requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables. Create `apps/web/.env.local` with placeholder values for build to succeed:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
```

- [ ] **Step 12: Commit**

```bash
git add apps/web
git commit -m "feat: scaffold Next.js app with Tailwind, Clerk auth, design tokens, and providers"
```

---

### Task 8: Responsive App Shell (TopBar, BottomNav, SideNav)

**Files:**
- Create: `apps/web/src/components/layout/top-bar.tsx`
- Create: `apps/web/src/components/layout/bottom-nav.tsx`
- Create: `apps/web/src/components/layout/side-nav.tsx`
- Create: `apps/web/src/components/layout/shell.tsx`
- Modify: `apps/web/src/app/layout.tsx` (wrap children in Shell)
- Modify: `apps/web/src/app/page.tsx` (update to render inside shell)

**Interfaces:**
- Consumes: `Icon` and `IconName` from `@cardconomy/ui`, `TabId` and `TABS` from `@cardconomy/types`, `useAuthStore` from `@cardconomy/store`, `usePathname` from `next/navigation`
- Produces: `<Shell>` component that renders `<TopBar>` + `<BottomNav>` on mobile and `<SideNav>` on desktop. Children render in the main content area. All subsequent pages render inside this shell.

- [ ] **Step 1: Create TopBar**

`apps/web/src/components/layout/top-bar.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@cardconomy/ui";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export function TopBar({ title, showBack = false, actions }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border-default bg-surface-default px-4">
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
      {!title && <div className="flex-1" />}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
```

- [ ] **Step 2: Create BottomNav**

`apps/web/src/components/layout/bottom-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@cardconomy/ui";
import { cn } from "@cardconomy/ui";
import { useCartStore } from "@cardconomy/store";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" as const, href: "/" },
  { id: "search", label: "Search", icon: "search" as const, href: "/search" },
  { id: "sell", label: "Sell", icon: "sell" as const, href: "/sell" },
  { id: "trade", label: "Trade", icon: "trade" as const, href: "/trade" },
  { id: "profile", label: "Profile", icon: "user" as const, href: "/dashboard" },
];

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.itemCount());

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-default bg-surface-default/90 backdrop-blur-md lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1",
                active ? "text-brand-primary" : "text-text-muted"
              )}
            >
              {item.id === "sell" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white shadow-2">
                  <Icon name={item.icon} size={20} />
                </div>
              ) : (
                <Icon name={item.icon} size={22} />
              )}
              {item.id !== "sell" && (
                <span className="text-[10px] font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create SideNav**

`apps/web/src/components/layout/side-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@cardconomy/ui";
import { cn } from "@cardconomy/ui";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" as const, href: "/" },
  { id: "search", label: "Search", icon: "search" as const, href: "/search" },
  { id: "sell", label: "Sell", icon: "sell" as const, href: "/sell" },
  { id: "trade", label: "Trade", icon: "trade" as const, href: "/trade" },
  { id: "profile", label: "Profile", icon: "user" as const, href: "/dashboard" },
  { id: "cart", label: "Cart", icon: "cart" as const, href: "/cart" },
];

export function SideNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-border-default lg:bg-surface-default">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border-default px-4">
        <img src="/brand/logo.svg" alt="" className="h-8 w-8" />
        <span className="font-wordmark text-lg font-bold tracking-wide">
          CARDCONOMY
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-primary-wash text-brand-primary"
                  : "text-text-secondary hover:bg-surface-subtle"
              )}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 4: Create Shell**

`apps/web/src/components/layout/shell.tsx`:

```tsx
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Update root layout to use Shell**

Modify `apps/web/src/app/layout.tsx` — wrap children in Shell:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/lib/providers";
import { Shell } from "@/components/layout/shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardconomy \u2014 UK Trading Card Marketplace",
  description:
    "Buy, sell, and trade trading cards with collectors, sellers, and local game stores across the UK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Update home page to verify shell renders**

Replace `apps/web/src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Home</h1>
      <p className="mt-2 text-text-secondary">
        Cardconomy production build. Shell is working.
      </p>
      <div className="mt-4 flex gap-3">
        <span className="rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white">
          Emerald
        </span>
        <span className="rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white">
          Amber
        </span>
        <span className="rounded-md bg-surface-dark px-3 py-1.5 text-sm font-medium text-white">
          Navy
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Build and verify**

```bash
cd apps/web
npx next build
```

Expected: build succeeds. Page shows heading inside the shell — SideNav visible on wide viewports, BottomNav on narrow.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/components apps/web/src/app
git commit -m "feat: add responsive app shell with TopBar, BottomNav, SideNav"
```

---

### Task 9: Sanity Studio App

**Files:**
- Create: `apps/studio/package.json`
- Create: `apps/studio/sanity.config.ts`
- Create: `apps/studio/sanity.cli.ts`
- Create: `apps/studio/tsconfig.json`

**Interfaces:**
- Consumes: `schemas` from `@cardconomy/sanity`
- Produces: Sanity Studio that can be run locally with `npm run dev` and deployed to Sanity hosting. Provides the content editing UI for games, sets, cards, and card printings.

- [ ] **Step 1: Create apps/studio/package.json**

```json
{
  "name": "@cardconomy/studio",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "sanity": "^3",
    "react": "^19",
    "react-dom": "^19",
    "@sanity/vision": "^3",
    "@cardconomy/sanity": "*"
  },
  "devDependencies": {
    "@cardconomy/ts-config": "*",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create sanity.config.ts**

`apps/studio/sanity.config.ts`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "@cardconomy/sanity";

export default defineConfig({
  name: "cardconomy",
  title: "Cardconomy Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "placeholder",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemas,
  },
});
```

- [ ] **Step 3: Create sanity.cli.ts**

`apps/studio/sanity.cli.ts`:

```typescript
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "placeholder",
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
});
```

- [ ] **Step 4: Create tsconfig.json**

`apps/studio/tsconfig.json`:

```json
{
  "extends": "@cardconomy/ts-config/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

- [ ] **Step 5: Install and type check**

```bash
cd cardconomy-prod
npm install
cd apps/studio
npx tsc --noEmit
```

Expected: no type errors.

- [ ] **Step 6: Commit**

```bash
git add apps/studio
git commit -m "feat: add Sanity Studio app with shared schemas"
```

---

### Task 10: Clerk Auth Pages and Onboarding

**Files:**
- Create: `apps/web/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Create: `apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- Create: `apps/web/src/app/(auth)/onboarding/page.tsx`
- Create: `apps/web/src/app/(auth)/layout.tsx`

**Interfaces:**
- Consumes: `@clerk/nextjs` (SignIn, SignUp components), `usePreferencesStore` from `@cardconomy/store`, `GAMES_QUERY` from `@cardconomy/sanity`, game data from Sanity
- Produces: `/sign-in`, `/sign-up`, and `/onboarding` routes. Onboarding saves game preferences to the store and redirects to home.

- [ ] **Step 1: Create auth layout (no shell for auth pages)**

`apps/web/src/app/(auth)/layout.tsx`:

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

Note: This layout does NOT include Shell, so auth pages render without the navigation chrome. You will need to update the root layout to conditionally render Shell only for non-auth routes. The simplest approach: move Shell into a route group layout.

Create `apps/web/src/app/(main)/layout.tsx`:

```tsx
import { Shell } from "@/components/layout/shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
```

Move `apps/web/src/app/page.tsx` to `apps/web/src/app/(main)/page.tsx`.

Update `apps/web/src/app/layout.tsx` to remove Shell wrapper:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/lib/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardconomy \u2014 UK Trading Card Marketplace",
  description:
    "Buy, sell, and trade trading cards with collectors, sellers, and local game stores across the UK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create sign-in page**

`apps/web/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-2",
          headerTitle: "font-heading",
          formButtonPrimary: "bg-brand-primary hover:bg-brand-primary-press",
        },
      }}
      afterSignInUrl="/onboarding"
    />
  );
}
```

- [ ] **Step 3: Create sign-up page**

`apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`:

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-2",
          headerTitle: "font-heading",
          formButtonPrimary: "bg-brand-primary hover:bg-brand-primary-press",
        },
      }}
      afterSignUpUrl="/onboarding"
    />
  );
}
```

- [ ] **Step 4: Create onboarding page**

`apps/web/src/app/(auth)/onboarding/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@cardconomy/ui";
import { usePreferencesStore } from "@cardconomy/store";
import type { GameId } from "@cardconomy/types";

const GAMES: { id: GameId; name: string; tint: string }[] = [
  { id: "pkmn", name: "Pok\u00e9mon", tint: "#d4a017" },
  { id: "mtg", name: "Magic: The Gathering", tint: "#c2691b" },
  { id: "ygo", name: "Yu-Gi-Oh!", tint: "#7c4dd1" },
  { id: "onepiece", name: "One Piece TCG", tint: "#c0392b" },
  { id: "lorcana", name: "Lorcana", tint: "#1f8fd6" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { gamePreferences, toggleGame } = usePreferencesStore();
  const [selected, setSelected] = useState<GameId[]>(gamePreferences);

  function toggle(id: GameId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    usePreferencesStore.getState().setGames(selected);
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">What do you play?</h1>
        <p className="mt-1 text-text-secondary">
          Pick your games to personalise your feed. You can change this later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game) => {
          const isSelected = selected.includes(game.id);
          return (
            <button
              key={game.id}
              onClick={() => toggle(game.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                isSelected
                  ? "border-brand-primary bg-brand-primary-wash"
                  : "border-border-default bg-surface-default hover:border-border-subtle"
              )}
            >
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: game.tint }}
              />
              <span className="text-sm font-medium">{game.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-primary-press"
        >
          {selected.length > 0 ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Add Clerk environment variables to .env.local**

Update `apps/web/.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

- [ ] **Step 6: Build and verify**

```bash
cd apps/web
npx next build
```

Expected: build succeeds with sign-in, sign-up, and onboarding routes.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app
git commit -m "feat: add Clerk auth pages and game preference onboarding"
```

---

### Task 11: Vercel Deployment Configuration

**Files:**
- Create: `apps/web/vercel.json`
- Create: `cardconomy-prod/.env.example`

**Interfaces:**
- Consumes: all previous tasks
- Produces: deployable Vercel project. Running `vercel` from the repo root deploys the web app.

- [ ] **Step 1: Create vercel.json in apps/web**

`apps/web/vercel.json`:

```json
{
  "framework": "nextjs"
}
```

The Turborepo root needs a `vercel.json` to tell Vercel which app to build:

`cardconomy-prod/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && npx turbo build --filter=@cardconomy/web",
  "installCommand": "cd ../.. && npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

Note: the exact Vercel config depends on whether you link the project root or `apps/web`. Linking from project root with Turborepo is the recommended approach. Vercel auto-detects Turborepo monorepos — you may only need to set the root directory to `apps/web` in the Vercel dashboard.

- [ ] **Step 2: Create .env.example**

`cardconomy-prod/.env.example`:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

- [ ] **Step 3: Run full turbo build from root**

```bash
cd cardconomy-prod
npx turbo build
```

Expected: all packages and apps build successfully.

- [ ] **Step 4: Commit**

```bash
git add vercel.json .env.example apps/web/vercel.json
git commit -m "feat: add Vercel deployment config and env example"
```

---

## Summary

After completing all 11 tasks, you have:

| What | Status |
|------|--------|
| Turborepo monorepo with shared configs | Working |
| `@cardconomy/types` — all shared TypeScript types | Working |
| `@cardconomy/ui` — design tokens, formatGBP, cn(), Icon, GradeChip, PriceTag, CardArt | Working + tested |
| `@cardconomy/store` — cart, auth, preferences stores + query client | Working + tested |
| `@cardconomy/sanity` — schemas, client, GROQ queries | Working |
| `@cardconomy/web` — Next.js app with Tailwind, fonts, Clerk auth, responsive shell | Working |
| `@cardconomy/studio` — Sanity Studio with shared schemas | Working |
| Vercel deployment config | Ready |

**What comes next (Phase 2 — Browse Flow):**
- Home page connected to Sanity (game carousel, featured sets)
- Search page with filters and TanStack Query
- Product page (`/card/[slug]`) with Sanity card data + mock listing API
- Listing detail page (`/listing/[id]`) with mock data
- All pages responsive with the established shell and component patterns
