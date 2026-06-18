// ─────────────────────────────────────────────────────────────
// Product detail — multi-seller view for raw cards
// ─────────────────────────────────────────────────────────────
const { T: TP, money: moneyP, CardArt: CardArtP, Sparkline: SparkP, Icon: IconP, Sheet: SheetP, Badge: BadgeP } = window;
const { productById: productByIdP, gameById: gameByIdP, setById: setByIdP, COND_SHORT: COND_SHORT_P, listingsBySeller: listingsBySellerP } = window;
const { demandForProduct: demandP, variantForProduct: variantP } = window;

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

function OfferCard({ offer, onBuy, onOffer, isLowest, onViewSeller }) {
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
          background: 'var(--fill)', color: '#fff', padding: '8px 14px', borderRadius: 4,
          fontFamily: TP.sans, fontWeight: 700, fontSize: 12 }}>Add to cart</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: TP.muted }}>
        <div style={{
          width: 28, height: 28, borderRadius: 999, background: TP.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{offer.seller.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <button onClick={onViewSeller} style={{ fontFamily: TP.sans, fontWeight: 600, color: TP.ink, background: 'none', padding: 0, textDecoration: 'underline' }}>{offer.seller}</button>
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
      {/* seller photos */}
      {offer.images > 0 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {Array.from({ length: offer.images }, (_, i) => (
            <div key={i} style={{
              width: 52, height: 52, borderRadius: 4, background: TP.surface2,
              boxShadow: 'inset 0 0 0 1px var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '100%', height: '100%',
                backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.03) 0 6px, transparent 6px 12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, opacity: 0.3 }}>📷</span>
              </div>
            </div>
          ))}
          <span style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, alignSelf: 'center', marginLeft: 2 }}>
            {offer.images} photo{offer.images !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      {offer.accepts_offers && (
        <button onClick={() => onOffer(offer)} style={{
          marginTop: offer.images > 0 ? 6 : 8, color: TP.accent, fontFamily: TP.sans, fontWeight: 600, fontSize: 12,
          background: 'none', padding: 0 }}>Make an offer</button>
      )}
      {onViewSeller && (
        <button onClick={onViewSeller} style={{
          marginTop: 8, color: '#2563eb', fontFamily: TP.sans, fontWeight: 600, fontSize: 11,
          background: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 3,
        }}>View all {listingsBySellerP(offer.seller).length} listings from this seller →</button>
      )}
    </div>
  );
}

