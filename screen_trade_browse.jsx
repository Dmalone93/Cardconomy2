// ─────────────────────────────────────────────────────────────
// Trade Browse — card-focused trade marketplace
// ─────────────────────────────────────────────────────────────
const { T: TB, money: moneyB, CardArt: CardArtB, Icon: IconB } = window;
const { TRADE_LISTINGS: TL_DATA, TRADERS: TRADERS_B, byId: byIdB, GAMES: GAMES_B, gameById: gameByIdB, traderById: traderByIdB } = window;

const RADIUS_OPTS = [5, 10, 25, 50];

function TradeBrowseScreen({ app }) {
  const [radius, setRadius] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [gameFilter, setGameFilter] = React.useState('all');

  const listings = TL_DATA.filter(tl => {
    if (tl.dist > radius) return false;
    const card = byIdB(tl.cardId);
    if (!card) return false;
    if (gameFilter !== 'all' && card.game !== gameFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!card.name.toLowerCase().includes(q) && !(card.subtitle || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TB.bg }}>
      {/* header */}
      <div style={{ padding: '14px 14px 12px', background: TB.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TB.ink }}>{IconB.back({})}</button>
        <span style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Trade marketplace</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
        {/* distance control */}
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ fontFamily: TB.sans, fontSize: 12, fontWeight: 600, color: TB.muted, marginBottom: 8 }}>Distance</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RADIUS_OPTS.map(r => (
              <button key={r} onClick={() => setRadius(r)} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, fontFamily: TB.sans, fontWeight: 700, fontSize: 13,
                background: radius === r ? 'var(--ink)' : TB.surface2,
                color: radius === r ? '#fff' : TB.ink,
                border: radius === r ? 'none' : '1px solid var(--line)',
              }}>{r} mi</button>
            ))}
          </div>
        </div>

        {/* search */}
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TB.surface2, borderRadius: 10, padding: '10px 12px',
            boxShadow: 'inset 0 0 0 1px var(--line)' }}>
            {IconB.search({ style: { color: TB.faint, flexShrink: 0 } })}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards available to trade\u2026"
              style={{ flex: 1, fontFamily: TB.sans, fontSize: 14, color: TB.ink, background: 'transparent', border: 'none', outline: 'none' }} />
          </div>
        </div>

        {/* game filter chips */}
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button onClick={() => setGameFilter('all')} style={{
            padding: '6px 14px', borderRadius: 999, fontFamily: TB.sans, fontWeight: 600, fontSize: 12, flexShrink: 0,
            background: gameFilter === 'all' ? 'var(--ink)' : TB.surface2,
            color: gameFilter === 'all' ? '#fff' : TB.ink,
            border: gameFilter === 'all' ? 'none' : '1px solid var(--line)',
          }}>All games</button>
          {GAMES_B.filter(g => g && g.id).map(g => (
            <button key={g.id} onClick={() => setGameFilter(g.id)} style={{
              padding: '6px 14px', borderRadius: 999, fontFamily: TB.sans, fontWeight: 600, fontSize: 12, flexShrink: 0,
              background: gameFilter === g.id ? 'var(--ink)' : TB.surface2,
              color: gameFilter === g.id ? '#fff' : TB.ink,
              border: gameFilter === g.id ? 'none' : '1px solid var(--line)',
            }}>{g.short}</button>
          ))}
        </div>

        {/* results count */}
        <div style={{ padding: '0 16px 10px', fontFamily: TB.sans, fontSize: 12, color: TB.muted, fontWeight: 600 }}>
          {listings.length} card{listings.length !== 1 ? 's' : ''} available within {radius} miles
        </div>

        {/* card grid */}
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: TB.muted, fontFamily: TB.sans, fontSize: 14, lineHeight: 1.6 }}>
            No cards available for trade within {radius} miles.<br/>
            Try increasing your distance or mark your own cards as tradeable.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: '0 16px' }}>
            {listings.map(tl => {
              const card = byIdB(tl.cardId);
              const trader = traderByIdB(tl.trader);
              if (!card || !trader) return null;
              return (
                <button key={tl.id} onClick={() => app.nav.push('trade_propose', { cardId: tl.cardId, traderId: tl.trader })}
                  style={{ textAlign: 'left', background: TB.surface, borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <div style={{ padding: 8, display: 'flex', justifyContent: 'center', background: TB.surface2 }}>
                    <CardArtB item={card} w={130} radius={8} />
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontFamily: TB.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                    <div style={{ fontFamily: TB.sans, fontSize: 11, color: TB.muted, marginTop: 1 }}>{card.subtitle}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneyB(card.market || card.price)}</div>
                    {/* trader info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line-2)' }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: trader.tint, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{trader.initial}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TB.sans, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trader.name}</div>
                        <div style={{ fontFamily: TB.sans, fontSize: 10, color: TB.muted }}>{trader.deals} trades \u00b7 {trader.rating}% \u00b7 {tl.dist} mi</div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TradeBrowseScreen });
