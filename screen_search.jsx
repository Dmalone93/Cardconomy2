// ─────────────────────────────────────────────────────────────
// Search + filters + results
// ─────────────────────────────────────────────────────────────
const { T: TS, money: moneyS, Chip: ChipS, Icon: IconS, Sheet: SheetS } = window;
const { ListRow: ListRowS, ListCard: ListCardS } = window;
const { GAMES: GAMES_S, SETS: SETS_S, LISTINGS: LISTINGS_S, gameById: gameByIdS, setById: setByIdS } = window;

const CONDITIONS = ['Any grade', 'Graded only', 'PSA 10', 'Raw / Ungraded'];
const SORTS = ['Best match', 'Price: low to high', 'Price: high to low', 'Ending soonest'];

function SearchScreen({ app, params = {} }) {
  const showBack = app.nav.stackDepth > 0;
  const [q, setQ] = React.useState(params.q || '');
  const SEARCH_EX = ['Charizard ex', 'Black Lotus', 'Moonbreon PSA 10', 'Blue-Eyes White Dragon',
    'Surging Sparks booster box', 'Pikachu Illustration Rare', 'Ragavan, Nimble Pilferer', 'Victor Wembanyama Prizm',
    'Scarlet & Violet 151', 'Dark Magician', 'Umbreon VMAX alt art', 'Monkey D. Luffy leader', 'PSA 10 graded slabs',
    'Modern Horizons 3', 'Omnimon alt art', 'Mewtwo 1st edition'];
  const [typed, setTyped] = React.useState('');
  React.useEffect(() => {
    let idx = 0, ch = 0, mode = 'type', timer;
    const tick = () => {
      const full = SEARCH_EX[idx];
      if (mode === 'type') {
        ch++;
        setTyped(full.slice(0, ch));
        if (ch >= full.length) { mode = 'hold'; timer = setTimeout(tick, 1500); return; }
        timer = setTimeout(tick, 55 + Math.random() * 45);
      } else if (mode === 'hold') {
        mode = 'delete'; timer = setTimeout(tick, 40);
      } else {
        ch--;
        setTyped(full.slice(0, ch));
        if (ch <= 0) { mode = 'type'; idx = (idx + 1) % SEARCH_EX.length; timer = setTimeout(tick, 320); return; }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);
  const [game, setGame] = React.useState(params.game || 'all');
  const [setF, setSetF] = React.useState(params.set || 'all');
  const [cond, setCond] = React.useState('Any grade');
  const [maxPrice, setMaxPrice] = React.useState(35000);
  const [freeShip, setFreeShip] = React.useState(false);
  const [listType, setListType] = React.useState('all'); // all | buynow | auction
  const [sort, setSort] = React.useState('Best match');
  const [view, setView] = React.useState('grid');
  const [sheet, setSheet] = React.useState(null); // 'filters' | 'sort'
  const [focused, setFocused] = React.useState(false);

  // results
  let res = LISTINGS_S.filter(l => {
    if (game !== 'all' && l.game !== game) return false;
    if (setF !== 'all' && l.set !== setF) return false;
    if (q.trim()) {
      const hay = (l.name + ' ' + (l.subtitle||'') + ' ' + (setByIdS(l.set)?.name||'')).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    if (cond === 'Graded only' && l.grade.company === 'raw') return false;
    if (cond === 'PSA 10' && !(l.grade.company === 'psa' && l.grade.grade === 10)) return false;
    if (cond === 'Raw / Ungraded' && l.grade.company !== 'raw') return false;
    if (l.price > maxPrice) return false;
    if (freeShip && !(l.shipping === 0)) return false;
    if (listType !== 'all' && l.type !== listType) return false;
    return true;
  });
  if (sort === 'Price: low to high') res = [...res].sort((a,b)=>a.price-b.price);
  if (sort === 'Price: high to low') res = [...res].sort((a,b)=>b.price-a.price);
  if (sort === 'Ending soonest') res = [...res].sort((a,b)=>(a.type==='auction'?0:1)-(b.type==='auction'?0:1));

  const activeFilters = [game !== 'all', setF !== 'all', cond !== 'Any grade', freeShip, listType !== 'all', maxPrice < 35000].filter(Boolean).length;
  const popular = ['Charizard ex', 'Moonbreon', 'Black Lotus', 'Blue-Eyes', '151', 'PSA 10'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TS.bg }}>
      {/* search header */}
      <div style={{ padding: '56px 12px 10px', background: TS.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showBack ? (
            <button onClick={() => app.nav.pop()} style={{ color: TS.ink, padding: 4 }}>{IconS.back({})}</button>
          ) : (
            <button onClick={() => app.openMenu()} style={{ color: TS.ink, padding: 4 }}>{IconS.menu({})}</button>
          )}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: TS.surface2,
            borderRadius: 11, padding: '9px 12px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
            {IconS.search({ width: 18, height: 18, style: { color: TS.faint } })}
            <input value={q} onChange={e => setQ(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(()=>setFocused(false), 150)}
              placeholder={'Try “' + typed + '”'} style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: TS.sans, fontSize: 15, color: TS.ink, minWidth: 0,
            }} />
            {q && <button onClick={() => setQ('')} style={{ color: TS.faint, fontSize: 18, lineHeight: 1 }}>×</button>}
          </div>
        </div>
      </div>

      {/* suggestions overlay when focused + empty */}
      {focused && !q && (
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 96px' }}>
          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, marginBottom: 10, letterSpacing: 0.2 }}>POPULAR SEARCHES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {popular.map(p => <ChipS key={p} onClick={() => { setQ(p); setFocused(false); }}>{p}</ChipS>)}
          </div>
          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, marginBottom: 10, letterSpacing: 0.2 }}>BROWSE BY GAME</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {GAMES_S.map(g => (
              <button key={g.id} onClick={() => { setGame(g.id); setFocused(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, background: TS.surface, borderRadius: 12,
                padding: '13px 14px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)', textAlign: 'left' }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: g.tint }} />
                <span style={{ flex: 1, fontFamily: TS.sans, fontWeight: 600, fontSize: 15 }}>{g.name}</span>
                {IconS.chevron({ style: { color: TS.faint } })}
              </button>
            ))}
          </div>
        </div>
      )}

      {!(focused && !q) && (
        <React.Fragment>
          {/* filter bar */}
          <div className="noscroll" style={{ display: 'flex', gap: 8, padding: '12px 16px 10px', overflowX: 'auto', alignItems: 'center', background: TS.bg }}>
            <button onClick={() => setSheet('filters')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              fontFamily: TS.sans, fontWeight: 700, fontSize: 13.5, padding: '8px 14px', borderRadius: 999,
              background: activeFilters ? TS.accent : TS.surface, color: activeFilters ? '#fff' : TS.ink2,
              boxShadow: activeFilters ? 'none' : 'inset 0 0 0 1px var(--line)' }}>
              {IconS.filter({ width: 16, height: 16 })} Filters{activeFilters ? ' · ' + activeFilters : ''}
            </button>
            <ChipS active={listType==='buynow'} onClick={() => setListType(listType==='buynow'?'all':'buynow')}>Buy Now</ChipS>
            <ChipS active={listType==='auction'} onClick={() => setListType(listType==='auction'?'all':'auction')}>Auctions</ChipS>
            <ChipS active={cond==='Graded only'} onClick={() => setCond(cond==='Graded only'?'Any grade':'Graded only')}>Graded</ChipS>
            <ChipS active={freeShip} onClick={() => setFreeShip(!freeShip)}>Free ship</ChipS>
          </div>

          {/* result meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 16px 10px' }}>
            <span style={{ fontFamily: TS.sans, fontSize: 13, color: TS.muted }}>
              <b style={{ color: TS.ink }}>{res.length}</b> result{res.length!==1?'s':''}{setF!=='all' ? ' in ' + setByIdS(setF).name.replace(/\s*\(.*\)/,'') : ''}
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button onClick={() => setSheet('sort')} style={{ fontFamily: TS.sans, fontSize: 13, fontWeight: 600, color: TS.accent, padding: '4px 6px' }}>{sort} ▾</button>
              <button onClick={() => setView(view==='grid'?'list':'grid')} style={{ color: TS.muted, padding: 4 }}>
                {view==='grid' ? IconS.filter({width:18,height:18}) : IconS.grid({width:18,height:18})}
              </button>
            </div>
          </div>

          {/* results */}
          <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
            {res.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: TS.muted, fontFamily: TS.sans }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: TS.ink }}>No cards match</div>
                <div style={{ fontSize: 13.5, marginTop: 4 }}>Try removing a filter or widening your price.</div>
              </div>
            ) : view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {res.map(l => <ListCardS key={l.id} item={l} app={app} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {res.map(l => <ListRowS key={l.id} item={l} app={app} />)}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {/* FILTERS sheet */}
      <SheetS open={sheet==='filters'} onClose={() => setSheet(null)} title="Filters">
        <FilterGroup label="Game">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <ChipS active={game==='all'} onClick={() => setGame('all')}>All</ChipS>
            {GAMES_S.map(g => <ChipS key={g.id} active={game===g.id} onClick={() => setGame(g.id)}>{g.short}</ChipS>)}
          </div>
        </FilterGroup>
        <FilterGroup label="Set">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <ChipS active={setF==='all'} onClick={() => setSetF('all')}>All sets</ChipS>
            {SETS_S.filter(s => game==='all'||s.game===game).map(s => (
              <ChipS key={s.id} active={setF===s.id} onClick={() => setSetF(s.id)}>{s.name.replace(/\s*\(.*\)/,'')}</ChipS>
            ))}
          </div>
        </FilterGroup>
        <FilterGroup label="Condition">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CONDITIONS.map(c => <ChipS key={c} active={cond===c} onClick={() => setCond(c)}>{c}</ChipS>)}
          </div>
        </FilterGroup>
        <FilterGroup label={'Max price · ' + moneyS(maxPrice, {cents:false})}>
          <input type="range" min="10" max="35000" step="10" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TS.mono, fontSize: 11, color: TS.faint }}>
            <span>$10</span><span>$35,000+</span>
          </div>
        </FilterGroup>
        <FilterGroup label="Listing type">
          <div style={{ display: 'flex', gap: 8 }}>
            {[['all','All'],['buynow','Buy Now'],['auction','Auction']].map(([v,l]) => (
              <ChipS key={v} active={listType===v} onClick={() => setListType(v)}>{l}</ChipS>
            ))}
          </div>
        </FilterGroup>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 4px' }}>
          <span style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 15 }}>Free shipping only</span>
          <ToggleSwitch on={freeShip} onClick={() => setFreeShip(!freeShip)} />
        </label>
        <button onClick={() => setSheet(null)} style={{
          width: '100%', marginTop: 14, background: TS.accent, color: '#fff', borderRadius: 14,
          padding: 15, fontFamily: TS.sans, fontWeight: 700, fontSize: 16 }}>
          Show {res.length} result{res.length!==1?'s':''}
        </button>
        <button onClick={() => { setGame('all'); setSetF('all'); setCond('Any grade'); setMaxPrice(35000); setFreeShip(false); setListType('all'); }}
          style={{ width: '100%', marginTop: 8, color: TS.muted, fontFamily: TS.sans, fontWeight: 600, fontSize: 14, padding: 8 }}>Reset all</button>
      </SheetS>

      {/* SORT sheet */}
      <SheetS open={sheet==='sort'} onClose={() => setSheet(null)} title="Sort by">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SORTS.map(s => (
            <button key={s} onClick={() => { setSort(s); setSheet(null); }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 4px', borderBottom: '1px solid var(--line-2)',
              fontFamily: TS.sans, fontSize: 16, fontWeight: sort===s?700:500, color: sort===s?TS.accent:TS.ink, textAlign: 'left' }}>
              {s} {sort===s && IconS.check({ style: { color: TS.accent } })}
            </button>
          ))}
        </div>
      </SheetS>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 9, color: TS.ink2 }}>{label}</div>
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 50, height: 30, borderRadius: 999, padding: 3, transition: 'background 0.2s',
      background: on ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        transform: on ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
    </button>
  );
}

Object.assign(window, { SearchScreen, ToggleSwitch, FilterGroup });
