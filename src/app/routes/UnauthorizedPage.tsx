import { Link } from 'react-router-dom';
import { EmptyState } from '@/components';

export function UnauthorizedPage() {
  return (
    <EmptyState
      title="Acceso no autorizado"
      description="Tu rol no permite ver esta sección."
      action={<Link className="link" to="/">Volver al inicio</Link>}
    />
  );
}
