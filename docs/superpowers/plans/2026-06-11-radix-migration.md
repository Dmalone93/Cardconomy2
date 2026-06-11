# Radix Themes Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Cardconomy prototype (18 screens, static HTML+JSX) to a proper Vite + React + Radix Themes build with identical flows.

**Architecture:** Vite + React 18 app with React Router for navigation. Radix Themes provides the component library and theming (light/dark). State lives in React context backed by localStorage. The existing mock data and card image API resolver carry over as ES modules.

**Tech Stack:** Vite, React 18, React Router 6, @radix-ui/themes, Lucide React (icons)

---

## File Structure

```
src/
  main.jsx                    — Vite entry, mounts <App/>
  App.jsx                     — Theme provider, Router, layout shell
  context/
    AppContext.jsx             — Global state (watch, cart, bids, prefs, collections, tier, acct)
  data/
    games.js                  — GAMES, SETS, GRADERS, gradeText, ART
    listings.js               — LISTINGS, LOTS, helpers (byId, setById, gameById, series)
    shops.js                  — SHOPS, TRADERS, buylist/submission mock data
    card-images.js            — CardImg resolver (Scryfall, pokemontcg, YGOPRODeck, etc.)
  components/
    Layout.jsx                — Shell: top bar, bottom nav, side menu, toast
    CardArt.jsx               — Card image with API resolution + placeholder
    Slab.jsx                  — Graded card display
    PriceChart.jsx            — Sparkline price history
    ListCard.jsx              — Grid card (used in home, search)
    ListRow.jsx               — List row (used in search, watchlist)
    Sheet.jsx                 — Bottom sheet modal (Radix Dialog)
    GameChips.jsx             — Game preference filter chips
  screens/
    Home.jsx                  — Browse feed (ads, featured, trending, sets, bids, lots)
    Search.jsx                — Search + filters + sort
    Listing.jsx               — Card detail, buy/bid/offer
    Cart.jsx                  — Shopping cart
    Checkout.jsx              — Single-item checkout
    SellHub.jsx               — Sell options (marketplace/shop/trade)
    Sell.jsx                  — Single card listing wizard (5 steps)
    SellBulk.jsx              — Bulk listing with Live Sweep
    SellShop.jsx              — Sell to local shop (6 phases)
    Trade.jsx                 — Card-for-card trading (5 phases)
    ShopFinder.jsx            — Local shop directory
    Storefront.jsx            — Shop detail + enrollment
    Watchlist.jsx             — Watchlist + collections + portfolio
    Account.jsx               — Profile screen
    AccountScreens.jsx        — Buylist, Purchases, Selling, Offers, Payments, Notifications
    Verify.jsx                — Identity verification tiers
    AuthCard.jsx              — Card authentication flow
    Onboarding.jsx            — First-run overlay (account type + game prefs)
    Shop.jsx                  — Shop counter staff app
index.html                    — Vite HTML entry
package.json
vite.config.js
```

---

