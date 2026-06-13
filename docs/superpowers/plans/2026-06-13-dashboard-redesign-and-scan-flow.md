# Dashboard Redesign & Scan Card Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the profile tab with an operational dashboard and add a camera-based card scan flow accessible from sell, search, and collection screens.

**Architecture:** The profile tab's `ProfileScreen` in `screen_watchlist.jsx` is replaced with a `DashboardScreen`. Settings content moves to a new `SettingsScreen` in the same file. A new `screen_scan.jsx` file handles the scan flow. Entry points in sell, search, and collection screens are wired to push the scan screen with a `from` param that controls which action buttons appear on the result sheet.

**Tech Stack:** React 18 (global UMD, no modules), in-browser JSX via Babel standalone, all state via React hooks + localStorage, shared via `window` object pattern.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `screen_watchlist.jsx` | Modify | Replace `ProfileScreen` with `DashboardScreen` + add `SettingsScreen` |
| `screen_scan.jsx` | Create | `ScanScreen` — camera UI, analyzing state, result sheet |
| `app.jsx` | Modify | Import `ScanScreen` + `SettingsScreen`, update `TAB_ROOT` and `SCREENS`, update window destructuring |
| `screen_sell.jsx` | Modify | Wire "Scan a card" button to push scan screen |
| `screen_search.jsx` | Modify | Add camera icon to search bar |
| `index.html` | Modify | Add `screen_scan.jsx` script tag |

---

### Task 1: Create DashboardScreen (replace ProfileScreen)

**Files:**
- Modify: `screen_watchlist.jsx` — replace `ProfileScreen` function (lines 177-329) with `DashboardScreen`

- [ ] **Step 1: Add dashboard theme aliases and icon object**

At the top of `screen_watchlist.jsx`, after the existing destructuring (line 5), add the Sparkline import and a dashboard icon set:

```jsx
const { Sparkline: SparkD } = window;

const IconD = {
  bell: (p = {}) => <svg width={p.w || 20} height={p.w || 20} viewBox="0 0 24 24" fill="none" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  gear: (p = {}) => <svg width={p.w || 20} height={p.w || 20} viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>,
};
```

- [ ] **Step 2: Replace ProfileScreen with DashboardScreen**

Delete the entire `ProfileScreen` function (lines 177-329) and replace with:

