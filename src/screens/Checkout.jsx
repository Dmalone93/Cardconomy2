import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Card, Badge, Separator, RadioGroup } from '@radix-ui/themes';
import { ArrowLeft, Check, Truck, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { byId } from '../data/listings';
import { gradeText, GRADERS, setById } from '../data/games';
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

const MOCK_ADDRESSES = [
  { id: 'a1', name: 'Alex Rivera', line: '248 Harbor St, San Diego, CA 92101' },
  { id: 'a2', name: 'Alex Rivera', line: '1200 Market St, Apt 4B, San Francisco, CA 94103' },
];

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const item = byId(id);

  const [address, setAddress] = useState('a1');
  const [ship, setShip] = useState('standard');
  const [pay, setPay] = useState('applepay');
  const [placed, setPlaced] = useState(false);
  const [working, setWorking] = useState(false);

  if (!item) {
    return (
      <Box p="6">
        <Text>Item not found.</Text>
        <Button mt="3" onClick={() => navigate('/')}>Go home</Button>
      </Box>
    );
  }

  const setInfo = setById(item.set);
  const shipCost = item.shipping || 0;
  const expedited = ship === 'express' ? 9.99 : shipCost;
  const protection = +(item.price * 0.025).toFixed(2);
  const tax = +(item.price * 0.0825).toFixed(2);
  const total = +(item.price + expedited + protection + tax).toFixed(2);
  const orderNo = 'CC-' + (8200000 + Math.floor((item.price * 137) % 99999));

  function place() {
    setWorking(true);
    setTimeout(() => { setWorking(false); setPlaced(true); }, 1100);
  }

  /* ── Success state ── */
  if (placed) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Flex direction="column" align="center" style={{ flex: 1, padding: '80px 24px 24px', textAlign: 'center' }}>
          <Flex
            align="center" justify="center"
            style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--green-3)', color: 'var(--green-11)' }}
          >
            <Check size={44} />
          </Flex>
          <Heading size="6" mt="5" mb="1">Order confirmed</Heading>
          <Text size="2" color="gray" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{orderNo}</Text>

          <Card mt="5" style={{ width: '100%', maxWidth: 360, textAlign: 'left', padding: 16 }}>
            <Flex align="center" gap="3">
              <Box style={{ background: 'var(--gray-3)', borderRadius: 10, padding: 8 }}>
                <CardArt item={item} w={56} radius={8} />
              </Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text as="div" size="3" weight="bold">{item.name}</Text>
                <Text as="div" size="2" color="gray">from {item.seller}</Text>
                <Text as="div" size="4" weight="bold" mt="1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                  {money(total)}
                </Text>
              </Box>
            </Flex>
          </Card>

          <Flex align="center" gap="2" mt="3" p="3" style={{ width: '100%', maxWidth: 360, background: 'var(--accent-3)', borderRadius: 12 }}>
            <Truck size={16} style={{ flexShrink: 0 }} />
            <Text size="2" weight="medium">
              Arriving {ship === 'express' ? '1-2 business days' : '3-5 business days'} · tracked & insured
            </Text>
          </Flex>
        </Flex>

        <Box style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--gray-a5)' }}>
          <Button
            size="3"
            style={{ width: '100%', borderRadius: 14, padding: 16, fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            Keep browsing
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── Checkout form ── */
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Flex align="center" gap="3" p="4" style={{ borderBottom: '1px solid var(--gray-a5)' }}>
        <Button variant="ghost" size="2" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <Heading size="4">Checkout</Heading>
      </Flex>

      <Box style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Item summary */}
        <Card style={{ padding: 14 }}>
          <Flex align="center" gap="3">
            <Box style={{ background: 'var(--gray-3)', borderRadius: 10, padding: 8 }}>
              <CardArt item={item} w={58} radius={8} />
            </Box>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <GradeChip grade={item.grade} />
              <Text as="div" size="3" weight="bold" mt="1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </Text>
              <Text as="div" size="1" color="gray">
                {setInfo?.name} · {item.seller}
              </Text>
            </Box>
            <Text size="4" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)', flexShrink: 0 }}>
              {money(item.price)}
            </Text>
          </Flex>
        </Card>

        {/* Ship to address */}
        <Text as="div" size="2" weight="bold" mt="5" mb="2">Ship to</Text>
        <Flex direction="column" gap="2">
          {MOCK_ADDRESSES.map(addr => (
            <Card
              key={addr.id}
              style={{
                padding: '13px 14px',
                cursor: 'pointer',
                outline: address === addr.id ? '2px solid var(--accent-9)' : '1px solid var(--gray-a5)',
              }}
              onClick={() => setAddress(addr.id)}
            >
              <Flex align="center" gap="3">
                <Flex
                  align="center" justify="center"
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-9)', color: '#fff', fontWeight: 800, flexShrink: 0 }}
                >
                  {addr.name[0]}
                </Flex>
                <Box style={{ flex: 1 }}>
                  <Text as="div" size="2" weight="bold">{addr.name}</Text>
                  <Text as="div" size="1" color="gray">{addr.line}</Text>
                </Box>
                {address === addr.id && <Check size={18} style={{ color: 'var(--accent-9)' }} />}
              </Flex>
            </Card>
          ))}
        </Flex>

        {/* Delivery options */}
        <Text as="div" size="2" weight="bold" mt="5" mb="2">Delivery</Text>
        <RadioGroup.Root value={ship} onValueChange={setShip}>
          <Flex direction="column" gap="2">
            <Card
              style={{
                padding: '13px 14px',
                cursor: 'pointer',
                outline: ship === 'standard' ? '2px solid var(--accent-9)' : '1px solid var(--gray-a5)',
              }}
              onClick={() => setShip('standard')}
            >
              <Flex align="center" gap="3">
                <RadioGroup.Item value="standard" />
                <Box style={{ flex: 1 }}>
                  <Text as="div" size="2" weight="medium">Standard · tracked</Text>
                  <Text as="div" size="1" color="gray">Arrives in 3-5 business days</Text>
                </Box>
                <Text size="2" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)' }} color={shipCost === 0 ? 'green' : undefined}>
                  {shipCost === 0 ? 'Free' : money(shipCost)}
                </Text>
              </Flex>
            </Card>

            <Card
              style={{
                padding: '13px 14px',
                cursor: 'pointer',
                outline: ship === 'express' ? '2px solid var(--accent-9)' : '1px solid var(--gray-a5)',
              }}
              onClick={() => setShip('express')}
            >
              <Flex align="center" gap="3">
                <RadioGroup.Item value="express" />
                <Box style={{ flex: 1 }}>
                  <Text as="div" size="2" weight="medium">Express · insured</Text>
                  <Text as="div" size="1" color="gray">Arrives in 1-2 business days</Text>
                </Box>
                <Text size="2" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)' }}>$9.99</Text>
              </Flex>
            </Card>
          </Flex>
        </RadioGroup.Root>

        {/* Payment method */}
        <Text as="div" size="2" weight="bold" mt="5" mb="2">Payment</Text>
        <RadioGroup.Root value={pay} onValueChange={setPay}>
          <Flex direction="column" gap="2">
            <Card
              style={{
                padding: '13px 14px',
                cursor: 'pointer',
                outline: pay === 'applepay' ? '2px solid var(--accent-9)' : '1px solid var(--gray-a5)',
              }}
              onClick={() => setPay('applepay')}
            >
              <Flex align="center" gap="3">
                <RadioGroup.Item value="applepay" />
                <Box style={{ flex: 1 }}>
                  <Text as="div" size="2" weight="medium"> Pay</Text>
                  <Text as="div" size="1" color="gray">Default · Face ID</Text>
                </Box>
              </Flex>
            </Card>

            <Card
              style={{
                padding: '13px 14px',
                cursor: 'pointer',
                outline: pay === 'card' ? '2px solid var(--accent-9)' : '1px solid var(--gray-a5)',
              }}
              onClick={() => setPay('card')}
            >
              <Flex align="center" gap="3">
                <RadioGroup.Item value="card" />
                <Box style={{ flex: 1 }}>
                  <Text as="div" size="2" weight="medium">Visa ···· 4242</Text>
                  <Text as="div" size="1" color="gray">Expires 08/27</Text>
                </Box>
              </Flex>
            </Card>
          </Flex>
        </RadioGroup.Root>

        {/* Buyer protection banner */}
        <Flex align="start" gap="3" mt="4" p="3" style={{ background: 'var(--green-3)', borderRadius: 12 }}>
          <Shield size={18} style={{ color: 'var(--green-11)', marginTop: 2, flexShrink: 0 }} />
          <Text size="2" style={{ lineHeight: 1.45 }}>
            <Text weight="bold">Buyer Protection included.</Text>{' '}
            Full refund if your card doesn't arrive or isn't as described. Graded slabs are authenticity-verified.
          </Text>
        </Flex>

        {/* Order summary */}
        <Card mt="5" style={{ padding: 16 }}>
          {[
            ['Item', money(item.price)],
            ['Shipping', expedited === 0 ? 'Free' : money(expedited)],
            ['Buyer Protection (2.5%)', money(protection)],
            ['Est. tax (8.25%)', money(tax)],
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

      {/* Pay Now button */}
      <Box style={{ padding: '12px 16px 30px', position: 'sticky', bottom: 0, borderTop: '1px solid var(--gray-a5)', backdropFilter: 'blur(18px)' }}>
        <Button
          size="3"
          disabled={working}
          style={{
            width: '100%',
            borderRadius: 14,
            padding: 16,
            fontWeight: 700,
            fontSize: '16.5px',
            background: pay === 'applepay' ? 'var(--gray-12)' : undefined,
          }}
          onClick={place}
        >
          {working
            ? 'Processing...'
            : pay === 'applepay'
              ? ` Pay · ${money(total)}`
              : `Pay Now · ${money(total)}`
          }
        </Button>
      </Box>
    </Box>
  );
}
