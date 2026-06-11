import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Card, Badge } from '@radix-ui/themes';
import { Search as SearchIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMES, SETS, gameById } from '../data/games';
import { LISTINGS, LOTS, byId } from '../data/listings';
import { GAME_LOGOS } from '../data/shops';
import ListCard from '../components/ListCard';
import GameChips from '../components/GameChips';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

// ── SPOTLIGHT editorial content ─────────────────────────────
const SPOTLIGHT = [
  // Pokemon
  { game: 'pkmn', src: 'content/pkmn-151.png', title: 'Scarlet & Violet 151', sub: 'The set everyone\'s chasing — singles & lots', pos: 'center' },
  { game: 'pkmn', src: 'content/pkmn-grails.webp', title: 'The grail cards', sub: 'Illustrator Pikachu & 1st-edition Charizard', pos: 'center' },
  { game: 'pkmn', src: 'content/pkmn-slabs.jpg', title: 'Graded & protected', sub: 'PSA-slabbed vintage holos', pos: 'center 30%' },
  // One Piece
  { game: 'lor', src: 'content/op-crew.webp', title: 'One Piece Card Game', sub: 'The whole crew, in your binder', pos: 'center' },
  { game: 'lor', src: 'content/op-25th.jpg', title: 'Anime 25th Collection', sub: 'EB-02 sealed booster boxes in stock', pos: 'center' },
  { game: 'lor', src: 'content/op-magazine.jpg', title: 'One Piece Magazine', sub: 'Promo cards & collector features', pos: 'center top' },
  // Yu-Gi-Oh!
  { game: 'ygo', src: 'content/ygo-gods.webp', title: 'The Egyptian Gods', sub: 'Ra, Slifer & Obelisk — vintage holos', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-meta.jpg', title: 'Today\'s meta', sub: 'Tournament staples & new releases', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-duelpower.gif', title: 'Duel Power', sub: 'Collector boxes & sealed product', pos: 'center' },
  { game: 'ygo', src: 'content/ygo-locals.webp', title: 'Locals night', sub: 'Find a Yu-Gi-Oh! event near you', pos: 'center', action: 'shopfinder' },
  // Magic: The Gathering
  { game: 'mtg', src: 'content/mtg-brand.webp', title: 'Magic: The Gathering', sub: 'Singles, sealed & graded — all eras', pos: 'center' },
  { game: 'mtg', src: 'content/mtg-mh3.webp', title: 'Modern Horizons 3', sub: 'Preorder Commander decks now', pos: 'center' },
  { game: 'mtg', src: 'content/mtg-packs.jpeg', title: 'Endless possibilities', sub: 'Every pack, 15 cards — open a world', pos: 'center 22%' },
  { game: 'mtg', src: 'content/mtg-locals.png', title: 'Locals night', sub: 'Find a Magic event near you', pos: 'center', action: 'shopfinder' },
];

// ── Ad banners ──────────────────────────────────────────────
const AD_BANNERS = [
  { id: 'pkmn', src: '/ads/pokemon.webp', tint: '#1f4d3a', tag: 'Pokemon TCG', cta: 'New: Surging Sparks' },
  { id: 'lor', src: '/ads/onepiece.webp', tint: '#7c4a1e', tag: 'One Piece Card Game', cta: 'Shop the latest set' },
  { id: 'ygo', src: '/ads/yugioh.webp', tint: '#1a2740', tag: 'Yu-Gi-Oh!', cta: '25th Anniversary in stock' },
];

// ── Collector's corner guides ───────────────────────────────
const GUIDES = [
  { id: 'grading', src: '/ads/learn-grading.jpg', tag: 'GUIDE', title: 'How grading works', desc: 'PSA, BGS & CGC scales explained — what each grade means for value.', cta: 'Learn grading' },
  { id: 'auth', src: '/ads/learn-authenticate.jpg', tag: 'PROTECT', title: 'Buy with confidence', desc: 'How authentication & Buyer Protection keep every purchase safe.', cta: 'How we verify' },
  { id: 'care', src: '/ads/learn-protect.jpg', tag: 'CARE', title: 'Store & protect', desc: 'Sleeves, toploaders & vaulting to keep your collection mint.', cta: 'Care tips' },
];

// ── Ad Carousel component ───────────────────────────────────
function AdCarousel({ onPick, inPrefs }) {
  const banners = AD_BANNERS.filter(ad => inPrefs(ad.id));
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { setI(0); }, [banners.length]);
  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(() => setI(n => (n + 1) % banners.length), 4200);
    return () => clearInterval(t);
  }, [paused, banners.length]);

  if (banners.length === 0) return null;

  return (
    <Box px="3" pt="3" pb="1">
      <div style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden', height: 132,
        boxShadow: '0 1px 3px rgba(20,24,40,0.06), 0 8px 20px rgba(20,24,40,0.08)',
      }} onTouchStart={() => setPaused(true)}>
        {banners.map((ad, n) => (
          <button key={ad.id} onClick={() => onPick(ad.id)} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, textAlign: 'left',
            opacity: n === i ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: n === i ? 'auto' : 'none',
            background: ad.tint, border: 'none', cursor: 'pointer',
          }}>
            <img src={ad.src} alt={ad.tag} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)' }} />
            <div style={{
              position: 'absolute', top: 10, left: 12, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.4,
              color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px',
            }}>SPONSORED</div>
            <div style={{ position: 'absolute', left: 14, bottom: 13, right: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{ad.tag}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, fontWeight: 700, fontSize: 12,
                color: '#fff', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', borderRadius: 999, padding: '5px 11px',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
              }}>
                {ad.cta} <span style={{ fontSize: 13 }}>&#8594;</span>
              </div>
            </div>
          </button>
        ))}
        {/* dots */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 5, zIndex: 2 }}>
          {banners.map((_, n) => (
            <button key={n} onClick={() => { setI(n); setPaused(true); }} style={{
              width: n === i ? 16 : 6, height: 6, borderRadius: 999,
              background: n === i ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s', padding: 0, border: 'none', cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>
    </Box>
  );
}

// ── Featured Rail component ─────────────────────────────────
function FeaturedRail({ selectedGame, inPrefs, navigate }) {
  const tint = { pkmn: '#d4a017', mtg: '#c2691b', ygo: '#7c4dd1', lor: '#c0392b', digimon: '#1f8fd6' };
  const cards = SPOTLIGHT.filter(c =>
    selectedGame ? c.game === selectedGame : inPrefs(c.game)
  );
  if (cards.length === 0) return null;

  const title = selectedGame && gameById(selectedGame)
    ? 'Featured in ' + gameById(selectedGame).short
    : 'Featured';

  return (
    <Box py="4" px="3">
      <Flex justify="between" align="center" mb="3">
        <Heading size="3">{title}</Heading>
        <Text size="1" color="gray" style={{ cursor: 'pointer' }}>See all</Text>
      </Flex>
      <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        {cards.map((c, n) => {
          const g = gameById(c.game);
          return (
            <button key={n} onClick={() => c.action ? navigate('/' + c.action) : null} style={{
              flexShrink: 0, width: 244, textAlign: 'left',
              background: 'var(--color-surface)', borderRadius: 16, overflow: 'hidden', position: 'relative', height: 210, display: 'block',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05), 0 6px 16px rgba(20,24,40,0.06)',
              border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <img src={c.src} alt={c.title} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: c.pos || 'center', display: 'block',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 30%, rgba(0,0,0,0.4) 64%, rgba(0,0,0,0.86) 100%)' }} />
              <span style={{
                position: 'absolute', top: 11, left: 11, display: 'inline-flex', alignItems: 'center', gap: 5,
                fontWeight: 800, fontSize: 9.5, letterSpacing: 0.4,
                color: '#fff', background: (tint[c.game] || '#000') + 'e6', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '4px 8px',
              }}>
                {g ? g.short.toUpperCase() : 'TCG'}
              </span>
              <div style={{ position: 'absolute', left: 13, bottom: 13, right: 13 }}>
                <div style={{ fontWeight: 800, fontSize: 16.5, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, marginTop: 3, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{c.sub}</div>
              </div>
            </button>
          );
        })}
      </Flex>
    </Box>
  );
}

// ── Set Tile component ──────────────────────────────────────
function SetTile({ set, onClick }) {
  const g = gameById(set.game);
  return (
    <button onClick={onClick} style={{
      width: 150, flexShrink: 0, textAlign: 'left', borderRadius: 14, overflow: 'hidden',
      background: set.hue, color: '#fff', position: 'relative', height: 96,
      padding: 13, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      boxShadow: '0 4px 14px rgba(20,24,40,0.12)', border: 'none', cursor: 'pointer',
    }}>
      {set.img ? (
        <>
          <img src={set.img} alt={set.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)' }} />
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)' }} />
      )}
      <div style={{
        position: 'absolute', top: 11, left: 13, fontWeight: 700, fontSize: 10.5, opacity: 0.9,
        letterSpacing: 0.3, textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}>{g ? g.short.toUpperCase() : ''}</div>
      <div style={{ position: 'relative', fontWeight: 800, fontSize: 15, lineHeight: 1.1, letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
        {set.name.replace(/\s*\(.*\)/, '')}
      </div>
      <div style={{ position: 'relative', fontFamily: 'var(--mono, monospace)', fontSize: 10.5, opacity: 0.9, marginTop: 2, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
        {set.cards} cards &middot; {set.year}
      </div>
    </button>
  );
}

// ── Lot Row component ───────────────────────────────────────
function LotRow({ lot, navigate }) {
  const g = gameById(lot.game);
  return (
    <Card
      style={{ cursor: 'pointer', padding: 12 }}
      onClick={() => navigate(`/listing/${lot.id}`)}
    >
      <Flex gap="3" align="center">
        <div style={{
          width: 58, height: 58, borderRadius: 11, flexShrink: 0, position: 'relative',
          background: lot.art, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', overflow: 'hidden',
        }}>
          {lot.img ? (
            <img src={lot.img} alt={lot.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 6px, transparent 6px 12px)' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 17, lineHeight: 1 }}>
                  {lot.count >= 1000 ? (lot.count / 1000) + 'k' : lot.count}
                </div>
                <div style={{ fontSize: 8.5, opacity: 0.85 }}>CARDS</div>
              </div>
            </>
          )}
        </div>
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Text size="2" weight="bold" style={{ lineHeight: 1.2 }}>{lot.name}</Text>
          <Text size="1" color="gray" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lot.note}
          </Text>
          <Flex gap="2" align="baseline">
            <Text size="3" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(lot.price)}</Text>
            <Text size="1" color="gray" style={{ textDecoration: 'line-through', fontFamily: 'var(--mono, monospace)' }}>{money(lot.market)}</Text>
            {lot.price < lot.market && (
              <Badge color="green" size="1">
                {Math.round((1 - lot.price / lot.market) * 100)}% off
              </Badge>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

// ── HOME SCREEN ─────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const app = useApp();
  const { inPrefs, bids } = app;

  const [selectedGame, setSelectedGame] = useState(null);

  // If the selected game leaves prefs, snap back
  useEffect(() => {
    if (selectedGame && !inPrefs(selectedGame)) setSelectedGame(null);
  }, [app.prefs, selectedGame, inPrefs]);

  // Filtering helpers
  const inFeed = (x) => inPrefs(x.game);
  const filt = (arr) => selectedGame ? arr.filter(x => x.game === selectedGame) : arr.filter(inFeed);

  const auctions = filt(LISTINGS.filter(l => l.type === 'auction'))
    .sort((a, b) => {
      // Sort by timeLeft (rough sort — shorter time first)
      const parseTime = (t) => {
        if (!t) return Infinity;
        let mins = 0;
        const d = t.match(/(\d+)d/); if (d) mins += parseInt(d[1]) * 1440;
        const h = t.match(/(\d+)h/); if (h) mins += parseInt(h[1]) * 60;
        const m = t.match(/(\d+)m/); if (m) mins += parseInt(m[1]);
        return mins;
      };
      return parseTime(a.timeLeft) - parseTime(b.timeLeft);
    });

  const trending = filt(LISTINGS.filter(l => l.type === 'buynow'))
    .sort((a, b) => (b.watchers || 0) - (a.watchers || 0));

  const sets = filt(SETS).filter(s => s.img);
  const lots = filt(LOTS);

  // Active bids
  const myBids = Object.entries(bids)
    .map(([id, amount]) => ({ id, amount, item: byId(id) }))
    .filter(b => b.item && (selectedGame ? b.item.game === selectedGame : inPrefs(b.item.game)));

  return (
    <Box style={{ paddingBottom: 24 }}>
      {/* ── Search bar ── */}
      <Box px="3" pt="3" pb="2">
        <Flex
          align="center"
          gap="2"
          onClick={() => navigate('/search')}
          style={{
            background: 'var(--gray-a3)',
            borderRadius: 12, padding: '11px 14px', cursor: 'pointer',
          }}
        >
          <SearchIcon size={18} style={{ color: 'var(--gray-9)', flexShrink: 0 }} />
          <Text size="2" color="gray">Search Charizard, Black Lotus, sets...</Text>
        </Flex>
      </Box>

      {/* ── Game chips ── */}
      <Box px="3">
        <GameChips selected={selectedGame} onSelect={setSelectedGame} />
      </Box>

      {/* ── Ad carousel ── */}
      <AdCarousel inPrefs={inPrefs} onPick={(id) => setSelectedGame(id)} />

      {/* ── Featured rail ── */}
      <FeaturedRail selectedGame={selectedGame} inPrefs={inPrefs} navigate={navigate} />

      {/* ── Your active bids ── */}
      {myBids.length > 0 && (
        <Box py="4" px="3">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Your bids</Heading>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }} onClick={() => navigate('/watch')}>View all</Text>
          </Flex>
          <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {myBids.map(b => {
              const top = b.amount >= b.item.price;
              return (
                <Card
                  key={b.id}
                  style={{
                    flexShrink: 0, width: 200, cursor: 'pointer', padding: 12,
                    boxShadow: 'inset 0 0 0 1.5px ' + (top ? 'var(--accent-9)' : 'var(--red-9)'),
                  }}
                  onClick={() => navigate(`/listing/${b.id}`)}
                >
                  <Flex gap="3" align="center">
                    <div style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6, flexShrink: 0 }}>
                      <CardArt item={b.item} w={44} radius={6} />
                    </div>
                    <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                      <Badge color={top ? 'green' : 'red'} size="1">
                        {top ? 'TOP BID' : 'OUTBID'}
                      </Badge>
                      <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.item.name}
                      </Text>
                      <Flex gap="1" align="baseline">
                        <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(b.amount)}</Text>
                        <Text size="1" color="gray">{b.item.timeLeft}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        </Box>
      )}

      {/* ── Ending soon ── */}
      {auctions.length > 0 && (
        <Box py="4" px="3">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Ending soon</Heading>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>All auctions</Text>
          </Flex>
          <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {auctions.map(item => (
              <div key={item.id} style={{ width: 168, flexShrink: 0 }}>
                <ListCard item={item} />
              </div>
            ))}
          </Flex>
        </Box>
      )}

      {/* ── Trending ── */}
      {trending.length > 0 && (
        <Box py="4" px="3">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Trending now</Heading>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>See all</Text>
          </Flex>
          <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {trending.slice(0, 8).map(item => (
              <div key={item.id} style={{ width: 168, flexShrink: 0 }}>
                <ListCard item={item} />
              </div>
            ))}
          </Flex>
        </Box>
      )}

      {/* ── Shop by set ── */}
      {sets.length > 0 && (
        <Box py="4" px="3">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Shop by set</Heading>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>Browse all</Text>
          </Flex>
          <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {sets.map(s => (
              <SetTile key={s.id} set={s} onClick={() => navigate(`/search?set=${s.id}`)} />
            ))}
          </Flex>
        </Box>
      )}

      {/* ── Collector's corner ── */}
      <Box py="4" px="3">
        <Flex justify="between" align="center" mb="3">
          <Heading size="3">Collector's corner</Heading>
          <Text size="1" color="gray" style={{ cursor: 'pointer' }}>All guides</Text>
        </Flex>
        <Text size="2" color="gray" mb="3" style={{ lineHeight: 1.45 }}>
          New to collecting, or want to protect what you own? Start here.
        </Text>
        <Flex gap="3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          {GUIDES.map(gd => (
            <button key={gd.id} style={{
              flexShrink: 0, width: 232, textAlign: 'left',
              background: 'var(--color-surface)', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05), 0 6px 16px rgba(20,24,40,0.05)',
              position: 'relative', height: 218, display: 'block', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <img src={gd.src} alt={gd.title} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 28%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.85) 100%)' }} />
              <span style={{
                position: 'absolute', top: 11, left: 11, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.4,
                color: 'var(--accent-9)', background: '#fff', borderRadius: 6, padding: '3px 8px',
              }}>{gd.tag}</span>
              <div style={{ position: 'absolute', left: 13, bottom: 13, right: 13 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: -0.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{gd.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', lineHeight: 1.4, marginTop: 4, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{gd.desc}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 9,
                  fontWeight: 700, fontSize: 12.5, color: '#fff',
                }}>
                  {gd.cta} <span>&#8594;</span>
                </div>
              </div>
            </button>
          ))}
        </Flex>
      </Box>

      {/* ── Bulk lots ── */}
      {lots.length > 0 && (
        <Box py="4" px="3">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Bulk lots & collections</Heading>
          </Flex>
          <Flex direction="column" gap="3">
            {lots.map(lot => (
              <LotRow key={lot.id} lot={lot} navigate={navigate} />
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
