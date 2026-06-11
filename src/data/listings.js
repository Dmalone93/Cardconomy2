// ─────────────────────────────────────────────────────────────
// Cardonomy — marketplace listings & lots
// ─────────────────────────────────────────────────────────────

// helper to build a small price-history series (12 points), trending toward `now`
export function series(start, now) {
  const pts = [];
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const base = start + (now - start) * t;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.6)) * (Math.abs(now - start) * 0.06 + start * 0.015);
    pts.push(Math.max(1, Math.round((base + noise) * 100) / 100));
  }
  pts.push(now);
  return pts;
}

// LISTINGS — the core inventory
export const LISTINGS = [
  {
    id: 'l01', name: 'Charizard ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '199/165', art: '#c2410c', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 432.00, market: 451.00, accepts_offers: true,
    history: series(290, 432), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Dallas, TX', watchers: 41, sold: 0,
  },
  {
    id: 'l02', name: 'Pikachu', subtitle: 'Illustration Rare',
    game: 'pkmn', set: 's151', number: '173/165', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.50, market: 42.00, accepts_offers: true,
    history: series(55, 38.5), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Portland, OR', watchers: 12, sold: 0,
  },
  {
    id: 'l03', name: 'Umbreon VMAX', subtitle: 'Alt Art "Moonbreon"',
    game: 'pkmn', set: 'evs', number: '215/203', art: '#334155', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 1280.00, market: 1420.00, bids: 23, timeLeft: '5h 12m',
    history: series(980, 1280), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Seattle, WA', watchers: 188, sold: 0,
  },
  {
    id: 'l04', name: 'Mewtwo', subtitle: 'Holo \u00b7 1st Edition Shadowless',
    game: 'pkmn', set: 'base', number: '10/102', art: '#6d28d9', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 2150.00, market: 2240.00, accepts_offers: true,
    history: series(1600, 2150), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Chicago, IL', watchers: 96, sold: 0,
  },
  {
    id: 'l05', name: 'Black Lotus', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '232/295', art: '#155e63', foil: false,
    grade: { company: 'bgs', grade: 8.5 }, condition: 'NM-MT+',
    type: 'auction', price: 28500.00, market: 31000.00, bids: 47, timeLeft: '1d 4h',
    history: series(22000, 28500), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 502, sold: 0,
  },
  {
    id: 'l06', name: 'Ragavan, Nimble Pilferer', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '372/303', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 62.00, market: 58.00, accepts_offers: true,
    history: series(48, 62), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 8, sold: 0,
  },
  {
    id: 'l07', name: 'Blue-Eyes White Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'BLMR-EN051', art: '#0e7490', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 184.00, market: 175.00, accepts_offers: true,
    history: series(140, 184), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Miami, FL', watchers: 27, sold: 0,
  },
  {
    id: 'l08', name: 'Dark Magician', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN000', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 71.50, market: 79.00, accepts_offers: true,
    history: series(90, 71.5), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 4.99, ships: '2–4 days', loc: 'Miami, FL', watchers: 15, sold: 0,
  },
  {
    id: 'l09', name: 'Pidgeot ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '197/165', art: '#15803d', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 96.00, market: 102.00, accepts_offers: true,
    history: series(78, 96), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Dallas, TX', watchers: 19, sold: 0,
  },
  {
    id: 'l10', name: 'Monkey D. Luffy', subtitle: 'Leader Parallel',
    game: 'lor', set: 'op07', number: 'OP07-001', art: '#c0392b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'auction', price: 44.00, market: 52.00, bids: 9, timeLeft: '11h 40m',
    history: series(36, 44), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 33, sold: 0,
  },
  {
    id: 'l11', name: 'Latias & Latios GX', subtitle: 'Tag Team \u00b7 Full Art',
    game: 'pkmn', set: 'evs', number: '170/203', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 27.00, market: 31.00, accepts_offers: true,
    history: series(40, 27), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Portland, OR', watchers: 6, sold: 0,
  },
  {
    id: 'l12', name: 'Sting, the Glistening Goblin', subtitle: 'Showcase Foil',
    game: 'mtg', set: 'blb', number: '243/261', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 14.25, market: 12.50, accepts_offers: false,
    history: series(9, 14.25), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 4, sold: 0,
  },
  {
    id: 'l19', name: 'Omnimon', subtitle: 'Alternative Art',
    game: 'digimon', set: 'dgm1', number: 'BT15-102', art: '#1f8fd6', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 48.00, market: 54.00, accepts_offers: true,
    history: series(40, 48), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Los Angeles, CA', watchers: 16, sold: 0,
  },
  {
    id: 'l20', name: 'Agumon', subtitle: 'Box Topper',
    game: 'digimon', set: 'dgm1', number: 'BT15-000', art: '#e67e22', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'auction', price: 12.00, market: 15.00, bids: 5, timeLeft: '13h 05m',
    history: series(9, 12), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 3.99, ships: '2–4 days', loc: 'Los Angeles, CA', watchers: 6, sold: 0,
  },

  // ── more Pokémon ──
  {
    id: 'l13', name: 'Gengar ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '187/167', art: '#6d28d9', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 138.00, market: 152.00, bids: 17, timeLeft: '9h 24m',
    history: series(96, 138), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Seattle, WA', watchers: 64, sold: 0,
  },
  {
    id: 'l14', name: 'Mew ex', subtitle: 'Ultra Rare',
    game: 'pkmn', set: 's151', number: '193/165', art: '#db2777', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 44.00, market: 49.00, accepts_offers: true,
    history: series(58, 44), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Portland, OR', watchers: 14, sold: 0,
  },
  {
    id: 'l21', name: 'Snorlax', subtitle: 'Holo \u00b7 1st Edition',
    game: 'pkmn', set: 'base', number: '11/64', art: '#1e3a5f', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 640.00, market: 690.00, accepts_offers: true,
    history: series(470, 640), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Chicago, IL', watchers: 73, sold: 0,
  },
  {
    id: 'l22', name: 'Gyarados', subtitle: 'Holo \u00b7 1st Edition',
    game: 'pkmn', set: 'base', number: '6/102', art: '#1d4ed8', foil: true,
    grade: { company: 'psa', grade: 8 }, condition: 'NM-MT',
    type: 'buynow', price: 410.00, market: 445.00, accepts_offers: true,
    history: series(320, 410), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Chicago, IL', watchers: 38, sold: 0,
  },
  {
    id: 'l23', name: 'Rayquaza VMAX', subtitle: 'Alt Art Secret Rare',
    game: 'pkmn', set: 'evs', number: '218/203', art: '#15803d', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 520.00, market: 580.00, bids: 31, timeLeft: '6h 48m',
    history: series(390, 520), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Seattle, WA', watchers: 142, sold: 0,
  },
  {
    id: 'l24', name: 'Iono', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '237/193', art: '#7c3aed', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 72.00, market: 68.00, accepts_offers: true,
    history: series(55, 72), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Dallas, TX', watchers: 21, sold: 0,
  },
  {
    id: 'l25', name: 'Gardevoir ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '245/198', art: '#0e7490', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 88.00, market: 95.00, accepts_offers: true,
    history: series(70, 88), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 0, ships: '2–4 days', loc: 'Portland, OR', watchers: 18, sold: 0,
  },

  // ── more Magic: The Gathering ──
  {
    id: 'l26', name: 'The One Ring', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '246/281', art: '#1f2937', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 58.00, market: 64.00, accepts_offers: true,
    history: series(95, 58), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 44, sold: 0,
  },
  {
    id: 'l27', name: 'Orcish Bowmasters', subtitle: 'Extended Art',
    game: 'mtg', set: 'mh3', number: '102/281', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 34.00, market: 31.00, accepts_offers: true,
    history: series(28, 34), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Denver, CO', watchers: 9, sold: 0,
  },
  {
    id: 'l28', name: 'Sheoldred, the Apocalypse', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '107/281', art: '#831843', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 76.00, market: 84.00, accepts_offers: true,
    history: series(64, 76), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Denver, CO', watchers: 23, sold: 0,
  },
  {
    id: 'l29', name: 'Mox Sapphire', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '265/295', art: '#1e40af', foil: false,
    grade: { company: 'bgs', grade: 7 }, condition: 'NM',
    type: 'auction', price: 8200.00, market: 9000.00, bids: 22, timeLeft: '2d 6h',
    history: series(6400, 8200), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 211, sold: 0,
  },
  {
    id: 'l30', name: 'Ancestral Recall', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '048/295', art: '#0369a1', foil: false,
    grade: { company: 'cgc', grade: 8 }, condition: 'NM',
    type: 'buynow', price: 11500.00, market: 12400.00, accepts_offers: true,
    history: series(9000, 11500), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 168, sold: 0,
  },
  {
    id: 'l31', name: 'Liliana of the Veil', subtitle: 'Borderless Planeswalker',
    game: 'mtg', set: 'mh3', number: '198/281', art: '#3f3f46', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 22.00, market: 25.00, accepts_offers: true,
    history: series(30, 22), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 7, sold: 0,
  },

  // ── more Yu-Gi-Oh! ──
  {
    id: 'l32', name: 'Red-Eyes Black Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA02-EN014', art: '#991b1b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 58.00, market: 64.00, accepts_offers: true,
    history: series(46, 58), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 4.99, ships: '2–4 days', loc: 'Miami, FL', watchers: 19, sold: 0,
  },
  {
    id: 'l33', name: 'Exodia the Forbidden One', subtitle: 'Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN025', art: '#92400e', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'auction', price: 210.00, market: 240.00, bids: 13, timeLeft: '14h 30m',
    history: series(160, 210), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 0, ships: '1–2 days', loc: 'Columbus, OH', watchers: 51, sold: 0,
  },
  {
    id: 'l34', name: 'Ash Blossom & Joyous Spring', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN044', art: '#be185d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 18.00, market: 16.50, accepts_offers: true,
    history: series(14, 18), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Columbus, OH', watchers: 11, sold: 0,
  },
  {
    id: 'l35', name: 'Slifer the Sky Dragon', subtitle: 'Ghost Rare',
    game: 'ygo', set: 'ann25', number: 'GFP2-EN181', art: '#b91c1c', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 124.00, market: 135.00, accepts_offers: true,
    history: series(98, 124), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Miami, FL', watchers: 29, sold: 0,
  },

  // ── more One Piece ──
  {
    id: 'l36', name: 'Roronoa Zoro', subtitle: 'Super Rare',
    game: 'lor', set: 'op07', number: 'OP07-025', art: '#166534', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 32.00, market: 36.00, accepts_offers: true,
    history: series(26, 32), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 22, sold: 0,
  },
  {
    id: 'l37', name: 'Nami', subtitle: 'Character Parallel',
    game: 'lor', set: 'op07', number: 'OP07-074', art: '#ea580c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 21.00, market: 24.00, accepts_offers: true,
    history: series(17, 21), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 13, sold: 0,
  },
  {
    id: 'l38', name: 'Trafalgar Law', subtitle: 'Leader',
    game: 'lor', set: 'op07', number: 'OP07-051', art: '#1e3a8a', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'auction', price: 28.00, market: 34.00, bids: 7, timeLeft: '17h 12m',
    history: series(22, 28), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 19, sold: 0,
  },
  {
    id: 'l39', name: 'Shanks', subtitle: 'Secret Rare',
    game: 'lor', set: 'op07', number: 'OP07-119', art: '#7f1d1d', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 96.00, market: 108.00, accepts_offers: true,
    history: series(72, 96), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Honolulu, HI', watchers: 47, sold: 0,
  },

  // ── more Digimon ──
  {
    id: 'l40', name: 'WarGreymon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-049', art: '#ca8a04', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 26.00, market: 29.00, accepts_offers: true,
    history: series(20, 26), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Los Angeles, CA', watchers: 14, sold: 0,
  },
  {
    id: 'l41', name: 'MetalGarurumon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-031', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 23.00, market: 21.00, accepts_offers: true,
    history: series(18, 23), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Los Angeles, CA', watchers: 8, sold: 0,
  },

  // ── more Pokémon (live API art) ──
  {
    id: 'l42', name: 'Charizard VMAX', subtitle: 'Shiny \u00b7 Secret Rare',
    game: 'pkmn', set: 'cpa', number: '079/073', art: '#b91c1c', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 540.00, market: 620.00, bids: 28, timeLeft: '7h 18m',
    history: series(420, 540), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Seattle, WA', watchers: 96, sold: 0,
  },
  {
    id: 'l43', name: 'Lugia V', subtitle: 'Alternate Art Secret',
    game: 'pkmn', set: 'sit', number: '186/195', art: '#475569', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 132.00, market: 148.00, accepts_offers: true,
    history: series(108, 132), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Chicago, IL', watchers: 44, sold: 0,
  },
  {
    id: 'l44', name: 'Giratina VSTAR', subtitle: 'Secret Rare',
    game: 'pkmn', set: 'crz', number: 'GG69/GG70', art: '#7c3aed', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 188.00, market: 205.00, accepts_offers: true,
    history: series(150, 188), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Chicago, IL', watchers: 61, sold: 0,
  },
  {
    id: 'l45', name: 'Mewtwo VSTAR', subtitle: 'Galarian Gallery',
    game: 'pkmn', set: 'crz', number: 'GG44/GG70', art: '#db2777', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 28.00, market: 32.00, accepts_offers: true,
    history: series(22, 28), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Denver, CO', watchers: 12, sold: 0,
  },
  {
    id: 'l46', name: 'Pikachu VMAX', subtitle: 'Rainbow Rare',
    game: 'pkmn', set: 'sit', number: '188/185', art: '#eab308', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'auction', price: 84.00, market: 96.00, bids: 11, timeLeft: '10h 03m',
    history: series(64, 84), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Seattle, WA', watchers: 33, sold: 0,
  },

  // ── more Magic: The Gathering (live API art) ──
  {
    id: 'l47', name: 'Mox Ruby', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '264/295', art: '#991b1b', foil: false,
    grade: { company: 'bgs', grade: 7.5 }, condition: 'NM',
    type: 'auction', price: 7600.00, market: 8400.00, bids: 19, timeLeft: '2d 1h',
    history: series(6000, 7600), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 188, sold: 0,
  },
  {
    id: 'l48', name: 'Time Walk', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '083/295', art: '#0369a1', foil: false,
    grade: { company: 'cgc', grade: 8.5 }, condition: 'NM-MT',
    type: 'buynow', price: 13400.00, market: 14200.00, accepts_offers: true,
    history: series(10800, 13400), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 142, sold: 0,
  },
  {
    id: 'l49', name: 'Sol Ring', subtitle: 'Alpha',
    game: 'mtg', set: 'lea', number: '262/295', art: '#a16207', foil: false,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 320.00, market: 360.00, accepts_offers: true,
    history: series(260, 320), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 27, sold: 0,
  },
  {
    id: 'l50', name: 'Atraxa, Grand Unifier', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mom', number: '196/271', art: '#9333ea', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.00, market: 44.00, accepts_offers: true,
    history: series(48, 38), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Austin, TX', watchers: 18, sold: 0,
  },
  {
    id: 'l51', name: 'Lightning Bolt', subtitle: 'Alpha',
    game: 'mtg', set: 'lea', number: '161/295', art: '#dc2626', foil: false,
    grade: { company: 'psa', grade: 6 }, condition: 'EX',
    type: 'buynow', price: 540.00, market: 590.00, accepts_offers: true,
    history: series(440, 540), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured \u00b7 2 days', loc: 'New York, NY', watchers: 36, sold: 0,
  },

  // ── more Yu-Gi-Oh! (live API art) ──
  {
    id: 'l52', name: 'Dark Magician Girl', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN025', art: '#db2777', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 168.00, market: 190.00, bids: 21, timeLeft: '12h 47m',
    history: series(128, 168), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Miami, FL', watchers: 58, sold: 0,
  },
  {
    id: 'l53', name: 'Elemental HERO Stratos', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN008', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 22.00, market: 25.00, accepts_offers: true,
    history: series(18, 22), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Columbus, OH', watchers: 9, sold: 0,
  },
  {
    id: 'l54', name: 'Stardust Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN030', art: '#0891b2', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 64.00, market: 72.00, accepts_offers: true,
    history: series(50, 64), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Miami, FL', watchers: 24, sold: 0,
  },
  {
    id: 'l55', name: 'Pot of Greed', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN999', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 16.00, market: 14.50, accepts_offers: true,
    history: series(12, 16), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Columbus, OH', watchers: 7, sold: 0,
  },

  // ── more One Piece (live API art) ──
  {
    id: 'l56', name: 'Portgas D. Ace', subtitle: 'Super Rare',
    game: 'lor', set: 'op08', number: 'OP08-007', art: '#ea580c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 34.00, market: 39.00, accepts_offers: true,
    history: series(27, 34), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 26, sold: 0,
  },
  {
    id: 'l57', name: 'Sanji', subtitle: 'Super Rare',
    game: 'lor', set: 'op05', number: 'OP05-051', art: '#f59e0b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 18.00, market: 21.00, accepts_offers: true,
    history: series(14, 18), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 11, sold: 0,
  },
  {
    id: 'l58', name: 'Boa Hancock', subtitle: 'Secret Rare',
    game: 'lor', set: 'op08', number: 'OP08-118', art: '#db2777', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 72.00, market: 84.00, bids: 13, timeLeft: '15h 31m',
    history: series(56, 72), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Honolulu, HI', watchers: 39, sold: 0,
  },
  {
    id: 'l59', name: 'Yamato', subtitle: 'Leader',
    game: 'lor', set: 'op05', number: 'OP05-060', art: '#0891b2', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 26.00, market: 30.00, accepts_offers: true,
    history: series(21, 26), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 15, sold: 0,
  },

  // ── more Digimon ──
  {
    id: 'l60', name: 'Beelzemon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-085', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 21.00, market: 24.00, accepts_offers: true,
    history: series(17, 21), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Los Angeles, CA', watchers: 10, sold: 0,
  },
  {
    id: 'l61', name: 'Gallantmon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-067', art: '#b91c1c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 19.00, market: 17.50, accepts_offers: true,
    history: series(15, 19), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Los Angeles, CA', watchers: 6, sold: 0,
  },

  // ── One Piece · Royal Blood (OP-10) ──
  {
    id: 'l62', name: 'Kozuki Oden', subtitle: 'Leader',
    game: 'lor', set: 'op10', number: 'OP10-041', art: '#1e293b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 42.00, market: 48.00, accepts_offers: true,
    history: series(33, 42), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 28, sold: 0,
  },
  {
    id: 'l63', name: 'Kaido', subtitle: 'Secret Rare',
    game: 'lor', set: 'op10', number: 'OP10-117', art: '#0e7490', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'auction', price: 88.00, market: 104.00, bids: 16, timeLeft: '9h 55m',
    history: series(66, 88), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Honolulu, HI', watchers: 52, sold: 0,
  },
  {
    id: 'l64', name: 'Kurozumi Higurashi', subtitle: 'Super Rare',
    game: 'lor', set: 'op10', number: 'OP10-098', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 16.00, market: 19.00, accepts_offers: true,
    history: series(13, 16), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'San Jose, CA', watchers: 9, sold: 0,
  },
];

