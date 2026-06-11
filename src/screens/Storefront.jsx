import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, Text, Badge } from '@radix-ui/themes';
import { ArrowLeft, Shield, Zap, Star, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOPS, shopById } from '../data/shops';
import { byId } from '../data/listings';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

// ── Inline SVG icons ────────────────────────────────────────
function VaultIcon(props) {
  return (
    <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8.5V6M19 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalIcon(props) {
  return (
    <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon(props) {
  return (
    <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <Flex align="center" gap="1" style={{ display: 'inline-flex' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < full ? 'var(--amber-9)' : i === full && half ? 'var(--amber-9)' : 'none'}
          stroke={i < full || (i === full && half) ? 'var(--amber-9)' : 'var(--gray-7)'}
          strokeWidth={1.5}
        />
      ))}
    </Flex>
  );
}

// ── Enrollment pitch screen ─────────────────────────────────
function EnrollView({ navigate }) {
  const [done, setDone] = useState(false);

  const props = [
    [Zap, 'Free deal flow', 'Walk-in sellers scan a QR and submit their whole collection digitally — even when your counter is slammed.'],
    [StoreIcon, 'Your own storefront', 'A branded page on Cardonomy with your inventory, hours, and reputation in front of local collectors.'],
    [VaultIcon, 'Be the local vault', 'Members store graded cards at your shop and trade them without shipping — recurring foot traffic and fees.'],
    [Shield, 'Neutral trade hub', 'Collectors meet at your shop to settle trades safely. More visits, more sales at the counter.'],
    [Zap, 'Pro seller tools', 'Buylist manager, instant price guide, and an offer composer — all built in. No extra software.'],
  ];

  if (done) {
    return (
      <Flex direction="column" align="center" justify="center" style={{
        height: '100%', background: 'var(--color-background)', padding: 32, textAlign: 'center',
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: 999, background: 'var(--green-a3)',
          color: 'var(--green-9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={44} />
        </div>
        <Text as="h1" size="6" weight="bold" style={{ margin: '20px 0 6px', letterSpacing: -0.5 }}>
          Application received!
        </Text>
        <Text size="3" style={{ color: 'var(--gray-9)', lineHeight: 1.5, maxWidth: 290 }}>
          Our team will verify your shop within 2 business days and send your QR intake kit. Welcome to the network.
        </Text>
        <button onClick={() => navigate('/storefront/gnome')} style={{
          marginTop: 24, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: '14px 26px', fontWeight: 700, fontSize: 15.5, border: 'none', cursor: 'pointer',
        }}>Preview a storefront</button>
        <button onClick={() => navigate(-1)} style={{
          marginTop: 10, color: 'var(--gray-9)', fontWeight: 600, fontSize: 14,
          background: 'none', border: 'none', cursor: 'pointer',
        }}>Back</button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      {/* Nav */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '16px 12px 10px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
        }}><ArrowLeft size={20} /></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(160deg, #2f8f5b, #1f6e44)', color: '#fff',
          padding: '72px 22px 30px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 16px, transparent 16px 32px)',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-block', fontWeight: 700, fontSize: 12,
              background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '5px 11px', marginBottom: 14,
            }}>FOR LOCAL GAME SHOPS</div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, lineHeight: 1.05 }}>
              Turn your shop into the local card hub
            </h1>
            <p style={{ fontSize: 15, opacity: 0.92, lineHeight: 1.5, margin: '12px 0 0' }}>
              Join the Cardonomy network — free deal flow, a storefront, and tools that bring collectors through your door.
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <Flex gap="3" px="4" style={{ marginTop: -2, paddingTop: 16 }}>
          {[['$0', 'to enroll'], ['2 days', 'to go live'], ['9%', 'flat seller fee']].map(([v, k]) => (
            <div key={k} style={{
              flex: 1, background: 'var(--color-surface)', borderRadius: 13, padding: '12px 10px',
              textAlign: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <Text style={{ fontWeight: 700, fontSize: 18 }}>{v}</Text>
              <Text as="div" size="1" style={{ color: 'var(--gray-9)' }}>{k}</Text>
            </div>
          ))}
        </Flex>

        {/* Value props */}
        <Flex direction="column" gap="3" px="4" pt="3">
          {props.map(([Icon, title, body], i) => (
            <Flex key={i} gap="3" style={{
              background: 'var(--color-surface)', borderRadius: 14, padding: 15,
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <span style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: 'var(--accent-a3)', color: 'var(--accent-9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon size={20} /></span>
              <div style={{ flex: 1 }}>
                <Text weight="bold" size="3" style={{ letterSpacing: -0.2 }}>{title}</Text>
                <Text as="div" size="2" style={{ color: 'var(--gray-11)', lineHeight: 1.45, marginTop: 2 }}>{body}</Text>
              </div>
            </Flex>
          ))}
        </Flex>

        {/* Testimonial */}
        <div style={{
          margin: '16px 16px 0', background: 'var(--gray-12)', borderRadius: 16,
          padding: 18, color: '#fff',
        }}>
          <Text size="3" style={{ lineHeight: 1.5, fontWeight: 500 }}>
            "The QR intake alone saved us hours every weekend. Sellers submit on their phone, we make offers when we get a sec — and they keep shopping while they wait."
          </Text>
          <Flex align="center" gap="3" mt="4">
            <span style={{
              width: 34, height: 34, borderRadius: 10, background: '#2f8f5b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15,
            }}>G</span>
            <div>
              <Text weight="bold" size="2">Sara — Gnome Games</Text>
              <Text as="div" size="1" style={{ opacity: 0.7 }}>Madison, WI · enrolled 2024</Text>
            </div>
          </Flex>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px',
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--gray-a4)',
      }}>
        <button onClick={() => setDone(true)} style={{
          width: '100%', background: '#2f8f5b', color: '#fff', borderRadius: 14,
          padding: 16, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(47,143,91,0.4)',
        }}>Enroll your shop — free</button>
      </div>
    </Flex>
  );
}

// ── Storefront view ─────────────────────────────────────────
export default function Storefront() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  // If id is 'enroll', show enrollment pitch
  if (id === 'enroll') {
    return <EnrollView navigate={navigate} />;
  }

  const shop = shopById(id) || SHOPS[0];
  const inv = (shop.inventory || []).map(byId).filter(Boolean);

  const services = [
    shop.enrolled && { title: 'Buylist intake', sub: 'Sell your stack here', Icon: Zap, action: () => navigate(`/sell/shop/${shop.id}`) },
    shop.tradeHub && { title: 'Trade hub', sub: 'Meet & swap on neutral ground', Icon: Shield, action: () => navigate('/trade') },
    shop.vault && { title: 'Local vault', sub: 'Store & trade graded cards', Icon: VaultIcon, action: () => showToast('Vault: store cards at the shop') },
    shop.events && { title: 'Events', sub: 'Tournaments & trade nights', Icon: CalIcon, action: () => showToast('Upcoming: Friday trade night') },
  ].filter(Boolean);

  return (
    <Flex direction="column" style={{ height: '100%', background: 'var(--color-background)' }}>
      {/* Floating nav */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '16px 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 999,
          background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(6px)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: 'var(--gray-12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
        }}><ArrowLeft size={20} /></button>
        <button onClick={() => showToast('Following ' + shop.name)} style={{
          height: 38, padding: '0 16px', borderRadius: 999,
          background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(6px)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: 'var(--gray-12)',
          fontWeight: 700, fontSize: 13.5, border: 'none', cursor: 'pointer',
        }}>+ Follow</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
        {/* Banner */}
        <div style={{
          height: 150, background: `linear-gradient(135deg, ${shop.tint}, ${shop.tint}bb)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 14px, transparent 14px 28px)',
          }} />
        </div>

        {/* Header card */}
        <div style={{ padding: '0 16px', marginTop: -36, position: 'relative' }}>
          <Flex align="end" gap="3" mb="3">
            <span style={{
              width: 76, height: 76, borderRadius: 20, background: shop.tint, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 34, border: '3px solid var(--color-surface)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)', flexShrink: 0,
            }}>{shop.initial}</span>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <Flex align="center" gap="2">
                <Text as="h1" size="5" weight="bold" style={{ margin: 0, letterSpacing: -0.5 }}>{shop.name}</Text>
                <Shield size={16} style={{ color: shop.tint }} />
              </Flex>
              <Flex align="center" gap="2" mt="1" style={{ fontSize: 12.5, color: 'var(--gray-9)' }}>
                <StarRating rating={shop.rating} />
                <span>{shop.rating} · {shop.reviews?.toLocaleString()} reviews</span>
              </Flex>
            </div>
          </Flex>

          <Flex align="center" gap="3" mb="3" style={{ fontSize: 12.5, color: 'var(--gray-11)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {shop.loc} · {shop.dist} mi
            </span>
            <span style={{ color: 'var(--green-9)', fontWeight: 700 }}>● {shop.hours}</span>
          </Flex>

          <Text as="p" size="3" style={{
            color: 'var(--gray-11)', lineHeight: 1.5, margin: '0 0 16px',
          }}>{shop.blurb}</Text>

          {/* Primary CTAs */}
          <Flex gap="3" mb="5">
            <button onClick={() => navigate(`/sell/shop/${shop.id}`)} style={{
              flex: 1, background: 'var(--accent-9)', color: '#fff', borderRadius: 13,
              padding: 14, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}><Zap size={16} /> Sell to shop</button>
            <button onClick={() => navigate('/trade')} style={{
              flex: 1, background: 'var(--color-surface)', color: 'var(--gray-12)',
              borderRadius: 13, padding: 14, fontWeight: 700, fontSize: 14.5,
              boxShadow: 'inset 0 0 0 1.5px var(--gray-a4)', border: 'none', cursor: 'pointer',
            }}>Trade here</button>
          </Flex>

          {/* Services */}
          <Text weight="bold" size="3" mb="3" style={{ display: 'block' }}>What this shop offers</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {services.map((svc, i) => (
              <button key={i} onClick={svc.action} style={{
                textAlign: 'left', background: 'var(--color-surface)', borderRadius: 14,
                padding: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)', border: 'none', cursor: 'pointer',
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--accent-a3)',
                  color: 'var(--accent-9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 8,
                }}><svc.Icon size={18} /></span>
                <Text as="div" weight="bold" size="2">{svc.title}</Text>
                <Text as="div" size="1" style={{ color: 'var(--gray-9)', lineHeight: 1.3, marginTop: 1 }}>{svc.sub}</Text>
              </button>
            ))}
          </div>

          {/* Inventory preview */}
          {inv.length > 0 && (
            <>
              <Flex align="baseline" justify="between" mb="3">
                <Text weight="bold" size="3">In stock now</Text>
                <button onClick={() => navigate('/search')} style={{
                  fontWeight: 600, fontSize: 13, color: 'var(--accent-9)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>See all</button>
              </Flex>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 8 }}>
                {inv.slice(0, 4).map(l => (
                  <button key={l.id} onClick={() => navigate(`/listing/${l.id}`)} style={{
                    textAlign: 'left', background: 'var(--color-surface)', borderRadius: 14,
                    overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
                    border: 'none', cursor: 'pointer',
                  }}>
                    <div style={{
                      background: 'var(--gray-a2)', padding: '12px 12px 6px',
                      display: 'flex', justifyContent: 'center',
                    }}><CardArt item={l} w={86} /></div>
                    <div style={{ padding: '8px 11px 11px' }}>
                      <Text as="div" weight="bold" size="2" style={{
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{l.name}</Text>
                      <Text as="div" weight="bold" style={{ fontSize: 14, marginTop: 2 }}>{money(l.price)}</Text>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Flex>
  );
}
