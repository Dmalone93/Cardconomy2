// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — Home / Browse + shared DCard tile
// ─────────────────────────────────────────────────────────────
const { T: TH, money: mH, CardArt: CardArtH, Slab: SlabH, GradeChip: GradeChipH, Delta: DeltaH, Icon: IconH } = window;
const { GAMES: GAMESH, SETS: SETSH, LISTINGS: LISTH, LOTS: LOTSH, gameById: gameByIdH, setById: setByIdH, GAME_LOGOS: GAME_LOGOS_H } = window;
const { HOT_DEALS: HOT_DEALS_H, PRICE_MOVERS: PRICE_MOVERS_H, byId: byIdH } = window;

// ── game hero images + tile for desktop ──────────────────────
const GAME_HEROES_H = {
  pkmn: 'logos/heroes/pkmn.jpg', mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg', lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.png',
};

function DGameTile({ game, app }) {
  const logo = GAME_LOGOS_H && GAME_LOGOS_H[game.id];
  const hero = GAME_HEROES_H[game.id];
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={() => app.go('search', { game: game.id })}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      role="button" style={{
      cursor: 'pointer', borderRadius: 14, overflow: 'hidden', position: 'relative',
      aspectRatio: '3/4', background: game.tint,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      transform: hover ? 'scale(1.03)' : 'scale(1)',
      transition: 'transform 0.2s',
    }}>
      {hero && <img src={hero} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
      }} />}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'center', padding: '16px 12px', zIndex: 1 }}>
        {logo ? (
          <img src={logo} alt={game.short} style={{ maxWidth: 120, maxHeight: 50,
            objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
        ) : (
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>{game.short}</span>
        )}
      </div>
    </div>
  );
}

