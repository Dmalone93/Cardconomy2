// ─────────────────────────────────────────────────────────────
// Home / browse / discovery  (+ shared ListCard / ListRow)
// ─────────────────────────────────────────────────────────────
const { T, money, CardArt, Slab, GradeChip, Sparkline, Delta, Stars, Chip, Icon, Logo } = window;
const { GAMES, SETS, LISTINGS, LOTS, PRODUCTS, gameById, setById, gradeText } = window;

// ── shared: grid tile ────────────────────────────────────────
function ListCard({ item, app, w }) {
  const watched = app.isWatched(item.id);
  const isAuction = item.type === 'auction';
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      width: w || '100%', textAlign: 'left', background: T.surface, cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
    }}>
      <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#ffffff' }}>
        <CardArt item={item} w={140} />
        <button onClick={(e) => { e.stopPropagation(); app.toggleWatch(item.id); }} style={{
          position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999,
          background: 'var(--glass)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: watched ? T.down : T.muted, boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        }}>{Icon.heart({ width: 18, height: 18 }, watched)}</button>
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <GradeChip grade={item.grade} />
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15, letterSpacing: -0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 1, marginBottom: 8,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle || item.condition}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.ink }}>{money(item.price)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7,
          fontFamily: T.sans, fontSize: 11, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {isAuction ? (
            <span style={{ color: T.down, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              {Icon.gavel({ width: 12, height: 12 })} {item.bids} bids · {item.timeLeft}
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {Icon.bolt({ width: 11, height: 11, style: { color: T.accent } })}
              {item.shipping === 0 ? 'Free shipping' : money(item.shipping) + ' ship'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── shared: product grid tile ────────────────────────────────
function ProductCard({ product, app, w }) {
  const g = gameById(product.game);
  return (
    <div onClick={() => app.nav.push('product', { id: product.id })} role="button" style={{
      width: w || '100%', textAlign: 'left', background: T.surface, cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
    }}>
      <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#ffffff' }}>
        <CardArt item={product} w={140} />
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15, letterSpacing: -0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 1, marginBottom: 8,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.subtitle}</div>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.ink }}>{money(product.market)}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginTop: 4 }}>
          from {money(product.low)} · {product.offerCount} seller{product.offerCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

// ── shared: horizontal list row ──────────────────────────────
function ListRow({ item, app }) {
  const watched = app.isWatched(item.id);
  return (
    <button onClick={() => app.nav.push('listing', { id: item.id })} style={{
      width: '100%', textAlign: 'left', background: T.surface, borderRadius: 4,
      padding: 10, display: 'flex', gap: 12, alignItems: 'center',
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <div style={{ background: '#ffffff', borderRadius: 4, padding: 7, flexShrink: 0 }}>
        <CardArt item={item} w={54} radius={4} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
          <GradeChip grade={item.grade} />
          {item.foil && <span style={{ fontFamily: T.sans, fontSize: 10, color: T.muted }}>Foil</span>}
        </div>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14.5, letterSpacing: -0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {setById(item.set) ? setById(item.set).name : ''} · {item.number}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15.5 }}>{money(item.price)}</div>
        {item.type === 'auction'
          ? <div style={{ fontFamily: T.sans, fontSize: 11, color: T.down, fontWeight: 600 }}>{item.timeLeft}</div>
          : <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>{item.shipping === 0 ? 'Free ship' : money(item.shipping)}</div>}
      </div>
    </button>
  );
}

// ── ad carousel ──────────────────────────────────────────────
// each banner's id is a game id, so we can show only ads for games the user follows
const AD_BANNERS = [
  { id: 'pkmn', src: 'ads/pokemon.webp', tint: '#1f4d3a', tag: 'Pokémon TCG', cta: 'New: Surging Sparks' },
  { id: 'lor', src: 'ads/onepiece.webp', tint: '#7c4a1e', tag: 'One Piece Card Game', cta: 'Shop the latest set' },
  { id: 'ygo', src: 'ads/yugioh.webp', tint: '#1a2740', tag: 'Yu-Gi-Oh!', cta: '25th Anniversary in stock' },
];

function AdCarousel({ onPick, app }) {
  const banners = AD_BANNERS.filter(ad => !app || app.inPrefs(ad.id));
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  // keep index in range when the followed-games set changes
  React.useEffect(() => { setI(0); }, [banners.length]);
  React.useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(() => setI(n => (n + 1) % banners.length), 4200);
    return () => clearInterval(t);
  }, [paused, banners.length]);
  if (banners.length === 0) return null;
  return (
    <div style={{ padding: '12px 16px 0' }}>
      <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', height: 132,
        boxShadow: '0 1px 3px rgba(20,24,40,0.06), 0 8px 20px rgba(20,24,40,0.08)' }}
        onTouchStart={() => setPaused(true)}>
        {banners.map((ad, n) => (
          <button key={ad.id} onClick={() => onPick(ad.id)} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, textAlign: 'left',
            opacity: n === i ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: n === i ? 'auto' : 'none',
            background: ad.tint }}>
            <img src={ad.src} alt={ad.tag} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)' }} />
            <div style={{ position: 'absolute', top: 10, left: 12, fontFamily: T.sans, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.4,
              color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px' }}>SPONSORED</div>
            <div style={{ position: 'absolute', left: 14, bottom: 13, right: 14 }}>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{ad.tag}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, fontFamily: T.sans, fontWeight: 700, fontSize: 12,
                color: '#fff', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', borderRadius: 999, padding: '5px 11px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }}>
                {ad.cta} <span style={{ fontSize: 13 }}>→</span>
              </div>
            </div>
          </button>
        ))}
        {/* dots */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 5, zIndex: 2 }}>
          {banners.map((_, n) => (
            <button key={n} onClick={() => { setI(n); setPaused(true); }} style={{ width: n === i ? 16 : 6, height: 6, borderRadius: 999,
              background: n === i ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, padding: '0 16px 12px' }}>
      <h2 style={{ margin: 0, fontFamily: T.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3, whiteSpace: 'nowrap' }}>{title}</h2>
      {action && <button onClick={onAction} style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 600, color: T.accent, whiteSpace: 'nowrap', flexShrink: 0 }}>{action}</button>}
    </div>
  );
}

