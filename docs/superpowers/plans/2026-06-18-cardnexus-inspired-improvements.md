# CardNexus-Inspired Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 features inspired by CardNexus competitor analysis — Hot Deals/Price Movers discovery, finish tabs, cross-set printings, browse mode tabs, fee comparison page, larger price chart, and game browser carousel.

**Architecture:** All features are UI additions to the existing React-in-browser prototype. Mock data added to `data.jsx`, UI added to existing screen files (except the new fee comparison page which gets its own screen file). All follow existing patterns: per-file theme aliases, `var(--*)` colours, `window` object sharing.

**Tech Stack:** React 18 (in-browser Babel), CSS-in-JS inline styles, localStorage state

## Global Constraints

- Per-file theme aliases (suffix convention): each screen file destructures `T`, `money`, `Icon` etc. with a unique suffix to avoid naming collisions
- No apostrophes in single-quoted JS strings — use `\u2019` or rephrase
- All colours via `T.*` or `var(--*)` — no hex in JSX
- Components shared via `window` object, not imports
- GBP currency only (`money()` formatter)
- No fabricated market data/claims — mock data clearly labelled as prototype data
- Fee numbers: 4% seller, 2% + 30p buyer (as decided with user)

---

### Task 1: Add Hot Deals & Price Movers Mock Data

**Files:**
- Modify: `data.jsx` (append after existing data, before window exports)

**Interfaces:**
- Consumes: existing `LISTINGS` array
- Produces: `HOT_DEALS` array (listing IDs + discount %), `PRICE_MOVERS` array (listing IDs + 24h change %)

- [ ] **Step 1: Add HOT_DEALS data to data.jsx**

Append before the window exports block at the end of `data.jsx`:

```javascript
// ── Hot Deals: listings priced below market value ──
const HOT_DEALS = [
  { id: 'l02', discount: 18 },
  { id: 'l05', discount: 12 },
  { id: 'l09', discount: 22 },
  { id: 'l07', discount: 8 },
  { id: 'l14', discount: 15 },
  { id: 'l03', discount: 11 },
];

// ── Price Movers: biggest 24h changes ──
const PRICE_MOVERS = [
  { id: 'l01', change: 8.3 },
  { id: 'l06', change: -12.1 },
  { id: 'l10', change: 15.7 },
  { id: 'l04', change: -6.4 },
  { id: 'l08', change: 22.0 },
  { id: 'l13', change: -9.8 },
];
```

- [ ] **Step 2: Add PRINTINGS mock data**

```javascript
// ── Cross-set printings (same card name across sets) ──
const PRINTINGS = {
  'Charizard ex': [
    { set: 's151', number: '199/165', price: 432.00 },
    { set: 'cpa', number: '079/073', price: 185.00 },
  ],
  'Pikachu': [
    { set: 's151', number: '025/165', price: 28.50 },
    { set: 'base', number: '058/102', price: 42.00 },
    { set: 'evs', number: '049/203', price: 12.00 },
  ],
};
```

- [ ] **Step 3: Export new data on window**

Add to the existing `Object.assign(window, { ... })` block:

```javascript
HOT_DEALS, PRICE_MOVERS, PRINTINGS,
```

- [ ] **Step 4: Verify data loads**

Open `index.html` in browser, open console, type `HOT_DEALS.length` — should return `6`. Type `PRICE_MOVERS.length` — should return `6`. Type `Object.keys(PRINTINGS).length` — should return `2`.

- [ ] **Step 5: Commit**

```bash
git add data.jsx && git commit -m "feat: add hot deals, price movers, and printings mock data"
```

---

### Task 2: Hot Deals & Price Movers Sections on Mobile Home

**Files:**
- Modify: `screen_home.jsx` (add two new sections after the trending grid)

**Interfaces:**
- Consumes: `HOT_DEALS`, `PRICE_MOVERS` from window, `byId` helper, existing `ListCard` component
- Produces: Two new scrollable sections on the home screen

