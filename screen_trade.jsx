// ─────────────────────────────────────────────────────────────
// Card-for-card TRADING — community pillar.
// matches → build proposal (fairness + cash) → pick LGS hub → sent
// ─────────────────────────────────────────────────────────────
const { T: TT, money: moneyT, Icon: IconT, CardArt: CardArtT, GradeChip: GradeChipT } = window;
const { SHOPS: SHOPS_T, TRADERS: TRADERS_T, OWNED_REFS: OWNED_T, byId: byIdT, traderById: traderByIdT, setById: setByIdT } = window;
const { GAMES: GAMES_T, TRADE_POSTS: TRADE_POSTS_T, postById: postByIdT, gameById: gameByIdT } = window;
const COND_OPTS = ['Any', 'LP+', 'NM+', 'NM', 'Gem'];
const SLAB_OPTS = ['Any', 'Raw', 'Graded'];

const m0 = (n) => moneyT(n, { cents: false });

// avatar bubble
function Avatar({ who, size = 44 }) {
  return <span style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0, background: who.tint, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TT.sans, fontWeight: 800, fontSize: size * 0.42 }}>{who.initial}</span>;
}

// small card chip with optional remove/add
function TradeCardChip({ item, dimmed, onToggle, mode }) {
  return (
    <button onClick={onToggle} style={{ flexShrink: 0, width: 78, textAlign: 'left', opacity: dimmed ? 0.4 : 1, position: 'relative' }}>
      <div style={{ background: TT.surface2, borderRadius: 10, padding: 7, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <CardArtT item={item} w={58} />
        <span style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: dimmed ? 'rgba(255,255,255,0.9)' : (mode === 'give' ? 'var(--accent)' : 'var(--up)'), color: dimmed ? TT.muted : '#fff',
          fontSize: 13, fontWeight: 800, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{dimmed ? '+' : '✓'}</span>
      </div>
      <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 11, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
      <div style={{ fontFamily: TT.sans, fontSize: 10.5, color: TT.muted }}>{m0(item.market)}</div>
    </button>
  );
}

function TradeScreen({ app, params = {} }) {
  const [phase, setPhase] = React.useState(params.trader ? 'build' : 'matches');
  const [traderId, setTraderId] = React.useState(params.trader || null);
  const [boardOffer, setBoardOffer] = React.useState(null); // ref of a card offered on the board
  const trader = traderId ? traderByIdT(traderId) : null;

  // selection state for the builder
  const giveAll = trader ? (boardOffer ? OWNED_T : OWNED_T.filter(id => trader.wants.includes(id))) : [];
  const getAll = trader ? (boardOffer ? [boardOffer] : trader.haves) : [];
  const [give, setGive] = React.useState({});
  const [get, setGet] = React.useState({});
  const [cash, setCash] = React.useState(0);          // +you pay them / -they pay you
  const [cashWho, setCashWho] = React.useState(null);
  const [shopId, setShopId] = React.useState(null);
  const [place, setPlace] = React.useState(null);     // agreed meetup { name, sub, kind }
  const [customSpot, setCustomSpot] = React.useState('');

  // post composer state
  const [offerCard, setOfferCard] = React.useState(OWNED_T[0]);
  const [openAny, setOpenAny] = React.useState(true);
  const [prefGames, setPrefGames] = React.useState([]);
  const [prefCond, setPrefCond] = React.useState('Any');
  const [prefSlab, setPrefSlab] = React.useState('Any');

  // init selections when trader chosen
  React.useEffect(() => {
    if (!trader) return;
    const g = {}; if (!boardOffer) giveAll.forEach(id => g[id] = true); setGive(g);
    const gt = {}; getAll.forEach(id => gt[id] = true); setGet(gt);
    setShopId(null); setCash(0); setPlace(null); setCustomSpot('');
  }, [traderId, boardOffer]);

  const giveSel = giveAll.filter(id => give[id]);
  const getSel = getAll.filter(id => get[id]);
  const giveVal = giveSel.reduce((s, id) => s + byIdT(id).market, 0);
  const getVal = getSel.reduce((s, id) => s + byIdT(id).market, 0);
  const diff = getVal - giveVal;          // >0 → you're getting more → you should add cash
  const fairPct = giveVal + getVal === 0 ? 50 : Math.round((giveVal / (giveVal + getVal)) * 100);
  const suggestedCash = Math.abs(Math.round(diff));

  const goBack = () => {
    if (phase === 'matches') app.nav.pop();
    else if (phase === 'board' || phase === 'post') setPhase('matches');
    else if (phase === 'build') setPhase(boardOffer ? 'board' : 'matches');
    else if (phase === 'meetup') setPhase('build');
    else app.nav.setTab('home');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TT.bg }}>
      {phase !== 'sent' && (
        <div style={{ padding: '52px 14px 12px', background: TT.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={goBack} style={{ color: TT.ink }}>{IconT.back({})}</button>
          <span style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 16, flex: 1 }}>
            {phase === 'matches' ? 'Trade with collectors' : phase === 'board' ? 'Open to Offers' : phase === 'post' ? 'Post a trade' : phase === 'build' ? 'Build a trade' : 'Choose where to meet'}
          </span>
        </div>
      )}

      <div className="noscroll" style={{ flex: 1, overflow: 'auto' }}>
        {/* ── MATCHES ── */}
        {phase === 'matches' && (
          <div style={{ padding: '18px 16px 30px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <span style={{ color: TT.accent, marginTop: 1 }}>{IconT.bolt({ width: 17, height: 17 })}</span>
              <span style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2, lineHeight: 1.45 }}>
                Swap cards directly — no cash needed. We match your <b>collection</b> with nearby collectors' <b>want lists</b> and suggest a shop to meet at.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <button onClick={() => setPhase('board')} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', background: TT.surface, borderRadius: 13, padding: '12px 13px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 13.5 }}>🔥 Open to Offers</span>
                <span style={{ fontFamily: TT.sans, fontSize: 11, color: TT.muted }}>{TRADE_POSTS_T.length} open trade posts</span>
              </button>
              <button onClick={() => setPhase('post')} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 13px', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}>
                <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 13.5, color: TT.accent }}>+ Post a trade</span>
                <span style={{ fontFamily: TT.sans, fontSize: 11, color: TT.accent, opacity: 0.8 }}>List a card, take offers</span>
              </button>
            </div>
            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 14, color: TT.ink2, marginBottom: 10 }}>{TRADERS_T.length} matches near you</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TRADERS_T.map(t => {
                const youGet = t.haves.filter(id => byIdT(id));
                const youGive = OWNED_T.filter(id => t.wants.includes(id));
                return (
                  <button key={t.id} onClick={() => { setTraderId(t.id); setPhase('build'); }} style={{ width: '100%', textAlign: 'left',
                    background: TT.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                      <Avatar who={t} size={42} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>{t.name}{window.TrustBadge && <window.TrustBadge tier={t.rating >= 99 ? 2 : 1} showLabel={false} />}</div>
                        <div style={{ fontFamily: TT.sans, fontSize: 11.5, color: TT.muted }}>{t.dist} km · {t.rating}% · {t.deals} trades</div>
                      </div>
                      <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 11, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 7, padding: '4px 9px' }}>2-way match</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: TT.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 5, letterSpacing: 0.2 }}>YOU GET</div>
                        <div style={{ display: 'flex', gap: 4 }}>{youGet.slice(0, 2).map(id => <MiniFace key={id} item={byIdT(id)} />)}</div>
                      </div>
                      <div style={{ width: 1, background: 'var(--line-2)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: TT.sans, fontSize: 10.5, fontWeight: 700, color: TT.accent, marginBottom: 5, letterSpacing: 0.2 }}>THEY WANT</div>
                        <div style={{ display: 'flex', gap: 4 }}>{youGive.slice(0, 2).map(id => <MiniFace key={id} item={byIdT(id)} />)}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BOARD (open to offers) ── */}
        {phase === 'board' && (
          <div style={{ padding: '18px 16px 30px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <span style={{ color: TT.accent, marginTop: 1 }}>{IconT.bolt({ width: 17, height: 17 })}</span>
              <span style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2, lineHeight: 1.45 }}>
                Collectors offering a card and <b>open to offers</b>. Tap one to propose something from your collection.
              </span>
            </div>
            <button onClick={() => setPhase('post')} style={{ width: '100%', marginBottom: 14, background: TT.accent, color: '#fff', borderRadius: 13, padding: 13, fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>+ Post your own trade</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TRADE_POSTS_T.map(p => {
                const t = traderByIdT(p.trader); const card = byIdT(p.offer);
                if (!card) return null;
                const chips = [];
                if (p.prefs.games && p.prefs.games.length) p.prefs.games.forEach(g => chips.push(gameByIdT(g) ? gameByIdT(g).short : g));
                else chips.push('Any game');
                if (p.prefs.cond && p.prefs.cond !== 'Any') chips.push(p.prefs.cond);
                if (p.prefs.slab && p.prefs.slab !== 'Any') chips.push(p.prefs.slab);
                return (
                  <div key={p.id} style={{ background: TT.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Avatar who={t} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>{t.name}{window.TrustBadge && <window.TrustBadge tier={t.rating >= 99 ? 2 : 1} showLabel={false} />}</div>
                        <div style={{ fontFamily: TT.sans, fontSize: 11, color: TT.muted }}>{t.dist} km · {t.rating}%</div>
                      </div>
                      <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 10.5, color: 'var(--gold)', background: 'oklch(0.95 0.06 85)', borderRadius: 7, padding: '4px 9px' }}>OPEN TO OFFERS</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ background: TT.surface2, borderRadius: 10, padding: 7, flexShrink: 0 }}><CardArtT item={card} w={52} radius={6} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TT.sans, fontSize: 10.5, color: TT.muted, fontWeight: 700, letterSpacing: 0.2 }}>OFFERING</div>
                        <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>{card.name}</div>
                        <div style={{ fontFamily: TT.sans, fontSize: 12, color: TT.muted }}>{m0(card.market)} market</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 11 }}>
                      <div style={{ fontFamily: TT.sans, fontSize: 10.5, color: TT.muted, fontWeight: 700, letterSpacing: 0.2, marginBottom: 6 }}>{p.open ? 'LOOKING FOR · open' : 'LOOKING FOR'}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {!p.open && p.wants && p.wants.map(id => byIdT(id) && <span key={id} style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.accent, background: 'var(--accent-wash)', borderRadius: 7, padding: '3px 9px' }}>{byIdT(id).name}</span>)}
                        {chips.map((c, i) => <span key={i} style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.ink2, background: TT.surface2, borderRadius: 7, padding: '3px 9px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>{c}</span>)}
                      </div>
                    </div>
                    <div style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2, fontStyle: 'italic', margin: '11px 0 12px', lineHeight: 1.4 }}>"{p.note}"</div>
                    <button onClick={() => { setBoardOffer(p.offer); setTraderId(p.trader); setPhase('build'); }} style={{ width: '100%', background: TT.accent, color: '#fff', borderRadius: 11, padding: 12, fontFamily: TT.sans, fontWeight: 700, fontSize: 14 }}>Make an offer</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── POST a trade ── */}
        {phase === 'post' && (
          <div style={{ padding: '18px 16px 30px' }}>
            <p style={{ fontFamily: TT.sans, fontSize: 13.5, color: TT.muted, margin: '0 0 16px', lineHeight: 1.45 }}>
              List a card you'll part with and stay open to offers. Set the criteria you\'d accept — others propose, you decide.
            </p>

            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 14, marginBottom: 9 }}>You're offering</div>
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 18 }}>
              {OWNED_T.map(id => {
                const c = byIdT(id); if (!c) return null;
                const on = offerCard === id;
                return (
                  <button key={id} onClick={() => setOfferCard(id)} style={{ flexShrink: 0, width: 78, textAlign: 'left' }}>
                    <div style={{ background: TT.surface2, borderRadius: 10, padding: 7, display: 'flex', justifyContent: 'center', boxShadow: on ? 'inset 0 0 0 2px var(--accent)' : 'none' }}>
                      <CardArtT item={c} w={56} />
                    </div>
                    <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 11, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: on ? TT.accent : TT.ink }}>{c.name}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: TT.surface, borderRadius: 13, padding: '13px 14px', marginBottom: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div>
                <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>Open to any offer</div>
                <div style={{ fontFamily: TT.sans, fontSize: 12, color: TT.muted }}>Let anyone propose a swap</div>
              </div>
              <button onClick={() => setOpenAny(v => !v)} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, background: openAny ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: openAny ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </div>

            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Preferences {openAny && <span style={{ color: TT.muted, fontWeight: 400, fontSize: 12.5 }}>· optional</span>}</div>
            <div style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.muted, marginBottom: 12 }}>Narrow what you'd accept.</div>

            <PrefRow label="Game">
              {GAMES_T.map(g => <PrefChip key={g.id} on={prefGames.includes(g.id)} onClick={() => setPrefGames(s => s.includes(g.id) ? s.filter(x => x !== g.id) : [...s, g.id])}>{g.short}</PrefChip>)}
            </PrefRow>
            <PrefRow label="Min. condition">
              {COND_OPTS.map(c => <PrefChip key={c} on={prefCond === c} onClick={() => setPrefCond(c)}>{c}</PrefChip>)}
            </PrefRow>
            <PrefRow label="Slab">
              {SLAB_OPTS.map(s => <PrefChip key={s} on={prefSlab === s} onClick={() => setPrefSlab(s)}>{s}</PrefChip>)}
            </PrefRow>

            <button onClick={() => setPhase('posted')} disabled={!offerCard} style={{ width: '100%', marginTop: 18, background: TT.accent, color: '#fff', borderRadius: 14, padding: 16, fontFamily: TT.sans, fontWeight: 700, fontSize: 16, opacity: offerCard ? 1 : 0.45, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
              Post to the board
            </button>
          </div>
        )}

        {/* ── POSTED ── */}
        {phase === 'posted' && (
          <div style={{ padding: '70px 24px 30px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconT.check({ width: 42, height: 42 })}</div>
            <h1 style={{ margin: '18px 0 4px', fontFamily: TT.sans, fontWeight: 800, fontSize: 23, letterSpacing: -0.5 }}>Your trade is live!</h1>
            <p style={{ fontFamily: TT.sans, fontSize: 14, color: TT.muted, lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 280 }}>
              {byIdT(offerCard) ? byIdT(offerCard).name : 'Your card'} is on the Open to Offers board. We'll notify you when collectors propose a swap.
            </p>
            <div style={{ display: 'inline-block', background: TT.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <CardArtT item={byIdT(offerCard)} w={96} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              <span style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.ink2, background: TT.surface2, borderRadius: 7, padding: '3px 9px' }}>{openAny ? 'Open to offers' : 'Specific wants'}</span>
              {prefGames.map(g => <span key={g} style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.ink2, background: TT.surface2, borderRadius: 7, padding: '3px 9px' }}>{gameByIdT(g).short}</span>)}
              {prefCond !== 'Any' && <span style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.ink2, background: TT.surface2, borderRadius: 7, padding: '3px 9px' }}>{prefCond}</span>}
              {prefSlab !== 'Any' && <span style={{ fontFamily: TT.sans, fontWeight: 600, fontSize: 11.5, color: TT.ink2, background: TT.surface2, borderRadius: 7, padding: '3px 9px' }}>{prefSlab}</span>}
            </div>
            <button onClick={() => setPhase('board')} style={{ width: '100%', marginTop: 24, background: TT.accent, color: '#fff', borderRadius: 14, padding: 15, fontFamily: TT.sans, fontWeight: 700, fontSize: 15.5 }}>View the board</button>
            <button onClick={() => app.nav.setTab('home')} style={{ marginTop: 10, color: TT.muted, fontFamily: TT.sans, fontWeight: 600, fontSize: 14 }}>Back to browse</button>
          </div>
        )}

        {/* ── BUILD ── */}
        {phase === 'build' && trader && (
          <div style={{ padding: '16px 16px 16px' }}>
            {/* partner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
              <Avatar who={trader} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 15 }}>Trading with {trader.name}</div>
                <div style={{ fontFamily: TT.sans, fontSize: 11.5, color: TT.muted }}>{trader.dist} km · {trader.rating}% positive</div>
              </div>
            </div>

            {/* you give */}
            <SideLabel color="var(--accent)" title="You give" sub="from your collection they want" total={m0(giveVal)} />
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 0 4px', marginBottom: 16 }}>
              {giveAll.map(id => <TradeCardChip key={id} item={byIdT(id)} mode="give" dimmed={!give[id]} onToggle={() => setGive(s => ({ ...s, [id]: !s[id] }))} />)}
              {giveAll.length === 0 && <span style={{ fontFamily: TT.sans, fontSize: 13, color: TT.muted, padding: '10px 0' }}>Nothing of yours on their want list yet.</span>}
            </div>

            {/* swap glyph */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0 10px' }}>
              <span style={{ width: 34, height: 34, borderRadius: 999, background: TT.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TT.ink2 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 10h10l-3-3M17 14H7l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>

            {/* you get */}
            <SideLabel color="var(--up)" title="You get" sub={'from ' + trader.name + "'s collection"} total={m0(getVal)} />
            <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 0 4px', marginBottom: 16 }}>
              {getAll.map(id => <TradeCardChip key={id} item={byIdT(id)} mode="get" dimmed={!get[id]} onToggle={() => setGet(s => ({ ...s, [id]: !s[id] }))} />)}
            </div>

            {/* fairness meter */}
            <div style={{ background: TT.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14 }}>Trade balance</span>
                <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 12.5, color: Math.abs(diff) <= 10 ? 'var(--up)' : 'var(--gold)', filter: Math.abs(diff) <= 10 ? 'none' : 'brightness(0.8)' }}>
                  {Math.abs(diff) <= 10 ? '✓ Even trade' : m0(Math.abs(diff)) + (diff > 0 ? ' in your favor' : ' their favor')}
                </span>
              </div>
              <div style={{ height: 14, borderRadius: 999, overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                <div style={{ width: fairPct + '%', background: TT.accent, transition: 'width 0.3s' }} />
                <div style={{ width: (100 - fairPct) + '%', background: 'var(--up)', transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: TT.sans, fontSize: 11.5, fontWeight: 600 }}>
                <span style={{ color: TT.accent }}>You {m0(giveVal)}</span>
                <span style={{ color: 'var(--up)', filter: 'brightness(0.85)' }}>{trader.name} {m0(getVal)}</span>
              </div>

              {/* cash balancer */}
              {Math.abs(diff) > 10 && (
                <button onClick={() => { setCash(suggestedCash); setCashWho(diff > 0 ? 'you' : 'them'); }} style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', gap: 9,
                  background: 'var(--accent-wash)', borderRadius: 11, padding: '10px 12px', textAlign: 'left' }}>
                  <span style={{ color: TT.accent }}>{IconT.tag({ width: 16, height: 16 })}</span>
                  <span style={{ flex: 1, fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2 }}>
                    Even it out: <b>{diff > 0 ? 'you add' : 'they add'} {m0(suggestedCash)}</b> cash
                  </span>
                  <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 12.5, color: TT.accent }}>{cash > 0 ? '✓' : 'Add'}</span>
                </button>
              )}
              {cash > 0 && (
                <div style={{ marginTop: 8, fontFamily: TT.sans, fontSize: 12, color: TT.muted, textAlign: 'center' }}>
                  + {m0(cash)} cash {cashWho === 'you' ? 'from you' : 'from ' + trader.name}
                </div>
              )}
            </div>

            {!app.isVerified() ? (
              <button onClick={() => app.nav.push('verify')} style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
                background: 'var(--accent-wash)', borderRadius: 14, padding: '14px 15px', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: TT.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconT.shield({ width: 18, height: 18 })}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 13.5, color: TT.accent }}>Verify your identity to trade</div>
                  <div style={{ fontFamily: TT.sans, fontSize: 11.5, color: TT.ink2 }}>In-person trades require both people verified. ~2 min.</div>
                </div>
                {IconT.chevron({ style: { color: TT.accent } })}
              </button>
            ) : (
              <button onClick={() => setPhase('meetup')} disabled={giveSel.length === 0 && getSel.length === 0}
                style={{ width: '100%', marginTop: 16, background: TT.accent, color: '#fff', borderRadius: 14, padding: 16, fontFamily: TT.sans, fontWeight: 700, fontSize: 16,
                  opacity: (giveSel.length === 0 && getSel.length === 0) ? 0.45 : 1, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
                Choose where to meet →
              </button>
            )}
          </div>
        )}

        {/* ── MEETUP (suggest shops between traders) ── */}
        {phase === 'meetup' && trader && (
          <div style={{ padding: '18px 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--up-wash)', borderRadius: 12, padding: '10px 13px', marginBottom: 12 }}>
              {IconT.shield({ width: 15, height: 15, style: { color: 'var(--up)' } })}
              <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 12.5, color: 'var(--up)' }}>You &amp; {trader.name} are both ID-verified ✓</span>
            </div>
            <div style={{ background: TT.surface, borderRadius: 13, padding: '13px 15px', marginBottom: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 13, marginBottom: 9 }}>Safe-trade checklist</div>
              {['Meet in a public, well-lit place (a shop is ideal)', 'Inspect cards before money or cards change hands', 'Keep it in the app — share no personal contact info', 'Tell someone where you\u2019re going'].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '4px 0' }}>
                  <span style={{ color: 'var(--up)', fontSize: 13, marginTop: 1 }}>✓</span>
                  <span style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2, lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: TT.surface2, borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <span style={{ color: TT.accent, marginTop: 1 }}>{IconT.shield({ width: 17, height: 17 })}</span>
              <span style={{ fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2, lineHeight: 1.45 }}>
                Suggest where to meet — {trader.name} can accept it or counter with their own spot. A local shop is safest (neutral ground + authentication), but you can propose anywhere public.
              </span>
            </div>

            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 13.5, color: TT.ink2, margin: '4px 2px 9px' }}>Local game shops <span style={{ color: TT.muted, fontWeight: 500 }}>· recommended</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SHOPS_T.filter(s => s.tradeHub).map(s => {
                const theirDist = Math.round((Math.abs(s.dist - trader.dist) + 1.4) * 10) / 10;
                const mid = Math.round(((s.dist + theirDist) / 2) * 10) / 10;
                const sel = place && place.id === s.id;
                return (
                  <button key={s.id} onClick={() => setPlace({ id: s.id, name: s.name, sub: s.loc + ' · ' + (s.vault ? 'authentication on site' : 'trade hub'), kind: 'shop', vault: s.vault, tint: s.tint, initial: s.initial })} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                    background: sel ? 'var(--accent-wash)' : TT.surface, borderRadius: 14, padding: 13,
                    boxShadow: sel ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <Avatar who={s} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>{s.name}</span>
                        {s.vault && <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 9.5, color: 'var(--gold)', background: 'oklch(0.95 0.06 85)', borderRadius: 5, padding: '1px 5px' }}>VAULT</span>}
                      </div>
                      <div style={{ fontFamily: TT.sans, fontSize: 11.5, color: TT.muted }}>{s.loc} · {s.hours}</div>
                      <div style={{ fontFamily: TT.sans, fontSize: 11, color: TT.accent, fontWeight: 600, marginTop: 2 }}>~{mid} km midpoint · {s.dist} km you · {theirDist} km them</div>
                    </div>
                    <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, boxShadow: sel ? 'none' : 'inset 0 0 0 2px var(--line)', background: sel ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sel && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 13.5, color: TT.ink2, margin: '20px 2px 9px' }}>Public meetup spots</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ id: 'lib', name: 'Central Library — café', sub: '1.6 km midpoint · busy, well-lit', emoji: '📚' },
                { id: 'mall', name: 'Riverside Mall food court', sub: '2.1 km midpoint · public & central', emoji: '🛍️' },
                { id: 'cafe', name: 'Grounds Coffee on Main', sub: '1.2 km midpoint · cameras, seating', emoji: '☕' }].map(p => {
                const sel = place && place.id === p.id;
                return (
                  <button key={p.id} onClick={() => setPlace({ id: p.id, name: p.name, sub: p.sub, kind: 'public', tint: 'var(--muted)', initial: p.emoji })} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                    background: sel ? 'var(--accent-wash)' : TT.surface, borderRadius: 14, padding: 13, boxShadow: sel ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: TT.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>{p.name}</div>
                      <div style={{ fontFamily: TT.sans, fontSize: 11.5, color: TT.muted }}>{p.sub}</div>
                    </div>
                    <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, boxShadow: sel ? 'none' : 'inset 0 0 0 2px var(--line)', background: sel ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sel && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 13.5, color: TT.ink2, margin: '20px 2px 9px' }}>Or propose your own</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TT.surface, borderRadius: 13, padding: '12px 14px', boxShadow: place && place.id === 'custom' ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <input value={customSpot} onChange={e => { setCustomSpot(e.target.value); setPlace(e.target.value.trim() ? { id: 'custom', name: e.target.value.trim(), sub: 'Proposed by you · pending agreement', kind: 'custom', tint: 'var(--accent)', initial: '📍' } : null); }}
                placeholder="e.g. Eastgate Park pavilion, Sat morning" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TT.sans, fontSize: 14.5, minWidth: 0 }} />
            </div>

            <button onClick={() => setPhase('sent')} disabled={!place} style={{ width: '100%', marginTop: 18, background: TT.accent, color: '#fff', borderRadius: 14, padding: 16,
              fontFamily: TT.sans, fontWeight: 700, fontSize: 16, opacity: place ? 1 : 0.45, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
              {place ? 'Propose ' + (place.name.length > 22 ? 'this spot' : place.name) + ' →' : 'Pick a meetup spot'}
            </button>
          </div>
        )}

        {/* ── SENT ── */}
        {phase === 'sent' && trader && (
          <TradeSent app={app} trader={trader} giveSel={giveSel} getSel={getSel} cash={cash} cashWho={cashWho} place={place} setPhase={setPhase} setPlace={setPlace} />
        )}
      </div>
    </div>
  );
}

