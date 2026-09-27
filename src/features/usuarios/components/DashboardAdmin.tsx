import { Link } from 'react-router-dom';
import { Alert, Card, Spinner, StatTile } from '@/components';
import { getErrorMessage } from '@/utils';
import { useDashboardAdmin } from '../hooks/useAdminUsuarios';

function Barra({ label, valor, total, tone }: { label: string; valor: number; total: number; tone: string }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="bar">
      <div className="bar__head">
        <span>{label}</span>
        <span className="muted">{valor} · {pct}%</span>
      </div>
      <div className="bar__track">
        <div className={`bar__fill bar__fill--${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Indicadores agregados por el BFF desde ms-usuarios, ms-citas y ms-catalogo. */
export function DashboardAdmin() {
  const { data, isLoading, error } = useDashboardAdmin();

  if (isLoading) return <Spinner />;
  if (error) return <Alert tone="error">{getErrorMessage(error)}</Alert>;
  if (!data) return null;

  const { usuarios, citas } = data;

  return (
    <>
      <div className="stats">
        <StatTile label="Citas hoy" value={citas.hoy} tone="primary" />
        <StatTile label="Pendientes" value={citas.pendientes} tone="warning" hint="Esperando confirmación" />
        <StatTile label="Pacientes" value={usuarios.pacientes} />
        <StatTile label="Médicos activos" value={`${usuarios.medicosActivos}/${usuarios.medicos}`} tone="success" />
        <StatTile label="Especialidades activas" value={data.especialidadesActivas} />
        <StatTile label="Usuarios inactivos" value={usuarios.inactivos} tone={usuarios.inactivos ? 'danger' : 'default'} />
      </div>

      <div className="grid grid--2">
        <Card title="Citas por estado" subtitle={`${citas.total} citas registradas`} actions={<Link className="link" to="/admin/citas">Ver citas →</Link>}>
          <Barra label="Pendientes" valor={citas.pendientes} total={citas.total} tone="warning" />
          <Barra label="Confirmadas" valor={citas.confirmadas} total={citas.total} tone="info" />
          <Barra label="Atendidas" valor={citas.atendidas} total={citas.total} tone="success" />
          <Barra label="Canceladas" valor={citas.canceladas} total={citas.total} tone="danger" />
        </Card>
        <Card title="Usuarios por rol" subtitle={`${usuarios.totalUsuarios} usuarios`} actions={<Link className="link" to="/admin/usuarios">Gestionar →</Link>}>
          <Barra label="Pacientes" valor={usuarios.pacientes} total={usuarios.totalUsuarios} tone="info" />
          <Barra label="Médicos" valor={usuarios.medicos} total={usuarios.totalUsuarios} tone="success" />
          <Barra label="Administradores" valor={usuarios.administradores} total={usuarios.totalUsuarios} tone="warning" />
        </Card>
      </div>
    </>
  );
}
