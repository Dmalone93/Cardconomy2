import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Flex, Text, Card, Badge, Button } from '@radix-ui/themes';
import { ArrowLeft, Shield, Check, Package, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { byId } from '../data/listings';
import { setById } from '../data/games';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

const AUTH_STEPS = ['Received', 'Authenticating', 'Verified & sealed'];

// ── reusable auth seal ───────────────────────────────────────
export function AuthSeal({ size = 'sm' }) {
  return (
    <Badge color="green" variant="soft" size={size === 'lg' ? '2' : '1'} style={{ gap: 4 }}>
      <Check size={size === 'lg' ? 14 : 12} />
      Cardonomy Verified
    </Badge>
  );
}

export default function AuthCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = id ? byId(id) : null;
  const [phase, setPhase] = useState('intro'); // intro -> method -> submitted -> status
  const [method, setMethod] = useState(null);  // 'mail' | 'shop'
  const [stage, setStage] = useState(0);
  const fee = item ? Math.max(8, Math.round(item.market * 0.03)) : 12;

  const goBack = () => {
    if (phase === 'intro' || phase === 'submitted') {
      navigate(-1);
    } else {
      setPhase('intro');
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Header */}
      <Flex align="center" gap="3" p="4" style={{ borderBottom: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}>
        <Button variant="ghost" size="2" onClick={goBack} style={{ cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </Button>
        <Text size="5" weight="bold">Authenticate card</Text>
      </Flex>

      <Box p="4" pb="8" style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Card header (if an item was passed) */}
        {item && (
          <Card mb="4">
            <Flex align="center" gap="3">
              <Box style={{ background: 'var(--gray-3)', borderRadius: 9, padding: 6 }}>
                <CardArt item={item} w={44} radius={6} />
              </Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="3" weight="bold">{item.name}</Text>
                <Text size="1" color="gray">{setById(item.set)?.name} -- market {money(item.market, { cents: false })}</Text>
              </Box>
            </Flex>
          </Card>
        )}

        {/* ── PHASE: Intro ────────────────────────────────── */}
        {phase === 'intro' && (
          <Box>
            <Flex direction="column" align="center" py="4" mb="4">
              <Flex align="center" justify="center" style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'var(--green-3)', color: 'var(--green-9)',
                marginBottom: 12,
              }}>
                <Shield size={30} />
              </Flex>
              <Text size="6" weight="bold" align="center" style={{ letterSpacing: -0.5 }}>Get it Cardonomy Verified</Text>
              <Text size="3" color="gray" align="center" style={{ maxWidth: 300, lineHeight: 1.5, marginTop: 8 }}>
                Raw cards over $100 can be authenticated by our team. Verified cards get a tamper-evident seal and sell for more, with buyer trust built in.
              </Text>
            </Flex>

            <Card>
              {[
                { emoji: '\uD83D\uDD2C', title: 'Expert examination', desc: 'Centering, edges, surface, and print checked against a reference DB' },
                { emoji: '\uD83C\uDFF7\uFE0F', title: 'Tamper-evident seal', desc: 'A serialized Cardonomy Verified mark links the card to its listing' },
                { emoji: '\uD83D\uDCC8', title: 'Sells ~20% higher', desc: 'Verified raw cards convert faster and at better prices' },
              ].map((b, i) => (
                <Flex key={b.title} gap="3" py="2" style={{ borderBottom: i < 2 ? '1px solid var(--gray-a3)' : undefined }}>
                  <Text size="5">{b.emoji}</Text>
                  <Box>
                    <Text size="2" weight="bold">{b.title}</Text>
                    <Text size="2" color="gray" style={{ lineHeight: 1.4, display: 'block' }}>{b.desc}</Text>
                  </Box>
                </Flex>
              ))}
              <Flex justify="between" align="center" pt="3">
                <Text size="3" weight="bold">Authentication fee</Text>
                <Text size="5" weight="bold" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{money(fee)}</Text>
              </Flex>
            </Card>

            <Button
              size="3"
              style={{ width: '100%', marginTop: 16, cursor: 'pointer' }}
              onClick={() => setPhase('method')}
            >
              Authenticate This Card
            </Button>
          </Box>
        )}

        {/* ── PHASE: Method ───────────────────────────────── */}
        {phase === 'method' && (
          <Box>
            <Text size="6" weight="bold" mb="1" style={{ display: 'block', letterSpacing: -0.4 }}>How do you want to verify?</Text>
            <Text size="3" color="gray" mb="4" style={{ display: 'block' }}>Both end in the same Cardonomy Verified seal.</Text>

            {[
              { id: 'shop', icon: Store, title: 'Verify at a local shop', desc: 'Drop it at an enrolled LGS -- examined on-site, often same day. No shipping.', tag: 'Fastest' },
              { id: 'mail', icon: Package, title: 'Mail-in to Cardonomy', desc: 'Ship with a prepaid, insured label. Examined and sealed at our facility, then returned or vaulted.', tag: '5-7 days' },
            ].map(opt => {
              const sel = method === opt.id;
              const Icon = opt.icon;
              return (
                <Card key={opt.id} mb="3" style={{
                  cursor: 'pointer',
                  boxShadow: sel ? 'inset 0 0 0 2px var(--accent-9)' : undefined,
                  background: sel ? 'var(--accent-2)' : undefined,
                }} onClick={() => setMethod(opt.id)}>
                  <Flex gap="3" align="start">
                    <Flex align="center" justify="center" style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: sel ? 'var(--accent-3)' : 'var(--gray-3)',
                      color: sel ? 'var(--accent-9)' : 'var(--gray-9)',
                    }}>
                      <Icon size={22} />
                    </Flex>
                    <Box style={{ flex: 1 }}>
                      <Flex align="center" gap="2">
                        <Text size="3" weight="bold">{opt.title}</Text>
                        <Badge color="blue" variant="soft" size="1">{opt.tag}</Badge>
                      </Flex>
                      <Text size="2" color="gray" style={{ lineHeight: 1.45, marginTop: 3, display: 'block' }}>{opt.desc}</Text>
                    </Box>
                  </Flex>
                </Card>
              );
            })}

            <Button
              size="3"
              style={{ width: '100%', marginTop: 8, cursor: 'pointer', opacity: method ? 1 : 0.45 }}
              disabled={!method}
              onClick={() => { setPhase('submitted'); setStage(0); }}
            >
              {method === 'shop' ? 'Find a shop & submit' : method === 'mail' ? 'Get my prepaid label' : 'Choose a method'}
            </Button>
          </Box>
        )}

        {/* ── PHASE: Submitted / Status ───────────────────── */}
        {phase === 'submitted' && (
          <Box>
            {/* Confirmation header */}
            <Flex direction="column" align="center" py="3" mb="4">
              <Flex align="center" justify="center" style={{
                width: 76, height: 76, borderRadius: 999,
                background: 'var(--accent-3)', color: 'var(--accent-9)',
                marginBottom: 12,
              }}>
                <Check size={40} />
              </Flex>
              <Text size="6" weight="bold" align="center" style={{ letterSpacing: -0.5 }}>Submitted for authentication</Text>
              <Text size="3" color="gray" align="center" style={{ maxWidth: 300, lineHeight: 1.5, marginTop: 8 }}>
                {method === 'shop'
                  ? "Take the card to Gnome Games (ticket #AC-2231). We'll text when it's sealed."
                  : 'Your prepaid label is in Notifications. Pack the card and drop it off -- tracking starts automatically.'}
              </Text>
            </Flex>

            {/* Prep instructions */}
            <Card mb="4">
              <Text size="3" weight="bold" mb="3" style={{ display: 'block' }}>
                {method === 'shop' ? 'What to bring' : 'Shipping instructions'}
              </Text>
              {method === 'mail' ? (
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">1. Place card in a toploader with penny sleeve</Text>
                  <Text size="2" color="gray">2. Print and include the submission form</Text>
                  <Text size="2" color="gray">3. Use the prepaid label from Notifications</Text>
                  <Text size="2" color="gray">4. Drop off at any USPS location</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">1. Bring the card to the shop counter</Text>
                  <Text size="2" color="gray">2. Show the ticket number: #AC-2231</Text>
                  <Text size="2" color="gray">3. Staff will examine and seal on-site</Text>
                </Flex>
              )}
            </Card>

            {/* Status tracker */}
            <Card>
              <Text size="3" weight="bold" mb="4" style={{ display: 'block' }}>Authentication status</Text>
              {AUTH_STEPS.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <Flex key={s} gap="3" align="start" style={{ paddingBottom: i < AUTH_STEPS.length - 1 ? 16 : 0, position: 'relative' }}>
                    {i < AUTH_STEPS.length - 1 && (
                      <Box style={{
                        position: 'absolute', left: 13, top: 26, bottom: 2, width: 2,
                        background: done ? 'var(--green-9)' : 'var(--gray-4)',
                      }} />
                    )}
                    <Flex align="center" justify="center" style={{
                      width: 28, height: 28, borderRadius: 999, flexShrink: 0, zIndex: 1,
                      background: done ? 'var(--green-9)' : active ? 'var(--accent-9)' : 'var(--gray-4)',
                      color: done || active ? '#fff' : 'var(--gray-8)',
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {done ? '\u2713' : active ? '\u2022' : i + 1}
                    </Flex>
                    <Box style={{ paddingTop: 4 }}>
                      <Text size="3" weight="bold" style={{ color: done || active ? undefined : 'var(--gray-8)' }}>{s}</Text>
                      {active && <Text size="2" color="gray" style={{ display: 'block' }}>In progress...</Text>}
                    </Box>
                  </Flex>
                );
              })}
            </Card>

            {stage < AUTH_STEPS.length - 1 ? (
              <Button
                variant="outline"
                size="3"
                style={{ width: '100%', marginTop: 16, cursor: 'pointer' }}
                onClick={() => setStage(stage + 1)}
              >
                Advance status (demo)
              </Button>
            ) : (
              <Box mt="4" p="5" style={{ background: 'var(--green-3)', borderRadius: 14, textAlign: 'center' }}>
                <Box mb="2"><AuthSeal size="lg" /></Box>
                <Text size="4" weight="bold" style={{ color: 'var(--green-9)', display: 'block' }}>Card verified & sealed</Text>
                <Text size="2" color="gray" style={{ display: 'block', maxWidth: 280, margin: '6px auto 14px', lineHeight: 1.45 }}>
                  Your listing now shows the Cardonomy Verified seal. Serial #AC-2231-CHZ.
                </Text>
                <Button size="3" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Done</Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