```jsx
function DashboardScreen({ app }) {
  const port = valueOf(app.ownedIds());
  const balance = 248.47;
  const weekDelta = 84.00;
  const activeListings = 2;
  const viewsToday = 24;
  const pendingOffers = 1;
  const toShip = 1;
  const ACTIVITY = [
    { dot: 'var(--up)', text: 'Sold Charizard EX', amt: '+\u00a384', time: '2h' },
    { dot: TW.accent, text: 'New offer on Dark Magician', amt: null, time: '5h' },
    { dot: TW.faint, text: 'Order #1847 delivered', amt: null, time: '1d' },
    { dot: 'var(--up)', text: 'Trade completed with Jamie', amt: null, time: '1d' },
    { dot: TW.accent, text: 'Listing viewed 12 times', amt: null, time: '2d' },
  ];
  const buylistMatches = 2;
  const collCount = app.collections.reduce((s, c) => s + c.cards.length, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* ── header ── */}
      <div style={{ padding: '50px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: TW.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 12 }}>A</div>
          <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>Alex</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => app.nav.push('notifications')} style={{ width: 30, height: 30, borderRadius: 8, background: TW.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)', position: 'relative' }}>
            {IconD.bell({ style: { color: TW.ink } })}
            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 99, background: 'var(--down)', border: '2px solid ' + TW.bg }} />
          </button>
          <button onClick={() => app.nav.push('settings')} style={{ width: 30, height: 30, borderRadius: 8, background: TW.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>
            {IconD.gear({ style: { color: TW.ink } })}
          </button>
        </div>
      </div>

      {/* ── scrollable body ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }} className="noscroll">

        {/* balance card */}
        <div onClick={() => app.nav.push('payments')} style={{ background: 'linear-gradient(135deg, #16181d, #2a2d3a)', borderRadius: 14, padding: 18, marginBottom: 12, cursor: 'pointer' }}>
          <div style={{ fontFamily: TW.sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 4 }}>Available balance</div>
          <div style={{ fontFamily: TW.sans, fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>{moneyW(balance)}</div>
          <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: '#4ade80', fontWeight: 600, marginTop: 4 }}>{'\u25b2'} {moneyW(weekDelta)} this week</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={e => { e.stopPropagation(); app.toast('Withdraw initiated'); }} style={{ flex: 1, padding: 9, borderRadius: 8, background: 'rgba(255,255,255,0.1)', textAlign: 'center', fontFamily: TW.sans, fontSize: 12, fontWeight: 600, color: '#fff' }}>Withdraw</button>
            <button onClick={e => { e.stopPropagation(); app.toast('Converted to store credit'); }} style={{ flex: 1, padding: 9, borderRadius: 8, background: 'rgba(99,102,241,0.8)', textAlign: 'center', fontFamily: TW.sans, fontSize: 12, fontWeight: 600, color: '#fff' }}>Store credit</button>
          </div>
        </div>

        {/* status tiles */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => app.nav.push('selling')} style={{ flex: 1, background: TW.surface, borderRadius: 10, padding: '12px 10px', boxShadow: 'var(--shadow-1)', textAlign: 'left' }}>
            <div style={{ fontFamily: TW.sans, fontSize: 22, fontWeight: 800, color: TW.ink }}>{activeListings}</div>
            <div style={{ fontFamily: TW.sans, fontSize: 10, color: TW.muted, marginTop: 2 }}>Active listings</div>
            <div style={{ fontFamily: TW.sans, fontSize: 10, color: TW.accent, fontWeight: 600, marginTop: 5 }}>{viewsToday} views today</div>
          </button>
          <button onClick={() => app.nav.push('offers')} style={{ flex: 1, background: TW.surface, borderRadius: 10, padding: '12px 10px', boxShadow: 'var(--shadow-1)', textAlign: 'left' }}>
            <div style={{ fontFamily: TW.sans, fontSize: 22, fontWeight: 800, color: pendingOffers > 0 ? 'var(--gold)' : TW.ink }}>{pendingOffers}</div>
            <div style={{ fontFamily: TW.sans, fontSize: 10, color: TW.muted, marginTop: 2 }}>Pending offers</div>
            {pendingOffers > 0 && <div style={{ fontFamily: TW.sans, fontSize: 10, color: 'var(--gold)', fontWeight: 600, marginTop: 5 }}>Respond {'\u2192'}</div>}
          </button>
          <button onClick={() => app.nav.push('selling')} style={{ flex: 1, background: TW.surface, borderRadius: 10, padding: '12px 10px', boxShadow: 'var(--shadow-1)', textAlign: 'left' }}>
            <div style={{ fontFamily: TW.sans, fontSize: 22, fontWeight: 800, color: toShip > 0 ? 'var(--up)' : TW.ink }}>{toShip}</div>
            <div style={{ fontFamily: TW.sans, fontSize: 10, color: TW.muted, marginTop: 2 }}>To ship</div>
            {toShip > 0 && <div style={{ fontFamily: TW.sans, fontSize: 10, color: 'var(--up)', fontWeight: 600, marginTop: 5 }}>Print label {'\u2192'}</div>}
          </button>
        </div>

        {/* activity feed */}
        <div style={{ background: TW.surface, borderRadius: 10, padding: '12px 14px', boxShadow: 'var(--shadow-1)', marginBottom: 12 }}>
          <div style={{ fontFamily: TW.sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: TW.faint, fontWeight: 700, marginBottom: 10 }}>Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
                <div style={{ flex: 1, fontFamily: TW.sans, fontSize: 12.5, color: TW.ink2 }}>
                  {a.text}{a.amt && <span style={{ color: 'var(--up)', fontWeight: 600 }}> {'\u00b7'} {a.amt}</span>}
                </div>
                <div style={{ fontFamily: TW.sans, fontSize: 10.5, color: TW.faint }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* collection row */}
        <button onClick={() => app.nav.setTab('watch')} style={{ width: '100%', background: TW.surface, borderRadius: 10, padding: '12px 14px', boxShadow: 'var(--shadow-1)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, textAlign: 'left' }}>
          <div style={{ display: 'flex' }}>
            {['var(--gold)', TW.accent, 'var(--down)'].map((bg, i) => (
              <div key={i} style={{ width: 30, height: 42, borderRadius: 4, background: bg, border: '2px solid ' + TW.surface, marginLeft: i > 0 ? -6 : 0 }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TW.sans, fontSize: 12.5, fontWeight: 700, color: TW.ink }}>Collection {'\u00b7'} {moneyW(port.now)}</div>
            <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.muted }}>{collCount} cards {'\u00b7'} <span style={{ color: 'var(--up)' }}>+12%</span></div>
          </div>
          <span style={{ color: TW.faint }}>{IconW.chevron({})}</span>
        </button>

        {/* buylist row */}
        <button onClick={() => app.nav.push('buylist')} style={{ width: '100%', background: TW.surface, borderRadius: 10, padding: '12px 14px', boxShadow: 'var(--shadow-1)', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{'\u2b50'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TW.sans, fontSize: 12.5, fontWeight: 700, color: TW.ink }}>Buylist {'\u00b7'} {buylistMatches} matches</div>
            <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.accent, fontWeight: 600 }}>Cards at your price</div>
          </div>
          <span style={{ color: TW.faint }}>{IconW.chevron({})}</span>
        </button>

      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add SettingsScreen**

Add the following function after `DashboardScreen`, before `CollectionDetailScreen`:

```jsx
function SettingsScreen({ app }) {
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const ACCT_LABEL = { buyer: 'Collector', seller: 'Individual seller', store: 'Game shop' };
  const ACCT_EMOJI = { buyer: '\ud83c\udccf', seller: '\ud83d\udcb8', store: '\ud83c\udfea' };
  const followed = (window.GAMES || []).filter(g => app.inPrefs(g.id));
  const settingsMenu = [
    ['Account type', ACCT_LABEL[app.acct], null, () => { const next = app.acct === 'buyer' ? 'seller' : app.acct === 'seller' ? 'store' : 'buyer'; app.setAcct(next); }],
    ['Verification & trust', app.tier >= 2 ? 'Trusted Seller' : app.tier >= 1 ? 'ID Verified' : 'Get verified', null, () => app.nav.push('verify')],
    ['Payment methods', '', null, () => app.nav.push('payments')],
    ['Games you follow', followed.length > 0 ? followed.map(g => g.name).join(', ') : 'All games', null, () => setPrefsOpen(true)],
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      <div style={{ padding: '52px 14px 12px', background: TW.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TW.ink }}>{IconW.back({})}</button>
        <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 16 }}>Settings</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }} className="noscroll">
        {/* account identity card */}
        <div style={{ background: TW.surface, borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: 'var(--shadow-1)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: TW.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 22 }}>A</div>
          <div>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Alex Rivera</div>
            <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              {ACCT_EMOJI[app.acct]} {ACCT_LABEL[app.acct]}
              {app.tier >= 1 && window.TrustBadge && <window.TrustBadge tier={app.tier} />}
            </div>
          </div>
        </div>

        {/* settings list */}
        <div style={{ background: TW.surface, borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
          {settingsMenu.map(([label, sub, , action], i) => (
            <button key={i} onClick={action} style={{
              width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', padding: '14px 16px',
              borderBottom: i < settingsMenu.length - 1 ? '1px solid var(--line-2)' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 14, color: TW.ink }}>{label}</div>
                {sub && <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted, marginTop: 2 }}>{sub}</div>}
              </div>
              {IconW.chevron({ style: { color: TW.faint } })}
            </button>
          ))}
        </div>

        {app.acct === 'buyer' && (
          <button onClick={() => app.setAcct('seller')} style={{ width: '100%', marginTop: 16, padding: 14, borderRadius: 12, background: TW.accent, color: '#fff', fontFamily: TW.sans, fontWeight: 700, fontSize: 15, textAlign: 'center' }}>
            Become a seller
          </button>
        )}
        {app.acct !== 'store' && (
          <button onClick={() => app.nav.push('enroll_shop')} style={{ width: '100%', marginTop: 8, padding: 14, borderRadius: 12, background: TW.surface, color: TW.ink, fontFamily: TW.sans, fontWeight: 700, fontSize: 15, textAlign: 'center', boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>
            Enroll as Local Game Store
          </button>
        )}
      </div>
      {window.GamePrefsSheet && <window.GamePrefsSheet app={app} open={prefsOpen} onClose={() => setPrefsOpen(false)} games={window.GAMES || []} />}
    </div>
  );
}
```

- [ ] **Step 4: Update window exports**

Change the `Object.assign` at the bottom of `screen_watchlist.jsx` from:

```jsx
Object.assign(window, { WatchScreen, ProfileScreen, EmptyState, CollectionDetailScreen });
```

to:

```jsx
Object.assign(window, { WatchScreen, DashboardScreen, SettingsScreen, EmptyState, CollectionDetailScreen });
```

- [ ] **Step 5: Commit**

```bash
git add screen_watchlist.jsx
git commit -m "feat: replace ProfileScreen with DashboardScreen + SettingsScreen"
```

---

### Task 2: Wire DashboardScreen and SettingsScreen in app.jsx

**Files:**
- Modify: `app.jsx`

- [ ] **Step 1: Update window imports**

In `app.jsx`, change line 6:

```jsx
const { HomeScreen, SearchScreen, ListingScreen, SellScreen, CheckoutScreen, WatchScreen, ProfileScreen, SellHubScreen, SellMarketScreen, SellBulkScreen, SellShopScreen, ShopScreen } = window;
```

to:

```jsx
const { HomeScreen, SearchScreen, ListingScreen, SellScreen, CheckoutScreen, WatchScreen, DashboardScreen, SettingsScreen, SellHubScreen, SellMarketScreen, SellBulkScreen, SellShopScreen, ShopScreen } = window;
```

- [ ] **Step 2: Update TAB_ROOT**

Change the `profile` entry in `TAB_ROOT` (line 21):

```jsx
const TAB_ROOT = {
  home: HomeScreen, search: SearchScreen, sell: SellHubScreen, watch: WatchScreen, profile: DashboardScreen,
};
```

- [ ] **Step 3: Update SCREENS**

Add `settings: SettingsScreen` to the SCREENS object and update the profile entry. Find the SCREENS object and add after the existing entries:

```jsx
  settings: SettingsScreen,
```

Also change `profile: ProfileScreen` to `profile: DashboardScreen` in the SCREENS object (line 33).

- [ ] **Step 4: Verify the build compiles**

```bash
npm run build 2>&1 | tail -5
```

Expected: `Build complete!` with no errors.

- [ ] **Step 5: Commit**

```bash
git add app.jsx
git commit -m "feat: wire DashboardScreen and SettingsScreen into app navigation"
```

---

### Task 3: Create ScanScreen

**Files:**
- Create: `screen_scan.jsx`

- [ ] **Step 1: Create screen_scan.jsx**

```jsx
// ─────────────────────────────────────────────────────────────
// Scan card — camera mock, analyzing animation, result sheet
// ─────────────────────────────────────────────────────────────
const { T: TSC, money: moneySC, CardArt: CardArtSC, GradeChip: GradeChipSC, Delta: DeltaSC, Sheet: SheetSC, Icon: IconSC } = window;
const { LISTINGS: LISTINGS_SC, byId: byIdSC, setById: setByIdSC } = window;

function ScanScreen({ app, params = {} }) {
  const from = params.from || 'sell';
  const [stage, setStage] = React.useState('camera'); // camera | analyzing | result
  const [card, setCard] = React.useState(null);
  const [alts, setAlts] = React.useState([]);
  const [showAlts, setShowAlts] = React.useState(false);
  const [grade, setGrade] = React.useState('raw');
  const [torch, setTorch] = React.useState(false);

  const pickCard = () => {
    const pool = LISTINGS_SC.filter(l => l.art);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter(l => l.id !== picked.id && l.game === picked.game).slice(0, 3);
    setCard(picked);
    setAlts(others.length > 0 ? others : pool.filter(l => l.id !== picked.id).slice(0, 3));
  };

  const capture = () => {
    pickCard();
    setStage('analyzing');
    setTimeout(() => setStage('result'), 1500);
  };

  const selectAlt = (alt) => {
    setCard(alt);
    setAlts(prev => prev.filter(a => a.id !== alt.id));
    setShowAlts(false);
  };

  const GRADES = ['Raw', 'NM', 'LP', 'MP', 'HP'];

  // primary action depends on entry point
  const actions = {
    sell: [
      { label: 'List for sale', primary: true, action: () => { app.nav.pop(); app.nav.setTab('sell'); app.toast('Card ready to list'); } },
      { label: 'Add to collection', primary: false, action: () => { if (app.collections[0]) app.addCardToCollection(app.collections[0].id, card.id); app.toast('Added to collection'); app.nav.pop(); } },
      { label: 'Price check', primary: false, action: () => { app.nav.pop(); app.nav.push('product', { pid: card.id }); } },
    ],
    search: [
      { label: 'View listing', primary: true, action: () => { app.nav.pop(); app.nav.push('listing', { id: card.id }); } },
      { label: 'Add to collection', primary: false, action: () => { if (app.collections[0]) app.addCardToCollection(app.collections[0].id, card.id); app.toast('Added to collection'); app.nav.pop(); } },
      { label: 'List for sale', primary: false, action: () => { app.nav.pop(); app.nav.setTab('sell'); app.toast('Card ready to list'); } },
    ],
    collection: [
      { label: 'Add to collection', primary: true, action: () => { if (app.collections[0]) app.addCardToCollection(app.collections[0].id, card.id); app.toast('Added to collection'); app.nav.pop(); } },
      { label: 'List for sale', primary: false, action: () => { app.nav.pop(); app.nav.setTab('sell'); app.toast('Card ready to list'); } },
      { label: 'Price check', primary: false, action: () => { app.nav.pop(); app.nav.push('product', { pid: card.id }); } },
    ],
  };

  if (stage === 'camera' || stage === 'analyzing') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a', position: 'relative' }}>
        {/* header */}
        <div style={{ padding: '52px 14px 12px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
          <button onClick={() => app.nav.pop()} style={{ color: '#fff' }}>{IconSC.back({})}</button>
          <span style={{ fontFamily: TSC.sans, fontWeight: 700, fontSize: 16, color: '#fff', flex: 1 }}>Scan card</span>
          <button onClick={() => setTorch(!torch)} style={{ color: torch ? 'var(--gold)' : 'rgba(255,255,255,0.5)', fontSize: 20 }}>{'\u26a1'}</button>
        </div>

        {/* viewfinder */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* card-shaped guide */}
          <div style={{
            width: 220, height: 308, borderRadius: 12,
            border: stage === 'analyzing' ? '2px solid rgba(99,102,241,0.6)' : '2px dashed rgba(255,255,255,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            {stage === 'analyzing' && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 50%, rgba(99,102,241,0.15) 100%)',
                animation: 'ccShimmer 1.5s ease infinite',
                backgroundSize: '100% 200%',
              }} />
            )}
          </div>
          {/* hint text */}
          <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: TSC.sans, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            {stage === 'analyzing' ? 'Identifying card...' : 'Centre the card in the frame'}
          </div>
        </div>

        {/* capture button */}
        {stage === 'camera' && (
          <div style={{ padding: '0 0 50px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={capture} style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff' }} />
            </button>
          </div>
        )}
        {stage === 'analyzing' && (
          <div style={{ padding: '0 0 50px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '3px solid rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '3px solid #fff', borderTopColor: 'transparent', animation: 'ccBlink 1s linear infinite' }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // stage === 'result'
  const setName = card ? (setByIdSC(card.set) || {}).name || '' : '';
  const currentActions = actions[from] || actions.sell;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      {/* dark background with header */}
      <div style={{ padding: '52px 14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: '#fff' }}>{IconSC.back({})}</button>
        <span style={{ fontFamily: TSC.sans, fontWeight: 700, fontSize: 16, color: '#fff' }}>Scan result</span>
      </div>

      {/* result sheet area */}
      <div style={{ flex: 1 }} />
      <div style={{ background: TSC.bg, borderRadius: '20px 20px 0 0', padding: '20px 16px 40px', boxShadow: '0 -4px 20px rgba(0,0,0,0.2)' }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line)', margin: '0 auto 16px' }} />

        {card && (
          <>
            {/* card info */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 72, flexShrink: 0 }}>
                <CardArtSC item={card} w={72} radius={8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TSC.sans, fontWeight: 800, fontSize: 16, color: TSC.ink, letterSpacing: -0.3 }}>{card.name}</div>
                <div style={{ fontFamily: TSC.sans, fontSize: 12, color: TSC.muted, marginTop: 2 }}>{setName} {'\u00b7'} {card.number || ''}</div>
                {card.grade && <div style={{ marginTop: 6 }}><GradeChipSC grade={card.grade} /></div>}
              </div>
            </div>

            {/* grade selector */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {GRADES.map(g => (
                <button key={g} onClick={() => setGrade(g.toLowerCase())}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, fontFamily: TSC.sans, fontWeight: 600, fontSize: 12,
                    background: grade === g.toLowerCase() ? TSC.ink : TSC.surface,
                    color: grade === g.toLowerCase() ? '#fff' : TSC.muted,
                    boxShadow: grade === g.toLowerCase() ? 'none' : 'inset 0 0 0 1px var(--line)',
                  }}>
                  {g}
                </button>
              ))}
            </div>

            {/* market price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: TSC.sans, fontSize: 26, fontWeight: 800, color: TSC.ink, letterSpacing: -0.5 }}>{moneySC(card.market || card.price)}</span>
              {card.history && <DeltaSC history={card.history} />}
            </div>

            {/* divider */}
            <div style={{ height: 1, background: 'var(--line)', marginBottom: 16 }} />

            {/* action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentActions.map((act, i) => (
                <button key={i} onClick={act.action} style={{
                  width: '100%', padding: 14, borderRadius: 12, fontFamily: TSC.sans, fontWeight: 700, fontSize: 15, textAlign: 'center',
                  background: act.primary ? TSC.accent : TSC.surface,
                  color: act.primary ? '#fff' : TSC.ink,
                  boxShadow: act.primary ? 'none' : 'inset 0 0 0 1.5px var(--line)',
                }}>
                  {act.label}
                </button>
              ))}
            </div>

            {/* wrong card link */}
            <button onClick={() => setShowAlts(!showAlts)} style={{ width: '100%', marginTop: 12, padding: 8, fontFamily: TSC.sans, fontSize: 13, color: TSC.muted, textAlign: 'center' }}>
              Not the right card?
            </button>

            {showAlts && alts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, background: TSC.surface, borderRadius: 10, padding: 10, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                {alts.map(alt => (
                  <button key={alt.id} onClick={() => selectAlt(alt)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, width: '100%', textAlign: 'left' }}>
                    <CardArtSC item={alt} w={36} radius={5} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: TSC.sans, fontWeight: 600, fontSize: 13, color: TSC.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alt.name}</div>
                      <div style={{ fontFamily: TSC.sans, fontSize: 11, color: TSC.muted }}>{moneySC(alt.market || alt.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ScanScreen });
```

- [ ] **Step 2: Verify the file compiles**

```bash
npm run build 2>&1 | grep "screen_scan"
```

Expected: `screen_scan.jsx → screen_scan.js`

- [ ] **Step 3: Commit**

```bash
git add screen_scan.jsx
git commit -m "feat: add ScanScreen with camera mock, analyzing animation, result sheet"
```

---

### Task 4: Add screen_scan.jsx to index.html and app.jsx

**Files:**
- Modify: `index.html` — add script tag
- Modify: `app.jsx` — import and register ScanScreen

- [ ] **Step 1: Add script tag to index.html**

In `index.html`, add the scan screen script tag after `screen_seller.jsx` (line 140) and before `screen_onboarding.jsx` (line 141):

```html
<script type="text/babel" src="screen_scan.jsx"></script>
```

- [ ] **Step 2: Import ScanScreen in app.jsx**

After the existing `SellerScreen` import (line 12), add:

```jsx
const { ScanScreen } = window;
```

- [ ] **Step 3: Register in SCREENS**

Add `scan: ScanScreen` to the SCREENS object in `app.jsx`:

```jsx
  scan: ScanScreen,
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `Build complete!` with no errors.

- [ ] **Step 5: Commit**

```bash
git add index.html app.jsx
git commit -m "feat: register ScanScreen in HTML and app navigation"
```

---

### Task 5: Wire scan entry points

**Files:**
- Modify: `screen_sell.jsx` — change "Scan a card" button
- Modify: `screen_search.jsx` — add camera icon to search bar
- Modify: `screen_watchlist.jsx` — add scan option to AddCardsSheet

- [ ] **Step 1: Wire sell screen scan button**

In `screen_sell.jsx`, find the existing scan button (line 89-95). Replace the `onClick` handler:

Change:
```jsx
onClick={() => app.toast('Opening camera to scan card')}
```

to:
```jsx
onClick={() => app.nav.push('scan', { from: 'sell' })}
```

- [ ] **Step 2: Add camera icon to search screen**

In `screen_search.jsx`, find the search bar input area. After the search icon and before the `<input>`, add a camera button at the end of the search bar. Find the search bar container (around line 49-52). After the closing `/>` of the `<input>` element, add:

```jsx
<button onClick={() => app.nav.push('scan', { from: 'search' })} style={{ padding: 4, display: 'flex', color: TSS.faint, flexShrink: 0 }}>
  {IconS.camera ? IconS.camera({ width: 18, height: 18 }) : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/></svg>}
</button>
```

Note: You need to find the exact location of the `<input>` in the search bar and add this button right after it, inside the same flex container.

- [ ] **Step 3: Add scan option to collection AddCardsSheet**

In `screen_watchlist.jsx`, find the `AddCardsSheet` function. At the top of the sheet content (after the title/search area, before the card list), add a scan button:

```jsx
<button onClick={() => { onClose(); app.nav.push('scan', { from: 'collection' }); }} style={{
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 14px', background: 'var(--fill)', color: '#fff', borderRadius: 10,
  fontFamily: TW.sans, fontWeight: 700, fontSize: 14, marginBottom: 12,
}}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/></svg>
  Scan a card
</button>
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `Build complete!` with no errors.

- [ ] **Step 5: Commit**

```bash
git add screen_sell.jsx screen_search.jsx screen_watchlist.jsx
git commit -m "feat: wire scan entry points from sell, search, and collection screens"
```

---

### Task 6: Desktop dashboard (deferred)

The spec calls for a desktop two-column dashboard with inline charts, expanded activity feed with card thumbnails, and portfolio sparklines. This is a separate task to implement after the mobile foundation is working. It will involve creating or modifying `desktop.jsx` or a new `desktop_dashboard.jsx`. Deferring this keeps the current PR focused and shippable.

---

### Task 7: Final verification and push

- [ ] **Step 1: Full build**

```bash
npm run build 2>&1
```

Expected: all 35 JSX files compile, both HTML files processed, `Build complete!`.

- [ ] **Step 2: Manual smoke test**

Open the local `dist/index.html` in a browser and verify:
1. Profile tab shows the new dashboard (balance card, status tiles, activity, collection, buylist)
2. Settings gear pushes the settings screen with account type, verification, payment methods, games
3. Tapping "Scan a card" on the sell tab opens the scan camera screen
4. Tapping the capture button shows the analyzing animation, then the result sheet
5. Result sheet shows card info, grade selector, market price, and context-aware action buttons
6. "Not the right card?" shows alternatives

- [ ] **Step 3: Push**

```bash
git push
```
