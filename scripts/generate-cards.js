#!/usr/bin/env node
// Generate additional mock listings from real TCG card data
// Run: node scripts/generate-cards.js >> /tmp/listings-output.js

const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Cardconomy-Prototype/1.0', 'Accept': 'application/json' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error: ' + e.message)); }
      });
    }).on('error', reject);
  });
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

const SELLERS = [
  { name: 'VaultCards', rating: 99.4, sales: 12840, loc: 'Manchester', ships: '1–2 days', freeMin: 50 },
  { name: 'KantoCollects', rating: 98.1, sales: 3402, loc: 'Bristol', ships: '2–4 days', freeMin: 30 },
  { name: 'ManaBase', rating: 98.9, sales: 22014, loc: 'Birmingham', ships: '1–2 days', freeMin: 40 },
  { name: 'DuelistPrime', rating: 99.2, sales: 6730, loc: 'Glasgow', ships: '2–3 days', freeMin: 25 },
  { name: 'TopDeckTCG', rating: 99.0, sales: 9410, loc: 'Liverpool', ships: '1–2 days', freeMin: 35 },
  { name: 'MetaKnight', rating: 98.4, sales: 4205, loc: 'Newcastle', ships: '2–3 days', freeMin: 30 },
  { name: 'GrandLineTCG', rating: 97.6, sales: 1880, loc: 'Cardiff', ships: '2–5 days', freeMin: 20 },
  { name: 'DigiDestined', rating: 98.6, sales: 2118, loc: 'Brighton', ships: '2–4 days', freeMin: 25 },
  { name: 'PokeGrails', rating: 99.0, sales: 7420, loc: 'Leeds', ships: '1–2 days', freeMin: 50 },
  { name: 'RareMint', rating: 99.1, sales: 5230, loc: 'Edinburgh', ships: '2–3 days', freeMin: 40 },
  { name: 'EeveeVault', rating: 99.8, sales: 8921, loc: 'Edinburgh', ships: '1 day', freeMin: 50 },
  { name: 'VintageHolos', rating: 100, sales: 5610, loc: 'Leeds', ships: '1–2 days', freeMin: 75 },
  { name: 'AlphaInvest', rating: 100, sales: 1290, loc: 'London', ships: '1–2 days', freeMin: 100 },
];
const ART = ['#c2410c','#b45309','#15803d','#0e7490','#1d4ed8','#6d28d9','#9d174d','#334155','#7c2d12','#155e63','#dc2626','#0891b2','#7c3aed','#ea580c','#059669'];

let seed = 42;
function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

function esc(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function makeListing(id, card) {
  const s = pick(SELLERS);
  const isGraded = rand() < 0.25;
  const condIdx = Math.floor(rand() * 4);
  const conds = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];
  const condMults = [1.0, 0.82, 0.65, 0.45];
  const gradeVal = pick([10, 9.5, 9, 8.5, 8, 7]);
  const gradeTexts = { 10: 'Gem Mint', 9.5: 'Gem Mint', 9: 'Mint', 8.5: 'NM-MT+', 8: 'NM-MT', 7: 'Near Mint' };

  let grade, condition, priceMult;
  if (isGraded) {
    const co = pick(['psa', 'bgs', 'cgc']);
    grade = `{ company: '${co}', grade: ${gradeVal} }`;
    condition = gradeTexts[gradeVal];
    priceMult = gradeVal >= 9.5 ? 2.5 : gradeVal >= 9 ? 1.8 : gradeVal >= 8 ? 1.3 : 1.0;
  } else {
    grade = "{ company: 'raw' }";
    condition = conds[condIdx];
    priceMult = condMults[condIdx];
  }

  const price = Math.round(card.price * priceMult * (0.85 + rand() * 0.30) * 100) / 100;
  const market = Math.round(price * (0.95 + rand() * 0.15) * 100) / 100;
  const histStart = Math.round(price * (0.6 + rand() * 0.5) * 100) / 100;
  const shipping = price > s.freeMin ? 0 : pick([0, 1.99, 2.99, 3.99, 4.99]);
  const watchers = Math.floor(rand() * (price > 100 ? 80 : 30)) + 1;
  const accepts = rand() < 0.7;

  return `  {
    id: '${id}', name: '${esc(card.name)}', subtitle: '${esc(card.subtitle)}',
    game: '${card.game}', set: '${card.set}', number: '${esc(card.number)}', art: '${pick(ART)}', foil: ${card.foil},
    grade: ${grade}, condition: '${condition}',
    type: 'buynow', price: ${price}, market: ${market}, accepts_offers: ${accepts},
    history: series(${histStart}, ${price}), seller: '${s.name}', sellerRating: ${s.rating}, sellerSales: ${s.sales},
    shipping: ${shipping}, ships: '${s.ships}', loc: '${s.loc}', watchers: ${watchers}, sold: 0,
  },`;
}

