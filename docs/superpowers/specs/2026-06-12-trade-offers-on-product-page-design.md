# Trade Offers on Product Page

## Summary

Add an "Available to trade" section to the product detail page, below the existing buy-now seller offers. Trade offers are card-for-card swaps with no price — each shows a trader who has the card and the specific card they want in return.

## Design

### Section Placement

Below the existing "Available from X sellers" buy-now section on `screen_product.jsx`, add a new "Available to trade" section. Separated by a heading with a purple "N traders" badge.

Intro text: "These collectors have this card and want to swap — no cash needed."

### Trade Offer Card

Each trade offer card contains:

- **Trader info row:** Avatar (purple circle with initial), trader name, stats (rating % + trade count + location), optional "Verified" badge
- **"Wants in return" block:** Purple-tinted background (`#faf5ff`) showing:
  - Card art thumbnail (small, 36x50)
  - Card name (bold)
  - Card details (subtitle, set)
  - Condition/grading preferences
- **Trader note:** Italic text with their message
- **"Propose trade" button:** Full-width, outlined purple (`#7c3aed`), navigates to trade screen

### Visual Distinction from Buy Offers

- Purple accent (`#7c3aed`) instead of dark/black for buy offers
- No price displayed anywhere
- Border color: first trade offer uses `1.5px solid #7c3aed`, rest use standard `1px solid var(--line)`
- Trader stats show "trades" not "sales"

### Data Model

**New: `TRADE_OFFERS` per product.** Generated in `data.jsx` alongside PRODUCTS. For each product, create 0-2 mock trade offers using deterministic hashing (same pattern as mock seller offers). Each trade offer:

```javascript
{
  id: 'p001-t1',
  trader: 'Jake_Collector',
  traderRating: 98.2,
  traderTrades: 340,
  traderLoc: 'Edinburgh',
  verified: true,
  wantCard: {                    // the card they want in return
    name: 'Mewtwo',
    subtitle: 'Holo · 1st Ed Shadowless',
    art: '#6d28d9',
    game: 'pkmn',
    condition: 'NM+',
    gradePref: 'Graded preferred',
  },
  note: 'Looking for a clean Mewtwo to complete my WOTC set.',
}
```

**Mock trader names pool:**

```javascript
const TRADER_NAMES = [
  'Jake_Collector', 'SlabKing_UK', 'PikaPal', 'CardVaultNZ',
  'GrailHunter', 'FoilFreak', 'MintCondition', 'TradeEmAll',
  'SleeveItUp', 'DeckMaster99',
];
```

The `wantCard` is picked from other LISTINGS in the same game (but different from the product being viewed), using deterministic hashing to keep it stable.

### Trade offer count on product

Add `tradeOffers` array and `tradeCount` to each product object so the product page can render them.

### "Propose trade" action

Tapping "Propose trade" navigates to `app.nav.push('trade')` (existing trade screen). For now this is a simple navigation — no pre-populated trade builder.

## Files to Create/Modify

| File | Action | What |
|------|--------|------|
| `data.jsx` | Modify | Add TRADER_NAMES pool, generate `tradeOffers` on each product, export helper |
| `screen_product.jsx` | Modify | Add "Available to trade" section below buy offers, render TradeOfferCard components |

## Out of Scope

- Pre-populating the trade builder with the specific card
- Connecting to real trade post data (TRADE_POSTS)
- Trade messaging or negotiation
- Filtering/sorting trade offers
