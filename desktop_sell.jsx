// ─────────────────────────────────────────────────────────────
// CARDONOMY Desktop — Seller flows: hub, single-card wizard,
// bulk list (upload → detect → price → publish)
// ─────────────────────────────────────────────────────────────
const { T: TSl, money: mSl, CardArt: CardArtSl, GradeChip: GradeChipSl, Icon: IconSl } = window;
const { GAMES: GAMESSL, SETS: SETSSL, LISTINGS: LISTSL, setById: setByIdSL } = window;

const CATALOG_SL = LISTINGS.map(l => ({ name: l.name, subtitle: l.subtitle, game: l.game, set: l.set, number: l.number, art: l.art, foil: l.foil, market: l.market }));

// ── SELL HUB ─────────────────────────────────────────────────
function DSell({ app }) {
  const opts = [
    { k: 'single', tint: 'var(--accent)', icon: IconSl.tag, title: 'List a single card', meta: 'Buy It Now or auction', desc: 'Search the catalog, set condition, add photos and price one card with full control.', go: () => app.go('sell_single') },
    { k: 'bulk', tint: 'var(--gold)', icon: IconSl.bolt, title: 'Bulk list a stack', meta: 'Upload · auto-priced', desc: 'Drop a CSV or photos of many cards. We auto-price each at market — review and publish them all at once.', go: () => app.go('sell_bulk') },
    { k: 'shop', tint: '#2f8f5b', icon: IconSl.shield, title: 'Sell to a local shop', meta: 'In-person · cash or credit', desc: 'Got hundreds of cards? Start a submission and finish at the counter. Best on your phone.', go: () => app.toast('Continue on the Cardonomy app →') },
    { k: 'trade', tint: '#7c3aed', icon: IconSl.gavel, title: 'Trade with collectors', meta: 'Card-for-card', desc: 'Swap directly with nearby collectors and meet at a local shop. Available in the app.', go: () => app.toast('Continue on the Cardonomy app →') },
  ];
  return (
    <div className="wrap" style={{ padding: '36px 24px 30px' }}>
      <h1 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 34, letterSpacing: -1, margin: '0 0 8px' }}>Sell your cards</h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0 0 28px', maxWidth: 620, lineHeight: 1.5 }}>List to buyers worldwide with Buyer Protection, or move a whole collection at once. Pick how you want to sell.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {opts.map(o => (
          <button key={o.k} onClick={o.go} style={{ textAlign: 'left', background: 'var(--surface)', borderRadius: 18, padding: 24, boxShadow: '0 1px 3px rgba(20,24,40,0.06)', transition: 'box-shadow 0.18s, transform 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(20,24,40,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(20,24,40,0.06)'; e.currentTarget.style.transform = 'none'; }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: o.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{o.icon({ width: 26, height: 26 })}</span>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>{o.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2, marginBottom: 10 }}>{o.meta}</div>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>{o.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── SINGLE-CARD WIZARD ───────────────────────────────────────
const STEPS_SL = ['Card', 'Condition', 'Photos', 'Price', 'Review'];

function DSellSingle({ app }) {
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [card, setCard] = React.useState(null);
  const [graded, setGraded] = React.useState(false);
  const [grader, setGrader] = React.useState('psa');
  const [grade, setGrade] = React.useState(10);
  const [cond, setCond] = React.useState('Near Mint');
  const [photos, setPhotos] = React.useState([true, false, false, false]);
  const [listType, setListType] = React.useState('buynow');
  const [price, setPrice] = React.useState('');

  const matches = CATALOG_SL.filter(c => !q || (c.name + ' ' + (setByIdSL(c.set)?.name || '')).toLowerCase().includes(q.toLowerCase()));
  const gradeObj = graded ? { company: grader, grade } : { company: 'raw' };
  const suggested = card ? Math.round(card.market * (graded ? (grade >= 10 ? 1.6 : grade >= 9.5 ? 1.3 : 1.05) : 1)) : 0;
  const photoCount = photos.filter(Boolean).length;
  const canNext = [!!card, true, photoCount >= 1, !!price && +price > 0, true][step];

  if (done) return (
    <div className="wrap" style={{ padding: '70px 24px', textAlign: 'center' }}>
      <div style={{ width: 88, height: 88, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'dPop 0.4s ease' }}>{IconSl.check({ width: 46, height: 46 })}</div>
      <h1 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 30, margin: '20px 0 6px' }}>Your card is live!</h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 400, margin: '0 auto 8px' }}>{card.name} is listed for {mSl(+price)}. We'll notify you on every offer and sale.</p>
      <div style={{ margin: '20px auto', display: 'inline-block', background: 'var(--surface)', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }}><CardArtSl item={{ ...card, grade: gradeObj }} w={120} /></div>
      <div><button onClick={() => app.go('home')} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 15 }}>Back to browse</button></div>
    </div>
  );

  return (
    <div className="wrap" style={{ padding: '28px 24px 30px', maxWidth: 980 }}>
      <button onClick={() => step === 0 ? app.go('sell') : setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>‹ {step === 0 ? 'All sell options' : 'Back'}</button>
      {/* stepper */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {STEPS_SL.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 5, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background 0.3s' }} />
            <div style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i <= step ? 'var(--accent)' : 'var(--faint)', marginTop: 6 }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: card ? '1fr 300px' : '1fr', gap: 30, alignItems: 'start' }} className="sell-grid">
        <div>
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 24, margin: '0 0 4px' }}>What are you selling?</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '0 0 18px' }}>Search our catalog to auto-fill the details.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderRadius: 12, padding: '12px 16px', boxShadow: 'inset 0 0 0 1px var(--line)', marginBottom: 16 }}>
                {IconSl.search({ width: 19, height: 19, style: { color: 'var(--faint)' } })}
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Charizard ex 151" autoFocus style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15.5 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {matches.map((c, i) => {
                  const sel = card && card.name === c.name && card.number === c.number;
                  return (
                    <button key={i} onClick={() => setCard(c)} style={{ textAlign: 'left', background: 'var(--surface)', borderRadius: 13, padding: 12, boxShadow: sel ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--surface-2)', borderRadius: 9, padding: 8, marginBottom: 8 }}><CardArtSl item={c} w={70} /></div>
                      <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>mkt {mSl(c.market, { cents: false })}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 24, margin: '0 0 18px' }}>Condition &amp; grading</h2>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', borderRadius: 14, padding: '16px 18px', marginBottom: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div><div style={{ fontWeight: 700, fontSize: 15.5 }}>Professionally graded</div><div style={{ fontSize: 13, color: 'var(--muted)' }}>In a PSA / BGS / CGC slab</div></div>
                <Toggle on={graded} onClick={() => setGraded(!graded)} />
              </label>
              {graded ? (
                <div>
                  <Label>Grading company</Label>
                  <ChipRow opts={['psa', 'bgs', 'cgc']} val={grader} set={setGrader} fmt={x => x.toUpperCase()} />
                  <Label>Grade</Label>
                  <ChipRow opts={[10, 9.5, 9, 8.5, 8, 7]} val={grade} set={setGrade} />
                </div>
              ) : (
                <div><Label>Raw condition</Label><ChipRow opts={['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played']} val={cond} set={setCond} /></div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 24, margin: '0 0 4px' }}>Add photos</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '0 0 18px' }}>Front, back, and any flaws. Clear photos sell faster.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {photos.map((on, i) => (
                  <button key={i} onClick={() => setPhotos(photos.map((p, j) => j === i ? !p : p))} style={{ aspectRatio: '3/4', borderRadius: 14, position: 'relative', overflow: 'hidden',
                    background: on ? card.art : 'var(--surface)', boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, color: on ? '#fff' : 'var(--faint)' }}>
                    {on ? <React.Fragment><div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 8px, transparent 8px 16px)' }} /><span style={{ position: 'relative', fontFamily: TSl.mono, fontSize: 12, opacity: 0.9 }}>photo {i + 1}</span></React.Fragment>
                      : <React.Fragment>{IconSl.camera({ width: 26, height: 26 })}<span style={{ fontSize: 12.5, fontWeight: 600 }}>{i === 0 ? 'Front' : i === 1 ? 'Back' : 'Add'}</span></React.Fragment>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: 'var(--muted)', fontSize: 13 }}>{IconSl.camera({ width: 16, height: 16 })} Click a frame to add — or drag &amp; drop image files. {photoCount} of 4 added.</div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 24, margin: '0 0 18px' }}>Set your price</h2>
              <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                {[['buynow', IconSl.bolt, 'Buy It Now', 'Fixed price'], ['auction', IconSl.gavel, 'Auction', 'Let buyers bid']].map(([v, ic, t, s]) => (
                  <button key={v} onClick={() => setListType(v)} style={{ flex: 1, textAlign: 'left', padding: 16, borderRadius: 14, background: listType === v ? 'var(--accent-wash)' : 'var(--surface)', boxShadow: listType === v ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>
                    <div style={{ color: listType === v ? 'var(--accent)' : 'var(--muted)', marginBottom: 6 }}>{ic({ width: 20, height: 20 })}</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s}</div>
                  </button>
                ))}
              </div>
              <Label>{listType === 'auction' ? 'Starting bid' : 'Your price'}</Label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', borderRadius: 14, padding: '14px 18px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                <span style={{ fontFamily: TSl.mono, fontWeight: 700, fontSize: 28, color: 'var(--muted)', marginRight: 6 }}>$</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={String(suggested)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TSl.mono, fontWeight: 700, fontSize: 28, minWidth: 0 }} />
              </div>
              <button onClick={() => setPrice(String(suggested))} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'var(--accent-wash)', borderRadius: 12, padding: '13px 16px', textAlign: 'left' }}>
                <span style={{ color: 'var(--accent)' }}>{IconSl.tag({ width: 18, height: 18 })}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink-2)' }}>Suggested <b>{mSl(suggested)}</b> from recent {graded ? grader.toUpperCase() + ' ' + grade : 'raw'} sales</span>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--accent)' }}>Use</span>
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 24, margin: '0 0 18px' }}>Review listing</h2>
              <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                {[['Format', listType === 'auction' ? 'Auction' : 'Buy It Now'], ['Condition', graded ? grader.toUpperCase() + ' ' + grade : cond], ['Photos', photoCount + ' added'], ['List price', mSl(+price || suggested)], ['Seller fee', mSl((+price || suggested) * 0.09) + ' (9%)']].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-2)', fontSize: 14.5 }}><span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14 }}><span style={{ fontWeight: 700, fontSize: 16 }}>You earn</span><span style={{ fontFamily: TSl.mono, fontWeight: 700, fontSize: 20, color: 'var(--up)' }}>{mSl((+price || suggested) * 0.91)}</span></div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 26 }}>
            <button onClick={() => step < 4 ? setStep(step + 1) : setDone(true)} disabled={!canNext} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '14px 30px', fontWeight: 700, fontSize: 16, opacity: canNext ? 1 : 0.45 }}>
              {step < 4 ? 'Continue' : 'List it for ' + mSl(+price || suggested)}
            </button>
          </div>
        </div>

        {/* live preview */}
        {card && (
          <aside style={{ position: 'sticky', top: 130, background: 'var(--surface)', borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.06)' }} className="sell-preview">
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.4, marginBottom: 12 }}>LIVE PREVIEW</div>
            <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--surface-2)', borderRadius: 12, padding: 14, marginBottom: 12 }}><CardArtSl item={{ ...card, grade: gradeObj }} w={130} /></div>
            <div style={{ marginBottom: 4 }}><GradeChipSl grade={gradeObj} /></div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{card.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{setByIdSL(card.set)?.name} · {card.number}</div>
            <div style={{ fontFamily: TSl.mono, fontWeight: 700, fontSize: 22, marginTop: 8 }}>{price ? mSl(+price) : (suggested ? mSl(suggested) : '—')}</div>
          </aside>
        )}
      </div>
      <style>{`@media (max-width: 760px){ .sell-grid{ grid-template-columns: 1fr !important; } .sell-preview{ position: static !important; } }`}</style>
    </div>
  );
}

