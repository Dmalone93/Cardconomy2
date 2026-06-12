// ─────────────────────────────────────────────────────────────
// Cardonomy — mock marketplace data
// ─────────────────────────────────────────────────────────────

// Trading card games
const GAMES = [
  { id: 'pkmn', name: 'Pokémon',       short: 'Pokémon',   tint: '#d4a017' },
  { id: 'mtg',  name: 'Magic: The Gathering', short: 'Magic', tint: '#c2691b' },
  { id: 'ygo',  name: 'Yu-Gi-Oh!',     short: 'Yu-Gi-Oh!', tint: '#7c4dd1' },
  { id: 'lor',  name: 'One Piece TCG',  short: 'One Piece', tint: '#c0392b' },
  { id: 'digimon', name: 'Digimon Card Game', short: 'Digimon', tint: '#1f8fd6' },
];

// Sets / series
const SETS = [
  { id: 's151',   game: 'pkmn', name: 'Scarlet & Violet 151',  year: 2023, cards: 207, hue: '#1d4ed8', img: 'sets/s151.jpg' },
  { id: 'ssp',    game: 'pkmn', name: 'Surging Sparks',         year: 2024, cards: 252, hue: '#9d174d', img: 'sets/ssp.webp' },
  { id: 'evs',    game: 'pkmn', name: 'Evolving Skies',         year: 2021, cards: 237, hue: '#0e7490' },
  { id: 'base',   game: 'pkmn', name: 'Base Set (1999)',        year: 1999, cards: 102, hue: '#b45309' },
  { id: 'mh3',    game: 'mtg',  name: 'Modern Horizons 3',      year: 2024, cards: 303, hue: '#6d28d9' },
  { id: 'blb',    game: 'mtg',  name: 'Bloomburrow',            year: 2024, cards: 261, hue: '#15803d', img: 'sets/blb.webp' },
  { id: 'ltr',    game: 'mtg',  name: 'Tales of Middle-earth',  year: 2023, cards: 281, hue: '#b45309', img: 'sets/ltr.jpg' },
  { id: 'm20',    game: 'mtg',  name: 'Core Set 2020',          year: 2019, cards: 344, hue: '#dc2626', img: 'sets/m20.jpg' },
  { id: 'lea',    game: 'mtg',  name: 'Alpha (1993)',           year: 1993, cards: 295, hue: '#334155' },
  { id: 'ann25',  game: 'ygo',  name: '25th Anniversary Rarity',year: 2023, cards: 70,  hue: '#7c4dd1' },
  { id: 'op07',   game: 'lor',  name: '500 Years in the Future',year: 2024, cards: 118, hue: '#c0392b', img: 'sets/op07.jpg' },
  { id: 'dgm1',   game: 'digimon',name: 'Liberator',              year: 2024, cards: 104, hue: '#1f8fd6' },
  // ── added sets (for the API-backed listings below) ──
  { id: 'cpa',    game: 'pkmn', name: "Champion's Path",          year: 2020, cards: 80,  hue: '#7c3aed' },
  { id: 'sit',    game: 'pkmn', name: 'Silver Tempest',           year: 2022, cards: 245, hue: '#475569' },
  { id: 'crz',    game: 'pkmn', name: 'Crown Zenith',             year: 2023, cards: 230, hue: '#b8860b' },
  { id: 'mom',    game: 'mtg',  name: 'March of the Machine',     year: 2023, cards: 291, hue: '#9333ea' },
  { id: 'ra02',   game: 'ygo',  name: '25th Anniversary Stampede',year: 2024, cards: 200, hue: '#6d28d9' },
  { id: 'op08',   game: 'lor',  name: 'Two Legends',              year: 2024, cards: 126, hue: '#b91c1c', img: 'sets/op08.webp' },
  { id: 'op05',   game: 'lor',  name: 'Awakening of the New Era', year: 2023, cards: 127, hue: '#0891b2', img: 'sets/op05.webp' },
  { id: 'op10',   game: 'lor',  name: 'Royal Blood',              year: 2025, cards: 127, hue: '#1e293b', img: 'sets/op10.webp' },
];

// art colors for placeholder card faces (deep, varied — like real card art)
const ART = ['#c2410c','#b45309','#15803d','#0e7490','#1d4ed8','#6d28d9','#9d174d','#334155','#7c2d12','#155e63'];

// grade companies
const GRADERS = {
  raw: { label: 'Raw / Ungraded', bg: '#eef0f3', fg: '#3a3d44', accent: '#71757e' },
  psa: { label: 'PSA', bg: '#b91c1c', fg: '#ffffff', accent: '#fca5a5' },
  bgs: { label: 'BGS', bg: '#1e293b', fg: '#e2e8f0', accent: '#cbd5e1' },
  cgc: { label: 'CGC', bg: '#1d4ed8', fg: '#ffffff', accent: '#93c5fd' },
};

function gradeText(g) {
  if (!g || g.company === 'raw') return null;
  const tiers = { 10: 'GEM MINT', 9.5: 'GEM MINT', 9: 'MINT', 8.5: 'NM-MT+', 8: 'NM-MT', 7: 'NEAR MINT' };
  return tiers[g.grade] || '';
}