function TradeOfferCard({ trade, isFirst, onPropose }) {
  return (
    <div style={{ border: isFirst ? '1.5px solid #7c3aed' : '1px solid var(--line)', borderRadius: 4, padding: 14, marginBottom: 10, background: TP.surface, position: 'relative' }}>
      {/* trader info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999, background: '#7c3aed', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{trade.trader.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 13, color: TP.ink }}>{trade.trader}</span>
          {trade.verified && (
            <span style={{ marginLeft: 5, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 4,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>Verified</span>
          )}
          <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 1 }}>
            {trade.traderRating}% · {trade.traderTrades.toLocaleString()} trades · {trade.traderLoc}
          </div>
        </div>
      </div>

      {/* wants in return */}
      <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>Wants in return</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#faf5ff', borderRadius: 4, padding: 10 }}>
        <div style={{ flexShrink: 0 }}>
          <CardArtP item={trade.wantCard} w={36} radius={3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, color: TP.ink }}>{trade.wantCard.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, marginTop: 1 }}>{trade.wantCard.subtitle}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: TP.muted, marginTop: 1 }}>
            Condition: {trade.wantCard.condition === 'Near Mint' ? 'NM+' : trade.wantCard.condition} · {trade.wantCard.gradePref}
          </div>
        </div>
      </div>

      {/* note */}
      {trade.note && (
        <div style={{ marginTop: 10, fontFamily: TP.sans, fontSize: 12, color: TP.ink2, fontStyle: 'italic', lineHeight: 1.4 }}>
          "{trade.note}"
        </div>
      )}

      {/* propose trade button */}
      <button onClick={onPropose} style={{
        width: '100%', marginTop: 12, background: 'none', border: '1.5px solid #7c3aed', color: '#7c3aed',
        padding: 10, borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 13,
      }}>Propose trade</button>
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
  const finishes = [{ key: 'standard', label: 'Standard', price: product.foil ? product.market * 0.6 : product.market },
    { key: 'foil', label: 'Foil', price: product.foil ? product.market : product.market * 1.8 }];
  const [finish, setFinish] = React.useState(product.foil ? 'foil' : 'standard');
  const [ptf, setPtf] = React.useState('30D');
  const [chartOpen, setChartOpen] = React.useState(false);
  const vInfo = variantP ? variantP(product) : null;
  const demand = demandP ? demandP(product) : null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 12px 10px', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: TP.surface, color: TP.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>{IconP.back({})}</button>
        <div style={{ flex: 1, fontFamily: TP.sans, fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Back</div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {/* hero card image */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#ffffff' }}>
          <CardArtP item={product} w={160} radius={4} />
        </div>

        {/* card info */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>{product.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 14, color: TP.muted, marginTop: 2 }}>
            {vInfo ? vInfo.current + ' \u00B7 ' : ''}{product.subtitle}{s ? ' \u00B7 ' + s.name : ''}{product.number ? ' \u00B7 ' + product.number : ''}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {g && <span style={{ background: g.tint + '1a', color: g.tint, padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>{g.short}</span>}
            {product.foil && <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>Foil</span>}
            {vInfo && <span style={{ background: TP.accentWash, color: TP.accent, padding: '3px 10px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>{vInfo.current}</span>}
          </div>

          {/* ── Finish tabs ── */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {finishes.map(f => (
              <div key={f.key} onClick={() => setFinish(f.key)} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                background: finish === f.key ? TP.accentWash : TP.surface2,
                border: finish === f.key ? '2px solid ' + TP.accent : '2px solid transparent',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: finish === f.key ? TP.accent : TP.muted }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TP.ink, marginTop: 2 }}>
                  {moneyP(f.price)}
                </div>
              </div>
            ))}
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

        {/* ── Price chart (collapsible) ── */}
        {product.history && (
          <div style={{ margin: '0 16px 12px' }}>
            <div onClick={() => setChartOpen(!chartOpen)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TP.ink }}>Price History</div>
              <span style={{ fontSize: 12, color: TP.muted, fontWeight: 600 }}>
                {chartOpen ? 'Hide' : 'Show chart'}
              </span>
            </div>
            {chartOpen && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  {['7D', '30D', '90D', '1Y'].map(t => (
                    <div key={t} onClick={() => setPtf(t)} style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      background: ptf === t ? TP.accent : TP.surface2,
                      color: ptf === t ? '#fff' : TP.muted,
                    }}>{t}</div>
                  ))}
                </div>
                {(() => {
                  const sliceLen = { '7D': 3, '30D': 6, '90D': 9, '1Y': 12 }[ptf] || 6;
                  const hist = product.history.slice(-sliceLen);
                  const up2 = hist[hist.length - 1] >= hist[0];
                  return <SparkP data={hist} w={320} h={120} up={up2} fill dots />;
                })()}
              </div>
            )}
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

        {/* ── Demand indicator (compact) ── */}
        {demand && (
          <div style={{ margin: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', background: TP.surface, borderRadius: 10,
            border: '1px solid ' + (demand.hot ? 'var(--gold)' : TP.line) }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14 }}>
                {demand.wants} buyers want this
                {demand.hot && <span style={{ marginLeft: 6, background: 'var(--gold)', color: '#fff',
                  padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>HOT</span>}
              </div>
              <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 2 }}>
                {demand.localWants} near {demand.loc} · {demand.listed} listed
              </div>
            </div>
            <div style={{ width: 50, height: 50, borderRadius: 999, position: 'relative',
              background: `conic-gradient(${demand.hot ? 'var(--gold)' : 'var(--accent)'} ${Math.round(demand.wants / (demand.wants + demand.listed) * 360)}deg, ${TP.line} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: TP.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: TP.sans, fontWeight: 700, fontSize: 12, color: TP.ink }}>
                {Math.round(demand.wants / (demand.wants + demand.listed) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* ── Same Code / Variants section ── */}
        {vInfo && vInfo.total > 1 && (
          <div style={{ padding: '0 16px', marginBottom: 16 }}>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 12, color: TP.accent,
              letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
              Same Code · {product.number}
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginBottom: 10, lineHeight: 1.5 }}>
              {vInfo.total} printings share this number. Not the same card.
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {vInfo.all.map((v, i) => {
                const isCurrent = v.variant === vInfo.current;
                return (
                  <div key={i} style={{
                    flexShrink: 0, width: 110, cursor: 'pointer',
                    borderRadius: 12, overflow: 'hidden',
                    background: isCurrent ? TP.accentWash : TP.surface,
                    border: isCurrent ? '2px solid ' + TP.accent : '1px solid ' + TP.line,
                  }}>
                    {/* card art thumbnail */}
                    <div style={{ height: 90, background: v.art || '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
                      <CardArtP item={{ ...product, art: v.art }} w={110} radius={0} />
                      {isCurrent && (
                        <div style={{ position: 'absolute', bottom: 4, left: 4, background: TP.accent,
                          color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>
                          Current
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? TP.accent : TP.ink,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.variant}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TP.ink, marginTop: 2 }}>{moneyP(v.price)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              onViewSeller={() => app.nav.push('seller', { name: o.seller })}
              onBuy={(offer) => {
                const lid = offer.listingId || (product.offers.find(o => o.listingId) || {}).listingId;
                if (lid) {
                  app.addToCart(lid);
                } else {
                  app.toast('This listing is not available for purchase yet');
                }
              }}
              onOffer={(offer) => { setOfferSheet(offer); setOfferVal(''); }}
            />
          ))}
        </div>

        {/* trade offers */}
        {product.tradeOffers && product.tradeOffers.length > 0 && (
          <div style={{ padding: '0 16px', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>Available to trade</div>
              <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 4, fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>{product.tradeCount} trader{product.tradeCount !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, marginBottom: 12, lineHeight: 1.4 }}>
              These collectors have this card and want to swap — no cash needed.
            </div>
            {product.tradeOffers.map((t, idx) => (
              <TradeOfferCard key={t.id} trade={t} isFirst={idx === 0}
                onPropose={() => app.nav.push('trade')}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sticky bottom bar ── */}
      <div style={{ flexShrink: 0, background: TP.surface, borderTop: '1px solid ' + TP.line, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, fontWeight: 600, color: TP.muted, textTransform: 'uppercase' }}>FROM</div>
          <div style={{ fontFamily: TP.sans, fontWeight: 800, fontSize: 20, color: TP.ink }}>{moneyP(product.low)}</div>
        </div>
        <button onClick={() => {
          app.toast({ title: 'Added to your wants', subtitle: product.name });
        }} style={{
          flex: 1, padding: '13px 16px', borderRadius: 10, border: 'none',
          background: 'var(--gold)', color: '#fff', fontFamily: TP.sans, fontWeight: 700,
          fontSize: 15, cursor: 'pointer',
        }}>Add to my wants</button>
      </div>

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
