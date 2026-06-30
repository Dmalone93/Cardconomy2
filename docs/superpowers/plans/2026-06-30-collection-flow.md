# Collection Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded collection system with a real "add cards you own" flow — search/browse/scan to find a card, set condition/grade, record purchase price, and track P&L with condition-adjusted market values.

**Architecture:** New `cc_owned` localStorage array holds rich owned-card objects. Collections become folders referencing owned-card IDs. A new `screen_add_card.jsx` handles the 3-step add flow (find → condition → price). Existing collection display is updated to show condition badges and P&L. A migration function converts old bare-ID collections on first load.

**Tech Stack:** React 18 (in-browser Babel), inline styles, localStorage, no build step.

## Global Constraints

- Per-file theme aliases (e.g. `TW`, `TP`). Read each file's existing aliases before editing.
- No apostrophes in single-quoted JS strings — use `\u2019` or avoid contractions.
- All state is client-side (localStorage). No API calls.
- `window` globals for cross-file component/data sharing.
- No test framework — verification is visual (dev server + browser).
- Commit and push after each task.

---

### Task 1: Add Condition Multipliers + marketValue Helper to data.jsx

**Files:**
- Modify: `data.jsx` — add `CONDITION_MULTIPLIERS` object and `marketValue` function, export both on window

**Produces:**
- `window.CONDITION_MULTIPLIERS` — object mapping condition keys to multipliers
- `window.marketValue(ownedCard)` — returns condition-adjusted price in £ (number)

- [ ] **Step 1: Add condition multipliers and helper to data.jsx**

Find the end of the helper functions section in `data.jsx` (after the `postById` helper, before `TRADE_LISTINGS`). Add:

```javascript
const CONDITION_MULTIPLIERS = {
  'raw_DMG': 0.3, 'raw_HP': 0.5, 'raw_MP': 0.7, 'raw_LP': 0.85, 'raw_NM': 1.0,
  'cgc_8': 1.3, 'cgc_9': 1.6, 'cgc_9.5': 2.0,
  'bgs_9': 1.7, 'bgs_9.5': 2.2, 'bgs_10': 4.0,
  'psa_8': 1.4, 'psa_9': 1.8, 'psa_10': 3.0,
};

function marketValue(oc) {
  var card = byId(oc.cardId || oc.id);
  if (!card) return 0;
  var base = card.market || card.price || 0;
  if (oc.condition === 'graded' && oc.gradedCompany && oc.gradedScore != null) {
    var key = oc.gradedCompany + '_' + oc.gradedScore;
    return Math.round(base * (CONDITION_MULTIPLIERS[key] || 1) * 100) / 100;
  }
  if (oc.condition === 'raw' && oc.rawGrade) {
    var key2 = 'raw_' + oc.rawGrade;
    return Math.round(base * (CONDITION_MULTIPLIERS[key2] || 1) * 100) / 100;
  }
  return base;
}
```

Then add `CONDITION_MULTIPLIERS` and `marketValue` to the existing `Object.assign(window, { ... })` call at the end of `data.jsx`.

- [ ] **Step 2: Verify and commit**

Open browser console, confirm `window.marketValue({ cardId: 'l01', condition: 'graded', gradedCompany: 'psa', gradedScore: 10 })` returns approximately `1353` (451 × 3.0).

```bash
git add data.jsx
git commit -m "feat: add condition multipliers and marketValue helper"
git push
```

---

### Task 2: Add Owned Cards State + Migration Logic to app.jsx

**Files:**
- Modify: `app.jsx` — add `owned` state, migration from old format, new app methods, update existing collection methods

**Consumes:**
- `window.marketValue(ownedCard)` from Task 1

**Produces:**
- `app.owned` — array of owned card objects
- `app.addOwnedCard(cardId, condition, rawGrade, gradedCompany, gradedScore, paidPrice, collectionId)` — creates entry, adds to collection, returns owned card ID
- `app.removeOwnedCard(ownedId)` — removes entry from owned array and all collections
- `app.ownedIds()` — returns unique cardIds (backwards compat)
- `app.ownedByCard(cardId)` — returns all owned entries for a given card
- `app.getOwnedCard(ownedId)` — returns a single owned card by its oc_ id
- `app.portfolioValue()` — returns `{ total, costBasis, pnl }`