// helper to build a small price-history series (12 points), trending toward `now`
function series(start, now) {
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
const LISTINGS = [
  {
    id: 'l01', name: 'Charizard ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '199/165', art: '#c2410c', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 432.00, market: 451.00, accepts_offers: true,
    history: series(290, 432), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Manchester', watchers: 41, sold: 0,
  },
  {
    id: 'l02', name: 'Pikachu', subtitle: 'Illustration Rare',
    game: 'pkmn', set: 's151', number: '173/165', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.50, market: 42.00, accepts_offers: true,
    history: series(55, 38.5), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Bristol', watchers: 12, sold: 0,
  },
  {
    id: 'l03', name: 'Umbreon VMAX', subtitle: 'Alt Art "Moonbreon"',
    game: 'pkmn', set: 'evs', number: '215/203', art: '#334155', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 1280.00, market: 1420.00, accepts_offers: true,
    history: series(980, 1280), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Edinburgh', watchers: 188, sold: 0,
  },
  {
    id: 'l04', name: 'Mewtwo', subtitle: 'Holo · 1st Edition Shadowless',
    game: 'pkmn', set: 'base', number: '10/102', art: '#6d28d9', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 2150.00, market: 2240.00, accepts_offers: true,
    history: series(1600, 2150), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 96, sold: 0,
  },
  {
    id: 'l05', name: 'Black Lotus', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '232/295', art: '#155e63', foil: false,
    grade: { company: 'bgs', grade: 8.5 }, condition: 'NM-MT+',
    type: 'buynow', price: 28500.00, market: 31000.00, accepts_offers: true,
    history: series(22000, 28500), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 502, sold: 0,
  },
  {
    id: 'l06', name: 'Ragavan, Nimble Pilferer', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '372/303', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 62.00, market: 58.00, accepts_offers: true,
    history: series(48, 62), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 8, sold: 0,
  },
  {
    id: 'l07', name: 'Blue-Eyes White Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'BLMR-EN051', art: '#0e7490', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 184.00, market: 175.00, accepts_offers: true,
    history: series(140, 184), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 27, sold: 0,
  },
  {
    id: 'l08', name: 'Dark Magician', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN000', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 71.50, market: 79.00, accepts_offers: true,
    history: series(90, 71.5), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 4.99, ships: '2–4 days', loc: 'Liverpool', watchers: 15, sold: 0,
  },
  {
    id: 'l09', name: 'Pidgeot ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '197/165', art: '#15803d', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 96.00, market: 102.00, accepts_offers: true,
    history: series(78, 96), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Manchester', watchers: 19, sold: 0,
  },
  {
    id: 'l10', name: 'Monkey D. Luffy', subtitle: 'Leader Parallel',
    game: 'lor', set: 'op07', number: 'OP07-001', art: '#c0392b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 44.00, market: 52.00, accepts_offers: true,
    history: series(36, 44), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 33, sold: 0,
  },
  {
    id: 'l11', name: 'Latias & Latios GX', subtitle: 'Tag Team · Full Art',
    game: 'pkmn', set: 'evs', number: '170/203', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 27.00, market: 31.00, accepts_offers: true,
    history: series(40, 27), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Bristol', watchers: 6, sold: 0,
  },
  {
    id: 'l12', name: 'Sting, the Glistening Goblin', subtitle: 'Showcase Foil',
    game: 'mtg', set: 'blb', number: '243/261', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 14.25, market: 12.50, accepts_offers: false,
    history: series(9, 14.25), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 4, sold: 0,
  },
  {
    id: 'l19', name: 'Omnimon', subtitle: 'Alternative Art',
    game: 'digimon', set: 'dgm1', number: 'BT15-102', art: '#1f8fd6', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 48.00, market: 54.00, accepts_offers: true,
    history: series(40, 48), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Brighton', watchers: 16, sold: 0,
  },
  {
    id: 'l20', name: 'Agumon', subtitle: 'Box Topper',
    game: 'digimon', set: 'dgm1', number: 'BT15-000', art: '#e67e22', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 12.00, market: 15.00, accepts_offers: true,
    history: series(9, 12), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 3.99, ships: '2–4 days', loc: 'Brighton', watchers: 6, sold: 0,
  },

  // ── more Pokémon ──
  {
    id: 'l13', name: 'Gengar ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '187/167', art: '#6d28d9', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 138.00, market: 152.00, accepts_offers: true,
    history: series(96, 138), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Edinburgh', watchers: 64, sold: 0,
  },
  {
    id: 'l14', name: 'Mew ex', subtitle: 'Ultra Rare',
    game: 'pkmn', set: 's151', number: '193/165', art: '#db2777', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 44.00, market: 49.00, accepts_offers: true,
    history: series(58, 44), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 4.99, ships: '2–4 days', loc: 'Bristol', watchers: 14, sold: 0,
  },
  {
    id: 'l21', name: 'Snorlax', subtitle: 'Holo · 1st Edition',
    game: 'pkmn', set: 'base', number: '11/64', art: '#1e3a5f', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 640.00, market: 690.00, accepts_offers: true,
    history: series(470, 640), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 73, sold: 0,
  },
  {
    id: 'l22', name: 'Gyarados', subtitle: 'Holo · 1st Edition',
    game: 'pkmn', set: 'base', number: '6/102', art: '#1d4ed8', foil: true,
    grade: { company: 'psa', grade: 8 }, condition: 'NM-MT',
    type: 'buynow', price: 410.00, market: 445.00, accepts_offers: true,
    history: series(320, 410), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 38, sold: 0,
  },
  {
    id: 'l23', name: 'Rayquaza VMAX', subtitle: 'Alt Art Secret Rare',
    game: 'pkmn', set: 'evs', number: '218/203', art: '#15803d', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 520.00, market: 580.00, accepts_offers: true,
    history: series(390, 520), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Edinburgh', watchers: 142, sold: 0,
  },
  {
    id: 'l24', name: 'Iono', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '237/193', art: '#7c3aed', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 72.00, market: 68.00, accepts_offers: true,
    history: series(55, 72), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Manchester', watchers: 21, sold: 0,
  },
  {
    id: 'l25', name: 'Gardevoir ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 'ssp', number: '245/198', art: '#0e7490', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 88.00, market: 95.00, accepts_offers: true,
    history: series(70, 88), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 0, ships: '2–4 days', loc: 'Bristol', watchers: 18, sold: 0,
  },

  // ── more Magic: The Gathering ──
  {
    id: 'l26', name: 'The One Ring', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '246/281', art: '#1f2937', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 58.00, market: 64.00, accepts_offers: true,
    history: series(95, 58), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 44, sold: 0,
  },
  {
    id: 'l27', name: 'Orcish Bowmasters', subtitle: 'Extended Art',
    game: 'mtg', set: 'mh3', number: '102/281', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 34.00, market: 31.00, accepts_offers: true,
    history: series(28, 34), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Glasgow', watchers: 9, sold: 0,
  },
  {
    id: 'l28', name: 'Sheoldred, the Apocalypse', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '107/281', art: '#831843', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 76.00, market: 84.00, accepts_offers: true,
    history: series(64, 76), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Glasgow', watchers: 23, sold: 0,
  },
  {
    id: 'l29', name: 'Mox Sapphire', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '265/295', art: '#1e40af', foil: false,
    grade: { company: 'bgs', grade: 7 }, condition: 'NM',
    type: 'buynow', price: 8200.00, market: 9000.00, accepts_offers: true,
    history: series(6400, 8200), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 211, sold: 0,
  },
  {
    id: 'l30', name: 'Ancestral Recall', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '048/295', art: '#0369a1', foil: false,
    grade: { company: 'cgc', grade: 8 }, condition: 'NM',
    type: 'buynow', price: 11500.00, market: 12400.00, accepts_offers: true,
    history: series(9000, 11500), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 168, sold: 0,
  },
  {
    id: 'l31', name: 'Liliana of the Veil', subtitle: 'Borderless Planeswalker',
    game: 'mtg', set: 'mh3', number: '198/281', art: '#3f3f46', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 22.00, market: 25.00, accepts_offers: true,
    history: series(30, 22), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 7, sold: 0,
  },

  // ── more Yu-Gi-Oh! ──
  {
    id: 'l32', name: 'Red-Eyes Black Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA02-EN014', art: '#991b1b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 58.00, market: 64.00, accepts_offers: true,
    history: series(46, 58), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 4.99, ships: '2–4 days', loc: 'Liverpool', watchers: 19, sold: 0,
  },
  {
    id: 'l33', name: 'Exodia the Forbidden One', subtitle: 'Secret Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN025', art: '#92400e', foil: true,
    grade: { company: 'psa', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 210.00, market: 240.00, accepts_offers: true,
    history: series(160, 210), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 0, ships: '1–2 days', loc: 'Newcastle', watchers: 51, sold: 0,
  },
  {
    id: 'l34', name: 'Ash Blossom & Joyous Spring', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN044', art: '#be185d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 18.00, market: 16.50, accepts_offers: true,
    history: series(14, 18), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 11, sold: 0,
  },
  {
    id: 'l35', name: 'Slifer the Sky Dragon', subtitle: 'Ghost Rare',
    game: 'ygo', set: 'ann25', number: 'GFP2-EN181', art: '#b91c1c', foil: true,
    grade: { company: 'bgs', grade: 9 }, condition: 'Mint',
    type: 'buynow', price: 124.00, market: 135.00, accepts_offers: true,
    history: series(98, 124), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 29, sold: 0,
  },

  // ── more One Piece ──
  {
    id: 'l36', name: 'Roronoa Zoro', subtitle: 'Super Rare',
    game: 'lor', set: 'op07', number: 'OP07-025', art: '#166534', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 32.00, market: 36.00, accepts_offers: true,
    history: series(26, 32), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 22, sold: 0,
  },
  {
    id: 'l37', name: 'Nami', subtitle: 'Character Parallel',
    game: 'lor', set: 'op07', number: 'OP07-074', art: '#ea580c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 21.00, market: 24.00, accepts_offers: true,
    history: series(17, 21), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 13, sold: 0,
  },
  {
    id: 'l38', name: 'Trafalgar Law', subtitle: 'Leader',
    game: 'lor', set: 'op07', number: 'OP07-051', art: '#1e3a8a', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 28.00, market: 34.00, accepts_offers: true,
    history: series(22, 28), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 19, sold: 0,
  },
  {
    id: 'l39', name: 'Shanks', subtitle: 'Secret Rare',
    game: 'lor', set: 'op07', number: 'OP07-119', art: '#7f1d1d', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 96.00, market: 108.00, accepts_offers: true,
    history: series(72, 96), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Bath', watchers: 47, sold: 0,
  },

  // ── more Digimon ──
  {
    id: 'l40', name: 'WarGreymon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-049', art: '#ca8a04', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 26.00, market: 29.00, accepts_offers: true,
    history: series(20, 26), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Brighton', watchers: 14, sold: 0,
  },
  {
    id: 'l41', name: 'MetalGarurumon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-031', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 23.00, market: 21.00, accepts_offers: true,
    history: series(18, 23), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Brighton', watchers: 8, sold: 0,
  },

  // ── more Pokémon (live API art) ──
  {
    id: 'l42', name: 'Charizard VMAX', subtitle: 'Shiny · Secret Rare',
    game: 'pkmn', set: 'cpa', number: '079/073', art: '#b91c1c', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 540.00, market: 620.00, accepts_offers: true,
    history: series(420, 540), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Edinburgh', watchers: 96, sold: 0,
  },
  {
    id: 'l43', name: 'Lugia V', subtitle: 'Alternate Art Secret',
    game: 'pkmn', set: 'sit', number: '186/195', art: '#475569', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 132.00, market: 148.00, accepts_offers: true,
    history: series(108, 132), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 44, sold: 0,
  },
  {
    id: 'l44', name: 'Giratina VSTAR', subtitle: 'Secret Rare',
    game: 'pkmn', set: 'crz', number: 'GG69/GG70', art: '#7c3aed', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 188.00, market: 205.00, accepts_offers: true,
    history: series(150, 188), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 61, sold: 0,
  },
  {
    id: 'l45', name: 'Mewtwo VSTAR', subtitle: 'Galarian Gallery',
    game: 'pkmn', set: 'crz', number: 'GG44/GG70', art: '#db2777', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 28.00, market: 32.00, accepts_offers: true,
    history: series(22, 28), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '2–3 days', loc: 'Glasgow', watchers: 12, sold: 0,
  },
  {
    id: 'l46', name: 'Pikachu VMAX', subtitle: 'Rainbow Rare',
    game: 'pkmn', set: 'sit', number: '188/185', art: '#eab308', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 84.00, market: 96.00, accepts_offers: true,
    history: series(64, 84), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Edinburgh', watchers: 33, sold: 0,
  },

  // ── more Magic: The Gathering (live API art) ──
  {
    id: 'l47', name: 'Mox Ruby', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '264/295', art: '#991b1b', foil: false,
    grade: { company: 'bgs', grade: 7.5 }, condition: 'NM',
    type: 'buynow', price: 7600.00, market: 8400.00, accepts_offers: true,
    history: series(6000, 7600), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 188, sold: 0,
  },
  {
    id: 'l48', name: 'Time Walk', subtitle: 'Power Nine',
    game: 'mtg', set: 'lea', number: '083/295', art: '#0369a1', foil: false,
    grade: { company: 'cgc', grade: 8.5 }, condition: 'NM-MT',
    type: 'buynow', price: 13400.00, market: 14200.00, accepts_offers: true,
    history: series(10800, 13400), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 142, sold: 0,
  },
  {
    id: 'l49', name: 'Sol Ring', subtitle: 'Alpha',
    game: 'mtg', set: 'lea', number: '262/295', art: '#a16207', foil: false,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 320.00, market: 360.00, accepts_offers: true,
    history: series(260, 320), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 27, sold: 0,
  },
  {
    id: 'l50', name: 'Atraxa, Grand Unifier', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mom', number: '196/271', art: '#9333ea', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.00, market: 44.00, accepts_offers: true,
    history: series(48, 38), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '2–3 days', loc: 'Birmingham', watchers: 18, sold: 0,
  },
  {
    id: 'l51', name: 'Lightning Bolt', subtitle: 'Alpha',
    game: 'mtg', set: 'lea', number: '161/295', art: '#dc2626', foil: false,
    grade: { company: 'psa', grade: 6 }, condition: 'EX',
    type: 'buynow', price: 540.00, market: 590.00, accepts_offers: true,
    history: series(440, 540), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: 'Insured · 2 days', loc: 'London', watchers: 36, sold: 0,
  },

  // ── more Yu-Gi-Oh! (live API art) ──
  {
    id: 'l52', name: 'Dark Magician Girl', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN025', art: '#db2777', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 168.00, market: 190.00, accepts_offers: true,
    history: series(128, 168), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 58, sold: 0,
  },
  {
    id: 'l53', name: 'Elemental HERO Stratos', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN008', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 22.00, market: 25.00, accepts_offers: true,
    history: series(18, 22), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 9, sold: 0,
  },
  {
    id: 'l54', name: 'Stardust Dragon', subtitle: 'Quarter Century Secret Rare',
    game: 'ygo', set: 'ra02', number: 'RA02-EN030', art: '#0891b2', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 64.00, market: 72.00, accepts_offers: true,
    history: series(50, 64), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 24, sold: 0,
  },
  {
    id: 'l55', name: 'Pot of Greed', subtitle: 'Ultra Rare',
    game: 'ygo', set: 'ann25', number: 'RA01-EN999', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 16.00, market: 14.50, accepts_offers: true,
    history: series(12, 16), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 7, sold: 0,
  },

  // ── more One Piece (live API art) ──
  {
    id: 'l56', name: 'Portgas D. Ace', subtitle: 'Super Rare',
    game: 'lor', set: 'op08', number: 'OP08-007', art: '#ea580c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 34.00, market: 39.00, accepts_offers: true,
    history: series(27, 34), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 26, sold: 0,
  },
  {
    id: 'l57', name: 'Sanji', subtitle: 'Super Rare',
    game: 'lor', set: 'op05', number: 'OP05-051', art: '#f59e0b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 18.00, market: 21.00, accepts_offers: true,
    history: series(14, 18), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 11, sold: 0,
  },
  {
    id: 'l58', name: 'Boa Hancock', subtitle: 'Secret Rare',
    game: 'lor', set: 'op08', number: 'OP08-118', art: '#db2777', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 72.00, market: 84.00, accepts_offers: true,
    history: series(56, 72), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Bath', watchers: 39, sold: 0,
  },
  {
    id: 'l59', name: 'Yamato', subtitle: 'Leader',
    game: 'lor', set: 'op05', number: 'OP05-060', art: '#0891b2', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 26.00, market: 30.00, accepts_offers: true,
    history: series(21, 26), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 15, sold: 0,
  },

  // ── more Digimon ──
  {
    id: 'l60', name: 'Beelzemon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-085', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 21.00, market: 24.00, accepts_offers: true,
    history: series(17, 21), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Brighton', watchers: 10, sold: 0,
  },
  {
    id: 'l61', name: 'Gallantmon', subtitle: 'Super Rare',
    game: 'digimon', set: 'dgm1', number: 'BT15-067', art: '#b91c1c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 19.00, market: 17.50, accepts_offers: true,
    history: series(15, 19), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–3 days', loc: 'Brighton', watchers: 6, sold: 0,
  },

  // ── One Piece · Royal Blood (OP-10) ──
  {
    id: 'l62', name: 'Kozuki Oden', subtitle: 'Leader',
    game: 'lor', set: 'op10', number: 'OP10-041', art: '#1e293b', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 42.00, market: 48.00, accepts_offers: true,
    history: series(33, 42), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 28, sold: 0,
  },
  {
    id: 'l63', name: 'Kaido', subtitle: 'Secret Rare',
    game: 'lor', set: 'op10', number: 'OP10-117', art: '#0e7490', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 88.00, market: 104.00, accepts_offers: true,
    history: series(66, 88), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '1–2 days', loc: 'Bath', watchers: 52, sold: 0,
  },
  {
    id: 'l64', name: 'Kurozumi Higurashi', subtitle: 'Super Rare',
    game: 'lor', set: 'op10', number: 'OP10-098', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 16.00, market: 19.00, accepts_offers: true,
    history: series(13, 16), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 9, sold: 0,
  },

  // ── Pokémon ────────────────────────────────────────────────
  {
    id: 'l65', name: 'Mewtwo ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '195/165', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 68.00, market: 82.00, accepts_offers: true,
    history: series(55, 68), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 34, sold: 0,
  },
  {
    id: 'l66', name: 'Alakazam ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '201/165', art: '#1d4ed8', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 145.00, market: 165.00, accepts_offers: true,
    history: series(110, 145), seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840,
    shipping: 0, ships: '1–2 days', loc: 'Manchester', watchers: 61, sold: 0,
  },
  {
    id: 'l67', name: 'Gengar ex', subtitle: 'Special Illustration Rare',
    game: 'pkmn', set: 's151', number: '193/165', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 42.00, market: 50.00, accepts_offers: true,
    history: series(35, 42), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Edinburgh', watchers: 29, sold: 0,
  },
  {
    id: 'l68', name: 'Eevee', subtitle: 'Illustration Rare',
    game: 'pkmn', set: 's151', number: '174/165', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 18.00, market: 22.00, accepts_offers: true,
    history: series(14, 18), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 1.99, ships: '1 day', loc: 'Edinburgh', watchers: 16, sold: 0,
  },
  {
    id: 'l69', name: 'Dragonite', subtitle: 'Holo Rare',
    game: 'pkmn', set: 'base', number: '4/62', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 55.00, market: 72.00, accepts_offers: true,
    history: series(48, 55), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 22, sold: 0,
  },
  {
    id: 'l70', name: 'Blastoise', subtitle: 'Base Set Holo',
    game: 'pkmn', set: 'base', number: '2/102', art: '#1d4ed8', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 480.00, market: 520.00, accepts_offers: true,
    history: series(400, 480), seller: 'VintageHolos', sellerRating: 100, sellerSales: 5610,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 88, sold: 0,
  },
  {
    id: 'l71', name: 'Venusaur', subtitle: 'Base Set Holo',
    game: 'pkmn', set: 'base', number: '15/102', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Moderately Played',
    type: 'buynow', price: 85.00, market: 120.00, accepts_offers: true,
    history: series(70, 85), seller: 'KantoCollects', sellerRating: 98.1, sellerSales: 3402,
    shipping: 0, ships: '2–4 days', loc: 'Bristol', watchers: 19, sold: 0,
  },
  {
    id: 'l72', name: 'Rayquaza VMAX', subtitle: 'Alt Art Secret',
    game: 'pkmn', set: 'evs', number: '218/203', art: '#15803d', foil: true,
    grade: { company: 'bgs', grade: 9.5 }, condition: 'Gem Mint',
    type: 'buynow', price: 320.00, market: 360.00, accepts_offers: true,
    history: series(270, 320), seller: 'PokeGrails', sellerRating: 99.0, sellerSales: 7420,
    shipping: 0, ships: '1–2 days', loc: 'Leeds', watchers: 72, sold: 0,
  },
  {
    id: 'l73', name: 'Sylveon VMAX', subtitle: 'Alt Art Secret',
    game: 'pkmn', set: 'evs', number: '212/203', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 95.00, market: 110.00, accepts_offers: true,
    history: series(80, 95), seller: 'EeveeVault', sellerRating: 99.8, sellerSales: 8921,
    shipping: 0, ships: '1 day', loc: 'Edinburgh', watchers: 44, sold: 0,
  },
  {
    id: 'l74', name: 'Mew ex', subtitle: 'Full Art',
    game: 'pkmn', set: 's151', number: '186/165', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 28.00, market: 34.00, accepts_offers: true,
    history: series(22, 28), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '1–2 days', loc: 'Liverpool', watchers: 18, sold: 0,
  },

  // ── Magic: The Gathering ──────────────────────────────────
  {
    id: 'l75', name: 'Black Lotus', subtitle: 'Alpha Edition',
    game: 'mtg', set: 'lea', number: '232/295', art: '#334155', foil: false,
    grade: { company: 'bgs', grade: 9.5 }, condition: 'Near Mint',
    type: 'buynow', price: 499.00, market: 550.00, accepts_offers: true,
    history: series(420, 499), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: '1–2 days', loc: 'London', watchers: 112, sold: 0,
  },
  {
    id: 'l76', name: 'The One Ring', subtitle: 'Serialized 1/1',
    game: 'mtg', set: 'ltr', number: '246/276', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 350.00, market: 400.00, accepts_offers: true,
    history: series(280, 350), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 0, ships: '1–2 days', loc: 'Birmingham', watchers: 95, sold: 0,
  },
  {
    id: 'l77', name: 'Ragavan, Nimble Pilferer', subtitle: 'Retro Frame',
    game: 'mtg', set: 'mh3', number: '389/303', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 62.00, market: 70.00, accepts_offers: true,
    history: series(50, 62), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 0, ships: '1–2 days', loc: 'Birmingham', watchers: 38, sold: 0,
  },
  {
    id: 'l78', name: 'Wrenn and Six', subtitle: 'Borderless Mythic',
    game: 'mtg', set: 'mh3', number: '380/303', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 44.00, market: 52.00, accepts_offers: true,
    history: series(36, 44), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 3.99, ships: '2–3 days', loc: 'Newcastle', watchers: 21, sold: 0,
  },
  {
    id: 'l79', name: 'Orcish Bowmasters', subtitle: 'Extended Art',
    game: 'mtg', set: 'ltr', number: '312/276', art: '#334155', foil: false,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.00, market: 45.00, accepts_offers: true,
    history: series(30, 38), seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014,
    shipping: 1.99, ships: '1–2 days', loc: 'Birmingham', watchers: 17, sold: 0,
  },
  {
    id: 'l80', name: 'Force of Will', subtitle: 'Retro Frame',
    game: 'mtg', set: 'mh3', number: '395/303', art: '#1d4ed8', foil: false,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 52.00, market: 60.00, accepts_offers: true,
    history: series(44, 52), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 25, sold: 0,
  },
  {
    id: 'l81', name: 'Gandalf the Grey', subtitle: 'Showcase Mythic',
    game: 'mtg', set: 'ltr', number: '287/276', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 22.00, market: 28.00, accepts_offers: true,
    history: series(18, 22), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 1.99, ships: '2–3 days', loc: 'Edinburgh', watchers: 14, sold: 0,
  },
  {
    id: 'l82', name: 'Mox Emerald', subtitle: 'Alpha Edition',
    game: 'mtg', set: 'lea', number: '261/295', art: '#15803d', foil: false,
    grade: { company: 'raw' }, condition: 'Moderately Played',
    type: 'buynow', price: 280.00, market: 350.00, accepts_offers: true,
    history: series(240, 280), seller: 'AlphaInvest', sellerRating: 100, sellerSales: 1290,
    shipping: 0, ships: '1–2 days', loc: 'London', watchers: 56, sold: 0,
  },
  {
    id: 'l83', name: 'Fetch Lands Bundle', subtitle: 'Flooded Strand + Polluted Delta',
    game: 'mtg', set: 'mh3', number: '254/303', art: '#0e7490', foil: false,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 35.00, market: 40.00, accepts_offers: false,
    history: series(28, 35), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 11, sold: 0,
  },

  // ── Yu-Gi-Oh! ─────────────────────────────────────────────
  {
    id: 'l84', name: 'Blue-Eyes White Dragon', subtitle: 'LOB 1st Edition',
    game: 'ygo', set: 'lob', number: 'LOB-001', art: '#0e7490', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 450.00, market: 500.00, accepts_offers: true,
    history: series(380, 450), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '2–3 days', loc: 'Glasgow', watchers: 97, sold: 0,
  },
  {
    id: 'l85', name: 'Dark Magician', subtitle: 'LOB 1st Edition',
    game: 'ygo', set: 'lob', number: 'LOB-005', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 120.00, market: 140.00, accepts_offers: true,
    history: series(95, 120), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '2–3 days', loc: 'Glasgow', watchers: 42, sold: 0,
  },
  {
    id: 'l86', name: 'Exodia the Forbidden One', subtitle: 'LOB Ultra Rare',
    game: 'ygo', set: 'lob', number: 'LOB-124', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 85.00, market: 100.00, accepts_offers: true,
    history: series(70, 85), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 38, sold: 0,
  },
  {
    id: 'l87', name: 'Red-Eyes Black Dragon', subtitle: 'LOB Ultra Rare',
    game: 'ygo', set: 'lob', number: 'LOB-070', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 65.00, market: 78.00, accepts_offers: true,
    history: series(52, 65), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 0, ships: '2–3 days', loc: 'Glasgow', watchers: 28, sold: 0,
  },
  {
    id: 'l88', name: 'Chaos Emperor Dragon', subtitle: 'IOC Secret Rare',
    game: 'ygo', set: 'ioc', number: 'IOC-000', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 175.00, market: 200.00, accepts_offers: true,
    history: series(140, 175), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '2–3 days', loc: 'Edinburgh', watchers: 55, sold: 0,
  },
  {
    id: 'l89', name: 'Black Luster Soldier — Envoy of the Beginning', subtitle: 'IOC Ultra Rare',
    game: 'ygo', set: 'ioc', number: 'IOC-025', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 55.00, market: 65.00, accepts_offers: true,
    history: series(42, 55), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 24, sold: 0,
  },
  {
    id: 'l90', name: 'Pot of Greed', subtitle: 'LOB Super Rare',
    game: 'ygo', set: 'lob', number: 'LOB-119', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Moderately Played',
    type: 'buynow', price: 12.00, market: 18.00, accepts_offers: true,
    history: series(10, 12), seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730,
    shipping: 3.99, ships: '2–3 days', loc: 'Glasgow', watchers: 8, sold: 0,
  },
  {
    id: 'l91', name: 'Mirror Force', subtitle: 'LOB Ultra Rare',
    game: 'ygo', set: 'lob', number: 'LOB-076', art: '#155e63', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 28.00, market: 35.00, accepts_offers: true,
    history: series(22, 28), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 13, sold: 0,
  },
  {
    id: 'l92', name: 'Ash Blossom & Joyous Spring', subtitle: 'Secret Rare',
    game: 'ygo', set: 'ioc', number: 'DUDE-EN003', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 8.50, market: 12.00, accepts_offers: false,
    history: series(6, 8.5), seller: 'MetaKnight', sellerRating: 98.4, sellerSales: 4205,
    shipping: 1.99, ships: '2–3 days', loc: 'Newcastle', watchers: 7, sold: 0,
  },

  // ── One Piece ─────────────────────────────────────────────
  {
    id: 'l93', name: 'Monkey D. Luffy', subtitle: 'Manga Art Parallel',
    game: 'lor', set: 'op01', number: 'OP01-003', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 125.00, market: 145.00, accepts_offers: true,
    history: series(100, 125), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 0, ships: '2–5 days', loc: 'Cardiff', watchers: 64, sold: 0,
  },
  {
    id: 'l94', name: 'Roronoa Zoro', subtitle: 'Alt Art Leader',
    game: 'lor', set: 'op01', number: 'OP01-001', art: '#15803d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 78.00, market: 90.00, accepts_offers: true,
    history: series(60, 78), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 0, ships: '2–5 days', loc: 'Cardiff', watchers: 41, sold: 0,
  },
  {
    id: 'l95', name: 'Nami', subtitle: 'Super Rare Parallel',
    game: 'lor', set: 'op01', number: 'OP01-016', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 35.00, market: 42.00, accepts_offers: true,
    history: series(28, 35), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '1–2 days', loc: 'Liverpool', watchers: 22, sold: 0,
  },
  {
    id: 'l96', name: 'Shanks', subtitle: 'Secret Rare',
    game: 'lor', set: 'op01', number: 'OP01-120', art: '#c2410c', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 210.00, market: 245.00, accepts_offers: true,
    history: series(170, 210), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '2–3 days', loc: 'Edinburgh', watchers: 73, sold: 0,
  },
  {
    id: 'l97', name: 'Portgas D. Ace', subtitle: 'Alt Art Super Rare',
    game: 'lor', set: 'op01', number: 'OP01-044', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 48.00, market: 55.00, accepts_offers: true,
    history: series(38, 48), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 3.99, ships: '2–5 days', loc: 'Cardiff', watchers: 27, sold: 0,
  },
  {
    id: 'l98', name: 'Boa Hancock', subtitle: 'Secret Rare Parallel',
    game: 'lor', set: 'op10', number: 'OP10-058', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 55.00, market: 64.00, accepts_offers: true,
    history: series(44, 55), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '2–3 days', loc: 'Edinburgh', watchers: 31, sold: 0,
  },
  {
    id: 'l99', name: 'Trafalgar Law', subtitle: 'Leader Parallel',
    game: 'lor', set: 'op01', number: 'OP01-002', art: '#334155', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 62.00, market: 75.00, accepts_offers: true,
    history: series(50, 62), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 0, ships: '1–2 days', loc: 'Liverpool', watchers: 35, sold: 0,
  },
  {
    id: 'l100', name: 'Yamato', subtitle: 'Secret Rare',
    game: 'lor', set: 'op10', number: 'OP10-121', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 72.00, market: 85.00, accepts_offers: true,
    history: series(58, 72), seller: 'GrandLineTCG', sellerRating: 97.6, sellerSales: 1880,
    shipping: 0, ships: '2–5 days', loc: 'Cardiff', watchers: 46, sold: 0,
  },

  // ── Digimon ───────────────────────────────────────────────
  {
    id: 'l101', name: 'Omnimon', subtitle: 'Alt Art Secret Rare',
    game: 'digi', set: 'bt01', number: 'BT1-084', art: '#334155', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 95.00, market: 110.00, accepts_offers: true,
    history: series(75, 95), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–4 days', loc: 'Brighton', watchers: 38, sold: 0,
  },
  {
    id: 'l102', name: 'WarGreymon', subtitle: 'Alt Art Super Rare',
    game: 'digi', set: 'bt01', number: 'BT1-025', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 42.00, market: 50.00, accepts_offers: true,
    history: series(34, 42), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 3.99, ships: '2–4 days', loc: 'Brighton', watchers: 22, sold: 0,
  },
  {
    id: 'l103', name: 'MetalGarurumon', subtitle: 'Alt Art Super Rare',
    game: 'digi', set: 'bt01', number: 'BT1-036', art: '#0e7490', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 38.00, market: 44.00, accepts_offers: true,
    history: series(30, 38), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 3.99, ships: '2–4 days', loc: 'Brighton', watchers: 18, sold: 0,
  },
  {
    id: 'l104', name: 'Beelzemon', subtitle: 'Secret Rare',
    game: 'digi', set: 'ex07', number: 'EX7-044', art: '#7c2d12', foil: true,
    grade: { company: 'psa', grade: 10 }, condition: 'Gem Mint',
    type: 'buynow', price: 88.00, market: 105.00, accepts_offers: true,
    history: series(68, 88), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 0, ships: '2–3 days', loc: 'Edinburgh', watchers: 34, sold: 0,
  },
  {
    id: 'l105', name: 'Gallantmon', subtitle: 'Alt Art Secret Rare',
    game: 'digi', set: 'ex07', number: 'EX7-052', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 65.00, market: 75.00, accepts_offers: true,
    history: series(52, 65), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–4 days', loc: 'Brighton', watchers: 28, sold: 0,
  },
  {
    id: 'l106', name: 'Imperialdramon', subtitle: 'Super Rare',
    game: 'digi', set: 'bt01', number: 'BT1-082', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, condition: 'Lightly Played',
    type: 'buynow', price: 18.00, market: 22.00, accepts_offers: true,
    history: series(14, 18), seller: 'TopDeckTCG', sellerRating: 99.0, sellerSales: 9410,
    shipping: 1.99, ships: '1–2 days', loc: 'Liverpool', watchers: 10, sold: 0,
  },
  {
    id: 'l107', name: 'Agumon', subtitle: 'Box Topper Promo',
    game: 'digi', set: 'bt01', number: 'BT1-010', art: '#b45309', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 5.50, market: 8.00, accepts_offers: false,
    history: series(4, 5.5), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 1.99, ships: '2–4 days', loc: 'Brighton', watchers: 4, sold: 0,
  },
  {
    id: 'l108', name: 'Magnamon', subtitle: 'Alt Art Secret Rare',
    game: 'digi', set: 'ex07', number: 'EX7-030', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 52.00, market: 60.00, accepts_offers: true,
    history: series(40, 52), seller: 'DigiDestined', sellerRating: 98.6, sellerSales: 2118,
    shipping: 0, ships: '2–4 days', loc: 'Brighton', watchers: 24, sold: 0,
  },
  {
    id: 'l109', name: 'Alphamon', subtitle: 'Secret Rare',
    game: 'digi', set: 'ex07', number: 'EX7-058', art: '#334155', foil: true,
    grade: { company: 'raw' }, condition: 'Near Mint',
    type: 'buynow', price: 44.00, market: 52.00, accepts_offers: true,
    history: series(36, 44), seller: 'RareMint', sellerRating: 99.1, sellerSales: 5230,
    shipping: 1.99, ships: '2–3 days', loc: 'Edinburgh', watchers: 19, sold: 0,
  },
];

// BULK LOT listings (distinct surface)
const LOTS = [
  {
    id: 'lot1', name: 'Scarlet & Violet 151 — 50-Card Holo Lot',
    game: 'pkmn', set: 's151', art: '#1d4ed8', count: 50, img: 'lots/lot50.jpg',
    type: 'buynow', price: 119.00, market: 160.00, condition: 'NM–LP mix',
    seller: 'VaultCards', sellerRating: 99.4, sellerSales: 12840, shipping: 0,
    note: 'No duplicates · all holo/reverse holo', watchers: 22,
  },
  {
    id: 'lot2', name: 'Modern Horizons 3 — Draft Chaff Bulk (1,000ct)',
    game: 'mtg', set: 'mh3', art: '#6d28d9', count: 1000, img: 'lots/lot1k.webp',
    type: 'buynow', price: 24.00, market: 35.00, condition: 'NM',
    seller: 'ManaBase', sellerRating: 98.9, sellerSales: 22014, shipping: 6.99,
    note: 'Commons + uncommons · sleeved in 100s', watchers: 11,
  },
  {
    id: 'lot3', name: 'Yu-Gi-Oh! Vintage Mystery Box — 200 Cards',
    game: 'ygo', set: 'ann25', art: '#7c4dd1', count: 200, img: 'lots/lot200.jpg',
    type: 'buynow', price: 41.00, market: 70.00, condition: 'Played–NM mix',
    seller: 'DuelistPrime', sellerRating: 99.2, sellerSales: 6730, shipping: 5.99,
    note: 'Guaranteed 3+ holos · 2002–2010 era', watchers: 58,
  },
];

const byId = (id) => LISTINGS.find(l => l.id === id) || LOTS.find(l => l.id === id);
const setById = (id) => SETS.find(s => s.id === id);
const gameById = (id) => GAMES.find(g => g.id === id);

// ─────────────────────────────────────────────────────────────
// Sell-to-shop: shop, buylist, and a seller's bulk submission
// ─────────────────────────────────────────────────────────────
const SHOP = {
  id: 'gnome', name: 'Gnome Games', initial: 'G', tint: '#2f8f5b',
  loc: 'Oxford', rating: 4.6, reviews: 1280,
  blurb: 'Buying singles, sealed & collections daily. Cash or store credit (+20%).',
  creditBonus: 0.20,
};

// the cards in this submission worth itemizing (the rest is bulk).
// buylist: { want, buy } means it matches the shop's buylist at `buy` each.
const SUB_CARDS = [
  { id: 'sc1', name: 'Umbreon VMAX', subtitle: 'Alt Art "Moonbreon"', game: 'pkmn', set: 'evs', number: '215/203', art: '#334155', foil: true,
    grade: { company: 'psa', grade: 10 }, cond: 'PSA 10', qty: 1, market: 1420, buylist: { want: 2, buy: 980 } },
  { id: 'sc2', name: 'Ragavan, Nimble Pilferer', subtitle: 'Borderless Mythic', game: 'mtg', set: 'mh3', number: '372/303', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 4, market: 58, buylist: { want: 4, buy: 38 } },
  { id: 'sc3', name: 'Charizard ex', subtitle: 'Special Illustration Rare', game: 'pkmn', set: 's151', number: '199/165', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 451, buylist: { want: 3, buy: 300 } },
  { id: 'sc4', name: 'Charizard', subtitle: 'Base Set · Holo', game: 'pkmn', set: 'base', number: '4/102', art: '#b45309', foil: true,
    grade: { company: 'raw' }, cond: 'MP', qty: 1, market: 240, flag: 'Crease + edge whitening', buylist: { want: 1, buy: 150 } },
  { id: 'sc5', name: 'Blue-Eyes White Dragon', subtitle: 'Quarter Century Secret', game: 'ygo', set: 'ann25', number: 'BLMR-EN051', art: '#0e7490', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, cond: 'CGC 9.5', qty: 1, market: 175, buylist: { want: 2, buy: 120 } },
  { id: 'sc6', name: 'Pidgeot ex', subtitle: 'Special Illustration Rare', game: 'pkmn', set: 's151', number: '197/165', art: '#15803d', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 2, market: 102, buylist: { want: 4, buy: 64 } },
  { id: 'sc7', name: 'Pikachu', subtitle: 'Illustration Rare', game: 'pkmn', set: 's151', number: '173/165', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 42, buylist: null },
  { id: 'sc8', name: 'Mewtwo', subtitle: 'Base Set · Holo', game: 'pkmn', set: 'base', number: '10/102', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, cond: 'LP', qty: 1, market: 64, buylist: null },
  { id: 'sc9', name: 'Dark Magician', subtitle: 'Quarter Century Secret', game: 'ygo', set: 'ann25', number: 'RA01-EN000', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 79, buylist: { want: 2, buy: 52 } },
  { id: 'sc10', name: 'Monkey D. Luffy', subtitle: 'Leader Parallel', game: 'lor', set: 'op07', number: 'OP07-001', art: '#c0392b', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 52, buylist: null },
];

// bulk handled by standing per-1000 rates
const BULK_RATES = [
  { id: 'cu', label: 'Commons / Uncommons', per1000: 6, count: 760 },
  { id: 'rh', label: 'Rares / Holos', per1000: 25, count: 52 },
  { id: 'fo', label: 'Foils (any)', per1000: 80, count: 12 },
];

const SUBMISSION = {
  id: 'CC-4471', ticket: '4471', seller: {
    name: 'Jordan M.',
    initial: 'J',
    phone: '•••• 4242',
    tier: 2,
    verified: true,
    rating: 98.5,
    sales: 24,
    disputes: 0,
    memberSince: '2024',
    flags: 0,
  },
  total: 1000, submittedAgo: '2 min ago',
  cards: SUB_CARDS, bulk: BULK_RATES,
  get bulkCount() { return BULK_RATES.reduce((s, b) => s + b.count, 0); },
  get bulkPayout() { return BULK_RATES.reduce((s, b) => s + b.per1000 * b.count / 1000, 0); },
};

// derived aggregates
const subStats = () => {
  const matches = SUB_CARDS.filter(c => c.buylist);
  const buylistPayout = matches.reduce((s, c) => s + c.buylist.buy * Math.min(c.qty, c.buylist.want), 0);
  const buylistCount = matches.reduce((s, c) => s + Math.min(c.qty, c.buylist.want), 0) + 130; // + bulk-tier buylist fillers
  const estMarket = 2140;
  const flagged = SUB_CARDS.filter(c => c.flag).length + 11;
  return { matches, buylistPayout, buylistCount: 142, estMarket, flagged: 12, singles: 34 };
};

// names to cycle through the Live Sweep scanner thumbnails
const SCAN_POOL = [
  { name: 'Charizard ex', art: '#c2410c', game: 'pkmn', match: true },
  { name: 'Pikachu', art: '#9d174d', game: 'pkmn', match: false },
  { name: 'Ragavan, Nimble Pilferer', art: '#7c2d12', game: 'mtg', match: true },
  { name: 'Snorlax', art: '#155e63', game: 'pkmn', match: false },
  { name: 'Umbreon VMAX', art: '#334155', game: 'pkmn', match: true },
  { name: 'Lightning Bolt', art: '#b45309', game: 'mtg', match: false },
  { name: 'Dark Magician', art: '#1d4ed8', game: 'ygo', match: true },
  { name: 'Gardevoir ex', art: '#9d174d', game: 'pkmn', match: false },
  { name: 'Sol Ring', art: '#6d28d9', game: 'mtg', match: false },
  { name: 'Blue-Eyes White Dragon', art: '#0e7490', game: 'ygo', match: true },
  { name: 'Mew ex', art: '#15803d', game: 'pkmn', match: false },
  { name: 'Pidgeot ex', art: '#15803d', game: 'pkmn', match: true },
  { name: 'Counterspell', art: '#1d4ed8', game: 'mtg', match: false },
  { name: 'Monkey D. Luffy', art: '#c0392b', game: 'lor', match: false },
  { name: 'Greninja', art: '#0e7490', game: 'pkmn', match: false },
  { name: 'Thoughtseize', art: '#334155', game: 'mtg', match: true },
];

// ─────────────────────────────────────────────────────────────
// LGS directory + trading partners (community pillar)
// ─────────────────────────────────────────────────────────────
// Local game shops — act as storefronts, buylist intake, local
// vaults, and neutral trade-hub meetup venues.
const SHOPS = [
  { id: 'gnome', name: 'Gnome Games', initial: 'G', tint: '#2f8f5b', loc: 'Oxford', dist: 1.3,
    rating: 4.6, reviews: 1280, vault: true, tradeHub: true, events: true, enrolled: true,
    blurb: 'Buying singles, sealed & collections daily. Cash or store credit (+20%).',
    hours: 'Open till 9pm', inventory: ['l01', 'l09', 'l04', 'l07'], games: ['pkmn', 'mtg', 'ygo'] },
  { id: 'dragon', name: "Dragon's Den", initial: 'D', tint: '#7c3aed', loc: 'Oxford', dist: 3.7,
    rating: 4.8, reviews: 540, vault: true, tradeHub: true, events: true, enrolled: true,
    blurb: 'Competitive play, vintage singles, and a member vault for graded slabs.',
    hours: 'Open till 10pm', inventory: ['l05', 'l06', 'l12'], games: ['mtg', 'lor'] },
  { id: 'mythic', name: 'Mythic Cards & Games', initial: 'M', tint: '#c2410c', loc: 'Headington', dist: 6.6,
    rating: 4.4, reviews: 312, vault: false, tradeHub: true, events: false, enrolled: true,
    blurb: 'Family-run shop. Trade nights every Friday, all ages welcome.',
    hours: 'Open till 8pm', inventory: ['l08', 'l10'], games: ['pkmn', 'ygo', 'digimon'] },
];

// Nearby collectors to trade with. haves = cards they'd give;
// wants = cards they're after (referencing your collection).
const TRADERS = [
  { id: 't1', name: 'Marcus T.', initial: 'M', tint: '#1d4ed8', dist: 1.9, rating: 99, deals: 84,
    haves: ['l19', 'l06'], wants: ['l07'] },
  { id: 't2', name: 'Priya K.', initial: 'P', tint: '#9d174d', dist: 5.6, rating: 98, deals: 42,
    haves: ['l12', 'l19'], wants: ['l09'] },
  { id: 't3', name: 'Diego R.', initial: 'D', tint: '#0e7490', dist: 1.0, rating: 100, deals: 210,
    haves: ['l11', 'l12'], wants: ['l02'] },
];

// the cards you own & could trade away (mirrors collection screen)
const OWNED_REFS = ['l03', 'l07', 'l09', 'l02', 'l12'];

const traderById = (id) => TRADERS.find(t => t.id === id);
const shopById = (id) => SHOPS.find(s => s.id === id) || (SHOP.id === id ? SHOP : null);

// real brand logos for game filters (transparent PNG/SVG)
const GAME_LOGOS = {
  pkmn: 'logos/pkmn.png', mtg: 'logos/mtg.svg', ygo: 'logos/ygo.png', lor: 'logos/lor.svg',
  digimon: 'logos/digimon.svg',
};

// ── Open-to-offers TRADE BOARD ───────────────────────────────
// A poster offers a card and states what they'd accept. lookingFor
// is either { open: true } or { cards: [refs] }; prefs constrain
// acceptable offers (games, min condition, graded/raw/any).
const TRADE_POSTS = [
  { id: 'p1', trader: 't1', offer: 'l03', open: true,
    prefs: { games: ['pkmn'], cond: 'NM+', slab: 'Graded' }, note: 'Chasing high-end Pokémon slabs. Show me what you've got!' },
  { id: 'p2', trader: 't3', offer: 'l08', open: false, wants: ['l09'],
    prefs: { games: ['pkmn'], cond: 'NM', slab: 'Any' }, note: 'Want a Pidgeot ex — will add cash.' },
  { id: 'p3', trader: 't2', offer: 'l06', open: true,
    prefs: { games: ['mtg'], cond: 'LP+', slab: 'Raw' }, note: 'Modern staples only. Bulk rares welcome.' },
  { id: 'p4', trader: 't1', offer: 'l20', open: true,
    prefs: { games: [], cond: 'Any', slab: 'Any' }, note: 'Totally open — surprise me with anything fun.' },
];
const postById = (id) => TRADE_POSTS.find(p => p.id === id);

// ─────────────────────────────────────────────────────────────
// PRODUCTS & OFFERS — product-based marketplace view
// ─────────────────────────────────────────────────────────────

// Seller pool (derived from LISTINGS sellers)
const SELLERS = [
  { name: 'VaultCards',    rating: 99.4, sales: 12840, loc: 'Manchester', address: '14 Tib Street, Northern Quarter, Manchester M4 1SH', since: 2019, blurb: 'Specializing in high-end singles. All cards double-sleeved and shipped in toploaders.', freeShipMin: 50, ships: '1–2 days' },
  { name: 'KantoCollects', rating: 98.1, sales: 3402, loc: 'Bristol', address: '27 Park Street, Clifton, Bristol BS1 5NH', since: 2021, blurb: 'Kanto-era collector turned seller. Fair prices on vintage and modern Pokemon.', freeShipMin: 30, ships: '2–4 days' },
  { name: 'ManaBase',      rating: 98.9, sales: 22014, loc: 'Birmingham', address: '83 Bull Street, Birmingham B4 6AB', since: 2017, blurb: 'One of the UK\'s largest MTG sellers. Competitive pricing on staples and singles.', freeShipMin: 40, ships: '1–2 days' },
  { name: 'DuelistPrime',  rating: 99.2, sales: 6730, loc: 'Glasgow', address: '9 Buchanan Street, Glasgow G1 3HL', since: 2020, blurb: 'Yu-Gi-Oh! specialist. Tournament-ready cards shipped fast.', freeShipMin: 25, ships: '2–3 days' },
  { name: 'TopDeckTCG',    rating: 99.0, sales: 9410, loc: 'Liverpool', address: '41 Bold Street, Liverpool L1 4DN', since: 2018, blurb: 'Multi-game seller with deep stock. We ship same day before 2pm.', freeShipMin: 35, ships: '1–2 days' },
  { name: 'MetaKnight',    rating: 98.4, sales: 4205, loc: 'Newcastle', address: '6 Grainger Street, Newcastle upon Tyne NE1 5JE', since: 2022, blurb: 'Competitive player selling rotating stock. Every card is play-tested quality.', freeShipMin: 30, ships: '2–3 days' },
  { name: 'GrandLineTCG',  rating: 97.6, sales: 1880, loc: 'Cardiff', address: '22 High Street Arcade, Cardiff CF10 1BB', since: 2023, blurb: 'One Piece and Dragon Ball specialist. Growing fast with fair prices.', freeShipMin: 20, ships: '2–5 days' },
  { name: 'DigiDestined',  rating: 98.6, sales: 2118, loc: 'Brighton', address: '55 North Laine, Brighton BN1 1GJ', since: 2022, blurb: 'Digimon and niche TCGs. Hard-to-find cards at reasonable prices.', freeShipMin: 25, ships: '2–4 days' },
  { name: 'PokeGrails',    rating: 99.0, sales: 7420, loc: 'Leeds', address: '18 The Headrow, Leeds LS1 6PU', since: 2018, blurb: 'Premium Pokemon singles. PSA and BGS graded inventory available.', freeShipMin: 50, ships: '1–2 days' },
  { name: 'RareMint',      rating: 99.1, sales: 5230, loc: 'Edinburgh', address: '31 Cockburn Street, Edinburgh EH1 1BP', since: 2019, blurb: 'Curated selection of mint-condition cards across all major TCGs.', freeShipMin: 40, ships: '2–3 days' },
  { name: 'EeveeVault',    rating: 99.8, sales: 8921, loc: 'Edinburgh', address: '7 Victoria Street, Edinburgh EH1 2HE', since: 2017, blurb: 'Eeveelution collector and top-rated seller. Insured shipping on all orders.', freeShipMin: 50, ships: '1 day' },
  { name: 'VintageHolos',  rating: 100,  sales: 5610, loc: 'Leeds', address: '4 Kirkgate, Leeds LS2 7DJ', since: 2016, blurb: 'WOTC-era specialist. Every card authenticated and graded.', freeShipMin: 75, ships: '1–2 days' },
  { name: 'AlphaInvest',   rating: 100,  sales: 1290, loc: 'London', address: '120 Charing Cross Road, London WC2H 0JR', since: 2015, blurb: 'Investment-grade MTG. Alpha, Beta, and Reserved List singles.', freeShipMin: 100, ships: '1–2 days' },
];

const CONDITIONS  = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];
const COND_SHORT  = ['NM', 'LP', 'MP', 'HP'];
const SHIPS       = ['1–2 days', '2–3 days', '2–4 days', '2–5 days', '3–5 days'];
const LOCS        = ['Manchester', 'Bristol', 'Birmingham', 'Glasgow', 'Liverpool',
                     'Newcastle', 'Cardiff', 'Brighton', 'Leeds',
                     'Edinburgh', 'London', 'Bath'];

const TRADER_NAMES = [
  'Jake_Collector', 'SlabKing_UK', 'PikaPal', 'CardVaultNZ',
  'GrailHunter', 'FoilFreak', 'MintCondition', 'TradeEmAll',
  'SleeveItUp', 'DeckMaster99',
];
const TRADE_NOTES = [
  'Happy to meet locally or ship insured.',
  'Looking to complete my set. Fair trades only.',
  'Will consider other offers too — message me.',
  'Chasing this card for a while. Graded preferred.',
  'Can add cash to balance if needed.',
  'Straight swap, both cards in similar condition.',
  'Open to negotiation. Let me know what you have.',
];

// Deterministic pseudo-random from a string seed
function _hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }

// Build PRODUCTS by grouping raw buy-now listings by game+set+number
const PRODUCTS = (() => {
  const raw = LISTINGS.filter(l => l.grade && l.grade.company === 'raw' && l.type === 'buynow');
  const grouped = {};
  raw.forEach(l => {
    const key = l.game + '|' + l.set + '|' + l.number;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  });

  let pid = 0;
  return Object.entries(grouped).map(([key, listings]) => {
    pid++;
    const first = listings[0];
    const id = 'p' + String(pid).padStart(3, '0');

    // Build offers — first from original listing(s)
    const h = _hash(key);
    let oid = 0;
    const offers = listings.map(l => {
      oid++;
      return {
        id: id + '-o' + oid,
        seller: l.seller,
        sellerRating: l.sellerRating,
        sellerSales: l.sellerSales,
        condition: l.condition || 'Near Mint',
        condShort: COND_SHORT[CONDITIONS.indexOf(l.condition)] || 'NM',
        price: l.price,
        shipping: l.shipping,
        ships: l.ships,
        loc: l.loc,
        accepts_offers: l.accepts_offers,
        listingId: l.id,
        images: (h % 3 !== 0) ? 2 : 0, // mock: number of seller photos attached
      };
    });

    // Add 1–3 mock offers per product
    const extraCount = 1 + (h % 3); // 1, 2, or 3
    for (let i = 0; i < extraCount; i++) {
      oid++;
      const si = (h + i * 7) % SELLERS.length;
      const ci = (h + i * 3) % CONDITIONS.length;
      const shi = (h + i * 5) % SHIPS.length;
      const li = (h + i * 11) % LOCS.length;
      const seller = SELLERS[si];
      // Price varies: 80%–130% of first listing price
      const mult = 0.80 + ((h + i * 13) % 51) / 100;
      const price = Math.round(first.price * mult * 100) / 100;
      const shipCost = (h + i) % 3 === 0 ? 0 : [1.99, 3.99, 4.99][(h + i) % 3];
      offers.push({
        id: id + '-o' + oid,
        seller: seller.name,
        sellerRating: seller.rating,
        sellerSales: seller.sales,
        condition: CONDITIONS[ci],
        condShort: COND_SHORT[ci],
        price: price,
        shipping: shipCost,
        ships: SHIPS[shi],
        loc: LOCS[li],
        accepts_offers: (h + i) % 2 === 0,
        listingId: null,
        images: (h + i) % 4 === 0 ? 3 : (h + i) % 3 === 0 ? 1 : 0,
      });
    }

    // Sort offers by price ascending
    offers.sort((a, b) => a.price - b.price);

    const prices = offers.map(o => o.price);
    const low = Math.min(...prices);
    const high = Math.max(...prices);

    // Generate 0–2 mock trade offers
    const tradeOfferCount = h % 5 === 0 ? 0 : (h % 3 === 0 ? 2 : 1);
    const sameGameListings = LISTINGS.filter(l => l.game === first.game && l.id !== first.id);
    const tradeOffers = [];
    for (let ti = 0; ti < tradeOfferCount && sameGameListings.length > 0; ti++) {
      const tni = (h + ti * 9) % TRADER_NAMES.length;
      const tli = (h + ti * 13) % LOCS.length;
      const wantIdx = (h + ti * 7) % sameGameListings.length;
      const wantCard = sameGameListings[wantIdx];
      const tNoteIdx = (h + ti * 11) % TRADE_NOTES.length;
      const tRating = 95 + ((h + ti * 4) % 50) / 10; // 95.0–99.9
      const tTrades = 50 + (h + ti * 17) % 1200;
      tradeOffers.push({
        id: id + '-t' + (ti + 1),
        trader: TRADER_NAMES[tni],
        traderRating: Math.round(tRating * 10) / 10,
        traderTrades: tTrades,
        traderLoc: LOCS[tli],
        verified: tRating >= 98,
        wantCard: {
          name: wantCard.name,
          subtitle: wantCard.subtitle,
          art: wantCard.art,
          game: wantCard.game,
          condition: CONDITIONS[(h + ti) % 2 === 0 ? 0 : 1],
          gradePref: (h + ti) % 3 === 0 ? 'Graded preferred' : (h + ti) % 3 === 1 ? 'Raw OK' : 'Any',
        },
        note: TRADE_NOTES[tNoteIdx],
      });
    }

    return {
      id,
      game: first.game,
      set: first.set,
      number: first.number,
      name: first.name,
      subtitle: first.subtitle,
      art: first.art,
      foil: first.foil,
      market: first.market,
      history: first.history,
      offers,
      low,
      high,
      offerCount: offers.length,
      tradeOffers,
      tradeCount: tradeOffers.length,
    };
  });
})();

function productById(id) { return PRODUCTS.find(p => p.id === id); }
function offersForProduct(id) { const p = PRODUCTS.find(p => p.id === id); return p ? p.offers : []; }
function sellerByName(name) { return SELLERS.find(s => s.name === name); }
function listingsBySeller(name) { return LISTINGS.filter(l => l.seller === name); }

Object.assign(window, {
  GAMES, SETS, ART, GRADERS, gradeText, LISTINGS, LOTS, byId, setById, gameById,
  SHOP, SUBMISSION, SUB_CARDS, BULK_RATES, subStats, SCAN_POOL,
  SHOPS, TRADERS, OWNED_REFS, traderById, shopById,
  TRADE_POSTS, postById, GAME_LOGOS,
  PRODUCTS, productById, offersForProduct, SELLERS, COND_SHORT, sellerByName, listingsBySeller,
});
