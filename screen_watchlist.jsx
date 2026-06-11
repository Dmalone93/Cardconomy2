// ─────────────────────────────────────────────────────────────
// Watchlist / Collection + Profile
// ─────────────────────────────────────────────────────────────
const { T: TW, money: moneyW, CardArt: CardArtW, GradeChip: GradeChipW, Sparkline: SparkW, Delta: DeltaW, Stars: StarsW, Icon: IconW } = window;
const { byId: byIdW, LISTINGS: LISTINGS_W, setById: setByIdW } = window;

// value helpers for a set of card ids
function valueOf(ids) {
  const cards = ids.map(id => byIdW(id)).filter(Boolean);
  const now = cards.reduce((s, c) => s + (c.market || c.price || 0), 0);
  const then = cards.reduce((s, c) => s + (c.history ? c.history[0] : (c.market || c.price || 0)), 0);
  const series = cards[0] && cards[0].history
    ? cards[0].history.map((_, i) => cards.reduce((s, c) => s + (c.history ? c.history[i] : (c.market || c.price || 0)), 0))
    : [];
  return { cards, now, then, series };
}

function WatchScreen({ app }) {
  const [tab, setTab] = React.useState('watch');
  const watched = app.watch.map(id => byIdW(id)).filter(Boolean)
    .sort((a, b) => (app.isBidding(b.id) ? 1 : 0) - (app.isBidding(a.id) ? 1 : 0));

  // overall portfolio = union of all collection cards
  const port = valueOf(app.ownedIds());

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* header w/ tabs */}
      <div style={{ padding: '56px 16px 0', background: TW.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 4px' }}>
          <button onClick={() => app.openMenu()} style={{ color: TW.ink, padding: '2px 2px 2px 0', display: 'flex' }}>{IconW.menu({})}</button>
          <h1 style={{ margin: 0, fontFamily: TW.sans, fontWeight: 800, fontSize: 26, letterSpacing: -0.6 }}>Your cards</h1>
        </div>
        <p style={{ fontFamily: TW.sans, fontSize: 14.5, color: TW.muted, margin: '0 0 14px', lineHeight: 1.45 }}>
          Track prices on cards you're watching and the value of your collection.
        </p>
        <div style={{ display: 'flex', gap: 22 }}>
          {[['watch', 'Watching ' + watched.length], ['collection', 'Collection']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ paddingBottom: 11, position: 'relative',
              fontFamily: TW.sans, fontWeight: tab===id?700:600, fontSize: 15.5, color: tab===id?TW.ink:TW.faint }}>
              {label}
              {tab===id && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderRadius: 999, background: TW.accent }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>
        {tab === 'watch' ? (
          watched.length === 0 ? (
            <EmptyState icon={IconW.heart({ width: 40, height: 40 }, false)} title="Nothing saved yet"
              body="Tap the heart on any card to track its price and get notified before auctions end."
              cta="Browse cards" onCta={() => app.nav.setTab('home')} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {watched.map(item => <WatchRow key={item.id} item={item} app={app} />)}
            </div>
          )
        ) : (
          <div>
            {/* overall portfolio header */}
            <div style={{ background: 'var(--fill)', borderRadius: 18, padding: 18, color: '#fff', marginBottom: 16 }}>
              <div style={{ fontFamily: TW.sans, fontSize: 12.5, opacity: 0.7, fontWeight: 600 }}>Total portfolio value</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 30, letterSpacing: -0.5 }}>{moneyW(port.now)}</span>
                <DeltaW from={port.then} to={port.now} style={{ fontSize: 13, color: port.now>=port.then?'#7fe7a4':'#ff9b8a' }} />
              </div>
              <div style={{ marginTop: 12, marginLeft: -4 }}>
                <SparkW data={port.series} w={320} h={56} up={port.now>=port.then} dots />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: TW.sans, fontSize: 11.5, opacity: 0.7 }}>
                <span>{app.ownedIds().length} cards · {app.collections.length} collections</span><span>Updated just now</span>
              </div>
            </div>

            {/* collection folders */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 2px 10px' }}>
              <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15 }}>Your collections</span>
              <button onClick={() => { const n = (window.prompt && window.prompt('Name your collection', '')) || ''; if (n !== null && n.trim()) { const id = app.addCollection(n.trim()); app.nav.push('collection', { cid: id }); } }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: TW.accent }}>
                {IconW.plus ? IconW.plus({ width: 15, height: 15 }) : '+'} New
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {app.collections.map(col => {
                const v = valueOf(col.cards);
                return (
                  <button key={col.id} onClick={() => app.nav.push('collection', { cid: col.id })} style={{ width: '100%', textAlign: 'left',
                    background: TW.surface, borderRadius: 16, padding: 14, display: 'flex', gap: 13, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <span style={{ width: 46, height: 46, borderRadius: 13, background: TW.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{col.icon || '🃏'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</div>
                      <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>{col.cards.length} card{col.cards.length!==1?'s':''}</div>
                    </div>
                    <div style={{ width: 54, opacity: 0.9 }}>{v.series.length>1 && <SparkW data={v.series} w={54} h={24} up={v.now>=v.then} fill={false} />}</div>
                    <div style={{ textAlign: 'right', minWidth: 60 }}>
                      <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14.5 }}>{moneyW(v.now)}</div>
                      <DeltaW from={v.then} to={v.now} style={{ fontSize: 11 }} />
                    </div>
                    {IconW.chevron({ style: { color: TW.faint } })}
                  </button>
                );
              })}
              {app.collections.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: TW.muted, fontFamily: TW.sans, fontSize: 14 }}>No collections yet — tap “New” to start one.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WatchRow({ item, app }) {
  const then = item.history ? item.history[item.history.length-3] : item.price;
  return (
    <div style={{ background: TW.surface, borderRadius: 14, padding: 10, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <button onClick={() => app.nav.push('listing', { id: item.id })} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ background: TW.surface2, borderRadius: 9, padding: 6 }}><CardArtW item={item} w={48} radius={6} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <GradeChipW grade={item.grade} />
            {app.isBidding(item.id) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0, whiteSpace: 'nowrap', fontFamily: TW.sans, fontWeight: 800, fontSize: 10,
                color: '#fff', background: app.bids[item.id] >= item.price ? 'var(--accent)' : 'var(--down)',
                borderRadius: 6, padding: '2px 6px' }}>{IconW.gavel({ width: 10, height: 10 })} {app.bids[item.id] >= item.price ? 'TOP BID' : 'OUTBID'}</span>
            )}
          </div>
          <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
          <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: item.type==='auction'?TW.down:TW.muted, fontWeight: item.type==='auction'?700:400 }}>
            {app.isBidding(item.id) ? 'Your bid ' + moneyW(app.bids[item.id]) + ' · ' + item.timeLeft
              : item.type==='auction' ? '⏱ Ends in ' + item.timeLeft + ' · ' + item.bids + ' bids' : 'Buy It Now'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>{moneyW(item.price)}</div>
          <DeltaW from={then} to={item.price} style={{ fontSize: 11 }} />
        </div>
      </button>
      <button onClick={() => app.toggleWatch(item.id)} style={{ color: TW.down, padding: 4, flexShrink: 0 }}>{IconW.heart({ width: 20, height: 20 }, true)}</button>
    </div>
  );
}

