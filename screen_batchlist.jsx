// ─────────────────────────────────────────────────────────────
// Batch List — list multiple cards at once
// ─────────────────────────────────────────────────────────────
const { T: TBL, money: moneyBL, CardArt: CardArtBL, Icon: IconBL } = window;
const { byId: byIdBL, setById: setByIdBL } = window;
const { ToggleSwitch: ToggleSwitchBL } = window;

const CONDITIONS_BL = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];

const STRATEGIES_BL = [
  { id: 'market', label: 'At market', pct: 1.00, desc: 'List at 100% market price' },
  { id: 'undercut', label: 'Undercut', pct: 0.95, desc: '95% \u2014 competitive pricing' },
  { id: 'quick', label: 'Quick sale', pct: 0.90, desc: '90% \u2014 sell faster' },
];

function BatchListScreen({ app, params }) {
  const ids = params.ids || [];
  const [strategy, setStrategy] = React.useState('market');
  const [cards, setCards] = React.useState(() => {
    return ids.map(id => {
      const item = byIdBL(id);
      if (!item) return null;
      const market = item.market || item.price || 0;
      return {
        id,
        item,
        market,
        price: +(market * 1.00).toFixed(2),
        condition: 'Near Mint',
        custom: false,
      };
    }).filter(Boolean);
  });
  const [freeShip, setFreeShip] = React.useState(true);
  const [acceptOffers, setAcceptOffers] = React.useState(true);
  const [condSheetOpen, setCondSheetOpen] = React.useState(false);
  const [cardCondIdx, setCardCondIdx] = React.useState(null); // index of card whose condition is being edited
  const [done, setDone] = React.useState(false);
  const [priceTransition, setPriceTransition] = React.useState(false);

  const currentPct = STRATEGIES_BL.find(s => s.id === strategy)?.pct || 1;

  function applyStrategy(stratId) {
    const pct = STRATEGIES_BL.find(s => s.id === stratId)?.pct || 1;
    setStrategy(stratId);
    setPriceTransition(true);
    setCards(prev => prev.map(c => c.custom ? c : { ...c, price: +(c.market * pct).toFixed(2) }));
    setTimeout(() => setPriceTransition(false), 300);
  }

  function updateCardPrice(idx, val) {
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, price: val, custom: true } : c));
  }

  function updateCardCondition(idx, cond) {
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, condition: cond } : c));
  }

  function setAllCondition(cond) {
    setCards(prev => prev.map(c => ({ ...c, condition: cond })));
    setCondSheetOpen(false);
  }

  const total = cards.reduce((s, c) => s + (c.price || 0), 0);
  const fees = cards.reduce((s, c) => s + ((c.price || 0) * 0.06 + 0.30), 0);
  const payout = total - fees;

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: TBL.bg, padding: 32, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 20, animation: 'ccPop 0.4s ease' }}>
          {IconBL.check({ width: 44, height: 44 })}
        </div>
        <h2 style={{ margin: 0, fontFamily: TBL.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>
          {cards.length} card{cards.length !== 1 ? 's are' : ' is'} now live!
        </h2>
        <p style={{ fontFamily: TBL.sans, fontSize: 14.5, color: TBL.muted, lineHeight: 1.5, marginTop: 10, maxWidth: 280 }}>
          {"We\u2019ll notify you when they sell or receive offers."}
        </p>
        <p style={{ fontFamily: TBL.sans, fontSize: 13, color: TBL.muted, marginTop: 6 }}>
          Total listing value: {moneyBL(total)}
        </p>
        <button onClick={() => { app.nav.push('selling'); }} style={{ marginTop: 26, background: 'var(--ink)', color: '#fff', borderRadius: 13, padding: '14px 28px',
          fontFamily: TBL.sans, fontWeight: 700, fontSize: 16 }}>View your listings</button>
        <button onClick={() => { app.nav.pop(); app.nav.pop(); }} style={{ marginTop: 10, color: TBL.muted, fontFamily: TBL.sans, fontWeight: 600, fontSize: 14 }}>List more</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TBL.bg }}>
      {/* header */}
      <div style={{ padding: '14px 14px 12px', background: TBL.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TBL.ink }}>{IconBL.back({})}</button>
        <span style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 18, flex: 1 }}>List {cards.length} card{cards.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 180px' }}>

        {/* pricing strategy */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TBL.muted, textTransform: 'uppercase', marginBottom: 8 }}>Pricing strategy</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STRATEGIES_BL.map(s => {
              const active = strategy === s.id;
              return (
                <button key={s.id} onClick={() => applyStrategy(s.id)} style={{
                  flex: 1, background: active ? 'var(--ink)' : TBL.surface, color: active ? '#fff' : TBL.ink,
                  borderRadius: 12, padding: '12px 8px', textAlign: 'center',
                  border: active ? 'none' : '1px solid var(--line)',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(20,24,40,0.05)',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontFamily: TBL.sans, fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                  <div style={{ fontFamily: TBL.sans, fontSize: 11, opacity: 0.7, marginTop: 3 }}>{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* card list */}
        <div style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TBL.muted, textTransform: 'uppercase', marginBottom: 8 }}>Cards</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {cards.map((c, idx) => {
            const setName = setByIdBL(c.item.set)?.name?.replace(/\s*\(.*\)/, '') || '';
            return (
              <div key={c.id} style={{ background: 'var(--surface)', borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ background: TBL.surface2, borderRadius: 9, padding: 5 }}>
                    <CardArtBL item={c.item} w={44} radius={6} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TBL.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.item.name}</div>
                    <div style={{ fontFamily: TBL.sans, fontSize: 11.5, color: TBL.muted }}>{setName}</div>
                    <div style={{ fontFamily: TBL.sans, fontSize: 11, color: TBL.faint, marginTop: 2 }}>Market: {moneyBL(c.market)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {/* price input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontFamily: TBL.sans, fontWeight: 700, fontSize: 16, color: TBL.ink }}>{'\u00A3'}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={c.price || ''}
                        onChange={(e) => updateCardPrice(idx, parseFloat(e.target.value) || 0)}
                        style={{
                          width: 72, padding: '7px 8px', borderRadius: 8,
                          border: '1px solid var(--line)', background: TBL.surface2, color: TBL.ink,
                          fontFamily: TBL.sans, fontSize: 15, fontWeight: 700, textAlign: 'right',
                          transition: priceTransition ? 'background 0.3s' : 'none',
                        }}
                      />
                    </div>
                    {c.custom && (
                      <span style={{ fontFamily: TBL.sans, fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: 0.3 }}>CUSTOM</span>
                    )}
                    {/* condition pill */}
                    <button onClick={() => setCardCondIdx(idx)} style={{
                      background: TBL.surface2, borderRadius: 999, padding: '3px 10px',
                      fontFamily: TBL.sans, fontSize: 11, fontWeight: 600, color: TBL.ink,
                      border: '1px solid var(--line)',
                    }}>
                      {c.condition}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* batch controls */}
        <div style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TBL.muted, textTransform: 'uppercase', marginBottom: 8 }}>Batch settings</div>
        <div style={{ background: TBL.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <button onClick={() => setCondSheetOpen(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 16px', borderBottom: '1px solid var(--line-2)', textAlign: 'left',
          }}>
            <span style={{ fontFamily: TBL.sans, fontWeight: 600, fontSize: 15 }}>Condition for all</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: TBL.sans, fontSize: 13, color: TBL.muted }}>Set condition</span>
              {IconBL.chevron({ style: { color: TBL.faint } })}
            </div>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px', borderBottom: '1px solid var(--line-2)' }}>
            <span style={{ fontFamily: TBL.sans, fontWeight: 600, fontSize: 15 }}>Free shipping</span>
            <ToggleSwitchBL on={freeShip} onClick={() => setFreeShip(!freeShip)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px' }}>
            <span style={{ fontFamily: TBL.sans, fontWeight: 600, fontSize: 15 }}>Accept offers</span>
            <ToggleSwitchBL on={acceptOffers} onClick={() => setAcceptOffers(!acceptOffers)} />
          </div>
        </div>

      </div>

      {/* summary bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'var(--glass)', backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid var(--line)', padding: '14px 16px 30px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: TBL.sans, fontSize: 13, color: TBL.muted }}>Total listing value</span>
          <span style={{ fontFamily: TBL.sans, fontWeight: 700, fontSize: 15, transition: 'color 0.3s' }}>{moneyBL(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: TBL.sans, fontSize: 13, color: TBL.muted }}>Est. payout (after 6% + 30p/card)</span>
          <span style={{ fontFamily: TBL.sans, fontWeight: 700, fontSize: 15, color: 'var(--up)', transition: 'color 0.3s' }}>{moneyBL(Math.max(0, payout))}</span>
        </div>
        <button onClick={() => { setDone(true); app.toast(cards.length + ' cards listed!'); }} style={{
          width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 13, padding: 14,
          fontFamily: TBL.sans, fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          List {cards.length} card{cards.length !== 1 ? 's' : ''}
        </button>
      </div>

      {/* condition picker for individual card */}
      {cardCondIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setCardCondIdx(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', animation: 'ccScrim 0.2s ease' }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, background: TBL.surface,
            borderRadius: '20px 20px 0 0', padding: '20px 16px 36px', animation: 'ccSlideUp 0.25s ease',
          }}>
            <div style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Condition</div>
            {CONDITIONS_BL.map(cond => (
              <button key={cond} onClick={() => { updateCardCondition(cardCondIdx, cond); setCardCondIdx(null); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 14px', borderRadius: 10, marginBottom: 4,
                  fontFamily: TBL.sans, fontWeight: cards[cardCondIdx]?.condition === cond ? 700 : 500,
                  fontSize: 15, color: cards[cardCondIdx]?.condition === cond ? 'var(--ink)' : TBL.muted,
                  background: cards[cardCondIdx]?.condition === cond ? TBL.surface2 : 'transparent',
                }}>
                {cond}
                {cards[cardCondIdx]?.condition === cond && <span style={{ float: 'right', color: 'var(--accent)' }}>{IconBL.check({ width: 18, height: 18 })}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* condition picker for ALL cards */}
      {condSheetOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setCondSheetOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', animation: 'ccScrim 0.2s ease' }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, background: TBL.surface,
            borderRadius: '20px 20px 0 0', padding: '20px 16px 36px', animation: 'ccSlideUp 0.25s ease',
          }}>
            <div style={{ fontFamily: TBL.sans, fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Set condition for all cards</div>
            {CONDITIONS_BL.map(cond => (
              <button key={cond} onClick={() => setAllCondition(cond)}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 14px', borderRadius: 10, marginBottom: 4,
                  fontFamily: TBL.sans, fontWeight: 500, fontSize: 15, color: TBL.ink,
                  background: 'transparent',
                }}>
                {cond}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BatchListScreen });
