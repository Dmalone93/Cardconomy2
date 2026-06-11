// ─────────────────────────────────────────────────────────────
// LGS storefront + shop enrollment pitch (community pillar)
// ─────────────────────────────────────────────────────────────
const { T: TF, money: moneyF, Icon: IconF, CardArt: CardArtF, GradeChip: GradeChipF, Stars: StarsF } = window;
const { SHOPS: SHOPS_F, byId: byIdF, setById: setByIdF, gameById: gameByIdF, shopById: shopByIdF } = window;

const mf = (n) => moneyF(n, { cents: false });

// ── storefront ───────────────────────────────────────────────
function StorefrontScreen({ app, params = {} }) {
  const shop = shopByIdF(params.shop) || SHOPS_F[0];
  const inv = (shop.inventory || []).map(byIdF).filter(Boolean);
  const services = [
    shop.enrolled && ['Buylist intake', 'Sell your stack here', IconF.bolt, () => app.nav.push('sellshop')],
    shop.tradeHub && ['Trade hub', 'Meet & swap on neutral ground', IconF.shield, () => app.nav.push('trade')],
    shop.vault && ['Local vault', 'Store & trade graded cards', vaultIcon, () => app.toast('Vault: store cards at the shop')],
    shop.events && ['Events', 'Tournaments & trade nights', calIcon, () => app.toast('Upcoming: Friday trade night')],
  ].filter(Boolean);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
      {/* nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '52px 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconF.back({})}</button>
        <button onClick={() => app.toast('Following ' + shop.name)} style={{ height: 38, padding: '0 16px', borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, fontFamily: TF.sans, fontWeight: 700, fontSize: 13.5 }}>+ Follow</button>
      </div>

      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>
        {/* banner */}
        <div style={{ height: 150, background: 'linear-gradient(135deg, ' + shop.tint + ', ' + shop.tint + 'bb)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 14px, transparent 14px 28px)' }} />
        </div>

        {/* header card */}
        <div style={{ padding: '0 16px', marginTop: -36, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginBottom: 12 }}>
            <span style={{ width: 76, height: 76, borderRadius: 20, background: shop.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: TF.sans, fontWeight: 800, fontSize: 34, border: '3px solid ' + TF.surface, boxShadow: '0 4px 14px rgba(0,0,0,0.15)', flexShrink: 0 }}>{shop.initial}</span>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ margin: 0, fontFamily: TF.sans, fontWeight: 800, fontSize: 21, letterSpacing: -0.5 }}>{shop.name}</h1>
                {IconF.shield({ width: 16, height: 16, style: { color: shop.tint } })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontFamily: TF.sans, fontSize: 12.5, color: TF.muted }}>
                <StarsF rating={shop.rating * 20} /> {shop.rating} · {shop.reviews.toLocaleString()} reviews
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: TF.sans, fontSize: 12.5, color: TF.ink2, marginBottom: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>📍 {shop.loc} · {shop.dist} mi</span>
            <span style={{ color: 'var(--up)', fontWeight: 700 }}>● {shop.hours}</span>
          </div>
          <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.ink2, lineHeight: 1.5, margin: '0 0 16px' }}>{shop.blurb}</p>

          {/* primary CTAs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => app.nav.push('sellshop')} style={{ flex: 1, background: TF.accent, color: '#fff', borderRadius: 13, padding: 14, fontFamily: TF.sans, fontWeight: 700, fontSize: 14.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px oklch(0.52 0.2 264 / 0.3)' }}>{IconF.bolt({ width: 16, height: 16 })} Sell to shop</button>
            <button onClick={() => app.nav.push('trade')} style={{ flex: 1, background: TF.surface, color: TF.ink, borderRadius: 13, padding: 14, fontFamily: TF.sans, fontWeight: 700, fontSize: 14.5,
              boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>Trade here</button>
          </div>

          {/* services */}
          <div style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 16, marginBottom: 10 }}>What this shop offers</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {services.map(([title, sub, icon, onClick], i) => (
              <button key={i} onClick={onClick} style={{ textAlign: 'left', background: TF.surface, borderRadius: 14, padding: 13, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-wash)', color: TF.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>{icon({ width: 18, height: 18 })}</span>
                <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13.5 }}>{title}</div>
                <div style={{ fontFamily: TF.sans, fontSize: 11.5, color: TF.muted, lineHeight: 1.3, marginTop: 1 }}>{sub}</div>
              </button>
            ))}
          </div>

          {/* inventory */}
          {inv.length > 0 && (
            <React.Fragment>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 16 }}>In stock now</span>
                <button onClick={() => app.nav.push('search')} style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.accent }}>See all</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 8 }}>
                {inv.slice(0, 4).map(l => (
                  <button key={l.id} onClick={() => app.nav.push('listing', { id: l.id })} style={{ textAlign: 'left', background: TF.surface, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                    <div style={{ background: TF.surface2, padding: '12px 12px 6px', display: 'flex', justifyContent: 'center' }}><CardArtF item={l} w={86} /></div>
                    <div style={{ padding: '8px 11px 11px' }}>
                      <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{moneyF(l.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

function vaultIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/><path d="M12 8.5V6M19 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function calIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }

// ── shop enrollment pitch ────────────────────────────────────
function EnrollShopScreen({ app }) {
  const [done, setDone] = React.useState(false);
  const props = [
    [IconF.bolt, 'Free deal flow', 'Walk-in sellers scan a QR and submit their whole collection digitally — even when your counter is slammed.'],
    [storeIcon, 'Your own storefront', 'A branded page on Cardonomy with your inventory, hours, and reputation in front of local collectors.'],
    [vaultIcon, 'Be the local vault', 'Members store graded cards at your shop and trade them without shipping — recurring foot traffic and fees.'],
    [IconF.shield, 'Neutral trade hub', 'Collectors meet at your shop to settle trades safely. More visits, more sales at the counter.'],
    [IconF.tag, 'Pro seller tools', 'Buylist manager, instant price guide, and an offer composer — all built in. No extra software.'],
  ];

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg, alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconF.check({ width: 44, height: 44 })}</div>
        <h1 style={{ margin: '20px 0 6px', fontFamily: TF.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>Application received!</h1>
        <p style={{ fontFamily: TF.sans, fontSize: 14.5, color: TF.muted, lineHeight: 1.5, maxWidth: 290 }}>Our team will verify your shop within 2 business days and send your QR intake kit. Welcome to the network.</p>
        <button onClick={() => app.nav.push('storefront', { shop: 'gnome' })} style={{ marginTop: 24, background: TF.accent, color: '#fff', borderRadius: 14, padding: '14px 26px', fontFamily: TF.sans, fontWeight: 700, fontSize: 15.5 }}>Preview a storefront</button>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 10, color: TF.muted, fontFamily: TF.sans, fontWeight: 600, fontSize: 14 }}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '52px 12px 10px' }}>
        <button onClick={() => app.nav.pop()} style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--glass)', backdropFilter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IconF.back({})}</button>
      </div>
      <div className="noscroll" style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {/* hero */}
        <div style={{ color: '#fff', padding: '92px 22px 30px', position: 'relative', overflow: 'hidden', minHeight: 280 }}>
          <img src="content/enroll-hero.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-block', fontFamily: TF.sans, fontWeight: 700, fontSize: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: 4, padding: '5px 11px', marginBottom: 14 }}>FOR LOCAL GAME SHOPS</div>
            <h1 style={{ margin: 0, fontFamily: TF.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, lineHeight: 1.05, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Turn your shop into the local card hub</h1>
            <p style={{ fontFamily: TF.sans, fontSize: 15, opacity: 0.92, lineHeight: 1.5, margin: '12px 0 0', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Join the Cardonomy network — free deal flow, a storefront, and tools that bring collectors through your door.</p>
          </div>
        </div>

        {/* stat strip */}
        <div style={{ display: 'flex', gap: 10, padding: 16, marginTop: -2 }}>
          {[['$0', 'to enroll'], ['2 days', 'to go live'], ['9%', 'flat seller fee']].map(([v, k]) => (
            <div key={k} style={{ flex: 1, background: TF.surface, borderRadius: 13, padding: '12px 10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 18 }}>{v}</div>
              <div style={{ fontFamily: TF.sans, fontSize: 10.5, color: TF.muted }}>{k}</div>
            </div>
          ))}
        </div>

        {/* value props */}
        <div style={{ padding: '6px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {props.map(([icon, title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 13, background: TF.surface, borderRadius: 14, padding: 15, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'var(--accent-wash)', color: TF.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon({ width: 20, height: 20 })}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>{title}</div>
                <div style={{ fontFamily: TF.sans, fontSize: 13, color: TF.ink2, lineHeight: 1.45, marginTop: 2 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* testimonial */}
        <div style={{ margin: '16px 16px 0', background: 'var(--fill)', borderRadius: 16, padding: 18, color: '#fff' }}>
          <div style={{ fontFamily: TF.sans, fontSize: 15, lineHeight: 1.5, fontWeight: 500 }}>"The QR intake alone saved us hours every weekend. Sellers submit on their phone, we make offers when we get a sec — and they keep shopping while they wait."</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: '#2f8f5b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontWeight: 800, fontSize: 15 }}>G</span>
            <div>
              <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 13 }}>Sara — Gnome Games</div>
              <div style={{ fontFamily: TF.sans, fontSize: 11.5, opacity: 0.7 }}>Madison, WI · enrolled 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
        <button onClick={() => setDone(true)} style={{ width: '100%', background: '#2f8f5b', color: '#fff', borderRadius: 14, padding: 16, fontFamily: TF.sans, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px rgba(47,143,91,0.4)' }}>Enroll your shop — free</button>
      </div>
    </div>
  );
}

function storeIcon(p = {}) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>; }

Object.assign(window, { StorefrontScreen, EnrollShopScreen });
