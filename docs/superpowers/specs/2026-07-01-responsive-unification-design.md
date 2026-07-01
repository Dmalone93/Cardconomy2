# Responsive Unification — Design Spec

**Date:** 2026-07-01
**Scope:** Merge mobile and desktop into a single responsive app. One entry point, one router, one set of screen components that adapt layout to viewport width. Browsing flow screens get full responsive treatment. Sell/trade/account screens get basic max-width centering.

---

## 1. Single Entry Point & App Shell

### What Gets Deleted

- `Desktop.html` — no longer a separate entry point
- `desktop.jsx` — desktop router/shell replaced by unified `app.jsx`
- `desktop_home.jsx`, `desktop_search.jsx`, `desktop_listing.jsx`, `desktop_seller.jsx`, `desktop_sell.jsx`, `desktop_trade.jsx` — all desktop screen files
- `ios-frame.jsx` — iOS device frame removed, app renders full-viewport

### Entry Point

`index.html` becomes the sole entry point. It loads all screen scripts and `app.jsx`. No Babel standalone for desktop. No responsive redirect logic. No iOS frame wrapper.

### Router

`app.jsx` is the single router. Keep the existing stack-based navigation:

```javascript
app.nav.push('listing', { id: 'l01' })  // push screen onto stack
app.nav.pop()                            // go back
app.nav.setTab('search')                 // switch tab (clears stack)
```

Hash-based deep linking stays (already exists in mobile `app.jsx`).

### Breakpoints

Three layout tiers driven by viewport width:

| Breakpoint | Label | Layout behaviour |
|------------|-------|-----------------|
| < 760px | Mobile | Single column, hamburger nav, sheets for filters |
| 760–1080px | Tablet | 2-column where applicable, top header nav |
| > 1080px | Desktop | 3-column detail pages, sidebar filters, full top header |

Detection: use `window.innerWidth` with a resize listener in `app.jsx`, exposed as `app.isDesktop` (760px+) and `app.isWide` (1080px+) booleans passed to all screens. CSS media queries for purely visual adaptations.

### State Management

No changes. All existing state (localStorage: cart, watch, prefs, acct, collections, owned, tradeable) stays the same.

---

## 2. Responsive Header

### Desktop (760px+)

Full-width sticky top bar:
- **Left:** Logo
- **Center:** Search input (expandable)
- **Right:** Nav links — Browse, Sell, Trade, Watching (badge), Account, Cart (badge)

### Mobile (<760px)

Slim sticky top bar:
- **Left:** Hamburger icon (opens existing `SideMenu`)
- **Center:** Logo
- **Right:** Cart icon (badge)

Search is accessible via the search tab or a search icon in the header.

### What Gets Removed

- `BottomNav` component — no longer needed, all nav moves to header/hamburger
- iOS status bar from `ios-frame.jsx`
- Desktop mega-menu hover dropdowns — simplified to direct links

---

## 3. Responsive Screen Layouts

### Home Screen (`screen_home.jsx`)

- **Mobile:** Current single-column layout with horizontal scroll carousels
- **Desktop:** Carousels show more cards (wider viewport = more visible). Game tiles wrap into a grid (3-4 across) instead of horizontal scroll. Featured sellers in a grid row. Content remains stacked — home pages are single-column even on desktop. Max-width container (~1280px) centers content.

### Game Page (`screen_game.jsx`)

- **Mobile:** Current layout (hero, set tiles carousel, most watched, sellers, grid)
- **Desktop:** Wider hero. Set tiles wrap into a grid (3-4 across) instead of horizontal scroll. Card grid expands to 3-4 columns. Most watched and top sellers carousels show more items.

### Set Page (`screen_set.jsx`)

- **Mobile:** Current layout
- **Desktop:** Wider hero. Carousels show more cards. Checklist grid goes 3-4 columns. Sort/filter controls spread out horizontally.

### Search (`screen_search.jsx`)

- **Mobile:** Full-width results. Filter button opens a sheet/modal (current behaviour).
- **Desktop (760px+):** Two-column layout — sticky sidebar filter rail on the left (always visible, same filters as the mobile sheet but rendered inline), results grid on the right. Grid adapts to 3-4 columns at wider viewports.

### Product Page (`screen_product.jsx`)

- **Mobile:** Single column scroll (current layout)
- **Desktop (1080px+):** Two columns — card image on left (sticky), details + offers list on right

### Listing Page (`screen_listing.jsx`)

- **Mobile:** Single column scroll (current layout)
- **Tablet (760–1080px):** Two columns — card image left (sticky), details + buy box on right
- **Desktop (1080px+):** Three columns — card image left (sticky), details center (scrollable), buy box right (sticky). Similar to the current desktop listing layout.

