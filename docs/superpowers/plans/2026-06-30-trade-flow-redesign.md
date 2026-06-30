# Trade Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 7-phase trade system with a card-focused trade marketplace: collection toggle to mark cards tradeable, distance-filtered browse screen, lean proposal flow, and meetup arrangement only after mutual acceptance.

**Architecture:** The trade system becomes three new screens (`trade_browse`, `trade_propose`, `trade_meetup`) replacing the current monolithic `TradeScreen`. Tradeable card state lives in `app.jsx` alongside collections. Mock data for other traders' tradeable cards is added to `data.jsx`.

**Tech Stack:** React 18 (in-browser Babel), inline styles, localStorage persistence, no build step.

## Global Constraints

- Per-file theme aliases (e.g. `TT`, `TL`). Read each file's existing aliases before editing.
- No apostrophes in single-quoted JS strings — use `\u2019` or avoid contractions.
- All state is client-side (localStorage). No API calls.
- `window` globals for cross-file component/data sharing.
- No test framework in this project — verification is visual (run dev server, check screens).
- Commit after each task. Push after each commit.

---

### Task 1: Add Mock Trade Listings Data + Tradeable State

**Files:**
- Modify: `data.jsx` — add `TRADE_LISTINGS` array and export it
- Modify: `app.jsx` — add `tradeable` state (array of card IDs), persist to localStorage, expose on `app` object

**Produces:**
- `window.TRADE_LISTINGS` — array of `{ id, cardId, trader, dist }` objects linking a card to a trader
- `app.tradeable` — string[] of card IDs marked open to trade
- `app.isOpenToTrade(cardId)` — returns boolean
- `app.toggleTradeable(cardId)` — toggles card in/out of tradeable list

- [ ] **Step 1: Add TRADE_LISTINGS to data.jsx**

Find the end of the `TRADE_POSTS` array in `data.jsx` (after line ~3004) and add the new data. This represents cards other users have marked as open to trade.

```javascript
const TRADE_LISTINGS = [
  { id: 'tl01', cardId: 'l01', trader: 't1', dist: 1.9 },
  { id: 'tl02', cardId: 'l06', trader: 't1', dist: 1.9 },
  { id: 'tl03', cardId: 'l19', trader: 't1', dist: 1.9 },
  { id: 'tl04', cardId: 'l12', trader: 't2', dist: 5.6 },
  { id: 'tl05', cardId: 'l11', trader: 't2', dist: 5.6 },
  { id: 'tl06', cardId: 'l04', trader: 't2', dist: 5.6 },
  { id: 'tl07', cardId: 'l08', trader: 't3', dist: 1.0 },
  { id: 'tl08', cardId: 'l10', trader: 't3', dist: 1.0 },
  { id: 'tl09', cardId: 'l23', trader: 't3', dist: 1.0 },
  { id: 'tl10', cardId: 'l05', trader: 't1', dist: 1.9 },
  { id: 'tl11', cardId: 'l07', trader: 't2', dist: 5.6 },
  { id: 'tl12', cardId: 'l24', trader: 't3', dist: 1.0 },
  { id: 'tl13', cardId: 'l26', trader: 't1', dist: 1.9 },
  { id: 'tl14', cardId: 'l33', trader: 't2', dist: 5.6 },
  { id: 'tl15', cardId: 'l09', trader: 't3', dist: 1.0 },
  { id: 'tl16', cardId: 'l28', trader: 't1', dist: 1.9 },
];
```

Then add `TRADE_LISTINGS` to the existing `Object.assign(window, { ... })` call at the end of `data.jsx`.

- [ ] **Step 2: Add tradeable state to app.jsx**

In `app.jsx`, add state after the `collections` state line (~97):

```javascript
const [tradeable, setTradeable] = React.useState(() => loadJSON('cc_tradeable', []));
```

Add localStorage persistence after the existing `useEffect` for collections (~141):

```javascript
React.useEffect(() => { localStorage.setItem('cc_tradeable', JSON.stringify(tradeable)); }, [tradeable]);
```

