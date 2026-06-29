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
    <span style={{ background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: TP.sans }}>{short}</span>
  );
}

function OfferCard({ offer, onBuy, isLowest, onViewListing }) {
  return (
    <div style={{ border: isLowest ? '2px solid var(--ink)' : '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 12, background: 'var(--surface)', position: 'relative', boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
      {isLowest && (
        <span style={{ position: 'absolute', top: -9, left: 12, background: 'var(--ink)', color: '#fff',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 10, padding: '2px 10px', borderRadius: 6, letterSpacing: 0.3 }}>Best price</span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 18 }}>{moneyP(offer.price)}</span>
          <CondBadge condition={offer.condition} />
        </div>
        <button onClick={() => onBuy(offer)} style={{
          background: 'var(--ink)', color: '#fff', padding: '9px 16px', borderRadius: 10,
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13 }}>Add to cart</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted)' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 10, background: 'var(--ink)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{offer.seller.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, color: 'var(--ink)' }}>{offer.seller}</span>
          {offer.sellerRating >= 99 && window.TrustBadge && <span style={{ marginLeft: 5 }}><window.TrustBadge tier={2} /></span>}
          <span style={{ marginLeft: 6 }}>{offer.sellerRating}% · {offer.sellerSales.toLocaleString()} sales</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--muted)', fontFamily: TP.sans }}>
        <span>{offer.shipping === 0 ? '\u2713 Free shipping' : moneyP(offer.shipping) + ' shipping'}</span>
        <span>Ships {offer.ships}</span>
      </div>
      {onViewListing && (
        <button onClick={onViewListing} style={{
          width: '100%', marginTop: 12, padding: '10px 14px', borderRadius: 10,
          background: 'transparent', border: '1.5px solid var(--line)',
          fontFamily: TP.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>View full listing \u2192</button>
      )}
    </div>
  );
}

function TradeOfferCard({ trade, isFirst, onPropose }) {
  return (
    <div style={{ border: isFirst ? '2px solid var(--ink)' : '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 12, background: 'var(--surface)', position: 'relative', boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
      {/* trader info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 999, background: 'var(--ink)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TP.sans, fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{trade.trader.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{trade.trader}</span>
          {trade.verified && (
            <span style={{ marginLeft: 5, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 5,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>Verified</span>
          )}
          <div style={{ fontFamily: TP.sans, fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
            {trade.traderRating}% · {trade.traderTrades.toLocaleString()} trades · {trade.traderLoc}
          </div>
        </div>
      </div>

      {/* wants in return */}
      <div style={{ fontFamily: TP.sans, fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>Wants in return</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', borderRadius: 10, padding: 10 }}>
        <div style={{ flexShrink: 0 }}>
          <CardArtP item={trade.wantCard} w={36} radius={5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{trade.wantCard.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{trade.wantCard.subtitle}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
            Condition: {trade.wantCard.condition === 'Near Mint' ? 'NM+' : trade.wantCard.condition} · {trade.wantCard.gradePref}
          </div>
        </div>
      </div>

      {/* note */}
      {trade.note && (
        <div style={{ marginTop: 10, fontFamily: TP.sans, fontSize: 12.5, color: 'var(--ink-2)', fontStyle: 'italic', lineHeight: 1.4 }}>
          "{trade.note}"
        </div>
      )}

      {/* propose trade button */}
      <button onClick={onPropose} style={{
        width: '100%', marginTop: 12, background: 'var(--ink)', color: '#fff', border: 'none',
        padding: 11, borderRadius: 10, fontFamily: TP.sans, fontWeight: 700, fontSize: 13.5,
      }}>Propose trade</button>
    </div>
  );
}

function ProductScreen({ app, params }) {
  const product = productByIdP(params.id);
  const [offerSheet, setOfferSheet] = React.useState(null);
  const [offerVal, setOfferVal] = React.useState('');
  const [showTop, setShowTop] = React.useState(false);
  const scrollRefP = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRefP.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  if (!product) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 12, color: 'var(--muted)' }}>{IconP.search({ width: 40, height: 40 })}</div>
        <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 18 }}>Product not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: 'var(--ink)', fontFamily: TP.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const g = gameByIdP(product.game);
  const s = setByIdP(product.set);
  const hist = product.history || [product.market, product.low];
  const up = hist.length >= 2 ? hist[hist.length - 1] >= hist[0] : true;
  const [ptf, setPtf] = React.useState('30D');
  const [chartOpen, setChartOpen] = React.useState(true);
  const vInfo = variantP ? variantP(product) : null;
  const demand = demandP ? demandP(product) : null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', animation: 'ccPushIn 0.26s ease' }}>

      <div ref={scrollRefP} className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {/* ── 1. Card image ── */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 20px', background: 'var(--surface)' }}>
          <CardArtP item={product} w={200} radius={0} />
        </div>

        {/* ── 2. Name + subtitle ── */}
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 22, letterSpacing: -0.4 }}>{product.name}</div>
          <div style={{ fontFamily: TP.sans, fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            {product.subtitle}{s ? ' \u00B7 ' + s.name : ''}{product.number ? ' \u00B7 ' + product.number : ''}
          </div>
        </div>

        {/* ── 3. Condition filter pills ── */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {['All', 'NM', 'LP', 'MP', 'HP', 'PSA 10', 'PSA 9', 'BGS'].map(c => (
            <div key={c} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              background: c === 'All' ? 'var(--ink)' : 'var(--surface)',
              color: c === 'All' ? '#fff' : 'var(--ink)',
              border: c === 'All' ? 'none' : '1px solid var(--line)',
            }}>{c}</div>
          ))}
        </div>

        {/* ── 4. Price ── */}
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 28, color: 'var(--ink)' }}>{moneyP(product.low)}~</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {g && <span style={{ background: g.tint + '1a', color: g.tint, padding: '2px 8px', borderRadius: 6, fontFamily: TP.sans, fontWeight: 700, fontSize: 11 }}>{g.short}</span>}
            {product.foil && <span style={{ background: 'var(--surface)', color: 'var(--ink)', padding: '2px 8px', borderRadius: 6, fontFamily: TP.sans, fontWeight: 700, fontSize: 11, border: '1px solid var(--line)' }}>Foil</span>}
            {vInfo && <span style={{ background: 'var(--surface)', color: 'var(--ink)', padding: '2px 8px', borderRadius: 6, fontFamily: TP.sans, fontWeight: 700, fontSize: 11, border: '1px solid var(--line)' }}>{vInfo.current}</span>}
          </div>
        </div>


        {/* ── 6. Seller offers ── */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
            Listed items
          </div>
          {product.offers.map((o, idx) => (
            <OfferCard key={o.id} offer={o} isLowest={idx === 0}
              onViewListing={() => {
                const lid = o.listingId || (product.offers.find(x => x.listingId) || {}).listingId;
                if (lid) app.nav.push('listing', { id: lid });
              }}
              onBuy={(offer) => {
                const lid = offer.listingId || (product.offers.find(o => o.listingId) || {}).listingId;
                if (lid) {
                  app.addToCart(lid);
                } else {
                  app.toast('This listing is not available for purchase yet');
                }
              }}
            />
          ))}
        </div>

        {/* trade offers */}
        {product.tradeOffers && product.tradeOffers.length > 0 && (
          <div style={{ padding: '0 16px', marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{'\u21C4'}</span>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>Available to trade</div>
              <span style={{ background: 'var(--surface)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 6, fontFamily: TP.sans, fontWeight: 700, fontSize: 10 }}>{product.tradeCount} trader{product.tradeCount !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.4 }}>
              These collectors have this card and want to swap — no cash needed.
            </div>
            {product.tradeOffers.map((t, idx) => (
              <TradeOfferCard key={t.id} trade={t} isFirst={idx === 0}
                onPropose={() => app.nav.push('trade')}
              />
            ))}
          </div>
        )}

        {/* ── Secondary: demand, variants, price data ── */}
        <div style={{ borderTop: '1px solid var(--line)', marginTop: 24, paddingTop: 16 }}>

          {/* demand */}
          {demand && (
            <div style={{ margin: '0 16px 16px', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', background: 'var(--surface)', borderRadius: 14,
              border: '1px solid ' + (demand.hot ? 'var(--gold)' : 'var(--line)'), boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14 }}>
                  {demand.wants} buyers want this
                  {demand.hot && <span style={{ marginLeft: 6, background: 'var(--gold)', color: '#fff',
                    padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>HOT</span>}
                </div>
                <div style={{ fontFamily: TP.sans, fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {demand.localWants} near {demand.loc} · {demand.listed} listed
                </div>
              </div>
            </div>
          )}

          {/* variants */}
          {vInfo && vInfo.total > 1 && (
            <div style={{ padding: '0 16px', marginBottom: 16 }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 12, color: 'var(--ink)',
                letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                Same Code · {product.number}
              </div>
              <div style={{ fontFamily: TP.sans, fontSize: 13, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
                {vInfo.total} printings share this number. Not the same card.
              </div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
                {vInfo.all.map((v, i) => {
                  const isCurrent = v.variant === vInfo.current;
                  return (
                    <div key={i} style={{ flexShrink: 0, width: 110, cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
                      background: isCurrent ? 'var(--surface)' : 'var(--surface)',
                      border: isCurrent ? '2px solid var(--ink)' : '1px solid var(--line)',
                      boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
                      <div style={{ height: 90, background: v.art || '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
                        <CardArtP item={{ ...product, art: v.art }} w={110} radius={0} />
                        {isCurrent && <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--ink)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 6, padding: '2px 6px' }}>Current</div>}
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.variant}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{moneyP(v.price)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* price stats + chart */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[['Market', product.market, null], ['Low', product.low, 'var(--up)'], ['High', product.high, null]].map(([label, val, color]) => (
                <div key={label} style={{ flex: 1, background: 'var(--surface)', borderRadius: 12, padding: '10px 12px', boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
                  <div style={{ fontFamily: TP.sans, fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: color || 'var(--ink)' }}>{moneyP(val)}</div>
                </div>
              ))}
            </div>
            {product.history && (
              <div onClick={() => setChartOpen(!chartOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Price History</div>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{chartOpen ? 'Hide' : 'Show chart'}</span>
              </div>
            )}
            {chartOpen && product.history && (() => {
              const sliceLen = { '7D': 3, '30D': 6, '90D': 9, '1Y': 12 }[ptf] || 6;
              const h2 = product.history.slice(-sliceLen);
              const up2 = h2[h2.length - 1] >= h2[0];
              return (
                <div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {['7D', '30D', '90D', '1Y'].map(t => (
                      <div key={t} onClick={() => setPtf(t)} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        background: ptf === t ? 'var(--ink)' : 'var(--surface)', color: ptf === t ? '#fff' : 'var(--muted)' }}>{t}</div>
                    ))}
                  </div>
                  <SparkP data={h2} w={320} h={100} up={up2} fill dots />
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar ── */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -2px 10px rgba(20,24,40,0.06)' }}>
        <div>
          <div style={{ fontFamily: TP.sans, fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>FROM</div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20, color: 'var(--ink)' }}>{moneyP(product.low)}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
          <button onClick={() => {
            const cheapest = product.offers && product.offers[0];
            const lid = cheapest && cheapest.listingId;
            if (lid) {
              app.addToCart(lid);
              app.toast({ title: 'Added to cart', subtitle: product.name });
            } else {
              app.toast('No listings available right now');
            }
          }} style={{
            padding: '13px 16px', borderRadius: 12, border: 'none',
            background: 'var(--ink)', color: '#fff', fontFamily: TP.sans, fontWeight: 700,
            fontSize: 15, cursor: 'pointer',
          }}>Buy now</button>
          <button onClick={() => {
            app.toast({ title: 'Added to want list', subtitle: product.name });
          }} style={{
            background: 'none', border: '1.5px solid var(--line)', borderRadius: 12, padding: '10px 16px', cursor: 'pointer',
            fontFamily: TP.sans, fontWeight: 700, fontSize: 14, color: 'var(--ink)',
            textAlign: 'center',
          }}>Add to want list</button>
        </div>
      </div>

      {/* back to top */}
      <button onClick={() => scrollRefP.current && scrollRefP.current.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'fixed', bottom: 80, right: 16, width: 40, height: 40, borderRadius: 999,
          background: 'var(--ink)', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center',
          justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 40,
          opacity: showTop ? 1 : 0, pointerEvents: showTop ? 'auto' : 'none',
          transition: 'opacity 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        aria-label="Back to top">{'\u2191'}</button>

      <SheetP open={!!offerSheet} onClose={() => setOfferSheet(null)} title={offerSheet ? 'Offer to ' + offerSheet.seller : ''}>
        {offerSheet && (
          <div style={{ padding: '8px 0 20px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
              Listed at {moneyP(offerSheet.price)} · {offerSheet.condition}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', borderRadius: 10, padding: '12px 14px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, color: 'var(--muted)' }}>\u00A3</span>
              <input value={offerVal} onChange={e => setOfferVal(e.target.value)} placeholder="0.00" type="number"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', minWidth: 0 }} />
            </div>
            <button onClick={() => { app.toast('Offer sent to ' + offerSheet.seller); setOfferSheet(null); }} style={{
              width: '100%', marginTop: 16, background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: 14,
              fontFamily: TP.sans, fontWeight: 700, fontSize: 15, opacity: offerVal ? 1 : 0.5 }} disabled={!offerVal}>Send offer</button>
          </div>
        )}
      </SheetP>
    </div>
  );
}

Object.assign(window, { ProductScreen });
