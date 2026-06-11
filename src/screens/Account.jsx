import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Flex, Text, Badge, Button, IconButton, Tabs } from '@radix-ui/themes';
import {
  ChevronLeft, ChevronRight, Shield, Star, Truck, Tag, Gavel,
  Bell, CreditCard, Plus, Trash2, Search as SearchIcon, Zap, Filter,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMES, setById } from '../data/games';
import { LISTINGS, byId } from '../data/listings';
import CardArt from '../components/CardArt';
import Sheet from '../components/Sheet';
import { money } from '../components/helpers';

// ── Shared sub-screen helpers ────────────────────────────────

function money0(n) { return money(n, { cents: false }); }

function Pill({ label, tone }) {
  const colors = { green: 'green', blue: 'blue', amber: 'orange', gray: 'gray', red: 'red' };
  return <Badge variant="soft" color={colors[tone] || 'gray'} size="1">{label}</Badge>;
}

function Segmented({ tabs, value, onChange }) {
  return (
    <Flex gap="1" p="1" mb="3" style={{ background: 'var(--gray-a3)', borderRadius: 12 }}>
      {tabs.map(([id, label]) => (
        <Button key={id} variant={value === id ? 'solid' : 'ghost'} size="1"
          color={value === id ? undefined : 'gray'}
          style={{ flex: 1, fontWeight: value === id ? 700 : 500 }}
          onClick={() => onChange(id)}>
          {label}
        </Button>
      ))}
    </Flex>
  );
}

function ListThumb({ item, w = 44 }) {
  return (
    <Box style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6, flexShrink: 0 }}>
      <CardArt item={item} w={w} radius={5} showFoil={false} />
    </Box>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: 44, height: 26, borderRadius: 999, padding: 3, flexShrink: 0,
      background: on ? 'var(--accent-9)' : 'var(--gray-6)',
      display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 999, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        transform: on ? 'translateX(18px)' : 'none',
        transition: 'transform 0.2s',
      }} />
    </button>
  );
}

