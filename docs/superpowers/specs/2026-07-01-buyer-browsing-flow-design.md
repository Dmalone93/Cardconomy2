# Buyer Browsing Flow — Design Spec

**Date:** 2026-07-01
**Scope:** Comprehensive pass across the entire buyer browsing journey — from home screen discovery through to individual cards and seller storefronts. Flow-first redesign that connects every screen into a seamless funnel with contextual community and data signals.

---

## 1. The Buyer Browsing Funnel

Every screen has a clear role and connects forward and backward:

```
Home (discovery hub)
 ├── Game Page (game deep-dive)
 │    └── Set Page (NEW — set checklist + highlights)
 │         └── Product Page (multi-seller comparison)
 │              └── Listing Page (single seller detail)
 │                   └── Seller Storefront (UPGRADED — full inventory)
 │                        └── back to any listing/product
 ├── Search (cross-game filtered results)
 │    └── Product or Listing (same detail pages)
 └── Seller Storefront (reachable from any seller name tap)
```

### Navigation Rules

- **Every seller name is tappable** — anywhere it appears (listing, product, search result, home feed, game page) it links to their storefront
- **Every set name is tappable** — on listing and product pages, tapping the set name navigates to the set page
- **Breadcrumb context** — screens show where the buyer came from (e.g. "Home › Pokémon › SV 151 › Charizard ex") with each level tappable as a shortcut
- **"Keep browsing" after add-to-cart** — toast includes a return action so the buyer isn't pulled out of the flow
- **Back button respects the stack** — always pops to where the buyer actually came from, not a hardcoded destination
- **No dead-ends** — every screen connects forward and backward

---

## 2. Game Page Upgrade

**File:** `screen_game.jsx` (existing, ~191 lines)

The current page has hero, set carousel, condition filter, and a card grid. It works but is bland and disconnected from the rest of the funnel.

### Changes

**Hero** — Keep existing hero image + game logo + description. Remove the stats counters (Listed/Graded) — they feel too data-heavy. Clean and editorial.

**Breadcrumb** — Add "Home › Pokémon" at the top of the screen, tappable to navigate back.

**New Release Spotlight** — Below the hero, a prominent tile for the newest set (highest `year` value). Shows set artwork, set name, and an "Explore set" CTA that navigates to the new set page.

**Browse by Set** — Keep horizontal scroll tiles. Change behaviour: tapping a set tile navigates to the new set page (currently it only filters the grid in-place). The "All sets" tile remains and continues to show all cards in the grid below.

**Most Watched** — New section. Top 4-6 cards from this game sorted by `watchers` count, displayed as a horizontal carousel. Community-driven: "what other collectors are looking at." Each card taps to its product/listing page.

**Community Section** (new, near bottom):
- **Top Sellers for this game** — 3-4 seller cards showing avatar, name, rating, number of listings in this game. Each taps into seller storefront.
- **Local shops with stock** — If any shops in data carry this game, show them with location badge. Taps to storefront or shop finder.

**Grid** — Stays as-is between Most Watched and Community sections. Continues to have condition filter chips (All/Raw/Graded) and the card count label.

---

## 3. Set Page (New Screen)

**File:** `screen_set.jsx` (new file)

This screen does not exist. It bridges the game page and individual card pages.

### Structure

**Hero:**
- Set artwork/image (from `s.img` in data)
- Set name, year, card count (e.g. "207 cards")
- Breadcrumb: "Home › Pokémon › SV 151"

**Highlights section** (top half):
- **Most Watched in this set** — 4-6 cards sorted by `watchers`, horizontal scroll carousel. Community signal: "what collectors are eyeing in this set."
- **Recently Listed** — Newest listings in this set (sorted by some recency proxy or random for prototype), horizontal carousel. Shows freshness: "this set is active."

**Full Checklist** (bottom half):
- Toggle between grid view and list view
- Condition filter chips: All / Raw / Graded
- Sort options: Popular (default, by watchers), Price low-to-high, Price high-to-low
- Each card shows: art, name, subtitle, price, seller name (tappable to storefront)
- Count label: "Showing 43 of 207 cards" — clarifies this is listed inventory, not every card in the set
- Tapping a card navigates to the product page (if multiple sellers) or listing page (if single seller)

**Empty state:** "No cards listed yet" with a subtle CTA to the sell flow.

### Data

All data needed already exists:
- `SETS` has `id`, `game`, `name`, `year`, `cards` (total count), `img`
- `LISTINGS` can be filtered by `set` field
- `watchers` field exists on listings for sort

### Navigation

- Registered in `SCREENS` map in `app.jsx` as `'set'`
- Params: `{ id: 's151' }` (set ID)
- Reachable from: game page set tiles, tappable set names on product/listing pages, search result set names

---

## 4. Product Page Fixes

**File:** `screen_product.jsx` (existing, ~291 lines)

The product page works well but has non-functional UI elements and missing flow connections.

### Changes

**Breadcrumb** — Add "Home › Pokémon › SV 151 › Charizard ex" at the top, each level tappable to navigate to that screen.

**Set name tappable** — In the subtitle/metadata area, tapping the set name navigates to the new set page.

**Condition filter pills made functional** — The pills (All, NM, LP, MP, HP, PSA 10, PSA 9, BGS) currently render but do nothing. Wire them up to actually filter the offers list below.

