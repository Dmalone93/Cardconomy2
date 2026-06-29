# Cardconomy Prototype — User Testing Report

> **Date:** 23 June 2026
> **Tested on:** cardconomyy.vercel.app (Mobile 402x874 + Desktop 1400x900)
> **Method:** AI-simulated user testing across 16 personas, evaluating all major flows

---

## Executive Summary

Cardconomy's prototype demonstrates a **genuinely differentiated product vision** — the three-persona dashboards, local game shop integration, and scan-to-sell workflow are features no competitor offers in combination. The UI is clean, modern, and feels native-quality on mobile.

**However**, several critical usability issues would cause real users to abandon flows or lose trust. The biggest risks are: unclear onboarding-to-value path for first-time visitors, information density overwhelming novice users, and trust gaps in the high-value purchase flow.

### Overall Scores by Persona Type

| Persona | Overall Score | Key Strength | Biggest Risk |
|---------|:---:|---|---|
| Casual Buyer | 7/10 | Clean browse/search, good price display | Grading terminology unexplained |
| Serious Investor | 8/10 | Price history, multi-seller comparison | Authentication feels unfinished |
| First-Time Seller | 6/10 | Suggested pricing is excellent | Verification gate feels like a wall |
| Power Seller | 8/10 | Bulk listing + fee comparison are killer | Offer management needs real depth |
| LGS Owner | 7/10 | Counter view is genuinely innovative | Counter tab workflow too linear for real use |
| Complete Novice | 5/10 | Homepage is inviting | Jargon everywhere (NM, LP, PSA, BGS) |
| Skeptic | 6/10 | Buyer protection messaging is strong | No evidence of real users/volume |

---

## 1. Home Screen & First Impressions

### What Works
- **Hero section is strong.** "The UK home for trading cards" is clear positioning. The fanned card images immediately signal this is a card marketplace.
- **"Start browsing" CTA** is prominent and action-oriented.
- **Browse by Game** tiles with actual game logos are visually engaging and help users self-select immediately.
- **"6% + 30p total fees"** in the community banner is a bold, specific claim that differentiates.
- **Bottom nav** is clean with clear labels. The Sell button as a primary (raised) pill is smart — it signals this isn't just a shopping app.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The hero says "Lower fees than anyone" but there's no immediate proof. Users from eBay need to see the comparison before they believe it. The "Compare our fees" link is buried below the fold. | All sellers |
| **High** | No social proof on the home screen — no "12,000 listings" or "500 sellers" counter. A new user sees no evidence that anyone else uses this platform. | Skeptic, Novice |
| **Medium** | "How it works — buyers, sellers & game shops" link is easy to miss. First-time visitors need this prominently. | Novice, Parent |
| **Medium** | The "What's Hot" section shows "Trending" and "Hot Deals" tabs but the difference between them isn't obvious to casual users. | Casual Buyer |
| **Low** | "Browse by Game" doesn't show Lorcana in the visible carousel on mobile — requires scrolling. Given Lorcana's growth, it deserves visibility. | Multi-Game Collector |
| **Low** | The hamburger menu (side menu) duplicates navigation that's already in the bottom bar and game tiles, creating choice paralysis for new users. | Novice |

### Recommendations
1. Add a social proof strip below the hero: "X cards listed / X verified sellers / X game shops"
2. Move fee comparison higher — consider a compact comparison strip in the hero itself
3. Make "How it works" a more visually distinct section, not just a text link
4. Add a "New to trading cards?" entry point for complete novices

---

## 2. Search & Discovery

