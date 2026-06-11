# Product-Based Marketplace Design

## Goal

Restructure the Cardconomy marketplace from listing-based (every seller creates a standalone listing) to product-based (one product page per unique card, multiple seller offers underneath). Graded slabs and auctions remain as unique individual listings.

## Data Model

### Product

A unique card identity. Defined by the combination of game, set, card number, and name.

Fields:
- `id` — unique product ID (e.g. `p_pkmn_s151_199`)
- `game` — game ID (`pkmn`, `mtg`, `ygo`)
- `set` — set ID
- `number` — card number within set
- `name` — card name
- `subtitle` — card variant/rarity (e.g. "Special Illustration Rare")
- `art` — placeholder hex color
- `foil` — boolean
- `market` — current market price (average of recent sales)
- `low` — lowest current offer price
- `high` — highest current offer price
- `history` — 12-point price history array
- `offerCount` — number of active seller offers

A product has NO seller, NO condition, NO shipping info — those belong to offers.

### Offer

A seller's listing of a raw card. Belongs to a product.

Fields:
- `id` — unique offer ID
- `productId` — parent product
- `seller` — seller name
- `sellerRating` — percentage
- `sellerSales` — total sales count
- `condition` — `NM` | `LP` | `MP` | `HP`
- `price` — asking price
- `accepts_offers` — boolean
- `shipping` — shipping cost (0 = free)
- `ships` — delivery estimate string
- `loc` — seller location

### Listing (unchanged)

Stays as-is for graded slabs and auctions. These are unique one-of-a-kind items with seller-provided photos.

Fields remain the same as current LISTINGS entries. A listing has `grade.company !== 'raw'` (graded) or `type === 'auction'`.

## Product Page (Raw Cards)

Top-to-bottom layout:

1. **Hero image** — centered CardArt, API-resolved. Shared across all sellers (it's the same card).

2. **Card info** — name (large, bold), subtitle, set name + number, game badge (colored by game tint), foil badge if applicable.

3. **Price stats bar** — grey background row with three columns: Market price, Low (cheapest offer), High (most expensive offer). All bold.

4. **Price chart** — 30-day sparkline with the existing PriceChart component.

5. **Section divider** — "Available from N sellers" heading.

6. **Seller offer cards** — sorted by price ascending (cheapest first). Each card contains:
   - Price (large, bold) + condition badge (NM green, LP amber, MP orange, HP red)
   - Seller avatar (initial circle, colored) + seller name + rating percentage + sales count
   - Shipping info ("Free shipping" or "$X.XX ship") + delivery estimate
   - "Buy" button (right-aligned)
   - If `accepts_offers`, show small "Make Offer" link below the Buy button

7. **Similar products** — horizontal scroll of related product cards from the same game/set.

## Listing Page (Graded Slabs & Auctions)

No changes to the current design. These remain as individual listing detail pages with:
- Seller's photos of the specific slab
- Single seller info
- Single price / bid display
- Buy Now / Place Bid CTA
- No "other sellers" section

## Search Results

One result per entity. Three result types in the same feed:

### Product result (raw cards)
- Card image (CardArt)
- Card name + subtitle
- Set name
- Market price
- "from $X · N sellers" subtitle in muted text
- Tap navigates to product page

### Graded listing result
- Card image (Slab)
- Card name + subtitle
- Grade badge (PSA 10, BGS 9.5, etc.)
- Price
- Seller name
- Tap navigates to individual listing page

### Auction listing result
- Card image
- Card name + subtitle
- Current bid price
- Time remaining (red)
- Bid count
- Tap navigates to individual listing page

Sorting and filtering apply across all three types. The "Graded" filter chip shows only graded listings. The "Auctions" filter chip shows only auctions.

## Home Feed

Sections adapt to the product model:

- **Trending now** — shows product cards (raw) sorted by popularity. Each shows card image, name, market price, "from $X · N sellers".
- **Ending soon** — shows auction listings only (unchanged).
- **Graded spotlight** — shows graded slab listings only (unchanged).
- **Shop by set** — unchanged.
- **Bulk lots** — unchanged.

## Mock Data Changes

### New: PRODUCTS array

Derived from existing LISTINGS. Group raw (non-graded, non-auction) listings that share the same game + set + number into products. Each product aggregates:
- `market` — from the original listing's market price
- `low` / `high` — min/max of offers
- `offerCount` — count of offers

### New: OFFERS array

Each raw listing becomes one or more offers on its product. Generate 2-4 mock offers per product to demonstrate the multi-seller view. Vary seller, condition, price, and shipping.

### LISTINGS array

Keep existing graded and auction entries. Remove raw buy-now entries (they're now offers on products).

## Navigation Changes

- Home feed product cards → `/product/:id` (new route)
- Home feed graded/auction cards → `/listing/:id` (existing route)
- Search product results → `/product/:id`
- Search graded/auction results → `/listing/:id`
- Product page "Buy" button → `/checkout/:offerId` (new param pattern)
- Listing page "Buy Now" → `/checkout/:listingId` (unchanged)

## Sell Flow Impact

When a seller lists a raw card, they're creating an offer on an existing product (or creating a new product if it doesn't exist yet). The sell wizard stays the same from the seller's perspective — the system matches their card to a product automatically by game + set + number.

No changes needed to the sell screens for this prototype iteration.

## Scope

This spec covers:
- New PRODUCTS and OFFERS data structures in data.jsx
- New ProductScreen component (product detail page)
- Updated search results to show products vs listings
- Updated home feed sections
- Updated ListCard/ListRow to handle both products and listings

This spec does NOT cover:
- Desktop.html changes (separate surface)
- Sell flow changes
- Cart changes (cart still works with individual offer/listing IDs)
- Backend/API design (this is a prototype)
