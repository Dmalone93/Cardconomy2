// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — TCG Game Landing Page (TCGplayer-style)
// ─────────────────────────────────────────────────────────────
const { T: TG, money: mG, CardArt: CardArtG, Icon: IconG, GradeChip: GradeChipG } = window;
const { GAMES: GAMESG, SETS: SETSG, LISTINGS: LISTSG, gameById: gameByIdG, setById: setByIdG, GAME_LOGOS: GAME_LOGOS_G } = window;
const { DCard: DCardG } = window;

// ── Set banner images per game ────────────────────────────────
const SET_BANNERS_G = {
  pkmn: [
    { img: 'sets/pkmn/sv10-banner.png',                  set: 'ssp',  label: 'Surging Sparks' },
    { img: 'sets/pkmn/thumb-56.webp',                    set: 's151', label: 'Twilight Masquerade' },
    { img: 'sets/pkmn/ascended-heroes-ptcg-thumb.webp',  set: 'cpa',  label: 'Ascended Heroes' },
    { img: 'sets/pkmn/scarlet-violet.jpeg',              set: 'base', label: 'Scarlet & Violet' },
  ],
  mtg: [
    { img: 'sets/mtg/ECL_sma_key_1920x1080_en.jpg',          set: 'mh3', label: 'Lorwyn Eclipsed' },
    { img: 'sets/mtg/HOB-1710_JDBCVHKLWUE_VarA_1080x1080.jpg', set: 'mh3', label: 'The Hobbit' },
    { img: 'sets/mtg/TMT_sma_key_1000x1000.jpg',              set: 'mh3', label: 'The Moonlit Trail' },
    { img: 'sets/mtg/FRA-1313-EN-1080x1080.png',              set: 'mh3', label: 'Foundations Remastered' },
  ],
  lor: [
    { img: 'sets/op/aceluffy.webp',                      set: 'op07', label: 'Romance Dawn' },
    { img: 'sets/op/two-legends.webp',                   set: 'op08', label: 'Two Legends' },
    { img: 'sets/op/awakening-new-era.webp',             set: 'op05', label: 'Awakening of the New Era' },
    { img: 'sets/op/pillars-of-strength.jpeg',           set: 'op10', label: 'Pillars of Strength' },
  ],
};

const GAME_DESCRIPTIONS = {
  pkmn: 'The world\u2019s most collected trading card game. From Base Set to Scarlet & Violet, explore every era of Pok\u00e9mon cards.',
  mtg:  'The original trading card game. 30 years of strategy, art, and collectible value \u2014 from Alpha to Modern Horizons.',
  ygo:  'Fast-paced duels and iconic artwork. One of the most played TCGs worldwide with a thriving singles market.',
  lor:  'The newest TCG phenomenon. Stunning art, growing competitive scene, and rapidly appreciating early sets.',
  digimon: 'A beloved franchise with gorgeous card art. Growing collector community with strong set value retention.',
};

// ── Horizontal product card (TCGplayer-style) ─────────────────
function DProductCard({ item, app }) {
  var _h = React.useState(false);
  var hover = _h[0], setHover = _h[1];
  var set = setByIdG(item.set);
  var setName = set ? set.name.replace(/\s*\(.*\)/, '') : item.set;
  var setNum = item.number || '';
  var cond = (item.grade && item.grade.company !== 'raw') ? (item.grade.company.toUpperCase() + ' ' + item.grade.grade) : (item.condition || '');
  var listingsFrom = '1 listing from';

  return React.createElement('div', {
    onMouseEnter: function() { setHover(true); },
    onMouseLeave: function() { setHover(false); },
    onClick: function() { app.go('listing', { id: item.id }); },
    style: {
      display: 'flex', gap: 14, padding: '12px 14px',
      background: '#fff', border: '1px solid var(--line)',
      borderRadius: 8, cursor: 'pointer',
      boxShadow: hover ? '0 4px 16px rgba(20,24,40,0.12)' : 'none',
      transition: 'box-shadow 0.18s ease',
    },
  },
    // image
    React.createElement('div', { style: { width: 72, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      React.createElement(CardArtG, { item: item, w: 72 })
    ),
    // details
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } },
      React.createElement('div', { style: { fontWeight: 700, fontSize: 14, letterSpacing: -0.2, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.name),
      React.createElement('div', { style: { fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.3 } },
        setName + (setNum ? ' \u00B7 #' + setNum : '')
      ),
      cond && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--muted)' } }, cond),
      React.createElement('div', { style: { fontSize: 11, color: 'var(--faint)', marginTop: 2 } }, listingsFrom),
      React.createElement('div', { style: { fontFamily: TG.mono, fontWeight: 700, fontSize: 19, letterSpacing: -0.5, color: 'var(--ink)', marginTop: 2 } }, mG(item.price)),
      item.market && React.createElement('div', { style: { fontSize: 11, color: 'var(--muted)' } }, 'Market Price: ' + mG(item.market))
    )
  );
}

