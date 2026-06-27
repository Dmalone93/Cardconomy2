// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — Home / Browse + shared DCard tile
// ─────────────────────────────────────────────────────────────
const { T: TH, money: mH, CardArt: CardArtH, Slab: SlabH, GradeChip: GradeChipH, Delta: DeltaH, Icon: IconH } = window;
const { GAMES: GAMESH, SETS: SETSH, LISTINGS: LISTH, LOTS: LOTSH, gameById: gameByIdH, setById: setByIdH, GAME_LOGOS: GAME_LOGOS_H } = window;
const { HOT_DEALS: HOT_DEALS_H, PRICE_MOVERS: PRICE_MOVERS_H, byId: byIdH } = window;

// ── game hero images + tile for desktop ──────────────────────
const GAME_HEROES_H = {
  pkmn: 'logos/heroes/pkmn.avif', mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg', lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.jpg',
};

function DGameTile({ game, app }) {
  const logo = GAME_LOGOS_H && GAME_LOGOS_H[game.id];
  const hero = GAME_HEROES_H[game.id];
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={() => app.go('search', { game: game.id })}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      role="button" style={{
      cursor: 'pointer', borderRadius: 8, overflow: 'hidden', position: 'relative',
      width: 280, height: 380, flexShrink: 0, background: game.tint,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      transform: hover ? 'scale(1.03)' : 'scale(1)',
      transition: 'transform 0.2s',
    }}>
      {hero && <img src={hero} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
      }} />}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 16px', zIndex: 1 }}>
        {logo ? (
          <img src={logo} alt={game.short} style={{ maxWidth: 200, maxHeight: 70,
            objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
        ) : (
          <span style={{ fontSize: 24, fontWeight: 800, color: '#fff',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>{game.short}</span>
        )}
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 10, fontWeight: 600 }}>Browse {game.name}</span>
      </div>
    </div>
  );
}

