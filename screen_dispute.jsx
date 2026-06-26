// -----------------------------------------------------------------
// Report an Issue / Dispute Flow
// -----------------------------------------------------------------
const { T: TD, money: moneyTD, Icon: IconTD } = window;

function DisputeScreen({ app }) {
  const [issueType, setIssueType] = React.useState(null);
  const [resolution, setResolution] = React.useState(null);
  const [description, setDescription] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const ISSUE_TYPES = [
    'Item not received',
    'Item not as described',
    'Item damaged in shipping',
    'Wrong item sent',
  ];

  const claimRef = 'CC-CLM-' + Math.floor(Math.random() * 90000 + 10000);

  function handleSubmit() {
    if (!issueType || !resolution) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TD.bg }}>
        <div style={{ padding: '14px 14px 12px', background: TD.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => app.nav.pop()} style={{ color: TD.ink }}>{IconTD.back({})}</button>
          <span style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 18 }}>Report an Issue</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: '#dcfce7', color: '#22c55e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, marginBottom: 18 }}>{'✓'}</div>
          <h2 style={{ margin: '0 0 8px', fontFamily: TD.sans, fontWeight: 800, fontSize: 22 }}>Claim submitted</h2>
          <p style={{ fontFamily: TD.sans, fontSize: 14, color: TD.muted, lineHeight: 1.5, margin: '0 0 6px' }}>
            Reference: <strong>{claimRef}</strong>
          </p>
          <p style={{ fontFamily: TD.sans, fontSize: 14, color: TD.muted, lineHeight: 1.5, margin: '0 0 24px' }}>
            {"We’ll review within 48 hours and keep you updated via notifications."}
          </p>
          <button onClick={() => app.nav.pop()} style={{
            background: 'var(--ink)', color: '#fff', borderRadius: 13, padding: '13px 32px',
            fontFamily: TD.sans, fontWeight: 700, fontSize: 15,
          }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TD.bg }}>
      {/* header */}
      <div style={{ padding: '14px 14px 12px', background: TD.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TD.ink }}>{IconTD.back({})}</button>
        <span style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 18 }}>Report an Issue</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 100px' }}>

        {/* order reference */}
        <div style={{ background: TD.surface, borderRadius: 14, padding: 14, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TD.muted, textTransform: 'uppercase', marginBottom: 4 }}>Order Reference</div>
          <div style={{ fontFamily: TD.sans, fontWeight: 700, fontSize: 15 }}>Order #CC-20240618-042</div>
        </div>

        {/* issue type */}
        <div style={{ background: TD.surface, borderRadius: 14, padding: 14, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TD.muted, textTransform: 'uppercase', marginBottom: 10 }}>What went wrong?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ISSUE_TYPES.map(function(type) {
              var selected = issueType === type;
              return (
                <button key={type} onClick={function() { setIssueType(type); }} style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', borderRadius: 10,
                  background: selected ? 'var(--accent-wash)' : TD.surface2,
                  border: selected ? '2px solid var(--accent)' : '2px solid var(--line)',
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                    border: selected ? 'none' : '2px solid var(--faint)',
                    background: selected ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 800,
                  }}>{selected ? '✓' : ''}</span>
                  <span style={{ fontFamily: TD.sans, fontWeight: 600, fontSize: 14 }}>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* description */}
        <div style={{ background: TD.surface, borderRadius: 14, padding: 14, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TD.muted, textTransform: 'uppercase', marginBottom: 8 }}>Description</div>
          <textarea
            value={description}
            onChange={function(e) { setDescription(e.target.value); }}
            placeholder="Describe the issue..."
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)',
              fontFamily: TD.sans, fontSize: 14, resize: 'vertical', background: TD.surface2, color: TD.ink,
            }}
          />
        </div>

        {/* photo upload */}
        <div style={{ background: TD.surface, borderRadius: 14, padding: 14, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TD.muted, textTransform: 'uppercase', marginBottom: 10 }}>Photos</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[0, 1, 2, 3].map(function(i) {
              return (
                <button key={i} onClick={function() { app.toast('Camera opening...'); }} style={{
                  width: 68, height: 68, borderRadius: 12, border: '2px dashed var(--line)',
                  background: TD.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: TD.faint, fontSize: 26, flexShrink: 0,
                }}>+</button>
              );
            })}
          </div>
        </div>

        {/* resolution preference */}
        <div style={{ background: TD.surface, borderRadius: 14, padding: 14, marginBottom: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ fontFamily: TD.sans, fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: TD.muted, textTransform: 'uppercase', marginBottom: 10 }}>Preferred Resolution</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Full refund', 'Replacement'].map(function(opt) {
              var selected = resolution === opt;
              return (
                <button key={opt} onClick={function() { setResolution(opt); }} style={{
                  flex: 1, textAlign: 'center', padding: '11px 12px', borderRadius: 10,
                  background: selected ? 'var(--accent-wash)' : TD.surface2,
                  border: selected ? '2px solid var(--accent)' : '2px solid var(--line)',
                }}>
                  <span style={{
                    display: 'block', width: 18, height: 18, borderRadius: 999, margin: '0 auto 6px',
                    border: selected ? 'none' : '2px solid var(--faint)',
                    background: selected ? 'var(--accent)' : 'transparent',
                    color: '#fff', fontSize: 11, fontWeight: 800, lineHeight: '18px',
                  }}>{selected ? '✓' : ''}</span>
                  <span style={{ fontFamily: TD.sans, fontWeight: 600, fontSize: 13.5 }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* submit */}
        <button
          onClick={handleSubmit}
          disabled={!issueType || !resolution}
          style={{
            width: '100%', background: (!issueType || !resolution) ? 'var(--faint)' : 'var(--ink)', color: '#fff',
            borderRadius: 13, padding: '14px 20px', fontFamily: TD.sans, fontWeight: 700, fontSize: 16,
            opacity: (!issueType || !resolution) ? 0.5 : 1,
          }}
        >Submit claim</button>
      </div>
    </div>
  );
}

window.DisputeScreen = DisputeScreen;
