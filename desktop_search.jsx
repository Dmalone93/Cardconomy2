// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — Search results (filter rail + grid)
// ─────────────────────────────────────────────────────────────
const { T: TSe, money: mSe } = window;
const { GAMES: GAMESS, SETS: SETSS, LISTINGS: LISTSS, setById: setByIdSS } = window;
const { DCard: DCardS } = window;

const SORTS_D = ['Best match', 'Price: low to high', 'Price: high to low', 'Ending soonest', 'Biggest discount'];

function FilterGroup({ title, children, open = true }) {
  const [o, setO] = React.useState(open);
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
      <button onClick={() => setO(!o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: o ? 12 : 0 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
        <span style={{ color: 'var(--faint)', transform: o ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>{window.DIcon.chevron({ width: 16, height: 16 })}</span>
      </button>
      {o && children}
    </div>
  );
}

function Check({ on, onClick, label, count }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', textAlign: 'left' }}>
      <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: on ? 'var(--accent)' : 'var(--surface)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
      <span style={{ flex: 1, fontSize: 13.5, color: on ? 'var(--ink)' : 'var(--ink-2)', fontWeight: on ? 600 : 400 }}>{label}</span>
      {count != null && <span style={{ fontSize: 12, color: 'var(--faint)', fontFamily: TSe.mono }}>{count}</span>}
    </button>
  );
}

function DSearch({ app, params = {} }) {
  const [game, setGame] = React.useState(params.game || 'all');
  const [setF, setSetF] = React.useState(params.set || 'all');
  const [cond, setCond] = React.useState(params.cond || 'Any grade');
  const [type, setType] = React.useState(params.type || 'all');
  const [freeShip, setFreeShip] = React.useState(false);
  const [maxPrice, setMaxPrice] = React.useState(35000);
  const [sort, setSort] = React.useState('Best match');
  const q = params.q || '';

  let res = LISTSS.filter(l => {
    if (game !== 'all' && l.game !== game) return false;
    if (setF !== 'all' && l.set !== setF) return false;
    if (q.trim()) { const hay = (l.name + ' ' + (l.subtitle || '') + ' ' + (setByIdSS(l.set)?.name || '')).toLowerCase(); if (!hay.includes(q.trim().toLowerCase())) return false; }
    if (cond === 'Graded only' && l.grade.company === 'raw') return false;
    if (cond === 'PSA 10' && !(l.grade.company === 'psa' && l.grade.grade === 10)) return false;
    if (cond === 'Raw / Ungraded' && l.grade.company !== 'raw') return false;
    if (type !== 'all' && l.type !== type) return false;
    if (freeShip && l.shipping !== 0) return false;
    if (l.price > maxPrice) return false;
    return true;
  });
  if (sort === 'Price: low to high') res = [...res].sort((a, b) => a.price - b.price);
  if (sort === 'Price: high to low') res = [...res].sort((a, b) => b.price - a.price);
  if (sort === 'Ending soonest') res = [...res].sort((a, b) => (a.type === 'auction' ? 0 : 1) - (b.type === 'auction' ? 0 : 1));
  if (sort === 'Biggest discount') res = [...res].sort((a, b) => (a.price / a.market) - (b.price / b.market));

  const title = q ? '"' + q + '"' : setF !== 'all' ? setByIdSS(setF).name : game !== 'all' ? (GAMESS.find(g => g.id === game)?.name || 'All cards') : 'All cards';
  const reset = () => { setGame('all'); setSetF('all'); setCond('Any grade'); setType('all'); setFreeShip(false); setMaxPrice(35000); };

  return (
    <div className="wrap" style={{ padding: '26px 24px 20px' }}>
      {/* breadcrumb + heading */}
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        <button onClick={() => app.go('home')} style={{ color: 'var(--muted)' }}>Home</button> / <span style={{ color: 'var(--ink-2)' }}>Search</span>
      </div>
      <h1 style={{ fontFamily: TSe.sans, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: '0 0 22px' }}>{title} <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--muted)' }}>· {res.length} results</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '248px 1fr', gap: 30, alignItems: 'start' }} className="srch-grid">
        {/* filter rail */}
        <aside style={{ position: 'sticky', top: 130 }} className="srch-rail">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Filters</span>
            <button onClick={reset} style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>Reset</button>
          </div>
          <FilterGroup title="Game">
            <Check on={game === 'all'} onClick={() => setGame('all')} label="All games" count={LISTSS.length} />
            {GAMESS.map(g => <Check key={g.id} on={game === g.id} onClick={() => { setGame(g.id); setSetF('all'); }} label={g.short} count={LISTSS.filter(l => l.game === g.id).length} />)}
          </FilterGroup>
          {game !== 'all' && SETSS.filter(s => s.game === game).length > 0 && (
            <FilterGroup title="Set">
              <Check on={setF === 'all'} onClick={() => setSetF('all')} label="All sets" />
              {SETSS.filter(s => s.game === game).map(s => <Check key={s.id} on={setF === s.id} onClick={() => setSetF(s.id)} label={s.name.replace(/\s*\(.*\)/, '')} />)}
            </FilterGroup>
          )}
          <FilterGroup title="Condition">
            {['Any grade', 'Graded only', 'PSA 10', 'Raw / Ungraded'].map(c => <Check key={c} on={cond === c} onClick={() => setCond(c)} label={c} />)}
          </FilterGroup>
          <FilterGroup title="Listing type">
            {[['all', 'All listings'], ['buynow', 'Buy It Now'], ['auction', 'Auctions']].map(([v, l]) => <Check key={v} on={type === v} onClick={() => setType(v)} label={l} />)}
          </FilterGroup>
          <FilterGroup title="Max price">
            <input type="range" min="10" max="35000" step="10" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TSe.mono, fontSize: 12, color: 'var(--muted)', marginTop: 4 }}><span>$10</span><span>{mSe(maxPrice, { cents: false })}</span></div>
          </FilterGroup>
          <FilterGroup title="Shipping">
            <Check on={freeShip} onClick={() => setFreeShip(!freeShip)} label="Free shipping" />
          </FilterGroup>
        </aside>

        {/* results */}
        <div>
          {setF !== 'all' && (() => {
            const setInfo = setByIdSS(setF);
            if (!setInfo) return null;
            const setCards = LISTSS.filter(l => l.set === setF).length;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg, var(--accent-wash), var(--surface))', borderRadius: 14, padding: '14px 18px', marginBottom: 18, boxShadow: 'inset 0 0 0 1px var(--accent)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{setInfo.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{setCards} card{setCards !== 1 ? 's' : ''}{setInfo.year ? ' · Released ' + setInfo.year : ''}</div>
                </div>
                <button onClick={() => setSetF('all')} style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 13, padding: '6px 12px', borderRadius: 8, background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>Clear set</button>
              </div>
            );
          })()}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {game !== 'all' && <Pill label={GAMESS.find(g => g.id === game)?.short} onX={() => { setGame('all'); setSetF('all'); }} />}
              {setF !== 'all' && <Pill label={setByIdSS(setF).name.replace(/\s*\(.*\)/, '')} onX={() => setSetF('all')} />}
              {cond !== 'Any grade' && <Pill label={cond} onX={() => setCond('Any grade')} />}
              {type !== 'all' && <Pill label={type === 'auction' ? 'Auctions' : 'Buy It Now'} onX={() => setType('all')} />}
              {freeShip && <Pill label="Free shipping" onX={() => setFreeShip(false)} />}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Sort</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontFamily: TSe.sans, fontSize: 13.5, fontWeight: 600, border: '1.5px solid var(--line)', borderRadius: 9, padding: '8px 10px', background: 'var(--surface)', color: 'var(--ink)' }}>
                {SORTS_D.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          {res.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 16 }}>
              <div style={{ marginBottom: 8, color: 'var(--muted)' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>No cards match</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Try removing a filter or widening your price.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18 }}>
              {res.map(l => <DCardS key={l.id} item={l} app={app} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 860px){ .srch-grid{ grid-template-columns: 1fr !important; } .srch-rail{ position: static !important; } }`}</style>
    </div>
  );
}

function Pill({ label, onX }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-wash)', color: 'var(--ink)', borderRadius: 999, padding: '6px 12px', fontSize: 13, fontWeight: 600 }}>
      {label}<button onClick={onX} style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1, opacity: 0.7 }}>×</button>
    </span>
  );
}

Object.assign(window, { DSearch });
