# Product-Based Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the marketplace from individual listings to product pages with multiple seller offers for raw cards, while keeping graded slabs and auctions as unique listings.

**Architecture:** Add PRODUCTS and OFFERS arrays to data.jsx, derived from existing LISTINGS. Create a new ProductScreen component for the product detail page. Update ListCard, ListRow, search, and home feed to route raw cards to product pages and graded/auctions to listing pages. Register the new `product` route in app.jsx.

**Tech Stack:** In-browser React 18 + Babel (existing prototype stack). No build step.

---

## File Structure

```
data.jsx              — Add PRODUCTS, OFFERS arrays + helpers (productById, offersForProduct)
screen_product.jsx    — NEW: Product detail page (card info + seller offer cards)
screen_home.jsx       — Update ListCard to handle products; update trending section
screen_search.jsx     — Update results to show ProductCard vs ListingCard
app.jsx               — Register ProductScreen + `product` route
index.html            — Add <script> tag for screen_product.jsx
```

---

### Task 1: Add PRODUCTS and OFFERS data to data.jsx

**Files:**
- Modify: `data.jsx`

- [ ] **Step 1: Add PRODUCTS array after LISTINGS**

At the bottom of `data.jsx`, before the `Object.assign(window, ...)` line, add the PRODUCTS and OFFERS arrays. Products are derived from raw buy-now listings grouped by game+set+number. Each product gets 2-4 mock offers from different sellers at varying prices/conditions.

```js
// ─────────────────────────────────────────────────────────────
// Products — unique card identities (raw cards grouped)
// ─────────────────────────────────────────────────────────────
const SELLERS = [
  { name: 'VaultCards', rating: 99.4, sales: 12840 },
  { name: 'KantoCollects', rating: 98.1, sales: 3402 },
  { name: 'ManaBase', rating: 98.9, sales: 22014 },
  { name: 'TopDeckTCG', rating: 99.0, sales: 9410 },
  { name: 'PokeGrails', rating: 99.0, sales: 7420 },
  { name: 'DuelistPrime', rating: 99.2, sales: 6730 },
  { name: 'MetaKnight', rating: 98.4, sales: 4205 },
  { name: 'GrandLineTCG', rating: 97.6, sales: 1880 },
  { name: 'AlphaInvest', rating: 100, sales: 1290 },
  { name: 'EeveeVault', rating: 99.8, sales: 8921 },
  { name: 'RareMint', rating: 99.1, sales: 5230 },
  { name: 'DigiDestined', rating: 98.6, sales: 2118 },
];

const CONDITIONS = ['Near Mint', 'Lightly Played', 'Moderately Played'];
const COND_SHORT = { 'Near Mint': 'NM', 'Lightly Played': 'LP', 'Moderately Played': 'MP' };
const SHIPS = ['1–2 days', '2–3 days', '2–4 days', '2–5 days'];
const LOCS = ['Dallas, TX', 'Portland, OR', 'Seattle, WA', 'Austin, TX', 'Chicago, IL', 'Denver, CO', 'Miami, FL', 'New York, NY', 'San Jose, CA', 'Los Angeles, CA'];

// Build products from raw buy-now listings
const rawListings = LISTINGS.filter(l => l.grade.company === 'raw' && l.type === 'buynow');
const productMap = {};

rawListings.forEach(l => {
  const key = l.game + '|' + l.set + '|' + l.number;
  if (!productMap[key]) {
    productMap[key] = {
      id: 'p_' + l.game + '_' + l.set + '_' + (l.number || '').replace(/\//g, '-'),
      game: l.game, set: l.set, number: l.number,
      name: l.name, subtitle: l.subtitle, art: l.art, foil: l.foil,
      market: l.market, history: l.history,
      offers: [],
    };
  }
  // The original listing becomes the first offer
  productMap[key].offers.push({
    id: 'o_' + l.id,
    seller: l.seller, sellerRating: l.sellerRating, sellerSales: l.sellerSales,
    condition: l.condition, price: l.price, accepts_offers: l.accepts_offers,
    shipping: l.shipping, ships: l.ships, loc: l.loc,
  });
});

// Add 1-3 extra mock offers per product for variety
Object.values(productMap).forEach(p => {
  const extraCount = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < extraCount; i++) {
    const s = SELLERS[(SELLERS.length * Math.random()) | 0];
    // Skip if same seller already has an offer
    if (p.offers.some(o => o.seller === s.name)) continue;
    const cond = CONDITIONS[(Math.random() * CONDITIONS.length) | 0];
    const priceMult = cond === 'Near Mint' ? 1 + Math.random() * 0.15 : cond === 'Lightly Played' ? 0.8 + Math.random() * 0.15 : 0.6 + Math.random() * 0.15;
    const price = Math.round(p.market * priceMult * 100) / 100;
    p.offers.push({
      id: 'o_gen_' + p.id + '_' + i,
      seller: s.name, sellerRating: s.rating, sellerSales: s.sales,
      condition: cond, price: price,
      accepts_offers: Math.random() > 0.4,
      shipping: Math.random() > 0.5 ? 0 : [1.99, 3.99, 4.99][(Math.random() * 3) | 0],
      ships: SHIPS[(Math.random() * SHIPS.length) | 0],
      loc: LOCS[(Math.random() * LOCS.length) | 0],
    });
  }
  // Sort offers by price ascending
  p.offers.sort((a, b) => a.price - b.price);
  // Compute low/high/offerCount
  p.low = p.offers[0].price;
  p.high = p.offers[p.offers.length - 1].price;
  p.offerCount = p.offers.length;
});

const PRODUCTS = Object.values(productMap);
const productById = (id) => PRODUCTS.find(p => p.id === id);
const offersForProduct = (id) => { const p = productById(id); return p ? p.offers : []; };
```

