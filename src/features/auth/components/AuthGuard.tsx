import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components';
import { useAuth } from '../hooks/useAuth';

/** Guard de ruta: exige sesión iniciada en Entra ID. */
export function AuthGuard() {
  const { isAuthenticated, isLoading, rolesLoaded } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner label="Verificando sesión…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!rolesLoaded) return <Spinner label="Cargando permisos…" />;

  return <Outlet />;
}
