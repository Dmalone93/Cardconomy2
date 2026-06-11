// ─────────────────────────────────────────────────────────────
// Cardonomy — shops, submissions, traders, trade board
// ─────────────────────────────────────────────────────────────

// Sell-to-shop: shop, buylist, and a seller's bulk submission
export const SHOP = {
  id: 'gnome', name: 'Gnome Games', initial: 'G', tint: '#2f8f5b',
  loc: 'Madison, WI', rating: 4.6, reviews: 1280,
  blurb: 'Buying singles, sealed & collections daily. Cash or store credit (+20%).',
  creditBonus: 0.20,
};

// the cards in this submission worth itemizing (the rest is bulk).
// buylist: { want, buy } means it matches the shop's buylist at `buy` each.
export const SUB_CARDS = [
  { id: 'sc1', name: 'Umbreon VMAX', subtitle: 'Alt Art "Moonbreon"', game: 'pkmn', set: 'evs', number: '215/203', art: '#334155', foil: true,
    grade: { company: 'psa', grade: 10 }, cond: 'PSA 10', qty: 1, market: 1420, buylist: { want: 2, buy: 980 } },
  { id: 'sc2', name: 'Ragavan, Nimble Pilferer', subtitle: 'Borderless Mythic', game: 'mtg', set: 'mh3', number: '372/303', art: '#7c2d12', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 4, market: 58, buylist: { want: 4, buy: 38 } },
  { id: 'sc3', name: 'Charizard ex', subtitle: 'Special Illustration Rare', game: 'pkmn', set: 's151', number: '199/165', art: '#c2410c', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 451, buylist: { want: 3, buy: 300 } },
  { id: 'sc4', name: 'Charizard', subtitle: 'Base Set \u00b7 Holo', game: 'pkmn', set: 'base', number: '4/102', art: '#b45309', foil: true,
    grade: { company: 'raw' }, cond: 'MP', qty: 1, market: 240, flag: 'Crease + edge whitening', buylist: { want: 1, buy: 150 } },
  { id: 'sc5', name: 'Blue-Eyes White Dragon', subtitle: 'Quarter Century Secret', game: 'ygo', set: 'ann25', number: 'BLMR-EN051', art: '#0e7490', foil: true,
    grade: { company: 'cgc', grade: 9.5 }, cond: 'CGC 9.5', qty: 1, market: 175, buylist: { want: 2, buy: 120 } },
  { id: 'sc6', name: 'Pidgeot ex', subtitle: 'Special Illustration Rare', game: 'pkmn', set: 's151', number: '197/165', art: '#15803d', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 2, market: 102, buylist: { want: 4, buy: 64 } },
  { id: 'sc7', name: 'Pikachu', subtitle: 'Illustration Rare', game: 'pkmn', set: 's151', number: '173/165', art: '#9d174d', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 42, buylist: null },
  { id: 'sc8', name: 'Mewtwo', subtitle: 'Base Set \u00b7 Holo', game: 'pkmn', set: 'base', number: '10/102', art: '#6d28d9', foil: true,
    grade: { company: 'raw' }, cond: 'LP', qty: 1, market: 64, buylist: null },
  { id: 'sc9', name: 'Dark Magician', subtitle: 'Quarter Century Secret', game: 'ygo', set: 'ann25', number: 'RA01-EN000', art: '#1d4ed8', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 79, buylist: { want: 2, buy: 52 } },
  { id: 'sc10', name: 'Monkey D. Luffy', subtitle: 'Leader Parallel', game: 'lor', set: 'op07', number: 'OP07-001', art: '#c0392b', foil: true,
    grade: { company: 'raw' }, cond: 'NM', qty: 1, market: 52, buylist: null },
];

// bulk handled by standing per-1000 rates
export const BULK_RATES = [
  { id: 'cu', label: 'Commons / Uncommons', per1000: 6, count: 760 },
  { id: 'rh', label: 'Rares / Holos', per1000: 25, count: 52 },
  { id: 'fo', label: 'Foils (any)', per1000: 80, count: 12 },
];

export const SUBMISSION = {
  id: 'CC-4471', ticket: '4471', seller: { name: 'Jordan M.', initial: 'J', phone: '\u2022\u2022\u2022\u2022 4242' },
  total: 1000, submittedAgo: '2 min ago',
  cards: SUB_CARDS, bulk: BULK_RATES,
  get bulkCount() { return BULK_RATES.reduce((s, b) => s + b.count, 0); },
  get bulkPayout() { return BULK_RATES.reduce((s, b) => s + b.per1000 * b.count / 1000, 0); },
};

