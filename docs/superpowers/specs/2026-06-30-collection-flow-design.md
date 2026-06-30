# Collection Flow — Add Cards to Your Profile

**Date:** 2026-06-30

## Problem

The current collection system stores bare listing IDs with no concept of ownership context. Users never "add" cards they own — the collections are seeded with hardcoded data. There's no way to specify condition, grade, or purchase price. This makes portfolio tracking meaningless and breaks downstream features like trading (you can't trade cards that don't feel like yours).

## Design Principles

- **Your collection, your cards.** Every card in your collection is one you explicitly added. No seed data.
- **Condition matters.** A PSA 10 Charizard and a raw LP Charizard are different things with different values.
- **Multiple copies are normal.** Collectors own duplicates — each copy is its own entry.
- **Low friction to add.** Search, browse, or scan. Three taps to add a card.
- **P&L is the payoff.** Tracking what you paid vs current market value is why people use portfolio trackers.

---

## 1. Data Model

### Owned Card Entry

Each card in the user's collection is stored as a rich object:

```javascript
{
  id: 'oc_1719756000000',  // unique ID (oc_ + timestamp + random)
  cardId: 'l01',            // reference to catalogue card (LISTINGS id)
  condition: 'graded',      // 'raw' | 'graded'
  rawGrade: null,           // 'NM' | 'LP' | 'MP' | 'HP' | 'DMG' (when condition === 'raw')
  gradedCompany: 'psa',     // 'psa' | 'bgs' | 'cgc' (when condition === 'graded')
  gradedScore: 10,          // numeric grade (when condition === 'graded')
  paidPrice: 320,           // what the user paid in £ (null if skipped)
  dateAdded: 1719756000000, // timestamp
}
```

### Storage

- Array of owned card objects stored in localStorage key `cc_owned`
- Replaces the current `cards: ['l03', 'l07']` arrays inside collection objects
- Collections become organisational folders that reference owned card IDs: `cards: ['oc_123', 'oc_456']`

### Market Value by Condition

Market value is derived from the catalogue card's base `market` price with condition multipliers:

| Condition | Multiplier |
|-----------|-----------|
| Raw DMG | 0.3x |
| Raw HP | 0.5x |
| Raw MP | 0.7x |
| Raw LP | 0.85x |
| Raw NM | 1.0x |
| CGC 8 | 1.3x |
| CGC 9 | 1.6x |
| CGC 9.5 | 2.0x |
| BGS 9 | 1.7x |
| BGS 9.5 | 2.2x |
| BGS 10 | 4.0x |
| PSA 8 | 1.4x |
| PSA 9 | 1.8x |
| PSA 10 | 3.0x |

Helper function: `marketValue(ownedCard)` returns the adjusted price. Falls back to base `market` price if condition is unrecognised.

---

## 2. Add Card Flow

### Entry Points

1. **Collection screen** — "Add cards" button opens the add flow
2. **Browse by set** — navigating game → set → card, with an "I own this" action
3. **Scan** — existing scan feature, result sheet includes "Add to collection"
4. **Listing/product detail** — "I own this" button on any card detail screen

All entry points lead to the same 3-step add flow (step 1 may be skipped if the card is already identified).

### Step 1: Find the Card

A search screen specific to adding cards.

**Search bar** at the top — type card name, shows matching results from the full catalogue (LISTINGS).

**Browse shortcut** — below search, show game tiles (Pokémon, MTG, Yu-Gi-Oh, One Piece, Digimon). Tapping a game shows its sets, tapping a set shows its cards. This reuses existing game/set data.

**Recent additions** — below browse, show the last 3-5 cards the user added (for quick re-add of duplicates).

**Result tiles** — each result shows card art, name, set, and base market price. Tapping a result advances to Step 2.

**Skipped when:** user comes from a listing detail or scan result (card already identified).

### Step 2: Set Condition

A single screen with two sections:

**Condition type toggle** — "Raw" or "Graded" (two large tappable buttons, default Raw)

**If Raw:** row of chips — NM (default, pre-selected), LP, MP, HP, DMG

**If Graded:**
- Company chips — PSA (default), BGS, CGC
- Grade input — number input or preset chips for common grades (10, 9.5, 9, 8)

**Market value preview** — shows the condition-adjusted market value live as the user picks condition. e.g. "PSA 10 market value: £1,353.00"

**Button:** "Next →"

### Step 3: What Did You Pay?

**Price input** — £ input field with large font. Placeholder shows "Optional".

**Reference line** — "Current market value: £1,353.00" shown below the input for context.

**Skip option** — "Skip — I don't remember" link below the input. Sets `paidPrice` to null.

**Collection picker** — dropdown or chips to choose which collection folder to add to. Defaults to first collection. Option to create new collection inline.

**Button:** "Add to collection"

**Confirmation** — toast: "Added Charizard ex (PSA 10) to Main Binder"

---

## 3. Collection Display Changes

### Owned Card Row

Each row in a collection now shows:

- Card art thumbnail
- Card name + set name
- Condition badge (e.g. "PSA 10", "Raw NM", "BGS 9.5")
- Market value (condition-adjusted)
- P&L: gain/loss vs purchase price in £ and % (if purchase price was provided)
- "Trade" toggle (existing, from trade flow work)

### Multiple Copies

If a user owns two Charizard ex cards, they appear as two separate rows — one might be PSA 10 at £1,353 and another Raw NM at £451. Each has its own P&L.

### Collection Value

Total collection value sums all condition-adjusted market values. The sparkline and delta use the adjusted values.

### Portfolio Summary

The portfolio header (Watch tab) shows:
- Total value across all collections (condition-adjusted)
- Total cost basis (sum of all paidPrice where not null)
- Overall P&L

---

## 4. Migration from Current System

The current system stores `cards: ['l03', 'l07']` (bare listing IDs) inside collection objects. Migration:

- On first load with old data format, convert each bare ID to an owned card object with `condition: 'raw'`, `rawGrade: 'NM'`, `paidPrice: null`
- This happens once, transparently
- New owned cards array is saved to `cc_owned`
- Collection objects are updated to reference the new owned card IDs

---

## 5. State Management (app.jsx)

### New State

| Key | Type | Storage | Purpose |
|-----|------|---------|---------|
| `cc_owned` | OwnedCard[] | localStorage | All owned card entries |

### New Methods on App Object

| Method | Purpose |
|--------|---------|
| `app.owned` | Array of all owned card objects |
| `app.addOwnedCard(cardId, condition, rawGrade, gradedCompany, gradedScore, paidPrice, collectionId)` | Create owned card entry, add to collection |
| `app.removeOwnedCard(ownedId)` | Remove an owned card entry |
| `app.ownedIds()` | Returns unique cardIds across all owned cards (backwards compat) |
| `app.ownedByCard(cardId)` | Returns all owned entries for a given catalogue card |
| `app.marketValue(ownedCard)` | Returns condition-adjusted market value |
| `app.portfolioValue()` | Returns total portfolio value, cost basis, and P&L |

### Changes to Existing Methods

- `addCardToCollection` / `removeCardFromCollection` now work with owned card IDs (`oc_xxx`) not listing IDs
- `collections[].cards` stores owned card IDs instead of listing IDs
- `isOpenToTrade` / `toggleTradeable` work with owned card IDs

---

## 6. Screen Map

```
Collection Screen (Watch tab)
  └─ "Add cards" button
      └─ Add Card Flow
          ├─ Step 1: Find card (search / browse by game+set / recent)
          ├─ Step 2: Set condition (raw/graded + grade)
          └─ Step 3: Price paid + collection picker → Added

Listing / Product Detail
  └─ "I own this" button
      └─ Add Card Flow (Step 1 skipped, card pre-filled)

Scan Screen
  └─ "Add to collection" in result sheet
      └─ Add Card Flow (Step 1 skipped, card pre-filled)

Browse (game → set → card)
  └─ "I own this" on card detail
      └─ Add Card Flow (Step 1 skipped, card pre-filled)
```

---

## 7. Files to Modify

| File | Change |
|------|--------|
| `app.jsx` | New `owned` state, migration logic, new app methods, update collection methods |
| `data.jsx` | Add `CONDITION_MULTIPLIERS` constant, `marketValue` helper |
| `screen_watchlist.jsx` | Update CollectionDetailScreen to use owned card objects, update valueOf, update AddCardsSheet to launch add flow |
| New: `screen_add_card.jsx` | The 3-step add card flow (find → condition → price) |
| `screen_listing.jsx` | Add "I own this" button |
| `screen_product.jsx` | Add "I own this" button |
| `screen_scan.jsx` | Wire "Add to collection" action to new add flow |
| `screen_trade_propose.jsx` | Update to use owned card objects instead of bare listing IDs |
| `screen_trade_browse.jsx` | No changes needed (shows other users' cards) |
| `index.html` | Add script tag for screen_add_card.jsx |

---

## 8. What Does Not Change

- Card catalogue data (LISTINGS, SETS, GAMES)
- CardArt component (still renders from catalogue data via cardId)
- Collection folders concept (still named buckets, just reference owned card IDs now)
- Trade browse screen (shows other users' cards, unrelated to your collection)
- Desktop views (updated separately in a future pass)

---

## 9. What Gets Replaced

| Current | New |
|---------|-----|
| `collections[].cards = ['l03', 'l07']` (listing IDs) | `collections[].cards = ['oc_123', 'oc_456']` (owned card IDs) |
| `ownedIds()` returns listing IDs | `ownedIds()` returns unique catalogue cardIds (same interface, different source) |
| `valueOf()` uses `card.market` directly | `valueOf()` uses `marketValue(ownedCard)` with condition multiplier |
| AddCardsSheet (tap from list) | 3-step add flow (search/browse → condition → price) |
| Seed data in DEFAULT_COLLECTIONS | Empty collections on first load (user adds their own cards) |
