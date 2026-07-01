# Buyer Browsing Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a seamless, connected buyer browsing journey from Home through Game, Set, Card, and Seller — fixing dead-ends, adding missing screens, and wiring navigation throughout.

**Architecture:** Flow-first redesign across 8 files (1 new, 7 modified). Each screen connects forward/backward via tappable seller names, set names, and breadcrumbs. No new data structures needed — all data already exists in `data.jsx`.

**Tech Stack:** React 18 (UMD), in-browser Babel, window-based module sharing, inline styles with theme aliases.

## Global Constraints

- **Theme aliases:** Each file uses a unique suffix (e.g. `TGM`, `TS`, `TL`). Match existing patterns. Never use bare `T` except in `screen_home.jsx`.
- **No apostrophes** in single-quoted JS strings — use `\u2019`.
- **No hex colors** — use `T.*` or `var(--)` CSS variables.
- **Window exports:** Every screen component must be exported via `Object.assign(window, { ... })` at file bottom.
- **IIFE wrapping:** `build.js` handles this. Don't add manual IIFE wrappers.
- **Script order matters:** New scripts go before `app.jsx` in `index.html`.
- **Build check:** Run `npm run build 2>&1 | tail -5` after each task to verify compilation.
- **Commit and push** after each task.

---

### Task 1: Create Set Page (`screen_set.jsx`)

**Files:**
- Create: `screen_set.jsx`
- Modify: `index.html:176-177` (add script tag)
- Modify: `app.jsx:6,37-67` (import + register in SCREENS)

**Interfaces:**
- Consumes: `SetScreen({ app, params })` where `params.id` is the set ID (e.g. `'s151'`)
- Consumes from `window`: `T`, `money`, `CardArt`, `Icon`, `setById`, `gameById`, `LISTINGS`, `PRODUCTS`, `SELLERS`, `sellerByName`
- Produces: `window.SetScreen` — the set page component

- [ ] **Step 1: Create `screen_set.jsx` with hero, highlights, and checklist**

