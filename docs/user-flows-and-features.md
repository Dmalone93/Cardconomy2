# Cardconomy User Flows & Features

> **Demo guide** — use this to walk through the buyer, seller, and store flows independently. Switch account type via Settings (gear icon on the profile tab) or during onboarding.

---

## How to Switch Account Types

- **Mobile:** Profile tab > gear icon > "Account type" > tap to cycle (buyer > seller > store)
- **Desktop:** Account page > same cycling (persisted to localStorage as `cc_acct`)
- **Onboarding:** First visit shows account type selector (Collector / Individual Seller / Game Shop)

---

## 1. Buyer/Collector Flow

The buyer discovers, purchases, tracks, and collects cards.

### Dashboard (Profile Tab)
- Portfolio value hero card with sparkline trend
- **Needs attention:** buylist matches at your price, order arriving, price drops on watched cards
- Watchlist price movements (4 cards with delta indicators)
- Buylist matches with max vs available pricing
- Recent orders with status pills (Shipped / Delivered / Processing)

### Core Journey: Browse > Buy

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **Home** | Ad carousel, trending cards, featured sets, graded spotlight, bulk lots, guides |
| 2 | **Search** | Filter by game/set/condition/price, sort, grid/list toggle, scan button |
| 3 | **Product page** | Multi-seller view — compare prices, conditions, seller ratings |
| 4 | **Listing detail** | Card art, price history chart, seller info, buyer protection, make offer or add to cart |
| 5 | **Cart** | Review items, see subtotal + shipping + protection fee |
| 6 | **Checkout** | Address, shipping (standard/express), payment method, order confirmation |

### Collection Management

| Screen | Features |
|--------|----------|
| **Watch tab > Watching** | Tracked cards with live prices and deltas, heart to remove |
| **Watch tab > Collection** | Portfolio value with sparkline, named collections (create/rename/delete), card-level gain/loss tracking |
| **Collection detail** | Per-collection value, add cards (scan or browse), remove cards, unrealized gains |

### Buylist

| Screen | Features |
|--------|----------|
| **Buylist** | Set cards you want + max price, see real-time matches, toggle active/inactive, search catalog to add |

### Other Buyer Screens

| Screen | How to Access | Features |
|--------|--------------|----------|
| **Scan card** | Search bar camera icon, or collection "Add cards" | Camera mock > analyzing animation > result sheet with grade selector, market price, "Add to collection" / "View listing" / "Price check" |
| **Purchases** | Dashboard orders section | 3 orders with tracking info, status tabs (All / In transit / Delivered) |
| **Offers** | Make offer on listing | Sent/received tabs, counter-offer flow, accept/decline/counter actions |
| **Notifications** | Bell icon | Activity feed + notification preferences toggles |
| **Settings** | Gear icon | Account type, verification, payment methods, game preferences |

---

## 2. Individual Seller Flow

The seller lists cards, manages offers, ships orders, and tracks earnings.

### Dashboard (Profile Tab)
- **Needs attention:** offer expiring (with countdown), item to ship, buylist matches
- Balance card (dark gradient): available balance, weekly delta with sparkline, date range (7d/30d/90d), Withdraw + Top up buttons
- Status tiles: Active listings (with view count), Pending offers (with respond CTA), To ship (with print label CTA)
- Activity feed: sales, offers, views, trades with colored dot indicators
- Collection row + Buylist row

### Core Journey: List > Sell > Ship

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **Sell hub** | Choose: marketplace (single/bulk), sell to local shop, or trade |
| 2a | **Single card** | 5-step wizard: pick card (search/scan) > condition/grading > photos > price (BIN/auction) > review |
| 2b | **Bulk list** | Choose method (LiveSweep/batch/search/import) > scan > pricing strategy (market/undercut/quick) > publish |
| 3 | **Selling screen** | Active/Sold/Drafts tabs, view counts, watcher counts, offer counts |
| 4 | **Offers** | Review incoming offers, accept/decline/counter with state tracking |
| 5 | **Payments** | Balance, withdraw, payment methods, transaction history |

### Selling Details

| Screen | Features |
|--------|----------|
| **Single card listing** | Search catalog or scan to identify, condition chips (graded: PSA/BGS/CGC + grade, raw: NM/LP/MP/HP), 4 photo slots, BIN or auction with duration, seller fee calc (9%), "You earn" display |
| **Bulk listing** | LiveSweep scanner, pricing strategy selector (at market / undercut 5% / quick sale -10%), per-card toggle, format choice (BIN/auction), free postage toggle, payout summary |
| **Selling management** | Active tab: listings with views/watchers/offers. Sold tab: monthly earnings summary, buyer names, payout status. Drafts tab: empty state |

### Sell to Local Shop

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **Shop finder** | Browse verified shops by distance, filter by services |
| 2 | **Storefront** | Shop profile, rating, services grid, in-stock inventory |
| 3 | **Sell to shop** | Identity > method > LiveSweep scan > review (triage: flagged/buylist/singles/bulk) > submission sent |
| 4 | **Message thread** | Shop sends offer with cash/credit breakdown, quick-reply buttons |

### Trading

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **Trade hub** | See matches near you, open-to-offers board, post a trade |
| 2 | **Build trade** | Select cards to give/get, fairness % calculator, optional cash adjustment |
| 3 | **Meetup** | Choose local shop as meeting point |
| 4 | **Confirmation** | Trade proposal sent with summary |

### Other Seller Screens

