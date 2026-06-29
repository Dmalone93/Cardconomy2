// ─────────────────────────────────────────────────────────────
// Listing detail — TCGplayer-inspired architecture
// Card identity → price context → seller table → trade → similar
// ─────────────────────────────────────────────────────────────
const { T: TL, money: moneyL, Slab: SlabL, CardArt: CardArtL, GradeChip: GradeChipL,
  Sparkline: SparkL, Delta: DeltaL, Stars: StarsL, Chip: ChipL, Icon: IconL, Sheet: SheetL,
  CurrencyInput: CurrencyInputL } = window;
const { byId: byIdL, setById: setByIdL, gameById: gameByIdL, gradeText: gradeTextL, LISTINGS: LISTINGS_L } = window;
const { demandForProduct: demandL } = window;

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 12, padding: '11px 12px' }}>
      <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted, fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: color || 'var(--ink)' }}>{value}</div>
      {sub && <div style={{ fontFamily: TL.sans, fontSize: 10.5, color: TL.muted, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function InfoRow({ icon, title, sub, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ color: TL.muted, flexShrink: 0 }}>{typeof icon === 'string' ? <span style={{ fontSize: 16 }}>{icon}</span> : icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13.5 }}>{title}</div>
        {sub && <div style={{ fontFamily: TL.sans, fontSize: 11.5, color: TL.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {value && <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13, color: TL.ink, flexShrink: 0 }}>{value}</div>}
    </div>
  );
}

function ListingScreen({ app, params }) {
  const item = byIdL(params.id);
  const isLot = !!item.count;
  const [tf, setTf] = React.useState('90D');
  const [sheet, setSheet] = React.useState(null);
  const [offer, setOffer] = React.useState('');
  const [showPrintings, setShowPrintings] = React.useState(false);
  const [offerSent, setOfferSent] = React.useState(null);
  const [showTopL, setShowTopL] = React.useState(false);
  const scrollRefL = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRefL.current;
    if (!el) return;
    const onScroll = () => setShowTopL(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  const finishes = [{ key: 'standard', label: 'Standard', price: item.foil ? item.price * 0.6 : item.price },
    { key: 'foil', label: 'Foil', price: item.foil ? item.price : item.price * 1.8 }];
  const [finish, setFinish] = React.useState(item.foil ? 'foil' : 'standard');
  const displayPrice = (finishes.find(f => f.key === finish) || finishes[0]).price;
  const watched = app.isWatched(item.id);
  const g = gameByIdL(item.game);
  const set = setByIdL(item.set);
  const hist = item.history || [item.market, item.price];
  const sliceLen = { '7D': 3, '30D': 6, '90D': 9, '1Y': 12 }[tf] || 6;
  const histSlice = hist.slice(-sliceLen);
  const up = item.price >= hist[0];

  // Product data for multi-seller + trade
  const product = window.PRODUCTS && window.PRODUCTS.find(p => p.offers.some(o => o.listingId === item.id));
  const otherOffers = product ? product.offers.filter(o => o.listingId !== item.id).slice(0, 5) : [];
  const demand = product && demandL ? demandL(product) : null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', animation: 'ccPushIn 0.26s ease' }}>
      <div ref={scrollRefL} className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>

        {/* ═══ 1. CARD IDENTITY — image + name + price ═══ */}
        <div style={{ position: 'relative', background: 'var(--surface)', padding: '16px 16px 20px' }}>
          {/* back + share + watch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <button onClick={() => app.nav.pop()} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-2)',
              color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>{IconL.back({})}</button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { window.shareCard ? window.shareCard(item) : null; app.toast('Shared'); }} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-2)',
                color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.share({})}</button>
              <button onClick={() => app.toggleWatch(item.id)} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-2)',
                color: watched ? TL.down : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.heart({width:18,height:18}, watched)}</button>
            </div>
          </div>

          {/* card image — compact */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            {isLot ? (
              <div style={{ width: 140, height: 140, borderRadius: 14, background: item.art, color: '#fff', position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>{item.count}</div>
                <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12, letterSpacing: 1, opacity: 0.9 }}>CARD LOT</div>
              </div>
            ) : item.grade.company !== 'raw' ? (
              <SlabL item={item} w={140} />
            ) : (
              <CardArtL item={item} w={160} radius={0} />
            )}
          </div>

          {/* badges */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 11, color: '#fff', background: g.tint, borderRadius: 6, padding: '2px 8px' }}>{g.short}</span>
            {!isLot && <GradeChipL grade={item.grade} />}
            {item.foil && <span style={{ fontFamily: TL.sans, fontSize: 11, fontWeight: 600, color: TL.muted }}>✦ Foil</span>}
          </div>

          {/* name + set */}
          <h1 style={{ margin: 0, fontFamily: TL.sans, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.1 }}>{item.name}</h1>
          <div style={{ fontFamily: TL.sans, fontSize: 13, color: TL.muted, marginTop: 4 }}>
            {set ? set.name : ''}{item.number ? ' \u00B7 ' + item.number : ''}{isLot ? '' : ' \u00B7 ' + item.condition}
          </div>

          {/* price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 28, color: 'var(--ink)' }}>{moneyL(displayPrice)}</span>
            {item.market && <span style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted }}>market {moneyL(item.market)}</span>}
          </div>

          {/* shipping line */}
          <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted, marginTop: 6 }}>
            {item.shipping === 0 ? 'Free shipping' : moneyL(item.shipping) + ' shipping'} \u00B7 {item.ships} \u00B7 {item.loc}
          </div>

          {/* demand badge */}
          {demand && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '5px 10px',
              background: demand.hot ? 'var(--gold)' : 'var(--surface-2)', borderRadius: 8 }}>
              <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12, color: demand.hot ? '#fff' : 'var(--ink)' }}>
                {demand.wants} buyers want this
              </span>
            </div>
          )}
        </div>

        {/* ═══ 2. PRICE CONTEXT — history + stat boxes ═══ */}
        {item.history && (
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 15 }}>Price history</span>
              <span style={{ display: 'flex', gap: 4 }}>
                {['7D','30D','90D','1Y'].map(t => (
                  <button key={t} onClick={() => setTf(t)} style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 11,
                    padding: '4px 9px', borderRadius: 7, color: tf===t?'#fff':TL.muted, background: tf===t?'var(--ink)':'transparent' }}>{t}</button>
                ))}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16 }}>{moneyL(item.price)}</span>
              <DeltaL from={hist[0]} to={item.price} />
            </div>
            <SparkL data={histSlice} w={358} h={100} up={up} fill dots />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, marginBottom: 16 }}>
              <StatBox label="Last sold" value={moneyL(hist[hist.length-2])} sub="2 days ago" />
              <StatBox label="Low" value={moneyL(Math.min(...hist))} />
              <StatBox label="High" value={moneyL(Math.max(...hist))} />
            </div>
          </div>
        )}

        {/* ═══ 3. SELLER LISTINGS — table rows ═══ */}
        <div style={{ borderTop: '1px solid var(--line)', padding: '14px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 15 }}>{otherOffers.length + 1} Listing{otherOffers.length > 0 ? 's' : ''}</span>
            <span style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted }}>
              {otherOffers.length > 0 ? 'As low as ' + moneyL(Math.min(displayPrice, ...otherOffers.map(o => o.price))) : ''}
            </span>
          </div>

          {/* Current seller — highlighted row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{item.seller[0]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13 }}>{item.seller}</span>
                {item.sellerRating >= 99 && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '1px 5px', borderRadius: 4, fontWeight: 700, fontSize: 9 }}>Trusted</span>}
              </div>
              <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted }}>{item.sellerRating}% \u00B7 {item.sellerSales.toLocaleString()} sales \u00B7 {item.condition}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15 }}>{moneyL(displayPrice)}</div>
              <div style={{ fontFamily: TL.sans, fontSize: 10, color: TL.muted }}>{item.shipping === 0 ? 'Free' : moneyL(item.shipping)}</div>
            </div>
            <button onClick={() => app.addToCart(item.id)} style={{
              padding: '8px 12px', borderRadius: 10, background: 'var(--ink)', color: '#fff',
              fontFamily: TL.sans, fontWeight: 700, fontSize: 12, flexShrink: 0, border: 'none',
            }}>{app.cart.includes(item.id) ? '\u2713' : 'Add'}</button>
          </div>

          {/* Other seller rows */}
          {otherOffers.map((o, idx) => (
            <div key={o.id} onClick={() => { if (o.listingId) app.nav.push('listing', { id: o.listingId }); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', cursor: 'pointer',
                borderBottom: idx < otherOffers.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{o.seller.charAt(0)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13 }}>{o.seller}</div>
                <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted }}>{o.sellerRating}% \u00B7 {o.sellerSales.toLocaleString()} \u00B7 {o.condition}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15 }}>{moneyL(o.price)}</div>
                <div style={{ fontFamily: TL.sans, fontSize: 10, color: TL.muted }}>{o.shipping === 0 ? 'Free' : moneyL(o.shipping)}</div>
              </div>
              <button onClick={function(e) { e.stopPropagation(); if (o.listingId) app.addToCart(o.listingId); else app.toast('Added from ' + o.seller); }}
                style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--ink)',
                  fontFamily: TL.sans, fontWeight: 700, fontSize: 12, flexShrink: 0, border: 'none' }}>Add</button>
            </div>
          ))}
        </div>

        {/* ═══ 4. SELLER DETAIL — notes, photos, message ═══ */}
        <div style={{ borderTop: '1px solid var(--line)', marginTop: 8, padding: '14px 16px 0' }}>
          {/* seller notes */}
          {!isLot && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Seller notes</div>
              <div style={{ fontFamily: TL.sans, fontSize: 13, color: TL.ink2, lineHeight: 1.6 }}>
                {['Pulled from a sealed booster and sleeved immediately. Never played, stored in a top loader in a smoke-free home.',
                  'Beautiful card in excellent condition. Centering is near perfect. Happy to send additional close-up photos on request.',
                  'Part of my personal collection. Selling to fund a different chase card. No trades on this one, firm on price.',
                  'Pack-fresh condition. Will ship double-sleeved in a top loader with tracking. Same-day dispatch if ordered before 2pm.',
                  'Slight whitening on the top-left corner, reflected in the price. Otherwise a gorgeous card. See photos for details.',
                ][Math.abs(item.id.charCodeAt(2)) % 5]}
              </div>
            </div>
          )}

          {/* compact seller row + message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{item.seller[0]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 14 }}>{item.seller}</span>
              <div style={{ fontFamily: TL.sans, fontSize: 11.5, color: TL.muted }}><StarsL rating={item.sellerRating} /> {item.sellerRating}% \u00B7 {item.sellerSales.toLocaleString()} sales</div>
            </div>
            <button onClick={() => app.nav.push('seller', { name: item.seller })} style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12, color: 'var(--ink)', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>Store</button>
            <button onClick={() => app.nav.push('chat', { seller: item.seller, about: item.id })} style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12, color: 'var(--ink)', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>Message</button>
          </div>
        </div>

        {/* ═══ 5. TRADE OFFERS ═══ */}
        {product && product.tradeOffers && product.tradeOffers.length > 0 && (
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 8, padding: '14px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15 }}>{'\u21C4'}</span>
              <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 15 }}>Available to trade</span>
              <span style={{ background: 'var(--surface-2)', color: TL.muted, padding: '2px 7px', borderRadius: 6, fontFamily: TL.sans, fontWeight: 700, fontSize: 10 }}>{product.tradeCount}</span>
            </div>
            {product.tradeOffers.map((t, idx) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: idx < product.tradeOffers.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                <span style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{t.trader.charAt(0)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13 }}>{t.trader} <span style={{ fontSize: 11, color: TL.muted }}>{t.traderRating}%</span></div>
                  <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted }}>Wants: {t.wantCard.name}</div>
                </div>
                <button onClick={() => app.nav.push('trade')} style={{
                  padding: '7px 12px', borderRadius: 8, background: 'var(--ink)', color: '#fff',
                  fontFamily: TL.sans, fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Trade</button>
              </div>
            ))}
          </div>
        )}

        {/* ═══ 6. SIMILAR LISTINGS ═══ */}
        <div style={{ borderTop: '1px solid var(--line)', marginTop: 8, padding: '14px 16px 16px' }}>
          <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Similar listings</div>
          <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', margin: '0 -16px', padding: '0 16px' }}>
            {LISTINGS_L.filter(l => l.id !== item.id && l.game === item.game).slice(0,6).map(l => (
              <button key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} style={{ flexShrink: 0, width: 110, textAlign: 'left' }}>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 8, display: 'flex', justifyContent: 'center' }}><CardArtL item={l} w={84} /></div>
                <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13 }}>{moneyL(l.price)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '10px 16px',
        display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 -2px 10px rgba(20,24,40,0.06)' }}>
        {item.accepts_offers && (
          <button onClick={() => setSheet('offer')} style={{ flex: 1, background: 'none', color: 'var(--ink)', borderRadius: 12,
            padding: '14px 8px', fontFamily: TL.sans, fontWeight: 700, fontSize: 14, border: '1.5px solid var(--line)' }}>Make offer</button>
        )}
        <button onClick={() => app.addToCart(item.id)} style={{ flex: 1.3, background: 'var(--ink)', color: '#fff', borderRadius: 12,
          padding: '14px 8px', fontFamily: TL.sans, fontWeight: 700, fontSize: 15, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {app.cart.includes(item.id) ? 'In cart' : 'Add to cart \u00B7 ' + moneyL(displayPrice)}
        </button>
      </div>

      {/* back to top */}
      <button onClick={() => scrollRefL.current && scrollRefL.current.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'fixed', bottom: 80, right: 16, width: 40, height: 40, borderRadius: 999,
          background: 'var(--ink)', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center',
          justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 40,
          opacity: showTopL ? 1 : 0, pointerEvents: showTopL ? 'auto' : 'none',
          transition: 'opacity 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        aria-label="Back to top">{'\u2191'}</button>

      {/* offer sheet */}
      {sheet === 'offer' && (
        <SheetL title={'Offer to ' + item.seller} onClose={() => setSheet(null)}>
          <div style={{ padding: '8px 0 20px' }}>
            <div style={{ fontFamily: TL.sans, fontSize: 13, color: TL.muted, marginBottom: 12 }}>
              Listed at {moneyL(displayPrice)} \u00B7 {item.condition}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, color: TL.muted }}>{'\u00A3'}</span>
              <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="0.00" type="number"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', minWidth: 0 }} />
            </div>
            <button onClick={() => { setOfferSent({ seller: item.seller, amount: parseFloat(offer) || 0 }); setSheet(null); app.toast('Offer sent to ' + item.seller); }}
              style={{ width: '100%', marginTop: 16, background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: 14,
                fontFamily: TL.sans, fontWeight: 700, fontSize: 15, border: 'none', opacity: offer ? 1 : 0.5 }} disabled={!offer}>Send offer</button>
          </div>
        </SheetL>
      )}

      {/* printings sheet */}
      {showPrintings && (
        <SheetL title="All Printings" onClose={() => setShowPrintings(false)}>
          <div style={{ padding: '0 16px 20px' }}>
            {(window.PRINTINGS[item.name] || []).map((p, i) => {
              const s = setByIdL(p.set);
              return (
                <button key={i} onClick={() => { setShowPrintings(false); if (p.listingId) app.nav.push('listing', { id: p.listingId }); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line-2)', textAlign: 'left' }}>
                  <div style={{ width: 44, height: 60, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: p.art || 'var(--surface-2)' }}>
                    {p.art && <div style={{ width: '100%', height: '100%', background: p.art }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 14 }}>{p.variant || item.name}</div>
                    <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted }}>{s ? s.name : p.set} \u00B7 {p.number || ''}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15 }}>{moneyL(p.price)}</div>
                </button>
              );
            })}
          </div>
        </SheetL>
      )}
    </div>
  );
}

Object.assign(window, { ListingScreen });
