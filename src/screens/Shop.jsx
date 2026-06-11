import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Text } from '@radix-ui/themes';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP, SUBMISSION, SUB_CARDS, BULK_RATES, subStats, SCAN_POOL } from '../data/shops';
import { setById } from '../data/games';
import CardArt from '../components/CardArt';
import Sheet from '../components/Sheet';
import PriceChart from '../components/PriceChart';
import { money } from '../components/helpers';

const money0 = (n) => money(n, { cents: false });

// ── Shop Counter (staff app) ────────────────────────────────
export default function Shop() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [view, setView] = useState('inbox'); // inbox | dash | sent
  const [filter, setFilter] = useState('match');
  const [priceCard, setPriceCard] = useState(null);
  const [offer, setOffer] = useState(null);
  const [prices, setPrices] = useState(() => {
    const o = {};
    SUB_CARDS.forEach(c => { if (!c.buylist) o[c.id] = Math.round(c.market * 0.7); });
    return o;
  });
  const stats = subStats();

  if (view === 'inbox') return <ShopInbox navigate={navigate} showToast={showToast} onOpen={() => setView('dash')} />;
  if (view === 'sent') return <ShopSent navigate={navigate} offer={offer} onInbox={() => { setView('inbox'); setOffer(null); }} />;

  // ── Dashboard ──
  const buylistPayout = stats.buylistPayout;
  const singlesPayout = Object.values(prices).reduce((s, v) => s + (v || 0), 0);
  const bulkPayout = SUBMISSION.bulkPayout;
  const cashTotal = Math.round(buylistPayout + singlesPayout + bulkPayout);

  const filtered = SUB_CARDS.filter(c => {
    if (filter === 'match') return c.buylist;
    if (filter === 'singles') return !c.buylist && !c.flag;
    if (filter === 'flag') return c.flag;
    return true;
  });

  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 14px 12px', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--gray-a4)',
      }}>
        <Flex align="center" gap="3">
          <button onClick={() => setView('inbox')} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-12)',
            display: 'flex', alignItems: 'center', padding: 0,
          }}><ArrowLeft size={20} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Flex align="center" gap="2">
              <span style={{
                width: 26, height: 26, borderRadius: 999, background: SHOP.tint,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{SUBMISSION.seller.initial}</span>
              <Text weight="bold" size="4" style={{ whiteSpace: 'nowrap' }}>{SUBMISSION.seller.name}</Text>
            </Flex>
            <Text size="1" style={{
              color: 'var(--gray-9)', marginTop: 1, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
            }}>#{SUBMISSION.id} · {SUBMISSION.total.toLocaleString()} cards · ticket #{SUBMISSION.ticket}</Text>
          </div>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: SHOP.tint,
            background: 'var(--green-a3)', borderRadius: 7, padding: '4px 8px',
          }}>SHOP VIEW</span>
        </Flex>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 120px' }}>
        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <StatTile label="Total cards" value={SUBMISSION.total.toLocaleString()} />
          <StatTile label="Est. market" value={money0(stats.estMarket)} />
          <StatTile label="On your buylist" value={stats.buylistCount} gold />
          <StatTile label="Buylist payout" value={money0(buylistPayout)} accent />
        </div>

        {/* Filter chips */}
        <Flex gap="2" style={{ overflowX: 'auto', margin: '14px 0 10px' }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All itemized</FilterChip>
          <FilterChip active={filter === 'match'} onClick={() => setFilter('match')} gold>Buylist {stats.buylistCount}</FilterChip>
          <FilterChip active={filter === 'singles'} onClick={() => setFilter('singles')}>Singles &ge; $5</FilterChip>
          <FilterChip active={filter === 'flag'} onClick={() => setFilter('flag')} danger>Flagged</FilterChip>
        </Flex>

        {/* Card rows */}
        <Flex direction="column" gap="2">
          {filtered.map(c => (
            <ShopCardRow key={c.id} c={c} price={prices[c.id]} onClick={() => setPriceCard(c)} />
          ))}
        </Flex>

        {/* Bulk block */}
        <div style={{
          marginTop: 14, background: 'var(--color-surface)', borderRadius: 14, padding: 14,
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <Flex align="center" justify="between" mb="3">
            <Text weight="bold" size="3">{SUBMISSION.bulkCount.toLocaleString()} bulk · standing rates</Text>
            <Text weight="bold" style={{ color: 'var(--accent-9)', fontSize: 15 }}>{money(bulkPayout)}</Text>
          </Flex>
          {BULK_RATES.map(b => (
            <Flex key={b.id} justify="between" gap="2" style={{
              padding: '5px 0', fontSize: 12.5, color: 'var(--gray-11)',
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.count} {b.label}
              </span>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                {money(b.per1000 * b.count / 1000)} <span style={{ color: 'var(--gray-7)' }}>· {money0(b.per1000)}/1k</span>
              </span>
            </Flex>
          ))}
        </div>
      </div>

      {/* Sticky offer bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px',
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--gray-a4)', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <Text size="1" style={{ color: 'var(--gray-9)', display: 'block' }}>Offer total (cash)</Text>
          <Text weight="bold" style={{ fontSize: 22 }}>{money0(cashTotal)}</Text>
        </div>
        <button onClick={() => setOffer({ creditPct: 60, cash: cashTotal })} style={{
          flex: 1.3, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: '15px 12px', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        }}>Build offer</button>
      </div>

      {/* Price guide drawer */}
      <PriceGuide
        card={priceCard}
        onClose={() => setPriceCard(null)}
        onSet={(v) => {
          setPrices(p => ({ ...p, [priceCard.id]: v }));
          setPriceCard(null);
          showToast('Added ' + money0(v) + ' to offer');
        }}
      />

      {/* Offer composer */}
      <OfferComposer
        offer={offer}
        cashTotal={cashTotal}
        onClose={() => setOffer(null)}
        onSend={() => { setOffer(o => ({ ...o, sent: true })); setView('sent'); }}
      />
    </Flex>
  );
}

// ── Stat Tile ───────────────────────────────────────────────
function StatTile({ label, value, gold, accent }) {
  return (
    <div style={{
      background: gold ? 'var(--accent-a3)' : 'var(--color-surface)', borderRadius: 13, padding: '11px 13px',
      boxShadow: gold ? 'inset 0 0 0 1.5px var(--amber-9)'
        : accent ? 'inset 0 0 0 1.5px var(--accent-9)'
        : '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Text size="1" style={{ color: 'var(--gray-9)', fontWeight: 600, display: 'block' }}>{label}</Text>
      <Text weight="bold" style={{
        fontSize: 22, color: accent ? 'var(--accent-9)' : 'var(--gray-12)', marginTop: 2, display: 'block',
      }}>{value}</Text>
    </div>
  );
}

// ── Filter Chip ─────────────────────────────────────────────
function FilterChip({ children, active, onClick, gold, danger }) {
  const bg = active
    ? (danger ? 'var(--red-9)' : gold ? 'var(--amber-9)' : 'var(--gray-12)')
    : 'var(--color-surface)';
  const fg = active ? (gold ? '#2a2000' : '#fff') : 'var(--gray-11)';
  return (
    <button onClick={onClick} style={{
      whiteSpace: 'nowrap', fontWeight: 700, fontSize: 13,
      padding: '7px 12px', borderRadius: 999, background: bg, color: fg,
      boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--gray-a4)',
      border: 'none', cursor: 'pointer',
    }}>{children}</button>
  );
}

// ── Card Row ────────────────────────────────────────────────
function ShopCardRow({ c, price, onClick }) {
  const matched = !!c.buylist;
  const setInfo = setById(c.set);
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
      background: matched ? 'var(--accent-a3)' : 'var(--color-surface)', borderRadius: 13, padding: 10,
      boxShadow: matched ? 'inset 0 0 0 1.5px var(--amber-9)' : c.flag ? 'inset 0 0 0 1.5px var(--red-9)' : '0 1px 3px rgba(20,24,40,0.05)',
      border: 'none', cursor: 'pointer',
    }}>
      <div style={{
        background: matched ? 'rgba(255,255,255,0.6)' : 'var(--gray-a2)',
        borderRadius: 9, padding: 6, flexShrink: 0,
      }}>
        <CardArt item={c} w={42} radius={5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Flex align="center" gap="2">
          <Text weight="bold" size="2" style={{
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{c.name}</Text>
          {c.flag && <span style={{ color: 'var(--red-9)', fontSize: 12 }}>!</span>}
        </Flex>
        <Text size="1" style={{
          color: 'var(--gray-9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
        }}>
          {c.cond} · x{c.qty}{c.flag ? ' · ' + c.flag : ' · ' + (setInfo ? setInfo.name.replace(/\s*\(.*\)/, '') : '')}
        </Text>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {matched ? (
          <>
            <Text weight="bold" size="1" style={{ color: 'var(--accent-9)', whiteSpace: 'nowrap', display: 'block' }}>
              WANT {c.buylist.want}
            </Text>
            <Text weight="bold" style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
              {money0(c.buylist.buy)}<span style={{ fontSize: 10, color: 'var(--gray-9)' }}>/ea</span>
            </Text>
          </>
        ) : c.flag ? (
          <Text size="1" weight="bold" style={{ color: 'var(--red-9)' }}>inspect</Text>
        ) : (
          <>
            <Text size="1" style={{ color: 'var(--gray-9)', display: 'block' }}>your buy</Text>
            <Text weight="bold" style={{ fontSize: 14, color: price ? 'var(--gray-12)' : 'var(--accent-9)' }}>
              {price ? money0(price) : 'price'}
            </Text>
          </>
        )}
      </div>
    </button>
  );
}

// ── Price Guide Drawer ──────────────────────────────────────
function PriceGuide({ card, onClose, onSet }) {
  const [pct, setPct] = useState(70);
  useEffect(() => { setPct(70); }, [card]);
  if (!card) return null;

  const ladder = [
    ['Near Mint', Math.round(card.market)],
    ['Lightly Played', Math.round(card.market * 0.8)],
    ['Moderately Pl.', Math.round(card.market * 0.62)],
    ['Heavily Played', Math.round(card.market * 0.46)],
  ];
  const condIdx = { NM: 0, LP: 1, MP: 2, HP: 3 }[card.cond] ?? 0;
  const condMarket = ladder[condIdx][1];
  const buy = Math.round(condMarket * pct / 100);
  const comps = [
    ['Jun 5 · NM', Math.round(card.market * 1.02)],
    ['Jun 2 · NM', Math.round(card.market * 0.98)],
    ['May 28 · LP', Math.round(card.market * 0.82)],
  ];
  const sparkData = [card.market * 0.82, card.market * 0.88, card.market * 0.85, card.market * 0.94, card.market * 0.97, card.market];
  const setInfo = setById(card.set);

  return (
    <Sheet open={!!card} onClose={onClose} title={null}>
      {/* Header */}
      <Flex gap="3" align="center">
        <div style={{ background: 'var(--gray-a2)', borderRadius: 9, padding: 6 }}>
          <CardArt item={card} w={50} radius={6} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text weight="bold" size="3">{card.name}</Text>
          <Text as="div" size="1" style={{ color: 'var(--gray-9)' }}>
            {setInfo ? setInfo.name : ''} · {card.number} · x{card.qty}
          </Text>
        </div>
      </Flex>

      {/* Market headline */}
      <Flex align="center" justify="between" mt="4" style={{
        background: 'var(--gray-a2)', borderRadius: 13, padding: '12px 14px',
      }}>
        <div>
          <Text size="1" style={{ color: 'var(--gray-9)', fontWeight: 600, display: 'block' }}>Market · {card.cond}</Text>
          <Text weight="bold" style={{ fontSize: 26, display: 'block' }}>{money0(condMarket)}</Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <PriceChart data={sparkData} width={92} height={36} color="var(--green-9)" />
          <Text size="1" weight="bold" style={{ color: 'var(--green-9)', marginTop: 2, display: 'block' }}>+6.2% / 90d</Text>
        </div>
      </Flex>

      {/* Condition ladder */}
      <Text weight="bold" size="2" style={{ margin: '16px 0 8px', display: 'block' }}>Price by condition</Text>
      <Flex direction="column" gap="2">
        {ladder.map(([lab, val], i) => (
          <Flex key={lab} align="center" justify="between" style={{
            borderRadius: 9, padding: '8px 12px',
            background: i === condIdx ? 'var(--accent-a3)' : 'var(--gray-a2)',
            boxShadow: i === condIdx ? 'inset 0 0 0 1.5px var(--accent-9)' : 'none',
          }}>
            <Text weight="medium" size="2" style={{
              color: i === condIdx ? 'var(--accent-9)' : 'var(--gray-11)', whiteSpace: 'nowrap',
            }}>{lab}{i === condIdx ? ' · stated' : ''}</Text>
            <Text weight="bold" style={{ fontSize: 14, flexShrink: 0 }}>{money0(val)}</Text>
          </Flex>
        ))}
      </Flex>

      {/* Recent comps */}
      <Text weight="bold" size="2" style={{ margin: '16px 0 8px', display: 'block' }}>Recent sold comps</Text>
      <div style={{ background: 'var(--gray-a2)', borderRadius: 11, padding: '6px 12px' }}>
        {comps.map(([d, v]) => (
          <Flex key={d} justify="between" gap="2" style={{ padding: '5px 0', fontSize: 12.5, color: 'var(--gray-11)' }}>
            <span style={{ whiteSpace: 'nowrap' }}>{d}</span>
            <Text weight="medium" style={{ flexShrink: 0 }}>{money0(v)}</Text>
          </Flex>
        ))}
      </div>

      {/* Buy percentage slider */}
      <div style={{ marginTop: 18, background: 'var(--accent-a3)', borderRadius: 13, padding: 14 }}>
        <Flex align="center" justify="between">
          <Text weight="bold" size="2" style={{ color: 'var(--accent-9)' }}>Your buy %</Text>
          <Flex gap="2">
            {[60, 70, 80].map(p => (
              <button key={p} onClick={() => setPct(p)} style={{
                fontWeight: 700, fontSize: 13, padding: '4px 11px', borderRadius: 8,
                background: pct === p ? 'var(--accent-9)' : '#fff', color: pct === p ? '#fff' : 'var(--gray-11)',
                border: 'none', cursor: 'pointer',
              }}>{p}%</button>
            ))}
          </Flex>
        </Flex>
        <input type="range" min="40" max="90" step="5" value={pct}
          onChange={e => setPct(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent-9)', marginTop: 12 }}
        />
        <Flex align="baseline" justify="between" mt="1">
          <Text size="2" style={{ color: 'var(--gray-11)' }}>
            Buy price {card.qty > 1 ? `(x${card.qty})` : ''}
          </Text>
          <Text weight="bold" style={{ fontSize: 24, color: 'var(--accent-9)' }}>{money0(buy * card.qty)}</Text>
        </Flex>
      </div>

      <button onClick={() => onSet(buy * card.qty)} style={{
        width: '100%', marginTop: 14, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
        padding: 15, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
      }}>Add {money0(buy * card.qty)} to offer</button>
    </Sheet>
  );
}

// ── Offer Composer ──────────────────────────────────────────
function OfferComposer({ offer, cashTotal, onClose, onSend }) {
  const [creditPct, setCreditPct] = useState(60);
  const [msg, setMsg] = useState("Offer's ready — come on in");
  useEffect(() => {
    if (offer) { setCreditPct(60); setMsg("Offer's ready — come on in"); }
  }, [offer]);

  if (!offer || offer.sent) return null;

  const creditTotal = Math.round(cashTotal * (1 + SHOP.creditBonus));
  const templates = [
    "Offer's ready — come on in",
    'Can you bring these back to inspect?',
    "We'll pass on bulk — singles only",
    "What's your availability this week?",
  ];

  return (
    <Sheet open={!!offer && !offer.sent} onClose={onClose} title="Build offer">
      <Text weight="bold" size="4" style={{ letterSpacing: -0.3, display: 'block', marginBottom: 14 }}>
        Build offer for {SUBMISSION.seller.name}
      </Text>

      {/* Cash / credit split */}
      <Flex gap="3">
        <div style={{ flex: 1, background: 'var(--gray-a2)', borderRadius: 13, padding: '12px 13px' }}>
          <Text size="1" style={{ color: 'var(--gray-9)', fontWeight: 600, display: 'block' }}>Cash</Text>
          <Text weight="bold" style={{ fontSize: 22, display: 'block' }}>{money0(cashTotal)}</Text>
        </div>
        <div style={{
          flex: 1, background: 'var(--green-a3)', borderRadius: 13, padding: '12px 13px',
          boxShadow: 'inset 0 0 0 1.5px var(--green-9)',
        }}>
          <Text size="1" weight="bold" style={{ color: 'var(--green-9)', display: 'block' }}>Credit +20%</Text>
          <Text weight="bold" style={{ fontSize: 22, color: 'var(--green-9)', display: 'block' }}>{money0(creditTotal)}</Text>
        </div>
      </Flex>

      <Text weight="bold" size="2" style={{ marginTop: 16, display: 'block' }}>Suggested split</Text>
      <div style={{ marginTop: 8 }}>
        <div style={{
          height: 16, borderRadius: 999, overflow: 'hidden', display: 'flex',
          boxShadow: 'inset 0 0 0 1px var(--gray-a4)',
        }}>
          <div style={{ width: (100 - creditPct) + '%', background: 'var(--accent-9)' }} />
          <div style={{ width: creditPct + '%', background: 'var(--amber-9)' }} />
        </div>
        <input type="range" min="0" max="100" step="10" value={creditPct}
          onChange={e => setCreditPct(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--amber-9)', marginTop: 8 }}
        />
        <Flex justify="between" style={{ fontSize: 12, fontWeight: 600 }}>
          <span style={{ color: 'var(--accent-9)' }}>{money0(Math.round(cashTotal * (100 - creditPct) / 100))} cash</span>
          <span style={{ color: 'var(--amber-9)' }}>{money0(Math.round(creditTotal * creditPct / 100))} credit</span>
        </Flex>
      </div>

      {/* Message templates */}
      <Text weight="bold" size="2" style={{ marginTop: 16, marginBottom: 8, display: 'block' }}>Message to seller</Text>
      <Flex gap="2" style={{ overflowX: 'auto', marginBottom: 10 }}>
        {templates.map(t => (
          <button key={t} onClick={() => setMsg(t)} style={{
            whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600, fontSize: 12.5,
            padding: '7px 11px', borderRadius: 999,
            background: msg === t ? 'var(--gray-12)' : 'var(--gray-a2)',
            color: msg === t ? '#fff' : 'var(--gray-11)',
            border: 'none', cursor: 'pointer',
          }}>{t}</button>
        ))}
      </Flex>
      <div style={{
        background: 'var(--gray-a2)', borderRadius: 12, padding: '11px 13px',
        fontSize: 13.5, color: 'var(--gray-12)', boxShadow: 'inset 0 0 0 1px var(--gray-a4)',
      }}>{msg}</div>

      <button onClick={onSend} style={{
        width: '100%', marginTop: 16, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
        padding: 15, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
      }}>Send offer</button>
      <Text size="1" style={{ display: 'block', textAlign: 'center', marginTop: 10, color: 'var(--gray-9)' }}>
        Cards & payment exchange in person at the counter.
      </Text>
    </Sheet>
  );
}

// ── Shop Inbox ──────────────────────────────────────────────
function ShopInbox({ navigate, showToast, onOpen }) {
  const stats = subStats();
  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      <div style={{
        padding: '16px 16px 14px', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--gray-a4)',
      }}>
        <Flex align="center" justify="between">
          <button onClick={() => navigate(-1)} style={{
            color: 'var(--gray-12)', display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 14.5, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
          }}><ArrowLeft size={18} /> Exit</button>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: SHOP.tint,
            background: 'var(--green-a3)', borderRadius: 7, padding: '4px 8px',
          }}>SHOP VIEW</span>
        </Flex>
        <Flex align="center" gap="3" mt="3">
          <span style={{
            width: 38, height: 38, borderRadius: 11, background: SHOP.tint, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18,
          }}>{SHOP.initial}</span>
          <div>
            <Text as="h1" size="5" weight="bold" style={{ margin: 0, letterSpacing: -0.4 }}>Buylist inbox</Text>
            <Text size="2" style={{ color: 'var(--gray-9)' }}>{SHOP.name} · counter</Text>
          </div>
        </Flex>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>
        <Text size="1" weight="bold" style={{ color: 'var(--gray-9)', marginBottom: 9, letterSpacing: 0.2, display: 'block' }}>
          NEW · NEEDS REVIEW
        </Text>

        {/* Hero submission */}
        <button onClick={onOpen} style={{
          width: '100%', textAlign: 'left', background: 'var(--accent-a3)', borderRadius: 16, padding: 15,
          boxShadow: 'inset 0 0 0 2px var(--accent-9)', marginBottom: 14, border: 'none', cursor: 'pointer',
        }}>
          <Flex align="center" gap="3">
            <span style={{
              width: 42, height: 42, borderRadius: 12, background: SHOP.tint, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 19,
            }}>{SUBMISSION.seller.initial}</span>
            <div style={{ flex: 1 }}>
              <Text weight="bold" size="3">{SUBMISSION.seller.name} · {SUBMISSION.total.toLocaleString()} cards</Text>
              <Text as="div" size="1" style={{ color: 'var(--gray-9)' }}>{SUBMISSION.submittedAgo} · ticket #{SUBMISSION.ticket}</Text>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, color: '#fff',
              background: 'var(--red-9)', borderRadius: 999, padding: '3px 8px',
            }}>NEW</span>
          </Flex>
          <Flex gap="2" mt="3">
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <Text weight="bold" style={{ fontSize: 17, color: 'var(--accent-9)', display: 'block' }}>{stats.buylistCount}</Text>
              <Text size="1" style={{ color: 'var(--gray-9)' }}>buylist hits</Text>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <Text weight="bold" style={{ fontSize: 17, display: 'block' }}>{money0(stats.buylistPayout)}</Text>
              <Text size="1" style={{ color: 'var(--gray-9)' }}>est. payout</Text>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 11, padding: '9px 11px' }}>
              <Text weight="bold" style={{ fontSize: 17, display: 'block' }}>{money0(stats.estMarket)}</Text>
              <Text size="1" style={{ color: 'var(--gray-9)' }}>market val</Text>
            </div>
          </Flex>
          <div style={{
            marginTop: 13, background: 'var(--accent-9)', color: '#fff', borderRadius: 11,
            padding: '11px 0', textAlign: 'center', fontWeight: 700, fontSize: 14.5,
          }}>Review submission</div>
        </button>

        {/* Earlier queue items */}
        <Text size="1" weight="bold" style={{
          color: 'var(--gray-9)', margin: '4px 0 9px', letterSpacing: 0.2, display: 'block',
        }}>EARLIER</Text>
        <Flex direction="column" gap="3">
          <QueueRow initial="S" name="Sam R." cards="64 cards" meta="18 min ago" tag="12 hits" tagColor="var(--accent-9)" onClick={() => showToast("Demo focuses on Jordan's submission")} />
          <QueueRow initial="D" name="Dana P." cards="310 cards" meta="1 hr ago · offer sent" tag="replied" tagColor="var(--green-9)" onClick={() => showToast("Demo focuses on Jordan's submission")} />
          <QueueRow initial="M" name="Miguel A." cards="1,420 cards" meta="3 hr ago · completed" tag="paid" tagColor="var(--gray-9)" onClick={() => showToast("Demo focuses on Jordan's submission")} />
        </Flex>
      </div>
    </Flex>
  );
}

