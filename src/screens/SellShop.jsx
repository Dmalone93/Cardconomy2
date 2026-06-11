import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ArrowLeft, Check, Shield, Zap, Tag, ChevronRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP, SUBMISSION, SUB_CARDS, BULK_RATES, subStats, SCAN_POOL } from '../data/shops';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

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
    <Flex direction="column" style={{ height: '100vh', background: '#0c0e13' }}>
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

      <Box style={{
        flex: 1, position: 'relative', margin: '6px 16px 0', borderRadius: 22, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 30%, #1a1d26, #0c0e13)',
        boxShadow: flash ? '0 0 0 3px var(--amber-9), inset 0 0 60px rgba(212,160,23,0.25)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        transition: 'box-shadow 0.2s',
      }}>
        {last && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-3deg)',
            filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.5))',
          }}>
            <CardArt item={last} w={150} radius={12} />
          </div>
        )}
        <div style={{
          position: 'absolute', inset: '14% 16%', borderRadius: 14,
          border: '2.5px solid rgba(255,255,255,0.5)', boxShadow: '0 0 0 100vmax rgba(0,0,0,0.18)',
        }} />
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

      <Flex gap="2" px="4" py="3" style={{ overflowX: 'hidden', minHeight: 70, alignItems: 'center' }}>
        {thumbs.length === 0 ? (
          <Text size="2" style={{ color: 'rgba(255,255,255,0.4)' }}>Flip through your stack -- we capture each card...</Text>
        ) : thumbs.map(c => (
          <Box key={c.key} style={{
            width: 38, height: 53, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.18)',
          }}>
            <CardArt item={c} w={38} radius={6} />
          </Box>
        ))}
      </Flex>

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

// ── Field component ──────────────────────────────────────────
function Field({ label, value }) {
  return (
    <Box p="3" mb="3" style={{ background: 'var(--color-surface)', borderRadius: 13, boxShadow: 'inset 0 0 0 1px var(--gray-a4)' }}>
      <Text as="div" size="1" color="gray" weight="bold">{label}</Text>
      <Text as="div" size="4" weight="bold" mt="1">{value}</Text>
    </Box>
  );
}

// ── Triage card ──────────────────────────────────────────────
function TriageCard({ color, icon, title, sub, onClick, accent, muted }) {
  return (
    <button onClick={onClick} disabled={muted} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, border: 'none',
      cursor: muted ? 'default' : 'pointer',
      background: 'var(--color-surface)', borderRadius: 13, padding: '12px 14px',
      boxShadow: accent ? 'inset 0 0 0 1.5px var(--red-9)' : '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Flex align="center" justify="center" style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: color, color: '#fff', fontSize: 16, opacity: muted ? 0.5 : 1,
      }}>{icon}</Flex>
      <Box style={{ flex: 1 }}>
        <Text as="div" weight="bold" size="3">{title}</Text>
        <Text as="div" size="1" color="gray">{sub}</Text>
      </Box>
      {!muted && <ChevronRight size={16} style={{ color: 'var(--gray-a6)' }} />}
    </button>
  );
}

