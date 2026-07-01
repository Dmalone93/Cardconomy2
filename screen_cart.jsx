// ─────────────────────────────────────────────────────────────
// Cart / basket
// ─────────────────────────────────────────────────────────────
const { T: TCart, money: moneyCart, Icon: IconCart, CardArt: CardArtCart, GradeChip: GradeChipCart, Container: ContainerCart } = window;
const { byId: byIdCart, setById: setByIdCart } = window;

function CartScreen({ app }) {
  const [placed, setPlaced] = React.useState(false);
  const items = app.cart.map(id => byIdCart(id)).filter(Boolean);
  const subtotal = items.reduce((s, c) => s + c.price, 0);
  const shipping = items.length ? Math.max(...items.map(c => c.shipping || 0)) : 0; // combined shipping
  const protection = +(subtotal * 0.015 + (items.length ? 0.5 : 0)).toFixed(2);
  const total = +(subtotal + shipping + protection).toFixed(2);
  const sellers = [...new Set(items.map(c => c.seller))];

  if (placed) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TCart.bg }}>
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '90px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconCart.check({ width: 44, height: 44 })}</div>
          <h2 style={{ margin: '20px 0 4px', fontFamily: TCart.sans, fontWeight: 700, fontSize: 25, letterSpacing: -0.5 }}>Order confirmed</h2>
          <p style={{ fontFamily: TCart.sans, fontSize: 14, color: TCart.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 280 }}>
            {items.length} card{items.length !== 1 ? 's' : ''} from {sellers.length} seller{sellers.length !== 1 ? 's' : ''} on the way. We\u2019ll text tracking as each ships.
          </p>
          <div style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 18, marginTop: 16 }}>{moneyCart(total)}</div>
        </div>
        <div style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--line)', background: TCart.surface }}>
          <button onClick={() => { app.clearCart(); app.nav.setTab('home'); }} style={{ width: '100%', background: TCart.accent, color: '#fff', borderRadius: 4, padding: 16, fontFamily: TCart.sans, fontWeight: 700, fontSize: 16 }}>Keep browsing</button>
        </div>
      </div>
    );
  }

  const orderSummary = (
    <div style={{ background: TCart.surface, borderRadius: 4, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
      {[['Subtotal', moneyCart(subtotal)], ['Postage', shipping === 0 ? 'Free' : moneyCart(shipping)], ['Buyer Protection', moneyCart(protection)]].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: TCart.sans, fontSize: 14, color: TCart.ink2 }}>
          <span style={{ color: TCart.muted }}>{k}</span><span style={{ fontFamily: TCart.sans, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--line-2)', margin: '8px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 16 }}>Total</span>
        <span style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 22 }}>{moneyCart(total)}</span>
      </div>
      {app.isDesktop && (
        <button onClick={() => { if (items.length > 0) { app.nav.push('checkout', { id: items[0].id }); } }} style={{ width: '100%', background: TCart.accent, color: '#fff', borderRadius: 4, padding: 16, marginTop: 16,
          fontFamily: TCart.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
          Checkout \u00B7 {moneyCart(total)}
        </button>
      )}
    </div>
  );

  const cartItems = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(c => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: TCart.surface, borderRadius: 4, padding: 10, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <button onClick={() => app.nav.push('listing', { id: c.id })} style={{ background: TCart.surface2, borderRadius: 9, padding: 6, flexShrink: 0 }}><CardArtCart item={c} w={46} radius={6} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 3 }}><GradeChipCart grade={c.grade} /></div>
            <div style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
            <div style={{ fontFamily: TCart.sans, fontSize: 11.5, color: TCart.muted }}>{c.seller} \u00B7 {c.shipping === 0 ? 'Free postage' : moneyCart(c.shipping) + ' postage'}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 15 }}>{moneyCart(c.price)}</div>
            <button onClick={() => app.removeFromCart(c.id)} style={{ fontFamily: TCart.sans, fontSize: 11.5, fontWeight: 600, color: TCart.down, marginTop: 2 }}>Remove</button>
          </div>
        </div>
      ))}
      {sellers.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, background: 'var(--accent-wash)', borderRadius: 4, padding: '11px 13px' }}>
          <span style={{ color: TCart.accent }}>{IconCart.truck({ width: 16, height: 16 })}</span>
          <span style={{ fontFamily: TCart.sans, fontSize: 12.5, color: TCart.ink2, lineHeight: 1.4 }}>Items ship from {sellers.length} sellers \u2014 you\u2019ll get separate tracking for each.</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TCart.bg }}>
      <div style={{ padding: '14px 16px 12px', background: TCart.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TCart.ink }}>{IconCart.back({})}</button>
        <span style={{ fontFamily: TCart.sans, fontWeight: 700, fontSize: 18, flex: 1 }}>Your cart</span>
        <span style={{ fontFamily: TCart.sans, fontSize: 13, color: TCart.muted }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: TCart.surface, color: TCart.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>{IconCart.cart({ width: 34, height: 34 })}</div>
          <h3 style={{ margin: '16px 0 4px', fontFamily: TCart.sans, fontWeight: 700, fontSize: 19 }}>Your cart is empty</h3>
          <p style={{ fontFamily: TCart.sans, fontSize: 14, color: TCart.muted, lineHeight: 1.5, maxWidth: 260, margin: '0 0 18px' }}>Add cards from any Buy It Now listing \u2014 combine multiple into one order.</p>
          <button onClick={() => app.nav.setTab('home')} style={{ background: TCart.accent, color: '#fff', borderRadius: 4, padding: '12px 24px', fontFamily: TCart.sans, fontWeight: 700, fontSize: 15 }}>Browse cards</button>
        </div>
      ) : (
        <React.Fragment>
          {app.isDesktop ? (
            <div className="noscroll" style={{ flex: 1, overflow: 'auto' }}>
              <ContainerCart width={1080}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, padding: '24px 0' }}>
                  <div>{cartItems}</div>
                  <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>{orderSummary}</div>
                </div>
              </ContainerCart>
            </div>
          ) : (
            <React.Fragment>
              <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '14px 16px 16px' }}>
                {cartItems}
                <div style={{ marginTop: 16 }}>{orderSummary}</div>
              </div>
              <div style={{ padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
                <button onClick={() => { if (items.length > 0) { app.nav.push('checkout', { id: items[0].id }); } }} style={{ width: '100%', background: TCart.accent, color: '#fff', borderRadius: 4, padding: 16,
                  fontFamily: TCart.sans, fontWeight: 700, fontSize: 16.5, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
                  Checkout \u00B7 {moneyCart(total)}
                </button>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { CartScreen });