### What Works
- **Animated placeholder** cycling through real card names ("Charizard ex", "Black Lotus", etc.) teaches users what to search for — clever onboarding.
- **Recent searches, popular searches, and saved searches** on focus create a rich "empty state" that guides behaviour.
- **Filter system** is comprehensive (game, set, condition, price, shipping) without being overwhelming. Quick filter chips ("Buy Now", "Graded", "Free ship") are excellent shortcuts.
- **Grid/list toggle** lets users choose their preferred browsing style.
- **Camera/scan button** in the search bar is discoverable and contextual.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | Condition filter uses abbreviations (NM, LP, MP, HP) with no explanation. A parent buying for their child or a returning player has no idea what "LP" means. | Parent, Novice, Returning Player |
| **High** | No "sort by: recently listed" as a default or prominent option. Buyers want to see fresh inventory, not stale listings. | All Buyers |
| **Medium** | Set filter shows sets but a casual Pokemon collector may not know set codes (s151, ssp). Set names with images would be more accessible. | Casual Collector |
| **Medium** | Price slider max of £35,000+ is correct for the market but the slider control at low values (£10-100 range) lacks precision. Most purchases are under £100. | Casual Buyer, Student |
| **Medium** | No "deck builder" or "I need these cards for a deck" feature. Competitive players search for multiple specific cards. | Competitive Player |
| **Low** | "Saved searches" exist but there's no visible way to save a search — the feature feels phantom. | Power Seller, Bargain Hunter |

### Recommendations
1. Add tooltips or a legend for condition abbreviations: "NM = Near Mint (like new)" etc.
2. Default sort to "Recently listed" rather than "Best match" to signal fresh inventory
3. Add a logarithmic price slider or preset price range buttons (Under £10 / £10-50 / £50-200 / £200+)
4. Surface the "save this search" action in the search results view

---

## 3. Product Page (Multi-Seller View)

### What Works
- **Multi-seller comparison** is genuinely better than eBay. Seeing every seller's price, condition, and rating for the same card on one screen is the exact problem Cardmarket solves — and this does it with better UX.
- **"Best price" badge** immediately identifies the cheapest option.
- **Condition filter pills** let you quickly narrow to your preferred condition.
- **Trust strip** (Protected / Verified / Secure / Tracked) at the top provides reassurance.
- **Demand widget** ("X buyers want this") creates urgency without being manipulative.
- **Trade offers section** showing available traders is unique — no competitor shows this.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | "Price from: £XX" doesn't clarify whether this is Buy It Now, auction, or offer-based. Price transparency is the #1 value prop — any ambiguity here is damaging. | All Buyers |
| **Medium** | The product page doesn't show how many total sellers have this card. "3 listed items" vs "47 listed items" signals very different things about liquidity. | Investor, Bargain Hunter |
| **Medium** | Variants section ("Same Code") is confusing. Users may not understand why the same card appears multiple times with different set labels. | Casual Collector, Parent |
| **Low** | Price history toggle defaults to hidden ("Show chart"). For a platform that sells on price transparency, the chart should be visible by default. | Investor |

### Recommendations
1. Label prices explicitly: "Buy It Now: £XX" or "From £XX (Buy Now)"
2. Show total seller count prominently: "Available from 5 sellers"
3. Default price history to visible, at least on cards above £50
4. Add a "What does this mean?" explainer for the variants section

---

## 4. Listing Detail Page

### What Works
- **Card art presentation** is beautiful — graded cards show slab images, raw cards show full art with drop shadow. This is significantly better than eBay's photo-first approach.
- **Price history chart** with 7D/30D/90D/1Y tabs and stat boxes (last sold, 90d low, 90d high) is exactly what serious buyers want. This alone could win users from eBay.
- **Seller section** with trust badge, rating percentage, and sales count builds confidence.
- **"More from this seller"** cross-sells effectively.
- **Buyer protection banner** is reassuring without being preachy.
- **Offer thread** showing mock negotiation gives users a mental model of how offers work.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The "Make offer" sheet shows preset buttons at 85%/90%/95% of listing price, but doesn't explain offer etiquette. First-time users don't know if 85% is reasonable or insulting. | First-Time Buyer, Novice |
| **High** | For graded cards, the listing doesn't explain what PSA 10 vs BGS 9 means or how grading companies compare. A user spending £1,280 on a PSA 10 Umbreon needs to understand what they're buying. | Parent, Novice, Returning Player |
| **Medium** | "Listed X ago" is useful but doesn't show how many views/watchers the listing has from the buyer's perspective. This signals demand. | Bargain Hunter |
| **Medium** | Card authentication CTAs ("Get it Cardonomy Verified") appear on every listing, even cheap ones where authentication is irrelevant. This adds noise. | All |
| **Medium** | The sticky action bar "Make offer" + "Add to cart" doesn't show the price. Users scrolling the page lose sight of what they're about to spend. | All Buyers |
| **Low** | Seller notes are 5 rotating texts — this feels artificial. Real sellers would write their own notes. | Skeptic |