// ── Hero banner carousel — shows 2-3 banners side-by-side, scrollable ──
function DHeroCarousel({ banners, app }) {
  if (!banners || banners.length === 0) return null;

  return React.createElement('div', {
    className: 'noscroll',
    style: {
      display: 'flex', gap: 16, overflowX: 'auto', overflowY: 'hidden',
      padding: '0 0 8px', scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
    },
  },
    banners.map(function(b) {
      return React.createElement('div', {
        key: b.img,
        onClick: function() { app.go('set', { id: b.set }); },
        style: {
          flexShrink: 0, width: 'calc(40% - 8px)', minWidth: 320,
          height: 220, borderRadius: 14, overflow: 'hidden',
          position: 'relative', cursor: 'pointer', scrollSnapAlign: 'start',
        },
      },
        React.createElement('img', { src: b.img, alt: b.label, style: {
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
        }}),
        React.createElement('div', { style: {
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.0) 100%)',
        }}),
        React.createElement('div', { style: {
          position: 'absolute', bottom: 20, left: 22, zIndex: 2,
        }},
          React.createElement('div', { style: {
            fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 20, color: '#fff',
            letterSpacing: -0.3, textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          } }, b.label),
          React.createElement('div', { style: {
            marginTop: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
          } }, 'Shop now \u2192')
        )
      );
    })
  );
}

// ── TCGplayer-style filter bar ────────────────────────────────
// Shared select style
var filterSelectStyle = function(active) {
  return {
    padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
    background: '#fff', color: 'var(--ink)',
    border: '1px solid var(--line)', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    paddingRight: 28,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%2371757e\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  };
};
var filterPillStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#fff', color: 'var(--accent)',
  borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 600,
  border: '2px solid var(--accent)',
};

function DFilterBar({ sets, setFilter, condFilter, gameName, onSetChange, onCondChange, onClear }) {
  var activeCount = (setFilter !== 'all' ? 1 : 0) + (condFilter !== 'all' ? 1 : 0);
  return React.createElement('div', { style: {
    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    padding: '12px 0', borderBottom: '1px solid var(--line)',
  }},
    // All Filters button with count badge
    React.createElement('button', { style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
      background: activeCount > 0 ? 'var(--ink)' : '#fff',
      color: activeCount > 0 ? '#fff' : 'var(--ink)',
      border: '1px solid var(--line)', cursor: 'pointer',
    }},
      'All Filters',
      activeCount > 0 && React.createElement('span', { style: {
        background: '#fff', color: 'var(--ink)', borderRadius: 999,
        minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 700,
      }}, activeCount)
    ),
    // Condition dropdown
    React.createElement('select', {
      value: condFilter,
      onChange: function(e) { onCondChange(e.target.value); },
      style: filterSelectStyle(condFilter !== 'all'),
    },
      React.createElement('option', { value: 'all' }, 'Condition'),
      React.createElement('option', { value: 'raw' }, 'Raw / Ungraded'),
      React.createElement('option', { value: 'graded' }, 'Graded only'),
      React.createElement('option', { value: 'psa10' }, 'PSA 10')
    ),
    // Active game pill (always shown if on a game page)
    gameName && React.createElement('span', { style: filterPillStyle },
      gameName,
      React.createElement('button', {
        onClick: function() { onClear(); },
        style: { color: 'var(--accent)', fontSize: 16, lineHeight: 1, fontWeight: 700, marginLeft: 2 },
      }, '\u00D7')
    ),
    // Set dropdown
    sets && sets.length > 0 && React.createElement('select', {
      value: setFilter,
      onChange: function(e) { onSetChange(e.target.value); },
      style: filterSelectStyle(setFilter !== 'all'),
    },
      React.createElement('option', { value: 'all' }, 'Set'),
      sets.map(function(s) {
        return React.createElement('option', { key: s.id, value: s.id }, s.name.replace(/\s*\(.*\)/, ''));
      })
    ),
    // Set pill if active
    setFilter !== 'all' && React.createElement('span', { style: filterPillStyle },
      (setByIdG(setFilter) ? setByIdG(setFilter).name.replace(/\s*\(.*\)/, '') : setFilter),
      React.createElement('button', {
        onClick: function() { onSetChange('all'); },
        style: { color: 'var(--accent)', fontSize: 16, lineHeight: 1, fontWeight: 700, marginLeft: 2 },
      }, '\u00D7')
    ),
    // Condition pill if active
    condFilter !== 'all' && React.createElement('span', { style: filterPillStyle },
      condFilter === 'raw' ? 'Raw / Ungraded' : condFilter === 'psa10' ? 'PSA 10' : 'Graded only',
      React.createElement('button', {
        onClick: function() { onCondChange('all'); },
        style: { color: 'var(--accent)', fontSize: 16, lineHeight: 1, fontWeight: 700, marginLeft: 2 },
      }, '\u00D7')
    ),
    // Clear Filters
    activeCount > 0 && React.createElement('button', {
      onClick: onClear,
      style: { fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginLeft: 4, cursor: 'pointer', background: 'none', border: 'none' },
    }, 'Clear Filters')
  );
}

