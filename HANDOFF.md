# CARDONOMY — Handoff for a fresh chat

Paste-in primer so a new session can continue without re-deriving everything. Project name: **Cardonomy** — a community trading-card marketplace (buy / sell / **trade**, individual collectors + Local Game Shops). High-fidelity **interactive prototype**, not a real build.

---

## TL;DR for the next agent

- **Two deliverables, one codebase:** `index.html` = **mobile app** (iOS frame, 402×874). `Desktop.html` = **responsive desktop** web app (separate `desktop*.jsx` files; hands off to mobile under ~760px).
- **No build step.** Plain HTML + in-browser Babel compiling `.jsx` on load. Edit a `.jsx`, reload, done.
- **React 18 UMD + Babel standalone**, pinned with integrity hashes in `index.html`. Don't change those tags.
- The user is the founder of Cardonomy. Treat them as the product owner. Ask before adding content/sections.
- After changes: `done` (surfaces to user + console check), then `fork_verifier_agent`. Don't self-screenshot to "check" — let the verifier do deep passes.

---

## Critical architecture conventions (READ FIRST — easy to break)

1. **Each `<script type="text/babel">` file has its OWN scope.** Components are shared by assigning to `window` at the bottom of each file:
   ```js
   Object.assign(window, { WatchScreen, ProfileScreen, CollectionDetailScreen });
   ```
   …and consumed at the top of other files via destructure:
   ```js
   const { T: TW, Icon: IconW, money: moneyW, Badge } = window;
   ```
   If you add a new component another file needs, you MUST export it AND add it to the consumer's destructure, or you get `X is not defined`.

2. **Per-file aliasing of shared globals.** Because of the scope split, each screen file aliases the shared theme/helpers with a file-specific suffix to avoid collisions: `T`→`TW`/`TH`/`TT`/`TOB`…, `Icon`→`IconW`/`IconH`…, `money`→`moneyW`… When editing a file, match its existing alias — don't introduce a bare `T`/`Icon`.

3. **NEVER name a style object just `styles`.** Name them per-component (`terminalStyles`) or use inline styles. Collisions silently break things. (Most of this codebase uses inline styles, which is fine.)

4. **Load order matters** (see `index.html` bottom): `ios-frame` → `image-slot` → `tweaks-panel` → `data` → `card_images` → `components` → all `screen_*` → `app` → `cc-tweaks`. A file can only destructure `window.X` that an earlier-loaded file exported. New `screen_*` files go before `app.jsx` and must be registered in `index.html`'s script list.

5. **Canonical HTML / JSX for direct-edit support:** double-quote attrs, close elements. Keep `data-comment-anchor` attributes on the semantic-equivalent element when restructuring.

---

## Theme tokens (defined in `index.html` `:root`, consumed via `var(--x)` and the `T` object in `components.jsx`)

- Surfaces: `--bg`, `--surface`, `--surface-2`, `--line`, `--fill` (dark ink fill)
- Ink: `--ink`, `--ink-2`, `--muted`, `--faint`
- Accent: `--accent` (oklch blue/indigo), `--accent-wash`, `--accent-press`
- Status: `--up` / `--up-wash` (green), `--down` (red), `--gold`
- Type: `--sans` = Hanken Grotesk, `--mono` = Geist Mono
- Radii `--radius-1..5`, shadows `--shadow-1..3`, `--focus-ring`
- Brand direction: **black/ink primary + indigo accent**, Radix-style scales & focus rings. The logo and primary CTAs are black/ink.
- `cc-tweaks.jsx` offers Light / Dark / Midnight theme switching via the Tweaks panel.

Use existing tokens; don't invent new hex colors. `Badge` (in components.jsx) is the canonical pill — tones: `neutral | accent | gold | up | down`. Use it for all status pills.

---

## State model — `app` object (built in `app.jsx`, passed to every screen as `app`)

