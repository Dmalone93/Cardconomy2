# Seller Storefront & Free Shipping Upsell — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users visit an online seller's storefront from the product page, and nudge them toward free shipping with a non-intrusive toast after adding to cart.

**Architecture:** New `screen_seller.jsx` component registered in `app.jsx`. Data model expanded with seller metadata and helpers. Toast system enhanced to support rich content (two lines + action). Product page offer cards get tappable seller links.

**Tech Stack:** React (via window globals), inline styles matching existing patterns, no build step changes.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `data.jsx` | Modify | Expand SELLERS with `loc`, `since`, `blurb`, `freeShipMin`, `ships`; add `sellerByName()` and `listingsBySeller()` helpers; export them |
| `screen_seller.jsx` | Create | SellerScreen — branded header, stats row, bio, tabbed listings/reviews/policies |
| `app.jsx` | Modify | Import SellerScreen, register `seller` route in SCREENS, enhance `addToCart` with upsell toast logic |
| `components.jsx` | Modify | Enhance Toast to accept rich content (object with `title`, `subtitle`, `action`, `onAction`) |
| `screen_product.jsx` | Modify | Make seller name tappable link, add "View all listings" link to OfferCard |

---

### Task 1: Expand seller data model (`data.jsx`)

**Files:**
- Modify: `data.jsx:759-773` (SELLERS array)
- Modify: `data.jsx:882-888` (window exports)

- [ ] **Step 1: Expand SELLERS array with new fields**

Replace the SELLERS array (lines 759–773) with:

```javascript
const SELLERS = [
  { name: 'VaultCards',    rating: 99.4, sales: 12840, loc: 'Manchester', since: 2019, blurb: 'Specializing in high-end singles. All cards double-sleeved and shipped in toploaders.', freeShipMin: 50, ships: '1–2 days' },
  { name: 'KantoCollects', rating: 98.1, sales: 3402, loc: 'Bristol', since: 2021, blurb: 'Kanto-era collector turned seller. Fair prices on vintage and modern Pokémon.', freeShipMin: 30, ships: '2–4 days' },
  { name: 'ManaBase',      rating: 98.9, sales: 22014, loc: 'Birmingham', since: 2017, blurb: 'One of the UK\'s largest MTG sellers. Competitive pricing on staples and singles.', freeShipMin: 40, ships: '1–2 days' },
  { name: 'DuelistPrime',  rating: 99.2, sales: 6730, loc: 'Glasgow', since: 2020, blurb: 'Yu-Gi-Oh! specialist. Tournament-ready cards shipped fast.', freeShipMin: 25, ships: '2–3 days' },
  { name: 'TopDeckTCG',    rating: 99.0, sales: 9410, loc: 'Liverpool', since: 2018, blurb: 'Multi-game seller with deep stock. We ship same day before 2pm.', freeShipMin: 35, ships: '1–2 days' },
  { name: 'MetaKnight',    rating: 98.4, sales: 4205, loc: 'Newcastle', since: 2022, blurb: 'Competitive player selling rotating stock. Every card is play-tested quality.', freeShipMin: 30, ships: '2–3 days' },
  { name: 'GrandLineTCG',  rating: 97.6, sales: 1880, loc: 'Cardiff', since: 2023, blurb: 'One Piece and Dragon Ball specialist. Growing fast with fair prices.', freeShipMin: 20, ships: '2–5 days' },
  { name: 'DigiDestined',  rating: 98.6, sales: 2118, loc: 'Brighton', since: 2022, blurb: 'Digimon and niche TCGs. Hard-to-find cards at reasonable prices.', freeShipMin: 25, ships: '2–4 days' },
  { name: 'PokeGrails',    rating: 99.0, sales: 7420, loc: 'Leeds', since: 2018, blurb: 'Premium Pokémon singles. PSA and BGS graded inventory available.', freeShipMin: 50, ships: '1–2 days' },
  { name: 'RareMint',      rating: 99.1, sales: 5230, loc: 'Edinburgh', since: 2019, blurb: 'Curated selection of mint-condition cards across all major TCGs.', freeShipMin: 40, ships: '2–3 days' },
  { name: 'EeveeVault',    rating: 99.8, sales: 8921, loc: 'Edinburgh', since: 2017, blurb: 'Eeveelution collector and top-rated seller. Insured shipping on all orders.', freeShipMin: 50, ships: '1 day' },
  { name: 'VintageHolos',  rating: 100,  sales: 5610, loc: 'Leeds', since: 2016, blurb: 'WOTC-era specialist. Every card authenticated and graded.', freeShipMin: 75, ships: '1–2 days' },
  { name: 'AlphaInvest',   rating: 100,  sales: 1290, loc: 'London', since: 2015, blurb: 'Investment-grade MTG. Alpha, Beta, and Reserved List singles.', freeShipMin: 100, ships: '1–2 days' },
];
```

