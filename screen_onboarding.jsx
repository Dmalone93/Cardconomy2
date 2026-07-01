// ─────────────────────────────────────────────────────────────
// Onboarding overlay + shared game-preferences picker
// ─────────────────────────────────────────────────────────────
const { T: TOB, Icon: IconOB, Logo: LogoOB, Container: ContainerOB } = window;

const ACCT_TYPES = [
  { id: 'buyer',  title: "I\'m a collector",  sub: 'Buy, bid, track & trade cards for my collection', tint: 'var(--up)' },
  { id: 'seller', title: "I\'m an individual seller", sub: 'Sell singles & lots, plus everything buyers can do', tint: 'var(--accent)' },
  { id: 'store',  title: "I run a game shop", sub: 'Storefront, buylist intake, local vault & trade hub', tint: 'var(--gold)' },
];

// ── reusable game tile (used in onboarding + prefs sheet) ─────
function GameTile({ g, on, onClick }) {
  const logo = (window.GAME_LOGOS || {})[g.id];
  return (
    <button onClick={onClick} style={{
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      height: 92, borderRadius: 16, background: on ? '#fff' : TOB.surface,
      boxShadow: on ? '0 0 0 2.5px var(--accent)' : 'inset 0 0 0 1px var(--line)',
      transition: 'box-shadow 0.15s, transform 0.1s', textAlign: 'center', padding: '8px 6px' }}>
      {logo
        ? <img src={logo} alt={g.name} style={{ height: 26, maxWidth: '78%', objectFit: 'contain', filter: on ? 'none' : 'saturate(0.9) opacity(0.85)' }} />
        : <span style={{ width: 26, height: 26, borderRadius: 999, background: g.tint }} />}
      <span style={{ fontFamily: TOB.sans, fontWeight: 700, fontSize: 11.5, color: on ? TOB.ink : TOB.muted }}>{g.short}</span>
      {on && <span style={{ position: 'absolute', top: 7, right: 7, width: 18, height: 18, borderRadius: 999, background: 'var(--ink)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconOB.check ? IconOB.check({ width: 12, height: 12 }) : '✓'}</span>}
    </button>
  );
}

// ── shared sheet: edit which games you follow ────────────────
function GamePrefsSheet({ app, open, onClose, games }) {
  const [sel, setSel] = React.useState(app.prefs);
  React.useEffect(() => { if (open) setSel(app.prefs); }, [open]);
  if (!window.Sheet) return null;
  const toggle = (id) => setSel(s => s.includes(id) ? (s.length > 1 ? s.filter(x => x !== id) : s) : [...s, id]);
  const all = sel.length >= games.length;
  return (
    <window.Sheet open={open} onClose={onClose} title="Games you follow">
      <p style={{ fontFamily: TOB.sans, fontSize: 13.5, color: TOB.muted, margin: '0 0 14px', lineHeight: 1.45 }}>
        We'll tailor your home feed, search and alerts to these games. Change anytime.
      </p>
      <button onClick={() => setSel(all ? [games[0].id] : games.map(g => g.id))} style={{ marginBottom: 12, fontFamily: TOB.sans, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
        {all ? 'Clear all' : 'Follow all games'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {games.map(g => <GameTile key={g.id} g={g} on={sel.includes(g.id)} onClick={() => toggle(g.id)} />)}
      </div>
      <button onClick={() => { app.setPrefs(sel); onClose(); app.toast('Preferences updated'); }} style={{
        width: '100%', marginTop: 18, background: TOB.ink, color: '#fff', borderRadius: 13, padding: 15,
        fontFamily: TOB.sans, fontWeight: 700, fontSize: 15.5 }}>Save {sel.length} game{sel.length !== 1 ? 's' : ''}</button>
    </window.Sheet>
  );
}

// ── first-run onboarding (2 steps) ───────────────────────────
function Onboarding({ app, games }) {
  const [step, setStep] = React.useState(0);
  const [acct, setAcct] = React.useState('buyer');
  const [sel, setSel] = React.useState([]);
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 120, background: TOB.bg, display: 'flex', flexDirection: 'column' }}>
      {/* brand header */}
      <div style={{ padding: '14px 24px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogoOB size={32} color={TOB.ink} />
        <span style={{ fontFamily: 'var(--wordmark)', fontWeight: 700, fontSize: 22, letterSpacing: 1.5, lineHeight: 0, display: 'flex', alignItems: 'center', height: 32 }}>CARDCONOMY</span>
      </div>
      {/* progress */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 24px 0' }}>
        {[0, 1].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--line)' }} />)}
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '22px 24px 12px' }}>
        <ContainerOB width={720} style={{ padding: 0 }}>
        {step === 0 ? (
          <div>
            <h1 style={{ fontFamily: TOB.sans, fontWeight: 700, fontSize: 27, letterSpacing: -0.7, margin: '0 0 6px' }}>Welcome</h1>
            <p style={{ fontFamily: TOB.sans, fontSize: 15, color: TOB.muted, margin: '0 0 22px', lineHeight: 1.5 }}>How do you want to use Cardonomy? You can always change this later.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACCT_TYPES.map(t => {
                const on = acct === t.id;
                return (
                  <button key={t.id} onClick={() => setAcct(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                    background: on ? '#fff' : TOB.surface, borderRadius: 16, padding: 16,
                    boxShadow: on ? '0 0 0 2.5px var(--accent)' : 'inset 0 0 0 1px var(--line)', transition: 'box-shadow 0.15s' }}>
                    <span style={{ width: 46, height: 46, borderRadius: 13, background: TOB.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.tint }}>
                      {t.id === 'buyer' && IconOB.heart({ width: 22, height: 22 })}
                      {t.id === 'seller' && IconOB.tag({ width: 22, height: 22 })}
                      {t.id === 'store' && IconOB.shield({ width: 22, height: 22 })}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontFamily: TOB.sans, fontWeight: 700, fontSize: 16 }}>{t.title}</span>
                      <span style={{ display: 'block', fontFamily: TOB.sans, fontSize: 12.5, color: TOB.muted, marginTop: 2, lineHeight: 1.4 }}>{t.sub}</span>
                    </span>
                    <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                      boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--line)', background: on ? 'var(--accent)' : 'transparent',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && (IconOB.check ? IconOB.check({ width: 13, height: 13 }) : '✓')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ fontFamily: TOB.sans, fontWeight: 700, fontSize: 27, letterSpacing: -0.7, margin: '0 0 6px' }}>Pick your games</h1>
            <p style={{ fontFamily: TOB.sans, fontSize: 15, color: TOB.muted, margin: '0 0 18px', lineHeight: 1.5 }}>
              Your feed, search and price alerts will focus on what you choose. Most collectors pick one or two.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {games.map(g => <GameTile key={g.id} g={g} on={sel.includes(g.id)} onClick={() => toggle(g.id)} />)}
            </div>
            <button onClick={() => setSel(sel.length >= games.length ? [] : games.map(g => g.id))} style={{ marginTop: 14, fontFamily: TOB.sans, fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>
              {sel.length >= games.length ? 'Clear all' : 'I collect a bit of everything →'}
            </button>
          </div>
        )}
        </ContainerOB>
      </div>

      {/* footer CTA */}
      <div style={{ padding: '12px 24px 30px', borderTop: '1px solid var(--line)', background: TOB.surface }}>
        {step === 0 ? (
          <button onClick={() => setStep(1)} style={{ width: '100%', background: TOB.ink, color: '#fff', borderRadius: 14, padding: 16,
            fontFamily: TOB.sans, fontWeight: 700, fontSize: 16 }}>Continue</button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(0)} style={{ background: TOB.surface2, color: TOB.ink, borderRadius: 14, padding: '16px 20px', fontFamily: TOB.sans, fontWeight: 700, fontSize: 16 }}>Back</button>
            <button onClick={() => app.finishOnboarding({ acct, prefs: sel.length ? sel : games.map(g => g.id) })} style={{ flex: 1, background: TOB.ink, color: '#fff', borderRadius: 14, padding: 16,
              fontFamily: TOB.sans, fontWeight: 700, fontSize: 16 }}>{sel.length ? `Start with ${sel.length} game${sel.length !== 1 ? 's' : ''}` : 'Browse everything'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding, GamePrefsSheet, GameTile });
