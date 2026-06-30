# Trade Flow Redesign — Card-Focused Discovery + Lean Proposal

**Date:** 2026-06-30

## Problem

The current trade system has a full-featured builder (7 phases), but the entry points are disconnected. Tapping "Propose trade" on a listing dumps you into a generic trade hub with no context. There's no way to browse cards specifically available for trade, no distance filtering, and the proposal flow bundles meetup logistics before the other party has even seen the offer.

## Design Principles

- **Card-focused, not people-focused.** Users browse tradeable cards, not trader profiles. Trust signals (rating, trade count) are secondary info on each card tile.
- **Lowest friction to list.** Toggle a card as tradeable from your collection — no form, no preferences, no posting flow.
- **Agree on the swap first.** Meetup logistics only happen after both sides accept the trade. No point picking a location if you can't agree on cards.
- **Distance is per-session.** Users set how far they're willing to travel each time they browse, not as a global preference.

---

## 1. Marking Cards for Trade (Collection Screen)

### Behaviour
- Each card in the user's collection gets an "open to trade" toggle
- Toggling on makes the card visible in the trade marketplace
- Toggling off removes it immediately
- No conditions, preferences, or forms — binary on/off
- A small trade icon/badge appears on the card tile when active

### Data
- New state: `tradeableCards` — array of card IDs marked as open to trade
- Persisted in localStorage (`cc_tradeable`)
- Cards remain in collection view as normal; the toggle is additive

### UI
- Toggle control on the card detail view within collection
- Subtle trade badge on collection grid tiles for cards marked tradeable
- Count indicator somewhere in collection header: "X cards open to trade"

---

## 2. Trade Browse (New Screen: `trade_browse`)

### Purpose
The trade marketplace — a dedicated screen for discovering cards available for trade from other users nearby.

### Layout

**Top: Distance Control**
- Horizontal slider or segmented control: 5 / 10 / 25 / 50 miles
- Default: 10 miles
- Changing distance filters the results in real time
- Show count of available cards at current distance

**Search + Filters**
- Search bar: card name, set name
- Filter chips: by game (Pok\u00e9mon, MTG, Yu-Gi-Oh, One Piece, Digimon), condition, price range
- Same filter UX as existing search screen for consistency

**Card Grid**
- Standard card grid (same tile style as browse/search)
- Each tile shows:
  - Card art (CardArt component, same as elsewhere)
  - Card name + subtitle (set, rarity)
  - Estimated market value
  - **Trader row:** avatar initial + name + distance (e.g. "Marcus T. \u00b7 2.3 mi")
  - **Trust signals:** trade count + rating (e.g. "84 trades \u00b7 99%")
- Tapping a tile navigates to the standard listing detail screen

**Empty State**
- "No cards available for trade within X miles"
- Suggestion to increase distance or mark your own cards as tradeable

### Navigation Entry Points
- Bottom nav tab or side menu item: "Trade"
- Home screen action card: "Trade card-for-card"
- Listing detail: "Propose Trade" button (goes to proposal flow, not browse)

---

## 3. Propose Trade (New Flow: `trade_propose`)

Triggered when a user taps "Propose Trade" on a card they want. This is a focused, 2-step flow.

### Step 1: Build the Swap