## Task 1: Scaffold Vite + React + Radix Themes

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html` (Vite entry), `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /Users/declanmalone/Desktop/Cardconomy02
npm create vite@latest . -- --template react 2>/dev/null || true
```

Note: Since files already exist, we'll create the Vite files manually.

- [ ] **Step 2: Create package.json**

```json
{
  "name": "cardconomy",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@radix-ui/themes": "^3.2.1",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 3: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: Create index.html (Vite entry)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cardconomy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

Wait — this will conflict with the existing `index.html`. We need to handle this.

- [ ] **Step 4 (revised): Rename existing index.html, create Vite entry**

```bash
mv index.html prototype-index.html
```

Then create `index.html` as above.

- [ ] **Step 5: Create src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance="light"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
```

- [ ] **Step 6: Create src/App.jsx (minimal shell)**

```jsx
import { Container, Heading, Text } from '@radix-ui/themes';

export default function App() {
  return (
    <Container size="2" p="4">
      <Heading size="6" mb="2">Cardconomy</Heading>
      <Text color="gray">Migration in progress...</Text>
    </Container>
  );
}
```

- [ ] **Step 7: Install dependencies and verify dev server starts**

```bash
npm install
npm run dev
```

Expected: Vite dev server at localhost:5173 showing "Cardconomy — Migration in progress..."

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js index.html src/main.jsx src/App.jsx prototype-index.html
git commit -m "feat: scaffold Vite + React + Radix Themes project"
```

---

## Task 2: Migrate Data Layer

**Files:**
- Create: `src/data/games.js`, `src/data/listings.js`, `src/data/shops.js`, `src/data/card-images.js`

The existing `data.jsx` is one big file. Split into focused modules with proper ES exports.

- [ ] **Step 1: Create src/data/games.js**

Extract from `data.jsx`: `GAMES`, `SETS`, `ART`, `GRADERS`, `gradeText` and export them as named exports.

```js
export const GAMES = [
  { id: 'pkmn', name: 'Pokemon', short: 'Pokemon', tint: '#d4a017' },
  { id: 'mtg', name: 'Magic: The Gathering', short: 'Magic', tint: '#c2691b' },
  { id: 'ygo', name: 'Yu-Gi-Oh!', short: 'Yu-Gi-Oh!', tint: '#7c4dd1' },
  { id: 'lor', name: 'One Piece TCG', short: 'One Piece', tint: '#c0392b' },
  { id: 'digimon', name: 'Digimon Card Game', short: 'Digimon', tint: '#1f8fd6' },
];

export const SETS = [
  // ... copy all SETS from data.jsx
];

export const ART = ['#c2410c','#b45309','#15803d','#0e7490','#1d4ed8','#6d28d9','#9d174d','#334155','#7c2d12','#155e63'];

export const GRADERS = {
  raw: { label: 'Raw / Ungraded', bg: '#eef0f3', fg: '#3a3d44', accent: '#71757e' },
  psa: { label: 'PSA', bg: '#b91c1c', fg: '#ffffff', accent: '#fca5a5' },
  bgs: { label: 'BGS', bg: '#1e293b', fg: '#e2e8f0', accent: '#cbd5e1' },
  cgc: { label: 'CGC', bg: '#1d4ed8', fg: '#ffffff', accent: '#93c5fd' },
};

export function gradeText(g) {
  if (!g || g.company === 'raw') return null;
  const tiers = { 10: 'GEM MINT', 9.5: 'GEM MINT', 9: 'MINT', 8.5: 'NM-MT+', 8: 'NM-MT', 7: 'NEAR MINT' };
  return tiers[g.grade] || '';
}

export function gameById(id) { return GAMES.find(g => g.id === id); }
export function setById(id) { return SETS.find(s => s.id === id); }
```

- [ ] **Step 2: Create src/data/listings.js**

Extract `LISTINGS`, `LOTS`, `series`, `byId` from `data.jsx`.

```js
import { GAMES, SETS } from './games';

function series(start, now) {
  const pts = [];
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const base = start + (now - start) * t;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.6)) * (Math.abs(now - start) * 0.06 + start * 0.015);
    pts.push(Math.max(1, Math.round((base + noise) * 100) / 100));
  }
  pts.push(now);
  return pts;
}

export const LISTINGS = [
  // ... copy all ~64 listings from data.jsx, using series() for history
];

export const LOTS = [
  // ... copy all lots from data.jsx
];

export function byId(id) { return LISTINGS.find(l => l.id === id); }
```

- [ ] **Step 3: Create src/data/shops.js**

Extract `SHOPS`, `TRADERS`, `BUYLIST_ENTRIES`, `SUBMISSIONS` and any other shop/trade mock data.

```js
export const SHOPS = [
  // ... copy from data.jsx
];

export const TRADERS = [
  // ... copy from data.jsx
];

// ... other shop-related mock data
```

- [ ] **Step 4: Create src/data/card-images.js**

Adapt `card_images.jsx` to ES module. Replace `window.CardImg` with a named export.

```js
const CACHE_KEY = 'cc_imgcache_v3';

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
}

let cache = loadCache();

function saveCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCardImage(item, cb) {
  // ... adapt the resolution logic from card_images.jsx
  // Same API calls: Scryfall, pokemontcg.io, YGOPRODeck, optcgapi, digimoncard.io
  // Call cb(url) when resolved, cb(null) on failure
}
```

- [ ] **Step 5: Verify imports work**

Add a temporary import in `src/App.jsx`:

```jsx
import { GAMES } from './data/games';
console.log('Games loaded:', GAMES.length);
```

Run `npm run dev`, check console shows "Games loaded: 5".

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: migrate data layer to ES modules"
```

---

## Task 3: App Context (Global State)

**Files:**
- Create: `src/context/AppContext.jsx`

Port the `app` object from `app.jsx` into a React context with localStorage persistence.

- [ ] **Step 1: Create src/context/AppContext.jsx**

```jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GAMES } from '../data/games';

const ALL_GAME_IDS = GAMES.map(g => g.id);

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch { return fallback; }
}