Add to the `app` object (after `removeCardFromCollection`, ~216):

```javascript
// tradeable cards
tradeable,
isOpenToTrade: (cardId) => tradeable.includes(cardId),
toggleTradeable: (cardId) => setTradeable(t => {
  if (t.includes(cardId)) { showToast('Removed from trade'); return t.filter(x => x !== cardId); }
  showToast('Open to trade'); return [...t, cardId];
}),
```

- [ ] **Step 3: Verify and commit**

Run the dev server, open browser console, confirm `window.TRADE_LISTINGS` is defined and `app` object has `tradeable` methods (via React DevTools or manual test).

```bash
git add data.jsx app.jsx
git commit -m "feat: add TRADE_LISTINGS mock data and tradeable state management"
git push
```

---

### Task 2: Add "Open to Trade" Toggle in Collection Screen

**Files:**
- Modify: `screen_watchlist.jsx` — add trade toggle to `CollectionDetailScreen` card rows

**Consumes:**
- `app.isOpenToTrade(cardId)` from Task 1
- `app.toggleTradeable(cardId)` from Task 1

- [ ] **Step 1: Add trade toggle to collection card rows**

In `screen_watchlist.jsx`, find the `CollectionDetailScreen` function. In the card list rendering (the `v.cards.map` block starting ~828), add a trade toggle button to each card row in the non-select-mode branch.

Find the non-select-mode card row (the `:` branch of the `selectMode ?` ternary, around line ~860). It renders each card as a row with card art, name, value, and gain/loss. Add a trade toggle button at the end of each row.

Locate the existing row structure. After the gain/loss delta section and before the closing of the row container, add:

```javascript
<button onClick={(e) => { e.stopPropagation(); app.toggleTradeable(item.id); }}
  style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: TW.sans, flexShrink: 0,
    background: app.isOpenToTrade(item.id) ? 'var(--accent-wash)' : TW.surface2,
    color: app.isOpenToTrade(item.id) ? 'var(--accent)' : TW.muted,
    border: app.isOpenToTrade(item.id) ? '1px solid var(--accent)' : '1px solid var(--line)' }}>
  {app.isOpenToTrade(item.id) ? '\u2713 Trading' : 'Trade'}
</button>
```

- [ ] **Step 2: Add tradeable count to collection header**

In the collection value card (the dark `var(--fill)` banner, ~804), after the card count line (~811), add:

```javascript
{(() => { const tradeCount = col.cards.filter(id => app.isOpenToTrade(id)).length; return tradeCount > 0 ? (
  <div style={{ fontFamily: TW.sans, fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>{tradeCount} open to trade</div>
) : null; })()}
```

- [ ] **Step 3: Verify and commit**

Open collection screen, toggle a card as tradeable, verify badge appears, verify count shows in header, verify localStorage persists on refresh.

```bash
git add screen_watchlist.jsx
git commit -m "feat: add open-to-trade toggle on collection cards"
git push
```

---

### Task 3: Build Trade Browse Screen

**Files:**
- Create: `screen_trade_browse.jsx` — new trade marketplace browse screen
- Modify: `app.jsx` — register `TradeBrowseScreen`, add to SCREENS
- Modify: `index.html` — add script tag for `screen_trade_browse.jsx` (before `app.jsx`)

**Consumes:**
- `window.TRADE_LISTINGS` from Task 1
- `window.TRADERS` (existing), `window.byId` (existing), `window.GAMES` (existing)
- `window.CardArt`, `window.T`, `window.money`, `window.Icon` (existing globals)

**Produces:**
- `window.TradeBrowseScreen` — React component registered on window

- [ ] **Step 1: Create screen_trade_browse.jsx**

