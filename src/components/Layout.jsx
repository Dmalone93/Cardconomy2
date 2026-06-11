import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Text, IconButton, Dialog, Button } from '@radix-ui/themes';
import { Home, Search, Tag, Eye, User, Menu, ShoppingCart, X, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'home', path: '/', label: 'Browse', icon: Home },
  { key: 'search', path: '/search', label: 'Search', icon: Search },
  { key: 'sell', path: '/sell', label: 'Sell', icon: Tag },
  { key: 'watch', path: '/watch', label: 'Watching', icon: Eye },
  { key: 'profile', path: '/profile', label: 'You', icon: User },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, toast } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isTabRoot = TABS.some(t => t.path === location.pathname);
  const activeTab = TABS.find(t => location.pathname === t.path)?.key;

  return (
    <Flex direction="column" style={{ height: '100dvh' }}>
      {/* Top bar */}
      <Flex align="center" justify="between" px="3" style={{ height: 52, borderBottom: '1px solid var(--gray-a4)', background: 'var(--color-surface)', flexShrink: 0 }}>
        <IconButton variant="ghost" size="2" onClick={() => isTabRoot ? setMenuOpen(true) : navigate(-1)}>
          {isTabRoot ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </IconButton>
        <Text size="3" weight="bold">Cardconomy</Text>
        <IconButton variant="ghost" size="2" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <Box style={{
              position: 'absolute', top: 2, right: 2,
              width: 16, height: 16, borderRadius: 999,
              background: 'var(--accent-9)', color: 'white',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {cartCount}
            </Box>
          )}
        </IconButton>
      </Flex>

      {/* Content */}
      <Box style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>

      {/* Bottom nav - tab roots only */}
      {isTabRoot && (
        <Flex align="center" justify="around" py="2" style={{ borderTop: '1px solid var(--gray-a4)', background: 'var(--color-surface)', flexShrink: 0 }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = tab.key === activeTab;
            return (
              <Flex key={tab.key} direction="column" align="center" gap="1" onClick={() => navigate(tab.path)} style={{ cursor: 'pointer', opacity: active ? 1 : 0.5 }}>
                <Icon size={20} />
                <Text size="1" weight={active ? 'bold' : 'regular'}>{tab.label}</Text>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* Side menu */}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Content style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 280, borderRadius: '0 12px 12px 0', margin: 0 }}>
          <Dialog.Title>Menu</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            {[
              { label: 'Browse', path: '/' },
              { label: 'Sell', path: '/sell' },
              { label: 'Trade', path: '/trade' },
              { label: 'Find a Shop', path: '/shopfinder' },
            ].map(item => (
              <Button key={item.path} variant="ghost" size="3" style={{ justifyContent: 'flex-start' }}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}>
                {item.label}
              </Button>
            ))}
          </Flex>
          <Dialog.Close>
            <IconButton variant="ghost" style={{ position: 'absolute', top: 16, right: 16 }}><X size={18} /></IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>

      {/* Toast */}
      {toast && (
        <Box style={{
          position: 'fixed', bottom: isTabRoot ? 80 : 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--gray-12)', color: 'var(--gray-1)',
          padding: '8px 20px', borderRadius: 999, fontSize: 14, fontWeight: 500,
          zIndex: 9999, whiteSpace: 'nowrap',
        }}>
          {toast}
        </Box>
      )}
    </Flex>
  );
}