- [ ] **Step 1: Add migration function before the App component**

In `app.jsx`, after the `parseHash` function (~line 86) and before `function App()`, add:

```javascript
function migrateCollections(collections, existingOwned) {
  if (existingOwned && existingOwned.length > 0) return { collections: collections, owned: existingOwned };
  var owned = [];
  var needsMigration = false;
  var newCollections = collections.map(function(col) {
    var newCards = col.cards.map(function(cardId) {
      if (cardId && cardId.startsWith('oc_')) return cardId;
      needsMigration = true;
      var ocId = 'oc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      owned.push({ id: ocId, cardId: cardId, condition: 'raw', rawGrade: 'NM', gradedCompany: null, gradedScore: null, paidPrice: null, dateAdded: Date.now() });
      return ocId;
    });
    return { id: col.id, name: col.name, icon: col.icon, cards: newCards };
  });
  if (!needsMigration) return { collections: collections, owned: [] };
  return { collections: newCollections, owned: owned };
}
```

- [ ] **Step 2: Add owned state and migration to App component**

Inside `function App()`, after the `collections` state line (~99), add:

```javascript
const [owned, setOwned] = React.useState(() => {
  var existingOwned = loadJSON('cc_owned', null);
  var cols = loadJSON('cc_collections', DEFAULT_COLLECTIONS);
  var result = migrateCollections(cols, existingOwned);
  if (result.owned.length > 0 && !existingOwned) {
    localStorage.setItem('cc_owned', JSON.stringify(result.owned));
    localStorage.setItem('cc_collections', JSON.stringify(result.collections));
    setCollections(result.collections);
  }
  return result.owned.length > 0 ? result.owned : (existingOwned || []);
});
```

Add localStorage persistence after the existing `collections` useEffect (~148):

```javascript
React.useEffect(() => { localStorage.setItem('cc_owned', JSON.stringify(owned)); }, [owned]);
```

- [ ] **Step 3: Add new methods to the app object**

Inside the `app` object (after the existing collection methods, ~line 224), replace/update:

Replace `ownedIds`:
```javascript
ownedIds: () => [...new Set(owned.map(oc => oc.cardId))],
```

Add new methods:
```javascript
owned,
getOwnedCard: (ocId) => owned.find(oc => oc.id === ocId),
ownedByCard: (cardId) => owned.filter(oc => oc.cardId === cardId),
addOwnedCard: (cardId, condition, rawGrade, gradedCompany, gradedScore, paidPrice, collectionId) => {
  var ocId = 'oc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  var entry = { id: ocId, cardId: cardId, condition: condition || 'raw', rawGrade: rawGrade || 'NM', gradedCompany: gradedCompany || null, gradedScore: gradedScore != null ? gradedScore : null, paidPrice: paidPrice != null ? paidPrice : null, dateAdded: Date.now() };
  setOwned(o => [...o, entry]);
  if (collectionId) {
    setCollections(cs => cs.map(c => c.id === collectionId ? { ...c, cards: [...c.cards, ocId] } : c));
  }
  var card = byIdA(cardId);
  var label = card ? card.name : 'Card';
  if (condition === 'graded' && gradedCompany) label += ' (' + gradedCompany.toUpperCase() + ' ' + gradedScore + ')';
  else if (rawGrade) label += ' (Raw ' + rawGrade + ')';
  showToast('Added ' + label);
  return ocId;
},
removeOwnedCard: (ocId) => {
  setOwned(o => o.filter(oc => oc.id !== ocId));
  setCollections(cs => cs.map(c => ({ ...c, cards: c.cards.filter(id => id !== ocId) })));
  showToast('Card removed');
},
marketValue: window.marketValue,
portfolioValue: () => {
  var total = owned.reduce((s, oc) => s + (window.marketValue ? window.marketValue(oc) : 0), 0);
  var costBasis = owned.filter(oc => oc.paidPrice != null).reduce((s, oc) => s + oc.paidPrice, 0);
  return { total: total, costBasis: costBasis, pnl: total - costBasis };
},
```

