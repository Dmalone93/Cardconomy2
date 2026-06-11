// ─────────────────────────────────────────────────────────────
// CARDONOMY Desktop — Trade hub, LGS storefront, Shop dashboard
// ─────────────────────────────────────────────────────────────
const { T: TTr, money: mTr, CardArt: CardArtTr, GradeChip: GradeChipTr, Stars: StarsTr, Icon: IconTr, Sparkline: SparkTr } = window;
const { TRADERS: TRADERS_D, TRADE_POSTS: POSTS_D, OWNED_REFS: OWNED_D, SHOPS: SHOPS_D, byId: byIdTr, traderById: traderByIdTr, gameById: gameByIdTr, setById: setByIdTr } = window;
const { SUBMISSION: SUB_D, SUB_CARDS: SUBC_D, BULK_RATES: BULK_D, subStats: subStatsD } = window;

const m0Tr = (n) => mTr(n, { cents: false });
function AvatarD({ who, size = 44 }) {
  return <span style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0, background: who.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.42 }}>{who.initial}</span>;
}
function MiniFaceD({ id }) { const it = byIdTr(id); return it ? <div style={{ width: 40, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}><CardArtTr item={it} w={40} radius={6} /></div> : null; }

// ── TRADE HUB ────────────────────────────────────────────────
function DTrade({ app }) {
  const [tab, setTab] = React.useState('board');
  return (
    <div className="wrap" style={{ padding: '32px 24px 30px' }}>
      <h1 style={{ fontFamily: TTr.sans, fontWeight: 800, fontSize: 34, letterSpacing: -1, margin: '0 0 6px' }}>Trade with collectors</h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0 0 22px', maxWidth: 640, lineHeight: 1.5 }}>Swap cards directly — no cash needed. Browse open trades or your 2-way matches, then meet at a local shop to settle in person.</p>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        {[['board', 'Open to Offers'], ['matches', 'Your matches'], ['post', 'Post a trade']].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '12px 18px', fontWeight: 700, fontSize: 15, position: 'relative', color: tab === id ? 'var(--accent)' : 'var(--ink-2)' }}>
            {l}{tab === id && <div style={{ position: 'absolute', left: 14, right: 14, bottom: -1, height: 3, borderRadius: 3, background: 'var(--accent)' }} />}
          </button>
        ))}
      </div>

      {tab === 'board' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {POSTS_D.map(p => {
            const t = traderByIdTr(p.trader), card = byIdTr(p.offer);
            if (!card) return null;
            const chips = [];
            if (p.prefs.games?.length) p.prefs.games.forEach(g => chips.push(gameByIdTr(g)?.short || g)); else chips.push('Any game');
            if (p.prefs.cond && p.prefs.cond !== 'Any') chips.push(p.prefs.cond);
            if (p.prefs.slab && p.prefs.slab !== 'Any') chips.push(p.prefs.slab);
            return (
              <div key={p.id} style={{ background: 'var(--surface)', borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                  <AvatarD who={t} size={40} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.dist} mi · {t.rating}%</div></div>
                  <span style={{ fontWeight: 700, fontSize: 10.5, color: 'var(--gold)', background: 'oklch(0.95 0.06 85)', borderRadius: 7, padding: '4px 9px' }}>OPEN TO OFFERS</span>
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 13 }}>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 8, flexShrink: 0 }}><CardArtTr item={card} w={64} /></div>
                  <div><div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.3 }}>OFFERING</div><div style={{ fontWeight: 700, fontSize: 16 }}>{card.name}</div><div style={{ fontFamily: TTr.mono, fontSize: 12.5, color: 'var(--muted)' }}>{m0Tr(card.market)} market</div></div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.3, marginBottom: 7 }}>{p.open ? 'LOOKING FOR · open' : 'LOOKING FOR'}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {!p.open && p.wants && p.wants.map(id => byIdTr(id) && <span key={id} style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--accent)', background: 'var(--accent-wash)', borderRadius: 7, padding: '3px 9px' }}>{byIdTr(id).name}</span>)}
                  {chips.map((c, i) => <span key={i} style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--ink-2)', background: 'var(--surface-2)', borderRadius: 7, padding: '3px 9px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>{c}</span>)}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontStyle: 'italic', marginBottom: 13, lineHeight: 1.4 }}>“{p.note}”</div>
                <button onClick={() => app.toast('Offer builder — continue in the app')} style={{ width: '100%', background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: 12, fontWeight: 700, fontSize: 14 }}>Make an offer</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'matches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
          {TRADERS_D.map(t => {
            const youGet = t.haves.filter(id => byIdTr(id)), youGive = OWNED_D.filter(id => t.wants.includes(id));
            return (
              <div key={t.id} style={{ background: 'var(--surface)', borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                  <AvatarD who={t} size={42} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.dist} mi · {t.rating}% · {t.deals} trades</div></div>
                  <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 7, padding: '4px 9px' }}>2-way match</span>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--up)', marginBottom: 6, letterSpacing: 0.2 }}>YOU GET</div><div style={{ display: 'flex', gap: 5 }}>{youGet.slice(0, 2).map(id => <MiniFaceD key={id} id={id} />)}</div></div>
                  <div style={{ width: 1, background: 'var(--line-2)' }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 6, letterSpacing: 0.2 }}>THEY WANT</div><div style={{ display: 'flex', gap: 5 }}>{youGive.slice(0, 2).map(id => <MiniFaceD key={id} id={id} />)}</div></div>
                </div>
                <button onClick={() => app.toast('Trade builder — continue in the app')} style={{ width: '100%', marginTop: 14, background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: 12, fontWeight: 700, fontSize: 14 }}>Build this trade</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'post' && (
        <div style={{ maxWidth: 560, background: 'var(--surface)', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Post a card, stay open to offers</div>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 18px', lineHeight: 1.5 }}>List a card you'll part with and set the criteria you'd accept. Collectors propose; you decide.</p>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Pick a card to offer</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            {OWNED_D.map(id => byIdTr(id) && <div key={id} style={{ background: 'var(--surface-2)', borderRadius: 9, padding: 7 }}><CardArtTr item={byIdTr(id)} w={56} /></div>)}
          </div>
          <button onClick={() => app.toast('Posted to the board ★')} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: '13px 24px', fontWeight: 700, fontSize: 15 }}>Post to the board</button>
        </div>
      )}
    </div>
  );
}