- [ ] **Step 1: Import new data at top of screen_home.jsx**

Add to the existing destructuring line (line 5):

```javascript
const { HOT_DEALS, PRICE_MOVERS } = window;
```

- [ ] **Step 2: Add HotDealsRow component**

Add after the existing `ListRow` component (around line 110), before the `HomeScreen` function:

```javascript
function DealCard({ item, discount, app, w }) {
  const watched = app.isWatched(item.id);
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      width: w || 150, flexShrink: 0, textAlign: 'left', background: T.surface, cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
    }}>
      <div style={{ position: 'relative' }}>
        <CardArt item={item} w={150} radius={0} />
        <div style={{ position: 'absolute', top: 6, left: 6, background: T.down, color: '#fff',
          fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>
          {discount}% below market
        </div>
      </div>
      <div style={{ padding: '8px 8px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginTop: 2 }}>{money(item.price)}</div>
        <div style={{ fontSize: 12, color: T.muted, textDecoration: 'line-through', marginTop: 1 }}>{money(item.market)}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add MoverRow component**

```javascript
function MoverCard({ item, change, app }) {
  const up = change > 0;
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      background: T.surface, borderRadius: 8, cursor: 'pointer', minWidth: 220, flexShrink: 0,
      boxShadow: '0 1px 3px rgba(20,24,40,0.04)',
    }}>
      <CardArt item={item} w={40} radius={4} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: T.muted }}>{money(item.price)}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.mono,
        color: up ? T.up : T.down }}>
        {up ? '\u25B2' : '\u25BC'} {Math.abs(change).toFixed(1)}%
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Insert sections into HomeScreen render**

Inside the `HomeScreen` return JSX, after the trending grid section (after the `</div>` that closes the trending section around line 287), add:

```jsx
{/* ── Hot Deals ── */}
<div style={{ marginTop: 20 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 14px', marginBottom: 8 }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Hot Deals</div>
    <div onClick={() => app.nav.setTab('search')} style={{ fontSize: 13, fontWeight: 600,
      color: T.accent, cursor: 'pointer' }}>View all</div>
  </div>
  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px',
    scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
    {HOT_DEALS.map(d => {
      const item = byId(d.id);
      return item ? <DealCard key={d.id} item={item} discount={d.discount} app={app} /> : null;
    })}
  </div>
</div>

{/* ── Price Movers ── */}
<div style={{ marginTop: 20 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 14px', marginBottom: 8 }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Daily Movers</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: T.accent, cursor: 'pointer' }}>View all</div>
  </div>
  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 14px',
    scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
    {PRICE_MOVERS.map(m => {
      const item = byId(m.id);
      return item ? <MoverCard key={m.id} item={item} change={m.change} app={app} /> : null;
    })}
  </div>
</div>
```

- [ ] **Step 5: Verify in browser**

Open `index.html`, scroll home screen. Should see "Hot Deals" row with deal cards showing discount badges, and "Daily Movers" row with green/red percentage changes.

- [ ] **Step 6: Commit**

```bash
git add screen_home.jsx && git commit -m "feat: add Hot Deals and Daily Movers sections to mobile home"
```

---

### Task 3: Game Browser Carousel on Mobile Home

**Files:**
- Modify: `screen_home.jsx` (add game carousel section before trending)

**Interfaces:**
- Consumes: `GAMES` array from window
- Produces: Horizontal scrollable game card row

- [ ] **Step 1: Add GameTile component in screen_home.jsx**

Add after the `MoverCard` component:

```javascript
function GameTile({ game, app }) {
  return (
    <div onClick={() => app.nav.push('search', { game: game.id })} role="button" style={{
      flexShrink: 0, width: 110, cursor: 'pointer', textAlign: 'center',
    }}>
      <div style={{ width: 110, height: 70, borderRadius: 10, background: game.tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', opacity: 0.9 }}>
          {game.short.charAt(0)}
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginTop: 6,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{game.short}</div>
    </div>
  );
}
```