// BULK LOT listings (distinct surface)
export const LOTS = [
  {
    id: 'lot1', name: 'Scarlet & Violet 151 \u2014 50-Card Holo Lot',
    game: 'pkmn', set: 's151', art: '#1d4ed8', count: 50, img: 'lots/lot50.jpg',
    type: 'buynow', price: 119.00, market: 160.00, condition: 'NM\u2013LP mix',
    seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840, shipping: 0,
    note: 'No duplicates \u00b7 all holo/reverse holo', watchers: 22,
  },
  {
    id: 'lot2', name: 'Modern Horizons 3 \u2014 Draft Chaff Bulk (1,000ct)',
    game: 'mtg', set: 'mh3', art: '#6d28d9', count: 1000, img: 'lots/lot1k.webp',
    type: 'buynow', price: 24.00, market: 35.00, condition: 'NM',
    seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014, shipping: 6.99,
    note: 'Commons + uncommons \u00b7 sleeved in 100s', watchers: 11,
  },
  {
    id: 'lot3', name: 'Yu-Gi-Oh! Vintage Mystery Box \u2014 200 Cards',
    game: 'ygo', set: 'ann25', art: '#7c4dd1', count: 200, img: 'lots/lot200.jpg',
    type: 'auction', price: 41.00, market: 70.00, condition: 'Played\u2013NM mix', bids: 14, timeLeft: '8h 02m',
    seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730, shipping: 5.99,
    note: 'Guaranteed 3+ holos \u00b7 2002\u20132010 era', watchers: 58,
  },
];

export const byId = (id) => LISTINGS.find(l => l.id === id) || LOTS.find(l => l.id === id);
