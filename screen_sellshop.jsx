// ─────────────────────────────────────────────────────────────
// Seller · sell-to-shop bulk flow
// phases: land → identity → method → scan → review → done → thread
// ─────────────────────────────────────────────────────────────
const { T: TSS, money: moneySS, Icon: IconSS, CardArt: CardArtSS, GradeChip: GradeChipSS } = window;
const { SHOP: SHOP_SS, SUBMISSION: SUB_SS, SUB_CARDS: SC_SS, subStats: subStatsSS, SCAN_POOL: POOL_SS, gameById: gameByIdSS } = window;

// mini scanned-card thumbnail
function ScanThumb({ c, pop }) {
  return (
    <div style={{ width: 38, height: 53, borderRadius: 6, flexShrink: 0, position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.18)',
      animation: pop ? 'ccPop 0.4s ease' : 'none' }}>
      <CardArtSS item={c} w={38} radius={6} />
      {c.match && <div style={{ position: 'absolute', top: 2, right: 2, width: 12, height: 12, borderRadius: 999, zIndex: 4,
        background: 'var(--gold)', boxShadow: '0 0 0 1.5px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, color: '#3a2a00' }}>★</div>}
    </div>
  );
}

// ── Live Sweep scanner ───────────────────────────────────────
function LiveSweep({ onDone }) {
  const [count, setCount] = React.useState(0);
  const [matches, setMatches] = React.useState(0);
  const [thumbs, setThumbs] = React.useState([]); // recent
  const [running, setRunning] = React.useState(true);
  const [last, setLast] = React.useState(null);
  const [flash, setFlash] = React.useState(false);
  const idx = React.useRef(0);
  const trayRef = React.useRef(null);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      const c = POOL_SS[idx.current % POOL_SS.length];
      idx.current += 1;
      setCount(n => n + 1 + (Math.random() < 0.3 ? 1 : 0)); // sometimes 2 at once
      setLast(c);
      if (c.match) { setMatches(m => m + 1); setFlash(true); setTimeout(() => setFlash(false), 450); }
      setThumbs(t => [{ ...c, key: Date.now() + Math.random() }, ...t].slice(0, 7));
    }, 360);
    return () => clearInterval(t);
  }, [running]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0c0e13' }}>
      {/* header */}
      <div style={{ padding: '52px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onDone(0)} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4, fontFamily: TSS.sans, fontSize: 15, fontWeight: 600 }}>
          {IconSS.back({ width: 18, height: 18 })} Methods
        </button>
        <span style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 15, color: '#fff' }}>Live Sweep</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: TSS.sans, fontSize: 12.5, fontWeight: 700,
          color: running ? '#7fe7a4' : '#ffd166' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'currentColor', animation: running ? 'ccBlink 1s infinite' : 'none' }} />
          {running ? 'Scanning' : 'Paused'}
        </span>
      </div>

      {/* viewfinder */}
      <div style={{ flex: 1, position: 'relative', margin: '6px 16px 0', borderRadius: 22, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 30%, #1a1d26, #0c0e13)',
        boxShadow: flash ? '0 0 0 3px var(--gold), inset 0 0 60px rgba(212,160,23,0.25)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        transition: 'box-shadow 0.2s' }}>
        {/* faux hand-held card in frame */}
        {last && (
          <div key={last.name + count} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-3deg)',
            animation: 'ccCardIn 0.36s ease', filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.5))' }}>
            <CardArtSS item={last} w={150} radius={12} />
          </div>
        )}
        {/* recognition reticle */}
        <div style={{ position: 'absolute', inset: '14% 16%', borderRadius: 14, border: '2.5px solid rgba(255,255,255,0.5)',
          boxShadow: '0 0 0 100vmax rgba(0,0,0,0.18)' }}>
          {['tl','tr','bl','br'].map(p => (
            <span key={p} style={{ position: 'absolute', width: 22, height: 22, border: '3px solid var(--accent)',
              borderRadius: 3, ...(p[0]==='t'?{top:-3}:{bottom:-3}), ...(p[1]==='l'?{left:-3, borderRight:0, borderBottom: p[0]==='t'?0:'3px solid var(--accent)'}:{right:-3, borderLeft:0}),
              ...(p[0]==='t'?{borderBottom:0}:{borderTop:0}), ...(p[1]==='l'?{borderRight:0}:{borderLeft:0}) }} />
          ))}
        </div>
        {/* live recognition tag */}
        {last && (
          <div key={'tag'+count} style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            background: last.match ? 'var(--gold)' : 'var(--accent)', color: last.match ? '#2a2000' : '#fff',
            fontFamily: TSS.sans, fontWeight: 700, fontSize: 12.5, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap',
            animation: 'ccFade 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {last.match ? '★ Buylist match · ' : '✓ '}{last.name}
          </div>
        )}
        {/* counter */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div key={count} style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 46, color: '#fff', lineHeight: 1,
              animation: 'ccTick 0.3s ease', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{count}</div>
            <div style={{ fontFamily: TSS.sans, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>cards detected</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 20, color: 'var(--gold)' }}>{matches}</div>
            <div style={{ fontFamily: TSS.sans, fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>★ buylist hits</div>
          </div>
        </div>
      </div>

      {/* thumb tray */}
      <div className="noscroll" ref={trayRef} style={{ display: 'flex', gap: 6, padding: '12px 16px 6px', overflowX: 'hidden', minHeight: 70, alignItems: 'center' }}>
        {thumbs.length === 0 ? (
          <span style={{ fontFamily: TSS.sans, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Flip through your stack — we capture each card…</span>
        ) : thumbs.map((c, i) => <ScanThumb key={c.key} c={c} pop={i === 0} />)}
      </div>

      {/* controls */}
      <div style={{ padding: '6px 16px 30px', display: 'flex', gap: 10 }}>
        <button onClick={() => setRunning(r => !r)} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 14,
          padding: 15, fontFamily: TSS.sans, fontWeight: 700, fontSize: 15.5, backdropFilter: 'blur(8px)' }}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={() => onDone(Math.max(count, 1))} style={{ flex: 1.3, background: TSS.accent, color: '#fff', borderRadius: 14,
          padding: 15, fontFamily: TSS.sans, fontWeight: 700, fontSize: 15.5, boxShadow: '0 4px 16px oklch(0.52 0.2 264 / 0.5)' }}>
          Done · review →
        </button>
      </div>
    </div>
  );
}

// ── method chooser row ───────────────────────────────────────
function MethodRow({ icon, title, sub, time, hero, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13,
      background: hero ? 'var(--accent-wash)' : TSS.surface, borderRadius: 14, padding: '14px 15px',
      boxShadow: hero ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: hero ? TSS.accent : TSS.surface2,
        color: hero ? '#fff' : TSS.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 15, color: hero ? TSS.accent : TSS.ink }}>{title}</div>
        <div style={{ fontFamily: TSS.sans, fontSize: 12, color: TSS.muted }}>{sub}</div>
      </div>
      <span style={{ fontFamily: TSS.sans, fontSize: 11.5, fontWeight: 700, color: hero ? TSS.accent : TSS.muted,
        background: hero ? '#fff' : TSS.surface2, borderRadius: 7, padding: '3px 8px' }}>{time}</span>
    </button>
  );
}