// ── Review body ──────────────────────────────────────────────
function ReviewBody({ scanned, stats, cond, setCond, bulkChoice, setBulkChoice, showToast }) {
  const flagged = SUB_CARDS.filter(c => c.flag);
  return (
    <Box p="4">
      <Flex align="baseline" justify="between">
        <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.5 }}>Review</Text>
        <Text size="2" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>{SUBMISSION.total.toLocaleString()} cards</Text>
      </Flex>
      <Text as="p" size="2" color="gray" mb="4">
        We scanned <Text weight="bold">{scanned}+</Text> just now. No need to grade each one -- set a blanket condition and we flag exceptions.
      </Text>

      {/* blanket condition */}
      <Box p="3" mb="3" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        <Text as="div" weight="bold" size="3" mb="2">Blanket condition <Text color="gray" weight="regular"> -- unflagged cards</Text></Text>
        <Flex gap="2">
          {['NM', 'LP', 'MP', 'HP'].map(c => (
            <button key={c} onClick={() => setCond(c)} style={{
              flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13.5,
              background: cond === c ? 'var(--accent-9)' : 'var(--gray-a3)',
              color: cond === c ? '#fff' : 'var(--gray-11)',
            }}>{c}</button>
          ))}
        </Flex>
      </Box>

      {/* triage groups */}
      <Flex direction="column" gap="2" mb="4">
        <TriageCard color="var(--red-9)" icon="!" title={flagged.length + ' flagged for damage'} sub="Creasing / whitening -- tap to review" onClick={() => showToast('Showing flagged cards')} accent />
        <TriageCard color="var(--amber-9)" icon="*" title={stats.buylistCount + ' match the buylist'} sub="Auto-priced at the shop's buy rate" onClick={() => showToast('Showing buylist matches')} />
        <TriageCard color="var(--accent-9)" icon="o" title={stats.singles + ' singles >= $5'} sub="Priced from the live guide" onClick={() => showToast('Showing notable singles')} />
        <TriageCard color="var(--gray-a8)" icon="~" title={SUBMISSION.bulkCount.toLocaleString() + ' bulk commons'} sub={'Auto ' + cond + ' -- standing bulk rate'} muted />
      </Flex>

      {/* notable preview */}
      <Text as="div" weight="bold" size="3" mb="2">Notable cards we found</Text>
      <Flex gap="3" style={{ overflowX: 'auto', margin: '0 -16px', padding: '0 16px 4px' }}>
        {SUB_CARDS.slice(0, 6).map(c => (
          <Box key={c.id} style={{ flexShrink: 0, width: 92 }}>
            <Box style={{ position: 'relative', background: 'var(--gray-a3)', borderRadius: 11, padding: 8, display: 'flex', justifyContent: 'center' }}>
              <CardArt item={c} w={70} />
              {c.buylist && (
                <span style={{
                  position: 'absolute', top: 5, left: 5, background: 'var(--amber-9)', color: '#3a2a00',
                  fontWeight: 800, fontSize: 9, borderRadius: 5, padding: '1px 5px',
                }}>WANT</span>
              )}
              {c.flag && (
                <span style={{
                  position: 'absolute', top: 5, left: 5, background: 'var(--red-9)', color: '#fff',
                  fontWeight: 800, fontSize: 9, borderRadius: 5, padding: '1px 5px',
                }}>!</span>
              )}
            </Box>
            <Text as="div" weight="bold" size="1" mt="1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</Text>
            <Text as="div" size="1" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(c.market, { cents: false })}</Text>
          </Box>
        ))}
      </Flex>

      {/* bulk choice */}
      <Box p="3" mt="4" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        <Text as="div" weight="bold" size="3">Your {SUBMISSION.bulkCount.toLocaleString()} bulk cards</Text>
        <Text as="div" size="2" color="gray" mb="3">Sell at the shop's standing rate, or keep them and only sell the hits.</Text>
        <Flex gap="2">
          <button onClick={() => setBulkChoice('sell')} style={{
            flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13.5,
            background: bulkChoice === 'sell' ? 'var(--accent-a3)' : 'var(--gray-a3)',
            color: bulkChoice === 'sell' ? 'var(--accent-9)' : 'var(--gray-11)',
            boxShadow: bulkChoice === 'sell' ? 'inset 0 0 0 2px var(--accent-9)' : 'none',
          }}>Sell bulk -- ~{money(SUBMISSION.bulkPayout, { cents: false })}</button>
          <button onClick={() => setBulkChoice('keep')} style={{
            flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13.5,
            background: bulkChoice === 'keep' ? 'var(--accent-a3)' : 'var(--gray-a3)',
            color: bulkChoice === 'keep' ? 'var(--accent-9)' : 'var(--gray-11)',
            boxShadow: bulkChoice === 'keep' ? 'inset 0 0 0 2px var(--accent-9)' : 'none',
          }}>Keep bulk</button>
        </Flex>
      </Box>

      {/* estimate */}
      <Flex align="center" justify="between" p="4" mt="3" style={{ background: 'var(--accent-9)', borderRadius: 14 }}>
        <Box>
          <Text as="div" size="1" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Est. market value</Text>
          <Text as="div" size="1" style={{ color: 'rgba(255,255,255,0.5)' }}>Final offer set by the shop</Text>
        </Box>
        <Text weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 26, color: '#fff' }}>
          {money(stats.estMarket, { cents: false })}
        </Text>
      </Flex>
    </Box>
  );
}

