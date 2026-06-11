import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Switch } from '@radix-ui/themes';
import { ArrowLeft, Search, Check, Camera, Tag, Zap, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LISTINGS } from '../data/listings';
import { setById } from '../data/games';
import CardArt from '../components/CardArt';
import { money } from '../components/helpers';

const STEPS = ['Card', 'Condition', 'Photos', 'Price', 'Review'];

// catalog of card identities to choose from
const CATALOG = LISTINGS.map(l => ({
  name: l.name, subtitle: l.subtitle, game: l.game, set: l.set,
  number: l.number, art: l.art, foil: l.foil, market: l.market,
}));

// ── Step progress bar ────────────────────────────────────────
function Stepper({ step }) {
  return (
    <Flex gap="2" px="4" pb="1">
      {STEPS.map((s, i) => (
        <Box key={s} style={{ flex: 1 }}>
          <Box style={{
            height: 4, borderRadius: 999,
            background: i <= step ? 'var(--accent-9)' : 'var(--gray-a4)',
            transition: 'background 0.3s',
          }} />
          <Text size="1" weight={i === step ? 'bold' : 'medium'}
            style={{ display: 'block', marginTop: 5, color: i <= step ? 'var(--accent-9)' : 'var(--gray-a8)' }}>
            {s}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}

// ── Chip selector ────────────────────────────────────────────
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
      background: active ? 'var(--accent-9)' : 'var(--gray-a3)',
      color: active ? '#fff' : 'var(--gray-12)',
      fontWeight: 700, fontSize: 13.5,
    }}>
      {children}
    </button>
  );
}

