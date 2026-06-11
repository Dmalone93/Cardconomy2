# CARDONOMY

A community marketplace for trading cards — buy, sell, and **trade** with collectors and local game shops (LGS). Built as a high-fidelity interactive prototype (mobile app + responsive desktop web), with **live card images** pulled from public TCG APIs.

> Prototype / design exploration. Runs as static files — no build step, no backend.

## Run it

It's plain HTML + in-browser React (Babel compiles on load). Just serve the folder:

```bash
npx serve .        # or: python3 -m http.server
```

Then open:
- **`index.html`** — the mobile app (iOS frame: browse, search, listing, cart, watching, sell, trade, shop dashboard)
- **`Desktop.html`** — the responsive desktop web app (auto-hands off to the mobile app below ~760px)

GitHub Pages works out of the box (static hosting).

## What's inside

**Marketplace** — browse / search / filters, listing detail with price history, Buy It Now / offers / auctions, cart & checkout, watchlist + portfolio, active-bid surfacing.

**Sell** — single-card listing wizard, bulk scan-to-list (Live Sweep), and the full **sell-to-a-local-shop** flow (QR intake → scan → review → offer → in-person pickup).

**Trade** — card-for-card matching, an "Open to Offers" board, a fairness meter, and a **meetup-location agreement** flow (shops / public spots / propose-your-own, with counter-offers).

**LGS** — shop storefronts, the shop-side buylist dashboard, vault/trade-hub framing, and shop enrollment.

**Live card images** — real art by game:
- Magic → Scryfall
- Pokémon → pokemontcg.io
- Yu-Gi-Oh → YGOPRODeck
- One Piece → optcgapi.com
- Digimon → digimoncard.io

Results cache in `localStorage`; anything that can't resolve falls back to a styled placeholder.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Mobile app entry (loads the screens below) |
| `Desktop.html` | Desktop web entry |
| `data.jsx` | Mock data — games, sets, listings, shops, traders, buylist |
| `card_images.jsx` | Real-image resolver (TCG APIs + cache) |
| `components.jsx` | Shared UI — card art, slabs, nav, logo, theme tokens |
| `app.jsx` | Mobile navigation + state |
| `screen_*.jsx` | Mobile screens (home, search, listing, sell, shop, trade, account, …) |
| `desktop*.jsx` | Desktop shell + pages |
| `cc-tweaks.jsx` | Theme/accent controls (Light / Dark / Midnight) |
| `ads/` `logos/` `sets/` `lots/` | Image assets referenced by the app |

## Notes

- In-browser Babel means a brief first-load compile — fine for a prototype, not for production.
- The marketplace data is mock; payments/accounts are simulated.
- `CARDONOMY (Standalone).html` is a self-contained offline build (may lag the source).
