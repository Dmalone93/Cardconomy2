// ─────────────────────────────────────────────────────────────
// CARDONOMY — real card image resolver (free TCG APIs)
//   MTG     → Scryfall (keyless, CORS)
//   Pokémon → pokemontcg.io v2 (keyless, CORS)
//   One Piece → apitcg / community (best-effort, graceful fallback)
// Results cache in localStorage; failures fall back to placeholder art.
// ─────────────────────────────────────────────────────────────

let cache = {};
try { cache = JSON.parse(localStorage.getItem('cc_imgcache_v3') || '{}'); } catch (e) { /* ignore */ }
const inflight = {};
let qN = 0; // stagger counter to respect rate limits

function persist() { try { localStorage.setItem('cc_imgcache_v3', JSON.stringify(cache)); } catch (e) { /* ignore */ } }
function key(item) { return item.game + '|' + (item.name || '') + '|' + (item.number || ''); }

function cleanName(n) { return (n || '').replace(/\s*[·∙].*$/, '').trim(); }
function norm(s) { return (s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, ''); }

// One Piece — fetch the full card list once, build a name→image map.
let opPromise = null;
function loadOnePiece() {
  if (opPromise) return opPromise;
  opPromise = fetch('https://www.optcgapi.com/api/allSetCards/')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (list) {
      const map = {};
      (list || []).forEach(function (c) {
        const n = norm(c.card_name);
        if (n && !map[n]) map[n] = c.card_image;
      });
      return map;
    }).catch(function () { return {}; });
  return opPromise;
}

// Gundam — fetch set JSONs from the apitcg/gundam-tcg-data repo (raw GitHub, CORS-ok).
let gdPromise = null;
function loadGundam() {
  if (gdPromise) return gdPromise;
  const base = 'https://raw.githubusercontent.com/apitcg/gundam-tcg-data/main/cards/en/';
  const files = ['gd01.json', 'gd02.json', 'st01.json', 'st02.json', 'st03.json', 'st04.json', 'st05.json', 'st06.json', 'beta.json', 'promotion.json'];
  gdPromise = Promise.all(files.map(function (f) {
    return fetch(base + f).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
  })).then(function (lists) {
    const map = {};
    lists.forEach(function (list) {
      (list || []).forEach(function (c) {
        const img = c.images && (c.images.large || c.images.small);
        if (!img) return;
        const n = norm(c.name);
        if (n && !map[n]) map[n] = img;
        if (c.code) map['#' + norm(c.code)] = img; // also key by card code
      });
    });
    return map;
  }).catch(function () { return {}; });
  return gdPromise;
}

async function lookup(item) {
  const g = item.game, name = cleanName(item.name);
  try {
    if (g === 'mtg') {
      const r = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + encodeURIComponent(name));
      if (!r.ok) return null;
      const d = await r.json();
      return (d.image_uris && d.image_uris.normal) || (d.card_faces && d.card_faces[0].image_uris && d.card_faces[0].image_uris.normal) || null;
    }
    if (g === 'pkmn') {
      const q = 'name:"' + name.replace(/"/g, '') + '"';
      const r2 = await fetch('https://api.pokemontcg.io/v2/cards?q=' + encodeURIComponent(q) + '&pageSize=1&orderBy=-set.releaseDate');
      if (!r2.ok) return null;
      const d2 = await r2.json();
      const c = d2.data && d2.data[0];
      return c && c.images ? (c.images.large || c.images.small) : null;
    }
    if (g === 'ygo') {
      const r4 = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=' + encodeURIComponent(name));
      if (!r4.ok) return null;
      const d4 = await r4.json();
      const yc = d4.data && d4.data[0];
      return yc && yc.card_images && yc.card_images[0] ? yc.card_images[0].image_url : null;
    }
    if (g === 'lor') {
      const map = await loadOnePiece();
      const k = norm(name);
      if (map[k]) return map[k];
      const hit = Object.keys(map).find(function (kk) { return kk.indexOf(k) === 0 || kk.indexOf(k) > -1; });
      return hit ? map[hit] : null;
    }
    if (g === 'gundam') {
      return null;
    }
    if (g === 'digimon') {
      const imgFor = function (code) { return 'https://images.digimoncard.io/images/cards/' + code + '.jpg'; };
      try {
        const digUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://digimoncard.io/api-public/search.php?n=' + name);
        const r5 = await fetch(digUrl);
        if (r5.ok) {
          const d5 = await r5.json();
          const dc = Array.isArray(d5) ? d5[0] : null;
          if (dc && dc.id) return imgFor(dc.id);
        }
      } catch (e) { /* ignore */ }
      return null; // no guessed-number fallback (avoids 404s); placeholder shows instead
    }
  } catch (e) { return null; }
  return null;
}

/**
 * Resolve a card image URL for the given item.
 * Calls cb(url) asynchronously — url may be null if lookup fails.
 */
export function getCardImage(item, cb) {
  if (!item || item.count) { cb(null); return; }          // skip bulk lots
  if (!/^(mtg|pkmn|lor|digimon|ygo)$/.test(item.game)) { cb(null); return; }
  const k = key(item);
  if (cache[k] !== undefined) { cb(cache[k]); return; }
  if (inflight[k]) { inflight[k].push(cb); return; }
  inflight[k] = [cb];
  const delay = (qN++ % 12) * 130;                            // stagger bursts
  setTimeout(function () {
    lookup(item).then(function (url) {
      cache[k] = url || null; if (url) persist();
      (inflight[k] || []).forEach(function (fn) { try { fn(cache[k]); } catch (e) { /* ignore */ } });
      delete inflight[k];
    });
  }, delay);
}
