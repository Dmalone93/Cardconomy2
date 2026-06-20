# Cardconomy User Flow Audit

## Complete Screen Map

### Bottom Tab Navigation (5 tabs)
| Tab | Screen | Purpose |
|-----|--------|---------|
| Browse | HomeScreen | Discovery hero, community pitch, game tiles, trending |
| Search | SearchScreen | Browse, filter, sort cards |
| Sell | SellHubScreen | Choose selling method |
| Watching | WatchScreen | Watchlist + collections + portfolio |
| You | DashboardScreen | Buyer/Seller/Store dashboard |

### All Pushed Screens (26 total)
| Screen | Entry Points | Purpose |
|--------|-------------|---------|
| listing | search, home, product, seller, collection | Individual card listing (sell ad) |
| product | search, home | Multi-seller card view (compare prices) |
| cart | home header icon | Review items before checkout |
| checkout | cart | Address, shipping, payment, place order |
| sell_market | sell hub | Choose single vs bulk listing |
| sell_single | sell_market | 5-step listing wizard |
| sellbulk | sell_market | Bulk scan + auto-price |
| sellshop | sell hub, storefront | Submit cards to local shop |
| trade | sell hub, product, storefront | Card-for-card trading |
| storefront | shopfinder, search | Shop public page |
| shopfinder | home, trade, settings | Shop directory |
| shop | sell hub (demo) | Shop counter staff view |
| enroll_shop | home, sell hub, settings | Shop onboarding (2 steps) |
| seller | listing | Individual seller profile + listings |
| collection | watch tab | Single collection detail |
| buylist | dashboard | Want list with max prices |
| purchases | dashboard | Order history |
| selling | dashboard | Active/sold listings |
| offers | dashboard, selling | Sent/received offer management |
| payments | dashboard, settings | Payouts, bank, payment methods |
| notifications | dashboard | Activity feed + preferences |
| settings | dashboard | Account type, verification, games |
| verify | settings, trade | Identity verification |
| authcard | listing | Card authentication |
| fees | home, community banner | Fee comparison calculator |
| howitworks | home, community section | 3-persona explainer + FAQ |
| scan | search, sell, collection | Camera barcode scan |

---

## User Journeys (End-to-End)

### Journey 1: Buyer finds and buys a card
```
Home → Search (tap search bar)
  → Filter by game/set/condition/price
  → Tap card → Product page (multi-seller view)
    → Compare sellers (condition pills, prices)
    → "View full listing" → Listing page
      → Read seller notes, view photos
      → "Add to cart" → Toast confirmation
  → Cart icon → Cart page
    → Review items, see totals
    → "Checkout" → Checkout page
      → Confirm address, shipping, payment
      → "Place order" → Order confirmed
```

### Journey 2: Buyer builds a want list (buylist)
```
You tab → Buyer Dashboard
  → "Buylist" section → Buylist screen
    → "+ Add" → Search catalog sheet
      → Tap card → Set condition, max price, qty
      → "Add" → Toast "Added to buylist"
    → Edit entry → Change qty (stepper), max price (input + % buttons)
      → "Save" → Toast "Buylist updated"
    → Toggle active/inactive
    → "View matches" → Search filtered to matching listings
```

### Journey 3: Seller lists a card
```
Sell tab → Sell Hub
  → "Sell on the marketplace" → Sell Market
    → "List a single card" → Sell wizard (5 steps)
      1. Search/scan card
      2. Set condition/grading
      3. Add photos
      4. Set price (BIN or auction)
      5. Review + confirm
    → "Your card is live!" → Success
```

### Journey 4: Seller sells to local shop
```
Sell tab → Sell Hub
  → "Sell to a local shop" → SellShop screen
    → Search/scan cards
    → Set conditions
    → Select shop
    → Submit cards
    → Shop reviews + sends offer
```

### Journey 5: Two collectors trade cards
```
Sell tab → Sell Hub
  → "Trade with collectors" → Trade screen
    → Browse matches / open trade board
    → Tap trader → Build trade proposal
      → Select your cards + their cards
      → Check fairness meter
      → Choose meetup location (shop or public spot)
    → "Send offer" → Waiting for response
    → Negotiate location → Agree → Meet + swap
```

### Journey 6: Shop enrols on platform
```
Home CTA / Sell Hub → Enrol screen
  → Landing page (value props, testimonial)
  → "Enrol your shop" → Step 1: Name + postcode
  → Step 2: Games you buy + condition pref
  → Submit → Application in review
```