### Recommendations
1. Add offer guidance: "Most sellers respond well to offers within 10-15% of asking price"
2. Add a grading explainer sheet (accessible via "What does PSA 10 mean?" link)
3. Show price in the sticky action bar: "Add to cart · £432"
4. Only show authentication CTA on cards above a value threshold (e.g., £50+)

---

## 5. Cart & Checkout

### What Works
- **Multi-seller notice** ("Items ship from N sellers — separate tracking for each") manages expectations proactively.
- **Order summary** with explicit Buyer Protection fee line item is transparent.
- **Checkout flow** is clean: ship to > delivery > payment > confirm. Standard e-commerce pattern that requires no learning.
- **Apple Pay as default** is smart for mobile UK users.
- **Address book** with multiple saved addresses feels polished.
- **Order confirmation** with tracking estimate is reassuring.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | Buyer Protection fee (1.5% + £0.50) is shown as a line item but the benefit isn't explained inline. Users see a charge with no immediate explanation of what they get. On a £28,500 Black Lotus, this fee would be £427.50 — enormous. Is there a cap? | Investor, All Buyers |
| **High** | Only 2 delivery options (Royal Mail Tracked 2-3 days, Special Delivery next day £9.99). No option for registered/insured shipping for high-value items. Users spending thousands need special handling. | Investor |
| **Medium** | No "combine shipping" messaging for multi-seller carts. Users adding cards from 3 sellers may not realise they're paying shipping 3 times. | Bulk Buyer |
| **Medium** | No estimated delivery date before choosing a shipping option. Users need to see "Arrives by Monday" without clicking into options. | All Buyers |
| **Low** | "VAT (included): £0.00" looks like a bug. Either show the included VAT amount or remove the line. | All |

### Recommendations
1. Add a Buyer Protection explainer: "Full refund if card doesn't match listing or doesn't arrive. Learn more"
2. Cap the buyer protection fee and display the cap: "Buyer Protection (max £X)"
3. Add insured shipping options for items above £500
4. Show estimated delivery inline before the shipping selection step

---

## 6. Sell Hub & Listing Flows

### What Works
- **Four clear paths** (collection, marketplace, local shop, trade) with descriptive subtitles is excellent information architecture. No other platform offers this choice.
- **"List from your collection" as the top option** with "New" badge is smart — it's the fastest path and encourages users to build their collection first.
- **Verification gate** is visible but not blocking exploration. The "~2 minutes" estimate is reassuring.
- **"Why sell on Cardconomy?"** link to the pitch page is a nice confidence-builder for hesitant sellers.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The verification gate appears before users can even explore the sell flow. A first-time seller wanting to see what the process looks like is asked to verify their identity before seeing a single screen. This is a significant drop-off risk. | First-Time Seller, Student |
| **High** | The sell hub shows 4 options which is great, but there's no guidance on which to choose. "I have 50 cards — which option?" needs answering. | First-Time Seller, Collection Downsizer |
| **Medium** | "Sell to a local shop" flow starts with Gnome Games hardcoded. In production, users need to discover/choose their shop first. The prototype skips this step, which makes the flow feel artificially smooth. | All Sellers |
| **Medium** | The "Demo: peek at shop's counter view" link breaks immersion. For user testing, this should be hidden or contextualised differently. | All |

---

### 6a. Single Card Listing Wizard (5 Steps)

