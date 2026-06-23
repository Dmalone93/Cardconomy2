// ─────────────────────────────────────────────────────────────
// Cardonomy — Identity verification (lean-strict)
// Progressive trust: phone → ID + selfie → payout/KYC.
// Gates the money-out / high-risk actions (sell, bid, trade, payout).
// TrustBadge is shown across profiles, listings, and trades.
// ─────────────────────────────────────────────────────────────
const { T: TV, money: moneyV, Icon: IconV, Stars: StarsV } = window;

// ── trust tiers ──────────────────────────────────────────────
// tier 0 registered · 1 ID-verified · 2 trusted (history) · 3 pro/LGS
const TIERS = [
  { n: 0, key: 'registered', label: 'Registered', color: 'var(--muted)', wash: 'var(--surface-2)', desc: 'Email + phone confirmed' },
  { n: 1, key: 'verified', label: 'ID Verified', color: 'var(--accent)', wash: 'var(--accent-wash)', desc: 'Government ID + selfie + payout details' },
  { n: 2, key: 'trusted', label: 'Trusted Seller', color: 'var(--up)', wash: 'var(--up-wash)', desc: 'Strong track record on Cardonomy' },
  { n: 3, key: 'pro', label: 'Verified Shop', color: 'var(--gold)', wash: 'oklch(0.95 0.06 85)', desc: 'Licensed business · the gold standard' },
];
const tierByN = (n) => TIERS[Math.max(0, Math.min(3, n))];

function loadTier() { try { return JSON.parse(localStorage.getItem('cc_tier') || '0'); } catch (e) { return 0; } }
function saveTier(n) { try { localStorage.setItem('cc_tier', JSON.stringify(n)); } catch (e) {} }

// ── badge (compact trust pill) ───────────────────────────────
function TrustBadge({ tier = 1, size = 'sm', showLabel = true }) {
  const t = tierByN(tier);
  if (t.n === 0) return null;
  const sm = size === 'sm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: sm ? 3 : 5, verticalAlign: 'middle',
      fontFamily: TV.sans, fontWeight: 700, fontSize: sm ? 10.5 : 12, color: t.color,
      background: t.wash, borderRadius: 6, padding: sm ? '2px 6px' : '3px 9px', whiteSpace: 'nowrap' }}>
      <svg width={sm ? 11 : 13} height={sm ? 11 : 13} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" fill="currentColor" opacity="0.18"/><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {showLabel && t.label}
    </span>
  );
}

// ── gate banner — shown when an action needs a higher tier ───
function VerifyGate({ app, need = 1, action = 'do this', compact }) {
  if (app.tier >= need) return null;
  return (
    <button onClick={() => app.nav.push('verify')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
      background: 'var(--accent-wash)', borderRadius: 13, padding: compact ? '11px 13px' : '14px 15px', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconV.shield({ width: 18, height: 18 })}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TV.sans, fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>Verify your identity to {action}</div>
        <div style={{ fontFamily: TV.sans, fontSize: 11.5, color: TV.ink2 }}>A one-time check keeps the marketplace safe. ~2 minutes.</div>
      </div>
      {IconV.chevron({ style: { color: 'var(--ink)' } })}
    </button>
  );
}

// ── verification flow ────────────────────────────────────────
const STEPS_V = [
  { id: 'phone', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>, title: 'Confirm your phone', blurb: 'We text a 6-digit code. Used for login and offer alerts.', cta: 'Send code' },
  { id: 'id', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 17c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 9h3M15 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'Government ID + selfie', blurb: 'Snap your ID and a selfie. Matched automatically by our verification partner — we never store the raw images.', cta: 'Scan my ID' },
  { id: 'payout', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 4h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 14h8M8 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'Payout & tax details', blurb: 'Link a bank for payouts and confirm tax info (required to receive money). KYC/AML compliant.', cta: 'Link payout' },
];

