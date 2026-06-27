// ─────────────────────────────────────────────────────────────
// Home / browse / discovery  (+ shared ListCard / ListRow)
// ─────────────────────────────────────────────────────────────
const { T, money, CardArt, Slab, GradeChip, Sparkline, Delta, Stars, Chip, Icon, Logo } = window;
const { GAMES, SETS, LISTINGS, LOTS, PRODUCTS, gameById, setById, gradeText, GAME_LOGOS } = window;
const { HOT_DEALS, PRICE_MOVERS, byId } = window;

// ── Hero — full bleed with upward-scrolling card grid ────────
const HERO_COLS = [
  ['l01', 'l06', 'l09', 'l08', 'l03'],
  ['l05', 'l02', 'l04', 'l07', 'l11'],
];

function CardFan({ app }) {
  const gridCards = HERO_COLS.map(col => col.map(id => byId(id)).filter(Boolean));

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--fill)', height: 320 }}>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes heroScrollUp{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}' }} />

      {/* text content — full width, layered over the grid */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 26, color: '#fff',
          letterSpacing: -0.5, lineHeight: 1.12 }}>
          The UK home for<br/>trading cards
        </div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginTop: 10, maxWidth: 220 }}>
          Buy, sell, and trade across every game. Lower fees than anyone.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={() => app.nav.setTab('search')} style={{ padding: '11px 20px', borderRadius: 10,
            background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            Start browsing
          </button>
          <button onClick={() => app.nav.push('pitch_seller')} style={{ padding: '11px 20px', borderRadius: 10,
            background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: 14,
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            Start selling
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
          {[[Icon.shield, 'Protected'], [Icon.tag, '6%+30p'], [Icon.bolt, '5 games']].map(([ic, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.45)', fontSize: 10.5, fontWeight: 600 }}>
              {ic({ width: 11, height: 11 })}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* right: 2 scrolling columns behind a gradient scrim */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', overflow: 'hidden', zIndex: 1 }}>
        {/* fades */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 2,
          background: 'linear-gradient(to bottom, var(--fill), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, zIndex: 2,
          background: 'linear-gradient(to top, var(--fill), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, zIndex: 2,
          background: 'linear-gradient(to right, var(--fill), transparent)' }} />

        <div style={{ display: 'flex', gap: 6, height: '100%', paddingRight: 6 }}>
          {gridCards.map((col, ci) => {
            var speed = [40, 50][ci];
            var offset = [0, -50][ci];
            return (
              <div key={ci} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  animation: 'heroScrollUp ' + speed + 's linear infinite',
                  marginTop: offset,
                }}>
                  {[0, 1].map(dup => (
                    <React.Fragment key={dup}>
                      {col.map((card, ri) => (
                        <div key={card.id + '-' + dup + '-' + ri}
                          style={{ borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <CardArt item={card} w={200} radius={6} />
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── shared: grid tile ────────────────────────────────────────
function ListCard({ item, app, w }) {
  const watched = app.isWatched(item.id);
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => {
    if (window.CardImg) {
      window.CardImg.get(item, (url) => { if (!url) setImgFailed(true); });
    }
  }, [item.name]);
  if (imgFailed) return null;
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      width: w || '100%', textAlign: 'left', background: '#fff', cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      border: '1px solid var(--line)',
    }}>
      <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff' }}>
        {item.grade && item.grade.company !== 'raw'
          ? <Slab item={item} w={115} />
          : <CardArt item={item} w={140} />}
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {Icon.bolt({ width: 11, height: 11, style: { color: 'var(--ink)' } })}
            {item.shipping === 0 ? 'Free shipping' : money(item.shipping) + ' ship'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── shared: product grid tile ────────────────────────────────
function ProductCard({ product, app, w }) {
  const g = gameById(product.game);
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => {
    if (window.CardImg) {
      window.CardImg.get(product, (url) => { if (!url) setImgFailed(true); });
    }
  }, [product.name]);
  if (imgFailed) return null;
  return (
    <div onClick={() => app.nav.push('product', { id: product.id })} role="button" style={{
      width: w || '100%', textAlign: 'left', background: '#fff', cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      border: '1px solid var(--line)',
    }}>
      <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#ffffff', overflow: 'hidden' }}>
        <CardArt item={product} w={140} />
        {product.offerCount > 0 && (
          <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
            fontFamily: T.sans, fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 999,
            backdropFilter: 'blur(4px)' }}>{product.offerCount} seller{product.offerCount !== 1 ? 's' : ''}</span>
        )}
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
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>{item.shipping === 0 ? 'Free ship' : money(item.shipping)}</div>
      </div>
    </button>
  );
}

// ── deal card (Hot Deals row) ─────────────────────────────────
function DealCard({ item, discount, app, w }) {
  const watched = app.isWatched(item.id);
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      width: w || 150, flexShrink: 0, textAlign: 'left', background: T.surface, cursor: 'pointer',
      borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(20,24,40,0.04), 0 4px 14px rgba(20,24,40,0.05)',
    }}>
      <div style={{ position: 'relative' }}>
        <CardArt item={item} w={150} radius={0} />
        <div style={{ position: 'absolute', top: 6, left: 6, background: T.down, color: '#fff',
          fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>
          {discount}% below market
        </div>
      </div>
      <div style={{ padding: '8px 8px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginTop: 2 }}>{money(item.price)}</div>
        <div style={{ fontSize: 12, color: T.muted, textDecoration: 'line-through', marginTop: 1 }}>{money(item.market)}</div>
      </div>
    </div>
  );
}

// ── mover card (Daily Movers row) ────────────────────────────
function MoverCard({ item, change, app }) {
  const up = change > 0;
  return (
    <div onClick={() => app.nav.push('listing', { id: item.id })} role="button" style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      background: T.surface, borderRadius: 8, cursor: 'pointer', minWidth: 220, flexShrink: 0,
      boxShadow: '0 1px 3px rgba(20,24,40,0.04)',
    }}>
      <CardArt item={item} w={40} radius={4} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: T.muted }}>{money(item.price)}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.mono,
        color: up ? T.up : T.down }}>
        {up ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
      </div>
    </div>
  );
}

// ── game hero images for Browse by Game tiles ───────────────
const GAME_HEROES = {
  pkmn: 'logos/heroes/pkmn.avif',
  mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg',  // Yugi + Dark Magician
  lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.jpg',
};

// ── game tile (Browse by Game carousel — tall portrait style) ─
function GameBrowseTile({ game, app }) {
  const logo = GAME_LOGOS && GAME_LOGOS[game.id];
  const hero = GAME_HEROES[game.id];
  return (
    <div onClick={() => app.nav.push('search', { game: game.id })} role="button" style={{
      flexShrink: 0, width: 140, height: 200, cursor: 'pointer', borderRadius: 14,
      overflow: 'hidden', position: 'relative',
      background: game.tint,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    }}>
      {/* hero art background */}
      {hero && <img src={hero} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
      }} />}
      {/* dark overlay for logo readability */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)',
      }} />
      {/* logo centred */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end', padding: '16px 12px', zIndex: 1 }}>
        {logo ? (
          <img src={logo} alt={game.short} style={{ maxWidth: 105, maxHeight: 48,
            objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
        ) : (
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
            {game.short}
          </span>
        )}
      </div>
    </div>
  );
}

// ── ad carousel ──────────────────────────────────────────────
// each banner's id is a game id, so we can show only ads for games the user follows
const AD_BANNERS = [
  { id: 'pkmn', set: 'ssp', src: 'ads/pokemon.webp', tint: '#1f4d3a', tag: 'Pokémon TCG', cta: 'New: Surging Sparks' },
  { id: 'lor', set: 'op10', src: 'ads/onepiece.webp', tint: '#7c4a1e', tag: 'One Piece Card Game', cta: 'Shop the latest set' },
  { id: 'ygo', set: 'ann25', src: 'ads/yugioh.webp', tint: '#1a2740', tag: 'Yu-Gi-Oh!', cta: '25th Anniversary in stock' },
];

function AdCarousel({ app }) {
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
          <button key={ad.id} onClick={() => app.nav.push('search', { set: ad.set, game: ad.id })} style={{
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
      {action && <button onClick={onAction} style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', flexShrink: 0 }}>{action}</button>}
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
function WhatsHot({ app, trendingProducts }) {
  const [hotTab, setHotTab] = React.useState('trending');
  const dealItems = HOT_DEALS.map(d => { const item = byId(d.id); return item ? { ...item, _discount: d.discount } : null; }).filter(Boolean);
  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['trending', 'Trending'], ['deals', 'Hot Deals']].map(([k, l]) => (
            <div key={k} onClick={() => setHotTab(k)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: hotTab === k ? T.ink : T.surface,
              color: hotTab === k ? '#fff' : T.ink,
              border: hotTab === k ? 'none' : '1px solid var(--line)',
            }}>{l}</div>
          ))}
        </div>
        <div onClick={() => app.nav.setTab('search')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>See all</div>
      </div>
      {hotTab === 'trending' ? (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
          {trendingProducts.slice(0, 8).map(p => <ProductCard key={p.id} product={p} app={app} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {dealItems.map(item => <DealCard key={item.id} item={item} discount={item._discount} app={app} />)}
        </div>
      )}
    </div>
  );
}

var ANNOUNCE_MSGS = [
  { icon: Icon.shield, text: 'Buyer Protection on every order' },
  { icon: Icon.tag, text: '6% + 30p total fees \u2014 the lowest in the UK' },
  { icon: function(p) { return React.createElement('svg', { width: p.width || 13, height: p.height || 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    React.createElement('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }),
    React.createElement('path', { d: 'M8 21h8M12 17v4' })); }, text: '5 games supported' },
  { icon: Icon.bolt, text: 'Verified sellers with transparent ratings' },
  { icon: function(p) { return React.createElement('svg', { width: p.width || 13, height: p.height || 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    React.createElement('polyline', { points: '22,12 18,12 15,21 9,3 6,12 2,12' })); }, text: 'Live market pricing on every card' },
  { icon: function(p) { return React.createElement('svg', { width: p.width || 13, height: p.height || 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
    React.createElement('path', { d: 'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' })); }, text: 'UK-based marketplace' },
];

function AnnouncementRotator() {
  var r1 = React.useState(0), idx = r1[0], setIdx = r1[1];
  var r2 = React.useState(true), vis = r2[0], setVis = r2[1];
  var r3 = React.useState(false), paused = r3[0], setPaused = r3[1];
  React.useEffect(function() {
    if (paused) return;
    var t = setInterval(function() {
      setVis(false);
      setTimeout(function() {
        setIdx(function(i) { return (i + 1) % ANNOUNCE_MSGS.length; });
        setVis(true);
      }, 300);
    }, 3000);
    return function() { clearInterval(t); };
  }, [paused]);
  var msg = ANNOUNCE_MSGS[idx];
  return (
    <div style={{ background: 'var(--fill)', padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0, transition: 'opacity 0.3s', opacity: vis ? 1 : 0 }}>
          {msg.icon({ width: 13, height: 13 })}
        </span>
        <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
          transition: 'opacity 0.3s', opacity: vis ? 1 : 0, display: 'inline-block' }}>
          {msg.text}
        </span>
      </div>
      <button onClick={function() { setPaused(!paused); }} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, padding: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        )}
      </button>
    </div>
  );
}

function HomeScreen({ app }) {
  const [game, setGame] = React.useState('all');
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const [article, setArticle] = React.useState(null);
  const myGames = GAMES.filter(g => app.inPrefs(g.id));
  // if the active chip leaves prefs, snap back to "all"
  React.useEffect(() => { if (game !== 'all' && !app.inPrefs(game)) setGame('all'); }, [app.prefs]);
  const RELIABLE_IMG = new Set(['pkmn', 'mtg', 'ygo', 'lor']);
  const imgOk = (x) => RELIABLE_IMG.has(x.game) && !(window.CardImg && window.CardImg.hasFailed(x));
  const inFeed = (x) => app.inPrefs(x.game) && imgOk(x);
  const filt = (arr) => (game === 'all' ? arr.filter(inFeed) : arr.filter(x => x.game === game && imgOk(x)));
  const trendingProducts = filt(PRODUCTS);
  const sets = filt(SETS).filter(s => s.img);
  const graded = filt(LISTINGS.filter(l => l.grade.company !== 'raw'));
  const lots = filt(LOTS);

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: T.bg, paddingBottom: 96 }}>
      {/* announcement bar — one statement at a time */}
      <AnnouncementRotator />
      {/* top bar */}
      <div style={{ padding: '14px 16px 10px', background: T.surface, borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, position: 'relative' }}>
          <button onClick={() => app.openMenu()} style={{ color: T.ink, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Icon.menu({})}</button>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', lineHeight: 1 }}>
            <Logo size={32} color={T.ink} />
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

      {/* ── Card Fan hero ── */}
      <CardFan app={app} />

      {/* ── Social proof strip ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '14px 14px 0' }}>
        {[['2,400+', 'cards listed'], ['180+', 'verified sellers'], ['12', 'local shops']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: 16, color: T.ink }}>{num}</div>
            <div style={{ fontSize: 10.5, color: T.faint, fontFamily: T.sans }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── How it works link ── */}
      <div style={{ textAlign: 'center', padding: '10px 14px 4px' }}>
        <span onClick={() => app.nav.push('howitworks')} style={{ fontSize: 13, fontWeight: 600,
          color: 'var(--ink)', cursor: 'pointer' }}>How it works — buyers, sellers & game shops →</span>
      </div>

      {/* ── Browse by Game ── */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Browse by Game</div>
          <div onClick={() => app.nav.setTab('search')} style={{ fontSize: 13, fontWeight: 600,
            color: 'var(--ink)', cursor: 'pointer' }}>Browse all</div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px 4px',
          WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {GAMES.filter(g => g && g.id).map(g => <GameBrowseTile key={g.id} game={g} app={app} />)}
        </div>
      </div>

      {/* ── What's hot (trending + deals merged) ── */}
      <WhatsHot app={app} trendingProducts={trendingProducts} />

      {/* ── Just listed ── */}
      {trendingProducts.length > 8 && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px', marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Just listed</div>
            <div onClick={() => app.nav.setTab('search')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>See all</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px', WebkitOverflowScrolling: 'touch' }}>
            {trendingProducts.slice(8, 18).map(p => (
              <div key={p.id} style={{ flexShrink: 0, width: 140 }}>
                <ProductCard product={p} app={app} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sell your cards ── */}
      <div style={{ padding: '24px 14px 0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Start selling</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'List from collection', desc: 'Multi-select, auto-price, list in seconds', bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)', action: () => app.nav.setTab('watch') },
            { title: 'Sell to a local shop', desc: 'Walk cards in, walk out with cash', bg: 'linear-gradient(135deg, #1a2e1a, #2d5a3f)', action: () => app.nav.push('sellshop') },
            { title: 'Trade card-for-card', desc: 'Swap with collectors near you', bg: 'linear-gradient(135deg, #1b2838, #3a5a8c)', action: () => app.nav.push('trade') },
          ].map(c => (
            <button key={c.title} onClick={c.action} style={{ display: 'flex', alignItems: 'center', gap: 14,
              background: c.bg, borderRadius: 12, padding: '14px 16px', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{c.desc}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Compare fees CTA ── */}
      <div style={{ margin: '12px 14px 24px' }}>
        <button onClick={() => app.nav.push('fees')} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px', borderRadius: 12, border: '1px solid var(--line)', background: T.surface, cursor: 'pointer' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>Compare our fees</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>6% + 30p total — the lowest in the UK</div>
          </div>
          <span style={{ color: T.faint, fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  );
}

// ── featured / spotlight rail (pref-aware editorial content) ──
const SPOTLIGHT = [
  // Pokémon
  { game: 'pkmn', set: 's151', src: 'content/pkmn-151.png', title: 'Scarlet & Violet 151', sub: 'The set everyone\'s chasing — singles & lots', pos: 'center' },
  { game: 'pkmn', set: 'base', src: 'content/pkmn-grails.webp', title: 'The grail cards', sub: 'Illustrator Pikachu & 1st-edition Charizard', pos: 'center' },
  { game: 'pkmn', set: 'evs', src: 'content/pkmn-slabs.jpg', title: 'Graded & protected', sub: 'PSA-slabbed vintage holos', pos: 'center 30%' },
  // One Piece
  { game: 'lor', set: 'op07', src: 'content/op-crew.webp', title: 'One Piece Card Game', sub: 'The whole crew, in your binder', pos: 'center' },
  { game: 'lor', set: 'op08', src: 'content/op-25th.jpg', title: 'Anime 25th Collection', sub: 'EB-02 sealed booster boxes in stock', pos: 'center' },
  { game: 'lor', set: 'op10', src: 'content/op-magazine.jpg', title: 'One Piece Magazine', sub: 'Promo cards & collector features', pos: 'center top' },
  // Yu-Gi-Oh!
  { game: 'ygo', set: 'ann25', src: 'content/ygo-gods.webp', title: 'The Egyptian Gods', sub: 'Ra, Slifer & Obelisk — vintage holos', pos: 'center' },
  { game: 'ygo', set: 'lob', src: 'content/ygo-meta.jpg', title: 'Today\'s meta', sub: 'Tournament staples & new releases', pos: 'center' },
  { game: 'ygo', set: 'ra02', src: 'content/ygo-duelpower.gif', title: 'Duel Power', sub: 'Collector boxes & sealed product', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-locals.webp', title: 'Locals night', sub: 'Find a Yu-Gi-Oh! event near you', pos: 'center', action: 'shopfinder' },
  // Magic: The Gathering
  { game: 'mtg', set: 'mh3', src: 'content/mtg-brand.webp', title: 'Magic: The Gathering', sub: 'Singles, sealed & graded — all eras', pos: 'center' },
  { game: 'mtg', set: 'mh3', src: 'content/mtg-mh3.webp', title: 'Modern Horizons 3', sub: 'Preorder Commander decks now', pos: 'center' },
  { game: 'mtg', set: 'lea', src: 'content/mtg-packs.jpeg', title: 'Endless possibilities', sub: 'Every pack, 15 cards — open a world', pos: 'center 22%' },
  { game: 'mtg', src: 'content/mtg-locals.png', title: 'Locals night', sub: 'Find a Magic event near you', pos: 'center', action: 'shopfinder' },
];

function FeaturedRail({ app, game, onPick }) {
  const cards = SPOTLIGHT.filter(c => game && game !== 'all' ? c.game === game : app.inPrefs(c.game));
  if (cards.length === 0) return null;
  const tint = { pkmn: '#d4a017', mtg: '#c2691b', ygo: '#7c4dd1', lor: '#c0392b', digimon: '#1f8fd6' };
  return (
    <div>
      <SectionHeader title={game && game !== 'all' ? 'Featured in ' + (gameById(game) ? gameById(game).short : '') : 'Featured'} action="See all" onAction={() => app.nav.setTab('search')} />
      <div className="noscroll" style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
        {cards.map((c, n) => {
          const g = gameById(c.game);
          return (
            <button key={n} onClick={() => c.action ? app.nav.push(c.action) : app.nav.push('search', { set: c.set, game: c.game })} style={{ flexShrink: 0, width: 244, textAlign: 'left',
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
  { id: 'grading', src: 'ads/learn-grading.jpg', tag: 'GUIDE', title: 'How grading works', desc: 'PSA, BGS & CGC scales explained — what each grade means for value.', cta: 'Learn grading',
    body: 'Card grading is the process of having a professional service evaluate your card\'s condition and seal it in a tamper-proof case (a "slab") with a grade.\n\nThe three main grading companies are PSA (Professional Sports Authenticator), BGS (Beckett Grading Services), and CGC (Certified Guaranty Company).\n\n**PSA Scale (1–10):**\nPSA uses a whole-number scale. A PSA 10 "Gem Mint" is the highest grade — sharp corners, perfect centering, no surface flaws. PSA 9 "Mint" allows very minor imperfections. Most raw NM cards grade between PSA 7 and PSA 9.\n\n**BGS Scale (1–10 with subgrades):**\nBGS provides four subgrades: Centering, Corners, Edges, and Surface. A BGS 9.5 "Gem Mint" is considered equivalent to a PSA 10. A perfect BGS 10 "Pristine" (also called a "Black Label" when all four subgrades are 10) is extremely rare and commands massive premiums.\n\n**CGC Scale (1–10):**\nCGC is newer to the hobby but growing fast. They offer subgrades similar to BGS and are generally more affordable. A CGC 9.5 is roughly comparable to a PSA 10.\n\n**Why grade?**\nGrading adds value, protects the card, and provides a universal condition standard. A raw Near Mint Charizard might sell for £300, but a PSA 10 of the same card could fetch £1,200+. However, grading costs £15–50 per card and takes weeks, so it only makes sense for higher-value cards.' },
  { id: 'auth', src: 'ads/learn-authenticate.jpg', tag: 'PROTECT', title: 'Buy with confidence', desc: 'How authentication & Buyer Protection keep every purchase safe.', cta: 'How we verify',
    body: 'Every purchase on Cardconomy is backed by Buyer Protection — a guarantee that if the card doesn\'t match the listing, you get a full refund.\n\n**How it works:**\n\n1. **Verified sellers** — All sellers are identity-verified and their transaction history is public. Sellers with 99%+ positive ratings earn a "Trusted" badge.\n\n2. **Photo requirements** — Listings for cards over £50 require front and back photos. Graded cards must show the slab label. We use image analysis to flag suspicious photos.\n\n3. **Buyer Protection window** — After delivery, you have 48 hours to inspect the card and report any issues. If the card doesn\'t match the listed condition, grade, or description, open a case and we\'ll review it.\n\n4. **Dispute resolution** — Our team reviews photo evidence from both buyer and seller. If the listing was inaccurate, the buyer gets a full refund including shipping. Repeat offenders are suspended.\n\n5. **Counterfeit detection** — We partner with grading companies to verify slab serial numbers. If a card is flagged as potentially counterfeit, the sale is paused for manual review.\n\n**What\'s NOT covered:**\n- Buyer\'s remorse (you changed your mind)\n- Price drops after purchase\n- Cards accurately described as "Heavily Played" or "Damaged"' },
  { id: 'care', src: 'ads/learn-protect.jpg', tag: 'CARE', title: 'Store & protect', desc: 'Sleeves, toploaders & vaulting to keep your collection mint.', cta: 'Care tips',
    body: 'Proper storage is the difference between a card holding its value and losing it. Here\'s how to protect your collection at every level.\n\n**Inner sleeves (penny sleeves):**\nThe first line of defense. Soft, clear plastic sleeves that fit snugly around a standard card. Cost about 1p each. Always sleeve before placing in anything else.\n\n**Toploaders:**\nRigid plastic holders that prevent bending. Put the sleeved card in a toploader for any card worth more than a few pounds. Use "thick" toploaders (130pt+) for cards with texture or extra thickness.\n\n**Binder pages:**\nFor collections you want to browse, use side-loading 9-pocket pages in a D-ring binder. Side-loading prevents cards from sliding out. Avoid O-ring binders — they can dent cards near the spine.\n\n**Magnetic holders (One Touch):**\nUltra Premium holders with a magnetic seal. Perfect for displaying high-value raw cards. Use the right thickness (35pt for standard cards, 55pt+ for thicker cards).\n\n**Climate control:**\nStore cards away from direct sunlight, heat, and humidity. Ideal conditions: 18-22°C, 40-50% relative humidity. A dry, dark cupboard works well. Avoid attics, garages, and basements.\n\n**Handling:**\nAlways handle cards by the edges. Wash and dry your hands first. Consider cotton gloves for vintage or high-value cards. Never eat or drink near your collection.' },
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

// ── skeleton card (shimmer placeholder while content loads) ──
function SkeletonCard({ w }) {
  return (
    <div style={{ width: w || '100%', background: T.surface, borderRadius: 4, overflow: 'hidden' }}>
      <div className="shimmer" style={{ height: 180 }} />
      <div style={{ padding: '10px 12px 12px' }}>
        <div className="shimmer" style={{ height: 14, width: '75%', marginBottom: 8 }} />
        <div className="shimmer" style={{ height: 11, width: '50%', marginBottom: 12 }} />
        <div className="shimmer" style={{ height: 16, width: '35%' }} />
      </div>
    </div>
  );
}

Object.assign(window, { ListCard, ListRow, LotRow, SectionHeader, SetTile, HomeScreen, ProductCard, SkeletonCard });