function CollectionRow({ item, app }) {
  const then = item.history ? item.history[0] : item.market;
  return (
    <button onClick={() => app.nav.push('listing', { id: item.id })} style={{ width: '100%', textAlign: 'left',
      background: TW.surface, borderRadius: 14, padding: 10, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ background: TW.surface2, borderRadius: 9, padding: 6 }}><CardArtW item={item} w={48} radius={6} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted }}>{setByIdW(item.set)?.name?.replace(/\s*\(.*\)/,'')} · <GradeInline grade={item.grade} /></div>
      </div>
      <div style={{ width: 60, opacity: 0.9 }}><SparkW data={item.history} w={60} h={26} up={item.market>=then} fill={false} /></div>
      <div style={{ textAlign: 'right', minWidth: 64 }}>
        <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14.5 }}>{moneyW(item.market)}</div>
        <DeltaW from={then} to={item.market} style={{ fontSize: 11 }} />
      </div>
    </button>
  );
}

function GradeInline({ grade }) {
  if (grade.company === 'raw') return <span>Raw</span>;
  return <span>{grade.company.toUpperCase()} {grade.grade}</span>;
}

function EmptyState({ icon, title, body, cta, onCta }) {
  return (
    <div style={{ textAlign: 'center', padding: '70px 24px' }}>
      <div style={{ width: 80, height: 80, margin: '0 auto 18px', borderRadius: 999, background: TW.surface, color: TW.faint,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>{icon}</div>
      <h3 style={{ margin: 0, fontFamily: TW.sans, fontWeight: 800, fontSize: 19 }}>{title}</h3>
      <p style={{ fontFamily: TW.sans, fontSize: 14, color: TW.muted, lineHeight: 1.5, margin: '8px auto 18px', maxWidth: 270 }}>{body}</p>
      <button onClick={onCta} style={{ background: TW.accent, color: '#fff', borderRadius: 12, padding: '12px 24px', fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>{cta}</button>
    </div>
  );
}

// ── Profile ──────────────────────────────────────────────────
function ProfileScreen({ app }) {
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const ACCT_LABEL = { buyer: 'Collector', seller: 'Individual seller', store: 'Game shop' };
  const followed = (window.GAMES || []).filter(g => app.inPrefs(g.id));
  const menu = [
    ['Purchases', '3 orders', IconW.truck, 'purchases'],
    ['Selling', '2 active listings', IconW.tag, 'selling'],
    ['Offers', '1 pending', IconW.gavel, 'offers'],
    ['Verification & trust', app.tier >= 2 ? 'Trusted Seller' : app.tier >= 1 ? 'ID Verified' : 'Get verified', IconW.shield, 'verify'],
    ['Payments & payouts', '', IconW.shield, 'payments'],
    ['Notifications', '2 new', IconW.bolt, 'notifications'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      <div style={{ padding: '50px 16px 20px', background: TW.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <button onClick={() => app.openMenu()} style={{ color: TW.ink, padding: '2px 6px 2px 0', display: 'flex' }}>{IconW.menu({})}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: TW.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 26 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 20, letterSpacing: -0.3 }}>Alex Rivera</span>
              {window.TrustBadge && app.tier >= 1 && <window.TrustBadge tier={app.tier >= 2 ? 2 : 1} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <StarsW rating={99} /><span style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>99% · 214 deals</span>
            </div>
          </div>
          {IconW.shield({ style: { color: TW.up } })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[['Buying power', '$2,400'], ['This year', '$8.1k spent'], ['Sold', '$3.4k']].map(([k,v]) => (
            <div key={k} style={{ flex: 1, background: TW.surface2, borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>{v}</div>
              <div style={{ fontFamily: TW.sans, fontSize: 10.5, color: TW.muted }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>
        {window.VerifyGate && <div style={{ marginBottom: 12 }}><window.VerifyGate app={app} need={1} action="sell, bid & trade" /></div>}

        {/* account type */}
        <div style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: TW.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {app.acct === 'store' ? '🏪' : app.acct === 'seller' ? '💸' : '🎴'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted, fontWeight: 600 }}>Account type</div>
              <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15.5 }}>{ACCT_LABEL[app.acct] || 'Collector'}</div>
            </div>
            {app.acct === 'store' && <window.Badge tone="accent">Verified shop</window.Badge>}
          </div>
          {app.acct === 'buyer' && (
            <button onClick={() => { app.setAcct('seller'); app.toast('You can now sell 🎉'); }} style={{ width: '100%', marginTop: 12, background: TW.ink, color: '#fff',
              borderRadius: 11, padding: '11px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              {IconW.sell({ width: 17, height: 17 })} Become a seller
            </button>
          )}
          {app.acct === 'seller' && (
            <button onClick={() => app.nav.push('enroll_shop')} style={{ width: '100%', marginTop: 12, background: TW.surface2, color: TW.ink,
              borderRadius: 11, padding: '11px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5 }}>Run a shop? Enroll as a Local Game Store →</button>
          )}
        </div>

        {/* preferred games */}
        <button onClick={() => setPrefsOpen(true)} style={{ width: '100%', textAlign: 'left', background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 11, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: TW.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TW.muted, flexShrink: 0 }}>{IconW.filter({ width: 19, height: 19 })}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15.5 }}>Games you follow</div>
            <div style={{ fontFamily: TW.sans, fontSize: 12.5, color: TW.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {app.allGamesSelected() ? 'All games' : followed.map(g => g.short).join(' · ')}
            </div>
          </div>
          <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: TW.accent }}>Edit</span>
        </button>

        <button onClick={() => app.nav.setTab('sell')} style={{ width: '100%', background: TW.accent, color: '#fff', borderRadius: 14, padding: 15,
          fontFamily: TW.sans, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          {IconW.sell({ width: 20, height: 20 })} List a card to sell
        </button>

        {/* buylist card */}
        <button onClick={() => app.nav.push('buylist')} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13,
          background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: 'var(--gold)', color: '#3a2a00',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.6 1.1-6L3.4 9.4l6-.8L12 3z"/></svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15.5 }}>My buylist</div>
            <div style={{ fontFamily: TW.sans, fontSize: 12.5, color: TW.muted }}>3 active · 2 matches available now</div>
          </div>
          {IconW.chevron({ style: { color: TW.faint } })}
        </button>

        <div style={{ background: TW.surface, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {menu.map(([title, sub, icon, route], i) => (
            <button key={title} onClick={() => app.nav.push(route)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px',
              borderBottom: i<menu.length-1 ? '1px solid var(--line-2)' : 'none', textAlign: 'left' }}>
              <span style={{ color: TW.muted }}>{icon({})}</span>
              <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 600, fontSize: 15 }}>{title}</span>
              {sub && <span style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted }}>{sub}</span>}
              {IconW.chevron({ style: { color: TW.faint } })}
            </button>
          ))}
        </div>
      </div>
      {window.GamePrefsSheet && <window.GamePrefsSheet app={app} open={prefsOpen} onClose={() => setPrefsOpen(false)} games={window.GAMES || []} />}
    </div>
  );
}

// ── Collection detail: one named bucket ──────────────────────
function CollectionDetailScreen({ app, params }) {
  const col = app.collections.find(c => c.id === params.cid);
  const [addOpen, setAddOpen] = React.useState(false);
  if (!col) {
    return (
      <div style={{ height: '100%', background: TW.bg, paddingTop: 90, textAlign: 'center', fontFamily: TW.sans, color: TW.muted }}>
        <button onClick={() => app.nav.pop()} style={{ color: TW.accent, fontWeight: 700 }}>← Back</button>
        <p>Collection not found.</p>
      </div>
    );
  }
  const v = valueOf(col.cards);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* header (back chevron — pushed screen) */}
      <div style={{ padding: '52px 14px 12px', background: TW.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TW.ink }}>{IconW.back({})}</button>
        <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 16, flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span>{col.icon || '🃏'}</span>{col.name}
        </span>
        <button onClick={() => { const n = window.prompt && window.prompt('Rename collection', col.name); if (n && n.trim()) app.renameCollection(col.id, n.trim()); }}
          style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: TW.accent, padding: '4px 6px' }}>Rename</button>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 30px' }}>
        {/* per-collection value */}
        <div style={{ background: 'var(--fill)', borderRadius: 18, padding: 18, color: '#fff', marginBottom: 16 }}>
          <div style={{ fontFamily: TW.sans, fontSize: 12.5, opacity: 0.7, fontWeight: 600 }}>Collection value</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 28, letterSpacing: -0.5 }}>{moneyW(v.now)}</span>
            <DeltaW from={v.then} to={v.now} style={{ fontSize: 13, color: v.now>=v.then?'#7fe7a4':'#ff9b8a' }} />
          </div>
          {v.series.length > 1 && <div style={{ marginTop: 12, marginLeft: -4 }}><SparkW data={v.series} w={320} h={50} up={v.now>=v.then} dots /></div>}
          <div style={{ marginTop: 8, fontFamily: TW.sans, fontSize: 11.5, opacity: 0.7 }}>{col.cards.length} card{col.cards.length!==1?'s':''}</div>
        </div>

        <button onClick={() => setAddOpen(true)} style={{ width: '100%', background: TW.accent, color: '#fff', borderRadius: 13, padding: 14,
          fontFamily: TW.sans, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {IconW.plus({ width: 19, height: 19 })} Add cards
        </button>

        {col.cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: TW.muted, fontFamily: TW.sans, fontSize: 14, lineHeight: 1.5 }}>
            This collection is empty.<br/>Add cards you own to track their value.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.cards.map(item => (
              <div key={item.id} style={{ background: TW.surface, borderRadius: 14, padding: 10, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <button onClick={() => app.nav.push('listing', { id: item.id })} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ background: TW.surface2, borderRadius: 9, padding: 6 }}><CardArtW item={item} w={44} radius={6} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted }}>{setByIdW(item.set)?.name?.replace(/\s*\(.*\)/,'')} · <GradeInline grade={item.grade} /></div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 58 }}>
                    <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>{moneyW(item.market || item.price)}</div>
                    <DeltaW from={item.history ? item.history[0] : (item.market||item.price)} to={item.market || item.price} style={{ fontSize: 11 }} />
                  </div>
                </button>
                <button onClick={() => app.removeCardFromCollection(col.id, item.id)} style={{ color: TW.faint, padding: 4, flexShrink: 0 }}>{IconW.trash({ width: 18, height: 18 })}</button>
              </div>
            ))}
          </div>
        )}

        {app.collections.length > 1 && (
          <button onClick={() => { if (!window.confirm || window.confirm('Delete this collection? Cards stay in your other collections.')) { app.deleteCollection(col.id); app.nav.pop(); } }}
            style={{ width: '100%', marginTop: 22, color: TW.down, fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5, padding: 10 }}>Delete collection</button>
        )}
      </div>

      {addOpen && <AddCardsSheet app={app} col={col} onClose={() => setAddOpen(false)} />}
    </div>
  );
}

