// ─────────────────────────────────────────────────────────────
// Cardconomy Mobile — TCG Game Landing Screen
// ─────────────────────────────────────────────────────────────
const { T: TGM, money: mGM, CardArt: CardArtGM, Icon: IconGM } = window;
const { GAMES: GAMESGM, SETS: SETSGM, LISTINGS: LISTSGM, gameById: gameByIdGM, GAME_LOGOS: GAME_LOGOS_GM } = window;
const { SELLERS: SELLERS_GM, sellerByName: sellerByNameGM, listingsBySeller: listingsBySellerGM } = window;

const GAME_HEROES_GM = {
  pkmn: 'logos/heroes/pkmn.avif', mtg: 'logos/heroes/mtg.jpg',
  ygo: 'logos/heroes/ygo.jpg', lor: 'logos/heroes/lor.webp',
  digimon: 'logos/heroes/digimon.jpg',
};

const SET_BANNERS_GM = {
  pkmn: [
    { img: 'sets/pkmn/sv10-banner.png', set: 'ssp', label: 'Surging Sparks' },
    { img: 'sets/pkmn/thumb-56.webp', set: 's151', label: 'Twilight Masquerade' },
    { img: 'sets/pkmn/ascended-heroes-ptcg-thumb.webp', set: 'cpa', label: 'Ascended Heroes' },
    { img: 'sets/pkmn/scarlet-violet.jpeg', set: 'base', label: 'Scarlet & Violet' },
  ],
  mtg: [
    { img: 'sets/mtg/ECL_sma_key_1920x1080_en.jpg', set: 'mh3', label: 'Lorwyn Eclipsed' },
    { img: 'sets/mtg/HOB-1710_JDBCVHKLWUE_VarA_1080x1080.jpg', set: 'mh3', label: 'The Hobbit' },
    { img: 'sets/mtg/TMT_sma_key_1000x1000.jpg', set: 'mh3', label: 'The Moonlit Trail' },
    { img: 'sets/mtg/FRA-1313-EN-1080x1080.png', set: 'mh3', label: 'Foundations Remastered' },
    { img: 'sets/mtg/TLA_sma_key_1000x1000_EN_1.jpg', set: 'mh3', label: 'Avatar: The Last Airbender' },
    { img: 'sets/mtg/TLA_sma_key_1000x1000_EN_2.jpg', set: 'mh3', label: 'Avatar: The Last Airbender' },
    { img: 'sets/mtg/MTGSOS_sma_key_1080x1080_en.jpg', set: 'mh3', label: 'Secrets of Strixhaven' },
  ],
  ygo: [
    { img: 'sets/ygo/TCG_MZMU_FEATURE-BANNER.webp', set: 'ann25', label: 'Maze of Millennia' },
    { img: 'sets/ygo/NEWS_TITLE-SECTION_V2.webp', set: 'ann25', label: 'Yu-Gi-Oh! Classics' },
    { img: 'sets/ygo/036-768x768.jpg', set: 'ann25', label: 'Red Dragon Archfiend' },
    { img: 'sets/ygo/USY_22976_1-768x768.webp', set: 'ann25', label: 'Dark Magician Girl' },
    { img: 'sets/ygo/Y_22209_1-768x768.webp', set: 'ann25', label: 'Dark Magician' },
    { img: 'sets/ygo/DL-9th_Anni_News_Banner.webp', set: 'ann25', label: 'Duel Links Anniversary' },
  ],
  lor: [
    { img: 'sets/op/aceluffy.webp', set: 'op07', label: 'Romance Dawn' },
    { img: 'sets/op/two-legends.webp', set: 'op08', label: 'Two Legends' },
    { img: 'sets/op/awakening-new-era.webp', set: 'op05', label: 'Awakening of the New Era' },
    { img: 'sets/op/pillars-of-strength.jpeg', set: 'op10', label: 'Pillars of Strength' },
  ],
};

