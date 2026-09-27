import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { acquireApiToken, protectedResourceMap } from '@/services/msal';

/** Construye la URL final igual que Axios (baseURL + url) para compararla con el mapa. */
function buildFullUrl(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? '';
  if (/^https?:\/\//i.test(url) || !config.baseURL) return url;
  return `${config.baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
}

function resolveScopes(config: InternalAxiosRequestConfig): string[] | null {
  const url = buildFullUrl(config);
  const match = protectedResourceMap.find((r) => url.startsWith(r.urlPrefix));
  return match ? match.scopes : null;
}

/**
 * MsalInterceptor para Axios: adjunta "Authorization: Bearer <access_token>"
 * a toda petición dirigida a un recurso protegido (API Gateway).
 */
export function attachMsalInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(async (config) => {
    const scopes = resolveScopes(config);
    if (scopes) {
      const token = await acquireApiToken(scopes);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });
}