// ── shared product card ──────────────────────────────────────
function DCard({ item, app }) {
  const [hover, setHover] = React.useState(false);
  const watched = app.isWatched(item.id);
  const auction = item.type === 'auction';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => app.go('listing', { id: item.id })} style={{ background: 'var(--surface)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
      boxShadow: hover ? '0 8px 26px rgba(20,24,40,0.13)' : '0 1px 3px rgba(20,24,40,0.06)', transform: hover ? 'translateY(-3px)' : 'none', transition: 'all 0.18s ease' }}>
      <div style={{ position: 'relative', background: 'var(--surface-2)', padding: '16px 16px 10px', display: 'flex', justifyContent: 'center' }}>
        <CardArtH item={item} w={150} />
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
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{auction ? '🔨 ' + item.bids + ' bids · ' + item.timeLeft : (item.shipping === 0 ? 'Free shipping' : mH(item.shipping) + ' ship')}</span>
          {!auction && (
            <button onClick={(e) => { e.stopPropagation(); app.addToCart(item.id); }} style={{ fontSize: 12, fontWeight: 700, color: app.inCart(item.id) ? 'var(--up)' : 'var(--accent)',
              border: '1.5px solid ' + (app.inCart(item.id) ? 'var(--up)' : 'var(--accent)'), borderRadius: 8, padding: '4px 10px' }}>{app.inCart(item.id) ? '✓ In cart' : '+ Cart'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ title, action, onAction, children }) {
  return (
    <section style={{ marginTop: 44 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>{title}</h2>
        {action && <button onClick={onAction} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--accent)' }}>{action} →</button>}
      </div>
      <div className="wrap">{children}</div>
    </section>
  );
}

function grid(n) { return { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + n + 'px, 1fr))', gap: 18 }; }

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
              background: tab === k ? 'var(--accent)' : 'var(--surface)',
              color: tab === k ? '#fff' : TH.ink,
              border: tab === k ? 'none' : '1px solid var(--line)',
            }}>{l}</button>
          ))}
        </div>
        <button onClick={() => app.go('search')} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--accent)' }}>See all →</button>
      </div>
      <div className="wrap">
        {tab === 'trending' ? (
          <div style={grid(210)}>{trending.slice(0, 8).map(l => <DCard key={l.id} item={l} app={app} />)}</div>
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
  const trending = LISTH.filter(l => l.type === 'buynow');

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* ── Card Fan ── */}
      <div style={{ position: 'relative', height: 280, display: 'flex', alignItems: 'center',
        justifyContent: 'center', overflow: 'hidden', background: 'var(--bg)' }}>
        {(() => {
          const fanCards = [byIdH('l01'), byIdH('l05'), byIdH('l03')].filter(Boolean);
          const layouts = [
            { rotate: -14, x: -70, y: 20, z: 1 },
            { rotate: 0, x: 0, y: -12, z: 3 },
            { rotate: 15, x: 70, y: 20, z: 2 },
          ];
          return fanCards.slice(0, 3).map((card, i) => {
            const l = layouts[i];
            return (
              <div key={card.id} onClick={() => app.go('listing', { id: card.id })} style={{
                position: 'absolute', width: 150, height: 210, borderRadius: 14, cursor: 'pointer',
                transform: `translate(${l.x}px, ${l.y}px) rotate(${l.rotate}deg)`,
                zIndex: l.z, boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
                border: '1px solid var(--line)', overflow: 'hidden',
                transition: 'transform 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = `translate(${l.x}px, ${l.y - 8}px) rotate(${l.rotate}deg) scale(1.04)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = `translate(${l.x}px, ${l.y}px) rotate(${l.rotate}deg)`; }}
              >
                <CardArtH item={card} w={150} radius={14} />
              </div>
            );
          });
        })()}
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
          <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 20, color: 'var(--ink)',
            letterSpacing: -0.4 }}>
            The UK home for trading cards
          </div>
        </div>
      </div>

      {/* ── Three Communities ── */}
      <section className="wrap" style={{ marginTop: 36, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 30, letterSpacing: -0.8,
            margin: '0 0 10px', color: TH.ink }}>
            Connecting the whole TCG community
          </h2>
          <p style={{ fontSize: 15, color: TH.muted, lineHeight: 1.5, maxWidth: 560, margin: '0 auto' }}>
            The only marketplace where buyers, sellers, and local game shops trade together. One platform. Lower fees. Real community.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { title: 'Buyers & Collectors', desc: 'Buy with protection and build your collection across every game.', cta: 'Start browsing', route: 'search' },
            { title: 'Individual Sellers', desc: 'List in seconds. 4% fee — the lowest in the market. Trade card-for-card.', cta: 'List a card', route: 'sell_single' },
            { title: 'Local Game Shops', desc: 'Digital storefront. Receive cards from local sellers. Reach collectors nationwide.', cta: 'Enrol your shop', route: 'enroll' },
          ].map(p => (
            <div key={p.title} style={{ background: 'var(--surface)', borderRadius: 14, padding: '22px 20px',
              border: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: TH.ink, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 14, color: TH.muted, lineHeight: 1.6, flex: 1 }}>{p.desc}</div>
              <button onClick={() => app.go(p.route)} style={{ marginTop: 14,
                fontWeight: 700, fontSize: 13.5, cursor: 'pointer', alignSelf: 'flex-start',
                color: 'var(--accent)', background: 'none', padding: 0 }}>{p.cta} →</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button onClick={() => app.go('howitworks')} style={{ fontSize: 14, fontWeight: 600,
            color: 'var(--accent)', cursor: 'pointer' }}>How it works →</button>
        </div>
      </section>

      {/* ── Browse by Game (hero tiles) ── */}
      <Row title="Browse by Game" action="Browse all" onAction={() => app.go('search')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {GAMESH.filter(g => g && g.id).map(g => <DGameTile key={g.id} game={g} app={app} />)}
        </div>
      </Row>

      {/* ── What's hot (trending + deals) ── */}
      <DWhatsHot app={app} trending={trending} />

      {/* ── UK community banner ── */}
      <section className="wrap" style={{ marginTop: 50 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--line)', padding: '32px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 24, letterSpacing: -0.6, margin: '0 0 8px', color: TH.ink }}>
              Built for the UK TCG community
            </h2>
            <p style={{ fontSize: 14, color: TH.muted, lineHeight: 1.6, margin: '0 0 16px' }}>
              6% + 30p total fees. Buyer protection on every order. Local game shop support built in.
            </p>
            <button onClick={() => app.go('fees')} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>Compare our fees →</button>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['6%+30p', 'Total fee'], ['5', 'Games'], ['3', 'Personas']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: TH.heading, fontWeight: 700, fontSize: 22, color: TH.ink }}>{num}</div>
                <div style={{ fontSize: 12, color: TH.muted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* trust band */}
      <section className="wrap" style={{ marginTop: 50 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[[IconH.shield, 'Buyer Protection', 'Full refund if an item never arrives or isn\u2019t as described.'],
            [IconH.bolt, 'Verified sellers', 'Every shop and top seller is vetted, with transparent ratings.'],
            [IconH.tag, 'Real market pricing', 'Live price history and sold comps on every card.']].map(([ic, h, b], i) => (
            <div key={i} style={{ display: 'flex', gap: 14, background: 'var(--surface)', borderRadius: 16, padding: 22, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'var(--accent-wash)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic({ width: 22, height: 22 })}</span>
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>{h}</div><p style={{ color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.5, margin: '4px 0 0' }}>{b}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DHome, DCard });
