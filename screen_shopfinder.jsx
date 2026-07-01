// ─────────────────────────────────────────────────────────────
// Find a local shop — directory of nearby LGS (its own flow)
// ─────────────────────────────────────────────────────────────
const { T: TSF, Icon: IconSF, Stars: StarsSF, Badge: BadgeSF } = window;
const { SHOPS: SHOPS_SF } = window;

function ShopFinderScreen({ app }) {
  const [filter, setFilter] = React.useState('all'); // all | vault | tradeHub | events
  const filters = [['all', 'All shops'], ['vault', 'Has vault'], ['tradeHub', 'Trade hub'], ['events', 'Events']];
  const shops = [...SHOPS_SF].sort((a, b) => a.dist - b.dist).filter(s => filter === 'all' || s[filter]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSF.bg }}>
      {/* header — matches the Trade-with-collectors header exactly */}
      <div style={{ padding: '14px 14px 12px', background: TSF.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TSF.ink }}>{IconSF.back({})}</button>
        <span style={{ fontFamily: TSF.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>Find a local shop</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 14 }}>
          <span style={{ color: TSF.accent, marginTop: 1 }}>{IconSF.shield({ width: 17, height: 17 })}</span>
          <span style={{ fontFamily: TSF.sans, fontSize: 12.5, color: TSF.ink2, lineHeight: 1.45 }}>
            Verified game shops near you — buy, sell a collection, <b>trade</b>, or store cards in the <b>vault</b>.
          </span>
        </div>
      </div>

      {/* filter chips */}
      <div className="noscroll" style={{ display: 'flex', gap: 8, padding: '0 16px 4px', overflowX: 'auto', flexShrink: 0 }}>
        {filters.map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TSF.sans, fontWeight: 700, fontSize: 13,
            padding: '8px 14px', borderRadius: 999, background: filter === id ? TSF.ink : TSF.surface, color: filter === id ? '#fff' : TSF.ink2,
            boxShadow: filter === id ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '4px 16px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shops.map(s => (
          <button key={s.id} onClick={() => app.nav.push('storefront', { shop: s.id })} style={{ width: '100%', textAlign: 'left',
            background: TSF.surface, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, background: s.tint, color: '#fff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSF.sans, fontWeight: 700, fontSize: 22 }}>{s.initial}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: TSF.sans, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>{s.name}</span>
                  {IconSF.shield({ width: 14, height: 14, style: { color: s.tint } })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <StarsSF rating={s.rating * 20} /><span style={{ fontFamily: TSF.sans, fontSize: 12, color: TSF.muted }}>{s.rating} · {s.dist} km</span>
                </div>
              </div>
              {IconSF.chevron({ style: { color: TSF.faint } })}
            </div>
            <p style={{ fontFamily: TSF.sans, fontSize: 13, color: TSF.ink2, lineHeight: 1.45, margin: '11px 0 0' }}>{s.blurb}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
              {s.enrolled && <BadgeSF tone="accent">Buylist intake</BadgeSF>}
              {s.tradeHub && <BadgeSF tone="up">Trade hub</BadgeSF>}
              {s.vault && <BadgeSF tone="gold">★ Vault</BadgeSF>}
              {s.events && <BadgeSF tone="neutral">Events</BadgeSF>}
              <span style={{ marginLeft: 'auto', fontFamily: TSF.sans, fontSize: 11.5, color: 'var(--up)', fontWeight: 700, alignSelf: 'center' }}>● {s.hours}</span>
            </div>
          </button>
        ))}
        {shops.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: TSF.muted, fontFamily: TSF.sans, fontSize: 14 }}>No shops match that filter.</div>
        )}
      </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShopFinderScreen });
