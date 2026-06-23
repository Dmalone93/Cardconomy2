// ─────────────────────────────────────────────────────────────
// Watchlist / Collection + Profile
// ─────────────────────────────────────────────────────────────
const { T: TW, money: moneyW, CardArt: CardArtW, GradeChip: GradeChipW, Sparkline: SparkW, Delta: DeltaW, Stars: StarsW, Icon: IconW } = window;
const { byId: byIdW, LISTINGS: LISTINGS_W, setById: setByIdW } = window;
const { Sparkline: SparkD } = window;

const IconD = {
  bell: (p = {}) => <svg width={p.w || 20} height={p.w || 20} viewBox="0 0 24 24" fill="none" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  gear: (p = {}) => <svg width={p.w || 20} height={p.w || 20} viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>,
};

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
  const watched = app.watch.map(id => byIdW(id)).filter(Boolean);

  // overall portfolio = union of all collection cards
  const port = valueOf(app.ownedIds());

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* header w/ tabs */}
      <div style={{ padding: '14px 16px 0', background: TW.surface, borderBottom: '1px solid var(--line)' }}>
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
              body="Tap the heart on any card to track its price and get notified about deals."
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
              <div style={{ marginTop: 6, fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: port.now >= port.then ? '#7fe7a4' : '#ff9b8a' }}>
                +12.4% this month
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: TW.sans, fontSize: 11.5, opacity: 0.7 }}>
                <span>{app.ownedIds().length} cards · {app.collections.length} collections</span><span>Updated just now</span>
              </div>
            </div>

            {/* collection folders */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 2px 10px' }}>
              <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 15 }}>Your collections</span>
              <button onClick={() => { const n = (window.prompt && window.prompt('Name your collection', '')) || ''; if (n !== null && n.trim()) { const id = app.addCollection(n.trim()); app.nav.push('collection', { cid: id }); } }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
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
                <div style={{ textAlign: 'center', padding: '40px 20px', color: TW.muted, fontFamily: TW.sans, fontSize: 14 }}>No collections yet — tap "New" to start one.</div>
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
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertPrice, setAlertPrice] = React.useState('');
  const [alertSet, setAlertSet] = React.useState(null); // null or target price number
  return (
    <div style={{ background: TW.surface, borderRadius: 14, padding: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={() => app.nav.push('listing', { id: item.id })} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ background: TW.surface2, borderRadius: 9, padding: 6 }}><CardArtW item={item} w={48} radius={6} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GradeChipW grade={item.grade} />
            </div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted }}>Buy It Now</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>{moneyW(item.price)}</div>
            <DeltaW from={then} to={item.price} style={{ fontSize: 11 }} />
          </div>
        </button>
        <button onClick={() => setAlertOpen(!alertOpen)} style={{ color: alertSet ? TW.accent : TW.faint, padding: 4, flexShrink: 0 }} title="Set price alert">
          <span style={{ fontSize: 18 }}>{alertSet ? '\uD83D\uDD14' : '\uD83D\uDD15'}</span>
        </button>
        <button onClick={() => app.toggleWatch(item.id)} style={{ color: TW.down, padding: 4, flexShrink: 0 }}>{IconW.heart({ width: 20, height: 20 }, true)}</button>
      </div>
      {alertSet && !alertOpen && (
        <div style={{ marginTop: 6, marginLeft: 66, fontFamily: TW.sans, fontSize: 11.5, color: TW.accent, fontWeight: 600 }}>
          {'\uD83D\uDD14'} Alert when below {moneyW(alertSet)}
        </div>
      )}
      {alertOpen && (
        <div style={{ marginTop: 8, marginLeft: 66, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted, whiteSpace: 'nowrap' }}>Alert when below \u00A3</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            placeholder={item.price.toFixed(2)}
            style={{
              width: 80, padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)',
              fontFamily: TW.sans, fontSize: 13, fontWeight: 600, background: TW.surface2, color: TW.ink,
            }}
          />
          <button
            onClick={() => {
              const val = parseFloat(alertPrice);
              if (!val || val <= 0) return;
              setAlertSet(val);
              setAlertOpen(false);
              setAlertPrice('');
              app.toast('Price alert set for \u00A3' + val.toFixed(2));
            }}
            style={{
              background: 'var(--ink)', color: '#fff', borderRadius: 8, padding: '6px 12px',
              fontFamily: TW.sans, fontWeight: 700, fontSize: 12,
            }}
          >Set</button>
          {alertSet && (
            <button
              onClick={() => { setAlertSet(null); setAlertOpen(false); app.toast('Price alert removed'); }}
              style={{ fontFamily: TW.sans, fontSize: 12, color: TW.down, fontWeight: 600 }}
            >Clear</button>
          )}
        </div>
      )}
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
      <button onClick={onCta} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '12px 24px', fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>{cta}</button>
    </div>
  );
}

