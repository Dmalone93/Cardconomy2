import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './screens/Home';
import Search from './screens/Search';
import Listing from './screens/Listing';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';

function Placeholder({ name }) {
  return <div style={{ padding: 24 }}><h2>{name}</h2><p>Coming soon...</p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/sell" element={<Placeholder name="Sell Hub" />} />
            <Route path="/watch" element={<Placeholder name="Watching" />} />
            <Route path="/profile" element={<Placeholder name="Profile" />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/sell/single" element={<Placeholder name="Sell Single" />} />
            <Route path="/sell/bulk" element={<Placeholder name="Sell Bulk" />} />
            <Route path="/sell/shop/:shopId?" element={<Placeholder name="Sell to Shop" />} />
            <Route path="/trade" element={<Placeholder name="Trade" />} />
            <Route path="/shopfinder" element={<Placeholder name="Shop Finder" />} />
            <Route path="/storefront/:id" element={<Placeholder name="Storefront" />} />
            <Route path="/verify" element={<Placeholder name="Verify" />} />
            <Route path="/authcard/:id?" element={<Placeholder name="Auth Card" />} />
            <Route path="/shop" element={<Placeholder name="Shop Counter" />} />
            <Route path="/collection/:id" element={<Placeholder name="Collection" />} />
            <Route path="/account/:section" element={<Placeholder name="Account" />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
