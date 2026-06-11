import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Card, Badge, Tabs, Separator, Callout, TextField } from '@radix-ui/themes';
import { Heart, Shield, Truck, Eye, Share2, ArrowLeft, ShoppingCart, Check, Zap, Gavel, Tag, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gameById, setById, gradeText, GRADERS } from '../data/games';
import { LISTINGS, byId } from '../data/listings';
import CardArt from '../components/CardArt';
import ListCard from '../components/ListCard';
import PriceChart from '../components/PriceChart';
import Sheet from '../components/Sheet';
import { money } from '../components/helpers';

/* ── small helpers ── */

function GradeChip({ grade, size = 'sm' }) {
  if (!grade || grade.company === 'raw') {
    return <Badge variant="surface" color="gray" size="1">RAW</Badge>;
  }
  const co = GRADERS[grade.company] || GRADERS.raw;
  return (
    <Badge
      variant="solid"
      size={size === 'lg' ? '2' : '1'}
      style={{ background: co.bg, color: co.fg }}
    >
      {grade.company.toUpperCase()} {grade.grade}
    </Badge>
  );
}

function Delta({ from, to }) {
  if (from == null || to == null) return null;
  const diff = to - from;
  const pct = ((diff / from) * 100).toFixed(1);
  const up = diff >= 0;
  return (
    <Badge variant="soft" color={up ? 'green' : 'red'} size="1">
      {up ? '+' : ''}{pct}%
    </Badge>
  );
}