- [ ] **Step 2: Add helper functions after `offersForProduct` (line 880)**

Add these two helpers right after the `offersForProduct` function:

```javascript
function sellerByName(name) { return SELLERS.find(s => s.name === name); }
function listingsBySeller(name) { return LISTINGS.filter(l => l.seller === name); }
```

- [ ] **Step 3: Export the new helpers on `window`**

In the `Object.assign(window, { ... })` block (line 882), add `sellerByName, listingsBySeller` to the exported names. Add them after `COND_SHORT`:

Change:
```javascript
  PRODUCTS, productById, offersForProduct, SELLERS, COND_SHORT,
```
To:
```javascript
  PRODUCTS, productById, offersForProduct, SELLERS, COND_SHORT, sellerByName, listingsBySeller,
```

- [ ] **Step 4: Verify the app still loads**

Open the app in the browser, open devtools console, and confirm:
- `window.sellerByName('VaultCards')` returns the expanded seller object
- `window.listingsBySeller('VaultCards')` returns an array of listings
- No console errors

- [ ] **Step 5: Commit**

```bash
git add data.jsx
git commit -m "feat: expand seller data model with profiles and helpers"
```

---

### Task 2: Enhance Toast component (`components.jsx`)

**Files:**
- Modify: `components.jsx:390-401` (Toast function)

- [ ] **Step 1: Replace the Toast component to support rich content**

The current toast only accepts a string `msg`. Replace it to also accept an object with `{ title, subtitle, action, onAction }`. Replace the Toast function (lines 390–401):

```javascript
function Toast({ msg }) {
  if (!msg) return null;
  const isRich = typeof msg === 'object' && msg.title;
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
      zIndex: 90, background: 'var(--fill)', color: '#fff', borderRadius: 12,
      padding: isRich ? '11px 14px' : '11px 18px', fontFamily: T.sans, fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', animation: 'ccFade 0.2s ease',
      display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 32px)',
    }}>
      {isRich ? (
        <React.Fragment>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{msg.title}</div>
            {msg.subtitle && <div style={{ fontSize: 11, opacity: 0.8, marginTop: 1, fontWeight: 500 }}>{msg.subtitle}</div>}
          </div>
          {msg.action && msg.onAction && (
            <button onClick={msg.onAction} style={{ color: 'var(--accent-wash)', fontFamily: T.sans, fontWeight: 700, fontSize: 11, background: 'none', padding: '4px 0', whiteSpace: 'nowrap', flexShrink: 0 }}>{msg.action}</button>
          )}
        </React.Fragment>
      ) : msg}
    </div>
  );
}
```

- [ ] **Step 2: Verify existing string toasts still work**

Open the app, trigger any existing toast (e.g. add to watchlist). Confirm it still shows as a simple text toast. No visual regression.

- [ ] **Step 3: Commit**

```bash
git add components.jsx
git commit -m "feat: enhance Toast to support rich content with action button"
```

---

### Task 3: Create SellerScreen (`screen_seller.jsx`)

**Files:**
- Create: `screen_seller.jsx`

- [ ] **Step 1: Create the seller storefront screen**

Create `screen_seller.jsx` with the full component:

