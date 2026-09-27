import type { PublicClientApplication } from '@azure/msal-browser';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { router } from './router';

export function App({ msalInstance }: { msalInstance: PublicClientApplication }) {
  return (
    <AppProviders msalInstance={msalInstance}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