// ── game carousel with scroll arrows ─────────────────────────
function GameCarousel({ app }) {
  const scrollRef = React.useRef(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(true);
  function updateArrows() {
    var el = scrollRef.current; if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }
  function scrollBy(dir) {
    var el = scrollRef.current; if (!el) return;
    el.scrollBy({ left: dir * 400, behavior: 'smooth' });
  }
  React.useEffect(function() { updateArrows(); }, []);
  var arrowStyle = function(show) { return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
    width: 44, height: 44, borderRadius: 999, background: 'var(--surface)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', fontSize: 20, color: 'var(--ink)',
    opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none', transition: 'opacity 0.2s',
  }; };
  return (
    <section style={{ marginTop: 44, background: '#fff', padding: '32px 0 28px' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>Browse by Game</h2>
        <button onClick={function() { app.go('search'); }} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Browse all →</button>
      </div>
      <div className="wrap" style={{ position: 'relative' }}>
        <button onClick={function() { scrollBy(-1); }} style={Object.assign({}, arrowStyle(canLeft), { left: -22 })}>←</button>
        <button onClick={function() { scrollBy(1); }} style={Object.assign({}, arrowStyle(canRight), { right: -22 })}>→</button>
        <div ref={scrollRef} onScroll={updateArrows} className="game-carousel" style={{
          display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', padding: '4px 0',
        }}>
          <style dangerouslySetInnerHTML={{ __html: '.game-carousel::-webkit-scrollbar{display:none}' }} />
          {GAMESH.filter(function(g) { return g && g.id; }).map(function(g) {
            return <div key={g.id} style={{ scrollSnapAlign: 'start' }}><DGameTile game={g} app={app} /></div>;
          })}
        </div>
      </div>
    </section>
  );
}

// ── shared product card ──────────────────────────────────────
function DCard({ item, app }) {
  const [hover, setHover] = React.useState(false);
  const watched = app.isWatched(item.id);
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(function() {
    if (window.CardImg) {
      window.CardImg.get(item, function(url) { if (!url) setImgFailed(true); });
    }
  }, [item.name]);
  if (imgFailed) return null;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => app.go('listing', { id: item.id })} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
      border: '1px solid var(--line)', boxShadow: hover ? '0 8px 26px rgba(20,24,40,0.13)' : 'none', transform: hover ? 'translateY(-3px)' : 'none', transition: 'all 0.18s ease' }}>
      <div style={{ position: 'relative', background: 'var(--surface-2)', padding: '18px 18px 12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {item.grade && item.grade.company !== 'raw'
          ? <SlabH item={item} w={148} />
          : <CardArtH item={item} w={180} />}
        <button onClick={(e) => { e.stopPropagation(); app.toggleWatch(item.id); }} style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 999,
          background: 'rgba(255,255,255,0.92)', color: watched ? 'var(--down)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
          {window.DIcon.heart({ width: 18, height: 18 }, watched)}
        </button>
        <div style={{ position: 'absolute', top: 12, left: 12 }}><GradeChipH grade={item.grade} /></div>
      </div>
      <div style={{ padding: '12px 14px 15px' }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', margin: '1px 0 9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle || item.condition}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ fontFamily: TH.mono, fontWeight: 700, fontSize: 18 }}>{mH(item.price)}</span>
          {item.market ? <DeltaH from={item.history ? item.history[0] : item.market} to={item.price} /> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{item.shipping === 0 ? 'Free shipping' : mH(item.shipping) + ' ship'}</span>
            <button onClick={(e) => { e.stopPropagation(); app.addToCart(item.id); }} style={{ fontSize: 12, fontWeight: 700, color: app.inCart(item.id) ? 'var(--up)' : 'var(--ink)',
              border: '1.5px solid ' + (app.inCart(item.id) ? 'var(--up)' : 'var(--ink)'), borderRadius: 8, padding: '4px 10px' }}>{app.inCart(item.id) ? '✓ In cart' : '+ Cart'}</button>
        </div>
      </div>
    </div>
  );
}

var RELIABLE_GAMES_H = new Set(['pkmn', 'mtg', 'ygo', 'lor']);

