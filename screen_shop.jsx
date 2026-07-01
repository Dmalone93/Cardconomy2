// ─────────────────────────────────────────────────────────────
// Shop side · counter view (mobile/tablet staff app)
// inbox → submission dashboard → price guide → offer → sent
// ─────────────────────────────────────────────────────────────
const { T: TSH, money: moneySH, Icon: IconSH, CardArt: CardArtSH, GradeChip: GradeChipSH, Sparkline: SparkSH, Delta: DeltaSH, Container: ContainerSH } = window;
const { SHOP: SHOP_SH, SUBMISSION: SUB_SH, SUB_CARDS: SC_SH, BULK_RATES: BR_SH, subStats: subStatsSH, setById: setByIdSH, byId: byIdSH } = window;

function money0(n) { return moneySH(n, { cents: false }); }
function moneyGBP(n) { return '£' + n.toLocaleString(); }

// ── dashboard mock data ──────────────────────────────────────
const DASH_DATA = {
  '7d': { sales: 1240, payouts: 1128, fees: 112, delta: 8, subs: 4, cards: 86, offers: 3, acceptRate: 75, trades: 3, tradeVol: 420, views: 210, unique: 82 },
  '30d': { sales: 5680, payouts: 5169, fees: 511, delta: 12, subs: 18, cards: 342, offers: 14, acceptRate: 78, trades: 14, tradeVol: 1860, views: 892, unique: 340 },
  '90d': { sales: 14320, payouts: 13031, fees: 1289, delta: 18, subs: 52, cards: 1040, offers: 41, acceptRate: 79, trades: 38, tradeVol: 5120, views: 2640, unique: 980 },
  'all': { sales: 28940, payouts: 26335, fees: 2605, delta: 0, subs: 124, cards: 2480, offers: 98, acceptRate: 79, trades: 91, tradeVol: 12400, views: 6200, unique: 2180 },
};

const DASH_ACTIVITY = [
  { type: 'sale', text: 'Sold Charizard ex for £38.50', time: '2h ago' },
  { type: 'submission', text: 'New submission from Jordan M. (24 cards)', time: '5h ago' },
  { type: 'trade', text: 'Trade completed at your shop', time: 'Yesterday' },
  { type: 'review', text: 'New 5-star review from Marcus T.', time: 'Yesterday' },
  { type: 'sale', text: 'Sold Ragavan for £62.00', time: '2d ago' },
  { type: 'submission', text: 'New submission from Priya K. (12 cards)', time: '2d ago' },
  { type: 'sale', text: 'Sold Pikachu IR for £38.50', time: '3d ago' },
  { type: 'trade', text: 'Trade completed at your shop', time: '4d ago' },
  { type: 'sale', text: 'Sold Blue-Eyes for £184.00', time: '5d ago' },
  { type: 'review', text: 'New 4-star review from Diego R.', time: '6d ago' },
];

const DASH_BEST_SELLERS = [
  { id: 'l01', sold: 8, rev: 308, name: 'Charizard ex' },
  { id: 'l06', sold: 6, rev: 372, name: 'Ragavan' },
  { id: 'l09', sold: 5, rev: 192, name: 'Mew ex' },
  { id: 'l02', sold: 4, rev: 154, name: 'Pikachu IR' },
  { id: 'l12', sold: 3, rev: 552, name: 'Blue-Eyes' },
];

const DASH_MOST_WANTED = [
  { id: 'l03', requests: 12, buyPrice: 28, name: 'Mewtwo ex' },
  { id: 'l05', requests: 9, buyPrice: 44, name: 'Umbreon VMAX' },
  { id: 'l07', requests: 8, buyPrice: 18, name: 'Lugia V' },
  { id: 'l01', requests: 7, buyPrice: 38, name: 'Charizard ex' },
  { id: 'l04', requests: 6, buyPrice: 62, name: 'Ragavan' },
];

const DASH_INV_TOP = [
  { id: 'l01', name: 'Charizard ex', sold: 8 },
  { id: 'l02', name: 'Pikachu IR', sold: 6 },
  { id: 'l06', name: 'Ragavan', sold: 5 },
];

const DASH_BAR_HEIGHTS = [40, 55, 48, 62, 38, 71, 58];

const DASH_SOURCES = [
  { label: 'Search', pct: 52 },
  { label: 'Directory', pct: 31 },
  { label: 'Direct', pct: 17 },
];

const ACTIVITY_ICONS = {
  sale: { bg: 'var(--up-wash)', color: 'var(--up)', symbol: '£' },
  submission: { bg: 'oklch(0.92 0.08 240)', color: 'oklch(0.55 0.18 240)', symbol: '▼' },
  trade: { bg: 'oklch(0.92 0.08 300)', color: 'oklch(0.55 0.18 300)', symbol: '⇄' },
  review: { bg: 'oklch(0.93 0.1 80)', color: 'oklch(0.55 0.16 80)', symbol: '★' },
};

