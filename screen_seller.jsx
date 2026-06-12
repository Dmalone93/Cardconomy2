// ─────────────────────────────────────────────────────────────
// Online seller storefront — profile + listings
// ─────────────────────────────────────────────────────────────
const { T: TS, money: moneyS, CardArt: CardArtS, Icon: IconS } = window;
const { sellerByName: sellerByNameS, listingsBySeller: listingsBySellerS, gameById: gameByIdS, setById: setByIdS } = window;

function SellerScreen({ app, params = {} }) {
  const seller = sellerByNameS(params.name);
  const [tab, setTab] = React.useState('listings');

  if (!seller) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 18 }}>Seller not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TS.accent, fontFamily: TS.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const listings = listingsBySellerS(seller.name);
  const isTrusted = seller.rating >= 99;
  const isFastShipper = seller.ships && seller.ships.includes('1');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TS.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* header bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TS.surface, color: TS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconS.back({})}</button>
        <div style={{ flex: 1, fontFamily: TS.sans, fontWeight: 700, fontSize: 16 }}>Back</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 40 }}>
        {/* branded header */}
        <div style={{ background: 'var(--fill)', color: '#fff', padding: '24px 16px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, background: '#fff', color: 'var(--fill)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: TS.sans, fontWeight: 800, fontSize: 22, margin: '0 auto 10px',
          }}>{seller.name.charAt(0)}</div>
          <div style={{ fontFamily: TS.sans, fontWeight: 800, fontSize: 20, letterSpacing: -0.3 }}>{seller.name}</div>
          <div style={{ fontFamily: TS.sans, fontSize: 12, opacity: 0.6, marginTop: 3 }}>{seller.loc} · Since {seller.since}</div>
          {(isTrusted || isFastShipper) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {isTrusted && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 4, fontFamily: TS.sans, fontWeight: 700, fontSize: 10 }}>Trusted</span>}
              {isFastShipper && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 4, fontFamily: TS.sans, fontWeight: 700, fontSize: 10 }}>Fast Shipper</span>}
            </div>
          )}
        </div>

        {/* stats + bio + location card */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[
              ['⭐', seller.rating + '%', 'Rating'],
              ['🛒', seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : seller.sales, 'Sales'],
              ['📦', seller.ships.replace(' days', 'd').replace(' day', 'd'), 'Ships'],
              ['🚚', '£' + seller.freeShipMin, 'Free over'],
            ].map(([icon, val, label], i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', background: TS.surface, borderRadius: 4, padding: '10px 4px',
              }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{icon}</div>
                <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 15 }}>{val}</div>
                <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: TS.sans, fontSize: 14, color: TS.ink2, lineHeight: 1.5, margin: '0 0 14px' }}>
            "{seller.blurb}"
          </p>

          {seller.loc && (
            <button onClick={() => window.open('https://www.google.com/maps/search/' + encodeURIComponent(seller.loc + ', UK'), '_blank')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: TS.surface, borderRadius: 4, textAlign: 'left', marginBottom: 16 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 13, color: TS.ink }}>{seller.loc}, UK</div>
                <div style={{ fontFamily: TS.sans, fontSize: 11, color: TS.muted, marginTop: 1 }}>View on Google Maps</div>
              </div>
              <span style={{ fontFamily: TS.sans, fontSize: 14, color: TS.faint }}>›</span>
            </button>
          )}
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
          {[
            ['listings', 'Listings (' + listings.length + ')'],
            ['reviews', 'Reviews'],
            ['policies', 'Policies'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, textAlign: 'center', padding: '11px 0',
              fontFamily: TS.sans, fontWeight: 700, fontSize: 12,
              color: tab === key ? TS.ink : TS.muted,
              borderBottom: tab === key ? '2px solid var(--fill)' : '2px solid transparent',
              background: 'none',
            }}>{label}</button>
          ))}
        </div>

        {/* tab content */}
        {tab === 'listings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, padding: 16 }}>
            {listings.map(l => (
              <button key={l.id} onClick={() => app.nav.push('product', { id: window.PRODUCTS.find(p => p.offers.some(o => o.listingId === l.id))?.id || l.id })}
                style={{ textAlign: 'left', background: TS.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}>
                  <CardArtS item={l} w={86} />
                </div>
                <div style={{ padding: '8px 11px 11px' }}>
                  <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{l.condition}{l.foil ? ' · Foil' : ''}</div>
                  <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginTop: 3 }}>{moneyS(l.price)}</div>
                </div>
              </button>
            ))}
            {listings.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
                No listings available right now
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ padding: 16 }}>
            {[
              { stars: 5, text: 'Cards arrived double-sleeved in a toploader. Exactly as described, fast shipping.', author: 'Marcus T.', time: '1 week ago' },
              { stars: 5, text: 'Great prices and the card was in perfect condition. Will buy again.', author: 'Priya K.', time: '2 weeks ago' },
              { stars: 4, text: 'Good seller, card was NM as listed. Shipping took a little longer than expected.', author: 'Diego R.', time: '1 month ago' },
              { stars: 5, text: 'Packaged really well, no damage at all. Highly recommend.', author: 'Sophie L.', time: '1 month ago' },
              { stars: 4, text: 'Fair price, honest grading. Would trade with again.', author: 'James W.', time: '2 months ago' },
            ].map((r, i) => (
              <div key={i} style={{ background: TS.surface, borderRadius: 4, padding: 14, marginBottom: 8, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <span key={s} style={{ color: s < r.stars ? '#f59e0b' : '#e5e7eb', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink, lineHeight: 1.4, marginBottom: 6 }}>"{r.text}"</div>
                <div style={{ fontFamily: TS.sans, fontSize: 11, color: TS.muted }}>{r.author} · {r.time}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'policies' && (
          <div style={{ padding: 16 }}>
            <div style={{ background: TS.surface, borderRadius: 4, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Shipping</div>
              <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5 }}>
                All orders shipped Royal Mail 1st Class Signed. Free shipping on orders over the threshold shown above. Cards are sent double-sleeved in toploaders with cardboard reinforcement.
              </div>
            </div>
            <div style={{ background: TS.surface, borderRadius: 4, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Returns</div>
              <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5 }}>
                Returns accepted within 14 days of delivery if the card does not match the listing description. Buyer pays return shipping unless the item was misrepresented. Refunds processed within 2 business days of receiving the return.
              </div>
            </div>
            <div style={{ background: TS.surface, borderRadius: 4, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Grading Standards</div>
              <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5 }}>
                We grade conservatively using TCGPlayer standards. NM means no visible wear under direct light. LP may have minor whitening on edges. All graded cards include close-up photos in the listing.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SellerScreen });
