// ─────────────────────────────────────────────────────────────
// Cardconomy Mobile — TCG Game Landing Screen
// ─────────────────────────────────────────────────────────────
const { T: TGM, money: mGM, CardArt: CardArtGM, Icon: IconGM, Logo: LogoGM, BottomNav: BottomNavGM } = window;
const { GAMES: GAMESGM, SETS: SETSGM, LISTINGS: LISTSGM, gameById: gameByIdGM, GAME_LOGOS: GAME_LOGOS_GM } = window;

const GAME_HEROES_GM = {
  pkmn: 'logos/heroes/pkmn.avif', mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg', lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.jpg',
};

const GAME_DESCS_GM = {
  pkmn: 'From Base Set to Scarlet & Violet \u2014 every era of Pok\u00e9mon cards.',
  mtg: '30 years of strategy, art, and collectible value.',
  ygo: 'Fast-paced duels and iconic artwork.',
  lor: 'Stunning art and a rapidly growing collector scene.',
  digimon: 'Gorgeous card art with strong set value retention.',
};

function GameScreen({ app, params }) {
  const game = gameByIdGM(params.id);
  if (!game) return <div style={{ padding: 40, textAlign: 'center' }}>Game not found.</div>;

  const [setFilter, setSetFilter] = React.useState(params.set || 'all');
  const [condFilter, setCondFilter] = React.useState('all');

  const sets = SETSGM.filter(s => s.game === game.id);
  const logo = GAME_LOGOS_GM && GAME_LOGOS_GM[game.id];
  const hero = GAME_HEROES_GM[game.id];

  let listings = LISTSGM.filter(l => l.game === game.id && l.type === 'buynow');
  if (setFilter !== 'all') listings = listings.filter(l => l.set === setFilter);
  if (condFilter === 'graded') listings = listings.filter(l => l.grade && l.grade.company !== 'raw');
  else if (condFilter === 'raw') listings = listings.filter(l => !l.grade || l.grade.company === 'raw');
  listings.sort((a, b) => (b.watchers || 0) + (b.sold || 0) - (a.watchers || 0) - (a.sold || 0));

  const stats = {
    total: listings.length,
    graded: LISTSGM.filter(l => l.game === game.id && l.grade && l.grade.company !== 'raw').length,
  };

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: TGM.bg, paddingBottom: 96 }}>

      {/* ── Standard top bar (hamburger + logo + cart) ── */}
      <div style={{ padding: '14px 16px 10px', background: TGM.surface, borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <button onClick={() => app.openMenu()} style={{ color: TGM.ink, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IconGM.menu({})}</button>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', lineHeight: 1 }}>
            <LogoGM size={32} color={TGM.ink} />
          </div>
          <button onClick={() => app.nav.push('cart')} style={{ position: 'relative', width: 38, height: 38, borderRadius: 999, background: TGM.surface2 || 'var(--surface-2)', color: TGM.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {IconGM.cart ? IconGM.cart({}) : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.1a1.5 1.5 0 001.5-1.2L21 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor"/></svg>}
            {app.cart && app.cart.length > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 999, background: TGM.down || 'var(--down)', color: '#fff',
                fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{app.cart.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: game.tint }}>
        {hero && <img src={hero} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top', opacity: 0.5,
        }} />}
        <div style={{ position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, ${game.tint}50 0%, ${game.tint}cc 60%, ${game.tint} 100%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 16px 18px',
        }}>
          {logo
            ? <img src={logo} alt={game.name} style={{
                maxWidth: 160, maxHeight: 44, objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))', marginBottom: 8,
              }} />
            : <div style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: 26, color: '#fff',
                letterSpacing: -0.5, marginBottom: 8 }}>{game.name}</div>
          }
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            {GAME_DESCS_GM[game.id] || `Browse all ${game.name} cards.`}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {[['Listed', stats.total], ['Graded', stats.graded]].map(([k, v]) => (
              <div key={k} style={{ color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ fontFamily: TGM.mono || 'var(--mono)', fontWeight: 700, fontSize: 17 }}>{v}</span>
                <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 4, fontWeight: 600 }}>{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sets — horizontal scroll ── */}
      <div style={{ padding: '16px 0 0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, padding: '0 14px', marginBottom: 10 }}>Browse by set</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
          WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {/* All tile */}
          <button onClick={() => setSetFilter('all')} style={{
            flexShrink: 0, width: 110, height: 80, borderRadius: 12, scrollSnapAlign: 'start',
            background: setFilter === 'all' ? 'var(--ink)' : 'var(--surface)',
            border: setFilter === 'all' ? 'none' : '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 700, fontSize: 13,
              color: setFilter === 'all' ? '#fff' : 'var(--ink)' }}>All sets</span>
          </button>
          {sets.map(s => {
            const active = setFilter === s.id;
            return (
              <button key={s.id} onClick={() => setSetFilter(active ? 'all' : s.id)} style={{
                flexShrink: 0, width: 140, height: 80, borderRadius: 12, overflow: 'hidden',
                position: 'relative', scrollSnapAlign: 'start',
                border: active ? '2.5px solid var(--ink)' : '1px solid transparent',
                background: s.hue || 'var(--surface)',
              }}>
                {s.img && <img src={s.img} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: 0.5,
                }} />}
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '8px 10px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#fff', lineHeight: 1.2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{s.name.replace(/\s*\(.*\)/, '')}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.year}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Condition filter ── */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 14px 4px' }}>
        {[['all', 'All'], ['raw', 'Raw'], ['graded', 'Graded']].map(([k, l]) => {
          const on = condFilter === k;
          return (
            <button key={k} onClick={() => setCondFilter(k)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
              background: on ? 'var(--ink)' : 'var(--surface)',
              color: on ? '#fff' : 'var(--ink)',
              border: on ? 'none' : '1px solid var(--line)',
            }}>{l}</button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: TGM.muted || 'var(--muted)', fontWeight: 600, alignSelf: 'center' }}>
          {listings.length} card{listings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Results grid ── */}
      <div style={{ padding: '12px 14px 0' }}>
        {listings.length > 0 ? (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {listings.slice(0, 20).map(p => (
              <div key={p.id} onClick={() => app.nav.push('listing', { id: p.id })} style={{
                borderRadius: 12, overflow: 'hidden', background: '#fff',
                border: '1px solid var(--line)', cursor: 'pointer',
              }}>
                <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtGM item={p} w={120} radius={6} />
                  {p.grade && p.grade.company !== 'raw' && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
                      fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 999 }}>
                      {p.grade.company.toUpperCase()} {p.grade.grade}
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 12px 12px' }}>
                  <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontWeight: 700, fontSize: 14, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.subtitle || p.condition}</div>
                  <div style={{ fontFamily: TGM.mono || 'var(--mono)', fontWeight: 700, fontSize: 16, marginTop: 6 }}>{mGM(p.price)}</div>
                  {p.seller && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.seller}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No cards found</div>
            <button onClick={() => { setSetFilter('all'); setCondFilter('all'); }}
              style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Clear filters</button>
          </div>
        )}
        {listings.length > 20 && (
          <button onClick={() => app.nav.setTab('search')}
            style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 10,
              background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            View all {listings.length} listings
          </button>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <BottomNavGM tab={app.nav.tab} setTab={app.nav.setTab} watchCount={(app.watch || []).length} />
    </div>
  );
}

Object.assign(window, { GameScreen });
