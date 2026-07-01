// ─────────────────────────────────────────────────────────────
// CARDONOMY Desktop — Online Seller Profile
// ─────────────────────────────────────────────────────────────
const { T: TSd, money: mSd, Icon: IconSd } = window;
const { GAMES: GAMES_DS, gameById: gameByIdSd, LISTINGS: LISTINGS_SD } = window;

function DSellerProfile({ app, params }) {
  params = params || {};
  var seller = window.sellerByName(params.name);
  var _tab = React.useState('listings');
  var tab = _tab[0], setTab = _tab[1];
  var _gf = React.useState('all');
  var gameFilter = _gf[0], setGameFilter = _gf[1];
  var _sb = React.useState('popular');
  var sortBy = _sb[0], setSortBy = _sb[1];

  if (!seller) return (
    <div className="wrap" style={{ padding: '70px 24px', textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 20 }}>Seller not found</div>
      <button onClick={function(){ app.go('home'); }} style={{ marginTop: 16, color: 'var(--ink)', fontWeight: 600, fontSize: 14 }}>Back to home</button>
    </div>
  );

  var listings = window.listingsBySeller(seller.name);
  var activeListingCount = listings.length;
  var isTrusted = seller.rating >= 99;
  var isFastShipper = seller.ships && seller.ships.indexOf('1') > -1;
  var isEstablished = seller.since <= 2023;
  var isHighVolume = seller.sales >= 5000;
  var currentYear = 2026;
  var yearsActive = currentYear - seller.since;

  // Build trust badges
  var badges = [];
  if (isTrusted) badges.push({ label: 'Trusted Seller', bg: 'rgba(34,197,94,0.12)', color: '#16a34a', border: 'rgba(34,197,94,0.3)', icon: '\u2713' });
  if (isFastShipper) badges.push({ label: 'Fast Shipper', bg: 'rgba(59,130,246,0.1)', color: '#2563eb', border: 'rgba(59,130,246,0.25)', icon: '\u26A1' });
  if (isEstablished) badges.push({ label: yearsActive + '+ Years Active', bg: 'rgba(217,119,6,0.1)', color: '#b45309', border: 'rgba(217,119,6,0.25)', icon: '\u2605' });
  if (isHighVolume) badges.push({ label: 'High Volume', bg: 'rgba(139,92,246,0.1)', color: '#7c3aed', border: 'rgba(139,92,246,0.25)', icon: '\u25B2' });
  if (seller.freeShipMin) badges.push({ label: 'Free over \u00A3' + seller.freeShipMin, bg: 'rgba(20,184,166,0.1)', color: '#0f766e', border: 'rgba(20,184,166,0.25)', icon: '\uD83D\uDE9A' });

  var reviews = [
    { stars: 5, text: 'Cards arrived double-sleeved in a toploader. Exactly as described, fast shipping.', author: 'Marcus T.', time: '1 week ago' },
    { stars: 5, text: 'Great prices and the card was in perfect condition. Will buy again.', author: 'Priya K.', time: '2 weeks ago' },
    { stars: 4, text: 'Good seller, card was NM as listed. Shipping took a little longer than expected.', author: 'Diego R.', time: '1 month ago' },
    { stars: 5, text: 'Packaged really well, no damage at all. Highly recommend.', author: 'Sophie L.', time: '1 month ago' },
    { stars: 4, text: 'Fair price, honest grading. Would trade with again.', author: 'James W.', time: '2 months ago' },
  ];

  var policies = [
    { title: 'Shipping', text: 'All orders shipped Royal Mail 1st Class Signed. Free shipping on orders over the threshold shown above. Cards are sent double-sleeved in toploaders with cardboard reinforcement.' },
    { title: 'Returns', text: 'Returns accepted within 14 days of delivery if the card does not match the listing description. Buyer pays return shipping unless the item was misrepresented. Refunds processed within 2 business days of receiving the return.' },
    { title: 'Grading Standards', text: 'We grade conservatively using TCGPlayer standards. NM means no visible wear under direct light. LP may have minor whitening on edges. All graded cards include close-up photos in the listing.' },
  ];

  var salesLabel = seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : String(seller.sales);

  var statCards = [
    {
      value: seller.rating + '%',
      label: 'Positive feedback',
      subContent: React.createElement('div', { style: { display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 } },
        Array.from({ length: 5 }, function(_, s) {
          var filled = s < Math.round(seller.rating / 20);
          return React.createElement('span', { key: s, style: { color: filled ? '#f59e0b' : 'var(--line)', fontSize: 14 } }, '\u2605');
        })
      ),
      tint: 'rgba(245,158,11,0.08)',
    },
    {
      value: salesLabel,
      label: 'Total sales',
      subContent: React.createElement('div', { style: { fontSize: 11, color: 'var(--muted)', marginTop: 4 } }, 'transactions'),
      tint: 'rgba(99,102,241,0.07)',
    },
    {
      value: seller.ships,
      label: 'Ships in',
      subContent: React.createElement('div', { style: { fontSize: 11, color: 'var(--muted)', marginTop: 4 } }, 'from order'),
      tint: 'rgba(20,184,166,0.07)',
    },
    {
      value: '\u00A3' + seller.freeShipMin,
      label: 'Free shipping over',
      subContent: React.createElement('div', { style: { fontSize: 11, color: 'var(--muted)', marginTop: 4 } }, 'per order'),
      tint: 'rgba(34,197,94,0.07)',
    },
  ];

  var tabItems = [
    ['listings', 'Listings (' + listings.length + ')'],
    ['reviews', 'Reviews'],
    ['policies', 'Policies'],
  ];

  return React.createElement('div', null,
    // branded header
    React.createElement('div', { style: { background: 'var(--fill)', color: '#fff', padding: '40px 0 36px', textAlign: 'center' } },
      React.createElement('div', { className: 'wrap' },
        React.createElement('div', { style: { width: 72, height: 72, borderRadius: 999, background: '#fff', color: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 30, margin: '0 auto 12px' } }, seller.name.charAt(0)),
        React.createElement('h1', { style: { fontWeight: 700, fontSize: 28, letterSpacing: -0.8, margin: '0 0 4px' } }, seller.name),
        // member since · listings · location — prominent sub-line
        React.createElement('div', { style: { fontSize: 14, opacity: 0.8, marginBottom: 6 } },
          'Member since ' + seller.since + ' \u00B7 ' + activeListingCount + ' active listing' + (activeListingCount !== 1 ? 's' : '') + ' \u00B7 Ships from ' + seller.loc
        ),
        React.createElement('div', { style: { fontSize: 13, opacity: 0.55 } }, seller.loc + ' · Since ' + seller.since)
      )
    ),

    React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 40px' } },
      // ── stats ──
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 } },
        statCards.map(function(s, i) {
          return React.createElement('div', { key: i, style: {
            background: s.tint,
            borderRadius: 14, padding: '20px 18px', textAlign: 'center',
            boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            border: '1px solid var(--line)',
          } },
            React.createElement('div', { style: { fontWeight: 700, fontSize: 24, letterSpacing: -0.5 } }, s.value),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', marginTop: 3, fontWeight: 600 } }, s.label),
            s.subContent
          );
        })
      ),

      // ── trust badges ──
      badges.length > 0 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 } },
        badges.map(function(b, i) {
          return React.createElement('span', {
            key: i,
            style: {
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 999,
              background: b.bg, color: b.color,
              border: '1px solid ' + b.border,
              fontWeight: 700, fontSize: 12.5,
            } },
            b.icon + ' ' + b.label
          );
        })
      ),

      // bio
      React.createElement('p', { style: { fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 640, margin: '0 0 20px', fontStyle: 'italic' } }, '\u201C' + seller.blurb + '\u201D'),

      // location
      (seller.address || seller.loc) && React.createElement('button', {
        onClick: function() { window.open('https://www.google.com/maps/search/' + encodeURIComponent(seller.address || seller.loc + ', UK'), '_blank'); },
        style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--surface)', borderRadius: 14, textAlign: 'left', marginBottom: 28, boxShadow: '0 1px 3px rgba(20,24,40,0.05)', width: '100%', maxWidth: 640 }
      },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontWeight: 600, fontSize: 14 } }, seller.address || seller.loc + ', UK'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', marginTop: 1 } }, 'View on Google Maps')
        ),
        React.createElement('span', { style: { color: 'var(--faint)', fontSize: 18 } }, '>')
      ),

      // tabs
      React.createElement('div', { style: { display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 24 } },
        tabItems.map(function(t) {
          var key = t[0], label = t[1];
          return React.createElement('button', { key: key, onClick: function() { setTab(key); }, style: { padding: '12px 18px', fontWeight: 700, fontSize: 15, position: 'relative', color: tab === key ? 'var(--accent)' : 'var(--ink-2)' } },
            label,
            tab === key && React.createElement('div', { style: { position: 'absolute', left: 14, right: 14, bottom: -1, height: 3, borderRadius: 3, background: 'var(--accent)' } })
          );
        })
      ),

      // listings tab
      tab === 'listings' && React.createElement('div', null,
        // game filter chips
        (function() {
          var gameCounts = {};
          listings.forEach(function(l) { if (l.game) gameCounts[l.game] = (gameCounts[l.game] || 0) + 1; });
          var gameIds = Object.keys(gameCounts);
          if (gameIds.length <= 1) return null;
          return React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 } },
            React.createElement('button', {
              onClick: function() { setGameFilter('all'); },
              style: { padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: gameFilter === 'all' ? 'var(--ink)' : 'var(--surface)',
                color: gameFilter === 'all' ? '#fff' : 'var(--ink)',
                border: gameFilter === 'all' ? 'none' : '1px solid var(--line)' }
            }, 'All (' + listings.length + ')'),
            gameIds.map(function(gid) {
              var gm = gameByIdSd ? gameByIdSd(gid) : null;
              var active = gameFilter === gid;
              return React.createElement('button', {
                key: gid, onClick: function() { setGameFilter(active ? 'all' : gid); },
                style: { padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: active ? 'var(--ink)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: active ? 'none' : '1px solid var(--line)' }
              }, (gm ? gm.short : gid) + ' (' + gameCounts[gid] + ')');
            })
          );
        })(),
        // sort
        React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: 16 } },
          React.createElement('select', {
            value: sortBy, onChange: function(e) { setSortBy(e.target.value); },
            style: { padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' }
          },
            React.createElement('option', { value: 'popular' }, 'Popular'),
            React.createElement('option', { value: 'price_asc' }, 'Price: low \u2192 high'),
            React.createElement('option', { value: 'price_desc' }, 'Price: high \u2192 low')
          )
        ),
        // grid
        (function() {
          var filtered = gameFilter === 'all' ? listings : listings.filter(function(l) { return l.game === gameFilter; });
          if (sortBy === 'popular') filtered = filtered.slice().sort(function(a, b) { return (b.watchers || 0) - (a.watchers || 0); });
          else if (sortBy === 'price_asc') filtered = filtered.slice().sort(function(a, b) { return a.price - b.price; });
          else if (sortBy === 'price_desc') filtered = filtered.slice().sort(function(a, b) { return b.price - a.price; });
          return filtered.length > 0
            ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18 } },
                filtered.map(function(l) { return React.createElement(window.DCard, { key: l.id, item: l, app: app }); })
              )
            : React.createElement('div', { style: { textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 16 } },
                React.createElement('div', { style: { fontWeight: 700, fontSize: 16, color: 'var(--muted)' } }, 'No listings in this category')
              );
        })()
      ),

      // reviews tab
      tab === 'reviews' && React.createElement('div', null,
        // rating header with progress bar
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, padding: '20px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line)' } },
          React.createElement('div', { style: { textAlign: 'center', flexShrink: 0 } },
            React.createElement('div', { style: { fontWeight: 700, fontSize: 40, letterSpacing: -1 } }, seller.rating + '%'),
            React.createElement('div', { style: { display: 'flex', gap: 3, justifyContent: 'center', margin: '4px 0' } },
              Array.from({ length: 5 }, function(_, s) { return React.createElement('span', { key: s, style: { color: '#f59e0b', fontSize: 18 } }, '\u2605'); })
            ),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, 'Positive feedback')
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, marginBottom: 8 } }, seller.sales.toLocaleString() + ' transactions'),
            React.createElement('div', { style: { background: 'var(--line)', borderRadius: 999, height: 10, overflow: 'hidden' } },
              React.createElement('div', { style: {
                width: seller.rating + '%', height: '100%',
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                borderRadius: 999, transition: 'width 0.5s ease',
              } })
            ),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', marginTop: 6 } },
              seller.rating + '% of buyers left positive feedback'
            )
          )
        ),
        reviews.map(function(r, i) {
          return React.createElement('div', { key: i, style: { background: 'var(--surface)', borderRadius: 14, padding: 18, marginBottom: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 } },
              React.createElement('div', { style: { width: 36, height: 36, borderRadius: 999, background: 'var(--fill)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 } }, r.author.charAt(0)),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontWeight: 600, fontSize: 14 } }, r.author),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, r.time)
              ),
              React.createElement('div', { style: { display: 'flex', gap: 2 } },
                Array.from({ length: 5 }, function(_, s) { return React.createElement('span', { key: s, style: { color: s < r.stars ? '#f59e0b' : '#e5e7eb', fontSize: 13 } }, '\u2605'); })
              )
            ),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 } }, r.text)
          );
        })
      ),

      // policies tab
      tab === 'policies' && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        policies.map(function(p, i) {
          return React.createElement('div', { key: i, style: { background: 'var(--surface)', borderRadius: 14, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' } },
            React.createElement('div', { style: { width: 44, height: 44, borderRadius: 12, background: 'var(--accent-wash)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
              IconSd.shield({ width: 20, height: 20 })
            ),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontWeight: 700, fontSize: 16, marginBottom: 6 } }, p.title),
              React.createElement('div', { style: { fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 } }, p.text)
            )
          );
        })
      )
    )
  );
}

Object.assign(window, { DSellerProfile: DSellerProfile });
