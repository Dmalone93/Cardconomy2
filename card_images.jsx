// ─────────────────────────────────────────────────────────────
// CARDONOMY — real card image resolver (free TCG APIs)
//   MTG     → Scryfall (keyless, CORS)
//   Pokémon → pokemontcg.io v2 (keyless, CORS)
//   One Piece → apitcg / community (best-effort, graceful fallback)
// Results cache in localStorage; failures fall back to placeholder art.
// ─────────────────────────────────────────────────────────────
window.CardImg = (function () {
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem('cc_imgcache_v3') || '{}'); } catch (e) {}
  var inflight = {};
  var qN = 0; // stagger counter to respect rate limits

  function persist() { try { localStorage.setItem('cc_imgcache_v3', JSON.stringify(cache)); } catch (e) {} }
  function key(item) { return item.game + '|' + (item.name || '') + '|' + (item.number || ''); }

  function cleanName(n) { return (n || '').replace(/\s*[·∙].*$/, '').trim(); }
  function norm(s) { return (s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, ''); }

  // One Piece — fetch the full card list once, build a name→image map.
  var opPromise = null;
  function loadOnePiece() {
    if (opPromise) return opPromise;
    opPromise = fetch('https://www.optcgapi.com/api/allSetCards/')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) {
        var map = {};
        (list || []).forEach(function (c) {
          var n = norm(c.card_name);
          if (n && !map[n]) map[n] = c.card_image;
        });
        return map;
      }).catch(function () { return {}; });
    return opPromise;
  }

  // Gundam — fetch set JSONs from the apitcg/gundam-tcg-data repo (raw GitHub, CORS-ok).
  var gdPromise = null;
  function loadGundam() {
    if (gdPromise) return gdPromise;
    var base = 'https://raw.githubusercontent.com/apitcg/gundam-tcg-data/main/cards/en/';
    var files = ['gd01.json', 'gd02.json', 'st01.json', 'st02.json', 'st03.json', 'st04.json', 'st05.json', 'st06.json', 'beta.json', 'promotion.json'];
    gdPromise = Promise.all(files.map(function (f) {
      return fetch(base + f).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    })).then(function (lists) {
      var map = {};
      lists.forEach(function (list) {
        (list || []).forEach(function (c) {
          var img = c.images && (c.images.large || c.images.small);
          if (!img) return;
          var n = norm(c.name);
          if (n && !map[n]) map[n] = img;
          if (c.code) map['#' + norm(c.code)] = img; // also key by card code
        });
      });
      return map;
    }).catch(function () { return {}; });
    return gdPromise;
  }

  async function lookup(item) {
    var g = item.game, name = cleanName(item.name);
    try {
      if (g === 'mtg') {
        var r = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + encodeURIComponent(name));
        if (!r.ok) return null;
        var d = await r.json();
        return (d.image_uris && d.image_uris.normal) || (d.card_faces && d.card_faces[0].image_uris && d.card_faces[0].image_uris.normal) || null;
      }
      if (g === 'pkmn') {
        var q = 'name:"' + name.replace(/"/g, '') + '"';
        var r2 = await fetch('https://api.pokemontcg.io/v2/cards?q=' + encodeURIComponent(q) + '&pageSize=1&orderBy=-set.releaseDate');
        if (!r2.ok) return null;
        var d2 = await r2.json();
        var c = d2.data && d2.data[0];
        return c && c.images ? (c.images.large || c.images.small) : null;
      }
      if (g === 'ygo') {
        var r4 = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=' + encodeURIComponent(name));
        if (!r4.ok) return null;
        var d4 = await r4.json();
        var yc = d4.data && d4.data[0];
        return yc && yc.card_images && yc.card_images[0] ? yc.card_images[0].image_url : null;
      }
      if (g === 'lor') {
        var map = await loadOnePiece();
        var k = norm(name);
        if (map[k]) return map[k];
        var hit = Object.keys(map).find(function (kk) { return kk.indexOf(k) === 0 || kk.indexOf(k) > -1; });
        return hit ? map[hit] : null;
      }
      if (g === 'gundam') {
        return null;
      }
      if (g === 'digimon') {
        var imgFor = function (code) { return 'https://images.digimoncard.io/images/cards/' + code + '.jpg'; };
        try {
          var digUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://digimoncard.io/api-public/search.php?n=' + name);
          var r5 = await fetch(digUrl);
          if (r5.ok) {
            var d5 = await r5.json();
            var dc = Array.isArray(d5) ? d5[0] : null;
            if (dc && dc.id) return imgFor(dc.id);
          }
        } catch (e) {}
        return null; // no guessed-number fallback (avoids 404s); placeholder shows instead
      }
    } catch (e) { return null; }
    return null;
  }

  function get(item, cb) {
    if (!item || item.count) { cb(null); return; }          // skip bulk lots
    if (!/^(mtg|pkmn|lor|digimon|ygo)$/.test(item.game)) { cb(null); return; }
    var k = key(item);
    if (cache[k] !== undefined) { cb(cache[k]); return; }
    if (inflight[k]) { inflight[k].push(cb); return; }
    inflight[k] = [cb];
    var delay = (qN++ % 12) * 130;                            // stagger bursts
    setTimeout(function () {
      lookup(item).then(function (url) {
        cache[k] = url || null; if (url) persist();
        (inflight[k] || []).forEach(function (fn) { try { fn(cache[k]); } catch (e) {} });
        delete inflight[k];
      });
    }, delay);
  }

  // Check if an item's image lookup has completed and returned null (failed)
  function hasFailed(item) {
    if (!item) return true;
    var k = key(item);
    return cache[k] === null;
  }

  // Check if an item has a cached successful image URL
  function hasUrl(item) {
    if (!item) return false;
    var k = key(item);
    return typeof cache[k] === 'string' && cache[k].length > 0;
  }

  return { get: get, key: key, hasFailed: hasFailed, hasUrl: hasUrl };
})();