```javascript
// ─────────────────────────────────────────────────────────────
// Online seller storefront — profile + listings
// ─────────────────────────────────────────────────────────────
const { T: TS, money: moneyS, CardArt: CardArtS, Icon: IconS } = window;
const { sellerByName: sellerByNameS, listingsBySeller: listingsBySellerS, gameById: gameByIdS, setById: setByIdS } = window;

function SellerScreen({ app, params = {} }) {
  const seller = sellerByNameS(params.name);
  const [tab, setTab] = React.useState('listings');

  if (!seller) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 18 }}>Seller not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TS.accent, fontFamily: TS.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const listings = listingsBySellerS(seller.name);
  const isTrusted = seller.rating >= 99;
  const isFastShipper = seller.ships && seller.ships.includes('1');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TS.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* header bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TS.surface, color: TS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconS.back({})}</button>
        <div style={{ flex: 1, fontFamily: TS.sans, fontWeight: 700, fontSize: 16 }}>Back</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 40 }}>
        {/* branded header */}
        <div style={{ background: 'var(--fill)', color: '#fff', padding: '24px 16px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, background: '#fff', color: 'var(--fill)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: TS.sans, fontWeight: 800, fontSize: 22, margin: '0 auto 10px',
          }}>{seller.name.charAt(0)}</div>
          <div style={{ fontFamily: TS.sans, fontWeight: 800, fontSize: 20, letterSpacing: -0.3 }}>{seller.name}</div>
          <div style={{ fontFamily: TS.sans, fontSize: 12, opacity: 0.6, marginTop: 3 }}>{seller.loc} · Since {seller.since}</div>
          {(isTrusted || isFastShipper) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {isTrusted && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 4, fontFamily: TS.sans, fontWeight: 700, fontSize: 10 }}>Trusted</span>}
              {isFastShipper && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 4, fontFamily: TS.sans, fontWeight: 700, fontSize: 10 }}>Fast Shipper</span>}
            </div>
          )}
        </div>

        {/* stats row */}
        <div style={{ display: 'flex', background: TS.surface }}>
          {[
            [seller.rating + '%', 'Rating'],
            [seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : seller.sales, 'Sales'],
            [seller.ships.replace(' days', 'd').replace(' day', 'd'), 'Ships'],
            ['£' + seller.freeShipMin, 'Free over'],
          ].map(([val, label], i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '12px 4px',
              borderRight: i < 3 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 15 }}>{val}</div>
              <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* bio */}
        <div style={{ padding: '14px 16px', fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5, borderBottom: '1px solid var(--line)' }}>
          "{seller.blurb}"
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
          {[
            ['listings', 'Listings (' + listings.length + ')'],
            ['reviews', 'Reviews'],
            ['policies', 'Policies'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, textAlign: 'center', padding: '11px 0',
              fontFamily: TS.sans, fontWeight: 700, fontSize: 12,
              color: tab === key ? TS.ink : TS.muted,
              borderBottom: tab === key ? '2px solid var(--fill)' : '2px solid transparent',
              background: 'none',
            }}>{label}</button>
          ))}
        </div>

        {/* tab content */}
        {tab === 'listings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
            {listings.map(l => (
              <button key={l.id} onClick={() => app.nav.push('product', { id: window.PRODUCTS.find(p => p.offers.some(o => o.listingId === l.id))?.id || l.id })}
                style={{ textAlign: 'left', background: TS.surface, borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ background: TS.surface2, padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}>
                  <CardArtS item={l} w={86} />
                </div>
                <div style={{ padding: '8px 11px 11px' }}>
                  <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{l.condition}{l.foil ? ' · Foil' : ''}</div>
                  <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginTop: 3 }}>{moneyS(l.price)}</div>
                </div>
              </button>
            ))}
            {listings.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
                No listings available right now
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ padding: 16, textAlign: 'center', color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
            Reviews coming soon
          </div>
        )}

        {tab === 'policies' && (
          <div style={{ padding: 16, textAlign: 'center', color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            Shipping & return policies coming soon
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SellerScreen });
```

