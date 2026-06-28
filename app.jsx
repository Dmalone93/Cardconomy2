// ─────────────────────────────────────────────────────────────
// Cardonomy — app shell, navigation, state
// ─────────────────────────────────────────────────────────────
const { IOSDevice } = window;
const { T: TA, BottomNav, Toast, SideMenu, Icon: IconA, Logo: LogoA } = window;
const { HomeScreen, SearchScreen, ListingScreen, SellScreen, CheckoutScreen, WatchScreen, DashboardScreen, SettingsScreen, SellHubScreen, SellMarketScreen, SellBulkScreen, SellShopScreen, ShopScreen } = window;
const { BuylistScreen, PurchasesScreen, SellingScreen, OffersScreen, PaymentsScreen, NotificationsScreen } = window;
const { CollectionDetailScreen } = window;
const { TradeScreen, StorefrontScreen, EnrollShopScreen, ShopFinderScreen } = window;
const { CartScreen } = window;
const { ProductScreen } = window;
const { SellerScreen } = window;
const { GameScreen } = window;
const { ScanScreen } = window;
const { VerifyScreen } = window;
const { AuthCardScreen } = window;
const { Onboarding } = window;
const { PackRip } = window;
const { FeesScreen, HowItWorksScreen } = window;
const { ChatScreen } = window;
const { TrackingScreen } = window;
const { DisputeScreen } = window;
const { SignInScreen, SignUpScreen, ForgotPasswordScreen } = window;
const { ShippingScreen } = window;
const { BatchListScreen } = window;
const { SellerPitchScreen, LGSPitchScreen } = window;
const { sellerByName: sellerByNameA, listingsBySeller: listingsBySellerA, byId: byIdA } = window;

const ALL_GAME_IDS = (window.GAMES || []).map(g => g.id);

const TAB_ROOT = {
  home: HomeScreen, search: SearchScreen, sell: SellHubScreen, watch: WatchScreen, profile: DashboardScreen,
};
const SCREENS = {
  home: HomeScreen, search: SearchScreen, listing: ListingScreen, sell: SellHubScreen,
  sell_market: SellMarketScreen, sell_single: SellScreen, sellbulk: SellBulkScreen,
  sellshop: SellShopScreen, shop: ShopScreen,
  buylist: BuylistScreen, purchases: PurchasesScreen, selling: SellingScreen,
  offers: OffersScreen, payments: PaymentsScreen, notifications: NotificationsScreen,
  trade: TradeScreen, storefront: StorefrontScreen, enroll_shop: EnrollShopScreen, shopfinder: ShopFinderScreen,
  cart: CartScreen,
  verify: VerifyScreen,
  authcard: AuthCardScreen,
  checkout: CheckoutScreen, watch: WatchScreen, profile: DashboardScreen,
  settings: SettingsScreen,
  collection: CollectionDetailScreen,
  product: ProductScreen,
  seller: SellerScreen,
  scan: ScanScreen,
  fees: FeesScreen,
  howitworks: HowItWorksScreen,
  chat: ChatScreen,
  tracking: TrackingScreen,
  dispute: DisputeScreen,
  signin: SignInScreen,
  signup: SignUpScreen,
  forgot_password: ForgotPasswordScreen,
  shipping: ShippingScreen,
  batchlist: BatchListScreen,
  pitch_seller: SellerPitchScreen,
  pitch_lgs: LGSPitchScreen,
  game: GameScreen,
};

function loadWatch() {
  try { return JSON.parse(localStorage.getItem('cc_watch') || '["l03","l05"]'); } catch (e) { return []; }
}
function loadCart() {
  try { return JSON.parse(localStorage.getItem('cc_cart') || '[]'); } catch (e) { return []; }
}
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
}
// seed collections (named buckets of owned cards)
const DEFAULT_COLLECTIONS = [
  { id: 'c1', name: 'Main Binder', icon: null, cards: ['l03', 'l09', 'l02', 'l12'] },
  { id: 'c2', name: 'Graded Vault', icon: null, cards: ['l07', 'l04'] },
];