- [ ] **Step 4: Update DEFAULT_COLLECTIONS to be empty**

Change the seed data so new users start with empty collections:

```javascript
const DEFAULT_COLLECTIONS = [
  { id: 'c1', name: 'Main Binder', icon: null, cards: [] },
  { id: 'c2', name: 'Graded Vault', icon: null, cards: [] },
];
```

- [ ] **Step 5: Verify and commit**

Open browser, check that existing collections are migrated (cards still appear). Check console for `app` object having `owned`, `addOwnedCard`, `portfolioValue`.

```bash
git add app.jsx
git commit -m "feat: add owned cards state with migration, marketValue, and portfolio methods"
git push
```

---

### Task 3: Build the Add Card Screen (3-step flow)

**Files:**
- Create: `screen_add_card.jsx` — 3-step add card flow
- Modify: `app.jsx` — register `AddCardScreen` in SCREENS
- Modify: `index.html` — add script tag

**Consumes:**
- `app.addOwnedCard(...)` from Task 2
- `window.marketValue(...)` from Task 1
- `window.LISTINGS`, `window.GAMES`, `window.SETS`, `window.byId`, `window.setById`, `window.gameById`
- `window.CONDITION_MULTIPLIERS` from Task 1

**Produces:**
- `window.AddCardScreen` — React component, receives `params.cardId` (optional, skips step 1) and `params.collectionId` (optional, pre-selects collection)

- [ ] **Step 1: Create screen_add_card.jsx**