const DEFAULT_COLLECTIONS = [
  { id: 'c1', name: 'Main Binder', icon: '\u{1F4D2}', cards: ['l03', 'l09', 'l02', 'l12'] },
  { id: 'c2', name: 'Graded Vault', icon: '\u{1F3C6}', cards: ['l07', 'l04'] },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [watch, setWatch] = useState(() => loadJSON('cc_watch', ['l03', 'l05']));
  const [bids, setBids] = useState(() => loadJSON('cc_bids', {}));
  const [cart, setCart] = useState(() => loadJSON('cc_cart', []));
  const [tier, setTier] = useState(() => loadJSON('cc_tier', 0));
  const [acct, setAcct] = useState(() => loadJSON('cc_acct', 'buyer'));
  const [prefs, setPrefs] = useState(() => loadJSON('cc_prefs', ALL_GAME_IDS));
  const [onboarded, setOnboarded] = useState(() => loadJSON('cc_onboarded', false));
  const [collections, setCollections] = useState(() => loadJSON('cc_collections', DEFAULT_COLLECTIONS));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  useEffect(() => { localStorage.setItem('cc_bids', JSON.stringify(bids)); }, [bids]);
  useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('cc_tier', JSON.stringify(tier)); }, [tier]);
  useEffect(() => { localStorage.setItem('cc_acct', JSON.stringify(acct)); }, [acct]);
  useEffect(() => { localStorage.setItem('cc_prefs', JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => { localStorage.setItem('cc_onboarded', JSON.stringify(onboarded)); }, [onboarded]);
  useEffect(() => { localStorage.setItem('cc_collections', JSON.stringify(collections)); }, [collections]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const isWatched = useCallback((id) => watch.includes(id), [watch]);
  const toggleWatch = useCallback((id) => {
    setWatch(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  }, []);

  const inPrefs = useCallback((gameId) => prefs.includes(gameId), [prefs]);
  const togglePref = useCallback((id) => {
    setPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }, []);
  const allGamesSelected = useCallback(() => prefs.length === ALL_GAME_IDS.length, [prefs]);

  const isVerified = useCallback(() => tier >= 1, [tier]);
  const isBidding = useCallback((id) => !!bids[id], [bids]);

  const addToCart = useCallback((id) => {
    setCart(c => c.includes(id) ? c : [...c, id]);
  }, []);
  const removeFromCart = useCallback((id) => {
    setCart(c => c.filter(x => x !== id));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  // Collections
  const ownedIds = useCallback(() => {
    const ids = new Set();
    collections.forEach(c => c.cards.forEach(id => ids.add(id)));
    return ids;
  }, [collections]);

  const addCollection = useCallback((name) => {
    const id = 'c' + Date.now();
    setCollections(c => [...c, { id, name, icon: '\u{1F4C1}', cards: [] }]);
  }, []);

  const deleteCollection = useCallback((id) => {
    setCollections(c => c.filter(x => x.id !== id));
  }, []);

  const addCardToCollection = useCallback((collId, cardId) => {
    setCollections(cols => cols.map(c =>
      c.id === collId && !c.cards.includes(cardId)
        ? { ...c, cards: [...c.cards, cardId] }
        : c
    ));
  }, []);

  const removeCardFromCollection = useCallback((collId, cardId) => {
    setCollections(cols => cols.map(c =>
      c.id === collId ? { ...c, cards: c.cards.filter(x => x !== cardId) } : c
    ));
  }, []);

  const finishOnboarding = useCallback(({ acct: a, prefs: p }) => {
    setAcct(a);
    setPrefs(p);
    setOnboarded(true);
  }, []);

  const value = {
    watch, bids, cart, tier, acct, prefs, onboarded, collections, toast,
    setWatch, setBids, setCart, setTier, setAcct, setPrefs, setOnboarded, setCollections,
    showToast, isWatched, toggleWatch, inPrefs, togglePref, allGamesSelected,
    isVerified, isBidding, addToCart, removeFromCart, clearCart,
    ownedIds, addCollection, deleteCollection, addCardToCollection, removeCardFromCollection,
    finishOnboarding,
    cartCount: cart.length,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
```

- [ ] **Step 2: Wire into App.jsx**

```jsx
import { Container, Heading, Text } from '@radix-ui/themes';
import { AppProvider, useApp } from './context/AppContext';

function AppInner() {
  const { cartCount, prefs } = useApp();
  return (
    <Container size="2" p="4">
      <Heading size="6" mb="2">Cardconomy</Heading>
      <Text color="gray">Cart: {cartCount} items, Following {prefs.length} games</Text>
    </Container>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
```

- [ ] **Step 3: Verify state loads from localStorage**

Run `npm run dev`. Should show "Cart: 0 items, Following 5 games" (or persisted values if localStorage has data from the prototype).

- [ ] **Step 4: Commit**

```bash
git add src/context/AppContext.jsx src/App.jsx
git commit -m "feat: add AppContext with localStorage-backed global state"
```

---

## Task 4: Layout Shell (Nav, Bottom Tabs, Side Menu, Toast)

**Files:**
- Create: `src/components/Layout.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/components/Layout.jsx**

Build the app shell with Radix Themes components: top bar, bottom tab nav, side menu (Radix Dialog), and toast.

```jsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Text, IconButton, Dialog, Button } from '@radix-ui/themes';
import { Home, Search, Tag, Eye, User, Menu, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'home', path: '/', label: 'Browse', icon: Home },
  { key: 'search', path: '/search', label: 'Search', icon: Search },
  { key: 'sell', path: '/sell', label: 'Sell', icon: Tag },
  { key: 'watch', path: '/watch', label: 'Watching', icon: Eye },
  { key: 'profile', path: '/profile', label: 'You', icon: User },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, toast } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const activeTab = TABS.find(t => location.pathname === t.path)?.key || 'home';
  const isTabRoot = TABS.some(t => t.path === location.pathname);

  return (
    <Flex direction="column" style={{ height: '100dvh', background: 'var(--color-background)' }}>
      {/* Top bar */}
      <Flex
        align="center"
        justify="between"
        px="4"
        py="2"
        style={{ borderBottom: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}
      >
        <IconButton variant="ghost" size="2" onClick={() => isTabRoot ? setMenuOpen(true) : navigate(-1)}>
          {isTabRoot ? <Menu size={20} /> : <span style={{ fontSize: 20 }}>&larr;</span>}
        </IconButton>
        <Text size="3" weight="bold">Cardconomy</Text>
        <IconButton variant="ghost" size="2" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <Box
              style={{
                position: 'absolute', top: 2, right: 2,
                width: 16, height: 16, borderRadius: 999,
                background: 'var(--accent-9)', color: 'white',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {cartCount}
            </Box>
          )}
        </IconButton>
      </Flex>

      {/* Main content */}
      <Box style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>

      {/* Bottom nav (only on tab roots) */}
      {isTabRoot && (
        <Flex
          align="center"
          justify="around"
          py="2"
          style={{ borderTop: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = tab.key === activeTab;
            return (
              <Flex
                key={tab.key}
                direction="column"
                align="center"
                gap="1"
                onClick={() => navigate(tab.path)}
                style={{ cursor: 'pointer', opacity: active ? 1 : 0.5 }}
              >
                <Icon size={20} />
                <Text size="1" weight={active ? 'bold' : 'regular'}>{tab.label}</Text>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* Side menu */}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Content style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 280, borderRadius: 0 }}>
          <Dialog.Title>Menu</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <Button variant="ghost" onClick={() => { navigate('/'); setMenuOpen(false); }}>Browse</Button>
            <Button variant="ghost" onClick={() => { navigate('/sell'); setMenuOpen(false); }}>Sell</Button>
            <Button variant="ghost" onClick={() => { navigate('/trade'); setMenuOpen(false); }}>Trade</Button>
            <Button variant="ghost" onClick={() => { navigate('/shopfinder'); setMenuOpen(false); }}>Find a Shop</Button>
          </Flex>
          <Dialog.Close>
            <IconButton variant="ghost" style={{ position: 'absolute', top: 16, right: 16 }}>
              <X size={20} />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>

      {/* Toast */}
      {toast && (
        <Box
          style={{
            position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--gray-12)', color: 'var(--gray-1)',
            padding: '8px 20px', borderRadius: 999, fontSize: 14, fontWeight: 500,
            zIndex: 9999,
          }}
        >
          {toast}
        </Box>
      )}
    </Flex>
  );
}
```

- [ ] **Step 2: Update App.jsx with Router + Layout**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Placeholder screens (replaced in later tasks)
function Placeholder({ name }) {
  return <div style={{ padding: 24 }}><h2>{name}</h2><p>Coming soon...</p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Placeholder name="Home" />} />
            <Route path="/search" element={<Placeholder name="Search" />} />
            <Route path="/sell" element={<Placeholder name="Sell Hub" />} />
            <Route path="/watch" element={<Placeholder name="Watching" />} />
            <Route path="/profile" element={<Placeholder name="Profile" />} />
            <Route path="/listing/:id" element={<Placeholder name="Listing" />} />
            <Route path="/cart" element={<Placeholder name="Cart" />} />
            <Route path="/checkout/:id" element={<Placeholder name="Checkout" />} />
            <Route path="/sell/single" element={<Placeholder name="Sell Single" />} />
            <Route path="/sell/bulk" element={<Placeholder name="Sell Bulk" />} />
            <Route path="/sell/shop/:shopId?" element={<Placeholder name="Sell to Shop" />} />
            <Route path="/trade" element={<Placeholder name="Trade" />} />
            <Route path="/shopfinder" element={<Placeholder name="Shop Finder" />} />
            <Route path="/storefront/:id" element={<Placeholder name="Storefront" />} />
            <Route path="/verify" element={<Placeholder name="Verify" />} />
            <Route path="/authcard/:id?" element={<Placeholder name="Auth Card" />} />
            <Route path="/shop" element={<Placeholder name="Shop Counter" />} />
            <Route path="/collection/:id" element={<Placeholder name="Collection" />} />
            <Route path="/account/:section" element={<Placeholder name="Account" />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 3: Verify navigation works**

Run `npm run dev`. Click tabs, verify URL changes and bottom nav highlights. Verify hamburger menu opens.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.jsx src/App.jsx
git commit -m "feat: add layout shell with tab nav, side menu, and routing"
```

---

## Task 5: Shared Components (CardArt, ListCard, ListRow, Sheet, GameChips, PriceChart)

**Files:**
- Create: `src/components/CardArt.jsx`, `src/components/ListCard.jsx`, `src/components/ListRow.jsx`, `src/components/Sheet.jsx`, `src/components/GameChips.jsx`, `src/components/PriceChart.jsx`, `src/components/Slab.jsx`

These are the reusable building blocks used across multiple screens. Port from the prototype, replacing inline styles with Radix Themes components where appropriate.

- [ ] **Step 1: Create src/components/CardArt.jsx**

Port `CardArt` from `components.jsx`. Uses the `getCardImage` resolver. Keep the placeholder rendering (art hex + hatch pattern + name plate) and overlay the real image when resolved.

```jsx
import React, { useState, useEffect } from 'react';
import { getCardImage } from '../data/card-images';
import { gameById, setById } from '../data/games';

export default function CardArt({ item, w = 120, radius = 10, showFoil = true }) {
  const h = Math.round(w * 1.4);
  const art = item.art || '#334155';
  const g = gameById(item.game);
  const set = setById(item.set);
  const [realUrl, setRealUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    setRealUrl(null);
    setLoaded(false);
    getCardImage(item, (url) => { if (alive && url) setRealUrl(url); });
    return () => { alive = false; };
  }, [item.game, item.name, item.number]);

  return (
    <div style={{
      width: w, height: h, borderRadius: radius, position: 'relative',
      overflow: 'hidden', flexShrink: 0, isolation: 'isolate', background: art,
    }}>
      {realUrl && (
        <img
          src={realUrl} alt={item.name}
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', borderRadius: radius,
            opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 3,
          }}
        />
      )}
      {/* Placeholder art window */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, top: w * 0.13, height: h * 0.46,
        borderRadius: radius * 0.4, overflow: 'hidden',
        background: 'rgba(0,0,0,0.16)',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 6px, transparent 6px 12px)',
      }}>
        {showFoil && item.foil && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 47%, transparent 60%)',
          }} />
        )}
      </div>
      {/* Name plate */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, top: h * 0.60,
        color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        fontWeight: 700, fontSize: Math.max(8, w * 0.085), lineHeight: 1.1,
      }}>
        {item.name}
      </div>
      {/* Bottom strip */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, bottom: w * 0.10,
        display: 'flex', justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.82)', fontSize: Math.max(6.5, w * 0.055),
      }}>
        <span>{set ? set.name.replace(/\s*\(.*\)/, '') : ''}</span>
        <span>{item.number || ''}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/ListCard.jsx**

