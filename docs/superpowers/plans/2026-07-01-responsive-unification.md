# Responsive Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge mobile and desktop into a single responsive app with one entry point, one router, and responsive screen components.

**Architecture:** Kill `Desktop.html`, `ios-frame.jsx`, and all `desktop_*.jsx` files. Unify into `index.html` + `app.jsx` with a responsive header (top nav on desktop, hamburger on mobile). Each browsing screen adds breakpoint-aware layouts. Non-browsing screens get max-width containers.

**Tech Stack:** React 18 (UMD), in-browser Babel, window-based module sharing, inline styles with CSS media queries for layout shifts.

## Global Constraints

- Theme aliases: each file uses its own suffix. Match existing patterns.
- No apostrophes in single-quoted JS strings — use `\u2019`.
- No hex colors — use `T.*` or `var(--)` (exception: `#fff` for card backgrounds and `rgba()` for overlays).
- Window exports via `Object.assign(window, {...})` at file bottom.
- Build check: run `npm run build 2>&1 | tail -10` after each task.
- Commit and push after each task.
- Breakpoints: mobile `< 760px`, tablet `760-1080px`, desktop `> 1080px`.
- `app.isDesktop` = viewport >= 760px, `app.isWide` = viewport >= 1080px. Both passed to all screens via `app` prop.

---

### Task 1: Strip iOS Frame, Desktop Redirect, and BottomNav — Create Responsive Shell

**Files:**
- Modify: `index.html` (remove desktop redirect script, remove ios-frame.jsx script tag)
- Modify: `app.jsx` (remove IOSDevice import, remove BottomNav, add breakpoint state, build responsive header)
- Modify: `components.jsx` (add Container component, keep BottomNav code but it won't be rendered)

**Interfaces:**
- Produces: `app.isDesktop` (boolean, >= 760px), `app.isWide` (boolean, >= 1080px) — available to all screens via app prop
- Produces: `Container` component on `window` — `Container({ children, width, style })` with max-width centering
- Produces: Responsive header — hamburger on mobile, full nav bar on desktop

- [ ] **Step 1: Remove desktop redirect from `index.html`**

Remove lines 118-131 (the desktop handoff script that redirects to `desktop.html`):

```html
<script>
  // Desktop handoff: on wide screens, use the desktop layout
  (function () {
    var BP = 760;
    function check() {
      if (window.innerWidth >= BP && !/forcemobile/.test(location.search)) {
        location.replace('desktop.html');
      }
    }
    check();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(check, 250); });
  })();
</script>
```

Also remove the ios-frame.jsx script tag (line 139):
```html
<script type="text/babel" src="ios-frame.jsx"></script>
```

- [ ] **Step 2: Add Container component to `components.jsx`**

Before the window exports at the bottom of `components.jsx`, add:

```jsx
function Container({ children, width, style }) {
  return (
    <div style={{
      maxWidth: width || 1280,
      margin: '0 auto',
      padding: '0 16px',
      width: '100%',
      boxSizing: 'border-box',
      ...style,
    }}>{children}</div>
  );
}
```

Add `Container` to the `Object.assign(window, {...})` exports.

- [ ] **Step 3: Rewrite `app.jsx` header and remove BottomNav**

In `app.jsx`:

**a) Remove `IOSDevice` import** (line 4):
```javascript
const { IOSDevice } = window;
```

**b) Add breakpoint state** inside the `App()` function, after existing state declarations:

```javascript
const [vw, setVw] = React.useState(window.innerWidth);
React.useEffect(() => {
  const onResize = () => setVw(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
const isDesktop = vw >= 760;
const isWide = vw >= 1080;
```

**c) Add `isDesktop` and `isWide` to the `app` object** (in the app object construction, alongside `nav`, `watch`, `cart`, etc.):

```javascript
isDesktop,
isWide,
```

**d) Replace the current top bar** (lines 309-323) with a responsive header:

```jsx
      {/* ── Responsive header ── */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: isDesktop ? 64 : 52 }}>
          {/* Left: hamburger (mobile) or logo (desktop) */}
          {!isDesktop && (
            <button onClick={() => setMenuOpen(true)} style={{ color: 'var(--ink)', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {IconA.menu({})}
            </button>
          )}
          <div onClick={() => nav.setTab('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}>
            <LogoA size={isDesktop ? 36 : 30} color="var(--ink)" />
            {isDesktop && <span style={{ fontFamily: 'var(--wordmark)', fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: 'var(--ink)' }}>CARDCONOMY</span>}
          </div>

          {/* Center: search (desktop only) */}
          {isDesktop && (
            <div onClick={() => nav.setTab('search')} style={{
              flex: 1, maxWidth: 480, margin: '0 32px', padding: '9px 16px', borderRadius: 10,
              background: 'var(--bg)', border: '1px solid var(--line)', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {IconA.search({ width: 16, height: 16 })}
              <span>Search cards, sets, sellers\u2026</span>
            </div>
          )}

          {/* Right: nav links (desktop) or cart icon (mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 6 : 0, marginLeft: 'auto' }}>
            {isDesktop && (
              <React.Fragment>
                {[
                  ['Browse', () => nav.setTab('search')],
                  ['Sell', () => nav.setTab('sell')],
                  ['Trade', () => nav.push('trade_browse')],
                ].map(([label, action]) => (
                  <button key={label} onClick={action} style={{
                    padding: '8px 14px', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13,
                    color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer',
                    borderRadius: 8,
                  }}>{label}</button>
                ))}
                <button onClick={() => nav.setTab('watch')} style={{
                  position: 'relative', padding: '8px 14px', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13,
                  color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                }}>
                  Watching
                  {watch.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 15, height: 15, borderRadius: 999,
                    background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', padding: '0 3px' }}>{watch.length}</span>}
                </button>
                <button onClick={() => nav.setTab('profile')} style={{
                  padding: '8px 14px', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13,
                  color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                }}>Account</button>
              </React.Fragment>
            )}
            <button onClick={() => nav.push('cart')} style={{
              position: 'relative', width: 38, height: 38, borderRadius: 999,
              background: isDesktop ? 'none' : 'var(--surface-2)', color: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              border: 'none', cursor: 'pointer',
            }}>
              {IconA.cart({ width: 20, height: 20 })}
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 999,
                  background: 'var(--accent)', color: '#fff', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  boxShadow: '0 0 0 2px var(--surface)' }}>{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>
```

**e) Remove the BottomNav line** (line 350):
```jsx
<BottomNav tab={tab} setTab={nav.setTab} watchCount={watch.length} />
```

**f) Update the floating cart button** position — change `bottom: 66` to `bottom: 24` (no more bottom nav to clear):
```jsx
position: 'fixed', bottom: 24, left: '50%',
```

- [ ] **Step 4: Build and verify**

Run: `npm run build 2>&1 | tail -10`
Expected: Build succeeds.

- [ ] **Step 5: Commit and push**

```bash
git add index.html app.jsx components.jsx
git commit -m "feat: responsive shell — remove iOS frame, desktop redirect, add responsive header"
git push
```

---

### Task 2: Responsive Home Screen

**Files:**
- Modify: `screen_home.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

- [ ] **Step 1: Wrap home content in Container and make grids responsive**

In `screen_home.jsx`, the component currently renders a full-width scrolling div. Key changes:

**a) Add Container import** at the top:
```javascript
const { Container: ContainerH } = window;
```

**b) Wrap the inner content** of the scrolling div in a Container.

**c) Make the Browse by Game tiles** wrap into a grid on desktop. Currently they're a horizontal scroll. Change to: horizontal scroll on mobile, CSS grid on desktop.

Replace the game tiles container with:
```jsx
<div style={app.isDesktop
  ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, padding: '0 14px 4px' }
  : { display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }
}>
```

**d) Make card grids responsive** — for trending and under-£100 carousels, increase card width on desktop or show more items. The simplest approach: let them remain as horizontal scrolls (they look fine on desktop) but increase the visible area.

**e) Make the featured sellers section** a grid on desktop instead of horizontal scroll:
```jsx
<div style={app.isDesktop
  ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }
  : { display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 0 4px', WebkitOverflowScrolling: 'touch' }
}>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit and push**

```bash
git add screen_home.jsx
git commit -m "feat: responsive home screen with grid layouts on desktop"
git push
```

---

### Task 3: Responsive Game Page and Set Page