Persisted to `localStorage` (keys prefixed `cc_`): `cc_tier`, `cc_acct`, `cc_prefs`, `cc_onboarded`, `cc_collections`, `cc_cart`, plus watch/bids. **Never clear localStorage** (shared with the user's live view).

Key fields & methods:
- **Navigation:** `app.nav.push(route, params)`, `app.nav.pop()`, `app.nav.setTab(tab)`, `app.openMenu()`. Routes are registered in a `SCREENS` map in `app.jsx` (e.g. `collection: CollectionDetailScreen`, `shopfinder: ShopFinderScreen`, `storefront`, `trade`, `verify`, `authcard`, `enroll_shop`…).
- **Tabs (bottom nav):** `home`(Browse) / `search`(Search) / `sell`(Sell) / `watch`(Watching) / `profile`(You).
- **Account type:** `app.acct` = `'buyer' | 'seller' | 'store'`; `app.setAcct(a)`. Buyer→seller is a self-serve upgrade on Profile.
- **Game preferences:** `app.prefs` (array of game ids), `app.setPrefs`, `app.togglePref(id)`, `app.inPrefs(gameId)`, `app.allGamesSelected()`. Drives home feed, ads, Featured rail, search.
- **Collections (portfolio):** `app.collections` (array of `{id, name, icon, cards:[listingId]}`), `app.ownedIds()`, `app.addCollection(name)`, `app.renameCollection`, `app.deleteCollection`, `app.addCardToCollection`, `app.removeCardFromCollection`.
- **Trust tier:** `app.tier` (0=unverified,1+=verified), `app.isVerified()`, `app.setTier`. `VerifyGate` component gates sell/bid/trade.
- **Watch / bids / cart:** `app.watch`, `app.bids`, `app.isBidding(id)`, cart via `screen_cart`/`screen_checkout`.
- **Toast:** `app.toast(msg)`.
- **Onboarding:** `app.finishOnboarding({acct, prefs})`. First-run 2-step overlay (`screen_onboarding.jsx`) — account type + pick games. To replay: set `cc_onboarded='false'` and reload.

---

## Navigation consistency rules (enforced — keep consistent)

- **Tab-root screens** (Browse, Search, Sell hub, Watching, Profile): **hamburger menu** top-left (`app.openMenu()`) + **bottom nav** visible.
- **Pushed screens** (listing, checkout, cart, collection detail, shopfinder, storefront, trade, verify, authcard, sell flows, account pages): **back chevron** top-left (`app.nav.pop()`), **no bottom nav**.
- Compact pushed-screen header pattern (matches Trade & Find-a-local-shop): `52px 14px 12px` padding, flex row, back chevron + 16px/800 title.
- Search shows hamburger when it's a tab root, back chevron when reached from a link.

---

## Data model (`data.jsx`)

- `GAMES` — 5: `pkmn` (Pokémon), `mtg` (Magic), `ygo` (Yu-Gi-Oh!), `lor` (One Piece), `digimon`. Each `{id, name, short, tint}`. **Gundam and Sports were removed** — don't reintroduce.
- `SETS` — `{id, game, name, year, cards, hue, img?}`. Only sets with `img` show in "Shop by set". One Piece sets: `op07` (500 Years), `op08` (Two Legends), `op05` (Awakening of the New Era), `op10` (Royal Blood) — all have box art in `sets/`.
- `LISTINGS` — ~64 cards (`l01`–`l64`). Shape: `{id, name, subtitle, game, set, number, art(placeholder hex), foil, grade:{company,grade}, condition, type:'buynow'|'auction', price, market, accepts_offers/bids/timeLeft, history:series(lo,hi), seller, sellerRating, sellerSales, shipping, ships, loc, watchers, sold}`. `series(start, now)` builds a 12-pt price history.
- `LOTS` — bulk lot listings (`{…, count, note}`), a distinct surface.
- `SHOPS` — LGS directory (storefront / buylist intake / vault / trade hub / events flags, `dist`, `rating`, `blurb`, `hours`).
- Helpers: `byId`, `setById`, `gameById`. Plus buylist / trader / sell-submission mock data lower in the file.
- **To add cards:** append to `LISTINGS` with a REAL card name so the API resolver fetches live art. Reuse or add a `SET` for accurate labels.

---

## Live card images (`card_images.jsx` → `window.CardImg.get(item, cb)`)

Resolves real art **by card name**, caches in `localStorage` (`cc_imgcache_v3`):
- MTG → Scryfall (`/cards/named?fuzzy=`)
- Pokémon → pokemontcg.io v2
- Yu-Gi-Oh → YGOPRODeck
- One Piece → optcgapi.com (fetches full list once, name→image map)
- Digimon → digimoncard.io via allorigins CORS proxy (**flaky** — often falls back; acceptable by design)

Bulk lots are skipped. Anything unresolved → styled placeholder (the `art` hex + name). `CardArt`/`Slab` in `components.jsx` render it. Graded cards render in a slab using `brand/`/`sets/` slab imagery with the card composited on top.

---

## Home/Browse content surfaces (`screen_home.jsx`)

Top→bottom: sticky search → game chips (`My games`/`All games` + followed-game logo chips + edit→`GamePrefsSheet`) → **sponsored AdCarousel** (pref-filtered, keyed by game id, images in `ads/`) → **Featured rail** (`SPOTLIGHT` data, editorial cards w/ real photos in `content/`, **swaps with the selected game chip**: title becomes "Featured in X"; "Locals night" cards push `shopfinder`) → Your bids → Ending soon (auctions) → Trending → Shop by set → Collector's corner (guides) → bulk lots. All sections are **preference-filtered** by `app.inPrefs`.

Active bids surface to the top of Browse and appear in Watching.

---

## Image asset folders

`ads/` (sponsored banners) · `content/` (Featured rail editorial photos, named `{game}-*.{ext}`) · `sets/` (set box art) · `lots/` (bulk lot photos) · `logos/` (TCG logos, used as chips) · `brand/` (slab/brand imagery) · `uploads/` (raw user uploads — copy into a named folder before referencing; never reference `uploads/` directly in final output).

---

## Desktop (`Desktop.html` + `desktop*.jsx`)

Separate responsive shell: `desktop.jsx` (shell/nav), `desktop_home.jsx`, `desktop_search.jsx`, `desktop_listing.jsx`, `desktop_sell.jsx`, `desktop_trade.jsx`. Centered search, mega-menu, "Shop by set" grid. Reference site was eBay-style. **When you change shared data (data.jsx) both surfaces update; when you change mobile-only screen files, desktop is unaffected and vice-versa.** Keep them in sync intentionally.

---

## Other deliverables in the project (not the app)

- `User Journey Map.html`, `User Flow Diagram.html` (+ `-print`/`v1`), `MoSCoW Prioritisation.html` — strategy/diagram artifacts.
- `Sell to Shop - Bulk Intake (Wireframes).html` — earlier wireframe exploration.
- `* (Standalone).html` — self-contained offline bundles (lag the source; regenerate via the "Save as standalone HTML" skill when needed).

---

## Recently completed (so you don't redo it)

- Onboarding overlay (account type + game prefs) + preference-driven content filtering everywhere.
- Multi-collection portfolio in Watching → Collection (overall value + per-collection value, add/remove cards, create/rename/delete).
- Profile account-type card (buyer→seller upgrade) + "Games you follow" editor.
- Unified `Badge` component + consistent nav (hamburger vs back-chevron) across all screens.
- Find-a-local-shop directory (`shopfinder`) mirroring the Trade screen.
- Preference-aware sponsored ads + Featured rail that swaps with the selected game.
- +20 API-backed listings (l42–l61) across all games; +OP-10 Royal Blood set & cards (l62–l64); One Piece set box art (op05/op08/op10).
- Verification / Trusted-Seller tiers + card authentication flow. Trade meetup-location agreement flow.

---

## Known caveats / open items

- **In-browser Babel** = brief first-load compile + a console warning (expected, not a bug).
- **Digimon / occasional One Piece** images fall back to placeholders (flaky community API) — by design.
- Not yet a real Radix **build** — uses Radix *tokens/colors/focus styling* but in-browser, not `@radix-ui` components. The user has discussed migrating to a real Vite + React + Radix build as a separate "build phase" / developer handoff (not done here).
- Nothing auto-pushes to GitHub — the user pushes manually from a downloaded copy.
- Magic Featured content + the 4th games' parity are in; if adding more games, update `GAMES`, logos, ads, SPOTLIGHT, and the resolver.

---

## How to work here

1. Read the relevant `screen_*.jsx` (and `data.jsx`/`components.jsx`) before editing — match the file's aliases and patterns.
2. Make the edit. Reload via `show_html` and check `get_webview_logs`.
3. `done` with `index.html` (or `Desktop.html`), then `fork_verifier_agent` for a background check.
4. Ask the product owner before adding new content/sections. Bias to minimalism — no filler.