// ── Main sell screen ─────────────────────────────────────────
export default function Sell() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [q, setQ] = useState('');
  const [card, setCard] = useState(null);
  const [graded, setGraded] = useState(false);
  const [grader, setGrader] = useState('psa');
  const [grade, setGrade] = useState(10);
  const [cond, setCond] = useState('Near Mint');
  const [photos, setPhotos] = useState([true, false, false, false]);
  const [listType, setListType] = useState('buynow');
  const [price, setPrice] = useState('');
  const [freeShip, setFreeShip] = useState(true);
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [days, setDays] = useState(7);

  const matches = CATALOG.filter(c =>
    !q || (c.name + ' ' + (setById(c.set)?.name || '')).toLowerCase().includes(q.toLowerCase())
  );
  const photoCount = photos.filter(Boolean).length;
  const gradeObj = graded ? { company: grader, grade } : { company: 'raw' };
  const suggested = card ? Math.round(card.market * (graded ? (grade >= 10 ? 1.6 : grade >= 9.5 ? 1.3 : 1.05) : 1)) : 0;
  const canNext = [!!card, true, photoCount >= 1, !!price && +price > 0, true][step];

  function reset() {
    setStep(0); setDone(false); setQ(''); setCard(null); setGraded(false);
    setGrade(10); setCond('Near Mint'); setPhotos([true, false, false, false]);
    setListType('buynow'); setPrice(''); setFreeShip(true);
  }

  // ── Success state ────────────────────────────────────────
  if (done) {
    return (
      <Flex direction="column" align="center" justify="center" p="6" style={{ minHeight: '70vh', textAlign: 'center' }}>
        <Flex align="center" justify="center" style={{
          width: 84, height: 84, borderRadius: 999, background: 'var(--green-a3)', color: 'var(--green-11)', marginBottom: 20,
        }}>
          <Check size={44} />
        </Flex>
        <Text as="div" size="6" weight="bold" style={{ letterSpacing: -0.5 }}>Your card is live!</Text>
        <Text as="p" size="3" color="gray" style={{ lineHeight: 1.5, marginTop: 10, maxWidth: 280 }}>
          {card.name} is now listed for {money(+price)}. We'll notify you when it sells or gets an offer.
        </Text>
        <Box mt="5"><CardArt item={{ ...card, grade: gradeObj }} w={110} /></Box>
        <button onClick={reset} style={{
          marginTop: 26, background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: '14px 28px', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>
          List another card
        </button>
        <button onClick={() => { reset(); navigate('/sell'); }} style={{
          marginTop: 10, background: 'none', border: 'none', color: 'var(--gray-a9)',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Back to selling
        </button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" style={{ minHeight: '100%' }}>
      {/* Header */}
      <Box pb="3" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--gray-a4)' }}>
        <Flex align="center" justify="between" px="4" pb="3" pt="2">
          <button onClick={() => step === 0 ? navigate('/sell') : setStep(step - 1)} style={{
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            fontWeight: 600, fontSize: 15,
          }}>
            <ArrowLeft size={18} /> {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <Text weight="bold" size="3">List a card</Text>
          <Text size="2" color="gray" style={{ width: 40, textAlign: 'right', fontFamily: 'var(--mono, monospace)' }}>{step + 1}/5</Text>
        </Flex>
        <Stepper step={step} />
      </Box>

      <Box style={{ flex: 1, overflow: 'auto', padding: '18px 16px 16px' }}>
        {/* STEP 0 -- pick card */}
        {step === 0 && (
          <Box>
            <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.4 }}>What are you selling?</Text>
            <Text as="p" size="2" color="gray" style={{ marginBottom: 14 }}>Search our catalog to auto-fill the card details.</Text>
            <Flex align="center" gap="2" p="3" mb="3" style={{
              background: 'var(--color-surface)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--gray-a4)',
            }}>
              <Search size={18} style={{ color: 'var(--gray-a8)' }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Charizard ex 151" autoFocus
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, minWidth: 0 }} />
            </Flex>
            <Flex direction="column" gap="2">
              {matches.map((c, i) => {
                const sel = card && card.name === c.name && card.number === c.number;
                return (
                  <button key={i} onClick={() => setCard(c)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', border: 'none', cursor: 'pointer',
                    background: 'var(--color-surface)', borderRadius: 12, padding: 10,
                    boxShadow: sel ? 'inset 0 0 0 2px var(--accent-9)' : '0 1px 3px rgba(20,24,40,0.05)',
                  }}>
                    <Box style={{ background: 'var(--gray-a3)', borderRadius: 9, padding: 6 }}><CardArt item={c} w={42} radius={5} /></Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text as="div" weight="bold" size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</Text>
                      <Text as="div" size="1" color="gray">{setById(c.set)?.name} -- {c.number}</Text>
                    </Box>
                    <Box style={{ textAlign: 'right' }}>
                      <Text as="div" size="1" color="gray">market</Text>
                      <Text as="div" weight="bold" size="2" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(c.market)}</Text>
                    </Box>
                    {sel && <Check size={18} style={{ color: 'var(--accent-9)' }} />}
                  </button>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* STEP 1 -- condition */}
        {step === 1 && (
          <Box>
            <Text as="div" size="5" weight="bold" mb="3" style={{ letterSpacing: -0.4 }}>Condition & grading</Text>
            <Flex align="center" justify="between" p="4" mb="4" style={{
              background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <Box>
                <Text as="div" weight="bold" size="3">Professionally graded</Text>
                <Text as="div" size="2" color="gray">In a PSA / BGS / CGC slab</Text>
              </Box>
              <Switch checked={graded} onCheckedChange={setGraded} size="3" />
            </Flex>

            {graded ? (
              <Box>
                <Text as="div" weight="bold" size="2" mb="2">Grading company</Text>
                <Flex gap="2" mb="4">
                  {['psa', 'bgs', 'cgc'].map(gr => (
                    <Chip key={gr} active={grader === gr} onClick={() => setGrader(gr)}>{gr.toUpperCase()}</Chip>
                  ))}
                </Flex>
                <Text as="div" weight="bold" size="2" mb="2">Grade</Text>
                <Flex gap="2" wrap="wrap">
                  {[10, 9.5, 9, 8.5, 8, 7].map(gv => (
                    <Chip key={gv} active={grade === gv} onClick={() => setGrade(gv)}>{gv}</Chip>
                  ))}
                </Flex>
                <Flex align="center" gap="2" mt="4" style={{ color: 'var(--green-11)', fontWeight: 600, fontSize: 13 }}>
                  <Shield size={15} /> Graded cards verified by Cardonomy sell ~40% faster.
                </Flex>
              </Box>
            ) : (
              <Box>
                <Text as="div" weight="bold" size="2" mb="2">Raw condition</Text>
                <Flex gap="2" wrap="wrap">
                  {['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'].map(c => (
                    <Chip key={c} active={cond === c} onClick={() => setCond(c)}>{c}</Chip>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>
        )}

        {/* STEP 2 -- photos */}
        {step === 2 && (
          <Box>
            <Text as="div" size="5" weight="bold" style={{ letterSpacing: -0.4 }}>Add photos</Text>
            <Text as="p" size="2" color="gray" mb="4">Front, back, and any flaws. Clear photos sell faster.</Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {photos.map((on, i) => (
                <button key={i} onClick={() => setPhotos(photos.map((p, j) => j === i ? !p : p))} style={{
                  aspectRatio: '1', borderRadius: 14, position: 'relative', overflow: 'hidden', border: 'none', cursor: 'pointer',
                  background: on ? (card?.art || 'var(--accent-9)') : 'var(--color-surface)',
                  boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--gray-a4)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: on ? '#fff' : 'var(--gray-a8)',
                }}>
                  {on ? (
                    <>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 8px, transparent 8px 16px)' }} />
                      <Text size="1" weight="bold" style={{ position: 'relative', fontFamily: 'var(--mono, monospace)', opacity: 0.9 }}>photo {i + 1}</Text>
                      <div style={{
                        position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999,
                        background: 'rgba(255,255,255,0.9)', color: card?.art || '#666',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                      }}>x</div>
                    </>
                  ) : (
                    <>
                      <Camera size={26} />
                      <Text size="1" weight="bold">{i === 0 ? 'Front' : i === 1 ? 'Back' : 'Add'}</Text>
                    </>
                  )}
                </button>
              ))}
            </div>
            <Text as="div" size="2" color="gray" mt="3" style={{ textAlign: 'center' }}>{photoCount} of 4 added</Text>
          </Box>
        )}

        {/* STEP 3 -- price */}
        {step === 3 && (
          <Box>
            <Text as="div" size="5" weight="bold" mb="3" style={{ letterSpacing: -0.4 }}>Set your price</Text>
            <Flex gap="2" mb="4">
              {[['buynow', Zap, 'Buy It Now', 'Fixed price'], ['auction', Tag, 'Auction', 'Let buyers bid']].map(([type, Icon, label, sub]) => (
                <button key={type} onClick={() => setListType(type)} style={{
                  flex: 1, padding: 14, borderRadius: 14, textAlign: 'left', border: 'none', cursor: 'pointer',
                  background: listType === type ? 'var(--accent-a3)' : 'var(--color-surface)',
                  boxShadow: listType === type ? 'inset 0 0 0 2px var(--accent-9)' : 'inset 0 0 0 1px var(--gray-a4)',
                }}>
                  <Box mb="1" style={{ color: listType === type ? 'var(--accent-9)' : 'var(--gray-a9)' }}><Icon size={18} /></Box>
                  <Text as="div" weight="bold" size="3">{label}</Text>
                  <Text as="div" size="1" color="gray">{sub}</Text>
                </button>
              ))}
            </Flex>

            <Text as="div" weight="bold" size="2" mb="2">{listType === 'auction' ? 'Starting bid' : 'Your price'}</Text>
            <Flex align="center" p="3" style={{
              background: 'var(--color-surface)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--gray-a4)',
            }}>
              <Text size="7" weight="bold" color="gray" mr="1" style={{ fontFamily: 'var(--mono, monospace)' }}>$</Text>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={String(suggested)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--mono, monospace)', fontWeight: 700, fontSize: 28, minWidth: 0 }} />
            </Flex>
            <button onClick={() => setPrice(String(suggested))} style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 'none', cursor: 'pointer',
              background: 'var(--accent-a3)', borderRadius: 12, padding: '11px 14px', textAlign: 'left',
            }}>
              <Tag size={16} style={{ color: 'var(--accent-9)' }} />
              <Text size="2" style={{ flex: 1 }}>Suggested: <Text weight="bold">{money(suggested)}</Text> based on recent {graded ? grader.toUpperCase() + ' ' + grade : 'raw'} sales</Text>
              <Text size="2" weight="bold" style={{ color: 'var(--accent-9)' }}>Use</Text>
            </button>

            {listType === 'auction' && (
              <Box mt="4">
                <Text as="div" weight="bold" size="2" mb="2">Duration</Text>
                <Flex gap="2">
                  {[3, 5, 7, 10].map(d => <Chip key={d} active={days === d} onClick={() => setDays(d)}>{d} days</Chip>)}
                </Flex>
              </Box>
            )}

            <Flex align="center" justify="between" p="4" mt="4" style={{
              background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <Text weight="bold" size="3">Offer free shipping</Text>
              <Switch checked={freeShip} onCheckedChange={setFreeShip} size="3" />
            </Flex>

            <Flex align="center" justify="between" p="4" mt="2" style={{
              background: 'var(--color-surface)', borderRadius: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
            }}>
              <Text weight="bold" size="3">Accept offers</Text>
              <Switch checked={acceptOffers} onCheckedChange={setAcceptOffers} size="3" />
            </Flex>
          </Box>
        )}

        {/* STEP 4 -- review */}
        {step === 4 && (
          <Box>
            <Text as="div" size="5" weight="bold" mb="3" style={{ letterSpacing: -0.4 }}>Review listing</Text>
            <Box p="4" style={{ background: 'var(--color-surface)', borderRadius: 16, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <Flex gap="3">
                <Box style={{ background: 'var(--gray-a3)', borderRadius: 10, padding: 8 }}>
                  <CardArt item={{ ...card, grade: gradeObj }} w={70} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text as="div" weight="bold" size="4">{card.name}</Text>
                  <Text as="div" size="2" color="gray">{setById(card.set)?.name} -- {card.number}</Text>
                  <Text as="div" weight="bold" size="6" mt="2" style={{ fontFamily: 'var(--mono, monospace)' }}>{money(+price)}</Text>
                </Box>
              </Flex>
              <Box mt="2">
                {[
                  ['Format', listType === 'auction' ? days + '-day auction' : 'Buy It Now'],
                  ['Condition', graded ? grader.toUpperCase() + ' ' + grade : cond],
                  ['Photos', photoCount + ' added'],
                  ['Shipping', freeShip ? 'Free (you pay)' : 'Buyer pays'],
                  ['Seller fee', money(+price * 0.10) + ' (10%)'],
                ].map(([k, v]) => (
                  <Flex key={k} justify="between" py="2" style={{ borderBottom: '1px solid var(--gray-a3)', fontSize: 14 }}>
                    <Text color="gray">{k}</Text><Text weight="bold">{v}</Text>
                  </Flex>
                ))}
                <Flex justify="between" align="baseline" pt="3">
                  <Text weight="bold" size="3">You earn</Text>
                  <Text weight="bold" size="5" style={{ fontFamily: 'var(--mono, monospace)', color: 'var(--green-11)' }}>
                    {money(+price * 0.90 + (freeShip ? -4 : 0))}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box p="4" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--gray-a4)' }}>
        <button onClick={() => step < 4 ? setStep(step + 1) : setDone(true)} disabled={!canNext} style={{
          width: '100%', background: 'var(--accent-9)', color: '#fff', borderRadius: 14,
          padding: 16, border: 'none', fontWeight: 700, fontSize: 16, cursor: canNext ? 'pointer' : 'default',
          opacity: canNext ? 1 : 0.45,
        }}>
          {step < 4 ? 'Continue' : 'List it for ' + (price ? money(+price) : '')}
        </button>
      </Box>
    </Flex>
  );
}