### What Works
- **Step-by-step wizard** with clear progress indicator removes cognitive overload.
- **"Scan a card" button** at step 0 is prominent — this is the key differentiator.
- **Suggested pricing** ("Suggested: £XX based on recent [grade] sales · Use") is incredibly helpful for first-time sellers. This alone could win users from eBay.
- **Fee breakdown** at review step (9% seller fee, "You earn" display) is transparent.
- **Success screen** with "List another card" keeps the momentum going.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **Critical** | The review step shows **9% seller fee** but the fees page shows **4% seller fee + 2% buyer fee**. This is a serious inconsistency. The listing wizard must match the advertised fee structure or sellers will feel misled. | All Sellers |
| **High** | Photo step shows 4 slots but no guidance on what makes a good photo. "Clear photos sell faster" is too vague. Show examples: "Show corners for condition", "Include the back", etc. | First-Time Seller |
| **Medium** | Condition selector for raw cards (Mint/NM/LP/MP/HP) has no visual guide. What does "Lightly Played" actually look like? eBay and Cardmarket both have condition guides. | First-Time Seller, Returning Player |
| **Medium** | "Offer free postage" toggle defaults to off. Research shows free shipping increases conversion 30-50%. Default should be on, at least for items above a threshold. | Power Seller |

### Recommendations
1. **Fix the fee inconsistency immediately** — show "4% seller fee" in the listing wizard to match the fees page
2. Add photo guidance with example images
3. Add a visual condition guide (card images showing each grade)
4. Default "free postage" to on for items above £20

---

### 6b. Bulk Listing (LiveSweep)

### What Works
- **LiveSweep scanner UI** is visually impressive — dark camera mode, viewfinder reticles, real-time card recognition tags. This looks and feels like a premium feature.
- **Buylist match indicators** (gold "Buylist match" tags) during scanning are genuinely innovative. No competitor does this.
- **Three pricing strategies** (at market / undercut 5% / quick sale -10%) remove decision paralysis. This is one of the best features in the entire product.
- **Per-card toggle** lets users exclude specific cards from the batch. Good flexibility.
- **Payout summary** showing "You earn if all sell" is motivating.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **Medium** | The scan pool is limited to 16 cards in the prototype. Users testing will scan the same cards repeatedly, which breaks immersion. (Unavoidable in prototype, but worth noting.) | All |
| **Medium** | "Import List" (Manabox / TCGplayer / CSV) is listed as an option but the flow for this isn't fleshed out. Power sellers migrating from TCGplayer need this. | Power Seller |
| **Low** | "Batch Fan Photo" as a method name is unclear. What does "fanning" mean? A brief illustration would help. | First-Time Seller |

---

### 6c. Sell to Local Shop

