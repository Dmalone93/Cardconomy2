// -----------------------------------------------------------------
// LGS pitch / landing page — "Your shop, online."
// -----------------------------------------------------------------
const { T: TPL, money: moneyPL, Icon: IconPL, Logo: LogoPL } = window;

function LGSPitchScreen({ app }) {
  // ── SVG icons ──
  const iconDealFlow = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M17 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const iconStorefront = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M4 9l1-4h14l1 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  const iconFree = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const iconClipboard = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 7h6M9 11h6M9 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  const iconSliders = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="8" r="2" fill="currentColor"/>
      <circle cx="15" cy="16" r="2" fill="currentColor"/>
    </svg>
  );
  const iconInbox = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 14l3-8h12l3 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M3 14v5a1 1 0 001 1h16a1 1 0 001-1v-5H16l-1.5 2h-5L8 14H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  const iconStar = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.82 20 12 16.77 7.18 20l1.64-6.73L3.82 9l6.09-.74L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );

  const valueProps = [
    {
      icon: iconDealFlow,
      title: 'Free deal flow',
      desc: 'Local sellers submit cards to your counter through the app. You set the buy rates.',
    },
    {
      icon: iconStorefront,
      title: 'Digital storefront',
      desc: 'Your shop profile, inventory, reviews, and buylist \u2014 visible to every collector in your area.',
    },
    {
      icon: iconFree,
      title: 'Zero fees during early access',
      desc: 'No platform fees, no listing fees, no commission. Free until we launch publicly.',
    },
  ];

  const steps = [
    { num: '1', title: 'Enrol in 2 minutes', desc: 'Name, postcode, games you buy', icon: iconClipboard },
    { num: '2', title: 'Set your buy rates', desc: 'Choose what you pay for each condition', icon: iconSliders },
    { num: '3', title: 'Receive submissions', desc: 'Sellers bring cards to your counter', icon: iconInbox },
    { num: '4', title: 'Grade, offer, sell', desc: 'You grade the cards, make offers, and resell online', icon: iconStar },
  ];

  const shopStats = [
    { value: '12', label: 'shops enrolled' },
    { value: '4.8', label: 'avg rating' },
    { value: '\xA30', label: 'platform fees' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: TPL.bg }}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10, flexShrink: 0,
        background: TPL.surface, borderBottom: '1px solid var(--line)' }}>
        <button onClick={() => app.nav.pop()} style={{ color: TPL.ink, background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ fontFamily: TPL.sans, fontWeight: 700, fontSize: 16, color: TPL.ink }}>For local game shops</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ═══════════════ HERO ═══════════════ */}
        <div style={{ background: 'var(--fill)', color: '#fff', padding: '36px 20px 40px', textAlign: 'center' }}>
          {LogoPL && <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}><LogoPL size={32} color="#fff" /></div>}
          <h1 style={{ margin: 0, fontFamily: TPL.heading, fontWeight: 900, fontSize: 28, lineHeight: 1.15, letterSpacing: -0.8 }}>
            Your shop, online.
          </h1>
          <p style={{ margin: '12px auto 0', fontFamily: TPL.sans, fontSize: 15, lineHeight: 1.55, opacity: 0.85, maxWidth: 320 }}>
            Free digital storefront. Receive cards from local sellers. Reach collectors nationwide.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
            <button onClick={() => app.nav.push('enroll_shop')} style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: '#fff', color: 'var(--ink)', fontFamily: TPL.sans,
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>Enrol your shop</button>
            <button onClick={() => app.nav.push('shop')} style={{
              padding: '12px 24px', borderRadius: 10,
              background: 'transparent', color: '#fff', fontFamily: TPL.sans,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}>See a demo</button>
          </div>
        </div>

        {/* ═══════════════ VALUE PROPS ═══════════════ */}
        <div style={{ padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {valueProps.map((v, i) => (
            <div key={i} style={{
              background: TPL.surface, borderRadius: 16, padding: '22px 18px',
              boxShadow: '0 2px 8px rgba(20,24,40,0.06)', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 15, background: 'var(--ink)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{v.icon}</div>
              <div>
                <div style={{ fontFamily: TPL.sans, fontWeight: 800, fontSize: 17, color: TPL.ink, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontFamily: TPL.sans, fontSize: 14, color: TPL.muted, lineHeight: 1.55 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <div style={{ padding: '0 16px 28px' }}>
          <h2 style={{ margin: '0 0 16px', fontFamily: TPL.heading, fontWeight: 800, fontSize: 18, color: TPL.ink, letterSpacing: -0.3 }}>
            How it works for shops
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
                  width: 46, height: 46, borderRadius: 13, background: TPL.surface,
                  border: '2px solid var(--ink)', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: TPL.heading, fontWeight: 900, fontSize: 18,
                }}>{s.num}</div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontFamily: TPL.sans, fontWeight: 700, fontSize: 15, color: TPL.ink }}>{s.title}</div>
                  <div style={{ fontFamily: TPL.sans, fontSize: 13, color: TPL.muted, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ STATS ═══════════════ */}
        <div style={{ background: 'var(--fill)', padding: '28px 16px', display: 'flex', gap: 8 }}>
          {shopStats.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '14px 6px',
              background: 'rgba(255,255,255,0.08)', borderRadius: 12,
            }}>
              <div style={{ fontFamily: TPL.heading, fontWeight: 900, fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontFamily: TPL.sans, fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 1.35 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══════════════ TESTIMONIAL ═══════════════ */}
        <div style={{ padding: '28px 16px' }}>
          <div style={{
            background: TPL.surface, borderRadius: 16, padding: '22px 18px',
            boxShadow: '0 1px 4px rgba(20,24,40,0.06)', position: 'relative',
          }}>
            {/* quote mark */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: 14, left: 14, opacity: 0.12 }}>
              <path d="M10 8H6a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V8zm10 0h-4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V8z" fill="currentColor"/>
            </svg>
            <p style={{
              margin: '0 0 14px', fontFamily: TPL.sans, fontSize: 14.5, fontStyle: 'italic',
              color: TPL.ink, lineHeight: 1.6, position: 'relative',
            }}>
              "We\u2019ve had 40 card submissions in our first week. The app brings sellers straight to our counter."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--gold)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: TPL.sans, fontWeight: 800, fontSize: 15,
              }}>G</div>
              <div>
                <div style={{ fontFamily: TPL.sans, fontWeight: 700, fontSize: 13, color: TPL.ink }}>The Gnome\u2019s Grotto</div>
                <div style={{ fontFamily: TPL.sans, fontSize: 12, color: TPL.muted }}>Manchester</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ BOTTOM CTA ═══════════════ */}
        <div style={{ padding: '8px 20px 40px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px', fontFamily: TPL.heading, fontWeight: 800, fontSize: 22, color: TPL.ink, letterSpacing: -0.4 }}>
            Join during early access
          </h2>
          <p style={{ margin: '0 0 20px', fontFamily: TPL.sans, fontSize: 14, color: TPL.muted }}>
            No fees, no commitment. Set up in 2 minutes.
          </p>
          <button onClick={() => app.nav.push('enroll_shop')} style={{
            width: '100%', maxWidth: 320, padding: '15px 24px', borderRadius: 12, border: 'none',
            background: 'var(--ink)', color: '#fff', fontFamily: TPL.sans,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>Enrol your shop \u2014 it\u2019s free</button>
        </div>

      </div>
    </div>
  );
}

window.LGSPitchScreen = LGSPitchScreen;
