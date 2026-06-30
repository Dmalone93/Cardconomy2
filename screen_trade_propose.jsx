// ─────────────────────────────────────────────────────────────
// Trade Propose — build swap + negotiation
// ─────────────────────────────────────────────────────────────
const { T: TP, money: moneyP, CardArt: CardArtP, Icon: IconP } = window;
const { byId: byIdP, traderById: traderByIdP, SHOPS: SHOPS_P } = window;

function TradePropose({ app, params = {} }) {
  const card = byIdP(params.cardId);
  const trader = traderByIdP(params.traderId);
  const [phase, setPhase] = React.useState('build'); // build | sent | meetup | confirmed
  const [selected, setSelected] = React.useState({});
  const [cash, setCash] = React.useState(0);
  const [showCash, setShowCash] = React.useState(false);
  const [stage, setStage] = React.useState('proposed'); // proposed | countered | accepted | declined
  const [place, setPlace] = React.useState(null);
  const [customSpot, setCustomSpot] = React.useState('');

  // simulate trader response after proposal
  React.useEffect(() => {
    if (phase === 'sent' && stage === 'proposed') {
      const t = setTimeout(() => setStage('accepted'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase, stage]);

  if (!card || !trader) {
    return (
      <div style={{ height: '100%', background: TP.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: TP.sans, color: TP.muted }}>Card or trader not found.</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 12, fontFamily: TP.sans, fontWeight: 700, color: 'var(--ink)' }}>{'\u2190'} Back</button>
      </div>
    );
  }

  const ownedIds = app.ownedIds();
  const tradeableFirst = [...ownedIds].sort((a, b) => {
    const aT = app.isOpenToTrade(a) ? 0 : 1;
    const bT = app.isOpenToTrade(b) ? 0 : 1;
    return aT - bT;
  });

  const selIds = Object.keys(selected).filter(k => selected[k]);
  const giveVal = selIds.reduce((s, id) => { const c = byIdP(id); return s + (c ? c.market || c.price : 0); }, 0);
  const getVal = card.market || card.price;
  const diff = getVal - giveVal - cash;
  const totalOffer = giveVal + cash;
  const fairPct = totalOffer + getVal === 0 ? 50 : Math.round((totalOffer / (totalOffer + getVal)) * 100);
  const suggestedCash = Math.max(0, Math.round(getVal - giveVal));

  function toggleCard(id) {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  }

  // ── BUILD PHASE ──
  if (phase === 'build') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => app.nav.pop()} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Propose a trade</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
          {/* card you want */}
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 700, color: 'var(--up)', letterSpacing: 0.5, marginBottom: 10 }}>CARD YOU WANT</div>
            <div style={{ display: 'flex', gap: 12, background: TP.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtP item={card} w={80} radius={8} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 15 }}>{card.name}</div>
                <div style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, marginTop: 2 }}>{card.subtitle}</div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15, marginTop: 6 }}>{moneyP(card.market || card.price)}</div>
                {/* trader info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: trader.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{trader.initial}</span>
                  <span style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{trader.name} \u00b7 {trader.deals} trades \u00b7 {trader.rating}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* your offer */}
          <div style={{ padding: '4px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 700, color: 'var(--ink)', letterSpacing: 0.5 }}>YOUR OFFER</div>
              <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>Tap cards to select</div>
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
              {tradeableFirst.map(id => {
                const c = byIdP(id);
                if (!c) return null;
                const isSel = !!selected[id];
                const isTradeable = app.isOpenToTrade(id);
                return (
                  <button key={id} onClick={() => toggleCard(id)} style={{ flexShrink: 0, width: 90, textAlign: 'left', position: 'relative' }}>
                    <div style={{ background: isSel ? 'var(--accent-wash)' : TP.surface2, borderRadius: 10, padding: 6, display: 'flex', justifyContent: 'center', position: 'relative',
                      border: isSel ? '2px solid var(--accent)' : '2px solid var(--line)' }}>
                      <CardArtP item={c} w={68} radius={6} />
                      <span style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isSel ? 'var(--accent)' : 'rgba(255,255,255,0.9)', color: isSel ? '#fff' : TP.muted,
                        fontSize: 13, fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        border: isSel ? 'none' : '1.5px solid var(--line)' }}>{isSel ? '\u2713' : '+'}</span>
                      {isTradeable && !isSel && (
                        <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontWeight: 700, fontFamily: TP.sans,
                          background: 'var(--accent-wash)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4 }}>Trade</span>
                      )}
                    </div>
                    <div style={{ fontFamily: TP.sans, fontWeight: 600, fontSize: 11, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 10.5, color: TP.muted }}>{moneyP(c.market || c.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* selected summary */}
          {selIds.length > 0 && (
            <div style={{ padding: '0 16px 12px' }}>
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted, marginBottom: 6 }}>
                  {selIds.length} card{selIds.length !== 1 ? 's' : ''} selected \u00b7 {moneyP(giveVal)}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => {
                    const c = byIdP(id);
                    return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={40} radius={4} /></div> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* cash top-up */}
          <div style={{ padding: '0 16px 12px' }}>
            {!showCash ? (
              <button onClick={() => setShowCash(true)} style={{ fontFamily: TP.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', padding: '8px 0' }}>
                + Add cash to balance the trade
              </button>
            ) : (
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted, marginBottom: 8 }}>Cash top-up</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: TP.sans, fontSize: 18, fontWeight: 700 }}>\u00a3</span>
                  <input type="number" value={cash || ''} onChange={e => setCash(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0" style={{ flex: 1, fontFamily: TP.sans, fontSize: 18, fontWeight: 700, color: TP.ink, background: 'transparent', border: 'none', outline: 'none' }} />
                  <button onClick={() => { setCash(0); setShowCash(false); }} style={{ fontFamily: TP.sans, fontSize: 12, color: TP.muted, fontWeight: 600 }}>Remove</button>
                </div>
                {diff > 5 && cash === 0 && (
                  <button onClick={() => setCash(suggestedCash)} style={{ marginTop: 8, fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                    Suggest \u00a3{suggestedCash} to even it out
                  </button>
                )}
              </div>
            )}
          </div>

          {/* fairness indicator */}
          {selIds.length > 0 && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ background: TP.surface, borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: TP.sans, fontSize: 12, fontWeight: 600, color: TP.muted }}>Trade balance</span>
                  {fairPct > 40 && fairPct < 60 ? (
                    <span style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 700, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 6, padding: '2px 8px' }}>Even trade</span>
                  ) : totalOffer > getVal ? (
                    <span style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 600, color: 'var(--down)' }}>You\u2019re overpaying by {moneyP(totalOffer - getVal)}</span>
                  ) : (
                    <span style={{ fontFamily: TP.sans, fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>Add {moneyP(getVal - totalOffer)} to even out</span>
                  )}
                </div>
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2, marginBottom: 8 }}>
                  <div style={{ height: '100%', borderRadius: 3, flex: totalOffer || 1, background: 'var(--ink)' }} />
                  <div style={{ height: '100%', borderRadius: 3, flex: getVal || 1, background: 'var(--up)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TP.sans, fontSize: 12 }}>
                  <span>Your offer: <b>{moneyP(totalOffer)}</b></span>
                  <span style={{ color: 'var(--up)' }}>Their card: <b>{moneyP(getVal)}</b></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TP.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('sent')} disabled={selIds.length === 0}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TP.sans, fontWeight: 700, fontSize: 16,
              background: selIds.length > 0 ? 'var(--ink)' : TP.surface2,
              color: selIds.length > 0 ? '#fff' : TP.muted }}>
            Send proposal {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ── SENT / NEGOTIATION PHASE ──
  if (phase === 'sent') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => app.nav.pop()} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Trade proposal</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '20px 16px 30px' }}>
          {/* status icon */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, margin: '0 auto',
              background: stage === 'accepted' ? 'var(--up-wash)' : stage === 'declined' ? 'var(--down-wash)' : 'var(--accent-wash)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 26 }}>{stage === 'accepted' ? '\u2713' : stage === 'declined' ? '\u2717' : '\u231B'}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 20, marginTop: 10 }}>
              {stage === 'proposed' ? 'Trade proposed!' : stage === 'accepted' ? 'Trade accepted!' : stage === 'countered' ? 'Counter offer received' : 'Trade declined'}
            </div>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginTop: 4 }}>
              {stage === 'proposed' ? 'Waiting for ' + trader.name + ' to respond\u2026' : stage === 'accepted' ? 'Both sides agreed. Now pick where to meet.' : stage === 'declined' ? trader.name + ' declined the trade.' : ''}
            </div>
          </div>

          {/* trade summary */}
          <div style={{ background: TP.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, letterSpacing: 0.3 }}>YOU GIVE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => { const c = byIdP(id); return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={44} radius={4} /></div> : null; })}
                </div>
                {cash > 0 && <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>+ \u00a3{cash} cash</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: TP.faint, fontSize: 18 }}>{'\u21C4'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6, letterSpacing: 0.3 }}>YOU GET</div>
                <div style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={card} w={44} radius={4} /></div>
              </div>
            </div>
          </div>

          {/* accepted → go to meetup */}
          {stage === 'accepted' && (
            <button onClick={() => setPhase('meetup')} style={{ width: '100%', marginTop: 16, padding: 16, borderRadius: 14,
              background: 'var(--ink)', color: '#fff', fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
              Arrange meetup {'\u2192'}
            </button>
          )}

          {stage === 'declined' && (
            <button onClick={() => app.nav.pop()} style={{ width: '100%', marginTop: 16, padding: 16, borderRadius: 14,
              background: TP.surface2, color: TP.ink, fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
              Back to browse
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── MEETUP PHASE ──
  if (phase === 'meetup') {
    const hubs = SHOPS_P.filter(s => s.tradeHub);
    const publicSpots = [
      { id: 'pub1', name: 'Central Library', sub: 'Public \u00b7 0.4 mi from you', kind: 'public', tint: '#6366f1', initial: 'L' },
      { id: 'pub2', name: 'Westgate Mall', sub: 'Public \u00b7 1.1 mi from you', kind: 'public', tint: '#0891b2', initial: 'W' },
      { id: 'pub3', name: 'Costa Coffee', sub: 'Public \u00b7 0.8 mi from you', kind: 'public', tint: '#b45309', initial: 'C' },
    ];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setPhase('sent')} style={{ color: TP.ink }}>{IconP.back({})}</button>
          <span style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Choose where to meet</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 120px' }}>
          {/* safety checklist */}
          <div style={{ background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--ink)' }}>Safe trade checklist</div>
            {['Meet at a local game shop if possible', 'Choose a public, well-lit area', 'Tell someone where you\u2019re going', 'Check both IDs before swapping'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: TP.sans, fontSize: 12, color: TP.ink2, marginTop: i ? 5 : 0 }}>
                <span style={{ color: 'var(--up)', fontSize: 13 }}>{'\u2713'}</span> {tip}
              </div>
            ))}
          </div>

          {/* LGS options */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Local game shops</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {hubs.map((shop, i) => {
              const selected = place && place.id === shop.id;
              return (
                <button key={shop.id} onClick={() => setPlace({ id: shop.id, name: shop.name, sub: shop.loc + ' \u00b7 ' + shop.dist + ' mi', kind: 'shop', tint: shop.tint, initial: shop.initial })}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, padding: '10px 12px',
                    background: selected ? 'var(--accent-wash)' : TP.surface,
                    boxShadow: selected ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: shop.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{shop.initial}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13.5 }}>{shop.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{shop.loc} \u00b7 {shop.dist} mi \u00b7 {shop.hours}</div>
                  </div>
                  {i === 0 && <span style={{ fontFamily: TP.sans, fontSize: 9, fontWeight: 700, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 6, padding: '2px 7px' }}>RECOMMENDED</span>}
                </button>
              );
            })}
          </div>

          {/* public spots */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Public meetup spots</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {publicSpots.map(spot => {
              const selected = place && place.id === spot.id;
              return (
                <button key={spot.id} onClick={() => setPlace(spot)}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, padding: '10px 12px',
                    background: selected ? 'var(--accent-wash)' : TP.surface,
                    boxShadow: selected ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: spot.tint, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{spot.initial}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13.5 }}>{spot.name}</div>
                    <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{spot.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* custom spot */}
          <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Suggest a spot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TP.surface, borderRadius: 12, padding: '10px 12px',
            boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <span style={{ color: TP.faint }}>{IconP.pin ? IconP.pin({ width: 18, height: 18 }) : '\uD83D\uDCCD'}</span>
            <input value={customSpot} onChange={e => { setCustomSpot(e.target.value); if (e.target.value) setPlace({ id: 'custom', name: e.target.value, sub: 'Custom location', kind: 'custom', tint: '#71717a', initial: e.target.value.charAt(0).toUpperCase() }); }}
              placeholder="Type a location\u2026" style={{ flex: 1, fontFamily: TP.sans, fontSize: 14, color: TP.ink, background: 'transparent', border: 'none', outline: 'none' }} />
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TP.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('confirmed')} disabled={!place}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TP.sans, fontWeight: 700, fontSize: 16,
              background: place ? 'var(--ink)' : TP.surface2,
              color: place ? '#fff' : TP.muted }}>
            {place ? 'Propose ' + place.name + ' \u2192' : 'Select a location'}
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRMED ──
  if (phase === 'confirmed') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TP.bg }}>
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '40px 16px 30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', background: 'var(--up-wash)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 30 }}>{'\u2713'}</span>
            </div>
            <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 22, marginTop: 12 }}>Trade locked in!</div>
            <div style={{ fontFamily: TP.sans, fontSize: 13, color: TP.muted, marginTop: 6 }}>
              Meet {trader.name} at {place ? place.name : 'the agreed spot'}
            </div>
          </div>

          {/* summary card */}
          <div style={{ background: TP.surface, borderRadius: 16, padding: 14, marginTop: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>YOU GIVE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selIds.map(id => { const c = byIdP(id); return c ? <div key={id} style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={c} w={44} radius={4} /></div> : null; })}
                </div>
                {cash > 0 && <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted, marginTop: 4 }}>+ \u00a3{cash} cash</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: TP.faint, fontSize: 18 }}>{'\u21C4'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TP.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6 }}>YOU GET</div>
                <div style={{ borderRadius: 6, overflow: 'hidden' }}><CardArtP item={card} w={44} radius={4} /></div>
              </div>
            </div>
          </div>

          {/* meetup details */}
          {place && (
            <div style={{ background: TP.surface, borderRadius: 16, padding: 14, marginTop: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Meetup location</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: place.tint, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{place.initial}</span>
                <div>
                  <div style={{ fontFamily: TP.sans, fontWeight: 700, fontSize: 14 }}>{place.name}</div>
                  <div style={{ fontFamily: TP.sans, fontSize: 11, color: TP.muted }}>{place.sub}</div>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => app.nav.setTab('home')} style={{ width: '100%', marginTop: 20, padding: 16, borderRadius: 14,
            background: 'var(--ink)', color: '#fff', fontFamily: TP.sans, fontWeight: 700, fontSize: 16 }}>
            Done
          </button>
          <button onClick={() => app.nav.pop()} style={{ width: '100%', marginTop: 8, padding: 14, borderRadius: 14,
            background: 'transparent', color: TP.ink, fontFamily: TP.sans, fontWeight: 600, fontSize: 14 }}>
            Back to trade marketplace
          </button>
        </div>
      </div>
    );
  }

  return null;
}

Object.assign(window, { TradePropose });