// ── Confirmation ─────────────────────────────────────────────
function Confirmation({ onThread, onHome, onShop }) {
  return (
    <Box p="6" style={{ textAlign: 'center', paddingTop: 70 }}>
      <Flex align="center" justify="center" style={{
        width: 84, height: 84, margin: '0 auto', borderRadius: 999,
        background: 'var(--green-a3)', color: 'var(--green-11)',
      }}>
        <Check size={44} />
      </Flex>
      <Text as="div" size="6" weight="bold" mt="4" style={{ letterSpacing: -0.5 }}>Sent to {SHOP.name}!</Text>
      <Text as="p" size="3" color="gray" style={{ lineHeight: 1.5, margin: '4px auto 0', maxWidth: 280 }}>
        They've been alerted and will text an offer to {SUBMISSION.seller.phone}. Keep shopping -- your cards stay with you.
      </Text>
      <Box p="4" mt="4" style={{ background: 'var(--color-surface)', borderRadius: 16, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        {[['Submission', '#' + SUBMISSION.id], ['Cards', SUBMISSION.total.toLocaleString()], ['Typical reply', '< 1 hr']].map(([k, v], i) => (
          <Flex key={k} justify="between" py="2" style={{ borderBottom: i < 2 ? '1px solid var(--gray-a3)' : 'none' }}>
            <Text size="2" color="gray">{k}</Text>
            <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', color: i === 2 ? 'var(--green-11)' : undefined }}>{v}</Text>
          </Flex>
        ))}
      </Box>
      <Flex align="center" gap="3" p="3" mt="3" style={{ background: 'var(--accent-a3)', borderRadius: 13 }}>
        <Flex align="center" justify="center" style={{
          width: 38, height: 38, borderRadius: 10, background: '#fff', color: 'var(--accent-9)', flexShrink: 0, fontSize: 20,
        }}>T</Flex>
        <Box style={{ textAlign: 'left', flex: 1 }}>
          <Text as="div" weight="bold" size="2" style={{ color: 'var(--accent-9)' }}>Counter ticket #{SUBMISSION.ticket}</Text>
          <Text as="div" size="1">Show this with your stack to finish at the counter.</Text>
        </Box>
      </Flex>
      <button onClick={onThread} style={{
        width: '100%', marginTop: 18, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
        padding: 15, border: 'none', fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
      }}>View message thread</button>
      <button onClick={onShop} style={{
        width: '100%', marginTop: 9, background: 'var(--color-surface)', borderRadius: 14,
        padding: 13, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        boxShadow: 'inset 0 0 0 1.5px var(--gray-a4)',
      }}>Demo: see the shop's side</button>
      <button onClick={onHome} style={{
        marginTop: 10, background: 'none', border: 'none', color: 'var(--gray-a9)',
        fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>Back to browse</button>
    </Box>
  );
}

// ── Chat bubble ──────────────────────────────────────────────
function Bubble({ who, children }) {
  const me = who === 'me';
  return (
    <Box style={{
      alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '85%',
      background: me ? 'var(--accent-9)' : 'var(--color-surface)', color: me ? '#fff' : undefined,
      borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      padding: '10px 13px', fontSize: 13.5, lineHeight: 1.4,
      boxShadow: '0 1px 3px rgba(20,24,40,0.06)',
    }}>
      {children}
    </Box>
  );
}

// ── Quick reply button ───────────────────────────────────────
function QuickReply({ label, primary, onClick }) {
  return (
    <button onClick={onClick} style={{
      whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 700, fontSize: 13.5,
      padding: '11px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
      background: primary ? 'var(--accent-9)' : 'var(--color-surface)', color: primary ? '#fff' : 'var(--gray-11)',
      boxShadow: primary ? 'none' : 'inset 0 0 0 1.5px var(--gray-a4)',
    }}>{label}</button>
  );
}

// ── Seller thread ────────────────────────────────────────────
function SellerThread({ onShop, onHome }) {
  const { showToast } = useApp();
  const stats = subStats();
  const cash = 620, credit = 744;
  const [reply, setReply] = useState(null);

  return (
    <Flex direction="column" style={{ height: '100%' }}>
      <Flex align="center" gap="3" px="3" pt="3" pb="3" style={{ background: SHOP.tint, color: '#fff' }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <Flex align="center" justify="center" style={{
          width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.2)', fontWeight: 800,
        }}>{SHOP.initial}</Flex>
        <Box style={{ flex: 1 }}>
          <Text as="div" weight="bold" size="3">{SHOP.name}</Text>
          <Text as="div" size="1" style={{ opacity: 0.85 }}>Submission #{SUBMISSION.id} -- 1,000 cards</Text>
        </Box>
      </Flex>

      <Flex direction="column" gap="2" p="3" style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
        <Bubble who="shop">Hey Jordan! Went through your submission -- thanks for the detail</Bubble>
        {/* offer card */}
        <Box style={{
          alignSelf: 'flex-start', maxWidth: '92%', background: 'var(--color-surface)',
          borderRadius: '4px 16px 16px 16px', padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.08)',
        }}>
          <Text as="div" weight="bold" size="3" mb="2">Your offer</Text>
          {[['142 buylist matches', money(stats.buylistPayout, { cents: false })], ['34 singles (priced)', '$430'], ['824 bulk', '$8']].map(([k, v]) => (
            <Flex key={k} justify="between" gap="3" py="1" style={{ fontSize: 13 }}>
              <Text color="gray" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</Text>
              <Text weight="bold" style={{ fontFamily: 'var(--mono, monospace)', flexShrink: 0 }}>{v}</Text>
            </Flex>
          ))}
          <Box style={{ height: 1, background: 'var(--gray-a3)', margin: '8px 0' }} />
          <Flex gap="2">
            <Box style={{ flex: 1, background: 'var(--gray-a3)', borderRadius: 11, padding: '9px 11px' }}>
              <Text as="div" size="1" color="gray" weight="bold">Cash</Text>
              <Text as="div" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 19 }}>{money(cash, { cents: false })}</Text>
            </Box>
            <Box style={{
              flex: 1, background: 'var(--green-a3)', borderRadius: 11, padding: '9px 11px',
              boxShadow: 'inset 0 0 0 1.5px var(--green-9)',
            }}>
              <Text as="div" size="1" weight="bold" style={{ color: 'var(--green-11)' }}>Store credit +20%</Text>
              <Text as="div" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', fontSize: 19, color: 'var(--green-11)' }}>{money(credit, { cents: false })}</Text>
            </Box>
          </Flex>
        </Box>
        <Bubble who="shop">Swing by today to finish? Bring the stack + ticket #{SUBMISSION.ticket}.</Bubble>
        {reply && <Bubble who="me">{reply}</Bubble>}
        {reply && <Bubble who="shop">Perfect -- see you then! We'll have it ready.</Bubble>}
      </Flex>

      {/* quick replies */}
      <Box p="3" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--gray-a4)' }}>
        {!reply ? (
          <Flex gap="2" style={{ overflowX: 'auto' }}>
            <QuickReply label={'Accept credit -- ' + money(credit, { cents: false })} primary onClick={() => { setReply('Accept store credit -- coming by after 5pm'); showToast('Offer accepted'); }} />
            <QuickReply label={'Take cash -- ' + money(cash, { cents: false })} onClick={() => { setReply('Cash works -- I\'ll come by after 5pm'); showToast('Offer accepted'); }} />
            <QuickReply label="Pick a time" onClick={() => setReply("What times work today? I'm flexible.")} />
          </Flex>
        ) : (
          <button onClick={onShop} style={{
            width: '100%', background: 'var(--gray-a3)', borderRadius: 13, padding: 13, border: 'none',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'inset 0 0 0 1.5px var(--gray-a4)',
          }}>Demo: see the shop's side</button>
        )}
      </Box>
    </Flex>
  );
}

// ── Main SellShop screen ─────────────────────────────────────
export default function SellShop() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [phase, setPhase] = useState('land');
  const [scanned, setScanned] = useState(0);
  const [cond, setCond] = useState('NM');
  const [bulkChoice, setBulkChoice] = useState('sell');
  const stats = subStats();

  const goBack = () => {
    if (phase === 'land') navigate('/sell');
    else if (phase === 'identity') setPhase('land');
    else if (phase === 'method') setPhase('identity');
    else if (phase === 'review') setPhase('method');
    else if (phase === 'thread') setPhase('done');
    else navigate('/sell');
  };

  // scanner is full-bleed dark
  if (phase === 'scan') {
    return <LiveSweep onDone={(n) => { if (n === 0) setPhase('method'); else { setScanned(n); setPhase('review'); } }} />;
  }

  return (
    <Flex direction="column" style={{ minHeight: '100%' }}>
      {phase !== 'done' && phase !== 'thread' && (
        <Flex align="center" gap="3" p="3" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)' }}>
          <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <Flex align="center" gap="2" style={{ flex: 1 }}>
            <Flex align="center" justify="center" style={{
              width: 26, height: 26, borderRadius: 8, background: SHOP.tint, color: '#fff', fontWeight: 800, fontSize: 14,
            }}>{SHOP.initial}</Flex>
            <Text weight="bold" size="3">{SHOP.name}</Text>
          </Flex>
          <Shield size={17} style={{ color: SHOP.tint }} />
        </Flex>
      )}

      <Box style={{ flex: 1, overflow: 'auto' }}>
        {/* LAND */}
        {phase === 'land' && (
          <Box p="4">
            <Box style={{ textAlign: 'center', padding: '8px 0 18px' }}>
              <Flex align="center" justify="center" style={{
                width: 76, height: 76, margin: '0 auto 12px', borderRadius: 20, background: SHOP.tint, color: '#fff',
                fontWeight: 800, fontSize: 36, boxShadow: '0 8px 22px rgba(47,143,91,0.4)',
              }}>{SHOP.initial}</Flex>
              <Text as="div" size="6" weight="bold" style={{ letterSpacing: -0.5 }}>{SHOP.name}</Text>
              <Flex align="center" justify="center" gap="2" mt="1">
                <Text size="2" style={{ color: 'var(--amber-9)' }}>****</Text>
                <Text size="2" color="gray">{SHOP.rating} -- {SHOP.loc}</Text>
              </Flex>
            </Box>
            <Box p="4" style={{ background: 'var(--color-surface)', borderRadius: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Text as="div" weight="bold" size="4" style={{ letterSpacing: -0.3 }}>Sell your cards here</Text>
              <Text as="p" size="2" color="gray" style={{ lineHeight: 1.5, marginTop: 6 }}>{SHOP.blurb}</Text>
              <Flex gap="2" mt="3">
                {[[Zap, 'Scan in minutes'], [Tag, 'Live price guide'], [Shield, 'In-person & safe']].map(([Icon, l], i) => (
                  <Box key={i} style={{ flex: 1, background: 'var(--gray-a3)', borderRadius: 11, padding: '10px 8px', textAlign: 'center' }}>
                    <Flex justify="center" mb="1" style={{ color: 'var(--accent-9)' }}><Icon size={17} /></Flex>
                    <Text size="1" weight="bold" color="gray" style={{ lineHeight: 1.2 }}>{l}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>
            <button onClick={() => setPhase('identity')} style={{
              width: '100%', marginTop: 16, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
              padding: 16, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}>
              Start a submission
            </button>
            <Text as="div" size="2" color="gray" style={{ textAlign: 'center', marginTop: 10 }}>No account needed -- they text you an offer</Text>
          </Box>
        )}

        {/* IDENTITY */}
        {phase === 'identity' && (
          <Box p="4">
            <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.5 }}>How do we reach you?</Text>
            <Text as="p" size="2" color="gray" mb="4">The shop texts your offer here. No password, no app.</Text>
            <Field label="Mobile number" value="(608) 555-0142" />
            <Field label="Your name (for the counter)" value="Jordan M." />
            <Flex align="center" gap="2" mt="1" style={{ color: 'var(--gray-a9)' }}>
              <Shield size={15} style={{ color: SHOP.tint }} />
              <Text size="2" color="gray">We never share your number with buyers.</Text>
            </Flex>
            <button onClick={() => setPhase('method')} style={{
              width: '100%', marginTop: 22, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
              padding: 16, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}>Continue</button>
          </Box>
        )}

        {/* METHOD */}
        {phase === 'method' && (
          <Box p="4">
            <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.5 }}>Add your cards</Text>
            <Text as="p" size="2" color="gray" mb="4">Big stack? Start with Live Sweep. You can mix methods.</Text>
            <Flex direction="column" gap="2">
              <MethodRow hero icon="cam" title="Live Sweep Scan" sub="Flip the stack -- we auto-detect each card" time="fastest" onClick={() => setPhase('scan')} />
              <MethodRow icon="fan" title="Batch Fan Photo" sub="9-12 cards per snap" time="~25 min" onClick={() => showToast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="chk" title="Set Checklist" sub="Tap cards off a set grid" time="varies" onClick={() => showToast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="srch" title="Search & Add" sub="Verify high-value singles" time="precise" onClick={() => showToast('Live Sweep is wired up for this demo')} />
              <MethodRow icon="imp" title="Import List" sub="Manabox -- TCGplayer -- CSV" time="instant" onClick={() => showToast('Live Sweep is wired up for this demo')} />
            </Flex>
            <Flex align="start" gap="2" mt="4" p="3" style={{ background: 'var(--gray-a3)', borderRadius: 12 }}>
              <Zap size={16} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
              <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
                Mix & match -- sweep the bulk now, then <Text weight="bold">Search & Add</Text> the few chase cards you want hand-verified.
              </Text>
            </Flex>
          </Box>
        )}

        {/* REVIEW */}
        {phase === 'review' && (
          <ReviewBody scanned={scanned} stats={stats} cond={cond} setCond={setCond}
            bulkChoice={bulkChoice} setBulkChoice={setBulkChoice} showToast={showToast} />
        )}

        {/* DONE */}
        {phase === 'done' && (
          <Confirmation onThread={() => setPhase('thread')} onHome={() => navigate('/')} onShop={() => navigate('/shop')} />
        )}

        {/* THREAD */}
        {phase === 'thread' && (
          <SellerThread onShop={() => navigate('/shop')} onHome={() => navigate('/')} />
        )}
      </Box>

      {/* footer for review */}
      {phase === 'review' && (
        <Box p="4" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--gray-a4)' }}>
          <button onClick={() => setPhase('done')} style={{
            width: '100%', background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
            padding: 16, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>
            Send to {SHOP.name}
          </button>
        </Box>
      )}
    </Flex>
  );
}