const GAME_DESCS_GM = {
  pkmn: 'From Base Set to Scarlet & Violet \u2014 every era of Pok\u00e9mon cards.',
  mtg: '30 years of strategy, art, and collectible value.',
  ygo: 'Fast-paced duels and iconic artwork.',
  lor: 'Stunning art and a rapidly growing collector scene.',
  digimon: 'Gorgeous card art with strong set value retention.',
};

function GameScreen({ app, params }) {
  const game = gameByIdGM(params.id);
  if (!game) return <div style={{ padding: 40, textAlign: 'center' }}>Game not found.</div>;

  const [condFilter, setCondFilter] = React.useState('all');

  const sets = SETSGM.filter(s => s.game === game.id);
  const logo = GAME_LOGOS_GM && GAME_LOGOS_GM[game.id];
  const hero = GAME_HEROES_GM[game.id];

  let listings = LISTSGM.filter(l => l.game === game.id && l.type === 'buynow');
  if (condFilter === 'graded') listings = listings.filter(l => l.grade && l.grade.company !== 'raw');
  else if (condFilter === 'raw') listings = listings.filter(l => !l.grade || l.grade.company === 'raw');
  listings.sort((a, b) => (b.watchers || 0) + (b.sold || 0) - (a.watchers || 0) - (a.sold || 0));

  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: TGM.bg, paddingBottom: 96 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 14px 0' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface)',
          color: TGM.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)', flexShrink: 0 }}>
          {IconGM.back({})}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: TGM.sans || 'var(--sans)', color: TGM.muted || 'var(--muted)' }}>
          <span onClick={() => app.nav.setTab('home')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>{'\u203A'}</span>
          <span style={{ color: TGM.ink, fontWeight: 700 }}>{game.name}</span>
        </div>
      </div>

      {/* ── Hero banner carousel ── */}
      {SET_BANNERS_GM[game.id] && SET_BANNERS_GM[game.id].length > 0 ? (
        <div className="noscroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden',
          padding: '8px 0 12px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {SET_BANNERS_GM[game.id].map((b, i) => (
            <div key={i} onClick={() => app.nav.push('set', { id: b.set })} style={{
              flexShrink: 0, width: '80%', maxWidth: 320, height: 170, borderRadius: 14,
              marginLeft: i === 0 ? 14 : 0,
              overflow: 'hidden', position: 'relative', cursor: 'pointer', scrollSnapAlign: 'start',
            }}>
              <img src={b.img} alt={b.label} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center center',
              }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
              }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 2 }}>
                <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 16, color: '#fff',
                  textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{b.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
                  Shop now {'\u2192'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: game.tint }}>
          {hero && <img src={hero} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top', opacity: 0.5,
          }} />}
          <div style={{ position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${game.tint}50 0%, ${game.tint}cc 60%, ${game.tint} 100%)`,
          }} />
          <div style={{ position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 16px 18px',
          }}>
            {logo
              ? <img src={logo} alt={game.name} style={{
                  maxWidth: 160, maxHeight: 44, objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))', marginBottom: 8,
                }} />
              : <div style={{ fontFamily: 'var(--heading)', fontWeight: 700, fontSize: 26, color: '#fff',
                  letterSpacing: -0.5, marginBottom: 8 }}>{game.name}</div>
            }
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              {GAME_DESCS_GM[game.id] || `Browse all ${game.name} cards.`}
            </div>
          </div>
        </div>
      )}

      {/* (Browse by set and New Release removed — hero banners serve this purpose) */}

      {/* ── Most Watched ── */}
      {(() => {
        const watched = LISTSGM.filter(l => l.game === game.id && l.type === 'buynow' && (l.watchers || 0) > 0)
          .sort((a, b) => (b.watchers || 0) - (a.watchers || 0)).slice(0, 6);
        if (watched.length === 0) return null;
        return (
          <div style={{ paddingTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, padding: '0 14px', marginBottom: 10 }}>Most watched</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 0 4px',
              WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
              {watched.map((l, idx) => (
                <div key={l.id} onClick={() => {
                  const prod = window.PRODUCTS.find(p => p.offers && p.offers.some(o => o.listingId === l.id));
                  app.nav.push(prod ? 'product' : 'listing', { id: prod ? prod.id : l.id });
                }} style={{
                  flexShrink: 0, width: 140, scrollSnapAlign: 'start', cursor: 'pointer',
                  marginLeft: idx === 0 ? 14 : 0,
                  borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid var(--line)',
                }}>
                  <div style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                    <CardArtGM item={l} w={100} radius={6} />
                  </div>
                  <div style={{ padding: '6px 10px 10px' }}>
                    <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontWeight: 700, fontSize: 12, lineHeight: 1.15,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{mGM(l.price)}</div>
                    {l.watchers > 0 && <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontSize: 10, color: TGM.muted || 'var(--muted)', marginTop: 2 }}>{l.watchers} watching</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Community: Top Sellers ── */}
      {(() => {
        // Find sellers with most listings in this game
        const sellerCounts = {};
        LISTSGM.filter(l => l.game === game.id).forEach(l => {
          if (l.seller) sellerCounts[l.seller] = (sellerCounts[l.seller] || 0) + 1;
        });
        const topSellers = Object.entries(sellerCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, count]) => {
            const s = sellerByNameGM(name);
            return s ? { ...s, count } : { name, count, rating: 0, sales: 0, loc: '' };
          });
        if (topSellers.length === 0) return null;
        return (
          <div style={{ padding: '20px 14px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TGM.ink, marginBottom: 10 }}>Top sellers</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', padding: '0 0 4px',
              WebkitOverflowScrolling: 'touch' }}>
              {topSellers.map((s, idx) => (
                <button key={s.name} onClick={() => app.nav.push('seller', { name: s.name })} style={{
                  flexShrink: 0, width: 150, background: 'var(--surface)', borderRadius: 12,
                  marginLeft: idx === 0 ? 14 : 0,
                  padding: '14px 12px', textAlign: 'center', border: '1px solid var(--line)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--fill)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16, margin: '0 auto 8px' }}>{s.name.charAt(0)}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: TGM.muted || 'var(--muted)', marginTop: 2 }}>{s.rating}% \u00B7 {s.count} listed</div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Condition filter ── */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 14px 4px' }}>
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
        <span style={{ marginLeft: 'auto', fontSize: 12, color: TGM.muted || 'var(--muted)', fontWeight: 600, alignSelf: 'center' }}>
          {listings.length} card{listings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Results grid ── */}
      <div style={{ padding: '12px 14px 0' }}>
        {listings.length > 0 ? (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {listings.slice(0, 20).map(p => (
              <div key={p.id} onClick={() => app.nav.push('listing', { id: p.id })} style={{
                borderRadius: 12, overflow: 'hidden', background: '#fff',
                border: '1px solid var(--line)', cursor: 'pointer',
              }}>
                <div style={{ position: 'relative', padding: '10px 10px 6px', display: 'flex', justifyContent: 'center', background: '#fff' }}>
                  <CardArtGM item={p} w={120} radius={6} />
                  {p.grade && p.grade.company !== 'raw' && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff',
                      fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 999 }}>
                      {p.grade.company.toUpperCase()} {p.grade.grade}
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 12px 12px' }}>
                  <div style={{ fontFamily: TGM.sans || 'var(--sans)', fontWeight: 700, fontSize: 14, lineHeight: 1.15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.subtitle || p.condition}</div>
                  <div style={{ fontFamily: TGM.mono || 'var(--mono)', fontWeight: 700, fontSize: 16, marginTop: 6 }}>{mGM(p.price)}</div>
                  {p.seller && (
                    <div onClick={e => { e.stopPropagation(); app.nav.push('seller', { name: p.seller }); }}
                      style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, cursor: 'pointer' }}>{p.seller}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No cards found</div>
            <button onClick={() => setCondFilter('all')}
              style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Clear filters</button>
          </div>
        )}
        {listings.length > 20 && (
          <button onClick={() => app.nav.setTab('search')}
            style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 10,
              background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            View all {listings.length} listings
          </button>
        )}
      </div>

    </div>
  );
}

Object.assign(window, { GameScreen });