// ── Mini sparkline SVG helper ────────────────────────────────
function MiniSpark({ data, color, w, h }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), range = mx - mn || 1;
  const pts = data.map(function(v, i) { return (i / (data.length - 1)) * 100 + ',' + (30 - ((v - mn) / range) * 28); }).join(' ');
  return (
    <svg width={w || '100%'} height={h || 30} viewBox="0 0 100 30" preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color || TW.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Seller Dashboard (existing content, extracted) ───────────
function SellerDash({ app, header }) {
  const port = valueOf(app.ownedIds());
  const ACTIVITY = [
    ['#22c55e', 'Sold Charizard ex for \u00A338.50', '2h ago'],
    ['#3b82f6', 'New offer on Ragavan', '4h ago'],
    ['#a855f7', 'Completed trade with Marcus T.', 'Yesterday'],
    ['#f59e0b', 'Added 3 cards to Main Binder', '2d ago'],
    ['#ef4444', 'Price alert: Mew ex up 12%', '3d ago'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {header}
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
        {/* balance card */}
        <button onClick={() => app.nav.push('payments')} style={{ width: '100%', textAlign: 'left', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 20, padding: 20, color: '#fff', marginBottom: 14 }}>
          <div style={{ fontFamily: TW.sans, fontSize: 12, opacity: 0.65, fontWeight: 600 }}>Available balance</div>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 34, letterSpacing: -1, marginTop: 4 }}>{moneyW(248.47)}</div>
          <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: '#7fe7a4', marginTop: 4 }}>&#9650; {moneyW(84)} this week</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <span style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 0', fontFamily: TW.sans, fontWeight: 700, fontSize: 13 }}>Withdraw</span>
            <span style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '9px 0', fontFamily: TW.sans, fontWeight: 700, fontSize: 13 }}>Top up</span>
          </div>
        </button>

        {/* status tiles */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button onClick={() => app.nav.push('selling')} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>2</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>Active listings</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: 'var(--ink)', marginTop: 4 }}>24 views today</div>
          </button>
          <button onClick={() => app.nav.push('offers')} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>1</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>Pending offers</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: '#f59e0b', marginTop: 4 }}>{'Respond \u2192'}</div>
          </button>
          <button onClick={() => app.nav.push('shipping')} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>1</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>To ship</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: '#22c55e', marginTop: 4 }}>{'Print label \u2192'}</div>
          </button>
        </div>

        {/* activity feed */}
        <div className="stagger" style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 10 }}>Activity</div>
          {ACTIVITY.map(([dot, text, time], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: TW.sans, fontSize: 13, fontWeight: 600, color: TW.ink }}>{text}</span>
              <span style={{ fontFamily: TW.sans, fontSize: 11, color: TW.faint, flexShrink: 0 }}>{time}</span>
            </div>
          ))}
        </div>

        {/* collection row */}
        <button onClick={() => app.nav.setTab('watch')} style={{ width: '100%', textAlign: 'left', background: TW.surface, borderRadius: 16, padding: 14, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ position: 'relative', width: 48, height: 36, flexShrink: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: 4, width: 28, height: 28, borderRadius: 6, background: '#3b82f6' }} />
            <div style={{ position: 'absolute', left: 10, top: 2, width: 28, height: 28, borderRadius: 6, background: '#a855f7' }} />
            <div style={{ position: 'absolute', left: 20, top: 0, width: 28, height: 28, borderRadius: 6, background: '#ef4444' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>{'Collection \u00B7 '}{moneyW(port.now)}</div>
          </div>
          {IconW.chevron({ style: { color: TW.faint } })}
        </button>

        {/* buylist row */}
        <button onClick={() => app.nav.push('buylist')} style={{ width: '100%', textAlign: 'left', background: TW.surface, borderRadius: 16, padding: 14, marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'var(--gold)', color: '#3a2a00',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.6 1.1-6L3.4 9.4l6-.8L12 3z"/></svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>{'Buylist \u00B7 2 matches'}</div>
          </div>
          {IconW.chevron({ style: { color: TW.faint } })}
        </button>
      </div>
    </div>
  );
}

// ── Buyer / Collector Dashboard ──────────────────────────────
function BuyerDash({ app, header }) {
  const port = valueOf(app.ownedIds());
  const sparkData = port.series.length > 2 ? port.series : [1800, 1950, 2100, 2200, 2150, 2350, 2480];
  const watched = app.watch.map(function(id) { return byIdW(id); }).filter(Boolean).slice(0, 4);

  const ATTENTION = [
    { border: TW.accent, title: '2 buylist matches at your price', sub: 'Blue-Eyes and Pikachu EX', cta: 'View', ctaColor: TW.accent, onTap: function() { app.nav.push('buylist'); } },
    { border: '#22c55e', title: 'Order arriving today', sub: 'Charizard EX from CardKing', cta: 'Track', ctaColor: '#22c55e', onTap: function() { app.nav.push('purchases'); } },
    { border: '#eab308', title: 'Price drop on watched card', sub: 'Dark Magician down 8% today', cta: 'View', ctaColor: '#eab308', onTap: function() { app.nav.setTab('watch'); } },
  ];

  const BUYLIST_MATCHES = [
    { name: 'Blue-Eyes White Dragon', max: 28, available: 24 },
    { name: 'Pikachu EX', max: 15, available: 14.50 },
    { name: 'Mew VMAX', max: 42, available: 45 },
  ];

  const ORDERS = [
    { color: '#3b82f6', name: 'Charizard EX', status: 'Shipped', statusColor: '#3b82f6', time: '2d ago' },
    { color: '#22c55e', name: 'Pikachu VMAX', status: 'Delivered', statusColor: '#22c55e', time: '5d ago' },
    { color: '#f59e0b', name: 'Dark Magician', status: 'Processing', statusColor: '#f59e0b', time: '1h ago' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {header}
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>

        {/* 1. Portfolio hero card */}
        <button onClick={() => app.nav.setTab('watch')} style={{ width: '100%', textAlign: 'left', background: TW.surface, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase' }}>Portfolio Value</div>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 32, letterSpacing: -1, marginTop: 4 }}>{moneyW(port.now)}</div>
          <span style={{ display: 'inline-block', marginTop: 6, background: '#dcfce7', color: '#16a34a', borderRadius: 999, padding: '3px 10px', fontFamily: TW.sans, fontWeight: 700, fontSize: 12 }}>+12% this month</span>
          <div style={{ marginTop: 12 }}>
            <MiniSpark data={sparkData} color="#22c55e" h={34} />
          </div>
          <div style={{ marginTop: 8, fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>
            {app.ownedIds().length} cards {'\u00B7'} {app.collections.length} collection{app.collections.length !== 1 ? 's' : ''}
          </div>
        </button>

        {/* 2. Needs attention */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 8 }}>Needs Attention</div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ATTENTION.map(function(a, i) {
              return (
                <div key={i} style={{ background: TW.surface, borderRadius: 14, padding: '12px 14px', borderLeft: '4px solid ' + a.border, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5 }}>{a.title}</div>
                  <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted, marginTop: 2 }}>{a.sub}</div>
                  <button onClick={a.onTap} style={{ marginTop: 8, background: a.ctaColor, color: '#fff', borderRadius: 8, padding: '6px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 12 }}>{a.cta}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Watchlist price movements */}
        <div className="stagger" style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 10 }}>{'Watching ' + watched.length}</div>
          {watched.length === 0 && <div style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted, padding: '8px 0' }}>No watched cards yet.</div>}
          {watched.map(function(item, i) {
            var price = item.market || item.price;
            var arrow = item.history ? (price >= item.history[0] ? '\u25B2' : '\u25BC') : '';
            var arrowColor = item.history ? (price >= item.history[0] ? '#22c55e' : '#ef4444') : TW.muted;
            return (
              <button key={item.id} onClick={function() { app.nav.push('listing', { id: item.id }); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{moneyW(price)}</span>
                {arrow && <span style={{ fontFamily: TW.sans, fontSize: 11, color: arrowColor, flexShrink: 0 }}>{arrow}</span>}
              </button>
            );
          })}
        </div>

        {/* 4. Buylist matches */}
        <div style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase' }}>Buylist</span>
            <span style={{ background: 'var(--ink)', color: '#fff', borderRadius: 999, padding: '1px 7px', fontFamily: TW.sans, fontWeight: 700, fontSize: 11 }}>{BUYLIST_MATCHES.length}</span>
          </div>
          {BUYLIST_MATCHES.map(function(m, i) {
            var good = m.available <= m.max;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                <span style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>{'Max: ' + moneyW(m.max)}</span>
                <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: good ? '#22c55e' : TW.ink }}>{moneyW(m.available)}</span>
              </div>
            );
          })}
          <button onClick={function() { app.nav.push('buylist'); }} style={{ marginTop: 8, fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{'View all \u2192'}</button>
        </div>

        {/* 5. Recent purchases */}
        <div style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 10 }}>Orders</div>
          {ORDERS.map(function(o, i) {
            return (
              <button key={i} onClick={function() { app.nav.push('tracking'); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: o.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 600, fontSize: 13 }}>{o.name}</span>
                <span style={{ background: o.statusColor + '22', color: o.statusColor, borderRadius: 999, padding: '2px 8px', fontFamily: TW.sans, fontWeight: 700, fontSize: 11 }}>{o.status}</span>
                <span style={{ fontFamily: TW.sans, fontSize: 11, color: TW.faint, flexShrink: 0 }}>{o.time}</span>
                {IconW.chevron({ style: { color: TW.faint } })}
              </button>
            );
          })}
          <button onClick={function() { app.nav.push('dispute'); }} style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: TW.surface2, borderRadius: 10, padding: '10px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: TW.down }}>
            <span style={{ fontSize: 15 }}>{'\u26A0\uFE0F'}</span> Report an issue
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Store Dashboard ──────────────────────────────────────────
function StoreDash({ app, header }) {
  const [range, setRange] = React.useState('today');

  const SPARK_DATA = {
    today: [80, 120, 95, 200, 180, 250, 322],
    '7d': [820, 950, 1100, 780, 1247, 1050, 1180],
    '30d': [3200, 3800, 4100, 3600, 4500, 5200, 4800, 5100, 5400],
  };

  const ATTENTION = [
    { border: '#f59e0b', title: '3 submissions pending review', sub: 'Jordan M., Sam R., Dana P.', cta: 'Review', ctaColor: '#f59e0b', onTap: function() { app.nav.push('shop'); } },
    { border: '#22c55e', title: '1 bulk lot ready to price', sub: 'Miguel A. - 1,420 cards', cta: 'Price', ctaColor: '#22c55e', onTap: function() { app.nav.push('shop'); } },
    { border: TW.accent, title: 'Buylist restock needed', sub: '5 high-demand cards below threshold', cta: 'Restock', ctaColor: TW.accent, onTap: function() { app.nav.push('buylist'); } },
  ];

  const QUEUE = [
    { init: 'J', name: 'Jordan M.', cards: '48 cards', time: '12 min ago', status: 'Grading', color: '#3b82f6' },
    { init: 'S', name: 'Sam R.', cards: '64 cards', time: '18 min ago', status: 'New', color: '#f59e0b' },
    { init: 'D', name: 'Dana P.', cards: '310 cards', time: '1 hr ago', status: 'Offer sent', color: '#22c55e' },
    { init: 'M', name: 'Miguel A.', cards: '1,420 cards', time: '3 hr ago', status: 'Completed', color: 'var(--muted)' },
  ];

  var LOW_STOCK = [
    { name: 'Blue-Eyes White Dragon', stock: '0 in stock', color: '#ef4444' },
    { name: 'Charizard EX', stock: '1 left', color: '#f59e0b' },
    { name: 'Dark Magician', stock: '2 left', color: '#f59e0b' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {header}
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>

        {/* 1. Needs attention */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 8 }}>Needs Attention</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ATTENTION.map(function(a, i) {
              return (
                <div key={i} style={{ background: TW.surface, borderRadius: 14, padding: '12px 14px', borderLeft: '4px solid ' + a.border, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5 }}>{a.title}</div>
                  <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted, marginTop: 2 }}>{a.sub}</div>
                  <button onClick={a.onTap} style={{ marginTop: 8, background: a.ctaColor, color: '#fff', borderRadius: 8, padding: '6px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 12 }}>{a.cta}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Revenue card */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 20, padding: 20, color: '#fff', marginBottom: 14 }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, opacity: 0.65, textTransform: 'uppercase' }}>{"Today\u2019s Revenue"}</div>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 34, letterSpacing: -1, marginTop: 4 }}>{moneyW(1247)}</div>
          <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: '#7fe7a4', marginTop: 4 }}>&#9650; up 23% vs last week</div>
          {/* date range pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {[['today', 'Today'], ['7d', '7d'], ['30d', '30d']].map(function(r) {
              var active = range === r[0];
              return (
                <button key={r[0]} onClick={function() { setRange(r[0]); }} style={{ background: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: 8, padding: '5px 14px', fontFamily: TW.sans, fontWeight: 700, fontSize: 12, opacity: active ? 1 : 0.7 }}>{r[1]}</button>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <MiniSpark data={SPARK_DATA[range]} color="#7fe7a4" h={34} />
          </div>
          {/* walk-in / online split bar */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 62, height: 6, borderRadius: 999, background: TW.accent }} />
            <div style={{ flex: 38, height: 6, borderRadius: 999, background: '#a855f7' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: TW.sans, fontSize: 11, opacity: 0.65 }}>
            <span>Walk-in 62%</span><span>Online 38%</span>
          </div>
        </div>

        {/* 3. Queue stats tiles */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button onClick={function() { app.nav.push('shop'); }} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>4</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>Submissions</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: '#f59e0b', marginTop: 4 }}>2 new today</div>
          </button>
          <button onClick={function() { app.nav.push('shop'); }} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>1</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>Bulk lots</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: TW.muted, marginTop: 4 }}>1,420 cards</div>
          </button>
          <button onClick={function() { app.nav.push('buylist'); }} style={{ flex: 1, background: TW.surface, borderRadius: 14, padding: 14, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 24 }}>12</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: TW.ink, marginTop: 2 }}>Buylist hits</div>
            <div style={{ fontFamily: TW.sans, fontWeight: 600, fontSize: 11, color: 'var(--ink)', marginTop: 4 }}>today</div>
          </button>
        </div>

        {/* 4. Submission queue */}
        <div className="stagger" style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 10 }}>Submission Queue</div>
          {QUEUE.map(function(q, i) {
            return (
              <button key={i} onClick={function() { app.nav.push('shop'); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: q.color + '22', color: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{q.init}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13 }}>{q.name}</div>
                  <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.muted }}>{q.cards + ' \u00B7 ' + q.time}</div>
                </div>
                <span style={{ background: q.color + '22', color: q.color, borderRadius: 999, padding: '2px 8px', fontFamily: TW.sans, fontWeight: 700, fontSize: 11 }}>{q.status}</span>
              </button>
            );
          })}
        </div>

        {/* 5. Buylist performance */}
        <div style={{ background: TW.surface, borderRadius: 16, padding: 15, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TW.muted, textTransform: 'uppercase', marginBottom: 10 }}>Buylist Performance</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 26, color: 'var(--ink)' }}>12</div>
              <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>matched today</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 26 }}>68%</div>
              <div style={{ fontFamily: TW.sans, fontSize: 12, color: TW.muted }}>avg buy rate</div>
            </div>
          </div>
          {LOW_STOCK.map(function(ls, i) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 600, fontSize: 13 }}>{ls.name}</span>
                <span style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 12, color: ls.color }}>{ls.stock}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ── Dashboard (delegates by account type) ────────────────────