// ── shop dashboard component ─────────────────────────────────
function ShopDashboard({ app, onCounter }) {
  const [period, setPeriod] = React.useState('30d');
  const [topTab, setTopTab] = React.useState('best');
  const d = DASH_DATA[period];

  const sectionStyle = { background: TSH.surface, borderRadius: 4, padding: 14, marginBottom: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' };
  const labelStyle = { fontFamily: TSH.sans, fontSize: 11, color: TSH.muted, fontWeight: 600 };
  const bigNumStyle = { fontFamily: TSH.sans, fontWeight: 700, fontSize: 22 };
  const sectionTitle = { fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      {/* header */}
      <div style={{ padding: '50px 16px 0', background: TSH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => app.nav.pop()} style={{ color: TSH.ink, display: 'flex', alignItems: 'center', gap: 4, fontFamily: TSH.sans, fontSize: 14.5, fontWeight: 600 }}>{IconSH.back({ width: 18, height: 18 })} Back</button>
          <span style={{ fontFamily: TSH.sans, fontSize: 10.5, fontWeight: 700, color: SHOP_SH.tint, background: 'var(--up-wash)', borderRadius: 7, padding: '4px 8px' }}>SHOP VIEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 18 }}>{SHOP_SH.initial}</span>
          <div>
            <h1 style={{ margin: 0, fontFamily: TSH.sans, fontWeight: 700, fontSize: 21, letterSpacing: -0.4 }}>{SHOP_SH.name}</h1>
            <div style={{ fontFamily: TSH.sans, fontSize: 12.5, color: TSH.muted }}>Shop dashboard</div>
          </div>
        </div>
        {/* tab bar */}
        <div style={{ display: 'flex', gap: 0, marginTop: 12 }}>
          <button style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, padding: '10px 0', background: 'none', color: TSH.ink, borderBottom: '2px solid ' + TSH.accent }}>Dashboard</button>
          <button onClick={onCounter} style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, padding: '10px 0', background: 'none', color: TSH.muted, borderBottom: '2px solid transparent', position: 'relative' }}>
            Counter
            <span style={{ position: 'absolute', top: 4, marginLeft: 4, minWidth: 18, height: 18, borderRadius: 999, background: 'var(--down)', color: '#fff', fontFamily: TSH.sans, fontWeight: 700, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>2</span>
          </button>
        </div>
        {/* period picker — segmented control */}
        <div style={{ display: 'flex', marginTop: 12, marginBottom: 12, background: TSH.surface2, borderRadius: 4, padding: 2 }}>
          {[['7d', '7 days'], ['30d', '30 days'], ['90d', '90 days'], ['all', 'All time']].map(([key, label]) => (
            <button key={key} onClick={() => setPeriod(key)} style={{
              flex: 1, fontFamily: TSH.sans, fontWeight: 600, fontSize: 13, padding: '8px 0',
              borderRadius: 3, transition: 'all 0.15s',
              background: period === key ? TSH.surface : 'transparent',
              color: period === key ? TSH.ink : TSH.muted,
              boxShadow: period === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 14px 30px' }}>
        <ContainerSH width={1280} style={{ padding: 0 }}>

        {/* Section 1: Revenue Summary */}
        <div style={{ ...sectionTitle }}>Revenue</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 14 }}>
          {[['Total sales', d.sales], ['Payouts', d.payouts], ['Fees', d.fees]].map(([label, val]) => (
            <div key={label} style={{ background: TSH.surface, borderRadius: 4, padding: '11px 10px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={labelStyle}>{label}</div>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 18, marginTop: 2 }}>{moneyGBP(val)}</div>
              {d.delta > 0 && <div style={{ fontFamily: TSH.sans, fontSize: 11, fontWeight: 700, color: 'var(--up)', marginTop: 2 }}>+{d.delta}%</div>}
              {d.delta === 0 && period === 'all' && <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted, marginTop: 2 }}>all time</div>}
            </div>
          ))}
        </div>

        {/* Section 2: Submissions */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={sectionTitle}>Submissions</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--down)', color: '#fff', borderRadius: 999, padding: '4px 10px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 11 }}>
              2 new
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            <div style={{ background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Received</div>
              <div style={bigNumStyle}>{d.subs}</div>
            </div>
            <div style={{ background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Cards reviewed</div>
              <div style={bigNumStyle}>{d.cards.toLocaleString()}</div>
            </div>
            <div style={{ background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Offers made</div>
              <div style={bigNumStyle}>{d.offers}</div>
            </div>
            <div style={{ background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Accept rate</div>
              <div style={bigNumStyle}>{d.acceptRate}%</div>
            </div>
          </div>
          <button onClick={onCounter} style={{ width: '100%', marginTop: 12, background: 'var(--fill)', borderRadius: 4, padding: '12px 0', textAlign: 'center',
            fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, color: '#fff' }}>View inbox · 2 waiting</button>
        </div>

        {/* Section 3: Inventory */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={sectionTitle}>Inventory</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--gold)', color: '#fff', borderRadius: 999, padding: '4px 10px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 11 }}>
              3 low stock
            </span>
          </div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Active listings</div>
              <div style={bigNumStyle}>47</div>
            </div>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Inventory value</div>
              <div style={bigNumStyle}>{moneyGBP(3280)}</div>
            </div>
          </div>
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12, color: TSH.muted, marginBottom: 8 }}>Top sellers</div>
          <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {DASH_INV_TOP.map(c => {
              const item = byIdSH(c.id);
              return (
                <div key={c.id} style={{ flexShrink: 0, textAlign: 'center', width: 80 }}>
                  <div style={{ background: TSH.surface2, borderRadius: 4, padding: 6, display: 'inline-block' }}>
                    {item ? <CardArtSH item={item} w={56} radius={4} /> : <div style={{ width: 56, height: 78, background: TSH.surface2, borderRadius: 4 }} />}
                  </div>
                  <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 11.5, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>{c.sold} sold</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Trades */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={sectionTitle}>Trades</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--accent-wash)', color: 'var(--ink)', borderRadius: 999, padding: '4px 10px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 11 }}>
              1 pending
            </span>
          </div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Trades hosted</div>
              <div style={bigNumStyle}>{d.trades}</div>
            </div>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Trade volume</div>
              <div style={bigNumStyle}>{moneyGBP(d.tradeVol)}</div>
            </div>
          </div>
          <div style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>Your shop hosted {d.trades} trades this period</div>
        </div>

        {/* Section 5: Storefront Visitors */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>Storefront visitors</div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Total views</div>
              <div style={bigNumStyle}>{d.views.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 4, padding: '9px 11px' }}>
              <div style={labelStyle}>Unique visitors</div>
              <div style={bigNumStyle}>{d.unique.toLocaleString()}</div>
            </div>
          </div>
          {/* bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72, marginBottom: 12 }}>
            {DASH_BAR_HEIGHTS.map((h, i) => {
              const maxH = Math.max(...DASH_BAR_HEIGHTS);
              return <div key={i} style={{ flex: 1, height: (h / maxH) * 72, background: SHOP_SH.tint, borderRadius: '4px 4px 0 0', opacity: 0.7 + (h / maxH) * 0.3 }} />;
            })}
          </div>
          {/* source breakdown */}
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12, color: TSH.muted, marginBottom: 6 }}>Sources</div>
          {DASH_SOURCES.map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontFamily: TSH.sans, fontSize: 12.5, color: TSH.ink2 }}>
              <span>{s.label}</span>
              <span style={{ fontWeight: 700 }}>{s.pct}% <span style={{ color: TSH.muted, fontWeight: 400 }}>({Math.round(d.views * s.pct / 100)})</span></span>
            </div>
          ))}
        </div>

        {/* Section 6: Top Cards */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
            <button onClick={() => setTopTab('best')} style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, padding: '8px 0', borderRadius: '4px 0 0 4px',
              background: topTab === 'best' ? 'var(--fill)' : TSH.surface2, color: topTab === 'best' ? '#fff' : TSH.ink2 }}>Best sellers</button>
            <button onClick={() => setTopTab('wanted')} style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, padding: '8px 0', borderRadius: '0 4px 4px 0',
              background: topTab === 'wanted' ? 'var(--fill)' : TSH.surface2, color: topTab === 'wanted' ? '#fff' : TSH.ink2 }}>Most wanted</button>
          </div>
          {topTab === 'best' && DASH_BEST_SELLERS.map((c, i) => {
            const item = byIdSH(c.id);
            return (
              <div key={c.id + '-' + i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ background: TSH.surface2, borderRadius: 4, padding: 4, flexShrink: 0 }}>
                  {item ? <CardArtSH item={item} w={40} radius={4} /> : <div style={{ width: 40, height: 56, background: TSH.surface2, borderRadius: 4 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted }}>{c.sold} sold</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13 }}>{moneyGBP(c.rev)}</div>
                </div>
              </div>
            );
          })}
          {topTab === 'wanted' && DASH_MOST_WANTED.map((c, i) => {
            const item = byIdSH(c.id);
            return (
              <div key={c.id + '-w-' + i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ background: TSH.surface2, borderRadius: 4, padding: 4, flexShrink: 0 }}>
                  {item ? <CardArtSH item={item} w={40} radius={4} /> : <div style={{ width: 40, height: 56, background: TSH.surface2, borderRadius: 4 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted }}>{c.requests}x requested</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13 }}>{moneyGBP(c.buyPrice)}</div>
                  <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>buy price</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 7: Recent Activity */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={sectionTitle}>Recent activity</div>
            <span style={{ fontFamily: TSH.sans, fontSize: 11, fontWeight: 600, color: TSH.muted }}>3 unread</span>
          </div>
          {DASH_ACTIVITY.map((ev, i) => {
            const ico = ACTIVITY_ICONS[ev.type];
            const isNew = i < 3;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < DASH_ACTIVITY.length - 1 ? '1px solid var(--line-2)' : 'none', background: isNew ? 'var(--accent-wash)' : 'transparent', margin: isNew ? '0 -14px' : 0, padding: isNew ? '7px 14px' : '7px 0', borderRadius: isNew ? 4 : 0 }}>
                <span style={{ width: 30, height: 30, borderRadius: 999, background: ico.bg, color: ico.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{ico.symbol}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TSH.sans, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.text}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {isNew && <span style={{ width: 6, height: 6, borderRadius: 999, background: TSH.accent }} />}
                  <span style={{ fontFamily: TSH.sans, fontSize: 11, color: isNew ? TSH.ink : TSH.muted }}>{ev.time}</span>
                </div>
              </div>
            );
          })}
        </div>
        </ContainerSH>

      </div>
    </div>
  );
}

