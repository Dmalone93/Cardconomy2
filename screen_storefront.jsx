// ─────────────────────────────────────────────────────────────
// LGS storefront + shop enrollment pitch (community pillar)
// ─────────────────────────────────────────────────────────────
const { T: TF, money: moneyF, Icon: IconF, CardArt: CardArtF, GradeChip: GradeChipF, Stars: StarsF } = window;
const { SHOPS: SHOPS_F, byId: byIdF, setById: setByIdF, gameById: gameByIdF, shopById: shopByIdF } = window;

const mf = (n) => moneyF(n, { cents: false });

// ── storefront ───────────────────────────────────────────────
function StorefrontScreen({ app, params = {} }) {
  const shop = shopByIdF(params.shop) || SHOPS_F[0];
  const inv = (shop.inventory || []).map(byIdF).filter(Boolean);
  const services = [
    shop.enrolled && ['Buylist intake', 'Sell your stack here', IconF.bolt, () => app.nav.push('sellshop')],
    shop.tradeHub && ['Trade hub', 'Meet & swap on neutral ground', IconF.shield, () => app.nav.push('trade')],
    shop.vault && ['Local vault', 'Store & trade graded cards', vaultIcon, () => app.toast('Vault: store cards at the shop')],
    shop.events && ['Events', 'Tournaments & trade nights', calIcon, () => app.toast('Upcoming: Friday trade night')],
  ].filter(Boolean);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
      {/* nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '52px 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconF.back({})}</button>
        <button onClick={() => app.toast('Following ' + shop.name)} style={{ height: 38, padding: '0 16px', borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, fontFamily: TF.sans, fontWeight: 700, fontSize: 13.5 }}>+ Follow</button>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
        {/* banner */}
        <div style={{ height: 150, background: 'linear-gradient(135deg, ' + shop.tint + ', ' + shop.tint + 'bb)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 14px, transparent 14px 28px)' }} />
        </div>

        {/* header card */}
        <div style={{ padding: '0 16px', marginTop: -36, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginBottom: 12 }}>
            <span style={{ width: 76, height: 76, borderRadius: 20, background: shop.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: TF.sans, fontWeight: 800, fontSize: 34, border: '3px solid ' + TF.surface, boxShadow: '0 4px 14px rgba(0,0,0,0.15)', flexShrink: 0 }}>{shop.initial}</span>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ margin: 0, fontFamily: TF.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.5 }}>{shop.name}</h1>
                {IconF.shield({ width: 16, height: 16, style: { color: shop.tint } })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontFamily: TF.sans, fontSize: 12.5, color: TF.muted }}>
                <StarsF rating={shop.rating * 20} /> {shop.rating} · {shop.reviews.toLocaleString()} reviews
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: TF.sans, fontSize: 12.5, color: TF.ink2, marginBottom: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>📍 {shop.loc} · {shop.dist} mi</span>
            <span style={{ color: 'var(--up)', fontWeight: 700 }}>● {shop.hours}</span>
          </div>
          <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.ink2, lineHeight: 1.5, margin: '0 0 16px' }}>{shop.blurb}</p>

          {/* primary CTAs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => app.nav.push('sellshop')} style={{ flex: 1, background: TF.accent, color: '#fff', borderRadius: 13, padding: 14, fontFamily: TF.sans, fontWeight: 700, fontSize: 14.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.3)' }}>{IconF.bolt({ width: 16, height: 16 })} Sell to shop</button>
            <button onClick={() => app.nav.push('trade')} style={{ flex: 1, background: TF.surface, color: TF.ink, borderRadius: 13, padding: 14, fontFamily: TF.sans, fontWeight: 700, fontSize: 14.5,
              boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Trade here</button>
          </div>

          {/* services */}
          <div style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 16, marginBottom: 10 }}>What this shop offers</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {services.map(([title, sub, icon, onClick], i) => (
              <button key={i} onClick={onClick} style={{ textAlign: 'left', background: TF.surface, borderRadius: 14, padding: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-wash)', color: TF.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>{icon({ width: 18, height: 18 })}</span>
                <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13.5 }}>{title}</div>
                <div style={{ fontFamily: TF.sans, fontSize: 11.5, color: TF.muted, lineHeight: 1.3, marginTop: 1 }}>{sub}</div>
              </button>
            ))}
          </div>

          {/* inventory */}
          {inv.length > 0 && (
            <React.Fragment>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 16 }}>In stock now</span>
                <button onClick={() => app.nav.push('search')} style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.accent }}>See all</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 8 }}>
                {inv.slice(0, 4).map(l => (
                  <button key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} style={{ textAlign: 'left', background: TF.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ background: TF.surface2, padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}><CardArtF item={l} w={86} /></div>
                    <div style={{ padding: '8px 11px 11px' }}>
                      <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{moneyF(l.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

function vaultIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/><path d="M12 8.5V6M19 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function calIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }

// ── step indicator ────────────────────────────────────────────
function StepIndicator({ current, total, onJump }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const completed = stepNum < current;
        const active = stepNum === current;
        return (
          <button key={i}
            onClick={() => completed ? onJump(stepNum) : null}
            style={{
              flex: 1, height: 4, borderRadius: 2, padding: 0,
              background: active ? 'var(--accent)' : completed ? 'var(--fill)' : 'var(--line)',
              cursor: completed ? 'pointer' : 'default',
              transition: 'background 0.2s',
            }}
          />
        );
      })}
    </div>
  );
}

// ── wizard field helper ──────────────────────────────────────
function WizardField({ label, value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 6 }}>{label}</div>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} type={type}
        style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: 'none',
          background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)',
          fontFamily: TF.sans, fontSize: 15, color: TF.ink, outline: 'none' }} />
    </div>
  );
}

