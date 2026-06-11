import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Flex, Text, Badge, Tabs, Button, IconButton } from '@radix-ui/themes';
import { ChevronLeft, Heart, Plus, Trash2, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LISTINGS, byId } from '../data/listings';
import { setById } from '../data/games';
import CardArt from '../components/CardArt';
import PriceChart from '../components/PriceChart';
import Sheet from '../components/Sheet';
import { money } from '../components/helpers';

// ── Helpers ──────────────────────────────────────────────────

function valueOf(ids) {
  const cards = ids.map(id => byId(id)).filter(Boolean);
  const now = cards.reduce((s, c) => s + (c.market || c.price || 0), 0);
  const then = cards.reduce((s, c) => s + (c.history ? c.history[0] : (c.market || c.price || 0)), 0);
  const series = cards[0] && cards[0].history
    ? cards[0].history.map((_, i) => cards.reduce((s, c) => s + (c.history ? c.history[i] : (c.market || c.price || 0)), 0))
    : [];
  return { cards, now, then, series };
}

function Delta({ from, to, style = {} }) {
  if (!from || !to) return null;
  const pct = ((to - from) / from * 100).toFixed(1);
  const up = to >= from;
  return (
    <Flex align="center" gap="1" style={style}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      <Text size="1" weight="bold" color={up ? 'green' : 'red'}>{Math.abs(pct)}%</Text>
    </Flex>
  );
}

function GradeInline({ grade }) {
  if (!grade || grade.company === 'raw') return <Text size="1" color="gray">Raw</Text>;
  return <Text size="1" color="gray">{grade.company.toUpperCase()} {grade.grade}</Text>;
}

function GradeBadge({ grade }) {
  if (!grade || grade.company === 'raw') return <Badge variant="surface" color="gray" size="1">RAW</Badge>;
  const color = grade.company === 'psa' ? 'red' : grade.company === 'bgs' ? 'gray' : grade.company === 'cgc' ? 'blue' : 'gray';
  return <Badge variant="solid" color={color} size="1">{grade.company.toUpperCase()} {grade.grade}</Badge>;
}

// ── Watch Row ────────────────────────────────────────────────

function WatchRow({ item }) {
  const navigate = useNavigate();
  const { toggleWatch, isBidding, bids } = useApp();
  const then = item.history ? item.history[item.history.length - 3] : item.price;
  const pct = then ? ((item.price - then) / then * 100).toFixed(1) : 0;
  const up = item.price >= then;
  const bidding = isBidding(item.id);

  return (
    <Flex align="center" gap="3" p="2" style={{
      background: 'var(--color-surface)', borderRadius: 14,
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Flex align="center" gap="3" style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
        onClick={() => navigate(`/listing/${item.id}`)}>
        <Box style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6 }}>
          <CardArt item={item} w={48} radius={6} showFoil={false} />
        </Box>
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Flex align="center" gap="1">
            <GradeBadge grade={item.grade} />
            {bidding && (
              <Badge variant="solid" color={bids[item.id] >= item.price ? 'blue' : 'red'} size="1">
                {bids[item.id] >= item.price ? 'TOP BID' : 'OUTBID'}
              </Badge>
            )}
          </Flex>
          <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </Text>
          <Text size="1" color="gray">
            {bidding
              ? `Your bid ${money(bids[item.id])} · ${item.timeLeft}`
              : item.type === 'auction'
                ? `Ends in ${item.timeLeft} · ${item.bids} bids`
                : 'Buy It Now'}
          </Text>
        </Flex>
        <Flex direction="column" align="end" gap="1" style={{ flexShrink: 0 }}>
          <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(item.price)}</Text>
          <Flex align="center" gap="1">
            {up ? <ArrowUp size={11} color="var(--green-11)" /> : <ArrowDown size={11} color="var(--red-11)" />}
            <Text size="1" color={up ? 'green' : 'red'}>{Math.abs(pct)}%</Text>
          </Flex>
        </Flex>
      </Flex>
      <IconButton variant="ghost" color="red" size="1" onClick={() => toggleWatch(item.id)}>
        <Heart size={18} fill="currentColor" />
      </IconButton>
    </Flex>
  );
}

// ── Collection Row ───────────────────────────────────────────

function CollectionFolder({ col, onClick }) {
  const v = valueOf(col.cards);
  return (
    <Flex align="center" gap="3" p="3" onClick={onClick} style={{
      background: 'var(--color-surface)', borderRadius: 16, cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
    }}>
      <Flex align="center" justify="center" style={{
        width: 46, height: 46, borderRadius: 13, background: 'var(--gray-a3)',
        fontSize: 22, flexShrink: 0,
      }}>
        {col.icon || '🃏'}
      </Flex>
      <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
        <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {col.name}
        </Text>
        <Text size="1" color="gray">{col.cards.length} card{col.cards.length !== 1 ? 's' : ''}</Text>
      </Flex>
      {v.series.length > 1 && (
        <Box style={{ width: 54, opacity: 0.9 }}>
          <PriceChart data={v.series} width={54} height={24} color={v.now >= v.then ? 'var(--green-9)' : 'var(--red-9)'} />
        </Box>
      )}
      <Flex direction="column" align="end" style={{ minWidth: 60 }}>
        <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(v.now)}</Text>
        <Delta from={v.then} to={v.now} />
      </Flex>
    </Flex>
  );
}

// ── Watch Tab Root ────────────────────────────────────────────

function WatchTabRoot() {
  const navigate = useNavigate();
  const { watch, collections, ownedIds, addCollection, showToast } = useApp();
  const [tab, setTab] = useState('watching');

  const watched = watch.map(id => byId(id)).filter(Boolean);
  const port = valueOf([...ownedIds()]);

  return (
    <Box style={{ minHeight: '100%' }}>
      {/* Heading */}
      <Box px="4" pt="3" pb="1">
        <Text size="5" weight="bold" as="div" style={{ letterSpacing: -0.5 }}>Your cards</Text>
        <Text size="2" color="gray" as="div" style={{ lineHeight: 1.45, marginTop: 2 }}>
          Track prices on cards you're watching and the value of your collection.
        </Text>
      </Box>

      {/* Tabs */}
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List mx="4">
          <Tabs.Trigger value="watching">Watching {watched.length}</Tabs.Trigger>
          <Tabs.Trigger value="collection">Collection</Tabs.Trigger>
        </Tabs.List>

        <Box px="4" py="3" pb="6">
          <Tabs.Content value="watching">
            {watched.length === 0 ? (
              <Flex direction="column" align="center" gap="3" py="9" px="4">
                <Flex align="center" justify="center" style={{
                  width: 80, height: 80, borderRadius: 999, background: 'var(--color-surface)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  <Heart size={36} color="var(--gray-8)" />
                </Flex>
                <Text size="4" weight="bold" align="center">Nothing saved yet</Text>
                <Text size="2" color="gray" align="center" style={{ maxWidth: 270, lineHeight: 1.5 }}>
                  Tap the heart on any card to track its price and get notified before auctions end.
                </Text>
                <Button size="3" onClick={() => navigate('/')}>Browse cards</Button>
              </Flex>
            ) : (
              <Flex direction="column" gap="2">
                {watched.map(item => <WatchRow key={item.id} item={item} />)}
              </Flex>
            )}
          </Tabs.Content>

          <Tabs.Content value="collection">
            {/* Portfolio header */}
            <Box p="4" mb="3" style={{
              background: 'var(--accent-9)', borderRadius: 18, color: '#fff',
            }}>
              <Text size="1" style={{ opacity: 0.7 }} weight="medium" as="div">Total portfolio value</Text>
              <Flex align="baseline" gap="2" mt="1">
                <Text size="7" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', letterSpacing: -0.5 }}>
                  {money(port.now)}
                </Text>
                <Delta from={port.then} to={port.now} style={{ color: port.now >= port.then ? '#7fe7a4' : '#ff9b8a' }} />
              </Flex>
              {port.series.length > 1 && (
                <Box mt="3">
                  <PriceChart data={port.series} width={300} height={56} color="rgba(255,255,255,0.8)" />
                </Box>
              )}
              <Flex justify="between" mt="2">
                <Text size="1" style={{ opacity: 0.7 }}>{[...ownedIds()].length} cards · {collections.length} collections</Text>
                <Text size="1" style={{ opacity: 0.7 }}>Updated just now</Text>
              </Flex>
            </Box>

            {/* Collections heading */}
            <Flex align="center" justify="between" mb="2" px="1">
              <Text size="2" weight="bold">Your collections</Text>
              <Button variant="ghost" size="1" onClick={() => {
                const n = window.prompt && window.prompt('Name your collection', '');
                if (n && n.trim()) {
                  addCollection(n.trim());
                  showToast('Collection created');
                }
              }}>
                <Plus size={14} /> New
              </Button>
            </Flex>

            <Flex direction="column" gap="2">
              {collections.map(col => (
                <CollectionFolder key={col.id} col={col} onClick={() => navigate(`/collection/${col.id}`)} />
              ))}
              {collections.length === 0 && (
                <Text size="2" color="gray" align="center" py="8">
                  No collections yet -- tap "New" to start one.
                </Text>
              )}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}

// ── Collection Detail (route: /collection/:id) ──────────────

function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, renameCollection, deleteCollection, addCardToCollection, removeCardFromCollection, showToast } = useApp();
  const [addOpen, setAddOpen] = useState(false);

  const col = collections.find(c => c.id === id);
  if (!col) {
    return (
      <Box p="6" style={{ textAlign: 'center' }}>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        <Text as="p" color="gray" mt="4">Collection not found.</Text>
      </Box>
    );
  }

  const v = valueOf(col.cards);
  const added = new Set(col.cards);
  const candidates = LISTINGS.filter(l => !added.has(l.id));

  return (
    <Box style={{ minHeight: '100%' }}>
      {/* Collection value header */}
      <Box p="4" mx="4" mt="3" style={{ background: 'var(--accent-9)', borderRadius: 18, color: '#fff' }}>
        <Flex align="center" gap="2" mb="1">
          <Text size="4">{col.icon || '🃏'}</Text>
          <Text size="3" weight="bold">Collection value</Text>
        </Flex>
        <Flex align="baseline" gap="2" mt="1">
          <Text size="6" weight="bold" style={{ fontFamily: 'var(--mono, monospace)', letterSpacing: -0.5 }}>
            {money(v.now)}
          </Text>
          <Delta from={v.then} to={v.now} style={{ color: v.now >= v.then ? '#7fe7a4' : '#ff9b8a' }} />
        </Flex>
        {v.series.length > 1 && (
          <Box mt="3">
            <PriceChart data={v.series} width={300} height={50} color="rgba(255,255,255,0.8)" />
          </Box>
        )}
        <Text size="1" style={{ opacity: 0.7 }} mt="2" as="div">
          {col.cards.length} card{col.cards.length !== 1 ? 's' : ''}
        </Text>
      </Box>

      <Box px="4" py="3">
        {/* Actions */}
        <Flex gap="2" mb="3">
          <Button size="3" style={{ flex: 1 }} onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Add cards
          </Button>
          <Button variant="soft" size="3" onClick={() => {
            const n = window.prompt && window.prompt('Rename collection', col.name);
            if (n && n.trim()) renameCollection(col.id, n.trim());
          }}>
            <Pencil size={14} /> Rename
          </Button>
        </Flex>

        {/* Card list */}
        {col.cards.length === 0 ? (
          <Text size="2" color="gray" align="center" py="8" as="div" style={{ lineHeight: 1.5 }}>
            This collection is empty. Add cards you own to track their value.
          </Text>
        ) : (
          <Flex direction="column" gap="2">
            {v.cards.map(item => (
              <Flex key={item.id} align="center" gap="3" p="2" style={{
                background: 'var(--color-surface)', borderRadius: 14,
                boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
              }}>
                <Flex align="center" gap="3" style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => navigate(`/listing/${item.id}`)}>
                  <Box style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6 }}>
                    <CardArt item={item} w={44} radius={6} showFoil={false} />
                  </Box>
                  <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                    <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Text>
                    <Text size="1" color="gray">
                      {setById(item.set)?.name?.replace(/\s*\(.*\)/, '')} · <GradeInline grade={item.grade} />
                    </Text>
                  </Flex>
                  <Flex direction="column" align="end" style={{ minWidth: 58 }}>
                    <Text size="2" weight="bold" style={{ fontFamily: 'var(--mono, monospace)' }}>
                      {money(item.market || item.price)}
                    </Text>
                    <Delta from={item.history ? item.history[0] : (item.market || item.price)} to={item.market || item.price} />
                  </Flex>
                </Flex>
                <IconButton variant="ghost" color="gray" size="1" onClick={() => {
                  removeCardFromCollection(col.id, item.id);
                  showToast('Removed from collection');
                }}>
                  <Trash2 size={16} />
                </IconButton>
              </Flex>
            ))}
          </Flex>
        )}

        {/* Delete collection */}
        {collections.length > 1 && (
          <Button variant="ghost" color="red" size="2" mt="5" style={{ width: '100%' }}
            onClick={() => {
              if (!window.confirm || window.confirm('Delete this collection? Cards stay in your other collections.')) {
                deleteCollection(col.id);
                navigate('/watch');
              }
            }}>
            Delete collection
          </Button>
        )}
      </Box>

      {/* Add cards sheet */}
      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title={`Add to ${col.name}`}>
        <Text size="2" color="gray" mb="3" as="div">
          Tap a card to add it to this collection.
        </Text>
        <Flex direction="column" gap="2" style={{ maxHeight: 360, overflow: 'auto' }}>
          {candidates.map(item => (
            <Flex key={item.id} align="center" gap="3" p="2" style={{
              background: 'var(--gray-a3)', borderRadius: 12, cursor: 'pointer',
            }} onClick={() => {
              addCardToCollection(col.id, item.id);
              showToast(`Added to ${col.name}`);
            }}>
              <Box style={{ background: 'var(--color-surface)', borderRadius: 8, padding: 5 }}>
                <CardArt item={item} w={38} radius={5} showFoil={false} />
              </Box>
              <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                <Text size="2" weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </Text>
                <Text size="1" color="gray">{money(item.market || item.price)} · <GradeInline grade={item.grade} /></Text>
              </Flex>
              <Plus size={18} color="var(--accent-9)" />
            </Flex>
          ))}
          {candidates.length === 0 && (
            <Text size="2" color="gray" align="center" py="6">No more cards to add.</Text>
          )}
        </Flex>
        <Button size="3" mt="3" style={{ width: '100%' }} onClick={() => setAddOpen(false)}>Done</Button>
      </Sheet>
    </Box>
  );
}

// ── Export: route-aware component ────────────────────────────

export default function Watchlist() {
  const { id } = useParams();
  // If we have an :id param, show collection detail; otherwise show watch tabs
  if (id) return <CollectionDetail />;
  return <WatchTabRoot />;
}
