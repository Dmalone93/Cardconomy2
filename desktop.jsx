// ─────────────────────────────────────────────────────────────
// Cardonomy Desktop — shell, nav, routing, state
// ─────────────────────────────────────────────────────────────
const { T, money, CardArt, Icon, Logo } = window;
const { GAMES, SETS, LISTINGS, gameById } = window;
const { DHome, DSearch, DListing } = window;
const { DSell, DSellSingle, DSellBulk } = window;
const { DTrade, DStorefront, DShopDash, DSellerProfile } = window;

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

// ── top utility bar ──────────────────────────────────────────
function UtilityBar({ go }) {
  return (
    <div style={{ background: 'var(--fill)', color: '#fff', fontSize: 12.5, fontFamily: T.sans }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38 }}>
        <span style={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 7 }}>
          {Icon.shield({ width: 14, height: 14, style: { color: '#7fe7a4' } })} Buyer Protection on every order · Free returns on graded slabs
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="index.html" style={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}>{DIcon.phone()} Get the app</a>
          <button onClick={() => go('sell')} style={{ opacity: 0.85, color: '#fff' }}>Sell on Cardonomy</button>
          <span style={{ opacity: 0.85 }}>Help</span>
        </div>
      </div>
    </div>
  );
}

// ── header (logo, search, account, cart) ─────────────────────
function Header({ app, openMega, megaOpen }) {
  const [q, setQ] = React.useState('');
  const submit = (e) => { e.preventDefault(); app.go('search', { q }); };
  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 60 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 72 }}>
        <button onClick={() => app.go('home')} style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
          <Logo size={30} color="var(--ink)" />
          <img src="brand/wordmark.png" alt="CARDONOMY" style={{ height: 19, width: 'auto', display: 'block', filter: 'var(--logo-invert, none)' }} />
        </button>
        <form onSubmit={submit} style={{ flex: 1, maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
          borderRadius: 11, padding: '0 8px 0 14px', height: 46, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          {DIcon.search({ style: { color: 'var(--faint)', flexShrink: 0 } })}
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search 2M+ cards, sets, sealed product…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', minWidth: 0 }} />
          <button type="submit" style={{ background: 'var(--accent)', color: '#fff', borderRadius: 8, height: 34, padding: '0 18px', fontWeight: 700, fontSize: 14 }}>Search</button>
        </form>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <HeaderBtn icon={DIcon.heart()} label="Watching" onClick={() => app.go('watch')} count={app.watch.length} />
          <HeaderBtn icon={DIcon.user()} label="Account" onClick={() => app.toast('Account')} />
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
            <button key={g.id} onClick={() => app.go('search', { game: g.id })} style={{ padding: '0 13px', height: 46, color: 'var(--ink-2)' }}>{g.short}</button>
          ))}
          <span style={{ width: 1, height: 20, background: 'var(--line)', margin: '0 8px' }} />
          <button onClick={() => app.go('search', { type: 'auction' })} style={{ padding: '0 13px', height: 46, color: 'var(--ink-2)' }}>Auctions</button>
          <button onClick={() => app.go('search', { cond: 'Graded only' })} style={{ padding: '0 13px', height: 46, color: 'var(--ink-2)' }}>Graded</button>
          <button onClick={() => app.go('search', {})} style={{ padding: '0 13px', height: 46, color: 'var(--ink-2)' }}>Bulk lots</button>
          <button onClick={() => app.go('trade')} style={{ padding: '0 13px', height: 46, color: 'var(--ink-2)' }}>Trade</button>
          <button onClick={() => app.toast('Price guide')} style={{ marginLeft: 'auto', padding: '0 13px', height: 46, color: 'var(--accent)', fontWeight: 700 }}>Price Guide</button>
        </div>
      </div>
    </header>
  );
}

