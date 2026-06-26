// ─────────────────────────────────────────────────────────────
// Checkout / Buy It Now
// ─────────────────────────────────────────────────────────────
const { T: TC, money: moneyC, CardArt: CardArtC, GradeChip: GradeChipC, Icon: IconC, Sheet: SheetC } = window;
const { byId: byIdC, setById: setByIdC } = window;

const SAVED_ADDRESSES = [
  { name: 'Declan Malone', line1: '14 Maple Drive', city: 'Manchester', postcode: 'M1 4FN', isDefault: true },
  { name: 'Declan Malone', line1: 'Unit 7 Northern Quarter', city: 'Manchester', postcode: 'M4 1HQ', label: 'Work' },
  { name: 'Card Cave Manchester', line1: '22 High Street', city: 'Salford', postcode: 'M3 5BQ', label: 'Friend' },
];

function Radio({ on }) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
      boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--line)', background: on ? 'var(--accent)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {on && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}
    </div>
  );
}

function SelectRow({ on, onClick, title, sub, trailing }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
      padding: '13px 14px', background: TC.surface, borderRadius: 4,
      boxShadow: on ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>
      <Radio on={on} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TC.sans, fontWeight: 600, fontSize: 14.5 }}>{title}</div>
        {sub && <div style={{ fontFamily: TC.sans, fontSize: 12, color: TC.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {trailing}
    </button>
  );
}

function CheckoutScreen({ app, params }) {
  const item = byIdC(params.id);
  if (!item) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 12, color: TC.muted }}>{IconC.cart({ width: 40, height: 40 })}</div>
        <div style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 18 }}>Item not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: 'var(--ink)', fontFamily: TC.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );
  const [pay, setPay] = React.useState('applepay');
  const [ship, setShip] = React.useState('standard');
  const [placed, setPlaced] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [selectedAddrIdx, setSelectedAddrIdx] = React.useState(0);
  const [showAddrBook, setShowAddrBook] = React.useState(false);
  const addr = SAVED_ADDRESSES[selectedAddrIdx];

  const shipCost = item.shipping || 0;
  const expedited = ship === 'express' ? 9.99 : shipCost;
  const protection = +(item.price * 0.015 + 0.5).toFixed(2);
  const tax = 0;
  const total = +(item.price + expedited + protection).toFixed(2);
  const orderNo = 'CC-' + (8200000 + Math.floor((item.price * 137) % 99999));

  function place() {
    setWorking(true);
    setTimeout(() => { setWorking(false); app.clearCart(); setPlaced(true); }, 1100);
  }

  if (placed) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TC.bg }}>
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '90px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconC.check({ width: 44, height: 44 })}</div>
          <h2 style={{ margin: '20px 0 4px', fontFamily: TC.sans, fontWeight: 800, fontSize: 25, letterSpacing: -0.5 }}>Order confirmed</h2>
          <div style={{ fontFamily: TC.sans, fontSize: 13, color: TC.muted }}>{orderNo}</div>
          <div style={{ background: TC.surface, borderRadius: 4, padding: 16, marginTop: 22, textAlign: 'left', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ background: TC.surface2, borderRadius: 10, padding: 8 }}><CardArtC item={item} w={56} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 15 }}>{item.name}</div>
              <div style={{ fontFamily: TC.sans, fontSize: 12.5, color: TC.muted }}>from {item.seller}</div>
              <div style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{moneyC(total)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-wash)', color: 'var(--ink)', borderRadius: 4, padding: '13px 14px', marginTop: 14, textAlign: 'left' }}>
            {IconC.truck({})}
            <span style={{ fontFamily: TC.sans, fontSize: 13.5, fontWeight: 600 }}>Arriving {ship==='express'?'Wed, Jun 11':'Mon, Jun 16'} · tracked & insured</span>
          </div>
        </div>
        <div style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--line)', background: TC.surface }}>
          <button onClick={() => { app.nav.setTab('home'); }} style={{ width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 4, padding: 16, fontFamily: TC.sans, fontWeight: 700, fontSize: 16 }}>Keep browsing</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TC.bg, animation: 'ccPushIn 0.26s ease' }}>
      {/* header */}
      <div style={{ padding: '14px 16px 12px', background: TC.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TC.ink }}>{IconC.back({})}</button>
        <span style={{ fontFamily: TC.sans, fontWeight: 800, fontSize: 18 }}>Checkout</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 16px' }}>
        {/* item */}
        <div style={{ background: TC.surface, borderRadius: 4, padding: 14, display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ background: TC.surface2, borderRadius: 10, padding: 8 }}><CardArtC item={item} w={58} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 4 }}><GradeChipC grade={item.grade} /></div>
            <div style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ fontFamily: TC.sans, fontSize: 12, color: TC.muted }}>{setByIdC(item.set)?.name} · {item.seller}</div>
          </div>
          <div style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 17 }}>{moneyC(item.price)}</div>
        </div>

        {/* address */}
        <div style={{ marginTop: 20, marginBottom: 9, fontFamily: TC.sans, fontWeight: 800, fontSize: 14, color: TC.ink2 }}>Ship to</div>
        <button onClick={() => setShowAddrBook(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: TC.surface, borderRadius: 4, padding: '13px 14px', textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TC.sans, fontWeight: 800, flexShrink: 0 }}>{addr.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 14.5 }}>{addr.name}</span>
              {addr.isDefault && <span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 10, color: 'var(--ink)', background: 'var(--accent-wash)', borderRadius: 4, padding: '2px 6px' }}>Default</span>}
            </div>
            <div style={{ fontFamily: TC.sans, fontSize: 12.5, color: TC.muted }}>{addr.line1}, {addr.city}, {addr.postcode}</div>
          </div>
          {IconC.chevron({ style: { color: TC.faint } })}
        </button>

        {/* delivery */}
        <div style={{ marginTop: 20, marginBottom: 9, fontFamily: TC.sans, fontWeight: 800, fontSize: 14, color: TC.ink2 }}>Delivery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <SelectRow on={ship==='standard'} onClick={() => setShip('standard')} title="Royal Mail Tracked (2–3 days)"
            sub="Arrives Mon, Jun 16" trailing={<span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 14, color: shipCost===0?TC.up:TC.ink }}>{shipCost===0?'Free':moneyC(shipCost)}</span>} />
          <SelectRow on={ship==='express'} onClick={() => setShip('express')} title="Royal Mail Special Delivery (Next day)"
            sub="Arrives Wed, Jun 11" trailing={<span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 14 }}>{moneyC(9.99)}</span>} />
        </div>

        {/* payment */}
        <div style={{ marginTop: 20, marginBottom: 9, fontFamily: TC.sans, fontWeight: 800, fontSize: 14, color: TC.ink2 }}>Payment</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <SelectRow on={pay==='applepay'} onClick={() => setPay('applepay')} title=" Pay" sub="Default · Face ID" />
          <SelectRow on={pay==='card'} onClick={() => setPay('card')} title="Card ending •••• 4242" sub="Expires 08/27" />
        </div>

        {/* protection */}
        <div style={{ marginTop: 16, background: 'var(--up-wash)', borderRadius: 4, padding: '13px 14px' }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ color: TC.up, marginTop: 1 }}>{IconC.shield({})}</span>
            <div style={{ fontFamily: TC.sans, fontSize: 12.5, color: TC.ink2, lineHeight: 1.45 }}>
              <b>Buyer Protection included.</b> Full refund if your card doesn't arrive or isn\'t as described. Graded slabs are authenticity-verified.
            </div>
          </div>
          <div style={{ marginTop: 8, paddingLeft: 33, fontFamily: TC.sans, fontSize: 11, color: TC.faint, lineHeight: 1.5 }}>
            Covers: item not received, item not as described, counterfeits. Protection fee: 1.5% + 50p (capped at £15). Claims reviewed within 48 hours.
          </div>
        </div>

        {/* totals */}
        <div style={{ marginTop: 20, background: TC.surface, borderRadius: 4, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {[['Item', moneyC(item.price)], ['Delivery', expedited===0?'Free':moneyC(expedited)], ['Buyer Protection', moneyC(protection)], ['VAT (included)', moneyC(0)]].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: TC.sans, fontSize: 14, color: TC.ink2 }}>
              <span style={{ color: TC.muted }}>{k}</span><span style={{ fontFamily: TC.sans, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--line-2)', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: TC.sans, fontWeight: 800, fontSize: 16 }}>Total</span>
            <span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 22 }}>{moneyC(total)}</span>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
        <button onClick={place} disabled={working} style={{ width: '100%', background: pay==='applepay'?'var(--fill)':TC.accent, color: '#fff', borderRadius: 4,
          padding: 16, fontFamily: TC.sans, fontWeight: 700, fontSize: 16.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
          {working ? 'Processing…' : pay==='applepay' ? <React.Fragment><span style={{ fontSize: 19 }}></span> Pay · {moneyC(total)}</React.Fragment> : 'Place order · ' + moneyC(total)}
        </button>
      </div>

      <SheetC open={showAddrBook} onClose={() => setShowAddrBook(false)} title="Delivery address">
        <div style={{ padding: '8px 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAVED_ADDRESSES.map((a, i) => (
            <button key={i} onClick={() => { setSelectedAddrIdx(i); setShowAddrBook(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                padding: '13px 14px', background: 'var(--surface)', borderRadius: 4,
                boxShadow: selectedAddrIdx === i ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                background: selectedAddrIdx === i ? 'var(--accent)' : 'transparent',
                boxShadow: selectedAddrIdx === i ? 'none' : 'inset 0 0 0 2px var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedAddrIdx === i && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 14.5 }}>{a.name}</span>
                  {a.isDefault && <span style={{ fontFamily: TC.sans, fontWeight: 700, fontSize: 10, color: 'var(--ink)', background: 'var(--accent-wash)', borderRadius: 4, padding: '2px 6px' }}>Default</span>}
                </div>
                <div style={{ fontFamily: TC.sans, fontSize: 12.5, color: TC.muted, marginTop: 1 }}>{a.line1}, {a.city}, {a.postcode}</div>
              </div>
              {selectedAddrIdx === i && <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{IconC.check({ width: 20, height: 20 })}</span>}
            </button>
          ))}
          <button onClick={() => { setShowAddrBook(false); app.toast('Address form coming soon'); }}
            style={{ width: '100%', padding: '13px 14px', borderRadius: 4, background: 'transparent',
              boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TC.sans, fontWeight: 700,
              fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            + Add new address
          </button>
        </div>
      </SheetC>
    </div>
  );
}

Object.assign(window, { CheckoutScreen, SelectRow, Radio });