function StarRating({ rating }) {
  // rating is a percentage like 99.4
  const stars = Math.round((rating / 100) * 5 * 2) / 2; // half-star precision
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: '#eab308', fontSize: 13 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function StatBox({ label, value, sub }) {
  return (
    <Box style={{ flex: 1, background: 'var(--gray-a2)', borderRadius: 12, padding: '11px 12px' }}>
      <Text size="1" weight="bold" color="gray" style={{ display: 'block', marginBottom: 3 }}>{label}</Text>
      <Text size="3" weight="bold" style={{ display: 'block', fontFamily: 'var(--mono, monospace)' }}>{value}</Text>
      {sub && <Text size="1" color="gray" style={{ display: 'block', marginTop: 1 }}>{sub}</Text>}
    </Box>
  );
}

function InfoRow({ icon, title, sub, value }) {
  return (
    <Flex align="center" gap="3" py="3" style={{ borderBottom: '1px solid var(--gray-a4)' }}>
      <Box style={{ color: 'var(--gray-9)' }}>{icon}</Box>
      <Box style={{ flex: 1 }}>
        <Text size="2" weight="bold" style={{ display: 'block' }}>{title}</Text>
        {sub && <Text size="1" color="gray" style={{ display: 'block', marginTop: 1 }}>{sub}</Text>}
      </Box>
      {value && <Text size="2" weight="bold">{value}</Text>}
    </Flex>
  );
}

/* ── main screen ── */

export default function Listing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useApp();
  const item = byId(id);

  const [tf, setTf] = useState('90D');
  const [sheet, setSheet] = useState(null);
  const [offer, setOffer] = useState('');
  const [bid, setBid] = useState('');

  if (!item) {
    return (
      <Flex align="center" justify="center" p="6" direction="column" gap="3">
        <Text size="4" weight="bold">Listing not found</Text>
        <Button variant="soft" onClick={() => navigate('/')}>Go home</Button>
      </Flex>
    );
  }

  const isLot = !!item.count;
  const isAuction = item.type === 'auction';
  const watched = app.isWatched(item.id);
  const g = gameById(item.game);
  const set = setById(item.set);
  const hist = item.history || [item.market || item.price, item.price];
  const histSlice = tf === '30D' ? hist.slice(-5) : hist;
  const up = item.price >= hist[0];
  const minBid = +(item.price + Math.max(1, item.price * 0.03)).toFixed(2);

  const similar = LISTINGS.filter(l => l.id !== item.id && l.game === item.game).slice(0, 6);

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* ── top nav overlay ── */}
      <Flex
        align="center"
        justify="between"
        px="3"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
          paddingTop: 12, paddingBottom: 10,
          background: 'linear-gradient(180deg, var(--color-background) 60%, transparent)',
        }}
      >
        <Button variant="surface" size="2" style={{ borderRadius: 999 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <Flex gap="2">
          <Button variant="surface" size="2" style={{ borderRadius: 999 }} onClick={() => app.showToast('Link copied')}>
            <Share2 size={18} />
          </Button>
          <Button
            variant="surface"
            size="2"
            style={{ borderRadius: 999, color: watched ? 'var(--red-9)' : undefined }}
            onClick={() => app.toggleWatch(item.id)}
          >
            <Heart size={18} fill={watched ? 'currentColor' : 'none'} />
          </Button>
        </Flex>
      </Flex>

      {/* ── scrollable body ── */}
      <Box style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {/* hero */}
        <Flex
          justify="center"
          style={{
            paddingTop: 64, paddingBottom: 24,
            background: `radial-gradient(120% 90% at 50% 0%, ${item.art}22, var(--gray-a2) 70%)`,
          }}
        >
          {isLot ? (
            <Box style={{
              width: 200, height: 200, borderRadius: 18, background: item.art, color: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
              boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 10px, transparent 10px 20px)' }} />
              <Text style={{ position: 'relative', fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 52, lineHeight: 1 }}>{item.count}</Text>
              <Text style={{ position: 'relative', fontWeight: 700, fontSize: 14, letterSpacing: 1, opacity: 0.9 }}>CARD LOT</Text>
            </Box>
          ) : item.grade && item.grade.company !== 'raw' ? (
            /* Slab framing for graded cards */
            <Box style={{
              background: '#f1f5f9', borderRadius: 14, padding: '12px 10px 16px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <Flex align="center" gap="2" style={{ marginBottom: 2 }}>
                <Text style={{ fontWeight: 800, fontSize: 11, color: GRADERS[item.grade.company]?.bg || '#333', letterSpacing: 0.5 }}>
                  {item.grade.company.toUpperCase()}
                </Text>
                <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 13 }}>
                  {item.grade.grade}
                </Text>
                {gradeText(item.grade) && (
                  <Text style={{ fontSize: 9, fontWeight: 700, color: 'var(--gray-9)', letterSpacing: 0.3 }}>
                    {gradeText(item.grade)}
                  </Text>
                )}
              </Flex>
              <CardArt item={item} w={176} radius={10} />
            </Box>
          ) : (
            <Box style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.2))' }}>
              <CardArt item={item} w={176} radius={14} />
            </Box>
          )}
        </Flex>

        {/* body card */}
        <Box style={{
          background: 'var(--color-panel-solid)',
          borderRadius: '22px 22px 0 0',
          marginTop: -12,
          padding: '20px 18px 8px',
          position: 'relative',
        }}>
          {/* title block */}
          <Flex gap="2" align="center" wrap="wrap" mb="2">
            {g && (
              <Badge variant="solid" style={{ background: g.tint, color: '#fff' }}>
                {g.short}
              </Badge>
            )}
            {!isLot && <GradeChip grade={item.grade} size="lg" />}
            {item.foil && <Text size="1" color="gray" weight="bold">&#10022; Foil / Holo</Text>}
          </Flex>

          <Heading size="6" weight="bold" style={{ letterSpacing: -0.6, lineHeight: 1.1 }}>
            {item.name}
          </Heading>
          <Text size="2" color="gray" style={{ display: 'block', marginTop: 4 }}>
            {set ? set.name : ''}{item.number ? ' \u00b7 ' + item.number : ''}{isLot ? '' : ' \u00b7 ' + item.condition}
          </Text>

          {/* price display */}
          <Flex align="end" gap="3" mt="4">
            <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 32, letterSpacing: -1 }}>
              {money(item.price)}
            </Text>
            {item.market && (
              <Text size="2" color="gray" style={{ paddingBottom: 6 }}>
                market <b style={{ fontFamily: 'var(--mono, monospace)' }}>{money(item.market)}</b>
              </Text>
            )}
          </Flex>
          {item.market && (
            <Flex align="center" gap="2" mt="1">
              <Delta from={item.market} to={item.price} />
              <Text size="1" color="gray">vs market</Text>
            </Flex>
          )}

          {/* auction info */}
          {isAuction && (
            <Flex align="center" gap="2" mt="3">
              <Badge variant="soft" color="orange" size="2">
                <Gavel size={14} /> {item.bids} bids &middot; ends in {item.timeLeft}
              </Badge>
            </Flex>
          )}

          {/* lot info */}
          {isLot && item.note && (
            <Box mt="3" style={{ background: 'var(--gray-a2)', borderRadius: 12, padding: '12px 14px' }}>
              <Text size="2"><b>What's inside:</b> {item.note}. Condition {item.condition}.</Text>
            </Box>
          )}

          {/* price history chart */}
          {item.history && (
            <Box mt="5" style={{ background: 'var(--gray-a2)', borderRadius: 16, padding: 16 }}>
              <Flex align="center" justify="between" mb="2">
                <Text size="2" weight="bold">Price history</Text>
                <Tabs.Root value={tf} onValueChange={setTf}>
                  <Tabs.List size="1">
                    <Tabs.Trigger value="30D">30D</Tabs.Trigger>
                    <Tabs.Trigger value="90D">90D</Tabs.Trigger>
                    <Tabs.Trigger value="1Y">1Y</Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>
              </Flex>

              <Flex align="baseline" gap="2" mb="2">
                <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 18 }}>{money(item.price)}</Text>
                <Delta from={hist[0]} to={item.price} />
                <Text size="1" color="gray">vs {tf} ago</Text>
              </Flex>

              <PriceChart
                data={histSlice}
                width={320}
                height={70}
                color={up ? 'var(--green-9)' : 'var(--red-9)'}
              />

              <Flex gap="2" mt="3">
                <StatBox label="Last sold" value={money(hist[hist.length - 2])} sub="2 days ago" />
                <StatBox label="90-day low" value={money(Math.min(...hist))} />
                <StatBox label="90-day high" value={money(Math.max(...hist))} />
              </Flex>
            </Box>
          )}

          {/* seller card */}
          <Box mt="5">
            <Heading size="4" weight="bold" mb="3">Seller</Heading>
            <Card style={{ padding: 14 }}>
              <Flex align="center" gap="3">
                <Box style={{
                  width: 46, height: 46, borderRadius: 12, background: 'var(--accent-9)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 20, flexShrink: 0,
                }}>
                  {item.seller[0]}
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap="2" wrap="wrap">
                    <Text size="3" weight="bold">{item.seller}</Text>
                    {item.sellerRating >= 99 && (
                      <Badge variant="soft" color="green" size="1">Trusted</Badge>
                    )}
                  </Flex>
                  <Flex align="center" gap="2" mt="1">
                    <StarRating rating={item.sellerRating} />
                    <Text size="1" color="gray" style={{ fontFamily: 'var(--mono, monospace)' }}>
                      {item.sellerRating}% &middot; {item.sellerSales?.toLocaleString()} sales
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Card>
          </Box>

          {/* buyer protection & shipping */}
          <Box mt="4">
            <InfoRow
              icon={<Truck size={20} />}
              title={item.shipping === 0 ? 'Free shipping' : money(item.shipping) + ' shipping'}
              sub={'Ships from ' + item.loc}
              value={item.ships}
            />
            <InfoRow
              icon={<Shield size={20} />}
              title="Cardonomy Buyer Protection"
              sub="Full refund if item not as described"
            />
            <InfoRow
              icon={<Tag size={20} />}
              title="Authenticity guarantee"
              sub={item.grade && item.grade.company !== 'raw'
                ? gradeText(item.grade) + ' verified slab'
                : 'Verified by seller'}
            />
          </Box>

          {/* buyer protection callout */}
          <Callout.Root mt="4" color="blue">
            <Callout.Icon>
              <Shield size={18} />
            </Callout.Icon>
            <Callout.Text>
              Every purchase is backed by Cardonomy Buyer Protection. Full refund if your item doesn't match the listing.
            </Callout.Text>
          </Callout.Root>

          {/* similar listings */}
          {similar.length > 0 && (
            <Box mt="6">
              <Heading size="4" weight="bold" mb="3">Similar listings</Heading>
              <Flex
                gap="3"
                style={{
                  overflowX: 'auto', margin: '0 -18px', padding: '0 18px 8px',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {similar.map(l => (
                  <Box
                    key={l.id}
                    onClick={() => navigate(`/listing/${l.id}`)}
                    style={{ flexShrink: 0, width: 120, cursor: 'pointer' }}
                  >
                    <Box style={{ background: 'var(--gray-a2)', borderRadius: 12, padding: 10, display: 'flex', justifyContent: 'center' }}>
                      <CardArt item={l} w={90} radius={8} />
                    </Box>
                    <Text size="1" weight="bold" style={{ display: 'block', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.name}
                    </Text>
                    <Text size="2" weight="bold" style={{ display: 'block', fontFamily: 'var(--mono, monospace)' }}>
                      {money(l.price)}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── sticky CTA footer ── */}
      <Flex
        align="center"
        gap="3"
        px="4"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
          paddingTop: 12, paddingBottom: 28,
          background: 'var(--color-panel-translucent)',
          backdropFilter: 'blur(18px)',
          borderTop: '1px solid var(--gray-a4)',
        }}
      >
        {isAuction ? (
          <>
            <Box style={{ flex: 1 }}>
              <Text size="1" color="gray" style={{ display: 'block' }}>Current bid &middot; {item.bids} bids</Text>
              <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 20, display: 'block' }}>
                {money(item.price)}
              </Text>
            </Box>
            <Button
              size="3"
              style={{ flex: 1.1 }}
              onClick={() => setSheet('bid')}
            >
              Place bid
            </Button>
          </>
        ) : (
          <>
            {item.accepts_offers && (
              <Button
                variant="outline"
                size="3"
                style={{ flex: 1 }}
                onClick={() => setSheet('offer')}
              >
                Offer
              </Button>
            )}
            <Button
              variant="outline"
              size="3"
              style={{ width: 52, flexShrink: 0, padding: 0 }}
              color={app.cart?.includes(item.id) ? 'blue' : undefined}
              onClick={() => app.addToCart(item.id)}
            >
              {app.cart?.includes(item.id) ? <Check size={20} /> : <ShoppingCart size={20} />}
            </Button>
            <Button
              size="3"
              style={{ flex: 1.3 }}
              onClick={() => app.showToast('Proceeding to checkout...')}
            >
              <Zap size={15} /> Buy now
            </Button>
          </>
        )}
      </Flex>

      {/* ── offer sheet ── */}
      <Sheet open={sheet === 'offer'} onClose={() => setSheet(null)} title="Make an offer">
        <Text size="2" color="gray" style={{ display: 'block', marginBottom: 14 }}>
          Listed at {money(item.price)} &middot; market {money(item.market)}. Sellers usually respond within a day.
        </Text>
        <Flex align="center" gap="2" style={{ background: 'var(--gray-a2)', borderRadius: 14, padding: '10px 16px' }}>
          <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 26, color: 'var(--gray-9)' }}>$</Text>
          <input
            autoFocus
            type="number"
            value={offer}
            onChange={e => setOffer(e.target.value)}
            placeholder={money(item.price * 0.9, { cents: false }).replace('$', '')}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 26,
              color: 'var(--gray-12)', minWidth: 0,
            }}
          />
        </Flex>
        <Flex gap="2" my="3">
          {[0.85, 0.9, 0.95].map(m => (
            <Button key={m} variant="soft" size="1" onClick={() => setOffer(String(Math.round(item.price * m)))}>
              {money(item.price * m, { cents: false })}
            </Button>
          ))}
        </Flex>
        <Button
          size="3"
          style={{ width: '100%' }}
          disabled={!offer}
          onClick={() => { setSheet(null); setOffer(''); app.showToast('Offer sent to ' + item.seller); }}
        >
          Send offer
        </Button>
      </Sheet>

      {/* ── bid sheet ── */}
      <Sheet open={sheet === 'bid'} onClose={() => setSheet(null)} title="Place a bid">
        <Text size="2" color="gray" style={{ display: 'block', marginBottom: 14 }}>
          Current bid {money(item.price)} &middot; enter {money(minBid)} or more. Ends in {item.timeLeft}.
        </Text>
        <Flex align="center" gap="2" style={{ background: 'var(--gray-a2)', borderRadius: 14, padding: '10px 16px' }}>
          <Text style={{ fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 26, color: 'var(--gray-9)' }}>$</Text>
          <input
            autoFocus
            type="number"
            value={bid}
            onChange={e => setBid(e.target.value)}
            placeholder={money(minBid).replace('$', '')}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 26,
              color: 'var(--gray-12)', minWidth: 0,
            }}
          />
        </Flex>
        <Flex gap="2" my="3">
          {[minBid, minBid * 1.1, minBid * 1.25].map((b, i) => (
            <Button key={i} variant="soft" size="1" onClick={() => setBid(String(Math.round(b)))}>
              {money(b, { cents: false })}
            </Button>
          ))}
        </Flex>
        <Button
          size="3"
          style={{ width: '100%' }}
          disabled={!bid}
          onClick={() => { setSheet(null); setBid(''); app.placeBid(item.id, +bid); app.showToast('Bid placed!'); }}
        >
          Confirm bid
        </Button>
      </Sheet>
    </Box>
  );
}
