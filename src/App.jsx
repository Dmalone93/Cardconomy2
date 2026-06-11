import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './screens/Home';
import Search from './screens/Search';
import Listing from './screens/Listing';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import SellHub from './screens/SellHub';
import Sell from './screens/Sell';
import SellBulk from './screens/SellBulk';
import SellShop from './screens/SellShop';
import Trade from './screens/Trade';
import ShopFinder from './screens/ShopFinder';
import Storefront from './screens/Storefront';
import Shop from './screens/Shop';
import Verify from './screens/Verify';
import AuthCard from './screens/AuthCard';
import Onboarding from './screens/Onboarding';
import Watchlist from './screens/Watchlist';
import Account from './screens/Account';

function Placeholder({ name }) {
  return <div style={{ padding: 24 }}><h2>{name}</h2><p>Coming soon...</p></div>;
}

function AppRoutes() {
  const { onboarded } = useApp();
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/sell" element={<SellHub />} />
          <Route path="/watch" element={<Watchlist />} />
          <Route path="/profile" element={<Account />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/sell/single" element={<Sell />} />
          <Route path="/sell/bulk" element={<SellBulk />} />
          <Route path="/sell/shop/:shopId?" element={<SellShop />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/shopfinder" element={<ShopFinder />} />
          <Route path="/storefront/:id" element={<Storefront />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/authcard/:id?" element={<AuthCard />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collection/:id" element={<Watchlist />} />
          <Route path="/account/:section" element={<Account />} />
        </Route>
      </Routes>
      {!onboarded && <Onboarding />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