// ── Step 1: Your Shop ────────────────────────────────────────
function Step1({ form, set }) {
  const DAYS = [['mon','Mon'],['tue','Tue'],['wed','Wed'],['thu','Thu'],['fri','Fri'],['sat','Sat'],['sun','Sun']];
  const setHour = (day, field, val) => {
    set('hours', { ...form.hours, [day]: { ...form.hours[day], [field]: val } });
  };
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Your shop</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Basic details so collectors can find you.</p>
      <WizardField label="Shop name" value={form.shopName} onChange={v => set('shopName', v)} placeholder="e.g. Gnome Games" />
      <WizardField label="Address line 1" value={form.address} onChange={v => set('address', v)} placeholder="12 High Street" />
      <div style={{ display: 'flex', gap: 10 }}>
        <WizardField label="City / Town" value={form.city} onChange={v => set('city', v)} placeholder="Manchester" style={{ flex: 2 }} />
        <WizardField label="County" value={form.county} onChange={v => set('county', v)} placeholder="Greater Manchester" style={{ flex: 2 }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <WizardField label="Postcode" value={form.postcode} onChange={v => set('postcode', v)} placeholder="M1 2AB" style={{ flex: 1 }} />
        <WizardField label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="07700 900123" type="tel" style={{ flex: 2 }} />
      </div>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10, marginTop: 6 }}>Opening hours</div>
      {DAYS.map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 36, fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: form.hours[key].closed ? TF.faint : TF.ink }}>{label}</span>
          {form.hours[key].closed ? (
            <span style={{ flex: 1, fontFamily: TF.sans, fontSize: 13, color: TF.faint }}>Closed</span>
          ) : (
            <React.Fragment>
              <input type="time" value={form.hours[key].open} onChange={e => setHour(key, 'open', e.target.value)}
                style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: 'none', background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TF.sans, fontSize: 13, color: TF.ink }} />
              <span style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted }}>to</span>
              <input type="time" value={form.hours[key].close} onChange={e => setHour(key, 'close', e.target.value)}
                style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: 'none', background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TF.sans, fontSize: 13, color: TF.ink }} />
            </React.Fragment>
          )}
          <button onClick={() => setHour(key, 'closed', !form.hours[key].closed)}
            style={{ fontFamily: TF.sans, fontSize: 11, fontWeight: 600, color: form.hours[key].closed ? TF.accent : TF.faint, padding: '4px 8px', background: 'none' }}>
            {form.hours[key].closed ? 'Open' : 'Close'}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Step 2: Verify Your Business ─────────────────────────────
function Step2({ form, set }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Verify your business</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>We verify within 2 business days. Your shop won't appear publicly until verified.</p>
      <WizardField label="Owner full name" value={form.ownerName} onChange={v => set('ownerName', v)} placeholder="Sara Johnson" />
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Your role</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['owner', 'manager', 'staff'].map(r => (
          <button key={r} onClick={() => set('role', r)} style={{
            flex: 1, padding: '12px 10px', borderRadius: 4, textAlign: 'center',
            background: form.role === r ? 'var(--accent-wash)' : TF.surface,
            boxShadow: form.role === r ? '0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)',
            fontFamily: TF.sans, fontWeight: 600, fontSize: 14,
            color: form.role === r ? TF.accent : TF.ink,
          }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
        ))}
      </div>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Storefront photo or business registration</div>
      <button onClick={() => set('uploaded', !form.uploaded)} style={{
        width: '100%', height: 120, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: form.uploaded ? 'var(--up-wash)' : TF.surface,
        boxShadow: form.uploaded ? '0 0 0 2px var(--up)' : 'inset 0 0 0 1.5px var(--line)',
        color: form.uploaded ? 'var(--up)' : TF.muted,
      }}>
        {form.uploaded
          ? <React.Fragment>{IconF.check({ width: 28, height: 28 })}<span style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13 }}>Photo uploaded</span></React.Fragment>
          : <React.Fragment>{IconF.camera ? IconF.camera({ width: 28, height: 28 }) : <span style={{ fontSize: 28 }}>📷</span>}<span style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13 }}>Tap to upload</span></React.Fragment>
        }
      </button>
    </div>
  );
}

