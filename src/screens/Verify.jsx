import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Card, Badge, Button, Progress } from '@radix-ui/themes';
import { ArrowLeft, Shield, Check, Phone, CreditCard, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── trust tiers ──────────────────────────────────────────────
const TIERS = [
  { n: 0, key: 'registered', label: 'Registered', color: 'gray', accent: 'var(--gray-9)', wash: 'var(--gray-3)', desc: 'Email + phone confirmed' },
  { n: 1, key: 'verified', label: 'ID Verified', color: 'blue', accent: 'var(--accent-9)', wash: 'var(--accent-3)', desc: 'Government ID + selfie + payout details' },
  { n: 2, key: 'trusted', label: 'Trusted Seller', color: 'green', accent: 'var(--green-9)', wash: 'var(--green-3)', desc: 'Strong track record on Cardonomy' },
  { n: 3, key: 'pro', label: 'Verified Shop', color: 'orange', accent: 'var(--orange-9)', wash: 'var(--orange-3)', desc: 'Licensed business - the gold standard' },
];
const tierByN = (n) => TIERS[Math.max(0, Math.min(3, n))];

// ── verification steps ────────────────────────────────────────
const STEPS = [
  { id: 'phone', icon: Phone, title: 'Confirm your phone', blurb: 'We text a 6-digit code. Used for login and offer alerts.', cta: 'Verify Phone' },
  { id: 'id', icon: CreditCard, title: 'Government ID + selfie', blurb: 'Snap your ID and a selfie. Matched automatically by our verification partner -- we never store the raw images.', cta: 'Upload ID' },
  { id: 'payout', icon: Landmark, title: 'Payout & tax details', blurb: 'Link a bank for payouts and confirm tax info (required to receive money). KYC/AML compliant.', cta: 'Add Payout' },
];

// ── trust badge (reusable) ───────────────────────────────────
export function TrustBadge({ tierN = 1, size = 'sm' }) {
  const t = tierByN(tierN);
  if (t.n === 0) return null;
  return (
    <Badge color={t.color} variant="soft" size={size === 'lg' ? '2' : '1'} style={{ gap: 4 }}>
      <Shield size={size === 'lg' ? 13 : 11} />
      {t.label}
    </Badge>
  );
}

// ── trusted seller metrics ───────────────────────────────────
const METRICS = [
  { label: 'Completed sales', valLow: 18, valHigh: 25, goal: 25, unit: '', inverse: false },
  { label: 'On-time shipping', valLow: 96, valHigh: 100, goal: 95, unit: '%', inverse: false },
  { label: 'Positive rating', valLow: 97, valHigh: 99, goal: 98, unit: '%', inverse: false },
  { label: 'Dispute rate (max 2%)', valLow: 1.2, valHigh: 0.4, goal: 2, unit: '%', inverse: true },
];

export default function Verify() {
  const { tier, setTier } = useApp();
  const navigate = useNavigate();
  const [working, setWorking] = useState(null);
  const [localDone, setLocalDone] = useState(tier >= 1 ? [true, true, true] : [false, false, false]);
  const nextIdx = localDone.findIndex(d => !d);
  const allDone = nextIdx === -1;

  const runStep = (i) => {
    setWorking(STEPS[i].id);
    setTimeout(() => {
      setLocalDone(d => d.map((v, j) => j === i ? true : v));
      setWorking(null);
    }, 1100);
  };

  useEffect(() => {
    if (allDone && tier < 1) setTier(1);
  }, [allDone, tier, setTier]);

  const displayTier = allDone ? Math.max(tier, 1) : 0;
  const currentTier = tierByN(displayTier);

  return (
    <Box style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Header */}
      <Flex align="center" gap="3" p="4" style={{ borderBottom: '1px solid var(--gray-a4)', background: 'var(--color-surface)' }}>
        <Button variant="ghost" size="2" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </Button>
        <Text size="5" weight="bold">Verification</Text>
      </Flex>

      <Box p="4" pb="8" style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Current trust status card */}
        <Card style={{ background: 'var(--accent-9)', color: '#fff', marginBottom: 16 }}>
          <Flex justify="between" align="center">
            <Text size="2" style={{ opacity: 0.8 }} weight="medium">Your trust level</Text>
            <TrustBadge tierN={displayTier} size="lg" />
          </Flex>
          <Text size="6" weight="bold" mt="1" style={{ color: '#fff', display: 'block' }}>{currentTier.label}</Text>
          <Text size="2" style={{ opacity: 0.85, color: '#fff' }}>{currentTier.desc}</Text>
        </Card>

        {/* Info banner when not done */}
        {!allDone && (
          <Flex gap="3" align="start" mb="4" p="3" style={{ background: 'var(--accent-3)', borderRadius: 12 }}>
            <Shield size={16} style={{ color: 'var(--accent-9)', marginTop: 2, flexShrink: 0 }} />
            <Text size="2" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>
              Cardonomy is <strong>verified-only for selling, bidding, and trading</strong>. One quick check unlocks all of it -- and earns you a badge buyers trust.
            </Text>
          </Flex>
        )}

        {/* 3-step verification stepper */}
        <Flex direction="column" gap="3">
          {STEPS.map((s, i) => {
            const done = localDone[i];
            const active = i === nextIdx;
            const busy = working === s.id;
            const Icon = s.icon;
            return (
              <Card key={s.id} style={{
                opacity: !done && !active ? 0.55 : 1,
                boxShadow: active ? 'inset 0 0 0 2px var(--accent-9)' : undefined,
              }}>
                <Flex align="center" gap="3">
                  <Flex align="center" justify="center" style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: done ? 'var(--green-3)' : 'var(--gray-3)',
                    color: done ? 'var(--green-9)' : 'var(--gray-9)',
                  }}>
                    {done ? <Check size={20} /> : <Icon size={20} />}
                  </Flex>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="3" weight="bold">{s.title}</Text>
                    <Text size="1" color="gray">{done ? 'Verified' : `Step ${i + 1} of 3`}</Text>
                  </Box>
                  {done && <Badge color="green" variant="soft">Done</Badge>}
                </Flex>
                {active && (
                  <Box mt="3">
                    <Text size="2" color="gray" style={{ lineHeight: 1.5, display: 'block', marginBottom: 12 }}>{s.blurb}</Text>
                    <Button
                      size="3"
                      style={{ width: '100%', cursor: 'pointer' }}
                      onClick={() => runStep(i)}
                      disabled={busy}
                    >
                      {busy ? 'Verifying...' : s.cta}
                    </Button>
                  </Box>
                )}
              </Card>
            );
          })}
        </Flex>

        {/* All done celebration */}
        {allDone && (
          <Box mt="4" style={{ textAlign: 'center' }}>
            <Text size="5" weight="bold" style={{ color: 'var(--green-9)', display: 'block' }}>You're verified!</Text>
            <Text size="3" color="gray" style={{ display: 'block', maxWidth: 300, margin: '6px auto 16px', lineHeight: 1.5 }}>
              You can now sell, bid, and trade. Build a track record to reach <strong>Trusted Seller</strong> and unlock higher limits.
            </Text>
            <Button size="3" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Done</Button>
          </Box>
        )}

        {/* Trusted seller progression (once ID-verified) */}
        {tier >= 1 && (
          <Card mt="5">
            <Flex justify="between" align="center" mb="1">
              <Text size="4" weight="bold">Progress to Trusted Seller</Text>
              <TrustBadge tierN={2} size="sm" />
            </Flex>
            <Text size="2" color="gray" mb="4" style={{ display: 'block', lineHeight: 1.5 }}>
              {tier >= 2
                ? "You've earned Trusted Seller -- higher limits, lower payout holds, and priority placement."
                : 'Earn it through a clean track record. Unlocks higher limits, faster payouts, and a featured badge.'}
            </Text>
            {METRICS.map(m => {
              const val = tier >= 2 ? m.valHigh : m.valLow;
              const pct = m.inverse
                ? Math.max(0, Math.min(100, (1 - val / m.goal) * 100))
                : Math.min(100, (val / m.goal) * 100);
              const met = m.inverse ? val <= m.goal : val >= m.goal;
              return (
                <Box key={m.label} mb="3">
                  <Flex justify="between" mb="1">
                    <Text size="1" weight="medium" color="gray">{m.label}</Text>
                    <Text size="1" weight="bold" style={{ color: met ? 'var(--green-9)' : 'var(--gray-9)', fontFamily: 'var(--font-mono, monospace)' }}>
                      {val}{m.unit}{met ? ' \u2713' : ` / ${m.goal}${m.unit}`}
                    </Text>
                  </Flex>
                  <Box style={{ height: 6, borderRadius: 999, background: 'var(--gray-4)', overflow: 'hidden' }}>
                    <Box style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: met ? 'var(--green-9)' : 'var(--accent-9)', transition: 'width 0.4s' }} />
                  </Box>
                </Box>
              );
            })}
            {tier < 2 && (
              <Button
                variant="outline"
                size="2"
                style={{ width: '100%', marginTop: 8, cursor: 'pointer' }}
                onClick={() => setTier(2)}
              >
                Simulate reaching milestone
              </Button>
            )}
          </Card>
        )}

        {/* Trust ladder */}
        <Text size="3" weight="bold" color="gray" mt="6" mb="3" style={{ display: 'block' }}>How trust works on Cardonomy</Text>
        <Flex direction="column" gap="2">
          {TIERS.map(t => {
            const isCurrent = displayTier === t.n;
            return (
              <Card key={t.key} style={{
                boxShadow: isCurrent ? `inset 0 0 0 1.5px ${t.accent}` : undefined,
              }}>
                <Flex align="center" gap="3">
                  <Flex align="center" justify="center" style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: t.wash, color: t.accent,
                    fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {t.n}
                  </Flex>
                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="bold">{t.label}</Text>
                    <Text size="1" color="gray">{t.desc}</Text>
                  </Box>
                  {displayTier >= t.n && t.n > 0 && (
                    <Check size={14} style={{ color: 'var(--green-9)' }} />
                  )}
                </Flex>
              </Card>
            );
          })}
        </Flex>

        <Text size="1" color="gray" mt="4" style={{ display: 'block', textAlign: 'center', lineHeight: 1.5 }}>
          In-person trades require <strong>both</strong> traders verified. Shops are checked for a business license. Powered by a KYC partner -- your raw documents are never stored on Cardonomy.
        </Text>
      </Box>
    </Box>
  );
}
