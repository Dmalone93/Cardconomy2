// ─────────────────────────────────────────────────────────────
// Account screens — buylist editor, purchases, selling, offers,
// payments & payouts, notifications. All pushed from Profile.
// ─────────────────────────────────────────────────────────────
const { T: TAC, money: moneyAC, Icon: IconAC, CardArt: CardArtAC, GradeChip: GradeChipAC, Stars: StarsAC, Sheet: SheetAC, Sparkline: SparkAC } = window;
const { LISTINGS: LST_AC, SUB_CARDS: SCAC, byId: byIdAC, setById: setByIdAC, gameById: gameByIdAC } = window;

const money0AC = (n) => moneyAC(n, { cents: false });

// extra inline icons
const AIcon = {
  bell: (p = {}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M10 19a2 2 0 004 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  card: (p = {}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M3 10h18" stroke="currentColor" strokeWidth="2" /></svg>,
  plus: (p = {}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>,
  trash: (p = {}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  bank: (p = {}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 10l8-5 8 5M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  star: (p = {}, fill) => <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} {...p}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.6 1.1-6L3.4 9.4l6-.8L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
};

// ── shared chrome ────────────────────────────────────────────
function AccHeader({ app, title, sub, right }) {
  return (
    <div style={{ padding: '14px 14px 14px', background: TAC.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={() => app.nav.pop()} style={{ color: TAC.ink, flexShrink: 0 }}>{IconAC.back({})}</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{title}</div>
        {sub && <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Segmented({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: TAC.surface2, borderRadius: 12, padding: 4, marginBottom: 16 }}>
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)} style={{ flex: 1, padding: '9px 4px', borderRadius: 9, fontFamily: TAC.sans, fontWeight: 700, fontSize: 13.5,
          background: value === id ? TAC.surface : 'transparent', color: value === id ? TAC.ink : TAC.muted,
          boxShadow: value === id ? '0 1px 3px rgba(20,24,40,0.12)' : 'none' }}>{label}</button>
      ))}
    </div>
  );
}

function Pill({ label, tone }) {
  const tones = {
    green: ['var(--up-wash)', 'var(--up)'], blue: ['var(--accent-wash)', 'var(--accent)'],
    amber: ['oklch(0.95 0.06 80)', 'oklch(0.5 0.12 66)'], gray: [TAC.surface2, TAC.muted], red: ['oklch(0.95 0.04 24)', 'var(--down)'],
  };
  const [bg, fg] = tones[tone] || tones.gray;
  return <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 11, color: fg, background: bg, borderRadius: 7, padding: '3px 8px', whiteSpace: 'nowrap' }}>{label}</span>;
}

function Stepper({ value, set, min = 1, max = 99 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: TAC.surface2, borderRadius: 9, overflow: 'hidden' }}>
      <button onClick={() => set(Math.max(min, value - 1))} style={{ width: 30, height: 30, color: TAC.ink2, fontSize: 18, fontWeight: 700 }}>−</button>
      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, minWidth: 22, textAlign: 'center' }}>{value}</span>
      <button onClick={() => set(Math.min(max, value + 1))} style={{ width: 30, height: 30, color: TAC.ink2, fontSize: 18, fontWeight: 700 }}>+</button>
    </div>
  );
}

function ListThumb({ item, w = 44 }) {
  return <div style={{ background: TAC.surface2, borderRadius: 9, padding: 6, flexShrink: 0 }}><CardArtAC item={item} w={w} radius={5} /></div>;
}

