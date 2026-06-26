// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — shell, nav, routing, state
// ─────────────────────────────────────────────────────────────
const { T, money, CardArt, Icon, Logo } = window;
const { GAMES, SETS, LISTINGS, gameById } = window;
const { DHome, DSearch, DListing } = window;
const { DSell, DSellSingle, DSellBulk } = window;
const { DTrade, DStorefront, DShopDash } = window;

// ── icons specific to desktop ────────────────────────────────
const DIcon = {
  search: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  cart: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 4h2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.1a1.5 1.5 0 001.5-1.2L21 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor"/></svg>,
  heart: (p={}, f) => <svg width="22" height="22" viewBox="0 0 24 24" fill={f?'currentColor':'none'} {...p}><path d="M12 20s-7-4.5-7-9.5A4 4 0 0112 7a4 4 0 017 3.5C19 15.5 12 20 12 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  user: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  chevron: (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  phone: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="2"/><path d="M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

const MENU_GAMES = ['pkmn', 'mtg', 'ygo', 'lor'];

// ── category nav button with hover ───────────────────────────
function NavBtn({ onClick, children, style: extra = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: '0 13px', height: 46, color: hover ? 'var(--ink)' : 'var(--ink-2)',
        borderBottom: hover ? '2px solid var(--ink)' : '2px solid transparent',
        transition: 'color 0.15s, border-color 0.15s', ...extra }}>
      {children}
    </button>
  );
}

// ── top utility bar ──────────────────────────────────────────
function UtilityBar({ go }) {
  return (
    <div style={{ background: 'var(--fill)', color: '#fff', fontSize: 12.5, fontFamily: T.sans }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38 }}>
        <span style={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 7 }}>
          {Icon.shield({ width: 14, height: 14, style: { color: '#7fe7a4' } })} Buyer Protection on every order · 6% + 30p total fees · UK-based marketplace
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => go('howitworks')} style={{ opacity: 0.85, color: '#fff' }}>How it works</button>
          <button onClick={() => go('sell')} style={{ opacity: 0.85, color: '#fff' }}>Sell on Cardconomy</button>
          <button onClick={() => go('fees')} style={{ opacity: 0.85, color: '#fff' }}>Compare fees</button>
        </div>
      </div>
    </div>
  );
}