**Seller names tappable** — Every seller name in the offers list becomes a link to their storefront. Small enough not to interfere with the "Add to cart" tap target.

**"Keep browsing" on add-to-cart** — Current toast just confirms the add. Change to a rich toast with two actions: "View cart" and "Keep browsing" (the keep-browsing action pops back or dismisses the toast to stay on the current screen).

---

## 5. Listing Page Fixes

**File:** `screen_listing.jsx` (existing, ~329 lines)

### Changes

**Breadcrumb** — Contextual based on nav stack (e.g. "Pokémon › SV 151 › Charizard ex" or "VaultCards › Charizard ex" if coming from storefront).

**Set name tappable** — In the set/number/condition subtitle, tapping the set name navigates to the set page.

**Seller name tappable to storefront** — Currently the seller section has a "Store" button that links to `screen_seller.jsx` (the lightweight profile). Change this to navigate to the upgraded full storefront instead.

**Other printings section** (new) — The `PRINTINGS` data exists in `data.jsx` but isn't surfaced on the listing page. Add a "Other printings" horizontal scroll at the bottom showing the same card name in different sets, each tappable to that listing/product.

**"Keep browsing" on add-to-cart** — Same rich toast improvement as the product page.

---

## 6. Seller Storefront Upgrade

**File:** `screen_seller.jsx` (existing, ~195 lines)

Currently a lightweight profile page (avatar, rating, bio, stats). Upgrade to a full browsable storefront.

### Structure

**Hero/Header:**
- Seller name, avatar, trust badge, rating percentage, total sales count
- Member since year, location
- Bio/blurb text
- Stats row: total listings count, games they sell, shipping speed
- Free shipping callout if they have a threshold (e.g. "Free shipping over £50")

**Inventory section:**
- **Game filter tabs** — Horizontal chips for each game this seller has stock in, with counts (e.g. "Pokémon (24) · MTG (12) · Yu-Gi-Oh! (6)")
- **Card grid** — Same visual treatment as game/set page grids, filtered by selected game tab
- **Sort options** — Popular, Price low-to-high, Price high-to-low
- Tapping a card navigates to the listing page for that specific seller's listing

**Community signals:**
- "Ships from Manchester" location context
- Free shipping threshold badge
- Rating and sales count (already exist, keep prominent)

**Breadcrumb** — Contextual: e.g. "Charizard ex › VaultCards" or "Pokémon › VaultCards" depending on entry point.

**Reachable from:** Any seller name tap anywhere in the app — listing page, product page, search results, home feed trending cards, game page top sellers section, set page card grid.

---

## 7. Home Feed Tweaks

**File:** `screen_home.jsx` (existing, ~535 lines)

Small targeted additions to connect the home screen into the funnel.

### Changes

**Trending carousel** — Seller names on trending cards become tappable to storefront.

**Featured Sellers section** (new, near bottom of feed) — 3-4 seller cards showing avatar, name, rating, location, listing count. Community heartbeat on the landing page. Each taps to storefront.

**Browse by Game tiles** — Already link to game page. No change needed.

**Announcement bar** — No changes.

---

## 8. Search Results Tweaks

**File:** `screen_search.jsx` (existing, ~336 lines)

### Changes

**Seller name on result cards** — becomes a small tappable link to storefront. Must not interfere with tapping the card itself (the card tap goes to product/listing).

**Set name in result subtitle** — becomes tappable, navigates to set page.

No other changes to search — it already works well.

---

## 9. Cart Toast (Global)

**File:** `app.jsx` (existing)

### Changes

After add-to-cart from any screen, the toast changes from a simple confirmation to a rich toast:
- Title: "Added to cart"
- Subtitle: card name + price
- Two actions: "View cart" and "Keep browsing"
- "View cart" navigates to cart screen
- "Keep browsing" dismisses the toast (buyer stays where they are)

This replaces the current upsell toast for free shipping. The free-shipping upsell message can become the subtitle when applicable (e.g. "Add £12 more from VaultCards for free shipping").

---

## 10. Files Changed Summary

| File | Action | What |
|------|--------|------|
| `screen_set.jsx` | **New** | Set page with hero, highlights, checklist |
| `screen_game.jsx` | Edit | Remove stats, add breadcrumb, new release spotlight, most watched, community section, set tiles link to set page |
| `screen_product.jsx` | Edit | Add breadcrumb, wire condition filters, tappable seller/set names, keep-browsing toast |
| `screen_listing.jsx` | Edit | Add breadcrumb, tappable set/seller names, other printings section, keep-browsing toast |
| `screen_seller.jsx` | Edit | Upgrade to full storefront with inventory grid, game filters, sort |
| `screen_home.jsx` | Edit | Tappable seller names on trending, new featured sellers section |
| `screen_search.jsx` | Edit | Tappable seller/set names on result cards |
| `app.jsx` | Edit | Register `set` screen in SCREENS map, update cart toast to rich format with keep-browsing action |
| `index.html` | Edit | Add `screen_set.jsx` script tag before `app.jsx` |
| `data.jsx` | Edit | No structural changes needed — all required data already exists |

---

## 11. Out of Scope

- Scanning/camera features (explicitly deferred — next phase)
- Saved searches
- Price alerts / drop notifications
- Trade flow changes
- Seller/store dashboard changes
- Desktop screens (mobile-first for this pass)
- New mock data — work with existing listings, sellers, sets