// ── sheet: add cards to a collection ─────────────────────────
function AddCardsSheet({ app, col, onClose }) {
  if (!window.Sheet) return null;
  // candidates: everything except what's already in this collection
  const candidates = LISTINGS_W.filter(l => !col.cards.includes(l.id));
  return (
    <window.Sheet open={true} onClose={onClose} title={'Add to ' + col.name}>
      <p style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted, margin: '0 0 12px' }}>Tap a card you own to add it to this collection.</p>
      <div className="noscroll" style={{ maxHeight: 360, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {candidates.map(item => (
          <button key={item.id} onClick={() => { app.addCardToCollection(col.id, item.id); app.toast('Added to ' + col.name); }}
            style={{ width: '100%', textAlign: 'left', background: TW.surface2, borderRadius: 12, padding: 9, display: 'flex', gap: 11, alignItems: 'center' }}>
            <div style={{ background: TW.surface, borderRadius: 8, padding: 5 }}><CardArtW item={item} w={38} radius={5} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.muted }}>{moneyW(item.market || item.price)} · <GradeInline grade={item.grade} /></div>
            </div>
            <span style={{ color: TW.accent, flexShrink: 0 }}>{IconW.plus({ width: 19, height: 19 })}</span>
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 14, background: TW.ink, color: '#fff', borderRadius: 13, padding: 14, fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
    </window.Sheet>
  );
}

Object.assign(window, { WatchScreen, ProfileScreen, EmptyState, CollectionDetailScreen });