### Journey 7: Shop processes a submission
```
You tab (store mode) → Store Dashboard
  → "Counter" tab → Inbox
    → Tap submission → Review cards
      → Price each card (price guide + buy %)
      → Flag questionable cards
    → "Build offer" → Cash/credit split
      → Set ratio, add message
    → "Send offer" → Awaiting seller response
```

---

## Identified Gaps

### Critical Gaps
1. **No messaging system** — "Message seller" button shows a toast but there's no actual chat/inbox screen. Buyers can't ask questions before buying.
2. **No order tracking screen** — Purchases screen shows status badges but there's no dedicated tracking view with timeline/map.
3. **Cart is not easily accessible** — No persistent cart badge count on the tab bar. Cart is only accessible from the home header icon.
4. **No user registration/login flow** — Everything assumes a logged-in user. No sign up, sign in, forgot password, or auth screens.
5. **No address book** — Checkout has one hardcoded address. No saved addresses, no address selection.

### UX Issues
6. **"Add to my wants" (product page)** — Gold button at bottom is not obvious. Users might think it's a buy button. The label doesn't clearly communicate that it adds to the buylist.
7. **Buylist max price feedback** — Quick % buttons (80/90/100/110%) don't show what price they calculate to until you tap them. No preview.
8. **Quantity selectors inconsistent** — Buylist uses a stepper (+/-), sell screen uses chips, shop uses range sliders. No shared component.
9. **Fees page doesn't scroll on mobile** — FIXED (this session)
10. **How It Works page didn't scroll** — FIXED (previous session)
11. **No "back to top" on long pages** — Product page, listing page, search results can get very long.
12. **Search has no "no results" state** — If filters exclude everything, the grid is just empty with no messaging.

### Missing Features
13. **No saved/recent searches** — Search suggestions show hardcoded examples but don't persist actual user searches.
14. **No price alerts** — Users can watch cards but can't set "notify me when below X" alerts.
15. **No seller messaging inbox** — Sellers see offers but can't have conversations.
16. **No return/dispute flow** — Buyer protection is mentioned but there's no screen to file a claim.
17. **No shipping label generation** — Sellers see "to ship" count but no flow to print labels.
18. **No multi-currency support** — GBP only, no conversion for international buyers.

### Redundancies
19. **Two "How it works" entry points** — Community section link + homepage CTA both go to the same page. This is fine (not redundant, just multiple paths to the same content).
20. **Finish tabs (Standard/Foil) on listing page** — Still present on individual listings but removed from product page. Should be consistent: either both have them or neither.
21. **Two separate "seller profile" concepts** — SellerScreen (individual sellers) and StorefrontScreen (shops) are separate screens with different layouts. Could be unified.
22. **Collection tracking exists in two places** — WatchScreen collections tab AND dashboard portfolio hero both show collection value. Data source is the same but UI is duplicated.

---

## Quantity Selector Audit

| Location | Type | Range | Feedback |
|----------|------|-------|----------|
| Buylist qty | Stepper (+/-) | 1-99 | Number display between buttons |
| Buylist max price | Text input + % buttons | Any £ | Updates on tap, no preview of calculated price |
| Listing offer | Text input + % buttons | Any £ | Shows 85/90/95% of asking price |
| Sell price | Text input + suggested button | Any £ | "Suggested" shows market price |
| Shop buy % | Range slider + % buttons | 40-90% | Shows calculated buy price |
| Shop credit split | Range slider | 0-100% | Shows cash/credit amounts |

### Recommendation
Create a shared `QuantityInput` component that standardises:
- Stepper mode (for whole numbers like qty)
- Currency mode (for prices, with optional quick-select % buttons that preview the result)
- Slider mode (for percentages)

All should show immediate feedback: what the value means in context (e.g. "80% of market = X").

---

## Priority Fixes

### P0 (Ship-blocking)
1. Fix "Add to my wants" label — rename to "Add to want list" or make it a secondary action, not the primary CTA
2. Buylist % buttons should preview the calculated price before tap

### P1 (Important UX)
3. Standardise quantity/price inputs with a shared component
4. Add cart badge to bottom tab bar (not just home header)
5. Add empty state to search results
6. Remove finish tabs from listing page (already removed from product page)

### P2 (Nice to have)
7. Add messaging inbox screen
8. Add order tracking timeline
9. Add price alert setting on watch items
10. Unify seller profile and storefront screens