```javascript
// ─────────────────────────────────────────────────────────────
// Add Card — 3-step flow: find card → set condition → price paid
// ─────────────────────────────────────────────────────────────
const { T: TAC, money: moneyAC, CardArt: CardArtAC, Icon: IconAC } = window;
const { LISTINGS: LISTINGS_AC, GAMES: GAMES_AC, SETS: SETS_AC, byId: byIdAC, setById: setByIdAC, gameById: gameByIdAC, marketValue: marketValueAC, CONDITION_MULTIPLIERS: CM_AC } = window;

const RAW_GRADES = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const GRADED_COMPANIES = ['psa', 'bgs', 'cgc'];
const GRADED_SCORES = [10, 9.5, 9, 8];

function AddCardScreen({ app, params = {} }) {
  var preCard = params.cardId ? byIdAC(params.cardId) : null;
  var preColId = params.collectionId || null;

  var [step, setStep] = React.useState(preCard ? 2 : 1);
  var [card, setCard] = React.useState(preCard);

  // step 1 state
  var [search, setSearch] = React.useState('');
  var [browseGame, setBrowseGame] = React.useState(null);
  var [browseSet, setBrowseSet] = React.useState(null);

  // step 2 state
  var [condType, setCondType] = React.useState('raw');
  var [rawGrade, setRawGrade] = React.useState('NM');
  var [gradedCompany, setGradedCompany] = React.useState('psa');
  var [gradedScore, setGradedScore] = React.useState(10);

  // step 3 state
  var [paidPrice, setPaidPrice] = React.useState('');
  var [colId, setColId] = React.useState(preColId || (app.collections[0] ? app.collections[0].id : null));

  function currentMarketValue() {
    if (!card) return 0;
    return marketValueAC({
      cardId: card.id,
      condition: condType,
      rawGrade: condType === 'raw' ? rawGrade : null,
      gradedCompany: condType === 'graded' ? gradedCompany : null,
      gradedScore: condType === 'graded' ? gradedScore : null,
    });
  }

  function doAdd() {
    var paid = paidPrice === '' ? null : parseFloat(paidPrice);
    app.addOwnedCard(
      card.id,
      condType,
      condType === 'raw' ? rawGrade : null,
      condType === 'graded' ? gradedCompany : null,
      condType === 'graded' ? gradedScore : null,
      paid,
      colId
    );
    app.nav.pop();
  }

  function goBack() {
    if (step === 1 || (step === 2 && preCard)) app.nav.pop();
    else if (step === 2) { setStep(1); setCard(null); }
    else setStep(2);
  }

  var stepTitles = { 1: 'Find a card', 2: 'Set condition', 3: 'Price paid' };

  // ── HEADER (shared) ──
  var header = (
    <div style={{ padding: '14px 14px 12px', background: TAC.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={goBack} style={{ color: TAC.ink }}>{IconAC.back({})}</button>
      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>{stepTitles[step]}</span>
      <span style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>Step {step} of 3</span>
    </div>
  );

  // ── STEP 1: Find card ──
  if (step === 1) {
    var searchResults = [];
    if (search.length >= 2) {
      var q = search.toLowerCase();
      searchResults = LISTINGS_AC.filter(function(l) {
        return l.name.toLowerCase().includes(q) || (l.subtitle || '').toLowerCase().includes(q);
      }).slice(0, 20);
    }

    var setsForGame = browseGame ? SETS_AC.filter(function(s) { return s.game === browseGame; }) : [];
    var cardsForSet = browseSet ? LISTINGS_AC.filter(function(l) { return l.set === browseSet; }) : [];

    function pickCard(c) {
      setCard(c);
      setStep(2);
      setSearch('');
      setBrowseGame(null);
      setBrowseSet(null);
    }

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
          {/* search */}
          <div style={{ padding: '14px 16px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TAC.surface2, borderRadius: 10, padding: '10px 12px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              {IconAC.search({ style: { color: TAC.faint, flexShrink: 0 } })}
              <input value={search} onChange={function(e) { setSearch(e.target.value); setBrowseGame(null); setBrowseSet(null); }}
                placeholder="Search by card name\u2026"
                style={{ flex: 1, fontFamily: TAC.sans, fontSize: 14, color: TAC.ink, background: 'transparent', border: 'none', outline: 'none' }} />
              {search && <button onClick={function() { setSearch(''); }} style={{ color: TAC.muted, fontSize: 18, lineHeight: 1 }}>\u00d7</button>}
            </div>
          </div>

          {/* search results */}
          {search.length >= 2 && (
            <div style={{ padding: '0 16px' }}>
              {searchResults.length === 0 ? (
                <div style={{ fontFamily: TAC.sans, fontSize: 13, color: TAC.muted, padding: '12px 0' }}>No cards found for \u201c{search}\u201d</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {searchResults.map(function(item) {
                    var setObj = setByIdAC(item.set);
                    return (
                      <button key={item.id} onClick={function() { pickCard(item); }}
                        style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: 10, display: 'flex', gap: 11, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                        <div style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}><CardArtAC item={item} w={44} radius={6} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>{setObj ? setObj.name.replace(/\s*\(.*\)/, '') : ''} {item.number ? '\u00b7 #' + item.number : ''}</div>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{moneyAC(item.market || item.price)}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* browse by game (when not searching) */}
          {!search && !browseGame && (
            <div style={{ padding: '4px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Browse by game</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GAMES_AC.filter(function(g) { return g && g.id; }).map(function(g) {
                  return (
                    <button key={g.id} onClick={function() { setBrowseGame(g.id); }}
                      style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15 }}>{g.name}</span>
                      {IconAC.chevron ? IconAC.chevron({ style: { color: TAC.faint } }) : <span style={{ color: TAC.faint }}>{'\u203A'}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* browse: sets for a game */}
          {browseGame && !browseSet && (
            <div style={{ padding: '4px 16px' }}>
              <button onClick={function() { setBrowseGame(null); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{'\u2190'} Back to games</button>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{(gameByIdAC(browseGame) || {}).name} \u2014 Sets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {setsForGame.map(function(s) {
                  return (
                    <button key={s.id} onClick={function() { setBrowseSet(s.id); }}
                      style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div>
                        <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{s.name.replace(/\s*\(.*\)/, '')}</div>
                        <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>{s.cards} cards \u00b7 {s.year}</div>
                      </div>
                      {IconAC.chevron ? IconAC.chevron({ style: { color: TAC.faint } }) : <span style={{ color: TAC.faint }}>{'\u203A'}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* browse: cards in a set */}
          {browseSet && (
            <div style={{ padding: '4px 16px' }}>
              <button onClick={function() { setBrowseSet(null); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{'\u2190'} Back to sets</button>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{(setByIdAC(browseSet) || {}).name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {cardsForSet.map(function(item) {
                  return (
                    <button key={item.id} onClick={function() { pickCard(item); }}
                      style={{ textAlign: 'center', background: TAC.surface, borderRadius: 10, padding: 8, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><CardArtAC item={item} w={80} radius={6} /></div>
                      <div style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontFamily: TAC.sans, fontSize: 10, color: TAC.muted }}>{moneyAC(item.market || item.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STEP 2: Set condition ──
  if (step === 2) {
    var mv = currentMarketValue();
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
          {/* card preview */}
          <div style={{ padding: '16px 16px 14px', display: 'flex', gap: 12, background: TAC.surface, borderBottom: '1px solid var(--line)' }}>
            <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtAC item={card} w={64} radius={8} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15 }}>{card.name}</div>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{card.subtitle}</div>
            </div>
          </div>

          {/* condition type toggle */}
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Condition type</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['raw', 'graded'].map(function(t) {
                var active = condType === t;
                return (
                  <button key={t} onClick={function() { setCondType(t); }}
                    style={{ flex: 1, padding: '14px 0', borderRadius: 12, fontFamily: TAC.sans, fontWeight: 700, fontSize: 15,
                      background: active ? 'var(--ink)' : TAC.surface,
                      color: active ? '#fff' : TAC.ink,
                      border: active ? 'none' : '1.5px solid var(--line)',
                      boxShadow: active ? 'none' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                    {t === 'raw' ? 'Raw' : 'Graded'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* raw grade chips */}
          {condType === 'raw' && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {RAW_GRADES.map(function(g) {
                  var active = rawGrade === g;
                  return (
                    <button key={g} onClick={function() { setRawGrade(g); }}
                      style={{ padding: '10px 18px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14,
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* graded: company + score */}
          {condType === 'graded' && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grading company</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {GRADED_COMPANIES.map(function(co) {
                  var active = gradedCompany === co;
                  return (
                    <button key={co} onClick={function() { setGradedCompany(co); }}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {co}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {GRADED_SCORES.map(function(sc) {
                  var active = gradedScore === sc;
                  return (
                    <button key={sc} onClick={function() { setGradedScore(sc); }}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 15,
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {sc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* market value preview */}
          <div style={{ padding: '0 16px', marginTop: 4 }}>
            <div style={{ background: 'var(--accent-wash)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: TAC.ink }}>
                {condType === 'graded' ? gradedCompany.toUpperCase() + ' ' + gradedScore : 'Raw ' + rawGrade} market value
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: TAC.ink }}>{moneyAC(mv)}</span>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TAC.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={function() { setStep(3); }}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TAC.sans, fontWeight: 700, fontSize: 16, background: 'var(--ink)', color: '#fff' }}>
            Next {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: Price paid + collection picker ──
  if (step === 3) {
    var mv3 = currentMarketValue();
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
          {/* card + condition summary */}
          <div style={{ padding: '16px 16px 14px', display: 'flex', gap: 12, background: TAC.surface, borderBottom: '1px solid var(--line)' }}>
            <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtAC item={card} w={54} radius={6} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{card.name}</div>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted, marginTop: 2 }}>
                {condType === 'graded' ? gradedCompany.toUpperCase() + ' ' + gradedScore : 'Raw ' + rawGrade}
                {' \u00b7 Market: '}{moneyAC(mv3)}
              </div>
            </div>
          </div>

          {/* price input */}
          <div style={{ padding: '20px 16px 12px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 10 }}>What did you pay?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TAC.surface, borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <span style={{ fontFamily: TAC.sans, fontSize: 24, fontWeight: 700 }}>\u00a3</span>
              <input type="number" value={paidPrice} onChange={function(e) { setPaidPrice(e.target.value); }}
                placeholder="Optional"
                style={{ flex: 1, fontFamily: TAC.sans, fontSize: 24, fontWeight: 700, color: TAC.ink, background: 'transparent', border: 'none', outline: 'none' }} />
            </div>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted, marginTop: 8 }}>
              Current market value: {moneyAC(mv3)}
            </div>
            {paidPrice !== '' && (
              <button onClick={function() { setPaidPrice(''); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>
                Skip \u2014 I don\u2019t remember
              </button>
            )}
          </div>

          {/* collection picker */}
          <div style={{ padding: '8px 16px 16px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Add to collection</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {app.collections.map(function(c) {
                var active = colId === c.id;
                return (
                  <button key={c.id} onClick={function() { setColId(c.id); }}
                    style={{ padding: '10px 16px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 600, fontSize: 13,
                      background: active ? 'var(--ink)' : TAC.surface,
                      color: active ? '#fff' : TAC.ink,
                      border: active ? 'none' : '1.5px solid var(--line)' }}>
                    {c.name}
                  </button>
                );
              })}
              <button onClick={function() {
                var name = window.prompt && window.prompt('New collection name', '');
                if (name && name.trim()) {
                  var newId = app.addCollection(name.trim());
                  setColId(newId);
                }
              }} style={{ padding: '10px 16px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)', border: '1.5px dashed var(--line)', background: 'transparent' }}>
                + New
              </button>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TAC.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={doAdd} disabled={!colId}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TAC.sans, fontWeight: 700, fontSize: 16,
              background: colId ? 'var(--ink)' : TAC.surface2,
              color: colId ? '#fff' : TAC.muted }}>
            Add to collection
          </button>
        </div>
      </div>
    );
  }

  return null;
}

Object.assign(window, { AddCardScreen });
```

