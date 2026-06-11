// ─────────────────────────────────────────────────────────────
// Shop side · counter view (mobile/tablet staff app)
// inbox → submission dashboard → price guide → offer → sent
// ─────────────────────────────────────────────────────────────
const { T: TSH, money: moneySH, Icon: IconSH, CardArt: CardArtSH, GradeChip: GradeChipSH, Sparkline: SparkSH, Delta: DeltaSH } = window;
const { SHOP: SHOP_SH, SUBMISSION: SUB_SH, SUB_CARDS: SC_SH, BULK_RATES: BR_SH, subStats: subStatsSH, setById: setByIdSH } = window;

function money0(n) { return moneySH(n, { cents: false }); }

function ShopScreen({ app }) {
  const [view, setView] = React.useState('inbox'); // inbox | dash | sent
  const [filter, setFilter] = React.useState('match');
  const [priceCard, setPriceCard] = React.useState(null); // card in price-guide drawer
  const [offer, setOffer] = React.useState(null); // { creditPct }
  const [prices, setPrices] = React.useState(() => {
    // seed singles ≥$5 with a suggested buy (70% market) so the offer has a number
    const o = {};
    SC_SH.forEach(c => { if (!c.buylist) o[c.id] = Math.round(c.market * 0.7); });
    return o;
  });
  const stats = subStatsSH();

  if (view === 'inbox') return <ShopInbox app={app} onOpen={() => setView('dash')} />;
  if (view === 'sent') return <ShopSent app={app} offer={offer} onInbox={() => { setView('inbox'); setOffer(null); }} />;

  // ── dashboard ──
  const buylistPayout = stats.buylistPayout;
  const singlesPayout = Object.values(prices).reduce((s, v) => s + (v || 0), 0);
  const bulkPayout = SUB_SH.bulkPayout;
  const cashTotal = Math.round(buylistPayout + singlesPayout + bulkPayout);
  const filtered = SC_SH.filter(c => {
    if (filter === 'match') return c.buylist;
    if (filter === 'singles') return !c.buylist && !c.flag;
    if (filter === 'flag') return c.flag;
    return true;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      {/* header */}
      <div style={{ padding: '50px 14px 12px', background: TSH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setView('inbox')} style={{ color: TSH.ink }}>{IconSH.back({})}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 26, height: 26, borderRadius: 999, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{SUB_SH.seller.initial}</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap' }}>{SUB_SH.seller.name}</span>
            </div>
            <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>#{SUB_SH.id} · {SUB_SH.total.toLocaleString()} cards · ticket #{SUB_SH.ticket}</div>
          </div>
          <span style={{ fontFamily: TSH.sans, fontSize: 10.5, fontWeight: 700, color: SHOP_SH.tint, background: 'var(--up-wash)', borderRadius: 7, padding: '4px 8px' }}>SHOP VIEW</span>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 14px 120px' }}>
        {/* stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <StatTile label="Total cards" value={SUB_SH.total.toLocaleString()} />
          <StatTile label="Est. market" value={money0(stats.estMarket)} />
          <StatTile label="On your buylist" value={stats.buylistCount} gold />
          <StatTile label="Buylist payout" value={money0(buylistPayout)} accent />
        </div>

        {/* filter chips */}
        <div className="noscroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '14px 0 10px' }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All itemized</FilterChip>
          <FilterChip active={filter === 'match'} onClick={() => setFilter('match')} gold>★ Buylist {stats.buylistCount}</FilterChip>
          <FilterChip active={filter === 'singles'} onClick={() => setFilter('singles')}>Singles ≥ $5</FilterChip>
          <FilterChip active={filter === 'flag'} onClick={() => setFilter('flag')} danger>⚠ Flagged</FilterChip>
        </div>

        {/* card rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(c => <ShopCardRow key={c.id} c={c} price={prices[c.id]} onClick={() => setPriceCard(c)} />)}
        </div>

        {/* bulk block */}
        <div style={{ marginTop: 14, background: TSH.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14 }}>{SUB_SH.bulkCount.toLocaleString()} bulk · standing rates</span>
            <span style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 15, color: TSH.accent }}>{moneySH(bulkPayout)}</span>
          </div>
          {BR_SH.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', fontFamily: TSH.sans, fontSize: 12.5, color: TSH.ink2 }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.count} {b.label}</span>
              <span style={{ fontFamily: TSH.mono, whiteSpace: 'nowrap', flexShrink: 0 }}>{moneySH(b.per1000 * b.count / 1000)} <span style={{ color: TSH.faint }}>· {money0(b.per1000)}/1k</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* sticky offer bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)',
        backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted }}>Offer total (cash)</div>
          <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 22 }}>{money0(cashTotal)}</div>
        </div>
        <button onClick={() => setOffer({ creditPct: 60, cash: cashTotal })} style={{ flex: 1.3, background: TSH.accent, color: '#fff', borderRadius: 14,
          padding: '15px 12px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>Build offer →</button>
      </div>

      {/* price guide drawer */}
      <PriceGuide card={priceCard} onClose={() => setPriceCard(null)} onSet={(v) => { setPrices(p => ({ ...p, [priceCard.id]: v })); setPriceCard(null); app.toast('Added ' + money0(v) + ' to offer'); }} />

      {/* offer composer */}
      <OfferComposer offer={offer} cashTotal={cashTotal} onClose={() => setOffer(null)} onSend={() => { setOffer(o => ({ ...o, sent: true })); setView('sent'); }} />
    </div>
  );
}

