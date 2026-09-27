import type { AppRole } from '@/types';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
}

/** Claims relevantes del access token emitido por Entra ID para la API. */
export interface ApiAccessTokenClaims {
  aud: string;
  iss: string;
  oid: string;
  scp?: string;
  roles?: string[];
  name?: string;
  preferred_username?: string;
}

/** Respuesta de GET /api/me (el BFF validó el token y devuelve sus claims). */
export interface Perfil {
  id: string;
  nombre: string;
  email: string;
  roles: AppRole[];
  scopes: string[];
  tenantId: string;
  issuer: string;
  audience: string[];
  expiraEn: string;
}
