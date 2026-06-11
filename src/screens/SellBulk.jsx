import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Switch } from '@radix-ui/themes';
import { ArrowLeft, Check, Tag, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUB_CARDS, SCAN_POOL } from '../data/shops';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

// pricing strategies
const STRATS = [
  { id: 'market', label: 'At market', mult: 1.0, sub: 'Match current value' },
  { id: 'under', label: 'Undercut 5%', mult: 0.95, sub: 'Sell a bit faster' },
  { id: 'quick', label: 'Quick sale', mult: 0.90, sub: 'Move it now' },
];

// ── Method chooser row ───────────────────────────────────────
function MethodRow({ icon, title, sub, time, hero, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13, border: 'none', cursor: 'pointer',
      background: hero ? 'var(--accent-a3)' : 'var(--color-surface)', borderRadius: 14, padding: '14px 15px',
      boxShadow: hero ? 'inset 0 0 0 2px var(--accent-9)' : '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Flex align="center" justify="center" style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0, fontSize: 20,
        background: hero ? 'var(--accent-9)' : 'var(--gray-a3)', color: hero ? '#fff' : 'var(--gray-11)',
      }}>{icon}</Flex>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text as="div" weight="bold" size="3" style={{ color: hero ? 'var(--accent-9)' : undefined }}>{title}</Text>
        <Text as="div" size="1" color="gray">{sub}</Text>
      </Box>
      <Text size="1" weight="bold" style={{
        color: hero ? 'var(--accent-9)' : 'var(--gray-a9)',
        background: hero ? '#fff' : 'var(--gray-a3)', borderRadius: 7, padding: '3px 8px',
      }}>{time}</Text>
    </button>
  );
}

// ── Live Sweep scanner ───────────────────────────────────────
function LiveSweep({ onDone }) {
  const [count, setCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [thumbs, setThumbs] = useState([]);
  const [running, setRunning] = useState(true);
  const [last, setLast] = useState(null);
  const [flash, setFlash] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      const c = SCAN_POOL[idx.current % SCAN_POOL.length];
      idx.current += 1;
      setCount(n => n + 1 + (Math.random() < 0.3 ? 1 : 0));
      setLast(c);
      if (c.match) { setMatchCount(m => m + 1); setFlash(true); setTimeout(() => setFlash(false), 450); }
      setThumbs(t => [{ ...c, key: Date.now() + Math.random() }, ...t].slice(0, 7));
    }, 360);
    return () => clearInterval(t);
  }, [running]);

  return (
    <Flex direction="column" style={{ height: '100%', background: '#0c0e13' }}>
      {/* header */}
      <Flex align="center" justify="between" px="4" pt="3">
        <button onClick={() => onDone(0)} style={{
          background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          <ArrowLeft size={18} /> Methods
        </button>
        <Text weight="bold" size="3" style={{ color: '#fff' }}>Live Sweep</Text>
        <Flex align="center" gap="1" style={{ fontSize: 12.5, fontWeight: 700, color: running ? '#7fe7a4' : '#ffd166' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'currentColor' }} />
          {running ? 'Scanning' : 'Paused'}
        </Flex>
      </Flex>

      {/* viewfinder */}
      <Box style={{
        flex: 1, position: 'relative', margin: '6px 16px 0', borderRadius: 22, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 30%, #1a1d26, #0c0e13)',
        boxShadow: flash ? '0 0 0 3px var(--amber-9), inset 0 0 60px rgba(212,160,23,0.25)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        transition: 'box-shadow 0.2s',
      }}>
        {/* card in frame */}
        {last && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-3deg)',
            filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.5))',
          }}>
            <CardArt item={last} w={150} radius={12} />
          </div>
        )}
        {/* reticle */}
        <div style={{
          position: 'absolute', inset: '14% 16%', borderRadius: 14,
          border: '2.5px solid rgba(255,255,255,0.5)', boxShadow: '0 0 0 100vmax rgba(0,0,0,0.18)',
        }} />
        {/* recognition tag */}
        {last && (
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            background: last.match ? 'var(--amber-9)' : 'var(--accent-9)', color: last.match ? '#2a2000' : '#fff',
            fontWeight: 700, fontSize: 12.5, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            {last.match ? '* Buylist match -- ' : ''}{last.name}
          </div>
        )}
        {/* counter */}
        <Flex align="end" justify="between" style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
          <Box>
            <Text as="div" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 46, color: '#fff', lineHeight: 1 }}>{count}</Text>
            <Text as="div" size="1" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>cards detected</Text>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Text as="div" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 20, color: 'var(--amber-9)' }}>{matchCount}</Text>
            <Text as="div" size="1" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>buylist hits</Text>
          </Box>
        </Flex>
      </Box>

      {/* thumb tray */}
      <Flex gap="2" px="4" py="3" style={{ overflowX: 'hidden', minHeight: 70, alignItems: 'center' }}>
        {thumbs.length === 0 ? (
          <Text size="2" style={{ color: 'rgba(255,255,255,0.4)' }}>Flip through your stack -- we capture each card...</Text>
        ) : thumbs.map((c) => (
          <Box key={c.key} style={{
            width: 38, height: 53, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.18)',
          }}>
            <CardArt item={c} w={38} radius={6} />
          </Box>
        ))}
      </Flex>

      {/* controls */}
      <Flex gap="3" px="4" pb="6">
        <button onClick={() => setRunning(r => !r)} style={{
          flex: 1, background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 14,
          padding: 15, border: 'none', fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
        }}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={() => onDone(Math.max(count, 1))} style={{
          flex: 1.3, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: 15, border: 'none', fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
        }}>
          Done -- review
        </button>
      </Flex>
    </Flex>
  );
}