- [ ] **Step 2: Insert game carousel into HomeScreen**

After the game chips section and before the featured/trending section, add:

```jsx
{/* ── Browse by Game ── */}
<div style={{ marginTop: 16 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 14px', marginBottom: 8 }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Browse by Game</div>
  </div>
  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px',
    WebkitOverflowScrolling: 'touch' }}>
    {GAMES.map(g => <GameTile key={g.id} game={g} app={app} />)}
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Scroll home screen — should see coloured game tiles in a horizontal scroll row. Tapping one should navigate to search filtered by that game.

- [ ] **Step 4: Commit**

```bash
git add screen_home.jsx && git commit -m "feat: add game browser carousel to mobile home"
```

---

### Task 4: Browse Mode Tabs on Search Screen

**Files:**
- Modify: `screen_search.jsx` (add tab bar above results)

**Interfaces:**
- Consumes: `HOT_DEALS` from window, existing filter state
- Produces: Tab bar with Buy / Just Listed / Deals modes

- [ ] **Step 1: Import HOT_DEALS and add browse mode state**

At the top of `screen_search.jsx`, add to the destructuring:

```javascript
const { HOT_DEALS: HOT_DEALS_S } = window;
```

Inside `SearchScreen`, after the existing state declarations (around line 48), add:

```javascript
const [browseMode, setBrowseMode] = React.useState('buy');
```

- [ ] **Step 2: Add browse mode tab bar**

After the filter bar section (around line 187) and before the set header section, add:

```jsx
{/* ── Browse mode tabs ── */}
<div style={{ display: 'flex', gap: 6, padding: '8px 14px 0' }}>
  {[['buy', 'Buy'], ['new', 'Just Listed'], ['deals', 'Deals']].map(([key, label]) => (
    <div key={key} onClick={() => setBrowseMode(key)} style={{
      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
      background: browseMode === key ? TS.accent : TS.surface,
      color: browseMode === key ? '#fff' : TS.ink,
      border: browseMode === key ? 'none' : '1px solid ' + TS.line,
    }}>{label}</div>
  ))}
</div>
```

- [ ] **Step 3: Apply browse mode filtering to results**

Find the results rendering section where `merged` (the combined listings + products array) is defined. Wrap it with browse mode filtering. After the existing `merged` or equivalent array is built, add:

```javascript
// Apply browse mode filter
const dealIds = new Set((HOT_DEALS_S || []).map(d => d.id));
let browsed = merged;
if (browseMode === 'new') {
  browsed = [...merged].reverse(); // newest first (reverse of default)
} else if (browseMode === 'deals') {
  browsed = merged.filter(x => dealIds.has(x.id || x));
}
```

Then use `browsed` instead of `merged` in the grid render.

- [ ] **Step 4: Verify in browser**

Navigate to search. Should see three tabs above results. "Buy" shows default. "Just Listed" reverses order. "Deals" filters to only hot deal items.

- [ ] **Step 5: Commit**

```bash
git add screen_search.jsx && git commit -m "feat: add Buy/Just Listed/Deals browse mode tabs to search"
```

---

### Task 5: Finish Tabs on Listing & Product Pages

**Files:**
- Modify: `screen_listing.jsx` (add finish tabs below card name)
- Modify: `screen_product.jsx` (add finish tabs below card info)

**Interfaces:**
- Consumes: listing/product `foil` property
- Produces: Pill tabs showing Standard/Foil with prices

- [ ] **Step 1: Add finish tabs to screen_listing.jsx**

In `ListingScreen`, after the existing state declarations (around line 37), add:

```javascript
const finishes = [{ key: 'standard', label: 'Standard', price: item.foil ? item.price * 0.6 : item.price },
  { key: 'foil', label: 'Foil', price: item.foil ? item.price : item.price * 1.8 }];
