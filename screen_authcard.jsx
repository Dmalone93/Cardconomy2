// ─────────────────────────────────────────────────────────────
// Cardonomy — Card Authentication (verify the card, not the person)
// For raw high-value cards: mail-in OR verify at a local shop →
// examined → a tamper-evident "Cardonomy Verified" seal on the listing.
// ─────────────────────────────────────────────────────────────
const { T: TAU, money: moneyAU, Icon: IconAU, CardArt: CardArtAU, byId: byIdAU, setById: setByIdAU } = window;

// reusable verified seal (shown on authenticated listings)
function AuthSeal({ size = 'sm' }) {
  const sm = size === 'sm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 6, fontFamily: TAU.sans, fontWeight: 700,
      fontSize: sm ? 10.5 : 12.5, color: 'var(--up)', background: 'var(--up-wash)', borderRadius: 7, padding: sm ? '2px 7px' : '4px 10px', whiteSpace: 'nowrap' }}>
      <svg width={sm ? 12 : 15} height={sm ? 12 : 15} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.3 14.5l.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.2L12 2z" fill="currentColor" opacity="0.16"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Cardonomy Verified
    </span>
  );
}

const AUTH_STEPS = ['Received', 'Authenticating', 'Verified & sealed'];

function AuthCardScreen({ app, params = {} }) {
  const item = params.id ? byIdAU(params.id) : null;
  const [phase, setPhase] = React.useState('intro'); // intro → method → submitted → status
  const [method, setMethod] = React.useState(null);   // 'mail' | 'shop'
  const [stage, setStage] = React.useState(0);
  const fee = item ? Math.max(8, Math.round(item.market * 0.03)) : 12;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAU.bg }}>
      <div style={{ padding: '14px 14px 12px', background: TAU.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => phase === 'intro' || phase === 'submitted' ? app.nav.pop() : setPhase('intro')} style={{ color: TAU.ink }}>{IconAU.back({})}</button>
        <span style={{ fontFamily: TAU.sans, fontWeight: 800, fontSize: 17 }}>Authenticate card</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '18px 16px 30px' }}>
        {/* card header */}
        {item && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: TAU.surface, borderRadius: 14, padding: 12, marginBottom: 16, boxShadow: 'var(--shadow-1)' }}>
            <div style={{ background: TAU.surface2, borderRadius: 9, padding: 6 }}><CardArtAU item={item} w={44} radius={6} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 14 }}>{item.name}</div>
              <div style={{ fontFamily: TAU.sans, fontSize: 11.5, color: TAU.muted }}>{setByIdAU(item.set)?.name} · market {moneyAU(item.market, { cents: false })}</div>
            </div>
          </div>
        )}

        {phase === 'intro' && (
          <div>
            <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 12px', borderRadius: 18, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconAU.shield({ width: 30, height: 30 })}</div>
              <h1 style={{ margin: 0, fontFamily: TAU.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.5 }}>Get it Cardonomy Verified</h1>
              <p style={{ fontFamily: TAU.sans, fontSize: 13.5, color: TAU.muted, lineHeight: 1.5, margin: '8px auto 0', maxWidth: 300 }}>
                Raw cards over £100 can be authenticated by our team. Verified cards get a tamper-evident seal and sell for more, with buyer trust built in.
              </p>
            </div>
            <div style={{ background: TAU.surface, borderRadius: 14, padding: 15, boxShadow: 'var(--shadow-1)' }}>
              {[['🔬', 'Expert examination', 'Centering, edges, surface, and print checked against a reference DB'],
                ['🏷️', 'Tamper-evident seal', 'A serialized Cardonomy Verified mark links the card to its listing'],
                ['📈', 'Sells ~20% higher', 'Verified raw cards convert faster and at better prices']].map(([e, t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line-2)' }}>
                  <span style={{ fontSize: 20 }}>{e}</span>
                  <div><div style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 13.5 }}>{t}</div><div style={{ fontFamily: TAU.sans, fontSize: 12, color: TAU.muted, lineHeight: 1.4 }}>{d}</div></div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                <span style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 14 }}>Authentication fee</span>
                <span style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 18 }}>{moneyAU(fee)}</span>
              </div>
            </div>
            <button onClick={() => setPhase('method')} style={{ width: '100%', marginTop: 16, background: 'var(--ink)', color: '#fff', borderRadius: 14, padding: 16, fontFamily: TAU.sans, fontWeight: 700, fontSize: 16, boxShadow: 'var(--shadow-2)' }}>Start authentication</button>
          </div>
        )}

        {phase === 'method' && (
          <div>
            <h2 style={{ fontFamily: TAU.sans, fontWeight: 800, fontSize: 19, letterSpacing: -0.4, margin: '0 0 4px' }}>How do you want to verify?</h2>
            <p style={{ fontFamily: TAU.sans, fontSize: 13, color: TAU.muted, margin: '0 0 16px' }}>Both end in the same Cardonomy Verified seal.</p>
            {[['shop', '🏪', 'Verify at a local shop', 'Drop it at an enrolled LGS — examined on-site, often same day. No shipping.', 'Fastest · in person'],
              ['mail', '📦', 'Mail-in to Cardonomy', 'Ship with a prepaid, insured label. Examined and sealed at our facility, then returned or vaulted.', '5–7 days']].map(([id, e, t, d, tag]) => {
              const sel = method === id;
              return (
                <button key={id} onClick={() => setMethod(id)} style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 13, alignItems: 'flex-start', background: sel ? 'var(--accent-wash)' : TAU.surface, borderRadius: 14, padding: 15, marginBottom: 11, boxShadow: sel ? 'inset 0 0 0 2px var(--accent)' : 'var(--shadow-1)' }}>
                  <span style={{ fontSize: 24 }}>{e}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 15 }}>{t}</span><span style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 10, color: 'var(--ink)', background: '#fff', borderRadius: 6, padding: '2px 7px' }}>{tag}</span></div>
                    <div style={{ fontFamily: TAU.sans, fontSize: 12.5, color: TAU.muted, lineHeight: 1.45, marginTop: 3 }}>{d}</div>
                  </div>
                </button>
              );
            })}
            <button onClick={() => { setPhase('submitted'); setStage(0); }} disabled={!method} style={{ width: '100%', marginTop: 6, background: 'var(--ink)', color: '#fff', borderRadius: 14, padding: 16, fontFamily: TAU.sans, fontWeight: 700, fontSize: 16, opacity: method ? 1 : 0.45, boxShadow: 'var(--shadow-2)' }}>
              {method === 'shop' ? 'Find a shop & submit' : method === 'mail' ? 'Get my prepaid label' : 'Choose a method'}
            </button>
          </div>
        )}

        {phase === 'submitted' && (
          <div>
            <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
              <div style={{ width: 76, height: 76, margin: '0 auto 12px', borderRadius: 999, background: 'var(--accent-wash)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconAU.check({ width: 40, height: 40 })}</div>
              <h1 style={{ margin: 0, fontFamily: TAU.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.5 }}>Submitted for authentication</h1>
              <p style={{ fontFamily: TAU.sans, fontSize: 13.5, color: TAU.muted, lineHeight: 1.5, margin: '8px auto 0', maxWidth: 300 }}>
                {method === 'shop' ? 'Take the card to Gnome Games (ticket #AC-2231). We\u2019ll text when it\u2019s sealed.' : 'Your prepaid label is in Notifications. Pack the card and drop it off — tracking starts automatically.'}
              </p>
            </div>
            {/* status tracker */}
            <div style={{ background: TAU.surface, borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-1)' }}>
              <div style={{ fontFamily: TAU.sans, fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Authentication status</div>
              {AUTH_STEPS.map((s, i) => {
                const done = i < stage, active = i === stage;
                return (
                  <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: i < AUTH_STEPS.length - 1 ? 16 : 0, position: 'relative' }}>
                    {i < AUTH_STEPS.length - 1 && <div style={{ position: 'absolute', left: 13, top: 26, bottom: 2, width: 2, background: done ? 'var(--up)' : 'var(--line)' }} />}
                    <span style={{ width: 28, height: 28, borderRadius: 999, flexShrink: 0, zIndex: 1, background: done ? 'var(--up)' : active ? TAU.accent : TAU.surface2, color: done || active ? '#fff' : TAU.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                      {done ? '✓' : active ? '•' : i + 1}
                    </span>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontFamily: TAU.sans, fontWeight: 700, fontSize: 14, color: done || active ? TAU.ink : TAU.muted }}>{s}</div>
                      {active && <div style={{ fontFamily: TAU.sans, fontSize: 12, color: TAU.muted }}>In progress…</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            {stage < AUTH_STEPS.length - 1 ? (
              <button onClick={() => setStage(stage + 1)} style={{ width: '100%', marginTop: 16, background: TAU.surface2, color: TAU.ink, borderRadius: 14, padding: 14, fontFamily: TAU.sans, fontWeight: 700, fontSize: 14, boxShadow: 'inset 0 0 0 1px var(--line)' }}>Advance status (demo) →</button>
            ) : (
              <div style={{ marginTop: 16, textAlign: 'center', background: 'var(--up-wash)', borderRadius: 14, padding: 18 }}>
                <div style={{ marginBottom: 8 }}><AuthSeal size="lg" /></div>
                <div style={{ fontFamily: TAU.sans, fontWeight: 800, fontSize: 16, color: 'var(--up)' }}>Card verified &amp; sealed</div>
                <p style={{ fontFamily: TAU.sans, fontSize: 12.5, color: TAU.ink2, lineHeight: 1.45, margin: '6px auto 14px', maxWidth: 280 }}>Your listing now shows the Cardonomy Verified seal. Serial #AC-2231-CHZ.</p>
                <button onClick={() => app.nav.pop()} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '12px 26px', fontFamily: TAU.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AuthCardScreen, AuthSeal });