// ── Step 3: Games You Buy ────────────────────────────────────
function Step3({ form, set }) {
  const GAME_LIST = window.GAMES || [];
  const LOGOS = window.GAME_LOGOS || {};
  const toggle = (id) => {
    const g = form.games.includes(id) ? form.games.filter(x => x !== id) : [...form.games, id];
    set('games', g);
  };
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Games you buy</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Select the TCGs your shop deals in. You can change this later.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {GAME_LIST.map(g => {
          const on = form.games.includes(g.id);
          const logo = LOGOS[g.id];
          return (
            <button key={g.id} onClick={() => toggle(g.id)} style={{
              padding: 16, borderRadius: 4, textAlign: 'center',
              background: on ? g.tint + '1a' : TF.surface,
              boxShadow: on ? '0 0 0 2px ' + g.tint : 'inset 0 0 0 1px var(--line)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              position: 'relative',
            }}>
              {on && <span style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 999, background: g.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>✓</span>}
              {logo
                ? <img src={logo} alt={g.name} style={{ height: 28, width: 'auto', maxWidth: 100, objectFit: 'contain', filter: on ? 'none' : 'saturate(0.5) opacity(0.6)' }} />
                : <span style={{ width: 32, height: 32, borderRadius: 999, background: g.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              }
              <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13, color: on ? g.tint : TF.muted }}>{g.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared condition constants ────────────────────────────────
const CONDS = ['NM', 'LP', 'MP', 'HP', 'Any'];
const condColors = { NM: '#16a34a', LP: '#d97706', MP: '#ea580c', HP: '#dc2626', Any: '#71757e' };

// ── Buylist Wizard (full-screen overlay) ─────────────────────
function BuylistWizard({ open, cards, onDone, onClose }) {
  const [view, setView] = React.useState('search');
  const [items, setItems] = React.useState(cards || []);
  const [searchQ, setSearchQ] = React.useState('');
  const [expandedId, setExpandedId] = React.useState(null);
  const [addCond, setAddCond] = React.useState('NM');
  const [addPrice, setAddPrice] = React.useState('');
  const [addQty, setAddQty] = React.useState('1');
  const [bulkCond, setBulkCond] = React.useState('');
  const [bulkPrice, setBulkPrice] = React.useState('');
  const LISTINGS_ALL = window.LISTINGS || [];

  // Reset internal state when wizard opens
  React.useEffect(() => {
    if (open) {
      setView('search');
      setItems(cards || []);
      setSearchQ('');
      setExpandedId(null);
    }
  }, [open]);

  if (!open) return null;

  const query = searchQ.trim().toLowerCase();
  const searchResults = query.length >= 2
    ? LISTINGS_ALL.filter(l =>
        l.name.toLowerCase().includes(query) ||
        (l.number && l.number.toLowerCase().includes(query))
      ).slice(0, 20)
    : [];

  const isAdded = (listing) => items.some(c => c.name === listing.name && c.game === listing.game);

  const addCard = (listing) => {
    setItems(prev => [...prev, {
      name: listing.name, subtitle: listing.subtitle, game: listing.game,
      condition: addCond, maxPrice: parseFloat(addPrice) || 0, qty: parseInt(addQty) || 1,
    }]);
    setExpandedId(null);
    setAddCond('NM'); setAddPrice(''); setAddQty('1');
  };

  const removeCard = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const cycleCondition = (idx) => {
    setItems(prev => prev.map((c, i) => {
      if (i !== idx) return c;
      const next = CONDS[(CONDS.indexOf(c.condition) + 1) % CONDS.length];
      return { ...c, condition: next };
    }));
  };

  const updateCard = (idx, field, val) => {
    setItems(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const applyBulk = () => {
    setItems(prev => prev.map(c => {
      const updated = { ...c };
      if (bulkCond) updated.condition = bulkCond;
      if (bulkPrice) updated.maxPrice = parseFloat(bulkPrice) || c.maxPrice;
      return updated;
    }));
    setBulkCond(''); setBulkPrice('');
  };

  // ── Search view ──
  if (view === 'search') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: TF.bg, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '52px 12px 10px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={() => { onDone(items); onClose(); }}
            style={{ width: 38, height: 38, borderRadius: 999, background: TF.surface, color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>
            {IconF.back({})}
          </button>
          <div style={{ flex: 1, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>Build your buylist</div>
        </div>

        {/* search input */}
        <div style={{ padding: '0 16px 10px', flexShrink: 0, position: 'relative' }}>
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setExpandedId(null); }}
            placeholder="Search by card name or number..."
            style={{ width: '100%', padding: '12px 36px 12px 14px', borderRadius: 4, border: 'none',
              background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)',
              fontFamily: TF.sans, fontSize: 14, color: TF.ink, outline: 'none' }} />
          {searchQ && (
            <button onClick={() => { setSearchQ(''); setExpandedId(null); }}
              style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'none', color: TF.muted, fontWeight: 700, fontSize: 18, padding: '0 4px' }}>
              ×
            </button>
          )}
        </div>

        {/* results */}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px', paddingBottom: items.length > 0 ? 80 : 16 }}>
          {query.length < 2 && (
            <div style={{ padding: 40, textAlign: 'center', color: TF.faint, fontFamily: TF.sans, fontSize: 13 }}>
              Search for cards to add to your buylist
            </div>
          )}
          {query.length >= 2 && searchResults.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: TF.faint, fontFamily: TF.sans, fontSize: 13 }}>
              No cards found for '{searchQ.trim()}'
            </div>
          )}
          {searchResults.map(l => {
            const g = gameByIdF(l.game);
            const added = isAdded(l);
            const expanded = expandedId === l.id && !added;
            return (
              <div key={l.id} style={{ marginBottom: 6 }}>
                <button onClick={() => {
                  if (added) return;
                  setExpandedId(expandedId === l.id ? null : l.id);
                  setAddCond('NM'); setAddPrice(''); setAddQty('1');
                }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
                    background: TF.surface, borderRadius: expanded ? '4px 4px 0 0' : 4,
                    boxShadow: 'inset 0 0 0 1px var(--line)', cursor: added ? 'default' : 'pointer' }}>
                  <CardArtF item={l} w={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: g ? g.tint : '#999', flexShrink: 0 }} />
                      <span style={{ fontFamily: TF.sans, fontSize: 11.5, color: TF.muted }}>{l.subtitle}{g ? ' · ' + g.short : ''}</span>
                    </div>
                  </div>
                  {added && (
                    <span style={{ width: 24, height: 24, borderRadius: 999, background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  )}
                </button>
                {expanded && (
                  <div style={{ background: TF.surface, borderRadius: '0 0 4px 4px', padding: 14, boxShadow: 'inset 0 0 0 1px var(--line)', borderTop: 'none' }}>
                    <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 12, color: TF.ink2, marginBottom: 6 }}>Condition</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {CONDS.map(c => (
                        <button key={c} onClick={() => setAddCond(c)} style={{
                          flex: 1, padding: '8px 0', borderRadius: 4, textAlign: 'center',
                          background: addCond === c ? condColors[c] + '1a' : TF.bg,
                          boxShadow: addCond === c ? '0 0 0 2px ' + condColors[c] : 'inset 0 0 0 1px var(--line)',
                          fontFamily: TF.sans, fontWeight: 700, fontSize: 12,
                          color: addCond === c ? condColors[c] : TF.muted,
                        }}>{c}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 12, color: TF.ink2, marginBottom: 4 }}>Max buy price</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: TF.bg, borderRadius: 4, padding: '8px 10px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                          <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.muted }}>£</span>
                          <input value={addPrice} onChange={e => setAddPrice(e.target.value)} type="number" placeholder="0"
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.ink, width: 50 }} />
                        </div>
                      </div>
                      <div style={{ width: 70 }}>
                        <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 12, color: TF.ink2, marginBottom: 4 }}>Qty</div>
                        <input value={addQty} onChange={e => setAddQty(e.target.value)} type="number"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: 'none', background: TF.bg, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.ink, textAlign: 'center' }} />
                      </div>
                    </div>
                    <button onClick={() => addCard(l)}
                      style={{ width: '100%', padding: 12, borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 14,
                        background: 'var(--fill)', color: '#fff' }}>
                      Add
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* floating bottom bar */}
        {items.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px',
            background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 14, color: TF.ink }}>
              {items.length} card{items.length !== 1 ? 's' : ''} added
            </span>
            <button onClick={() => setView('review')}
              style={{ padding: '12px 20px', borderRadius: 4, background: TF.accent, color: '#fff',
                fontFamily: TF.sans, fontWeight: 700, fontSize: 14 }}>
              Review →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Review view ──
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: TF.bg, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ padding: '52px 12px 10px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button onClick={() => setView('search')}
          style={{ width: 38, height: 38, borderRadius: 999, background: TF.surface, color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>
          {IconF.back({})}
        </button>
        <div style={{ flex: 1, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>Review buylist ({items.length} card{items.length !== 1 ? 's' : ''})</div>
      </div>

      {/* bulk edit bar */}
      <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
        <div style={{ background: TF.surface, borderRadius: 4, padding: 12, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 12, color: TF.ink2, marginBottom: 8 }}>Set all to:</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {CONDS.map(c => (
              <button key={c} onClick={() => setBulkCond(bulkCond === c ? '' : c)} style={{
                flex: 1, padding: '6px 0', borderRadius: 4, textAlign: 'center',
                background: bulkCond === c ? condColors[c] + '1a' : TF.bg,
                boxShadow: bulkCond === c ? '0 0 0 2px ' + condColors[c] : 'inset 0 0 0 1px var(--line)',
                fontFamily: TF.sans, fontWeight: 700, fontSize: 11,
                color: bulkCond === c ? condColors[c] : TF.muted,
              }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, background: TF.bg, borderRadius: 4, padding: '8px 10px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, color: TF.muted }}>£</span>
              <input value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} type="number" placeholder="price"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TF.sans, fontWeight: 700, fontSize: 14, color: TF.ink, width: 50 }} />
            </div>
            <button onClick={applyBulk} disabled={!bulkCond && !bulkPrice}
              style={{ padding: '8px 16px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 13,
                background: (bulkCond || bulkPrice) ? 'var(--fill)' : 'var(--line)',
                color: (bulkCond || bulkPrice) ? '#fff' : TF.muted }}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* card list */}
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px', paddingBottom: 90 }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '10px 12px', background: TF.surface, borderRadius: 4 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
              <div style={{ fontFamily: TF.sans, fontSize: 11.5, color: TF.muted, marginTop: 1 }}>{c.subtitle}</div>
            </div>
            <button onClick={() => cycleCondition(i)}
              style={{ padding: '3px 8px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 11,
                background: condColors[c.condition] + '1a', color: condColors[c.condition], flexShrink: 0 }}>
              {c.condition}
            </button>
            <span style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted, flexShrink: 0 }}>×{c.qty}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13, color: TF.muted }}>£</span>
              <input value={c.maxPrice} onChange={e => updateCard(i, 'maxPrice', parseFloat(e.target.value) || 0)} type="number"
                style={{ width: 50, border: 'none', outline: 'none', background: 'transparent', fontFamily: TF.sans, fontWeight: 700, fontSize: 13, color: TF.ink, padding: 0 }} />
            </div>
            <button onClick={() => removeCard(i)}
              style={{ color: TF.faint, fontWeight: 700, fontSize: 18, background: 'none', padding: '0 4px', flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>

      {/* done button */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px',
        background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
        <button onClick={() => { onDone(items); onClose(); }}
          style={{ width: '100%', padding: 16, borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 16,
            background: 'var(--fill)', color: '#fff' }}>
          Done
        </button>
      </div>
    </div>
  );
}

// ── Step 4: Buylist Setup ────────────────────────────────────
function Step4({ form, set }) {
  const setRate = (key, val) => set('bulkRates', { ...form.bulkRates, [key]: val });
  const [wizardOpen, setWizardOpen] = React.useState(false);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Buylist setup</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Set your standing bulk buy rates and wanted singles. Sellers see these when submitting.</p>

      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Bulk rates (per 1,000 cards)</div>
      {[['cu', 'Commons / Uncommons'], ['rh', 'Rares / Holos'], ['fo', 'Foils (any)']].map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ flex: 1, fontFamily: TF.sans, fontSize: 14, fontWeight: 500 }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: TF.surface, borderRadius: 4, padding: '8px 12px', boxShadow: 'inset 0 0 0 1px var(--line)', width: 90 }}>
            <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.muted }}>£</span>
            <input value={form.bulkRates[key]} onChange={e => setRate(key, e.target.value)} type="number"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.ink, width: 40 }} />
          </div>
        </div>
      ))}

      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginTop: 24, marginBottom: 6 }}>Wanted singles</div>
      <p style={{ fontFamily: TF.sans, fontSize: 13, color: TF.muted, margin: '0 0 12px' }}>Add specific cards you want to buy, with prices and conditions.</p>

      {/* Summary list when cards exist */}
      {form.wantedCards.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 12, color: TF.faint, marginBottom: 8 }}>{form.wantedCards.length} card{form.wantedCards.length !== 1 ? 's' : ''} on buylist</div>
          {form.wantedCards.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '10px 12px', background: TF.surface, borderRadius: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <span style={{ padding: '1px 6px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 10,
                    background: condColors[c.condition] + '1a', color: condColors[c.condition] }}>{c.condition}</span>
                  <span style={{ fontFamily: TF.sans, fontSize: 11.5, color: TF.muted }}>qty {c.qty}</span>
                </div>
              </div>
              <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>£{c.maxPrice}</span>
            </div>
          ))}
          <button onClick={() => setWizardOpen(true)}
            style={{ width: '100%', padding: 12, borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 14, marginTop: 8,
              background: 'transparent', color: TF.accent, boxShadow: '0 0 0 2px ' + TF.accent }}>
            Edit buylist
          </button>
        </div>
      )}

      {/* Empty state — add button */}
      {form.wantedCards.length === 0 && (
        <button onClick={() => setWizardOpen(true)}
          style={{ width: '100%', padding: 14, borderRadius: 4, fontFamily: TF.sans, fontWeight: 700, fontSize: 14,
            background: 'transparent', color: TF.accent, boxShadow: '0 0 0 2px ' + TF.accent }}>
          Add to buylist
        </button>
      )}

      {/* Wizard overlay */}
      <BuylistWizard
        open={wizardOpen}
        cards={form.wantedCards}
        onDone={(cards) => set('wantedCards', cards)}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}

