import { useCallback, useMemo } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest, signUpRequest } from '@/services';
import { useAuthStore } from '@/stores';
import type { AppRole } from '@/types';
import type { AuthUser } from '../types';

/** Estado de autenticación, roles y acciones de login/logout. */
export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { roles, rolesLoaded, reset } = useAuthStore();

  const account = instance.getActiveAccount() ?? accounts[0] ?? null;

  const user: AuthUser | null = useMemo(
    () =>
      account
        ? {
            id: account.localAccountId,
            nombre: account.name ?? account.username,
            email: account.username,
          }
        : null,
    [account],
  );

  const login = useCallback(() => instance.loginRedirect(loginRequest), [instance]);
  const signUp = useCallback(() => instance.loginRedirect(signUpRequest), [instance]);

  const logout = useCallback(() => {
    reset();
    return instance.logoutRedirect({ account: account ?? undefined });
  }, [instance, account, reset]);

  const hasRole = useCallback((...required: AppRole[]) => required.some((r) => roles.includes(r)), [roles]);

  return {
    user,
    isAuthenticated,
    isLoading: inProgress !== InteractionStatus.None,
    roles,
    rolesLoaded,
    hasRole,
    login,
    signUp,
    logout,
  };
}
