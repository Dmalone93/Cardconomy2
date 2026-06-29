# Trade Offers on Product Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show trade-only offers on the product detail page — collectors who have the card and want to swap it for a specific other card, no cash.

**Architecture:** Generate mock trade offers per product in `data.jsx` using the same deterministic hashing pattern as seller offers. Render them in `screen_product.jsx` as a new "Available to trade" section below buy offers, with purple-accented TradeOfferCard components.

**Tech Stack:** React (via window globals), inline styles, no build step changes.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `data.jsx` | Modify | Add TRADER_NAMES pool, generate `tradeOffers` array on each product object |
| `screen_product.jsx` | Modify | Add TradeOfferCard component, render "Available to trade" section |

---

### Task 1: Generate mock trade offers in data model (`data.jsx`)

**Files:**
- Modify: `data.jsx:773-876` (after SELLERS, inside PRODUCTS IIFE)
- Modify: `data.jsx:884-890` (window exports)

- [ ] **Step 1: Add TRADER_NAMES and TRADE_NOTES arrays after the LOCS array (after line 780)**

```javascript
const TRADER_NAMES = [
  'Jake_Collector', 'SlabKing_UK', 'PikaPal', 'CardVaultNZ',
  'GrailHunter', 'FoilFreak', 'MintCondition', 'TradeEmAll',
  'SleeveItUp', 'DeckMaster99',
];
const TRADE_NOTES = [
  'Happy to meet locally or ship insured.',
  'Looking to complete my set. Fair trades only.',
  'Will consider other offers too — message me.',
  'Chasing this card for a while. Graded preferred.',
  'Can add cash to balance if needed.',
  'Straight swap, both cards in similar condition.',
  'Open to negotiation. Let me know what you have.',
];
```

- [ ] **Step 2: Generate tradeOffers inside the PRODUCTS IIFE**

Inside the PRODUCTS IIFE, right before the `return` statement (before `return { id, game, ...`), add the trade offer generation logic. This goes after `const high = Math.max(...prices);` (line 858):

```javascript
    // Generate 0–2 mock trade offers
    const tradeOfferCount = h % 5 === 0 ? 0 : (h % 3 === 0 ? 2 : 1);
    const sameGameListings = LISTINGS.filter(l => l.game === first.game && l.id !== first.id);
    const tradeOffers = [];
    for (let ti = 0; ti < tradeOfferCount && sameGameListings.length > 0; ti++) {
      const tni = (h + ti * 9) % TRADER_NAMES.length;
      const tli = (h + ti * 13) % LOCS.length;
      const wantIdx = (h + ti * 7) % sameGameListings.length;
      const wantCard = sameGameListings[wantIdx];
      const tNoteIdx = (h + ti * 11) % TRADE_NOTES.length;
      const tRating = 95 + ((h + ti * 4) % 50) / 10; // 95.0–99.9
      const tTrades = 50 + (h + ti * 17) % 1200;
      tradeOffers.push({
        id: id + '-t' + (ti + 1),
        trader: TRADER_NAMES[tni],
        traderRating: Math.round(tRating * 10) / 10,
        traderTrades: tTrades,
        traderLoc: LOCS[tli],
        verified: tRating >= 98,
        wantCard: {
          name: wantCard.name,
          subtitle: wantCard.subtitle,
          art: wantCard.art,
          game: wantCard.game,
          condition: CONDITIONS[(h + ti) % 2 === 0 ? 0 : 1],
          gradePref: (h + ti) % 3 === 0 ? 'Graded preferred' : (h + ti) % 3 === 1 ? 'Raw OK' : 'Any',
        },
        note: TRADE_NOTES[tNoteIdx],
      });
    }
```

- [ ] **Step 3: Add tradeOffers and tradeCount to the product return object**

In the return object (starting at line 860), add `tradeOffers` and `tradeCount` after `offerCount`:

Change:
```javascript
      offerCount: offers.length,
    };
```

To:
```javascript
      offerCount: offers.length,
      tradeOffers,
      tradeCount: tradeOffers.length,
    };
```

- [ ] **Step 4: Commit and push**

```bash
git add data.jsx
git commit -m "feat: generate mock trade offers per product"
git push
```

