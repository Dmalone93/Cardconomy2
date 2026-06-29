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
        <div style={{ marginBottom: 12, color: TS.muted }}>{IconS.search({ width: 40, height: 40 })}</div>
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
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TS.surface, color: TS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconS.back({})}</button>
        <div style={{ flex: 1, fontFamily: TS.sans, fontWeight: 700, fontSize: 16 }}>Back</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 40 }}>
        {/* branded header */}
        <div style={{ background: 'var(--fill)', color: '#fff', padding: '24px 16px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, background: '#fff', color: 'var(--fill)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: TS.sans, fontWeight: 700, fontSize: 22, margin: '0 auto 10px',
          }}>{seller.name.charAt(0)}</div>
          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>{seller.name}</div>
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
              [<svg width="18" height="18" viewBox="0 0 256 256" fill="none"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.37,16.37,0,0,1,30.5,0l23.21,55.36L226.92,91a16.46,16.46,0,0,1,9.37,23.84Z" fill="currentColor"/></svg>, seller.rating + '%', 'Rating'],
              [<svg width="18" height="18" viewBox="0 0 256 256" fill="none"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM128,160a40,40,0,1,1,40-40A40,40,0,0,1,128,160Zm88,40H40V56H216V200ZM56,96V80a16,16,0,0,1,16-16H88a8,8,0,0,1,0,16H72V96a8,8,0,0,1-16,0Zm152,64v16a16,16,0,0,1-16,16H168a8,8,0,0,1,0-16h24V160a8,8,0,0,1,16,0Z" fill="currentColor"/></svg>, seller.sales >= 1000 ? (seller.sales / 1000).toFixed(1) + 'k' : seller.sales, 'Sales'],
              [<svg width="18" height="18" viewBox="0 0 256 256" fill="none"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z" fill="currentColor"/></svg>, seller.ships.replace(' days', 'd').replace(' day', 'd'), 'Ships'],
              [<svg width="18" height="18" viewBox="0 0 256 256" fill="none"><path d="M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h34a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.43,117ZM192,88h34.58l9.6,24H192ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm96,0a16,16,0,1,1,16-16A16,16,0,0,1,176,208Z" fill="currentColor"/></svg>, '£' + seller.freeShipMin, 'Free over'],
            ].map(([icon, val, label], i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', background: TS.surface, borderRadius: 4, padding: '10px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{ color: TS.muted, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 15 }}>{val}</div>
                <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted, marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: TS.sans, fontSize: 14, color: TS.ink2, lineHeight: 1.5, margin: '0 0 14px' }}>
            "{seller.blurb}"
          </p>

          {(seller.address || seller.loc) && (
            <button onClick={() => window.open('https://www.google.com/maps/search/' + encodeURIComponent(seller.address || seller.loc + ', UK'), '_blank')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: TS.surface, borderRadius: 4, textAlign: 'left', marginBottom: 16 }}>
              <svg width="18" height="18" viewBox="0 0 256 256" fill="none" style={{ flexShrink: 0, color: TS.muted }}><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" fill="currentColor"/></svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 13, color: TS.ink }}>{seller.address || seller.loc + ', UK'}</div>
                <div style={{ fontFamily: TS.sans, fontSize: 11, color: TS.muted, marginTop: 1 }}>View on Google Maps</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 256 256" fill="none" style={{ flexShrink: 0, color: TS.faint }}><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" fill="currentColor"/></svg>
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
              <button key={l.id} onClick={() => { const prod = window.PRODUCTS.find(p => p.offers.some(o => o.listingId === l.id)); app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id }); }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 28, letterSpacing: -0.5 }}>{seller.rating}%</div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <span key={s} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <div style={{ fontFamily: TS.sans, fontSize: 11, color: TS.muted, marginTop: 1 }}>Based on {seller.sales.toLocaleString()} transactions</div>
              </div>
            </div>
            {[
              { stars: 5, text: 'Cards arrived double-sleeved in a toploader. Exactly as described, fast shipping.', author: 'Marcus T.', time: '1 week ago' },
              { stars: 5, text: 'Great prices and the card was in perfect condition. Will buy again.', author: 'Priya K.', time: '2 weeks ago' },
              { stars: 4, text: 'Good seller, card was NM as listed. Shipping took a little longer than expected.', author: 'Diego R.', time: '1 month ago' },
              { stars: 5, text: 'Packaged really well, no damage at all. Highly recommend.', author: 'Sophie L.', time: '1 month ago' },
              { stars: 4, text: 'Fair price, honest grading. Would trade with again.', author: 'James W.', time: '2 months ago' },
            ].map((r, i) => (
              <div key={i} style={{ background: TS.surface, borderRadius: 14, padding: 14, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--fill)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TS.sans, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{r.author.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 13 }}>{r.author}</div>
                    <div style={{ fontFamily: TS.sans, fontSize: 10, color: TS.muted }}>{r.time}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <span key={s} style={{ color: s < r.stars ? '#f59e0b' : '#e5e7eb', fontSize: 11 }}>★</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.45 }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'policies' && (
          <div style={{ padding: 16 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h34a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.43,117ZM192,88h34.58l9.6,24H192ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm96,0a16,16,0,1,1,16-16A16,16,0,0,1,176,208Z" fill="currentColor"/></svg>,
                title: 'Shipping', text: 'All orders shipped Royal Mail 1st Class Signed. Free shipping on orders over the threshold shown above. Cards are sent double-sleeved in toploaders with cardboard reinforcement.' },
              { icon: <svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l83.67-83.66,3.48,13.9-36.8,36.79a8,8,0,0,0,11.31,11.32l40-40a8,8,0,0,0,2.11-7.6l-6.9-27.61L227.32,96A16,16,0,0,0,227.32,73.37ZM48,208V163.31l88-88L180.69,120l-88,88Z" fill="currentColor"/></svg>,
                title: 'Returns', text: 'Returns accepted within 14 days of delivery if the card does not match the listing description. Buyer pays return shipping unless the item was misrepresented. Refunds processed within 2 business days of receiving the return.' },
              { icon: <svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm80,32H48V56H208V200ZM64,96V80A16,16,0,0,1,80,64H96a8,8,0,0,1,0,16H80V96a8,8,0,0,1-16,0Zm144,64v16a16,16,0,0,1-16,16H176a8,8,0,0,1,0-16h16V160a8,8,0,0,1,16,0Z" fill="currentColor"/></svg>,
                title: 'Grading Standards', text: 'We grade conservatively using TCGPlayer standards. NM means no visible wear under direct light. LP may have minor whitening on edges. All graded cards include close-up photos in the listing.' },
            ].map((p, i) => (
              <div key={i} style={{ background: TS.surface, borderRadius: 14, padding: 16, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-wash)', color: TS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontFamily: TS.sans, fontSize: 13, color: TS.ink2, lineHeight: 1.5 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SellerScreen });
