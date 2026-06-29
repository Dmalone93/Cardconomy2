// ─────────────────────────────────────────────────────────────
// Shipping label generation screen (seller flow)
// ─────────────────────────────────────────────────────────────
const { T: TSP, money: moneySP, Icon: IconSP } = window;

const MOCK_SOLD_ITEMS = [
  { id: 's1', name: 'Charizard ex 199/165', buyer: 'Marcus T.', price: 38.50, date: '19 Jun 2026', selected: true },
  { id: 's2', name: 'Pikachu VMAX 044/185', buyer: 'Sophie L.', price: 14.99, date: '18 Jun 2026', selected: false },
  { id: 's3', name: 'Blue-Eyes White Dragon LOB-001', buyer: 'Jordan K.', price: 24.00, date: '17 Jun 2026', selected: false },
];

const SHIPPING_METHODS = [
  { id: 'tracked24', label: 'Royal Mail Tracked 24', price: 3.49, tag: 'Recommended' },
  { id: 'tracked48', label: 'Royal Mail Tracked 48', price: 2.99, tag: null },
  { id: 'first', label: 'Royal Mail 1st Class', price: 1.85, tag: null },
];

const PACKAGE_SIZES = ['Standard letter', 'Large letter', 'Small parcel'];

function ShippingScreen({ app }) {
  const [items, setItems] = React.useState(MOCK_SOLD_ITEMS);
  const [method, setMethod] = React.useState('tracked24');
  const [pkgSize, setPkgSize] = React.useState('Standard letter');
  const [done, setDone] = React.useState(false);

  const selectedItems = items.filter(function(i) { return i.selected; });
  const selectedCount = selectedItems.length;
  const shippingCost = (SHIPPING_METHODS.find(function(m) { return m.id === method; }) || SHIPPING_METHODS[0]).price;
  const orderTotal = selectedItems.reduce(function(s, i) { return s + i.price; }, 0);
  const freeShipping = orderTotal >= 20;

  function toggleItem(id) {
    setItems(function(prev) {
      return prev.map(function(i) { return i.id === id ? Object.assign({}, i, { selected: !i.selected }) : i; });
    });
  }

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSP.bg }}>
        {/* header */}
        <div style={{ padding: '14px 14px 12px', background: TSP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={function() { app.nav.pop(); }} style={{ color: TSP.ink, display: 'flex' }}>{IconSP.back({})}</button>
          <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 18 }}>Label Ready</span>
        </div>

        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '20px 16px 100px' }}>
          {/* success banner */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32 }}>{'✓'}</div>
            <h2 style={{ margin: 0, fontFamily: TSP.sans, fontWeight: 700, fontSize: 20 }}>Label generated</h2>
            <p style={{ fontFamily: TSP.sans, fontSize: 13, color: TSP.muted, margin: '6px 0 0' }}>{selectedCount} item{selectedCount !== 1 ? 's' : ''} ready to ship</p>
          </div>

          {/* mock label preview */}
          <div style={{ background: TSP.surface, borderRadius: 16, padding: 20, marginBottom: 20, border: '2px dashed var(--line)', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            {/* Royal Mail header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 16, color: '#e11d48' }}>ROYAL MAIL</span>
              <span style={{ fontFamily: TSP.mono, fontSize: 11, color: TSP.muted }}>TRACKED 24</span>
            </div>

            {/* from / to */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 10, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 4 }}>From</div>
                <div style={{ fontFamily: TSP.sans, fontSize: 12, lineHeight: 1.5, color: TSP.ink }}>
                  Alex Rivera<br />14 Merchant Lane<br />London SE1 7AB
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 10, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 4 }}>To</div>
                <div style={{ fontFamily: TSP.sans, fontSize: 12, lineHeight: 1.5, color: TSP.ink }}>
                  {selectedItems[0] ? selectedItems[0].buyer : 'Buyer'}<br />27 Oak Street<br />Manchester M1 3FW
                </div>
              </div>
            </div>

            {/* barcode placeholder */}
            <div style={{ background: TSP.ink, borderRadius: 4, height: 48, marginBottom: 10 }} />
            <div style={{ textAlign: 'center', fontFamily: TSP.mono, fontSize: 13, fontWeight: 600, letterSpacing: 2, color: TSP.ink }}>RM 7482 9103 4GB</div>

            {/* tracking number */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TSP.sans, fontSize: 11, color: TSP.muted }}>Tracking</span>
              <span style={{ fontFamily: TSP.mono, fontSize: 12, fontWeight: 600, color: TSP.ink }}>CC-2026-0619-7482</span>
            </div>
          </div>

          {/* action buttons */}
          <button onClick={function() { app.toast('Sending to printer…'); }} style={{
            width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 13, padding: 14,
            fontFamily: TSP.sans, fontWeight: 700, fontSize: 15, marginBottom: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Print label
          </button>
          <button onClick={function() { app.toast('PDF downloaded'); }} style={{
            width: '100%', background: TSP.surface, color: TSP.ink, borderRadius: 13, padding: 14,
            fontFamily: TSP.sans, fontWeight: 700, fontSize: 15, border: '1.5px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSP.bg }}>
      {/* header */}
      <div style={{ padding: '14px 14px 12px', background: TSP.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={function() { app.nav.pop(); }} style={{ color: TSP.ink, display: 'flex' }}>{IconSP.back({})}</button>
        <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 18 }}>Ship Your Items</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>

        {/* items to ship */}
        <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 11, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 8 }}>Items to ship</div>
        <div style={{ background: TSP.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {items.map(function(item, i) {
            return (
              <button key={item.id} onClick={function() { toggleItem(item.id); }} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                borderBottom: i < items.length - 1 ? '1px solid var(--line-2)' : 'none',
              }}>
                {/* checkbox */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6, border: item.selected ? 'none' : '2px solid var(--faint)',
                  background: item.selected ? 'var(--ink)' : 'transparent', color: '#fff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                }}>{item.selected ? '✓' : ''}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontFamily: TSP.sans, fontSize: 12, color: TSP.muted, marginTop: 2 }}>
                    {item.buyer} {'·'} {item.date}
                  </div>
                </div>
                <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{moneySP(item.price)}</span>
              </button>
            );
          })}
        </div>

        {/* shipping method */}
        <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 11, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 8 }}>Shipping method</div>
        <div style={{ background: TSP.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {SHIPPING_METHODS.map(function(m, i) {
            var active = method === m.id;
            return (
              <button key={m.id} onClick={function() { setMethod(m.id); }} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                borderBottom: i < SHIPPING_METHODS.length - 1 ? '1px solid var(--line-2)' : 'none',
              }}>
                {/* radio */}
                <div style={{
                  width: 20, height: 20, borderRadius: 999, border: active ? '6px solid var(--ink)' : '2px solid var(--faint)',
                  background: '#fff', flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: TSP.sans, fontWeight: 600, fontSize: 14 }}>{m.label}</span>
                    {m.tag && <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 999, padding: '1px 7px', fontFamily: TSP.sans, fontWeight: 700, fontSize: 10 }}>{m.tag}</span>}
                  </div>
                </div>
                <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{moneySP(m.price)}</span>
              </button>
            );
          })}
        </div>

        {/* package size */}
        <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 11, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 8 }}>Package size</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {PACKAGE_SIZES.map(function(sz) {
            var active = pkgSize === sz;
            return (
              <button key={sz} onClick={function() { setPkgSize(sz); }} style={{
                flex: 1, background: active ? 'var(--ink)' : TSP.surface, color: active ? '#fff' : TSP.ink,
                borderRadius: 10, padding: '10px 6px', fontFamily: TSP.sans, fontWeight: 700, fontSize: 12,
                border: active ? 'none' : '1.5px solid var(--line)',
                boxShadow: active ? 'none' : '0 1px 3px rgba(20,24,40,0.05)',
              }}>{sz}</button>
            );
          })}
        </div>

        {/* summary */}
        <div style={{ background: TSP.surface, borderRadius: 16, padding: 16, marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 11, letterSpacing: 0.8, color: TSP.muted, textTransform: 'uppercase', marginBottom: 10 }}>Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: TSP.sans, fontSize: 14, color: TSP.ink }}>{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
            <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 14 }}>{moneySP(orderTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: TSP.sans, fontSize: 14, color: TSP.ink }}>Shipping cost</span>
            <span style={{ fontFamily: TSP.sans, fontWeight: 700, fontSize: 14, color: freeShipping ? '#16a34a' : TSP.ink }}>
              {freeShipping ? 'FREE' : moneySP(shippingCost)}
            </span>
          </div>
          {freeShipping && (
            <div style={{ background: '#dcfce7', borderRadius: 8, padding: '8px 12px', fontFamily: TSP.sans, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
              {'✓'} Cardconomy covers shipping on orders over {moneySP(20)}
            </div>
          )}
          {!freeShipping && (
            <div style={{ background: 'var(--line-2)', borderRadius: 8, padding: '8px 12px', fontFamily: TSP.sans, fontSize: 12, color: TSP.muted }}>
              Cardconomy covers shipping on orders over {moneySP(20)}
            </div>
          )}
        </div>

        {/* generate button */}
        <button
          onClick={function() { if (selectedCount > 0) setDone(true); else app.toast('Select at least one item'); }}
          disabled={selectedCount === 0}
          style={{
            width: '100%', background: selectedCount > 0 ? 'var(--ink)' : 'var(--faint)', color: '#fff', borderRadius: 13, padding: 15,
            fontFamily: TSP.sans, fontWeight: 700, fontSize: 16, opacity: selectedCount > 0 ? 1 : 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2"/></svg>
          Generate label
        </button>

      </div>
    </div>
  );
}

window.ShippingScreen = ShippingScreen;
