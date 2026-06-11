import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Card, Badge } from '@radix-ui/themes';
import { Tag, Shield, ArrowLeftRight, Zap, ChevronRight, Truck, Store, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP } from '../data/shops';

// ── Big choice card ──────────────────────────────────────────
function BigChoice({ icon, tint, title, desc, meta, onClick, badge }) {
  return (
    <Card asChild style={{ cursor: 'pointer', padding: 18, borderRadius: 20 }} onClick={onClick}>
      <button style={{ width: '100%', textAlign: 'left', background: 'var(--color-surface)', border: 'none' }}>
        <Flex direction="column" gap="3">
          <Flex align="center" gap="3">
            <Flex align="center" justify="center" style={{
              width: 52, height: 52, borderRadius: 15, background: tint, color: '#fff', flexShrink: 0,
            }}>
              {icon}
            </Flex>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Flex align="center" gap="2" wrap="wrap">
                <Text weight="bold" size="4" style={{ letterSpacing: -0.3 }}>{title}</Text>
                {badge && <Badge color="indigo">{badge}</Badge>}
              </Flex>
              {meta && <Text size="1" color="gray" style={{ marginTop: 2 }}>{meta}</Text>}
            </Box>
            <ChevronRight size={18} style={{ color: 'var(--gray-a8)', flexShrink: 0 }} />
          </Flex>
          <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>{desc}</Text>
        </Flex>
      </button>
    </Card>
  );
}

// ── Sell Hub (root) ──────────────────────────────────────────
function SellHubRoot({ onMarketplace }) {
  const navigate = useNavigate();
  return (
    <Box>
      <Box p="4" pb="5" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)' }}>
        <Text as="div" size="7" weight="bold" style={{ letterSpacing: -0.6 }}>Sell your cards</Text>
        <Text as="p" size="3" color="gray" style={{ marginTop: 6, lineHeight: 1.45 }}>
          List individually to buyers worldwide, or sell a whole stack to a local shop in one go.
        </Text>
      </Box>

      <Flex direction="column" gap="3" p="4">
        <BigChoice
          icon={<Tag size={26} />}
          tint="var(--accent-9)"
          title="Sell on the marketplace"
          meta="One card or a whole stack -- ships to buyer"
          desc="List to buyers worldwide. Add a single card, or bulk-scan a pile and price them all at once."
          onClick={onMarketplace}
        />
        <BigChoice
          icon={<Shield size={26} />}
          tint={SHOP.tint}
          title="Sell to a local shop"
          meta="Bulk-friendly -- in-person -- cash or store credit"
          badge="Fast for big lots"
          desc="Got hundreds of cards? Submit your whole collection from your phone, get an offer, and swap at the counter -- no shipping."
          onClick={() => navigate('/sell/shop')}
        />
        <BigChoice
          icon={<ArrowLeftRight size={26} />}
          tint="var(--amber-9)"
          title="Trade with collectors"
          meta="Card-for-card -- meet at a local shop"
          badge="No cash needed"
          desc="Swap cards directly with nearby collectors. We match your collection to their want lists and suggest a shop to meet at."
          onClick={() => navigate('/trade')}
        />

        {/* reassurance row */}
        <Flex gap="3" mt="1">
          {[[Zap, 'Scan in minutes'], [Shield, 'Verified shops'], [Truck, 'No shipping hassle']].map(([Icon, label], i) => (
            <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '12px 10px', borderRadius: 13 }}>
              <Flex justify="center" mb="1" style={{ color: 'var(--accent-9)' }}><Icon size={18} /></Flex>
              <Text size="1" weight="bold" color="gray">{label}</Text>
            </Card>
          ))}
        </Flex>

        {/* own a shop hint */}
        <Box onClick={() => navigate('/shopfinder')} style={{
          cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
          border: '1.5px dashed var(--gray-a5)', borderRadius: 13, padding: '12px 14px',
        }}>
          <Flex align="center" justify="center" style={{
            width: 30, height: 30, borderRadius: 9, background: 'var(--green-a3)', color: 'var(--green-11)', flexShrink: 0,
          }}>
            <Store size={17} />
          </Flex>
          <Text size="2" color="gray" style={{ flex: 1 }}>
            <Text weight="bold" color="gray">Own a game shop?</Text> List it on Cardonomy
          </Text>
          <ChevronRight size={16} style={{ color: 'var(--gray-a6)' }} />
        </Box>
      </Flex>
    </Box>
  );
}

// ── Marketplace chooser: single vs bulk ──────────────────────
function SellMarketView({ onBack }) {
  const navigate = useNavigate();
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Flex align="center" gap="3" p="3" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <Text weight="bold" size="4">Sell on the marketplace</Text>
      </Flex>
      <Box p="4" style={{ flex: 1 }}>
        <Text as="p" size="3" color="gray" style={{ marginBottom: 16, lineHeight: 1.45 }}>
          How many cards are you listing? Both ways reach buyers worldwide with Buyer Protection.
        </Text>
        <Flex direction="column" gap="3">
          <BigChoice
            icon={<Tag size={26} />}
            tint="var(--accent-9)"
            title="List a single card"
            meta="Buy It Now or auction -- full control"
            desc="Search the catalog, set condition, photos and price for one card. Best for high-value singles."
            onClick={() => navigate('/sell/single')}
          />
          <BigChoice
            icon={<Zap size={26} />}
            tint="var(--amber-9)"
            title="Bulk list a stack"
            meta="Scan many -- auto-priced at market"
            badge="Same scan as selling to a shop"
            desc="Flip through a pile with Live Sweep, then we auto-price every card at market value. Tweak any, publish them all in one go."
            onClick={() => navigate('/sell/bulk')}
          />
        </Flex>
        <Flex align="start" gap="2" mt="4" p="3" style={{ background: 'var(--gray-a3)', borderRadius: 12 }}>
          <Zap size={16} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
          <Text size="2" color="gray" style={{ lineHeight: 1.45 }}>
            Bulk uses the <Text weight="bold">same Live Sweep scan</Text> as selling to a shop -- the difference is each card becomes its own marketplace listing instead of one offer.
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

// ── Exported component ───────────────────────────────────────
export default function SellHub() {
  const [view, setView] = useState('hub');

  if (view === 'market') {
    return <SellMarketView onBack={() => setView('hub')} />;
  }
  return <SellHubRoot onMarketplace={() => setView('market')} />;
}
