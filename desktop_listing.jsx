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
  const auction = item.type === 'auction';
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
            <span style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>{item.seller[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontWeight: 700, fontSize: 15.5 }}>{item.seller}</span>{window.TrustBadge && <window.TrustBadge tier={item.sellerRating >= 99 ? 2 : 1} />}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}><StarsLi rating={item.sellerRating} /><span style={{ fontFamily: TLi.mono, fontSize: 12.5, color: 'var(--muted)' }}>{item.sellerRating}% · {item.sellerSales.toLocaleString()} sales</span></div>
            </div>
            <button onClick={() => app.go('storefront', { shop: 'gnome' })} style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: 10, padding: '9px 16px' }}>Visit store</button>
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
            {auction ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Current bid · {item.bids} bids</div>
                <div style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 32, letterSpacing: -1 }}>{mLi(item.price)}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'var(--accent-wash)', color: 'var(--accent)', borderRadius: 8, padding: '6px 11px', fontWeight: 700, fontSize: 13 }}>⏱ Ends in {item.timeLeft}</div>
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: TLi.mono, fontWeight: 700, fontSize: 34, letterSpacing: -1.2 }}>{mLi(item.price)}</span>
                  {item.market && <DeltaLi from={item.history ? item.history[0] : item.market} to={item.price} />}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Market {mLi(item.market)} · {item.shipping === 0 ? 'Free shipping' : mLi(item.shipping) + ' shipping'}</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {auction ? (
                <React.Fragment>
                  <button onClick={() => app.placeBid(item, +(item.price * 1.05).toFixed(2))} style={primaryBtn}>Place bid · {mLi(item.price * 1.05)}</button>
                  <button onClick={() => app.toggleWatch(item.id)} style={ghostBtn}>{watched ? '♥ Watching' : '♡ Watch this auction'}</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <button onClick={() => app.addToCart(item.id)} style={primaryBtn}>{app.inCart(item.id) ? '✓ Added — view cart' : 'Add to cart'}</button>
                  <button onClick={() => { app.addToCart(item.id); app.go('cart'); }} style={{ ...primaryBtn, background: 'var(--fill)' }}>Buy it now</button>
                  {item.accepts_offers && <button onClick={() => app.toast('Offer sent to ' + item.seller)} style={ghostBtn}>Make an offer</button>}
                </React.Fragment>
              )}
              <button onClick={() => app.toggleWatch(item.id)} style={{ display: auction ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', fontWeight: 600, fontSize: 14, color: watched ? 'var(--down)' : 'var(--ink-2)' }}>
                {window.DIcon.heart({ width: 18, height: 18 }, watched)} {watched ? 'In your Watching' : 'Add to Watching'}
              </button>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-2)', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              {IconLi.shield({ width: 18, height: 18, style: { color: 'var(--up)', flexShrink: 0, marginTop: 1 } })}
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45 }}><b>Protected purchase.</b> Full refund if it doesn't arrive or isn't as described.</span>
            </div>
          </div>
        </div>
      </div>

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

const primaryBtn = { width: '100%', background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '14px', fontFamily: TLi.sans, fontWeight: 700, fontSize: 15.5 };
const ghostBtn = { width: '100%', background: 'var(--surface)', color: 'var(--ink)', borderRadius: 12, padding: '13px', fontFamily: TLi.sans, fontWeight: 700, fontSize: 14.5, boxShadow: 'inset 0 0 0 1.5px var(--line)' };

Object.assign(window, { DListing });