// ── shop screen (two-tab layout) ─────────────────────────────
function ShopScreen({ app }) {
  const [tab, setTab] = React.useState('dashboard'); // dashboard | counter
  const [view, setView] = React.useState('inbox'); // inbox | dash | sent (within counter tab)
  const [filter, setFilter] = React.useState('match');
  const [priceCard, setPriceCard] = React.useState(null); // card in price-guide drawer
  const [offer, setOffer] = React.useState(null); // { creditPct }
  const [prices, setPrices] = React.useState(() => {
    // seed singles ≥$5 with a suggested buy (70% market) so the offer has a number
    const o = {};
    SC_SH.forEach(c => { if (!c.buylist) o[c.id] = Math.round(c.market * 0.7); });
    return o;
  });
  const stats = subStatsSH();

  // Dashboard tab
  if (tab === 'dashboard') return <ShopDashboard app={app} onCounter={() => { setTab('counter'); setView('inbox'); }} />;

  // Counter tab
  if (view === 'inbox') return <ShopInbox app={app} onOpen={() => setView('dash')} onDashboard={() => setTab('dashboard')} />;
  if (view === 'sent') return <ShopSent app={app} offer={offer} onInbox={() => { setView('inbox'); setOffer(null); }} />;

  // ── dashboard ──
  const buylistPayout = stats.buylistPayout;
  const singlesPayout = Object.values(prices).reduce((s, v) => s + (v || 0), 0);
  const bulkPayout = SUB_SH.bulkPayout;
  const cashTotal = Math.round(buylistPayout + singlesPayout + bulkPayout);
  const filtered = SC_SH.filter(c => {
    if (filter === 'match') return c.buylist;
    if (filter === 'singles') return !c.buylist && !c.flag;
    if (filter === 'flag') return c.flag;
    return true;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      {/* header */}
      <div style={{ padding: '50px 14px 12px', background: TSH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setView('inbox')} style={{ color: TSH.ink }}>{IconSH.back({})}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 26, height: 26, borderRadius: 999, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{SUB_SH.seller.initial}</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap' }}>{SUB_SH.seller.name}</span>
            </div>
            <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>#{SUB_SH.id} · {SUB_SH.total.toLocaleString()} cards · ticket #{SUB_SH.ticket}</div>
          </div>
          <span style={{ fontFamily: TSH.sans, fontSize: 10.5, fontWeight: 700, color: SHOP_SH.tint, background: 'var(--up-wash)', borderRadius: 7, padding: '4px 8px' }}>SHOP VIEW</span>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 14px 120px' }}>
        <ContainerSH width={1280} style={{ padding: 0 }}>
        {/* seller trust banner */}
        {SUB_SH.seller.verified ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', borderRadius: 4, padding: '10px 13px', marginBottom: 12, boxShadow: 'inset 0 0 0 1px #16a34a' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: '#16a34a', color: '#fff', fontSize: 11, flexShrink: 0 }}>✓</span>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, color: '#15803d' }}>Verified seller · {SUB_SH.seller.rating}% positive · {SUB_SH.seller.sales} sales</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', borderRadius: 4, padding: '10px 13px', marginBottom: 12, boxShadow: 'inset 0 0 0 1px #dc2626' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: '#dc2626', color: '#fff', fontSize: 11, flexShrink: 0 }}>!</span>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, color: '#dc2626' }}>⚠ Unverified seller — verify ID before accepting high-value cards</span>
          </div>
        )}

        {/* stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <StatTile label="Total cards" value={SUB_SH.total.toLocaleString()} />
          <StatTile label="Est. market" value={money0(stats.estMarket)} />
          <StatTile label="On your buylist" value={stats.buylistCount} gold />
          <StatTile label="Buylist payout" value={money0(buylistPayout)} accent />
        </div>

        {/* filter chips */}
        <div className="noscroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '14px 0 10px' }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All itemized</FilterChip>
          <FilterChip active={filter === 'match'} onClick={() => setFilter('match')} gold>★ Buylist {stats.buylistCount}</FilterChip>
          <FilterChip active={filter === 'singles'} onClick={() => setFilter('singles')}>Singles ≥ £5</FilterChip>
          <FilterChip active={filter === 'flag'} onClick={() => setFilter('flag')} danger>⚠ Flagged</FilterChip>
        </div>

        {/* card rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(c => <ShopCardRow key={c.id} c={c} price={prices[c.id]} onClick={() => setPriceCard(c)} app={app} />)}
        </div>

        {/* bulk block */}
        <div style={{ marginTop: 14, background: TSH.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14 }}>{SUB_SH.bulkCount.toLocaleString()} bulk · standing rates</span>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{moneySH(bulkPayout)}</span>
          </div>
          {BR_SH.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', fontFamily: TSH.sans, fontSize: 12.5, color: TSH.ink2 }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.count} {b.label}</span>
              <span style={{ fontFamily: TSH.sans, whiteSpace: 'nowrap', flexShrink: 0 }}>{moneySH(b.per1000 * b.count / 1000)} <span style={{ color: TSH.faint }}>· {money0(b.per1000)}/1k</span></span>
            </div>
          ))}
        </div>
        </ContainerSH>
      </div>

      {/* sticky offer bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)',
        backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted }}>Offer total (cash)</div>
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 22 }}>{money0(cashTotal)}</div>
        </div>
        <button onClick={() => setOffer({ creditPct: 60, cash: cashTotal })} style={{ flex: 1.3, background: 'var(--ink)', color: '#fff', borderRadius: 14,
          padding: '15px 12px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>Build offer →</button>
      </div>

      {/* price guide drawer */}
      <PriceGuide card={priceCard} onClose={() => setPriceCard(null)} onSet={(v) => { setPrices(p => ({ ...p, [priceCard.id]: v })); setPriceCard(null); app.toast('Added ' + money0(v) + ' to offer'); }} />

      {/* offer composer */}
      <OfferComposer offer={offer} cashTotal={cashTotal} onClose={() => setOffer(null)} onSend={() => { setOffer(o => ({ ...o, sent: true })); setView('sent'); }} />
    </div>
  );
}

