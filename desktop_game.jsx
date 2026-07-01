// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — TCG Game Landing Page
// ─────────────────────────────────────────────────────────────
const { T: TG, money: mG, CardArt: CardArtG, Icon: IconG, GradeChip: GradeChipG } = window;
const { GAMES: GAMESG, SETS: SETSG, LISTINGS: LISTSG, gameById: gameByIdG, setById: setByIdG, GAME_LOGOS: GAME_LOGOS_G } = window;
const { DCard: DCardG } = window;

const GAME_HEROES_G = {
  pkmn: 'logos/heroes/pkmn.avif', mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg', lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.jpg',
};

const GAME_DESCRIPTIONS = {
  pkmn: 'The world\u2019s most collected trading card game. From Base Set to Scarlet & Violet, explore every era of Pok\u00e9mon cards.',
  mtg: 'The original trading card game. 30 years of strategy, art, and collectible value \u2014 from Alpha to Modern Horizons.',
  ygo: 'Fast-paced duels and iconic artwork. One of the most played TCGs worldwide with a thriving singles market.',
  lor: 'The newest TCG phenomenon. Stunning art, growing competitive scene, and rapidly appreciating early sets.',
  digimon: 'A beloved franchise with gorgeous card art. Growing collector community with strong set value retention.',
};

