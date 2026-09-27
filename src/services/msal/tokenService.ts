import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { apiScopes, loginRequest } from './msalConfig';
import { msalInstance } from './msalInstance';

/**
 * Obtiene un access token para la API desde la caché de MSAL (renovándolo si expiró).
 * Si se requiere interacción (consentimiento, MFA, sesión caducada) redirige al login.
 */
export async function acquireApiToken(scopes: string[] = apiScopes): Promise<string> {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  if (!account) {
    throw new Error('No hay una sesión activa');
  }
  try {
    const result = await msalInstance.acquireTokenSilent({ scopes, account });
    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ ...loginRequest, scopes, account });
    }
    throw error;
  }
}