function StatTile({ label, value, gold, accent }) {
  return (
    <div style={{ background: gold ? 'var(--accent-wash)' : TSH.surface, borderRadius: 13, padding: '11px 13px',
      boxShadow: gold ? 'inset 0 0 0 1.5px var(--gold)' : accent ? 'inset 0 0 0 1.5px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <div style={{ fontFamily: TSH.sans, fontSize: 11, color: TSH.muted, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 22, color: accent ? TSH.accent : TSH.ink, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function FilterChip({ children, active, onClick, gold, danger }) {
  const bg = active ? (danger ? 'var(--down)' : gold ? 'var(--gold)' : 'var(--fill)') : TSH.surface;
  const fg = active ? (gold ? '#2a2000' : '#fff') : TSH.ink2;
  return (
    <button onClick={onClick} style={{ whiteSpace: 'nowrap', fontFamily: TSH.sans, fontWeight: 700, fontSize: 13,
      padding: '7px 12px', borderRadius: 999, background: bg, color: fg, boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{children}</button>
  );
}

function ShopCardRow({ c, price, onClick, app }) {
  const matched = !!c.buylist;
  const fill = matched ? Math.min(c.qty, c.buylist.want) : 0;
  const highValue = c.market > 100;
  const [flagged, setFlagged] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
        background: flagged ? '#fef2f2' : matched ? 'var(--accent-wash)' : TSH.surface,
        borderRadius: 4, padding: 10,
        boxShadow: flagged ? 'inset 0 0 0 1.5px var(--down)' : matched ? 'inset 0 0 0 1.5px var(--gold)' : c.flag ? 'inset 0 0 0 1.5px var(--down)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
        <div style={{ background: matched ? 'rgba(255,255,255,0.6)' : TSH.surface2, borderRadius: 4, padding: 6, flexShrink: 0 }}>
          <CardArtSH item={c} w={42} radius={4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
            {c.flag && <span style={{ color: 'var(--down)', fontSize: 12 }}>⚠</span>}
            {flagged && <span style={{ background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: 4, fontFamily: TSH.sans, fontWeight: 700, fontSize: 9 }}>FLAGGED</span>}
          </div>
          <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.cond} · ×{c.qty}{c.flag ? ' · ' + c.flag : ' · ' + (setByIdSH(c.set) ? setByIdSH(c.set).name.replace(/\s*\(.*\)/, '') : '')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {matched ? (
              <React.Fragment>
                <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 11, color: 'var(--ink)', whiteSpace: 'nowrap' }}>★ WANT {c.buylist.want}</div>
                <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{money0(c.buylist.buy)}<span style={{ fontFamily: TSH.sans, fontSize: 10, color: TSH.muted }}>/ea</span></div>
              </React.Fragment>
            ) : c.flag ? (
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, fontWeight: 700, color: 'var(--down)' }}>inspect</div>
            ) : (
              <React.Fragment>
                <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>your buy</div>
                <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, color: price ? TSH.ink : TSH.accent }}>{price ? money0(price) : 'price'}</div>
              </React.Fragment>
            )}
          </div>
          <button onClick={(e) => { e.stopPropagation(); setFlagged(!flagged); app && app.toast(flagged ? 'Flag removed' : 'Card flagged — added to seller\'s record'); }}
            style={{ width: 28, height: 28, borderRadius: 4,
              background: flagged ? '#dc2626' : highValue ? '#fef2f2' : 'transparent',
              color: flagged ? '#fff' : highValue ? '#dc2626' : TSH.faint,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
              boxShadow: flagged ? 'none' : highValue ? 'inset 0 0 0 1px #fecaca' : 'inset 0 0 0 1px var(--line)' }}>⚑</button>
        </div>
      </button>
    </div>
  );
}

