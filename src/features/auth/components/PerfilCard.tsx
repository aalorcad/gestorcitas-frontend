import { Alert, Badge, Card, Spinner } from '@/components';
import { formatDateTime, getErrorMessage } from '@/utils';
import { usePerfil } from '../hooks/usePerfil';

/** Muestra los claims que el BFF leyó tras validar el token (demuestra la 2ª validación). */
export function PerfilCard() {
  const { data, isLoading, error } = usePerfil();

  if (isLoading) return <Spinner />;
  if (error) return <Alert tone="error">{getErrorMessage(error)}</Alert>;
  if (!data) return null;

  return (
    <Card title="Sesión y token" subtitle="Claims leídos por el BFF (Spring Security) tras validar el JWT de Entra ID">
      <dl className="dl">
        <dt>Nombre</dt>
        <dd>{data.nombre}</dd>
        <dt>Email</dt>
        <dd>{data.email}</dd>
        <dt>Object ID (oid)</dt>
        <dd><code>{data.id}</code></dd>
        <dt>Roles</dt>
        <dd>{data.roles.map((r) => <Badge key={r} tone="info">{r}</Badge>)}</dd>
        <dt>Scopes</dt>
        <dd>{data.scopes.join(', ')}</dd>
        <dt>Tenant</dt>
        <dd><code>{data.tenantId}</code></dd>
        <dt>Issuer</dt>
        <dd><code>{data.issuer}</code></dd>
        <dt>Audience</dt>
        <dd><code>{data.audience.join(', ')}</code></dd>
        <dt>Token expira</dt>
        <dd>{formatDateTime(data.expiraEn)}</dd>
      </dl>
    </Card>
  );
}
