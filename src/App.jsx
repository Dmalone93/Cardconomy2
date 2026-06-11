import { Container, Heading, Text } from '@radix-ui/themes';
import { AppProvider, useApp } from './context/AppContext';

function AppInner() {
  const { cartCount, prefs } = useApp();
  return (
    <Container size="2" p="4">
      <Heading size="6" mb="2">Cardconomy</Heading>
      <Text color="gray">Cart: {cartCount} items, Following {prefs.length} games</Text>
    </Container>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