```jsx
// ─────────────────────────────────────────────────────────────
// Cardconomy Mobile — Set Detail Page
// ─────────────────────────────────────────────────────────────
const { T: TSt, money: moneySt, CardArt: CardArtSt, Icon: IconSt, GradeChip: GradeChipSt } = window;
const { LISTINGS: LISTINGS_ST, PRODUCTS: PRODUCTS_ST, setById: setByIdSt, gameById: gameByIdSt, SELLERS: SELLERS_ST, sellerByName: sellerByNameSt } = window;

function SetScreen({ app, params }) {
  const set = setByIdSt(params.id);
  if (!set) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 18 }}>Set not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TSt.accent, fontFamily: TSt.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const game = gameByIdSt(set.game);
  const [condFilter, setCondFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('popular');
  const [view, setView] = React.useState('grid');

  // All listings in this set
  let listings = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow');
  if (condFilter === 'graded') listings = listings.filter(l => l.grade && l.grade.company !== 'raw');
  else if (condFilter === 'raw') listings = listings.filter(l => !l.grade || l.grade.company === 'raw');

  // Sort
  if (sortBy === 'popular') listings.sort((a, b) => (b.watchers || 0) - (a.watchers || 0));
  else if (sortBy === 'price_asc') listings.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_desc') listings.sort((a, b) => b.price - a.price);

  // Highlights
  const mostWatched = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow')
    .sort((a, b) => (b.watchers || 0) - (a.watchers || 0)).slice(0, 6);
  const recentlyListed = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow')
    .slice(-6).reverse();

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: TSt.bg, paddingBottom: 96, animation: 'ccPushIn 0.26s ease' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 14px 0' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 34, height: 34, borderRadius: 999, background: TSt.surface,
          color: TSt.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)', flexShrink: 0 }}>
          {IconSt.back({})}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: TSt.sans, color: TSt.muted, overflow: 'hidden' }}>
          <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>\u203A</span>
          {game && <span onClick={() => app.nav.push('game', { id: game.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{game.short}</span>}
          {game && <span>\u203A</span>}
          <span style={{ color: TSt.ink, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{set.name.replace(/\s*\(.*\)/, '')}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: set.hue || 'var(--surface)', margin: '12px 14px 0', borderRadius: 16 }}>
        {set.img && <img src={set.img} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.5,
        }} />}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 16px 16px',
        }}>
          <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 22, color: '#fff',
            letterSpacing: -0.4, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{set.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {set.year} \u00B7 {set.cards} cards in set \u00B7 {listings.length} listed
          </div>
        </div>
      </div>

      {/* ── Most Watched ── */}
      {mostWatched.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink, padding: '0 14px', marginBottom: 10 }}>Most watched</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {mostWatched.map(l => (
              <div key={l.id} onClick={() => {
                const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
              }} style={{
                flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
              }}>
                <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtSt item={l} w={100} radius={6} />
                </div>
                <div style={{ padding: '6px 10px 10px' }}>
                  <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneySt(l.price)}</div>
                  {l.watchers > 0 && <div style={{ fontFamily: TSt.sans, fontSize: 10, color: TSt.muted, marginTop: 2 }}>{l.watchers} watching</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recently Listed ── */}
      {recentlyListed.length > 0 && (
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink, padding: '0 14px', marginBottom: 10 }}>Recently listed</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {recentlyListed.map(l => (
              <div key={l.id} onClick={() => {
                const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
              }} style={{
                flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
              }}>
                <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtSt item={l} w={100} radius={6} />
                </div>
                <div style={{ padding: '6px 10px 10px' }}>
                  <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: TSt.sans, fontSize: 10.5, color: TSt.muted, marginTop: 1 }}>{l.condition}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneySt(l.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Checklist header ── */}
      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink }}>All listings</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setView('grid')} style={{
              width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: view === 'grid' ? 'var(--ink)' : 'var(--surface)', color: view === 'grid' ? '#fff' : 'var(--muted)',
              border: view === 'grid' ? 'none' : '1px solid var(--line)',
            }}>{IconSt.grid({ width: 14, height: 14 })}</button>
            <button onClick={() => setView('list')} style={{
              width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: view === 'list' ? 'var(--ink)' : 'var(--surface)', color: view === 'list' ? '#fff' : 'var(--muted)',
              border: view === 'list' ? 'none' : '1px solid var(--line)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Condition filter + sort */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['raw', 'Raw'], ['graded', 'Graded']].map(([k, l]) => {
            const on = condFilter === k;
            return (
              <button key={k} onClick={() => setCondFilter(k)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                background: on ? 'var(--ink)' : 'var(--surface)',
                color: on ? '#fff' : 'var(--ink)',
                border: on ? 'none' : '1px solid var(--line)',
              }}>{l}</button>
            );
          })}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            marginLeft: 'auto', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
            fontFamily: TSt.sans,
          }}>
            <option value="popular">Popular</option>
            <option value="price_asc">Price: low \u2192 high</option>
            <option value="price_desc">Price: high \u2192 low</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: TSt.muted, fontWeight: 600, marginBottom: 12 }}>
          Showing {listings.length} of {set.cards} cards
        </div>
      </div>

      {/* ── Grid / List ── */}
      <div style={{ padding: '0 14px' }}>
        {listings.length > 0 ? (
          view === 'grid' ? (
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {listings.map(l => (
                <div key={l.id} onClick={() => {
                  const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                  app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
                }} style={{
                  borderRadius: 12, overflow: 'hidden', background: '#fff',
                  border: '1px solid var(--line)', cursor: 'pointer',
                }}>
                  <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                    <CardArtSt item={l} w={120} radius={6} />
                    {l.grade && l.grade.company !== 'raw' && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
                        fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 999 }}>
                        {l.grade.company.toUpperCase()} {l.grade.grade}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '8px 12px 12px' }}>
                    <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.subtitle || l.condition}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, marginTop: 6 }}>{moneySt(l.price)}</div>
                    {l.seller && (
                      <div onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: l.seller }); }}
                        style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, cursor: 'pointer' }}>
                        {l.seller}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {listings.map(l => (
                <button key={l.id} onClick={() => {
                  const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                  app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
                }} style={{
                  width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12,
                  padding: 10, display: 'flex', gap: 12, alignItems: 'center',
                  border: '1px solid var(--line)',
                }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 6, flexShrink: 0 }}>
                    <CardArtSt item={l} w={54} radius={4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontFamily: TSt.sans, fontSize: 11, color: TSt.muted, marginTop: 1 }}>{l.condition}{l.foil ? ' \u00B7 Foil' : ''}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14, marginTop: 3 }}>{moneySt(l.price)}</div>
                  </div>
                  {l.grade && l.grade.company !== 'raw' && <GradeChipSt grade={l.grade} />}
                </button>
              ))}
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No cards listed yet</div>
            <div style={{ fontSize: 12, color: TSt.muted, marginTop: 4 }}>Be the first to sell a card from this set</div>
            <button onClick={() => app.nav.setTab('sell')}
              style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: TSt.accent }}>Start selling</button>
          </div>
        )}
      </div>

    </div>
  );
}

Object.assign(window, { SetScreen });
```