Grid card used in Home and Search. Uses Radix Card component.

```jsx
import React from 'react';
import { Card, Text, Flex, Badge } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import CardArt from './CardArt';
import { gradeText } from '../data/games';

function money(n) {
  if (n == null) return '\u2014';
  return '$' + (n >= 1000 ? n.toLocaleString('en-US', { minimumFractionDigits: 2 }) : n.toFixed(2));
}

export default function ListCard({ item }) {
  const navigate = useNavigate();
  const gt = gradeText(item.grade);

  return (
    <Card
      style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
      onClick={() => navigate(`/listing/${item.id}`)}
    >
      <Flex direction="column" gap="2" p="2">
        <CardArt item={item} w={140} />
        <Flex direction="column" gap="1">
          <Text size="2" weight="bold" truncate>{item.name}</Text>
          <Text size="1" color="gray" truncate>{item.subtitle}</Text>
          {gt && <Badge size="1" variant="surface">{item.grade.company.toUpperCase()} {item.grade.grade}</Badge>}
          <Text size="3" weight="bold">{money(item.price)}</Text>
          {item.type === 'auction' && item.timeLeft && (
            <Text size="1" color="red">{item.timeLeft}</Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
```

- [ ] **Step 3: Create src/components/ListRow.jsx**

List row used in Search and Watchlist.