---

### Task 2: Add trade offers section to product page (`screen_product.jsx`)

**Files:**
- Modify: `screen_product.jsx:4` (imports)
- Modify: `screen_product.jsx` (add TradeOfferCard component, render trade section)

- [ ] **Step 1: Add CardArt import**

At line 4, add `CardArt` to the destructured imports if not already present:

Change:
```javascript
const { T: TP, money: moneyP, CardArt: CardArtP, Sparkline: SparkP, Icon: IconP, Sheet: SheetP, Badge: BadgeP } = window;
```

This line already has `CardArt: CardArtP` — no change needed. Confirm and move on.

- [ ] **Step 2: Add TradeOfferCard component**

Add this component after the `OfferCard` function (after its closing `}` around line 92) and before `ProductScreen`:

```javascript
function TradeOfferCard({ trade, isFirst, onPropose }) {
  return (
    <div style={{ border: isFirst ? '1.5px solid #7c3aed' : '1px solid var(--line)', borderRadius: 4, padding: 14, marginBottom: 10, background: TP.surface, position: 'relative' }}>
      {/* trader info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999, background: '#7c3aed', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{trade.trader.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 13, color: TP.ink }}>{trade.trader}</span>
          {trade.verified && (
            <span style={{ marginLeft: 5, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 4,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>Verified</span>
          )}
          <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 1 }}>
            {trade.traderRating}% · {trade.traderTrades.toLocaleString()} trades · {trade.traderLoc}
          </div>
        </div>
      </div>

      {/* wants in return */}
      <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>Wants in return</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#faf5ff', borderRadius: 4, padding: 10 }}>
        <div style={{
          flexShrink: 0, width: 36, height: 50, background: trade.wantCard.art || '#334155', borderRadius: 3,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 4px, transparent 4px 8px)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, color: TP.ink }}>{trade.wantCard.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, marginTop: 1 }}>{trade.wantCard.subtitle}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, marginTop: 1 }}>
            Condition: {trade.wantCard.condition === 'Near Mint' ? 'NM+' : trade.wantCard.condition} · {trade.wantCard.gradePref}
          </div>
        </div>
      </div>

      {/* note */}
      {trade.note && (
        <div style={{ marginTop: 10, fontFamily: TP.sans, fontSize: 12, color: TP.ink2, fontStyle: 'italic', lineHeight: 1.4 }}>
          "{trade.note}"
        </div>
      )}

      {/* propose trade button */}
      <button onClick={onPropose} style={{
        width: '100%', marginTop: 12, background: 'none', border: '1.5px solid #7c3aed', color: '#7c3aed',
        padding: 10, borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 13,
      }}>Propose trade</button>
    </div>
  );
}
```

- [ ] **Step 3: Render the trade offers section in ProductScreen**

In the ProductScreen component, after the seller offers `</div>` (after line 196, the closing div of the seller offers section) and before the closing `</div>` of the scroll container (before line 197 `</div>`), add:

```javascript
        {/* trade offers */}
        {product.tradeOffers && product.tradeOffers.length > 0 && (
          <div style={{ padding: '0 16px', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>Available to trade</div>
              <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>{product.tradeCount} trader{product.tradeCount !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, marginBottom: 12, lineHeight: 1.4 }}>
              These collectors have this card and want to swap — no cash needed.
            </div>
            {product.tradeOffers.map((t, idx) => (
              <TradeOfferCard key={t.id} trade={t} isFirst={idx === 0}
                onPropose={() => { app.nav.push('trade'); app.toast('Opening trade builder'); }}
              />
            ))}
          </div>
        )}
```

- [ ] **Step 4: Verify the full flow**

1. Load the app in the browser
2. Navigate to a product page
3. Scroll past the buy offers — confirm "Available to trade" section appears with purple badge
4. Confirm trade cards show: trader info, wanted card with thumbnail, note, "Propose trade" button
5. Confirm some products have 0 trade offers (section hidden), some have 1, some have 2
6. Tap "Propose trade" — confirm it navigates to the trade screen

- [ ] **Step 5: Commit and push**

```bash
git add screen_product.jsx
git commit -m "feat: add trade offers section to product page"
git push
```
