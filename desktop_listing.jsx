// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — Listing detail (gallery + buy box)
// ─────────────────────────────────────────────────────────────
const { T: TLi, money: mLi, CardArt: CardArtLi, Slab: SlabLi, GradeChip: GradeChipLi, Sparkline: SparkLi, Delta: DeltaLi, Stars: StarsLi, Icon: IconLi, gradeText: gradeTextLi } = window;
const { byId: byIdLi, setById: setByIdLi, gameById: gameByIdLi, LISTINGS: LISTLi } = window;
const { DCard: DCardLi } = window;

function DListing({ app, params }) {
  const item = byIdLi(params.id);
  const [tf, setTf] = React.useState('90D');
  const [tab, setTab] = React.useState('front');
  if (!item) return <div className="wrap" style={{ padding: 60 }}>Listing not found.</div>;
  const g = gameByIdLi(item.game);
  const set = setByIdLi(item.set);
  const hist = item.history || [item.market, item.price];
  const up = item.price >= hist[0];
  const watched = app.isWatched(item.id);
  const graded = item.grade.company !== 'raw';
  const similar = LISTLi.filter(l => l.id !== item.id && l.game === item.game).slice(0, 5);

  return (
    <div className="wrap" style={{ padding: '24px 24px 20px' }}>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
        <button onClick={() => app.go('home')} style={{ color: 'var(--muted)' }}>Home</button> / <button onClick={() => app.go('search', { game: item.game })} style={{ color: 'var(--muted)' }}>{g.short}</button> / <span style={{ color: 'var(--ink-2)' }}>{item.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr 320px', gap: 30, alignItems: 'start' }} className="lst-grid">
        {/* gallery */}
        <div style={{ position: 'sticky', top: 130 }} className="lst-gallery">
          <div style={{ background: 'var(--surface)', borderRadius: 18, padding: 28, display: 'flex', justifyContent: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
            {graded ? <SlabLi item={item} w={230} /> : <div style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.2))' }}><CardArtLi item={item} w={230} radius={14} /></div>}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {['front', 'back', 'detail'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, height: 72, borderRadius: 11, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: tab === t ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>
                <CardArtLi item={item} w={36} radius={4} />
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, fontSize: 12.5, color: 'var(--muted)', justifyContent: 'center' }}>
            {IconLi.shield({ width: 14, height: 14, style: { color: 'var(--up)' } })} Seller's actual photos · {graded ? gradeTextLi(item.grade) + ' verified slab' : 'verified by seller'}
          </div>
        </div>

        {/* center: details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ background: g.tint, color: '#fff', borderRadius: 6, padding: '3px 10px', fontWeight: 700, fontSize: 12 }}>{g.short}</span>
            <GradeChipLi grade={item.grade} size="lg" />
            {item.foil && <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>✦ Foil / Holo</span>}
          </div>
          <h1 style={{ fontFamily: TLi.sans, fontWeight: 800, fontSize: 30, letterSpacing: -1, lineHeight: 1.08, margin: 0 }}>{item.name}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 6 }}>{set ? set.name : ''}{item.number ? ' · ' + item.number : ''} · {item.condition}</div>

          {/* price history */}
          {item.history && (
            <div style={{ marginTop: 24, background: 'var(--surface)', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Price history</span>
                <span style={{ display: 'flex', gap: 4 }}>{['30D', '90D', '1Y'].map(t => <button key={t} onClick={() => setTf(t)} style={{ fontWeight: 700, fontSize: 12, padding: '5px 11px', borderRadius: 8, color: tf === t ? '#fff' : 'var(--muted)', background: tf === t ? 'var(--fill)' : 'transparent' }}>{t}</button>)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 22 }}>{mLi(item.price)}</span>
                <DeltaLi from={hist[0]} to={item.price} /><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>vs {tf} ago</span>
              </div>
              <SparkLi data={hist} w={620} h={90} up={up} dots />
              <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                {[['Last sold', mLi(hist[hist.length - 2]), '2 days ago'], ['90-day low', mLi(Math.min(...hist))], ['90-day high', mLi(Math.max(...hist))], ['Market', mLi(item.market)]].map(([k, v, s]) => (
                  <div key={k} style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 11, padding: '11px 13px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 16 }}>{v}</div>
                    {s && <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{s}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* seller */}
          <div style={{ marginTop: 20, background: 'var(--surface)', borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
            <span style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>{item.seller[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontWeight: 700, fontSize: 15.5 }}>{item.seller}</span>{window.TrustBadge && <window.TrustBadge tier={item.sellerRating >= 99 ? 2 : 1} />}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}><StarsLi rating={item.sellerRating} /><span style={{ fontFamily: TLi.mono, fontSize: 12.5, color: 'var(--muted)' }}>{item.sellerRating}% · {item.sellerSales.toLocaleString()} sales</span></div>
            </div>
            <button onClick={() => app.go('seller', { name: item.seller })} style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)', border: '1.5px solid var(--accent)', borderRadius: 10, padding: '9px 16px' }}>Visit store</button>
          </div>

          {/* info rows */}
          <div style={{ marginTop: 20 }}>
            {[[IconLi.truck, item.shipping === 0 ? 'Free shipping' : mLi(item.shipping) + ' shipping', 'Ships from ' + item.loc + ' · ' + item.ships],
              [IconLi.shield, 'Cardonomy Buyer Protection', 'Full refund if item not as described'],
              [IconLi.tag, 'Authenticity guarantee', graded ? gradeTextLi(item.grade) + ' verified slab' : 'Verified by seller']].map(([ic, t, s], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: '1px solid var(--line-2)' }}>
                <span style={{ color: 'var(--muted)' }}>{ic({ width: 20, height: 20 })}</span>
                <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{t}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* buy box */}
        <div style={{ position: 'sticky', top: 130 }} className="lst-buybox">
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 22, boxShadow: '0 4px 20px rgba(20,24,40,0.08)' }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 34, letterSpacing: -1.2 }}>{mLi(item.price)}</span>
                  {item.market && <DeltaLi from={item.history ? item.history[0] : item.market} to={item.price} />}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Market {mLi(item.market)} · {item.shipping === 0 ? 'Free shipping' : mLi(item.shipping) + ' shipping'}</div>
              </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => app.addToCart(item.id)} style={primaryBtn}>{app.inCart(item.id) ? '✓ Added — view cart' : 'Add to cart'}</button>
                <button onClick={() => { app.addToCart(item.id); app.go('cart'); }} style={{ ...primaryBtn, background: 'var(--fill)' }}>Buy it now</button>
                {item.accepts_offers && <button onClick={() => app.toast('Offer sent to ' + item.seller)} style={ghostBtn}>Make an offer</button>}
              <button onClick={() => app.toggleWatch(item.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', fontWeight: 600, fontSize: 14, color: watched ? 'var(--down)' : 'var(--ink-2)' }}>
                {window.DIcon.heart({ width: 18, height: 18 }, watched)} {watched ? 'In your Watching' : 'Add to Watching'}
              </button>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-2)', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              {IconLi.shield({ width: 18, height: 18, style: { color: 'var(--up)', flexShrink: 0, marginTop: 1 } })}
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45 }}><b>Protected purchase.</b> Full refund if it doesn\'t arrive or isn\'t as described.</span>
            </div>
          </div>
        </div>
      </div>

      {/* trade offers */}
      {(() => {
        const product = window.PRODUCTS && window.PRODUCTS.find(p => p.offers.some(o => o.listingId === item.id));
        if (!product || !product.tradeOffers || product.tradeOffers.length === 0) return null;
        return (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ fontFamily: TLi.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, margin: 0 }}>Available to trade</h2>
              <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 10px', borderRadius: 7, fontWeight: 700, fontSize: 11 }}>{product.tradeCount} trader{product.tradeCount !== 1 ? 's' : ''}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px' }}>These collectors have this card and want to swap — no cash needed.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {product.tradeOffers.map((t, idx) => (
                <div key={t.id} style={{ background: 'var(--surface)', borderRadius: 16, padding: 18, boxShadow: idx === 0 ? 'inset 0 0 0 2px #7c3aed, 0 1px 3px rgba(20,24,40,0.06)' : '0 1px 3px rgba(20,24,40,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 999, background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{t.trader.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{t.trader}</span>
                        {t.verified && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 7px', borderRadius: 5, fontWeight: 700, fontSize: 10 }}>Verified</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{t.traderRating}% · {t.traderTrades.toLocaleString()} trades · {t.traderLoc}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>Wants in return</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#faf5ff', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <div style={{ flexShrink: 0 }}><CardArtLi item={t.wantCard} w={40} radius={5} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.wantCard.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{t.wantCard.subtitle}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Condition: {t.wantCard.condition === 'Near Mint' ? 'NM+' : t.wantCard.condition} · {t.wantCard.gradePref}</div>
                    </div>
                  </div>
                  {t.note && <div style={{ fontSize: 13, color: 'var(--ink-2)', fontStyle: 'italic', lineHeight: 1.4, marginBottom: 10 }}>"{t.note}"</div>}
                  <button onClick={() => app.go('trade')} style={{ width: '100%', background: 'none', border: '1.5px solid #7c3aed', color: '#7c3aed', padding: 11, borderRadius: 11, fontWeight: 700, fontSize: 14 }}>Propose trade</button>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* other sellers for this product */}
      {(() => {
        const product = window.PRODUCTS && window.PRODUCTS.find(p => p.offers.some(o => o.listingId === item.id));
        if (!product || product.offers.length <= 1) return null;
        const otherOffers = product.offers.filter(o => o.listingId !== item.id);
        if (otherOffers.length === 0) return null;
        const showOffers = otherOffers.slice(0, 5);
        const remaining = otherOffers.length - showOffers.length;
        return (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <h2 style={{ fontFamily: TLi.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, margin: 0 }}>Other sellers</h2>
              <span style={{ background: 'var(--surface)', color: 'var(--muted)', padding: '4px 10px', borderRadius: 7, fontWeight: 700, fontSize: 11 }}>{otherOffers.length} offer{otherOffers.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {showOffers.map((o, idx) => (
                <div key={o.id} onClick={() => { if (o.listingId) app.go('listing', { id: o.listingId }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                    borderBottom: idx < showOffers.length - 1 ? '1px solid var(--line-2)' : 'none', cursor: 'pointer' }}
                  onMouseEnter={function(e){ e.currentTarget.style.background = 'var(--surface)'; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background = 'none'; }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{o.seller.charAt(0)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{o.seller}</span>
                      {o.sellerRating >= 99 && window.TrustBadge && <window.TrustBadge tier={2} />}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{o.sellerRating}% · {o.sellerSales.toLocaleString()} sales · {o.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 16 }}>{mLi(o.price)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{o.shipping === 0 ? 'Free shipping' : mLi(o.shipping) + ' shipping'}</div>
                  </div>
                  <button onClick={function(e) { e.stopPropagation(); if (o.listingId) app.addToCart(o.listingId); else app.toast('Added'); }}
                    style={{ padding: '9px 14px', borderRadius: 10, background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>Add to cart</button>
                </div>
              ))}
            </div>
            {remaining > 0 && (
              <button onClick={() => app.go('search', { game: item.game })}
                style={{ marginTop: 14, width: '100%', padding: '12px', borderRadius: 11, background: 'var(--surface)', fontWeight: 700, fontSize: 14, color: 'var(--ink)', border: '1.5px solid var(--line)' }}>
                View all {otherOffers.length} sellers
              </button>
            )}
          </section>
        );
      })()}

      {/* similar */}
      <section style={{ marginTop: 50 }}>
        <h2 style={{ fontFamily: TLi.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, margin: '0 0 18px' }}>Similar listings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18 }}>
          {similar.map(l => <DCardLi key={l.id} item={l} app={app} />)}
        </div>
      </section>

      <style>{`@media (max-width: 1040px){ .lst-grid{ grid-template-columns: 1fr 1fr !important; } .lst-buybox{ grid-column: 1 / -1; position: static !important; } }
        @media (max-width: 720px){ .lst-grid{ grid-template-columns: 1fr !important; } .lst-gallery{ position: static !important; } }`}</style>
    </div>
  );
}

const primaryBtn = { width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '14px', fontFamily: TLi.sans, fontWeight: 700, fontSize: 15.5 };
const ghostBtn = { width: '100%', background: 'var(--surface)', color: 'var(--ink)', borderRadius: 12, padding: '13px', fontFamily: TLi.sans, fontWeight: 700, fontSize: 14.5, boxShadow: 'inset 0 0 0 1.5px var(--line)' };

Object.assign(window, { DListing });
