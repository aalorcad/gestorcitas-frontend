import { Navigate } from 'react-router-dom';
import { EmptyState } from '@/components';
import { useAuth } from '@/features/auth';
import { AppRole } from '@/types';

/** Envía a cada usuario al inicio de su portal según su rol principal. */
export function HomeRedirect() {
  const { hasRole } = useAuth();

  if (hasRole(AppRole.Admin)) return <Navigate to="/admin" replace />;
  if (hasRole(AppRole.Medico)) return <Navigate to="/medico" replace />;
  if (hasRole(AppRole.Paciente)) return <Navigate to="/paciente" replace />;

  return (
    <EmptyState
      title="Tu cuenta no tiene un rol asignado"
      description="Pide a un administrador que te asigne Paciente, Medico o Admin en la aplicación empresarial gestorcitas-api de Entra ID y vuelve a iniciar sesión."
    />
  );
}
