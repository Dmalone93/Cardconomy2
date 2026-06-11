import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance="light"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