- [ ] **Step 2: Export the new data on window**

Update the `Object.assign(window, ...)` at the bottom of `data.jsx` to include the new exports:

Add these to the existing Object.assign call:
```js
PRODUCTS, productById, offersForProduct, SELLERS, COND_SHORT,
```

- [ ] **Step 3: Verify data loads**

Reload `index.html` in a browser. Open the console and run:
```js
console.log('Products:', PRODUCTS.length, 'First:', PRODUCTS[0]?.name, 'Offers:', PRODUCTS[0]?.offers.length);
```
Expected: Products count > 0, first product has a name and 2+ offers.

- [ ] **Step 4: Commit**

```bash
git add data.jsx
git commit -m "feat: add PRODUCTS and OFFERS data model for product-based marketplace"
```

---

### Task 2: Create ProductScreen (product detail page)

**Files:**
- Create: `screen_product.jsx`

- [ ] **Step 1: Create screen_product.jsx**

This is the new product detail page for raw cards. It shows the card info at top, price stats, price chart, then a list of seller offer cards.

```jsx
// ─────────────────────────────────────────────────────────────
// Product detail — multi-seller view for raw cards
// ─────────────────────────────────────────────────────────────
const { T: TP, money: moneyP, CardArt: CardArtP, Sparkline: SparkP, Icon: IconP, Sheet: SheetP, Badge: BadgeP } = window;
const { productById: productByIdP, gameById: gameByIdP, setById: setByIdP, COND_SHORT: COND_SHORT_P } = window;

function CondBadge({ condition }) {
  const short = COND_SHORT_P[condition] || condition;
  const colors = {
    'Near Mint': { bg: '#f0fdf4', fg: '#16a34a' },
    'Lightly Played': { bg: '#fffbeb', fg: '#d97706' },
    'Moderately Played': { bg: '#fff7ed', fg: '#ea580c' },
    'Heavily Played': { bg: '#fef2f2', fg: '#dc2626' },
  };
  const c = colors[condition] || { bg: '#f0f0f0', fg: '#666' };
  return (
    <span style={{ background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{short}</span>
  );
}

function OfferCard({ offer, onBuy, onOffer }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 4, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(offer.price)}</span>
          <CondBadge condition={offer.condition} />
        </div>
        <button onClick={() => onBuy(offer)} style={{
          background: 'var(--fill)', color: '#fff', padding: '8px 18px', borderRadius: 4,
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13 }}>Buy</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: TP.muted }}>
        <div style={{
          width: 28, height: 28, borderRadius: 999, background: TP.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{offer.seller.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, color: TP.ink }}>{offer.seller}</span>
          <span style={{ marginLeft: 6 }}>{offer.sellerRating}% · {offer.sellerSales.toLocaleString()} sales</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: TP.muted }}>
        <span>{offer.shipping === 0 ? '✓ Free shipping' : moneyP(offer.shipping) + ' shipping'}</span>
        <span>Ships {offer.ships}</span>
      </div>
      {offer.accepts_offers && (
        <button onClick={() => onOffer(offer)} style={{
          marginTop: 8, color: TP.accent, fontFamily: TP.sans, fontWeight: 600, fontSize: 12,
          background: 'none', padding: 0 }}>Make an offer</button>
      )}
    </div>
  );
}

function ProductScreen({ app, params }) {
  const product = productByIdP(params.id);
  const [offerSheet, setOfferSheet] = React.useState(null);
  const [offerVal, setOfferVal] = React.useState('');
  if (!product) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>Product not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TP.accent, fontFamily: TP.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const g = gameByIdP(product.game);
  const s = setByIdP(product.set);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TP.surface, color: TP.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconP.back({})}</button>
        <div style={{ flex: 1, fontFamily: TP.sans, fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 40 }}>
        {/* hero card image */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#ffffff' }}>
          <CardArtP item={product} w={160} radius={4} />
        </div>

        {/* card info */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>{product.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 14, color: TP.muted, marginTop: 2 }}>
            {product.subtitle}{s ? ' · ' + s.name : ''}{product.number ? ' · ' + product.number : ''}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {g && <span style={{ background: g.tint + '1a', color: g.tint, padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>{g.short}</span>}
            {product.foil && <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>Foil</span>}
          </div>
        </div>

        {/* price stats */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 16px' }}>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>Market</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(product.market)}</div>
          </div>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>Low</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18, color: 'var(--up)' }}>{moneyP(product.low)}</div>
          </div>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>High</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(product.high)}</div>
          </div>
        </div>

        {/* price chart */}
        {product.history && (
          <div style={{ padding: '0 16px 16px' }}>
            <SparkP data={product.history} width={window.innerWidth - 32} height={48} color="var(--accent)" />
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>30-day price trend</div>
          </div>
        )}

        {/* seller offers */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
            Available from {product.offerCount} seller{product.offerCount !== 1 ? 's' : ''}
          </div>
          {product.offers.map(o => (
            <OfferCard key={o.id} offer={o}
              onBuy={(offer) => app.nav.push('checkout', { id: offer.id })}
              onOffer={(offer) => { setOfferSheet(offer); setOfferVal(''); }}
            />
          ))}
        </div>
      </div>

      {/* offer sheet */}
      {offerSheet && (
        <SheetP open={!!offerSheet} onClose={() => setOfferSheet(null)} title={'Offer to ' + offerSheet.seller}>
          <div style={{ padding: '8px 0 20px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginBottom: 12 }}>
              Listed at {moneyP(offerSheet.price)} · {offerSheet.condition}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: TP.surface2, borderRadius: 4, padding: '12px 14px' }}>
              <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 22, color: TP.muted }}>$</span>
              <input value={offerVal} onChange={e => setOfferVal(e.target.value)} placeholder="0.00" type="number"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TP.sans, fontWeight: 700, fontSize: 22, color: TP.ink, minWidth: 0 }} />
            </div>
            <button onClick={() => { app.toast('Offer sent to ' + offerSheet.seller); setOfferSheet(null); }} style={{
              width: '100%', marginTop: 16, background: 'var(--fill)', color: '#fff', borderRadius: 4, padding: 14,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 15 }}>Send offer</button>
          </div>
        </SheetP>
      )}
    </div>
  );
}

Object.assign(window, { ProductScreen });
```