- [ ] **Step 2: Add script tag to `index.html`**

In `index.html`, after line 176 (`screen_game.jsx`), add:

```html
<script type="text/babel" src="screen_set.jsx"></script>
```

- [ ] **Step 3: Register SetScreen in `app.jsx`**

Add the window import near line 15 (after `GameScreen`):

```javascript
const { SetScreen } = window;
```

Add to the SCREENS map (after line 65 `game: GameScreen,`):

```javascript
set: SetScreen,
```

- [ ] **Step 4: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 5: Commit and push**

```bash
git add screen_set.jsx index.html app.jsx
git commit -m "feat: add set detail page with hero, highlights, and checklist"
git push
```

---

### Task 2: Upgrade Game Page (`screen_game.jsx`)

**Files:**
- Modify: `screen_game.jsx` (full file, ~191 lines)

**Interfaces:**
- Consumes: `SetScreen` (from Task 1) — navigates to it via `app.nav.push('set', { id: s.id })`
- Consumes from `window`: `SELLERS`, `sellerByName`, `listingsBySeller`, `SHOPS`
- Produces: Updated `GameScreen` with breadcrumbs, new release spotlight, most watched, community section

- [ ] **Step 1: Add new window imports**

At line 5, after the existing data imports, add:

```javascript
const { SELLERS: SELLERS_GM, sellerByName: sellerByNameGM, listingsBySeller: listingsBySellerGM, SHOPS: SHOPS_GM } = window;
```

- [ ] **Step 2: Remove stats from hero**

Replace lines 70-78 (the stats + closing divs in the hero) — remove the stats `<div>` that shows Listed/Graded counts. Keep the logo and description, close the hero cleanly.

Remove this block:
```jsx
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {[['Listed', stats.total], ['Graded', stats.graded]].map(([k, v]) => (
              <div key={k} style={{ color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ fontFamily: TGM.mono || 'var(--mono)', fontWeight: 700, fontSize: 17 }}>{v}</span>
                <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 4, fontWeight: 600 }}>{k}</span>
              </div>
            ))}
          </div>
```

And remove the `stats` computation (lines 38-41):
```javascript
  const stats = {
    total: listings.length,
    graded: LISTSGM.filter(l => l.game === game.id && l.grade && l.grade.company !== 'raw').length,
  };
```

- [ ] **Step 3: Add breadcrumb above hero**

Insert after line 44 (the opening `<div>` of the component return), before the hero:

```jsx
      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 14px 0' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface)',
          color: TGM.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)', flexShrink: 0 }}>
          {IconGM.back({})}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: TGM.sans || 'var(--sans)', color: TGM.muted || 'var(--muted)' }}>
          <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>{'\u203A'}</span>
          <span style={{ color: TGM.ink, fontWeight: 700 }}>{game.name}</span>
        </div>
      </div>
```

- [ ] **Step 4: Add new release spotlight after sets**

After the "Browse by set" section (after the closing `</div>` at approximately line 122), add:

```jsx
      {/* ── New Release Spotlight ── */}
      {(() => {
        const newest = sets.reduce((a, b) => (b.year || 0) > (a.year || 0) ? b : a, sets[0]);
        if (!newest) return null;
        return (
          <div style={{ padding: '16px 14px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, marginBottom: 10 }}>New release</div>
            <button onClick={() => app.nav.push('set', { id: newest.id })} style={{
              width: '100%', position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden',
              background: newest.hue || 'var(--surface)', textAlign: 'left',
            }}>
              {newest.img && <img src={newest.img} alt="" style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.4,
              }} />}
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
              }} />
              <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '16px 18px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{newest.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{newest.year} \u00B7 {newest.cards} cards \u00B7 Explore set \u2192</div>
              </div>
            </button>
          </div>
        );
      })()}
```