// ── Step 5: Payout Details ───────────────────────────────────
function Step5({ form, set }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Payout details</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>How you receive funds from sales on Cardconomy. You can update this anytime in settings.</p>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Payout method</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['bank', 'Bank transfer'], ['credit', 'Store credit only']].map(([val, label]) => (
          <button key={val} onClick={() => set('payoutMethod', val)} style={{
            flex: 1, padding: '14px 10px', borderRadius: 4, textAlign: 'center',
            background: form.payoutMethod === val ? 'var(--accent-wash)' : TF.surface,
            boxShadow: form.payoutMethod === val ? '0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)',
            fontFamily: TF.sans, fontWeight: 600, fontSize: 14,
            color: form.payoutMethod === val ? TF.accent : TF.ink,
          }}>{label}</button>
        ))}
      </div>
      {form.payoutMethod === 'bank' && (
        <div>
          <WizardField label="Account holder name" value={form.bankName} onChange={v => set('bankName', v)} placeholder="Gnome Games Ltd" />
          <WizardField label="Sort code" value={form.routing} onChange={v => set('routing', v)} placeholder="12-34-56" />
          <WizardField label="Account number" value={form.account} onChange={v => set('account', v)} placeholder="12345678" />
        </div>
      )}
    </div>
  );
}

// ── Step 6: Branding ─────────────────────────────────────────
function Step6({ form, set }) {
  const COLORS = ['#2f8f5b', '#1d4ed8', '#7c3aed', '#dc2626', '#ea580c', '#0e7490', '#334155', '#b8860b'];
  const GAME_LIST = window.GAMES || [];
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Branding</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Make your storefront stand out in the directory.</p>

      {/* logo upload */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Shop logo or photo</div>
      <button onClick={() => set('logo', !form.logo)} style={{
        width: 80, height: 80, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: form.logo ? form.accentColor : TF.surface,
        boxShadow: form.logo ? 'none' : 'inset 0 0 0 1.5px var(--line)',
        color: form.logo ? '#fff' : TF.muted, marginBottom: 20,
      }}>
        {form.logo
          ? <span style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 28 }}>{(form.shopName || 'S').charAt(0).toUpperCase()}</span>
          : <span style={{ fontSize: 24 }}>📷</span>
        }
      </button>

      {/* accent color */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Accent color</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => set('accentColor', c)} style={{
            width: 36, height: 36, borderRadius: 999, background: c, padding: 0,
            boxShadow: form.accentColor === c ? '0 0 0 3px var(--bg), 0 0 0 5px ' + c : 'none',
          }} />
        ))}
      </div>

      {/* bio */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Shop bio</div>
      <textarea value={form.bio} onChange={e => e.target.value.length <= 200 && set('bio', e.target.value)}
        placeholder="Tell collectors what makes your shop special"
        rows={3} style={{
          width: '100%', padding: '12px 14px', borderRadius: 4, border: 'none', resize: 'none',
          background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)',
          fontFamily: TF.sans, fontSize: 15, color: TF.ink, outline: 'none',
        }} />
      <div style={{ fontFamily: TF.sans, fontSize: 11, color: TF.faint, textAlign: 'right', marginTop: 4 }}>{form.bio.length}/200</div>

      {/* live preview */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginTop: 16, marginBottom: 10 }}>Preview</div>
      <div style={{ background: TF.surface, borderRadius: 4, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 4, background: form.accentColor, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TF.sans, fontWeight: 800, fontSize: 20, flexShrink: 0,
        }}>{(form.shopName || 'S').charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15 }}>{form.shopName || 'Your Shop'}</div>
          <div style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted, marginTop: 2 }}>
            {form.bio || 'Your bio will appear here'}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {form.games.map(gid => {
              const g = GAME_LIST.find(x => x.id === gid);
              return g ? <span key={gid} style={{ background: g.tint + '1a', color: g.tint, padding: '1px 6px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 600, fontSize: 10 }}>{g.short}</span> : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── shop enrollment wizard ────────────────────────────────────
function EnrollShopScreen({ app }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    shopName: '', address: '', city: '', county: '', postcode: '', phone: '',
    hours: {
      mon: { open: '10:00', close: '20:00', closed: false },
      tue: { open: '10:00', close: '20:00', closed: false },
      wed: { open: '10:00', close: '20:00', closed: false },
      thu: { open: '10:00', close: '20:00', closed: false },
      fri: { open: '10:00', close: '20:00', closed: false },
      sat: { open: '10:00', close: '20:00', closed: false },
      sun: { open: '11:00', close: '18:00', closed: false },
    },
    ownerName: '', role: 'owner', uploaded: false,
    games: [],
    bulkRates: { cu: '6', rh: '25', fo: '80' },
    wantedCards: [],
    buylistSkipped: false,
    payoutMethod: 'bank',
    bankName: '', routing: '', account: '',
    logo: false, accentColor: '#2f8f5b', bio: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Step validation — determines if Continue is enabled
  const canContinue = () => {
    if (step === 1) return form.shopName && form.address && form.city && form.county && form.postcode && form.phone;
    if (step === 2) return form.ownerName && form.role;
    if (step === 3) return form.games.length > 0;
    if (step === 4) return form.buylistSkipped || (form.bulkRates.cu && form.bulkRates.rh && form.bulkRates.fo);
    if (step === 5) return form.payoutMethod === 'credit' || (form.bankName && form.routing && form.account);
    if (step === 6) return true; // branding is all optional
    return true;
  };

  const STEP_LABELS = ['Shop', 'Verify', 'Games', 'Buylist', 'Payout', 'Brand'];

  const props = [
    [IconF.bolt, 'Free deal flow', 'Walk-in sellers scan a QR and submit their whole collection digitally — even when your counter is slammed.'],
    [storeIcon, 'Your own storefront', 'A branded page on Cardonomy with your inventory, hours, and reputation in front of local collectors.'],
    [vaultIcon, 'Be the local vault', 'Members store graded cards at your shop and trade them without shipping — recurring foot traffic and fees.'],
    [IconF.shield, 'Neutral trade hub', 'Collectors meet at your shop to settle trades safely. More visits, more sales at the counter.'],
    [IconF.tag, 'Pro seller tools', 'Buylist manager, instant price guide, and an offer composer — all built in. No extra software.'],
  ];

  // ── Step 0: Landing page ──
  if (step === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '52px 12px 10px' }}>
          <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconF.back({})}</button>
        </div>
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
          {/* hero */}
          <div style={{ color: '#fff', padding: '92px 22px 30px', position: 'relative', overflow: 'hidden', minHeight: 280 }}>
            <img src="content/enroll-hero.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-block', fontFamily: TF.sans, fontWeight: 700, fontSize: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: 4, padding: '5px 11px', marginBottom: 14 }}>FOR LOCAL GAME SHOPS</div>
              <h1 style={{ margin: 0, fontFamily: TF.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, lineHeight: 1.05, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Turn your shop into the local card hub</h1>
              <p style={{ fontFamily: TF.sans, fontSize: 15, opacity: 0.92, lineHeight: 1.5, margin: '12px 0 0', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Join the Cardonomy network — free deal flow, a storefront, and tools that bring collectors through your door.</p>
            </div>
          </div>

          {/* stat strip */}
          <div style={{ display: 'flex', gap: 10, padding: 16, marginTop: -2 }}>
            {[['$0', 'to enroll'], ['2 days', 'to go live'], ['9%', 'flat seller fee']].map(([v, k]) => (
              <div key={k} style={{ flex: 1, background: TF.surface, borderRadius: 13, padding: '12px 10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 18 }}>{v}</div>
                <div style={{ fontFamily: TF.sans, fontSize: 10.5, color: TF.muted }}>{k}</div>
              </div>
            ))}
          </div>

          {/* value props */}
          <div style={{ padding: '6px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {props.map(([icon, title, body], i) => (
              <div key={i} style={{ display: 'flex', gap: 13, background: TF.surface, borderRadius: 14, padding: 15, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'var(--accent-wash)', color: TF.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon({ width: 20, height: 20 })}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>{title}</div>
                  <div style={{ fontFamily: TF.sans, fontSize: 13, color: TF.ink2, lineHeight: 1.45, marginTop: 2 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* testimonial */}
          <div style={{ margin: '16px 16px 0', background: 'var(--fill)', borderRadius: 16, padding: 18, color: '#fff' }}>
            <div style={{ fontFamily: TF.sans, fontSize: 15, lineHeight: 1.5, fontWeight: 500 }}>"The QR intake alone saved us hours every weekend. Sellers submit on their phone, we make offers when we get a sec — and they keep shopping while they wait."</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: '#2f8f5b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontWeight: 800, fontSize: 15 }}>G</span>
              <div>
                <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13 }}>Sara — Gnome Games</div>
                <div style={{ fontFamily: TF.sans, fontSize: 11.5, opacity: 0.7 }}>Manchester · enrolled 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* sticky CTA */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setStep(1)} style={{ width: '100%', background: '#2f8f5b', color: '#fff', borderRadius: 14, padding: 16, fontFamily: TF.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px rgba(47,143,91,0.4)' }}>Enroll your shop — free</button>
        </div>
      </div>
    );
  }

  // ── Success screen (step 7) ──
  if (step === 7) {
    const GAME_LIST = window.GAMES || [];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg, alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconF.check({ width: 44, height: 44 })}</div>
        <h1 style={{ margin: '20px 0 6px', fontFamily: TF.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>Your application is in review</h1>
        <p style={{ fontFamily: TF.sans, fontSize: 14.5, color: TF.muted, lineHeight: 1.5, maxWidth: 290 }}>We'll verify your shop within 2 business days and send your QR intake kit.</p>

        {/* summary card */}
        <div style={{ background: TF.surface, borderRadius: 4, padding: 16, marginTop: 20, width: '100%', maxWidth: 300, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 4, background: form.accentColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
              {(form.shopName || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15 }}>{form.shopName}</div>
              <div style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted }}>{form.city}{form.postcode ? ', ' + form.postcode : ''}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {form.games.map(gid => {
              const g = GAME_LIST.find(x => x.id === gid);
              return g ? <span key={gid} style={{ background: g.tint + '1a', color: g.tint, padding: '2px 8px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 600, fontSize: 11 }}>{g.short}</span> : null;
            })}
          </div>
        </div>

        <button onClick={() => app.nav.push('storefront', { shop: 'gnome' })} style={{ marginTop: 24, background: TF.accent, color: '#fff', borderRadius: 4, padding: '14px 26px', fontFamily: TF.sans, fontWeight: 700, fontSize: 15.5 }}>Preview your storefront</button>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 10, color: TF.muted, fontFamily: TF.sans, fontWeight: 600, fontSize: 14 }}>Back to home</button>
      </div>
    );
  }

  // ── Wizard steps 1-6 ──
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
      {/* header */}
      <div style={{ padding: '52px 12px 8px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button onClick={() => step === 1 ? setStep(0) : setStep(step - 1)}
          style={{ width: 38, height: 38, borderRadius: 999, background: TF.surface, color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>
          {IconF.back({})}
        </button>
        <div style={{ flex: 1, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>
          Step {step} of 6 — {STEP_LABELS[step - 1]}
        </div>
      </div>
      <div style={{ padding: '8px 0 16px', flexShrink: 0 }}>
        <StepIndicator current={step} total={6} onJump={setStep} />
      </div>

      {/* step content */}
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 120px' }}>
        {step === 1 && <Step1 form={form} set={set} />}
        {step === 2 && <Step2 form={form} set={set} />}
        {step === 3 && <Step3 form={form} set={set} />}
        {step === 4 && <Step4 form={form} set={set} />}
        {step === 5 && <Step5 form={form} set={set} />}
        {step === 6 && <Step6 form={form} set={set} />}
      </div>

      {/* sticky continue */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
        <button onClick={() => setStep(step + 1)} disabled={!canContinue()}
          style={{ width: '100%', background: canContinue() ? 'var(--fill)' : 'var(--line)', color: canContinue() ? '#fff' : TF.muted,
            borderRadius: 4, padding: 16, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>
          {step === 6 ? 'Submit application' : 'Continue'}
        </button>
        {step === 4 && !form.buylistSkipped && (
          <button onClick={() => { set('buylistSkipped', true); setStep(5); }}
            style={{ width: '100%', marginTop: 8, color: TF.muted, fontFamily: TF.sans, fontWeight: 600, fontSize: 14, padding: 8, background: 'none' }}>
            I'll set this up later
          </button>
        )}
      </div>
    </div>
  );
}

function storeIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>; }

Object.assign(window, { StorefrontScreen, EnrollShopScreen });