// ── set tile ─────────────────────────────────────────────────
function SetTile({ set, onClick }) {
  const g = gameById(set.game);
  return (
    <button onClick={onClick} style={{
      width: 150, flexShrink: 0, textAlign: 'left', borderRadius: 4, overflow: 'hidden',
      background: set.hue, color: '#fff', position: 'relative', height: 96,
      padding: 13, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      boxShadow: '0 4px 14px rgba(20,24,40,0.12)',
    }}>
      {set.img
        ? <React.Fragment>
            <img src={set.img} alt={set.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)' }} />
          </React.Fragment>
        : <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)' }} />}
      <div style={{ position: 'absolute', top: 11, left: 13, fontFamily: T.sans, fontWeight: 700, fontSize: 10.5, opacity: 0.9, letterSpacing: 0.3, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{g.short.toUpperCase()}</div>
      <div style={{ position: 'relative', fontFamily: T.sans, fontWeight: 800, fontSize: 15, lineHeight: 1.1, letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{set.name.replace(/\s*\(.*\)/, '')}</div>
      <div style={{ position: 'relative', fontFamily: T.sans, fontSize: 10.5, opacity: 0.9, marginTop: 2, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{set.cards} cards · {set.year}</div>
    </button>
  );
}

// ── HOME SCREEN ──────────────────────────────────────────────
function HomeScreen({ app }) {
  const [game, setGame] = React.useState('all');
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const myGames = GAMES.filter(g => app.inPrefs(g.id));
  // if the active chip leaves prefs, snap back to "all"
  React.useEffect(() => { if (game !== 'all' && !app.inPrefs(game)) setGame('all'); }, [app.prefs]);
  const RELIABLE_IMG = new Set(['pkmn', 'mtg', 'ygo']);
  const hasImage = (x) => RELIABLE_IMG.has(x.game);
  const inFeed = (x) => app.inPrefs(x.game) && hasImage(x);
  const filt = (arr) => (game === 'all' ? arr.filter(inFeed) : arr.filter(x => x.game === game && hasImage(x)));
  const auctions = filt(LISTINGS.filter(l => l.type === 'auction'));
  const trendingProducts = filt(PRODUCTS);
  const sets = filt(SETS).filter(s => s.img);
  const graded = filt(LISTINGS.filter(l => l.grade.company !== 'raw'));
  const lots = filt(LOTS);

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: T.bg, paddingBottom: 96 }}>
      {/* top bar */}
      <div style={{ padding: '58px 16px 10px', background: T.surface, borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, position: 'relative' }}>
          <button onClick={() => app.openMenu()} style={{ color: T.ink, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Icon.menu({})}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Logo size={26} color={T.accent} />
            <img src="brand/wordmark.png" alt="CARDONOMY" style={{ height: 16, width: 'auto', display: 'block', filter: 'var(--logo-invert, none)' }} />
          </div>
          <button onClick={() => app.nav.push('cart')} style={{ position: 'relative', width: 38, height: 38, borderRadius: 999, background: T.surface2, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Icon.cart({ width: 20, height: 20 })}
            {app.cartCount > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 999, background: T.accent, color: '#fff',
                fontFamily: T.sans, fontWeight: 700, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxShadow: '0 0 0 2px var(--surface)' }}>{app.cartCount}</span>
            )}
          </button>
        </div>
        <button onClick={() => app.nav.setTab('search')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left',
          background: T.surface2, borderRadius: 4, padding: '11px 14px', color: T.muted,
          boxShadow: 'inset 0 0 0 1px var(--line)',
        }}>
          {Icon.search({ style: { color: T.faint } })}
          <span style={{ fontFamily: T.sans, fontSize: 14.5 }}>Search Charizard, Black Lotus, sets…</span>
        </button>
      </div>

      {/* sponsored ad carousel */}
      <AdCarousel app={app} onPick={(id) => setGame(id)} />

      {/* game chips — only games you follow, editable inline */}
      <div className="noscroll" style={{ display: 'flex', gap: 8, padding: '12px 16px 0', overflowX: 'auto', alignItems: 'center' }}>
        <Chip active={game === 'all'} onClick={() => setGame('all')}>{app.allGamesSelected() ? 'All games' : 'My games'}</Chip>
        {myGames.map(g => {
          const logo = window.GAME_LOGOS[g.id];
          const on = game === g.id;
          if (logo) {
            return (
              <button key={g.id} onClick={() => setGame(g.id)} title={g.name} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, height: 38, padding: '0 16px',
                borderRadius: 999, background: on ? '#fff' : T.surface,
                boxShadow: on ? '0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)', transition: 'box-shadow 0.15s' }}>
                <img src={logo} alt={g.name} style={{ height: 19, width: 'auto', maxWidth: 84, objectFit: 'contain', display: 'block', filter: on ? 'none' : 'saturate(0.92)' }} />
              </button>
            );
          }
          return (
            <Chip key={g.id} active={on} onClick={() => setGame(g.id)}
              leading={<span style={{ width: 8, height: 8, borderRadius: 999, background: g.tint }} />}>{g.short}</Chip>
          );
        })}
        <button onClick={() => setPrefsOpen(true)} title="Edit games" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 999, background: T.surface,
          color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          {Icon.filter ? Icon.filter({ width: 18, height: 18 }) : '⚙'}
        </button>
      </div>
      {window.GamePrefsSheet && <window.GamePrefsSheet app={app} open={prefsOpen} onClose={() => setPrefsOpen(false)} games={GAMES} />}

      {/* featured — swaps with the selected game */}
      <div style={{ paddingTop: 20 }}>
        <FeaturedRail app={app} game={game} onPick={(id) => setGame(id)} />
      </div>

      {/* your active bids — pinned to top */}
      {(() => {
        const myBids = app.myBids
          .map(b => ({ ...b, item: window.byId(b.id) }))
          .filter(b => b.item && (game === 'all' ? app.inPrefs(b.item.game) : b.item.game === game));
        if (myBids.length === 0) return null;
        return (
          <div style={{ paddingTop: 20 }}>
            <SectionHeader title="Your bids" action="View all" onAction={() => app.nav.setTab('watch')} />
            <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
              {myBids.map(b => {
                const top = b.amount >= b.item.price;
                return (
                  <button key={b.id} onClick={() => app.nav.push('listing', { id: b.id })} style={{ width: 200, flexShrink: 0, textAlign: 'left',
                    background: T.surface, borderRadius: 4, padding: 12, display: 'flex', gap: 11, alignItems: 'center',
                    boxShadow: 'inset 0 0 0 1.5px ' + (top ? 'var(--accent)' : 'var(--down)') }}>
                    <div style={{ background: '#ffffff', borderRadius: 4, padding: 6, flexShrink: 0 }}><CardArt item={b.item} w={44} radius={4} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: T.sans, fontWeight: 800, fontSize: 10.5,
                        color: top ? T.accent : T.down, marginBottom: 2 }}>
                        {Icon.gavel({ width: 11, height: 11 })} {top ? 'TOP BID' : 'OUTBID'}
                      </div>
                      <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.item.name}</div>
                      <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13, marginTop: 1 }}>{money(b.amount)} <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 10.5, color: T.muted }}>· {b.item.timeLeft}</span></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ending soon auctions */}
      {auctions.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <SectionHeader title="Ending soon" action="All auctions" onAction={() => app.nav.setTab('search')} />
          <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
            {auctions.map(l => <div key={l.id} style={{ width: 168, flexShrink: 0 }}><ListCard item={l} app={app} /></div>)}
          </div>
        </div>
      )}

      {/* trending grid */}
      {trendingProducts.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <SectionHeader title="Trending now" action="See all" onAction={() => app.nav.setTab('search')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
            {trendingProducts.slice(0, 6).map(p => <ProductCard key={p.id} product={p} app={app} />)}
          </div>
        </div>
      )}

      {/* shop by set */}
      {sets.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <SectionHeader title="Shop by set" action="Browse all" onAction={() => app.nav.setTab('search')} />
          <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
            {sets.map(s => <SetTile key={s.id} set={s} onClick={() => app.nav.push('search', { set: s.id })} />)}
          </div>
        </div>
      )}

      {/* graded spotlight */}
      {graded.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <SectionHeader title="Graded spotlight" action="PSA · BGS · CGC" />
          <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '4px 16px 8px', overflowX: 'auto' }}>
            {graded.map(l => {
              const gWatched = app.isWatched(l.id);
              const gAuction = l.type === 'auction';
              return (
                <div key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} role="button" style={{
                  flexShrink: 0, width: 168, textAlign: 'left', background: T.surface, cursor: 'pointer',
                  borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
                }}>
                  <div style={{ position: 'relative', padding: '14px 14px 10px', display: 'flex', justifyContent: 'center', background: '#ffffff' }}>
                    <Slab item={l} w={130} />
                    <button onClick={(e) => { e.stopPropagation(); app.toggleWatch(l.id); }} style={{
                      position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999,
                      background: 'var(--glass)', backdropFilter: 'blur(6px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: gWatched ? T.down : T.muted, boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                    }}>{Icon.heart({ width: 18, height: 18 }, gWatched)}</button>
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <GradeChip grade={l.grade} />
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15, letterSpacing: -0.2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 1, marginBottom: 8,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.subtitle || l.condition}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.ink }}>{money(l.price)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7,
                      fontFamily: T.sans, fontSize: 11, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {gAuction ? (
                        <span style={{ color: T.down, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                          {Icon.gavel({ width: 12, height: 12 })} {l.bids} bids · {l.timeLeft}
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {Icon.bolt({ width: 11, height: 11, style: { color: T.accent } })}
                          {l.shipping === 0 ? 'Free shipping' : money(l.shipping) + ' ship'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* bulk lots */}
      {lots.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <SectionHeader title="Bulk lots & collections" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
            {lots.map(lot => <LotRow key={lot.id} lot={lot} app={app} />)}
          </div>
        </div>
      )}

      {/* collector's corner — help & education */}
      <div style={{ paddingTop: 20 }}>
        <SectionHeader title="Collector's corner" action="All guides" onAction={() => app.toast('Opening the help center')} />
        <div style={{ padding: '0 16px', marginTop: -2, marginBottom: 12 }}>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, lineHeight: 1.45 }}>New to collecting, or want to protect what you own? Start here.</div>
        </div>
        <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
          {GUIDES.map(gd => (
            <button key={gd.id} onClick={() => app.toast(gd.title)} style={{ flexShrink: 0, width: 232, textAlign: 'left',
              background: T.surface, borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05), 0 6px 16px rgba(20,24,40,0.05)',
              position: 'relative', height: 218, display: 'block' }}>
              <img src={gd.src} alt={gd.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 28%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.85) 100%)' }} />
              <span style={{ position: 'absolute', top: 11, left: 11, fontFamily: T.sans, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.4,
                color: T.accent, background: '#fff', borderRadius: 6, padding: '3px 8px' }}>{gd.tag}</span>
              <div style={{ position: 'absolute', left: 13, bottom: 13, right: 13 }}>
                <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{gd.title}</div>
                <div style={{ fontFamily: T.sans, fontSize: 12, color: 'rgba(255,255,255,0.88)', lineHeight: 1.4, marginTop: 4, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{gd.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 9, fontFamily: T.sans, fontWeight: 700, fontSize: 12.5, color: '#fff' }}>
                  {gd.cta} <span>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── featured / spotlight rail (pref-aware editorial content) ──
const SPOTLIGHT = [
  // Pokémon
  { game: 'pkmn', src: 'content/pkmn-151.png', title: 'Scarlet & Violet 151', sub: 'The set everyone’s chasing — singles & lots', pos: 'center' },
  { game: 'pkmn', src: 'content/pkmn-grails.webp', title: 'The grail cards', sub: 'Illustrator Pikachu & 1st-edition Charizard', pos: 'center' },
  { game: 'pkmn', src: 'content/pkmn-slabs.jpg', title: 'Graded & protected', sub: 'PSA-slabbed vintage holos', pos: 'center 30%' },
  // One Piece
  { game: 'lor', src: 'content/op-crew.webp', title: 'One Piece Card Game', sub: 'The whole crew, in your binder', pos: 'center' },
  { game: 'lor', src: 'content/op-25th.jpg', title: 'Anime 25th Collection', sub: 'EB-02 sealed booster boxes in stock', pos: 'center' },
  { game: 'lor', src: 'content/op-magazine.jpg', title: 'One Piece Magazine', sub: 'Promo cards & collector features', pos: 'center top' },
  // Yu-Gi-Oh!
  { game: 'ygo', src: 'content/ygo-gods.webp', title: 'The Egyptian Gods', sub: 'Ra, Slifer & Obelisk — vintage holos', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-meta.jpg', title: 'Today’s meta', sub: 'Tournament staples & new releases', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-duelpower.gif', title: 'Duel Power', sub: 'Collector boxes & sealed product', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-locals.webp', title: 'Locals night', sub: 'Find a Yu-Gi-Oh! event near you', pos: 'center', action: 'shopfinder' },
  // Magic: The Gathering
  { game: 'mtg', src: 'content/mtg-brand.webp', title: 'Magic: The Gathering', sub: 'Singles, sealed & graded — all eras', pos: 'center' },
  { game: 'mtg', src: 'content/mtg-mh3.webp', title: 'Modern Horizons 3', sub: 'Preorder Commander decks now', pos: 'center' },
  { game: 'mtg', src: 'content/mtg-packs.jpeg', title: 'Endless possibilities', sub: 'Every pack, 15 cards — open a world', pos: 'center 22%' },
  { game: 'mtg', src: 'content/mtg-locals.png', title: 'Locals night', sub: 'Find a Magic event near you', pos: 'center', action: 'shopfinder' },
];

function FeaturedRail({ app, game, onPick }) {
  const cards = SPOTLIGHT.filter(c => game && game !== 'all' ? c.game === game : app.inPrefs(c.game));
  if (cards.length === 0) return null;
  const tint = { pkmn: '#d4a017', mtg: '#c2691b', ygo: '#7c4dd1', lor: '#c0392b', digimon: '#1f8fd6' };
  return (
    <div>
      <SectionHeader title={game && game !== 'all' ? 'Featured in ' + (gameById(game) ? gameById(game).short : '') : 'Featured'} action="See all" onAction={() => app.toast('Opening featured')} />
      <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
        {cards.map((c, n) => {
          const g = gameById(c.game);
          return (
            <button key={n} onClick={() => c.action ? app.nav.push(c.action) : onPick(c.game)} style={{ flexShrink: 0, width: 244, textAlign: 'left',
              background: T.surface, borderRadius: 4, overflow: 'hidden', position: 'relative', height: 210, display: 'block',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05), 0 6px 16px rgba(20,24,40,0.06)' }}>
              <img src={c.src} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos || 'center', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 30%, rgba(0,0,0,0.4) 64%, rgba(0,0,0,0.86) 100%)' }} />
              <span style={{ position: 'absolute', top: 11, left: 11, display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: T.sans, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.4,
                color: '#fff', background: (tint[c.game] || '#000') + 'e6', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '4px 8px' }}>
                {g ? g.short.toUpperCase() : 'TCG'}
              </span>
              <div style={{ position: 'absolute', left: 13, bottom: 13, right: 13 }}>
                <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 16.5, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{c.title}</div>
                <div style={{ fontFamily: T.sans, fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, marginTop: 3, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{c.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// guide tiles for Collector's corner
const GUIDES = [
  { id: 'grading', src: 'ads/learn-grading.jpg', tag: 'GUIDE', title: 'How grading works', desc: 'PSA, BGS & CGC scales explained — what each grade means for value.', cta: 'Learn grading' },
  { id: 'auth', src: 'ads/learn-authenticate.jpg', tag: 'PROTECT', title: 'Buy with confidence', desc: 'How authentication & Buyer Protection keep every purchase safe.', cta: 'How we verify' },
  { id: 'care', src: 'ads/learn-protect.jpg', tag: 'CARE', title: 'Store & protect', desc: 'Sleeves, toploaders & vaulting to keep your collection mint.', cta: 'Care tips' },
];

// ── bulk lot row ─────────────────────────────────────────────
function LotRow({ lot, app }) {
  const g = gameById(lot.game);
  return (
    <button onClick={() => app.nav.push('listing', { id: lot.id })} style={{
      width: '100%', textAlign: 'left', background: T.surface, borderRadius: 4,
      padding: 12, display: 'flex', gap: 12, alignItems: 'center',
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <div style={{
        width: 58, height: 58, borderRadius: 4, flexShrink: 0, position: 'relative',
        background: lot.art, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', overflow: 'hidden',
      }}>
        {lot.img
          ? <img src={lot.img} alt={lot.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <React.Fragment>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 6px, transparent 6px 12px)' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 17, lineHeight: 1 }}>{lot.count >= 1000 ? (lot.count/1000)+'k' : lot.count}</div>
                <div style={{ fontFamily: T.sans, fontSize: 8.5, opacity: 0.85 }}>CARDS</div>
              </div>
            </React.Fragment>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13.5, lineHeight: 1.2, letterSpacing: -0.2 }}>{lot.name}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lot.note}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 5 }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15 }}>{money(lot.price)}</span>
          <span style={{ fontFamily: T.sans, fontSize: 11.5, color: T.faint, textDecoration: 'line-through' }}>{money(lot.market)}</span>
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { ListCard, ListRow, LotRow, SectionHeader, SetTile, HomeScreen, ProductCard });
