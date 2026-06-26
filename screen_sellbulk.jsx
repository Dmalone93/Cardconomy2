// ─────────────────────────────────────────────────────────────
// Bulk LIST on the marketplace — reuses the Live Sweep scanner,
// then auto-prices every scanned card at market for publishing.
// phases: method → scan → price → done
// ─────────────────────────────────────────────────────────────
const { T: TB, money: moneyB, Icon: IconB, CardArt: CardArtB, GradeChip: GradeChipB } = window;
const { SUB_CARDS: SC_B, setById: setByIdB } = window;
const LiveSweepB = (props) => window.LiveSweep(props);

// pricing strategies relative to market
const STRATS = [
  { id: 'market', label: 'At market', mult: 1.0, sub: 'Match current value' },
  { id: 'under', label: 'Undercut 5%', mult: 0.95, sub: 'Sell a bit faster' },
  { id: 'quick', label: 'Quick sale', mult: 0.90, sub: 'Move it now' },
];

function MethodRowB({ icon, title, sub, time, hero, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13,
      background: hero ? 'var(--accent-wash)' : TB.surface, borderRadius: 4, padding: '14px 15px',
      boxShadow: hero ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <span style={{ width: 42, height: 42, borderRadius: 4, flexShrink: 0, background: hero ? TB.accent : TB.surface2,
        color: hero ? '#fff' : TB.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 15, color: hero ? TB.accent : TB.ink }}>{title}</div>
        <div style={{ fontFamily: TB.sans, fontSize: 12, color: TB.muted }}>{sub}</div>
      </div>
      <span style={{ fontFamily: TB.sans, fontSize: 11.5, fontWeight: 700, color: hero ? TB.accent : TB.muted,
        background: hero ? '#fff' : TB.surface2, borderRadius: 7, padding: '3px 8px' }}>{time}</span>
    </button>
  );
}

