import { create } from 'zustand';
import type { AppRole } from '@/types';

interface AuthState {
  roles: AppRole[];
  rolesLoaded: boolean;
  setRoles: (roles: AppRole[]) => void;
  reset: () => void;
}

/** Roles del usuario leídos del access token de la API (claim "roles"). */
export const useAuthStore = create<AuthState>((set) => ({
  roles: [],
  rolesLoaded: false,
  setRoles: (roles) => set({ roles, rolesLoaded: true }),
  reset: () => set({ roles: [], rolesLoaded: false }),
}));
