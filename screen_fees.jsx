// ─────────────────────────────────────────────────────────────
// Fee comparison page
// ─────────────────────────────────────────────────────────────
const { T: TFE, money: moneyFE, SliderInput: SliderInputFE } = window;
const FEE_ICONS = { back: '\u2190', shield: '\u26E8', bolt: '\u26A1', check: '\u2713' };

function FeesScreen({ app }) {
  const [salePrice, setSalePrice] = React.useState(25);
  const shipping = 2.50;

  // Fee calculations
  const platforms = [
    {
      name: 'Cardconomy',
      accent: TFE.accent,
      highlight: true,
      sellerPct: 0.04,
      buyerPct: 0.02,
      buyerFixed: 0.30,
      paymentPct: 0,
      paymentFixed: 0,
      trusteePct: 0,
      note: 'All-in pricing, no hidden fees',
    },
    {
      name: 'CardNexus',
      accent: '#7c4dd1',
      sellerPct: 0.05,
      buyerPct: 0.025,
      buyerFixed: 0.25, // ~\u20AC0.30 in GBP
      paymentPct: 0,
      paymentFixed: 0,
      trusteePct: 0,
      note: 'EU-focused, fees in euros',
    },
    {
      name: 'Cardmarket',
      accent: '#1f8fd6',
      sellerPct: 0.05,
      buyerPct: 0,
      buyerFixed: 0,
      paymentPct: 0.05,
      paymentFixed: 0.30,
      trusteePct: 0.01,
      note: 'Card payment adds ~6% to buyer',
    },
    {
      name: 'eBay',
      accent: '#e53935',
      sellerPct: 0.128,
      buyerPct: 0,
      buyerFixed: 0,
      paymentPct: 0,
      paymentFixed: 0.30,
      trusteePct: 0,
      note: 'High seller fee, no buyer fee',
    },
  ];

  function calcFees(p, price, ship) {
    const sellerFee = price * p.sellerPct;
    const buyerFee = price * p.buyerPct + p.buyerFixed;
    const paymentFee = price * p.paymentPct + p.paymentFixed;
    const trusteeFee = price * p.trusteePct;
    const total = sellerFee + buyerFee + paymentFee + trusteeFee;
    return { sellerFee, buyerFee, paymentFee, trusteeFee, total };
  }

  const cardonomyFees = calcFees(platforms[0], salePrice, shipping);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: TFE.bg }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10, flexShrink: 0 }}>
        <div onClick={() => app.nav.pop()} style={{ cursor: 'pointer', padding: 4 }}>
          <span style={{ fontSize: 20 }}>{FEE_ICONS.back}</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: TFE.ink }}>Fees</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {/* ── Hero ── */}
      <div style={{ padding: '20px 14px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TFE.ink, lineHeight: 1.2 }}>
          See what you actually pay
        </div>
        <div style={{ fontSize: 14, color: TFE.muted, marginTop: 8, lineHeight: 1.5 }}>
          Transparent fees. No hidden charges. Compare us to anyone.
        </div>
      </div>

      {/* ── Big number ── */}
      <div style={{ margin: '0 14px', padding: '20px', borderRadius: 14,
        background: TFE.accentWash, border: '2px solid ' + TFE.accent, textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: TFE.accent }}>6% + 30p</div>
        <div style={{ fontSize: 13, color: TFE.ink, marginTop: 6 }}>
          4% seller fee + 2% buyer fee + 30p per transaction
        </div>
        <div style={{ fontSize: 12, color: TFE.muted, marginTop: 4 }}>
          The lowest total take rate in the TCG market
        </div>
      </div>

      {/* ── Calculator ── */}
      <div style={{ margin: '20px 14px', padding: '16px', borderRadius: 14,
        background: TFE.surface, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 12 }}>
          Fee Calculator
        </div>
        <div style={{ marginBottom: 12 }}>
          <SliderInputFE value={salePrice} onChange={setSalePrice} min={1} max={500}
            label="Sale price" format={v => moneyFE(v)} />
        </div>

        {/* ── Platform comparison cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {platforms.map(p => {
            const fees = calcFees(p, salePrice, shipping);
            const savings = fees.total - cardonomyFees.total;
            return (
              <div key={p.name} style={{
                padding: '12px', borderRadius: 10,
                background: p.highlight ? TFE.accentWash : TFE.surface2,
                border: p.highlight ? '2px solid ' + TFE.accent : '1px solid ' + TFE.line,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.highlight ? TFE.accent : TFE.ink }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: p.highlight ? TFE.accent : TFE.ink }}>
                    {moneyFE(fees.total)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: TFE.muted }}>
                  <span>Seller: {moneyFE(fees.sellerFee)}</span>
                  <span>Buyer: {moneyFE(fees.buyerFee)}</span>
                  {fees.paymentFee > 0 && <span>Payment: {moneyFE(fees.paymentFee)}</span>}
                  {fees.trusteeFee > 0 && <span>Trustee: {moneyFE(fees.trusteeFee)}</span>}
                </div>
                {!p.highlight && savings > 0 && (
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: TFE.up }}>
                    Save {moneyFE(savings)} with Cardconomy
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: TFE.faint, marginTop: 10, lineHeight: 1.4 }}>
          Assumes card payment. Cardmarket includes Instant Credit (5%) + Trustee (1%).
          CardNexus fees converted from EUR at approximate rate. Shipping: \u00A3{shipping.toFixed(2)}.
        </div>
      </div>

      {/* ── Full breakdown table ── */}
      <div style={{ margin: '0 14px 20px', padding: '16px', borderRadius: 14,
        background: TFE.surface, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 12 }}>
          Full Fee Breakdown
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid ' + TFE.line }}>
              <th style={{ textAlign: 'left', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}></th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.accent, fontWeight: 700 }}>Cardconomy</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>CardNexus</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>Cardmarket</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', color: TFE.muted, fontWeight: 600 }}>eBay</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Seller fee', '4%', '5%', '5%', '12.8%'],
              ['Buyer fee', '2% + 30p', '2.5% + 25p', '\u2014', '\u2014'],
              ['Payment', 'Included', 'Included', '5% + 30p', 'Included'],
              ['Trustee', 'Included', 'Included', '1%', '\u2014'],
              ['Total', '6% + 30p', '~7.5% + 25p', '~11% + 30p', '~12.8% + 30p'],
            ].map(([label, ...vals], i) => (
              <tr key={i} style={{ borderBottom: '1px solid ' + TFE.line }}>
                <td style={{ padding: '8px 4px', color: TFE.ink, fontWeight: i === 4 ? 700 : 400 }}>{label}</td>
                {vals.map((v, j) => (
                  <td key={j} style={{ textAlign: 'right', padding: '8px 4px',
                    color: j === 0 ? TFE.accent : TFE.ink, fontWeight: i === 4 ? 700 : 400 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── What\u2019s included ── */}
      <div style={{ margin: '0 14px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TFE.ink, marginBottom: 10 }}>
          What\u2019s included
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['shield', 'Buyer Protection', 'Every purchase is covered. If something goes wrong, we have your back.'],
            ['bolt', 'Payment Processing', 'Card payments included in the fee. No surprise charges at checkout.'],
            ['check', 'No Hidden Fees', 'What you see is what you pay. No renamed surcharges or wallet top-ups.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 12, padding: '14px',
              borderRadius: 12, background: TFE.surface }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: TFE.accentWash,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>{FEE_ICONS[icon] || '\u2022'}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TFE.ink }}>{title}</div>
                <div style={{ fontSize: 12, color: TFE.muted, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '0 14px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => app.nav.setTab('sell')} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: TFE.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Start selling for less</button>
        <button onClick={() => app.nav.setTab('search')} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: TFE.surface, color: TFE.accent, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          border: '1px solid ' + TFE.line,
        }}>Browse the marketplace</button>
      </div>
      </div>{/* end scroll wrapper */}
    </div>
  );
}

window.FeesScreen = FeesScreen;