- [ ] **Step 5: Change set tiles to navigate to set page**

In the set tile `<button>` `onClick` handler (around line 99), change from:

```jsx
onClick={() => setSetFilter(active ? 'all' : s.id)}
```

to:

```jsx
onClick={() => app.nav.push('set', { id: s.id })}
```

Remove the `active` variable and the active border styling since tiles no longer toggle — they always navigate. Change:

```jsx
const active = setFilter === s.id;
```

to just remove it and update the border style:

```jsx
border: '1px solid transparent',
```

- [ ] **Step 6: Add Most Watched section**

After the new release spotlight, add:

```jsx
      {/* ── Most Watched ── */}
      {(() => {
        const watched = LISTSGM.filter(l => l.game === game.id && l.type === 'buynow' && (l.watchers || 0) > 0)
          .sort((a, b) => (b.watchers || 0) - (a.watchers || 0)).slice(0, 6);
        if (watched.length === 0) return null;
        return (
          <div style={{ paddingTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, padding: '0 14px', marginBottom: 10 }}>Most watched</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
              WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
              {watched.map(l => (
                <div key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} style={{
                  flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                  borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
                }}>
                  <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                    <CardArtGM item={l} w={100} radius={6} />
                  </div>
                  <div style={{ padding: '6px 10px 10px' }}>
                    <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{mGM(l.price)}</div>
                    {l.watchers > 0 && <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontSize: 10, color: TGM.muted || 'var(--muted)', marginTop: 2 }}>{l.watchers} watching</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
```

- [ ] **Step 7: Add Community section before the grid**

Before the condition filter section, add:

```jsx
      {/* ── Community: Top Sellers ── */}
      {(() => {
        // Find sellers with most listings in this game
        const sellerCounts = {};
        LISTSGM.filter(l => l.game === game.id).forEach(l => {
          if (l.seller) sellerCounts[l.seller] = (sellerCounts[l.seller] || 0) + 1;
        });
        const topSellers = Object.entries(sellerCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, count]) => {
            const s = sellerByNameGM(name);
            return s ? { ...s, count } : { name, count, rating: 0, sales: 0, loc: '' };
          });
        if (topSellers.length === 0) return null;
        return (
          <div style={{ padding: '20px 14px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, marginBottom: 10 }}>Top sellers</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 0 4px',
              WebkitOverflowScrolling: 'touch' }}>
              {topSellers.map(s => (
                <button key={s.name} onClick={() => app.nav.push('seller', { name: s.name })} style={{
                  flexShrink: 0, width: 150, background: 'var(--surface)', borderRadius: 12,
                  padding: '14px 12px', textAlign: 'center', border: '1px solid var(--line)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--fill)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16, margin: '0 auto 8px' }}>{s.name.charAt(0)}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: TGM.muted || 'var(--muted)', marginTop: 2 }}>{s.rating}% \u00B7 {s.count} listed</div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}
```

- [ ] **Step 8: Remove set filter state since tiles now navigate**

Remove the `setFilter` state and all references to it since set tiles now navigate to the set page. Remove:

```javascript
const [setFilter, setSetFilter] = React.useState(params.set || 'all');
```

And remove the set filtering logic from the listings computation:

```javascript
if (setFilter !== 'all') listings = listings.filter(l => l.set === setFilter);
```

Remove the "All sets" button in the set carousel since it no longer toggles anything — just show the set tiles.

- [ ] **Step 9: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 10: Commit and push**

```bash
git add screen_game.jsx
git commit -m "feat: upgrade game page with breadcrumbs, spotlight, most watched, and community section"
git push
```

---

### Task 3: Product Page — Wire Condition Filters + Navigation Links

**Files:**
- Modify: `screen_product.jsx`

**Interfaces:**
- Consumes: `SetScreen` (from Task 1) via `app.nav.push('set', ...)`
- Produces: Working condition filter pills, tappable seller/set names, breadcrumbs

- [ ] **Step 1: Add breadcrumb at top of product page**

Read `screen_product.jsx` to find the exact insertion point (after the back button, before the card image). Add breadcrumb with tappable Home > Game > Set > Card Name, using `gameByIdP` and `setByIdP` which are already available.