**Files:**
- Modify: `screen_game.jsx`
- Modify: `screen_set.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

- [ ] **Step 1: Make game page grids responsive**

In `screen_game.jsx`:

**a) Add Container import:**
```javascript
const { Container: ContainerGM } = window;
```

**b) Wrap content in Container.**

**c) Set tiles** — currently horizontal scroll. On desktop, make them a wrapping grid:
```jsx
<div style={app.isDesktop
  ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, padding: '0 14px 4px' }
  : { display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }
}>
```

**d) Card grid** — expand from 2 columns to responsive:
```jsx
gridTemplateColumns: app.isWide ? 'repeat(4, 1fr)' : app.isDesktop ? 'repeat(3, 1fr)' : '1fr 1fr'
```

**e) Top sellers** — grid on desktop instead of horizontal scroll.

- [ ] **Step 2: Make set page grids responsive**

In `screen_set.jsx`:

**a) Add Container import:**
```javascript
const { Container: ContainerSt } = window;
```

**b) Wrap content in Container.**

**c) Card grid** — same responsive column logic:
```jsx
gridTemplateColumns: app.isWide ? 'repeat(4, 1fr)' : app.isDesktop ? 'repeat(3, 1fr)' : '1fr 1fr'
```

- [ ] **Step 3: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 4: Commit and push**

```bash
git add screen_game.jsx screen_set.jsx
git commit -m "feat: responsive game and set pages with adaptive grids"
git push
```

---

### Task 4: Responsive Search with Desktop Sidebar Filters

**Files:**
- Modify: `screen_search.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

This is the most complex responsive change. On mobile, filters open in a Sheet. On desktop, they render as a sticky sidebar.

- [ ] **Step 1: Add Container import and restructure layout**

In `screen_search.jsx`:

**a) Add Container import:**
```javascript
const { Container: ContainerSR } = window;
```

**b) Restructure the main layout.** Currently the component renders search bar, filter bar, and results in a single column. On desktop, wrap the filter + results area in a 2-column flex layout:

After the search bar and filter chips, before the results, add a conditional layout wrapper:

```jsx
{/* Desktop: sidebar + results. Mobile: results only (filters in sheet) */}
{app.isDesktop ? (
  <div style={{ display: 'flex', gap: 24, maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
    {/* Sidebar filters — always visible on desktop */}
    <div style={{ width: 240, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
      {/* Render the same filter content as the Sheet, but inline */}
      {renderFilters()}
    </div>
    {/* Results */}
    <div style={{ flex: 1, minWidth: 0 }}>
      {renderResults()}
    </div>
  </div>
) : (
  <React.Fragment>
    {renderResults()}
  </React.Fragment>
)}
```

**c) Extract filter content into a `renderFilters()` function** — take the content currently inside the `<SheetS>` filter modal (the game chips, set chips, condition chips, price slider, listing type, free shipping toggle, reset button) and extract into a reusable function. Both the Sheet (mobile) and the sidebar (desktop) call the same function.

**d) Extract results into a `renderResults()` function** — the merged array, browse mode, grid/list rendering.

**e) Make the results grid responsive:**
```jsx
gridTemplateColumns: app.isWide ? '1fr 1fr 1fr' : app.isDesktop ? '1fr 1fr 1fr' : cols === 3 ? '1fr 1fr 1fr' : '1fr 1fr'
```

**f) Hide the filter button on desktop** (the "Filters" chip that opens the sheet) — not needed since sidebar is always visible:
```jsx
{!app.isDesktop && (
  <button onClick={() => setSheet('filters')} ...>Filters</button>
)}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit and push**

```bash
git add screen_search.jsx
git commit -m "feat: responsive search with desktop sidebar filters"
git push
```

---

### Task 5: Responsive Listing Page — 3-Column Desktop Layout

**Files:**
- Modify: `screen_listing.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

- [ ] **Step 1: Add Container and restructure for 3-column layout**

In `screen_listing.jsx`:

**a) Add Container import:**
```javascript
const { Container: ContainerL } = window;
```

**b) On desktop (isWide), restructure the content into three columns:**

```
┌──────────────┬─────────────────────┬──────────────┐
│  Card Image  │  Details (scroll)   │  Buy Box     │
│  (sticky)    │  - Breadcrumb       │  (sticky)    │
│              │  - Name/price       │  - Price     │
│              │  - Price history    │  - Add cart  │
│              │  - Seller listings  │  - Make offer│
│              │  - Seller detail    │  - I own this│
│              │  - Trade offers     │              │
│              │  - Printings        │              │
│              │  - Similar          │              │
└──────────────┴─────────────────────┴──────────────┘
```