```jsx
import React from 'react';
import { Flex, Text, Badge, Box } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import CardArt from './CardArt';
import { gradeText } from '../data/games';

function money(n) {
  if (n == null) return '\u2014';
  return '$' + (n >= 1000 ? n.toLocaleString('en-US', { minimumFractionDigits: 2 }) : n.toFixed(2));
}

export default function ListRow({ item }) {
  const navigate = useNavigate();
  const gt = gradeText(item.grade);

  return (
    <Flex
      align="center"
      gap="3"
      py="2"
      px="3"
      onClick={() => navigate(`/listing/${item.id}`)}
      style={{ cursor: 'pointer', borderBottom: '1px solid var(--gray-a3)' }}
    >
      <CardArt item={item} w={56} radius={6} />
      <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
        <Text size="2" weight="bold" truncate>{item.name}</Text>
        <Text size="1" color="gray" truncate>{item.subtitle}</Text>
        {gt && <Badge size="1" variant="surface">{item.grade.company.toUpperCase()} {item.grade.grade}</Badge>}
      </Flex>
      <Flex direction="column" align="end" gap="1">
        <Text size="2" weight="bold">{money(item.price)}</Text>
        {item.shipping === 0 && <Text size="1" color="green">Free ship</Text>}
      </Flex>
    </Flex>
  );
}
```