**Top Section: Card You Want**
- The card from the listing, displayed prominently (card art + name + market value)
- Locked in — not editable (this is what you're proposing to get)
- Trader info row: name, distance, trust signals

**Middle Section: Your Offer**
- Horizontal scrollable row of your collection
- Cards marked "open to trade" appear first with a subtle highlight/badge
- All other owned cards available below or after
- Tap to select/deselect (multi-select with visual checkmark)
- Selected cards appear in a "Your offer" summary strip

**Cash Top-Up (Optional)**
- "Add cash to balance" toggle/button
- Input field for amount (\u00a3)
- Can be offered by either side (you add cash, or you request cash)

**Fairness Indicator**
- Simple visual bar showing value split (your offer vs their card)
- Total values displayed: "Your offer: \u00a3XX \u00b7 Their card: \u00a3XX"
- No blocking — users can send unbalanced trades if they want
- Suggested cash amount shown when unbalanced: "Add \u00a3X to even it out"

**Action**
- Button: "Send proposal \u2192"
- Disabled until at least one card is selected

### Step 2: Proposal Sent / Negotiation

**Sent State**
- Confirmation screen: "Trade proposed!"
- Summary card showing: what you offered \u2194 what you want
- Status: "Waiting for [Trader] to respond"

**Negotiation (Other User's Response)**
The recipient can:
- **Accept** \u2014 trade agreed, moves to meetup arrangement
- **Decline** \u2014 trade cancelled, proposer notified
- **Counter** \u2014 adjust which cards/cash, send back a modified proposal

Counter-offers bounce back and forth until both accept or someone declines. Each counter shows a clear diff of what changed.

---

## 4. Arrange Meetup (Post-Acceptance: `trade_meetup`)

Only triggered after both users accept the card swap. This is the existing meetup flow, simplified.

### Location Selection
- **LGS suggestions:** shops with `tradeHub: true`, sorted by midpoint distance between both traders
- Each shop shows: name, address, distance for you, distance for them, hours
- **Public meetup spots:** curated safe locations (library, shopping centre, etc.)
- **Custom location:** free text input for suggesting somewhere else

### Confirmation
- Both users must confirm the same location
- If one user suggests and the other counters, simple back-and-forth (same as current `sent` phase negotiation)
- Once agreed: "Trade locked in!" with location, date/time, and trade summary

### Safety
- ID verification badge if both users verified
- Safe trade checklist (well-lit area, bring a friend, meet at LGS if possible)

---

## 5. Screen Map + Navigation

```
Collection
  \u2514\u2500 Toggle card as tradeable

Trade Browse (trade_browse)
  \u2514\u2500 Distance slider + filters
  \u2514\u2500 Card grid with trust signals
  \u2514\u2500 Tap card \u2192 Listing Detail

Listing Detail
  \u2514\u2500 "Propose Trade" button
      \u2514\u2500 trade_propose (Step 1: Build swap)
          \u2514\u2500 trade_propose (Step 2: Sent / Negotiation)
              \u2514\u2500 On mutual accept \u2192 trade_meetup
                  \u2514\u2500 Location negotiation
                  \u2514\u2500 Trade confirmed
```

---

## 6. Data Requirements

### New State
| Key | Type | Storage | Purpose |
|-----|------|---------|---------|
| `cc_tradeable` | string[] (card IDs) | localStorage | Cards marked open to trade |
| `cc_trade_radius` | number (miles) | session only | Current browse distance filter |

### Existing Data Used
- `LISTINGS` / `byId` — card data and market values
- `OWNED_REFS` — user's collection
- `SHOPS` (filtered by `tradeHub: true`) — LGS meetup locations
- `TRADERS` — trader profiles (name, rating, deals, distance)

### New Mock Data Needed
- Tradeable listings from other users (card + trader reference + distance)
- Could extend existing `TRADE_POSTS` or create a new `TRADE_LISTINGS` array

---

## 7. Files to Modify

| File | Change |
|------|--------|
| `screen_trade.jsx` | Replace or heavily refactor — new trade_browse and trade_propose screens |
| `data.jsx` | Add `TRADE_LISTINGS` mock data (cards available for trade with trader refs) |
| `app.jsx` | Register new screens, update nav routing |
| `components.jsx` | Add trade badge component for collection tiles, update side menu |
| `screen_listing.jsx` | Update "Propose Trade" button to navigate to `trade_propose` with card context |
| `screen_home.jsx` | Update "Trade card-for-card" action card to navigate to `trade_browse` |
| `screen_account.jsx` (collection) | Add "open to trade" toggle on card tiles |

---

## 8. What Gets Removed / Replaced

The current trade system's `matches` and `board` phases are replaced by the new `trade_browse` screen. The `post` and `posted` phases are replaced by the collection toggle. The `build` phase becomes `trade_propose` Step 1. The `meetup` and `sent` phases are preserved but only triggered post-acceptance.

| Current Phase | New Equivalent |
|---------------|---------------|
| `matches` | Replaced by `trade_browse` |
| `board` | Replaced by `trade_browse` |
| `post` / `posted` | Replaced by collection toggle |
| `build` | `trade_propose` Step 1 |
| `meetup` | `trade_meetup` (post-acceptance only) |
| `sent` | `trade_propose` Step 2 (negotiation) |

---

## 9. What Does Not Change

- Card data model (LISTINGS, CardArt, market values)
- LGS/shop data and tradeHub filtering
- ID verification system
- Desktop trade view (will need updating separately in a future pass)
- Core UI components (Slab, Chip, GradeChip, etc.)
