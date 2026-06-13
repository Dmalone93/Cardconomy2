# Dashboard Redesign & Scan Card Flow

## Overview

Two changes to the Cardconomy mobile and desktop app:

1. **Profile tab becomes a dashboard** — replaces the current generic profile/settings screen with an operational dashboard answering "what needs my attention and how am I doing?"
2. **Scan single card flow** — camera-based card identification accessible from multiple entry points, with context-aware actions.

---

## 1. Profile Tab Redesign

### Design Principles

- The profile tab is a **dashboard**, not a settings page or identity showcase.
- Identity is minimal — small avatar + name in the header bar. The public-facing seller profile (what buyers see) is a separate, existing screen.
- Every element answers one of two questions: "what needs my attention?" or "how am I doing?"
- Account settings, game preferences, account type, and verification move behind the gear icon.

### Mobile Layout (top to bottom)

**Header bar:**
- Left: small avatar (28-30px, rounded square) + user's first name
- Right: notification bell icon (with unread badge) + settings gear icon
- Tapping bell pushes the existing NotificationsScreen
- Tapping gear pushes a new settings screen (containing: account type, games you follow, verification & trust, payment methods, app preferences)

**Balance card (dark gradient):**
- "Available balance" label (small uppercase)
- Large balance amount (e.g. £248.47)
- Weekly change delta in green (e.g. "▲ £84.00 this week")
- Two action buttons: "Withdraw" (secondary) and "Store credit" (accent)
- Tapping the card itself pushes the existing PaymentsScreen

**Status tiles (3-column row):**
- Each tile: large number, label, contextual sub-line with CTA color
- Tile 1: Active listings count + "X views today" in accent. Taps to SellingScreen (active tab).
- Tile 2: Pending offers count + "Respond →" in amber (if any need response). Taps to OffersScreen.
- Tile 3: To ship count + "Print label →" in green. Taps to SellingScreen (sold tab, filtered to unshipped).
- Tiles with 0 items show "0" with muted sub-text, no CTA.

**Activity feed (white card):**
- "ACTIVITY" label (small uppercase, muted)
- Compact list of recent events, each row:
  - Colored dot (green = sale, accent = offer, muted = delivery/other)
  - Event description with inline amount if applicable (e.g. "Sold Charizard EX · +£84")
  - Time label right-aligned (e.g. "2h", "1d")
- Max 5 items shown, "See all" link at bottom pushes full activity history
- Tapping a row navigates to the relevant item (listing, order, offer)

**Collection row (white card):**
- Left: 3 stacked mini card thumbnails (overlapping, colored placeholders)
- Center: "Collection · £2,480" title + "42 cards · +12%" sub
- Right: chevron
- Taps to existing WatchScreen (collection tab)

**Buylist row (white card):**
- Left: star icon in gold wash background
- Center: "Buylist · X matches" title + "Cards at your price" sub in accent
- Right: chevron
- Taps to existing BuylistScreen

### Desktop Layout

Same data as mobile but uses the wider viewport:

**Two-column layout:**

Left column (~60%):
- Balance card (wider, includes an inline sparkline showing daily earnings for the past 7 days)
- Status tiles below the balance card (same 3 tiles, more horizontal space for labels)
- Open items list — the structured list from mobile's status tiles expanded with more detail per row (card thumbnails inline, buyer names on shipments, offer amounts on pending offers)

Right column (~40%):
- Activity feed — expanded version with card art thumbnails inline per event, more items visible (8-10), timestamps more detailed ("2 hours ago" vs "2h")
- Collection summary — mini portfolio chart (sparkline with area fill showing 30-day value trend), top 3 cards by value shown as mini cards
- Buylist — match previews showing actual card names and prices

### What Moves Out of the Profile Screen

These items currently on ProfileScreen move to a Settings screen (pushed via gear icon):
- Account type selector (buyer/seller/store)
- Games you follow preferences
- Verification & trust (VerifyGate)
- "Become a seller" / "Enroll as Local Game Store" CTAs
- The 9-item account menu is eliminated — its destinations are now:
  - Purchases → status tile "To ship" or collection area
  - Selling → status tile "Active listings"
  - Offers → status tile "Pending offers"
  - Verification & trust → settings
  - Payments & payouts → balance card tap
  - Notifications → bell icon
  - Buylist → buylist row