async function main() {
  const allCards = [];

  // ── Pokemon ──
  process.stderr.write('Pokemon... ');
  const pkmnSets = [
    { apiId: 'sv4pt5', setId: 's151' }, { apiId: 'swsh7', setId: 'evs' },
    { apiId: 'sv3pt5', setId: 'cpa' }, { apiId: 'base1', setId: 'base' },
  ];
  for (const { apiId, setId } of pkmnSets) {
    try {
      const d = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${apiId}&orderBy=-tcgplayer.prices.holofoil.market&pageSize=10`);
      for (const c of (d.data || [])) {
        const pr = c.tcgplayer?.prices;
        const p = pr?.holofoil || pr?.reverseHolofoil || pr?.normal || pr?.['1stEditionHolofoil'] || {};
        const m = p.market || p.mid;
        if (!m || m < 1) continue;
        allCards.push({ name: c.name, subtitle: c.rarity || 'Rare', game: 'pkmn', set: setId,
          number: c.number + '/' + (c.set?.printedTotal || '???'),
          foil: /rare|illustration/i.test(c.rarity || ''), price: Math.round(m * 0.79 * 100) / 100 });
      }
      await wait(500);
    } catch (e) { process.stderr.write(`(${setId} failed) `); }
  }
  process.stderr.write(allCards.filter(c => c.game === 'pkmn').length + '\n');

  // ── MTG ──
  process.stderr.write('MTG... ');
  const mtgQueries = [
    { q: 'set:mh3+usd>5', setId: 'mh3' }, { q: 'set:blb+usd>3', setId: 'blb' },
    { q: 'set:ltr+usd>5', setId: 'ltr' }, { q: 'set:mom+usd>3', setId: 'mom' },
    { q: 'set:lea+usd>100', setId: 'lea' }, { q: 'set:m20+usd>2', setId: 'm20' },
  ];
  for (const { q, setId } of mtgQueries) {
    try {
      const d = await fetch('https://api.scryfall.com/cards/search?q=' + encodeURIComponent(q) + '&order=usd&dir=desc&unique=cards');
      for (const c of (d.data || []).slice(0, 10)) {
        const usd = parseFloat(c.prices?.usd || c.prices?.usd_foil || '0');
        if (usd < 1) continue;
        allCards.push({ name: c.name, subtitle: ({ common: 'Common', uncommon: 'Uncommon', rare: 'Rare', mythic: 'Mythic Rare' }[c.rarity] || c.rarity),
          game: 'mtg', set: setId, number: c.collector_number + '/' + (c.printed_size || '???'),
          foil: !!c.foil, price: Math.round(usd * 0.79 * 100) / 100 });
      }
      await wait(150);
    } catch (e) { process.stderr.write(`(${setId} failed) `); }
  }
  process.stderr.write(allCards.filter(c => c.game === 'mtg').length + '\n');

  // ── YGO ──
  process.stderr.write('YGO... ');
  try {
    const d = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?sort=new&num=40&offset=0&sortorder=desc');
    for (const c of (d.data || []).slice(0, 35)) {
      const usd = parseFloat(c.card_prices?.[0]?.tcgplayer_price || '0');
      const gbp = usd > 0 ? Math.round(usd * 0.79 * 100) / 100 : Math.round((2 + rand() * 40) * 100) / 100;
      let rar = c.card_sets?.[0]?.set_rarity || 'Rare';
      if (rar.length > 28) rar = rar.substring(0, 26) + '...';
      allCards.push({ name: c.name, subtitle: rar, game: 'ygo', set: 'ann25',
        number: c.card_sets?.[0]?.set_code || String(c.id),
        foil: /secret|ultra/i.test(rar), price: gbp });
    }
  } catch (e) { process.stderr.write('(failed) '); }
  process.stderr.write(allCards.filter(c => c.game === 'ygo').length + '\n');

  // ── One Piece (curated) ──
  const OP = [
    { name: 'Monkey D. Luffy', subtitle: 'Leader Alt Art', set: 'op07', number: 'OP07-001', price: 42, foil: true },
    { name: 'Roronoa Zoro', subtitle: 'Super Rare', set: 'op07', number: 'OP07-045', price: 28, foil: true },
    { name: 'Nami', subtitle: 'Secret Rare', set: 'op07', number: 'OP07-SR01', price: 65, foil: true },
    { name: 'Shanks', subtitle: 'Leader Parallel', set: 'op08', number: 'OP08-001', price: 38, foil: true },
    { name: 'Boa Hancock', subtitle: 'Alt Art Secret', set: 'op08', number: 'OP08-058', price: 85, foil: true },
    { name: 'Trafalgar Law', subtitle: 'Super Rare', set: 'op05', number: 'OP05-069', price: 22, foil: true },
    { name: 'Portgas D. Ace', subtitle: 'Manga Art Rare', set: 'op10', number: 'OP10-012', price: 55, foil: true },
    { name: 'Kaido', subtitle: 'Leader', set: 'op05', number: 'OP05-001', price: 15, foil: false },
    { name: 'Yamato', subtitle: 'Secret Rare', set: 'op08', number: 'OP08-067', price: 72, foil: true },
    { name: 'Eustass Kid', subtitle: 'Super Rare', set: 'op10', number: 'OP10-044', price: 18, foil: true },
    { name: 'Nico Robin', subtitle: 'Alt Art', set: 'op07', number: 'OP07-089', price: 32, foil: true },
    { name: 'Sanji', subtitle: 'Super Rare', set: 'op10', number: 'OP10-033', price: 25, foil: true },
    { name: 'Crocodile', subtitle: 'Alt Art Secret', set: 'op05', number: 'OP05-055', price: 48, foil: true },
    { name: 'Doflamingo', subtitle: 'Leader Parallel', set: 'op08', number: 'OP08-003', price: 30, foil: true },
    { name: 'Whitebeard', subtitle: 'Manga Art Rare', set: 'op07', number: 'OP07-099', price: 62, foil: true },
  ].map(c => ({ ...c, game: 'lor' }));
  allCards.push(...OP);

  // ── Digimon (curated) ──
  const DIGI = [
    { name: 'Omnimon', subtitle: 'Alt Art Secret Rare', set: 'dgm1', number: 'BT5-086', price: 95, foil: true },
    { name: 'Gallantmon', subtitle: 'Secret Rare', set: 'dgm1', number: 'EX5-073', price: 42, foil: true },
    { name: 'WarGreymon', subtitle: 'Super Rare', set: 'dgm1', number: 'BT12-070', price: 28, foil: true },
    { name: 'MetalGarurumon', subtitle: 'Alt Art', set: 'dgm1', number: 'BT12-029', price: 35, foil: true },
    { name: 'Beelzemon', subtitle: 'Secret Rare', set: 'dgm1', number: 'BT12-085', price: 55, foil: true },
    { name: 'Jesmon', subtitle: 'Super Rare', set: 'dgm1', number: 'BT10-112', price: 18, foil: true },
    { name: 'ShineGreymon', subtitle: 'Rare', set: 'dgm1', number: 'BT13-020', price: 12, foil: false },
    { name: 'Mastemon', subtitle: 'Secret Rare', set: 'dgm1', number: 'EX6-058', price: 38, foil: true },
    { name: 'Sakuyamon', subtitle: 'Alt Art', set: 'dgm1', number: 'EX5-040', price: 22, foil: true },
    { name: 'UlforceVeedramon', subtitle: 'Super Rare', set: 'dgm1', number: 'BT12-033', price: 15, foil: true },
  ].map(c => ({ ...c, game: 'digimon' }));
  allCards.push(...DIGI);

  // Dedup
  const seen = new Set();
  const unique = allCards.filter(c => { const k = c.game + '|' + c.name; if (seen.has(k)) return false; seen.add(k); return true; });
  process.stderr.write(`\nTotal unique: ${unique.length}\n`);

  // Generate listings
  const lines = [];
  let nextId = 110;
  for (const card of unique) {
    const count = rand() < 0.1 ? 3 : rand() < 0.3 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      lines.push(makeListing('l' + nextId, card));
      nextId++;
    }
  }

  const byGame = {};
  for (const c of unique) byGame[c.game] = (byGame[c.game] || 0) + 1;
  process.stderr.write(`Generated ${lines.length} listings (l110–l${nextId - 1})\n`);
  process.stderr.write(`By game: ${JSON.stringify(byGame)}\n`);

  // Output
  console.log('  // ── API-generated listings (l110+) ──');
  console.log('  // Real card names from Scryfall, pokemontcg.io, YGOPRODeck + curated OP/Digimon');
  console.log('');
  console.log(lines.join('\n'));
}

main().catch(e => { process.stderr.write('Fatal: ' + e.message + '\n'); process.exit(1); });