function StatTile({ label, value, gold, accent }) {
  return (
    <div style={{ background: gold ? 'var(--accent-wash)' : TSH.surface, borderRadius: 13, padding: '11px 13px',
      boxShadow: gold ? 'inset 0 0 0 1.5px var(--gold)' : accent ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 22, color: accent ? TSH.accent : TSH.ink, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function FilterChip({ children, active, onClick, gold, danger }) {
  const bg = active ? (danger ? 'var(--down)' : gold ? 'var(--gold)' : 'var(--fill)') : TSH.surface;
  const fg = active ? (gold ? '#2a2000' : '#fff') : TSH.ink2;
  return (
    <button onClick={onClick} style={{ whiteSpace: 'nowrap', fontFamily: TSH.sans, fontWeight: 700, fontSize: 13,
      padding: '7px 12px', borderRadius: 999, background: bg, color: fg, boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{children}</button>
  );
}

function ShopCardRow({ c, price, onClick }) {
  const matched = !!c.buylist;
  const fill = matched ? Math.min(c.qty, c.buylist.want) : 0;
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
      background: matched ? 'var(--accent-wash)' : TSH.surface, borderRadius: 13, padding: 10,
      boxShadow: matched ? 'inset 0 0 0 1.5px var(--gold)' : c.flag ? 'inset 0 0 0 1.5px var(--down)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ background: matched ? 'rgba(255,255,255,0.6)' : TSH.surface2, borderRadius: 9, padding: 6, flexShrink: 0 }}>
        <CardArtSH item={c} w={42} radius={5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          {c.flag && <span style={{ color: 'var(--down)', fontSize: 12 }}>⚠</span>}
        </div>
        <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.cond} · ×{c.qty}{c.flag ? ' · ' + c.flag : ' · ' + (setByIdSH(c.set) ? setByIdSH(c.set).name.replace(/\s*\(.*\)/, '') : '')}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {matched ? (
          <React.Fragment>
            <div style={{ fontFamily: TSH.sans, fontWeight: 800, fontSize: 11, color: TSH.accent, whiteSpace: 'nowrap' }}>★ WANT {c.buylist.want}</div>
            <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{money0(c.buylist.buy)}<span style={{ fontFamily: TSH.sans, fontSize: 10, color: TSH.muted }}>/ea</span></div>
          </React.Fragment>
        ) : c.flag ? (
          <div style={{ fontFamily: TSH.sans, fontSize: 11.5, fontWeight: 700, color: 'var(--down)' }}>inspect</div>
        ) : (
          <React.Fragment>
            <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>your buy</div>
            <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 14, color: price ? TSH.ink : TSH.accent }}>{price ? money0(price) : 'price'}</div>
          </React.Fragment>
        )}
      </div>
    </button>
  );
}

// ── price guide drawer ───────────────────────────────────────
function PriceGuide({ card, onClose, onSet }) {
  const [pct, setPct] = React.useState(70);
  React.useEffect(() => { setPct(70); }, [card]);
  if (!card) return null;
  const ladder = [
    ['Near Mint', Math.round(card.market)],
    ['Lightly Played', Math.round(card.market * 0.8)],
    ['Moderately Pl.', Math.round(card.market * 0.62)],
    ['Heavily Played', Math.round(card.market * 0.46)],
  ];
  const condIdx = { NM: 0, LP: 1, MP: 2, HP: 3 }[card.cond] ?? 0;
  const condMarket = ladder[condIdx][1];
  const buy = Math.round(condMarket * pct / 100);
  const comps = [
    ['Jun 5 · NM', Math.round(card.market * 1.02)],
    ['Jun 2 · NM', Math.round(card.market * 0.98)],
    ['May 28 · LP', Math.round(card.market * 0.82)],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.4)', animation: 'ccScrim 0.2s ease' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: TSH.surface, borderRadius: '22px 22px 0 0',
        maxHeight: '92%', display: 'flex', flexDirection: 'column', animation: 'ccSlideUp 0.28s cubic-bezier(0.2,0.9,0.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line)' }} /></div>
        <div className="noscroll" style={{ overflow: 'auto', padding: '12px 18px 26px' }}>
          {/* header */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: TSH.surface2, borderRadius: 9, padding: 6 }}><CardArtSH item={card} w={50} radius={6} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 800, fontSize: 16 }}>{card.name}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>{setByIdSH(card.set) ? setByIdSH(card.set).name : ''} · {card.number} · ×{card.qty}</div>
            </div>
            <button onClick={onClose} style={{ color: TSH.faint, fontSize: 22, lineHeight: 1 }}>×</button>
          </div>

          {/* market headline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, background: TSH.surface2, borderRadius: 13, padding: '12px 14px' }}>
            <div>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, fontWeight: 600 }}>Market · {card.cond}</div>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 26 }}>{money0(condMarket)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <SparkSH data={[card.market*0.82, card.market*0.88, card.market*0.85, card.market*0.94, card.market*0.97, card.market]} w={92} h={36} up dots />
              <div style={{ fontFamily: TSH.sans, fontSize: 11, color: 'var(--up)', fontWeight: 700, marginTop: 2 }}>▲ 6.2% / 90d</div>
            </div>
          </div>

          {/* condition ladder */}
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, margin: '16px 0 8px' }}>Price by condition</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ladder.map(([lab, val], i) => (
              <div key={lab} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 9, padding: '8px 12px',
                background: i === condIdx ? 'var(--accent-wash)' : TSH.surface2, boxShadow: i === condIdx ? 'inset 0 0 0 1.5px var(--accent)' : 'none' }}>
                <span style={{ fontFamily: TSH.sans, fontWeight: 600, fontSize: 13.5, color: i === condIdx ? TSH.accent : TSH.ink2, whiteSpace: 'nowrap' }}>{lab}{i === condIdx ? ' · stated' : ''}</span>
                <span style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{money0(val)}</span>
              </div>
            ))}
          </div>

          {/* recent comps */}
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, margin: '16px 0 8px' }}>Recent sold comps</div>
          <div style={{ background: TSH.surface2, borderRadius: 11, padding: '6px 12px' }}>
            {comps.map(([d, v]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', fontFamily: TSH.sans, fontSize: 12.5, color: TSH.ink2 }}>
                <span style={{ whiteSpace: 'nowrap' }}>{d}</span><span style={{ fontFamily: TSH.mono, fontWeight: 600, flexShrink: 0 }}>{money0(v)}</span>
              </div>
            ))}
          </div>

          {/* buy % */}
          <div style={{ marginTop: 18, background: 'var(--accent-wash)', borderRadius: 13, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, color: TSH.accent }}>Your buy %</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {[60, 70, 80].map(p => (
                  <button key={p} onClick={() => setPct(p)} style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, padding: '4px 11px', borderRadius: 8,
                    background: pct === p ? TSH.accent : '#fff', color: pct === p ? '#fff' : TSH.ink2 }}>{p}%</button>
                ))}
              </div>
            </div>
            <input type="range" min="40" max="90" step="5" value={pct} onChange={e => setPct(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 12 }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.ink2 }}>Buy price {card.qty > 1 ? '(×' + card.qty + ')' : ''}</span>
              <span style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 24, color: TSH.accent }}>{money0(buy * card.qty)}</span>
            </div>
          </div>

          <button onClick={() => onSet(buy * card.qty)} style={{ width: '100%', marginTop: 14, background: TSH.accent, color: '#fff', borderRadius: 14,
            padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 16 }}>Add {money0(buy * card.qty)} to offer</button>
        </div>
      </div>
    </div>
  );
}

