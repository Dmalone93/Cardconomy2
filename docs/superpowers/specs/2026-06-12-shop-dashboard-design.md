# Shop Dashboard Design

## Goal

Replace the shop screen's default view with an analytics dashboard showing shop performance data. The existing counter/submission flow moves to a "Counter" tab. Shop owners land on the dashboard first.

## Entry Point

When a shop owner navigates to the shop screen (`/shop`), they see the dashboard by default. Two tabs at the top: "Dashboard" (default) and "Counter" (existing inbox/submission flow).

## Period Picker

Horizontal chip row below the header: **7d / 30d / 90d / All**. Default: 30d. Tapping a chip updates all stats, charts, and lists on the dashboard. All mock data is generated relative to the selected period.

## Header

- Shop name (bold) + shop initial avatar circle (accent color)
- Period picker chips below

## Section 1: Revenue Summary

Three stat cards in a horizontal row, equal width:
- **Total sales** — £ amount, delta vs previous period (green up / red down percentage)
- **Payouts** — £ amount, delta
- **Fees** — £ amount, delta

Mock data per period:
- 7d: £1,240 sales, £1,128 payouts, £112 fees
- 30d: £5,680 sales, £5,169 payouts, £511 fees
- 90d: £14,320 sales, £13,031 payouts, £1,289 fees
- All: £28,940 sales, £26,335 payouts, £2,605 fees

Deltas: 7d +8%, 30d +12%, 90d +18%, All — (no delta for all time)

## Section 2: Submissions

2x2 grid of compact stat tiles:
- **Submissions received** — count
- **Cards reviewed** — count
- **Offers made** — count
- **Acceptance rate** — percentage

Below the grid: "View inbox →" button that switches to the Counter tab.

Mock data per period:
- 7d: 4 submissions, 86 cards, 3 offers, 75%
- 30d: 18 submissions, 342 cards, 14 offers, 78%
- 90d: 52 submissions, 1,040 cards, 41 offers, 79%
- All: 124 submissions, 2,480 cards, 98 offers, 79%

## Section 3: Inventory

Row with two stat boxes:
- **Active listings** — count
- **Inventory value** — £ total

Below: horizontal scroll of top 3 best-selling cards. Each card shows CardArt (w=56), card name, "N sold" subtitle. Tapping does nothing (prototype).

Mock: 47 active listings, £3,280 value. Best sellers: Charizard ex (8 sold), Pikachu IR (6 sold), Ragavan (5 sold) — use listing IDs l01, l02, l06 for CardArt.

## Section 4: Trades

Single card with two stats side by side:
- **Trades hosted** — count
- **Trade volume** — £ amount

Summary line below: "Your shop hosted N trades this period"

Mock per period:
- 7d: 3 trades, £420
- 30d: 14 trades, £1,860
- 90d: 38 trades, £5,120
- All: 91 trades, £12,400

## Section 5: Storefront Visitors

Stats row:
- **Total views** — count
- **Unique visitors** — count

Bar chart: 7 vertical bars representing the last 7 units of the period (days for 7d/30d, weeks for 90d, months for All). Each bar is a simple div with height proportional to value. Use accent color.

Source breakdown: three rows below the chart:
- Search — percentage + count
- Directory — percentage + count
- Direct — percentage + count

Mock (30d default): 892 views, 340 unique. Sources: Search 52%, Directory 31%, Direct 17%. Bar chart heights: [40, 55, 48, 62, 38, 71, 58] (relative, tallest = accent, others proportional).

## Section 6: Top Cards

Two tabs: "Best sellers" / "Most wanted"

**Best sellers tab:** list of 5 cards, each row:
- CardArt thumbnail (w=40)
- Card name + subtitle
- Units sold + £ total revenue
Uses listing IDs: l01, l06, l09, l02, l12

**Most wanted tab:** list of 5 cards from the buylist, each row:
- CardArt thumbnail (w=40)
- Card name
- Times requested + current buy price
Uses listing IDs: l03, l05, l07, l01, l04

## Section 7: Recent Activity

Scrollable list of last 10 events. Each row:
- Icon (colored circle with symbol): sale=green £, submission=blue inbox, trade=purple arrows, review=gold star
- Description text (bold card/person name + action)
- Relative timestamp ("2h ago", "Yesterday", "3d ago")

Mock events:
1. Sale — "Sold Charizard ex for £38.50" — 2h ago
2. Submission — "New submission from Jordan M. (24 cards)" — 5h ago
3. Trade — "Trade completed at your shop" — Yesterday
4. Review — "New 5-star review from Marcus T." — Yesterday
5. Sale — "Sold Ragavan for £62.00" — 2d ago
6. Submission — "New submission from Priya K. (12 cards)" — 2d ago
7. Sale — "Sold Pikachu IR for £38.50" — 3d ago
8. Trade — "Trade completed at your shop" — 4d ago
9. Sale — "Sold Blue-Eyes for £184.00" — 5d ago
10. Review — "New 4-star review from Diego R." — 6d ago

## Navigation Change

The ShopScreen component switches from `view` state (inbox/dash/sent) to a two-tab layout:
- **Tab 1: Dashboard** (default) — the new analytics dashboard
- **Tab 2: Counter** — the existing inbox → submission dashboard → offer → sent flow (unchanged)

The tab bar sits below the header. Tapping "Counter" shows the existing ShopInbox as before. Tapping "Dashboard" returns to the analytics view.

## Data Model

All dashboard data is mock — hardcoded objects keyed by period:

```js
const DASH_DATA = {
  '7d': { sales: 1240, payouts: 1128, fees: 112, delta: 8, subs: 4, cards: 86, offers: 3, acceptRate: 75, trades: 3, tradeVol: 420, views: 210, unique: 82 },
  '30d': { sales: 5680, payouts: 5169, fees: 511, delta: 12, subs: 18, cards: 342, offers: 14, acceptRate: 78, trades: 14, tradeVol: 1860, views: 892, unique: 340 },
  '90d': { sales: 14320, payouts: 13031, fees: 1289, delta: 18, subs: 52, cards: 1040, offers: 41, acceptRate: 79, trades: 38, tradeVol: 5120, views: 2640, unique: 980 },
  'all': { sales: 28940, payouts: 26335, fees: 2605, delta: 0, subs: 124, cards: 2480, offers: 98, acceptRate: 79, trades: 91, tradeVol: 12400, views: 6200, unique: 2180 },
};
```

## Scope

This spec covers:
- New ShopDashboard component within screen_shop.jsx
- Tab layout replacing the current view switcher
- All 7 dashboard sections with mock data
- Period picker updating all sections

This spec does NOT cover:
- Real data / API integration
- Desktop version
- Shop settings or edit flows
- Push notifications for events
