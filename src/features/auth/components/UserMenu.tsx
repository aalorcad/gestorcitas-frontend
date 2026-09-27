import { Badge, Button } from '@/components';
import { useAuth } from '../hooks/useAuth';

export function UserMenu() {
  const { user, roles, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="user-menu">
      <div className="user-menu__info">
        <strong>{user.nombre}</strong>
        <span>
          {roles.length ? roles.map((r) => <Badge key={r} tone="info">{r}</Badge>) : <Badge tone="warning">Sin rol</Badge>}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => logout()}>
        Cerrar sesión
      </Button>
    </div>
  );
}
