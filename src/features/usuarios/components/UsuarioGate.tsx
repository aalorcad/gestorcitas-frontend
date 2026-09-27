import { Outlet } from 'react-router-dom';
import { Alert, Button, Spinner } from '@/components';
import { useAuth } from '@/features/auth';
import { getErrorMessage } from '@/utils';
import { useUsuarioActual } from '../hooks/useUsuarioActual';

/**
 * Tras el login sincroniza al usuario con ms-usuarios y bloquea el acceso
 * si la cuenta fue desactivada por un administrador.
 */
export function UsuarioGate() {
  const { data: usuario, isLoading, error, refetch } = useUsuarioActual();
  const { logout } = useAuth();

  if (isLoading) return <Spinner label="Preparando tu cuenta…" />;

  if (error) {
    return (
      <div className="gate">
        <Alert tone="error">No fue posible cargar tu cuenta: {getErrorMessage(error)}</Alert>
        <div className="inline">
          <Button onClick={() => refetch()}>Reintentar</Button>
          <Button variant="ghost" onClick={() => logout()}>Cerrar sesión</Button>
        </div>
      </div>
    );
  }

  if (usuario && !usuario.activo) {
    return (
      <div className="gate">
        <h2>Cuenta desactivada</h2>
        <p className="muted">
          Tu cuenta ({usuario.email}) fue desactivada por un administrador. Contacta a la clínica para reactivarla.
        </p>
        <Button variant="secondary" onClick={() => logout()}>Cerrar sesión</Button>
      </div>
    );
  }

  return <Outlet />;
}