- [ ] **Step 2: Register in app.jsx and index.html**

In `app.jsx`, add import:
```javascript
const { AddCardScreen } = window;
```

Add to SCREENS:
```javascript
add_card: AddCardScreen,
```

In `index.html`, add before `app.jsx` script tag:
```html
<script type="text/babel" src="screen_add_card.jsx"></script>
```

- [ ] **Step 3: Verify and commit**

Navigate to `#add_card` in browser. Test: search for a card → pick condition → enter price → add to collection. Verify toast appears. Check localStorage `cc_owned` has new entry.

```bash
git add screen_add_card.jsx app.jsx index.html
git commit -m "feat: add 3-step add-card screen (find, condition, price)"
git push
```

---

### Task 4: Update Collection Display for Owned Card Objects

**Files:**
- Modify: `screen_watchlist.jsx` — update `valueOf`, `CollectionDetailScreen`, `AddCardsSheet`, and portfolio header to use owned card objects

**Consumes:**
- `app.owned`, `app.getOwnedCard(ocId)`, `app.marketValue(oc)`, `app.portfolioValue()` from Task 2
- `window.byId(cardId)` for catalogue lookups

- [ ] **Step 1: Update valueOf function**

Replace the existing `valueOf` function (lines 14-22) with:

```javascript
function valueOf(ocIds, appRef) {
  var entries = ocIds.map(function(ocId) {
    var oc = appRef ? appRef.getOwnedCard(ocId) : null;
    if (!oc) {
      var card = byIdW(ocId);
      return card ? { market: card.market || card.price || 0, history: card.history } : null;
    }
    var card = byIdW(oc.cardId);
    var mv = window.marketValue ? window.marketValue(oc) : (card ? card.market || card.price || 0 : 0);
    return { market: mv, history: card ? card.history : null, oc: oc, card: card };
  }).filter(Boolean);
  var now = entries.reduce(function(s, e) { return s + e.market; }, 0);
  var then = entries.reduce(function(s, e) { return s + (e.history ? e.history[0] * (e.market / (e.card ? e.card.market || e.card.price || 1 : 1)) : e.market); }, 0);
  var series = entries[0] && entries[0].history
    ? entries[0].history.map(function(_, i) { return entries.reduce(function(s, e) { return s + (e.history ? e.history[i] * (e.market / (e.card ? e.card.market || e.card.price || 1 : 1)) : e.market); }, 0); })
    : [];
  var cards = entries.map(function(e) { return e.card || e; }).filter(Boolean);
  return { cards: cards, entries: entries, now: now, then: then, series: series };
}
```

