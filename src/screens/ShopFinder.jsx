import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, Badge, Card } from '@radix-ui/themes';
import { ArrowLeft, Shield, ChevronRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOPS } from '../data/shops';

const FILTERS = [
  ['all', 'All shops'],
  ['vault', 'Has vault'],
  ['tradeHub', 'Trade hub'],
  ['events', 'Events'],
];

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <Flex align="center" gap="1" style={{ display: 'inline-flex' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < full ? 'var(--amber-9)' : i === full && half ? 'url(#halfStar)' : 'none'}
          stroke={i < full || (i === full && half) ? 'var(--amber-9)' : 'var(--gray-7)'}
          strokeWidth={1.5}
        />
      ))}
    </Flex>
  );
}

function ShopBadge({ tone, children }) {
  const colorMap = {
    accent: 'blue',
    up: 'green',
    gold: 'amber',
    neutral: 'gray',
  };
  return (
    <Badge size="1" variant="soft" color={colorMap[tone] || 'gray'} style={{ fontSize: 11 }}>
      {children}
    </Badge>
  );
}

export default function ShopFinder() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [filter, setFilter] = useState('all');

  const shops = [...SHOPS]
    .sort((a, b) => a.dist - b.dist)
    .filter(s => filter === 'all' || s[filter]);

  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      {/* Header */}
      <Flex align="center" gap="3" px="4" style={{
        paddingTop: 16, paddingBottom: 12,
        background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)',
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-12)',
          display: 'flex', alignItems: 'center', padding: 0,
        }}>
          <ArrowLeft size={20} />
        </button>
        <Text size="3" weight="bold" style={{ flex: 1 }}>Find a local shop</Text>
      </Flex>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Info banner */}
        <div style={{ padding: '16px 16px 0' }}>
          <Flex gap="3" align="start" style={{
            background: 'var(--accent-a3)', borderRadius: 13, padding: '12px 14px', marginBottom: 14,
          }}>
            <Shield size={17} style={{ color: 'var(--accent-9)', marginTop: 1, flexShrink: 0 }} />
            <Text size="2" style={{ color: 'var(--gray-11)', lineHeight: 1.45 }}>
              Verified game shops near you — buy, sell a collection, <b>trade</b>, or store cards in the <b>vault</b>.
            </Text>
          </Flex>
        </div>

        {/* Filter chips */}
        <Flex gap="2" px="4" pb="2" style={{ overflowX: 'auto', flexShrink: 0 }}>
          {FILTERS.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 700, fontSize: 13,
              padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: filter === id ? 'var(--gray-12)' : 'var(--color-surface)',
              color: filter === id ? '#fff' : 'var(--gray-11)',
              boxShadow: filter === id ? 'none' : 'inset 0 0 0 1px var(--gray-a4)',
            }}>{label}</button>
          ))}
        </Flex>

        {/* Shop cards */}
        <Flex direction="column" gap="3" px="4" py="2" pb="6">
          {shops.map(s => (
            <button key={s.id} onClick={() => navigate(`/storefront/${s.id}`)} style={{
              width: '100%', textAlign: 'left', background: 'var(--color-surface)',
              borderRadius: 16, padding: 14, border: 'none', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(20,24,40,0.06)',
            }}>
              <Flex align="center" gap="3">
                <span style={{
                  width: 52, height: 52, borderRadius: 14, background: s.tint, color: '#fff',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 22,
                }}>{s.initial}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap="2">
                    <Text weight="bold" size="3" style={{ letterSpacing: -0.3 }}>{s.name}</Text>
                    <Shield size={14} style={{ color: s.tint }} />
                  </Flex>
                  <Flex align="center" gap="2" mt="1">
                    <StarRating rating={s.rating} />
                    <Text size="1" style={{ color: 'var(--gray-9)', fontFamily: 'var(--mono)' }}>
                      {s.rating} · {s.dist} mi
                    </Text>
                  </Flex>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--gray-6)' }} />
              </Flex>
              <Text as="p" size="2" style={{
                color: 'var(--gray-11)', lineHeight: 1.45, margin: '11px 0 0',
              }}>{s.blurb}</Text>
              <Flex wrap="wrap" gap="2" mt="3" align="center">
                {s.enrolled && <ShopBadge tone="accent">Buylist intake</ShopBadge>}
                {s.tradeHub && <ShopBadge tone="up">Trade hub</ShopBadge>}
                {s.vault && <ShopBadge tone="gold">Vault</ShopBadge>}
                {s.events && <ShopBadge tone="neutral">Events</ShopBadge>}
                <span style={{
                  marginLeft: 'auto', fontSize: 11.5, color: 'var(--green-9)',
                  fontWeight: 700, alignSelf: 'center',
                }}>● {s.hours}</span>
              </Flex>
            </button>
          ))}
          {shops.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '50px 20px', color: 'var(--gray-9)', fontSize: 14,
            }}>No shops match that filter.</div>
          )}
        </Flex>
      </div>
    </Flex>
  );
}