// ── price guide drawer ───────────────────────────────────────
function PriceGuide({ card, onClose, onSet }) {
  const [pct, setPct] = React.useState(70);
  React.useEffect(() => { setPct(70); }, [card]);
  if (!card) return null;
  const ladder = [
    ['Near Mint', Math.round(card.market)],
    ['Lightly Played', Math.round(card.market * 0.8)],
    ['Moderately Pl.', Math.round(card.market * 0.62)],
    ['Heavily Played', Math.round(card.market * 0.46)],
  ];
  const condIdx = { NM: 0, LP: 1, MP: 2, HP: 3 }[card.cond] ?? 0;
  const condMarket = ladder[condIdx][1];
  const buy = Math.round(condMarket * pct / 100);
  const comps = [
    ['Jun 5 · NM', Math.round(card.market * 1.02)],
    ['Jun 2 · NM', Math.round(card.market * 0.98)],
    ['May 28 · LP', Math.round(card.market * 0.82)],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.4)', animation: 'ccScrim 0.2s ease' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: TSH.surface, borderRadius: '22px 22px 0 0',
        maxHeight: '92%', display: 'flex', flexDirection: 'column', animation: 'ccSlideUp 0.28s cubic-bezier(0.2,0.9,0.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line)' }} /></div>
        <div className="noscroll" style={{ overflow: 'auto', padding: '12px 18px 26px' }}>
          {/* header */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: TSH.surface2, borderRadius: 9, padding: 6 }}><CardArtSH item={card} w={50} radius={6} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 16 }}>{card.name}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>{setByIdSH(card.set) ? setByIdSH(card.set).name : ''} · {card.number} · ×{card.qty}</div>
            </div>
            <button onClick={onClose} style={{ color: TSH.faint, fontSize: 22, lineHeight: 1 }}>×</button>
          </div>

          {/* market headline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, background: TSH.surface2, borderRadius: 13, padding: '12px 14px' }}>
            <div>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, fontWeight: 600 }}>Market · {card.cond}</div>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 26 }}>{money0(condMarket)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <SparkSH data={[card.market*0.82, card.market*0.88, card.market*0.85, card.market*0.94, card.market*0.97, card.market]} w={92} h={36} up dots />
              <div style={{ fontFamily: TSH.sans, fontSize: 11, color: 'var(--up)', fontWeight: 700, marginTop: 2 }}>▲ 6.2% / 90d</div>
            </div>
          </div>

          {/* condition ladder */}
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, margin: '16px 0 8px' }}>Price by condition</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ladder.map(([lab, val], i) => (
              <div key={lab} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 9, padding: '8px 12px',
                background: i === condIdx ? 'var(--accent-wash)' : TSH.surface2, boxShadow: i === condIdx ? 'inset 0 0 0 1.5px var(--accent)' : 'none' }}>
                <span style={{ fontFamily: TSH.sans, fontWeight: 600, fontSize: 13.5, color: i === condIdx ? TSH.accent : TSH.ink2, whiteSpace: 'nowrap' }}>{lab}{i === condIdx ? ' · stated' : ''}</span>
                <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{money0(val)}</span>
              </div>
            ))}
          </div>

          {/* recent comps */}
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, margin: '16px 0 8px' }}>Recent sold comps</div>
          <div style={{ background: TSH.surface2, borderRadius: 11, padding: '6px 12px' }}>
            {comps.map(([d, v]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', fontFamily: TSH.sans, fontSize: 12.5, color: TSH.ink2 }}>
                <span style={{ whiteSpace: 'nowrap' }}>{d}</span><span style={{ fontFamily: TSH.sans, fontWeight: 600, flexShrink: 0 }}>{money0(v)}</span>
              </div>
            ))}
          </div>

          {/* buy % */}
          <div style={{ marginTop: 18, background: 'var(--accent-wash)', borderRadius: 13, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>Your buy %</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {[60, 70, 80].map(p => (
                  <button key={p} onClick={() => setPct(p)} style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, padding: '4px 11px', borderRadius: 8,
                    background: pct === p ? TSH.ink : '#fff', color: pct === p ? '#fff' : TSH.ink2 }}>{p}%</button>
                ))}
              </div>
            </div>
            <input type="range" min="40" max="90" step="5" value={pct} onChange={e => setPct(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 12 }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.ink2 }}>Buy price {card.qty > 1 ? '(×' + card.qty + ')' : ''}</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>{money0(buy * card.qty)}</span>
            </div>
          </div>

          <button onClick={() => onSet(buy * card.qty)} style={{ width: '100%', marginTop: 14, background: 'var(--ink)', color: '#fff', borderRadius: 14,
            padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 16 }}>Add {money0(buy * card.qty)} to offer</button>
        </div>
      </div>
    </div>
  );
}