- [ ] **Step 2: Update CollectionDetailScreen card list rendering**

Replace the card list rendering block (the `v.cards.map` section, ~lines 828-900) to resolve owned card objects. The key change is that each card in the list is now an owned card with condition info:

In the non-select-mode branch, change the row to show condition badge and P&L from purchase price. Find the existing row rendering and update it to:
- Resolve the owned card via `app.getOwnedCard(ocId)`, then the catalogue card via `byIdW(oc.cardId)`
- Show a condition badge (e.g. "PSA 10", "Raw NM") below the set name
- Calculate P&L using `app.marketValue(oc)` vs `oc.paidPrice`
- Keep the trade toggle and delete button

For the `v.cards.map` loop, change the mapping to use `col.cards` directly (owned card IDs), resolving each:

```javascript
{col.cards.map(function(ocId) {
  var oc = app.getOwnedCard(ocId);
  var item = oc ? byIdW(oc.cardId) : byIdW(ocId);
  if (!item) return null;
  var currentVal = oc && window.marketValue ? window.marketValue(oc) : (item.market || item.price);
  var purchaseVal = oc && oc.paidPrice != null ? oc.paidPrice : currentVal;
  var gainAbs = currentVal - purchaseVal;
  var gainPct = purchaseVal > 0 ? ((gainAbs / purchaseVal) * 100).toFixed(0) : 0;
  var gainUp = gainAbs >= 0;
  var condLabel = oc ? (oc.condition === 'graded' ? (oc.gradedCompany || '').toUpperCase() + ' ' + oc.gradedScore : 'Raw ' + (oc.rawGrade || 'NM')) : '';
  var isSel = selected.includes(ocId);
```

