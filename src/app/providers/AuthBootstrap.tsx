import { useRolesSync } from '@/features/auth';

/** Sincroniza los roles del access token con el store global. */
export function AuthBootstrap() {
  useRolesSync();
  return null;
}