Insert after the back button (around line 158-159), a breadcrumb row:

```jsx
        {/* ── Breadcrumb ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 16px 8px',
          fontSize: 12, fontFamily: TP.sans, color: 'var(--muted)' }}>
          <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>{'\u203A'}</span>
          {g && <span onClick={() => app.nav.push('game', { id: g.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{g.short}</span>}
          {g && <span>{'\u203A'}</span>}
          {s && <span onClick={() => app.nav.push('set', { id: s.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{s.name.replace(/\s*\(.*\)/, '')}</span>}
          {s && <span>{'\u203A'}</span>}
          <span style={{ color: 'var(--ink)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
        </div>
```

- [ ] **Step 2: Make set name tappable in subtitle**

At line 169, the set name is rendered inline. Wrap just the set name in a tappable `<span>`:

Change:
```jsx
{product.subtitle}{s ? ' \u00B7 ' + s.name : ''}{product.number ? ' \u00B7 ' + product.number : ''}
```

To:
```jsx
{product.subtitle}
{s && <span>{' \u00B7 '}<span onClick={() => app.nav.push('set', { id: s.id })} style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--line)' }}>{s.name}</span></span>}
{product.number ? ' \u00B7 ' + product.number : ''}
```

- [ ] **Step 3: Wire condition filter pills**

Add state for the active condition filter. Near the top of the component (after the existing state), add:

```jsx
const [condFilter, setCondFilter] = React.useState('All');
```

Replace the static pills (lines 174-183) with functional ones:

```jsx
        {/* ── 3. Condition filter pills ── */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {['All', 'NM', 'LP', 'MP', 'HP', 'PSA 10', 'PSA 9', 'BGS'].map(c => {
            const active = condFilter === c;
            return (
              <button key={c} onClick={() => setCondFilter(c)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                background: active ? 'var(--ink)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--ink)',
                border: active ? 'none' : '1px solid var(--line)',
              }}>{c}</button>
            );
          })}
        </div>
```

Then filter the offers list based on `condFilter`. Before the offers map (around line 201), add filtering:

```jsx
const filteredOffers = condFilter === 'All' ? product.offers : product.offers.filter(o => {
  if (condFilter === 'NM') return o.condition === 'Near Mint' || o.condition === 'Mint' || o.condition === 'Gem Mint';
  if (condFilter === 'LP') return o.condition === 'Lightly Played';
  if (condFilter === 'MP') return o.condition === 'Moderately Played';
  if (condFilter === 'HP') return o.condition === 'Heavily Played';
  if (condFilter === 'PSA 10') return o.grade && o.grade.company === 'psa' && o.grade.grade === 10;
  if (condFilter === 'PSA 9') return o.grade && o.grade.company === 'psa' && o.grade.grade === 9;
  if (condFilter === 'BGS') return o.grade && o.grade.company === 'bgs';
  return true;
});
```

Replace `product.offers.map(...)` with `filteredOffers.map(...)` in the render.

- [ ] **Step 4: Make seller names tappable in offer cards**

In the OfferCard component or in the offers list rendering, find where `o.seller` is rendered and wrap it in a tappable span. The seller name in each offer row should have:

