// ─────────────────────────────────────────────────────────────
// Listing detail
// ─────────────────────────────────────────────────────────────
const { T: TL, money: moneyL, Slab: SlabL, CardArt: CardArtL, GradeChip: GradeChipL,
  Sparkline: SparkL, Delta: DeltaL, Stars: StarsL, Chip: ChipL, Icon: IconL, Sheet: SheetL } = window;
const { byId: byIdL, setById: setByIdL, gameById: gameByIdL, gradeText: gradeTextL, LISTINGS: LISTINGS_L } = window;

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ flex: 1, background: TL.surface2, borderRadius: 12, padding: '11px 12px' }}>
      <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted, fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 17, color: color || TL.ink }}>{value}</div>
      {sub && <div style={{ fontFamily: TL.sans, fontSize: 10.5, color: TL.muted, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function InfoRow({ icon, title, value, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ color: TL.muted }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TL.sans, fontSize: 14, fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {value && <div style={{ fontFamily: TL.sans, fontSize: 14, fontWeight: 700, color: TL.ink }}>{value}</div>}
    </div>
  );
}

function ListingScreen({ app, params }) {
  const item = byIdL(params.id);
  const isLot = !!item.count;
  const [tf, setTf] = React.useState('90D');
  const [sheet, setSheet] = React.useState(null);
  const [offer, setOffer] = React.useState('');
  const [offerSent, setOfferSent] = React.useState(null);
  const watched = app.isWatched(item.id);
  const g = gameByIdL(item.game);
  const set = setByIdL(item.set);
  const hist = item.history || [item.market, item.price];
  const histSlice = tf === '30D' ? hist.slice(-5) : tf === '90D' ? hist : hist;
  const up = item.price >= hist[0];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TL.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '52px 12px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(238,240,243,0.96), rgba(238,240,243,0))' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TL.surface,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)', color: TL.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.back({})}</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => app.toast('Link copied')} style={{ width: 38, height: 38, borderRadius: 999, background: TL.surface,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)', color: TL.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.share({})}</button>
          <button onClick={() => app.toggleWatch(item.id)} style={{ width: 38, height: 38, borderRadius: 999, background: TL.surface,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)', color: watched?TL.down:TL.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.heart({width:20,height:20}, watched)}</button>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {/* hero */}
        <div style={{ background: 'radial-gradient(120% 90% at 50% 0%, ' + (item.art) + '22, ' + TL.surface + ' 70%)',
          paddingTop: 96, paddingBottom: 24, display: 'flex', justifyContent: 'center' }}>
          {isLot ? (
            <div style={{ width: 200, height: 200, borderRadius: 18, background: item.art, color: '#fff', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.18)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 10px, transparent 10px 20px)' }} />
              <div style={{ position: 'relative', fontFamily: TL.sans, fontWeight: 700, fontSize: 52, lineHeight: 1 }}>{item.count}</div>
              <div style={{ position: 'relative', fontFamily: TL.sans, fontWeight: 700, fontSize: 14, letterSpacing: 1, opacity: 0.9 }}>CARD LOT</div>
            </div>
          ) : item.grade.company !== 'raw' ? (
            <Slab item={item} w={176} />
          ) : (
            <div style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.2))' }}><CardArtL item={item} w={176} radius={14} /></div>
          )}
        </div>

        {/* body */}
        <div style={{ background: TL.surface, borderRadius: '22px 22px 0 0', marginTop: -12, padding: '20px 18px 8px', position: 'relative' }}>
          {/* title block */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: TL.sans, fontWeight: 700, fontSize: 12,
              color: '#fff', background: g.tint, borderRadius: 6, padding: '3px 9px' }}>{g.short}</span>
            {!isLot && <GradeChipL grade={item.grade} size="lg" />}
            {item.foil && <span style={{ fontFamily: TL.sans, fontSize: 12, fontWeight: 600, color: TL.muted }}>✦ Foil / Holo</span>}
          </div>
          <h1 style={{ margin: 0, fontFamily: TL.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.6, lineHeight: 1.1 }}>{item.name}</h1>
          <div style={{ fontFamily: TL.sans, fontSize: 14, color: TL.muted, marginTop: 4 }}>
            {set ? set.name : ''}{item.number ? ' · ' + item.number : ''}{isLot ? '' : ' · ' + item.condition}
          </div>

          {/* price */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 16 }}>
            <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 32, letterSpacing: -1, color: TL.ink }}>{moneyL(item.price)}</span>
            {item.market && <span style={{ fontFamily: TL.sans, fontSize: 13, color: TL.muted, paddingBottom: 6 }}>
              market <b style={{ color: TL.ink2, fontFamily: TL.sans }}>{moneyL(item.market)}</b>
            </span>}
          </div>
          {isLot && (
            <div style={{ marginTop: 12, background: TL.surface2, borderRadius: 12, padding: '12px 14px', fontFamily: TL.sans, fontSize: 13.5, color: TL.ink2 }}>
              <b>What\'s inside:</b> {item.note}. Condition {item.condition}.
            </div>
          )}

          {/* buyer protection banner */}
          <div style={{ marginTop: 18, padding: '12px 14px', background: TL.surface2, borderRadius: 4, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0, color: 'var(--accent)' }}>{IconL.shield ? IconL.shield({ width: 20, height: 20 }) : '🛡️'}</span>
            <div>
              <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13 }}>Buyer Protection</div>
              <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted, lineHeight: 1.4, marginTop: 2 }}>Every purchase is covered. If the card doesn\'t match the listing, get a full refund.</div>
            </div>
          </div>

          {/* seller\'s real photos */}
          {!isLot && (
            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: TL.sans, fontWeight: 800, fontSize: 17 }}>Seller\'s photos</span>
                <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 10, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 6, padding: '2px 7px', letterSpacing: 0.3 }}>ACTUAL CARD</span>
              </div>
              <div style={{ fontFamily: TL.sans, fontSize: 12.5, color: TL.muted, marginBottom: 11, lineHeight: 1.4 }}>
                Real photos {item.seller} took of this exact card — tap a frame to add one.
              </div>
              <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 4px' }}>
                {[['front', 'Front'], ['back', 'Back'], ['angle', 'Detail / flaws'], ['cert', 'Certificate']].map(([k, label], i) => (
                  <div key={k} style={{ flexShrink: 0, width: i === 0 ? 168 : 132 }}>
                    <image-slot
                      id={'cardphoto-' + item.id + '-' + k}
                      shape="rounded" radius="12" fit="cover"
                      placeholder={'＋ ' + label + ' photo'}
                      style={{ display: 'block', width: '100%', height: (i === 0 ? 168 : 132) * 1.4 + 'px', background: TL.surface2, boxShadow: 'inset 0 0 0 1.5px var(--line)', borderRadius: 12 }}>
                    </image-slot>
                    <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 11.5, color: TL.muted, marginTop: 6, textAlign: 'center' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, fontFamily: TL.sans, fontSize: 11.5, color: TL.muted }}>
                {IconL.shield({ width: 14, height: 14, style: { color: TL.muted } })}
                Photos are the seller\'s own. Graded slabs are authenticity-verified.
              </div>
            </div>
          )}

          {/* price history */}
          {item.history && (
            <div style={{ marginTop: 22, background: TL.surface2, borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 14 }}>Price history</span>
                <span style={{ display: 'flex', gap: 4 }}>
                  {['30D','90D','1Y'].map(t => (
                    <button key={t} onClick={() => setTf(t)} style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 11.5,
                      padding: '4px 9px', borderRadius: 7, color: tf===t?'#fff':TL.muted, background: tf===t?'var(--fill)':'transparent' }}>{t}</button>
                  ))}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 18 }}>{moneyL(item.price)}</span>
                <DeltaL from={hist[0]} to={item.price} />
                <span style={{ fontFamily: TL.sans, fontSize: 11.5, color: TL.muted }}>vs {tf} ago</span>
              </div>
              <SparkL data={histSlice} w={320} h={70} up={up} dots />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <StatBox label="Last sold" value={moneyL(hist[hist.length-2])} sub="2 days ago" />
                <StatBox label="90-day low" value={moneyL(Math.min(...hist))} />
                <StatBox label="90-day high" value={moneyL(Math.max(...hist))} />
              </div>
            </div>
          )}

          {/* seller */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: TL.sans, fontWeight: 800, fontSize: 17, marginBottom: 10 }}>Seller</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: TL.surface2, borderRadius: 14, padding: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: TL.accent, color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontFamily: TL.sans, fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{item.seller[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 15 }}>{item.seller}</span>
                  {window.TrustBadge ? <window.TrustBadge tier={item.sellerRating >= 99 ? 2 : 1} /> : (
                    item.sellerRating >= 99 && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 4, fontFamily: TL.sans, fontWeight: 700, fontSize: 10 }}>Trusted</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <StarsL rating={item.sellerRating} />
                  <span style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted }}>{item.sellerRating}% · {item.sellerSales.toLocaleString()} sales</span>
                </div>
              </div>
              <button onClick={() => app.nav.push('seller', { name: item.seller })} style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13,
                color: TL.accent, padding: '8px 12px', borderRadius: 10, boxShadow: 'inset 0 0 0 1px var(--accent)' }}>Store</button>
            </div>
          </div>

          {/* shipping / protection */}
          <div style={{ marginTop: 18 }}>
            <InfoRow icon={IconL.truck({})} title={item.shipping === 0 ? 'Free shipping' : moneyL(item.shipping) + ' shipping'} sub={'Ships from ' + item.loc} value={item.ships} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--line-2)' }}>
              <div style={{ color: TL.muted }}>{IconL.truck ? IconL.truck({ width: 16, height: 16 }) : '📦'}</div>
              <div style={{ fontFamily: TL.sans, fontSize: 13, fontWeight: 600, color: TL.ink2 }}>
                Estimated delivery: <span style={{ fontWeight: 700, color: TL.ink }}>{item.ships || '3–5 business days'}</span>
              </div>
            </div>
            <InfoRow icon={IconL.shield({})} title="Cardonomy Buyer Protection" sub="Full refund if item not as described" />
            <InfoRow icon={IconL.tag({})} title="Authenticity guarantee" sub={item.grade && item.grade.company!=='raw' ? gradeTextL(item.grade)+' verified slab' : 'Verified by seller'} />
          </div>

          {/* card authentication — raw cards only */}
          {item.grade && item.grade.company === 'raw' && (
            <button onClick={() => app.nav.push('authcard', { id: item.id })} style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
              background: 'var(--up-wash)', borderRadius: 13, padding: '13px 14px', boxShadow: 'inset 0 0 0 1.5px var(--up)' }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: 'var(--up)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconL.shield({ width: 18, height: 18 })}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13.5, color: 'var(--up)' }}>Get it Cardonomy Verified</div>
                <div style={{ fontFamily: TL.sans, fontSize: 11.5, color: TL.ink2 }}>Authenticate this raw card — sells faster, for more.</div>
              </div>
              {IconL.chevron({ style: { color: 'var(--up)' } })}
            </button>
          )}

          {/* authenticate card */}
          {item.grade && item.grade.company !== 'raw' && (
            <div style={{ padding: '0 0px', marginTop: 16 }}>
              <button onClick={() => app.nav.push('authcard', { id: item.id })} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                background: TL.surface, borderRadius: 4, textAlign: 'left',
                boxShadow: 'inset 0 0 0 1px var(--line)',
              }}>
                <svg width="20" height="20" viewBox="0 0 256 256" fill="none" style={{ flexShrink: 0, color: TL.accent }}><path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm80,32H48V56H208V200ZM64,96V80A16,16,0,0,1,80,64H96a8,8,0,0,1,0,16H80V96a8,8,0,0,1-16,0Zm144,64v16a16,16,0,0,1-16,16H176a8,8,0,0,1,0-16h16V160a8,8,0,0,1,16,0Z" fill="currentColor"/></svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TL.sans, fontWeight: 600, fontSize: 13, color: TL.ink }}>Authenticate this card</div>
                  <div style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted, marginTop: 1 }}>Get an official verification seal</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 256 256" fill="none" style={{ flexShrink: 0, color: TL.faint }}><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" fill="currentColor"/></svg>
              </button>
            </div>
          )}

          {/* similar */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: TL.sans, fontWeight: 800, fontSize: 17, marginBottom: 12 }}>Similar listings</div>
            <div className="noscroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -18px', padding: '0 18px' }}>
              {LISTINGS_L.filter(l => l.id !== item.id && l.game === item.game).slice(0,5).map(l => (
                <button key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} style={{ flexShrink: 0, width: 110, textAlign: 'left' }}>
                  <div style={{ background: TL.surface2, borderRadius: 12, padding: 10, display: 'flex', justifyContent: 'center' }}><CardArtL item={l} w={84} /></div>
                  <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 12.5, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13 }}>{moneyL(l.price)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* mock message thread after offer */}
          {offerSent && (
            <div style={{ marginTop: 26 }}>
              <div style={{ fontFamily: TL.sans, fontWeight: 800, fontSize: 17, marginBottom: 12 }}>Your offer</div>
              {/* buyer message */}
              <div style={{ background: TL.surface2, borderRadius: 4, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 14 }}>You offered {moneyL(offerSent.amount)}</span>
                  <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 11, color: '#b45309', background: '#fef3c7', borderRadius: 4, padding: '2px 8px' }}>Pending</span>
                </div>
                <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.muted }}>Sent just now</div>
              </div>
              {/* seller reply */}
              <div style={{ background: TL.surface, borderRadius: 4, padding: 14, marginBottom: 10, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 4, background: TL.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TL.sans, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{offerSent.seller[0]}</div>
                  <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 13 }}>{offerSent.seller}</span>
                  <span style={{ fontFamily: TL.sans, fontSize: 11, color: TL.muted, marginLeft: 'auto' }}>Just now</span>
                </div>
                <div style={{ fontFamily: TL.sans, fontSize: 13.5, color: TL.ink2, lineHeight: 1.45 }}>
                  Thanks for the offer! I can do {moneyL(Math.round(offerSent.amount * 1.05))} if you can cover postage?
                </div>
              </div>
              {/* reply input (mock) */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input readOnly placeholder="Reply..." style={{ flex: 1, padding: '12px 14px', borderRadius: 4, border: 'none', background: TL.surface2, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TL.sans, fontSize: 14, color: TL.ink, outline: 'none' }} />
                <button style={{ padding: '12px 16px', borderRadius: 4, background: TL.accent, color: '#fff', fontFamily: TL.sans, fontWeight: 700, fontSize: 13 }}>Send</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* sticky action bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, padding: '12px 16px 30px',
        background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)',
        display: 'flex', gap: 10, alignItems: 'center' }}>
        {item.accepts_offers && (
          <button onClick={() => setSheet('offer')} style={{ flex: 1, background: TL.surface, color: TL.ink, borderRadius: 4,
            padding: '15px 8px', fontFamily: TL.sans, fontWeight: 700, fontSize: 15, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Make offer</button>
        )}
        <button onClick={() => app.addToCart(item.id)} style={{ flex: 1.3, background: 'var(--fill)', color: '#fff', borderRadius: 4,
          padding: '15px 8px', fontFamily: TL.sans, fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {IconL.cart({width:16,height:16})} {app.cart.includes(item.id) ? 'In cart' : 'Add to cart'}
        </button>
      </div>

      {/* offer sheet */}
      <SheetL open={sheet==='offer'} onClose={() => setSheet(null)} title="Make an offer">
        <div style={{ fontFamily: TL.sans, fontSize: 13.5, color: TL.muted, marginBottom: 14 }}>Listed at {moneyL(item.price)} · market {moneyL(item.market)}. Sellers usually respond within a day.</div>
        <OfferInput value={offer} setValue={setOffer} placeholder={moneyL(item.price * 0.9, {cents:false})} />
        <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          {[0.85, 0.9, 0.95].map(m => (
            <ChipL key={m} onClick={() => setOffer(String(Math.round(item.price*m)))}>{moneyL(item.price*m,{cents:false})}</ChipL>
          ))}
        </div>
        <button onClick={() => { const amt = parseFloat(offer); setOfferSent({ amount: amt, seller: item.seller }); setSheet(null); setOffer(''); app.toast('Offer sent to ' + item.seller); }} style={{
          width: '100%', background: TL.accent, color: '#fff', borderRadius: 14, padding: 15, fontFamily: TL.sans, fontWeight: 700, fontSize: 16,
          opacity: offer ? 1 : 0.5 }} disabled={!offer}>Send offer</button>
      </SheetL>

    </div>
  );
}

function OfferInput({ value, setValue, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: TL.surface2, borderRadius: 14, padding: '14px 16px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <span style={{ fontFamily: TL.sans, fontWeight: 700, fontSize: 26, color: TL.muted, marginRight: 4 }}>£</span>
      <input autoFocus type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder.replace('£','')}
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TL.sans, fontWeight: 700, fontSize: 26, color: TL.ink, minWidth: 0 }} />
    </div>
  );
}

Object.assign(window, { ListingScreen, OfferInput, StatBox, InfoRow });