### Seller Storefront (`screen_seller.jsx`)

- **Mobile:** Current layout
- **Desktop:** Wider branded header. Inventory grid goes 3-4 columns. Game filter tabs spread out. Stats row spreads wider.

### Cart (`screen_cart.jsx`)

- **Mobile:** Single column
- **Desktop:** Two columns — cart items left, order summary right

### All Other Screens (sell, trade, account, verify, onboarding, etc.)

- Wrapped in a max-width container (~720px for form-like screens, ~1080px for dashboard screens)
- Centered horizontally with auto margins
- No layout rework — they just stop stretching to full width at desktop sizes

---

## 4. Shared Layout Utilities

### Container Component

A reusable wrapper that centers content and constrains width:

```jsx
function Container({ children, width, style }) {
  return (
    <div style={{
      maxWidth: width || 1280,
      margin: '0 auto',
      padding: '0 16px',
      width: '100%',
      ...style,
    }}>{children}</div>
  );
}
```

Used by all screens to prevent content stretching to full viewport width on desktop.

### Responsive Grid Helper

Screens that show card grids can use `app.isWide` to set column count:

- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns

No new component needed — just conditional `gridTemplateColumns` values based on `app.isDesktop` / `app.isWide`.

---

## 5. Migration Order

Screens are converted one at a time. Each conversion:
1. Adds responsive layout logic using `app.isDesktop` / `app.isWide`
2. Wraps content in `Container` where appropriate
3. Adapts grid columns, layout direction, and sticky positioning for wider viewports

**Order:**

1. **App shell first** — new `index.html`, responsive header in `app.jsx`, remove iOS frame, remove BottomNav, add breakpoint detection
2. **Home screen** — responsive carousels and game tile grid
3. **Game page** — responsive grids and set tiles
4. **Set page** — responsive grids
5. **Search** — desktop sidebar filter rail
6. **Listing page** — 3-column desktop layout
7. **Product page** — 2-column desktop layout
8. **Seller storefront** — responsive grids
9. **Cart** — 2-column desktop layout
10. **Remaining screens** — max-width container wrapping
11. **Delete desktop files** — remove all `desktop_*.jsx`, `Desktop.html`, `ios-frame.jsx`
12. **Clean up** — remove unused desktop imports, dead code, update build.js if needed

---

## 6. Files Changed Summary

| File | Action | What |
|------|--------|------|
| `index.html` | **Heavy edit** | Remove iOS frame, desktop redirect, Babel desktop refs. Single clean entry point. |
| `app.jsx` | **Heavy edit** | New responsive header, remove BottomNav, remove iOS frame wrapper, add breakpoint state (`isDesktop`, `isWide`), keep stack nav + hash routing |
| `components.jsx` | **Edit** | Add `Container` component, remove `BottomNav` |
| `screen_home.jsx` | **Edit** | Responsive game tile grid, wider carousels |
| `screen_game.jsx` | **Edit** | Responsive set tile grid, wider card grids |
| `screen_set.jsx` | **Edit** | Responsive card grids |
| `screen_search.jsx` | **Edit** | Desktop sidebar filter rail (2-column layout) |
| `screen_listing.jsx` | **Edit** | 3-column desktop layout with sticky image and buy box |
| `screen_product.jsx` | **Edit** | 2-column desktop layout with sticky image |
| `screen_seller.jsx` | **Edit** | Responsive inventory grids |
| `screen_cart.jsx` | **Edit** | 2-column desktop layout |
| `screen_*.jsx` (others) | **Edit** | Wrap in Container for max-width centering |
| `Desktop.html` | **Delete** | No longer needed |
| `desktop.jsx` | **Delete** | Replaced by unified app.jsx |
| `desktop_home.jsx` | **Delete** | Replaced by responsive screen_home.jsx |
| `desktop_search.jsx` | **Delete** | Replaced by responsive screen_search.jsx |
| `desktop_listing.jsx` | **Delete** | Replaced by responsive screen_listing.jsx |
| `desktop_seller.jsx` | **Delete** | Replaced by responsive screen_seller.jsx |
| `desktop_sell.jsx` | **Delete** | Mobile sell screens + Container sufficient |
| `desktop_trade.jsx` | **Delete** | Mobile trade screens + Container sufficient |
| `ios-frame.jsx` | **Delete** | No more device frame |
| `build.js` | **Edit** | Remove desktop.html processing if needed |

---

## 7. Out of Scope

- Mega-menu dropdowns on desktop nav (keep it simple — direct links)
- Desktop-specific animations (hero card columns, etc.)
- Responsive sell/trade/account screen layouts (just max-width for now)
- PWA / service worker
- Server-side rendering
