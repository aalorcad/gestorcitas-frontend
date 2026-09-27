import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeMsal } from '@/services';
import { App } from '@/app/App';
import '@/app/styles/global.css';

// MSAL debe inicializarse (y procesar el redirect de login) antes de renderizar.
initializeMsal().then((msalInstance) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App msalInstance={msalInstance} />
    </React.StrictMode>,
  );
});