Then in the display, add the condition label after the set name:
```javascript
<div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted }}>
  {setByIdW(item.set)?.name?.replace(/\s*\(.*\)/,'')}
  {condLabel ? ' \u00b7 ' + condLabel : ''}
</div>
```

Update the trade toggle and delete to use `ocId` instead of `item.id`:
```javascript
app.toggleTradeable(ocId)
app.isOpenToTrade(ocId)
app.removeOwnedCard(ocId)  // instead of app.removeCardFromCollection
```

- [ ] **Step 3: Update AddCardsSheet to launch add_card screen**

Replace the `AddCardsSheet` function body to simply launch the new add card screen:

```javascript
function AddCardsSheet({ app, col, onClose }) {
  React.useEffect(function() {
    onClose();
    app.nav.push('add_card', { collectionId: col.id });
  }, []);
  return null;
}
```

- [ ] **Step 4: Update portfolio header in WatchScreen**

In the WatchScreen's collection tab portfolio header (~line 114), update to use `app.portfolioValue()`:

Find the portfolio value display and update it to show cost basis and P&L:
```javascript
var pv = app.portfolioValue();
```

Use `pv.total` for the total value, and add a P&L line:
```javascript
{pv.costBasis > 0 && (
  <div style={{ fontFamily: TW.sans, fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>
    Cost basis: {moneyW(pv.costBasis)} \u00b7 P&L: {pv.pnl >= 0 ? '+' : ''}{moneyW(pv.pnl)}
  </div>
)}
```

- [ ] **Step 5: Update valueOf calls to pass app reference**

Find all calls to `valueOf(col.cards)` in `screen_watchlist.jsx` and update them to `valueOf(col.cards, app)`.

- [ ] **Step 6: Verify and commit**

Add a card via the add flow, verify it appears in the collection with condition badge and P&L. Verify portfolio value sums correctly.

```bash
git add screen_watchlist.jsx
git commit -m "feat: update collection display for owned card objects with condition and P&L"
git push
```

---

### Task 5: Add "I Own This" Entry Points

**Files:**
- Modify: `screen_listing.jsx` — add "I own this" button
- Modify: `screen_product.jsx` — add "I own this" button
- Modify: `screen_scan.jsx` — update "Add to collection" to use new flow

**Consumes:**
- `add_card` screen registration from Task 3

- [ ] **Step 1: Add "I own this" to listing screen**

In `screen_listing.jsx`, find a suitable spot (near the watchlist/trade buttons area). Add:

```javascript
<button onClick={() => app.nav.push('add_card', { cardId: item.id })} style={{
  padding: '6px 12px', borderRadius: 8, background: 'transparent', color: 'var(--ink)',
  fontFamily: TL.sans, fontWeight: 600, fontSize: 12, border: '1px solid var(--line)', flexShrink: 0 }}>I own this</button>
```

