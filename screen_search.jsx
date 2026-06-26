// ─────────────────────────────────────────────────────────────
// Search + filters + results
// ─────────────────────────────────────────────────────────────
const { T: TS, money: moneyS, Chip: ChipS, Icon: IconS, Sheet: SheetS, CardArt: CardArtS } = window;
const { ListRow: ListRowS, ListCard: ListCardS } = window;
const { GAMES: GAMES_S, SETS: SETS_S, LISTINGS: LISTINGS_S, PRODUCTS: PRODUCTS_S, gameById: gameByIdS, setById: setByIdS, byId: byIdS } = window;
const { ProductCard: ProductCardS } = window;
const { HOT_DEALS: HOT_DEALS_S } = window;

const CONDITIONS = ['Any grade', 'Graded only', 'PSA 10', 'Raw / Ungraded'];
const COND_LABELS = { 'Any grade': 'Any grade', 'Graded only': 'Graded only', 'PSA 10': 'PSA 10', 'Raw / Ungraded': 'Raw (ungraded)' };
const SORTS = ['Best match', 'Price: low to high', 'Price: high to low'];

function SearchScreen({ app, params = {} }) {
  const showBack = app.nav.stackDepth > 0;
  const [q, setQ] = React.useState(params.q || '');
  const SEARCH_EX = ['Charizard ex', 'Black Lotus', 'Moonbreon PSA 10', 'Blue-Eyes White Dragon',
    'Surging Sparks booster box', 'Pikachu Illustration Rare', 'Ragavan, Nimble Pilferer', 'Victor Wembanyama Prizm',
    'Scarlet & Violet 151', 'Dark Magician', 'Umbreon VMAX alt art', 'Monkey D. Luffy leader', 'PSA 10 graded slabs',
    'Modern Horizons 3', 'Omnimon alt art', 'Mewtwo 1st edition'];
  const [typed, setTyped] = React.useState(SEARCH_EX[0]);
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
  React.useEffect(() => {
    const el = scrollRefS.current;
    if (!el) return;
    const onScroll = () => setShowTopS(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  });
  const [game, setGame] = React.useState(params.game || 'all');
  const [setF, setSetF] = React.useState(params.set || 'all');
  const [cond, setCond] = React.useState('Any grade');
  const [maxPrice, setMaxPrice] = React.useState(35000);
  const [freeShip, setFreeShip] = React.useState(false);
  const [listType, setListType] = React.useState('all'); // all | buynow
  const [sort, setSort] = React.useState('Best match');
  const [view, setView] = React.useState('grid');
  const [cols, setCols] = React.useState(2);
  const [sheet, setSheet] = React.useState(null); // 'filters' | 'sort'
  const [focused, setFocused] = React.useState(false);
  const [browseMode, setBrowseMode] = React.useState('buy');
  const RECENT_SEARCHES = ['Charizard EX', 'PSA 10 Pikachu', 'MTG Black Lotus', 'Umbreon VMAX alt art'];
  const [showRecent, setShowRecent] = React.useState(true);
  const [showTopS, setShowTopS] = React.useState(false);
  const scrollRefS = React.useRef(null);

  // product results (raw cards grouped)
  const productResults = (cond === 'Graded only' || cond === 'PSA 10') ? [] : PRODUCTS_S.filter(p => {
    if (game !== 'all' && p.game !== game) return false;
    if (setF !== 'all' && p.set !== setF) return false;
    if (q.trim()) {
      const qLow = q.trim().toLowerCase();
      if (!p.name.toLowerCase().includes(qLow) && !(p.subtitle || '').toLowerCase().includes(qLow)) return false;
    }
    if (p.price > maxPrice) return false;
    if (freeShip && !(p.shipping === 0)) return false;
    return true;
  });

  // listing results (graded slabs — exclude raw buy-now since those are products now)
  let listingResults = (cond === 'Raw / Ungraded') ? [] : LISTINGS_S.filter(l => {
    // Exclude raw buy-now listings (they're products now)
    if (l.grade && l.grade.company === 'raw' && l.type === 'buynow') return false;
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
  if (sort === 'Price: low to high') listingResults = [...listingResults].sort((a,b)=>a.price-b.price);
  if (sort === 'Price: high to low') listingResults = [...listingResults].sort((a,b)=>b.price-a.price);

  const totalResults = productResults.length + listingResults.length;

  const activeFilters = [game !== 'all', setF !== 'all', cond !== 'Any grade', freeShip, listType !== 'all', maxPrice < 35000].filter(Boolean).length;
  const popular = ['Charizard ex', 'Moonbreon', 'Black Lotus', 'Blue-Eyes', '151', 'PSA 10'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TS.bg }}>
      {/* search header */}
      <div style={{ padding: '14px 12px 10px', background: TS.surface, borderBottom: '1px solid var(--line)' }}>
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
              placeholder={'Try "' + typed + '"'} style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: TS.sans, fontSize: 15, color: TS.ink, minWidth: 0,
            }} />
            {q && <button onClick={() => setQ('')} style={{ color: TS.faint, fontSize: 18, lineHeight: 1 }}>{'×'}</button>}
            <button onClick={() => app.nav.push('scan', { from: 'search' })} style={{ padding: 4, display: 'flex', color: TS.faint, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* suggestions overlay when focused + empty */}
      {focused && !q && (
        <div ref={scrollRefS} className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 96px' }}>
          {/* recent searches */}
          {showRecent && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, letterSpacing: 0.2 }}>RECENT SEARCHES</div>
                <button onClick={() => setShowRecent(false)} style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 12, color: TS.muted, background: 'none', padding: '2px 4px' }}>Clear</button>
              </div>
              {RECENT_SEARCHES.map(s => (
                <button key={s} onClick={() => { setQ(s); setFocused(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  padding: '10px 0', borderBottom: '1px solid var(--line-2)', background: 'none',
                  fontFamily: TS.sans, fontSize: 14, fontWeight: 500, color: TS.ink,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{'\ud83d\udd50'}</span>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, marginBottom: 10, letterSpacing: 0.2 }}>POPULAR SEARCHES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {popular.map(p => <ChipS key={p} onClick={() => { setQ(p); setFocused(false); }}>{p}</ChipS>)}
          </div>

          {/* recently viewed */}
          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, marginBottom: 10, letterSpacing: 0.2 }}>RECENTLY VIEWED</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {['l01', 'l06', 'l09', 'l07'].map(lid => {
              const card = byIdS(lid);
              if (!card) return null;
              return (
                <button key={lid} onClick={() => app.nav.push('listing', { id: lid })} style={{ flexShrink: 0, width: 80, textAlign: 'center', background: 'none', padding: 0 }}>
                  <div style={{ background: TS.surface, borderRadius: 10, padding: 6, marginBottom: 4, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <CardArtS item={card} w={68} radius={6} />
                  </div>
                  <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 11, color: TS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                </button>
              );
            })}
          </div>

          {/* saved searches */}
          <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.muted, marginBottom: 10, letterSpacing: 0.2 }}>SAVED SEARCHES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {['Charizard NM', 'PSA 10 Pokemon', 'Modern Horizons 3'].map(s => (
              <button key={s} onClick={() => { setQ(s); setFocused(false); }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: TS.sans, fontWeight: 600, fontSize: 13.5,
                padding: '8px 14px', borderRadius: 4, background: TS.surface, color: TS.ink,
                boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                {IconS.search({ width: 14, height: 14, style: { color: TS.faint } })} {s}
              </button>
            ))}
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

      {/* ── Live suggestions dropdown (while typing) ── */}
      {focused && q.trim().length > 0 && (() => {
        const qLow = q.trim().toLowerCase();
        const cardHits = [...PRODUCTS_S, ...LISTINGS_S].filter(c => c.name.toLowerCase().includes(qLow) || (c.subtitle||'').toLowerCase().includes(qLow));
        const seen = {};
        const uniqueCards = cardHits.filter(c => { if (seen[c.name]) return false; seen[c.name] = true; return true; }).slice(0, 5);
        const setHits = SETS_S.filter(s => s.name.toLowerCase().includes(qLow)).slice(0, 3);
        const hasResults = uniqueCards.length > 0 || setHits.length > 0;
        return hasResults ? (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 56, zIndex: 80, background: TS.bg, borderBottom: '1px solid var(--line)', maxHeight: 380, overflow: 'auto', boxShadow: '0 8px 24px rgba(20,24,40,0.12)' }}>
            {uniqueCards.length > 0 && (
              <div>
                <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 11, color: TS.muted, letterSpacing: 0.4, padding: '12px 16px 6px' }}>CARDS</div>
                {uniqueCards.map(c => {
                  const isProduct = !!c.sellers;
                  return (
                    <button key={c.id} onClick={() => { setQ(''); setFocused(false); app.nav.push(isProduct ? 'product' : 'listing', { id: c.id }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', borderBottom: '1px solid var(--line-2)' }}>
                      <div style={{ width: 36, height: 50, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: 'var(--surface-2)' }}>
                        <CardArtS item={c} w={36} radius={4} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 14, color: TS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        <div style={{ fontFamily: TS.sans, fontSize: 12, color: TS.muted }}>{c.subtitle || (c.grade && c.grade.company !== 'raw' ? c.grade.company.toUpperCase() + ' ' + c.grade.grade : 'Raw')}</div>
                      </div>
                      <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 14, color: TS.ink, flexShrink: 0 }}>{moneyS(c.price || c.market)}</div>
                    </button>
                  );
                })}
              </div>
            )}
            {setHits.length > 0 && (
              <div>
                <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 11, color: TS.muted, letterSpacing: 0.4, padding: '12px 16px 6px' }}>SETS</div>
                {setHits.map(s => (
                  <button key={s.id} onClick={() => { setQ(''); setSetF(s.id); setFocused(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', borderBottom: '1px solid var(--line-2)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: (gameByIdS(s.game)||{}).tint || TS.faint, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 14, color: TS.ink }}>{s.name}</div>
                      <div style={{ fontFamily: TS.sans, fontSize: 12, color: TS.muted }}>{s.total ? s.total + ' cards' : (gameByIdS(s.game)||{}).name || ''}</div>
                    </div>
                    {IconS.chevron({ style: { color: TS.faint } })}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setFocused(false)} style={{ width: '100%', padding: '12px 16px', fontFamily: TS.sans, fontWeight: 700, fontSize: 13, color: TS.accent, textAlign: 'center' }}>
              See all {totalResults} result{totalResults !== 1 ? 's' : ''} for {'“'}{q}{'”'}
            </button>
          </div>
        ) : null;
      })()}

      {!(focused && !q) && (
        <React.Fragment>
          {/* filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px 10px', background: TS.bg }}>
            <button onClick={() => setSheet('filters')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0,
              fontFamily: TS.sans, fontWeight: 700, fontSize: 13.5, padding: '8px 14px', borderRadius: 999,
              background: activeFilters ? TS.ink : TS.surface, color: activeFilters ? '#fff' : TS.ink2,
              boxShadow: activeFilters ? 'none' : 'inset 0 0 0 1px var(--line)' }}>
              {IconS.filter({ width: 16, height: 16 })} Filters{activeFilters ? ' · ' + activeFilters : ''}
            </button>
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center', padding: '2px 0' }}>
              <ChipS active={listType==='buynow'} onClick={() => setListType(listType==='buynow'?'all':'buynow')}>Buy Now</ChipS>
              <ChipS active={cond==='Graded only'} onClick={() => setCond(cond==='Graded only'?'Any grade':'Graded only')}>Graded</ChipS>
              <ChipS active={freeShip} onClick={() => setFreeShip(!freeShip)}>Free ship</ChipS>
            </div>
          </div>

          {/* ── Browse mode tabs ── */}
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px 0' }}>
            {[['buy', 'Buy'], ['new', 'Just Listed'], ['deals', 'Deals']].map(([key, label]) => (
              <div key={key} onClick={() => setBrowseMode(key)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: browseMode === key ? TS.accent : TS.surface,
                color: browseMode === key ? '#fff' : TS.ink,
                border: browseMode === key ? 'none' : '1px solid ' + TS.line,
              }}>{label}</div>
            ))}
          </div>

          {/* set header */}
          {setF !== 'all' && setByIdS(setF) && (() => {
            const setInfo = setByIdS(setF);
            const gameInfo = gameByIdS(setInfo.game);
            return (
              <div style={{ margin: '0 16px 12px', padding: '14px 16px', background: setInfo.hue || 'var(--fill)', borderRadius: 4, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                {setInfo.img && <img src={setInfo.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />}
                <div style={{ position: 'relative' }}>
                  {gameInfo && <div style={{ fontFamily: TS.sans, fontWeight: 700, fontSize: 10, opacity: 0.8, letterSpacing: 0.4, marginBottom: 4 }}>{gameInfo.short.toUpperCase()}</div>}
                  <div style={{ fontFamily: TS.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{setInfo.name.replace(/\s*\(.*\)/, '')}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, fontFamily: TS.sans, fontSize: 12, opacity: 0.85 }}>
                    <span>{setInfo.cards} cards</span>
                    <span>Released {setInfo.year}</span>
                  </div>
                  <button onClick={() => { setSetF('all'); }} style={{ position: 'absolute', top: 0, right: 0, color: 'rgba(255,255,255,0.7)', fontFamily: TS.sans, fontWeight: 700, fontSize: 18, background: 'none', padding: '0 2px', lineHeight: 1 }}>×</button>
                </div>
              </div>
            );
          })()}

          {/* result meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 16px 10px' }}>
            <span style={{ fontFamily: TS.sans, fontSize: 13, color: TS.muted }}>
              <b style={{ color: TS.ink }}>{totalResults}</b> result{totalResults!==1?'s':''}
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button onClick={() => setSheet('sort')} style={{ fontFamily: TS.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', padding: '4px 6px' }}>{sort} ▾</button>
              {view === 'grid' && (
                <button onClick={() => setCols(cols === 2 ? 3 : 2)} style={{ color: TS.ink, padding: 4 }}>
                  {cols === 2 ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="5" height="8" rx="1" fill="currentColor"/><rect x="10" y="3" width="5" height="8" rx="1" fill="currentColor"/><rect x="17" y="3" width="5" height="8" rx="1" fill="currentColor"/><rect x="3" y="13" width="5" height="8" rx="1" fill="currentColor"/><rect x="10" y="13" width="5" height="8" rx="1" fill="currentColor"/><rect x="17" y="13" width="5" height="8" rx="1" fill="currentColor"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor"/><rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor"/></svg>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* results */}
          {(() => {
            // Build merged array: products tagged with type 'product', listings as-is
            const merged = [
              ...productResults.map(p => ({ ...p, _type: 'product' })),
              ...listingResults.map(l => ({ ...l, _type: 'listing' })),
            ];
            // Apply browse mode filter
            const dealIds = new Set((HOT_DEALS_S || []).map(d => d.id));
            let browsed = merged;
            if (browseMode === 'new') {
              browsed = [...merged].reverse(); // newest first (reverse of default)
            } else if (browseMode === 'deals') {
              browsed = merged.filter(x => dealIds.has(x.id));
            }
            const browseCount = browsed.length;
            return (
              <div ref={scrollRefS} className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
                {browseCount === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '72px 32px', textAlign: 'center', fontFamily: TS.sans }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: TS.faint, marginBottom: 16 }}>
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div style={{ fontWeight: 700, fontSize: 17, color: TS.ink, marginBottom: 6 }}>No cards match your filters</div>
                    <div style={{ fontSize: 14, color: TS.muted, lineHeight: 1.5, marginBottom: 24 }}>Try adjusting your filters or browse all cards</div>
                    <button onClick={() => {
                      setGame('all'); setSetF('all'); setCond('Any grade');
                      setMaxPrice(35000); setFreeShip(false); setListType('all'); setBrowseMode('buy');
                    }} style={{
                      background: 'var(--ink)', color: '#fff', borderRadius: 12,
                      padding: '11px 24px', fontFamily: TS.sans, fontWeight: 700, fontSize: 15,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}>Clear filters</button>
                  </div>
                ) : view === 'grid' ? (
                  <div className="stagger" style={{ display: 'grid', gridTemplateColumns: cols === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: cols === 3 ? 8 : 12 }}>
                    {browsed.map(x => x._type === 'product'
                      ? <ProductCardS key={'p-'+x.id} product={x} app={app} />
                      : <ListCardS key={x.id} item={x} app={app} />
                    )}
                  </div>
                ) : (
                  <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {browsed.map(x => x._type === 'product'
                      ? <ProductCardS key={'p-'+x.id} product={x} app={app} />
                      : <ListRowS key={x.id} item={x} app={app} />
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </React.Fragment>
      )}

      {/* back to top */}
      <button onClick={() => scrollRefS.current && scrollRefS.current.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'fixed', bottom: 80, right: 16, width: 40, height: 40, borderRadius: 999,
          background: 'var(--ink)', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center',
          justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 40,
          opacity: showTopS ? 1 : 0, pointerEvents: showTopS ? 'auto' : 'none',
          transition: 'opacity 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        aria-label="Back to top">{'↑'}</button>

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
          <div style={{ marginTop: 10, fontSize: 11, color: TS.faint, lineHeight: 1.6, fontFamily: TS.sans }}>
            <b style={{ color: TS.muted }}>Condition guide:</b> NM = Near Mint (like new) · LP = Lightly Played (minor edge wear) · MP = Moderately Played (visible wear) · HP = Heavily Played (heavy wear). Graded cards are professionally assessed by PSA, BGS, or CGC.
          </div>
        </FilterGroup>
        <FilterGroup label={'Max price · ' + moneyS(maxPrice, {cents:false})}>
          <input type="range" min="10" max="35000" step="10" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TS.sans, fontSize: 11, color: TS.faint }}>
            <span>£10</span><span>£35,000+</span>
          </div>
        </FilterGroup>
        <FilterGroup label="Listing type">
          <div style={{ display: 'flex', gap: 8 }}>
            {[['all','All'],['buynow','Buy Now']].map(([v,l]) => (
              <ChipS key={v} active={listType===v} onClick={() => setListType(v)}>{l}</ChipS>
            ))}
          </div>
        </FilterGroup>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 4px' }}>
          <span style={{ fontFamily: TS.sans, fontWeight: 600, fontSize: 15 }}>Free shipping only</span>
          <ToggleSwitch on={freeShip} onClick={() => setFreeShip(!freeShip)} />
        </label>
        <button onClick={() => setSheet(null)} style={{
          width: '100%', marginTop: 14, background: 'var(--ink)', color: '#fff', borderRadius: 14,
          padding: 15, fontFamily: TS.sans, fontWeight: 700, fontSize: 16 }}>
          Show {totalResults} result{totalResults!==1?'s':''}
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
              {s} {sort===s && IconS.check({ style: { color: 'var(--ink)' } })}
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