- [ ] **Step 2: Commit**

```bash
git add screen_seller.jsx
git commit -m "feat: create online seller storefront screen"
```

---

### Task 4: Register SellerScreen in app shell (`app.jsx`)

**Files:**
- Modify: `app.jsx:11` (imports)
- Modify: `app.jsx:21-34` (SCREENS map)

- [ ] **Step 1: Import SellerScreen**

After line 11 (`const { ProductScreen } = window;`), add:

```javascript
const { SellerScreen } = window;
```

- [ ] **Step 2: Add `seller` route to SCREENS**

In the SCREENS object, add `seller: SellerScreen` after the `product: ProductScreen` line:

```javascript
  product: ProductScreen,
  seller: SellerScreen,
```

- [ ] **Step 3: Verify navigation works**

In the browser console, confirm `window.SellerScreen` is defined. Manually test by navigating (if possible) or proceed to wiring it up in Task 5.

- [ ] **Step 4: Commit**

```bash
git add app.jsx
git commit -m "feat: register seller storefront route in app shell"
```

---

### Task 5: Add seller links to product page (`screen_product.jsx`)

**Files:**
- Modify: `screen_product.jsx:4-5` (imports)
- Modify: `screen_product.jsx:22-88` (OfferCard component)

- [ ] **Step 1: Add `listingsBySeller` import**

At line 5, add `listingsBySeller` to the destructured imports:

Change:
```javascript
const { productById: productByIdP, gameById: gameByIdP, setById: setByIdP, COND_SHORT: COND_SHORT_P } = window;
```
To:
```javascript
const { productById: productByIdP, gameById: gameByIdP, setById: setByIdP, COND_SHORT: COND_SHORT_P, listingsBySeller: listingsBySellerP } = window;
```

- [ ] **Step 2: Add `app` and `onViewSeller` props to OfferCard**

Change the OfferCard function signature from:

```javascript
function OfferCard({ offer, onBuy, onOffer, isLowest }) {
```

To:

```javascript
function OfferCard({ offer, onBuy, onOffer, isLowest, onViewSeller }) {
```

- [ ] **Step 3: Make seller name tappable**

Replace line 45 (the seller name span):

```javascript
          <span style={{ fontFamily: TP.sans, fontWeight: 600, color: TP.ink }}>{offer.seller}</span>
```

With:

```javascript
          <button onClick={onViewSeller} style={{ fontFamily: TP.sans, fontWeight: 600, color: 'var(--accent)', background: 'none', padding: 0, textDecoration: 'underline' }}>{offer.seller}</button>
```

- [ ] **Step 4: Add "View all listings" link**

After the "Make an offer" button block (after line 85, before the closing `</div>` of the OfferCard), add:

```javascript
      {onViewSeller && (
        <button onClick={onViewSeller} style={{
          marginTop: 8, color: 'var(--accent)', fontFamily: TP.sans, fontWeight: 600, fontSize: 11,
          background: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 3,
        }}>View all {listingsBySellerP(offer.seller).length} listings from this seller →</button>
      )}
```

- [ ] **Step 5: Pass `onViewSeller` prop from ProductScreen**

In ProductScreen where OfferCard is rendered (around line 177), add the `onViewSeller` prop:

Change:
```javascript
            <OfferCard key={o.id} offer={o} isLowest={idx === 0}
```

To:
```javascript
            <OfferCard key={o.id} offer={o} isLowest={idx === 0}
              onViewSeller={() => app.nav.push('seller', { name: o.seller })}
```

- [ ] **Step 6: Test seller navigation**

Open a product page, confirm:
- Seller name is blue and underlined
- Tapping seller name navigates to the seller storefront
- "View all X listings" link appears below each offer and also navigates
- Back button on seller page returns to product page

- [ ] **Step 7: Commit**

```bash
git add screen_product.jsx
git commit -m "feat: add tappable seller links to product page offer cards"
```

---

### Task 6: Add free shipping upsell toast logic (`app.jsx`)

