// ─────────────────────────────────────────────────────────────
// Cardonomy — game / set / grading reference data
// ─────────────────────────────────────────────────────────────

// Trading card games
export const GAMES = [
  { id: 'pkmn', name: 'Pokémon',       short: 'Pokémon',   tint: '#d4a017' },
  { id: 'mtg',  name: 'Magic: The Gathering', short: 'Magic', tint: '#c2691b' },
  { id: 'ygo',  name: 'Yu-Gi-Oh!',     short: 'Yu-Gi-Oh!', tint: '#7c4dd1' },
  { id: 'lor',  name: 'One Piece TCG',  short: 'One Piece', tint: '#c0392b' },
  { id: 'digimon', name: 'Digimon Card Game', short: 'Digimon', tint: '#1f8fd6' },
];

// Sets / series
export const SETS = [
  { id: 's151',   game: 'pkmn', name: 'Scarlet & Violet 151',  year: 2023, cards: 207, hue: '#1d4ed8', img: 'sets/s151.jpg' },
  { id: 'ssp',    game: 'pkmn', name: 'Surging Sparks',         year: 2024, cards: 252, hue: '#9d174d', img: 'sets/ssp.webp' },
  { id: 'evs',    game: 'pkmn', name: 'Evolving Skies',         year: 2021, cards: 237, hue: '#0e7490' },
  { id: 'base',   game: 'pkmn', name: 'Base Set (1999)',        year: 1999, cards: 102, hue: '#b45309' },
  { id: 'mh3',    game: 'mtg',  name: 'Modern Horizons 3',      year: 2024, cards: 303, hue: '#6d28d9' },
  { id: 'blb',    game: 'mtg',  name: 'Bloomburrow',            year: 2024, cards: 261, hue: '#15803d', img: 'sets/blb.webp' },
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
export const ART = ['#c2410c','#b45309','#15803d','#0e7490','#1d4ed8','#6d28d9','#9d174d','#334155','#7c2d12','#155e63'];

// grade companies
export const GRADERS = {
  raw: { label: 'Raw / Ungraded', bg: '#eef0f3', fg: '#3a3d44', accent: '#71757e' },
  psa: { label: 'PSA', bg: '#b91c1c', fg: '#ffffff', accent: '#fca5a5' },
  bgs: { label: 'BGS', bg: '#1e293b', fg: '#e2e8f0', accent: '#cbd5e1' },
  cgc: { label: 'CGC', bg: '#1d4ed8', fg: '#ffffff', accent: '#93c5fd' },
};

export function gradeText(g) {
  if (!g || g.company === 'raw') return null;
  const tiers = { 10: 'GEM MINT', 9.5: 'GEM MINT', 9: 'MINT', 8.5: 'NM-MT+', 8: 'NM-MT', 7: 'NEAR MINT' };
  return tiers[g.grade] || '';
}

export const gameById = (id) => GAMES.find(g => g.id === id);
export const setById = (id) => SETS.find(s => s.id === id);
