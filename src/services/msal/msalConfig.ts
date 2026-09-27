import { LogLevel, type Configuration, type RedirectRequest } from '@azure/msal-browser';
import { API_BASE_URL, POST_LOGOUT_REDIRECT_URI, REDIRECT_URI } from '../config';

const env = import.meta.env;

/**
 * Authority:
 *  - Tenant workforce (empresa): https://login.microsoftonline.com/<Tenant ID>  (por defecto)
 *  - Entra External ID (clientes, con autoregistro): https://<subdominio>.ciamlogin.com/
 *    se define en VITE_ENTRA_AUTHORITY y se declara como knownAuthority.
 */
const authority = env.VITE_ENTRA_AUTHORITY || `https://login.microsoftonline.com/${env.VITE_ENTRA_TENANT_ID}`;
const knownAuthorities = env.VITE_ENTRA_AUTHORITY ? [new URL(env.VITE_ENTRA_AUTHORITY).host] : [];

/** true cuando el tenant permite que el usuario cree su propia cuenta (External ID). */
export const signUpEnabled = env.VITE_ENTRA_SIGNUP === 'true';

/**
 * Configuración MSAL (App Registration del FRONTEND tipo SPA).
 *  - Client ID  : Application (client) ID de la SPA
 *  - Authority  : ver arriba (workforce o External ID)
 *  - Redirect URI: debe estar registrada como plataforma "Single-page application"
 *    (por defecto el origen actual: http://localhost:5173 en desarrollo o la URL de API Gateway en AWS)
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: env.VITE_ENTRA_CLIENT_ID,
    authority,
    knownAuthorities,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(message);
        else if (level === LogLevel.Warning) console.warn(message);
      },
    },
  },
};

/** Scope delegado expuesto por la App Registration de la API. */
export const apiScopes: string[] = [env.VITE_API_SCOPE];

/** Se pide el scope de la API desde el login para obtener el consentimiento de una vez. */
export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email', ...apiScopes],
};

/** Registro (External ID): abre directamente la pantalla "Crear cuenta" del flujo de usuario. */
export const signUpRequest: RedirectRequest = {
  ...loginRequest,
  prompt: 'create',
};

/**
 * Equivalente al "protectedResourceMap" del MsalInterceptor de Angular:
 * a qué URLs se adjunta el Bearer token y con qué scopes.
 */
export const protectedResourceMap: Array<{ urlPrefix: string; scopes: string[] }> = [
  { urlPrefix: `${API_BASE_URL}/api/`, scopes: apiScopes },
];