- [ ] **Step 4: Create src/components/Sheet.jsx**

Bottom sheet using Radix Dialog, styled to slide up from the bottom.

```jsx
import React from 'react';
import { Dialog, Box, Flex, IconButton } from '@radix-ui/themes';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Content
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, top: 'auto',
          borderRadius: '16px 16px 0 0', maxHeight: '85vh',
          animation: 'slideUp 0.25s ease',
        }}
      >
        <Flex justify="between" align="center" mb="3">
          <Dialog.Title size="4">{title}</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" size="2"><X size={18} /></IconButton>
          </Dialog.Close>
        </Flex>
        <Box style={{ overflowY: 'auto', maxHeight: 'calc(85vh - 60px)' }}>
          {children}
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

- [ ] **Step 5: Create src/components/GameChips.jsx**

Game preference filter chips used on Home and Search.

```jsx
import React from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { useApp } from '../context/AppContext';
import { GAMES } from '../data/games';

export default function GameChips({ selected, onSelect }) {
  const { prefs, inPrefs } = useApp();
  const visibleGames = GAMES.filter(g => inPrefs(g.id));

  return (
    <Flex gap="2" py="2" style={{ overflowX: 'auto' }}>
      <Button
        size="1"
        variant={!selected ? 'solid' : 'outline'}
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {visibleGames.map(g => (
        <Button
          key={g.id}
          size="1"
          variant={selected === g.id ? 'solid' : 'outline'}
          onClick={() => onSelect(g.id)}
          style={{ flexShrink: 0 }}
        >
          {g.short}
        </Button>
      ))}
    </Flex>
  );
}
```

- [ ] **Step 6: Create src/components/PriceChart.jsx**

Simple SVG sparkline for price history.

```jsx
import React from 'react';

