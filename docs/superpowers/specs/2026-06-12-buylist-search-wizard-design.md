# Buylist Search Wizard Design

## Goal

Replace the inline card search in enrollment Step 4 with a dedicated full-screen buylist wizard. The wizard opens when the shop owner taps "Add to buylist", lets them search cards by name/code, set prices and conditions per card, review and bulk-edit, then returns to Step 4 with the buylist populated.

## Entry Point

Step 4 of the shop enrollment wizard. Below the bulk rates section:
- If no buylist cards: show an "Add to buylist" button
- If cards already added: show the buylist card list with an "Edit buylist" button to reopen the wizard

Tapping either button opens the buylist wizard full-screen, overlaying the enrollment wizard.

## Buylist Wizard — Search Screen

Full-screen view with:

**Header:**
- Back button (top-left) — closes the wizard and returns to Step 4 with whatever cards have been added so far
- Title: "Build your buylist"

**Search input:**
- Text field at top, placeholder: "Search by card name or number..."
- Searches against LISTINGS by name and number fields (case-insensitive substring match)
- Results update as the user types (minimum 2 characters)
- Clear button (X) in the input to reset

**Results list:**
- Each result row shows:
  - CardArt thumbnail (w=44)
  - Card name (bold)
  - Subtitle + game color dot
  - If already added to buylist: green checkmark badge on the row
- Tapping a result that hasn't been added yet expands it inline to show:
  - Condition picker: row of chips — NM, LP, MP, HP, Any. Default: NM.
  - Max buy price: £ input field
  - Quantity: number input, default 1
  - "Add" button — adds the card to the buylist and collapses the row back, showing the green checkmark
- Tapping a result that's already added collapses/removes the expansion (the card stays in the buylist)
- Empty state when no query: "Search for cards to add to your buylist"
- No results state: "No cards found for '{query}'"

**Bottom tray:**
- Floating bar fixed at the bottom, only visible when 1+ cards have been added
- Shows: "N card(s) added" on the left
- "Review" button on the right — navigates to the review screen

## Buylist Wizard — Review Screen

Full-screen view with:

**Header:**
- Back button — returns to search screen (keeps all cards)
- Title: "Review buylist (N cards)"

**Bulk edit bar:**
- Horizontal row at the top of the card list
- "Set all to:" label
- Condition picker (same NM/LP/MP/HP/Any chips)
- Price input (£)
- "Apply" button — sets the chosen condition and/or price on ALL cards in the list. Only applies values that have been filled in (if only condition is set, only condition changes; if only price, only price changes; if both, both change).

**Card list:**
- Each row shows:
  - Card name + subtitle
  - Condition badge (colored: NM=green, LP=amber, MP=orange, HP=red, Any=grey) — tappable to cycle through conditions
  - Quantity — tappable to edit
  - Price (£) — tappable to edit inline
  - Remove button (X) on the right
- All fields are editable inline directly on the review list

**Footer:**
- "Done" button (sticky bottom) — closes the entire wizard, returns to Step 4 with the buylist populated in `form.wantedCards`

## Step 4 Changes

The current Step 4 has an inline card search with autocomplete dropdown. Replace it:

**Keep:** Bulk rates section (commons/uncommons, rares/holos, foils per 1000) — unchanged.

**Replace the inline search with:**
- If `form.wantedCards` is empty: "Add to buylist" button (accent outline style)
- If `form.wantedCards` has entries: summary list showing each card (name, condition, qty, £price), plus an "Edit buylist" button to reopen the wizard

The wizard manages its own internal state while open. On close ("Done" or back), it writes the final card list to `form.wantedCards` via the `set` function.

## Data Shape

Each buylist entry in `form.wantedCards`:
```js
{
  name: 'Charizard ex',
  subtitle: 'Special Illustration Rare',
  game: 'pkmn',
  condition: 'NM',      // NM | LP | MP | HP | Any
  maxPrice: 300,         // number
  qty: 1,                // number
}
```

## Scope

This spec covers:
- Full-screen buylist wizard (search + review screens) as a sub-flow within Step 4
- Replaces the current inline search in Step 4
- Bulk edit functionality on the review screen

This spec does NOT cover:
- Persisting buylist data beyond the wizard (prototype — local state only)
- Real card database search (searches against existing LISTINGS mock data)
- Editing buylist after enrollment is complete
