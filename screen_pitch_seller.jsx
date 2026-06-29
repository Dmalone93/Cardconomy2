// -----------------------------------------------------------------
// Seller pitch / landing page — "Sell your cards. Keep more."
// -----------------------------------------------------------------
const { T: TPS, money: moneyPS, Icon: IconPS, Logo: LogoPS } = window;

function SellerPitchScreen({ app }) {
  // ── SVG icons ──
  const iconBatch = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  const iconShop = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  const iconTrade = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 9h10l-3-3M17 15H7l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const iconScan = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  const iconChart = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 20h18M6 16V10M10 16V6M14 16V8M18 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  const iconWallet = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
      <path d="M2 9h20" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  // ── Fee data ──
  const fees = [
    { name: 'Cardconomy', pct: 6, highlight: true },
    { name: 'CardNexus', pct: 7.5, highlight: false },
    { name: 'Cardmarket', pct: 11, highlight: false },
    { name: 'eBay', pct: 12.8, highlight: false },
  ];
  const maxPct = 14;

  const features = [
    {
      icon: iconBatch,
      title: 'Batch list from your collection',
      desc: 'Select cards, auto-price, list 50 cards in 2 minutes. No more one-by-one.',
    },
    {
      icon: iconShop,
      title: 'Sell to a local shop',
      desc: 'Walk your cards in, walk out with cash. No packaging, no postage.',
    },
    {
      icon: iconTrade,
      title: 'Trade card-for-card',
      desc: 'Swap directly with collectors near you. No cash needed.',
    },
  ];

  const steps = [
    { num: '1', title: 'Add your cards', desc: 'Scan, search, or import a CSV', icon: iconScan },
    { num: '2', title: 'Set your price', desc: 'We suggest prices from live market data', icon: iconChart },
    { num: '3', title: 'Get paid', desc: 'Ship to buyers or sell in-person to a local shop', icon: iconWallet },
  ];

  const stats = [
    { value: '12,000+', label: 'cards listed this week' },
    { value: '94p', label: 'of every \xA31 goes to sellers' },
    { value: '4.8', label: 'avg seller rating' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: TPS.bg }}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10, flexShrink: 0,
        background: TPS.surface, borderBottom: '1px solid var(--line)' }}>
        <button onClick={() => app.nav.pop()} style={{ color: TPS.ink, background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ fontFamily: TPS.sans, fontWeight: 700, fontSize: 16, color: TPS.ink }}>Sell on Cardconomy</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ═══════════════ HERO ═══════════════ */}
        <div style={{ background: 'var(--fill)', color: '#fff', padding: '36px 20px 40px', textAlign: 'center' }}>
          {LogoPS && <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}><LogoPS size={32} color="#fff" /></div>}
          <h1 style={{ margin: 0, fontFamily: TPS.heading, fontWeight: 900, fontSize: 28, lineHeight: 1.15, letterSpacing: -0.8 }}>
            Sell your cards.<br/>Keep more.
          </h1>
          <p style={{ margin: '12px auto 0', fontFamily: TPS.sans, fontSize: 15, lineHeight: 1.55, opacity: 0.85, maxWidth: 320 }}>
            The lowest fees in the UK. List in seconds with live market pricing.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
            <button onClick={() => app.nav.setTab('sell')} style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: '#fff', color: 'var(--ink)', fontFamily: TPS.sans,
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>Start listing</button>
            <button onClick={() => app.nav.push('howitworks')} style={{
              padding: '12px 24px', borderRadius: 10,
              background: 'transparent', color: '#fff', fontFamily: TPS.sans,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}>See how it works</button>
          </div>
        </div>

        {/* ═══════════════ FEE COMPARISON ═══════════════ */}
        <div style={{ padding: '28px 16px' }}>
          <div style={{ background: TPS.surface, borderRadius: 16, padding: '22px 18px',
            boxShadow: '0 1px 4px rgba(20,24,40,0.06)' }}>
            <h2 style={{ margin: '0 0 6px', fontFamily: TPS.heading, fontWeight: 700, fontSize: 18, color: TPS.ink, letterSpacing: -0.3 }}>
              Compare the fees
            </h2>
            <p style={{ margin: '0 0 18px', fontFamily: TPS.sans, fontSize: 13, color: TPS.muted, lineHeight: 1.5 }}>
              Total cost per sale (seller + buyer fees combined)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fees.map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 80, fontFamily: TPS.sans, fontSize: 12.5, fontWeight: f.highlight ? 700 : 500,
                    color: f.highlight ? TPS.ink : TPS.muted, textAlign: 'right', flexShrink: 0 }}>
                    {f.name}
                  </div>
                  <div style={{ flex: 1, height: 26, background: 'var(--line)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%', borderRadius: 6,
                      width: (f.pct / maxPct * 100) + '%',
                      background: f.highlight ? 'var(--ink)' : 'var(--muted)',
                      opacity: f.highlight ? 1 : 0.35,
                      transition: 'width 0.6s ease',
                    }} />
                    <span style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      fontFamily: TPS.mono, fontSize: 11, fontWeight: 700,
                      color: f.highlight ? TPS.ink : TPS.muted,
                    }}>
                      {f.pct}%{f.name === 'Cardconomy' ? '+30p' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Callout */}
            <div style={{
              marginTop: 16, padding: '12px 14px', borderRadius: 10,
              background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.82 20 12 16.77 7.18 20l1.64-6.73L3.82 9l6.09-.74L12 2z" fill="var(--accent)" />
              </svg>
              <span style={{ fontFamily: TPS.sans, fontSize: 13, fontWeight: 700, color: TPS.ink }}>
                {"Save £6.50 on every £100"}
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════ FEATURE CARDS ═══════════════ */}
        <div style={{ padding: '0 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: TPS.surface, borderRadius: 14, padding: '18px 16px',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 13, background: 'var(--ink)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{f.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TPS.sans, fontWeight: 700, fontSize: 15, color: TPS.ink, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontFamily: TPS.sans, fontSize: 13, color: TPS.muted, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <div style={{ padding: '0 16px 28px' }}>
          <h2 style={{ margin: '0 0 16px', fontFamily: TPS.heading, fontWeight: 700, fontSize: 18, color: TPS.ink, letterSpacing: -0.3 }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            {/* vertical connector line */}
            <div style={{
              position: 'absolute', left: 23, top: 28, bottom: 28, width: 2,
              background: 'var(--line)', zIndex: 0,
            }} />
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, background: TPS.surface,
                  border: '2px solid var(--ink)', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: TPS.heading, fontWeight: 900, fontSize: 18,
                }}>{s.num}</div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontFamily: TPS.sans, fontWeight: 700, fontSize: 15, color: TPS.ink }}>{s.title}</div>
                  <div style={{ fontFamily: TPS.sans, fontSize: 13, color: TPS.muted, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
        <div style={{ background: 'var(--fill)', padding: '28px 16px', display: 'flex', gap: 8 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '14px 6px',
              background: 'rgba(255,255,255,0.08)', borderRadius: 12,
            }}>
              <div style={{ fontFamily: TPS.heading, fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontFamily: TPS.sans, fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 1.35 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══════════════ BOTTOM CTA ═══════════════ */}
        <div style={{ padding: '32px 20px 40px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px', fontFamily: TPS.heading, fontWeight: 700, fontSize: 22, color: TPS.ink, letterSpacing: -0.4 }}>
            Ready to sell?
          </h2>
          <p style={{ margin: '0 0 20px', fontFamily: TPS.sans, fontSize: 14, color: TPS.muted }}>
            Your first listing takes under a minute.
          </p>
          <button onClick={() => app.nav.setTab('sell')} style={{
            width: '100%', maxWidth: 320, padding: '15px 24px', borderRadius: 12, border: 'none',
            background: 'var(--ink)', color: '#fff', fontFamily: TPS.sans,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>List your first card</button>
        </div>

      </div>
    </div>
  );
}

window.SellerPitchScreen = SellerPitchScreen;
