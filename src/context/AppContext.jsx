import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GAMES } from '../data/games';

const ALL_GAME_IDS = GAMES.map(g => g.id);

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch { return fallback; }
}

const DEFAULT_COLLECTIONS = [
  { id: 'c1', name: 'Main Binder', icon: '📒', cards: ['l03', 'l09', 'l02', 'l12'] },
  { id: 'c2', name: 'Graded Vault', icon: '🏆', cards: ['l07', 'l04'] },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [watch, setWatch] = useState(() => loadJSON('cc_watch', ['l03', 'l05']));
  const [bids, setBids] = useState(() => loadJSON('cc_bids', {}));
  const [cart, setCart] = useState(() => loadJSON('cc_cart', []));
  const [tier, setTier] = useState(() => loadJSON('cc_tier', 0));
  const [acct, setAcct] = useState(() => loadJSON('cc_acct', 'buyer'));
  const [prefs, setPrefs] = useState(() => loadJSON('cc_prefs', ALL_GAME_IDS));
  const [onboarded, setOnboarded] = useState(() => loadJSON('cc_onboarded', false));
  const [collections, setCollections] = useState(() => loadJSON('cc_collections', DEFAULT_COLLECTIONS));
  const [appearance, setAppearance] = useState(() => loadJSON('cc_theme', 'light'));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('cc_watch', JSON.stringify(watch)); }, [watch]);
  useEffect(() => { localStorage.setItem('cc_bids', JSON.stringify(bids)); }, [bids]);
  useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('cc_tier', JSON.stringify(tier)); }, [tier]);
  useEffect(() => { localStorage.setItem('cc_acct', JSON.stringify(acct)); }, [acct]);
  useEffect(() => { localStorage.setItem('cc_prefs', JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => { localStorage.setItem('cc_onboarded', JSON.stringify(onboarded)); }, [onboarded]);
  useEffect(() => { localStorage.setItem('cc_collections', JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem('cc_theme', JSON.stringify(appearance)); }, [appearance]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const isWatched = useCallback((id) => watch.includes(id), [watch]);
  const toggleWatch = useCallback((id) => {
    setWatch(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  }, []);

  const inPrefs = useCallback((gameId) => prefs.includes(gameId), [prefs]);
  const togglePref = useCallback((id) => {
    setPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }, []);
  const allGamesSelected = useCallback(() => prefs.length === ALL_GAME_IDS.length, [prefs]);

  const isVerified = useCallback(() => tier >= 1, [tier]);
  const isBidding = useCallback((id) => !!bids[id], [bids]);

  const addToCart = useCallback((id) => {
    setCart(c => c.includes(id) ? c : [...c, id]);
  }, []);
  const removeFromCart = useCallback((id) => {
    setCart(c => c.filter(x => x !== id));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const ownedIds = useCallback(() => {
    const ids = new Set();
    collections.forEach(c => c.cards.forEach(id => ids.add(id)));
    return ids;
  }, [collections]);

  const addCollection = useCallback((name) => {
    const id = 'c' + Date.now();
    setCollections(c => [...c, { id, name, icon: '📁', cards: [] }]);
  }, []);

  const renameCollection = useCallback((id, name) => {
    setCollections(cols => cols.map(c => c.id === id ? { ...c, name } : c));
  }, []);

  const deleteCollection = useCallback((id) => {
    setCollections(c => c.filter(x => x.id !== id));
  }, []);

  const addCardToCollection = useCallback((collId, cardId) => {
    setCollections(cols => cols.map(c =>
      c.id === collId && !c.cards.includes(cardId)
        ? { ...c, cards: [...c.cards, cardId] }
        : c
    ));
  }, []);

  const removeCardFromCollection = useCallback((collId, cardId) => {
    setCollections(cols => cols.map(c =>
      c.id === collId ? { ...c, cards: c.cards.filter(x => x !== cardId) } : c
    ));
  }, []);

  const finishOnboarding = useCallback(({ acct: a, prefs: p }) => {
    setAcct(a);
    setPrefs(p);
    setOnboarded(true);
  }, []);

  const placeBid = useCallback((id, amount) => {
    setBids(b => ({ ...b, [id]: amount }));
  }, []);

  const value = {
    watch, bids, cart, tier, acct, prefs, onboarded, collections, appearance, toast,
    setWatch, setBids, setCart, setTier, setAcct, setPrefs, setOnboarded, setCollections, setAppearance,
    showToast, isWatched, toggleWatch, inPrefs, togglePref, allGamesSelected,
    isVerified, isBidding, placeBid, addToCart, removeFromCart, clearCart,
    ownedIds, addCollection, renameCollection, deleteCollection, addCardToCollection, removeCardFromCollection,
    finishOnboarding,
    cartCount: cart.length,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