// ── offer composer ───────────────────────────────────────────
function OfferComposer({ offer, cashTotal, onClose, onSend }) {
  const [creditPct, setCreditPct] = React.useState(60);
  const [msg, setMsg] = React.useState("Offer\'s ready — come on in ");
  React.useEffect(() => { if (offer) { setCreditPct(60); setMsg("Offer\'s ready — come on in "); } }, [offer]);
  if (!offer || offer.sent) return null;
  const creditTotal = Math.round(cashTotal * (1 + SHOP_SH.creditBonus));
  const templates = ["Offer\'s ready — come on in ", 'Can you bring these back to inspect?', "We\'ll pass on bulk — singles only", "What\'s your availability this week?"];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 85 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.4)', animation: 'ccScrim 0.2s ease' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: TSH.surface, borderRadius: '22px 22px 0 0',
        maxHeight: '92%', display: 'flex', flexDirection: 'column', animation: 'ccSlideUp 0.28s cubic-bezier(0.2,0.9,0.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line)' }} /></div>
        <div className="noscroll" style={{ overflow: 'auto', padding: '10px 18px 26px' }}>
          <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 19, letterSpacing: -0.3 }}>Build offer for {SUB_SH.seller.name}</div>

          {/* cash / credit split */}
          <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
            <div style={{ flex: 1, background: TSH.surface2, borderRadius: 13, padding: '12px 13px' }}>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted, fontWeight: 600 }}>Cash</div>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 22 }}>{money0(cashTotal)}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--up-wash)', borderRadius: 13, padding: '12px 13px', boxShadow: 'inset 0 0 0 1.5px var(--up)' }}>
              <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: 'var(--up)', fontWeight: 700 }}>Credit +20%</div>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 22, color: 'var(--up)' }}>{money0(creditTotal)}</div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13 }}>Suggested split</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 16, borderRadius: 999, overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              <div style={{ width: (100 - creditPct) + '%', background: TSH.accent }} />
              <div style={{ width: creditPct + '%', background: 'var(--gold)' }} />
            </div>
            <input type="range" min="0" max="100" step="10" value={creditPct} onChange={e => setCreditPct(+e.target.value)} style={{ width: '100%', accentColor: 'var(--gold)', marginTop: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TSH.sans, fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: 'var(--ink)' }}>{money0(Math.round(cashTotal * (100 - creditPct) / 100))} cash</span>
              <span style={{ color: 'var(--gold)', filter: 'brightness(0.85)' }}>{money0(Math.round(creditTotal * creditPct / 100))} credit</span>
            </div>
          </div>

          {/* message */}
          <div style={{ marginTop: 16, fontFamily: TSH.sans, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Message to seller</div>
          <div className="noscroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 10 }}>
            {templates.map(t => (
              <button key={t} onClick={() => setMsg(t)} style={{ whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TSH.sans, fontWeight: 600, fontSize: 12.5,
                padding: '7px 11px', borderRadius: 999, background: msg === t ? 'var(--fill)' : TSH.surface2, color: msg === t ? '#fff' : TSH.ink2 }}>{t}</button>
            ))}
          </div>
          <div style={{ background: TSH.surface2, borderRadius: 12, padding: '11px 13px', fontFamily: TSH.sans, fontSize: 13.5, color: TSH.ink, boxShadow: 'inset 0 0 0 1px var(--line)' }}>{msg}</div>

          <button onClick={onSend} style={{ width: '100%', marginTop: 16, background: 'var(--ink)', color: '#fff', borderRadius: 14, padding: 15,
            fontFamily: TSH.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>Send offer →</button>
          <div style={{ textAlign: 'center', marginTop: 10, fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>Cards & payment exchange in person at the counter.</div>
        </div>
      </div>
    </div>
  );
}

// ── shop inbox ───────────────────────────────────────────────
function ShopInbox({ app, onOpen, onDashboard }) {
  const stats = subStatsSH();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      <div style={{ padding: '50px 16px 0', background: TSH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => app.nav.pop()} style={{ color: TSH.ink, display: 'flex', alignItems: 'center', gap: 4, fontFamily: TSH.sans, fontSize: 14.5, fontWeight: 600 }}>{IconSH.back({ width: 18, height: 18 })} Back</button>
          <span style={{ fontFamily: TSH.sans, fontSize: 10.5, fontWeight: 700, color: SHOP_SH.tint, background: 'var(--up-wash)', borderRadius: 7, padding: '4px 8px' }}>SHOP VIEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 18 }}>{SHOP_SH.initial}</span>
          <div>
            <h1 style={{ margin: 0, fontFamily: TSH.sans, fontWeight: 700, fontSize: 21, letterSpacing: -0.4 }}>Buylist inbox</h1>
            <div style={{ fontFamily: TSH.sans, fontSize: 12.5, color: TSH.muted }}>{SHOP_SH.name} · counter</div>
          </div>
        </div>
        {/* tab bar */}
        <div style={{ display: 'flex', gap: 0, marginTop: 12, paddingBottom: 0 }}>
          <button onClick={onDashboard} style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, padding: '10px 0', background: 'none', color: TSH.muted, borderBottom: '2px solid transparent' }}>Dashboard</button>
          <button style={{ flex: 1, fontFamily: TSH.sans, fontWeight: 700, fontSize: 14, padding: '10px 0', background: 'none', color: TSH.ink, borderBottom: '2px solid ' + TSH.accent }}>Counter</button>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <ContainerSH width={1280} style={{ padding: 0 }}>
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12.5, color: TSH.muted, marginBottom: 9, letterSpacing: 0.2 }}>NEW · NEEDS REVIEW</div>
        {/* hero submission */}
        <button onClick={onOpen} style={{ width: '100%', textAlign: 'left', background: 'var(--accent-wash)', borderRadius: 16, padding: 15,
          boxShadow: 'inset 0 0 0 2px var(--accent)', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: SHOP_SH.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 19 }}>{SUB_SH.seller.initial}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 16 }}>{SUB_SH.seller.name} · {SUB_SH.total.toLocaleString()} cards</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 12, color: TSH.muted }}>{SUB_SH.submittedAgo} · ticket #{SUB_SH.ticket}</div>
            </div>
            <span style={{ fontFamily: TSH.sans, fontSize: 10, fontWeight: 700, color: '#fff', background: 'var(--down)', borderRadius: 999, padding: '3px 8px' }}>NEW</span>
          </div>
          {/* seller trust section */}
          {SUB_SH.seller.verified ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, background: '#f0fdf4', borderRadius: 4, padding: '7px 10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, background: '#16a34a', color: '#fff', fontSize: 10, flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12, color: '#16a34a' }}>Verified · Tier {SUB_SH.seller.tier}</span>
              <span style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.ink2 }}>{SUB_SH.seller.rating}% · {SUB_SH.seller.sales} sales · {SUB_SH.seller.disputes} disputes</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, background: '#fef2f2', borderRadius: 4, padding: '7px 10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, background: '#dc2626', color: '#fff', fontSize: 10, flexShrink: 0 }}>!</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12, color: '#dc2626' }}>⚠ Unverified</span>
              <span style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.ink2 }}>First-time seller · No transaction history</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{stats.buylistCount}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>★ buylist hits</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 17 }}>{money0(stats.buylistPayout)}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>est. payout</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 17 }}>{money0(stats.estMarket)}</div>
              <div style={{ fontFamily: TSH.sans, fontSize: 10.5, color: TSH.muted }}>market val</div>
            </div>
          </div>
          <div style={{ marginTop: 13, background: 'var(--ink)', color: '#fff', borderRadius: 11, padding: '11px 0', textAlign: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 14.5 }}>Review submission →</div>
        </button>

        {/* other queue items */}
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 12.5, color: TSH.muted, margin: '4px 0 9px', letterSpacing: 0.2 }}>EARLIER</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <QueueRow initial="S" name="Sam R." cards="64 cards" meta="18 min ago" tag="12 hits" tagColor={TSH.accent} onClick={() => app.toast('Tap Jordan\'s submission to review')} />
          <QueueRow initial="D" name="Dana P." cards="310 cards" meta="1 hr ago · offer sent" tag="replied" tagColor="var(--up)" onClick={() => app.toast('Tap Jordan\'s submission to review')} />
          <QueueRow initial="M" name="Miguel A." cards="1,420 cards" meta="3 hr ago · completed" tag="paid" tagColor={TSH.muted} onClick={() => app.toast('Tap Jordan\'s submission to review')} />
        </div>
        </ContainerSH>
      </div>
    </div>
  );
}

