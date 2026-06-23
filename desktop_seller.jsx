// ─────────────────────────────────────────────────────────────
// CARDONOMY Desktop — Online Seller Profile
// ─────────────────────────────────────────────────────────────
const { T: TSd, money: mSd, Icon: IconSd } = window;

function DSellerProfile({ app, params }) {
  params = params || {};
  var seller = window.sellerByName(params.name);
  var _tab = React.useState('listings');
  var tab = _tab[0], setTab = _tab[1];

  if (!seller) return (
    <div className="wrap" style={{ padding: '70px 24px', textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 20 }}>Seller not found</div>
      <button onClick={function(){ app.go('home'); }} style={{ marginTop: 16, color: 'var(--ink)', fontWeight: 600, fontSize: 14 }}>Back to home</button>
    </div>
  );

  var listings = window.listingsBySeller(seller.name);
  var isTrusted = seller.rating >= 99;
  var isFastShipper = seller.ships && seller.ships.indexOf('1') > -1;

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

  var stats = [
    ['Rating', seller.rating + '%'],
    ['Sales', seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : String(seller.sales)],
    ['Ships', seller.ships],
    ['Free over', '\u00a3' + seller.freeShipMin],
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
        React.createElement('div', { style: { width: 72, height: 72, borderRadius: 999, background: '#fff', color: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 30, margin: '0 auto 12px' } }, seller.name.charAt(0)),
        React.createElement('h1', { style: { fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: '0 0 4px' } }, seller.name),
        React.createElement('div', { style: { fontSize: 13.5, opacity: 0.65 } }, seller.loc + ' \u00b7 Since ' + seller.since),
        (isTrusted || isFastShipper) && React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 } },
          isTrusted && React.createElement('span', { style: { background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 6, fontWeight: 700, fontSize: 11 } }, 'Trusted'),
          isFastShipper && React.createElement('span', { style: { background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 6, fontWeight: 700, fontSize: 11 } }, 'Fast Shipper')
        )
      )
    ),

    React.createElement('div', { className: 'wrap', style: { padding: '24px 24px 40px' } },
      // stats
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 } },
        stats.map(function(s, i) {
          return React.createElement('div', { key: i, style: { background: 'var(--surface)', borderRadius: 14, padding: '16px 18px', textAlign: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' } },
            React.createElement('div', { style: { fontWeight: 700, fontSize: 20 } }, s[1]),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', marginTop: 3 } }, s[0])
          );
        })
      ),

      // bio
      React.createElement('p', { style: { fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 640, margin: '0 0 20px', fontStyle: 'italic' } }, '"' + seller.blurb + '"'),

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
        listings.length > 0
          ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18 } },
              listings.map(function(l) { return React.createElement(window.DCard, { key: l.id, item: l, app: app }); })
            )
          : React.createElement('div', { style: { textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 16 } },
              React.createElement('div', { style: { fontWeight: 700, fontSize: 16, color: 'var(--muted)' } }, 'No listings available right now')
            )
      ),

      // reviews tab
      tab === 'reviews' && React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 } },
          React.createElement('div', { style: { fontWeight: 800, fontSize: 32, letterSpacing: -0.5 } }, seller.rating + '%'),
          React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', gap: 2 } },
              Array.from({ length: 5 }, function(_, s) { return React.createElement('span', { key: s, style: { color: '#f59e0b', fontSize: 16 } }, '\u2605'); })
            ),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 2 } }, 'Based on ' + seller.sales.toLocaleString() + ' transactions')
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