// ── Results header (count + sort + view toggle) ───────────────
function DResultsHeader({ count, gameName, sort, onSort, viewMode, onViewMode }) {
  return React.createElement('div', { style: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
  }},
    React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' } },
      count + ' result' + (count !== 1 ? 's' : '') + (gameName ? ' in ' + gameName : '')
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--muted)' } },
        'Sort',
        React.createElement('select', {
          value: sort, onChange: function(e) { onSort(e.target.value); },
          style: {
            padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
          },
        },
          React.createElement('option', { value: 'popular' }, 'Most popular'),
          React.createElement('option', { value: 'price_low' }, 'Price: low to high'),
          React.createElement('option', { value: 'price_high' }, 'Price: high to low'),
          React.createElement('option', { value: 'newest' }, 'Most watched')
        )
      ),
      // view toggle
      React.createElement('div', { style: { display: 'flex', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' } },
        React.createElement('button', {
          onClick: function() { onViewMode('grid'); },
          style: {
            padding: '7px 10px', fontSize: 14,
            background: viewMode === 'grid' ? 'var(--ink)' : 'var(--surface)',
            color: viewMode === 'grid' ? '#fff' : 'var(--ink)',
          },
        }, '\u229e'),
        React.createElement('button', {
          onClick: function() { onViewMode('list'); },
          style: {
            padding: '7px 10px', fontSize: 14,
            background: viewMode === 'list' ? 'var(--ink)' : 'var(--surface)',
            color: viewMode === 'list' ? '#fff' : 'var(--ink)',
          },
        }, '\u2630')
      )
    )
  );
}

// ── Product grid / list ───────────────────────────────────────
function DProductGrid({ listings, app, viewMode }) {
  if (listings.length === 0) return null;
  if (viewMode === 'list') {
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
      listings.map(function(l) {
        return React.createElement(DProductCard, { key: l.id, item: l, app: app });
      })
    );
  }
  return React.createElement('div', { style: {
    display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12,
    maxWidth: '100%', overflow: 'hidden',
  }},
    listings.map(function(l) {
      return React.createElement(DProductCard, { key: l.id, item: l, app: app });
    })
  );
}