**Files:**
- Modify: `app.jsx:4-5` (imports)
- Modify: `app.jsx:109` (addToCart function)

- [ ] **Step 1: Import seller helpers**

After the existing imports at the top of `app.jsx`, add `sellerByName`, `listingsBySeller`, and `byId` to available references. Find an appropriate import line and add:

After line 5:
```javascript
const { sellerByName: sellerByNameA, listingsBySeller: listingsBySellerA, byId: byIdA } = window;
```

- [ ] **Step 2: Replace addToCart with upsell-aware version**

Replace line 109:

```javascript
    addToCart: (id) => setCart(c => { if (c.includes(id)) { showToast('Already in cart'); return c; } showToast('Added to cart \uD83D\uDED2'); return [...c, id]; }),
```

With:

```javascript
    addToCart: (id) => setCart(c => {
      if (c.includes(id)) { showToast('Already in cart'); return c; }
      const newCart = [...c, id];
      // upsell check
      const item = byIdA(id);
      const seller = item && sellerByNameA(item.seller);
      if (seller && seller.freeShipMin) {
        const sellerItems = newCart.map(byIdA).filter(Boolean).filter(x => x.seller === seller.name);
        const sellerTotal = sellerItems.reduce((s, x) => s + x.price, 0);
        const remaining = seller.freeShipMin - sellerTotal;
        const otherListings = listingsBySellerA(seller.name).filter(l => !newCart.includes(l.id));
        if (remaining > 0 && otherListings.length > 0) {
          showToast({
            title: 'Added to cart ✓',
            subtitle: 'Add £' + remaining.toFixed(2) + ' more from ' + seller.name + ' for free shipping',
            action: 'Browse →',
            onAction: () => nav.push('seller', { name: seller.name }),
          });
          return newCart;
        }
      }
      showToast('Added to cart 🛒');
      return newCart;
    }),
```

- [ ] **Step 3: Extend toast timeout for rich toasts**

In the `showToast` function (line 81–85), increase timeout for rich toasts to 4 seconds:

Replace:
```javascript
  function showToast(msg) {
    setToastState(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 1900);
  }
```

With:
```javascript
  function showToast(msg) {
    setToastState(msg);
    clearTimeout(toastTimer.current);
    const duration = (typeof msg === 'object' && msg.title) ? 4000 : 1900;
    toastTimer.current = setTimeout(() => setToastState(null), duration);
  }
```

- [ ] **Step 4: Test the upsell flow**

1. Navigate to a product page
2. Add an item to cart from a seller whose total won't hit `freeShipMin`
3. Confirm the rich toast appears with "Add £X more from {seller} for free shipping"
4. Tap "Browse →" — confirm it navigates to the seller storefront
5. Confirm the toast auto-dismisses after 4 seconds if not tapped
6. Add an item that exceeds the threshold — confirm standard "Added to cart" toast appears

- [ ] **Step 5: Commit**

```bash
git add app.jsx
git commit -m "feat: add free shipping upsell toast on add-to-cart"
```

---

### Task 7: Add `screen_seller.jsx` to `index.html`

**Files:**
- Modify: `index.html` (script tags section)

- [ ] **Step 1: Find where screen scripts are loaded and add the new one**

In `index.html`, find where other `screen_*.jsx` files are loaded as script tags. Add `screen_seller.jsx` after `screen_product.jsx`:

```html
<script src="screen_seller.jsx" type="text/babel"></script>
```

Make sure it's loaded AFTER `data.jsx` (which provides the helpers) and BEFORE `app.jsx` (which imports `SellerScreen`).

- [ ] **Step 2: Full integration test**

1. Load the app fresh in the browser
2. Navigate to any product page
3. Confirm seller names are blue links
4. Tap a seller name → seller storefront loads with header, stats, bio, listings
5. Tap a listing on the storefront → navigates to product page
6. Add to cart from product page → upsell toast appears (if applicable)
7. Tap "Browse →" on toast → seller storefront loads
8. Back navigation works throughout

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: load seller storefront script in index.html"
```
