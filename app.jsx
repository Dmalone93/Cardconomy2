// ─────────────────────────────────────────────────────────────
// Cardonomy — app shell, navigation, state
// ─────────────────────────────────────────────────────────────
const { IOSDevice } = window;
const { T: TA, BottomNav, Toast, SideMenu } = window;
const { HomeScreen, SearchScreen, ListingScreen, SellScreen, CheckoutScreen, WatchScreen, ProfileScreen, SellHubScreen, SellMarketScreen, SellBulkScreen, SellShopScreen, ShopScreen } = window;
const { BuylistScreen, PurchasesScreen, SellingScreen, OffersScreen, PaymentsScreen, NotificationsScreen } = window;
const { CollectionDetailScreen } = window;
const { TradeScreen, StorefrontScreen, EnrollShopScreen, ShopFinderScreen } = window;
const { CartScreen } = window;
const { ProductScreen } = window;
const { VerifyScreen } = window;
const { AuthCardScreen } = window;
const { Onboarding } = window;

const ALL_GAME_IDS = (window.GAMES || []).map(g => g.id);

const TAB_ROOT = {
  home: HomeScreen, search: SearchScreen, sell: SellHubScreen, watch: WatchScreen, profile: ProfileScreen,
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
  checkout: CheckoutScreen, watch: WatchScreen, profile: ProfileScreen,
  collection: CollectionDetailScreen,
  product: ProductScreen,
};

function loadWatch() {
  try { return JSON.parse(localStorage.getItem('cc_watch') || '["l03","l05"]'); } catch (e) { return []; }
}
function loadBids() {
  try { return JSON.parse(localStorage.getItem('cc_bids') || '{}'); } catch (e) { return {}; }
}
function loadCart() {
  try { return JSON.parse(localStorage.getItem('cc_cart') || '[]'); } catch (e) { return []; }
}
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
}
// seed collections (named buckets of owned cards)
const DEFAULT_COLLECTIONS = [
  { id: 'c1', name: 'Main Binder', icon: '📒', cards: ['l03', 'l09', 'l02', 'l12'] },
  { id: 'c2', name: 'Graded Vault', icon: '🏆', cards: ['l07', 'l04'] },
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
  const [stack, setStack] = React.useState(init && init.id ? [{ screen: init.screen, params: { id: init.id } }] : []); // [{screen, params}]
  const [watch, setWatch] = React.useState(loadWatch);
  const [bids, setBids] = React.useState(loadBids);
  const [cart, setCart] = React.useState(loadCart);
  const [tier, setTier] = React.useState(() => { try { return JSON.parse(localStorage.getItem('cc_tier') || '0'); } catch (e) { return 0; } });
  const [acct, setAcct] = React.useState(() => loadJSON('cc_acct', 'buyer')); // buyer | seller | store
  const [prefs, setPrefs] = React.useState(() => loadJSON('cc_prefs', ALL_GAME_IDS));
  const [onboarded, setOnboarded] = React.useState(() => loadJSON('cc_onboarded', false));
  const [collections, setCollections] = React.useState(() => loadJSON('cc_collections', DEFAULT_COLLECTIONS));
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [toast, setToastState] = React.useState(null);
  const toastTimer = React.useRef(null);

  React.useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  React.useEffect(() => { localStorage.setItem('cc_bids', JSON.stringify(bids)); }, [bids]);
  React.useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('cc_tier', JSON.stringify(tier)); }, [tier]);
  React.useEffect(() => { localStorage.setItem('cc_acct', JSON.stringify(acct)); }, [acct]);
  React.useEffect(() => { localStorage.setItem('cc_prefs', JSON.stringify(prefs)); }, [prefs]);
  React.useEffect(() => { localStorage.setItem('cc_onboarded', JSON.stringify(onboarded)); }, [onboarded]);
  React.useEffect(() => { localStorage.setItem('cc_collections', JSON.stringify(collections)); }, [collections]);

  function showToast(msg) {
    setToastState(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 1900);
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
    bids,
    isBidding: (id) => bids[id] != null,
    myBids: Object.keys(bids).map(id => ({ id, amount: bids[id] })),
    placeBid: (item, amount) => {
      setBids(b => ({ ...b, [item.id]: amount }));
      setWatch(w => w.includes(item.id) ? w : [...w, item.id]);
      showToast("You're the high bidder! \uD83C\uDF89");
    },
    toast: showToast,
    openMenu: () => setMenuOpen(true),
    cart,
    cartCount: cart.length,
    inCart: (id) => cart.includes(id),
    addToCart: (id) => setCart(c => { if (c.includes(id)) { showToast('Already in cart'); return c; } showToast('Added to cart \uD83D\uDED2'); return [...c, id]; }),
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

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: TA.bg, isolation: 'isolate' }}>
      <div key={viewKey} style={{ position: 'absolute', inset: 0 }}>
        <Comp app={app} params={params} />
      </div>
      {showNav && <BottomNav tab={tab} setTab={nav.setTab} watchCount={watch.length} />}
      <SideMenu app={app} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {!onboarded && Onboarding && <Onboarding app={app} games={window.GAMES || []} />}
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
    <IOSDevice>
      <ErrBoundary>
        <App />
      </ErrBoundary>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
if (window.__fitDevice) setTimeout(window.__fitDevice, 30);