// ── Toggle row ───────────────────────────────────────────────
function ToggleLine({ label, checked, onChange }) {
  return (
    <Flex align="center" justify="between" py="3">
      <Text weight="bold" size="3">{label}</Text>
      <Switch checked={checked} onCheckedChange={onChange} size="3" />
    </Flex>
  );
}

// ── Bulk price row ───────────────────────────────────────────
function BulkPriceRow({ c, price, listType, excluded, onToggle }) {
  return (
    <Flex align="center" gap="3" p="2" style={{
      background: 'var(--color-surface)', borderRadius: 13, opacity: excluded ? 0.5 : 1,
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Box style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6, flexShrink: 0 }}>
        <CardArt item={c} w={42} radius={5} />
      </Box>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Flex align="center" gap="1">
          <Text weight="bold" size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</Text>
          {c.flag && <Text size="1" style={{ color: 'var(--red-9)' }}>!</Text>}
        </Flex>
        <Text size="1" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.cond} -- x{c.qty} -- mkt {money(c.market, { cents: false })}
        </Text>
      </Box>
      <Box style={{ textAlign: 'right', flexShrink: 0 }}>
        <Text weight="bold" size="2" style={{
          fontFamily: 'var(--mono, monospace)',
          textDecoration: excluded ? 'line-through' : 'none',
          color: excluded ? 'var(--gray-a8)' : undefined,
        }}>{money(price, { cents: false })}</Text>
        <Text as="div" size="1" color="gray">{listType === 'auction' ? 'start bid' : 'list price'}</Text>
      </Box>
      <button onClick={onToggle} style={{
        width: 26, height: 26, borderRadius: 999, flexShrink: 0, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: excluded ? 'var(--gray-a3)' : 'var(--accent-9)', color: excluded ? 'var(--gray-a9)' : '#fff',
        fontSize: 14, fontWeight: 700,
      }}>
        {excluded ? '+' : <Check size={16} />}
      </button>
    </Flex>
  );
}

