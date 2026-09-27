import { useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { acquireApiToken } from '@/services';
import { useAuthStore } from '@/stores';
import { AppRole } from '@/types';
import { decodeJwtPayload } from '@/utils';
import type { ApiAccessTokenClaims } from '../types';

const ROLES_VALIDOS = Object.values(AppRole) as string[];
const ROL_POR_DEFECTO = import.meta.env.VITE_DEFAULT_ROLE;

/**
 * Tras el login obtiene el access token de la API y extrae el claim "roles"
 * (App Roles asignados en Entra ID) para las pantallas y los guards.
 * La autorización real se vuelve a validar en API Gateway y en el BFF.
 */
export function useRolesSync(): void {
  const isAuthenticated = useIsAuthenticated();
  const setRoles = useAuthStore((s) => s.setRoles);
  const reset = useAuthStore((s) => s.reset);

  useEffect(() => {
    if (!isAuthenticated) {
      reset();
      return;
    }
    let cancelled = false;
    acquireApiToken()
      .then((token) => {
        const claims = decodeJwtPayload<ApiAccessTokenClaims>(token);
        let roles = (claims?.roles ?? []).filter((r): r is AppRole => ROLES_VALIDOS.includes(r));
        // Autoregistro (External ID): sin App Roles asignados -> rol por defecto (igual que el BFF)
        if (roles.length === 0 && ROL_POR_DEFECTO && ROLES_VALIDOS.includes(ROL_POR_DEFECTO)) {
          roles = [ROL_POR_DEFECTO as AppRole];
        }
        if (!cancelled) setRoles(roles);
      })
      .catch(() => {
        if (!cancelled) setRoles([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setRoles, reset]);
}