The approach: wrap the return in a conditional. On mobile (`!app.isWide`), render exactly as-is. On desktop (`app.isWide`), render a 3-column grid where:
- **Left column** (sticky): card image + grade badge
- **Center column** (scrollable): everything else except the buy buttons
- **Right column** (sticky): price display + action buttons (extracted from the current sticky bottom bar)

On mobile, keep the existing layout with sticky bottom bar unchanged.

The key code structure:

```jsx
{app.isWide ? (
  <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 300px', gap: 32, maxWidth: 1280, margin: '0 auto', padding: '24px 16px 40px' }}>
    {/* Left — sticky image */}
    <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
      {/* card image, grade chip, foil badge */}
    </div>
    {/* Center — scrollable details */}
    <div>
      {/* breadcrumb, name, price, price history, seller listings, seller detail, trade offers, printings, similar */}
    </div>
    {/* Right — sticky buy box */}
    <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
      {/* price, add to cart, make offer, I own this buttons */}
    </div>
  </div>
) : (
  /* existing mobile layout unchanged */
)}
```

**c) Hide the sticky bottom bar on desktop** — on wide screens, the buy box is in the right column instead:
```jsx
{!app.isWide && (
  <div style={{ flexShrink: 0, ... }}>
    {/* existing sticky bottom bar */}
  </div>
)}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit and push**

```bash
git add screen_listing.jsx
git commit -m "feat: responsive listing page with 3-column desktop layout"
git push
```

---

### Task 6: Responsive Product Page — 2-Column Desktop Layout

**Files:**
- Modify: `screen_product.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

- [ ] **Step 1: Add Container and restructure for 2-column layout**

Similar pattern to the listing page but 2 columns:

```
┌──────────────┬─────────────────────────────────┐
│  Card Image  │  Details (scroll)               │
│  (sticky)    │  - Breadcrumb                   │
│              │  - Name/subtitle                │
│              │  - Condition pills              │
│              │  - Price + badges               │
│              │  - Seller offers                │
│              │  - Trade offers                 │
│              │  - Demand, variants, history    │
│              │  - Buy buttons                  │
└──────────────┴─────────────────────────────────┘
```

**a) Add Container import:**
```javascript
const { Container: ContainerP } = window;
```

**b) On desktop (isWide), restructure:**

```jsx
{app.isWide ? (
  <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32, maxWidth: 1280, margin: '0 auto', padding: '24px 16px 40px' }}>
    {/* Left — sticky image */}
    <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
      {/* card image */}
    </div>
    {/* Right — all details + buy buttons */}
    <div>
      {/* everything else */}
    </div>
  </div>
) : (
  /* existing mobile layout unchanged */
)}
```

**c) On desktop, move buy buttons from sticky bottom bar into the details column** (inline, not sticky). Hide the sticky bottom bar on desktop:
```jsx
{!app.isWide && (
  <div style={{ flexShrink: 0, ... }}>
    {/* existing sticky bottom bar */}
  </div>
)}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit and push**

```bash
git add screen_product.jsx
git commit -m "feat: responsive product page with 2-column desktop layout"
git push
```

---

### Task 7: Responsive Seller Storefront and Cart

**Files:**
- Modify: `screen_seller.jsx`
- Modify: `screen_cart.jsx`

**Interfaces:**
- Consumes: `app.isDesktop`, `app.isWide` from Task 1

- [ ] **Step 1: Make seller storefront responsive**

In `screen_seller.jsx`:

**a) Add Container import:**
```javascript
const { Container: ContainerSl } = window;
```

**b) Wrap content in Container.**

**c) Expand inventory grid** to 3-4 columns on desktop:
```jsx
gridTemplateColumns: app.isWide ? 'repeat(4, 1fr)' : app.isDesktop ? 'repeat(3, 1fr)' : '1fr 1fr'
```

**d) Make stats row** spread wider on desktop, and policy/review cards use a 2-column grid on desktop.

- [ ] **Step 2: Make cart responsive**

In `screen_cart.jsx`:

**a) Add Container import.**

**b) Wrap content in Container (max-width 1080).**

**c) On desktop, split into 2 columns** — cart items left, order summary right:
```jsx
{app.isDesktop ? (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, padding: '24px 0' }}>
    <div>{/* cart items */}</div>
    <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
      {/* order summary + checkout button */}
    </div>
  </div>
) : (
  /* existing mobile layout */
)}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 4: Commit and push**

```bash
git add screen_seller.jsx screen_cart.jsx
git commit -m "feat: responsive seller storefront and cart"
git push
```

---