function SellShopScreen({ app }) {
  const [phase, setPhase] = React.useState('land');
  const [scanned, setScanned] = React.useState(0);
  const [cond, setCond] = React.useState('NM');
  const [bulkChoice, setBulkChoice] = React.useState('sell');
  const stats = subStatsSS();

  const goBack = () => {
    if (phase === 'land') app.nav.pop();
    else if (phase === 'identity') setPhase('land');
    else if (phase === 'method') setPhase('identity');
    else if (phase === 'review') setPhase('method');
    else if (phase === 'thread') setPhase('done');
    else app.nav.pop();
  };

  // scanner is full-bleed dark
  if (phase === 'scan') {
    return <LiveSweep onDone={(n) => { if (n === 0) { setPhase('method'); } else { setScanned(n); setPhase('review'); } }} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSS.bg }}>
      {phase !== 'done' && phase !== 'thread' && (
        <div style={{ padding: '52px 14px 12px', background: TSS.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={goBack} style={{ color: TSS.ink }}>{IconSS.back({})}</button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: SHOP_SS.tint, color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontFamily: TSS.sans, fontWeight: 800, fontSize: 14 }}>{SHOP_SS.initial}</span>
            <span style={{ fontFamily: TSS.sans, fontWeight: 800, fontSize: 16 }}>{SHOP_SS.name}</span>
          </div>
          {IconSS.shield({ width: 17, height: 17, style: { color: SHOP_SS.tint } })}
        </div>
      )}

      <div className="noscroll" style={{ flex: 1, overflow: 'auto' }}>
        {/* ── LAND ── */}
        {phase === 'land' && (
          <div style={{ padding: '20px 18px 30px' }}>
            <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
              <div style={{ width: 76, height: 76, margin: '0 auto 12px', borderRadius: 20, background: SHOP_SS.tint, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSS.sans, fontWeight: 800, fontSize: 36,
                boxShadow: '0 8px 22px rgba(47,143,91,0.4)' }}>{SHOP_SS.initial}</div>
              <h1 style={{ margin: 0, fontFamily: TSS.sans, fontWeight: 800, fontSize: 23, letterSpacing: -0.5 }}>{SHOP_SS.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4, fontFamily: TSS.sans, fontSize: 13, color: TSS.muted }}>
                <span style={{ color: 'var(--gold)' }}>★★★★☆</span> {SHOP_SS.rating} · {SHOP_SS.loc}
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--accent-wash)', color: TSS.accent,
              borderRadius: 8, padding: '5px 10px', fontFamily: TSS.sans, fontWeight: 700, fontSize: 12, marginBottom: 14 }}>
              {IconSS.check({ width: 14, height: 14 })} Scanned in-store · ticket reserved
            </div>
            <div style={{ background: TSS.surface, borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TSS.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Sell your cards here</div>
              <p style={{ fontFamily: TSS.sans, fontSize: 13.5, color: TSS.ink2, lineHeight: 1.5, margin: '6px 0 0' }}>{SHOP_SS.blurb}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {[[IconSS.bolt, 'Scan in minutes'], [IconSS.tag, 'Live price guide'], [IconSS.shield, 'In-person & safe']].map(([ic, l], i) => (
                  <div key={i} style={{ flex: 1, background: TSS.surface2, borderRadius: 11, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ color: TSS.accent, display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{ic({ width: 17, height: 17 })}</div>
                    <div style={{ fontFamily: TSS.sans, fontSize: 10.5, fontWeight: 600, color: TSS.ink2, lineHeight: 1.2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setPhase('identity')} style={{ width: '100%', marginTop: 16, background: TSS.accent, color: '#fff',
              borderRadius: 14, padding: 16, fontFamily: TSS.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
              Start a submission →
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: TSS.sans, fontSize: 12.5, color: TSS.muted }}>No account needed · they text you an offer</div>
          </div>
        )}

        {/* ── IDENTITY ── */}
        {phase === 'identity' && (
          <div style={{ padding: '22px 18px 30px' }}>
            <h1 style={{ margin: 0, fontFamily: TSS.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>How do we reach you?</h1>
            <p style={{ fontFamily: TSS.sans, fontSize: 13.5, color: TSS.muted, margin: '6px 0 18px' }}>The shop texts your offer here. No password, no app.</p>
            <Field label="Mobile number" value="(608) 555‑0142" />
            <Field label="Your name (for the counter)" value="Jordan M." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontFamily: TSS.sans, fontSize: 12.5, color: TSS.muted }}>
              {IconSS.shield({ width: 15, height: 15, style: { color: SHOP_SS.tint } })} We never share your number with buyers.
            </div>
            <button onClick={() => setPhase('method')} style={{ width: '100%', marginTop: 22, background: TSS.accent, color: '#fff',
              borderRadius: 14, padding: 16, fontFamily: TSS.sans, fontWeight: 700, fontSize: 16 }}>Continue →</button>
          </div>
        )}

        {/* ── METHOD ── */}
        {phase === 'method' && (
          <div style={{ padding: '18px 16px 30px' }}>
            <h1 style={{ margin: '0 0 2px', fontFamily: TSS.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Add your cards</h1>
            <p style={{ fontFamily: TSS.sans, fontSize: 13.5, color: TSS.muted, margin: '0 0 16px' }}>Big stack? Start with Live Sweep. You can mix methods.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MethodRow hero icon="📷" title="Live Sweep Scan" sub="Flip the stack — we auto-detect each card" time="fastest" onClick={() => setPhase('scan')} />
              <MethodRow icon="🃏" title="Batch Fan Photo" sub="9–12 cards per snap" time="~25 min" onClick={() => app.toast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="☑" title="Set Checklist" sub="Tap cards off a set grid" time="varies" onClick={() => app.toast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="🔍" title="Search & Add" sub="Verify high-value singles" time="precise" onClick={() => app.toast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="📄" title="Import List" sub="Manabox · TCGplayer · CSV" time="instant" onClick={() => app.toast('Live Sweep is wired up for this demo')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 16, background: TSS.surface2, borderRadius: 12, padding: '12px 13px' }}>
              <span style={{ color: TSS.accent, marginTop: 1 }}>{IconSS.bolt({ width: 16, height: 16 })}</span>
              <span style={{ fontFamily: TSS.sans, fontSize: 12.5, color: TSS.ink2, lineHeight: 1.45 }}>
                Mix &amp; match — sweep the bulk now, then <b>Search &amp; Add</b> the few chase cards you want hand-verified.
              </span>
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {phase === 'review' && (
          <ReviewBody scanned={scanned} stats={stats} cond={cond} setCond={setCond} bulkChoice={bulkChoice} setBulkChoice={setBulkChoice} app={app} />
        )}

        {/* ── DONE ── */}
        {phase === 'done' && (
          <Confirmation onThread={() => setPhase('thread')} onHome={() => app.nav.setTab('home')} onShop={() => app.nav.push('shop')} />
        )}

        {/* ── THREAD ── */}
        {phase === 'thread' && (
          <SellerThread app={app} onShop={() => app.nav.push('shop')} />
        )}
      </div>

      {/* footers */}
      {phase === 'review' && (
        <div style={{ padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setPhase('done')} style={{ width: '100%', background: TSS.accent, color: '#fff', borderRadius: 14,
            padding: 16, fontFamily: TSS.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.35)' }}>
            Send to {SHOP_SS.name} →
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ background: TSS.surface, borderRadius: 13, padding: '11px 14px', marginBottom: 11, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <div style={{ fontFamily: TSS.sans, fontSize: 11.5, color: TSS.muted, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: TSS.sans, fontSize: 16, color: TSS.ink, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ── review body ──────────────────────────────────────────────
function ReviewBody({ scanned, stats, cond, setCond, bulkChoice, setBulkChoice, app }) {
  const flagged = SC_SS.filter(c => c.flag);
  const singles = SC_SS.filter(c => !c.flag);
  return (
    <div style={{ padding: '18px 16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontFamily: TSS.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Review</h1>
        <span style={{ fontFamily: TSS.sans, fontSize: 13, color: TSS.muted, whiteSpace: 'nowrap' }}>{SUB_SS.total.toLocaleString()} cards</span>
      </div>
      <p style={{ fontFamily: TSS.sans, fontSize: 13, color: TSS.muted, margin: '4px 0 16px' }}>
        We scanned <b style={{ color: TSS.ink }}>{scanned}+</b> just now. No need to grade each one — set a blanket condition and we flag exceptions.
      </p>

      {/* blanket condition */}
      <div style={{ background: TSS.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 14, marginBottom: 9 }}>Blanket condition <span style={{ color: TSS.muted, fontWeight: 400 }}>· unflagged cards</span></div>
        <div style={{ display: 'flex', gap: 7 }}>
          {['NM', 'LP', 'MP', 'HP'].map(c => (
            <button key={c} onClick={() => setCond(c)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5,
              background: cond === c ? 'var(--fill)' : TSS.surface2, color: cond === c ? '#fff' : TSS.ink2 }}>{c}</button>
          ))}
        </div>
      </div>

      {/* triage groups */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <TriageCard color="var(--down)" icon="⚠" title={flagged.length + ' flagged for damage'} sub="Creasing / whitening — tap to review" onClick={() => app.toast('Showing flagged cards')} accent />
        <TriageCard color="var(--gold)" icon="★" title={stats.buylistCount + ' match the buylist'} sub="Auto-priced at the shop's buy rate" onClick={() => app.toast('Showing buylist matches')} />
        <TriageCard color="var(--accent)" icon="◎" title={stats.singles + ' singles ≥ $5'} sub="Priced from the live guide" onClick={() => app.toast('Showing notable singles')} />
        <TriageCard color="var(--muted)" icon="≈" title={(SUB_SS.bulkCount).toLocaleString() + ' bulk commons'} sub={'Auto ' + cond + ' · standing bulk rate'} muted />
      </div>

      {/* notable preview */}
      <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 14, margin: '20px 0 10px' }}>Notable cards we found</div>
      <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '0 16px 4px' }}>
        {SC_SS.slice(0, 6).map(c => (
          <div key={c.id} style={{ flexShrink: 0, width: 92 }}>
            <div style={{ position: 'relative', background: TSS.surface2, borderRadius: 11, padding: 8, display: 'flex', justifyContent: 'center' }}>
              <CardArtSS item={c} w={70} />
              {c.buylist && <span style={{ position: 'absolute', top: 5, left: 5, background: 'var(--gold)', color: '#3a2a00',
                fontFamily: TSS.sans, fontWeight: 800, fontSize: 9, borderRadius: 5, padding: '1px 5px' }}>★ WANT</span>}
              {c.flag && <span style={{ position: 'absolute', top: 5, left: 5, background: 'var(--down)', color: '#fff',
                fontFamily: TSS.sans, fontWeight: 800, fontSize: 9, borderRadius: 5, padding: '1px 5px' }}>⚠</span>}
            </div>
            <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 11.5, marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
            <div style={{ fontFamily: TSS.sans, fontSize: 11, color: TSS.muted }}>{moneySS(c.market, { cents: false })}</div>
          </div>
        ))}
      </div>

      {/* bulk choice */}
      <div style={{ marginTop: 18, background: TSS.surface, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Your {SUB_SS.bulkCount.toLocaleString()} bulk cards</div>
        <div style={{ fontFamily: TSS.sans, fontSize: 12.5, color: TSS.muted, marginBottom: 11 }}>Sell at the shop's standing rate, or keep them and only sell the hits.</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setBulkChoice('sell')} style={{ flex: 1, padding: '11px 0', borderRadius: 11, fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5,
            background: bulkChoice === 'sell' ? 'var(--accent-wash)' : TSS.surface2, color: bulkChoice === 'sell' ? TSS.accent : TSS.ink2,
            boxShadow: bulkChoice === 'sell' ? 'inset 0 0 0 2px var(--accent)' : 'none' }}>Sell bulk · ~{moneySS(SUB_SS.bulkPayout, { cents: false })}</button>
          <button onClick={() => setBulkChoice('keep')} style={{ flex: 1, padding: '11px 0', borderRadius: 11, fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5,
            background: bulkChoice === 'keep' ? 'var(--accent-wash)' : TSS.surface2, color: bulkChoice === 'keep' ? TSS.accent : TSS.ink2,
            boxShadow: bulkChoice === 'keep' ? 'inset 0 0 0 2px var(--accent)' : 'none' }}>Keep bulk</button>
        </div>
      </div>

      {/* estimate */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--fill)', borderRadius: 14, padding: '14px 16px' }}>
        <div>
          <div style={{ fontFamily: TSS.sans, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Est. market value</div>
          <div style={{ fontFamily: TSS.sans, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Final offer set by the shop</div>
        </div>
        <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 26, color: '#fff' }}>{moneySS(stats.estMarket, { cents: false })}</div>
      </div>
    </div>
  );
}

function TriageCard({ color, icon, title, sub, onClick, accent, muted }) {
  return (
    <button onClick={onClick} disabled={muted} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
      background: TSS.surface, borderRadius: 13, padding: '12px 14px', boxShadow: accent ? 'inset 0 0 0 1.5px var(--down)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, opacity: muted ? 0.5 : 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 14.5 }}>{title}</div>
        <div style={{ fontFamily: TSS.sans, fontSize: 12, color: TSS.muted }}>{sub}</div>
      </div>
      {!muted && IconSS.chevron({ style: { color: TSS.faint } })}
    </button>
  );
}

// ── confirmation ─────────────────────────────────────────────
function Confirmation({ onThread, onHome, onShop }) {
  return (
    <div style={{ padding: '70px 24px 30px', textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconSS.check({ width: 44, height: 44 })}</div>
      <h1 style={{ margin: '20px 0 4px', fontFamily: TSS.sans, fontWeight: 800, fontSize: 25, letterSpacing: -0.5 }}>Sent to {SHOP_SS.name}!</h1>
      <p style={{ fontFamily: TSS.sans, fontSize: 14, color: TSS.muted, lineHeight: 1.5, margin: '0 auto', maxWidth: 280 }}>
        They've been alerted and will text an offer to {SUB_SS.seller.phone}. Keep shopping — your cards stay with you.
      </p>
      <div style={{ background: TSS.surface, borderRadius: 16, padding: 16, marginTop: 20, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        {[['Submission', '#' + SUB_SS.id], ['Cards', SUB_SS.total.toLocaleString()], ['Typical reply', '< 1 hr']].map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none' }}>
            <span style={{ fontFamily: TSS.sans, fontSize: 13.5, color: TSS.muted }}>{k}</span>
            <span style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5, color: i === 2 ? 'var(--up)' : TSS.ink }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--accent-wash)', borderRadius: 13, padding: '13px 14px', marginTop: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', color: TSS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🎫</span>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5, color: TSS.accent }}>Counter ticket #{SUB_SS.ticket}</div>
          <div style={{ fontFamily: TSS.sans, fontSize: 11.5, color: TSS.ink2 }}>Show this with your stack to finish at the counter.</div>
        </div>
      </div>
      <button onClick={onThread} style={{ width: '100%', marginTop: 18, background: TSS.accent, color: '#fff', borderRadius: 14,
        padding: 15, fontFamily: TSS.sans, fontWeight: 700, fontSize: 15.5 }}>View message thread</button>
      <button onClick={onShop} style={{ width: '100%', marginTop: 9, background: TSS.surface, color: TSS.ink, borderRadius: 14,
        padding: 13, fontFamily: TSS.sans, fontWeight: 700, fontSize: 14, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Demo: see the shop's side →</button>
      <button onClick={onHome} style={{ marginTop: 10, color: TSS.muted, fontFamily: TSS.sans, fontWeight: 600, fontSize: 14 }}>Back to browse</button>
    </div>
  );
}

// ── seller message thread ────────────────────────────────────
function SellerThread({ app, onShop }) {
  const stats = subStatsSS();
  const cash = 620, credit = 744;
  const [reply, setReply] = React.useState(null);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 14px 12px', background: SHOP_SS.tint, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.setTab('home')} style={{ color: '#fff' }}>{IconSS.back({})}</button>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TSS.sans, fontWeight: 800 }}>{SHOP_SS.initial}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TSS.sans, fontWeight: 800, fontSize: 16 }}>{SHOP_SS.name}</div>
          <div style={{ fontFamily: TSS.sans, fontSize: 11.5, opacity: 0.85 }}>Submission #{SUB_SS.id} · 1,000 cards</div>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 14px', background: TSS.bg, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bubble who="shop">Hey Jordan! Went through your submission — thanks for the detail 🙌</Bubble>
        {/* offer card */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '92%', background: TSS.surface, borderRadius: '4px 16px 16px 16px', padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.08)' }}>
          <div style={{ fontFamily: TSS.sans, fontWeight: 800, fontSize: 14, marginBottom: 9 }}>Your offer</div>
          {[['142 buylist matches', moneySS(stats.buylistPayout, { cents: false })], ['34 singles (priced)', '$430'], ['824 bulk', '$8']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '4px 0', fontFamily: TSS.sans, fontSize: 13, color: TSS.ink2 }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</span><span style={{ fontFamily: TSS.sans, fontWeight: 600, flexShrink: 0 }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--line-2)', margin: '8px 0' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: TSS.surface2, borderRadius: 11, padding: '9px 11px' }}>
              <div style={{ fontFamily: TSS.sans, fontSize: 11, color: TSS.muted, fontWeight: 600 }}>💵 Cash</div>
              <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 19 }}>{moneySS(cash, { cents: false })}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--up-wash)', borderRadius: 11, padding: '9px 11px', boxShadow: 'inset 0 0 0 1.5px var(--up)' }}>
              <div style={{ fontFamily: TSS.sans, fontSize: 11, color: 'var(--up)', fontWeight: 700 }}>🎁 Store credit +20%</div>
              <div style={{ fontFamily: TSS.sans, fontWeight: 700, fontSize: 19, color: 'var(--up)' }}>{moneySS(credit, { cents: false })}</div>
            </div>
          </div>
        </div>
        <Bubble who="shop">Swing by today to finish? Bring the stack + ticket #{SUB_SS.ticket}.</Bubble>
        {reply && <Bubble who="me">{reply}</Bubble>}
        {reply && <Bubble who="shop">Perfect — see you then! We'll have it ready. 👋</Bubble>}
      </div>

      {/* quick replies */}
      <div style={{ padding: '10px 14px 30px', background: TSS.surface, borderTop: '1px solid var(--line)' }}>
        {!reply ? (
          <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            <QuickReply label={'Accept credit · ' + moneySS(credit, { cents: false })} primary onClick={() => { setReply('Accept store credit 🎁 — coming by after 5pm 👍'); app.toast('Offer accepted'); }} />
            <QuickReply label={'Take cash · ' + moneySS(cash, { cents: false })} onClick={() => { setReply('Cash works — I’ll come by after 5pm 👍'); app.toast('Offer accepted'); }} />
            <QuickReply label="Pick a time" onClick={() => setReply("What times work today? I'm flexible.")} />
          </div>
        ) : (
          <button onClick={onShop} style={{ width: '100%', background: TSS.surface2, color: TSS.ink, borderRadius: 13, padding: 13,
            fontFamily: TSS.sans, fontWeight: 700, fontSize: 14, boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Demo: see the shop's side →</button>
        )}
      </div>
    </div>
  );
}

function Bubble({ who, children }) {
  const me = who === 'me';
  return (
    <div style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '85%',
      background: me ? TSS.accent : TSS.surface, color: me ? '#fff' : TSS.ink,
      borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 13px',
      fontFamily: TSS.sans, fontSize: 13.5, lineHeight: 1.4, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}>
      {children}
    </div>
  );
}

function QuickReply({ label, primary, onClick }) {
  return (
    <button onClick={onClick} style={{ whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TSS.sans, fontWeight: 700, fontSize: 13.5,
      padding: '11px 16px', borderRadius: 999, background: primary ? TSS.accent : TSS.surface, color: primary ? '#fff' : TSS.ink2,
      boxShadow: primary ? '0 3px 10px oklch(0.52 0.2 264 / 0.3)' : 'inset 0 0 0 1.5px var(--line)' }}>{label}</button>
  );
}

Object.assign(window, { SellShopScreen, LiveSweep, Field });