// ── Game landing page ─────────────────────────────────────────
function DGameLanding({ app, params }) {
  var game = gameByIdG(params.id);
  if (!game) return React.createElement('div', { className: 'wrap', style: { padding: 60 } }, 'Game not found.');

  var _sf = React.useState(params.set || 'all');
  var setFilter = _sf[0], setSetFilter = _sf[1];
  var _cf = React.useState('all');
  var condFilter = _cf[0], setCondFilter = _cf[1];
  var _so = React.useState('popular');
  var sort = _so[0], setSort = _so[1];
  var _vm = React.useState('grid');
  var viewMode = _vm[0], setViewMode = _vm[1];

  var sets = SETSG.filter(function(s) { return s.game === game.id; });
  var banners = SET_BANNERS_G[game.id] || [];

  var listings = LISTSG.filter(function(l) { return l.game === game.id && l.type === 'buynow'; });
  if (setFilter !== 'all') listings = listings.filter(function(l) { return l.set === setFilter; });
  if (condFilter === 'graded') listings = listings.filter(function(l) { return l.grade && l.grade.company !== 'raw'; });
  else if (condFilter === 'raw') listings = listings.filter(function(l) { return !l.grade || l.grade.company === 'raw'; });

  if (sort === 'price_low') listings = listings.slice().sort(function(a, b) { return a.price - b.price; });
  else if (sort === 'price_high') listings = listings.slice().sort(function(a, b) { return b.price - a.price; });
  else if (sort === 'newest') listings = listings.slice().sort(function(a, b) { return (b.watchers || 0) - (a.watchers || 0); });
  else listings = listings.slice().sort(function(a, b) { return (b.watchers || 0) + (b.sold || 0) - (a.watchers || 0) - (a.sold || 0); });

  function clearFilters() { setSetFilter('all'); setCondFilter('all'); }

  return React.createElement('div', null,

    // ── Breadcrumb ──
    React.createElement('div', { className: 'wrap', style: { padding: '18px 24px 0' } },
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } },
        React.createElement('button', { onClick: function() { app.go('home'); }, style: { color: 'var(--muted)' } }, 'Home'),
        ' / ',
        React.createElement('span', { style: { color: 'var(--ink-2)', fontWeight: 600 } }, game.name)
      )
    ),

    // ── Hero carousel ──
    banners.length > 0
      ? React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 20px' } },
          React.createElement(DHeroCarousel, { banners: banners, app: app })
        )
      : React.createElement('div', { style: {
          position: 'relative', height: 200, overflow: 'hidden', background: game.tint, marginTop: 12,
        }},
          React.createElement('div', { className: 'wrap', style: {
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 24,
          }},
            React.createElement('h1', { style: {
              fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 34, color: '#fff',
              letterSpacing: -0.8, margin: '0 0 8px',
            }}, game.name),
            React.createElement('p', { style: { fontSize: 14, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: 0 } },
              GAME_DESCRIPTIONS[game.id] || 'Browse all ' + game.name + ' cards.')
          )
        ),

    // ── Filter bar ──
    React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 0' } },
      React.createElement(DFilterBar, {
        sets: sets,
        setFilter: setFilter,
        condFilter: condFilter,
        gameName: game.name,
        onSetChange: setSetFilter,
        onCondChange: setCondFilter,
        onClear: clearFilters,
      })
    ),

    // ── Results header ──
    React.createElement('div', { className: 'wrap', style: { padding: '14px 24px 0' } },
      React.createElement(DResultsHeader, {
        count: listings.length,
        gameName: game.name,
        sort: sort,
        onSort: setSort,
        viewMode: viewMode,
        onViewMode: setViewMode,
      })
    ),

    // ── Results ──
    React.createElement('div', { className: 'wrap', style: { padding: '14px 24px 40px' } },
      listings.length > 0
        ? React.createElement(DProductGrid, { listings: listings.slice(0, 40), app: app, viewMode: viewMode })
        : React.createElement('div', { style: { textAlign: 'center', padding: '60px 0', color: 'var(--muted)' } },
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600 } }, 'No cards found with these filters'),
            React.createElement('button', {
              onClick: clearFilters,
              style: { marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--ink)' },
            }, 'Clear filters')
          )
    )
  );
}