// ── offer composer ───────────────────────────────────────────
function OfferComposer({ offer, cashTotal, onClose, onSend }) {
  const [creditPct, setCreditPct] = React.useState(60);
  const [msg, setMsg] = React.useState("Offer's ready — come on in 👍");
  React.useEffect(() => { if (offer) { setCreditPct(60); setMsg("Offer's ready — come on in 👍"); } }, [offer]);
  if (!offer || offer.sent) return null;
  const creditTotal = Math.round(cashTotal * (1 + SHOP_SH.creditBonus));
  const templates = ["Offer's ready — come on in 👍", 'Can you bring these back to inspect?', "We'll pass on bulk — singles only", "What's your availability this week?"];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 85 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.4)', animation: 'ccScrim 0.2s ease' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: TSH.surface, borderRadius: '22px 22px 0 0',
        maxHeight: '92%', display: 'flex', flexDirection: 'column', animation: 'ccSlideUp 0.28s cubic-bezier(0.2,0.9,0.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line)' }} /></div>
        <div className="noscroll" style={{ overflow: 'auto', padding: '10px 18px 26px' }}>
          <div style={{ fontFamily: TSH.sans, fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>Build offer for {SUB_SH.seller.name}</div>

          {/* cash / credit split */}
          <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 13, padding: '12px 13px' }}>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, fontWeight: 600 }}>💵 Cash</div>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 22 }}>{money0(cashTotal)}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--up-wash)', borderRadius: 13, padding: '12px 13px', boxShadow: 'inset 0 0 0 1.5px var(--up)' }}>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: 'var(--up)', fontWeight: 700 }}>🎁 Credit +20%</div>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 22, color: 'var(--up)' }}>{money0(creditTotal)}</div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13 }}>Suggested split</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 16, borderRadius: 999, overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              <div style={{ width: (100 - creditPct) + '%', background: TSH.accent }} />
              <div style={{ width: creditPct + '%', background: 'var(--gold)' }} />
            </div>
            <input type="range" min="0" max="100" step="10" value={creditPct} onChange={e => setCreditPct(+e.target.value)} style={{ width: '100%', accentColor: 'var(--gold)', marginTop: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TSH.sans, fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: TSH.accent }}>{money0(Math.round(cashTotal * (100 - creditPct) / 100))} cash</span>
              <span style={{ color: 'var(--gold)', filter: 'brightness(0.85)' }}>{money0(Math.round(creditTotal * creditPct / 100))} credit</span>
            </div>
          </div>

          {/* message */}
          <div style={{ marginTop: 16, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Message to seller</div>
          <div className="noscroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 10 }}>
            {templates.map(t => (
              <button key={t} onClick={() => setMsg(t)} style={{ whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TSH.sans, fontWeight: 600, fontSize: 12.5,
                padding: '7px 11px', borderRadius: 999, background: msg === t ? 'var(--fill)' : TSH.surface2, color: msg === t ? '#fff' : TSH.ink2 }}>{t}</button>
            ))}
          </div>
          <div style={{ background: TSH.surface2, borderRadius: 12, padding: '11px 13px', fontFamily: TSH.sans, fontSize: 13.5, color: TSH.ink, boxShadow: 'inset 0 0 0 1px var(--line)' }}>{msg}</div>

          <button onClick={onSend} style={{ width: '100%', marginTop: 16, background: TSH.accent, color: '#fff', borderRadius: 14, padding: 15,
            fontFamily: TSH.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>Send offer →</button>
          <div style={{ textAlign: 'center', marginTop: 10, fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>Cards & payment exchange in person at the counter.</div>
        </div>
      </div>
    </div>
  );
}

// ── shop inbox ───────────────────────────────────────────────
function ShopInbox({ app, onOpen }) {
  const stats = subStatsSH();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      <div style={{ padding: '50px 16px 14px', background: TSH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => app.nav.pop()} style={{ color: TSH.ink, display: 'flex', alignItems: 'center', gap: 4, fontFamily: TSH.sans, fontSize: 14.5, fontWeight: 600 }}>{IconSH.back({ width: 18, height: 18 })} Exit demo</button>
          <span style={{ fontFamily: TSH.sans, fontSize: 10.5, fontWeight: 700, color: SHOP_SH.tint, background: 'var(--up-wash)', borderRadius: 7, padding: '4px 8px' }}>SHOP VIEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 800, fontSize: 18 }}>{SHOP_SH.initial}</span>
          <div>
            <h1 style={{ margin: 0, fontFamily: TSH.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>Buylist inbox</h1>
            <div style={{ fontFamily: TSH.sans, fontSize: 12.5, color: TSH.muted }}>{SHOP_SH.name} · counter</div>
          </div>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12.5, color: TSH.muted, marginBottom: 9, letterSpacing: 0.2 }}>NEW · NEEDS REVIEW</div>
        {/* hero submission */}
        <button onClick={onOpen} style={{ width: '100%', textAlign: 'left', background: 'var(--accent-wash)', borderRadius: 16, padding: 15,
          boxShadow: 'inset 0 0 0 2px var(--accent)', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 800, fontSize: 19 }}>{SUB_SH.seller.initial}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 800, fontSize: 16 }}>{SUB_SH.seller.name} · {SUB_SH.total.toLocaleString()} cards</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>{SUB_SH.submittedAgo} · ticket #{SUB_SH.ticket}</div>
            </div>
            <span style={{ fontFamily: TSH.sans, fontSize: 10, fontWeight: 800, color: '#fff', background: 'var(--down)', borderRadius: 999, padding: '3px 8px' }}>NEW</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 17, color: TSH.accent }}>{stats.buylistCount}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>★ buylist hits</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 17 }}>{money0(stats.buylistPayout)}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>est. payout</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 17 }}>{money0(stats.estMarket)}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>market val</div>
            </div>
          </div>
          <div style={{ marginTop: 13, background: TSH.accent, color: '#fff', borderRadius: 11, padding: '11px 0', textAlign: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 14.5 }}>Review submission →</div>
        </button>

        {/* other queue items */}
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12.5, color: TSH.muted, margin: '4px 0 9px', letterSpacing: 0.2 }}>EARLIER</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <QueueRow initial="S" name="Sam R." cards="64 cards" meta="18 min ago" tag="12 hits" tagColor={TSH.accent} onClick={() => app.toast('Demo focuses on Jordan’s submission')} />
          <QueueRow initial="D" name="Dana P." cards="310 cards" meta="1 hr ago · offer sent" tag="replied" tagColor="var(--up)" onClick={() => app.toast('Demo focuses on Jordan’s submission')} />
          <QueueRow initial="M" name="Miguel A." cards="1,420 cards" meta="3 hr ago · completed" tag="paid" tagColor={TSH.muted} onClick={() => app.toast('Demo focuses on Jordan’s submission')} />
        </div>
      </div>
    </div>
  );
}