function SellBulkScreen({ app }) {
  const [phase, setPhase] = React.useState('method');
  const [scanned, setScanned] = React.useState(0);
  const [strat, setStrat] = React.useState('market');
  const [listType, setListType] = React.useState('buynow');
  const [freeShip, setFreeShip] = React.useState(true);
  const [offers, setOffers] = React.useState(true);
  // per-card include toggle (default all on)
  const [excluded, setExcluded] = React.useState({});

  const mult = STRATS.find(s => s.id === strat).mult;
  const included = SC_B.filter(c => !excluded[c.id]);
  const listed = included.length;
  const grossEach = (c) => Math.round(c.market * mult * (c.qty || 1));
  const gross = included.reduce((s, c) => s + grossEach(c), 0);
  const fee = Math.round(gross * 0.06 + included.length * 0.30);
  const net = gross - fee - (freeShip ? included.length * 1 : 0);

  const goBack = () => {
    if (phase === 'method') app.nav.pop();
    else if (phase === 'price') setPhase('method');
    else app.nav.pop();
  };

  if (phase === 'scan') {
    return <LiveSweepB onDone={(n) => { if (n === 0) setPhase('method'); else { setScanned(n); setPhase('price'); } }} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TB.bg }}>
      {phase !== 'done' && (
        <div style={{ padding: '14px 14px 12px', background: TB.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={goBack} style={{ color: TB.ink }}>{IconB.back({})}</button>
          <span style={{ fontFamily: TB.sans, fontWeight: 800, fontSize: 16, flex: 1 }}>Bulk list to marketplace</span>
          {phase === 'price' && <span style={{ fontFamily: TB.sans, fontSize: 13, color: TB.muted }}>{listed} cards</span>}
        </div>
      )}

      <div className="noscroll" style={{ flex: 1, overflow: 'auto' }}>
        {/* ── METHOD ── */}
        {phase === 'method' && (
          <div style={{ padding: '18px 16px 30px' }}>
            <h1 style={{ margin: '0 0 2px', fontFamily: TB.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Add cards to list</h1>
            <p style={{ fontFamily: TB.sans, fontSize: 13.5, color: TB.muted, margin: '0 0 16px' }}>Scan your pile — each card becomes its own listing, auto-priced at market.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MethodRowB hero icon={IconB.camera({ width: 22, height: 22 })} title="Live Sweep Scan" sub="Flip the stack — we auto-detect each card" time="fastest" onClick={() => setPhase('scan')} />
              <MethodRowB icon={IconB.grid({ width: 22, height: 22 })} title="Batch Fan Photo" sub="9–12 cards per snap" time="~25 min" onClick={() => app.toast('Coming soon — use Live Sweep for now')} />
              <MethodRowB icon={IconB.search({ width: 22, height: 22 })} title="Search & Add" sub="Verify high-value singles" time="precise" onClick={() => app.toast('Coming soon — use Live Sweep for now')} />
              <MethodRowB icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M14 2v6h6M10 13h4M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>} title="Import List" sub="Manabox · TCGplayer · CSV" time="instant" onClick={() => app.toast('Coming soon — use Live Sweep for now')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 16, background: TB.surface2, borderRadius: 4, padding: '12px 13px' }}>
              <span style={{ color: 'var(--ink)', marginTop: 1 }}>{IconB.tag({ width: 16, height: 16 })}</span>
              <span style={{ fontFamily: TB.sans, fontSize: 12.5, color: TB.ink2, lineHeight: 1.45 }}>
                After scanning, we price every card from live market data. You set one strategy for all, then tweak any before publishing.
              </span>
            </div>
          </div>
        )}

        {/* ── PRICE / REVIEW ── */}
        {phase === 'price' && (
          <div style={{ padding: '16px 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <h1 style={{ margin: 0, fontFamily: TB.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Price &amp; publish</h1>
              <span style={{ fontFamily: TB.sans, fontSize: 13, color: TB.muted }}>{scanned}+ scanned</span>
            </div>
            <p style={{ fontFamily: TB.sans, fontSize: 13, color: TB.muted, margin: '4px 0 16px' }}>
              We auto-priced each card from market. Pick a strategy for all, then fine-tune below.
            </p>

            {/* pricing strategy */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {STRATS.map(s => (
                <button key={s.id} onClick={() => setStrat(s.id)} style={{ flex: 1, textAlign: 'left', padding: '11px 12px', borderRadius: 4,
                  background: strat === s.id ? 'var(--accent-wash)' : TB.surface, boxShadow: strat === s.id ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 13, color: strat === s.id ? TB.accent : TB.ink }}>{s.label}</div>
                  <div style={{ fontFamily: TB.sans, fontSize: 10.5, color: TB.muted, marginTop: 1 }}>{s.sub}</div>
                </button>
              ))}
            </div>


            {/* toggles */}
            <div style={{ background: TB.surface, borderRadius: 4, padding: '4px 14px', marginBottom: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <ToggleLine label="Offer free postage" on={freeShip} onClick={() => setFreeShip(!freeShip)} />
              <div style={{ height: 1, background: 'var(--line-2)' }} />
              <ToggleLine label="Accept offers on all" on={offers} onClick={() => setOffers(!offers)} />
            </div>

            {/* card list */}
            <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>Your cards</span>
              <span style={{ color: TB.muted, fontWeight: 500 }}>{listed} of {SC_B.length} listing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SC_B.map(c => (
                <BulkPriceRow key={c.id} c={c} price={grossEach(c)} listType={listType}
                  excluded={!!excluded[c.id]} onToggle={() => setExcluded(e => ({ ...e, [c.id]: !e[c.id] }))} />
              ))}
            </div>

            {/* payout summary */}
            <div style={{ marginTop: 16, background: 'var(--fill)', borderRadius: 4, padding: 16, color: '#fff' }}>
              {[['List price total', moneyB(gross)], ['Seller fee (6% + 30p)', '–' + moneyB(fee)]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontFamily: TB.sans, fontSize: 13.5, color: 'rgba(255,255,255,0.75)' }}>
                  <span>{k}</span><span style={{ fontFamily: TB.sans, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 15 }}>You earn if all sell</span>
                <span style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 22, color: '#7fe7a4' }}>{moneyB(net)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === 'done' && (
          <div style={{ padding: '70px 24px 30px', textAlign: 'center' }}>
            <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconB.check({ width: 44, height: 44 })}</div>
            <h1 style={{ margin: '20px 0 4px', fontFamily: TB.sans, fontWeight: 800, fontSize: 25, letterSpacing: -0.5 }}>{listed} cards listed!</h1>
            <p style={{ fontFamily: TB.sans, fontSize: 14, color: TB.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 290 }}>
              Your cards are live on the marketplace. We'll notify you on every sale and offer.
            </p>
            {/* mini grid of what went live */}
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '20px -24px 0', padding: '0 24px 6px' }}>
              {included.slice(0, 8).map(c => (
                <div key={c.id} style={{ flexShrink: 0, position: 'relative' }}>
                  <CardArtB item={c} w={62} />
                  <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff',
                    fontFamily: TB.sans, fontWeight: 700, fontSize: 9, padding: '1px 5px', borderRadius: 5, whiteSpace: 'nowrap' }}>{moneyB(grossEach(c), { cents: false })}</div>
                </div>
              ))}
            </div>
            <button onClick={() => app.nav.setTab('watch')} style={{ width: '100%', marginTop: 22, background: 'var(--ink)', color: '#fff', borderRadius: 4,
              padding: 15, fontFamily: TB.sans, fontWeight: 700, fontSize: 15.5 }}>Manage my listings</button>
            <button onClick={() => app.nav.setTab('home')} style={{ marginTop: 10, color: TB.muted, fontFamily: TB.sans, fontWeight: 600, fontSize: 14 }}>Back to browse</button>
          </div>
        )}
      </div>

      {/* footer */}
      {phase === 'price' && (
        <div style={{ padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('done')} disabled={listed === 0} style={{ width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 4,
            padding: 16, fontFamily: TB.sans, fontWeight: 700, fontSize: 16, opacity: listed === 0 ? 0.45 : 1, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
            Publish {listed} listing{listed !== 1 ? 's' : ''} · {moneyB(gross)}
          </button>
        </div>
      )}
    </div>
  );
}

function ToggleLine({ label, on, onClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
      <span style={{ fontFamily: TB.sans, fontWeight: 600, fontSize: 14.5 }}>{label}</span>
      <button onClick={onClick} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, transition: 'background 0.2s',
        background: on ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transform: on ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
      </button>
    </div>
  );
}

function BulkPriceRow({ c, price, listType, excluded, onToggle }) {
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, background: TB.surface, borderRadius: 4, padding: 10,
      opacity: excluded ? 0.5 : 1, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ background: TB.surface2, borderRadius: 9, padding: 6, flexShrink: 0 }}><CardArtB item={c} w={42} radius={5} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          {c.flag && <span style={{ color: 'var(--down)', fontSize: 12 }}>⚠</span>}
        </div>
        <div style={{ fontFamily: TB.sans, fontSize: 11.5, color: TB.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.cond} · ×{c.qty} · mkt {moneyB(c.market, { cents: false })}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 14, color: excluded ? TB.faint : TB.ink, textDecoration: excluded ? 'line-through' : 'none' }}>{moneyB(price, { cents: false })}</div>
        <div style={{ fontFamily: TB.sans, fontSize: 10, color: TB.muted }}>list price</div>
      </div>
      <button onClick={onToggle} style={{ width: 26, height: 26, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: excluded ? TB.surface2 : 'var(--ink)', color: excluded ? TB.muted : '#fff',
        boxShadow: excluded ? 'inset 0 0 0 1.5px var(--line)' : 'none' }}>
        {excluded ? '+' : IconB.check({ width: 16, height: 16 })}
      </button>
    </div>
  );
}

Object.assign(window, { SellBulkScreen });
