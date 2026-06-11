import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Card, Badge, Separator } from '@radix-ui/themes';
import { ArrowLeft, ShoppingCart, Check, Truck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { byId } from '../data/listings';
import { gradeText, GRADERS } from '../data/games';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

/* ── small helpers ── */

function GradeChip({ grade }) {
  if (!grade || grade.company === 'raw') {
    return <Badge variant="surface" color="gray" size="1">RAW</Badge>;
  }
  const co = GRADERS[grade.company] || GRADERS.raw;
  return (
    <Badge variant="solid" size="1" style={{ background: co.bg, color: co.fg }}>
      {grade.company.toUpperCase()} {grade.grade}
    </Badge>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useApp();
  const [placed, setPlaced] = useState(false);

  const items = cart.map(id => byId(id)).filter(Boolean);
  const subtotal = items.reduce((s, c) => s + c.price, 0);
  const shipping = items.length ? items.reduce((s, c) => s + (c.shipping || 0), 0) : 0;
  const protection = +(subtotal * 0.025).toFixed(2);
  const total = +(subtotal + shipping + protection).toFixed(2);
  const sellers = [...new Set(items.map(c => c.seller))];

  /* ── Success state ── */
  if (placed) {
    return (
      <Box style={{ minHeight: '100vh' }}>
        <Flex direction="column" align="center" justify="center" style={{ padding: '80px 24px 24px', textAlign: 'center' }}>
          <Flex
            align="center" justify="center"
            style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--green-3)', color: 'var(--green-11)' }}
          >
            <Check size={44} />
          </Flex>
          <Heading size="6" mt="5" mb="1">Order confirmed</Heading>
          <Text size="2" color="gray" style={{ maxWidth: 280, lineHeight: 1.5 }}>
            {items.length} card{items.length !== 1 ? 's' : ''} from {sellers.length} seller{sellers.length !== 1 ? 's' : ''} on the way.
            We'll text tracking as each ships.
          </Text>
          <Text size="5" weight="bold" mt="4" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
            {money(total)}
          </Text>

          {sellers.map(seller => {
            const sellerItems = items.filter(c => c.seller === seller);
            return (
              <Card key={seller} mt="4" style={{ width: '100%', maxWidth: 340, textAlign: 'left' }}>
                <Flex align="center" gap="2" mb="2">
                  <Truck size={14} />
                  <Text size="2" weight="bold">{seller}</Text>
                  <Text size="1" color="gray">- Tracking sent when shipped</Text>
                </Flex>
                {sellerItems.map(c => (
                  <Text key={c.id} size="2" color="gray">{c.name}</Text>
                ))}
              </Card>
            );
          })}
        </Flex>

        <Box style={{ padding: '12px 16px 30px', position: 'sticky', bottom: 0, borderTop: '1px solid var(--gray-a5)' }}>
          <Button
            size="3"
            style={{ width: '100%', borderRadius: 14, padding: 16, fontWeight: 700 }}
            onClick={() => { clearCart(); navigate('/'); }}
          >
            Keep browsing
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <Box style={{ minHeight: '100vh' }}>
        <Flex align="center" gap="3" p="4" style={{ borderBottom: '1px solid var(--gray-a5)' }}>
          <Button variant="ghost" size="2" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <Heading size="4">Your cart</Heading>
        </Flex>

        <Flex direction="column" align="center" justify="center" style={{ padding: '80px 30px', textAlign: 'center' }}>
          <Flex
            align="center" justify="center"
            style={{ width: 76, height: 76, borderRadius: 999, background: 'var(--gray-3)', color: 'var(--gray-8)' }}
          >
            <ShoppingCart size={34} />
          </Flex>
          <Heading size="4" mt="4" mb="1">Your cart is empty</Heading>
          <Text size="2" color="gray" style={{ maxWidth: 260, lineHeight: 1.5, marginBottom: 18 }}>
            Add cards from any Buy It Now listing -- combine multiple into one order.
          </Text>
          <Button size="3" onClick={() => navigate('/')}>Browse cards</Button>
        </Flex>
      </Box>
    );
  }

  /* ── Cart with items ── */
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Flex align="center" gap="3" p="4" style={{ borderBottom: '1px solid var(--gray-a5)' }}>
        <Button variant="ghost" size="2" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <Heading size="4" style={{ flex: 1 }}>Your cart</Heading>
        <Text size="2" color="gray">{items.length} item{items.length !== 1 ? 's' : ''}</Text>
      </Flex>

      {/* Item list */}
      <Box style={{ flex: 1, overflow: 'auto', padding: '14px 16px 16px' }}>
        <Flex direction="column" gap="3">
          {items.map(c => (
            <Card key={c.id} style={{ padding: 10 }}>
              <Flex align="center" gap="3">
                <Box style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate(`/listing/${c.id}`)}>
                  <CardArt item={c} w={56} radius={8} />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <GradeChip grade={c.grade} />
                  <Text as="div" size="2" weight="bold" mt="1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    {c.subtitle}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    {c.seller} · {c.shipping === 0 ? 'Free ship' : money(c.shipping) + ' ship'}
                  </Text>
                </Box>
                <Flex direction="column" align="end" style={{ flexShrink: 0 }}>
                  <Text size="3" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                    {money(c.price)}
                  </Text>
                  <Button
                    variant="ghost"
                    color="red"
                    size="1"
                    mt="1"
                    onClick={() => removeFromCart(c.id)}
                  >
                    <X size={14} /> Remove
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>

        {/* Multi-seller shipping notice */}
        {sellers.length > 1 && (
          <Flex align="center" gap="2" mt="3" p="3" style={{ background: 'var(--accent-3)', borderRadius: 12 }}>
            <Truck size={16} style={{ flexShrink: 0 }} />
            <Text size="2">
              Items ship from {sellers.length} sellers -- you'll get separate tracking for each.
            </Text>
          </Flex>
        )}

        {/* Order summary */}
        <Card mt="4" style={{ padding: 16 }}>
          {[
            ['Subtotal', money(subtotal)],
            ['Shipping', shipping === 0 ? 'Free' : money(shipping)],
            ['Buyer Protection (2.5%)', money(protection)],
          ].map(([label, value]) => (
            <Flex key={label} justify="between" py="1">
              <Text size="2" color="gray">{label}</Text>
              <Text size="2" weight="medium" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{value}</Text>
            </Flex>
          ))}
          <Separator size="4" my="2" />
          <Flex justify="between" align="baseline">
            <Text size="3" weight="bold">Total</Text>
            <Text size="5" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{money(total)}</Text>
          </Flex>
        </Card>
      </Box>

      {/* Sticky checkout button */}
      <Box style={{ padding: '12px 16px 30px', position: 'sticky', bottom: 0, borderTop: '1px solid var(--gray-a5)', backdropFilter: 'blur(18px)' }}>
        <Button
          size="3"
          style={{ width: '100%', borderRadius: 14, padding: 16, fontWeight: 700, fontSize: '16.5px' }}
          onClick={() => setPlaced(true)}
        >
          Checkout · {money(total)}
        </Button>
      </Box>
    </Box>
  );
}
