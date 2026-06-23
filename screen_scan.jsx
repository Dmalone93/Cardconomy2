// ─────────────────────────────────────────────────────────────
// Scan card — camera mock, analyzing animation, result sheet
// ─────────────────────────────────────────────────────────────
const { T: TSC, money: moneySC, CardArt: CardArtSC, GradeChip: GradeChipSC, Delta: DeltaSC, Sheet: SheetSC, Icon: IconSC } = window;
const { LISTINGS: LISTINGS_SC, byId: byIdSC, setById: setByIdSC } = window;

const GRADES_SC = ['raw', 'nm', 'lp', 'mp', 'hp'];
const GRADE_LABELS_SC = { raw: 'Raw', nm: 'NM', lp: 'LP', mp: 'MP', hp: 'HP' };

function ScanScreen({ app, params = {} }) {
  const from = params.from || 'search';
  const [stage, setStage] = React.useState('camera');
  const [card, setCard] = React.useState(null);
  const [alts, setAlts] = React.useState([]);
  const [showAlts, setShowAlts] = React.useState(false);
  const [grade, setGrade] = React.useState('raw');
  const [torch, setTorch] = React.useState(false);

  // pick a random card that has art, plus 2-3 alternatives from same game
  function doCapture() {
    const withArt = LISTINGS_SC.filter(function (l) { return l.art; });
    if (!withArt.length) return;
    const picked = withArt[Math.floor(Math.random() * withArt.length)];
    const sameGame = withArt.filter(function (l) { return l.game === picked.game && l.id !== picked.id; });
    const shuffled = sameGame.sort(function () { return Math.random() - 0.5; });
    const altCards = shuffled.slice(0, Math.random() < 0.5 ? 2 : 3);
    setCard(picked);
    setAlts(altCards);
    setShowAlts(false);
    setGrade('raw');
    setStage('analyzing');
  }

  // auto-advance from analyzing to result
  React.useEffect(function () {
    if (stage !== 'analyzing') return;
    var timer = setTimeout(function () { setStage('result'); }, 1500);
    return function () { clearTimeout(timer); };
  }, [stage]);

  function swapCard(alt) {
    setCard(alt);
    setAlts(function (prev) { return prev.filter(function (a) { return a.id !== alt.id; }); });
    setShowAlts(false);
  }

  // action handlers
  function doListForSale() {
    app.nav.pop();
    app.nav.setTab('sell');
    app.toast("Card ready to list");
  }
  function doAddToCollection() {
    if (app.collections && app.collections.length > 0 && card) {
      app.addCardToCollection(app.collections[0].id, card.id);
      app.toast("Added to " + app.collections[0].name);
    } else {
      app.toast("No collection found");
    }
    app.nav.pop();
  }
  function doPriceCheck() {
    app.nav.pop();
    app.nav.push('product', { id: card.id });
  }
  function doViewListing() {
    app.nav.pop();
    app.nav.push('listing', { id: card.id });
  }

  var setObj = card ? setByIdSC(card.set) : null;

  // ── camera + analyzing stages ──
  if (stage === 'camera' || stage === 'analyzing') {
    var isAnalyzing = stage === 'analyzing';
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0a0a0a', display: 'flex', flexDirection: 'column', fontFamily: TSC.sans }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
          <button onClick={function () { app.nav.pop(); }} style={{ color: '#fff', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none' }}>
            {IconSC.back({})}
          </button>
          <span style={{ flex: 1, color: '#fff', fontWeight: 700, fontSize: 17 }}>Scan card</span>
          <button onClick={function () { setTorch(function (t) { return !t; }); }} style={{ fontSize: 22, background: 'none', border: 'none', color: torch ? '#f5c542' : '#fff', opacity: torch ? 1 : 0.6 }}>
            {IconSC.bolt({ width: 20, height: 20 })}
          </button>
        </div>

        {/* center guide */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 220, height: 308, borderRadius: 12,
            border: isAnalyzing ? ("2px solid " + TSC.accent) : '2px dashed rgba(255,255,255,0.3)',
            opacity: isAnalyzing ? 0.6 : 1,
            position: 'relative', overflow: 'hidden'
          }}>
            {isAnalyzing && (
              <div style={{
                position: 'absolute', inset: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                animation: 'ccShimmer 1.5s ease infinite'
              }} />
            )}
          </div>
          <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500 }}>
            {isAnalyzing ? "Identifying card..." : "Centre the card in the frame"}
          </div>
        </div>

        {/* bottom button */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 40px' }}>
          {isAnalyzing ? (
            <div style={{
              width: 68, height: 68, borderRadius: 999,
              border: '3px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                border: '3px solid ' + TSC.accent, borderTopColor: 'transparent',
                animation: 'ccBlink 1s infinite'
              }} />
            </div>
          ) : (
            <button onClick={doCapture} style={{
              width: 68, height: 68, borderRadius: 999,
              border: '3px solid #fff', background: 'none', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 999, background: '#fff' }} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── result stage ──
  var actionButtons = [];
  if (from === 'sell') {
    actionButtons = [
      { label: 'List for sale', primary: true, action: doListForSale },
      { label: 'Add to collection', primary: false, action: doAddToCollection },
      { label: 'Price check', primary: false, action: doPriceCheck }
    ];
  } else if (from === 'search') {
    actionButtons = [
      { label: 'View listing', primary: true, action: doViewListing },
      { label: 'Add to collection', primary: false, action: doAddToCollection },
      { label: 'List for sale', primary: false, action: doListForSale }
    ];
  } else {
    // collection
    actionButtons = [
      { label: 'Add to collection', primary: true, action: doAddToCollection },
      { label: 'List for sale', primary: false, action: doListForSale },
      { label: 'Price check', primary: false, action: doPriceCheck }
    ];
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0a0a0a', display: 'flex', flexDirection: 'column', fontFamily: TSC.sans }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
        <button onClick={function () { app.nav.pop(); }} style={{ color: '#fff', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none' }}>
          {IconSC.back({})}
        </button>
        <span style={{ flex: 1, color: '#fff', fontWeight: 700, fontSize: 17 }}>Scan result</span>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* bottom sheet */}
      <div style={{
        background: TSC.bg, borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        padding: '12px 20px 32px', animation: 'ccFade 0.3s ease'
      }}>
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: TSC.faint }} />
        </div>

        {/* card info */}
        {card && (
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 72, flexShrink: 0 }}>
              <CardArtSC item={card} w={72} radius={8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: TSC.ink, marginBottom: 2 }}>{card.name}</div>
              <div style={{ fontSize: 13, color: TSC.muted, marginBottom: 2 }}>{setObj ? setObj.name : ''}</div>
              <div style={{ fontSize: 12, color: TSC.muted, marginBottom: 6 }}>{card.number ? ("#" + card.number) : ''}</div>
              <GradeChipSC grade={{ company: grade === 'raw' ? 'raw' : 'raw', grade: grade }} />
            </div>
          </div>
        )}

        {/* grade selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {GRADES_SC.map(function (g) {
            var selected = grade === g;
            return (
              <button key={g} onClick={function () { setGrade(g); }} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                fontFamily: TSC.sans, cursor: 'pointer',
                background: selected ? TSC.ink : 'transparent',
                color: selected ? TSC.bg : TSC.ink,
                border: selected ? 'none' : ("1.5px solid " + TSC.faint)
              }}>
                {GRADE_LABELS_SC[g]}
              </button>
            );
          })}
        </div>

        {/* market price */}
        {card && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: TSC.muted, marginBottom: 4 }}>Market price</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: TSC.ink }}>{moneySC(card.market)}</span>
              {card.history && card.history.length >= 2 && (
                <DeltaSC from={card.history[card.history.length - 2]} to={card.history[card.history.length - 1]} />
              )}
            </div>
          </div>
        )}

        {/* divider */}
        <div style={{ height: 1, background: TSC.faint, margin: '0 0 16px' }} />

        {/* action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {actionButtons.map(function (btn) {
            return (
              <button key={btn.label} onClick={btn.action} style={{
                width: '100%', padding: '14px 0', borderRadius: 10, fontSize: 15, fontWeight: 600,
                fontFamily: TSC.sans, cursor: 'pointer',
                background: btn.primary ? TSC.accent : TSC.surface,
                color: btn.primary ? '#fff' : TSC.ink,
                border: btn.primary ? 'none' : ("1.5px solid " + TSC.faint)
              }}>
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* not the right card link */}
        <div style={{ textAlign: 'center', marginBottom: showAlts ? 12 : 0 }}>
          <button onClick={function () { setShowAlts(function (s) { return !s; }); }} style={{
            background: 'none', border: 'none', color: TSC.accent, fontSize: 13,
            fontWeight: 600, fontFamily: TSC.sans, cursor: 'pointer', textDecoration: 'underline'
          }}>
            Not the right card?
          </button>
        </div>

        {/* alternatives list */}
        {showAlts && alts.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {alts.map(function (alt) {
              var altSet = setByIdSC(alt.set);
              return (
                <button key={alt.id} onClick={function () { swapCard(alt); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '10px 8px', borderRadius: 10, border: 'none',
                  background: TSC.surface, marginBottom: 8, cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ width: 44, flexShrink: 0 }}>
                    <CardArtSC item={alt} w={44} radius={6} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: TSC.ink }}>{alt.name}</div>
                    <div style={{ fontSize: 12, color: TSC.muted }}>{altSet ? altSet.name : ''}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TSC.ink, flexShrink: 0 }}>
                    {moneySC(alt.market)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ScanScreen });
