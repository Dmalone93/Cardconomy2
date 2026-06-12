# Shop Enrollment Wizard Design

## Goal

Replace the current single-tap enroll flow with a 6-step linear wizard that collects everything needed to set up a shop on Cardconomy: business details, verification, game preferences, buylist rates, payout info, and branding.

## Entry Point

User taps "Enroll your shop — free" on the existing EnrollShopScreen landing page. Instead of jumping straight to a success screen, they enter the wizard.

## Step Indicator

A horizontal stepper bar at the top of every step. Six segments/dots, one per step.

- **Current step:** highlighted with accent color, shows step label
- **Completed steps:** filled solid, tappable — user can jump back to any completed step directly
- **Future steps:** dimmed outline, not tappable

The stepper doubles as navigation. Tapping a completed dot jumps back to that step with all data preserved. Users cannot skip forward to uncompleted steps — forward progress is only via the "Continue" button.

## Navigation

- **Back chevron** (top-left) on every step
  - Step 1: exits the wizard entirely. If the user has entered data, show a brief "Discard changes?" confirmation.
  - Steps 2-6: returns to the previous step
- **Continue button** (sticky bottom): advances to the next step. Disabled until required fields are filled.
- **Step dot tap:** jumps back to any completed step. Data is preserved across all steps.

All wizard state lives in a single local state object. Navigating between steps reads/writes to this object. Nothing is lost when jumping around.

## Step 1: Your Shop

**Fields:**
- Shop name — text input, required
- Street address — text input, required
- City — text input, required
- State — text input, required
- ZIP code — text input, required
- Phone number — text input, required
- Opening hours — 7 rows (Mon-Sun), each with open time / close time selectors and a "Closed" toggle. Default: Mon-Sat 10:00am-8:00pm, Sun 11:00am-6:00pm.

**Continue enabled when:** shop name, address (street + city + state + zip), and phone are filled.

## Step 2: Verify Your Business

**Fields:**
- Owner full name — text input, required
- Role — radio group: Owner / Manager / Staff
- Upload — single upload slot for a photo of the storefront or a business registration document. Shows a dashed upload box with camera/gallery icon. Tapping mocks a file selection and shows a placeholder preview thumbnail.

**Info text:** "We verify within 2 business days. Your shop won't appear publicly until verified."

**Continue enabled when:** name is filled and role is selected. Upload is encouraged but not required to continue (they can submit the photo later).

## Step 3: Games You Buy

**Layout:** Grid of 5 TCG cards (Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Digimon). Each card shows the game logo/tint and name. Toggleable — tap to select/deselect. Selected cards have an accent border and checkmark.

**Continue enabled when:** at least 1 game is selected.

## Step 4: Buylist Setup

**Bulk standing rates** — 3 rows:
- Commons / Uncommons — per-1000 price input, default $6
- Rares / Holos — per-1000 price input, default $25
- Foils (any) — per-1000 price input, default $80

**Wanted singles** — "Add a card" button opens a mini search. Select a card from LISTINGS, set a max buy price. Start with 3 empty slots. Each slot shows card name + max price once filled.

**Skip option:** "I'll set this up later" text link below the continue button. Skipping advances to step 5 without requiring any input.

**Continue enabled when:** at least the bulk rates are filled OR the user taps skip.

## Step 5: Payout Details

**Payout method** — radio group:
- Bank transfer
- Store credit only (no cash payouts)

**If bank transfer selected:**
- Account holder name — text input
- Routing number — text input
- Account number — text input

**Info text:** "You can update this anytime in your shop settings."

**Continue enabled when:** a method is selected. If bank, the three fields must be filled.

## Step 6: Branding

**Fields:**
- Shop logo/photo — single upload slot (same mock pattern as step 2). Shows dashed box, tap to "upload", displays placeholder preview.
- Accent color — 8 preset swatches in a row (green, blue, purple, red, orange, teal, slate, gold). Tap to select. Default: first swatch.
- Shop bio — textarea, 3 lines, placeholder: "Tell collectors what makes your shop special". Max 200 characters with counter.

**Preview:** Below the fields, a mini storefront card showing how the shop will appear in the shop finder directory — shop initial/logo, name, selected color, bio snippet, and game badges. Updates live as the user types.

**Continue button text changes to "Submit application".**

## Success Screen

Shown after step 6 submission.

- Animated checkmark (green circle with check, pop animation)
- Heading: "Your application is in review"
- Subtext: "We'll verify your shop within 2 business days and send your QR intake kit."
- Summary card: shop name, address, selected games (badges), accent color swatch
- Primary CTA: "Preview your storefront" — navigates to storefront screen with the shop's data
- Secondary link: "Back to home"

## Data Model

All wizard state is local component state — a single object:

```js
{
  // Step 1
  shopName: '', address: '', city: '', state: '', zip: '', phone: '',
  hours: { mon: { open: '10:00', close: '20:00', closed: false }, ... },
  // Step 2
  ownerName: '', role: 'owner', uploaded: false,
  // Step 3
  games: [],
  // Step 4
  bulkRates: { cu: 6, rh: 25, fo: 80 },
  wantedCards: [],
  buylistSkipped: false,
  // Step 5
  payoutMethod: 'bank',
  bankName: '', routing: '', account: '',
  // Step 6
  logo: false, accentColor: '#2f8f5b', bio: '',
}
```

This is a prototype — no data persists to a server. The wizard demonstrates the flow and UI. On submission, it navigates to the success screen and then the storefront.

## Scope

This spec covers:
- Replacing the current instant-enroll in EnrollShopScreen with the 6-step wizard
- Step indicator with tap-to-jump-back navigation
- All 6 step UIs with mock inputs
- Success screen with summary

This spec does NOT cover:
- Actual file upload (mocked)
- Server-side verification flow
- Shop settings/edit after enrollment
- Desktop version
