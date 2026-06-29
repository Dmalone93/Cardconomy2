# Seller Storefront & Free Shipping Upsell

## Summary

Two connected features: (1) an online seller storefront screen accessible from the product page, and (2) a non-intrusive toast upsell prompting users to add more items from the same seller to qualify for free shipping.

## Feature 1: Seller Storefront Screen

### Entry Points

- **Offer card seller name** — the seller name (e.g. "VaultCards") on each offer card in `screen_product.jsx` becomes a tappable link (blue, underlined) that navigates to `app.nav.push('seller', { name: sellerName })`.
- **"View all X listings" link** — a secondary text link below each offer card's shipping info row, e.g. "View all 12 listings from this seller →".

### Screen Layout

Registered as `SellerScreen` in `app.jsx` SCREENS map, route key `seller`.

**Header bar:** Back button + "Back" label (consistent with product page pattern).

**Branded header (dark):**
- Circular avatar with seller initial, white on `--fill` background
- Seller name (bold, 18px)
- Location + "Since YYYY" subtitle (stubbed with sensible defaults)
- Badge row: "Trusted" (if rating >= 99%), "Fast Shipper" (if ships includes "1" day)

**Stats row (4 columns, separated by 1px borders):**
- Rating (percentage)
- Sales (count, abbreviated e.g. "12.8k")
- Ships (e.g. "1–2d")
- Free shipping threshold (e.g. "Free over £50")

**Bio section:** One-line blurb. Stubbed with a default per-seller placeholder until real data exists.

**Tab bar (3 tabs):**
- **Listings** (default active) — 2-column grid of the seller's available cards. Each card shows: card art, name, condition badge, price. Tapping a card navigates to its product page.
- **Reviews** — stubbed placeholder ("Reviews coming soon")
- **Policies** — stubbed placeholder ("Shipping & return policies coming soon")

### Data Model Changes

**`data.jsx` — SELLERS array expansion:**

Each seller object gains these fields (with defaults):

```javascript
{
  name: 'VaultCards',
  rating: 99.4,
  sales: 12840,
  loc: 'Manchester',       // new — default from first listing's loc
  since: 2019,             // new — stubbed
  blurb: '...',            // new — stubbed default
  freeShipMin: 50,         // new — free shipping threshold in £
  ships: '1–2 days',       // new — default from listings
}
```

**New helper function `listingsBySeller(name)`:** Returns all LISTINGS where `listing.seller === name`. Used by both the storefront screen and the upsell logic.

**New helper function `sellerByName(name)`:** Returns the SELLERS entry matching the name. Exported on `window`.

## Feature 2: Free Shipping Upsell Toast

### Trigger Conditions

After `app.addToCart(listingId)` is called, check:

1. The listing's seller has a `freeShipMin` threshold
2. The user's current cart total from this seller is below that threshold
3. The seller has at least one other listing not already in the cart

If all three are true, show the upsell toast.

### Toast Design

Replaces the existing "Added to cart" toast with an enhanced version:

- **Background:** `--fill` (dark), white text, rounded corners (8px)
- **Left content:**
  - Line 1: "Added to cart ✓" (bold, 13px)
  - Line 2: "Add £X more from {seller} for free shipping" (11px, slightly transparent)
- **Right content:** "Browse →" link (accent blue, tappable)
- **Behavior:**
  - Tapping "Browse →" navigates to `app.nav.push('seller', { name: sellerName })`
  - Auto-dismisses after 4 seconds
  - If conditions aren't met, falls back to the standard "Added to cart" toast

### Calculation

```
sellerCartTotal = sum of prices of cart items where item.seller === thisSeller
remaining = seller.freeShipMin - sellerCartTotal - justAddedItem.price
```

If `remaining > 0`, show the upsell. If `remaining <= 0`, the user already qualifies — show standard toast.

## Files to Create/Modify

| File | Action | What |
|------|--------|------|
| `screen_seller.jsx` | **Create** | New SellerScreen component |
| `app.jsx` | Modify | Register `seller: SellerScreen` in SCREENS, import it |
| `data.jsx` | Modify | Expand SELLERS with new fields, add `listingsBySeller()` and `sellerByName()` helpers |
| `screen_product.jsx` | Modify | Make seller name tappable, add "View all listings" link, update `onBuy` to show upsell toast |
| `components.jsx` | Modify | Enhance toast system to support rich content (two-line text + action button) |

## Out of Scope

- Real seller bios, branding, or profile editing
- Reviews and policies tab content (stubbed only)
- Cart grouping by seller at checkout
- Seller messaging or contact
