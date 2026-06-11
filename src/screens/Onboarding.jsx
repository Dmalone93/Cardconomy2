import React, { useState } from 'react';
import { Box, Flex, Text, Card, Badge, Button } from '@radix-ui/themes';
import { ShoppingBag, Tag, Store, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMES } from '../data/games';

// ── account types ────────────────────────────────────────────
const ACCT_TYPES = [
  { id: 'buyer', title: "I'm a collector", sub: 'Buy, bid, track & trade cards for my collection', icon: ShoppingBag },
  { id: 'seller', title: "I'm an individual seller", sub: 'Sell singles & lots, plus everything buyers can do', icon: Tag },
  { id: 'store', title: 'I run a game shop', sub: 'Storefront, buylist intake, local vault & trade hub', icon: Store },
];

// ── game tile ────────────────────────────────────────────────
function GameTile({ game, selected, onClick }) {
  return (
    <Card
      style={{
        cursor: 'pointer',
        textAlign: 'center',
        padding: '12px 8px',
        position: 'relative',
        boxShadow: selected ? 'inset 0 0 0 2.5px var(--accent-9)' : undefined,
        background: selected ? 'var(--accent-2)' : undefined,
      }}
      onClick={onClick}
    >
      <Box style={{
        width: 26, height: 26, borderRadius: 999,
        background: game.tint, margin: '0 auto 8px',
      }} />
      <Text size="1" weight="bold" style={{ color: selected ? undefined : 'var(--gray-9)' }}>{game.short}</Text>
      {selected && (
        <Flex align="center" justify="center" style={{
          position: 'absolute', top: 6, right: 6,
          width: 18, height: 18, borderRadius: 999,
          background: 'var(--accent-9)', color: '#fff',
        }}>
          <Check size={12} />
        </Flex>
      )}
    </Card>
  );
}

export default function Onboarding() {
  const { finishOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [acct, setAcct] = useState('buyer');
  const [sel, setSel] = useState([]);

  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const allSelected = sel.length >= GAMES.length;

  return (
    <Box style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--color-background)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Brand header */}
      <Flex align="center" gap="2" px="5" pt="6" pb="2">
        <Text size="5" weight="bold" style={{ letterSpacing: -0.5 }}>CARDONOMY</Text>
      </Flex>

      {/* Progress bar */}
      <Flex gap="2" px="5" pt="2">
        {[0, 1].map(i => (
          <Box key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= step ? 'var(--accent-9)' : 'var(--gray-4)',
            transition: 'background 0.2s',
          }} />
        ))}
      </Flex>

      {/* Content area */}
      <Box style={{ flex: 1, overflow: 'auto', padding: '22px 24px 12px' }}>
        {step === 0 ? (
          <Box>
            <Text size="8" weight="bold" style={{ display: 'block', letterSpacing: -0.7 }}>Welcome</Text>
            <Text size="4" color="gray" style={{ display: 'block', margin: '6px 0 22px', lineHeight: 1.5 }}>
              How do you want to use Cardonomy? You can always change this later.
            </Text>
            <Flex direction="column" gap="3">
              {ACCT_TYPES.map(t => {
                const on = acct === t.id;
                const Icon = t.icon;
                return (
                  <Card key={t.id} style={{
                    cursor: 'pointer',
                    boxShadow: on ? 'inset 0 0 0 2.5px var(--accent-9)' : undefined,
                    background: on ? 'var(--accent-2)' : undefined,
                  }} onClick={() => setAcct(t.id)}>
                    <Flex align="center" gap="3">
                      <Flex align="center" justify="center" style={{
                        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                        background: 'var(--gray-3)',
                      }}>
                        <Icon size={24} style={{ color: 'var(--gray-11)' }} />
                      </Flex>
                      <Box style={{ flex: 1 }}>
                        <Text size="3" weight="bold" style={{ display: 'block' }}>{t.title}</Text>
                        <Text size="2" color="gray" style={{ lineHeight: 1.4, marginTop: 2, display: 'block' }}>{t.sub}</Text>
                      </Box>
                      <Flex align="center" justify="center" style={{
                        width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                        boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--gray-6)',
                        background: on ? 'var(--accent-9)' : 'transparent',
                        color: '#fff',
                      }}>
                        {on && <Check size={13} />}
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </Box>
        ) : (
          <Box>
            <Text size="8" weight="bold" style={{ display: 'block', letterSpacing: -0.7 }}>Pick your games</Text>
            <Text size="4" color="gray" style={{ display: 'block', margin: '6px 0 18px', lineHeight: 1.5 }}>
              Your feed, search and price alerts will focus on what you choose. Most collectors pick one or two.
            </Text>
            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {GAMES.map(g => (
                <GameTile key={g.id} game={g} selected={sel.includes(g.id)} onClick={() => toggle(g.id)} />
              ))}
            </Box>
            <Button
              variant="ghost"
              size="2"
              mt="3"
              style={{ cursor: 'pointer', color: 'var(--accent-9)' }}
              onClick={() => setSel(allSelected ? [] : GAMES.map(g => g.id))}
            >
              {allSelected ? 'Clear all' : 'Select All'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer CTA */}
      <Box style={{ padding: '12px 24px 30px', borderTop: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}>
        {step === 0 ? (
          <Button size="3" style={{ width: '100%', cursor: 'pointer' }} onClick={() => setStep(1)}>
            Continue
          </Button>
        ) : (
          <Flex gap="3">
            <Button variant="outline" size="3" onClick={() => setStep(0)} style={{ cursor: 'pointer' }}>
              Back
            </Button>
            <Button
              size="3"
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => finishOnboarding({ acct, prefs: sel.length ? sel : GAMES.map(g => g.id) })}
            >
              {sel.length ? `Continue with ${sel.length} game${sel.length !== 1 ? 's' : ''}` : 'Browse everything'}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