### Task 8: Container-Wrap Remaining Screens

**Files:**
- Modify: all remaining `screen_*.jsx` files that aren't yet responsive

**Interfaces:**
- Consumes: `Container` from Task 1

- [ ] **Step 1: Add Container wrapping to non-browsing screens**

For each of these screens, add a Container wrapper around the main content with appropriate max-width:

- `screen_sell.jsx` — max-width 720
- `screen_sellhub.jsx` — max-width 720
- `screen_sellbulk.jsx` — max-width 720
- `screen_sellshop.jsx` — max-width 720
- `screen_trade.jsx` — max-width 1080
- `screen_watchlist.jsx` — max-width 1280
- `screen_account.jsx` — max-width 1080
- `screen_verify.jsx` — max-width 720
- `screen_authcard.jsx` — max-width 720
- `screen_checkout.jsx` — max-width 720
- `screen_onboarding.jsx` — max-width 720
- `screen_scan.jsx` — max-width 720
- `screen_shopfinder.jsx` — max-width 1080
- `screen_storefront.jsx` — max-width 1080
- `screen_shop.jsx` — max-width 1280

For each file:
1. Import Container: `const { Container: ContainerXX } = window;`
2. Wrap the outermost content div's children in `<ContainerXX width={720}>...</ContainerXX>` (or appropriate width)
3. Keep the outer div's `height: '100%'` and `overflow: 'auto'` styling on the outer wrapper, not the Container

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit and push**

```bash
git add screen_sell.jsx screen_sellhub.jsx screen_sellbulk.jsx screen_sellshop.jsx screen_trade.jsx screen_watchlist.jsx screen_account.jsx screen_verify.jsx screen_authcard.jsx screen_checkout.jsx screen_onboarding.jsx screen_scan.jsx screen_shopfinder.jsx screen_storefront.jsx screen_shop.jsx
git commit -m "feat: add max-width containers to all remaining screens"
git push
```

---

### Task 9: Delete Desktop Files and Clean Up

**Files:**
- Delete: `Desktop.html`
- Delete: `desktop.jsx`
- Delete: `desktop_home.jsx`
- Delete: `desktop_search.jsx`
- Delete: `desktop_listing.jsx`
- Delete: `desktop_seller.jsx`
- Delete: `desktop_sell.jsx`
- Delete: `desktop_trade.jsx`
- Delete: `desktop_game.jsx`
- Delete: `ios-frame.jsx`
- Modify: `build.js` (remove Desktop.html processing)

- [ ] **Step 1: Delete all desktop and iOS frame files**

```bash
rm Desktop.html desktop.jsx desktop_home.jsx desktop_search.jsx desktop_listing.jsx desktop_seller.jsx desktop_sell.jsx desktop_trade.jsx desktop_game.jsx ios-frame.jsx
```

- [ ] **Step 2: Update `build.js` to remove Desktop.html processing**

In `build.js`, the `htmlFiles` array (line 42-45) includes Desktop.html. Remove it:

Change:
```javascript
const htmlFiles = [
  { src: 'index.html', out: 'index.html' },
  { src: 'Desktop.html', out: 'desktop.html' },
];
```

To:
```javascript
const htmlFiles = [
  { src: 'index.html', out: 'index.html' },
];
```

- [ ] **Step 3: Build and verify**

Run: `npm run build 2>&1 | tail -10`
Expected: Build succeeds. No errors about missing desktop files.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "chore: delete desktop and iOS frame files, clean up build"
git push
```

---

## Summary

| Task | File(s) | What |
|------|---------|------|
| 1 | `index.html`, `app.jsx`, `components.jsx` | Responsive shell — header, breakpoints, Container |
| 2 | `screen_home.jsx` | Responsive home — grid game tiles, wider carousels |
| 3 | `screen_game.jsx`, `screen_set.jsx` | Responsive game/set — adaptive grids |
| 4 | `screen_search.jsx` | Desktop sidebar filters, responsive results grid |
| 5 | `screen_listing.jsx` | 3-column desktop layout with sticky image + buy box |
| 6 | `screen_product.jsx` | 2-column desktop layout with sticky image |
| 7 | `screen_seller.jsx`, `screen_cart.jsx` | Responsive seller storefront + 2-column cart |
| 8 | All remaining `screen_*.jsx` | Max-width Container wrapping |
| 9 | Desktop files, `ios-frame.jsx`, `build.js` | Delete old files, clean up build |
