// ─────────────────────────────────────────────────────────────
// Sell hub — chooser: marketplace listing vs. sell to a local shop
// ─────────────────────────────────────────────────────────────
const { T: TH, Icon: IconH, money: moneyH, Badge } = window;
const { SHOP: SHOP_H } = window;

function BigChoice({ icon, tint, title, desc, meta, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', background: TH.surface, borderRadius: 20, padding: 18,
      boxShadow: '0 1px 3px rgba(20,24,40,0.05), 0 6px 18px rgba(20,24,40,0.05)', position: 'relative',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 52, height: 52, borderRadius: 15, background: tint, color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: TH.sans, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{title}</span>
            {badge && <Badge tone="accent">{badge}</Badge>}
          </div>
          {meta && <div style={{ fontFamily: TH.sans, fontSize: 12.5, color: TH.muted, marginTop: 2 }}>{meta}</div>}
        </div>
        {IconH.chevron({ style: { color: TH.faint, flexShrink: 0 } })}
      </div>
      <div style={{ fontFamily: TH.sans, fontSize: 13.5, color: TH.ink2, lineHeight: 1.45 }}>{desc}</div>
    </button>
  );
}

function SellHubScreen({ app }) {
  return (
    <div className="noscroll" style={{ height: '100%', overflow: 'auto', background: TH.bg, paddingBottom: 96 }}>
      <div style={{ padding: '14px 16px 18px', background: TH.surface, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <button onClick={() => app.openMenu()} style={{ color: TH.ink, padding: '2px 2px 2px 0', display: 'flex' }}>{IconH.menu({})}</button>
          <h1 style={{ margin: 0, fontFamily: TH.sans, fontWeight: 800, fontSize: 26, letterSpacing: -0.6 }}>Sell your cards</h1>
        </div>
        <p style={{ fontFamily: TH.sans, fontSize: 14.5, color: TH.muted, margin: 0, lineHeight: 1.45 }}>
          List individually to buyers worldwide, or sell a whole stack to a local shop in one go.
        </p>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {window.VerifyGate && <window.VerifyGate app={app} need={1} action="sell or trade" />}
        <BigChoice
          icon={IconH.tag({ width: 26, height: 26 })}
          tint={TH.accent}
          title="Sell on the marketplace"
          meta="One card or a whole stack · ships to buyer"
          desc="List to buyers worldwide. Add a single card, or bulk-scan a pile and price them all at once."
          onClick={() => app.nav.push('sell_market')}
        />
        <BigChoice
          icon={IconH.shield({ width: 26, height: 26 })}
          tint={SHOP_H.tint}
          title="Sell to a local shop"
          meta="Bulk-friendly · in-person · cash or store credit"
          badge="Fast for big lots"
          desc="Got hundreds of cards? Submit your whole collection from your phone, get an offer, and swap at the counter — no shipping."
          onClick={() => app.nav.push('sellshop')}
        />
        <BigChoice
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M7 9h10l-3-3M17 15H7l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          tint="var(--gold)"
          title="Trade with collectors"
          meta="Card-for-card · meet at a local shop"
          badge="No cash needed"
          desc="Swap cards directly with nearby collectors. We match your collection to their want lists and suggest a shop to meet at."
          onClick={() => app.nav.push('trade')}
        />

        {/* reassurance row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {[[IconH.bolt, 'Scan in minutes'], [IconH.shield, 'Verified shops'], [IconH.truck, 'No shipping hassle']].map(([ic, label], i) => (
            <div key={i} style={{ flex: 1, background: TH.surface, borderRadius: 13, padding: '12px 10px', textAlign: 'center',
              boxShadow: '0 1px 3px rgba(20,24,40,0.04)' }}>
              <div style={{ color: 'var(--ink)', display: 'flex', justifyContent: 'center', marginBottom: 5 }}>{ic({ width: 18, height: 18 })}</div>
              <div style={{ fontFamily: TH.sans, fontSize: 11, color: TH.ink2, fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* shop demo hint */}
        <button onClick={() => app.nav.push('shop')} style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10,
          background: 'transparent', border: '1.5px dashed var(--line)', borderRadius: 13, padding: '12px 14px', textAlign: 'left' }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: SHOP_H.tint, color: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: TH.sans, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{SHOP_H.initial}</span>
          <span style={{ flex: 1, fontFamily: TH.sans, fontSize: 12.5, color: TH.muted }}>
            <b style={{ color: TH.ink2 }}>Demo:</b> peek at the shop\'s counter view
          </span>
          {IconH.chevron({ style: { color: TH.faint } })}
        </button>

        {/* own a shop */}
        <button onClick={() => app.nav.push('enroll_shop')} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
          background: 'transparent', border: '1.5px dashed var(--line)', borderRadius: 13, padding: '12px 14px', textAlign: 'left' }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ flex: 1, fontFamily: TH.sans, fontSize: 12.5, color: TH.muted }}>
            <b style={{ color: TH.ink2 }}>Own a game shop?</b> List it on Cardonomy
          </span>
          {IconH.chevron({ style: { color: TH.faint } })}
        </button>
      </div>
    </div>
  );
}

// ── marketplace chooser: list one vs bulk scan ───────────────
function SellMarketScreen({ app }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TH.bg }}>
      <div style={{ padding: '14px 14px 14px', background: TH.surface, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => app.nav.pop()} style={{ color: TH.ink }}>{IconH.back({})}</button>
        <span style={{ fontFamily: TH.sans, fontWeight: 800, fontSize: 17 }}>Sell on the marketplace</span>
      </div>
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '18px 16px 30px' }}>
        <p style={{ fontFamily: TH.sans, fontSize: 14, color: TH.muted, margin: '0 0 16px', lineHeight: 1.45 }}>
          How many cards are you listing? Both ways reach buyers worldwide with Buyer Protection.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BigChoice
            icon={IconH.tag({ width: 26, height: 26 })}
            tint={TH.accent}
            title="List a single card"
            meta="Buy It Now or auction · full control"
            desc="Search the catalog, set condition, photos and price for one card. Best for high-value singles."
            onClick={() => app.nav.push('sell_single')}
          />
          <BigChoice
            icon={IconH.bolt({ width: 26, height: 26 })}
            tint="var(--gold)"
            title="Bulk list a stack"
            meta="Scan many · auto-priced at market"
            badge="Same scan as selling to a shop"
            desc="Flip through a pile with Live Sweep, then we auto-price every card at market value. Tweak any, publish them all in one go."
            onClick={() => app.nav.push('sellbulk')}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 16, background: TH.surface2, borderRadius: 12, padding: '12px 13px' }}>
          <span style={{ color: 'var(--ink)', marginTop: 1 }}>{IconH.bolt({ width: 16, height: 16 })}</span>
          <span style={{ fontFamily: TH.sans, fontSize: 12.5, color: TH.ink2, lineHeight: 1.45 }}>
            Bulk uses the <b>same Live Sweep scan</b> as selling to a shop — the difference is each card becomes its own marketplace listing instead of one offer.
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SellHubScreen, SellMarketScreen });