function MiniFace({ item }) {
  return <div style={{ width: 34, height: 47, borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}><CardArtT item={item} w={34} radius={5} /></div>;
}

function PrefRow({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 12.5, color: TT.ink2, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{children}</div>
    </div>
  );
}
function PrefChip({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 13, padding: '7px 13px', borderRadius: 999,
      background: on ? TT.accent : TT.surface, color: on ? '#fff' : TT.ink2, boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{children}</button>
  );
}

function SideLabel({ color, title, sub, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
        <span style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 15 }}>{title}</span>
        <span style={{ fontFamily: TT.sans, fontSize: 12, color: TT.muted }}>{sub}</span>
      </div>
      <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 14 }}>{total}</span>
    </div>
  );
}

function TradeSent({ app, trader, giveSel, getSel, cash, cashWho, place, setPhase, setPlace }) {
  const { byId: byIdL } = window;
  // location negotiation: proposed → countered → agreed
  const [stage, setStage] = React.useState('proposed');
  React.useEffect(() => {
    if (stage === 'proposed') {
      const t = setTimeout(() => setStage('countered'), 3000);
      return () => clearTimeout(t);
    }
  }, [stage]);
  const counterSpot = { id: 'counter', name: 'Northside Collectibles', sub: trader.name + "'s pick · 0.5 km from them · trade hub", kind: 'shop', tint: '#7c3aed', initial: 'N' };
  const agreedPlace = stage === 'accepted-counter' ? counterSpot : place;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '70px 24px 18px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 999, background: stage === 'proposed' ? 'var(--accent-wash)' : 'var(--up-wash)', color: stage === 'proposed' ? 'var(--accent)' : 'var(--up)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{stage === 'proposed' ? IconT.gavel({ width: 38, height: 38 }) : IconT.check({ width: 42, height: 42 })}</div>
        <h1 style={{ margin: '18px 0 4px', fontFamily: TT.sans, fontWeight: 800, fontSize: 23, letterSpacing: -0.5 }}>{stage === 'proposed' ? 'Trade proposed!' : 'Trade & spot agreed! 🎉'}</h1>
        <p style={{ fontFamily: TT.sans, fontSize: 14, color: TT.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 290 }}>
          {stage === 'proposed'
            ? <span>{trader.name} got your offer and your suggested spot, <b style={{ color: TT.ink }}>{place.name}</b>. Waiting for them to confirm the location…</span>
            : <span>You and {trader.name} agreed to meet at <b style={{ color: TT.ink }}>{agreedPlace.name}</b>. Bring your cards!</span>}
        </p>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* trade summary */}
        <div style={{ background: TT.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TT.sans, fontSize: 10.5, fontWeight: 700, color: TT.accent, marginBottom: 6 }}>YOU GIVE</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{giveSel.map(id => <MiniFace key={id} item={byIdL(id)} />)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TT.sans, fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6 }}>YOU GET</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{getSel.map(id => <MiniFace key={id} item={byIdL(id)} />)}</div>
            </div>
          </div>
          {cash > 0 && <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)', fontFamily: TT.sans, fontSize: 12.5, color: TT.ink2 }}>
            + {moneyT(cash, { cents: false })} cash {cashWho === 'you' ? 'from you' : 'from ' + trader.name}</div>}
        </div>

        {/* location negotiation card */}
        <div style={{ marginTop: 12, background: TT.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TT.sans, fontWeight: 800, fontSize: 13.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 Meetup location {stage !== 'proposed' && <span style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 10, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 6, padding: '2px 7px' }}>AGREED</span>}
          </div>
          {/* your proposed spot */}
          <PlaceLine place={place} byWho="You proposed" active={stage !== 'accepted-counter'} agreed={stage === 'agreed'} />
          {/* partner counter (appears after they reply) */}
          {stage !== 'proposed' && (
            <div style={{ marginTop: 9 }}>
              <PlaceLine place={counterSpot} byWho={trader.name + ' countered'} active={stage === 'accepted-counter'} agreed={stage === 'accepted-counter'} />
            </div>
          )}
        </div>

        {/* chat-style replies */}
        {stage !== 'proposed' && (
          <div style={{ marginTop: 12, background: TT.surface, borderRadius: 14, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <Avatar who={trader} size={34} />
            <div style={{ flex: 1, fontFamily: TT.sans, fontSize: 13, color: TT.ink, lineHeight: 1.45 }}>
              <b>{trader.name}:</b> {stage === 'countered' ? 'Accepted the trade! Any chance we meet at Northside Collectibles instead? It\u2019s right by me. 🙏' : stage === 'agreed' ? 'Perfect, see you there! 🎉' : 'Works for me — see you at ' + counterSpot.name + '! 🎉'}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', marginTop: 'auto' }}>
        {stage === 'proposed' && (
          <div style={{ fontFamily: TT.sans, fontSize: 13, color: TT.muted, textAlign: 'center' }}>Waiting for {trader.name} to respond…</div>
        )}
        {stage === 'countered' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStage('agreed')} style={{ flex: 1, background: TT.surface, color: TT.ink, borderRadius: 14, padding: 14, fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Keep my spot</button>
            <button onClick={() => setStage('accepted-counter')} style={{ flex: 1.3, background: TT.accent, color: '#fff', borderRadius: 14, padding: 14, fontFamily: TT.sans, fontWeight: 700, fontSize: 14.5 }}>Accept their spot</button>
          </div>
        )}
        {(stage === 'agreed' || stage === 'accepted-counter') && (
          <button onClick={() => app.nav.setTab('home')} style={{ width: '100%', background: TT.accent, color: '#fff', borderRadius: 14, padding: 15, fontFamily: TT.sans, fontWeight: 700, fontSize: 15.5 }}>Done · add to calendar</button>
        )}
        <button onClick={() => app.nav.setTab('home')} style={{ width: '100%', marginTop: 9, color: TT.muted, fontFamily: TT.sans, fontWeight: 600, fontSize: 14 }}>Back to browse</button>
      </div>
    </div>
  );
}

function PlaceLine({ place, byWho, active, agreed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, borderRadius: 12, padding: '10px 12px',
      background: active ? 'var(--accent-wash)' : TT.surface2, boxShadow: active ? 'inset 0 0 0 1.5px var(--accent)' : 'none', opacity: active ? 1 : 0.7 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: place.tint || 'var(--muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: place.kind === 'shop' ? 16 : 18 }}>{place.initial}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TT.sans, fontWeight: 700, fontSize: 13.5 }}>{place.name}</div>
        <div style={{ fontFamily: TT.sans, fontSize: 11, color: TT.muted }}>{place.sub}</div>
      </div>
      <span style={{ fontFamily: TT.sans, fontSize: 10, fontWeight: 700, color: agreed ? 'var(--up)' : TT.faint, whiteSpace: 'nowrap' }}>{agreed ? '✓ ' + byWho.split(' ')[0] : byWho}</span>
    </div>
  );
}

Object.assign(window, { TradeScreen });
