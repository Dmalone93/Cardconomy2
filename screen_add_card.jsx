// ─────────────────────────────────────────────────────────────
// Add Card — 3-step flow: find card → set condition → price paid
// ─────────────────────────────────────────────────────────────
const { T: TAC, money: moneyAC, CardArt: CardArtAC, Icon: IconAC } = window;
const { LISTINGS: LISTINGS_AC, GAMES: GAMES_AC, SETS: SETS_AC, byId: byIdAC, setById: setByIdAC, gameById: gameByIdAC, marketValue: marketValueAC, CONDITION_MULTIPLIERS: CM_AC } = window;

const RAW_GRADES = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const GRADED_COMPANIES = ['psa', 'bgs', 'cgc'];
const GRADED_SCORES = [10, 9.5, 9, 8];

function AddCardScreen({ app, params = {} }) {
  var preCard = params.cardId ? byIdAC(params.cardId) : null;
  var preColId = params.collectionId || null;

  var [step, setStep] = React.useState(preCard ? 2 : 1);
  var [card, setCard] = React.useState(preCard);

  // step 1 state
  var [search, setSearch] = React.useState('');
  var [browseGame, setBrowseGame] = React.useState(null);
  var [browseSet, setBrowseSet] = React.useState(null);

  // step 2 state
  var [condType, setCondType] = React.useState('raw');
  var [rawGrade, setRawGrade] = React.useState('NM');
  var [gradedCompany, setGradedCompany] = React.useState('psa');
  var [gradedScore, setGradedScore] = React.useState(10);

  // step 3 state
  var [paidPrice, setPaidPrice] = React.useState('');
  var [colId, setColId] = React.useState(preColId || (app.collections[0] ? app.collections[0].id : null));

  function currentMarketValue() {
    if (!card) return 0;
    return marketValueAC({
      cardId: card.id,
      condition: condType,
      rawGrade: condType === 'raw' ? rawGrade : null,
      gradedCompany: condType === 'graded' ? gradedCompany : null,
      gradedScore: condType === 'graded' ? gradedScore : null,
    });
  }

  function doAdd() {
    var paid = paidPrice === '' ? null : parseFloat(paidPrice);
    app.addOwnedCard(
      card.id,
      condType,
      condType === 'raw' ? rawGrade : null,
      condType === 'graded' ? gradedCompany : null,
      condType === 'graded' ? gradedScore : null,
      paid,
      colId
    );
    app.nav.pop();
  }

  function goBack() {
    if (step === 1 || (step === 2 && preCard)) app.nav.pop();
    else if (step === 2) { setStep(1); setCard(null); }
    else setStep(2);
  }

  var stepTitles = { 1: 'Find a card', 2: 'Set condition', 3: 'Price paid' };

  // ── HEADER (shared) ──
  var header = (
    <div style={{ padding: '14px 14px 12px', background: TAC.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={goBack} style={{ color: TAC.ink }}>{IconAC.back({})}</button>
      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 16, flex: 1 }}>{stepTitles[step]}</span>
      <span style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>Step {step} of 3</span>
    </div>
  );

  // ── STEP 1: Find card ──
  if (step === 1) {
    var searchResults = [];
    if (search.length >= 2) {
      var q = search.toLowerCase();
      searchResults = LISTINGS_AC.filter(function(l) {
        return l.name.toLowerCase().includes(q) || (l.subtitle || '').toLowerCase().includes(q);
      }).slice(0, 20);
    }

    var setsForGame = browseGame ? SETS_AC.filter(function(s) { return s.game === browseGame; }) : [];
    var cardsForSet = browseSet ? LISTINGS_AC.filter(function(l) { return l.set === browseSet; }) : [];

    function pickCard(c) {
      setCard(c);
      setStep(2);
      setSearch('');
      setBrowseGame(null);
      setBrowseSet(null);
    }

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
          {/* search */}
          <div style={{ padding: '14px 16px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TAC.surface2, borderRadius: 10, padding: '10px 12px', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              {IconAC.search({ style: { color: TAC.faint, flexShrink: 0 } })}
              <input value={search} onChange={function(e) { setSearch(e.target.value); setBrowseGame(null); setBrowseSet(null); }}
                placeholder="Search by card name\u2026"
                style={{ flex: 1, fontFamily: TAC.sans, fontSize: 14, color: TAC.ink, background: 'transparent', border: 'none', outline: 'none' }} />
              {search && <button onClick={function() { setSearch(''); }} style={{ color: TAC.muted, fontSize: 18, lineHeight: 1 }}>\u00d7</button>}
            </div>
          </div>

          {/* search results */}
          {search.length >= 2 && (
            <div style={{ padding: '0 16px' }}>
              {searchResults.length === 0 ? (
                <div style={{ fontFamily: TAC.sans, fontSize: 13, color: TAC.muted, padding: '12px 0' }}>No cards found for \u201c{search}\u201d</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {searchResults.map(function(item) {
                    var setObj = setByIdAC(item.set);
                    return (
                      <button key={item.id} onClick={function() { pickCard(item); }}
                        style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: 10, display: 'flex', gap: 11, alignItems: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                        <div style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}><CardArtAC item={item} w={44} radius={6} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>{setObj ? setObj.name.replace(/\s*\(.*\)/, '') : ''} {item.number ? '\u00b7 #' + item.number : ''}</div>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{moneyAC(item.market || item.price)}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* browse by game (when not searching) */}
          {!search && !browseGame && (
            <div style={{ padding: '4px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Browse by game</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GAMES_AC.filter(function(g) { return g && g.id; }).map(function(g) {
                  return (
                    <button key={g.id} onClick={function() { setBrowseGame(g.id); }}
                      style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <span style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15 }}>{g.name}</span>
                      {IconAC.chevron ? IconAC.chevron({ style: { color: TAC.faint } }) : <span style={{ color: TAC.faint }}>{'\u203A'}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* browse: sets for a game */}
          {browseGame && !browseSet && (
            <div style={{ padding: '4px 16px' }}>
              <button onClick={function() { setBrowseGame(null); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{'\u2190'} Back to games</button>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{(gameByIdAC(browseGame) || {}).name} \u2014 Sets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {setsForGame.map(function(s) {
                  return (
                    <button key={s.id} onClick={function() { setBrowseSet(s.id); }}
                      style={{ width: '100%', textAlign: 'left', background: TAC.surface, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div>
                        <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{s.name.replace(/\s*\(.*\)/, '')}</div>
                        <div style={{ fontFamily: TAC.sans, fontSize: 11, color: TAC.muted }}>{s.cards} cards \u00b7 {s.year}</div>
                      </div>
                      {IconAC.chevron ? IconAC.chevron({ style: { color: TAC.faint } }) : <span style={{ color: TAC.faint }}>{'\u203A'}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* browse: cards in a set */}
          {browseSet && (
            <div style={{ padding: '4px 16px' }}>
              <button onClick={function() { setBrowseSet(null); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{'\u2190'} Back to sets</button>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{(setByIdAC(browseSet) || {}).name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {cardsForSet.map(function(item) {
                  return (
                    <button key={item.id} onClick={function() { pickCard(item); }}
                      style={{ textAlign: 'center', background: TAC.surface, borderRadius: 10, padding: 8, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><CardArtAC item={item} w={80} radius={6} /></div>
                      <div style={{ fontFamily: TAC.sans, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontFamily: TAC.sans, fontSize: 10, color: TAC.muted }}>{moneyAC(item.market || item.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STEP 2: Set condition ──
  if (step === 2) {
    var mv = currentMarketValue();
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
          {/* card preview */}
          <div style={{ padding: '16px 16px 14px', display: 'flex', gap: 12, background: TAC.surface, borderBottom: '1px solid var(--line)' }}>
            <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtAC item={card} w={64} radius={8} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 15 }}>{card.name}</div>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted }}>{card.subtitle}</div>
            </div>
          </div>

          {/* condition type toggle */}
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Condition type</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['raw', 'graded'].map(function(t) {
                var active = condType === t;
                return (
                  <button key={t} onClick={function() { setCondType(t); }}
                    style={{ flex: 1, padding: '14px 0', borderRadius: 12, fontFamily: TAC.sans, fontWeight: 700, fontSize: 15,
                      background: active ? 'var(--ink)' : TAC.surface,
                      color: active ? '#fff' : TAC.ink,
                      border: active ? 'none' : '1.5px solid var(--line)',
                      boxShadow: active ? 'none' : '0 1px 3px rgba(20,24,40,0.05)' }}>
                    {t === 'raw' ? 'Raw' : 'Graded'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* raw grade chips */}
          {condType === 'raw' && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {RAW_GRADES.map(function(g) {
                  var active = rawGrade === g;
                  return (
                    <button key={g} onClick={function() { setRawGrade(g); }}
                      style={{ padding: '10px 18px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14,
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* graded: company + score */}
          {condType === 'graded' && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grading company</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {GRADED_COMPANIES.map(function(co) {
                  var active = gradedCompany === co;
                  return (
                    <button key={co} onClick={function() { setGradedCompany(co); }}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {co}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {GRADED_SCORES.map(function(sc) {
                  var active = gradedScore === sc;
                  return (
                    <button key={sc} onClick={function() { setGradedScore(sc); }}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 700, fontSize: 15,
                        background: active ? 'var(--ink)' : TAC.surface,
                        color: active ? '#fff' : TAC.ink,
                        border: active ? 'none' : '1.5px solid var(--line)' }}>
                      {sc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* market value preview */}
          <div style={{ padding: '0 16px', marginTop: 4 }}>
            <div style={{ background: 'var(--accent-wash)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: TAC.ink }}>
                {condType === 'graded' ? gradedCompany.toUpperCase() + ' ' + gradedScore : 'Raw ' + rawGrade} market value
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: TAC.ink }}>{moneyAC(mv)}</span>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TAC.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={function() { setStep(3); }}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TAC.sans, fontWeight: 700, fontSize: 16, background: 'var(--ink)', color: '#fff' }}>
            Next {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: Price paid + collection picker ──
  if (step === 3) {
    var mv3 = currentMarketValue();
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TAC.bg }}>
        {header}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
          {/* card + condition summary */}
          <div style={{ padding: '16px 16px 14px', display: 'flex', gap: 12, background: TAC.surface, borderBottom: '1px solid var(--line)' }}>
            <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><CardArtAC item={card} w={54} radius={6} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TAC.sans, fontWeight: 700, fontSize: 14 }}>{card.name}</div>
              <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted, marginTop: 2 }}>
                {condType === 'graded' ? gradedCompany.toUpperCase() + ' ' + gradedScore : 'Raw ' + rawGrade}
                {' \u00b7 Market: '}{moneyAC(mv3)}
              </div>
            </div>
          </div>

          {/* price input */}
          <div style={{ padding: '20px 16px 12px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 10 }}>What did you pay?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TAC.surface, borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <span style={{ fontFamily: TAC.sans, fontSize: 24, fontWeight: 700 }}>\u00a3</span>
              <input type="number" value={paidPrice} onChange={function(e) { setPaidPrice(e.target.value); }}
                placeholder="Optional"
                style={{ flex: 1, fontFamily: TAC.sans, fontSize: 24, fontWeight: 700, color: TAC.ink, background: 'transparent', border: 'none', outline: 'none' }} />
            </div>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, color: TAC.muted, marginTop: 8 }}>
              Current market value: {moneyAC(mv3)}
            </div>
            {paidPrice !== '' && (
              <button onClick={function() { setPaidPrice(''); }} style={{ fontFamily: TAC.sans, fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>
                Skip \u2014 I don\u2019t remember
              </button>
            )}
          </div>

          {/* collection picker */}
          <div style={{ padding: '8px 16px 16px' }}>
            <div style={{ fontFamily: TAC.sans, fontSize: 12, fontWeight: 600, color: TAC.muted, marginBottom: 8 }}>Add to collection</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {app.collections.map(function(c) {
                var active = colId === c.id;
                return (
                  <button key={c.id} onClick={function() { setColId(c.id); }}
                    style={{ padding: '10px 16px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 600, fontSize: 13,
                      background: active ? 'var(--ink)' : TAC.surface,
                      color: active ? '#fff' : TAC.ink,
                      border: active ? 'none' : '1.5px solid var(--line)' }}>
                    {c.name}
                  </button>
                );
              })}
              <button onClick={function() {
                var name = window.prompt && window.prompt('New collection name', '');
                if (name && name.trim()) {
                  var newId = app.addCollection(name.trim());
                  setColId(newId);
                }
              }} style={{ padding: '10px 16px', borderRadius: 10, fontFamily: TAC.sans, fontWeight: 600, fontSize: 13, color: 'var(--ink)', border: '1.5px dashed var(--line)', background: 'transparent' }}>
                + New
              </button>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div style={{ padding: '12px 16px 28px', background: TAC.surface, borderTop: '1px solid var(--line)' }}>
          <button onClick={doAdd} disabled={!colId}
            style={{ width: '100%', padding: 16, borderRadius: 14, fontFamily: TAC.sans, fontWeight: 700, fontSize: 16,
              background: colId ? 'var(--ink)' : TAC.surface2,
              color: colId ? '#fff' : TAC.muted }}>
            Add to collection
          </button>
        </div>
      </div>
    );
  }

  return null;
}

Object.assign(window, { AddCardScreen });