// ── Main component ───────────────────────────────────────────
export default function SellBulk() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [phase, setPhase] = useState('method');
  const [scanned, setScanned] = useState(0);
  const [strat, setStrat] = useState('market');
  const [listType, setListType] = useState('buynow');
  const [freeShip, setFreeShip] = useState(true);
  const [offers, setOffers] = useState(true);
  const [excluded, setExcluded] = useState({});

  const mult = STRATS.find(s => s.id === strat).mult;
  const included = SUB_CARDS.filter(c => !excluded[c.id]);
  const listed = included.length;
  const grossEach = (c) => Math.round(c.market * mult * (c.qty || 1));
  const gross = included.reduce((s, c) => s + grossEach(c), 0);
  const fee = Math.round(gross * 0.09);
  const net = gross - fee - (freeShip ? included.length * 1 : 0);

  const goBack = () => {
    if (phase === 'method') navigate('/sell');
    else if (phase === 'price') setPhase('method');
    else navigate('/sell');
  };

  if (phase === 'scan') {
    return <LiveSweep onDone={(n) => { if (n === 0) setPhase('method'); else { setScanned(n); setPhase('price'); } }} />;
  }

  return (
    <Flex direction="column" style={{ minHeight: '100%' }}>
      {phase !== 'done' && (
        <Flex align="center" gap="3" p="3" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)' }}>
          <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <Text weight="bold" size="3" style={{ flex: 1 }}>Bulk list to marketplace</Text>
          {phase === 'price' && <Text size="2" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>{listed} cards</Text>}
        </Flex>
      )}

      <Box style={{ flex: 1, overflow: 'auto' }}>
        {/* METHOD */}
        {phase === 'method' && (
          <Box p="4">
            <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.5 }}>Add cards to list</Text>
            <Text as="p" size="2" color="gray" mb="4">Scan your pile -- each card becomes its own listing, auto-priced at market.</Text>
            <Flex direction="column" gap="2">
              <MethodRow hero icon="cam" title="Live Sweep Scan" sub="Flip the stack -- we auto-detect each card" time="fastest" onClick={() => setPhase('scan')} />
              <MethodRow icon="fan" title="Batch Fan Photo" sub="9-12 cards per snap" time="~25 min" onClick={() => showToast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="srch" title="Search & Add" sub="Verify high-value singles" time="precise" onClick={() => showToast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="imp" title="Import List" sub="Manabox -- TCGplayer -- CSV" time="instant" onClick={() => showToast('Live Sweep is wired up for this demo')} />
            </Flex>
            <Flex align="start" gap="2" mt="4" p="3" style={{ background: 'var(--gray-a3)', borderRadius: 12 }}>
              <Tag size={16} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
              <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
                After scanning, we price every card from live market data. You set one strategy for all, then tweak any before publishing.
              </Text>
            </Flex>
          </Box>
        )}

        {/* PRICE / REVIEW */}
        {phase === 'price' && (
          <Box p="4">
            <Flex align="baseline" justify="between">
              <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.5 }}>Price & publish</Text>
              <Text size="2" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>{scanned}+ scanned</Text>
            </Flex>
            <Text as="p" size="2" color="gray" mb="4">
              We auto-priced each card from market. Pick a strategy for all, then fine-tune below.
            </Text>

            {/* strategy buttons */}
            <Flex gap="2" mb="3">
              {STRATS.map(s => (
                <button key={s.id} onClick={() => setStrat(s.id)} style={{
                  flex: 1, textAlign: 'left', padding: '11px 12px', borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: strat === s.id ? 'var(--accent-a3)' : 'var(--color-surface)',
                  boxShadow: strat === s.id ? 'inset 0 0 0 2px var(--accent-9)' : '0 1px 3px rgba(20,24,40,0.05)',
                }}>
                  <Text as="div" weight="bold" size="2" style={{ color: strat === s.id ? 'var(--accent-9)' : undefined }}>{s.label}</Text>
                  <Text as="div" size="1" color="gray" mt="1">{s.sub}</Text>
                </button>
              ))}
            </Flex>

            {/* format toggle */}
            <Flex gap="2" mb="3">
              {[['buynow', 'Buy It Now'], ['auction', 'Auction']].map(([type, label]) => (
                <button key={type} onClick={() => setListType(type)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13.5,
                  background: listType === type ? 'var(--accent-9)' : 'var(--color-surface)',
                  color: listType === type ? '#fff' : 'var(--gray-11)',
                  boxShadow: listType === type ? 'none' : 'inset 0 0 0 1px var(--gray-a4)',
                }}>
                  {type === 'buynow' ? <Zap size={14} /> : <Tag size={14} />} {label}
                </button>
              ))}
            </Flex>

            {/* toggles */}
            <Box p="3" mb="4" style={{ background: 'var(--color-surface)', borderRadius: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <ToggleLine label="Offer free shipping" checked={freeShip} onChange={setFreeShip} />
              <Box style={{ height: 1, background: 'var(--gray-a3)' }} />
              <ToggleLine label="Accept offers on all" checked={offers} onChange={setOffers} />
            </Box>

            {/* card list */}
            <Flex justify="between" mb="2">
              <Text weight="bold" size="3">Your cards</Text>
              <Text size="2" color="gray">{listed} of {SUB_CARDS.length} listing</Text>
            </Flex>
            <Flex direction="column" gap="2">
              {SUB_CARDS.map(c => (
                <BulkPriceRow key={c.id} c={c} price={grossEach(c)} listType={listType}
                  excluded={!!excluded[c.id]} onToggle={() => setExcluded(e => ({ ...e, [c.id]: !e[c.id] }))} />
              ))}
            </Flex>

            {/* payout summary */}
            <Box mt="4" p="4" style={{ background: 'var(--accent-9)', borderRadius: 16, color: '#fff' }}>
              {[['List price total', money(gross)], ['Seller fee (9%)', '-' + money(fee)]].map(([k, v]) => (
                <Flex key={k} justify="between" py="1" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)' }}>
                  <span>{k}</span><span style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 600 }}>{v}</span>
                </Flex>
              ))}
              <Box style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '8px 0' }} />
              <Flex justify="between" align="baseline">
                <Text weight="bold" size="3">You earn if all sell</Text>
                <Text weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 22, color: '#7fe7a4' }}>{money(net)}</Text>
              </Flex>
            </Box>
          </Box>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <Box p="6" style={{ textAlign: 'center', paddingTop: 70 }}>
            <Flex align="center" justify="center" style={{
              width: 84, height: 84, margin: '0 auto', borderRadius: 999,
              background: 'var(--green-a3)', color: 'var(--green-11)',
            }}>
              <Check size={44} />
            </Flex>
            <Text as="div" size="6" weight="bold" mt="4" style={{ letterSpacing: -0.5 }}>{listed} cards listed!</Text>
            <Text as="p" size="3" color="gray" style={{ lineHeight: 1.5, margin: '4px auto 0', maxWidth: 290 }}>
              Your cards are live on the marketplace{listType === 'auction' ? ' as 7-day auctions' : ''}. We'll notify you on every sale and offer.
            </Text>
            {/* mini grid */}
            <Flex gap="2" justify="center" mt="4" style={{ overflowX: 'auto' }}>
              {included.slice(0, 8).map(c => (
                <Box key={c.id} style={{ flexShrink: 0, position: 'relative' }}>
                  <CardArt item={c} w={62} />
                  <Box style={{
                    position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)', color: '#fff', fontFamily: 'var(--mono, monospace)',
                    fontWeight: 700, fontSize: 9, padding: '1px 5px', borderRadius: 5, whiteSpace: 'nowrap',
                  }}>{money(grossEach(c), { cents: false })}</Box>
                </Box>
              ))}
            </Flex>
            <button onClick={() => navigate('/watch')} style={{
              width: '100%', marginTop: 22, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
              padding: 15, border: 'none', fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
            }}>Manage my listings</button>
            <button onClick={() => navigate('/')} style={{
              marginTop: 10, background: 'none', border: 'none', color: 'var(--gray-a9)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>Back to browse</button>
          </Box>
        )}
      </Box>

      {/* footer */}
      {phase === 'price' && (
        <Box p="4" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--gray-a4)' }}>
          <button onClick={() => setPhase('done')} disabled={listed === 0} style={{
            width: '100%', background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
            padding: 16, border: 'none', fontWeight: 700, fontSize: 16,
            opacity: listed === 0 ? 0.45 : 1, cursor: listed === 0 ? 'default' : 'pointer',
          }}>
            Publish {listed} listing{listed !== 1 ? 's' : ''} -- {money(gross)}
          </button>
        </Box>
      )}
    </Flex>
  );
}