### What Works
- **The entire concept is genuinely unique.** No other platform offers digital submission to physical shops. This is the strongest differentiator.
- **Triage system** (Flagged / Buylist matches / Singles >= £5 / Bulk commons) is exactly how a shop would want to review submissions. This shows deep domain understanding.
- **Cash vs store credit (+20%)** split gives sellers real choice and incentivises credit (good for shops).
- **Counter ticket concept** (#CC-4471) bridges digital and physical — the seller has a reference number when they walk in.
- **"Typical reply < 1hr"** sets expectations.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The flow assumes the user is in/near the shop. There's no clarity on whether you can submit remotely (scan at home, go to shop later). The "Scanned in-store · ticket reserved" badge suggests in-store only, but the pitch says otherwise. | Collection Downsizer, Student |
| **Medium** | The offer thread quick-reply buttons ("Accept credit · £744" / "Take cash · £620") don't allow negotiation. A seller who thinks the offer is too low has no counter-offer mechanism with the shop. | Power Seller, Downsizer |
| **Medium** | Bulk rates (£6/1,000 commons, £25/1,000 rares) are shown but there's no explanation of how these compare to market. Are these good rates? | First-Time Seller |
| **Low** | Only 3 shops in the finder (all in Oxford). The "near you" framing falls apart if a user isn't in Oxford. | All |

---

## 7. Trade Builder

### What Works
- **Fairness meter** showing percentage balance between trade sides is clever and builds confidence that neither party is getting cheated.
- **"Even it out: add £XX cash"** suggestion resolves imbalanced trades naturally.
- **Meetup at local shops** as the default meeting point is much safer than "random car park" — this directly addresses a real pain point.
- **Safe-trade checklist** shows the platform takes safety seriously.
- **Location negotiation** (propose > counter-propose > accept) is a nice touch that mimics real negotiation.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The trade flow requires both parties to be ID-verified before meeting. This is good for safety but creates friction — the other trader may not be verified yet, which blocks the whole flow. | Trader |
| **Medium** | Trade matches show distance (1.9km, 5.6km) but there's no filter for distance range. Users in rural areas may see matches 50+ miles away. | Rural users |
| **Medium** | The "Open to Offers" board shows 4 posts. This is enough for a demo but in production, discoverability and search within the board will be critical. | Trader |
| **Low** | "Add to calendar" on trade confirmation is a nice detail but the prototype doesn't specify what calendar format it would use. | All |

---

## 8. Dashboards (Buyer / Seller / Store)

### 8a. Buyer Dashboard

### What Works
- **Portfolio value hero** with sparkline immediately answers "what's my collection worth today?"
- **"Needs attention" section** with 3 actionable items (buylist matches, order arriving, price drop) is excellent prioritisation.
- **Buylist with match indicators** (showing when a listing matches your max price) is a feature eBay doesn't have.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **Medium** | Portfolio value shows a number but there's no breakdown. Is this based on market value, purchase price, or something else? | Investor |
| **Medium** | "Needs attention" items aren't clickable/actionable in an obvious way. Each should clearly navigate to the relevant screen. | All Buyers |
| **Low** | Only 3 orders shown. For a returning user with 50+ purchases, there needs to be pagination or a "View all" link. | Power Buyer |

---

### 8b. Seller Dashboard

### What Works
- **Balance card** (£248.47 + "up £84 this week") with sparkline is motivating. Sellers want to see their earnings growing.
- **Status tiles** (Active listings / Pending offers / To ship) with action CTAs ("Respond", "Print label") are immediately actionable — this is a genuine command centre.
- **Activity feed** creates a sense of momentum and engagement.
- **"Needs attention" items** with countdown timers (offer expiring) create appropriate urgency.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **Medium** | "Withdraw" button is prominent but there's no minimum withdrawal amount or processing time shown. Sellers want to know when they'll get their money. | Power Seller |
| **Medium** | No "views today" or "impressions this week" metric. Sellers on eBay obsess over view counts as a leading indicator of sales. | Power Seller |
| **Low** | Activity feed items aren't filterable. A seller with 100+ daily events needs to filter by type. | Power Seller |

---

### 8c. Store Dashboard

### What Works
- **Revenue card** with walk-in vs online split bar is exactly the metric a shop owner cares about.
- **Submission queue** with status pills (New / Grading / Offer sent / Completed) is a clear workflow tracker.
- **Buylist performance** (matched today, avg buy rate, low stock alerts) would genuinely help shops optimise their buying.
- **"Needs attention"** with specific counts (3 submissions pending, 1 bulk lot, buylist restock) is actionable.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The dashboard shows aggregated data but there's no way to drill down. "3 submissions pending" should tap through to those specific submissions. | Established LGS |
| **Medium** | No staff permissions or multi-user access concept visible. A shop with 3 staff needs role-based access. | Chain Manager |
| **Medium** | Revenue figures show sales/payouts/fees but no profit margin calculation. Shops think in terms of margin, not gross revenue. | Established LGS |
| **Low** | Storefront visitor analytics (Search 52% / Directory 31% / Direct 17%) are interesting but there's no benchmark. Is 52% from search good or bad? | New LGS |

---

## 9. Shop Counter View

### What Works
- **This is the single most innovative feature in the product.** No other platform offers a digital counter interface for game shops. The concept of "seller scans at home, shop reviews at counter" is genuinely novel.
- **Submission review** with stat tiles (Total cards / Est. market / On your buylist / Buylist payout) gives the shop everything they need at a glance.
- **Filter chips** (All / Buylist / Singles >= £5 / Flagged) match how shops actually triage submissions.
- **Price guide drawer** with condition ladder, recent sold comps, and buy % slider is extremely well-designed. This replaces the TCGplayer price lookup that shops do today.
- **Offer composer** with cash/credit split and message templates is professional.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | The counter view is accessed via "Demo: peek at shop's counter view" — in production, this needs to be the primary view for shop accounts, not hidden behind a demo link. | All LGS |
| **High** | No ability to process multiple submissions simultaneously. A busy Saturday might have 5 people waiting. The queue is linear. | Established LGS |
| **Medium** | The buy % slider (40-90%) with quick buttons (60/70/80) is great but doesn't show the resulting buy price alongside. Shops think in "I'll pay £X" not "I'll pay 70%." | Established LGS |
| **Medium** | No barcode/receipt printing integration. After accepting a submission, shops need to print a receipt or ticket. | Established LGS |
| **Medium** | Flag button on individual cards is useful but there's no "flag reason" (damage, suspect counterfeit, wrong card). | All LGS |

---

## 10. Fees Page

### What Works
- **Fee calculator slider** is the standout feature. Sliding from £1 to £500 and seeing live per-platform comparisons is incredibly persuasive. This should be the first thing sellers see.
- **Breakdown cards** per platform showing seller fee, buyer fee, and "Save £X with Cardconomy" are clear and compelling.
- **Full fee table** provides the detail for comparison shoppers.
- **"What's included"** section (Buyer Protection, Payment Processing, No Hidden Fees) pre-empts common objections.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **Critical** | **Fee inconsistency across the product:** The fees page shows 4% seller + 2% buyer + 30p = **6% + 30p total**. But the listing wizard shows **9% seller fee**. The pitch page says **6%+30p**. The shop enrollment shows **4% seller fee**. These must all match. | All |
| **Medium** | The footnote mentions "Shipping: \u00A32.50" — this appears to be a Unicode rendering bug. Should display "£2.50". | All |
| **Medium** | Comparison only shows 4 platforms. Whatnot and TCGplayer are missing from the calculator (though they're in the market research doc). | Power Seller |
| **Low** | "Start selling for less" CTA at bottom navigates to the sell tab, but the user might want to sign up first. | New User |

---

## 11. Verification & Trust

### What Works
- **Trust tier ladder** (Registered > ID Verified > Trusted Seller > Verified Shop) is a clear progression that motivates users to level up.
- **Progress toward Trusted Seller** with specific metrics (sales 18/25, on-time 96%/95%, rating 97%/98%, disputes 1.2%/2%) is transparent and gamified in a good way.
- **"~2 minutes" estimate** for verification reduces friction.
- **KYC/privacy messaging** ("we never store raw images") addresses a real concern.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | Verification simulates instantly (1.1s). Users who have experienced real KYC (Revolut, Monzo) know this takes minutes to days. The instant simulation may set unrealistic expectations. | All Sellers |
| **Medium** | No explanation of what each trust tier unlocks specifically. "ID Verified" enables selling — but what limits apply? Are there listing limits for unverified? Sell amount caps? | First-Time Seller |
| **Medium** | The "Simulate reaching the milestone" button is a demo artifact that should be hidden in user testing. | All |

---

## 12. Card Authentication

### What Works
- **Two paths** (local shop vs mail-in) with clear pros/cons is good choice architecture.
- **Fee structure** (min £8 or 3% of market) is reasonable and transparent.
- **Status tracker** (Received > Authenticating > Verified & sealed) gives visibility into the process.
- **AuthSeal badge** with serial number creates a tangible trust artifact.

### Issues Found

| Severity | Issue | Persona Most Affected |
|----------|-------|----------------------|
| **High** | "Cardonomy Verified" is a brand-new authentication mark with zero market recognition. Users spending thousands need PSA/BGS/CGC grading, not an unknown seal. The positioning should be "additional verification for raw cards" rather than competing with established grading companies. | Investor, Skeptic |
| **Medium** | No comparison to PSA/BGS costs and turnaround times. Users need to understand when Cardonomy Verified is better than sending to PSA. | Investor |
| **Medium** | The "sells ~20% higher" claim has no source. This would need real data to be credible. | Skeptic |

---

## 13. Cross-Cutting Issues

### 13.1 Terminology & Accessibility

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| Grading abbreviations (NM, LP, MP, HP, PSA, BGS, CGC) used without explanation | Excludes 40%+ of potential users (parents, novices, returning players) | Add a universal glossary accessible via (?) icons next to every abbreviation |
| "Buylist" is industry jargon | New users don't know what a buylist is | Rename to "Want list" or "Cards I'm looking for" with "buylist" as subtitle for experienced users |
| "LiveSweep" is a brand name without explanation | Users don't know what it does until they try it | Add a 3-second animated preview showing the scanning motion |
| "Triage" in the shop submission flow | Too clinical for a card marketplace | Use "Sort" or "Review" instead |

### 13.2 Trust & Social Proof Gaps

| Gap | Where | Recommendation |
|-----|-------|----------------|
| No user count or listing volume visible anywhere | Home, search, product pages | Add real-time counters or milestone badges |
| Seller reviews are all 4-5 stars | Seller profiles | Include at least one 3-star review to feel authentic |
| No "How buyer protection actually works" page | Listing page, checkout | Add a dedicated Buyer Protection explainer with examples |
| Testimonials feel fabricated | LGS pitch page, shop enrollment | Use real names, real shop names, or clearly mark as illustrative |
| No visible dispute resolution track record | Nowhere | Add "98% of disputes resolved within 48 hours" or similar (when real data exists) |

### 13.3 Navigation & Information Architecture

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| "You" tab label is ambiguous | Users may not realise this is their dashboard/account | Change to "Account" or show the user's initial |
| Sell hub has 4 options, but "List from your collection" goes to the Watch tab — a different navigation context | Confusing round-trip navigation | Keep the user in the sell flow, show collection inline |
| Settings buried behind gear icon inside the "You" tab | Discovering account type switching is non-obvious | Add account type to the dashboard header as a tappable element |
| No global "Help" or "FAQ" entry point | Users with questions have to find "How it works" | Add a help icon in the top nav or a floating help button |

### 13.4 Desktop vs Mobile Parity

| Issue | Observation |
|-------|------------|
| Desktop home page content ends after "Browse by Game" | Missing: What's Hot, trending, ad carousel, community banner, featured rails, graded spotlight, bulk lots, shop finder. Desktop feels like an incomplete port. |
| Desktop doesn't have equivalent depth for sell flows | Sell single/bulk/shop flows need desktop-optimised layouts |
| Desktop nav bar has "Price Guide" link | This doesn't exist on mobile — feature parity gap |

---

## 14. Priority Fixes (Ranked)

### P0 — Fix Before Any User Testing

| # | Issue | Fix |
|---|-------|-----|
| 1 | **Fee inconsistency** — 9% in listing wizard vs 4%+2%+30p everywhere else | Align all fee displays to 4% seller fee |
| 2 | **Unicode bug** — "\u00A32.50" showing on fees page footnote | Fix £ sign rendering |
| 3 | **Desktop home page truncated** — most content missing below Browse by Game | Complete the desktop home page content |

### P1 — Fix Before Trade Show Demos

| # | Issue | Fix |
|---|-------|-----|
| 4 | No condition/grading explainer anywhere | Add a glossary sheet accessible from condition filters and listing pages |
| 5 | No social proof on home page | Add listing count, seller count, shop count |
| 6 | Verification gate blocks sell flow exploration | Let unverified users explore (but not complete) the sell flow |
| 7 | Buyer Protection fee unexplained in checkout | Add inline explainer and fee cap |
| 8 | "Demo" labels and simulation buttons visible | Hide demo artifacts behind a toggle |

### P2 — Fix Before Public Launch

| # | Issue | Fix |
|---|-------|-----|
| 9 | No help/FAQ accessible from anywhere | Add global help entry point |
| 10 | Buylist terminology is jargon | Rename or add explanatory subtitle |
| 11 | Price slider lacks precision at low values | Add preset price range buttons |
| 12 | Shop counter can't handle multiple simultaneous submissions | Add queue management with parallel processing |
| 13 | No seller counter-offer mechanism in sell-to-shop | Add negotiation to the shop offer thread |
| 14 | Desktop feature parity gaps | Complete desktop equivalents for all mobile flows |

---

## 15. What's Genuinely Great

These features would make users choose Cardconomy over competitors:

1. **Fee calculator on the fees page** — the most persuasive seller acquisition tool in the prototype. Every competitor comparison deck should link here.

2. **LiveSweep scanner concept** — even simulated, the dark camera UI with real-time card recognition and buylist matching sells the vision. This is the hero feature for trade shows.

3. **Shop counter view** — genuinely innovative. No other platform has this. Shop owners who see it will immediately understand the value.

4. **Three distinct dashboards** — the fact that buyer, seller, and store each get a purpose-built command centre is a real differentiator from eBay's one-size-fits-all approach.

5. **Sell-to-local-shop flow** — the triage system (flagged/buylist/singles/bulk) shows deep understanding of how card shops actually work.

6. **Suggested pricing in the listing wizard** — "Suggested: £XX based on recent sales · Use" removes the biggest anxiety for new sellers.

7. **Trade builder with fairness meter** — the visual balance indicator and cash adjustment suggestion make trading feel safe and fair.

8. **Price history charts** — 7D/30D/90D/1Y with last sold, 90d low, and 90d high. This is better than what eBay shows.

---

## 16. Persona-Specific Verdicts

### "Would you switch from your current platform?"

| Persona | Current Platform | Would Switch? | Why / Why Not |
|---------|-----------------|:---:|---|
| Emma (Casual Collector) | eBay | **Yes** | Cleaner UI, better price info, collection tracking. But needs grading explainer. |
| James (Investor) | eBay + Cardmarket | **Maybe** | Price history is great but needs real volume and authenticated grading. Would use alongside, not instead of. |
| Ryan (Returning Player) | None | **Yes** | Scan feature to check old cards is the perfect entry point. Needs condition guide. |
| Aisha (Competitive Player) | Cardmarket | **No** | Cardmarket has deeper catalog for specific singles. Would try for UK sellers but Cardmarket is habit. |
| Sarah (Parent) | Amazon/eBay | **Maybe** | Buyer protection is reassuring but too much jargon. Needs a "simple mode." |
| Luke (First-Time Seller) | None | **Yes** | Suggested pricing and 5-step wizard are less intimidating than eBay. Verification gate needs smoothing. |
| Rachel (Power Seller) | eBay | **Yes** | Fee savings are substantial (£6.50/£100). LiveSweep would save hours. Needs deeper offer management. |
| Dave (LGS Owner) | TCGplayer + in-store | **Yes** | Counter view alone justifies enrollment. Free is compelling. Needs receipt printing and multi-staff. |
| Priya (New LGS) | Instagram | **Yes** | Storefront + shop finder = instant visibility. Enrollment is fast. No reason not to try. |
| Greg (Skeptic) | Facebook groups | **Not yet** | Needs to see real users, real transactions, and real dispute resolutions before trusting it. |
| Chris (Novice) | None | **Unlikely** | Too much jargon. Would buy on Amazon instead unless guided by someone who knows the platform. |

---

## Appendix: Screens Visited During Testing

Home (mobile + desktop) / Search / Product page / Listing detail / Cart / Checkout / Sell hub / Sell single (5 steps) / Bulk listing / Sell to shop (all phases) / Trade (all phases) / Shop counter (dashboard + inbox) / Storefront / Shop enrollment / Shop finder / Watchlist / Collection / Buyer dashboard / Seller dashboard / Store dashboard / Settings / Verification / Card authentication / Fees / How it works / Chat / Tracking / Dispute / Shipping / Batch list / Seller pitch / LGS pitch / Sign in / Sign up / Forgot password / Scan / Notifications / Payments / Offers / Purchases / Selling