// ── LGS STOREFRONT ───────────────────────────────────────────
function DStorefront({ app, params = {} }) {
  const shop = SHOPS_D.find(s => s.id === params.shop) || SHOPS_D[0];
  const inv = (shop.inventory || []).map(byIdTr).filter(Boolean);
  return (
    <div>
      <div style={{ height: 200, background: 'linear-gradient(135deg, ' + shop.tint + ', ' + shop.tint + 'bb)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 16px, transparent 16px 32px)' }} />
      </div>
      <div className="wrap" style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -44, position: 'relative', marginBottom: 24 }}>
          <span style={{ width: 96, height: 96, borderRadius: 24, background: shop.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 42, border: '4px solid var(--bg)', flexShrink: 0 }}>{shop.initial}</span>
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><h1 style={{ fontFamily: TTr.sans, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>{shop.name}</h1>{IconTr.shield({ width: 18, height: 18, style: { color: shop.tint } })}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 13.5, color: 'var(--muted)' }}><StarsTr rating={shop.rating * 20} /> {shop.rating} · {shop.reviews.toLocaleString()} reviews · {shop.loc} · {shop.dist} mi</div>
          </div>
          <button onClick={() => app.toast('Following ' + shop.name)} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: '12px 24px', fontWeight: 700, fontSize: 14.5 }}>+ Follow shop</button>
          <button onClick={() => app.go('trade')} style={{ background: 'var(--surface)', color: 'var(--ink)', borderRadius: 11, padding: '12px 24px', fontWeight: 700, fontSize: 14.5, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Trade here</button>
        </div>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 640, margin: '0 0 24px' }}>{shop.blurb}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 36 }}>
          {[shop.enrolled && ['Buylist intake', 'Sell your stack here'], shop.tradeHub && ['Trade hub', 'Swap on neutral ground'], shop.vault && ['Local vault', 'Store & trade graded cards'], shop.events && ['Events', 'Tournaments & trade nights']].filter(Boolean).map(([t, s], i) => (
            <div key={i} style={{ background: 'var(--surface)', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}><div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div><div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{s}</div></div>
          ))}
        </div>

        {inv.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: TTr.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, margin: '0 0 18px' }}>In stock now</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 18 }}>{inv.map(l => <window.DCard key={l.id} item={l} app={app} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SHOP DASHBOARD (buylist inbox + submission review) ───────
function DShopDash({ app }) {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('match');
  const stats = subStatsD();
  const matched = SUBC_D.filter(c => c.buylist);
  const buylistPayout = stats.buylistPayout;
  const rows = SUBC_D.filter(c => filter === 'all' || (filter === 'match' ? c.buylist : filter === 'flag' ? c.flag : !c.buylist && !c.flag));

  if (!open) {
    return (
      <div className="wrap" style={{ padding: '32px 24px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: TTr.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.9, margin: 0 }}>Buylist inbox</h1>
          <span style={{ fontWeight: 700, fontSize: 11, color: '#2f8f5b', background: 'var(--up-wash)', borderRadius: 7, padding: '4px 9px' }}>SHOP VIEW · Gnome Games</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 24px' }}>Collection submissions from walk-in sellers, queued for review.</p>
        <button onClick={() => setOpen(true)} style={{ width: '100%', textAlign: 'left', background: 'var(--accent-wash)', borderRadius: 16, padding: 22, boxShadow: 'inset 0 0 0 2px var(--accent)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <AvatarD who={{ initial: SUB_D.seller.initial, tint: '#2f8f5b' }} size={48} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 18 }}>{SUB_D.seller.name} · {SUB_D.total.toLocaleString()} cards</div><div style={{ fontSize: 13, color: 'var(--muted)' }}>{SUB_D.submittedAgo} · ticket #{SUB_D.ticket}</div></div>
            <span style={{ fontWeight: 800, fontSize: 10.5, color: '#fff', background: 'var(--down)', borderRadius: 999, padding: '4px 10px' }}>NEW</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[[stats.buylistCount, '★ buylist hits', 'var(--accent)'], [m0Tr(buylistPayout), 'est. payout', 'var(--ink)'], [m0Tr(stats.estMarket), 'market value', 'var(--ink)']].map(([v, k, c], i) => (
              <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '12px 14px' }}><div style={{ fontFamily: TTr.mono, fontWeight: 700, fontSize: 19, color: c }}>{v}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{k}</div></div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: 13, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Review submission →</div>
        </button>
        {[['S', 'Sam R.', '64 cards', '18 min ago', '12 hits'], ['D', 'Dana P.', '310 cards', '1 hr ago · offer sent', 'replied'], ['M', 'Miguel A.', '1,420 cards', '3 hr ago · completed', 'paid']].map(([i, n, c, m, tag], k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', borderRadius: 13, padding: 16, marginBottom: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <AvatarD who={{ initial: i, tint: 'var(--surface-2)' }} size={40} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{n} · {c}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{m}</div></div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{tag}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: '28px 24px 30px' }}>
      <button onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>‹ Back to inbox</button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div><h1 style={{ fontFamily: TTr.sans, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>{SUB_D.seller.name} · #{SUB_D.id}</h1><div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>{SUB_D.total.toLocaleString()} cards · ticket #{SUB_D.ticket}</div></div>
        <button onClick={() => app.toast('Offer sent to ' + SUB_D.seller.name)} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: '13px 26px', fontWeight: 700, fontSize: 15 }}>Build offer →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[['Total cards', SUB_D.total.toLocaleString(), false], ['Est. market', m0Tr(stats.estMarket), false], ['On your buylist', stats.buylistCount, 'gold'], ['Buylist payout', m0Tr(buylistPayout), 'accent']].map(([k, v, hl], i) => (
          <div key={i} style={{ background: hl === 'gold' ? 'var(--accent-wash)' : 'var(--surface)', borderRadius: 14, padding: '16px 18px', boxShadow: hl === 'gold' ? 'inset 0 0 0 1.5px var(--gold)' : hl === 'accent' ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{k}</div><div style={{ fontFamily: TTr.mono, fontWeight: 700, fontSize: 24, color: hl === 'accent' ? 'var(--accent)' : 'var(--ink)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['match', '★ Buylist ' + stats.buylistCount], ['singles', 'Singles ≥ $5'], ['flag', '⚠ Flagged'], ['all', 'All itemized']].map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ padding: '9px 15px', borderRadius: 999, fontWeight: 700, fontSize: 13, background: filter === id ? 'var(--fill)' : 'var(--surface)', color: filter === id ? '#fff' : 'var(--ink-2)', boxShadow: filter === id ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{l}</button>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 130px', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--line)', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}><span>CARD</span><span>CONDITION</span><span>QTY</span><span>BUYLIST</span></div>
        {rows.map(c => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 130px', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', background: c.buylist ? 'var(--accent-wash)' : c.flag ? 'oklch(0.97 0.02 24)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ background: 'var(--surface-2)', borderRadius: 7, padding: 4, flexShrink: 0 }}><CardArtTr item={c} w={30} radius={4} /></div>
              <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}{c.flag && <span style={{ color: 'var(--down)' }}> ⚠</span>}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{setByIdTr(c.set)?.name?.replace(/\s*\(.*\)/, '')} · mkt {m0Tr(c.market)}</div></div>
            </div>
            <span><GradeChipTr grade={c.grade} /></span>
            <span style={{ fontFamily: TTr.mono, fontSize: 13.5 }}>×{c.qty}</span>
            <span>{c.buylist ? <span><b style={{ color: 'var(--accent)', fontFamily: TTr.mono }}>{m0Tr(c.buylist.buy)}</b> <span style={{ fontSize: 11, color: 'var(--muted)' }}>· want {c.buylist.want}</span></span> : c.flag ? <span style={{ color: 'var(--down)', fontSize: 12.5, fontWeight: 600 }}>inspect</span> : <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>not listed</span>}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'var(--surface-2)' }}>
          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{SUB_D.bulkCount.toLocaleString()} bulk · standing rates</span>
          <span style={{ fontFamily: TTr.mono, fontWeight: 700, fontSize: 15, color: 'var(--accent)' }}>{mTr(SUB_D.bulkPayout)}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DTrade, DStorefront, DShopDash });