// derived aggregates
export const subStats = () => {
  const matches = SUB_CARDS.filter(c => c.buylist);
  const buylistPayout = matches.reduce((s, c) => s + c.buylist.buy * Math.min(c.qty, c.buylist.want), 0);
  const buylistCount = matches.reduce((s, c) => s + Math.min(c.qty, c.buylist.want), 0) + 130; // + bulk-tier buylist fillers
  const estMarket = 2140;
  const flagged = SUB_CARDS.filter(c => c.flag).length + 11;
  return { matches, buylistPayout, buylistCount: 142, estMarket, flagged: 12, singles: 34 };
};

// names to cycle through the Live Sweep scanner thumbnails
export const SCAN_POOL = [
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
export const SHOPS = [
  { id: 'gnome', name: 'Gnome Games', initial: 'G', tint: '#2f8f5b', loc: 'Madison, WI', dist: 0.8,
    rating: 4.6, reviews: 1280, vault: true, tradeHub: true, events: true, enrolled: true,
    blurb: 'Buying singles, sealed & collections daily. Cash or store credit (+20%).',
    hours: 'Open till 9pm', inventory: ['l01', 'l09', 'l04', 'l07'], games: ['pkmn', 'mtg', 'ygo'] },
  { id: 'dragon', name: "Dragon's Den", initial: 'D', tint: '#7c3aed', loc: 'Madison, WI', dist: 2.3,
    rating: 4.8, reviews: 540, vault: true, tradeHub: true, events: true, enrolled: true,
    blurb: 'Competitive play, vintage singles, and a member vault for graded slabs.',
    hours: 'Open till 10pm', inventory: ['l05', 'l06', 'l12'], games: ['mtg', 'lor'] },
  { id: 'mythic', name: 'Mythic Cards & Games', initial: 'M', tint: '#c2410c', loc: 'Sun Prairie, WI', dist: 4.1,
    rating: 4.4, reviews: 312, vault: false, tradeHub: true, events: false, enrolled: true,
    blurb: 'Family-run shop. Trade nights every Friday, all ages welcome.',
    hours: 'Open till 8pm', inventory: ['l08', 'l10'], games: ['pkmn', 'ygo', 'digimon'] },
];

// Nearby collectors to trade with
export const TRADERS = [
  { id: 't1', name: 'Marcus T.', initial: 'M', tint: '#1d4ed8', dist: 1.2, rating: 99, deals: 84,
    haves: ['l19', 'l06'], wants: ['l07'] },
  { id: 't2', name: 'Priya K.', initial: 'P', tint: '#9d174d', dist: 3.5, rating: 98, deals: 42,
    haves: ['l12', 'l19'], wants: ['l09'] },
  { id: 't3', name: 'Diego R.', initial: 'D', tint: '#0e7490', dist: 0.6, rating: 100, deals: 210,
    haves: ['l11', 'l12'], wants: ['l02'] },
];

// the cards you own & could trade away (mirrors collection screen)
export const OWNED_REFS = ['l03', 'l07', 'l09', 'l02', 'l12'];

export const traderById = (id) => TRADERS.find(t => t.id === id);
export const shopById = (id) => SHOPS.find(s => s.id === id) || (SHOP.id === id ? SHOP : null);

// real brand logos for game filters (transparent PNG/SVG)
export const GAME_LOGOS = {
  pkmn: 'logos/pkmn.png', mtg: 'logos/mtg.svg', ygo: 'logos/ygo.png', lor: 'logos/lor.svg',
  digimon: 'logos/digimon.svg',
};

// ── Open-to-offers TRADE BOARD ───────────────────────────────
export const TRADE_POSTS = [
  { id: 'p1', trader: 't1', offer: 'l03', open: true,
    prefs: { games: ['pkmn'], cond: 'NM+', slab: 'Graded' }, note: 'Chasing high-end Pok\u00e9mon slabs. Show me what you\u2019ve got!' },
  { id: 'p2', trader: 't3', offer: 'l08', open: false, wants: ['l09'],
    prefs: { games: ['pkmn'], cond: 'NM', slab: 'Any' }, note: 'Want a Pidgeot ex \u2014 will add cash.' },
  { id: 'p3', trader: 't2', offer: 'l06', open: true,
    prefs: { games: ['mtg'], cond: 'LP+', slab: 'Raw' }, note: 'Modern staples only. Bulk rares welcome.' },
  { id: 'p4', trader: 't1', offer: 'l20', open: true,
    prefs: { games: [], cond: 'Any', slab: 'Any' }, note: 'Totally open \u2014 surprise me with anything fun.' },
];
export const postById = (id) => TRADE_POSTS.find(p => p.id === id);
