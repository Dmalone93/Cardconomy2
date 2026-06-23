// ─────────────────────────────────────────────────────────────
// Order Tracking
// ─────────────────────────────────────────────────────────────
const { T: TK, money: moneyTK, Icon: IconTK } = window;

const TRACKING_ORDER = {
  orderNumber: 'CC-20260619-4827',
  date: '19 Jun 2026',
  itemCount: 1,
  item: {
    name: 'Charizard ex 223/165',
    set: '151 (SV3.5)',
    condition: 'Near Mint',
    seller: 'CardKing',
    price: 38.50,
  },
  shipping: {
    carrier: 'Royal Mail Tracked 24',
    trackingNumber: 'RM 2719 4833 8GB',
    estimatedDelivery: '21 Jun 2026',
  },
  steps: [
    { label: 'Order placed', detail: '19 Jun, 14:32', done: true },
    { label: 'Payment confirmed', detail: '19 Jun, 14:33', done: true },
    { label: 'Seller shipped', detail: 'Tracking: RM 2719 4833 8GB', done: true },
    { label: 'In transit', detail: 'Last scanned: Birmingham depot', done: true, current: true },
    { label: 'Out for delivery', detail: '', done: false },
    { label: 'Delivered', detail: '', done: false },
  ],
};

function TrackingScreen({ app }) {
  var order = TRACKING_ORDER;
  var steps = order.steps;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TK.bg }}>
      {/* sticky header */}
      <div style={{
        padding: '14px 14px 12px', background: TK.surface, borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={function() { app.nav.pop(); }} style={{ color: TK.ink, display: 'flex' }}>{IconTK.back({})}</button>
        <span style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 18 }}>Order Tracking</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>

        {/* order summary */}
        <div style={{
          background: TK.surface, borderRadius: 16, padding: 16, marginBottom: 14,
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <div style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TK.muted, textTransform: 'uppercase', marginBottom: 8 }}>Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: TK.sans, fontWeight: 700, fontSize: 15 }}>{order.orderNumber}</div>
              <div style={{ fontFamily: TK.sans, fontSize: 13, color: TK.muted, marginTop: 2 }}>
                {order.date} {'\u00B7'} {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
              </div>
            </div>
            <span style={{
              background: '#3b82f622', color: '#3b82f6', borderRadius: 999,
              padding: '4px 12px', fontFamily: TK.sans, fontWeight: 700, fontSize: 12,
            }}>In transit</span>
          </div>
        </div>

        {/* timeline / stepper */}
        <div style={{
          background: TK.surface, borderRadius: 16, padding: '18px 16px', marginBottom: 14,
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <div style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TK.muted, textTransform: 'uppercase', marginBottom: 14 }}>Status</div>
          {steps.map(function(step, i) {
            var isLast = i === steps.length - 1;
            var dotColor = step.done
              ? (step.current ? '#3b82f6' : '#22c55e')
              : TK.faint;
            var lineColor = step.done && !step.current ? '#22c55e' : 'var(--line)';
            return (
              <div key={i} style={{ display: 'flex', gap: 14, minHeight: isLast ? 'auto' : 44 }}>
                {/* dot + line column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                  {/* dot */}
                  <div style={{
                    width: step.current ? 20 : 14, height: step.current ? 20 : 14,
                    borderRadius: 999,
                    background: step.done ? dotColor : 'transparent',
                    border: step.done ? 'none' : '2px solid ' + TK.faint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: step.current ? '0 0 0 4px rgba(59,130,246,0.18)' : 'none',
                    marginTop: step.current ? -3 : 0,
                  }}>
                    {step.done && !step.current && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {step.current && (
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />
                    )}
                  </div>
                  {/* line */}
                  {!isLast && (
                    <div style={{
                      width: 2, flex: 1, background: lineColor,
                      marginTop: 4, marginBottom: 4, borderRadius: 999,
                    }} />
                  )}
                </div>

                {/* text column */}
                <div style={{ paddingBottom: isLast ? 0 : 12, flex: 1 }}>
                  <div style={{
                    fontFamily: TK.sans, fontWeight: step.current ? 800 : 700,
                    fontSize: step.current ? 15 : 14,
                    color: step.done ? TK.ink : TK.faint,
                    marginTop: step.current ? -2 : 0,
                  }}>
                    {step.label}
                    {step.done && !step.current && ' \u2713'}
                  </div>
                  {step.detail && (
                    <div style={{
                      fontFamily: TK.sans, fontSize: 12, color: step.current ? '#3b82f6' : TK.muted,
                      marginTop: 2, fontWeight: step.current ? 600 : 400,
                    }}>{step.detail}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* shipping details */}
        <div style={{
          background: TK.surface, borderRadius: 16, padding: 16, marginBottom: 14,
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <div style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TK.muted, textTransform: 'uppercase', marginBottom: 10 }}>Shipping Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TK.sans, fontSize: 13, color: TK.muted }}>Carrier</span>
              <span style={{ fontFamily: TK.sans, fontWeight: 700, fontSize: 13 }}>{order.shipping.carrier}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TK.sans, fontSize: 13, color: TK.muted }}>Tracking number</span>
              <span style={{ fontFamily: TK.sans, fontWeight: 700, fontSize: 13, letterSpacing: 0.3 }}>{order.shipping.trackingNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TK.sans, fontSize: 13, color: TK.muted }}>Est. delivery</span>
              <span style={{ fontFamily: TK.sans, fontWeight: 700, fontSize: 13 }}>{order.shipping.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* item card */}
        <div style={{
          background: TK.surface, borderRadius: 16, padding: 16, marginBottom: 14,
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <div style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TK.muted, textTransform: 'uppercase', marginBottom: 10 }}>Item</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: TK.surface2 || 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>{'\uD83C\uDCCF'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TK.sans, fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.item.name}</div>
              <div style={{ fontFamily: TK.sans, fontSize: 12, color: TK.muted, marginTop: 2 }}>
                {order.item.set} {'\u00B7'} {order.item.condition}
              </div>
              <div style={{ fontFamily: TK.sans, fontSize: 12, color: TK.muted, marginTop: 1 }}>
                Sold by {order.item.seller}
              </div>
            </div>
            <div style={{ fontFamily: TK.sans, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
              {moneyTK(order.item.price)}
            </div>
          </div>
        </div>

        {/* report issue button */}
        <button
          onClick={function() { app.toast('Issue report sent'); }}
          style={{
            width: '100%', background: 'transparent', border: '1.5px solid var(--line)',
            borderRadius: 13, padding: 14,
            fontFamily: TK.sans, fontWeight: 700, fontSize: 15,
            color: '#ef4444', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
          Report an issue
        </button>

      </div>
    </div>
  );
}

Object.assign(window, { TrackingScreen: TrackingScreen });