function emptyBlock(icon, title, body) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: TAC.muted }}>
      <div style={{ width: 64, height: 64, margin: '0 auto 14px', borderRadius: 999, background: TAC.surface, color: TAC.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>{icon}</div>
      <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 17, color: TAC.ink }}>{title}</div>
      <div style={{ fontFamily: TAC.sans, fontSize: 13.5, marginTop: 4, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// BUYLIST EDITOR
// ═════════════════════════════════════════════════════════════
const BUYLIST_SEED = [
  { id: 'b1', ref: 'l03', want: 1, max: 1300, active: true },
  { id: 'b2', ref: 'l01', want: 2, max: 460, active: true },
  { id: 'b3', ref: 'l07', want: 3, max: 160, active: false },
  { id: 'b4', ref: 'l05', want: 1, max: 26000, active: true },
];

function loadBuylist() {
  try {
    const raw = localStorage.getItem('cc_buylist_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return BUYLIST_SEED;
}

function BuylistScreen({ app }) {
  const [list, setList] = React.useState(loadBuylist);
  const [editing, setEditing] = React.useState(null); // entry id
  const [adding, setAdding] = React.useState(false);
  const [q, setQ] = React.useState('');

  React.useEffect(() => { try { localStorage.setItem('cc_buylist_v2', JSON.stringify(list)); } catch (e) {} }, [list]);

  const enrich = (e) => ({ ...e, card: byIdAC(e.ref) });
  const entries = list.map(enrich).filter(e => e.card);
  const activeCount = entries.filter(e => e.active).length;
  const totalCommit = entries.filter(e => e.active).reduce((s, e) => s + e.max * e.want, 0);
  // matches available now: listings at/under max that aren't already yours
  const matches = entries.filter(e => e.active && e.card.price <= e.max);

  const editEntry = editing ? entries.find(e => e.id === editing) : null;

  // catalog to add (exclude already-added)
  const added = new Set(list.map(e => e.ref));
  const catalog = LST_AC.filter(l => !added.has(l.id) && (!q || (l.name + ' ' + (setByIdAC(l.set)?.name || '')).toLowerCase().includes(q.toLowerCase())));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="My buylist" sub={activeCount + ' active · cards you want to buy'}
        right={<button onClick={() => { setAdding(true); setQ(''); }} style={{ width: 36, height: 36, borderRadius: 999, background: TAC.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{AIcon.plus({})}</button>} />

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        {/* explainer */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 14 }}>
          <span style={{ color: TAC.accent, marginTop: 1 }}>{AIcon.star({ width: 18, height: 18 }, true)}</span>
          <span style={{ fontFamily: TAC.sans, fontSize: 12.5, color: TAC.ink2, lineHeight: 1.45 }}>
            Set the cards you're after and the max you\'ll pay. We alert you when a match is listed — and shops use it to price your trade-ins instantly.
          </span>
        </div>

        {/* summary */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 16 }}>
          <div style={{ flex: 1, background: TAC.surface, borderRadius: 13, padding: '11px 13px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 20, color: TAC.accent }}>{matches.length}</div>
            <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>matches available now</div>
          </div>
          <div style={{ flex: 1, background: TAC.surface, borderRadius: 13, padding: '11px 13px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 20 }}>{money0AC(totalCommit)}</div>
            <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>max commitment</div>
          </div>
        </div>

        {entries.length === 0 ? emptyBlock(AIcon.star({ width: 30, height: 30 }), 'No cards yet', 'Tap + to add cards you want to buy and the price you\u2019ll pay.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {entries.map(e => {
              const isMatch = e.active && e.card.price <= e.max;
              return (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 11, background: TAC.surface, borderRadius: 13, padding: 10,
                  opacity: e.active ? 1 : 0.55, boxShadow: isMatch ? 'inset 0 0 0 1.5px var(--gold)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <ListThumb item={e.card} />
                  <button onClick={() => setEditing(e.id)} style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.card.name}</span>
                      {isMatch && <Pill label="MATCH" tone="amber" />}
                    </div>
                    <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>
                      want {e.want} · max <b style={{ fontFamily: TAC.sans, color: TAC.ink2 }}>{money0AC(e.max)}</b>
                      <span style={{ color: isMatch ? 'var(--up)' : TAC.faint }}> · listed {money0AC(e.card.price)}</span>
                    </div>
                  </button>
                  <button onClick={() => setList(l => l.map(x => x.id === e.id ? { ...x, active: !x.active } : x))} style={{ width: 44, height: 26, borderRadius: 999, padding: 3, flexShrink: 0,
                    background: e.active ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: e.active ? 'translateX(18px)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {matches.length > 0 && (
          <button onClick={() => app.nav.setTab('search')} style={{ width: '100%', marginTop: 16, background: TAC.surface, color: TAC.accent, borderRadius: 13, padding: 13,
            fontFamily: TAC.sans, fontWeight: 700, fontSize: 14.5, boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}>
            View {matches.length} available match{matches.length !== 1 ? 'es' : ''} →
          </button>
        )}
      </div>

      {/* edit sheet */}
      <SheetAC open={!!editEntry} onClose={() => setEditing(null)} title="Edit buylist card">
        {editEntry && <BuylistEdit entry={editEntry}
          onSave={(want, max) => { setList(l => l.map(x => x.id === editEntry.id ? { ...x, want, max } : x)); setEditing(null); app.toast('Buylist updated'); }}
          onRemove={() => { setList(l => l.filter(x => x.id !== editEntry.id)); setEditing(null); app.toast('Removed from buylist'); }} />}
      </SheetAC>

      {/* add sheet */}
      <SheetAC open={adding} onClose={() => setAdding(false)} title="Add to buylist">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TAC.surface2, borderRadius: 11, padding: '10px 13px', marginBottom: 12, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          {IconAC.search({ width: 18, height: 18, style: { color: TAC.faint } })}
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search the catalog…" autoFocus
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TAC.sans, fontSize: 15, minWidth: 0 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360 }}>
          {catalog.map(l => (
            <button key={l.id} onClick={() => {
              setList(prev => [...prev, { id: 'b' + Date.now(), ref: l.id, want: 1, max: Math.round(l.market), active: true }]);
              setAdding(false); app.toast('Added to buylist ★');
            }} style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: 9, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <ListThumb item={l} w={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>{setByIdAC(l.set)?.name?.replace(/\s*\(.*\)/, '')} · mkt {money0AC(l.market)}</div>
              </div>
              <span style={{ color: TAC.accent }}>{AIcon.plus({})}</span>
            </button>
          ))}
          {catalog.length === 0 && <div style={{ textAlign: 'center', padding: 24, fontFamily: TAC.sans, fontSize: 13.5, color: TAC.muted }}>No more cards to add.</div>}
        </div>
      </SheetAC>
    </div>
  );
}

function BuylistEdit({ entry, onSave, onRemove }) {
  const [want, setWant] = React.useState(entry.want);
  const [max, setMax] = React.useState(entry.max);
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <ListThumb item={entry.card} w={54} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 16 }}>{entry.card.name}</div>
          <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{setByIdAC(entry.card.set)?.name} · market {money0AC(entry.card.market)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--line-2)' }}>
        <span style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 14.5 }}>Quantity wanted</span>
        <Stepper value={want} set={setWant} />
      </div>
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 14.5 }}>Max price each</span>
          <div style={{ display: 'flex', alignItems: 'center', background: TAC.surface2, borderRadius: 10, padding: '6px 11px' }}>
            <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 17, color: TAC.muted }}>£</span>
            <input type="number" value={max} onChange={e => setMax(+e.target.value || 0)} style={{ width: 80, border: 'none', outline: 'none', background: 'transparent', fontFamily: TAC.sans, fontWeight: 700, fontSize: 17, textAlign: 'right' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[0.8, 0.9, 1.0, 1.1].map(m => (
            <button key={m} onClick={() => setMax(Math.round(entry.card.market * m))} style={{ flex: 1, padding: '7px 0', borderRadius: 8, fontFamily: TAC.sans, fontWeight: 700, fontSize: 12,
              background: TAC.surface2, color: TAC.ink2 }}>{Math.round(m * 100)}%</button>
          ))}
        </div>
      </div>
      <button onClick={() => onSave(want, max)} style={{ width: '100%', marginTop: 14, background: TAC.accent, color: '#fff', borderRadius: 13, padding: 14, fontFamily: TAC.sans, fontWeight: 700, fontSize: 15.5 }}>Save</button>
      <button onClick={onRemove} style={{ width: '100%', marginTop: 9, color: 'var(--down)', fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{AIcon.trash({})} Remove from buylist</button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PURCHASES
// ═════════════════════════════════════════════════════════════
const PURCHASES = [
  { ref: 'l04', status: 'Delivered', tone: 'green', date: 'Jun 2', total: 2150, seller: 'VintageHolos', track: 'Delivered Jun 6' },
  { ref: 'l07', status: 'Shipped', tone: 'blue', date: 'Jun 7', total: 184, seller: 'DuelistPrime', track: 'Arrives Jun 11 · 1Z‑999' },
  { ref: 'l11', status: 'Processing', tone: 'amber', date: 'Jun 9', total: 31.99, seller: 'KantoCollects', track: 'Seller preparing' },
];

function PurchasesScreen({ app }) {
  const [tab, setTab] = React.useState('all');
  const rows = PURCHASES.map(p => ({ ...p, card: byIdAC(p.ref) })).filter(p => p.card && (tab === 'all' || (tab === 'active' ? p.status !== 'Delivered' : p.status === 'Delivered')));
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="Purchases" sub={PURCHASES.length + ' orders'} />
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <Segmented tabs={[['all', 'All'], ['active', 'In transit'], ['done', 'Delivered']]} value={tab} onChange={setTab} />
        {rows.length === 0 ? emptyBlock(IconAC.truck({ width: 28, height: 28 }), 'Nothing here', 'Orders you place will show up with tracking.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map((p, i) => (
              <div key={i} style={{ background: TAC.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ListThumb item={p.card} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.card.name}</div>
                    <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>{p.seller} · ordered {p.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{moneyAC(p.total)}</div>
                    <div style={{ marginTop: 3 }}><Pill label={p.status} tone={p.tone} /></div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
                  <span style={{ color: TAC.muted }}>{IconAC.truck({ width: 16, height: 16 })}</span>
                  <span style={{ flex: 1, fontFamily: TAC.sans, fontSize: 12.5, color: TAC.ink2 }}>{p.track}</span>
                  <button onClick={() => app.toast(p.status === 'Delivered' ? 'Review submitted — thank you!' : 'Tracking: your card is on the way')} style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 12.5, color: TAC.accent }}>{p.status === 'Delivered' ? 'Review' : 'Track'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SELLING
// ═════════════════════════════════════════════════════════════
const ACTIVE_LISTINGS = [
  { ref: 'l09', price: 96, views: 142, watchers: 8, offers: 2, type: 'buynow' },
  { ref: 'l10', price: 44, views: 89, watchers: 33, offers: 0, type: 'buynow' },
];
const SOLD_LISTINGS = [
  { ref: 'l02', price: 38.5, buyer: 'mtg_mike', date: 'Jun 4' },
  { ref: 'l12', price: 14.25, buyer: 'bolt_collector', date: 'May 30' },
];

function SellingScreen({ app }) {
  const [tab, setTab] = React.useState('active');
  const active = ACTIVE_LISTINGS.map(l => ({ ...l, card: byIdAC(l.ref) })).filter(l => l.card);
  const sold = SOLD_LISTINGS.map(l => ({ ...l, card: byIdAC(l.ref) })).filter(l => l.card);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="Selling" sub={active.length + ' active · ' + sold.length + ' sold'}
        right={<button onClick={() => app.nav.setTab('sell')} style={{ width: 36, height: 36, borderRadius: 999, background: TAC.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{AIcon.plus({})}</button>} />
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <Segmented tabs={[['active', 'Active ' + active.length], ['sold', 'Sold ' + sold.length], ['drafts', 'Drafts']]} value={tab} onChange={setTab} />

        {tab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {active.map((l, i) => (
              <div key={i} style={{ background: TAC.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ListThumb item={l.card} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.card.name}</span>
                      <Pill label="Buy Now" tone="blue" />
                    </div>
                    <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>listed at {money0AC(l.price)}</div>
                  </div>
                  <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15 }}>{moneyAC(l.price)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
                  {[['Views', l.views], ['Watchers', l.watchers], ['Offers', l.offers]].map(([k, v]) => (
                    <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15, color: k === 'Offers' && v > 0 ? TAC.accent : TAC.ink }}>{v}</div>
                      <div style={{ fontFamily: TAC.sans, fontSize: 10.5, color: TAC.muted }}>{k}</div>
                    </div>
                  ))}
                  <button onClick={() => l.offers > 0 ? app.nav.push('offers') : app.toast('Opening listing editor')} style={{ alignSelf: 'center', fontFamily: TAC.sans, fontWeight: 700, fontSize: 12.5, color: TAC.accent, padding: '6px 10px' }}>{l.offers > 0 ? 'Offers' : 'Edit'}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sold' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ background: 'var(--up-wash)', borderRadius: 13, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 13.5, color: TAC.ink2 }}>Earned this month</span>
              <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 18, color: 'var(--up)' }}>{moneyAC(sold.reduce((s, l) => s + l.price, 0))}</span>
            </div>
            {sold.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: TAC.surface, borderRadius: 13, padding: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <ListThumb item={l.card} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{l.card.name}</div>
                  <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>to {l.buyer} · {l.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, color: 'var(--up)' }}>+{moneyAC(l.price)}</div>
                  <Pill label="Paid out" tone="green" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'drafts' && emptyBlock(IconAC.tag({ width: 28, height: 28 }), 'No drafts', 'Start a listing and save it for later — it\u2019ll wait here.')}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// OFFERS
// ═════════════════════════════════════════════════════════════
const OFFERS_SENT = [
  { ref: 'l01', amount: 400, status: 'Countered', tone: 'amber', note: 'Seller countered at £420', date: '2h ago' },
  { ref: 'l05', amount: 27000, status: 'Pending', tone: 'blue', note: 'Waiting on AlphaInvest', date: '1d ago' },
];
const OFFERS_RECEIVED = [
  { ref: 'l09', amount: 85, from: 'pidgey_fan', status: 'Pending', tone: 'blue', list: 96, date: '40m ago' },
];

function OffersScreen({ app }) {
  const [tab, setTab] = React.useState('sent');
  const [acted, setActed] = React.useState({});
  const sent = OFFERS_SENT.map(o => ({ ...o, card: byIdAC(o.ref) })).filter(o => o.card);
  const recv = OFFERS_RECEIVED.map(o => ({ ...o, card: byIdAC(o.ref) })).filter(o => o.card);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="Offers" sub={sent.length + ' sent · ' + recv.length + ' received'} />
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <Segmented tabs={[['sent', 'Sent ' + sent.length], ['received', 'Received ' + recv.length]]} value={tab} onChange={setTab} />

        {tab === 'sent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sent.map((o, i) => (
              <div key={i} style={{ background: TAC.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ListThumb item={o.card} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.card.name}</div>
                    <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>your offer {money0AC(o.amount)} · {o.date}</div>
                  </div>
                  <Pill label={o.status} tone={o.tone} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
                  <span style={{ flex: 1, fontFamily: TAC.sans, fontSize: 12.5, color: o.tone === 'amber' ? TAC.accent : TAC.ink2, fontWeight: o.tone === 'amber' ? 600 : 400 }}>{o.note}</span>
                  {o.status === 'Countered' && <button onClick={() => app.startBuy(o.card)} style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 12.5, color: '#fff', background: TAC.accent, borderRadius: 8, padding: '6px 12px' }}>Accept £420</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'received' && (
          recv.length === 0 ? emptyBlock(IconAC.tag({ width: 28, height: 28 }), 'No offers yet', 'Offers buyers send on your listings land here.') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recv.map((o, i) => {
                const a = acted[i];
                return (
                  <div key={i} style={{ background: TAC.surface, borderRadius: 14, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ListThumb item={o.card} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{o.card.name}</div>
                        <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>{o.from} offered · listed {money0AC(o.list)}</div>
                      </div>
                      <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 17, color: TAC.accent }}>{money0AC(o.amount)}</div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
                      {a ? <div style={{ textAlign: 'center', fontFamily: TAC.sans, fontWeight: 700, fontSize: 13, color: a === 'accept' ? 'var(--up)' : a === 'decline' ? 'var(--down)' : TAC.accent }}>
                        {a === 'accept' ? '✓ Offer accepted' : a === 'decline' ? 'Offer declined' : 'Countered at ' + money0AC(o.list - 4)}
                      </div> : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setActed(s => ({ ...s, [i]: 'decline' })); app.toast('Offer declined'); }} style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 13, background: TAC.surface2, color: TAC.ink2 }}>Decline</button>
                          <button onClick={() => { setActed(s => ({ ...s, [i]: 'counter' })); app.toast('Counter sent'); }} style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 13, background: TAC.surface2, color: TAC.ink2 }}>Counter</button>
                          <button onClick={() => { setActed(s => ({ ...s, [i]: 'accept' })); app.toast('Offer accepted ✓'); }} style={{ flex: 1.2, padding: '9px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 13, background: TAC.accent, color: '#fff' }}>Accept</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAYMENTS & PAYOUTS
// ═════════════════════════════════════════════════════════════
const TXNS = [
  { label: 'Sale · Pikachu IR', sub: 'Jun 4 · payout', amount: 35.49, pos: true },
  { label: 'Purchase · Mewtwo Holo', sub: 'Jun 2 · Visa ••4242', amount: -2150, pos: false },
  { label: 'Sale · Sting Goblin', sub: 'May 30 · payout', amount: 12.98, pos: true },
  { label: 'Withdrawal to bank', sub: 'May 28 · ••6789', amount: -120, pos: false },
];

function PaymentsScreen({ app }) {
  const balance = 248.47;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="Payments & payouts" />
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        {/* balance */}
        <div style={{ background: 'var(--fill)', borderRadius: 18, padding: 18, color: '#fff' }}>
          <div style={{ fontFamily: TAC.sans, fontSize: 12.5, opacity: 0.7, fontWeight: 600 }}>Available to withdraw</div>
          <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 34, letterSpacing: -0.5, marginTop: 2 }}>{moneyAC(balance)}</div>
          <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
            <button onClick={() => app.toast('Withdrawal of \u00A3248.47 initiated to \u2022\u20226789')} style={{ flex: 1, background: '#fff', color: TAC.ink, borderRadius: 12, padding: 12, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>Withdraw</button>
            <button onClick={() => app.toast('Top up your balance to buy cards')} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 12, padding: 12, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>Top up</button>
          </div>
        </div>

        {/* payout destination */}
        <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 14, color: TAC.ink2, margin: '20px 0 9px' }}>Payout method</div>
        <button onClick={() => app.toast('Bank account editor would open here')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: TAC.surface, borderRadius: 13, padding: '13px 14px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: TAC.surface2, color: TAC.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{AIcon.bank({ width: 20, height: 20 })}</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>Chase checking</div>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>••••6789 · default payout</div>
          </div>
          {IconAC.chevron({ style: { color: TAC.faint } })}
        </button>

        {/* payment methods */}
        <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 14, color: TAC.ink2, margin: '20px 0 9px' }}>Payment methods</div>
        <div style={{ background: TAC.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {[['Apple Pay', 'Default', true], ['Visa ••••4242', 'Expires 08/27', false]].map(([t, s, def], i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderBottom: i === 0 ? '1px solid var(--line-2)' : 'none' }}>
              <span style={{ color: TAC.ink2 }}>{AIcon.card({ width: 20, height: 20 })}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{t}</div>
                <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{s}</div>
              </div>
              {def && <Pill label="Default" tone="blue" />}
            </div>
          ))}
          <button onClick={() => app.toast('Payment method form would open here')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '13px 14px', borderTop: '1px solid var(--line-2)', color: TAC.accent }}>
            {AIcon.plus({})}<span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>Add payment method</span>
          </button>
        </div>

        {/* transactions */}
        <div style={{ fontFamily: TAC.sans, fontWeight: 800, fontSize: 14, color: TAC.ink2, margin: '20px 0 9px' }}>Recent activity</div>
        <div style={{ background: TAC.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {TXNS.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < TXNS.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 13.5 }}>{t.label}</div>
                <div style={{ fontFamily: TAC.sans, fontSize: 11.5, color: TAC.muted }}>{t.sub}</div>
              </div>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, color: t.pos ? 'var(--up)' : TAC.ink }}>{t.pos ? '+' : ''}{moneyAC(t.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═════════════════════════════════════════════════════════════
const NOTIFS = [
  { icon: AIcon.star, tint: 'var(--gold)', title: 'Buylist match listed', body: 'Umbreon VMAX (PSA 10) at £1,280 — under your £1,250? Close.', time: '12m', unread: true },
  { icon: IconAC.tag, tint: 'var(--accent)', title: 'New offer received', body: 'Someone offered £27,000 on Black Lotus. Review it now.', time: '1h', unread: true },
  { icon: IconAC.tag, tint: 'var(--up)', title: 'Your card sold!', body: 'Pikachu IR sold for £38.50 — payout on the way.', time: '5h', unread: false },
  { icon: IconAC.truck, tint: 'var(--accent)', title: 'Order shipped', body: 'Blue-Eyes White Dragon is on its way. Arrives Jun 11.', time: '1d', unread: false },
];
const NOTIF_PREFS = [
  ['Buylist matches', 'When a card you want is listed', true],
  ['Offers', 'Offers on your listings', true],
  ['Price drops', 'Watched cards that drop in price', false],
  ['Shop responses', 'When a shop replies to a submission', true],
  ['Marketing', 'News, tips & promotions', false],
];

function NotificationsScreen({ app }) {
  const [tab, setTab] = React.useState('activity');
  const [prefs, setPrefs] = React.useState(NOTIF_PREFS.map(p => p[2]));
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
      <AccHeader app={app} title="Notifications"
        right={tab === 'activity' ? <button onClick={() => app.toast('All marked read')} style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 12.5, color: TAC.accent }}>Mark read</button> : null} />
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <Segmented tabs={[['activity', 'Activity'], ['settings', 'Settings']]} value={tab} onChange={setTab} />

        {tab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {NOTIFS.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, background: n.unread ? 'var(--accent-wash)' : TAC.surface, borderRadius: 13, padding: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: n.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n.icon({ width: 18, height: 18 })}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{n.title}</span>
                    <span style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.faint, flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontFamily: TAC.sans, fontSize: 12.5, color: TAC.ink2, lineHeight: 1.4, marginTop: 2 }}>{n.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ background: TAC.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            {NOTIF_PREFS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderBottom: i < NOTIF_PREFS.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 14.5 }}>{p[0]}</div>
                  <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{p[1]}</div>
                </div>
                <button onClick={() => setPrefs(s => s.map((v, j) => j === i ? !v : v))} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, flexShrink: 0,
                  background: prefs[i] ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: prefs[i] ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BuylistScreen, PurchasesScreen, SellingScreen, OffersScreen, PaymentsScreen, NotificationsScreen });
