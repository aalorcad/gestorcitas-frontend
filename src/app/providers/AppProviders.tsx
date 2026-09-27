import type { ReactNode } from 'react';
import type { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthBootstrap } from './AuthBootstrap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        return status !== undefined && status < 500 ? false : count < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

/** Proveedores globales: MSAL (Entra ID) + React Query. */
export function AppProviders({ msalInstance, children }: { msalInstance: PublicClientApplication; children: ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap />
        {children}
      </QueryClientProvider>
    </MsalProvider>
  );
}
