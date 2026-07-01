// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — Search results (TCGplayer-style filter bar + grid)
// ─────────────────────────────────────────────────────────────
const { T: TSe, money: mSe } = window;
const { GAMES: GAMESS, SETS: SETSS, LISTINGS: LISTSS, setById: setByIdSS } = window;
const { DProductCard: DProductCardS } = window;

const SORTS_D = ['Best match', 'Price: low to high', 'Price: high to low', 'Biggest discount'];

function DSearch({ app, params = {} }) {
  var _g = React.useState(params.game || 'all');
  var game = _g[0], setGame = _g[1];
  var _sf = React.useState(params.set || 'all');
  var setF = _sf[0], setSetF = _sf[1];
  var _cd = React.useState(params.cond || 'all');
  var cond = _cd[0], setCond = _cd[1];
  var _ty = React.useState(params.type || 'all');
  var type = _ty[0], setType = _ty[1];
  var _so = React.useState('Best match');
  var sort = _so[0], setSort = _so[1];
  var _vm = React.useState('grid');
  var viewMode = _vm[0], setViewMode = _vm[1];
  var q = params.q || '';

  var res = LISTSS.filter(function(l) {
    if (game !== 'all' && l.game !== game) return false;
    if (setF !== 'all' && l.set !== setF) return false;
    if (q.trim()) {
      var hay = (l.name + ' ' + (l.subtitle || '') + ' ' + (setByIdSS(l.set) ? setByIdSS(l.set).name : '')).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    if (cond === 'graded' && l.grade && l.grade.company === 'raw') return false;
    if (cond === 'raw' && l.grade && l.grade.company !== 'raw') return false;
    if (type !== 'all' && l.type !== type) return false;
    return true;
  });

  if (sort === 'Price: low to high') res = res.slice().sort(function(a, b) { return a.price - b.price; });
  if (sort === 'Price: high to low') res = res.slice().sort(function(a, b) { return b.price - a.price; });
  if (sort === 'Biggest discount') res = res.slice().sort(function(a, b) { return (a.price / (a.market || a.price)) - (b.price / (b.market || b.price)); });

  var title = q ? '\u201C' + q + '\u201D'
    : setF !== 'all' ? (setByIdSS(setF) ? setByIdSS(setF).name : setF)
    : game !== 'all' ? ((GAMESS.find(function(g) { return g.id === game; }) || {}).name || 'All cards')
    : 'All cards';

  function reset() { setGame('all'); setSetF('all'); setCond('all'); setType('all'); }

  var setsForGame = game !== 'all' ? SETSS.filter(function(s) { return s.game === game; }) : SETSS;
  var hasActive = game !== 'all' || setF !== 'all' || cond !== 'all' || type !== 'all';

  return React.createElement('div', { className: 'wrap', style: { padding: '26px 24px 40px' } },

    // breadcrumb
    React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginBottom: 8 } },
      React.createElement('button', { onClick: function() { app.go('home'); }, style: { color: 'var(--muted)' } }, 'Home'),
      ' / ',
      React.createElement('span', { style: { color: 'var(--ink-2)' } }, 'Search')
    ),

    // heading
    React.createElement('h1', { style: {
      fontFamily: TSe.sans, fontWeight: 700, fontSize: 26, letterSpacing: -0.8, margin: '0 0 18px',
    }},
      title,
      React.createElement('span', { style: { fontSize: 15, fontWeight: 500, color: 'var(--muted)', marginLeft: 10 } },
        '\u00B7 ' + res.length + ' result' + (res.length !== 1 ? 's' : ''))
    ),

    // ── Filter bar ──
    React.createElement('div', { style: {
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
      borderBottom: '1px solid var(--line)', paddingBottom: 14, marginBottom: 16,
    }},
      // Game dropdown
      React.createElement('select', {
        value: game,
        onChange: function(e) { setGame(e.target.value); setSetF('all'); },
        style: {
          padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: game !== 'all' ? 'var(--ink)' : 'var(--surface)',
          color: game !== 'all' ? '#fff' : 'var(--ink)',
          border: '1px solid var(--line)', cursor: 'pointer',
        },
      },
        React.createElement('option', { value: 'all' }, 'Game \u25be'),
        GAMESS.map(function(g) {
          return React.createElement('option', { key: g.id, value: g.id }, g.short);
        })
      ),
      // Set dropdown (only if game selected)
      game !== 'all' && React.createElement('select', {
        value: setF,
        onChange: function(e) { setSetF(e.target.value); },
        style: {
          padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: setF !== 'all' ? 'var(--ink)' : 'var(--surface)',
          color: setF !== 'all' ? '#fff' : 'var(--ink)',
          border: '1px solid var(--line)', cursor: 'pointer',
        },
      },
        React.createElement('option', { value: 'all' }, 'Set \u25be'),
        setsForGame.map(function(s) {
          return React.createElement('option', { key: s.id, value: s.id }, s.name.replace(/\s*\(.*\)/, ''));
        })
      ),
      // Condition dropdown
      React.createElement('select', {
        value: cond,
        onChange: function(e) { setCond(e.target.value); },
        style: {
          padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: cond !== 'all' ? 'var(--ink)' : 'var(--surface)',
          color: cond !== 'all' ? '#fff' : 'var(--ink)',
          border: '1px solid var(--line)', cursor: 'pointer',
        },
      },
        React.createElement('option', { value: 'all' }, 'Condition \u25be'),
        React.createElement('option', { value: 'raw' }, 'Raw / Ungraded'),
        React.createElement('option', { value: 'graded' }, 'Graded only')
      ),
      // Listing type
      React.createElement('select', {
        value: type,
        onChange: function(e) { setType(e.target.value); },
        style: {
          padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: type !== 'all' ? 'var(--ink)' : 'var(--surface)',
          color: type !== 'all' ? '#fff' : 'var(--ink)',
          border: '1px solid var(--line)', cursor: 'pointer',
        },
      },
        React.createElement('option', { value: 'all' }, 'Listing type \u25be'),
        React.createElement('option', { value: 'buynow' }, 'Buy It Now')
      ),
      // active pills
      game !== 'all' && React.createElement('span', { style: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--accent-wash)', color: 'var(--ink)',
        borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 600,
      }},
        (GAMESS.find(function(g) { return g.id === game; }) || {}).short || game,
        React.createElement('button', { onClick: function() { setGame('all'); setSetF('all'); }, style: { color: 'var(--ink)', fontSize: 14, lineHeight: 1, opacity: 0.7 } }, '\u00D7')
      ),
      setF !== 'all' && React.createElement('span', { style: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--accent-wash)', color: 'var(--ink)',
        borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 600,
      }},
        (setByIdSS(setF) ? setByIdSS(setF).name.replace(/\s*\(.*\)/, '') : setF),
        React.createElement('button', { onClick: function() { setSetF('all'); }, style: { color: 'var(--ink)', fontSize: 14, lineHeight: 1, opacity: 0.7 } }, '\u00D7')
      ),
      cond !== 'all' && React.createElement('span', { style: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--accent-wash)', color: 'var(--ink)',
        borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 600,
      }},
        cond === 'raw' ? 'Raw / Ungraded' : 'Graded only',
        React.createElement('button', { onClick: function() { setCond('all'); }, style: { color: 'var(--ink)', fontSize: 14, lineHeight: 1, opacity: 0.7 } }, '\u00D7')
      ),
      type !== 'all' && React.createElement('span', { style: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--accent-wash)', color: 'var(--ink)',
        borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 600,
      }},
        'Buy It Now',
        React.createElement('button', { onClick: function() { setType('all'); }, style: { color: 'var(--ink)', fontSize: 14, lineHeight: 1, opacity: 0.7 } }, '\u00D7')
      ),
      hasActive && React.createElement('button', {
        onClick: reset,
        style: { fontSize: 13, fontWeight: 600, color: 'var(--ink)', textDecoration: 'underline' },
      }, 'Clear Filters')
    ),

    // ── Results header ──
    React.createElement('div', { style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10,
    }},
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' } },
        res.length + ' result' + (res.length !== 1 ? 's' : '') + (title !== 'All cards' ? ' for ' + title : '')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--muted)' } },
          'Sort',
          React.createElement('select', {
            value: sort, onChange: function(e) { setSort(e.target.value); },
            style: {
              padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
            },
          },
            SORTS_D.map(function(s) { return React.createElement('option', { key: s }, s); })
          )
        ),
        // view toggle
        React.createElement('div', { style: { display: 'flex', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' } },
          React.createElement('button', {
            onClick: function() { setViewMode('grid'); },
            style: {
              padding: '7px 10px', fontSize: 14,
              background: viewMode === 'grid' ? 'var(--ink)' : 'var(--surface)',
              color: viewMode === 'grid' ? '#fff' : 'var(--ink)',
            },
          }, '\u229e'),
          React.createElement('button', {
            onClick: function() { setViewMode('list'); },
            style: {
              padding: '7px 10px', fontSize: 14,
              background: viewMode === 'list' ? 'var(--ink)' : 'var(--surface)',
              color: viewMode === 'list' ? '#fff' : 'var(--ink)',
            },
          }, '\u2630')
        )
      )
    ),

    // ── Results grid / list ──
    res.length === 0
      ? React.createElement('div', { style: { textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 16 } },
          React.createElement('div', { style: { marginBottom: 8, color: 'var(--muted)' } },
            React.createElement('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none' },
              React.createElement('circle', { cx: 11, cy: 11, r: 7, stroke: 'currentColor', strokeWidth: 2 }),
              React.createElement('path', { d: 'M20 20l-3.5-3.5', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' })
            )
          ),
          React.createElement('div', { style: { fontWeight: 700, fontSize: 18 } }, 'No cards match'),
          React.createElement('div', { style: { color: 'var(--muted)', fontSize: 14, marginTop: 4 } }, 'Try removing a filter or widening your search.')
        )
      : viewMode === 'list'
        ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
            res.map(function(l) {
              return React.createElement(DProductCardS, { key: l.id, item: l, app: app });
            })
          )
        : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 } },
            res.map(function(l) {
              return React.createElement(DProductCardS, { key: l.id, item: l, app: app });
            })
          )
  );
}

Object.assign(window, { DSearch });
