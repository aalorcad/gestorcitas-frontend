import { Link } from 'react-router-dom';
import { EmptyState } from '@/components';

export function NotFoundPage() {
  return (
    <div className="login-page">
      <EmptyState
        title="Página no encontrada"
        action={<Link className="link" to="/">Ir al inicio</Link>}
      />
    </div>
  );
}