export default function PriceChart({ data, width = 200, height = 40, color = 'var(--accent-9)' }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add shared components (CardArt, ListCard, ListRow, Sheet, GameChips, PriceChart)"
```

---

## Task 6: Home Screen (Browse)

**Files:**
- Create: `src/screens/Home.jsx`
- Modify: `src/App.jsx` (replace placeholder)

Port the browse feed: game chips, ad carousel, featured rail, active bids, ending soon, trending, shop by set, collector's corner, bulk lots.

- [ ] **Step 1: Create src/screens/Home.jsx**

Build the full Home screen using Radix Themes components (Card, Heading, Text, Badge, Flex, Box, ScrollArea). Use `ListCard` for card grids, horizontal scroll for carousels. Filter all content by `inPrefs`. Include:
- Sticky search bar at top (navigates to /search on tap)
- GameChips filter
- Ad carousel (use existing images from `ads/`)
- Featured editorial rail
- Active bids section (from `useApp().bids`)
- Ending soon auctions
- Trending cards
- Shop by set (set box art grid)
- Collector's corner guides
- Bulk lots

Each section follows the pattern:
```jsx
<Box py="3">
  <Flex justify="between" align="center" px="3" mb="2">
    <Heading size="3">Section Title</Heading>
    <Text size="1" color="gray" style={{ cursor: 'pointer' }}>See all</Text>
  </Flex>
  <Flex gap="3" px="3" style={{ overflowX: 'auto' }}>
    {/* items */}
  </Flex>
</Box>
```

- [ ] **Step 2: Replace placeholder in App.jsx**

```jsx
import Home from './screens/Home';
// ...
<Route path="/" element={<Home />} />
```

- [ ] **Step 3: Verify Home renders with card images loading**

Run `npm run dev`. Browse feed should display with real card images resolving from APIs.

- [ ] **Step 4: Commit**

```bash
git add src/screens/Home.jsx src/App.jsx
git commit -m "feat: add Home/Browse screen with full feed"
```

---

## Task 7: Search Screen

**Files:**
- Create: `src/screens/Search.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/Search.jsx**

Port search with: text input (Radix TextField), filter chips (Radix ToggleGroup or custom), full filter sheet (Sheet component with Select, Slider, Checkbox), sort sheet, grid/list toggle, results display using ListCard/ListRow. Include animated placeholder text cycling and popular search suggestions for empty state.

- [ ] **Step 2: Wire into router**

- [ ] **Step 3: Verify search filtering works**

- [ ] **Step 4: Commit**

```bash
git add src/screens/Search.jsx src/App.jsx
git commit -m "feat: add Search screen with filters and sort"
```

---

## Task 8: Listing Screen

**Files:**
- Create: `src/screens/Listing.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/Listing.jsx**

Port card detail: hero image (CardArt/Slab large), title + grade, price with market comparison (Badge for delta), PriceChart, seller card (Avatar, rating, sales count), shipping info, similar listings carousel, sticky CTA footer. Offer and bid input via Sheet. Uses `useParams()` to get listing ID.

Key Radix components: Card, Badge, Button, Separator, Avatar, Callout, Tabs (for price chart timeframes).

- [ ] **Step 2: Wire into router**

- [ ] **Step 3: Verify listing loads with real card image**

- [ ] **Step 4: Commit**

```bash
git add src/screens/Listing.jsx src/App.jsx
git commit -m "feat: add Listing detail screen"
```

---

## Task 9: Cart + Checkout

**Files:**
- Create: `src/screens/Cart.jsx`, `src/screens/Checkout.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/Cart.jsx**

Port cart: item list with CardArt thumbnails, remove button, shipping notice, order summary (Radix Table or Flex rows), checkout CTA. Empty state with browse link.

- [ ] **Step 2: Create src/screens/Checkout.jsx**

Port single-item checkout: item summary, address selector (Radix Select), delivery options (RadioGroup), payment method, order summary, success screen.

- [ ] **Step 3: Wire into router and verify add-to-cart flow**

- [ ] **Step 4: Commit**

```bash
git add src/screens/Cart.jsx src/screens/Checkout.jsx src/App.jsx
git commit -m "feat: add Cart and Checkout screens"
```

---

## Task 10: Sell Screens (Hub, Single, Bulk, Shop)

**Files:**
- Create: `src/screens/SellHub.jsx`, `src/screens/Sell.jsx`, `src/screens/SellBulk.jsx`, `src/screens/SellShop.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/SellHub.jsx**

Port sell hub: three big choice cards (marketplace, local shop, trade), marketplace sub-chooser (single vs bulk). Use Radix Card + Flex.

- [ ] **Step 2: Create src/screens/Sell.jsx**

Port 5-step wizard: card search, condition/grade, photos, pricing, review. Use local component state for step tracking. Radix Select for grade, RadioGroup for auction/buy now, Switch for toggles.

- [ ] **Step 3: Create src/screens/SellBulk.jsx**

Port bulk flow: method selection, Live Sweep scanner UI, pricing strategy, card list, payout summary.

- [ ] **Step 4: Create src/screens/SellShop.jsx**

Port 6-phase sell-to-shop: landing, identity form, method, scan, review with triage, confirmation, message thread. This is the most complex screen (~498 lines in prototype).

- [ ] **Step 5: Wire all into router and verify sell flows**

- [ ] **Step 6: Commit**

```bash
git add src/screens/SellHub.jsx src/screens/Sell.jsx src/screens/SellBulk.jsx src/screens/SellShop.jsx src/App.jsx
git commit -m "feat: add Sell screens (hub, single, bulk, shop)"
```

---

## Task 11: Trade Screen

**Files:**
- Create: `src/screens/Trade.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/Trade.jsx**

Port all 5 phases: match list, open offers board, post trade composer, build trade (fairness meter, cash balancer), meetup location (shop/public/custom with negotiation). Use Radix Tabs for match phases, SegmentedControl for trade sides.

- [ ] **Step 2: Wire and verify trade flow end-to-end**

- [ ] **Step 3: Commit**

```bash
git add src/screens/Trade.jsx src/App.jsx
git commit -m "feat: add Trade screen with all phases"
```

---

## Task 12: Shop Screens (Finder, Storefront, Shop Counter)

**Files:**
- Create: `src/screens/ShopFinder.jsx`, `src/screens/Storefront.jsx`, `src/screens/Shop.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/ShopFinder.jsx**

Port shop directory: filter chips (all/vault/trade hub/events), shop cards with rating, badges, distance. Use Radix Card, Badge.

- [ ] **Step 2: Create src/screens/Storefront.jsx**

Port shop detail + enrollment: gradient banner, shop info card, service grid, inventory preview, enrollment pitch with value props.

- [ ] **Step 3: Create src/screens/Shop.jsx**

Port shop counter staff app: inbox, dashboard with stat tiles, card review with price guide drawer, offer composer, confirmation.

- [ ] **Step 4: Wire and verify**

- [ ] **Step 5: Commit**

```bash
git add src/screens/ShopFinder.jsx src/screens/Storefront.jsx src/screens/Shop.jsx src/App.jsx
git commit -m "feat: add Shop screens (finder, storefront, counter)"
```

---

## Task 13: Watchlist + Profile + Collections

**Files:**
- Create: `src/screens/Watchlist.jsx`, `src/screens/Account.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/screens/Watchlist.jsx**

Port: tab switch (Watching/Collection) using Radix Tabs, watch rows with price trend, portfolio header with value chart, collection list, collection detail with add/remove cards via Sheet.

- [ ] **Step 2: Create src/screens/Account.jsx**

Port Profile screen + all 6 account sub-screens (Buylist, Purchases, Selling, Offers, Payments, Notifications). Use Radix Tabs, Table, Badge for status pills. Route via `/account/:section`.

- [ ] **Step 3: Wire and verify**

- [ ] **Step 4: Commit**

```bash
git add src/screens/Watchlist.jsx src/screens/Account.jsx src/App.jsx
git commit -m "feat: add Watchlist, Profile, and Account screens"
```

---

## Task 14: Verify + AuthCard + Onboarding

**Files:**
- Create: `src/screens/Verify.jsx`, `src/screens/AuthCard.jsx`, `src/screens/Onboarding.jsx`
- Modify: `src/App.jsx`, `src/main.jsx`

- [ ] **Step 1: Create src/screens/Verify.jsx**

Port trust verification: tier display, 3-step stepper, trust ladder, Trusted Seller progression metrics. Use Radix Progress, Badge, Card.

- [ ] **Step 2: Create src/screens/AuthCard.jsx**

Port 4-phase authentication flow: intro, method choice, submitted confirmation, status tracker. Use Radix Steps/Card.

- [ ] **Step 3: Create src/screens/Onboarding.jsx**

Port first-run overlay: 2-step flow (account type + game picker). Renders as full-screen overlay when `!onboarded`. Use Radix Dialog (fullscreen), RadioCards for account type, Checkbox grid for games.

- [ ] **Step 4: Wire onboarding into App — show overlay when `!onboarded`**

In `src/App.jsx`:
```jsx
const { onboarded } = useApp();
// Render <Onboarding /> overlay when !onboarded
```

- [ ] **Step 5: Verify onboarding flow**

Set `localStorage cc_onboarded` to `false`, reload. Complete onboarding, verify prefs persist.

- [ ] **Step 6: Commit**

```bash
git add src/screens/Verify.jsx src/screens/AuthCard.jsx src/screens/Onboarding.jsx src/App.jsx
git commit -m "feat: add Verify, AuthCard, and Onboarding screens"
```

---

## Task 15: Theme Switching (Light / Dark)

**Files:**
- Modify: `src/main.jsx`, `src/context/AppContext.jsx`

- [ ] **Step 1: Add theme state to AppContext**

```jsx
const [appearance, setAppearance] = useState(() => loadJSON('cc_theme', 'light'));
useEffect(() => { localStorage.setItem('cc_theme', JSON.stringify(appearance)); }, [appearance]);
```

- [ ] **Step 2: Wire theme into Radix Theme provider**

In `src/main.jsx`, consume the appearance from context and pass to `<Theme appearance={...}>`.

Since AppProvider wraps Theme, restructure so Theme can read context:

```jsx
// main.jsx
function Root() {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
}

function ThemedApp() {
  const { appearance } = useApp();
  return (
    <Theme accentColor="indigo" grayColor="slate" radius="medium" appearance={appearance}>
      <App />
    </Theme>
  );
}
```

- [ ] **Step 3: Add theme toggle to side menu**

Add Light/Dark toggle button in Layout.jsx side menu using Radix Switch.

- [ ] **Step 4: Verify theme switching**

Toggle between light and dark. Verify all screens respect the theme.

- [ ] **Step 5: Commit**

```bash
git add src/main.jsx src/context/AppContext.jsx src/components/Layout.jsx
git commit -m "feat: add light/dark theme switching"
```

---

## Task 16: Copy Static Assets + Final Wiring

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: Move image assets to public/**

```bash
mkdir -p public
cp -r ads logos sets lots brand content uploads public/
```

Vite serves `public/` as static files at the root. Image references like `ads/foo.jpg` will resolve correctly.

- [ ] **Step 2: Verify all image assets load**

Check Home screen ad carousel, set box art, logos, and card images all render.

- [ ] **Step 3: Build and verify production build**

```bash
npm run build
npm run preview
```

Verify the production build works at localhost:4173.

- [ ] **Step 4: Commit**

```bash
git add public/ vite.config.js
git commit -m "feat: add static assets and verify production build"
```

---

## Summary

| Task | Description | Key Radix Components |
|------|-------------|---------------------|
| 1 | Scaffold Vite + React + Radix Themes | Theme |
| 2 | Migrate data layer | (none — pure JS) |
| 3 | App context (global state) | (none — React context) |
| 4 | Layout shell | Dialog, IconButton, Flex, Box, Text |
| 5 | Shared components | Card, Badge, Flex, Text |
| 6 | Home screen | Card, Heading, Badge, ScrollArea |
| 7 | Search screen | TextField, Select, Checkbox, ToggleGroup |
| 8 | Listing screen | Card, Badge, Tabs, Avatar, Button, Separator |
| 9 | Cart + Checkout | Table, RadioGroup, Select, Button, Callout |
| 10 | Sell screens | Select, RadioGroup, Switch, TextField, Card |
| 11 | Trade screen | Tabs, SegmentedControl, Card, Badge |
| 12 | Shop screens | Card, Badge, Table, Dialog |
| 13 | Watchlist + Profile | Tabs, Card, Badge, Progress |
| 14 | Verify + Auth + Onboarding | Dialog, RadioCards, Checkbox, Progress |
| 15 | Theme switching | Theme (appearance prop), Switch |
| 16 | Static assets + build | (none — config) |
