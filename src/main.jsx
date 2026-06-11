import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AppProvider, useApp } from './context/AppContext';
import App from './App';

function ThemedApp() {
  const { appearance } = useApp();
  return (
    <Theme accentColor="indigo" grayColor="slate" radius="medium" appearance={appearance}>
      <App />
    </Theme>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  </React.StrictMode>
);
