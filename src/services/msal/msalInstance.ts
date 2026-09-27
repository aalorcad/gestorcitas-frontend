import { EventType, PublicClientApplication, type AuthenticationResult } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

/** Inicializa MSAL, procesa el retorno del redirect y fija la cuenta activa. */
export async function initializeMsal(): Promise<PublicClientApplication> {
  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise();

  const accounts = msalInstance.getAllAccounts();
  if (!msalInstance.getActiveAccount() && accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
      event.payload
    ) {
      const result = event.payload as AuthenticationResult;
      if (result.account) msalInstance.setActiveAccount(result.account);
    }
  });

  return msalInstance;
}