// ── Set landing page ──────────────────────────────────────────
function DSetLanding({ app, params }) {
  var set = setByIdG(params.id);
  if (!set) return React.createElement('div', { className: 'wrap', style: { padding: 60 } }, 'Set not found.');

  var game = gameByIdG(set.game);
  var _cf = React.useState('all');
  var condFilter = _cf[0], setCondFilter = _cf[1];
  var _so = React.useState('popular');
  var sort = _so[0], setSort = _so[1];
  var _vm = React.useState('grid');
  var viewMode = _vm[0], setViewMode = _vm[1];

  var allListings = LISTSG.filter(function(l) { return l.set === set.id && l.type === 'buynow'; });
  var listings = allListings.slice();

  if (condFilter === 'graded') listings = listings.filter(function(l) { return l.grade && l.grade.company !== 'raw'; });
  else if (condFilter === 'raw') listings = listings.filter(function(l) { return !l.grade || l.grade.company === 'raw'; });

  if (sort === 'price_low') listings = listings.slice().sort(function(a, b) { return a.price - b.price; });
  else if (sort === 'price_high') listings = listings.slice().sort(function(a, b) { return b.price - a.price; });
  else if (sort === 'newest') listings = listings.slice().sort(function(a, b) { return (b.watchers || 0) - (a.watchers || 0); });
  else listings = listings.slice().sort(function(a, b) { return (b.watchers || 0) + (b.sold || 0) - (a.watchers || 0) - (a.sold || 0); });

  var heroColor = set.hue || (game ? game.tint : 'var(--fill)');

  function clearFilters() { setCondFilter('all'); }

  return React.createElement('div', null,

    // ── Breadcrumb ──
    React.createElement('div', { className: 'wrap', style: { padding: '18px 24px 0' } },
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } },
        React.createElement('button', { onClick: function() { app.go('home'); }, style: { color: 'var(--muted)' } }, 'Home'),
        ' / ',
        game && React.createElement('button', { onClick: function() { app.go('game', { id: game.id }); }, style: { color: 'var(--muted)' } }, game.name),
        game && ' / ',
        React.createElement('span', { style: { color: 'var(--ink-2)', fontWeight: 600 } }, set.name)
      )
    ),

    // ── Set hero banner ──
    React.createElement('div', { style: {
      position: 'relative', height: 200, overflow: 'hidden', background: heroColor, marginTop: 12,
    }},
      set.img && React.createElement('img', { src: set.img, alt: '', style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center', opacity: 0.55,
      }}),
      React.createElement('div', { style: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
      }}),
      React.createElement('div', { className: 'wrap', style: {
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 8, paddingBottom: 8,
      }},
        React.createElement('h1', { style: {
          fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 32, color: '#fff',
          letterSpacing: -0.8, margin: '0 0 8px',
        }}, set.name),
        React.createElement('div', { style: { display: 'flex', gap: 24 } },
          [
            [String(set.year), 'Released'],
            [(set.cards || 0) + ' cards', 'Set size'],
            [allListings.length + ' listing' + (allListings.length !== 1 ? 's' : ''), 'Available'],
          ].map(function(s) {
            return React.createElement('div', { key: s[1], style: { color: 'rgba(255,255,255,0.9)' } },
              React.createElement('div', { style: { fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 18 } }, s[0]),
              React.createElement('div', { style: { fontSize: 11, opacity: 0.65, fontWeight: 600 } }, s[1])
            );
          })
        )
      )
    ),

    // ── Filter bar ──
    React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 0' } },
      React.createElement(DFilterBar, {
        sets: null,
        setFilter: 'all',
        condFilter: condFilter,
        gameName: null,
        onSetChange: function() {},
        onCondChange: setCondFilter,
        onClear: clearFilters,
      })
    ),

    // ── Results header ──
    React.createElement('div', { className: 'wrap', style: { padding: '14px 24px 0' } },
      React.createElement(DResultsHeader, {
        count: listings.length,
        gameName: set.name,
        sort: sort,
        onSort: setSort,
        viewMode: viewMode,
        onViewMode: setViewMode,
      })
    ),

    // ── Results ──
    React.createElement('div', { className: 'wrap', style: { padding: '14px 24px 40px' } },
      listings.length > 0
        ? React.createElement(DProductGrid, { listings: listings, app: app, viewMode: viewMode })
        : React.createElement('div', { style: { textAlign: 'center', padding: '60px 0', color: 'var(--muted)' } },
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600 } }, 'No cards found with these filters'),
            React.createElement('button', {
              onClick: clearFilters,
              style: { marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--ink)' },
            }, 'Clear filters')
          )
    )
  );
}

Object.assign(window, { DGameLanding, DSetLanding, DProductCard });