```javascript
// ─────────────────────────────────────────────────────────────
// Trade Browse — card-focused trade marketplace
// ─────────────────────────────────────────────────────────────
const { T: TB, money: moneyB, CardArt: CardArtB, Icon: IconB } = window;
const { TRADE_LISTINGS: TL_DATA, TRADERS: TRADERS_B, byId: byIdB, GAMES: GAMES_B, gameById: gameByIdB, traderById: traderByIdB } = window;

const RADIUS_OPTS = [5, 10, 25, 50];

function TradeBrowseScreen({ app }) {
  const [radius, setRadius] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [gameFilter, setGameFilter] = React.useState('all');

  const listings = TL_DATA.filter(tl => {
    if (tl.dist > radius) return false;
    const card = byIdB(tl.cardId);
    if (!card) return false;
    if (gameFilter !== 'all' && card.game !== gameFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!card.name.toLowerCase().includes(q) && !(card.subtitle || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TB.bg }}>
      {/* header */}
      <div style={{ padding: '14px 14px 12px', background: TB.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TB.ink }}>{IconB.back({})}</button>
        <span style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Trade marketplace</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
        {/* distance control */}
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ fontFamily: TB.sans, fontSize: 12, fontWeight: 600, color: TB.muted, marginBottom: 8 }}>Distance</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RADIUS_OPTS.map(r => (
              <button key={r} onClick={() => setRadius(r)} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, fontFamily: TB.sans, fontWeight: 700, fontSize: 13,
                background: radius === r ? 'var(--ink)' : TB.surface2,
                color: radius === r ? '#fff' : TB.ink,
                border: radius === r ? 'none' : '1px solid var(--line)',
              }}>{r} mi</button>
            ))}
          </div>
        </div>

        {/* search */}
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TB.surface2, borderRadius: 10, padding: '10px 12px',
            boxShadow: 'inset 0 0 0 1px var(--line)' }}>
            {IconB.search({ style: { color: TB.faint, flexShrink: 0 } })}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards available to trade\u2026"
              style={{ flex: 1, fontFamily: TB.sans, fontSize: 14, color: TB.ink, background: 'transparent', border: 'none', outline: 'none' }} />
          </div>
        </div>

        {/* game filter chips */}
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button onClick={() => setGameFilter('all')} style={{
            padding: '6px 14px', borderRadius: 999, fontFamily: TB.sans, fontWeight: 600, fontSize: 12, flexShrink: 0,
            background: gameFilter === 'all' ? 'var(--ink)' : TB.surface2,
            color: gameFilter === 'all' ? '#fff' : TB.ink,
            border: gameFilter === 'all' ? 'none' : '1px solid var(--line)',
          }}>All games</button>
          {GAMES_B.filter(g => g && g.id).map(g => (
            <button key={g.id} onClick={() => setGameFilter(g.id)} style={{
              padding: '6px 14px', borderRadius: 999, fontFamily: TB.sans, fontWeight: 600, fontSize: 12, flexShrink: 0,
              background: gameFilter === g.id ? 'var(--ink)' : TB.surface2,
              color: gameFilter === g.id ? '#fff' : TB.ink,
              border: gameFilter === g.id ? 'none' : '1px solid var(--line)',
            }}>{g.short}</button>
          ))}
        </div>

        {/* results count */}
        <div style={{ padding: '0 16px 10px', fontFamily: TB.sans, fontSize: 12, color: TB.muted, fontWeight: 600 }}>
          {listings.length} card{listings.length !== 1 ? 's' : ''} available within {radius} miles
        </div>

        {/* card grid */}
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: TB.muted, fontFamily: TB.sans, fontSize: 14, lineHeight: 1.6 }}>
            No cards available for trade within {radius} miles.<br/>
            Try increasing your distance or mark your own cards as tradeable.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: '0 16px' }}>
            {listings.map(tl => {
              const card = byIdB(tl.cardId);
              const trader = traderByIdB(tl.trader);
              if (!card || !trader) return null;
              return (
                <button key={tl.id} onClick={() => app.nav.push('trade_propose', { cardId: tl.cardId, traderId: tl.trader })}
                  style={{ textAlign: 'left', background: TB.surface, borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <div style={{ padding: 8, display: 'flex', justifyContent: 'center', background: TB.surface2 }}>
                    <CardArtB item={card} w={130} radius={8} />
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                    <div style={{ fontFamily: TB.sans, fontSize: 11, color: TB.muted, marginTop: 1 }}>{card.subtitle}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneyB(card.market || card.price)}</div>
                    {/* trader info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line-2)' }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: trader.tint, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{trader.initial}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TB.sans, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trader.name}</div>
                        <div style={{ fontFamily: TB.sans, fontSize: 10, color: TB.muted }}>{trader.deals} trades \u00b7 {trader.rating}% \u00b7 {tl.dist} mi</div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TradeBrowseScreen });
```