// ── header (logo, search, account, cart) ─────────────────────
function Header({ app, openMega, megaOpen }) {
  const [q, setQ] = React.useState('');
  const [sFocused, setSFocused] = React.useState(false);
  const submit = (e) => { e.preventDefault(); setSFocused(false); app.go('search', { q }); };
  const qLow = q.trim().toLowerCase();
  const sCards = qLow.length > 0 ? (window.LISTINGS || []).filter(c => c.name.toLowerCase().includes(qLow) || (c.subtitle || '').toLowerCase().includes(qLow)) : [];
  const sSeen = {};
  const sUnique = sCards.filter(c => { if (sSeen[c.name]) return false; sSeen[c.name] = true; return true; }).slice(0, 5);
  const sSets = qLow.length > 0 ? (window.SETS || []).filter(s => s.name.toLowerCase().includes(qLow)).slice(0, 3) : [];
  const sShow = sFocused && qLow.length > 0 && (sUnique.length > 0 || sSets.length > 0);
  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 60 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 72 }}>
        <button onClick={() => app.go('home')} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="brand/logo-wordmark.svg" alt="CARDCONOMY" style={{ height: 32, width: 'auto', display: 'block', filter: 'var(--logo-invert, none)' }} />
        </button>
        <form onSubmit={submit} style={{ flex: 1, maxWidth: 560, margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
          borderRadius: 11, padding: '0 8px 0 14px', height: 46, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          {DIcon.search({ style: { color: 'var(--faint)', flexShrink: 0 } })}
          <input value={q} onChange={e => setQ(e.target.value)} onFocus={() => setSFocused(true)} onBlur={() => setTimeout(() => setSFocused(false), 200)} placeholder="Search 2M+ cards, sets, sealed product\u2026"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', minWidth: 0 }} />
          <button type="submit" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 8, height: 34, padding: '0 18px', fontWeight: 700, fontSize: 14 }}>Search</button>
          {sShow && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: 'var(--surface)', borderRadius: 14, boxShadow: '0 8px 32px rgba(20,24,40,0.15)', border: '1px solid var(--line)', overflow: 'hidden', zIndex: 90 }}>
              {sUnique.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.4, padding: '12px 16px 4px' }}>CARDS</div>
                  {sUnique.map(c => (
                    <button key={c.id} onMouseDown={e => e.preventDefault()} onClick={() => { setQ(''); setSFocused(false); app.go('listing', { id: c.id }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', borderBottom: '1px solid var(--line-2)' }}>
                      <div style={{ width: 32, height: 44, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: 'var(--surface-2)' }}>
                        {window.CardArt && React.createElement(window.CardArt, { item: c, w: 32, radius: 4 })}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.subtitle || ''}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', flexShrink: 0 }}>{window.money ? window.money(c.price) : '\u00A3' + c.price}</div>
                    </button>
                  ))}
                </div>
              )}
              {sSets.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.4, padding: '12px 16px 4px' }}>SETS</div>
                  {sSets.map(s => (
                    <button key={s.id} onMouseDown={e => e.preventDefault()} onClick={() => { setQ(''); setSFocused(false); app.go('search', { set: s.id }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', borderBottom: '1px solid var(--line-2)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: (window.gameById ? (window.gameById(s.game) || {}) : {}).tint || 'var(--faint)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.total ? s.total + ' cards' : ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button onMouseDown={e => e.preventDefault()} onClick={submit} style={{ width: '100%', padding: '12px 16px', fontWeight: 700, fontSize: 13, color: 'var(--accent)', textAlign: 'center', borderTop: '1px solid var(--line-2)' }}>
                See all results for \u201c{q}\u201d
              </button>
            </div>
          )}
        </form>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <HeaderBtn icon={DIcon.heart()} label="Watching" onClick={() => app.go('watch')} count={app.watch.length} />
          <HeaderBtn icon={DIcon.user()} label="Account" onClick={() => app.go('account')} />
          <HeaderBtn icon={DIcon.cart()} label="Cart" onClick={() => app.go('cart')} count={app.cart.length} accent />
        </nav>
      </div>
      {/* category nav */}
      <div style={{ borderTop: '1px solid var(--line-2)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 4, height: 46, fontSize: 14.5, fontWeight: 600 }}>
          <button onMouseEnter={() => openMega(true)} onClick={() => openMega(!megaOpen)} style={{ display: 'flex', alignItems: 'center', gap: 7,
            padding: '0 14px', height: 46, color: megaOpen ? 'var(--accent)' : 'var(--ink)', fontWeight: 700 }}>
            ☰ Shop by game {DIcon.chevron({ style: { transform: megaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' } })}
          </button>
          {GAMES.slice(0, 4).map(g => (
            <NavBtn key={g.id} onClick={() => app.go('search', { game: g.id })}>{g.short}</NavBtn>
          ))}
          <span style={{ width: 1, height: 20, background: 'var(--line)', margin: '0 8px' }} />
          <NavBtn onClick={() => app.go('search', { cond: 'Graded only' })}>Graded</NavBtn>
          <NavBtn onClick={() => app.go('search', {})}>Bulk lots</NavBtn>
          <NavBtn onClick={() => app.go('trade')}>Trade</NavBtn>
          <NavBtn onClick={() => app.toast('Price Guide coming soon')} style={{ marginLeft: 'auto', color: 'var(--ink)', fontWeight: 700 }}>Price Guide</NavBtn>
        </div>
      </div>
    </header>
  );
}

function HeaderBtn({ icon, label, onClick, count, accent }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '6px 12px',
      borderRadius: 10, color: accent ? 'var(--ink)' : 'var(--ink-2)', position: 'relative' }}>
      <span style={{ position: 'relative' }}>
        {icon}
        {count > 0 && <span style={{ position: 'absolute', top: -5, right: -8, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--down)', color: '#fff',
          fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</span>}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

// ── mega menu item with hover ────────────────────────────────
function MegaGameBtn({ onClick, tint, name }) {
  var ref = React.useState(false), hover = ref[0], setHover = ref[1];
  return (
    <button onClick={onClick} onMouseEnter={function() { setHover(true); }} onMouseLeave={function() { setHover(false); }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '6px 8px', borderRadius: 8,
        background: hover ? 'var(--bg)' : 'transparent', transition: 'background 0.15s' }}>
      <span style={{ width: 11, height: 11, borderRadius: 999, background: tint }} />
      <span style={{ fontWeight: 800, fontSize: 15.5, color: hover ? 'var(--ink)' : 'var(--ink)' }}>{name}</span>
    </button>
  );
}
function MegaSetBtn({ onClick, name }) {
  var ref = React.useState(false), hover = ref[0], setHover = ref[1];
  return (
    <button onClick={onClick} onMouseEnter={function() { setHover(true); }} onMouseLeave={function() { setHover(false); }}
      style={{ textAlign: 'left', fontSize: 13.5, padding: '5px 8px', borderRadius: 6,
        color: hover ? 'var(--ink)' : 'var(--muted)', background: hover ? 'var(--bg)' : 'transparent',
        transition: 'color 0.15s, background 0.15s' }}>{name}</button>
  );
}

// ── mega menu (games + sets) ─────────────────────────────────
function MegaMenu({ app, open, close }) {
  if (!open) return null;
  return (
    <div onMouseLeave={close} style={{ position: 'absolute', left: 0, right: 0, top: '100%', background: 'var(--surface)',
      borderBottom: '1px solid var(--line)', boxShadow: '0 20px 40px rgba(20,24,40,0.12)', zIndex: 55, animation: 'dFade 0.15s ease' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '24px 24px 30px' }}>
        {GAMES.map(g => {
          const sets = SETS.filter(s => s.game === g.id);
          return (
            <div key={g.id}>
              <MegaGameBtn onClick={() => { app.go('search', { game: g.id }); close(); }} tint={g.tint} name={g.name} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sets.length ? sets.map(s => (
                  <MegaSetBtn key={s.id} onClick={() => { app.go('search', { game: g.id, set: s.id }); close(); }} name={s.name} />
                )) : <span style={{ fontSize: 13, color: 'var(--faint)', padding: '5px 8px' }}>Browse all →</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── footer ───────────────────────────────────────────────────
function Footer({ app }) {
  const cols = [
    ['Buy', ['Browse all', 'Graded slabs', 'Bulk lots', 'Price guide']],
    ['Sell', ['List a card', 'Sell to a shop', 'Trade cards', 'Seller fees', 'Bulk tools']],
    ['Local shops', ['Find a shop', 'Enroll your shop', 'The Vault', 'Trade hubs', 'Shop dashboard']],
    ['Company', ['About', 'How it works', 'Buyer Protection', 'Authentication', 'Help center']],
  ];
  return (
    <footer style={{ background: 'var(--fill)', color: '#fff', marginTop: 60 }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32, padding: '46px 24px 36px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <img src="brand/logo-wordmark.svg" alt="CARDCONOMY" style={{ height: 28, width: 'auto', display: 'block', filter: 'invert(1)' }} />
          </div>
          <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, maxWidth: 240 }}>The community marketplace for trading cards — buy, sell, and trade with collectors and local game shops.</p>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>{h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {items.map(i => <button key={i} onClick={() => {
                const r = { 'Find a shop': ['storefront', { shop: 'gnome' }], 'Enroll your shop': ['enroll'], 'The Vault': ['storefront', { shop: 'gnome' }], 'Trade hubs': ['trade'], 'List a card': ['sell_single'], 'Sell to a shop': ['sell'], 'Trade cards': ['trade'], 'Browse all': ['search', {}], 'Graded slabs': ['search', { cond: 'Graded only' }], 'Bulk lots': ['search', {}], 'Shop dashboard': ['shop_dash'], 'Seller fees': ['fees'], 'How it works': ['howitworks'] }[i];
                if (r) app.go(r[0], r[1] || {}); else app.toast(i);
              }} style={{ textAlign: 'left', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{i}</button>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 24px', fontSize: 12, opacity: 0.5 }}>
          <span>© 2026 Cardonomy. Prototype.</span>
          <span>Terms · Privacy · Cookies</span>
        </div>
      </div>
    </footer>
  );
}

// ── toast ────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: 'var(--fill)', color: '#fff',
    borderRadius: 12, padding: '13px 22px', fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'dFade 0.2s ease' }}>{msg}</div>;
}

// ── app shell ────────────────────────────────────────────────
function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }

function App() {
  const [route, setRoute] = React.useState({ name: 'home', params: {} });
  const [watch, setWatch] = React.useState(() => load('cc_watch', ['l03', 'l05']));
  const [cart, setCart] = React.useState(() => load('cc_cart', []));
  const [bids, setBids] = React.useState(() => load('cc_bids', {}));
  const [acct, setAcct] = React.useState(() => load('cc_acct', 'buyer'));
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const tRef = React.useRef(null);

  React.useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  React.useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('cc_bids', JSON.stringify(bids)); }, [bids]);
  React.useEffect(() => { localStorage.setItem('cc_acct', JSON.stringify(acct)); }, [acct]);

  const showToast = (m) => { setToast(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 1900); };

  const app = {
    route,
    go: (name, params = {}) => { setRoute({ name, params }); setMegaOpen(false); window.scrollTo(0, 0); },
    watch, cart, bids, acct, setAcct,
    isWatched: (id) => watch.includes(id),
    toggleWatch: (id) => setWatch(w => { if (w.includes(id)) { showToast('Removed from Watching'); return w.filter(x => x !== id); } showToast('Saved to Watching ♥'); return [...w, id]; }),
    inCart: (id) => cart.includes(id),
    addToCart: (id) => {
      if (cart.includes(id)) { showToast('Already in cart'); return; }
      setCart(c => [...c, id]);
      const item = window.byId(id);
      const seller = item && window.sellerByName(item.seller);
      if (seller && seller.freeShipMin) {
        const newCart = [...cart, id];
        const sellerItems = newCart.map(window.byId).filter(Boolean).filter(x => x.seller === seller.name);
        const sellerTotal = sellerItems.reduce((s, x) => s + x.price, 0);
        const remaining = seller.freeShipMin - sellerTotal;
        const otherListings = window.listingsBySeller(seller.name).filter(l => !newCart.includes(l.id));
        if (remaining > 0 && otherListings.length > 0) {
          showToast('Added to cart \u2014 add \u00a3' + remaining.toFixed(2) + ' more from ' + seller.name + ' for free shipping');
          return;
        }
      }
      showToast('Added to cart');
    },
    removeFromCart: (id) => setCart(c => c.filter(x => x !== id)),
    clearCart: () => setCart([]),
    isBidding: (id) => bids[id] != null,
    placeBid: (item, amt) => { setBids(b => ({ ...b, [item.id]: amt })); setWatch(w => w.includes(item.id) ? w : [...w, item.id]); showToast("You\u2019re the high bidder!"); },
    toast: showToast,
  };

  let Screen = DHome;
  if (route.name === 'search') Screen = DSearch;
  else if (route.name === 'listing') Screen = DListing;
  else if (route.name === 'watch') Screen = DWatch;
  else if (route.name === 'cart') Screen = DCart;
  else if (route.name === 'enroll') Screen = DEnroll;
  else if (route.name === 'sell') Screen = DSell;
  else if (route.name === 'sell_single') Screen = DSellSingle;
  else if (route.name === 'sell_bulk') Screen = DSellBulk;
  else if (route.name === 'trade') Screen = DTrade;
  else if (route.name === 'storefront') Screen = DStorefront;
  else if (route.name === 'shop_dash') Screen = DShopDash;
  else if (route.name === 'account') Screen = DAccount;
  else if (route.name === 'seller') Screen = window.DSellerProfile;
  else if (route.name === 'fees') Screen = DFees;
  else if (route.name === 'howitworks') Screen = DHowItWorks;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UtilityBar go={app.go} />
      <div style={{ position: 'relative' }}>
        <Header app={app} openMega={setMegaOpen} megaOpen={megaOpen} />
        <MegaMenu app={app} open={megaOpen} close={() => setMegaOpen(false)} />
      </div>
      <main style={{ flex: 1 }}>
        <Screen app={app} params={route.params} key={route.name + JSON.stringify(route.params)} />
      </main>
      <Footer app={app} />
      <Toast msg={toast} />
    </div>
  );
}

// ── how it works screen wrapper ──
function DHowItWorks({ app }) {
  const adaptedApp = Object.assign({}, app, {
    nav: { pop: () => app.go('home'), setTab: (tab) => app.go(tab), push: (s, p) => app.go(s, p) },
  });
  return (
    <div className="wrap" style={{ padding: '32px 24px', maxWidth: 720, margin: '0 auto' }}>
      {window.HowItWorksScreen ? React.createElement(window.HowItWorksScreen, { app: adaptedApp }) : null}
    </div>
  );
}

// ── fees screen wrapper (adapts mobile FeesScreen for desktop) ──
function DFees({ app }) {
  const adaptedApp = Object.assign({}, app, {
    nav: {
      pop: () => app.go('home'),
      setTab: (tab) => app.go(tab),
    },
  });
  return (
    <div className="wrap" style={{ padding: '32px 24px', maxWidth: 640, margin: '0 auto' }}>
      {window.FeesScreen ? React.createElement(window.FeesScreen, { app: adaptedApp }) : null}
    </div>
  );
}

// ── lightweight watch + cart + enroll screens (desktop) ──────
function DWatch({ app }) {
  const items = app.watch.map(window.byId).filter(Boolean);
  return (
    <div className="wrap" style={{ padding: '32px 24px 20px' }}>
      <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, margin: '0 0 6px' }}>Watching</h1>
      <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 24px' }}>{items.length} cards you're tracking.</p>
      {items.length === 0 ? <Empty label="Nothing saved yet" sub="Tap the heart on any card to track it here." app={app} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 18 }}>
          {items.map(it => <window.DCard key={it.id} item={it} app={app} />)}
        </div>
      )}
    </div>
  );
}

function renderSparkSVG(data, color, height) {
  var gradId = 'sg' + Math.random().toString(36).slice(2, 8);
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function(v, i) {
    var x = (i / (data.length - 1)) * 100;
    var y = 30 - ((v - min) / range) * 26 - 2;
    return x.toFixed(2) + ',' + y.toFixed(2);
  });
  var linePath = 'M' + pts.join(' L');
  var areaPath = linePath + ' L100,30 L0,30 Z';
  return (
    <svg width="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{ display: 'block', height: height || 36 }}>
      <style>{'@keyframes drawLine { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }'}</style>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={'url(#' + gradId + ')'} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
        style={{ strokeDasharray: 200, animation: 'drawLine 1.5s ease forwards' }} />
    </svg>
  );
}

// ── Seller dashboard (original DAccount code) ───────────────
function DAccountSeller({ app }) {
  var listings = window.LISTINGS || [];

  var balanceRanges = {
    '7d': [40, 55, 30, 84, 60, 72, 84],
    '30d': [120, 95, 140, 160, 180, 155, 190, 210, 195, 230, 248],
    '90d': [50, 65, 80, 95, 110, 130, 140, 120, 150, 170, 190, 210, 230, 248],
  };
  var rangeState = React.useState('7d');
  var balanceRange = rangeState[0];
  var setBalanceRange = rangeState[1];

  var activityData = [
    { dot: 'var(--up)', text: 'Sold Charizard EX', amt: '+\u00a384', time: '2 hours ago', cardId: 'l01' },
    { dot: 'var(--accent)', text: 'New offer on Dark Magician', amt: '\u00a342', time: '5 hours ago', cardId: 'l04' },
    { dot: 'var(--faint)', text: 'Order #1847 delivered', amt: null, time: '1 day ago', cardId: null },
    { dot: 'var(--up)', text: 'Trade completed with Jamie', amt: null, time: '1 day ago', cardId: null },
    { dot: 'var(--accent)', text: 'Listing viewed 12 times', amt: null, time: '2 days ago', cardId: null },
    { dot: 'var(--up)', text: 'Sold Moonbreon VMAX', amt: '+\u00a3156', time: '3 days ago', cardId: 'l05' },
    { dot: 'var(--faint)', text: 'Buylist match: Blue-Eyes', amt: null, time: '3 days ago', cardId: null },
    { dot: 'var(--accent)', text: 'New watcher on Pikachu EX', amt: null, time: '4 days ago', cardId: null },
  ];

  var openItems = [
    { color: '#3b82f6', wash: 'rgba(59,130,246,0.1)', label: '2 active listings', sub: '24 views \u00b7 3 watchers' },
    { color: '#f59e0b', wash: 'rgba(245,158,11,0.1)', label: '1 pending offer', sub: 'Dark Magician \u00b7 \u00a342 \u00b7 18h left' },
    { color: '#22c55e', wash: 'rgba(34,197,94,0.1)', label: '1 ready to ship', sub: 'Charizard EX \u00b7 Sam R.' },
    { color: '#8b5cf6', wash: 'rgba(139,92,246,0.1)', label: '3 purchases', sub: '1 in transit' },
  ];

  var topCards = listings.filter(function(l) { return l.art || l.img; }).slice(0, 3);

  var buylistMatches = [
    { name: 'Blue-Eyes White Dragon', max: 35, available: 28 },
    { name: 'Moonbreon VMAX', max: 140, available: 156 },
    { name: 'Pikachu EX', max: 22, available: 18 },
  ];

  var sectionLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--muted)', margin: '0 0 12px' };
  var cardStyle = { background: 'var(--surface)', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' };

  var pillBase = { padding: '4px 10px', borderRadius: 6, fontWeight: 600, fontSize: 11, border: 'none', cursor: 'pointer' };

  return (
    <div className="wrap" style={{ padding: '32px 24px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Needs attention */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={sectionLabel}>Needs attention</div>

            {/* Offer expiring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid #f59e0b',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Offer expiring soon</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Dark Magician {'\u00b7'} {money(42)} from @buyer_jane {'\u00b7'} 18h left</div>
              </div>
              <button onClick={function() { app.toast('Reviewing offer'); }} style={{ background: '#f59e0b', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Review</button>
            </div>

            {/* Ship order */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid #22c55e',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Ship your sold card</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Charizard EX to Sam R. {'\u00b7'} Sold 2h ago</div>
              </div>
              <button onClick={function() { app.toast('Printing label'); }} style={{ background: '#22c55e', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Print label</button>
            </div>

            {/* Buylist match */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid var(--accent)',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>2 buylist matches available</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Blue-Eyes White Dragon and Pikachu EX at your price</div>
              </div>
              <button onClick={function() { app.toast('Viewing buylist'); }} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>View</button>
            </div>
          </div>

          {/* Balance card */}
          <button onClick={function() { app.toast('Opening payments'); }} style={{
            background: 'linear-gradient(135deg, #16181d, #2a2d3a)', borderRadius: 18, padding: '24px 26px',
            textAlign: 'left', width: '100%', color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, opacity: 0.45, marginBottom: 6 }}>Available Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 32 }}>{money(248.47)}</span>
              <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 13 }}>{'\u25b2'} {money(84)} this week</span>
            </div>
            <div style={{ display: 'flex', gap: 6, margin: '12px 0 4px' }} onClick={function(e) { e.stopPropagation(); }}>
              {['7d', '30d', '90d'].map(function(r) {
                var sel = r === balanceRange;
                return (
                  <button key={r} onClick={function() { setBalanceRange(r); }} style={Object.assign({}, pillBase, {
                    background: sel ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: sel ? '#fff' : 'rgba(255,255,255,0.5)',
                  })}>{r}</button>
                );
              })}
            </div>
            <div style={{ margin: '6px 0 4px' }}>
              {renderSparkSVG(balanceRanges[balanceRange], '#4ade80', 36)}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }} onClick={function(e) { e.stopPropagation(); }}>
              <button onClick={function() { app.toast('Withdrawal initiated'); }} style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, padding: '10px 20px',
                fontWeight: 700, fontSize: 13, border: 'none',
              }}>Withdraw</button>
              <button onClick={function() { app.toast('Top up your balance to buy cards'); }} style={{
                background: 'rgba(99,102,241,0.8)', color: '#fff', borderRadius: 10, padding: '10px 20px',
                fontWeight: 700, fontSize: 13, border: 'none',
              }}>Top up</button>
            </div>
          </button>

          {/* Status tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { val: '2', label: 'Active listings', sub: '24 views \u00b7 3 watchers', color: 'var(--ink)' },
              { val: '1', label: 'Pending offers', sub: 'Respond \u2192', color: '#f59e0b' },
              { val: '1', label: 'To ship', sub: 'Print label \u2192', color: '#22c55e' },
            ].map(function(tile, i) {
              return (
                <button key={i} onClick={function() { app.go('account'); }} style={Object.assign({}, cardStyle, { textAlign: 'center', cursor: 'pointer', border: 'none' })}>
                  <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>{tile.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{tile.label}</div>
                  <div style={{ fontSize: 11, color: tile.color, fontWeight: 600, marginTop: 4 }}>{tile.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Open items list */}
          <div>
            <div style={sectionLabel}>Open Items</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {openItems.map(function(item, i) {
                return (
                  <button key={i} onClick={function() { app.go('account'); }} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    background: 'var(--surface)', borderRadius: 14, textAlign: 'left', width: '100%',
                    boxShadow: '0 1px 3px rgba(20,24,40,0.05)', border: 'none', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, background: item.wash,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <div style={{ width: 10, height: 10, borderRadius: 999, background: item.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{item.sub}</div>
                    </div>
                    <span style={{ color: 'var(--faint)', fontSize: 18 }}>{'\u203a'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Activity feed */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activityData.map(function(ev, i) {
                var item = ev.cardId ? window.byId(ev.cardId) : null;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                    borderBottom: i < activityData.length - 1 ? '1px solid var(--line-2)' : 'none',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: ev.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ev.time}</div>
                    </div>
                    {item && <CardArt item={item} w={28} />}
                    {ev.amt && <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 12, color: ev.amt.charAt(0) === '+' ? 'var(--up)' : 'var(--ink)', flexShrink: 0 }}>{ev.amt}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collection summary */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={Object.assign({}, sectionLabel, { margin: 0 })}>Collection</div>
              <button onClick={function() { app.go('watch'); }} style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>View all {'\u2192'}</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 26 }}>{money(2480)}</span>
              <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 11 }}>+12% this month</span>
            </div>
            <div style={{ margin: '8px 0 14px' }}>
              {renderSparkSVG([1800, 1950, 2100, 2200, 2150, 2350, 2480], '#6366f1', 28)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topCards.map(function(card) {
                return (
                  <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CardArt item={card} w={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                    </div>
                    <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 13 }}>{money(card.price)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buylist */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={Object.assign({}, sectionLabel, { margin: 0 })}>Buylist</div>
              <span style={{ background: 'var(--ink)', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 10 }}>2 matches</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {buylistMatches.map(function(m, i) {
                var isGood = m.available <= m.max;
                return (
                  <button key={i} onClick={function() { app.toast('Match: ' + m.name + ' available at your price'); }} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10, textAlign: 'left', width: '100%',
                    background: isGood ? 'rgba(34,197,94,0.06)' : 'var(--surface-2)',
                    border: isGood ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--line-2)',
                    cursor: 'pointer',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Your max: {money(m.max)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isGood ? 'var(--up)' : 'var(--ink)' }}>Available: {money(m.available)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Buyer / Collector dashboard ─────────────────────────────
function DAccountBuyer({ app }) {
  var listings = window.LISTINGS || [];
  var watchItems = listings.filter(function(l) { return l.art || l.img; }).slice(0, 5);

  var sectionLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--muted)', margin: '0 0 12px' };
  var cardStyle = { background: 'var(--surface)', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' };

  var watchDeltas = ['+4.2%', '-1.8%', '+7.1%', '-3.4%', '+2.6%'];

  var recentOrders = [
    { name: 'Charizard EX', seller: 'CardKing', status: 'Delivered', statusColor: '#22c55e', total: 84 },
    { name: 'Dark Magician', seller: 'TopDeck', status: 'Shipped', statusColor: '#3b82f6', total: 42 },
    { name: 'Pikachu EX', seller: 'PokeMart', status: 'Processing', statusColor: '#f59e0b', total: 18 },
  ];

  var buylistMatches = [
    { name: 'Blue-Eyes White Dragon', max: 35, available: 28 },
    { name: 'Moonbreon VMAX', max: 140, available: 156 },
    { name: 'Pikachu EX', max: 22, available: 18 },
  ];

  return (
    <div className="wrap" style={{ padding: '32px 24px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Portfolio value hero */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Portfolio Value</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 32 }}>{money(2480)}</span>
              <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 11 }}>+12% this month</span>
            </div>
            <div style={{ margin: '10px 0 14px' }}>
              {renderSparkSVG([1800, 1950, 2100, 2200, 2150, 2350, 2480], '#6366f1', 44)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>42 cards across 2 collections</div>
            <button onClick={function() { app.toast('View collection'); }} style={{
              background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--accent)',
              borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>View collection</button>
          </div>

          {/* Watchlist price movements */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={Object.assign({}, sectionLabel, { margin: 0 })}>Watching</div>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{watchItems.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {watchItems.map(function(card, i) {
                var delta = watchDeltas[i];
                var isUp = delta.charAt(0) === '+';
                return (
                  <button key={card.id} onClick={function() { app.go('listing', { id: card.id }); }} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', width: '100%',
                    borderBottom: i < watchItems.length - 1 ? '1px solid var(--line-2)' : 'none',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderBottomStyle: i < watchItems.length - 1 ? 'solid' : 'none',
                    borderBottomWidth: i < watchItems.length - 1 ? 1 : 0,
                    borderBottomColor: 'var(--line-2)',
                  }}>
                    <CardArt item={card} w={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{card.set || card.game || ''}</div>
                    </div>
                    <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{money(card.price)}</span>
                    <span style={{ fontWeight: 700, fontSize: 11, color: isUp ? 'var(--up)' : 'var(--down)', flexShrink: 0, minWidth: 44, textAlign: 'right' }}>{delta}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent purchases */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Recent Orders</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentOrders.map(function(order, i) {
                var mockItem = (listings.filter(function(l) { return l.art || l.img; }))[i] || listings[i];
                return (
                  <button key={i} onClick={function() { app.go('search'); }} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', width: '100%',
                    borderBottom: i < recentOrders.length - 1 ? '1px solid var(--line-2)' : 'none',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderBottomStyle: i < recentOrders.length - 1 ? 'solid' : 'none',
                    borderBottomWidth: i < recentOrders.length - 1 ? 1 : 0,
                    borderBottomColor: 'var(--line-2)',
                  }}>
                    {mockItem && <CardArt item={mockItem} w={36} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{order.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{order.seller}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontWeight: 600, fontSize: 10,
                      background: order.statusColor + '18', color: order.statusColor,
                    }}>{order.status}</span>
                    <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{money(order.total)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Needs attention */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Needs Attention</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { color: 'var(--ink)', title: '2 buylist matches at your price', sub: 'Blue-Eyes and Pikachu EX', btn: 'View' },
                { color: '#22c55e', title: 'Order arriving today', sub: 'Charizard EX from CardKing', btn: 'Track' },
                { color: '#f59e0b', title: 'Price drop on watched card', sub: 'Dark Magician down 8%', btn: 'View' },
              ].map(function(item, i) {
                var actions = [
                  function() { app.toast('Opening buylist'); app.go('account'); },
                  function() { app.toast('Tracking: your card is on the way'); },
                  function() { app.go('watch'); },
                ];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 12, borderLeft: '4px solid ' + item.color,
                    background: 'var(--surface-2)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <button onClick={actions[i]} style={{
                      background: item.color, color: '#fff', borderRadius: 8, padding: '8px 16px',
                      fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0, cursor: 'pointer',
                    }}>{item.btn}</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buylist matches */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={Object.assign({}, sectionLabel, { margin: 0 })}>Buylist</div>
              <span style={{ background: 'var(--ink)', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 10 }}>2 matches</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {buylistMatches.map(function(m, i) {
                var isGood = m.available <= m.max;
                return (
                  <button key={i} onClick={function() { app.toast('Match: ' + m.name + ' available at your price'); }} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10, textAlign: 'left', width: '100%',
                    background: isGood ? 'rgba(34,197,94,0.06)' : 'var(--surface-2)',
                    border: isGood ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--line-2)',
                    cursor: 'pointer',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Your max: {money(m.max)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isGood ? 'var(--up)' : 'var(--ink)' }}>Available: {money(m.available)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Store / LGS dashboard ───────────────────────────────────
function DAccountStore({ app }) {
  var revenueRanges = {
    today: [80, 120, 95, 200, 180, 250, 322],
    '7d': [820, 950, 1100, 780, 1247, 1050, 1180],
    '30d': [3200, 3800, 4100, 3600, 4500, 5200, 4800, 5100, 5400],
  };
  var rangeState = React.useState('today');
  var revenueRange = rangeState[0];
  var setRevenueRange = rangeState[1];

  var sectionLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--muted)', margin: '0 0 12px' };
  var cardStyle = { background: 'var(--surface)', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' };
  var pillBase = { padding: '4px 10px', borderRadius: 6, fontWeight: 600, fontSize: 11, border: 'none', cursor: 'pointer' };

  var submissions = [
    { init: 'J', name: 'Jordan M.', cards: '48 cards', time: '12 min ago', status: 'Grading', statusColor: '#3b82f6' },
    { init: 'S', name: 'Sam R.', cards: '64 cards', time: '18 min ago', status: 'New', statusColor: '#f59e0b' },
    { init: 'D', name: 'Dana P.', cards: '310 cards', time: '1 hr ago', status: 'Offer sent', statusColor: '#22c55e' },
    { init: 'M', name: 'Miguel A.', cards: '1,420 cards', time: '3 hr ago', status: 'Completed', statusColor: '#71757e' },
  ];

  var recentSales = [
    { desc: 'Charizard EX (NM)', amt: 84, time: '1h ago' },
    { desc: 'Pikachu EX lot (3x)', amt: 54, time: '2h ago' },
    { desc: 'Blue-Eyes White Dragon', amt: 28, time: '3h ago' },
    { desc: 'Sealed ETB - Paldea Evolved', amt: 200, time: '5h ago' },
    { desc: 'Dark Magician (LP)', amt: 15, time: 'yesterday' },
  ];

  return (
    <div className="wrap" style={{ padding: '32px 24px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Needs attention (standalone rows, not in a card) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={sectionLabel}>Needs Attention</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid #f59e0b',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>3 submissions pending review</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Jordan M., Sam R., Dana P.</div>
              </div>
              <button onClick={function() { app.toast('Opening submission queue'); app.go('account'); }} style={{ background: '#f59e0b', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Review</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid #22c55e',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>1 bulk lot ready to price</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Miguel A. - 1,420 cards</div>
              </div>
              <button onClick={function() { app.toast('Opening bulk lot pricing'); app.go('account'); }} style={{ background: '#22c55e', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Price</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 12, borderLeft: '4px solid var(--accent)',
              boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Buylist restock needed</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>5 high-demand cards below threshold</div>
              </div>
              <button onClick={function() { app.toast('Opening buylist restock'); app.go('account'); }} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, border: 'none', flexShrink: 0 }}>Restock</button>
            </div>
          </div>

          {/* Revenue card */}
          <button onClick={function() { app.toast('Revenue analytics would open here'); }} style={{
            background: 'linear-gradient(135deg, #16181d, #2a2d3a)', borderRadius: 18, padding: '24px 26px',
            textAlign: 'left', width: '100%', color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, opacity: 0.45, marginBottom: 6 }}>{"Today's Revenue"}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 32 }}>{money(1247)}</span>
              <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 13 }}>{'\u25b2'} 23% vs last week</span>
            </div>
            <div style={{ display: 'flex', gap: 6, margin: '12px 0 4px' }} onClick={function(e) { e.stopPropagation(); }}>
              {['today', '7d', '30d'].map(function(r) {
                var sel = r === revenueRange;
                return (
                  <button key={r} onClick={function() { setRevenueRange(r); }} style={Object.assign({}, pillBase, {
                    background: sel ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: sel ? '#fff' : 'rgba(255,255,255,0.5)',
                  })}>{r === 'today' ? 'Today' : r}</button>
                );
              })}
            </div>
            <div style={{ margin: '6px 0 4px' }}>
              {renderSparkSVG(revenueRanges[revenueRange], '#4ade80', 36)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 6, overflow: 'hidden', height: 8, marginTop: 14 }}>
              <div style={{ width: '62%', height: '100%', background: 'var(--accent)' }} />
              <div style={{ width: '38%', height: '100%', background: '#f59e0b' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, opacity: 0.6 }}>Walk-in 62%</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>Online 38%</span>
            </div>
          </button>

          {/* Queue stats tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { val: '4', label: 'Submissions pending', sub: '2 new today', color: 'var(--ink)' },
              { val: '1', label: 'Bulk lots', sub: '1,420 cards', color: 'var(--ink)' },
              { val: '12', label: 'Buylist hits', sub: 'today', color: 'var(--ink)' },
            ].map(function(tile, i) {
              return (
                <button key={i} onClick={function() { app.go('account'); }} style={Object.assign({}, cardStyle, { textAlign: 'center', cursor: 'pointer', border: 'none' })}>
                  <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>{tile.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{tile.label}</div>
                  <div style={{ fontSize: 11, color: tile.color, fontWeight: 600, marginTop: 4 }}>{tile.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Submission queue */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={Object.assign({}, sectionLabel, { margin: 0 })}>Submission Queue</div>
              <span style={{ background: 'var(--ink)', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 10 }}>4 active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {submissions.map(function(s, i) {
                return (
                  <button key={i} onClick={function() { app.toast('Opening ' + s.name + ' submission (' + s.cards + ')'); }} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', width: '100%',
                    borderBottom: i < submissions.length - 1 ? '1px solid var(--line-2)' : 'none',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderBottomStyle: i < submissions.length - 1 ? 'solid' : 'none',
                    borderBottomWidth: i < submissions.length - 1 ? 1 : 0,
                    borderBottomColor: 'var(--line-2)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 999, background: s.statusColor + '22',
                      color: s.statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>{s.init}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.cards} {'\u00b7'} {s.time}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontWeight: 600, fontSize: 10,
                      background: s.statusColor, color: '#fff',
                    }}>{s.status}</span>
                    <span style={{ color: 'var(--faint)', fontSize: 18 }}>{'\u203a'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buylist performance */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Buylist Performance</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 28, color: 'var(--ink)' }}>12</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>matched today</div>
              </div>
              <div style={{ width: 1, background: 'var(--line-2)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 28 }}>68%</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>avg buy rate</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--line-2)', margin: '0 0 12px' }} />
            <div style={Object.assign({}, sectionLabel, { fontSize: 9 })}>Low Stock</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Blue-Eyes White Dragon', stock: 'Out of stock', color: 'var(--down)' },
                { name: 'Charizard EX', stock: '1 left', color: '#f59e0b' },
                { name: 'Dark Magician', stock: '2 left', color: 'var(--muted)' },
              ].map(function(item, i) {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.stock}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent sales */}
          <div style={cardStyle}>
            <div style={sectionLabel}>Recent Sales</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentSales.map(function(sale, i) {
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                    borderBottom: i < recentSales.length - 1 ? '1px solid var(--line-2)' : 'none',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--up)', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{sale.desc}</div>
                    <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{money(sale.amt)}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>{sale.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Account screen — delegates by account type ──────────────
function DAccount({ app }) {
  if (app.acct === 'store') return <DAccountStore app={app} />;
  if (app.acct === 'seller') return <DAccountSeller app={app} />;
  return <DAccountBuyer app={app} />;
}

function DCart({ app }) {
  const [done, setDone] = React.useState(false);
  const items = app.cart.map(window.byId).filter(Boolean);
  const sub = items.reduce((s, c) => s + c.price, 0);
  const ship = items.length ? Math.max(...items.map(c => c.shipping || 0)) : 0;
  const prot = +(sub * 0.015 + (items.length ? 0.5 : 0)).toFixed(2);
  const total = +(sub + ship + prot).toFixed(2);
  if (done) return (
    <div className="wrap" style={{ padding: '70px 24px', textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'dPop 0.4s ease' }}>{Icon.check({ width: 44, height: 44 })}</div>
      <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 28, margin: '20px 0 6px' }}>Order confirmed</h1>
      <p style={{ color: 'var(--muted)', fontSize: 15 }}>{items.length} card(s) on the way · {money(total)}</p>
      <button onClick={() => { app.clearCart(); app.go('home'); }} style={{ marginTop: 22, background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 15 }}>Keep browsing</button>
    </div>
  );
  return (
    <div className="wrap" style={{ padding: '32px 24px 20px' }}>
      <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 30, letterSpacing: -0.8, margin: '0 0 24px' }}>Your cart</h1>
      {items.length === 0 ? <Empty label="Your cart is empty" sub="Add cards from any Buy It Now listing." app={app} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--surface)', borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
                <div style={{ background: 'var(--surface-2)', borderRadius: 9, padding: 8 }}><CardArt item={c} w={52} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{c.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{c.seller} · {c.shipping === 0 ? 'Free shipping' : money(c.shipping) + ' ship'}</div>
                </div>
                <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 17 }}>{money(c.price)}</div>
                <button onClick={() => app.removeFromCart(c.id)} style={{ color: 'var(--down)', fontSize: 13, fontWeight: 600 }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(20,24,40,0.05)', position: 'sticky', top: 130 }}>
            {[['Subtotal', money(sub)], ['Shipping', ship === 0 ? 'Free' : money(ship)], ['Buyer Protection', money(prot)]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 14, color: 'var(--ink-2)' }}><span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontFamily: T.mono, fontWeight: 600 }}>{v}</span></div>
            ))}
            <div style={{ height: 1, background: 'var(--line-2)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}><span style={{ fontWeight: 800, fontSize: 17 }}>Total</span><span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 24 }}>{money(total)}</span></div>
            <button onClick={() => setDone(true)} style={{ width: '100%', background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: 15, fontWeight: 700, fontSize: 16 }}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DEnroll({ app }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #2f8f5b, #1f6e44)', color: '#fff' }}>
        <div className="wrap" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 40, letterSpacing: -1.2, margin: '0 0 14px', maxWidth: 720, marginInline: 'auto', lineHeight: 1.05 }}>Turn your shop into the local card hub</h1>
          <p style={{ fontSize: 17, opacity: 0.92, maxWidth: 560, margin: '0 auto 26px', lineHeight: 1.5 }}>Free deal flow, a storefront, and tools that bring collectors through your door.</p>
          <button onClick={() => app.toast('Shop enrollment opens in the mobile app')} style={{ background: '#fff', color: '#1f6e44', borderRadius: 12, padding: '15px 32px', fontWeight: 700, fontSize: 16 }}>Enroll your shop — free</button>
        </div>
      </div>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, padding: '44px 24px' }}>
        {[['Free deal flow', 'Walk-in sellers submit their whole collection digitally — even when the counter is slammed.'],
          ['Be the local vault', 'Members store graded cards at your shop and trade them without shipping.'],
          ['Neutral trade hub', 'Collectors meet at your shop to settle trades safely — more foot traffic.']].map(([h, b]) => (
          <div key={h} style={{ background: 'var(--surface)', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{h}</div>
            <p style={{ color: 'var(--ink-2)', fontSize: 14.5, lineHeight: 1.5, margin: 0 }}>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({ label, sub, app }) {
  return (
    <div style={{ textAlign: 'center', padding: '70px 20px', background: 'var(--surface)', borderRadius: 18 }}>
      <h3 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 20, margin: 0 }}>{label}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '8px 0 18px' }}>{sub}</p>
      <button onClick={() => app.go('home')} style={{ background: 'var(--ink)', color: '#fff', borderRadius: 12, padding: '12px 26px', fontWeight: 700, fontSize: 15 }}>Browse cards</button>
    </div>
  );
}

Object.assign(window, { DIcon });
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
