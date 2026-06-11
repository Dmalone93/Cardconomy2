import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Card, Badge, Tabs, TextField, Separator, TextArea, Slider } from '@radix-ui/themes';
import { ArrowLeftRight, MapPin, Shield, MessageCircle, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LISTINGS, byId } from '../data/listings';
import { TRADERS, SHOPS, TRADE_POSTS, OWNED_REFS, traderById } from '../data/shops';
import { gameById } from '../data/games';
import { GAMES } from '../data/games';
import CardArt from '../components/CardArt';
import Sheet from '../components/Sheet';
import { money } from '../components/helpers';

const COND_OPTS = ['Any', 'LP+', 'NM+', 'NM', 'Gem'];
const SLAB_OPTS = ['Any', 'Raw', 'Graded'];
const m0 = (n) => money(n, { cents: false });

// ── Avatar bubble ─────────────────────────────────────────────
function Avatar({ who, size = 44 }) {
  return (
    <Flex align="center" justify="center" style={{
      width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
      background: who.tint, color: '#fff', fontWeight: 800, fontSize: size * 0.42,
    }}>
      {who.initial}
    </Flex>
  );
}

// ── Mini card face for match rows ─────────────────────────────
function MiniFace({ item }) {
  if (!item) return null;
  return (
    <Box style={{ width: 34, height: 47, borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}>
      <CardArt item={item} w={34} radius={5} />
    </Box>
  );
}

// ── Small card chip with toggle ───────────────────────────────
function TradeCardChip({ item, dimmed, onToggle, mode }) {
  if (!item) return null;
  return (
    <button onClick={onToggle} style={{ flexShrink: 0, width: 78, textAlign: 'left', opacity: dimmed ? 0.4 : 1, position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      <Box style={{ background: 'var(--gray-a3)', borderRadius: 10, padding: 7, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <CardArt item={item} w={58} />
        <Flex align="center" justify="center" style={{
          position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999,
          background: dimmed ? 'rgba(255,255,255,0.9)' : (mode === 'give' ? 'var(--accent-9)' : 'var(--green-9)'),
          color: dimmed ? 'var(--gray-a9)' : '#fff', fontSize: 13, fontWeight: 800,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          {dimmed ? '+' : '✓'}
        </Flex>
      </Box>
      <Text as="div" weight="bold" size="1" style={{ marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Text>
      <Text as="div" size="1" color="gray" style={{ fontFamily: 'var(--code-font-family)', fontSize: 10.5 }}>{m0(item.market)}</Text>
    </button>
  );
}

// ── Side label (You give / You get) ──────────────────────────
function SideLabel({ color, title, sub, total }) {
  return (
    <Flex align="baseline" justify="between" style={{ marginBottom: 9 }}>
      <Flex align="center" gap="2">
        <Box style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
        <Text weight="bold" size="3">{title}</Text>
        <Text size="1" color="gray">{sub}</Text>
      </Flex>
      <Text weight="bold" size="2" style={{ fontFamily: 'var(--code-font-family)' }}>{total}</Text>
    </Flex>
  );
}

// ── Preference row / chip for Post phase ─────────────────────
function PrefRow({ label, children }) {
  return (
    <Box style={{ marginBottom: 14 }}>
      <Text as="div" weight="bold" size="1" style={{ marginBottom: 8 }}>{label}</Text>
      <Flex wrap="wrap" gap="2">{children}</Flex>
    </Box>
  );
}
function PrefChip({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontWeight: 700, fontSize: 13, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? 'var(--accent-9)' : 'var(--color-surface)', color: on ? '#fff' : 'var(--gray-11)',
      boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--gray-a5)',
    }}>
      {children}
    </button>
  );
}

// ── Place line for meetup negotiation ─────────────────────────
function PlaceLine({ place, byWho, active, agreed }) {
  return (
    <Flex align="center" gap="3" style={{
      borderRadius: 12, padding: '10px 12px',
      background: active ? 'var(--accent-a3)' : 'var(--gray-a3)',
      boxShadow: active ? 'inset 0 0 0 1.5px var(--accent-9)' : 'none',
      opacity: active ? 1 : 0.7,
    }}>
      <Flex align="center" justify="center" style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: place.tint || 'var(--gray-a9)', color: '#fff',
        fontWeight: 800, fontSize: place.kind === 'shop' ? 16 : 18,
      }}>
        {place.initial}
      </Flex>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text as="div" weight="bold" size="2">{place.name}</Text>
        <Text as="div" size="1" color="gray">{place.sub}</Text>
      </Box>
      <Text size="1" weight="bold" style={{ color: agreed ? 'var(--green-9)' : 'var(--gray-a8)', whiteSpace: 'nowrap' }}>
        {agreed ? '✓ ' + byWho.split(' ')[0] : byWho}
      </Text>
    </Flex>
  );
}

// ── Trade Sent confirmation ───────────────────────────────────
function TradeSent({ trader, giveSel, getSel, cash, cashWho, place, setPhase }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState('proposed');
  const counterSpot = {
    id: 'counter', name: 'Northside Collectibles',
    sub: trader.name + "'s pick · 0.5 mi from them · trade hub",
    kind: 'shop', tint: '#7c3aed', initial: 'N',
  };
  const agreedPlace = stage === 'accepted-counter' ? counterSpot : place;

  return (
    <Box style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box style={{ padding: '70px 24px 18px', textAlign: 'center' }}>
        <Flex align="center" justify="center" style={{
          width: 80, height: 80, margin: '0 auto', borderRadius: 999,
          background: stage === 'proposed' ? 'var(--accent-a3)' : 'var(--green-a3)',
          color: stage === 'proposed' ? 'var(--accent-9)' : 'var(--green-9)',
        }}>
          {stage === 'proposed'
            ? <ArrowLeftRight size={38} />
            : <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </Flex>
        <Heading size="6" weight="bold" style={{ margin: '18px 0 4px', letterSpacing: -0.5 }}>
          {stage === 'proposed' ? 'Trade proposed!' : 'Trade & spot agreed!'}
        </Heading>
        <Text as="p" size="2" color="gray" style={{ lineHeight: 1.5, margin: '0 auto', maxWidth: 290 }}>
          {stage === 'proposed'
            ? <>{trader.name} got your offer and your suggested spot, <Text weight="bold" color={undefined}>{place.name}</Text>. Waiting for them to confirm the location...</>
            : <>You and {trader.name} agreed to meet at <Text weight="bold" color={undefined}>{agreedPlace.name}</Text>. Bring your cards!</>}
        </Text>
      </Box>

      <Box style={{ padding: '0 16px' }}>
        {/* trade summary */}
        <Card style={{ padding: 14 }}>
          <Flex gap="3">
            <Box style={{ flex: 1 }}>
              <Text as="div" size="1" weight="bold" style={{ color: 'var(--accent-9)', marginBottom: 6 }}>YOU GIVE</Text>
              <Flex gap="1" wrap="wrap">{giveSel.map(id => <MiniFace key={id} item={byId(id)} />)}</Flex>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text as="div" size="1" weight="bold" style={{ color: 'var(--green-9)', marginBottom: 6 }}>YOU GET</Text>
              <Flex gap="1" wrap="wrap">{getSel.map(id => <MiniFace key={id} item={byId(id)} />)}</Flex>
            </Box>
          </Flex>
          {cash > 0 && (
            <Text as="div" size="2" color="gray" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--gray-a5)' }}>
              + {m0(cash)} cash {cashWho === 'you' ? 'from you' : 'from ' + trader.name}
            </Text>
          )}
        </Card>

        {/* location negotiation card */}
        <Card style={{ marginTop: 12, padding: 14 }}>
          <Flex align="center" gap="2" style={{ marginBottom: 10 }}>
            <Text weight="bold" size="2">
              <MapPin size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
              Meetup location
            </Text>
            {stage !== 'proposed' && (
              <Badge color="green" size="1">AGREED</Badge>
            )}
          </Flex>
          <PlaceLine place={place} byWho="You proposed" active={stage !== 'accepted-counter'} agreed={stage === 'agreed'} />
          {stage !== 'proposed' && (
            <Box style={{ marginTop: 9 }}>
              <PlaceLine place={counterSpot} byWho={trader.name + ' countered'} active={stage === 'accepted-counter'} agreed={stage === 'accepted-counter'} />
            </Box>
          )}
        </Card>

        {/* chat-style replies */}
        {stage !== 'proposed' && (
          <Card style={{ marginTop: 12, padding: 12 }}>
            <Flex gap="3" align="start">
              <Avatar who={trader} size={34} />
              <Text size="2" style={{ flex: 1, lineHeight: 1.45 }}>
                <Text weight="bold">{trader.name}:</Text>{' '}
                {stage === 'countered'
                  ? "Accepted the trade! Any chance we meet at Northside Collectibles instead? It's right by me."
                  : stage === 'agreed'
                    ? 'Perfect, see you there!'
                    : 'Works for me — see you at ' + counterSpot.name + '!'}
              </Text>
            </Flex>
          </Card>
        )}
      </Box>

      <Box style={{ padding: 16, marginTop: 'auto' }}>
        {stage === 'proposed' && (
          <Button size="3" style={{ width: '100%' }} onClick={() => setStage('countered')}>
            Simulate {trader.name}'s reply
          </Button>
        )}
        {stage === 'countered' && (
          <Flex gap="3">
            <Button size="3" variant="outline" style={{ flex: 1 }} onClick={() => setStage('agreed')}>Keep my spot</Button>
            <Button size="3" style={{ flex: 1.3 }} onClick={() => setStage('accepted-counter')}>Accept their spot</Button>
          </Flex>
        )}
        {(stage === 'agreed' || stage === 'accepted-counter') && (
          <Button size="3" style={{ width: '100%' }} onClick={() => navigate('/')}>
            Done · add to calendar
          </Button>
        )}
        <Button size="3" variant="ghost" color="gray" style={{ width: '100%', marginTop: 9 }} onClick={() => navigate('/')}>
          Back to browse
        </Button>
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════
// Main Trade Screen
// ═════════════════════════════════════════════════════════════════
export default function Trade() {
  const navigate = useNavigate();
  const app = useApp();

  const [phase, setPhase] = useState('matches');
  const [traderId, setTraderId] = useState(null);
  const [boardOffer, setBoardOffer] = useState(null);
  const trader = traderId ? traderById(traderId) : null;

  // selection state for builder
  const giveAll = trader ? (boardOffer ? OWNED_REFS : OWNED_REFS.filter(id => trader.wants.includes(id))) : [];
  const getAll = trader ? (boardOffer ? [boardOffer] : trader.haves) : [];
  const [give, setGive] = useState({});
  const [get, setGet] = useState({});
  const [cash, setCash] = useState(0);
  const [cashWho, setCashWho] = useState(null);
  const [place, setPlace] = useState(null);
  const [customSpot, setCustomSpot] = useState('');

  // post composer state
  const [offerCard, setOfferCard] = useState(OWNED_REFS[0]);
  const [openAny, setOpenAny] = useState(true);
  const [prefGames, setPrefGames] = useState([]);
  const [prefCond, setPrefCond] = useState('Any');
  const [prefSlab, setPrefSlab] = useState('Any');

  // init selections when trader chosen
  useEffect(() => {
    if (!trader) return;
    const g = {};
    if (!boardOffer) giveAll.forEach(id => { g[id] = true; });
    setGive(g);
    const gt = {};
    getAll.forEach(id => { gt[id] = true; });
    setGet(gt);
    setCash(0);
    setPlace(null);
    setCustomSpot('');
  }, [traderId, boardOffer]);

  const giveSel = giveAll.filter(id => give[id]);
  const getSel = getAll.filter(id => get[id]);
  const giveVal = giveSel.reduce((s, id) => s + (byId(id)?.market || 0), 0);
  const getVal = getSel.reduce((s, id) => s + (byId(id)?.market || 0), 0);
  const diff = getVal - giveVal;
  const fairPct = giveVal + getVal === 0 ? 50 : Math.round((giveVal / (giveVal + getVal)) * 100);
  const suggestedCash = Math.abs(Math.round(diff));

  const goBack = () => {
    if (phase === 'matches') navigate(-1);
    else if (phase === 'board' || phase === 'post') setPhase('matches');
    else if (phase === 'build') setPhase(boardOffer ? 'board' : 'matches');
    else if (phase === 'meetup') setPhase('build');
    else navigate('/');
  };

  const phaseTitle = {
    matches: 'Trade with collectors',
    board: 'Open to Offers',
    post: 'Post a trade',
    build: 'Build a trade',
    meetup: 'Choose where to meet',
  };

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ── */}
      {phase !== 'sent' && phase !== 'posted' && (
        <Flex align="center" gap="3" style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-a5)' }}>
          <Button variant="ghost" color="gray" size="1" onClick={goBack} style={{ padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <Text weight="bold" size="3" style={{ flex: 1 }}>{phaseTitle[phase] || 'Trade'}</Text>
        </Flex>
      )}

      <Box style={{ flex: 1, overflow: 'auto' }}>

        {/* ════════ MATCHES ════════ */}
        {phase === 'matches' && (
          <Box style={{ padding: '18px 16px 30px' }}>
            {/* info banner */}
            <Flex gap="3" align="start" style={{ background: 'var(--accent-a3)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <ArrowLeftRight size={17} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
              <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
                Swap cards directly — no cash needed. We match your <Text weight="bold">collection</Text> with nearby collectors' <Text weight="bold">want lists</Text> and suggest a shop to meet at.
              </Text>
            </Flex>

            {/* board + post buttons */}
            <Flex gap="3" style={{ marginBottom: 18 }}>
              <button onClick={() => setPhase('board')} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', background: 'var(--color-surface)', borderRadius: 13, padding: '12px 13px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <Text weight="bold" size="2">Open to Offers</Text>
                <Text size="1" color="gray">{TRADE_POSTS.length} open trade posts</Text>
              </button>
              <button onClick={() => setPhase('post')} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', background: 'var(--accent-a3)', borderRadius: 13, padding: '12px 13px', border: 'none', cursor: 'pointer', boxShadow: 'inset 0 0 0 1.5px var(--accent-9)' }}>
                <Text weight="bold" size="2" style={{ color: 'var(--accent-9)' }}>+ Post a trade</Text>
                <Text size="1" style={{ color: 'var(--accent-9)', opacity: 0.8 }}>List a card, take offers</Text>
              </button>
            </Flex>

            <Text as="div" weight="bold" size="2" style={{ marginBottom: 10 }}>{TRADERS.length} matches near you</Text>

            <Flex direction="column" gap="3">
              {TRADERS.map(t => {
                const youGet = t.haves.filter(id => byId(id));
                const youGive = OWNED_REFS.filter(id => t.wants.includes(id));
                return (
                  <button key={t.id} onClick={() => { setTraderId(t.id); setBoardOffer(null); setPhase('build'); }} style={{
                    width: '100%', textAlign: 'left', background: 'var(--color-surface)', borderRadius: 16, padding: 14, border: 'none', cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
                  }}>
                    <Flex align="center" gap="3" style={{ marginBottom: 11 }}>
                      <Avatar who={t} size={42} />
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Flex align="center" gap="2">
                          <Text weight="bold" size="3">{t.name}</Text>
                        </Flex>
                        <Text size="1" color="gray">{t.dist} mi · {t.rating}% · {t.deals} trades</Text>
                      </Box>
                      <Badge color="green" size="1" variant="soft">2-way match</Badge>
                    </Flex>
                    <Flex gap="3">
                      <Box style={{ flex: 1 }}>
                        <Text as="div" size="1" weight="bold" style={{ color: 'var(--green-9)', marginBottom: 5, letterSpacing: 0.2 }}>YOU GET</Text>
                        <Flex gap="1">{youGet.slice(0, 2).map(id => <MiniFace key={id} item={byId(id)} />)}</Flex>
                      </Box>
                      <Separator orientation="vertical" />
                      <Box style={{ flex: 1 }}>
                        <Text as="div" size="1" weight="bold" style={{ color: 'var(--accent-9)', marginBottom: 5, letterSpacing: 0.2 }}>THEY WANT</Text>
                        <Flex gap="1">{youGive.slice(0, 2).map(id => <MiniFace key={id} item={byId(id)} />)}</Flex>
                      </Box>
                    </Flex>
                  </button>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* ════════ BOARD (open to offers) ════════ */}
        {phase === 'board' && (
          <Box style={{ padding: '18px 16px 30px' }}>
            <Flex gap="3" align="start" style={{ background: 'var(--accent-a3)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <ArrowLeftRight size={17} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
              <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
                Collectors offering a card and <Text weight="bold">open to offers</Text>. Tap one to propose something from your collection.
              </Text>
            </Flex>

            <Button size="3" style={{ width: '100%', marginBottom: 14 }} onClick={() => setPhase('post')}>
              <Plus size={16} /> Post your own trade
            </Button>

            <Flex direction="column" gap="3">
              {TRADE_POSTS.map(p => {
                const t = traderById(p.trader);
                const card = byId(p.offer);
                if (!card || !t) return null;
                const chips = [];
                if (p.prefs.games && p.prefs.games.length) {
                  p.prefs.games.forEach(g => { const gm = gameById(g); chips.push(gm ? gm.short : g); });
                } else {
                  chips.push('Any game');
                }
                if (p.prefs.cond && p.prefs.cond !== 'Any') chips.push(p.prefs.cond);
                if (p.prefs.slab && p.prefs.slab !== 'Any') chips.push(p.prefs.slab);

                return (
                  <Card key={p.id} style={{ padding: 14 }}>
                    <Flex align="center" gap="3" style={{ marginBottom: 12 }}>
                      <Avatar who={t} size={36} />
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text as="div" weight="bold" size="2">{t.name}</Text>
                        <Text as="div" size="1" color="gray">{t.dist} mi · {t.rating}%</Text>
                      </Box>
                      <Badge color="orange" size="1" variant="soft">OPEN TO OFFERS</Badge>
                    </Flex>

                    <Flex gap="3" align="center">
                      <Box style={{ background: 'var(--gray-a3)', borderRadius: 10, padding: 7, flexShrink: 0 }}>
                        <CardArt item={card} w={52} radius={6} />
                      </Box>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text as="div" size="1" color="gray" weight="bold" style={{ letterSpacing: 0.2 }}>OFFERING</Text>
                        <Text as="div" weight="bold" size="3">{card.name}</Text>
                        <Text as="div" size="1" color="gray" style={{ fontFamily: 'var(--code-font-family)' }}>{m0(card.market)} market</Text>
                      </Box>
                    </Flex>

                    <Box style={{ marginTop: 11 }}>
                      <Text as="div" size="1" color="gray" weight="bold" style={{ letterSpacing: 0.2, marginBottom: 6 }}>
                        {p.open ? 'LOOKING FOR · open' : 'LOOKING FOR'}
                      </Text>
                      <Flex wrap="wrap" gap="2">
                        {!p.open && p.wants && p.wants.map(id => byId(id) && (
                          <Badge key={id} color="blue" variant="soft" size="1">{byId(id).name}</Badge>
                        ))}
                        {chips.map((c, i) => (
                          <Badge key={i} variant="outline" size="1">{c}</Badge>
                        ))}
                      </Flex>
                    </Box>

                    <Text as="div" size="2" color="gray" style={{ fontStyle: 'italic', margin: '11px 0 12px', lineHeight: 1.4 }}>
                      "{p.note}"
                    </Text>

                    <Button size="2" style={{ width: '100%' }} onClick={() => { setBoardOffer(p.offer); setTraderId(p.trader); setPhase('build'); }}>
                      Make an offer
                    </Button>
                  </Card>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* ════════ POST a trade ════════ */}
        {phase === 'post' && (
          <Box style={{ padding: '18px 16px 30px' }}>
            <Text as="p" size="2" color="gray" style={{ margin: '0 0 16px', lineHeight: 1.45 }}>
              List a card you'll part with and stay open to offers. Set the criteria you'd accept — others propose, you decide.
            </Text>

            <Text as="div" weight="bold" size="3" style={{ marginBottom: 9 }}>You're offering</Text>
            <Flex gap="2" style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 18 }}>
              {OWNED_REFS.map(id => {
                const c = byId(id);
                if (!c) return null;
                const on = offerCard === id;
                return (
                  <button key={id} onClick={() => setOfferCard(id)} style={{ flexShrink: 0, width: 78, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Box style={{ background: 'var(--gray-a3)', borderRadius: 10, padding: 7, display: 'flex', justifyContent: 'center', boxShadow: on ? 'inset 0 0 0 2px var(--accent-9)' : 'none' }}>
                      <CardArt item={c} w={56} />
                    </Box>
                    <Text as="div" weight="bold" size="1" style={{ marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: on ? 'var(--accent-9)' : undefined }}>{c.name}</Text>
                  </button>
                );
              })}
            </Flex>

            {/* open to any toggle */}
            <Flex align="center" justify="between" style={{ background: 'var(--color-surface)', borderRadius: 13, padding: '13px 14px', marginBottom: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Box>
                <Text as="div" weight="bold" size="3">Open to any offer</Text>
                <Text as="div" size="1" color="gray">Let anyone propose a swap</Text>
              </Box>
              <button onClick={() => setOpenAny(v => !v)} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, border: 'none', cursor: 'pointer', background: openAny ? 'var(--accent-9)' : 'var(--gray-a5)', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 24, height: 24, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: openAny ? 'translateX(20px)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </Flex>

            <Flex align="baseline" gap="2" style={{ marginBottom: 4 }}>
              <Text weight="bold" size="3">Preferences</Text>
              {openAny && <Text size="1" color="gray">· optional</Text>}
            </Flex>
            <Text as="div" size="2" color="gray" style={{ marginBottom: 12 }}>Narrow what you'd accept.</Text>

            <PrefRow label="Game">
              {GAMES.map(g => (
                <PrefChip key={g.id} on={prefGames.includes(g.id)} onClick={() => setPrefGames(s => s.includes(g.id) ? s.filter(x => x !== g.id) : [...s, g.id])}>
                  {g.short}
                </PrefChip>
              ))}
            </PrefRow>
            <PrefRow label="Min. condition">
              {COND_OPTS.map(c => <PrefChip key={c} on={prefCond === c} onClick={() => setPrefCond(c)}>{c}</PrefChip>)}
            </PrefRow>
            <PrefRow label="Slab">
              {SLAB_OPTS.map(s => <PrefChip key={s} on={prefSlab === s} onClick={() => setPrefSlab(s)}>{s}</PrefChip>)}
            </PrefRow>

            <Button size="3" disabled={!offerCard} style={{ width: '100%', marginTop: 18 }} onClick={() => setPhase('posted')}>
              Post to the board
            </Button>
          </Box>
        )}

        {/* ════════ POSTED confirmation ════════ */}
        {phase === 'posted' && (
          <Box style={{ padding: '70px 24px 30px', textAlign: 'center' }}>
            <Flex align="center" justify="center" style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 999, background: 'var(--green-a3)', color: 'var(--green-9)' }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Flex>
            <Heading size="6" weight="bold" style={{ margin: '18px 0 4px', letterSpacing: -0.5 }}>Your trade is live!</Heading>
            <Text as="p" size="2" color="gray" style={{ lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 280 }}>
              {byId(offerCard) ? byId(offerCard).name : 'Your card'} is on the Open to Offers board. We'll notify you when collectors propose a swap.
            </Text>
            <Box style={{ display: 'inline-block', background: 'var(--color-surface)', borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              {byId(offerCard) && <CardArt item={byId(offerCard)} w={96} />}
            </Box>
            <Flex wrap="wrap" gap="2" justify="center" style={{ marginTop: 14 }}>
              <Badge variant="soft" size="1">{openAny ? 'Open to offers' : 'Specific wants'}</Badge>
              {prefGames.map(g => { const gm = gameById(g); return gm ? <Badge key={g} variant="soft" size="1">{gm.short}</Badge> : null; })}
              {prefCond !== 'Any' && <Badge variant="soft" size="1">{prefCond}</Badge>}
              {prefSlab !== 'Any' && <Badge variant="soft" size="1">{prefSlab}</Badge>}
            </Flex>
            <Button size="3" style={{ width: '100%', marginTop: 24 }} onClick={() => setPhase('board')}>View the board</Button>
            <Button size="3" variant="ghost" color="gray" style={{ width: '100%', marginTop: 10 }} onClick={() => navigate('/')}>Back to browse</Button>
          </Box>
        )}

        {/* ════════ BUILD ════════ */}
        {phase === 'build' && trader && (
          <Box style={{ padding: '16px 16px 16px' }}>
            {/* partner */}
            <Flex align="center" gap="3" style={{ marginBottom: 16 }}>
              <Avatar who={trader} size={40} />
              <Box style={{ flex: 1 }}>
                <Text as="div" weight="bold" size="3">Trading with {trader.name}</Text>
                <Text as="div" size="1" color="gray">{trader.dist} mi · {trader.rating}% positive</Text>
              </Box>
            </Flex>

            {/* you give */}
            <SideLabel color="var(--accent-9)" title="You give" sub="from your collection they want" total={m0(giveVal)} />
            <Flex gap="2" style={{ overflowX: 'auto', padding: '0 0 4px', marginBottom: 16 }}>
              {giveAll.map(id => <TradeCardChip key={id} item={byId(id)} mode="give" dimmed={!give[id]} onToggle={() => setGive(s => ({ ...s, [id]: !s[id] }))} />)}
              {giveAll.length === 0 && <Text size="2" color="gray" style={{ padding: '10px 0' }}>Nothing of yours on their want list yet.</Text>}
            </Flex>

            {/* swap glyph */}
            <Flex justify="center" style={{ margin: '2px 0 10px' }}>
              <Flex align="center" justify="center" style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--color-surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', color: 'var(--gray-11)' }}>
                <ArrowLeftRight size={18} />
              </Flex>
            </Flex>

            {/* you get */}
            <SideLabel color="var(--green-9)" title="You get" sub={'from ' + trader.name + "'s collection"} total={m0(getVal)} />
            <Flex gap="2" style={{ overflowX: 'auto', padding: '0 0 4px', marginBottom: 16 }}>
              {getAll.map(id => <TradeCardChip key={id} item={byId(id)} mode="get" dimmed={!get[id]} onToggle={() => setGet(s => ({ ...s, [id]: !s[id] }))} />)}
            </Flex>

            {/* fairness meter */}
            <Card style={{ padding: 14 }}>
              <Flex justify="between" align="baseline" style={{ marginBottom: 8 }}>
                <Text weight="bold" size="2">Trade balance</Text>
                <Text weight="bold" size="2" style={{ color: Math.abs(diff) <= 10 ? 'var(--green-9)' : 'var(--orange-9)' }}>
                  {Math.abs(diff) <= 10 ? '✓ Even trade' : m0(Math.abs(diff)) + (diff > 0 ? ' in your favor' : ' their favor')}
                </Text>
              </Flex>
              <Flex style={{ height: 14, borderRadius: 999, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--gray-a5)' }}>
                <Box style={{ width: fairPct + '%', background: 'var(--accent-9)', transition: 'width 0.3s' }} />
                <Box style={{ width: (100 - fairPct) + '%', background: 'var(--green-9)', transition: 'width 0.3s' }} />
              </Flex>
              <Flex justify="between" style={{ marginTop: 6 }}>
                <Text size="1" weight="bold" style={{ color: 'var(--accent-9)' }}>You {m0(giveVal)}</Text>
                <Text size="1" weight="bold" style={{ color: 'var(--green-9)' }}>{trader.name} {m0(getVal)}</Text>
              </Flex>

              {/* cash balancer */}
              {Math.abs(diff) > 10 && (
                <button onClick={() => { setCash(suggestedCash); setCashWho(diff > 0 ? 'you' : 'them'); }} style={{
                  width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', gap: 9, border: 'none', cursor: 'pointer',
                  background: 'var(--accent-a3)', borderRadius: 11, padding: '10px 12px', textAlign: 'left',
                }}>
                  <ArrowLeftRight size={16} style={{ color: 'var(--accent-9)' }} />
                  <Text size="2" style={{ flex: 1, color: 'var(--gray-11)' }}>
                    Even it out: <Text weight="bold">{diff > 0 ? 'you add' : 'they add'} {m0(suggestedCash)}</Text> cash
                  </Text>
                  <Text weight="bold" size="2" style={{ color: 'var(--accent-9)' }}>{cash > 0 ? '✓' : 'Add'}</Text>
                </button>
              )}
              {cash > 0 && (
                <Text as="div" size="1" color="gray" style={{ marginTop: 8, textAlign: 'center' }}>
                  + {m0(cash)} cash {cashWho === 'you' ? 'from you' : 'from ' + trader.name}
                </Text>
              )}
            </Card>

            {/* verify or proceed */}
            {!app.isVerified() ? (
              <button onClick={() => navigate('/verify')} style={{
                width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', border: 'none', cursor: 'pointer',
                background: 'var(--accent-a3)', borderRadius: 14, padding: '14px 15px', boxShadow: 'inset 0 0 0 1.5px var(--accent-9)',
              }}>
                <Flex align="center" justify="center" style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: 'var(--accent-9)', color: '#fff' }}>
                  <Shield size={18} />
                </Flex>
                <Box style={{ flex: 1 }}>
                  <Text as="div" weight="bold" size="2" style={{ color: 'var(--accent-9)' }}>Verify your identity to trade</Text>
                  <Text as="div" size="1" color="gray">In-person trades require both people verified. ~2 min.</Text>
                </Box>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--accent-9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ) : (
              <Button size="3" style={{ width: '100%', marginTop: 16 }} disabled={giveSel.length === 0 && getSel.length === 0} onClick={() => setPhase('meetup')}>
                Choose where to meet →
              </Button>
            )}
          </Box>
        )}

        {/* ════════ MEETUP ════════ */}
        {phase === 'meetup' && trader && (
          <Box style={{ padding: '18px 16px 16px' }}>
            {/* verified banner */}
            <Flex align="center" gap="2" style={{ background: 'var(--green-a3)', borderRadius: 12, padding: '10px 13px', marginBottom: 12 }}>
              <Shield size={15} style={{ color: 'var(--green-9)' }} />
              <Text weight="bold" size="2" style={{ color: 'var(--green-9)' }}>You & {trader.name} are both ID-verified ✓</Text>
            </Flex>

            {/* safety checklist */}
            <Card style={{ padding: '13px 15px', marginBottom: 16 }}>
              <Text as="div" weight="bold" size="2" style={{ marginBottom: 9 }}>Safe-trade checklist</Text>
              {['Meet in a public, well-lit place (a shop is ideal)', 'Inspect cards before money or cards change hands', 'Keep it in the app — share no personal contact info', "Tell someone where you're going"].map((s, i) => (
                <Flex key={i} align="start" gap="2" style={{ padding: '4px 0' }}>
                  <Text style={{ color: 'var(--green-9)', fontSize: 13, marginTop: 1 }}>✓</Text>
                  <Text size="2" color="gray" style={{ lineHeight: 1.4 }}>{s}</Text>
                </Flex>
              ))}
            </Card>

            {/* info */}
            <Flex gap="3" align="start" style={{ background: 'var(--gray-a3)', borderRadius: 13, padding: '12px 14px', marginBottom: 16 }}>
              <Shield size={17} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
              <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
                Suggest where to meet — {trader.name} can accept it or counter with their own spot. A local shop is safest (neutral ground + authentication), but you can propose anywhere public.
              </Text>
            </Flex>

            {/* local game shops */}
            <Flex align="baseline" gap="2" style={{ margin: '4px 2px 9px' }}>
              <Text weight="bold" size="2">Local game shops</Text>
              <Text size="1" color="gray">· recommended</Text>
            </Flex>
            <Flex direction="column" gap="3">
              {SHOPS.filter(s => s.tradeHub).map(s => {
                const theirDist = Math.round((Math.abs(s.dist - trader.dist) + 1.4) * 10) / 10;
                const mid = Math.round(((s.dist + theirDist) / 2) * 10) / 10;
                const sel = place && place.id === s.id;
                return (
                  <button key={s.id} onClick={() => setPlace({
                    id: s.id, name: s.name, sub: s.loc + ' · ' + (s.vault ? 'authentication on site' : 'trade hub'),
                    kind: 'shop', vault: s.vault, tint: s.tint, initial: s.initial,
                  })} style={{
                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, border: 'none', cursor: 'pointer',
                    background: sel ? 'var(--accent-a3)' : 'var(--color-surface)', borderRadius: 14, padding: 13,
                    boxShadow: sel ? 'inset 0 0 0 2px var(--accent-9)' : '0 1px 3px rgba(20,24,40,0.05)',
                  }}>
                    <Avatar who={s} size={42} />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Flex align="center" gap="2">
                        <Text weight="bold" size="3">{s.name}</Text>
                        {s.vault && <Badge color="orange" size="1" variant="soft">VAULT</Badge>}
                      </Flex>
                      <Text as="div" size="1" color="gray">{s.loc} · {s.hours}</Text>
                      <Text as="div" size="1" weight="bold" style={{ color: 'var(--accent-9)', marginTop: 2 }}>~{mid} mi midpoint · {s.dist} mi you · {theirDist} mi them</Text>
                    </Box>
                    <Flex align="center" justify="center" style={{
                      width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                      boxShadow: sel ? 'none' : 'inset 0 0 0 2px var(--gray-a5)',
                      background: sel ? 'var(--accent-9)' : 'transparent',
                    }}>
                      {sel && <Box style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}
                    </Flex>
                  </button>
                );
              })}
            </Flex>

            {/* public spots */}
            <Text as="div" weight="bold" size="2" style={{ margin: '20px 2px 9px' }}>Public meetup spots</Text>
            <Flex direction="column" gap="3">
              {[
                { id: 'lib', name: 'Central Library — cafe', sub: '1.6 mi midpoint · busy, well-lit', emoji: '📚' },
                { id: 'mall', name: 'Riverside Mall food court', sub: '2.1 mi midpoint · public & central', emoji: '🛍' },
                { id: 'cafe', name: 'Grounds Coffee on Main', sub: '1.2 mi midpoint · cameras, seating', emoji: '☕' },
              ].map(p => {
                const sel = place && place.id === p.id;
                return (
                  <button key={p.id} onClick={() => setPlace({ id: p.id, name: p.name, sub: p.sub, kind: 'public', tint: 'var(--gray-a9)', initial: p.emoji })} style={{
                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, border: 'none', cursor: 'pointer',
                    background: sel ? 'var(--accent-a3)' : 'var(--color-surface)', borderRadius: 14, padding: 13,
                    boxShadow: sel ? 'inset 0 0 0 2px var(--accent-9)' : '0 1px 3px rgba(20,24,40,0.05)',
                  }}>
                    <Flex align="center" justify="center" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'var(--gray-a3)', fontSize: 20 }}>
                      {p.emoji}
                    </Flex>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text as="div" weight="bold" size="3">{p.name}</Text>
                      <Text as="div" size="1" color="gray">{p.sub}</Text>
                    </Box>
                    <Flex align="center" justify="center" style={{
                      width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                      boxShadow: sel ? 'none' : 'inset 0 0 0 2px var(--gray-a5)',
                      background: sel ? 'var(--accent-9)' : 'transparent',
                    }}>
                      {sel && <Box style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}
                    </Flex>
                  </button>
                );
              })}
            </Flex>

            {/* custom spot */}
            <Text as="div" weight="bold" size="2" style={{ margin: '20px 2px 9px' }}>Or propose your own</Text>
            <Flex align="center" gap="2" style={{
              background: 'var(--color-surface)', borderRadius: 13, padding: '12px 14px',
              boxShadow: place && place.id === 'custom' ? 'inset 0 0 0 2px var(--accent-9)' : 'inset 0 0 0 1px var(--gray-a5)',
            }}>
              <MapPin size={18} style={{ color: 'var(--gray-a9)', flexShrink: 0 }} />
              <input
                value={customSpot}
                onChange={e => {
                  setCustomSpot(e.target.value);
                  setPlace(e.target.value.trim()
                    ? { id: 'custom', name: e.target.value.trim(), sub: 'Proposed by you · pending agreement', kind: 'custom', tint: 'var(--accent-9)', initial: '📍' }
                    : null);
                }}
                placeholder="e.g. Eastgate Park pavilion, Sat morning"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, minWidth: 0 }}
              />
            </Flex>

            <Button size="3" disabled={!place} style={{ width: '100%', marginTop: 18 }} onClick={() => setPhase('sent')}>
              {place ? 'Propose ' + (place.name.length > 22 ? 'this spot' : place.name) + ' →' : 'Pick a meetup spot'}
            </Button>
          </Box>
        )}

        {/* ════════ SENT ════════ */}
        {phase === 'sent' && trader && (
          <TradeSent
            trader={trader} giveSel={giveSel} getSel={getSel}
            cash={cash} cashWho={cashWho} place={place} setPhase={setPhase}
          />
        )}
      </Box>
    </Box>
  );
}