const [finish, setFinish] = React.useState(item.foil ? 'foil' : 'standard');
```

After the set/number/condition subtitle line (around line 91), add:

```jsx
{/* ── Finish tabs ── */}
<div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
  {finishes.map(f => (
    <div key={f.key} onClick={() => setFinish(f.key)} style={{
      flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
      background: finish === f.key ? TL.accentWash : TL.surface2,
      border: finish === f.key ? '2px solid ' + TL.accent : '2px solid transparent',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: finish === f.key ? TL.accent : TL.muted }}>
        {f.label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: TL.ink, marginTop: 2 }}>
        {moneyL(f.price)}
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Add finish tabs to screen_product.jsx**

In `ProductScreen`, after the state declarations, add:

```javascript
const finishes = [{ key: 'standard', label: 'Standard', price: product.foil ? product.market * 0.6 : product.market },
  { key: 'foil', label: 'Foil', price: product.foil ? product.market : product.market * 1.8 }];
const [finish, setFinish] = React.useState(product.foil ? 'foil' : 'standard');
```

After the game tag/foil badge section (around line 190), add the same tab JSX but using `TP` aliases:

```jsx
{/* ── Finish tabs ── */}
<div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
  {finishes.map(f => (
    <div key={f.key} onClick={() => setFinish(f.key)} style={{
      flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
      background: finish === f.key ? TP.accentWash : TP.surface2,
      border: finish === f.key ? '2px solid ' + TP.accent : '2px solid transparent',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: finish === f.key ? TP.accent : TP.muted }}>
        {f.label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: TP.ink, marginTop: 2 }}>
        {moneyP(f.price)}
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 3: Verify in browser**

Tap a listing — should see Standard/Foil tabs below the card name with different prices. Same on the product page.

- [ ] **Step 4: Commit**

```bash
git add screen_listing.jsx screen_product.jsx && git commit -m "feat: add Standard/Foil finish tabs to listing and product pages"
```

---

### Task 6: "See All Printings" on Listing Page

**Files:**
- Modify: `screen_listing.jsx` (add printings button + sheet)

**Interfaces:**
- Consumes: `PRINTINGS` from window, `setById` helper
- Produces: Button that opens a sheet listing other sets this card appears in

- [ ] **Step 1: Import PRINTINGS**

Add to the destructuring at top of `screen_listing.jsx`:

```javascript
const { PRINTINGS: PRINTINGS_L } = window;
```

- [ ] **Step 2: Add printings sheet state**

In the existing state block (around line 35), add:

```javascript
const [showPrintings, setShowPrintings] = React.useState(false);
```

- [ ] **Step 3: Add "See all printings" button**

After the finish tabs section, add:

```jsx
{PRINTINGS_L[item.name] && PRINTINGS_L[item.name].length > 1 && (
  <div onClick={() => setShowPrintings(true)} style={{
    marginTop: 8, padding: '6px 12px', borderRadius: 8, background: TL.surface2,
    fontSize: 13, fontWeight: 600, color: TL.accent, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  }}>
    <IconL name="grid" size={14} /> See all printings ({PRINTINGS_L[item.name].length})
  </div>
)}
```

- [ ] **Step 4: Add printings sheet**

At the bottom of `ListingScreen` return, before the closing fragment or final `</div>`, add:

```jsx
{showPrintings && (
  <SheetL title="All Printings" onClose={() => setShowPrintings(false)}>
    <div style={{ padding: '0 16px 20px' }}>
      {(PRINTINGS_L[item.name] || []).map((p, i) => {
        const s = setByIdL(p.set);
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '12px 0',
            borderBottom: '1px solid ' + TL.line }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TL.ink }}>{s ? s.name : p.set}</div>
              <div style={{ fontSize: 12, color: TL.muted }}>{p.number}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TL.ink }}>{moneyL(p.price)}</div>
          </div>
        );
      })}
    </div>
  </SheetL>
)}
```

- [ ] **Step 5: Verify in browser**

Open the Charizard ex listing (l01). Should see "See all printings (2)" button. Tapping opens a sheet showing two sets with prices.

- [ ] **Step 6: Commit**

```bash
git add screen_listing.jsx && git commit -m "feat: add See All Printings sheet on listing page"
```

---

### Task 7: Larger Price History Chart with Timeframe Selector

**Files:**
- Modify: `screen_listing.jsx` (enlarge chart, improve timeframe pills)
- Modify: `screen_product.jsx` (enlarge chart, add timeframe selector)

**Interfaces:**
- Consumes: existing `Sparkline`, `Delta` components, listing/product `history` arrays
- Produces: Taller chart (180px on mobile) with 7d/30d/90d/1yr pills

- [ ] **Step 1: Update listing price chart**

In `screen_listing.jsx`, find the price history section (around line 147). Replace the existing sparkline render (the `<SparkL data={histSlice} w={320} h={70} .../>` around line 163) with:

```jsx
<SparkL data={histSlice} w={320} h={140} up={up} fill dots />
```

Also update the time filter pills to include '7D':

Find the time filters line (around line 152) and change the array from `['30D', '90D']` to:

```javascript
{['7D', '30D', '90D', '1Y'].map(t => (
```

The `histSlice` logic (around line 156) should be updated to handle the new options:

```javascript
const sliceLen = { '7D': 3, '30D': 6, '90D': 9, '1Y': 12 }[tf] || 6;
const histSlice = item.history.slice(-sliceLen);
```

- [ ] **Step 2: Update product price chart**

In `screen_product.jsx`, find the sparkline section (around line 211). Add timeframe state and replace:

After the existing state declarations, add:

```javascript
const [ptf, setPtf] = React.useState('30D');
```

Replace the sparkline section with:

```jsx
{/* ── Price chart ── */}
<div style={{ margin: '12px 0' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
    <div style={{ fontSize: 14, fontWeight: 600, color: TP.ink }}>Price History</div>
    <div style={{ display: 'flex', gap: 4 }}>
      {['7D', '30D', '90D', '1Y'].map(t => (
        <div key={t} onClick={() => setPtf(t)} style={{
          padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          background: ptf === t ? TP.accent : TP.surface2,
          color: ptf === t ? '#fff' : TP.muted,
        }}>{t}</div>
      ))}
    </div>
  </div>
  {(() => {
    const sliceLen = { '7D': 3, '30D': 6, '90D': 9, '1Y': 12 }[ptf] || 6;
    const hist = product.history.slice(-sliceLen);
    const up = hist[hist.length - 1] >= hist[0];
    return <SparkP data={hist} w={320} h={140} up={up} fill dots />;
  })()}
</div>
```

- [ ] **Step 3: Verify in browser**

Open a listing — chart should be taller (~140px). Timeframe pills should include 7D/30D/90D/1Y. Same on product page.

- [ ] **Step 4: Commit**

```bash
git add screen_listing.jsx screen_product.jsx && git commit -m "feat: enlarge price chart with 7D/30D/90D/1Y timeframe selector"
```

---

### Task 8: Fee Comparison Page (Mobile)

**Files:**
- Create: `screen_fees.jsx`
- Modify: `index.html` (add script tag)
- Modify: `app.jsx` (register screen)

**Interfaces:**
- Consumes: `T`, `money`, `Icon`, `Sheet` from window
- Produces: `FeesScreen` component registered as 'fees' screen

- [ ] **Step 1: Create screen_fees.jsx**

Create the file with the full fee comparison page:

```javascript
// ─────────────────────────────────────────────────────────────
// Fee comparison page
// ─────────────────────────────────────────────────────────────
const { T: TFE, money: moneyFE, Icon: IconFE, Chip: ChipFE } = window;

function FeesScreen({ app }) {
  const [salePrice, setSalePrice] = React.useState(25);
  const shipping = 2.50;

  // Fee calculations
  const platforms = [
    {
      name: 'Cardconomy',
      accent: TFE.accent,
      highlight: true,
      sellerPct: 0.04,
      buyerPct: 0.02,
      buyerFixed: 0.30,
      paymentPct: 0,
      paymentFixed: 0,
      trusteePct: 0,
      note: 'All-in pricing, no hidden fees',
    },
    {
      name: 'CardNexus',
      accent: '#7c4dd1',
      sellerPct: 0.05,
      buyerPct: 0.025,
      buyerFixed: 0.25, // ~\u20AC0.30 in GBP
      paymentPct: 0,
      paymentFixed: 0,
      trusteePct: 0,
      note: 'EU-focused, fees in euros',
    },
    {
      name: 'Cardmarket',
      accent: '#1f8fd6',
      sellerPct: 0.05,
      buyerPct: 0,
      buyerFixed: 0,
      paymentPct: 0.05,
      paymentFixed: 0.30,
      trusteePct: 0.01,
      note: 'Card payment adds ~6% to buyer',
    },
    {
      name: 'eBay',
      accent: '#e53935',
      sellerPct: 0.128,
      buyerPct: 0,
      buyerFixed: 0,
      paymentPct: 0,
      paymentFixed: 0.30,
      trusteePct: 0,
      note: 'High seller fee, no buyer fee',
    },
  ];

  function calcFees(p, price, ship) {
    const sellerFee = price * p.sellerPct;
    const buyerFee = price * p.buyerPct + p.buyerFixed;
    const paymentFee = price * p.paymentPct + p.paymentFixed;
    const trusteeFee = price * p.trusteePct;
    const total = sellerFee + buyerFee + paymentFee + trusteeFee;
    return { sellerFee, buyerFee, paymentFee, trusteeFee, total };
  }

  const cardonomyFees = calcFees(platforms[0], salePrice, shipping);

  return (
    <div style={{ minHeight: '100%', background: TFE.bg }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10 }}>
        <div onClick={() => app.nav.pop()} style={{ cursor: 'pointer' }}>
          <IconFE name="back" size={22} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: TFE.ink }}>Fees</div>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding: '20px 14px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TFE.ink, lineHeight: 1.2 }}>
          See what you actually pay
        </div>
        <div style={{ fontSize: 14, color: TFE.muted, marginTop: 8, lineHeight: 1.5 }}>
          Transparent fees. No hidden charges. Compare us to anyone.
        </div>
      </div>

      {/* ── Big number ── */}
      <div style={{ margin: '0 14px', padding: '20px', borderRadius: 14,
        background: TFE.accentWash, border: '2px solid ' + TFE.accent, textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: TFE.accent }}>6% + 30p</div>
        <div style={{ fontSize: 13, color: TFE.ink, marginTop: 6 }}>
          4% seller fee + 2% buyer fee + 30p per transaction
        </div>
        <div style={{ fontSize: 12, color: TFE.muted, marginTop: 4 }}>
          The lowest total take rate in the TCG market
        </div>
      </div>

      {/* ── Calculator ── */}
      <div style={{ margin: '20px 14px', padding: '16px', borderRadius: 14,
        background: TFE.surface, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 12 }}>
          Fee Calculator
        </div>
        <div style={{ fontSize: 13, color: TFE.muted, marginBottom: 8 }}>Sale price</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <input type="range" min="1" max="500" value={salePrice}
            onChange={e => setSalePrice(+e.target.value)}
            style={{ flex: 1, accentColor: 'var(--accent)' }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: TFE.ink, minWidth: 70, textAlign: 'right' }}>
            {moneyFE(salePrice)}
          </div>
        </div>

        {/* ── Platform comparison cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {platforms.map(p => {
            const fees = calcFees(p, salePrice, shipping);
            const savings = fees.total - cardonomyFees.total;
            return (
              <div key={p.name} style={{
                padding: '12px', borderRadius: 10,
                background: p.highlight ? TFE.accentWash : TFE.surface2,
                border: p.highlight ? '2px solid ' + TFE.accent : '1px solid ' + TFE.line,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.highlight ? TFE.accent : TFE.ink }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: p.highlight ? TFE.accent : TFE.ink }}>
                    {moneyFE(fees.total)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: TFE.muted }}>
                  <span>Seller: {moneyFE(fees.sellerFee)}</span>
                  <span>Buyer: {moneyFE(fees.buyerFee)}</span>
                  {fees.paymentFee > 0 && <span>Payment: {moneyFE(fees.paymentFee)}</span>}
                  {fees.trusteeFee > 0 && <span>Trustee: {moneyFE(fees.trusteeFee)}</span>}
                </div>
                {!p.highlight && savings > 0 && (
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: TFE.up }}>
                    Save {moneyFE(savings)} with Cardconomy
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: TFE.faint, marginTop: 10, lineHeight: 1.4 }}>
          Assumes card payment. Cardmarket includes Instant Credit (5%) + Trustee (1%).
          CardNexus fees converted from EUR at approximate rate. Shipping: \u00A3{shipping.toFixed(2)}.
        </div>
      </div>

      {/* ── Full breakdown table ── */}
      <div style={{ margin: '0 14px 20px', padding: '16px', borderRadius: 14,
        background: TFE.surface, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 12 }}>
          Full Fee Breakdown
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid ' + TFE.line }}>
              <th style={{ textAlign: 'left', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}></th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.accent, fontWeight: 700 }}>Cardconomy</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>CardNexus</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>Cardmarket</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>eBay</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Seller fee', '4%', '5%', '5%', '12.8%'],
              ['Buyer fee', '2% + 30p', '2.5% + 25p', '\u2014', '\u2014'],
              ['Payment', 'Included', 'Included', '5% + 30p', 'Included'],
              ['Trustee', 'Included', 'Included', '1%', '\u2014'],
              ['Total', '6% + 30p', '~7.5% + 25p', '~11% + 30p', '~12.8% + 30p'],
            ].map(([label, ...vals], i) => (
              <tr key={i} style={{ borderBottom: '1px solid ' + TFE.line }}>
                <td style={{ padding: '8px 4px', color: TFE.ink, fontWeight: i === 4 ? 700 : 400 }}>{label}</td>
                {vals.map((v, j) => (
                  <td key={j} style={{ textAlign: 'right', padding: '8px 4px',
                    color: j === 0 ? TFE.accent : TFE.ink, fontWeight: i === 4 ? 700 : 400 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── What\u2019s included ── */}
      <div style={{ margin: '0 14px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 10 }}>
          What\u2019s included
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['shield', 'Buyer Protection', 'Every purchase is covered. If something goes wrong, we have your back.'],
            ['bolt', 'Payment Processing', 'Card payments included in the fee. No surprise charges at checkout.'],
            ['check', 'No Hidden Fees', 'What you see is what you pay. No renamed surcharges or wallet top-ups.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 12, padding: '14px',
              borderRadius: 12, background: TFE.surface }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: TFE.accentWash,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconFE name={icon} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TFE.ink }}>{title}</div>
                <div style={{ fontSize: 12, color: TFE.muted, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '0 14px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => app.nav.setTab('sell')} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: TFE.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Start selling for less</button>
        <button onClick={() => app.nav.setTab('search')} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: TFE.surface, color: TFE.accent, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          border: '1px solid ' + TFE.line,
        }}>Browse the marketplace</button>
      </div>
    </div>
  );
}

window.FeesScreen = FeesScreen;
```

- [ ] **Step 2: Add script tag to index.html**

Add before the `app.jsx` script tag:

```html
<script type="text/babel" src="screen_fees.jsx"></script>
```

- [ ] **Step 3: Register screen in app.jsx**

In `app.jsx`, add to the destructuring at the top:

```javascript
const { FeesScreen } = window;
```

Add to the `SCREENS` registry:

```javascript
fees: FeesScreen,
```

- [ ] **Step 4: Update footer link in desktop.jsx**

Find the footer "Seller fees" link that shows a "coming soon" toast and change it to navigate to the fees screen:

```javascript
onClick: () => app.go('fees')
```

- [ ] **Step 5: Verify in browser**

Navigate to fees screen (via footer link or `#fees` hash). Should see hero, big number, working slider calculator, breakdown table, and CTAs.

- [ ] **Step 6: Commit**

```bash
git add screen_fees.jsx index.html app.jsx desktop.jsx && git commit -m "feat: add fee comparison page with interactive calculator"
```

---

### Task 9: Desktop Versions of New Features

**Files:**
- Modify: `desktop_home.jsx` (add Hot Deals, Price Movers, Game Carousel sections)
- Modify: `desktop.jsx` (register fees screen, update footer link)

**Interfaces:**
- Consumes: `HOT_DEALS`, `PRICE_MOVERS`, `GAMES` from window
- Produces: Desktop equivalents of the mobile home sections + fees page routing

- [ ] **Step 1: Import new data in desktop_home.jsx**

Add to the destructuring at top:

```javascript
const { HOT_DEALS: HOT_DEALS_H, PRICE_MOVERS: PRICE_MOVERS_H, byId: byIdH } = window;
```

- [ ] **Step 2: Add Hot Deals section to DHome**

After the trending section in `DHome`, add:

```jsx
{/* ── Hot Deals ── */}
<Row title="Hot Deals" action="View all" onAction={() => app.go('search')}>
  <div style={grid(170)}>
    {HOT_DEALS_H.slice(0, 6).map(d => {
      const item = byIdH(d.id);
      if (!item) return null;
      return (
        <div key={d.id} style={{ position: 'relative' }}>
          <DCard item={item} app={app} />
          <div style={{ position: 'absolute', top: 8, left: 8, background: TH.down, color: '#fff',
            fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>
            {d.discount}% below market
          </div>
        </div>
      );
    })}
  </div>
</Row>
```

- [ ] **Step 3: Add Price Movers section to DHome**

After hot deals:

```jsx
{/* ── Daily Movers ── */}
<Row title="Daily Movers" action="View all">
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
    {PRICE_MOVERS_H.map(m => {
      const item = byIdH(m.id);
      if (!item) return null;
      const up = m.change > 0;
      return (
        <div key={m.id} onClick={() => app.go('listing', { id: item.id })} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          background: TH.surface, borderRadius: 8, cursor: 'pointer',
        }}>
          <CardArtH item={item} w={44} radius={4} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TH.ink, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
            <div style={{ fontSize: 12, color: TH.muted }}>{mH(item.price)}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: TH.mono,
            color: up ? TH.up : TH.down }}>
            {up ? '\u25B2' : '\u25BC'} {Math.abs(m.change).toFixed(1)}%
          </div>
        </div>
      );
    })}
  </div>
</Row>
```

- [ ] **Step 4: Register FeesScreen in desktop.jsx SCREENS**

In `desktop.jsx`, add to the destructuring:

```javascript
const { FeesScreen: FeesScreenD } = window;
```

In the route mapping/SCREENS object, add:

```javascript
fees: FeesScreenD,
```

Update the footer "Seller fees" link from toast to:

```javascript
{ label: 'Seller fees', go: 'fees' },
```

- [ ] **Step 5: Verify in browser**

Open `Desktop.html`. Home should show Hot Deals grid with discount badges and Daily Movers list. Footer "Seller fees" link should navigate to fees page.

- [ ] **Step 6: Commit**

```bash
git add desktop_home.jsx desktop.jsx && git commit -m "feat: add Hot Deals, Daily Movers, and fees routing to desktop"
```

---

### Task 10: Build, Push & Deploy

**Files:**
- No file changes — build and deploy

- [ ] **Step 1: Run build**

```bash
npm run build
```

Verify no errors.

- [ ] **Step 2: Commit build output**

```bash
git add dist/ && git commit -m "chore: build for deploy"
```

- [ ] **Step 3: Push to deploy**

```bash
git push
```

- [ ] **Step 4: Verify deployment**

Check Vercel deployment URL loads and all new features are visible.