- [ ] **Step 2: Add "I own this" to product screen**

In `screen_product.jsx`, find the action buttons area. Add an "I own this" button. Read the file first to find the right location — look for the existing buy/trade buttons:

```javascript
<button onClick={() => app.nav.push('add_card', { cardId: product.offers[0].listingId || product.id })} style={{
  width: '100%', padding: 12, borderRadius: 12, fontFamily: TP.sans, fontWeight: 700, fontSize: 14,
  background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--line)', marginTop: 8 }}>I own this</button>
```

- [ ] **Step 3: Update scan screen "Add to collection"**

In `screen_scan.jsx`, replace the `doAddToCollection` function (~line 53):

```javascript
function doAddToCollection() {
  if (card) {
    app.nav.pop();
    app.nav.push('add_card', { cardId: card.id });
  }
}
```

- [ ] **Step 4: Verify and commit**

Test each entry point: listing → "I own this" → add flow, product → "I own this" → add flow, scan → result → "Add to collection" → add flow.

```bash
git add screen_listing.jsx screen_product.jsx screen_scan.jsx
git commit -m "feat: add I-own-this entry points on listing, product, and scan screens"
git push
```

---

### Task 6: Update Trade Propose Screen for Owned Card Objects

**Files:**
- Modify: `screen_trade_propose.jsx` — use owned card objects instead of bare listing IDs for the user's offer

**Consumes:**
- `app.owned`, `app.getOwnedCard()`, `app.marketValue()` from Task 2

- [ ] **Step 1: Update card selection source**

In `screen_trade_propose.jsx`, replace the `ownedIds` and `tradeableFirst` logic (~lines 35-40):

```javascript
const ownedCards = app.owned;
const tradeableFirst = [...ownedCards].sort((a, b) => {
  const aT = app.isOpenToTrade(a.id) ? 0 : 1;
  const bT = app.isOpenToTrade(b.id) ? 0 : 1;
  return aT - bT;
});
```

- [ ] **Step 2: Update value calculations**

Update `giveVal` to use `marketValue`:

```javascript
const giveVal = selIds.reduce((s, ocId) => {
  const oc = app.getOwnedCard(ocId);
  return s + (oc ? (window.marketValue ? window.marketValue(oc) : 0) : 0);
}, 0);
```

- [ ] **Step 3: Update card picker rendering**

Update the `tradeableFirst.map` to iterate over owned card objects and render with condition badges. Each card tile should use `oc.id` as the key and selection ID, resolve the catalogue card via `byIdP(oc.cardId)`, and show a condition label:

```javascript
{tradeableFirst.map(oc => {
  const c = byIdP(oc.cardId);
  if (!c) return null;
  const isSel = !!selected[oc.id];
  const isTradeable = app.isOpenToTrade(oc.id);
  const condLabel = oc.condition === 'graded' ? (oc.gradedCompany || '').toUpperCase() + ' ' + oc.gradedScore : 'Raw ' + (oc.rawGrade || 'NM');
  return (
    <button key={oc.id} onClick={() => toggleCard(oc.id)} style={{ flexShrink: 0, width: 90, textAlign: 'left', position: 'relative' }}>
      ...existing card art and badges...
      <div style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 11, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
      <div style={{ fontFamily: TP.sans, fontSize: 9, color: TP.muted }}>{condLabel}</div>
      <div style={{ fontFamily: TP.sans, fontSize: 10.5, color: TP.muted }}>{moneyP(window.marketValue ? window.marketValue(oc) : c.market || c.price)}</div>
    </button>
  );
})}
```

- [ ] **Step 4: Update summary sections**

In the selected summary strip and the sent/confirmed trade summaries, resolve selected cards via `app.getOwnedCard(ocId)` then `byIdP(oc.cardId)` for display.

- [ ] **Step 5: Verify and commit**

Add cards to collection via the add flow, then go to trade browse → propose. Verify your owned cards appear with condition badges and correct values.

```bash
git add screen_trade_propose.jsx
git commit -m "feat: update trade propose to use owned card objects with condition values"
git push
```