function QueueRow({ initial, name, cards, meta, tag, tagColor, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
      background: TSH.surface, borderRadius: 13, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: TSH.surface2, color: TSH.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 800, fontSize: 15 }}>{initial}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14 }}>{name} · {cards}</div>
        <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted }}>{meta}</div>
      </div>
      <span style={{ fontFamily: TSH.sans, fontSize: 11.5, fontWeight: 700, color: tagColor }}>{tag}</span>
    </button>
  );
}

// ── shop sent confirmation ───────────────────────────────────
function ShopSent({ app, offer, onInbox }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '80px 24px 24px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconSH.check({ width: 44, height: 44 })}</div>
        <h1 style={{ margin: '20px 0 4px', fontFamily: TSH.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>Offer sent to {SUB_SH.seller.name}</h1>
        <p style={{ fontFamily: TSH.sans, fontSize: 14, color: TSH.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 270 }}>
          They've been texted. When they come in with ticket #{SUB_SH.ticket}, check the stack against the list and pay out.
        </p>
        <div style={{ background: TSH.surface, borderRadius: 16, padding: 16, marginTop: 20, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {[['Cash option', money0(offer ? offer.cash : 620)], ['Store credit', money0(Math.round((offer ? offer.cash : 620) * 1.2))], ['Ticket', '#' + SUB_SH.ticket]].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none' }}>
              <span style={{ fontFamily: TSH.sans, fontSize: 13.5, color: TSH.muted }}>{k}</span>
              <span style={{ fontFamily: TSH.mono, fontWeight: 700, fontSize: 13.5, color: i === 1 ? 'var(--up)' : TSH.ink }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-wash)', color: TSH.accent, borderRadius: 12, padding: '13px 14px', marginTop: 14, textAlign: 'left' }}>
          {IconSH.shield({})}
          <span style={{ fontFamily: TSH.sans, fontSize: 13, fontWeight: 600 }}>Submission moves to “Awaiting pickup” in your queue.</span>
        </div>
      </div>
      <div style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--line)', background: TSH.surface, display: 'flex', gap: 10 }}>
        <button onClick={onInbox} style={{ flex: 1, background: TSH.surface2, color: TSH.ink, borderRadius: 14, padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 15, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Back to inbox</button>
        <button onClick={() => app.nav.setTab('home')} style={{ flex: 1, background: TSH.accent, color: '#fff', borderRadius: 14, padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
      </div>
    </div>
  );
}

Object.assign(window, { ShopScreen });
