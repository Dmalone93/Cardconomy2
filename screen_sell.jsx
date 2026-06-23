// ─────────────────────────────────────────────────────────────
// Sell a card — multi-step listing flow
// ─────────────────────────────────────────────────────────────
const { T: TSE, money: moneySE, CardArt: CardArtSE, GradeChip: GradeChipSE, Chip: ChipSE, Icon: IconSE } = window;
const { LISTINGS: LISTINGS_SE, SETS: SETS_SE, GAMES: GAMES_SE, gameById: gameByIdSE, setById: setByIdSE } = window;
const { ToggleSwitch: ToggleSwitchSE } = window;

const STEPS = ['Card', 'Condition', 'Photos', 'Price', 'Review'];

// catalog to pick from (card identities)
const CATALOG = LISTINGS_SE.map(l => ({ name: l.name, subtitle: l.subtitle, game: l.game, set: l.set, number: l.number, art: l.art, foil: l.foil, market: l.market }));

function Stepper({ step }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px 4px' }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ flex: 1 }}>
          <div style={{ height: 4, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background 0.3s' }} />
          <div style={{ fontFamily: TSE.sans, fontSize: 10.5, fontWeight: i===step?700:500, color: i<=step?TSE.accent:TSE.faint, marginTop: 5 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

function SellScreen({ app }) {
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
  const [freeShip, setFreeShip] = React.useState(true);
  const [days, setDays] = React.useState(7);

  const matches = CATALOG.filter(c => !q || (c.name + ' ' + (setByIdSE(c.set)?.name||'')).toLowerCase().includes(q.toLowerCase()));
  const photoCount = photos.filter(Boolean).length;
  const gradeObj = graded ? { company: grader, grade } : { company: 'raw' };
  const suggested = card ? Math.round(card.market * (graded ? (grade>=10?1.6:grade>=9.5?1.3:1.05) : 1)) : 0;

  const canNext = [!!card, true, photoCount >= 1, !!price && +price > 0, true][step];

  function reset() {
    setStep(0); setDone(false); setQ(''); setCard(null); setGraded(false); setGrade(10);
    setCond('Near Mint'); setPhotos([true,false,false,false]); setListType('buynow'); setPrice(''); setFreeShip(true);
  }

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: TSE.bg, padding: 32, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 20, animation: 'ccPop 0.4s ease' }}>{IconSE.check({ width: 44, height: 44 })}</div>
        <h2 style={{ margin: 0, fontFamily: TSE.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>Your card is live!</h2>
        <p style={{ fontFamily: TSE.sans, fontSize: 14.5, color: TSE.muted, lineHeight: 1.5, marginTop: 10, maxWidth: 280 }}>
          {card.name} is now listed for {moneySE(+price)}. We'll notify you when it sells or gets an offer.
        </p>
        <div style={{ marginTop: 20 }}><CardArtSE item={{ ...card, grade: gradeObj }} w={110} /></div>
        <button onClick={reset} style={{ marginTop: 26, background: 'var(--ink)', color: '#fff', borderRadius: 4, padding: '14px 28px', fontFamily: TSE.sans, fontWeight: 700, fontSize: 16 }}>List another card</button>
        <button onClick={() => { reset(); app.nav.pop(); }} style={{ marginTop: 10, color: TSE.muted, fontFamily: TSE.sans, fontWeight: 600, fontSize: 14 }}>Back to selling</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TSE.bg }}>
      {/* header */}
      <div style={{ padding: '14px 0 12px', background: TSE.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 14px' }}>
          <button onClick={() => step === 0 ? app.nav.pop() : setStep(step-1)} style={{ color: TSE.ink, fontFamily: TSE.sans, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
            {IconSE.back({ width: 18, height: 18 })} {step===0 ? 'Cancel' : 'Back'}
          </button>
          <span style={{ fontFamily: TSE.sans, fontWeight: 800, fontSize: 16 }}>List a card</span>
          <span style={{ fontFamily: TSE.sans, fontSize: 13, color: TSE.muted, width: 40, textAlign: 'right' }}>{step+1}/5</span>
        </div>
        <Stepper step={step} />
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '18px 16px 16px' }}>
        {/* STEP 0 — pick card */}
        {step === 0 && (
          <div>
            <h2 style={{ margin: '0 0 4px', fontFamily: TSE.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>What are you selling?</h2>
            <p style={{ fontFamily: TSE.sans, fontSize: 13.5, color: TSE.muted, margin: '0 0 14px' }}>Search our catalog to auto-fill the card details.</p>
            <button onClick={() => app.nav.push('scan', { from: 'sell' })} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 14px', background: 'var(--fill)', color: '#fff', borderRadius: 4,
              fontFamily: TSE.sans, fontWeight: 700, fontSize: 14, marginBottom: 14,
            }}>
              {IconSE.camera ? IconSE.camera({ width: 18, height: 18 }) : null} Scan a card
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TSE.surface, borderRadius: 4, padding: '11px 14px', boxShadow: 'inset 0 0 0 1px var(--line)', marginBottom: 14 }}>
              {IconSE.search({ width: 18, height: 18, style: { color: TSE.faint } })}
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Charizard ex 151" autoFocus
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TSE.sans, fontSize: 15, minWidth: 0 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {matches.map((c, i) => {
                const sel = card && card.name === c.name && card.number === c.number;
                return (
                  <button key={i} onClick={() => setCard(c)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    background: TSE.surface, borderRadius: 4, padding: 10, boxShadow: sel ? 'inset 0 0 0 2px var(--accent)' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ background: TSE.surface2, borderRadius: 9, padding: 6 }}><CardArtSE item={c} w={42} radius={5} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontFamily: TSE.sans, fontSize: 12, color: TSE.muted }}>{setByIdSE(c.set)?.name} · {c.number}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: TSE.sans, fontSize: 10.5, color: TSE.muted }}>market</div>
                      <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5 }}>{moneySE(c.market)}</div>
                    </div>
                    {sel && <div style={{ color: TSE.accent }}>{IconSE.check({})}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — condition */}
        {step === 1 && (
          <div>
            <h2 style={{ margin: '0 0 14px', fontFamily: TSE.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>Condition & grading</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: TSE.surface, borderRadius: 4, padding: '15px 16px', marginBottom: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 15 }}>Professionally graded</div>
                <div style={{ fontFamily: TSE.sans, fontSize: 12.5, color: TSE.muted }}>In a PSA / BGS / CGC slab</div>
              </div>
              <ToggleSwitchSE on={graded} onClick={() => setGraded(!graded)} />
            </div>

            {graded ? (
              <div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 9 }}>Grading company</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  {['psa','bgs','cgc'].map(gr => <ChipSE key={gr} active={grader===gr} onClick={() => setGrader(gr)}>{gr.toUpperCase()}</ChipSE>)}
                </div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 9 }}>Grade</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[10, 9.5, 9, 8.5, 8, 7].map(gv => <ChipSE key={gv} active={grade===gv} onClick={() => setGrade(gv)}>{gv}</ChipSE>)}
                </div>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 6, fontFamily: TSE.sans, fontSize: 13, color: TSE.up, fontWeight: 600 }}>
                  {IconSE.shield({ width: 15, height: 15 })} Graded cards verified by Cardonomy sell ~40% faster.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 9 }}>Raw condition</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'].map(c => (
                    <ChipSE key={c} active={cond===c} onClick={() => setCond(c)}>{c}</ChipSE>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — photos */}
        {step === 2 && (
          <div>
            <h2 style={{ margin: '0 0 4px', fontFamily: TSE.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>Add photos</h2>
            <p style={{ fontFamily: TSE.sans, fontSize: 13.5, color: TSE.muted, margin: '0 0 16px' }}>Front, back, and any flaws. Clear photos sell faster.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {photos.map((on, i) => (
                <button key={i} onClick={() => setPhotos(photos.map((p,j) => j===i ? !p : p))} style={{
                  aspectRatio: '1', borderRadius: 4, position: 'relative', overflow: 'hidden',
                  background: on ? card.art : TSE.surface,
                  boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--line)',
                  border: on ? 'none' : '2px dashed transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: on ? '#fff' : TSE.faint }}>
                  {on ? (
                    <React.Fragment>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 8px, transparent 8px 16px)' }} />
                      <div style={{ position: 'relative', fontFamily: TSE.sans, fontSize: 11, fontWeight: 600, opacity: 0.9 }}>photo {i+1}</div>
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.9)', color: card.art, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>×</div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {IconSE.camera({ width: 26, height: 26 })}
                      <span style={{ fontFamily: TSE.sans, fontSize: 12, fontWeight: 600 }}>{i===0?'Front':i===1?'Back':'Add'}</span>
                    </React.Fragment>
                  )}
                </button>
              ))}
            </div>
            <div style={{ fontFamily: TSE.sans, fontSize: 12.5, color: TSE.muted, marginTop: 14, textAlign: 'center' }}>{photoCount} of 4 added</div>
          </div>
        )}

        {/* STEP 3 — price */}
        {step === 3 && (
          <div>
            <h2 style={{ margin: '0 0 14px', fontFamily: TSE.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>Set your price</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setListType('buynow')} style={{ flex: 1, padding: 14, borderRadius: 4, textAlign: 'left',
                background: listType==='buynow'?'var(--accent-wash)':TSE.surface, boxShadow: listType==='buynow'?'inset 0 0 0 2px var(--accent)':'inset 0 0 0 1px var(--line)' }}>
                <div style={{ color: listType==='buynow'?TSE.accent:TSE.muted, marginBottom: 4 }}>{IconSE.bolt({width:18,height:18})}</div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 14.5 }}>Buy It Now</div>
                <div style={{ fontFamily: TSE.sans, fontSize: 11.5, color: TSE.muted }}>Fixed price</div>
              </button>
              <button onClick={() => setListType('auction')} style={{ flex: 1, padding: 14, borderRadius: 4, textAlign: 'left',
                background: listType==='auction'?'var(--accent-wash)':TSE.surface, boxShadow: listType==='auction'?'inset 0 0 0 2px var(--accent)':'inset 0 0 0 1px var(--line)' }}>
                <div style={{ color: listType==='auction'?TSE.accent:TSE.muted, marginBottom: 4 }}>{IconSE.gavel({width:18,height:18})}</div>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 14.5 }}>Auction</div>
                <div style={{ fontFamily: TSE.sans, fontSize: 11.5, color: TSE.muted }}>Let buyers bid</div>
              </button>
            </div>

            <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{listType==='auction'?'Starting bid':'Your price'}</div>
            <div style={{ display: 'flex', alignItems: 'center', background: TSE.surface, borderRadius: 4, padding: '14px 16px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              <span style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 28, color: TSE.muted, marginRight: 4 }}>£</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={String(suggested)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TSE.sans, fontWeight: 700, fontSize: 28, minWidth: 0 }} />
            </div>
            <button onClick={() => setPrice(String(suggested))} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              background: 'var(--accent-wash)', borderRadius: 4, padding: '11px 14px', textAlign: 'left' }}>
              <span style={{ color: TSE.accent }}>{IconSE.tag({})}</span>
              <span style={{ flex: 1, fontFamily: TSE.sans, fontSize: 13, color: TSE.ink2 }}>Suggested: <b>{moneySE(suggested)}</b> based on recent {graded?grader.toUpperCase()+' '+grade:'raw'} sales</span>
              <span style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13, color: TSE.accent }}>Use</span>
            </button>

            {listType==='auction' && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 13.5, marginBottom: 9 }}>Duration</div>
                <div style={{ display: 'flex', gap: 8 }}>{[3,5,7,10].map(d => <ChipSE key={d} active={days===d} onClick={() => setDays(d)}>{d} days</ChipSE>)}</div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, background: TSE.surface, borderRadius: 4, padding: '14px 16px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <span style={{ fontFamily: TSE.sans, fontWeight: 600, fontSize: 14.5 }}>Offer free postage</span>
              <ToggleSwitchSE on={freeShip} onClick={() => setFreeShip(!freeShip)} />
            </label>
          </div>
        )}

        {/* STEP 4 — review */}
        {step === 4 && (
          <div>
            <h2 style={{ margin: '0 0 14px', fontFamily: TSE.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>Review listing</h2>
            <div style={{ background: TSE.surface, borderRadius: 4, padding: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ background: TSE.surface2, borderRadius: 10, padding: 8 }}><CardArtSE item={{...card, grade: gradeObj}} w={70} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}><GradeChipSE grade={gradeObj} size="lg" /></div>
                  <div style={{ fontFamily: TSE.sans, fontWeight: 800, fontSize: 17 }}>{card.name}</div>
                  <div style={{ fontFamily: TSE.sans, fontSize: 12.5, color: TSE.muted }}>{setByIdSE(card.set)?.name} · {card.number}</div>
                  <div style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 22, marginTop: 8 }}>{moneySE(+price)}</div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                {[['Format', listType==='auction'?days+'-day auction':'Buy It Now'],
                  ['Condition', graded ? grader.toUpperCase()+' '+grade : cond],
                  ['Photos', photoCount + ' added'],
                  ['Postage', freeShip ? 'Free Royal Mail (you pay)' : 'Buyer pays'],
                  ['Seller fee', moneySE(+price * 0.09) + ' (9%)']].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line-2)', fontFamily: TSE.sans, fontSize: 14 }}>
                    <span style={{ color: TSE.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontFamily: TSE.sans }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>You earn</span>
                  <span style={{ fontFamily: TSE.sans, fontWeight: 700, fontSize: 18, color: TSE.up }}>{moneySE(+price * 0.91 + (freeShip?-4:0))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
        <button onClick={() => step < 4 ? setStep(step+1) : setDone(true)} disabled={!canNext} style={{
          width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 4, padding: 16, fontFamily: TSE.sans, fontWeight: 700, fontSize: 16,
          opacity: canNext ? 1 : 0.45, boxShadow: canNext ? '0 4px 14px oklch(0.52 0.2 264 / 0.35)' : 'none' }}>
          {step < 4 ? 'Continue' : 'List it for ' + (price ? moneySE(+price) : '')}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { SellScreen });