function parseHash() {
  const h = (location.hash || '').replace(/^#/, '');
  if (!h) return null;
  const [screen, id] = h.split('/');
  return { screen, id };
}

function App() {
  const init = parseHash();
  const [tab, setTab] = React.useState(init && TAB_ROOT[init.screen] && !init.id ? init.screen : 'home');
  const [stack, setStack] = React.useState(init ? (init.id ? [{ screen: init.screen, params: { id: init.id } }] : (SCREENS[init.screen] ? [{ screen: init.screen, params: {} }] : [])) : []); // [{screen, params}]
  const [watch, setWatch] = React.useState(loadWatch);
  const [cart, setCart] = React.useState(loadCart);
  const [tier, setTier] = React.useState(() => { try { return JSON.parse(localStorage.getItem('cc_tier') || '0'); } catch (e) { return 0; } });
  const [acct, setAcct] = React.useState(() => loadJSON('cc_acct', 'buyer')); // buyer | seller | store
  const [prefs, setPrefs] = React.useState(() => loadJSON('cc_prefs', ALL_GAME_IDS));
  const [onboarded, setOnboarded] = React.useState(() => loadJSON('cc_onboarded', false));
  const [collections, setCollections] = React.useState(() => loadJSON('cc_collections', DEFAULT_COLLECTIONS));
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [packRipped, setPackRipped] = React.useState(() => { try { return sessionStorage.getItem('cc_pack_ripped') === '1'; } catch (e) { return true; } });
  const [toast, setToastState] = React.useState(null);
  const toastTimer = React.useRef(null);

  // ── hash-based deep linking ──
  // Update URL hash when navigation changes
  React.useEffect(() => {
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      const id = top.params && (top.params.id || top.params.name);
      location.hash = id ? top.screen + '/' + id : top.screen;
    } else {
      location.hash = tab === 'home' ? '' : tab;
    }
  }, [tab, stack]);

  // Listen for hash changes (back/forward, external links)
  React.useEffect(() => {
    function onHashChange() {
      var parsed = parseHash();
      if (!parsed) { setStack([]); setTab('home'); return; }
      // If it's a tab root, switch tab
      if (TAB_ROOT[parsed.screen] && !parsed.id) {
        setStack([]); setTab(parsed.screen); return;
      }
      // If it\'s a known screen, push it
      if (SCREENS[parsed.screen]) {
        var params = parsed.id ? { id: parsed.id } : {};
        setStack([{ screen: parsed.screen, params: params }]);
        setTab('home');
      }
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  React.useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  React.useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('cc_tier', JSON.stringify(tier)); }, [tier]);
  React.useEffect(() => { localStorage.setItem('cc_acct', JSON.stringify(acct)); }, [acct]);
  React.useEffect(() => { localStorage.setItem('cc_prefs', JSON.stringify(prefs)); }, [prefs]);
  React.useEffect(() => { localStorage.setItem('cc_onboarded', JSON.stringify(onboarded)); }, [onboarded]);
  React.useEffect(() => { localStorage.setItem('cc_collections', JSON.stringify(collections)); }, [collections]);

  function showToast(msg) {
    setToastState(msg);
    clearTimeout(toastTimer.current);
    const duration = (typeof msg === 'object' && msg.title) ? 4000 : 1900;
    toastTimer.current = setTimeout(() => setToastState(null), duration);
  }

  const nav = {
    tab,
    stackDepth: stack.length,
    push: (screen, params = {}) => setStack(s => [...s, { screen, params }]),
    pop: () => setStack(s => s.slice(0, -1)),
    setTab: (t) => { setStack([]); setTab(t); },
  };

  const app = {
    nav,
    watch,
    isWatched: (id) => watch.includes(id),
    toggleWatch: (id) => setWatch(w => {
      if (w.includes(id)) { showToast('Removed from Watching'); return w.filter(x => x !== id); }
      showToast('Saved to Watching ♥'); return [...w, id];
    }),
    startBuy: (item) => setStack(s => [...s, { screen: 'checkout', params: { id: item.id } }]),
    toast: showToast,
    openMenu: () => setMenuOpen(true),
    cart,
    cartCount: cart.length,
    inCart: (id) => cart.includes(id),
    addToCart: (id) => setCart(c => {
      if (c.includes(id)) { showToast('Already in cart'); return c; }
      const newCart = [...c, id];
      // upsell check
      const item = byIdA(id);
      const seller = item && sellerByNameA(item.seller);
      if (seller && seller.freeShipMin) {
        const sellerItems = newCart.map(byIdA).filter(Boolean).filter(x => x.seller === seller.name);
        const sellerTotal = sellerItems.reduce((s, x) => s + x.price, 0);
        const remaining = seller.freeShipMin - sellerTotal;
        const otherListings = listingsBySellerA(seller.name).filter(l => !newCart.includes(l.id));
        if (remaining > 0 && otherListings.length > 0) {
          showToast({
            title: 'Added to cart ✓',
            subtitle: 'Add £' + remaining.toFixed(2) + ' more from ' + seller.name + ' for free shipping',
            action: 'Browse →',
            onAction: () => nav.push('seller', { name: seller.name }),
          });
          return newCart;
        }
      }
      showToast('Added to cart');
      return newCart;
    }),
    removeFromCart: (id) => setCart(c => c.filter(x => x !== id)),
    clearCart: () => setCart([]),
    tier,
    setTier,
    isVerified: () => tier >= 1,
    // account type + game preferences
    acct,
    setAcct: (a) => { setAcct(a); },
    prefs,
    setPrefs,
    togglePref: (id) => setPrefs(p => p.includes(id) ? (p.length > 1 ? p.filter(x => x !== id) : p) : [...p, id]),
    allGamesSelected: () => prefs.length >= ALL_GAME_IDS.length,
    inPrefs: (gameId) => !prefs.length || prefs.includes(gameId),
    // collections (named buckets)
    collections,
    ownedIds: () => [...new Set(collections.flatMap(c => c.cards))],
    addCollection: (name) => { const id = 'c' + Date.now(); setCollections(cs => [...cs, { id, name: name || 'New collection', icon: '🃏', cards: [] }]); showToast('Collection created'); return id; },
    renameCollection: (id, name) => setCollections(cs => cs.map(c => c.id === id ? { ...c, name } : c)),
    deleteCollection: (id) => { setCollections(cs => cs.filter(c => c.id !== id)); showToast('Collection deleted'); },
    addCardToCollection: (cid, card) => setCollections(cs => cs.map(c => c.id === cid ? (c.cards.includes(card) ? c : { ...c, cards: [...c.cards, card] }) : c)),
    removeCardFromCollection: (cid, card) => setCollections(cs => cs.map(c => c.id === cid ? { ...c, cards: c.cards.filter(x => x !== card) } : c)),
    finishOnboarding: ({ acct, prefs }) => { if (acct) setAcct(acct); if (prefs && prefs.length) setPrefs(prefs); setOnboarded(true); },
  };

  // current view
  const top = stack[stack.length - 1];
  let Comp, params, viewKey;
  if (top) { Comp = SCREENS[top.screen]; params = top.params; viewKey = top.screen + stack.length; }
  else { Comp = TAB_ROOT[tab]; params = {}; viewKey = tab; }

  const showNav = stack.length === 0;

  const cartTotal = cart.map(byIdA).filter(Boolean).reduce((s, x) => s + x.price, 0);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: TA.bg, isolation: 'isolate', display: 'flex', flexDirection: 'column' }}>
      {/* ── Persistent top bar: hamburger | logo | cart ── */}
      <div style={{ flexShrink: 0, padding: '14px 16px 10px', background: TA.surface, borderBottom: '1px solid var(--line)', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button onClick={() => setMenuOpen(true)} style={{ color: TA.ink, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IconA.menu({})}</button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', lineHeight: 1 }}>
          <LogoA size={32} color={TA.ink} />
        </div>
        <button onClick={() => nav.push('cart')} style={{ position: 'relative', width: 38, height: 38, borderRadius: 999, background: TA.surface2, color: TA.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {IconA.cart({ width: 20, height: 20 })}
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 999, background: TA.accent, color: '#fff',
              fontFamily: TA.sans, fontWeight: 700, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxShadow: '0 0 0 2px var(--surface)' }}>{cart.length}</span>
          )}
        </button>
      </div>

      {/* ── Screen content ── */}
      <div key={viewKey} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Comp app={app} params={params} />
        </div>
      </div>
      {cart.length > 0 && (
        <button
          onClick={() => nav.push('cart')}
          style={{
            position: 'fixed', bottom: 66, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--ink)', color: '#fff',
            border: 'none', borderRadius: 999,
            padding: '8px 16px',
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--sans)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
            cursor: 'pointer', zIndex: 120,
            animation: 'ccPop 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {'\uD83D\uDED2'} {cart.length} · {'£'}{cartTotal.toFixed(2)}
        </button>
      )}
      <BottomNav tab={tab} setTab={nav.setTab} watchCount={watch.length} />
      <SideMenu app={app} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {!onboarded && Onboarding && <Onboarding app={app} games={window.GAMES || []} />}
      {!packRipped && PackRip && <PackRip onComplete={() => { setPackRipped(true); try { sessionStorage.setItem('cc_pack_ripped', '1'); } catch(e) {} }} />}
      <Toast msg={toast} />
    </div>
  );
}

class ErrBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('BOUNDARY', err, info); }
  render() {
    if (this.state.err) {
      return <div style={{ padding: 70, fontFamily: 'monospace', fontSize: 12, color: '#b00', whiteSpace: 'pre-wrap', overflow: 'auto', height: '100%' }}>
        {String(this.state.err && this.state.err.stack || this.state.err)}
      </div>;
    }
    return this.props.children;
  }
}

function Root() {
  return (
    <ErrBoundary>
      <App />
    </ErrBoundary>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