function VerifyScreen({ app }) {
  const [working, setWorking] = React.useState(null); // step id mid-progress
  const tier = app.tier;
  // which steps are done: tier>=1 means all three complete
  const stepDone = (i) => tier >= 1 || (working === 'done-' + i);
  const [localDone, setLocalDone] = React.useState(tier >= 1 ? [true, true, true] : [false, false, false]);
  const nextIdx = localDone.findIndex(d => !d);
  const allDone = nextIdx === -1;

  const runStep = (i) => {
    setWorking(STEPS_V[i].id);
    setTimeout(() => {
      setLocalDone(d => d.map((v, j) => j === i ? true : v));
      setWorking(null);
    }, 1100);
  };

  React.useEffect(() => { if (allDone && tier < 1) { app.setTier(1); } }, [allDone]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TV.bg }}>
      <div style={{ padding: '14px 14px 12px', background: TV.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TV.ink }}>{IconV.back({})}</button>
        <span style={{ fontFamily: TV.sans, fontWeight: 800, fontSize: 17 }}>Verification</span>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '18px 16px 30px' }}>
        {/* current status */}
        <div style={{ background: 'var(--fill)', borderRadius: 18, padding: 18, color: '#fff', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: TV.sans, fontSize: 12.5, opacity: 0.7, fontWeight: 600 }}>Your trust level</div>
            <TrustBadge tier={allDone ? Math.max(tier, 1) : 0} size="lg" />
          </div>
          <div style={{ fontFamily: TV.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 4 }}>{tierByN(allDone ? Math.max(tier, 1) : 0).label}</div>
          <div style={{ fontFamily: TV.sans, fontSize: 12.5, opacity: 0.8, marginTop: 2 }}>{tierByN(allDone ? Math.max(tier, 1) : 0).desc}</div>
        </div>

        {!allDone && (
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: 'var(--accent-wash)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
            <span style={{ color: 'var(--ink)', marginTop: 1 }}>{IconV.shield({ width: 16, height: 16 })}</span>
            <span style={{ fontFamily: TV.sans, fontSize: 12.5, color: TV.ink2, lineHeight: 1.45 }}>
              Cardonomy is <b>verified-only for selling, bidding, and trading</b>. One quick check unlocks all of it — and earns you a badge buyers trust.
            </span>
          </div>
        )}

        {/* steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS_V.map((s, i) => {
            const done = localDone[i];
            const active = i === nextIdx;
            const busy = working === s.id;
            return (
              <div key={s.id} style={{ background: TV.surface, borderRadius: 14, padding: 15, boxShadow: active ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)', opacity: !done && !active ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: done ? 'var(--up-wash)' : TV.surface2, color: done ? 'var(--up)' : TV.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
                    {done ? IconV.check({ width: 20, height: 20 }) : s.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TV.sans, fontWeight: 700, fontSize: 14.5 }}>{s.title}</div>
                    <div style={{ fontFamily: TV.sans, fontSize: 11.5, color: TV.muted }}>{done ? 'Verified' : 'Step ' + (i + 1) + ' of 3'}</div>
                  </div>
                  {done && <span style={{ fontFamily: TV.sans, fontWeight: 700, fontSize: 11.5, color: 'var(--up)' }}>✓ Done</span>}
                </div>
                {active && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontFamily: TV.sans, fontSize: 13, color: TV.ink2, lineHeight: 1.5, marginBottom: 12 }}>{s.blurb}</div>
                    <button onClick={() => runStep(i)} disabled={busy} style={{ width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: 13, fontFamily: TV.sans, fontWeight: 700, fontSize: 15 }}>
                      {busy ? 'Verifying…' : s.cta}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {allDone && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: TV.sans, fontWeight: 800, fontSize: 17, color: 'var(--up)' }}>✓ You're verified!</div>
            <p style={{ fontFamily: TV.sans, fontSize: 13.5, color: TV.muted, lineHeight: 1.5, margin: '6px auto 16px', maxWidth: 290 }}>
              You can now sell, bid, and trade. Build a track record to reach <b>Trusted Seller</b> and unlock higher limits.
            </p>
            <button onClick={() => app.nav.pop()} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontFamily: TV.sans, fontWeight: 700, fontSize: 15 }}>Done</button>
          </div>
        )}

        {/* trusted-seller progression (shown once ID-verified) */}
        {tier >= 1 && (
          <div style={{ marginTop: 22, background: TV.surface, borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: TV.sans, fontWeight: 800, fontSize: 15 }}>Progress to Trusted Seller</span>
              <TrustBadge tier={2} size="sm" />
            </div>
            <p style={{ fontFamily: TV.sans, fontSize: 12.5, color: TV.muted, margin: '0 0 14px', lineHeight: 1.45 }}>
              {tier >= 2 ? "You've earned Trusted Seller — higher limits, lower payout holds, and priority placement." : 'Earn it through a clean track record. Unlocks higher limits, faster payouts, and a featured badge.'}
            </p>
            {[['Completed sales', tier >= 2 ? 25 : 18, 25], ['On-time shipping', tier >= 2 ? 100 : 96, 95, '%'], ['Positive rating', tier >= 2 ? 99 : 97, 98, '%'], ['Dispute rate (max 2%)', tier >= 2 ? 0.4 : 1.2, 2, '%', true]].map(([label, val, goal, unit, inverse]) => {
              const pct = inverse ? Math.max(0, Math.min(100, (1 - val / goal) * 100)) : Math.min(100, (val / goal) * 100);
              const met = inverse ? val <= goal : val >= goal;
              return (
                <div key={label} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TV.sans, fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: TV.ink2, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontFamily: TV.sans, color: met ? 'var(--up)' : TV.muted, fontWeight: 700 }}>{val}{unit || ''}{met ? ' ✓' : ' / ' + goal + (unit || '')}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: TV.surface2, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: met ? 'var(--up)' : 'var(--accent)', transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
            {tier < 2 && (
              <button onClick={() => app.setTier(2)} style={{ width: '100%', marginTop: 6, background: TV.surface2, color: TV.ink, borderRadius: 11, padding: 12, fontFamily: TV.sans, fontWeight: 700, fontSize: 13.5, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                Simulate reaching the milestone →
              </button>
            )}
          </div>
        )}

        {/* the ladder */}
        <div style={{ fontFamily: TV.sans, fontWeight: 800, fontSize: 14, color: TV.ink2, margin: '24px 2px 10px' }}>How trust works on Cardonomy</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIERS.map(t => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 12, background: TV.surface, borderRadius: 12, padding: '11px 14px',
              boxShadow: (allDone ? Math.max(tier, 1) : tier) === t.n ? 'inset 0 0 0 1.5px ' + t.color : '0 1px 3px rgba(20,24,40,0.04)' }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: t.wash, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TV.sans, fontWeight: 700, fontSize: 13 }}>{t.n}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TV.sans, fontWeight: 700, fontSize: 13.5 }}>{t.label}</div>
                <div style={{ fontFamily: TV.sans, fontSize: 11.5, color: TV.muted }}>{t.desc}</div>
              </div>
              {(allDone ? Math.max(tier, 1) : tier) >= t.n && t.n > 0 && <span style={{ color: 'var(--up)', fontSize: 13 }}>✓</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: TV.sans, fontSize: 11.5, color: TV.faint, lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
          In-person trades require <b>both</b> traders verified. Shops are checked for a business license. Powered by a KYC partner — your raw documents are never stored on Cardonomy.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VerifyScreen, TrustBadge, VerifyGate, tierByN, loadTier, saveTier });