function QueueRow({ initial, name, cards, meta, tag, tagColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11,
      background: 'var(--color-surface)', borderRadius: 13, padding: 12,
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)', border: 'none', cursor: 'pointer',
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10, background: 'var(--gray-a2)',
        color: 'var(--gray-11)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 15,
      }}>{initial}</span>
      <div style={{ flex: 1 }}>
        <Text weight="bold" size="2">{name} · {cards}</Text>
        <Text as="div" size="1" style={{ color: 'var(--gray-9)' }}>{meta}</Text>
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: tagColor }}>{tag}</span>
    </button>
  );
}

// ── Shop Sent Confirmation ──────────────────────────────────
function ShopSent({ navigate, offer, onInbox }) {
  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '80px 24px 24px', textAlign: 'center' }}>
        <div style={{
          width: 84, height: 84, margin: '0 auto', borderRadius: 999,
          background: 'var(--green-a3)', color: 'var(--green-9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Check size={44} /></div>
        <Text as="h1" size="6" weight="bold" style={{ margin: '20px 0 4px', letterSpacing: -0.5 }}>
          Offer sent to {SUBMISSION.seller.name}
        </Text>
        <Text size="3" style={{ color: 'var(--gray-9)', lineHeight: 1.5, margin: '0 auto', maxWidth: 270, display: 'block' }}>
          They've been texted. When they come in with ticket #{SUBMISSION.ticket}, check the stack against the list and pay out.
        </Text>

        <div style={{
          background: 'var(--color-surface)', borderRadius: 16, padding: 16, marginTop: 20,
          textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          {[
            ['Cash option', money0(offer ? offer.cash : 620)],
            ['Store credit', money0(Math.round((offer ? offer.cash : 620) * 1.2))],
            ['Ticket', '#' + SUBMISSION.ticket],
          ].map(([k, v], i) => (
            <Flex key={k} justify="between" style={{
              padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--gray-a3)' : 'none',
            }}>
              <Text size="2" style={{ color: 'var(--gray-9)' }}>{k}</Text>
              <Text weight="bold" size="2" style={{ color: i === 1 ? 'var(--green-9)' : 'var(--gray-12)' }}>{v}</Text>
            </Flex>
          ))}
        </div>

        <Flex align="center" gap="3" style={{
          background: 'var(--accent-a3)', color: 'var(--accent-9)', borderRadius: 12,
          padding: '13px 14px', marginTop: 14, textAlign: 'left',
        }}>
          <Shield size={18} />
          <Text size="2" weight="medium">Submission moves to "Awaiting pickup" in your queue.</Text>
        </Flex>
      </div>

      <Flex gap="3" style={{
        padding: '12px 16px 30px', borderTop: '1px solid var(--gray-a4)',
        background: 'var(--color-surface)',
      }}>
        <button onClick={onInbox} style={{
          flex: 1, background: 'var(--gray-a2)', color: 'var(--gray-12)', borderRadius: 14,
          padding: 15, fontWeight: 700, fontSize: 15,
          boxShadow: 'inset 0 0 0 1.5px var(--gray-a4)', border: 'none', cursor: 'pointer',
        }}>Back to inbox</button>
        <button onClick={() => navigate('/')} style={{
          flex: 1, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: 15, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
        }}>Done</button>
      </Flex>
    </Flex>
  );
}
