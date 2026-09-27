import { Navigate, Outlet } from 'react-router-dom';
import type { AppRole } from '@/types';
import { useAuth } from '../hooks/useAuth';

/** Guard de ruta: exige al menos uno de los roles indicados. */
export function RoleGuard({ roles }: { roles: AppRole[] }) {
  const { hasRole } = useAuth();
  return hasRole(...roles) ? <Outlet /> : <Navigate to="/no-autorizado" replace />;
}