### File Changes

- `screen_watchlist.jsx`: Replace `ProfileScreen` component with new dashboard layout
- `screen_watchlist.jsx`: Add `SettingsScreen` component (moved content from old ProfileScreen)
- `app.jsx`: Add 'settings' to SCREENS, wire gear icon navigation
- `desktop.jsx` or new `desktop_dashboard.jsx`: Desktop-specific dashboard layout

---

## 2. Scan Single Card Flow

### Entry Points

Scan is a universal tool accessible from multiple places. The entry point determines which action buttons appear on the result sheet.

| Entry point | How accessed | Primary action on result |
|---|---|---|
| Sell tab | Existing "Scan card" button | "List for sale" |
| Search screen | Camera icon in search bar | "View listing" |
| Collection screen | "Add cards" sheet | "Add to collection" |

### Flow Steps

**Step 1: Camera screen**
- Fullscreen camera viewfinder (simulated with dark background + card-shaped overlay)
- Header: back button + "Scan card" title
- Card-shaped guide overlay (rounded rectangle, ~63mm x 88mm ratio, dashed border)
- Hint text below guide: "Centre the card in the frame"
- Torch/flash toggle icon in top-right corner
- "Take photo" capture button (large circle) at bottom center
- Since this is a demo/prototype, the camera is simulated — tapping capture triggers the analyzing state

**Step 2: Analyzing state**
- The viewfinder area shows a static placeholder (simulating a frozen frame)
- A shimmer/pulse animation plays over the card guide area for ~1.5 seconds
- Text changes to "Identifying card..."
- After the animation, the result sheet slides up

**Step 3: Result sheet (bottom sheet)**
- Slides up using the existing `Sheet` component pattern
- Content:
  - Card image (from CardArt component) + card name + set name + card number
  - Grade selector row: "Raw" selected by default, tappable chips for NM/LP/MP/HP
  - Market price (large, bold) + price delta (green/red with percentage)
  - Horizontal divider
  - Context-aware action buttons (stacked, full-width):
    - Primary button (accent fill): varies by entry point (see table above)
    - Secondary buttons (outline): the other two actions from the set {List for sale, Add to collection, Price check/View listing}
  - "Not the right card?" text link at bottom
    - Tapping shows 2-3 alternative card matches from the catalog as a mini list
    - Tapping an alternative swaps in that card's data

**Mock behavior:**
- No real ML/camera integration — this is a prototype
- Tapping "capture" picks a random card from the existing LISTINGS data
- "Not the right card?" alternatives are 2-3 other random cards from the same game
- All actions (list, add to collection, price check) use existing app navigation and state

### New File

`screen_scan.jsx` — contains:
- `ScanScreen` component (camera UI + analyzing state + result sheet)
- Follows existing patterns: theme object from `window.T`, navigation via `app.nav`, icons from `window.Icon`
- Exported via `Object.assign(window, { ScanScreen })`
- Added to the script loading order in `index.html` (before `app.jsx`)
- Registered in `app.jsx` SCREENS array as `{ id: 'scan', component: ScanScreen }`
- Navigation: `app.nav.push('scan', { from: 'sell' | 'search' | 'collection' })` — the `from` param determines which action buttons appear

### Entry Point Wiring

- `screen_sell.jsx`: existing "Scan card" button calls `app.nav.push('scan', { from: 'sell' })`
- `screen_search.jsx`: add camera icon button in search bar, calls `app.nav.push('scan', { from: 'search' })`
- `screen_watchlist.jsx`: "Add cards" sheet gets a "Scan card" option that calls `app.nav.push('scan', { from: 'collection' })`

---

## Scope Boundaries

- No real camera or ML integration — all scan results are mocked from existing data
- No new backend/API calls — everything is client-side with existing mock data
- Desktop scan is out of scope (camera scan is a mobile pattern)
- Public seller profile screen is unchanged — this spec only covers the private dashboard
- Existing sub-screens (BuylistScreen, PurchasesScreen, SellingScreen, OffersScreen, PaymentsScreen, NotificationsScreen) are unchanged