function Row({ title, action, onAction, children }) {
  return (
    <section style={{ marginTop: 44 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>{title}</h2>
        {action && <button onClick={onAction} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{action} →</button>}
      </div>
      <div className="wrap">{children}</div>
    </section>
  );
}

function grid(n) { return { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + n + 'px, 1fr))', gap: 18 }; }

// ── card carousel with scroll arrows ─────────────────────────
function CardCarousel({ title, action, onAction, items, app, badge }) {
  var scrollRef = React.useRef(null);
  var r1 = React.useState(false), canLeft = r1[0], setCanLeft = r1[1];
  var r2 = React.useState(true), canRight = r2[0], setCanRight = r2[1];
  function updateArrows() {
    var el = scrollRef.current; if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }
  function scroll(dir) {
    var el = scrollRef.current; if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: 'smooth' });
  }
  React.useEffect(function() { updateArrows(); }, []);
  var arrowBtn = function(show, side) { return {
    position: 'absolute', top: '40%', transform: 'translateY(-50%)', zIndex: 3,
    width: 40, height: 40, borderRadius: 999, background: 'var(--surface)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'var(--ink)',
    opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none', transition: 'opacity 0.2s',
    [side]: -20,
  }; };
  return (
    <section style={{ marginTop: 44 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>{title}</h2>
          {badge && <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--ink)', color: '#fff', borderRadius: 6, padding: '2px 8px' }}>{badge}</span>}
        </div>
        {action && <button onClick={onAction} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{action} →</button>}
      </div>
      <div className="wrap" style={{ position: 'relative' }}>
        <button onClick={function() { scroll(-1); }} style={arrowBtn(canLeft, 'left')}>{'←'}</button>
        <button onClick={function() { scroll(1); }} style={arrowBtn(canRight, 'right')}>{'→'}</button>
        <div ref={scrollRef} onScroll={updateArrows} className="game-carousel" style={{
          display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', padding: '4px 0',
        }}>
          {items.map(function(item) {
            return (
              <div key={item.id} style={{ width: 240, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <DCard item={item} app={app} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── hero ad banner ───────────────────────────────────────────
const HERO_ADS = [
  { id: 'pkmn', src: 'ads/pokemon.webp', tag: 'Pokémon TCG', head: 'Surging Sparks is live', sub: 'Chase the latest Illustration Rares & ex cards' },
  { id: 'lor', src: 'ads/onepiece.webp', tag: 'One Piece Card Game', head: 'New leaders, new meta', sub: 'Shop 500 Years in the Future' },
  { id: 'ygo', src: 'ads/yugioh.webp', tag: 'Yu-Gi-Oh!', head: '25th Anniversary in stock', sub: 'Quarter Century Secret Rares' },
  { id: 'gundam', src: 'ads/gundam.webp', tag: 'Gundam Card Game', head: 'Starter decks now live', sub: 'Build your first squad' },
];

function Hero({ app }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % HERO_ADS.length), 4600); return () => clearInterval(t); }, []);
  return (
    <div className="wrap" style={{ paddingTop: 24 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 320, boxShadow: '0 4px 20px rgba(20,24,40,0.1)' }}>
        {HERO_ADS.map((ad, n) => (
          <button key={ad.id} onClick={() => app.go('search', { game: ad.id })} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', textAlign: 'left',
            opacity: n === i ? 1 : 0, transition: 'opacity 0.7s ease', pointerEvents: n === i ? 'auto' : 'none' }}>
            <img src={ad.src} alt={ad.tag} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,10,16,0.78) 0%, rgba(8,10,16,0.4) 42%, transparent 72%)' }} />
            <div style={{ position: 'absolute', left: 48, top: '50%', transform: 'translateY(-50%)', color: '#fff', maxWidth: 460 }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', borderRadius: 7, padding: '5px 11px', marginBottom: 14 }}>SPONSORED · {ad.tag}</div>
              <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 38, letterSpacing: -1.2, lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>{ad.head}</div>
              <div style={{ fontSize: 16, opacity: 0.9, marginTop: 10, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{ad.sub}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 20, background: '#fff', color: 'var(--ink)', borderRadius: 10, padding: '12px 22px', fontWeight: 700, fontSize: 15 }}>Shop now →</span>
            </div>
          </button>
        ))}
        <div style={{ position: 'absolute', bottom: 18, right: 24, display: 'flex', gap: 6, zIndex: 2 }}>
          {HERO_ADS.map((_, n) => <button key={n} onClick={() => setI(n)} style={{ width: n === i ? 24 : 8, height: 8, borderRadius: 999, background: n === i ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }} />)}
        </div>
      </div>
    </div>
  );
}

function DWhatsHot({ app, trending }) {
  const [tab, setTab] = React.useState('trending');
  const dealItems = HOT_DEALS_H.map(d => { const item = byIdH(d.id); return item ? { ...item, _discount: d.discount } : null; }).filter(Boolean);
  return (
    <section style={{ marginTop: 44 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['trending', 'Trending'], ['deals', 'Hot Deals']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: tab === k ? 'var(--ink)' : 'var(--surface)',
              color: tab === k ? '#fff' : TH.ink,
              border: tab === k ? 'none' : '1px solid var(--line)',
            }}>{l}</button>
          ))}
        </div>
        <button onClick={() => app.go('search')} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>See all →</button>
      </div>
      <div className="wrap">
        {tab === 'trending' ? (
          <div style={grid(210)}>{trending.slice(0, 10).map(l => <DCard key={l.id} item={l} app={app} />)}</div>
        ) : (
          <div style={grid(170)}>
            {dealItems.map(item => (
              <div key={item.id} style={{ position: 'relative' }}>
                <DCard item={item} app={app} />
                <div style={{ position: 'absolute', top: 8, left: 8, background: TH.down, color: '#fff',
                  fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>
                  {item._discount}% below market
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DHome({ app }) {
  const trending = LISTH.filter(l => l.type === 'buynow' && RELIABLE_GAMES_H.has(l.game));
  const under100 = LISTH.filter(l => l.type === 'buynow' && l.price < 100 && RELIABLE_GAMES_H.has(l.game));

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* ── Hero Banner — full bleed with scrolling card grid ── */}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes dHeroUp{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}' }} />
      <div style={{ background: 'var(--fill)', overflow: 'hidden', height: 440, position: 'relative' }}>
        {/* left: text */}
        <div className="wrap" style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 42, color: '#fff',
              letterSpacing: -1.2, lineHeight: 1.08, margin: '0 0 16px' }}>
              The UK home for<br/>trading cards
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 400 }}>
              Buy, sell, and trade across every game. Lower fees than anyone else, with real buyer protection and local game shop support.
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <button onClick={() => app.go('search')} style={{ padding: '14px 28px', borderRadius: 10,
                background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                Start browsing
              </button>
              <button onClick={() => app.go('pitch_seller')} style={{ padding: '14px 28px', borderRadius: 10,
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 15,
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                Start selling
              </button>
            </div>
            <div style={{ display: 'flex', gap: 22 }}>
              {[[IconH.shield, 'Buyer Protection'], [IconH.tag, '6% + 30p fees'], [IconH.bolt, '5 games supported']].map(([ic, label], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600 }}>
                  {ic({ width: 14, height: 14 })}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: 3-column scrolling card grid */}
        {(() => {
          var cols = [
            [byIdH('l01'), byIdH('l06'), byIdH('l09'), byIdH('l08'), byIdH('l03'), byIdH('l02')].filter(Boolean),
            [byIdH('l05'), byIdH('l02'), byIdH('l04'), byIdH('l07'), byIdH('l11'), byIdH('l10')].filter(Boolean),
            [byIdH('l03'), byIdH('l10'), byIdH('l01'), byIdH('l06'), byIdH('l09'), byIdH('l08')].filter(Boolean),
          ];
          var speeds = [40, 52, 44];
          var offsets = [0, -60, -30];
          return (
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden', zIndex: 1 }}>
              {/* fades */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 2, background: 'linear-gradient(to bottom, var(--fill), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 2, background: 'linear-gradient(to top, var(--fill), transparent)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, zIndex: 2, background: 'linear-gradient(to right, var(--fill), transparent)' }} />

              <div style={{ display: 'flex', gap: 10, height: '100%', paddingRight: 16 }}>
                {cols.map(function(col, ci) {
                  return (
                    <div key={ci} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: 10,
                        animation: 'dHeroUp ' + speeds[ci] + 's linear infinite',
                        marginTop: offsets[ci],
                      }}>
                        {[0, 1].map(function(dup) {
                          return (
                            <React.Fragment key={dup}>
                              {col.map(function(card, ri) {
                                return (
                                  <div key={card.id + '-' + dup + '-' + ri} onClick={function() { app.go('listing', { id: card.id }); }}
                                    style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                                      boxShadow: '0 4px 16px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <CardArtH item={card} w={300} radius={8} />
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── How it works link ── */}
      <div className="wrap" style={{ textAlign: 'center', marginTop: 28, marginBottom: 8 }}>
        <span onClick={() => app.go('howitworks')} style={{ fontSize: 13, fontWeight: 600,
          color: 'var(--ink)', cursor: 'pointer' }}>How it works — buyers, sellers & game shops →</span>
      </div>

      {/* ── Browse by Game (carousel) ── */}
      <GameCarousel app={app} />

      {/* ── Trending ── */}
      <CardCarousel title="Trending" action="See all" onAction={() => app.go('search')} items={trending.slice(0, 15)} app={app} />

      {/* ── Hot deals ── */}
      {(() => {
        var dealItems = HOT_DEALS_H.map(d => { var item = byIdH(d.id); return item && RELIABLE_GAMES_H.has(item.game) ? Object.assign({}, item, { _discount: d.discount }) : null; }).filter(Boolean);
        return dealItems.length > 0 ? <CardCarousel title="Hot Deals" action="See all" onAction={() => app.go('search')} items={dealItems} app={app} badge={dealItems.length + ' deals'} /> : null;
      })()}

      {/* ── Just listed ── */}
      <CardCarousel title="Just Listed" action="See all" onAction={() => app.go('search')} items={trending.slice(15, 30)} app={app} badge="New" />

      {/* ── Under £100 ── */}
      <CardCarousel title={"Under \u00A3100"} action="Shop budget" onAction={() => app.go('search')} items={under100.slice(0, 15)} app={app} />

      {/* ── Sell your cards CTA ── */}
      <section className="wrap" style={{ marginTop: 50 }}>
        <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: '0 0 18px' }}>Start selling</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {/* Single card */}
          <div onClick={() => app.go('sell_single')} style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', height: 260,
            transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* decorative card stack */}
            <div style={{ position: 'absolute', right: -10, top: 20, width: 120, height: 168, borderRadius: 8,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              transform: 'rotate(12deg)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', right: 10, top: 30, width: 120, height: 168, borderRadius: 8,
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
              transform: 'rotate(4deg)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              <svg viewBox="0 0 120 168" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
                <rect x="15" y="12" width="90" height="60" rx="4" fill="rgba(255,255,255,0.2)" />
                <rect x="15" y="80" width="70" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
                <rect x="15" y="92" width="50" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                <rect x="15" y="110" width="90" height="40" rx="4" fill="rgba(255,255,255,0.08)" />
              </svg>
            </div>
            {/* text */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px', zIndex: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }}>
              <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 6 }}>Sell a single card</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>5-step wizard with live market pricing</div>
              <span style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 8, background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 13 }}>List now →</span>
            </div>
          </div>

          {/* Bulk list */}
          <div onClick={() => app.go('sell')} style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1b2838 0%, #2a3f5f 50%, #3a5a8c 100%)', height: 260,
            transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* decorative grid of mini cards */}
            <div style={{ position: 'absolute', right: 12, top: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
              transform: 'rotate(6deg)', opacity: 0.5 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ width: 36, height: 50, borderRadius: 4, background: 'rgba(255,255,255,' + (0.06 + i * 0.02) + ')',
                  border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            {/* upload arrow */}
            <div style={{ position: 'absolute', right: 40, top: 60, opacity: 0.2 }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px', zIndex: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }}>
              <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 6 }}>Bulk list your collection</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>CSV upload or scan. Auto-priced at market</div>
              <span style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 8, background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 13 }}>Bulk list →</span>
            </div>
          </div>

          {/* Trade */}
          <div onClick={() => app.go('trade')} style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1a2e1a 0%, #1e3a2f 50%, #2d5a3f 100%)', height: 260,
            transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* decorative swap arrows */}
            <div style={{ position: 'absolute', right: 20, top: 24, opacity: 0.15 }}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M20 35h55M60 20l15 15-15 15" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M80 65H25M40 50L25 65l15 15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* two overlapping card silhouettes */}
            <div style={{ position: 'absolute', right: 30, top: 50, width: 70, height: 98, borderRadius: 6,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              transform: 'rotate(-8deg)' }} />
            <div style={{ position: 'absolute', right: 50, top: 45, width: 70, height: 98, borderRadius: 6,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
              transform: 'rotate(8deg)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px', zIndex: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }}>
              <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 6 }}>Trade with collectors</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>Card-for-card swaps. No cash needed</div>
              <span style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 8, background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 13 }}>Find trades →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bulk lots ── */}
      <section style={{ marginTop: 50 }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>Bulk Lots</h2>
            <button onClick={() => app.go('search')} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Browse all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {LOTSH.map(lot => {
              var g = gameByIdH(lot.game);
              return (
                <div key={lot.id} onClick={() => app.go('listing', { id: lot.id })} style={{
                  background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                  display: 'flex', boxShadow: '0 1px 3px rgba(20,24,40,0.06)',
                  transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,24,40,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(20,24,40,0.06)'; e.currentTarget.style.transform = 'none'; }}>
                  {/* stack visual */}
                  <div style={{ width: 140, height: 160, flexShrink: 0, position: 'relative', background: lot.art || 'var(--fill)', overflow: 'hidden' }}>
                    {lot.img ? (
                      <img src={lot.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      /* fallback: stacked card silhouettes */
                      React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                        [0, 1, 2].map(i => React.createElement('div', { key: i, style: {
                          position: 'absolute', width: 60, height: 84, borderRadius: 6,
                          background: 'rgba(255,255,255,' + (0.08 + i * 0.04) + ')',
                          border: '1px solid rgba(255,255,255,0.12)',
                          transform: 'rotate(' + (i * 8 - 8) + 'deg) translateY(' + (i * -4) + 'px)',
                        }}))
                      )
                    )}
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
                      {lot.count} cards
                    </div>
                  </div>
                  {/* info */}
                  <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.2, marginBottom: 4 }}>{lot.name}</div>
                    <div style={{ fontSize: 12.5, color: TH.muted, lineHeight: 1.5, marginBottom: 8 }}>{lot.note}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: TH.mono, fontWeight: 700, fontSize: 20 }}>{mH(lot.price)}</span>
                      {lot.market && <span style={{ fontSize: 12, color: TH.muted, textDecoration: 'line-through' }}>{mH(lot.market)}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: TH.muted, marginTop: 6 }}>
                      {lot.seller} · {lot.sellerRating}% · {lot.shipping === 0 ? 'Free shipping' : mH(lot.shipping) + ' ship'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Local shops + UK community (side by side) ── */}
      <section className="wrap" style={{ marginTop: 50 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Find a local game shop */}
          <div style={{ background: 'var(--fill)', borderRadius: 16, padding: '32px 28px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, margin: '0 0 8px' }}>Find a local game shop</h2>
              <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.6, margin: '0 0 18px' }}>Browse verified shops near you. Sell cards in person, pick up online orders, or meet for trades at a safe location.</p>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                {[['12', 'Verified shops'], ['4.8', 'Avg rating'], ['Free', 'Early access']].map(([num, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 20 }}>{num}</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => app.go('storefront')} style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: '#fff', color: 'var(--ink)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>Find shops near you →</button>
            </div>
          </div>

          {/* Right: UK community + trust features */}
          <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line)', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, margin: '0 0 6px', color: TH.ink }}>Built for the UK TCG community</h2>
              <p style={{ fontSize: 13, color: TH.muted, lineHeight: 1.5, margin: '0 0 16px' }}>6% + 30p total fees. Buyer protection on every order. Local game shop support built in.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[[IconH.shield, 'Buyer Protection', 'Full refund if your card does not arrive or match the listing.'],
                [IconH.bolt, 'Verified sellers', 'Every shop and top seller is vetted with transparent ratings.'],
                [IconH.tag, 'Real market pricing', 'Live price history and sold comps on every card.']].map(([ic, h, b], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'var(--accent-wash)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic({ width: 16, height: 16 })}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: TH.ink }}>{h}</div>
                    <div style={{ fontSize: 12, color: TH.muted, lineHeight: 1.4, marginTop: 1 }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => app.go('fees')} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', alignSelf: 'flex-start' }}>Compare our fees →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DHome, DCard });