function QueueRow({ initial, name, cards, meta, tag, tagColor, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
      background: TSH.surface, borderRadius: 13, padding: 12, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: TSH.surface2, color: TSH.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSH.sans, fontWeight: 700, fontSize: 15 }}>{initial}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 14 }}>{name} · {cards}</div>
        <div style={{ fontFamily: TSH.sans, fontSize: 11.5, color: TSH.muted }}>{meta}</div>
      </div>
      <span style={{ fontFamily: TSH.sans, fontSize: 11.5, fontWeight: 700, color: tagColor }}>{tag}</span>
    </button>
  );
}

// ── shop sent confirmation ───────────────────────────────────
function ShopSent({ app, offer, onInbox }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSH.bg }}>
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '80px 24px 24px', textAlign: 'center' }}>
        <ContainerSH width={1280} style={{ padding: 0 }}>
        <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconSH.check({ width: 44, height: 44 })}</div>
        <h1 style={{ margin: '20px 0 4px', fontFamily: TSH.sans, fontWeight: 700, fontSize: 24, letterSpacing: -0.5 }}>Offer sent to {SUB_SH.seller.name}</h1>
        <p style={{ fontFamily: TSH.sans, fontSize: 14, color: TSH.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 270 }}>
          They've been texted. When they come in with ticket #{SUB_SH.ticket}, check the stack against the list and pay out.
        </p>
        <div style={{ background: TSH.surface, borderRadius: 16, padding: 16, marginTop: 20, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {[['Cash option', money0(offer ? offer.cash : 620)], ['Store credit', money0(Math.round((offer ? offer.cash : 620) * 1.2))], ['Ticket', '#' + SUB_SH.ticket]].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none' }}>
              <span style={{ fontFamily: TSH.sans, fontSize: 13.5, color: TSH.muted }}>{k}</span>
              <span style={{ fontFamily: TSH.sans, fontWeight: 700, fontSize: 13.5, color: i === 1 ? 'var(--up)' : TSH.ink }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-wash)', color: 'var(--ink)', borderRadius: 12, padding: '13px 14px', marginTop: 14, textAlign: 'left' }}>
          {IconSH.shield({})}
          <span style={{ fontFamily: TSH.sans, fontSize: 13, fontWeight: 600 }}>Submission moves to "Awaiting pickup" in your queue.</span>
        </div>
        </ContainerSH>
      </div>
      <div style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--line)', background: TSH.surface, display: 'flex', gap: 10 }}>
        <button onClick={onInbox} style={{ flex: 1, background: TSH.surface2, color: TSH.ink, borderRadius: 14, padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 15, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Back to inbox</button>
        <button onClick={() => app.nav.setTab('home')} style={{ flex: 1, background: 'var(--ink)', color: '#fff', borderRadius: 14, padding: 15, fontFamily: TSH.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
      </div>
    </div>
  );
}

Object.assign(window, { ShopScreen });
