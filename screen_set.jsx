// ─────────────────────────────────────────────────────────────
// Cardconomy Mobile — Set Detail Page
// ─────────────────────────────────────────────────────────────
const { T: TSt, money: moneySt, CardArt: CardArtSt, Icon: IconSt, GradeChip: GradeChipSt } = window;
const { LISTINGS: LISTINGS_ST, PRODUCTS: PRODUCTS_ST, setById: setByIdSt, gameById: gameByIdSt, SELLERS: SELLERS_ST, sellerByName: sellerByNameSt } = window;

function SetScreen({ app, params }) {
  const set = setByIdSt(params.id);
  if (!set) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 18 }}>Set not found</div>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 16, color: TSt.accent, fontFamily: TSt.sans, fontWeight: 600 }}>Go back</button>
      </div>
    </div>
  );

  const game = gameByIdSt(set.game);
  const [condFilter, setCondFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('popular');
  const [view, setView] = React.useState('grid');

  // All listings in this set
  let listings = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow');
  if (condFilter === 'graded') listings = listings.filter(l => l.grade && l.grade.company !== 'raw');
  else if (condFilter === 'raw') listings = listings.filter(l => !l.grade || l.grade.company === 'raw');

  // Sort
  if (sortBy === 'popular') listings.sort((a, b) => (b.watchers || 0) - (a.watchers || 0));
  else if (sortBy === 'price_asc') listings.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_desc') listings.sort((a, b) => b.price - a.price);

  // Highlights
  const mostWatched = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow')
    .sort((a, b) => (b.watchers || 0) - (a.watchers || 0)).slice(0, 6);
  const recentlyListed = LISTINGS_ST.filter(l => l.set === set.id && l.type === 'buynow')
    .slice(-6).reverse();

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: TSt.bg, paddingBottom: 96, animation: 'ccPushIn 0.26s ease' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 14px 0' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 34, height: 34, borderRadius: 999, background: TSt.surface,
          color: TSt.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)', flexShrink: 0 }}>
          {IconSt.back({})}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: TSt.sans, color: TSt.muted, overflow: 'hidden' }}>
          <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>\u203A</span>
          {game && <span onClick={() => app.nav.push('game', { id: game.id })} style={{ cursor: 'pointer', fontWeight: 600 }}>{game.short}</span>}
          {game && <span>\u203A</span>}
          <span style={{ color: TSt.ink, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{set.name.replace(/\s*\(.*\)/, '')}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: set.hue || 'var(--surface)', margin: '12px 14px 0', borderRadius: 16 }}>
        {set.img && <img src={set.img} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.5,
        }} />}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 16px 16px',
        }}>
          <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 22, color: '#fff',
            letterSpacing: -0.4, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{set.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {set.year} \u00B7 {set.cards} cards in set \u00B7 {listings.length} listed
          </div>
        </div>
      </div>

      {/* ── Most Watched ── */}
      {mostWatched.length > 0 && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink, padding: '0 14px', marginBottom: 10 }}>Most watched</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {mostWatched.map(l => (
              <div key={l.id} onClick={() => {
                const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
              }} style={{
                flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
              }}>
                <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtSt item={l} w={100} radius={6} />
                </div>
                <div style={{ padding: '6px 10px 10px' }}>
                  <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneySt(l.price)}</div>
                  {l.watchers > 0 && <div style={{ fontFamily: TSt.sans, fontSize: 10, color: TSt.muted, marginTop: 2 }}>{l.watchers} watching</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recently Listed ── */}
      {recentlyListed.length > 0 && (
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink, padding: '0 14px', marginBottom: 10 }}>Recently listed</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 14px 4px',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {recentlyListed.map(l => (
              <div key={l.id} onClick={() => {
                const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
              }} style={{
                flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
              }}>
                <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtSt item={l} w={100} radius={6} />
                </div>
                <div style={{ padding: '6px 10px 10px' }}>
                  <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div style={{ fontFamily: TSt.sans, fontSize: 10.5, color: TSt.muted, marginTop: 1 }}>{l.condition}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{moneySt(l.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Checklist header ── */}
      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TSt.ink }}>All listings</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setView('grid')} style={{
              width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: view === 'grid' ? 'var(--ink)' : 'var(--surface)', color: view === 'grid' ? '#fff' : 'var(--muted)',
              border: view === 'grid' ? 'none' : '1px solid var(--line)',
            }}>{IconSt.grid({ width: 14, height: 14 })}</button>
            <button onClick={() => setView('list')} style={{
              width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: view === 'list' ? 'var(--ink)' : 'var(--surface)', color: view === 'list' ? '#fff' : 'var(--muted)',
              border: view === 'list' ? 'none' : '1px solid var(--line)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Condition filter + sort */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['raw', 'Raw'], ['graded', 'Graded']].map(([k, l]) => {
            const on = condFilter === k;
            return (
              <button key={k} onClick={() => setCondFilter(k)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                background: on ? 'var(--ink)' : 'var(--surface)',
                color: on ? '#fff' : 'var(--ink)',
                border: on ? 'none' : '1px solid var(--line)',
              }}>{l}</button>
            );
          })}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            marginLeft: 'auto', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)',
            fontFamily: TSt.sans,
          }}>
            <option value="popular">Popular</option>
            <option value="price_asc">Price: low \u2192 high</option>
            <option value="price_desc">Price: high \u2192 low</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: TSt.muted, fontWeight: 600, marginBottom: 12 }}>
          Showing {listings.length} of {set.cards} cards
        </div>
      </div>

      {/* ── Grid / List ── */}
      <div style={{ padding: '0 14px' }}>
        {listings.length > 0 ? (
          view === 'grid' ? (
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {listings.map(l => (
                <div key={l.id} onClick={() => {
                  const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                  app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
                }} style={{
                  borderRadius: 12, overflow: 'hidden', background: '#fff',
                  border: '1px solid var(--line)', cursor: 'pointer',
                }}>
                  <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                    <CardArtSt item={l} w={120} radius={6} />
                    {l.grade && l.grade.company !== 'raw' && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
                        fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 999 }}>
                        {l.grade.company.toUpperCase()} {l.grade.grade}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '8px 12px 12px' }}>
                    <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 14, lineHeight: 1.15,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.subtitle || l.condition}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, marginTop: 6 }}>{moneySt(l.price)}</div>
                    {l.seller && (
                      <div onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: l.seller }); }}
                        style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, cursor: 'pointer' }}>
                        {l.seller}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {listings.map(l => (
                <button key={l.id} onClick={() => {
                  const prod = PRODUCTS_ST.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                  app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
                }} style={{
                  width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12,
                  padding: 10, display: 'flex', gap: 12, alignItems: 'center',
                  border: '1px solid var(--line)',
                }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 6, flexShrink: 0 }}>
                    <CardArtSt item={l} w={54} radius={4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TSt.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontFamily: TSt.sans, fontSize: 11, color: TSt.muted, marginTop: 1 }}>{l.condition}{l.foil ? ' \u00B7 Foil' : ''}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14, marginTop: 3 }}>{moneySt(l.price)}</div>
                  </div>
                  {l.grade && l.grade.company !== 'raw' && <GradeChipSt grade={l.grade} />}
                </button>
              ))}
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No cards listed yet</div>
            <div style={{ fontSize: 12, color: TSt.muted, marginTop: 4 }}>Be the first to sell a card from this set</div>
            <button onClick={() => app.nav.setTab('sell')}
              style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: TSt.accent }}>Start selling</button>
          </div>
        )}
      </div>

    </div>
  );
}

Object.assign(window, { SetScreen });