function DashboardScreen({ app }) {
  var header = (
    <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 14 }}>A</div>
        <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 17 }}>Alex</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={function() { app.nav.push('notifications'); }} style={{ position: 'relative', color: TW.ink, padding: 4, display: 'flex' }}>
          {IconD.bell({})}
          <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 999, background: '#ef4444' }} />
        </button>
        <button onClick={function() { app.nav.push('settings'); }} style={{ color: TW.ink, padding: 4, display: 'flex' }}>{IconD.gear({})}</button>
      </div>
    </div>
  );

  if (app.acct === 'store') return <StoreDash app={app} header={header} />;
  if (app.acct === 'seller') return <SellerDash app={app} header={header} />;
  return <BuyerDash app={app} header={header} />;
}

// ── Settings ─────────────────────────────────────────────────
function SettingsScreen({ app }) {
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const ACCT_LABEL = { buyer: 'Collector', seller: 'Individual seller', store: 'Game shop' };
  const ACCT_EMOJI = { buyer: '\uD83C\uDCCF', seller: '\uD83D\uDCB8', store: '\uD83C\uDFEA' };
  const followed = (window.GAMES || []).filter(function(g) { return app.inPrefs(g.id); });
  const rows = [
    ['Account type', ACCT_LABEL[app.acct] || 'Collector', function() { var next = app.acct === 'buyer' ? 'seller' : app.acct === 'seller' ? 'store' : 'buyer'; app.setAcct(next); }],
    ['Verification & trust', app.tier >= 2 ? 'Trusted Seller' : app.tier >= 1 ? 'ID Verified' : 'Get verified', function() { app.nav.push('verify'); }],
    ['Payment methods', '', function() { app.nav.push('payments'); }],
    ['Games you follow', app.allGamesSelected() ? 'All games' : followed.map(function(g) { return g.short; }).join(', '), function() { setPrefsOpen(true); }],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* back header */}
      <div style={{ padding: '14px 14px 12px', background: TW.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TW.ink }}>{IconW.back({})}</button>
        <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 18 }}>Settings</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>
        {/* identity card */}
        <div style={{ background: TW.surface, borderRadius: 16, padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TW.sans, fontWeight: 800, fontSize: 24, flexShrink: 0 }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Alex Rivera</div>
            <div style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted, marginTop: 2 }}>{ACCT_EMOJI[app.acct] || '\uD83C\uDCCF'} {ACCT_LABEL[app.acct] || 'Collector'}</div>
          </div>
          {window.TrustBadge && app.tier >= 1 && <window.TrustBadge tier={app.tier >= 2 ? 2 : 1} />}
        </div>

        {/* settings list */}
        <div style={{ background: TW.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {rows.map(function(row, i) {
            var title = row[0], sub = row[1], onTap = row[2];
            return (
              <button key={title} onClick={onTap} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px',
                borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', textAlign: 'left' }}>
                <span style={{ flex: 1, fontFamily: TW.sans, fontWeight: 600, fontSize: 15 }}>{title}</span>
                {sub && <span style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted }}>{sub}</span>}
                {IconW.chevron({ style: { color: TW.faint } })}
              </button>
            );
          })}
        </div>

        {/* upgrade buttons */}
        {app.acct === 'buyer' && (
          <button onClick={() => { app.setAcct('seller'); app.toast('You can now sell!'); }} style={{ width: '100%', marginBottom: 12, background: TW.ink, color: '#fff',
            borderRadius: 13, padding: '13px 16px', fontFamily: TW.sans, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {IconW.sell({ width: 18, height: 18 })} Become a seller
          </button>
        )}
        {app.acct !== 'store' && app.acct !== 'buyer' && (
          <button onClick={() => app.nav.push('enroll_shop')} style={{ width: '100%', marginBottom: 12, background: TW.surface2, color: TW.ink,
            borderRadius: 13, padding: '13px 16px', fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>Enroll as Local Game Store</button>
        )}
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
        <button onClick={() => app.nav.pop()} style={{ color: 'var(--ink)', fontWeight: 700 }}>← Back</button>
        <p>Collection not found.</p>
      </div>
    );
  }
  const v = valueOf(col.cards);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TW.bg }}>
      {/* header (back chevron — pushed screen) */}
      <div style={{ padding: '14px 14px 12px', background: TW.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TW.ink }}>{IconW.back({})}</button>
        <span style={{ fontFamily: TW.sans, fontWeight: 800, fontSize: 16, flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span>{col.icon || '🃏'}</span>{col.name}
        </span>
        <button onClick={() => { const n = window.prompt && window.prompt('Rename collection', col.name); if (n && n.trim()) app.renameCollection(col.id, n.trim()); }}
          style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13, color: 'var(--ink)', padding: '4px 6px' }}>Rename</button>
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

        <button onClick={() => setAddOpen(true)} style={{ width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 13, padding: 14,
          fontFamily: TW.sans, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {IconW.plus({ width: 19, height: 19 })} Add cards
        </button>

        {col.cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: TW.muted, fontFamily: TW.sans, fontSize: 14, lineHeight: 1.5 }}>
            This collection is empty.<br/>Add cards you own to track their value.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.cards.map(item => {
              const currentVal = item.market || item.price;
              const purchaseVal = item.history ? item.history[0] : currentVal;
              const gainAbs = currentVal - purchaseVal;
              const gainPct = purchaseVal > 0 ? ((gainAbs / purchaseVal) * 100).toFixed(0) : 0;
              const gainUp = gainAbs >= 0;
              return (
              <div key={item.id} style={{ background: TW.surface, borderRadius: 14, padding: 10, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <button onClick={() => app.nav.push('listing', { id: item.id })} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ background: TW.surface2, borderRadius: 9, padding: 6 }}><CardArtW item={item} w={44} radius={6} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontFamily: TW.sans, fontSize: 11.5, color: TW.muted }}>{setByIdW(item.set)?.name?.replace(/\s*\(.*\)/,'')} · <GradeInline grade={item.grade} /></div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 58 }}>
                    <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 14 }}>{moneyW(currentVal)}</div>
                    <DeltaW from={purchaseVal} to={currentVal} style={{ fontSize: 11 }} />
                    {gainAbs !== 0 && <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 10.5, color: gainUp ? 'var(--up)' : 'var(--down)', marginTop: 1 }}>
                      {gainUp ? '+' : ''}{moneyW(Math.abs(gainAbs))} ({gainUp ? '+' : ''}{gainPct}%)
                    </div>}
                  </div>
                </button>
                <button onClick={() => app.removeCardFromCollection(col.id, item.id)} style={{ color: TW.faint, padding: 4, flexShrink: 0 }}>{IconW.trash({ width: 18, height: 18 })}</button>
              </div>
              );
            })}
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
      <button onClick={() => { onClose(); app.nav.push('scan', { from: 'collection' }); }} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px 14px', background: 'var(--fill)', color: '#fff', borderRadius: 10,
        fontFamily: TW.sans, fontWeight: 700, fontSize: 14, marginBottom: 12,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/></svg>
        Scan a card
      </button>
      <p style={{ fontFamily: TW.sans, fontSize: 13, color: TW.muted, margin: '0 0 12px' }}>Or tap a card you own to add it to this collection.</p>
      <div className="noscroll" style={{ maxHeight: 360, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {candidates.map(item => (
          <button key={item.id} onClick={() => { app.addCardToCollection(col.id, item.id); app.toast('Added to ' + col.name); }}
            style={{ width: '100%', textAlign: 'left', background: TW.surface2, borderRadius: 12, padding: 9, display: 'flex', gap: 11, alignItems: 'center' }}>
            <div style={{ background: TW.surface, borderRadius: 8, padding: 5 }}><CardArtW item={item} w={38} radius={5} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TW.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.muted }}>{moneyW(item.market || item.price)} · <GradeInline grade={item.grade} /></div>
            </div>
            <span style={{ color: 'var(--ink)', flexShrink: 0 }}>{IconW.plus({ width: 19, height: 19 })}</span>
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 14, background: TW.ink, color: '#fff', borderRadius: 13, padding: 14, fontFamily: TW.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
    </window.Sheet>
  );
}

Object.assign(window, { WatchScreen, DashboardScreen, SettingsScreen, EmptyState, CollectionDetailScreen });