```jsx
<span onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: o.seller }); }}
  style={{ cursor: 'pointer' }}>{o.seller}</span>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 6: Commit and push**

```bash
git add screen_product.jsx
git commit -m "feat: wire product page condition filters, breadcrumbs, and tappable links"
git push
```

---

### Task 4: Listing Page — Breadcrumbs, Tappable Links, Other Printings

**Files:**
- Modify: `screen_listing.jsx`

**Interfaces:**
- Consumes: `SetScreen` (Task 1), `PRINTINGS` from `window`
- Produces: Breadcrumbs, tappable set/seller names, "Other printings" section

- [ ] **Step 1: Add PRINTINGS to window imports**

At the top of `screen_listing.jsx` (lines 5-9), add `PRINTINGS` to the data imports:

```javascript
const { PRINTINGS: PRINTINGS_L } = window;
```

- [ ] **Step 2: Add breadcrumb below header**

After the back/share/watch button row and before the card art, insert a breadcrumb. Find the appropriate insertion point (after the top action buttons area) and add:

```jsx
          {/* ── Breadcrumb ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 0 8px',
            fontSize: 12, fontFamily: TL.sans, color: 'var(--muted)', overflow: 'hidden' }}>
            <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
            <span>{'\u203A'}</span>
            {g && <span onClick={() => app.nav.push('game', { id: g.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{g.short}</span>}
            {g && <span>{'\u203A'}</span>}
            {set && <span onClick={() => app.nav.push('set', { id: set.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{set.name.replace(/\s*\(.*\)/, '')}</span>}
          </div>
```

- [ ] **Step 3: Make set name tappable in subtitle**

At line 97, change the set name from plain text to a tappable span:

Change:
```jsx
{set ? set.name : ''}
```

To:
```jsx
{set && <span onClick={() => app.nav.push('set', { id: set.id })} style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--line-2)' }}>{set.name}</span>}
```

- [ ] **Step 4: Make seller name in listings section tappable**

At line 161, wrap the seller name in the current seller row:

Change:
```jsx
<span style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{item.seller}</span>
```

To:
```jsx
<span onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: item.seller }); }}
  style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)', cursor: 'pointer' }}>{item.seller}</span>
```

Do the same for other seller names at line 183:
```jsx
<span onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: o.seller }); }}
  style={{ fontFamily: TL.sans, fontWeight: 500, fontSize: 13, color: 'var(--ink)', cursor: 'pointer' }}>{o.seller}</span>
```

And the seller detail row at line 217:
```jsx
<span onClick={() => app.nav.push('seller', { name: item.seller })}
  style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', cursor: 'pointer' }}>{item.seller}</span>
```

- [ ] **Step 5: Add "Other printings" section**

Before the "Similar listings" section (line 249), add:

```jsx
        {/* ═══ 5b. OTHER PRINTINGS ═══ */}
        {PRINTINGS_L && PRINTINGS_L[item.name] && PRINTINGS_L[item.name].length > 1 && (
          <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 6, padding: '12px 16px 0' }}>
            <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 10 }}>Other printings</div>
            <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', margin: '0 -16px', padding: '0 16px' }}>
              {PRINTINGS_L[item.name].filter(p => p.set !== item.set || p.number !== item.number).map((p, idx) => {
                const pSet = window.setById(p.set);
                const pListing = LISTINGS_L.find(l => l.name === item.name && l.set === p.set);
                return (
                  <button key={idx} onClick={() => {
                    if (pListing) app.nav.push('listing', { id: pListing.id });
                    else if (pSet) app.nav.push('set', { id: pSet.id });
                  }} style={{ flexShrink: 0, width: 120, textAlign: 'left' }}>
                    <div style={{ background: pSet ? (pSet.hue || 'var(--surface)') : 'var(--surface)', borderRadius: 10, padding: '10px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 60, justifyContent: 'center' }}>
                      {pListing
                        ? <CardArtL item={pListing} w={70} />
                        : <div style={{ fontFamily: TL.sans, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>No listing</div>
                      }
                    </div>
                    <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 11, color: 'var(--ink)', marginTop: 6,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pSet ? pSet.name : p.set}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 12, color: 'var(--ink)', marginTop: 1 }}>{moneyL(p.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
```

- [ ] **Step 6: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 7: Commit and push**

```bash
git add screen_listing.jsx
git commit -m "feat: add listing page breadcrumbs, tappable links, and other printings section"
git push
```

---

### Task 5: Upgrade Seller Storefront (`screen_seller.jsx`)

**Files:**
- Modify: `screen_seller.jsx` (full rewrite of listings tab)

**Interfaces:**
- Consumes: `GAMES` from `window` for game filter tabs
- Produces: Full storefront with game-filtered inventory grid and sort

- [ ] **Step 1: Add GAMES import and game filter state**

At line 5, add:
```javascript
const { GAMES: GAMES_S } = window;
```

Inside the component function (after line 9 `const [tab, setTab] = ...`), add:

```javascript
const [gameFilter, setGameFilter] = React.useState('all');
const [sortBy, setSortBy] = React.useState('popular');
```

- [ ] **Step 2: Replace the listings tab content with game-filtered inventory**

Replace the listings tab content (lines 106-127) with:

```jsx
        {tab === 'listings' && (
          <div style={{ padding: 16 }}>
            {/* Game filter tabs */}
            {(() => {
              const gameCounts = {};
              listings.forEach(l => {
                if (l.game) gameCounts[l.game] = (gameCounts[l.game] || 0) + 1;
              });
              const gameIds = Object.keys(gameCounts);
              if (gameIds.length <= 1) return null;
              return (
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 2 }}>
                  <button onClick={() => setGameFilter('all')} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, flexShrink: 0,
                    background: gameFilter === 'all' ? 'var(--ink)' : 'var(--surface)',
                    color: gameFilter === 'all' ? '#fff' : 'var(--ink)',
                    border: gameFilter === 'all' ? 'none' : '1px solid var(--line)',
                  }}>All ({listings.length})</button>
                  {gameIds.map(gid => {
                    const gm = gameByIdS(gid);
                    const active = gameFilter === gid;
                    return (
                      <button key={gid} onClick={() => setGameFilter(active ? 'all' : gid)} style={{
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, flexShrink: 0,
                        background: active ? 'var(--ink)' : 'var(--surface)',
                        color: active ? '#fff' : 'var(--ink)',
                        border: active ? 'none' : '1px solid var(--line)',
                      }}>{gm ? gm.short : gid} ({gameCounts[gid]})</button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Sort */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
                fontFamily: TS.sans,
              }}>
                <option value="popular">Popular</option>
                <option value="price_asc">Price: low \u2192 high</option>
                <option value="price_desc">Price: high \u2192 low</option>
              </select>
            </div>

            {/* Grid */}
            {(() => {
              let filtered = gameFilter === 'all' ? listings : listings.filter(l => l.game === gameFilter);
              if (sortBy === 'popular') filtered = [...filtered].sort((a, b) => (b.watchers || 0) - (a.watchers || 0));
              else if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
              else if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                  {filtered.map(l => (
                    <button key={l.id} onClick={() => { const prod = window.PRODUCTS.find(p => p.offers.some(o => o.listingId === l.id)); app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id }); }}
                      style={{ textAlign: 'left', background: TS.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div style={{ padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}>
                        <CardArtS item={l} w={86} />
                      </div>
                      <div style={{ padding: '8px 11px 11px' }}>
                        <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                        <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{l.condition}{l.foil ? ' \u00B7 Foil' : ''}</div>
                        <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginTop: 3 }}>{moneyS(l.price)}</div>
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
                      No listings in this category
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
```

- [ ] **Step 3: Add free shipping callout to the header area**

After the trusted/fast shipper badges (line 48), add inside the branded header:

```jsx
            {seller.freeShipMin && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                Free shipping over {'\u00A3'}{seller.freeShipMin}
              </div>
            )}
```

- [ ] **Step 4: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 5: Commit and push**

```bash
git add screen_seller.jsx
git commit -m "feat: upgrade seller storefront with game filters, sort, and inventory grid"
git push
```

---

### Task 6: Home Feed — Featured Sellers + Tappable Seller Names

**Files:**
- Modify: `screen_home.jsx`

**Interfaces:**
- Consumes: `SELLERS` from `window`
- Produces: Featured sellers section, tappable seller names on trending cards

- [ ] **Step 1: Add SELLERS import**

At the top of `screen_home.jsx`, find the existing data imports and add:

```javascript
const { SELLERS: SELLERS_H } = window;
```

- [ ] **Step 2: Add seller name to trending product cards**

In the trending carousel (around line 549-551), after the price line, add a tappable seller link. The product cards show `p.offers[0].seller` if available:

After line 550 (`{p.offerCount > 1 && ...}`), add:

```jsx
                {p.offers && p.offers[0] && p.offers[0].seller && (
                  <div onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: p.offers[0].seller }); }}
                    style={{ fontFamily: T.sans, fontSize: 10, color: T.muted, marginTop: 2, cursor: 'pointer' }}>
                    {p.offers[0].seller}
                  </div>
                )}
```

- [ ] **Step 3: Add Featured Sellers section**

After the "Under £100" carousel section and before the "Start selling" section (around line 585), add:

```jsx
      {/* ── Featured Sellers ── */}
      {SELLERS_H && SELLERS_H.length > 0 && (
        <div style={{ padding: '24px 14px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Featured sellers</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 0 4px',
            WebkitOverflowScrolling: 'touch' }}>
            {SELLERS_H.slice(0, 4).map(s => (
              <button key={s.name} onClick={() => app.nav.push('seller', { name: s.name })} style={{
                flexShrink: 0, width: 160, background: '#fff', borderRadius: 12,
                padding: '16px 14px', textAlign: 'center', border: '1px solid var(--line)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--fill)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 18, margin: '0 auto 10px' }}>{s.name.charAt(0)}</div>
                <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginTop: 3 }}>{s.rating}% \u00B7 {s.loc}</div>
                <div style={{ fontFamily: T.sans, fontSize: 10, color: T.muted, marginTop: 1 }}>{s.sales.toLocaleString()} sales</div>
              </button>
            ))}
          </div>
        </div>
      )}
```

- [ ] **Step 4: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 5: Commit and push**

```bash
git add screen_home.jsx
git commit -m "feat: add featured sellers section and tappable seller names on home feed"
git push
```

---

### Task 7: Search Results — Tappable Seller/Set Names

**Files:**
- Modify: `screen_home.jsx` (where `ListCard` and `ProductCard` components are defined)

**Interfaces:**
- Consumes: `setById` from `window` (already available)
- Produces: Tappable seller names on list cards and product cards used in search results

Note: `ListCard`, `ProductCard`, and `ListRow` are defined in `screen_home.jsx` and shared via `window` — used by `screen_search.jsx`.

- [ ] **Step 1: Add seller name to ListCard**

In the `ListCard` component (around line 118-124), after the shipping line, add a seller name row:

```jsx
        {item.seller && (
          <div onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: item.seller }); }}
            style={{ fontFamily: T.sans, fontSize: 10.5, color: T.muted, marginTop: 3, cursor: 'pointer',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.seller}
          </div>
        )}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 3: Commit and push**

```bash
git add screen_home.jsx
git commit -m "feat: add tappable seller names to search result cards"
git push
```

---

### Task 8: Cart Toast — "Keep Browsing" Action

**Files:**
- Modify: `app.jsx:213-236` (addToCart function)

**Interfaces:**
- Consumes: Existing `showToast` API with `{ title, subtitle, action, onAction }` shape
- Produces: Updated cart toast with "Keep browsing" behaviour — always shows rich toast, integrates free shipping upsell into subtitle

- [ ] **Step 1: Update addToCart toast logic**

Replace the addToCart function body (lines 213-236) with:

```javascript
    addToCart: (id) => setCart(c => {
      if (c.includes(id)) { showToast('Already in cart'); return c; }
      const newCart = [...c, id];
      const item = byIdA(id);
      const seller = item && sellerByNameA(item.seller);
      let subtitle = item ? item.name : '';
      // Check for free shipping upsell
      if (seller && seller.freeShipMin) {
        const sellerItems = newCart.map(byIdA).filter(Boolean).filter(x => x.seller === seller.name);
        const sellerTotal = sellerItems.reduce((s, x) => s + x.price, 0);
        const remaining = seller.freeShipMin - sellerTotal;
        if (remaining > 0) {
          subtitle = 'Add \u00A3' + remaining.toFixed(2) + ' more from ' + seller.name + ' for free shipping';
        }
      }
      showToast({
        title: 'Added to cart \u2713',
        subtitle: subtitle,
        action: 'View cart',
        onAction: () => nav.push('cart'),
      });
      return newCart;
    }),
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 3: Commit and push**

```bash
git add app.jsx
git commit -m "feat: update cart toast with view-cart action and free shipping upsell"
git push
```

---

## Summary

| Task | File(s) | What |
|------|---------|------|
| 1 | `screen_set.jsx` (new), `index.html`, `app.jsx` | Set detail page with hero, highlights, checklist |
| 2 | `screen_game.jsx` | Breadcrumbs, new release spotlight, most watched, community sellers, set tiles navigate |
| 3 | `screen_product.jsx` | Wire condition filters, breadcrumbs, tappable seller/set names |
| 4 | `screen_listing.jsx` | Breadcrumbs, tappable links, other printings section |
| 5 | `screen_seller.jsx` | Game filter tabs, sort, full inventory grid |
| 6 | `screen_home.jsx` | Featured sellers section, tappable seller names on trending |
| 7 | `screen_home.jsx` | Tappable seller names on search result cards |
| 8 | `app.jsx` | Cart toast with "View cart" action + free shipping upsell |