- [ ] **Step 2: Verify file parses**

Reload `index.html` (after adding the script tag in Task 3). Check console for syntax errors.

- [ ] **Step 3: Commit**

```bash
git add screen_product.jsx
git commit -m "feat: add ProductScreen for multi-seller product pages"
```

---

### Task 3: Register ProductScreen in app.jsx and index.html

**Files:**
- Modify: `app.jsx`
- Modify: `index.html`

- [ ] **Step 1: Add script tag in index.html**

In `index.html`, find the script tags for screen files (they're ordered before `app.jsx`). Add screen_product.jsx before `app.jsx`:

```html
<script type="text/babel" src="screen_product.jsx"></script>
```

Place it right after the other `screen_*.jsx` tags and before `app.jsx`.

- [ ] **Step 2: Import ProductScreen in app.jsx**

At the top of `app.jsx`, add `ProductScreen` to the destructure from window. Find the line:

```js
const { TradeScreen, StorefrontScreen, EnrollShopScreen, ShopFinderScreen } = window;
```

Add after it:
```js
const { ProductScreen } = window;
```

- [ ] **Step 3: Add product route to SCREENS map**

In the `SCREENS` object in `app.jsx`, add:
```js
product: ProductScreen,
```

- [ ] **Step 4: Verify navigation works**

Reload. In console run: `PRODUCTS[0].id` to get a product ID. Then test navigation manually or wait for Task 4 to wire it up from the feed.

- [ ] **Step 5: Commit**

```bash
git add app.jsx index.html
git commit -m "feat: register ProductScreen route in app shell"
```

---

### Task 4: Update ListCard and home feed for products

**Files:**
- Modify: `screen_home.jsx`

- [ ] **Step 1: Import PRODUCTS at top of screen_home.jsx**

Update the destructure line at the top of screen_home.jsx. Find:
```js
const { GAMES, SETS, LISTINGS, LOTS, gameById, setById, gradeText } = window;
```
Change to:
```js
const { GAMES, SETS, LISTINGS, LOTS, PRODUCTS, gameById, setById, gradeText } = window;
```

- [ ] **Step 2: Add ProductCard component**

Below the existing `ListCard` function, add a `ProductCard` for displaying products in the feed:

```jsx
function ProductCard({ product, app, w }) {
  const g = gameById(product.game);
  return (
    <div onClick={() => app.nav.push('product', { id: product.id })} role="button" style={{
      width: w || '100%', textAlign: 'left', background: T.surface, cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
    }}>
      <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#ffffff' }}>
        <CardArt item={product} w={140} />
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15, letterSpacing: -0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 1, marginBottom: 8,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.subtitle}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.ink }}>{money(product.market)}</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginTop: 4 }}>
          from {money(product.low)} · {product.offerCount} seller{product.offerCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update the trending section to show products**

Find the trending section in the HomeScreen function. It currently shows:
```jsx
{trending.slice(0, 6).map(l => <ListCard key={l.id} item={l} app={app} />)}
```

Replace the trending section content with products:
```jsx
const trendingProducts = filt(PRODUCTS).slice(0, 6);
```

Add this line near the other data derivations (around line 186-189), then update the trending grid to use it:
```jsx
{trendingProducts.map(p => <ProductCard key={p.id} product={p} app={app} />)}
```

Keep the existing `trending` variable for any remaining individual listing needs, but the main "Trending now" grid should show ProductCards.

- [ ] **Step 4: Update ending soon to use ListCard (auctions only — unchanged)**

The ending soon section already filters to auctions which are individual listings. No change needed — just verify it still works.

- [ ] **Step 5: Verify home feed shows ProductCards in trending**

Reload. The "Trending now" grid should show product cards with "from $X · N sellers" text. Tapping one should navigate to the product detail page.

- [ ] **Step 6: Commit**

```bash
git add screen_home.jsx
git commit -m "feat: update home feed with ProductCard for trending section"
```

---

### Task 5: Update search results for products

**Files:**
- Modify: `screen_search.jsx`

- [ ] **Step 1: Import PRODUCTS in screen_search.jsx**

Find the destructure at the top of `screen_search.jsx` and add `PRODUCTS`:

```js
const { GAMES, SETS, LISTINGS, LOTS, PRODUCTS, gameById, setById, gradeText } = window;
```

(The exact alias pattern may differ — match whatever the file uses, e.g. `PRODUCTS: PRODUCTS_S` if the file aliases.)

Read the top of the file to find the correct destructure line and variable alias pattern.

- [ ] **Step 2: Build combined search results**

In the search filtering logic, build a combined results array that includes:
- Products (raw cards) matching the search query
- Graded listings (grade.company !== 'raw') matching the search query
- Auction listings (type === 'auction') matching the search query

The search should match against `name` and `subtitle` fields. Products use `product.name` and `product.subtitle`. Listings use `item.name` and `item.subtitle`.

Add a `searchProducts` variable alongside the existing `results`:
```js
const productResults = PRODUCTS.filter(p => {
  if (!inFeed(p)) return false;
  if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !(p.subtitle || '').toLowerCase().includes(query.toLowerCase())) return false;
  // apply game/set filters same as listings
  return true;
});