| Screen | Features |
|--------|----------|
| **Scan card** | From sell tab "Scan a card" button. Primary action: "List for sale" |
| **Verification** | 3-step flow: phone confirm > ID + selfie > payout details. Unlocks selling |
| **Card authentication** | Submit raw cards for Cardonomy Verified seal. In-shop or mail-in |
| **Payments** | Available balance with withdraw, payout method (bank), payment cards, transaction history |
| **Notifications** | Sale alerts, offer notifications, shipping reminders, preference toggles |

---

## 3. Local Game Store Flow

The store manages walk-in submissions, bulk intake, buylist performance, and daily revenue.

### Dashboard (Profile Tab)
- **Needs attention:** submissions pending review, bulk lot ready to price, buylist restock needed
- Revenue card (dark gradient): daily revenue with date range (Today/7d/30d), sparkline, walk-in vs online split bar
- Queue stats tiles: Submissions pending (with "new today"), Bulk lots (with card count), Buylist hits (today)
- Submission queue: customer avatars, card counts, time submitted, status pills (New/Grading/Offer sent/Completed)
- Buylist performance: matched today, avg buy rate %, low stock alerts

### Core Journey: Receive > Grade > Offer > Buy

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **Dashboard** | See incoming submissions, pending reviews, revenue |
| 2 | **Shop screen (counter view)** | Process submissions: grade cards, set buy prices, make offers |
| 3 | **Submission detail** | Review scanned cards, triage (flagged/buylist/singles/bulk), set conditions, make offer |
| 4 | **Message thread** | Send offer to seller with cash/credit breakdown, negotiate |

### Shop Counter View (Demo)

Access via Sell hub > "Demo: peek at shop counter view"

| Section | Features |
|---------|----------|
| **Dashboard tab** | Revenue stats (7d/30d/90d), submissions received/reviewed/offers made, buy rate, queue |
| **Counter tab** | Active submission queue, card-by-card grading interface, offer builder |
| **Queue rows** | Customer name, card count, time, status pill, 12 hits badge for buylist matches |

### Storefront & Enrollment

| Screen | Features |
|--------|----------|
| **Storefront** | Public shop profile: banner, rating, reviews, services grid (buylist/trade hub/vault/events), in-stock inventory |
| **Enroll shop** | Landing page: benefits (free deal flow, local vault, trade hub), enroll CTA |

### Store-Specific Screens

| Screen | Features |
|--------|----------|
| **Shop screen** | Full counter interface with dashboard and grading tabs, period filtering, revenue/submission/buylist stats |
| **Submission queue** | Walk-in submissions with card counts, status tracking (New > Grading > Offer sent > Completed) |
| **Buylist management** | Match rate, buy rate vs market, low stock alerts for high-demand cards |

---

## Shared Screens (All Account Types)

| Screen | Features |
|--------|----------|
| **Home** | Ad carousel (auto-rotate), game filters, featured rails, trending cards, set browser, graded spotlight, bulk lots, collector guides with article viewer |
| **Search** | Full filter system (game/set/condition/price/shipping), sort options, grid (2/3 col) and list views, scan button |
| **Listing detail** | Card art (slab or raw), price history with time ranges, seller card with trust badge, buyer protection, offer thread, similar listings, add to cart |
| **Product page** | Multi-seller comparison, condition variants, best price badge |
| **Onboarding** | Account type selection, game preference picker |
| **Settings** | Account type cycling, verification, payments, game preferences |
| **Notifications** | Activity feed (sales/offers/shipping) + notification preference toggles |

---

## Desktop Versions

The desktop site (`Desktop.html`) mirrors the mobile flows with wider layouts:

| Desktop Screen | Mobile Equivalent | Desktop Differences |
|---------------|-------------------|-------------------|
| **DHome** | HomeScreen | Full-width hero banners, wider grids |
| **DSearch** | SearchScreen | Sidebar filters, wider result grids |
| **DListing** | ListingScreen | Two-column (image left, details right) |
| **DSell / DSellSingle / DSellBulk** | SellScreen / SellBulkScreen | Wider forms, side-by-side preview |
| **DTrade / DStorefront / DShopDash** | TradeScreen / StorefrontScreen / ShopScreen | Full desktop layouts |
| **DSellerProfile** | SellerScreen | Wide header, grid listings |
| **DAccount (Buyer)** | BuyerDash | Two-column: portfolio + watchlist (left), needs attention + buylist (right) |
| **DAccount (Seller)** | SellerDash | Two-column: balance + status + open items (left), activity + collection + buylist (right) |
| **DAccount (Store)** | StoreDash | Two-column: attention + revenue + queue stats (left), submission queue + buylist perf + sales (right) |
| **DWatch** | WatchScreen | Wide card grid |
| **DCart** | CartScreen | Two-column: items (left), pricing summary (right) |

---

## State & Persistence

| localStorage Key | What It Stores | Default |
|-----------------|---------------|---------|
| `cc_acct` | Account type (buyer/seller/store) | buyer |
| `cc_watch` | Watched card IDs | ["l03","l05"] |
| `cc_cart` | Cart item IDs | [] |
| `cc_tier` | Trust verification tier (0-3) | 0 |
| `cc_prefs` | Followed game IDs | All games |
| `cc_onboarded` | Onboarding complete flag | false |
| `cc_collections` | Named card collections with IDs | 2 seed collections |
| `cc_buylist_v2` | Buylist entries with max prices | 4 seed cards |

---

## Demo Tips

- **Clear localStorage** to reset all state and re-trigger onboarding
- **Switch account type** via Settings to demo each flow without clearing data
- **Scan card** works from sell, search, and collection — shows different primary actions per context
- **LiveSweep scanner** is accessible from sell-to-shop and bulk listing flows
- **Trade builder** shows real-time fairness % as you select cards
- **Price history charts** appear on listings with mock historical data
- **Offer thread** on listings shows mock negotiation with counter-offers
