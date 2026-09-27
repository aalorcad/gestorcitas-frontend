import type { ReactNode } from 'react';
import type { AppRole } from '@/types';
import { useAuth } from '../hooks/useAuth';

/** Muestra su contenido solo si el usuario tiene alguno de los roles (para menús y botones). */
export function RequireRole({ roles, children }: { roles: AppRole[]; children: ReactNode }) {
  const { hasRole } = useAuth();
  return hasRole(...roles) ? <>{children}</> : null;
}