function HeaderBtn({ icon, label, onClick, count, accent }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '6px 12px',
      borderRadius: 10, color: accent ? 'var(--accent)' : 'var(--ink-2)', position: 'relative' }}>
      <span style={{ position: 'relative' }}>
        {icon}
        {count > 0 && <span style={{ position: 'absolute', top: -5, right: -8, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--down)', color: '#fff',
          fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</span>}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
    </button>
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
              <button onClick={() => { app.go('search', { game: g.id }); close(); }} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 11, height: 11, borderRadius: 999, background: g.tint }} />
                <span style={{ fontWeight: 800, fontSize: 15.5 }}>{g.name}</span>
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sets.length ? sets.map(s => (
                  <button key={s.id} onClick={() => { app.go('search', { game: g.id, set: s.id }); close(); }} style={{ textAlign: 'left', fontSize: 13.5, color: 'var(--muted)' }}>{s.name}</button>
                )) : <span style={{ fontSize: 13, color: 'var(--faint)' }}>Browse all →</span>}
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
    ['Buy', ['Browse all', 'Auctions', 'Graded slabs', 'Bulk lots', 'Price guide']],
    ['Sell', ['List a card', 'Sell to a shop', 'Trade cards', 'Seller fees', 'Bulk tools']],
    ['Local shops', ['Find a shop', 'Enroll your shop', 'The Vault', 'Trade hubs', 'Shop dashboard (demo)']],
    ['Company', ['About', 'Buyer Protection', 'Authentication', 'Help center']],
  ];
  return (
    <footer style={{ background: 'var(--fill)', color: '#fff', marginTop: 60 }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32, padding: '46px 24px 36px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <Logo size={26} color="#fff" /><img src="brand/wordmark.png" alt="CARDONOMY" style={{ height: 17, width: 'auto', display: 'block', filter: 'invert(1)' }} />
          </div>
          <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, maxWidth: 240 }}>The community marketplace for trading cards — buy, sell, and trade with collectors and local game shops.</p>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>{h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {items.map(i => <button key={i} onClick={() => {
                const r = { 'Find a shop': ['storefront', { shop: 'gnome' }], 'Enroll your shop': ['enroll'], 'The Vault': ['storefront', { shop: 'gnome' }], 'Trade hubs': ['trade'], 'List a card': ['sell_single'], 'Sell to a shop': ['sell'], 'Trade cards': ['trade'], 'Browse all': ['search', {}], 'Auctions': ['search', { type: 'auction' }], 'Graded slabs': ['search', { cond: 'Graded only' }], 'Bulk lots': ['search', {}], 'Shop dashboard (demo)': ['shop_dash'] }[i];
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
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const tRef = React.useRef(null);

  React.useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  React.useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('cc_bids', JSON.stringify(bids)); }, [bids]);

  const showToast = (m) => { setToast(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 1900); };

  const app = {
    route,
    go: (name, params = {}) => { setRoute({ name, params }); setMegaOpen(false); window.scrollTo(0, 0); },
    watch, cart, bids,
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
    placeBid: (item, amt) => { setBids(b => ({ ...b, [item.id]: amt })); setWatch(w => w.includes(item.id) ? w : [...w, item.id]); showToast("You're the high bidder! 🎉"); },
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
  else if (route.name === 'seller') Screen = DSellerProfile;

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
      <button onClick={() => { app.clearCart(); app.go('home'); }} style={{ marginTop: 22, background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 15 }}>Keep browsing</button>
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
            <button onClick={() => setDone(true)} style={{ width: '100%', background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: 15, fontWeight: 700, fontSize: 16 }}>Checkout</button>
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
          <button onClick={() => app.toast('Enrollment — coming soon')} style={{ background: '#fff', color: '#1f6e44', borderRadius: 12, padding: '15px 32px', fontWeight: 700, fontSize: 16 }}>Enroll your shop — free</button>
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
      <button onClick={() => app.go('home')} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '12px 26px', fontWeight: 700, fontSize: 15 }}>Browse cards</button>
    </div>
  );
}

Object.assign(window, { DIcon });
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