- [ ] **Step 2: Register in app.jsx**

Add import at the top of `app.jsx` (after the `TradeScreen` import line ~9):

```javascript
const { TradeBrowseScreen } = window;
```

Add to `SCREENS` object (~40, after `trade: TradeScreen`):

```javascript
trade_browse: TradeBrowseScreen,
```

- [ ] **Step 3: Add script tag to index.html**

Add before the `app.jsx` script tag:

```html
<script type="text/babel" src="screen_trade_browse.jsx"></script>
```

- [ ] **Step 4: Verify and commit**

Navigate to `#trade_browse` in browser. Verify: distance buttons filter by radius, search filters by name, game chips filter by game, cards display with trader trust signals, tapping a card navigates (will 404 to trade_propose for now — that's fine).

```bash
git add screen_trade_browse.jsx app.jsx index.html
git commit -m "feat: add trade browse screen with distance filtering and card grid"
git push
```

---

### Task 4: Build Trade Propose Screen

**Files:**
- Create: `screen_trade_propose.jsx` — proposal builder + sent/negotiation states
- Modify: `app.jsx` — register `TradePropose`, add to SCREENS
- Modify: `index.html` — add script tag

**Consumes:**
- `app.tradeable`, `app.collections`, `app.ownedIds()` from Tasks 1-2
- `window.TRADERS`, `window.byId`, `window.CardArt`, `window.T`, `window.money`, `window.Icon`

**Produces:**
- `window.TradePropose` — React component for the propose trade flow

- [ ] **Step 1: Create screen_trade_propose.jsx**

```javascript
// ─────────────────────────────────────────────────────────────
// Trade Propose — build swap + negotiation
// ─────────────────────────────────────────────────────────────
const { T: TP, money: moneyP, CardArt: CardArtP, Icon: IconP } = window;
const { byId: byIdP, traderById: traderByIdP, SHOPS: SHOPS_P } = window;

function TradePropose({ app, params = {} }) {
  const card = byIdP(params.cardId);
  const trader = traderByIdP(params.traderId);
  const [phase, setPhase] = React.useState('build'); // build | sent | meetup | confirmed
  const [selected, setSelected] = React.useState({});
  const [cash, setCash] = React.useState(0);
  const [showCash, setShowCash] = React.useState(false);
  const [stage, setStage] = React.useState('proposed'); // proposed | countered | accepted | declined
  const [place, setPlace] = React.useState(null);
  const [customSpot, setCustomSpot] = React.useState('');

  // simulate trader response after proposal
  React.useEffect(() => {
    if (phase === 'sent' && stage === 'proposed') {
      const t = setTimeout(() => setStage('accepted'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase, stage]);

  if (!card || !trader) {
    return (
      <div style={{ height: '100%', background: TP.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: TP.sans, color: TP.muted }}>Card or trader not found.</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 12, fontFamily: TP.sans, fontWeight: 700, color: 'var(--ink)' }}>{'\u2190'} Back</button>
      </div>
    );
  }

  const ownedIds = app.ownedIds();
  const tradeableFirst = [...ownedIds].sort((a, b) => {
    const aT = app.isOpenToTrade(a) ? 0 : 1;
    const bT = app.isOpenToTrade(b) ? 0 : 1;
    return aT - bT;
  });

  const selIds = Object.keys(selected).filter(k => selected[k]);
  const giveVal = selIds.reduce((s, id) => { const c = byIdP(id); return s + (c ? c.market || c.price : 0); }, 0);
  const getVal = card.market || card.price;
  const diff = getVal - giveVal - cash;
  const totalOffer = giveVal + cash;
  const fairPct = totalOffer + getVal === 0 ? 50 : Math.round((totalOffer / (totalOffer + getVal)) * 100);
  const suggestedCash = Math.max(0, Math.round(getVal - giveVal));

  function toggleCard(id) {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  }

  // ── BUILD PHASE ──
  if (phase === 'build') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => app.nav.pop()} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Propose a trade</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
          {/* card you want */}
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 700, color: 'var(--up)', letterSpacing: 0.5, marginBottom: 10 }}>CARD YOU WANT</div>
            <div style={{ display: 'flex', gap: 12, background: TP.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtP item={card} w={80} radius={8} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 15 }}>{card.name}</div>
                <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, marginTop: 2 }}>{card.subtitle}</div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15, marginTop: 6 }}>{moneyP(card.market || card.price)}</div>
                {/* trader info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: trader.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{trader.initial}</span>
                  <span style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{trader.name} \u00b7 {trader.deals} trades \u00b7 {trader.rating}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* your offer */}
          <div style={{ padding: '4px 16px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 700, color: 'var(--ink)', letterSpacing: 0.5, marginBottom: 10 }}>YOUR OFFER</div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
              {tradeableFirst.map(id => {
                const c = byIdP(id);
                if (!c) return null;
                const isSel = !!selected[id];
                const isTradeable = app.isOpenToTrade(id);
                return (
                  <button key={id} onClick={() => toggleCard(id)} style={{ flexShrink: 0, width: 90, textAlign: 'left', position: 'relative' }}>
                    <div style={{ background: TP.surface2, borderRadius: 10, padding: 6, display: 'flex', justifyContent: 'center', position: 'relative',
                      border: isSel ? '2px solid var(--accent)' : '2px solid transparent' }}>
                      <CardArtP item={c} w={68} radius={6} />
                      {isSel && (
                        <span style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{'\u2713'}</span>
                      )}
                      {isTradeable && !isSel && (
                        <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontWeight: 700, fontFamily: TP.sans,
                          background: 'var(--accent-wash)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4 }}>Trade</span>
                      )}
                    </div>
                    <div style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 11, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 10.5, color: TP.muted }}>{moneyP(c.market || c.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* selected summary */}
          {selIds.length > 0 && (
            <div style={{ padding: '0 16px 12px' }}>
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted, marginBottom: 6 }}>
                  {selIds.length} card{selIds.length !== 1 ? 's' : ''} selected \u00b7 {moneyP(giveVal)}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => {
                    const c = byIdP(id);
                    return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={40} radius={4} /></div> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* cash top-up */}
          <div style={{ padding: '0 16px 12px' }}>
            {!showCash ? (
              <button onClick={() => setShowCash(true)} style={{ fontFamily: TP.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', padding: '8px 0' }}>
                + Add cash to balance the trade
              </button>
            ) : (
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted, marginBottom: 8 }}>Cash top-up</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: TP.sans, fontSize: 18, fontWeight: 700 }}>\u00a3</span>
                  <input type="number" value={cash || ''} onChange={e => setCash(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0" style={{ flex: 1, fontFamily: TP.sans, fontSize: 18, fontWeight: 700, color: TP.ink, background: 'transparent', border: 'none', outline: 'none' }} />
                  <button onClick={() => { setCash(0); setShowCash(false); }} style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, fontWeight: 600 }}>Remove</button>
                </div>
                {diff > 5 && cash === 0 && (
                  <button onClick={() => setCash(suggestedCash)} style={{ marginTop: 8, fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                    Suggest \u00a3{suggestedCash} to even it out
                  </button>
                )}
              </div>
            )}
          </div>

          {/* fairness indicator */}
          {selIds.length > 0 && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted, marginBottom: 8 }}>Trade balance</div>
                <div style={{ height: 6, borderRadius: 3, background: TP.surface2, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', borderRadius: 3, width: Math.min(100, fairPct) + '%',
                    background: fairPct > 40 && fairPct < 60 ? 'var(--up)' : 'var(--accent)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TP.sans, fontSize: 12 }}>
                  <span>Your offer: <b>{moneyP(totalOffer)}</b></span>
                  <span>Their card: <b>{moneyP(getVal)}</b></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TP.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('sent')} disabled={selIds.length === 0}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TP.sans, fontWeight: 700, fontSize: 16,
              background: selIds.length > 0 ? 'var(--ink)' : TP.surface2,
              color: selIds.length > 0 ? '#fff' : TP.muted }}>
            Send proposal {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ── SENT / NEGOTIATION PHASE ──
  if (phase === 'sent') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => app.nav.pop()} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Trade proposal</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '20px 16px 30px' }}>
          {/* status icon */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, margin: '0 auto',
              background: stage === 'accepted' ? 'var(--up-wash)' : stage === 'declined' ? 'var(--down-wash)' : 'var(--accent-wash)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 26 }}>{stage === 'accepted' ? '\u2713' : stage === 'declined' ? '\u2717' : '\u231B'}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 20, marginTop: 10 }}>
              {stage === 'proposed' ? 'Trade proposed!' : stage === 'accepted' ? 'Trade accepted!' : stage === 'countered' ? 'Counter offer received' : 'Trade declined'}
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginTop: 4 }}>
              {stage === 'proposed' ? 'Waiting for ' + trader.name + ' to respond\u2026' : stage === 'accepted' ? 'Both sides agreed. Now pick where to meet.' : stage === 'declined' ? trader.name + ' declined the trade.' : ''}
            </div>
          </div>

          {/* trade summary */}
          <div style={{ background: TP.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, letterSpacing: 0.3 }}>YOU GIVE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => { const c = byIdP(id); return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={44} radius={4} /></div> : null; })}
                </div>
                {cash > 0 && <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>+ \u00a3{cash} cash</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: TP.faint, fontSize: 18 }}>{'\u21C4'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6, letterSpacing: 0.3 }}>YOU GET</div>
                <div style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={card} w={44} radius={4} /></div>
              </div>
            </div>
          </div>

          {/* accepted → go to meetup */}
          {stage === 'accepted' && (
            <button onClick={() => setPhase('meetup')} style={{ width: '100%', marginTop: 16, padding: 16, borderRadius: 14,
              background: 'var(--ink)', color: '#fff', fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
              Arrange meetup {'\u2192'}
            </button>
          )}

          {stage === 'declined' && (
            <button onClick={() => app.nav.pop()} style={{ width: '100%', marginTop: 16, padding: 16, borderRadius: 14,
              background: TP.surface2, color: TP.ink, fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
              Back to browse
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── MEETUP PHASE ──
  if (phase === 'meetup') {
    const hubs = SHOPS_P.filter(s => s.tradeHub);
    const publicSpots = [
      { id: 'pub1', name: 'Central Library', sub: 'Public \u00b7 0.4 mi from you', kind: 'public', tint: '#6366f1', initial: 'L' },
      { id: 'pub2', name: 'Westgate Mall', sub: 'Public \u00b7 1.1 mi from you', kind: 'public', tint: '#0891b2', initial: 'W' },
      { id: 'pub3', name: 'Costa Coffee', sub: 'Public \u00b7 0.8 mi from you', kind: 'public', tint: '#b45309', initial: 'C' },
    ];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setPhase('sent')} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Choose where to meet</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 120px' }}>
          {/* safety checklist */}
          <div style={{ background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--ink)' }}>Safe trade checklist</div>
            {['Meet at a local game shop if possible', 'Choose a public, well-lit area', 'Tell someone where you\u2019re going', 'Check both IDs before swapping'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: TP.sans, fontSize: 12, color: TP.ink2, marginTop: i ? 5 : 0 }}>
                <span style={{ color: 'var(--up)', fontSize: 13 }}>{'\u2713'}</span> {tip}
              </div>
            ))}
          </div>

          {/* LGS options */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Local game shops</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {hubs.map((shop, i) => {
              const selected = place && place.id === shop.id;
              return (
                <button key={shop.id} onClick={() => setPlace({ id: shop.id, name: shop.name, sub: shop.loc + ' \u00b7 ' + shop.dist + ' mi', kind: 'shop', tint: shop.tint, initial: shop.initial })}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, padding: '10px 12px',
                    background: selected ? 'var(--accent-wash)' : TP.surface,
                    boxShadow: selected ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: shop.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{shop.initial}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13.5 }}>{shop.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{shop.loc} \u00b7 {shop.dist} mi \u00b7 {shop.hours}</div>
                  </div>
                  {i === 0 && <span style={{ fontFamily: TP.sans, fontSize: 9, fontWeight: 700, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 6, padding: '2px 7px' }}>RECOMMENDED</span>}
                </button>
              );
            })}
          </div>

          {/* public spots */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Public meetup spots</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {publicSpots.map(spot => {
              const selected = place && place.id === spot.id;
              return (
                <button key={spot.id} onClick={() => setPlace(spot)}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, padding: '10px 12px',
                    background: selected ? 'var(--accent-wash)' : TP.surface,
                    boxShadow: selected ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: spot.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{spot.initial}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13.5 }}>{spot.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{spot.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* custom spot */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Suggest a spot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TP.surface, borderRadius: 12, padding: '10px 12px',
            boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <span style={{ color: TP.faint }}>{IconP.pin ? IconP.pin({ width: 18, height: 18 }) : '\uD83D\uDCCD'}</span>
            <input value={customSpot} onChange={e => { setCustomSpot(e.target.value); if (e.target.value) setPlace({ id: 'custom', name: e.target.value, sub: 'Custom location', kind: 'custom', tint: '#71717a', initial: e.target.value.charAt(0).toUpperCase() }); }}
              placeholder="Type a location\u2026" style={{ flex: 1, fontFamily: TP.sans, fontSize: 14, color: TP.ink, background: 'transparent', border: 'none', outline: 'none' }} />
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TP.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('confirmed')} disabled={!place}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TP.sans, fontWeight: 700, fontSize: 16,
              background: place ? 'var(--ink)' : TP.surface2,
              color: place ? '#fff' : TP.muted }}>
            {place ? 'Propose ' + place.name + ' \u2192' : 'Select a location'}
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRMED ──
  if (phase === 'confirmed') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '40px 16px 30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', background: 'var(--up-wash)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 30 }}>{'\u2713'}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 22, marginTop: 12 }}>Trade locked in!</div>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginTop: 6 }}>
              Meet {trader.name} at {place ? place.name : 'the agreed spot'}
            </div>
          </div>

          {/* summary card */}
          <div style={{ background: TP.surface, borderRadius: 16, padding: 14, marginTop: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>YOU GIVE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => { const c = byIdP(id); return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={44} radius={4} /></div> : null; })}
                </div>
                {cash > 0 && <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>+ \u00a3{cash} cash</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: TP.faint, fontSize: 18 }}>{'\u21C4'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6 }}>YOU GET</div>
                <div style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={card} w={44} radius={4} /></div>
              </div>
            </div>
          </div>

          {/* meetup details */}
          {place && (
            <div style={{ background: TP.surface, borderRadius: 16, padding: 14, marginTop: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Meetup location</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: place.tint, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{place.initial}</span>
                <div>
                  <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14 }}>{place.name}</div>
                  <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{place.sub}</div>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => app.nav.setTab('home')} style={{ width: '100%', marginTop: 20, padding: 16, borderRadius: 14,
            background: 'var(--ink)', color: '#fff', fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
            Done
          </button>
          <button onClick={() => app.nav.pop()} style={{ width: '100%', marginTop: 8, padding: 14, borderRadius: 14,
            background: 'transparent', color: TP.ink, fontFamily: TP.sans, fontWeight: 600, fontSize: 14 }}>
            Back to trade marketplace
          </button>
        </div>
      </div>
    );
  }

  return null;
}

Object.assign(window, { TradePropose });
```

- [ ] **Step 2: Register in app.jsx**

Add import (after `TradeBrowseScreen` import):

```javascript
const { TradePropose } = window;
```

Add to `SCREENS` object (after `trade_browse`):

```javascript
trade_propose: TradePropose,
```

- [ ] **Step 3: Add script tag to index.html**

Add before `app.jsx` script tag, after `screen_trade_browse.jsx`:

```html
<script type="text/babel" src="screen_trade_propose.jsx"></script>
```

- [ ] **Step 4: Verify and commit**

Navigate to trade browse, tap a card, verify full propose flow: select cards → fairness indicator → send proposal → auto-accept after 3s → arrange meetup → confirm → done.

```bash
git add screen_trade_propose.jsx app.jsx index.html
git commit -m "feat: add trade propose screen with swap builder, negotiation, and meetup"
git push
```

---

### Task 5: Update Navigation Entry Points

**Files:**
- Modify: `screen_listing.jsx` — update trade button to navigate to `trade_propose` with card context
- Modify: `screen_home.jsx` — update "Trade card-for-card" action to navigate to `trade_browse`
- Modify: `components.jsx` — update side menu "Trade with collectors" to navigate to `trade_browse`

**Consumes:**
- `trade_browse` and `trade_propose` screen registrations from Tasks 3-4

- [ ] **Step 1: Update listing screen trade button**

In `screen_listing.jsx` (~line 241), change:

```javascript
onClick={() => app.nav.push('trade')}
```

to:

```javascript
onClick={() => app.nav.push('trade_propose', { cardId: item.id, traderId: t.id || 't1' })}
```

Note: `t` here is the trade offer object from `product.tradeOffers`. The `t.id` may not match our TRADERS data, so fall back to `'t1'` for the prototype.

- [ ] **Step 2: Update home screen trade action card**

In `screen_home.jsx`, find the "Trade card-for-card" action card (~line 593). Change:

```javascript
action: () => app.nav.push('trade')
```

to:

```javascript
action: () => app.nav.push('trade_browse')
```

- [ ] **Step 3: Update side menu**

In `components.jsx`, find the "Trade with collectors" quick action (~line 393). Change:

```javascript
['Trade with collectors', Icon.gavel, () => go(() => app.nav.push('trade'))],
```

to:

```javascript
['Trade with collectors', Icon.gavel, () => go(() => app.nav.push('trade_browse'))],
```

- [ ] **Step 4: Verify and commit**

Test each entry point: home action card → trade browse, side menu → trade browse, listing trade button → trade propose.

```bash
git add screen_listing.jsx screen_home.jsx components.jsx
git commit -m "feat: update all trade nav entry points to new browse and propose screens"
git push
```

---

### Task 6: Clean Up Old Trade Screen References

**Files:**
- Modify: `app.jsx` — keep old `trade` route pointing to existing `TradeScreen` for backwards compat (don't break desktop), but also ensure new screens are primary

**Note:** The old `screen_trade.jsx` is NOT deleted — the desktop trade view (`desktop_trade.jsx`) still references `TradeScreen` and the old data structures. Desktop will be updated in a future pass per the spec. The old `trade` route stays registered so desktop doesn't break.

- [ ] **Step 1: Verify no broken routes**

Confirm these routes all work:
- `#trade_browse` → TradeBrowseScreen
- `#trade_propose/l01` → TradePropose (will need cardId param)
- `#trade` → old TradeScreen (still works for desktop)
- Home → Trade action card → trade_browse
- Side menu → Trade → trade_browse
- Listing → Trade button → trade_propose

- [ ] **Step 2: Commit if any fixes needed**

```bash
git add -A
git commit -m "fix: verify all trade routes and clean up references"
git push
```