// ── BULK LIST (upload → detect → price → publish) ────────────
const STRATS_SL = [['market', 'At market', 1.0], ['under', 'Undercut 5%', 0.95], ['quick', 'Quick sale', 0.9]];

function DSellBulk({ app }) {
  const [phase, setPhase] = React.useState('upload'); // upload | review | done
  const [strat, setStrat] = React.useState('market');
  const [excluded, setExcluded] = React.useState({});
  const [dragOver, setDragOver] = React.useState(false);
  const detected = window.SUB_CARDS || [];
  const mult = STRATS_SL.find(s => s[0] === strat)[2];
  const included = detected.filter(c => !excluded[c.id]);
  const priceEach = (c) => Math.round(c.market * mult * (c.qty || 1));
  const gross = included.reduce((s, c) => s + priceEach(c), 0);
  const net = Math.round(gross * 0.91);

  if (phase === 'done') return (
    <div className="wrap" style={{ padding: '70px 24px', textAlign: 'center' }}>
      <div style={{ width: 88, height: 88, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'dPop 0.4s ease' }}>{IconSl.check({ width: 46, height: 46 })}</div>
      <h1 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 30, margin: '20px 0 6px' }}>{included.length} cards listed!</h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 420, margin: '0 auto' }}>Your cards are live on the marketplace. You'll be notified on every sale and offer.</p>
      <button onClick={() => app.go('home')} style={{ marginTop: 24, background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 15 }}>Back to browse</button>
    </div>
  );

  return (
    <div className="wrap" style={{ padding: '28px 24px 30px', maxWidth: 1040 }}>
      <button onClick={() => phase === 'upload' ? app.go('sell') : setPhase('upload')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>‹ {phase === 'upload' ? 'All sell options' : 'Back'}</button>
      <h1 style={{ fontFamily: TSl.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, margin: '0 0 6px' }}>Bulk list to the marketplace</h1>

      {phase === 'upload' && (
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 15.5, margin: '0 0 24px', maxWidth: 600 }}>Upload a collection export (CSV from Manabox, TCGplayer, Dragon Shield) or drop photos of your cards. We'll identify each one and price it at market.</p>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); setPhase('review'); }} onClick={() => setPhase('review')}
            style={{ border: '2.5px dashed ' + (dragOver ? 'var(--accent)' : 'var(--line)'), background: dragOver ? 'var(--accent-wash)' : 'var(--surface)', borderRadius: 18, padding: '56px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
            <div style={{ width: 60, height: 60, margin: '0 auto 16px', borderRadius: 16, background: 'var(--accent-wash)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Drop your CSV or photos here</div>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>or <span style={{ color: 'var(--accent)', fontWeight: 700 }}>browse files</span> · CSV, JPG, PNG up to 50MB</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, color: 'var(--muted)', fontSize: 13.5 }}>{IconSl.bolt({ width: 16, height: 16, style: { color: 'var(--accent)' } })} Demo: click the box to load a sample 10-card collection.</div>
        </div>
      )}

      {phase === 'review' && (
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 15, margin: '4px 0 20px' }}>We identified <b style={{ color: 'var(--ink)' }}>{detected.length} cards</b> and priced each from market. Pick a strategy, exclude any, then publish.</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {STRATS_SL.map(([k, l]) => (
              <button key={k} onClick={() => setStrat(k)} style={{ padding: '11px 18px', borderRadius: 12, fontWeight: 700, fontSize: 14, background: strat === k ? 'var(--accent-wash)' : 'var(--surface)', color: strat === k ? 'var(--accent)' : 'var(--ink-2)', boxShadow: strat === k ? 'inset 0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)' }}>{l}</button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 14 }}>
              <span style={{ color: 'var(--muted)' }}>{included.length} listing · gross <b style={{ color: 'var(--ink)', fontFamily: TSl.mono }}>{mSl(gross)}</b></span>
              <button onClick={() => setPhase('done')} disabled={!included.length} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 11, padding: '12px 22px', fontWeight: 700, fontSize: 15, opacity: included.length ? 1 : 0.45 }}>Publish {included.length}</button>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 110px 70px', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line)', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
              <span>CARD</span><span>CONDITION</span><span>QTY</span><span>LIST PRICE</span><span>INCLUDE</span>
            </div>
            {detected.map(c => {
              const ex = !!excluded[c.id];
              return (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 110px 70px', gap: 12, padding: '11px 18px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', opacity: ex ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <div style={{ background: 'var(--surface-2)', borderRadius: 7, padding: 4, flexShrink: 0 }}><CardArtSl item={c} w={30} radius={4} /></div>
                    <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}{c.flag && <span style={{ color: 'var(--down)' }}> ⚠</span>}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{setByIdSL(c.set)?.name?.replace(/\s*\(.*\)/, '')}</div></div>
                  </div>
                  <span><GradeChipSl grade={c.grade} /></span>
                  <span style={{ fontFamily: TSl.mono, fontSize: 13.5 }}>×{c.qty}</span>
                  <span style={{ fontFamily: TSl.mono, fontWeight: 700, fontSize: 14, textDecoration: ex ? 'line-through' : 'none' }}>{mSl(priceEach(c), { cents: false })}</span>
                  <button onClick={() => setExcluded(e => ({ ...e, [c.id]: !e[c.id] }))} style={{ width: 26, height: 26, borderRadius: 999, justifySelf: 'start', background: ex ? 'var(--surface-2)' : 'var(--accent)', color: ex ? 'var(--muted)' : '#fff', boxShadow: ex ? 'inset 0 0 0 1.5px var(--line)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{ex ? '+' : '✓'}</button>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 26, marginTop: 16, fontSize: 15 }}>
            <span style={{ color: 'var(--muted)' }}>You earn after 9% fee: <b style={{ color: 'var(--up)', fontFamily: TSl.mono, fontSize: 17 }}>{mSl(net)}</b></span>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }) { return <div style={{ fontWeight: 700, fontSize: 14, margin: '0 0 10px' }}>{children}</div>; }
function ChipRow({ opts, val, set, fmt }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 20 }}>{opts.map(o => (
    <button key={o} onClick={() => set(o)} style={{ padding: '9px 16px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: val === o ? 'var(--accent)' : 'var(--surface)', color: val === o ? '#fff' : 'var(--ink-2)', boxShadow: val === o ? 'none' : 'inset 0 0 0 1px var(--line)' }}>{fmt ? fmt(o) : o}</button>
  ))}</div>;
}
function Toggle({ on, onClick }) {
  return <button onClick={onClick} style={{ width: 52, height: 30, borderRadius: 999, padding: 3, background: on ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: on ? 'translateX(22px)' : 'none', transition: 'transform 0.2s' }} /></button>;
}

Object.assign(window, { DSell, DSellSingle, DSellBulk });
