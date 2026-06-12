// ─────────────────────────────────────────────────────────────
// Product detail — multi-seller view for raw cards
// ─────────────────────────────────────────────────────────────
const { T: TP, money: moneyP, CardArt: CardArtP, Sparkline: SparkP, Icon: IconP, Sheet: SheetP, Badge: BadgeP } = window;
const { productById: productByIdP, gameById: gameByIdP, setById: setByIdP, COND_SHORT: COND_SHORT_P } = window;

function CondBadge({ condition }) {
  const colors = {
    'Near Mint': { bg: '#f0fdf4', fg: '#16a34a' },
    'Lightly Played': { bg: '#fffbeb', fg: '#d97706' },
    'Moderately Played': { bg: '#fff7ed', fg: '#ea580c' },
    'Heavily Played': { bg: '#fef2f2', fg: '#dc2626' },
  };
  const SHORT = { 'Near Mint': 'NM', 'Lightly Played': 'LP', 'Moderately Played': 'MP', 'Heavily Played': 'HP' };
  const short = SHORT[condition] || condition;
  const c = colors[condition] || { bg: '#f0f0f0', fg: '#666' };
  return (
    <span style={{ background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: TP.sans }}>{short}</span>
  );
}

function OfferCard({ offer, onBuy, onOffer, isLowest }) {
  return (
    <div style={{ border: isLowest ? '1.5px solid var(--accent)' : '1px solid var(--line)', borderRadius: 4, padding: 14, marginBottom: 10, background: TP.surface, position: 'relative' }}>
      {isLowest && (
        <span style={{ position: 'absolute', top: -9, left: 12, background: 'var(--accent)', color: '#fff',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 4, letterSpacing: 0.3 }}>Best price</span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(offer.price)}</span>
          <CondBadge condition={offer.condition} />
        </div>
        <button onClick={() => onBuy(offer)} style={{
          background: 'var(--fill)', color: '#fff', padding: '8px 18px', borderRadius: 4,
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13 }}>Buy</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: TP.muted }}>
        <div style={{
          width: 28, height: 28, borderRadius: 999, background: TP.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{offer.seller.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, color: TP.ink }}>{offer.seller}</span>
          {offer.sellerRating >= 99 && (
            <span style={{ marginLeft: 5, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 4,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>Trusted</span>
          )}
          <span style={{ marginLeft: 6 }}>{offer.sellerRating}% · {offer.sellerSales.toLocaleString()} sales</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: TP.muted, fontFamily: TP.sans }}>
        <span>{offer.shipping === 0 ? '✓ Free shipping' : moneyP(offer.shipping) + ' shipping'}</span>
        <span>Ships {offer.ships}</span>
      </div>
      {offer.accepts_offers && (
        <button onClick={() => onOffer(offer)} style={{
          marginTop: 8, color: TP.accent, fontFamily: TP.sans, fontWeight: 600, fontSize: 12,
          background: 'none', padding: 0 }}>Make an offer</button>
      )}
    </div>
  );
}

function ProductScreen({ app, params }) {
  const product = productByIdP(params.id);
  const [offerSheet, setOfferSheet] = React.useState(null);
  const [offerVal, setOfferVal] = React.useState('');
  if (!product) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>Product not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TP.accent, fontFamily: TP.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const g = gameByIdP(product.game);
  const s = setByIdP(product.set);
  const hist = product.history || [product.market, product.low];
  const up = hist.length >= 2 ? hist[hist.length - 1] >= hist[0] : true;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TP.surface, color: TP.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconP.back({})}</button>
        <div style={{ flex: 1, fontFamily: TP.sans, fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 40 }}>
        {/* hero card image */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#ffffff' }}>
          <CardArtP item={product} w={160} radius={4} />
        </div>

        {/* card info */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>{product.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 14, color: TP.muted, marginTop: 2 }}>
            {product.subtitle}{s ? ' · ' + s.name : ''}{product.number ? ' · ' + product.number : ''}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {g && <span style={{ background: g.tint + '1a', color: g.tint, padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>{g.short}</span>}
            {product.foil && <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>Foil</span>}
          </div>
        </div>

        {/* price stats */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 16px' }}>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>Market</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(product.market)}</div>
          </div>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>Low</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18, color: 'var(--up)' }}>{moneyP(product.low)}</div>
          </div>
          <div style={{ flex: 1, background: TP.surface, borderRadius: 4, padding: '10px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, fontWeight: 600 }}>High</div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>{moneyP(product.high)}</div>
          </div>
        </div>

        {/* price chart */}
        {product.history && (
          <div style={{ padding: '0 16px 16px' }}>
            <SparkP data={product.history} w={320} h={48} up={up} />
            <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>30-day price trend</div>
          </div>
        )}

        {/* buyer protection banner */}
        <div style={{ margin: '0 16px 16px', padding: '12px 14px', background: TP.surface2, borderRadius: 4, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, color: 'var(--accent)' }}>{IconP.shield ? IconP.shield({ width: 20, height: 20 }) : '🛡️'}</span>
          <div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13 }}>Buyer Protection</div>
            <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, lineHeight: 1.4, marginTop: 2 }}>Every purchase is covered. If the card doesn't match the listing, get a full refund.</div>
          </div>
        </div>

        {/* seller offers */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            Available from {product.offerCount} seller{product.offerCount !== 1 ? 's' : ''}
          </div>
          <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, marginBottom: 12, lineHeight: 1.4 }}>
            Orders from the same seller ship together — saving you on postage.
          </div>
          {product.offers.map((o, idx) => (
            <OfferCard key={o.id} offer={o} isLowest={idx === 0}
              onBuy={(offer) => app.nav.push('checkout', { id: offer.listingId || offer.id })}
              onOffer={(offer) => { setOfferSheet(offer); setOfferVal(''); }}
            />
          ))}
        </div>
      </div>

      {/* offer sheet */}
      <SheetP open={!!offerSheet} onClose={() => setOfferSheet(null)} title={offerSheet ? 'Offer to ' + offerSheet.seller : ''}>
        {offerSheet && (
          <div style={{ padding: '8px 0 20px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginBottom: 12 }}>
              Listed at {moneyP(offerSheet.price)} · {offerSheet.condition}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: TP.surface2, borderRadius: 4, padding: '12px 14px' }}>
              <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 22, color: TP.muted }}>£</span>
              <input value={offerVal} onChange={e => setOfferVal(e.target.value)} placeholder="0.00" type="number"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TP.sans, fontWeight: 700, fontSize: 22, color: TP.ink, minWidth: 0 }} />
            </div>
            <button onClick={() => { app.toast('Offer sent to ' + offerSheet.seller); setOfferSheet(null); }} style={{
              width: '100%', marginTop: 16, background: 'var(--fill)', color: '#fff', borderRadius: 4, padding: 14,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 15, opacity: offerVal ? 1 : 0.5 }} disabled={!offerVal}>Send offer</button>
          </div>
        )}
      </SheetP>
    </div>
  );
}

Object.assign(window, { ProductScreen });
