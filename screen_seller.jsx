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

        {/* stats row */}
        <div style={{ display: 'flex', background: TS.surface }}>
          {[
            [seller.rating + '%', 'Rating'],
            [seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : seller.sales, 'Sales'],
            [seller.ships.replace(' days', 'd').replace(' day', 'd'), 'Ships'],
            ['£' + seller.freeShipMin, 'Free over'],
          ].map(([val, label], i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '12px 4px',
              borderRight: i < 3 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 15 }}>{val}</div>
              <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* bio */}
        <div style={{ padding: '14px 16px', fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5, borderBottom: '1px solid var(--line)' }}>
          "{seller.blurb}"
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
            {listings.map(l => (
              <button key={l.id} onClick={() => app.nav.push('product', { id: window.PRODUCTS.find(p => p.offers.some(o => o.listingId === l.id))?.id || l.id })}
                style={{ textAlign: 'left', background: TS.surface, borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ background: TS.surface2, padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}>
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
          <div style={{ padding: 16, textAlign: 'center', color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
            Reviews coming soon
          </div>
        )}

        {tab === 'policies' && (
          <div style={{ padding: 16, textAlign: 'center', color: TS.faint, fontFamily: TS.sans, fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            Shipping & return policies coming soon
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SellerScreen });