function EmptyBlock({ icon, title, body }) {
  return (
    <Flex direction="column" align="center" gap="2" py="9" px="4">
      <Flex align="center" justify="center" style={{
        width: 64, height: 64, borderRadius: 999, background: 'var(--color-surface)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', color: 'var(--gray-8)',
      }}>
        {icon}
      </Flex>
      <Text size="3" weight="bold" align="center">{title}</Text>
      <Text size="2" color="gray" align="center" style={{ lineHeight: 1.45 }}>{body}</Text>
    </Flex>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE ROOT (route: /profile)
// ═══════════════════════════════════════════════════════════════

function ProfileRoot() {
  const navigate = useNavigate();
  const { tier, acct, setAcct, prefs, inPrefs, allGamesSelected, showToast } = useApp();
  const ACCT_LABEL = { buyer: 'Collector', seller: 'Individual seller', store: 'Game shop' };
  const followed = GAMES.filter(g => inPrefs(g.id));

  const menu = [
    { title: 'Purchases', sub: '3 orders', icon: <Truck size={20} />, route: 'purchases' },
    { title: 'Selling', sub: '2 active listings', icon: <Tag size={20} />, route: 'selling' },
    { title: 'Offers', sub: '1 pending', icon: <Gavel size={20} />, route: 'offers' },
    { title: 'Verification & trust', sub: tier >= 2 ? 'Trusted Seller' : tier >= 1 ? 'ID Verified' : 'Get verified', icon: <Shield size={20} />, route: 'verify' },
    { title: 'Payments & payouts', sub: '', icon: <CreditCard size={20} />, route: 'payments' },
    { title: 'Notifications', sub: '2 new', icon: <Bell size={20} />, route: 'notifications' },
  ];

  return (
    <Box style={{ minHeight: '100%' }}>
      {/* Header */}
      <Box px="4" pt="3" pb="4" style={{ borderBottom: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}>
        <Flex align="center" gap="3" mb="3">
          <Flex align="center" justify="center" style={{
            width: 58, height: 58, borderRadius: 16, background: 'var(--accent-9)',
            color: '#fff', fontWeight: 800, fontSize: 26,
          }}>
            A
          </Flex>
          <Flex direction="column" style={{ flex: 1 }}>
            <Flex align="center" gap="2">
              <Text size="4" weight="bold" style={{ letterSpacing: -0.3 }}>Alex Rivera</Text>
              {tier >= 1 && (
                <Badge variant="solid" color={tier >= 2 ? 'green' : 'blue'} size="1">
                  {tier >= 2 ? 'Trusted' : 'Verified'}
                </Badge>
              )}
            </Flex>
            <Flex align="center" gap="1" mt="1">
              <Star size={12} fill="var(--amber-9)" color="var(--amber-9)" />
              <Text size="1" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>99% · 214 deals</Text>
            </Flex>
          </Flex>
          <Shield size={20} color="var(--green-9)" />
        </Flex>

        {/* Stats */}
        <Flex gap="2">
          {[['Buying power', '$2,400'], ['This year', '$8.1k spent'], ['Sold', '$3.4k']].map(([k, v]) => (
            <Box key={k} p="2" style={{ flex: 1, background: 'var(--gray-a3)', borderRadius: 12 }}>
              <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }} as="div">{v}</Text>
              <Text size="1" color="gray" as="div">{k}</Text>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box px="4" py="3" pb="6">
        {/* Account type card */}
        <Box p="3" mb="3" style={{ background: 'var(--color-surface)', borderRadius: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <Flex align="center" gap="3">
            <Flex align="center" justify="center" style={{
              width: 40, height: 40, borderRadius: 12, background: 'var(--gray-a3)',
              fontSize: 20, flexShrink: 0,
            }}>
              {acct === 'store' ? '🏪' : acct === 'seller' ? '💸' : '🎴'}
            </Flex>
            <Flex direction="column" style={{ flex: 1 }}>
              <Text size="1" color="gray" weight="medium">Account type</Text>
              <Text size="2" weight="bold">{ACCT_LABEL[acct] || 'Collector'}</Text>
            </Flex>
            {acct === 'store' && <Badge variant="solid" size="1">Verified shop</Badge>}
          </Flex>
          {acct === 'buyer' && (
            <Button size="3" mt="3" style={{ width: '100%' }} onClick={() => { setAcct('seller'); showToast('You can now sell!'); }}>
              <Tag size={16} /> Become a seller
            </Button>
          )}
          {acct === 'seller' && (
            <Button variant="soft" size="2" mt="3" style={{ width: '100%' }} onClick={() => navigate('/shop')}>
              Run a shop? Enroll as a Local Game Store
            </Button>
          )}
        </Box>

        {/* Games you follow */}
        <Box p="3" mb="3" style={{ background: 'var(--color-surface)', borderRadius: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <Flex align="center" gap="3">
            <Flex align="center" justify="center" style={{
              width: 40, height: 40, borderRadius: 12, background: 'var(--gray-a3)',
              flexShrink: 0, color: 'var(--gray-9)',
            }}>
              <Filter size={18} />
            </Flex>
            <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
              <Text size="2" weight="bold">Games you follow</Text>
              <Text size="1" color="gray" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {allGamesSelected() ? 'All games' : followed.map(g => g.short).join(' · ')}
              </Text>
            </Flex>
            <Text size="2" weight="bold" color="blue">Edit</Text>
          </Flex>
        </Box>

        {/* Quick actions */}
        <Button size="3" mb="3" style={{ width: '100%' }} onClick={() => navigate('/sell')}>
          <Tag size={18} /> List a card to sell
        </Button>

        {/* Buylist card */}
        <Flex align="center" gap="3" p="3" mb="4" onClick={() => navigate('/account/buylist')} style={{
          background: 'var(--color-surface)', borderRadius: 16, cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        }}>
          <Flex align="center" justify="center" style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: 'var(--amber-3)', color: 'var(--amber-11)',
          }}>
            <Star size={20} />
          </Flex>
          <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
            <Text size="2" weight="bold">My buylist</Text>
            <Text size="1" color="gray">3 active · 2 matches available now</Text>
          </Flex>
          <ChevronRight size={18} color="var(--gray-8)" />
        </Flex>

        {/* Menu items */}
        <Box style={{ background: 'var(--color-surface)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {menu.map((item, i) => (
            <Flex key={item.title} align="center" gap="3" px="3" py="3"
              onClick={() => navigate(`/account/${item.route}`)}
              style={{
                cursor: 'pointer',
                borderBottom: i < menu.length - 1 ? '1px solid var(--gray-a3)' : 'none',
              }}>
              <Box style={{ color: 'var(--gray-9)' }}>{item.icon}</Box>
              <Text size="2" weight="medium" style={{ flex: 1 }}>{item.title}</Text>
              {item.sub && <Text size="1" color="gray">{item.sub}</Text>}
              <ChevronRight size={16} color="var(--gray-8)" />
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUYLIST SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const BUYLIST_SEED = [
  { id: 'b1', ref: 'l03', want: 1, max: 1300, active: true },
  { id: 'b2', ref: 'l01', want: 2, max: 460, active: true },
  { id: 'b3', ref: 'l07', want: 3, max: 160, active: false },
  { id: 'b4', ref: 'l05', want: 1, max: 26000, active: true },
];

function BuylistScreen() {
  const { showToast } = useApp();
  const [list, setList] = useState(() => {
    try { const raw = localStorage.getItem('cc_buylist_v2'); if (raw) return JSON.parse(raw); } catch {}
    return BUYLIST_SEED;
  });

  React.useEffect(() => {
    try { localStorage.setItem('cc_buylist_v2', JSON.stringify(list)); } catch {}
  }, [list]);

  const enrich = (e) => ({ ...e, card: byId(e.ref) });
  const entries = list.map(enrich).filter(e => e.card);
  const activeCount = entries.filter(e => e.active).length;
  const totalCommit = entries.filter(e => e.active).reduce((s, e) => s + e.max * e.want, 0);
  const matches = entries.filter(e => e.active && e.card.price <= e.max);

  return (
    <Box px="4" py="3" pb="6">
      {/* Info banner */}
      <Box p="3" mb="3" style={{ background: 'var(--blue-a3)', borderRadius: 13 }}>
        <Flex align="start" gap="2">
          <Star size={16} color="var(--accent-9)" style={{ marginTop: 2 }} fill="var(--accent-9)" />
          <Text size="1" color="gray" style={{ lineHeight: 1.45 }}>
            Set the cards you're after and the max you'll pay. We alert you when a match is listed.
          </Text>
        </Flex>
      </Box>

      {/* Summary stats */}
      <Flex gap="2" mb="3">
        <Box p="3" style={{ flex: 1, background: 'var(--color-surface)', borderRadius: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <Text size="4" weight="bold" color="blue" as="div" style={{ fontFamily: 'var(--mono, monospace)' }}>{matches.length}</Text>
          <Text size="1" color="gray" as="div">matches available</Text>
        </Box>
        <Box p="3" style={{ flex: 1, background: 'var(--color-surface)', borderRadius: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <Text size="4" weight="bold" as="div" style={{ fontFamily: 'var(--mono, monospace)' }}>{money0(totalCommit)}</Text>
          <Text size="1" color="gray" as="div">max commitment</Text>
        </Box>
      </Flex>

      {/* Entry list */}
      {entries.length === 0 ? (
        <EmptyBlock icon={<Star size={28} />} title="No cards yet" body="Tap + to add cards you want to buy." />
      ) : (
        <Flex direction="column" gap="2">
          {entries.map(e => {
            const isMatch = e.active && e.card.price <= e.max;
            return (
              <Flex key={e.id} align="center" gap="3" p="2" style={{
                background: 'var(--color-surface)', borderRadius: 13,
                opacity: e.active ? 1 : 0.55,
                boxShadow: isMatch ? 'inset 0 0 0 1.5px var(--amber-9)' : '0 1px 3px rgba(20,24,40,0.05)',
              }}>
                <ListThumb item={e.card} />
                <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap="1">
                    <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.card.name}
                    </Text>
                    {isMatch && <Pill label="MATCH" tone="amber" />}
                  </Flex>
                  <Text size="1" color="gray">
                    want {e.want} · max <Text weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money0(e.max)}</Text>
                    {' · listed '}{money0(e.card.price)}
                  </Text>
                </Flex>
                <Toggle on={e.active} onToggle={() => setList(l => l.map(x => x.id === e.id ? { ...x, active: !x.active } : x))} />
              </Flex>
            );
          })}
        </Flex>
      )}

      {matches.length > 0 && (
        <Button variant="outline" size="3" mt="3" style={{ width: '100%' }}>
          View {matches.length} available match{matches.length !== 1 ? 'es' : ''}
        </Button>
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// PURCHASES SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const PURCHASES = [
  { ref: 'l04', status: 'Delivered', tone: 'green', date: 'Jun 2', total: 2150, seller: 'VintageHolos', track: 'Delivered Jun 6' },
  { ref: 'l07', status: 'Shipped', tone: 'blue', date: 'Jun 7', total: 184, seller: 'DuelistPrime', track: 'Arrives Jun 11' },
  { ref: 'l11', status: 'Processing', tone: 'amber', date: 'Jun 9', total: 31.99, seller: 'KantoCollects', track: 'Seller preparing' },
];

function PurchasesScreen() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('all');
  const rows = PURCHASES.map(p => ({ ...p, card: byId(p.ref) }))
    .filter(p => p.card && (tab === 'all' || (tab === 'active' ? p.status !== 'Delivered' : p.status === 'Delivered')));

  return (
    <Box px="4" py="3" pb="6">
      <Segmented tabs={[['all', 'All'], ['active', 'In transit'], ['done', 'Delivered']]} value={tab} onChange={setTab} />
      {rows.length === 0 ? (
        <EmptyBlock icon={<Truck size={28} />} title="Nothing here" body="Orders you place will show up with tracking." />
      ) : (
        <Flex direction="column" gap="2">
          {rows.map((p, i) => (
            <Box key={i} p="3" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Flex align="center" gap="3">
                {p.card && <ListThumb item={p.card} />}
                <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                  <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.card?.name}
                  </Text>
                  <Text size="1" color="gray">{p.seller} · ordered {p.date}</Text>
                </Flex>
                <Flex direction="column" align="end" gap="1">
                  <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(p.total)}</Text>
                  <Pill label={p.status} tone={p.tone} />
                </Flex>
              </Flex>
              <Flex align="center" gap="2" mt="2" pt="2" style={{ borderTop: '1px solid var(--gray-a3)' }}>
                <Truck size={14} color="var(--gray-9)" />
                <Text size="1" color="gray" style={{ flex: 1 }}>{p.track}</Text>
                <Button variant="ghost" size="1" onClick={() => showToast(p.status === 'Delivered' ? 'Leaving a review' : 'Tracking order')}>
                  {p.status === 'Delivered' ? 'Review' : 'Track'}
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// SELLING SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const ACTIVE_LISTINGS = [
  { ref: 'l09', price: 96, views: 142, watchers: 8, offers: 2, type: 'buynow' },
  { ref: 'l10', price: 44, views: 89, watchers: 33, offers: 0, type: 'auction', timeLeft: '11h 40m', bids: 9 },
];
const SOLD_LISTINGS = [
  { ref: 'l02', price: 38.5, buyer: 'mtg_mike', date: 'Jun 4' },
  { ref: 'l12', price: 14.25, buyer: 'bolt_collector', date: 'May 30' },
];

function SellingScreen() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [tab, setTab] = useState('active');
  const active = ACTIVE_LISTINGS.map(l => ({ ...l, card: byId(l.ref) })).filter(l => l.card);
  const sold = SOLD_LISTINGS.map(l => ({ ...l, card: byId(l.ref) })).filter(l => l.card);

  return (
    <Box px="4" py="3" pb="6">
      <Segmented tabs={[['active', `Active ${active.length}`], ['sold', `Sold ${sold.length}`], ['drafts', 'Drafts']]} value={tab} onChange={setTab} />

      {tab === 'active' && (
        <Flex direction="column" gap="2">
          {active.map((l, i) => (
            <Box key={i} p="3" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Flex align="center" gap="3">
                {l.card && <ListThumb item={l.card} />}
                <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap="1">
                    <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.card?.name}
                    </Text>
                    <Pill label={l.type === 'auction' ? 'Auction' : 'Buy Now'} tone={l.type === 'auction' ? 'amber' : 'blue'} />
                  </Flex>
                  <Text size="1" color="gray">
                    {l.type === 'auction' ? `${l.bids} bids · ends ${l.timeLeft}` : `listed at ${money0(l.price)}`}
                  </Text>
                </Flex>
                <Text size="3" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(l.price)}</Text>
              </Flex>
              <Flex gap="2" mt="2" pt="2" style={{ borderTop: '1px solid var(--gray-a3)' }}>
                {[['Views', l.views], ['Watchers', l.watchers], ['Offers', l.offers]].map(([k, v]) => (
                  <Flex key={k} direction="column" align="center" style={{ flex: 1 }}>
                    <Text size="2" weight="bold" color={k === 'Offers' && v > 0 ? 'blue' : undefined}
                      style={{ fontFamily: 'var(--mono, monospace)' }}>{v}</Text>
                    <Text size="1" color="gray">{k}</Text>
                  </Flex>
                ))}
                <Button variant="ghost" size="1" onClick={() => showToast(l.offers > 0 ? 'Reviewing offers' : 'Editing listing')}>
                  {l.offers > 0 ? 'Offers' : 'Edit'}
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}

      {tab === 'sold' && (
        <Flex direction="column" gap="2">
          <Box p="3" mb="1" style={{ background: 'var(--green-a3)', borderRadius: 13 }}>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">Earned this month</Text>
              <Text size="4" weight="bold" color="green" style={{ fontFamily: 'var(--mono, monospace)' }}>
                {money(sold.reduce((s, l) => s + l.price, 0))}
              </Text>
            </Flex>
          </Box>
          {sold.map((l, i) => (
            <Flex key={i} align="center" gap="3" p="2" style={{
              background: 'var(--color-surface)', borderRadius: 13,
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              {l.card && <ListThumb item={l.card} />}
              <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                <Text size="2" weight="bold">{l.card?.name}</Text>
                <Text size="1" color="gray">to {l.buyer} · {l.date}</Text>
              </Flex>
              <Flex direction="column" align="end">
                <Text size="2" weight="bold" color="green" style={{ fontFamily: 'var(--mono, monospace)' }}>+{money(l.price)}</Text>
                <Pill label="Paid out" tone="green" />
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      {tab === 'drafts' && (
        <EmptyBlock icon={<Tag size={28} />} title="No drafts" body="Start a listing and save it for later." />
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// OFFERS SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const OFFERS_SENT = [
  { ref: 'l01', amount: 400, status: 'Countered', tone: 'amber', note: 'Seller countered at $420', date: '2h ago' },
  { ref: 'l05', amount: 27000, status: 'Pending', tone: 'blue', note: 'Waiting on AlphaInvest', date: '1d ago' },
];
const OFFERS_RECEIVED = [
  { ref: 'l09', amount: 85, from: 'pidgey_fan', status: 'Pending', tone: 'blue', list: 96, date: '40m ago' },
];

function OffersScreen() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('sent');
  const [acted, setActed] = useState({});
  const sent = OFFERS_SENT.map(o => ({ ...o, card: byId(o.ref) })).filter(o => o.card);
  const recv = OFFERS_RECEIVED.map(o => ({ ...o, card: byId(o.ref) })).filter(o => o.card);

  return (
    <Box px="4" py="3" pb="6">
      <Segmented tabs={[['sent', `Sent ${sent.length}`], ['received', `Received ${recv.length}`]]} value={tab} onChange={setTab} />

      {tab === 'sent' && (
        <Flex direction="column" gap="2">
          {sent.map((o, i) => (
            <Box key={i} p="3" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Flex align="center" gap="3">
                {o.card && <ListThumb item={o.card} />}
                <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                  <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.card?.name}
                  </Text>
                  <Text size="1" color="gray">your offer {money0(o.amount)} · {o.date}</Text>
                </Flex>
                <Pill label={o.status} tone={o.tone} />
              </Flex>
              <Flex align="center" gap="2" mt="2" pt="2" style={{ borderTop: '1px solid var(--gray-a3)' }}>
                <Text size="1" style={{ flex: 1 }} color={o.tone === 'amber' ? 'blue' : 'gray'} weight={o.tone === 'amber' ? 'medium' : undefined}>
                  {o.note}
                </Text>
                {o.status === 'Countered' && (
                  <Button size="1" onClick={() => showToast('Accepting counter offer')}>Accept $420</Button>
                )}
              </Flex>
            </Box>
          ))}
        </Flex>
      )}

      {tab === 'received' && (
        recv.length === 0 ? (
          <EmptyBlock icon={<Gavel size={28} />} title="No offers yet" body="Offers buyers send on your listings land here." />
        ) : (
          <Flex direction="column" gap="2">
            {recv.map((o, i) => {
              const a = acted[i];
              return (
                <Box key={i} p="3" style={{ background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                  <Flex align="center" gap="3">
                    {o.card && <ListThumb item={o.card} />}
                    <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                      <Text size="2" weight="bold">{o.card?.name}</Text>
                      <Text size="1" color="gray">{o.from} offered · listed {money0(o.list)}</Text>
                    </Flex>
                    <Text size="4" weight="bold" color="blue" style={{ fontFamily: 'var(--mono, monospace)' }}>{money0(o.amount)}</Text>
                  </Flex>
                  <Box mt="2" pt="2" style={{ borderTop: '1px solid var(--gray-a3)' }}>
                    {a ? (
                      <Text size="2" weight="bold" align="center" as="div"
                        color={a === 'accept' ? 'green' : a === 'decline' ? 'red' : 'blue'}>
                        {a === 'accept' ? 'Offer accepted' : a === 'decline' ? 'Offer declined' : `Countered at ${money0(o.list - 4)}`}
                      </Text>
                    ) : (
                      <Flex gap="2">
                        <Button variant="soft" color="gray" size="2" style={{ flex: 1 }}
                          onClick={() => { setActed(s => ({ ...s, [i]: 'decline' })); showToast('Offer declined'); }}>
                          Decline
                        </Button>
                        <Button variant="soft" color="gray" size="2" style={{ flex: 1 }}
                          onClick={() => { setActed(s => ({ ...s, [i]: 'counter' })); showToast('Counter sent'); }}>
                          Counter
                        </Button>
                        <Button size="2" style={{ flex: 1.2 }}
                          onClick={() => { setActed(s => ({ ...s, [i]: 'accept' })); showToast('Offer accepted'); }}>
                          Accept
                        </Button>
                      </Flex>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Flex>
        )
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAYMENTS SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const TXNS = [
  { label: 'Sale · Pikachu IR', sub: 'Jun 4 · payout', amount: 35.49, pos: true },
  { label: 'Purchase · Mewtwo Holo', sub: 'Jun 2 · Visa 4242', amount: -2150, pos: false },
  { label: 'Sale · Sting Goblin', sub: 'May 30 · payout', amount: 12.98, pos: true },
  { label: 'Withdrawal to bank', sub: 'May 28 · 6789', amount: -120, pos: false },
];

function PaymentsScreen() {
  const { showToast } = useApp();
  const balance = 248.47;

  return (
    <Box px="4" py="3" pb="6">
      {/* Balance */}
      <Box p="4" mb="3" style={{ background: 'var(--accent-9)', borderRadius: 18, color: '#fff' }}>
        <Text size="1" style={{ opacity: 0.7 }} weight="medium" as="div">Available to withdraw</Text>
        <Text size="8" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', letterSpacing: -0.5 }} as="div" mt="1">
          {money(balance)}
        </Text>
        <Flex gap="2" mt="3">
          <Button variant="solid" size="3" style={{ flex: 1, background: '#fff', color: 'var(--gray-12)' }}
            onClick={() => showToast('Withdrawing to bank')}>
            Withdraw
          </Button>
          <Button variant="solid" size="3" style={{ flex: 1, background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            onClick={() => showToast('Store credit: $80')}>
            Store credit
          </Button>
        </Flex>
      </Box>

      {/* Payout method */}
      <Text size="2" weight="bold" mb="2" as="div">Payout method</Text>
      <Flex align="center" gap="3" p="3" mb="4" onClick={() => showToast('Edit bank account')} style={{
        background: 'var(--color-surface)', borderRadius: 13, cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
      }}>
        <Flex align="center" justify="center" style={{
          width: 38, height: 38, borderRadius: 10, background: 'var(--gray-a3)',
          flexShrink: 0, color: 'var(--gray-11)',
        }}>
          <Package size={18} />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="2" weight="bold">Chase checking</Text>
          <Text size="1" color="gray">6789 · default payout</Text>
        </Flex>
        <ChevronRight size={16} color="var(--gray-8)" />
      </Flex>

      {/* Payment methods */}
      <Text size="2" weight="bold" mb="2" as="div">Payment methods</Text>
      <Box mb="4" style={{ background: 'var(--color-surface)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        {[['Apple Pay', 'Default', true], ['Visa 4242', 'Expires 08/27', false]].map(([t, s, def], i) => (
          <Flex key={t} align="center" gap="3" px="3" py="3"
            style={{ borderBottom: i === 0 ? '1px solid var(--gray-a3)' : 'none' }}>
            <CreditCard size={18} color="var(--gray-11)" />
            <Flex direction="column" style={{ flex: 1 }}>
              <Text size="2" weight="bold">{t}</Text>
              <Text size="1" color="gray">{s}</Text>
            </Flex>
            {def && <Badge variant="soft" color="blue" size="1">Default</Badge>}
          </Flex>
        ))}
        <Flex align="center" gap="2" px="3" py="3" onClick={() => showToast('Add a card')}
          style={{ borderTop: '1px solid var(--gray-a3)', cursor: 'pointer', color: 'var(--accent-9)' }}>
          <Plus size={18} />
          <Text size="2" weight="bold" color="blue">Add payment method</Text>
        </Flex>
      </Box>

      {/* Transactions */}
      <Text size="2" weight="bold" mb="2" as="div">Recent activity</Text>
      <Box style={{ background: 'var(--color-surface)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
        {TXNS.map((t, i) => (
          <Flex key={i} align="center" gap="3" px="3" py="3"
            style={{ borderBottom: i < TXNS.length - 1 ? '1px solid var(--gray-a3)' : 'none' }}>
            <Flex direction="column" style={{ flex: 1 }}>
              <Text size="2" weight="medium">{t.label}</Text>
              <Text size="1" color="gray">{t.sub}</Text>
            </Flex>
            <Text size="2" weight="bold" color={t.pos ? 'green' : undefined}
              style={{ fontFamily: 'var(--mono, monospace)' }}>
              {t.pos ? '+' : ''}{money(t.amount)}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS SUB-SCREEN
// ═══════════════════════════════════════════════════════════════

const NOTIFS = [
  { icon: <Star size={16} fill="currentColor" />, tint: 'var(--amber-9)', title: 'Buylist match listed', body: 'Umbreon VMAX (PSA 10) at $1,280 — under your max.', time: '12m', unread: true },
  { icon: <Gavel size={16} />, tint: 'var(--accent-9)', title: 'Outbid on Black Lotus', body: 'Someone bid $28,500. You can raise your max.', time: '1h', unread: true },
  { icon: <Tag size={16} />, tint: 'var(--green-9)', title: 'Your card sold!', body: 'Pikachu IR sold for $38.50 — payout on the way.', time: '5h', unread: false },
  { icon: <Truck size={16} />, tint: 'var(--accent-9)', title: 'Order shipped', body: 'Blue-Eyes White Dragon is on its way.', time: '1d', unread: false },
];

const NOTIF_PREFS = [
  ['Buylist matches', 'When a card you want is listed', true],
  ['Outbid alerts', 'When someone outbids you', true],
  ['Offers', 'Offers on your listings', true],
  ['Price drops', 'Watched cards that drop in price', false],
  ['Shop responses', 'When a shop replies', true],
  ['Marketing', 'News, tips & promotions', false],
];

function NotificationsScreen() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('activity');
  const [prefs, setPrefs] = useState(NOTIF_PREFS.map(p => p[2]));

  return (
    <Box px="4" py="3" pb="6">
      <Segmented tabs={[['activity', 'Activity'], ['settings', 'Settings']]} value={tab} onChange={setTab} />

      {tab === 'activity' && (
        <Flex direction="column" gap="2">
          {NOTIFS.map((n, i) => (
            <Flex key={i} gap="3" p="3" style={{
              background: n.unread ? 'var(--blue-a3)' : 'var(--color-surface)',
              borderRadius: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <Flex align="center" justify="center" style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: n.tint, color: '#fff',
              }}>
                {n.icon}
              </Flex>
              <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                <Flex align="baseline" justify="between" gap="2">
                  <Text size="2" weight="bold">{n.title}</Text>
                  <Text size="1" color="gray" style={{ flexShrink: 0 }}>{n.time}</Text>
                </Flex>
                <Text size="1" color="gray" mt="1" style={{ lineHeight: 1.4 }}>{n.body}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      {tab === 'settings' && (
        <Box style={{ background: 'var(--color-surface)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          {NOTIF_PREFS.map((p, i) => (
            <Flex key={i} align="center" gap="3" px="3" py="3"
              style={{ borderBottom: i < NOTIF_PREFS.length - 1 ? '1px solid var(--gray-a3)' : 'none' }}>
              <Flex direction="column" style={{ flex: 1 }}>
                <Text size="2" weight="medium">{p[0]}</Text>
                <Text size="1" color="gray">{p[1]}</Text>
              </Flex>
              <Toggle on={prefs[i]} onToggle={() => setPrefs(s => s.map((v, j) => j === i ? !v : v))} />
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT: route-aware Account component
// ═══════════════════════════════════════════════════════════════

const SECTION_TITLES = {
  buylist: 'My Buylist',
  purchases: 'Purchases',
  selling: 'Selling',
  offers: 'Offers',
  verify: 'Verification',
  payments: 'Payments & Payouts',
  notifications: 'Notifications',
};

const SECTION_COMPONENTS = {
  buylist: BuylistScreen,
  purchases: PurchasesScreen,
  selling: SellingScreen,
  offers: OffersScreen,
  payments: PaymentsScreen,
  notifications: NotificationsScreen,
};

export default function Account() {
  const { section } = useParams();

  // If no section param, render the Profile root
  if (!section) return <ProfileRoot />;

  // Render sub-screen for /account/:section
  const SubScreen = SECTION_COMPONENTS[section];
  if (!SubScreen) {
    return (
      <Box p="6" style={{ textAlign: 'center' }}>
        <Text size="2" color="gray">Section "{section}" not found.</Text>
      </Box>
    );
  }

  return <SubScreen />;
}
