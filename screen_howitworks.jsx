// ─────────────────────────────────────────────────────────────
// How It Works + FAQ page
// ─────────────────────────────────────────────────────────────
const { T: THW, money: moneyHW } = window;

function HowItWorksScreen({ app }) {
  const [openFaq, setOpenFaq] = React.useState(null);

  const personas = [
    {
      id: 'buyer',
      label: 'Buyers & Collectors',
      color: 'var(--up)',
      icon: '\uD83D\uDCE6',
      tagline: 'Find your next grail',
      steps: [
        { num: '1', title: 'Search & discover', desc: 'Browse every game, filter by set, rarity, condition, or price. Check live market data and price history before you buy.' },
        { num: '2', title: 'Buy with confidence', desc: 'Every purchase is covered by Buyer Protection. Pay securely, track your order, and rate your experience.' },
        { num: '3', title: 'Build your collection', desc: 'Track what you own, watch prices, build want lists, and trade card-for-card with other collectors.' },
      ],
    },
    {
      id: 'seller',
      label: 'Individual Sellers',
      color: 'var(--accent)',
      icon: '\uD83D\uDCB0',
      tagline: 'List it, sell it, get paid',
      steps: [
        { num: '1', title: 'List in seconds', desc: 'Snap photos, set your price using our market data, and go live. Bulk scan to list hundreds of cards at once.' },
        { num: '2', title: 'Sell on your terms', desc: 'Accept offers, bundle shipping, and connect directly with buyers. Just 4% seller fee \u2014 the lowest in the market.' },
        { num: '3', title: 'Cash out fast', desc: 'Ship your cards, confirm delivery, and get your payout. Or sell directly to a local game shop for instant cash.' },
      ],
    },
    {
      id: 'store',
      label: 'Local Game Shops',
      color: 'var(--gold)',
      icon: '\uD83C\uDFEA',
      tagline: 'Your shop, online',
      steps: [
        { num: '1', title: 'Enrol your shop', desc: 'Set up your storefront in minutes. List your inventory, set grading policies, and define your buying preferences.' },
        { num: '2', title: 'Receive cards from sellers', desc: 'Local sellers submit cards to your shop for grading and resale. You set the terms, they bring the cards.' },
        { num: '3', title: 'Grow your reach', desc: 'Appear in the shop finder, build your reputation, and reach customers beyond your postcode. All for free during early access.' },
      ],
    },
  ];

  const faqs = [
    {
      q: 'What makes Cardconomy different from eBay or Cardmarket?',
      a: 'We connect three communities that other platforms ignore: buyers, individual sellers, and local game shops. Our LGS tools let shops receive cards from sellers, grade them, and resell \u2014 all in one platform. Plus, our 6% + 30p total fee is the lowest in the market, and we are built specifically for UK collectors.',
    },
    {
      q: 'Which games are supported?',
      a: 'We support all major TCGs: Pok\u00E9mon, Magic: The Gathering, Yu-Gi-Oh!, One Piece TCG, and Digimon Card Game. More games are added based on community demand.',
    },
    {
      q: 'How do fees work?',
      a: 'Sellers pay 4% on each sale. Buyers pay 2% + 30p per transaction. That is it \u2014 no hidden payment processing fees, no trustee charges, no surprise surcharges. Card payments are included. Our total take rate of 6% + 30p is lower than CardNexus (7.5%), Cardmarket (11%), and eBay (12.8%).',
    },
    {
      q: 'How does selling to a local game shop work?',
      a: 'Find a participating shop near you, select the cards you want to sell, and submit them through the app. The shop receives your cards, grades them, and pays you based on their buying rates. No shipping \u2014 just walk in and hand them over.',
    },
    {
      q: 'Can I trade cards instead of buying?',
      a: 'Yes. Cardconomy has a built-in trade system where you can propose card-for-card swaps with other users. Browse open trade posts, find someone who wants what you have, and make a proposal. No other major marketplace offers this.',
    },
    {
      q: 'Is there buyer protection?',
      a: 'Every purchase is covered. If a card never arrives, arrives damaged, or does not match the listing, you get a full refund. The buyer protection fee is included in the 2% + 30p buyer fee \u2014 no extra charges.',
    },
    {
      q: 'I run a game shop. Why should I join?',
      a: 'Cardconomy gives you a digital storefront, a stream of local sellers bringing cards to your counter, and visibility to every collector in your area. During early access, there are no shop fees. You set your own grading policies and buying rates.',
    },
    {
      q: 'Is there an app?',
      a: 'The mobile web app works on any phone browser right now. Native iOS and Android apps with card scanning are on the roadmap.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: THW.bg }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10, flexShrink: 0 }}>
        <div onClick={() => app.nav.pop()} style={{ cursor: 'pointer', padding: 4 }}>
          <span style={{ fontSize: 20 }}>{'\u2190'}</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: THW.ink }}>How It Works</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {/* ── Hero ── */}
      <div style={{ padding: '20px 14px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: THW.ink, lineHeight: 1.2, letterSpacing: -0.5 }}>
          One marketplace, three communities
        </div>
        <div style={{ fontSize: 14, color: THW.muted, marginTop: 10, lineHeight: 1.6, maxWidth: 340, margin: '10px auto 0' }}>
          Cardconomy bridges the gap between local game shops, individual sellers, and collectors. Everyone benefits when the whole community is connected.
        </div>
      </div>

      {/* ── Bridge diagram ── */}
      <div style={{ padding: '0 14px 24px' }}>
        <div style={{ background: THW.surface, borderRadius: 16, padding: '20px 16px',
          boxShadow: '0 1px 4px rgba(20,24,40,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: 16 }}>
            {personas.map(p => (
              <div key={p.id} style={{ flex: 1 }}>
                <div style={{ fontSize: 28 }}>{p.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: THW.ink, marginTop: 4 }}>{p.label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg, var(--up), var(--accent), var(--gold))', margin: '0 20px' }} />
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, fontWeight: 600, color: THW.accent }}>
            Connected on one platform
          </div>
        </div>
      </div>

      {/* ── Persona flows ── */}
      {personas.map(p => (
        <div key={p.id} style={{ padding: '0 14px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: THW.ink }}>{p.label}</div>
              <div style={{ fontSize: 13, color: THW.muted }}>{p.tagline}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {p.steps.map(s => (
              <div key={s.num} style={{ display: 'flex', gap: 12, background: THW.surface,
                borderRadius: 12, padding: '14px 14px', boxShadow: '0 1px 3px rgba(20,24,40,0.04)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: p.color,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: THW.ink }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: THW.muted, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── The Bridge section ── */}
      <div style={{ margin: '0 14px 24px', padding: '20px 16px', borderRadius: 14,
        background: THW.accent, color: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
          Why this matters
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.9 }}>
          Right now, if you want to sell cards in the UK you are stuck with eBay (12.8% fees), Cardmarket (EU-focused, euro-only), or Facebook groups (no protection). Local game shops have no way to reach online buyers. And traders have no platform at all.
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.9, marginTop: 10 }}>
          Cardconomy fixes this. A seller can list online, sell to a local shop, or trade \u2014 all from one app. A shop can accept walk-in cards and sell them to collectors nationwide. A buyer gets lower prices because sellers pay less in fees.
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.9, marginTop: 10, fontWeight: 700 }}>
          Everyone wins when the whole community is connected.
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ padding: '0 14px 30px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: THW.ink, marginBottom: 14 }}>
          Frequently asked questions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: THW.surface, borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(20,24,40,0.04)' }}>
              <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 14px', cursor: 'pointer', gap: 10,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: THW.ink, flex: 1 }}>{f.q}</div>
                <span style={{ fontSize: 18, color: THW.muted, flexShrink: 0,
                  transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 14px 14px', fontSize: 13, color: THW.muted, lineHeight: 1.6 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '0 14px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => app.nav.setTab('search')} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: THW.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Start browsing</button>
        <button onClick={() => app.nav.setTab('sell')} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: THW.surface, color: THW.accent, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          border: '1px solid var(--line)',
        }}>List a card for sale</button>
      </div>
      </div>{/* end scroll wrapper */}
    </div>
  );
}

window.HowItWorksScreen = HowItWorksScreen;