const listingResults = LISTINGS.filter(l => {
  if (l.grade.company === 'raw' && l.type === 'buynow') return false; // these are now products
  if (!inFeed(l)) return false;
  if (query && !l.name.toLowerCase().includes(query.toLowerCase()) && !(l.subtitle || '').toLowerCase().includes(query.toLowerCase())) return false;
  return true;
});
```

- [ ] **Step 3: Render mixed results**

In the results rendering, show ProductCards for products and ListCards for individual listings. Use the existing grid/list toggle to switch between views.

For grid view:
```jsx
{productResults.map(p => <ProductCard key={p.id} product={p} app={app} />)}
{listingResults.map(l => <ListCard key={l.id} item={l} app={app} />)}
```

Note: `ProductCard` needs to be available in this file. Either define it here (duplicating from home) or move it to `components.jsx` and export on window. **Recommended:** Copy the `ProductCard` function into `screen_search.jsx` since the prototype uses per-file scope.

- [ ] **Step 4: Update result count**

If the search shows a result count, update it to count both products and listings:
```js
const totalResults = productResults.length + listingResults.length;
```

- [ ] **Step 5: Verify search shows products and listings**

Reload. Search for "Charizard" — should show a ProductCard for the raw Charizard ex, plus any graded Charizard listings. Tapping the product card should go to the product page.

- [ ] **Step 6: Commit**

```bash
git add screen_search.jsx
git commit -m "feat: update search to show products alongside graded/auction listings"
```

---

### Task 6: Export ProductCard from screen_home.jsx for reuse

**Files:**
- Modify: `screen_home.jsx`

- [ ] **Step 1: Export ProductCard on window**

At the bottom of `screen_home.jsx`, find the `Object.assign(window, ...)` line and add `ProductCard`:

```js
Object.assign(window, { HomeScreen, ProductCard });
```

This lets screen_search.jsx import it instead of duplicating the component.

- [ ] **Step 2: Update screen_search.jsx to import ProductCard**

At the top of `screen_search.jsx`, add `ProductCard` to the destructure from window:
```js
const { ProductCard: ProductCardS } = window;
```

Then use `ProductCardS` in the search results rendering instead of a local copy.

- [ ] **Step 3: Remove any local ProductCard copy from screen_search.jsx**

If Task 5 created a local copy, remove it now that we're importing from window.

- [ ] **Step 4: Verify both home and search use the same ProductCard**

Reload. Check home trending shows ProductCards. Check search shows ProductCards. Both should navigate to the product page.

- [ ] **Step 5: Commit**

```bash
git add screen_home.jsx screen_search.jsx
git commit -m "refactor: export ProductCard for reuse across screens"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | PRODUCTS + OFFERS data | data.jsx |
| 2 | ProductScreen component | screen_product.jsx (new) |
| 3 | Register route | app.jsx, index.html |
| 4 | Home feed ProductCards | screen_home.jsx |
| 5 | Search results mix | screen_search.jsx |
| 6 | Export ProductCard for reuse | screen_home.jsx, screen_search.jsx |