function DGameLanding({ app, params }) {
  const game = gameByIdG(params.id);
  if (!game) return React.createElement('div', { className: 'wrap', style: { padding: 60 } }, 'Game not found.');

  const [setFilter, setSetFilter] = React.useState(params.set || 'all');
  const [condFilter, setCondFilter] = React.useState('all');
  const [sort, setSort] = React.useState('popular');
  const [viewMode, setViewMode] = React.useState('grid');

  const sets = SETSG.filter(function(s) { return s.game === game.id; });
  const logo = GAME_LOGOS_G && GAME_LOGOS_G[game.id];
  const hero = GAME_HEROES_G[game.id];

  var listings = LISTSG.filter(function(l) { return l.game === game.id && l.type === 'buynow'; });
  if (setFilter !== 'all') listings = listings.filter(function(l) { return l.set === setFilter; });
  if (condFilter === 'graded') listings = listings.filter(function(l) { return l.grade && l.grade.company !== 'raw'; });
  else if (condFilter === 'raw') listings = listings.filter(function(l) { return !l.grade || l.grade.company === 'raw'; });

  if (sort === 'price_low') listings.sort(function(a, b) { return a.price - b.price; });
  else if (sort === 'price_high') listings.sort(function(a, b) { return b.price - a.price; });
  else if (sort === 'newest') listings.sort(function(a, b) { return (b.watchers || 0) - (a.watchers || 0); });
  else listings.sort(function(a, b) { return (b.watchers || 0) + (b.sold || 0) - (a.watchers || 0) - (a.sold || 0); });

  var stats = {
    total: listings.length,
    graded: LISTSG.filter(function(l) { return l.game === game.id && l.grade && l.grade.company !== 'raw'; }).length,
    cheapest: listings.length > 0 ? mG(Math.min.apply(null, listings.map(function(l) { return l.price; }))) : '\u00A30',
  };

  return React.createElement('div', null,

    // ── Breadcrumb ──
    React.createElement('div', { className: 'wrap', style: { padding: '18px 24px 0' }},
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' }},
        React.createElement('button', { onClick: function() { app.go('home'); }, style: { color: 'var(--muted)' } }, 'Home'),
        ' / ',
        React.createElement('span', { style: { color: 'var(--ink-2)', fontWeight: 600 } }, game.name)
      )
    ),

    // ── Hero banner ──
    React.createElement('div', { style: {
      position: 'relative', height: 320, overflow: 'hidden', background: game.tint,
    }},
      hero && React.createElement('img', { src: hero, alt: '', style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top', opacity: 0.6,
      }}),
      React.createElement('div', { style: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, ' + game.tint + '40 0%, ' + game.tint + 'cc 60%, ' + game.tint + ' 100%)',
      }}),
      React.createElement('div', { className: 'wrap', style: {
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 32,
      }},
        // logo or name
        logo
          ? React.createElement('img', { src: logo, alt: game.name, style: {
              maxWidth: 240, maxHeight: 60, objectFit: 'contain',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))', marginBottom: 12,
            }})
          : React.createElement('h1', { style: {
              fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 38, color: '#fff',
              letterSpacing: -1, margin: '0 0 12px',
            }}, game.name),
        // description
        React.createElement('p', { style: {
          fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 520, lineHeight: 1.6, margin: 0,
        }}, GAME_DESCRIPTIONS[game.id] || 'Browse all ' + game.name + ' cards.'),
        // stats strip
        React.createElement('div', { style: { display: 'flex', gap: 24, marginTop: 18 }},
          [['Cards listed', stats.total], ['Graded slabs', stats.graded], ['From', stats.cheapest]].map(function(s) {
            return React.createElement('div', { key: s[0], style: { color: 'rgba(255,255,255,0.9)' }},
              React.createElement('div', { style: { fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20 }}, s[1]),
              React.createElement('div', { style: { fontSize: 12, opacity: 0.65, fontWeight: 600 }}, s[0])
            );
          })
        )
      )
    ),

    // ── Sets grid ──
    React.createElement('div', { className: 'wrap', style: { padding: '32px 24px 0' }},
      React.createElement('h2', { style: {
        fontFamily: TG.sans, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, margin: '0 0 18px',
      }}, 'Browse by set'),
      React.createElement('div', { style: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14,
      }},
        // "All" tile
        React.createElement('button', {
          key: 'all',
          onClick: function() { setSetFilter('all'); },
          style: {
            position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden',
            background: setFilter === 'all' ? 'var(--ink)' : 'var(--surface)',
            border: setFilter === 'all' ? 'none' : '1px solid var(--line)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }},
          React.createElement('span', { style: {
            fontWeight: 700, fontSize: 15, color: setFilter === 'all' ? '#fff' : 'var(--ink)',
          }}, 'All sets')
        ),
        // individual set tiles
        sets.map(function(s) {
          var active = setFilter === s.id;
          return React.createElement('button', {
            key: s.id,
            onClick: function() { app.go('set', { id: s.id }); },
            style: {
              position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden',
              background: s.hue || 'var(--surface)', cursor: 'pointer',
              border: active ? '3px solid var(--ink)' : '1px solid transparent',
              transition: 'all 0.2s', textAlign: 'left',
            }},
            s.img && React.createElement('img', { src: s.img, alt: '', style: {
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.5,
            }}),
            React.createElement('div', { style: {
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 100%)',
            }}),
            React.createElement('div', { style: {
              position: 'relative', zIndex: 1, height: '100%', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }},
              React.createElement('div', { style: {
                fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}, s.name.replace(/\s*\(.*\)/, '')),
              React.createElement('div', { style: {
                fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 3,
              }}, s.year + ' \u00B7 ' + (s.cards || '') + ' cards')
            )
          );
        })
      )
    ),

    // ── Filters + sort bar ──
    React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 0' }},
      React.createElement('div', { style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)', paddingBottom: 14, marginBottom: 20,
      }},
        // condition pills
        React.createElement('div', { style: { display: 'flex', gap: 8 }},
          [['all', 'All'], ['raw', 'Raw only'], ['graded', 'Graded only']].map(function(f) {
            var active = condFilter === f[0];
            return React.createElement('button', {
              key: f[0], onClick: function() { setCondFilter(f[0]); },
              style: {
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: active ? 'var(--ink)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--ink)',
                border: active ? 'none' : '1px solid var(--line)',
              }}, f[1]);
          })
        ),
        // sort + view
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 }},
          React.createElement('select', {
            value: sort, onChange: function(e) { setSort(e.target.value); },
            style: {
              padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
            }},
            React.createElement('option', { value: 'popular' }, 'Most popular'),
            React.createElement('option', { value: 'price_low' }, 'Price: low to high'),
            React.createElement('option', { value: 'price_high' }, 'Price: high to low'),
            React.createElement('option', { value: 'newest' }, 'Most watched')
          ),
          React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)', fontWeight: 600 }},
            listings.length + ' result' + (listings.length !== 1 ? 's' : ''))
        )
      )
    ),

    // ── Results grid ──
    React.createElement('div', { className: 'wrap', style: { padding: '0 24px 40px' }},
      listings.length > 0
        ? React.createElement('div', { style: {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18,
          }},
            listings.slice(0, 30).map(function(l) {
              return React.createElement(DCardG, { key: l.id, item: l, app: app });
            })
          )
        : React.createElement('div', { style: {
            textAlign: 'center', padding: '60px 0', color: 'var(--muted)',
          }},
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600 }}, 'No cards found with these filters'),
            React.createElement('button', {
              onClick: function() { setSetFilter('all'); setCondFilter('all'); },
              style: { marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--ink)' },
            }, 'Clear filters')
          ),
      // show more
      listings.length > 30 && React.createElement('div', { style: { textAlign: 'center', marginTop: 28 }},
        React.createElement('button', {
          onClick: function() { app.go('search', { game: game.id }); },
          style: {
            padding: '12px 28px', borderRadius: 10, background: 'var(--ink)', color: '#fff',
            fontWeight: 700, fontSize: 14,
          }}, 'View all ' + listings.length + ' listings')
      )
    )
  );
}

Object.assign(window, { DGameLanding });
